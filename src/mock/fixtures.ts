/**
 * Static fixtures for the component kit (`#/kit`). Every number here is illustrative and exists
 * only to drive the kit. None of it is engine output or a tunable parameter.
 */

export type MockTag = 'BOT' | 'AUTO' | 'HARM' | 'INSOLV';

export interface MockFirm {
  ticker: string;
  name: string;
  share: number;
  /** Change in share, percentage points. */
  dShare: number;
  profit: number;
  value: number;
  /** Change in valuation versus the previous quarter. */
  dValue: number;
  committed: boolean;
  tags: MockTag[];
  pacts: string[];
  breach: boolean;
  members: number;
  // Shown only while the transparency rule (internal: disclosure) is on.
  pace: number;
  safety: number;
  expo: number;
}

/** Ordered by valuation, highest first. */
export const FIRMS: ReadonlyArray<MockFirm> = [
  { ticker: 'AMBL', name: 'Ambrel', share: 0.214, dShare: 2.4, profit: 38.4, value: 412.6, dValue: 41.0, committed: true, tags: [], pacts: [], breach: false, members: 4, pace: 4, safety: 3, expo: 6.8 },
  { ticker: 'BRST', name: 'Brisset', share: 0.176, dShare: 0.3, profit: 31.0, value: 377.9, dValue: 2.0, committed: true, tags: ['BOT'], pacts: ['PACT-A'], breach: true, members: 3, pace: 3, safety: 8, expo: 4.1 },
  { ticker: 'CRVL', name: 'Corvel', share: 0.151, dShare: -0.9, profit: 24.6, value: 351.2, dValue: -4.4, committed: true, tags: [], pacts: ['PACT-A'], breach: false, members: 5, pace: 3, safety: 12, expo: 3.6 },
  { ticker: 'DLLW', name: 'Dellow', share: 0.139, dShare: 0.5, profit: 22.9, value: 329.5, dValue: 6.1, committed: true, tags: [], pacts: ['PACT-A'], breach: false, members: 3, pace: 2, safety: 15, expo: 1.9 },
  { ticker: 'ELVN', name: 'Elvane', share: 0.121, dShare: -1.1, profit: 18.3, value: 301.0, dValue: -12.7, committed: false, tags: [], pacts: [], breach: false, members: 4, pace: 4, safety: 2, expo: 6.4 },
  { ticker: 'FNIK', name: 'Fennick', share: 0.093, dShare: 0.2, profit: 11.2, value: 266.3, dValue: 1.5, committed: true, tags: ['BOT'], pacts: ['PACT-A', 'PACT-B'], breach: false, members: 2, pace: 2, safety: 18, expo: 1.2 },
  { ticker: 'GLDR', name: 'Galder', share: 0.068, dShare: -0.8, profit: 3.9, value: 214.8, dValue: -8.9, committed: false, tags: ['AUTO'], pacts: [], breach: false, members: 3, pace: 3, safety: 6, expo: 3.8 },
  { ticker: 'HRRN', name: 'Harrin', share: 0.038, dShare: -0.6, profit: -6.5, value: 98.4, dValue: -20.1, committed: true, tags: ['INSOLV'], pacts: ['PACT-B'], breach: false, members: 2, pace: 1, safety: 4, expo: 0.9 },
];

export const OWN_TICKER = 'DLLW';
export const ROUND = 7;
export const COMMITTED = FIRMS.filter((f) => f.committed).length;

/** Valuation before this quarter's resolution. */
export function prevValue(f: MockFirm): number {
  return f.value - f.dValue;
}
export function prevShare(f: MockFirm): number {
  return f.share - f.dShare / 100;
}
export function prevRank(f: MockFirm): number {
  return [...FIRMS].sort((a, b) => prevValue(b) - prevValue(a)).findIndex((x) => x.ticker === f.ticker);
}

export const TRUST_HISTORY: ReadonlyArray<number> = [90.0, 89.2, 86.4, 82.7, 77.8, 68.1, 61.8];
export const TRUST = {
  value: 61.8,
  prev: 68.1,
  marketSize: 1184,
  marketRef: 1500,
  incidents: 3,
};

export interface MockHeadline {
  round: number;
  text: string;
}
export const HEADLINES: ReadonlyArray<MockHeadline> = [
  { round: 7, text: 'AMBL overtakes BRST on valuation' },
  { round: 7, text: 'Halden poll: majority now uneasy about social platforms' },
  { round: 7, text: 'Audit finds BRST breached YDC-A terms; fine levied' },
  { round: 7, text: 'Former ELVN engineer testifies on harm to teenagers' },
  { round: 7, text: 'HRRN enters administration talks' },
  { round: 6, text: 'Unnamed platform adds streak rewards, sources say' },
  { round: 6, text: 'DLLW publishes internal wellbeing research' },
  { round: 6, text: 'FNIK joins YDC-B' },
  { round: 5, text: 'Parent groups question late-night notifications' },
  { round: 5, text: 'Leaked CRVL research on teen users circulates in the Assembly' },
  { round: 4, text: 'FNIK, HRRN sign voluntary youth design code YDC-B' },
  { round: 3, text: 'ELVN signs influencers for global campaign' },
];

// ---------- Reveal helpers (mock) ----------
export function prevProfit(f: MockFirm): number {
  return f.profit - f.dValue * 0.1;
}

/** Deterministic valuation history for the FIRM view, ending at prev and current value. */
export function valueHistory(f: MockFirm): number[] {
  const seed = f.ticker.charCodeAt(0) + f.ticker.charCodeAt(1);
  const start = f.value * 0.62;
  const prev = prevValue(f);
  const out: number[] = [];
  for (let k = 0; k < 5; k++) {
    const base = start + ((prev - start) * k) / 5;
    out.push(base + Math.sin(k * 1.7 + seed) * f.value * 0.012);
  }
  out.push(prev, f.value);
  return out;
}
