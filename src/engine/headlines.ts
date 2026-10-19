/**
 * Wire headline template engine (spec §6.3 step 15, §15.4).
 * Fictional entities only: Office of Platform Safety (OPS), the Assembly, Halden Research.
 * Every template must pass the copy rules; only the crackdown (moratorium) headline may say "collapse".
 * Harm stories are reported as leaks, testimony and investigations, never as established findings.
 */
import type { Params } from './params';
import type { Rng } from './rng';
import type { AuditResult, Card, Headline, HeadlineKind } from './types';

export const MORATORIUM_HEADLINE = 'Assembly suspends under-16 accounts on every platform; ad market collapse follows';

export type TemplateKey =
  | Exclude<HeadlineKind, 'trust-band' | 'breach' | 'pace4'>
  | 'band0'
  | 'band1'
  | 'band2'
  | 'band3'
  | 'band4'
  | 'band5'
  | 'breach'
  | 'breach-waived'
  | 'breach-expelled'
  | 'pace4-named'
  | 'pace4-anon';

/**
 * Display label for a stored pact name in headlines: `PACT-A` reads `YDC-A` (spec §5.0). The stored name
 * never changes (§9.1). `pactLabel` in src/ui/vocab.ts uses this function.
 */
export function codeLabel(name: string): string {
  return name.replace(/^PACT-/, 'YDC-');
}

/** Placeholders: {FIRM}, {FIRM2}, {TARGET}, {PACT}, {FIRMS}. {PACT} is filled with the stored name; `fill` shows its code label. */
export const BANK: Readonly<Record<TemplateKey, ReadonlyArray<string>>> = {
  band0: ['Halden poll: parents broadly relaxed about teen screen time', 'Halden Research: confidence in social platforms holds firm'],
  band1: ['Parent groups question late-night notifications', 'Halden poll: parents report more evening screen time'],
  band2: ['Halden poll: majority now uneasy about social platforms', 'Schools ask platforms for quiet hours during term'],
  band3: ['Assembly members table youth online safety bill', 'Halden poll: majority back age checks on social platforms'],
  band4: ['OPS signals review of age-check powers', 'Assembly fast-tracks hearings on teen accounts'],
  band5: ["OPS chair: 'all options on the table'", 'Halden poll: trust in social platforms at record low'],
  collapse: [MORATORIUM_HEADLINE],
  moratorium: ['Under-16 suspension extended; platform valuations slide', 'OPS keeps under-16 suspension in place; advertisers pull back'],
  final: ['Markets close for the period'],
  breach: ['Audit finds {FIRM} breached {PACT} terms; fine levied', '{FIRM} fined after {PACT} audit'],
  'breach-waived': ['Audit finds {FIRM} breached {PACT} terms; fine waived'],
  'breach-expelled': ['{FIRM} expelled from {PACT} after repeated breaches'],
  'audit-clean': ['Audit of {PACT} finds full compliance', '{PACT} members pass independent audit'],
  insolvency: ['{FIRM} enters administration talks', '{FIRM} misses debt payment; creditors convene'],
  incident: [
    'Leaked {FIRM} research on teen users circulates in the Assembly',
    'Former {FIRM} engineer testifies on harm to teenagers',
    'OPS opens investigation into {FIRM} over harm to teenagers',
    'Internal {FIRM} documents on teen sleep loss reach reporters',
    'Parents group files complaint over {FIRM} late-night alerts',
    'Assembly committee calls {FIRM} executives over teen safety reports',
  ],
  rank: ['{FIRM} overtakes {FIRM2} on valuation', '{FIRM} passes {FIRM2} in market value'],
  publish: ['{FIRM} publishes internal wellbeing research', '{FIRM} releases study of teen time on its feed'],
  lobby: ['{FIRM} expands lobbying team at the Assembly', '{FIRM} hosts Assembly members at its headquarters'],
  poach: ['{FIRM} copies {TARGET} feature', '{TARGET} feature appears on {FIRM} within weeks'],
  blitz: ['{FIRM} signs influencers for global campaign', '{FIRM} pays creators to post on its feed'],
  share: ['{FIRM} releases safety tooling to the industry', '{FIRM} opens its age-check system to rival platforms'],
  rush: ['{FIRM} ships new engagement feature ahead of review', '{FIRM} rolls out feature before safety checks finish'],
  'pace4-named': ['{FIRM} adds streaks and late-night notifications', '{FIRM} adds variable rewards to its feed'],
  'pace4-anon': ['Unnamed platform adds streak rewards, sources say', 'Unnamed platform tests late-night alerts, sources say'],
  ambient: [
    'OPS publishes quarterly platform bulletin',
    'Halden Research: ad spending on social platforms steady',
    'Advertisers review brand-safety terms with platforms',
    'Assembly committee hears testimony on age checks',
    'Analysts revise ad market forecasts',
    'Teachers report phones in class as term begins',
  ],
  'pact-formed': ['{FIRMS} sign voluntary youth design code {PACT}', '{FIRMS} announce joint limits on teen feeds under {PACT}'],
  'pact-joined': ['{FIRM} joins {PACT}', '{FIRM} signs on to {PACT}'],
  'pact-left': ['{FIRM} withdraws from {PACT}', '{FIRM} exits {PACT} terms'],
  'disclosure-on': ['Assembly passes platform transparency rule; researchers gain data access'],
  'disclosure-off': ['Transparency rule suspended'],
};

export type Vars = Partial<Record<'FIRM' | 'FIRM2' | 'TARGET' | 'PACT' | 'FIRMS', string>>;

export function fill(template: string, vars: Vars): string {
  return template.replace(/\{(FIRM2|FIRMS|FIRM|TARGET|PACT)\}/g, (_, k: keyof Vars) => {
    const v = vars[k] ?? '';
    return k === 'PACT' ? codeLabel(v) : v;
  });
}

const KIND_OF: Record<TemplateKey, HeadlineKind> = {
  band0: 'trust-band', band1: 'trust-band', band2: 'trust-band', band3: 'trust-band', band4: 'trust-band', band5: 'trust-band',
  collapse: 'collapse', moratorium: 'moratorium', final: 'final',
  breach: 'breach', 'breach-waived': 'breach', 'breach-expelled': 'breach', 'audit-clean': 'audit-clean',
  insolvency: 'insolvency', incident: 'incident', rank: 'rank',
  publish: 'publish', lobby: 'lobby', poach: 'poach', blitz: 'blitz', share: 'share', rush: 'rush',
  'pace4-named': 'pace4', 'pace4-anon': 'pace4', ambient: 'ambient',
  'pact-formed': 'pact-formed', 'pact-joined': 'pact-joined', 'pact-left': 'pact-left',
  'disclosure-on': 'disclosure-on', 'disclosure-off': 'disclosure-off',
};

/** One headline from the bank. `u` in [0, 1) selects the template. */
export function headline(key: TemplateKey, vars: Vars, u: number): Headline {
  const list = BANK[key];
  const t = list[Math.min(list.length - 1, Math.floor(u * list.length))] ?? '';
  return { kind: KIND_OF[key], text: fill(t, vars) };
}

/** Headlines for live events outside resolution (pact changes, disclosure toggle). */
export function pactFormedHeadline(tickers: ReadonlyArray<string>, pact: string, u: number): Headline {
  return headline('pact-formed', { FIRMS: joinTickers(tickers), PACT: pact }, u);
}
export function pactJoinedHeadline(ticker: string, pact: string, u: number): Headline {
  return headline('pact-joined', { FIRM: ticker, PACT: pact }, u);
}
export function pactLeftHeadline(ticker: string, pact: string, u: number): Headline {
  return headline('pact-left', { FIRM: ticker, PACT: pact }, u);
}
export function disclosureHeadline(on: boolean): Headline {
  return headline(on ? 'disclosure-on' : 'disclosure-off', {}, 0);
}

function joinTickers(t: ReadonlyArray<string>): string {
  if (t.length <= 1) return t[0] ?? '';
  return `${t.slice(0, -1).join(', ')} and ${t[t.length - 1]}`;
}

/** Band index: 0 for T ≥ 80 … 5 for T < 40. */
export function trustBand(T: number, p: Params): number {
  const i = p.TRUST_BANDS.findIndex((lo) => T >= lo);
  return i === -1 ? p.TRUST_BANDS.length : i;
}

export interface HeadlineContext {
  round: number;
  disclosure: boolean;
  collapsedNow: boolean;
  /** Collapsed in an earlier round. */
  moratorium: boolean;
  finalRound: boolean;
  /** Firm tickers by id. */
  tickers: ReadonlyMap<string, string>;
  /** Firm ids in creation order. */
  order: ReadonlyArray<string>;
  incidents: ReadonlyArray<string>;
  cards: ReadonlyArray<{ firmId: string; card: Card; target: string | null }>;
  pace4: ReadonlyArray<string>;
  newlyInsolvent: ReadonlyArray<string>;
  audits: ReadonlyArray<AuditResult>;
  pactNames: ReadonlyMap<string, string>;
  overtake: { firm: string; firm2: string } | null;
  bandBefore: number;
  bandAfter: number;
}

const CARD_KEY: Partial<Record<Card, TemplateKey>> = {
  POACH: 'poach',
  PUBLISH: 'publish',
  LOBBY: 'lobby',
  BLITZ: 'blitz',
  SHARE: 'share',
  RUSH: 'rush',
};

/**
 * 2–4 headlines for a resolved quarter. Candidates are ranked: moratorium start,
 * moratorium continuing, final round, audit breaches, clean audits, insolvency,
 * incidents, rank change, cards, pace 4, trust band, then general news as filler.
 */
export function roundHeadlines(ctx: HeadlineContext, rng: Rng, p: Params): Headline[] {
  const tk = (id: string): string => ctx.tickers.get(id) ?? id;
  const out: Headline[] = [];
  const add = (key: TemplateKey, vars: Vars = {}): void => {
    out.push(headline(key, vars, rng()));
  };

  if (ctx.collapsedNow) add('collapse');
  if (ctx.moratorium) add('moratorium');
  if (ctx.finalRound) add('final');
  for (const a of ctx.audits) {
    const PACT = ctx.pactNames.get(a.pactId) ?? a.pactId;
    if (a.breaches.length === 0) add('audit-clean', { PACT });
    for (const b of a.breaches) {
      const key: TemplateKey = b.expelled ? 'breach-expelled' : b.waived ? 'breach-waived' : 'breach';
      add(key, { FIRM: tk(b.firmId), PACT });
    }
  }
  for (const id of ctx.newlyInsolvent) add('insolvency', { FIRM: tk(id) });
  for (const id of ctx.incidents) add('incident', { FIRM: tk(id) });
  if (ctx.overtake) add('rank', { FIRM: tk(ctx.overtake.firm), FIRM2: tk(ctx.overtake.firm2) });
  for (const c of ctx.cards) {
    const key = CARD_KEY[c.card];
    if (key) add(key, { FIRM: tk(c.firmId), TARGET: c.target ? tk(c.target) : '' });
  }
  if (ctx.pace4.length > 0) {
    if (ctx.disclosure) {
      const id = ctx.pace4[Math.floor(rng() * ctx.pace4.length)] ?? '';
      add('pace4-named', { FIRM: tk(id) });
    } else {
      add('pace4-anon');
    }
  }
  const bandRoll = rng();
  if (ctx.bandAfter !== ctx.bandBefore || bandRoll < p.TRUST_BAND_P) add(`band${ctx.bandAfter}` as TemplateKey);

  const chosen = out.slice(0, p.HEADLINES_MAX);
  const used = new Set(chosen.map((h) => h.text));
  const ambient = BANK.ambient;
  let guard = 0;
  while (chosen.length < p.HEADLINES_MIN && guard++ < ambient.length * 4) {
    const h = headline('ambient', {}, rng());
    if (!used.has(h.text)) {
      used.add(h.text);
      chosen.push(h);
    }
  }
  return chosen;
}
