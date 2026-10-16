/** Banned-term rules from spec §15.2 and §15.3 (with the FEED reskin additions). Shared by lint-copy and its tests. */

export interface Violation {
  line: number;
  term: string;
  rule: 'banned' | 'non-telegraphing' | 'real-platform' | 'emoji';
}

/** Spec §15.2: banned everywhere. */
const BANNED: ReadonlyArray<RegExp> = [
  /\bunlock\w*/i,
  /\bempower\w*/i,
  /\bseamless\w*/i,
  /\brevolutionary\b/i,
  /\bharness\w*/i,
  /\belevate\w*/i,
  /\bsupercharge\w*/i,
  /\bgame-changer\b/i,
  /\bdive in\b/i,
  /\bjourney\b/i,
  /\bwelcome to the future\b/i,
  /\bin today['’]s fast-paced\b/i,
  /\blet['’]s\b/i,
  /\bawesome\b/i,
  /\bgreat job\b/i,
  /\boops\b/i,
  /\bnot just\b[^.\n]{1,60}\bbut\b/i,
];

/** Spec §15.3: banned in participant and projector UI outside the results screen. */
const NON_TELEGRAPHING: ReadonlyArray<RegExp> = [
  /\bcommons\b/i,
  /\btragedy\b/i,
  /\bsustainab\w*/i,
  /\bcooperat\w*/i,
  /\bcollective\w*/i,
  /\bshared resource\b/i,
  /\btipping point\b/i,
  /\bthreshold\b/i,
  /\bcollapse\b/i,
  /\bgames?\b/i,
  /\bplayers?\b/i,
  /\bscores?\b/i,
  /\bwins?\b/i,
  /\blevels?\b/i,
  // FEED reskin additions (docs/RESKIN.md, owner 2026-10-16).
  /\baddict\w*/i,
  /\bdark patterns?\b/i,
  /\battention economy\b/i,
  /\bexternalit(?:y|ies)\b/i,
  /\blawsuits?\b/i,
  /\bmental health crisis\b/i,
];

/**
 * Spec §15.3 (FEED reskin): names of real platforms. Matched in Title case and UPPER case only, because
 * source code uses words such as `meta` as identifiers. "X" is not listed: a single letter cannot be
 * matched without false hits. Applied everywhere, the results screen included: the app names no real
 * company (docs/RESKIN.md, guardrails).
 */
export const REAL_PLATFORMS: ReadonlyArray<string> = [
  'Meta',
  'Facebook',
  'Instagram',
  'WhatsApp',
  'Threads',
  'TikTok',
  'Snapchat',
  'YouTube',
  'Twitter',
  'Reddit',
  'Pinterest',
  'Tumblr',
  'Twitch',
  'LinkedIn',
  'Discord',
];
const REAL_PLATFORM_RES: ReadonlyArray<RegExp> = REAL_PLATFORMS.map((n) => new RegExp(`\\b(?:${n}|${n.toUpperCase()})\\b`));

/** The single permitted use of "collapse" (spec §15.3). */
export const MORATORIUM_HEADLINE = 'OFS imposes moratorium on frontier deployments; markets collapse';

const EMOJI = /\p{Extended_Pictographic}/u;

export function findViolations(text: string, opts: { allowNonTelegraphing: boolean }): Violation[] {
  const out: Violation[] = [];
  const cleaned = text.split(MORATORIUM_HEADLINE).join(' '.repeat(MORATORIUM_HEADLINE.length));
  cleaned.split('\n').forEach((lineText, i) => {
    for (const re of BANNED) {
      const m = re.exec(lineText);
      if (m) out.push({ line: i + 1, term: m[0], rule: 'banned' });
    }
    if (!opts.allowNonTelegraphing) {
      for (const re of NON_TELEGRAPHING) {
        const m = re.exec(lineText);
        if (m) out.push({ line: i + 1, term: m[0], rule: 'non-telegraphing' });
      }
    }
    for (const re of REAL_PLATFORM_RES) {
      const m = re.exec(lineText);
      if (m) out.push({ line: i + 1, term: m[0], rule: 'real-platform' });
    }
    const e = EMOJI.exec(lineText);
    if (e) out.push({ line: i + 1, term: e[0], rule: 'emoji' });
  });
  return out;
}
