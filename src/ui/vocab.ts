/**
 * FEED display vocabulary (spec §5.0). The engine, database and code keep FRONTIER's internal names
 * (pace, safety, capability, incident, pact, disclosure, moratorium, card IDs); everything people see
 * is mapped here. No Firebase and no React.
 */
import { codeLabel, type Card } from '../engine';

/** FEED 1–4 (internal: pace). Number and short label, as on the DESK segments. */
export const FEED_OPTIONS = [
  { value: 1, label: '1', sub: 'CHRONO' },
  { value: 2, label: '2', sub: 'RANKED' },
  { value: 3, label: '3', sub: 'AUTOPLAY' },
  { value: 4, label: '4', sub: 'STREAKS' },
] as const;

/** Short FEED label for a pace value, e.g. 2 -> "RANKED". */
export function feedLabel(pace: number): string {
  return FEED_OPTIONS.find((o) => o.value === pace)?.sub ?? String(pace);
}

/** Card display labels (internal IDs unchanged: POACH shows as CLONE, RUSH as LAUNCH). */
export const CARD_LABEL: Record<Card, string> = {
  NONE: 'NONE',
  POACH: 'CLONE',
  PUBLISH: 'PUBLISH',
  LOBBY: 'LOBBY',
  BLITZ: 'BLITZ',
  SHARE: 'SHARE',
  RUSH: 'LAUNCH',
};

/** Display label for a card ID; unknown values pass through. */
export function cardLabel(card: string): string {
  return (CARD_LABEL as Record<string, string>)[card] ?? card;
}

/**
 * Youth design code label for a stored pact name: `PACT-A` shows as `YDC-A`. The stored name never
 * changes (spec §9.1); only the display does.
 */
export function pactLabel(name: string): string {
  return codeLabel(name);
}

/** Replaces every stored pact name (`PACT-A`…) inside a sentence with its display label. */
export function pactLabelsIn(text: string): string {
  return text.replace(/\bPACT-([A-Z]+)\b/g, 'YDC-$1');
}
