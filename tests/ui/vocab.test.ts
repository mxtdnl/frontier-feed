/**
 * FEED display vocabulary (spec §5.0, Session R2). The engine and database keep FRONTIER's internal names; nothing
 * people read on the phone, the projector, the console or the results may use them.
 */
import { describe, expect, it } from 'vitest';
import { REAL_PLATFORMS, findViolations } from '../../scripts/lib/copy-rules';
import { CARDS } from '../../src/engine';
import { BOT_FIRMS } from '../../src/firebase/orchestrator';
import { CARD_INFO, PACE_OPTIONS } from '../../src/screens/Play/model';
import { STEPS } from '../../src/screens/Play/Panels';
import { termsPreview, termsShort, termsText } from '../../src/screens/Play/pacts';
import { RESULT_PANELS } from '../../src/screens/Results/model';
import { BRIEFING_LINES } from '../../src/screens/Screen/briefing';
import { TAG_MEANING } from '../../src/screens/Screen/model';
import { CLOSING_LINE } from '../../src/screens/Wire/brief';
import { COMMAND_HELP } from '../../src/ui/commands';
import { GENERAL_CAUSE } from '../../src/ui/incidents';
import { KEY_BINDINGS } from '../../src/ui/keys';
import { statusSentence, type Phase } from '../../src/ui/status';
import { CARD_LABEL, FEED_OPTIONS, cardLabel, feedLabel, pactLabel, pactLabelsIn } from '../../src/ui/vocab';

/** FRONTIER's internal words and labels. "safety" is allowed only in the SHARE card's "safety tooling" (owner wording). */
const INTERNAL = /\b(pace|capability|incidents?|pacts?|disclosure|moratorium|POACH|RUSH|INCID|DISCL|Cautious|Aggressive|Breakneck|frontier)\b|\bsafety\b(?! tooling)/i;

const PHASES: Phase[] = ['lobby', 'briefing', 'open', 'resolving', 'reveal', 'summit', 'ended'];

const copy: string[] = [
  ...BRIEFING_LINES.market,
  ...BRIEFING_LINES.commits,
  ...BRIEFING_LINES.controls.flat(),
  ...BRIEFING_LINES.cards.flat(),
  ...CARD_INFO.flatMap((c) => [c.label, c.name, c.effect]),
  ...PACE_OPTIONS.map((o) => o.sub),
  ...STEPS.map((s) => s.line),
  ...COMMAND_HELP.flatMap((c) => [c.mnemonic, c.text]),
  ...KEY_BINDINGS.map((b) => b.label),
  ...TAG_MEANING.flat(),
  GENERAL_CAUSE,
  CLOSING_LINE,
  ...RESULT_PANELS,
  termsText({ maxPace: 2, minSafety: 25 }),
  termsShort({ maxPace: 2, minSafety: 25 }),
  termsPreview({ limitPace: true, maxPace: 2, limitSafety: true, minSafety: '25' }) ?? '',
  ...PHASES.map((phase) => statusSentence({ phase, round: 7, paused: false, leftMs: 60_000, collapsed: true, resolved: 6 })),
];

describe('display vocabulary (spec §5.0)', () => {
  it('maps FEED levels, cards and code names', () => {
    expect(FEED_OPTIONS.map((o) => o.sub)).toEqual(['CHRONO', 'RANKED', 'AUTOPLAY', 'STREAKS']);
    expect(feedLabel(4)).toBe('STREAKS');
    expect(cardLabel('POACH')).toBe('CLONE');
    expect(cardLabel('RUSH')).toBe('LAUNCH');
    expect(CARDS.map((c) => CARD_LABEL[c])).toEqual(['NONE', 'CLONE', 'PUBLISH', 'LOBBY', 'BLITZ', 'SHARE', 'LAUNCH']);
    expect(pactLabel('PACT-A')).toBe('YDC-A');
    expect(pactLabel('YDC-B')).toBe('YDC-B');
    expect(pactLabelsIn('BRST joins PACT-A; PACT-AB formed')).toBe('BRST joins YDC-A; YDC-AB formed');
  });

  it('keeps card IDs unchanged (spec §5.0)', () => {
    expect(CARD_INFO.map((c) => c.id)).toEqual([...CARDS]);
  });

  it('uses no internal word in any phone, projector, console or results copy', () => {
    for (const line of copy) expect(line, line).not.toMatch(INTERNAL);
  });

  it('uses no banned or non-telegraphing term (§15.2, §15.3)', () => {
    for (const line of copy.filter((l) => !RESULT_PANELS.includes(l as (typeof RESULT_PANELS)[number]))) {
      expect(findViolations(line, { allowNonTelegraphing: false }), line).toEqual([]);
    }
  });
});

describe('bot platforms (owner approval 2026-10-16, Session R2)', () => {
  it('has 51 distinct names and 4-letter tickers', () => {
    expect(BOT_FIRMS).toHaveLength(51);
    expect(new Set(BOT_FIRMS.map((f) => f.name)).size).toBe(51);
    expect(new Set(BOT_FIRMS.map((f) => f.ticker)).size).toBe(51);
    for (const f of BOT_FIRMS) expect(f.ticker, f.name).toMatch(/^[A-Z]{4}$/);
  });

  it('names no real platform and no banned term', () => {
    for (const f of BOT_FIRMS) {
      const both = `${f.name} ${f.ticker}`;
      for (const real of REAL_PLATFORMS) expect(both.toLowerCase(), f.name).not.toContain(real.toLowerCase());
      expect(findViolations(both, { allowNonTelegraphing: false }), f.name).toEqual([]);
    }
  });
});
