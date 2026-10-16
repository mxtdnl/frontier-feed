/** Briefing copy (spec §6.6, §14.5), in the FEED display vocabulary (§5.0). Contains no numbers that reveal parameters. */
export const BRIEFING_LINES = {
  market: [
    'Total market revenue tracks public trust.',
    'Trust recovers when pressure eases.',
    'A higher feed builds reach faster. Reach earns share of attention.',
    'Safeguards cost money. They lower public exposure and the risk of a harm story.',
    'Valuation reflects cash plus reach, priced by the ad market.',
    // Owner wording 2026-10-12 (Session 19): spending and insolvency, true and without numbers.
    'Every cost comes out of cash, and cash counts in full in your valuation.',
    'A firm whose cash falls too far below zero becomes insolvent: it is held at FEED 1 and cannot play cards.',
    'A firm that falls behind on reach loses share of attention.',
  ],
  controls: [
    ['FEED', 'CHRONO, RANKED, AUTOPLAY, STREAKS.'],
    ['SAFEGUARDS', 'Age checks, time limits, quiet hours and moderation.'],
    ['CARD', 'One optional action. The same card cannot repeat in consecutive quarters.'],
  ],
  cards: [
    ['CLONE', 'Copy a named rival’s feature. Take reach from them.'],
    ['PUBLISH', 'Release internal wellbeing research.'],
    ['LOBBY', 'Lobby the Assembly on fines.'],
    ['BLITZ', 'Run an influencer campaign.'],
    ['SHARE', 'Give every firm your safety tooling.'],
    ['LAUNCH', 'Ship a new engagement feature. More reach, more exposure and harm-story risk.'],
  ],
  commits: [
    'Commit once per quarter. Change and recommit until the timer closes.',
    'Firms that do not commit keep last quarter’s settings and show AUTO.',
    'The timer is shown on every screen.',
  ],
} as const;
