import { describe, expect, it } from 'vitest';
import { findViolations, MORATORIUM_HEADLINE as LINT_MORATORIUM, REAL_PLATFORMS } from '../../scripts/lib/copy-rules';
import {
  BANK,
  codeLabel,
  disclosureHeadline,
  fill,
  headline,
  MORATORIUM_HEADLINE,
  nextPactName,
  PARAMS,
  pactFormedHeadline,
  pactJoinedHeadline,
  pactLeftHeadline,
  resolveRound,
  trustBand,
  type Pact,
} from '../../src/engine';
import { pactLabel } from '../../src/ui/vocab';
import { all, dec, game, NO_INC } from './helpers';

const templates = Object.values(BANK).flat();

describe('headline bank (spec §15.4, FEED)', () => {
  it('holds at least 40 templates, and every key has one', () => {
    expect(templates.length).toBeGreaterThanOrEqual(40);
    for (const [key, list] of Object.entries(BANK)) expect(list.length, key).toBeGreaterThan(0);
    expect(new Set(templates).size).toBe(templates.length);
  });

  it('passes the copy rules; only the crackdown headline says collapse', () => {
    expect(MORATORIUM_HEADLINE).toBe(LINT_MORATORIUM);
    expect(MORATORIUM_HEADLINE).toBe('Assembly suspends under-16 accounts on every platform; ad market collapse follows');
    for (const t of templates) {
      expect(findViolations(t, { allowNonTelegraphing: false }), t).toEqual([]);
      expect(t).not.toMatch(/!/);
    }
    expect(templates.filter((t) => /collapse/i.test(t))).toEqual([MORATORIUM_HEADLINE]);
  });

  it('contains every §15.4 headline verbatim', () => {
    for (const t of [
      'Halden poll: parents broadly relaxed about teen screen time',
      'Parent groups question late-night notifications',
      'Halden poll: majority now uneasy about social platforms',
      'Assembly members table youth online safety bill',
      'OPS signals review of age-check powers',
      "OPS chair: 'all options on the table'",
      '{FIRM} overtakes {FIRM2} on valuation',
      '{FIRM} adds streaks and late-night notifications',
      'Unnamed platform adds streak rewards, sources say',
      'Leaked {FIRM} research on teen users circulates in the Assembly',
      'Former {FIRM} engineer testifies on harm to teenagers',
      'OPS opens investigation into {FIRM} over harm to teenagers',
      '{FIRM} publishes internal wellbeing research',
      '{FIRM} expands lobbying team at the Assembly',
      '{FIRM} copies {TARGET} feature',
      '{FIRM} signs influencers for global campaign',
      '{FIRM} releases safety tooling to the industry',
      '{FIRM} ships new engagement feature ahead of review',
      '{FIRMS} sign voluntary youth design code {PACT}',
      '{FIRM} joins {PACT}',
      '{FIRM} withdraws from {PACT}',
      'Audit of {PACT} finds full compliance',
      'Audit finds {FIRM} breached {PACT} terms; fine levied',
      'Assembly passes platform transparency rule; researchers gain data access',
      'Transparency rule suspended',
      '{FIRM} enters administration talks',
      MORATORIUM_HEADLINE,
      'Under-16 suspension extended; platform valuations slide',
      'Markets close for the period',
    ]) {
      expect(templates).toContain(t);
    }
  });

  it('names no real company and keeps no FRONTIER vocabulary', () => {
    for (const t of templates) {
      for (const n of REAL_PLATFORMS) expect(t.toLowerCase(), t).not.toContain(n.toLowerCase());
      expect(t.replace(/\{[A-Z0-9]+\}/g, '')).not.toMatch(/\b(X|AI|OFS|lab|labs|model|models|frontier|moratorium|deployment|evaluation|red-team|accord|disclosure|pace|capability|incident|pact)\b/i);
    }
  });

  it('reports harm stories as leaks, testimony, investigations and complaints, never as findings', () => {
    for (const t of BANK.incident) {
      expect(t).toContain('{FIRM}');
      expect(t, t).toMatch(/leaked|testifies|investigation|documents|complaint|reports/i);
      expect(t, t).not.toMatch(/\b(proves?|proven|caused|causes|confirms?|found to)\b/i);
    }
  });

  it('uses only the known placeholders, and each event names its firm', () => {
    for (const t of templates) expect(t.replace(/\{(FIRM2|FIRMS|FIRM|TARGET|PACT)\}/g, '')).not.toMatch(/[{}]/);
    for (const key of ['incident', 'publish', 'lobby', 'poach', 'blitz', 'share', 'rush', 'insolvency', 'pace4-named', 'pact-joined', 'pact-left', 'breach'] as const) {
      for (const t of BANK[key]) expect(t, `${key}: ${t}`).toContain('{FIRM}');
    }
    for (const t of BANK.poach) expect(t).toContain('{TARGET}');
    for (const t of BANK['pace4-anon']) expect(t).not.toMatch(/\{FIRM/);
  });
});

describe('template engine', () => {
  it('fills placeholders and shows youth design codes, never the stored pact name', () => {
    expect(fill('{FIRM} copies {TARGET} feature', { FIRM: 'ARCN', TARGET: 'BRLK' })).toBe('ARCN copies BRLK feature');
    expect(pactFormedHeadline(['ARCN', 'BRLK', 'CYRA'], 'PACT-A', 0).text).toBe('ARCN, BRLK and CYRA sign voluntary youth design code YDC-A');
    expect(pactJoinedHeadline('DOLM', 'PACT-B', 0).text).toBe('DOLM joins YDC-B');
    expect(pactLeftHeadline('DOLM', 'PACT-AB', 0).text).toBe('DOLM withdraws from YDC-AB');
    expect(disclosureHeadline(true).text).toBe('Assembly passes platform transparency rule; researchers gain data access');
    expect(disclosureHeadline(false).text).toBe('Transparency rule suspended');
  });

  it('has one code label, shared with the display vocabulary', () => {
    for (const n of ['PACT-A', 'PACT-Z', 'PACT-AA', 'YDC-A', 'OTHER']) expect(pactLabel(n)).toBe(codeLabel(n));
    expect(codeLabel('PACT-C')).toBe('YDC-C');
  });

  it('selects templates by u and stays within the list', () => {
    expect(headline('incident', { FIRM: 'ARCN' }, 0).text).toBe('Leaked ARCN research on teen users circulates in the Assembly');
    expect(headline('incident', { FIRM: 'ARCN' }, 0.999999).text).toBe(BANK.incident[BANK.incident.length - 1]!.replace('{FIRM}', 'ARCN'));
    expect(headline('final', {}, 0.5).kind).toBe('final');
  });

  it('maps trust to bands', () => {
    expect([95, 80, 79.9, 70, 65, 55, 45, 39.9, 0].map((T) => trustBand(T, PARAMS))).toEqual([0, 0, 1, 1, 2, 3, 4, 5, 5]);
  });

  it('never names a FEED 4 firm while transparency is off', () => {
    for (let seed = 1; seed <= 40; seed++) {
      const g = game(3, { seed });
      const r = resolveRound(g, all(g, dec(4, 0)));
      for (const h of r.outputs.headlines.filter((x) => x.kind === 'pace4')) expect(BANK['pace4-anon']).toContain(h.text);
      const d = game(3, { seed, settings: { disclosure: true } });
      const rd = resolveRound(d, all(d, dec(4, 0)));
      for (const h of rd.outputs.headlines.filter((x) => x.kind === 'pace4')) {
        expect(BANK['pace4-anon']).not.toContain(h.text);
        expect(h.text).toMatch(/^[A-Z]{4} adds/);
      }
    }
  });

  it('includes card headlines', () => {
    const g = game(4, { settings: { disclosure: false } });
    const r = resolveRound(g, { f0: dec(1, 30, 'PUBLISH') }, { ...PARAMS, INC_BASE: [0, 0, 0, 0] });
    expect(r.outputs.headlines.some((h) => h.kind === 'publish' && h.text.includes('ARCN'))).toBe(true);
  });

  it('labels audit headlines YDC-A from the engine', () => {
    const g = game(3);
    const pact: Pact = { id: 'p1', name: nextPactName(g.pacts), proposer: 'f0', terms: { maxPace: 2, minSafety: null }, members: { f0: 1, f1: 1 }, createdRound: 1, status: 'active' };
    g.pacts.push(pact);
    g.pendingAudits = ['p1'];
    const r = resolveRound(g, { f0: dec(4, 0) }, NO_INC);
    const breach = r.outputs.headlines.find((h) => h.kind === 'breach');
    expect(breach?.text).toMatch(/ARCN.*YDC-A/);
    expect(r.outputs.headlines.every((h) => !h.text.includes('PACT-'))).toBe(true);
  });

  it('gives the same headlines for the same seed', () => {
    const run = () => {
      let s = game(6, { seed: 7 });
      const out: string[] = [];
      for (let i = 0; i < 8; i++) {
        const r = resolveRound(s, all(s, dec(4, 0, i % 2 ? 'BLITZ' : 'NONE')));
        out.push(...r.outputs.headlines.map((h) => h.text));
        s = r.state;
      }
      return out;
    };
    expect(run()).toEqual(run());
  });
});
