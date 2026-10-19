/**
 * Debrief prompt 2 check (spec §15.5, Session R3). Prompt 2 says: "If every platform had held level 2, each
 * would have been worth more." The matching comparison is the COUNTERFACTUAL (§10): every firm at FEED 2 and
 * SAFEGUARDS 15, no cards and no codes, one equal per-firm value. This tool counts how often every firm's
 * final valuation is below that per-firm value, and how often the industry as a whole is.
 *
 *   npx tsx tools/prompt2-check.ts --seeds 200 --out reports/prompt2-check.md
 *
 * Read-only use of the engine; nothing here changes a mechanic or a parameter.
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { buildResults, createGame, PARAMS, resolveRound, type Decision, type EngineState, type FirmInit, type Params } from '../src/engine';
import { allOf, GREEDY, halfGreedy, mixedField, observedRoom, parseObserved } from './calibration/scenarios';

type Setups = ReturnType<typeof mixedField>;

function arg(name: string): string | null {
  const i = process.argv.indexOf(`--${name}`);
  return i >= 0 ? (process.argv[i + 1] ?? null) : null;
}

const seeds = Number(arg('seeds') ?? 200);
const outPath = arg('out') ?? 'reports/prompt2-check.md';
const p: Params = PARAMS;
const NS = [6, 10, 20, 40] as const;
const LENGTHS = [10, 12, 14] as const;

/** Plays `rounds` quarters with the full history kept (the counterfactual replays it), as `simulate` does otherwise. */
function play(seed: number, setups: Setups, rounds: number): EngineState {
  const firms: FirmInit[] = setups.map((s, i) => ({
    id: `f${i}`,
    ticker: `F${String(i).padStart(2, '0')}`,
    isBot: s.kind === 'bot',
    botPolicy: s.kind === 'bot' ? s.policy : null,
  }));
  let state = createGame(
    { label: 'P2', endMode: 'manual', minEnd: p.END_MIN, maxEnd: p.END_MAX, fixedEnd: null, disclosure: false, autoAuditP: 0 },
    firms,
    seed,
    p,
  );
  const decisions: Record<string, Decision> = {};
  setups.forEach((s, i) => {
    if (s.kind === 'fixed') decisions[`f${i}`] = s.d;
  });
  for (let r = 0; r < rounds; r++) {
    setups.forEach((s, i) => {
      if (s.kind === 'script') decisions[`f${i}`] = s.at(r, state, `f${i}`);
    });
    state = resolveRound(state, decisions, p).state;
  }
  return state;
}

interface Tally {
  sessions: number;
  everyFirmBelow: number;
  industryBelow: number;
  firms: number;
  firmsBelow: number;
}

const trajectories = parseObserved(JSON.parse(readFileSync('tools/calibration/observed-human.json', 'utf8')));
const FIELDS: ReadonlyArray<{ name: string; setups: (n: number, seed: number) => Setups }> = [
  { name: 'observed human', setups: (n, seed) => observedRoom(trajectories, seed, n) },
  { name: 'mixed bots', setups: (n) => mixedField(n) },
  { name: 'half greedy', setups: (n) => halfGreedy(n) },
  { name: 'all greedy', setups: (n) => allOf(n, GREEDY) },
];

const pct = (a: number, b: number): string => (b === 0 ? '—' : `${((a / b) * 100).toFixed(1)}%`);
const L: string[] = [
  '# Debrief prompt 2 check',
  '',
  `Prompt 2 claims each firm would have been worth more if every platform had held FEED 2. For each run, the final valuation of every firm is compared with the COUNTERFACTUAL per-firm value (FEED 2, SAFEGUARDS 15, no cards, no codes; same seed and incident draws). ${seeds} seeds per cell; transparency off; no audits; the game length is fixed per column (the live game ends at a hidden quarter from ${p.END_MIN} to ${p.END_MAX}). "Observed human" draws firm trajectories from the four live FRONTIER sessions in \`tools/calibration/observed-human.json\`.`,
  '',
  'Each cell: share of sessions in which **every** firm finished below the per-firm counterfactual value · share of sessions in which the industry total did · share of all firms below.',
  '',
  `| Field | N | ${LENGTHS.map((q) => `${q} quarters`).join(' | ')} |`,
  `|---|---|${LENGTHS.map(() => '---').join('|')}|`,
];
const totals = new Map<number, Tally>(LENGTHS.map((q) => [q, { sessions: 0, everyFirmBelow: 0, industryBelow: 0, firms: 0, firmsBelow: 0 }]));
for (const field of FIELDS) {
  for (const n of NS) {
    const cells: string[] = [];
    for (const q of LENGTHS) {
      const t: Tally = { sessions: 0, everyFirmBelow: 0, industryBelow: 0, firms: 0, firmsBelow: 0 };
      for (let seed = 1; seed <= seeds; seed++) {
        const r = buildResults(play(seed, field.setups(n, seed), q), { revealTau: false }, p);
        const firms = Object.values(r.final);
        const below = firms.filter((f) => f.valuation < f.counterfactual).length;
        t.sessions++;
        t.firms += firms.length;
        t.firmsBelow += below;
        if (below === firms.length) t.everyFirmBelow++;
        if (r.industry.actual < r.industry.counterfactual) t.industryBelow++;
      }
      const all = totals.get(q)!;
      for (const k of Object.keys(t) as Array<keyof Tally>) all[k] += t[k];
      cells.push(`${pct(t.everyFirmBelow, t.sessions)} · ${pct(t.industryBelow, t.sessions)} · ${pct(t.firmsBelow, t.firms)}`);
    }
    L.push(`| ${field.name} | ${n} | ${cells.join(' | ')} |`);
    console.log(`${field.name} N=${n}: ${cells.join('  ')}`);
  }
}
L.push(`| **all cells** | | ${LENGTHS.map((q) => {
  const t = totals.get(q)!;
  return `${pct(t.everyFirmBelow, t.sessions)} · ${pct(t.industryBelow, t.sessions)} · ${pct(t.firmsBelow, t.firms)}`;
}).join(' | ')} |`);
L.push('');
writeFileSync(outPath, L.join('\n'));
console.log(`wrote ${outPath}`);
