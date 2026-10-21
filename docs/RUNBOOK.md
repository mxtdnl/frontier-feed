# FEED facilitator runbook

Plain-English guide for running a FEED class session. Nothing here needs a terminal.

FEED is a reskin of FRONTIER for a masterclass on social media platforms, taught through psychology, economics and politics. The engine and every number in it are FRONTIER's; only names, copy and documents changed (`docs/RESKIN.md`).

- **Live site:** https://mxtdnl.github.io/frontier-feed/
- **Facilitator pages** (sign-in needed): `#/new` creates a session, `#/screen/…` is the projector, `#/control/…` is your private console, `#/wire/…` is the wire log, `#/results/…` is the results sequence.
- **Participant page:** `#/j/CODE`, or type the four-letter code on the landing page.
- **Facilitator guide (PDF):** `docs/facilitator-guide/FEED-facilitator-guide.pdf`, a step-by-step walkthrough with screenshots (section 10).

A session runs in one of two modes, chosen on `#/new`:
- **Team mode:** 2 to 16 firms, each with 1 to 5 devices (teams of people share a firm).
- **Multiplayer mode:** 2 to 50 firms, one person each.

A typical session is 8 to 14 quarters (35 to 60 minutes) plus a 20 to 30 minute debrief.

---

## What the session teaches (facilitators only)

Read this section before your first class. Do not show it to participants, and do not read any of it aloud before the results screen. Sources are given in brackets: `docs/spec.md` (the spec), `src/engine/params.ts` (the numbers), and the reports in `reports/`.

### The class and the case

FEED is the simulation part of a masterclass on social media platforms. The class is built around the lawsuits brought against Meta. Describe that case as allegations, not established findings. The case material is in your own case notes; this runbook does not summarise it.

The app names no real company, platform or person anywhere, the results screen included (spec §15.3). Its firms, the regulator (the Office of Platform Safety, OPS), the Assembly and Halden Research are fictional. Bring in the case yourself, in the debrief.

### The four learning objectives (spec §1)

By the end of the session, students should be able to:
1. **Economics.** Explain how competition for attention that makes sense for each platform can destroy something every platform depends on. Here that is public trust in social platforms, which sets the size of the whole ad market. Tell private returns from shared costs: a firm keeps all of the share of attention its feed design earns, while the trust it uses up is lost to every firm (a negative externality; Hardin 1968, Ostrom 1990).
2. **Psychology.** Describe how engagement design (ranked feeds, autoplay and infinite scroll, streaks, variable rewards and late-night notifications) acts on users, young users in particular, and why firms adopt it in response to rivals.
3. **Politics.** Judge why voluntary youth design codes fail under competitive pressure, how monitoring (audits), transparency and graduated sanctions (fines that grow with each breach) change behaviour (Elinor Ostrom's design principles), and why a regulator may act late and bluntly.
4. Connect these dynamics to the real debate on platform design and harm to young users, including the case discussed in class.

The model does not simulate users' minds. Objective 2 rests on what each FEED setting stands for (1 chronological feed, 2 ranked feed, 3 autoplay and infinite scroll, 4 streaks, variable rewards and late-night notifications), on the harm stories the higher settings make more likely, and on the debrief.

### What the room is told, and what the session is built to show

**What the room is told.** FEED is a competitive business simulation. Each firm runs a social platform competing for share of attention in an ad market, and is ranked by valuation. The briefing says only true things (spec §6.6):
- Total market revenue tracks public trust.
- Trust recovers when pressure eases.
- A higher feed builds reach faster. Reach earns share of attention.
- Safeguards cost money. They lower public exposure and the risk of a harm story.
- Valuation reflects cash plus reach, priced by the ad market.
- Every cost comes out of cash, and cash counts in full in your valuation.
- A firm whose cash falls too far below zero becomes insolvent: it is held at FEED 1 and cannot play cards.
- A firm that falls behind on reach loses share of attention.

**What it is built to show.** A higher FEED setting wins a firm more reach, and so more share of attention, and the firm keeps all of that gain. Every firm's feed also draws down public trust, a single pool that every firm shares. When trust falls, the whole ad market shrinks for everyone. One firm's draw moves trust by only about 1/N of the total, so for each firm on its own, a higher feed looks worth it (spec §6.3 step 4). If trust falls below a hidden level, a regulatory crackdown follows: the Assembly suspends under-16 accounts on every platform. The ad market drops to 15% of its size, cash and reach are written down, and trust recovers at a quarter of its normal rate (`params.ts`: MORATORIUM_M 0.15, MORATORIUM_R 0.25).

### Internal names and what the room sees

The engine, the spec's §6 to §13 and the reports in `reports/` use FRONTIER's internal names. The room only ever sees the FEED names (spec §5.0).

| Internal name (reports, spec §6–§13) | What the room sees |
|---|---|
| Pace 1, 2, 3, 4 | FEED 1 `CHRONO`, 2 `RANKED`, 3 `AUTOPLAY`, 4 `STREAKS` |
| Safety spend 0–30 | SAFEGUARDS 0–30% (`GUARDS` column on the board) |
| Capability | REACH |
| Market share; market | SHARE OF ATTENTION; AD MARKET |
| Incident | Harm story (`HARM` tag and command) |
| Pact (`PACT-A`) | Youth design code (`YDC-A`; `YDC` tab, key and command) |
| Disclosure | Transparency rule (`TRANSPARENCY ON` / `OFF`) |
| Moratorium | Crackdown (`CRACKDOWN`) |
| Card POACH; card RUSH | CLONE; LAUNCH (the other cards keep their names: PUBLISH, LOBBY, BLITZ, SHARE) |
| OFS | OPS, the Office of Platform Safety |

### What not to say before the results screen

- **Never tell the room that the goal is public trust,** or that the firms should protect it together. A warned room plays differently, and the lesson is lost (spec §1, "non-telegraphing").
- **Do not use these words** while the session is running (spec §15.3): commons, tragedy, sustainable, sustainability, cooperate, cooperation, collective, shared resource, tipping point, threshold, collapse, game, player, score, win, level, addictive, addiction, dark pattern, attention economy, externality, lawsuit, mental health crisis. Say "firm" or "platform", "board", "valuation", "quarter" and "ad market" instead. Say "FEED 2", never "feed level 2".
- **Do not name the case, Meta or any real platform** before the results screen. The allegations belong in the debrief; named earlier, the comparison tells the room what the session is about.
- **Do not hint that a hidden level exists,** or say when the session ends. The app never shows either.
- **Do not label conduct as good or bad.** Report what happened ("HLVY played LAUNCH"), not what it means.
- If a team asks "what are we trying to do?", the true answer is: "maximise your firm's valuation."

### Why STREAKS firms lead the board, and why the room copies them

- **A higher feed pays the firm.** Reach grows by 2, 4, 7 and 11 a quarter at FEED 1 to 4. Share of attention is in proportion to the square of reach (`params.ts`: CAP_GAIN, ALPHA 2.0). FEED 4 costs more cash per quarter (48 against 20 at FEED 2), but the extra share pays for it while trust holds.
- **The cost is shared.** FEED 3 draws about five times as much trust as FEED 2 (`params.ts`: DRAW 0.25 against 1.2). That loss shrinks every firm's revenue, not only the firm that caused it.
- **The board rewards it.** If the other firms hold back (FEED 2, SAFEGUARDS 15), one firm's best plan is FEED 4 with no safeguards, alternating CLONE and BLITZ. At 8 firms its valuation over quarters 10–14 is about 2,100, against about 630 for a firm that holds back (median of 100 seeds; `reports/strategy-audit.md`, section 1, which uses the internal names).
- **The room copies the leaders.** Observers of the October 2026 FRONTIER classes reported that teams copied the firms at the top of the board (`reports/observer-feedback-2026-10-12.md`, section 1). This is an observation from live classes, not a property of the model. Whether a given room copies its leaders depends on the room.

### True statements you can rely on

Every statement below comes from the spec, `params.ts` or a committed report. The reports were written for FRONTIER with the same engine; their pace, safety and pact figures apply to FEED, SAFEGUARDS and youth design codes unchanged. Statements marked "depends on the room" are measured results, not guarantees.
- **Equal is compliant.** A firm that meets a code's minimum SAFEGUARDS exactly, or plays exactly at its maximum FEED, keeps the code (spec §5.3; `src/engine/pacts.ts`).
- **Spending counts.** Every unit of cash spent (feed costs, safeguards, cards, fines) is one unit less valuation. Valuation is cash plus reach priced by trust (spec §6.3 step 13).
- **A firm at FEED 1 does not go bankrupt in a calm room.** In a scratch run of 8 firms over 14 quarters, a firm at pace 1 never became insolvent while its rivals stayed at pace 2 (`reports/observer-feedback-2026-10-12.md`, section 3). Do not tell the room that holding back leads to bankruptcy. It is false in the current model.
- **After a crackdown most firms become insolvent,** and the firm with the lowest feed keeps the most value (same report, section 3). Depends on the room.
- **No single strategy wins in every room.** The best plan depends on what the other firms do (`reports/strategy-audit.md`, section 1). In a room where every firm runs FEED 3 or 4, every strategy ends near or below zero.
- **Holding back together beats the race.** If every firm plays FEED 2 with SAFEGUARDS 15, the room never reaches the crackdown, even over 30 quarters (section 4 below, "When to expect the crackdown").
- **One firm alone rarely triggers the crackdown at 6 firms or more.** By quarter 14 it happens in 2.4% of sessions at 6 firms and never at 8 (`reports/strategy-audit.md`, section 4). With 4 firms it happens in 80–91% of sessions, which is why at least 6 firms are needed.
- **Every trust loss comes from the firms.** There are no market-wide shocks. Every harm story is drawn for a firm from its own FEED, SAFEGUARDS and cards, and its trust cost falls on every firm (spec §6.3 step 5; observer report, section 2). A quarter in which every firm loses is the shared trust shrinking, not bad luck. The QUARTER BRIEF on `#/wire` shows where each quarter's loss came from.
- **Breaking a code pays, even after fines.** In the strategy audit (8 firms, automatic audits at 0.25), a firm that breaks a FEED-2 code at FEED 4 with BLITZ ends at about 1,450 after fines, against about 630 for a firm that keeps it (`reports/strategy-audit.md`, section 3). Audits and fines narrow the gap; they do not close it.
- **"Each would have been worth more" (debrief prompt 2) is usually true, but not always.** The industry as a whole finished below the alternative (every firm at FEED 2, SAFEGUARDS 15) in every run measured. In rooms that play like the observed live sessions, every firm finished below its share of the alternative in 97–100% of runs. In a small room where most firms hold back, the one or two firms at FEED 3 or 4 can finish above it (spec §15.5; `reports/prompt2-check.md`). Check the COUNTERFACTUAL panel before you read prompt 2 aloud.

### How the results panels turn the board around

1. **FINAL BOARD.** The ranking the room has been chasing, by valuation, with each firm's peak. Leaders who peaked early show the largest drops.
2. **TRUST TRACE.** Trust quarter by quarter. Red squares mark quarters that lost 5 or more points, and the crackdown quarter is marked if it happened. The room sees that its own decisions moved the line.
3. **COUNTERFACTUAL.** The same room replayed with every firm at FEED 2 and SAFEGUARDS 15, with the same harm-story draws. The VALUE LOST figure is what the race cost the whole industry.
4. **ATTRIBUTION.** Each firm's share of the trust damage against its share of the value. Ask whether the firms with the largest share of the damage also kept the largest share of the value.
5. **NET CONTRIBUTION.** This is the turning point. Firms are re-ranked by what they added to the whole ad market: valuation, plus or minus what their decisions did to trust, plus a research credit for PUBLISH, minus value taken from rivals. In the four October 2026 FRONTIER live rooms, the valuation leader fell to between 5th and 9th (`docs/SESSIONS.md`, Session 18). Depends on the room: in a calm room with no crackdown, a firm on a high feed can still rank high (`reports/observer-feedback-2026-10-12.md`, section 3, finding 4).
6. **YDC RECORD.** Breaches no audit caught are revealed. The room sees how much the codes relied on monitoring.
7. **DEBRIEF.** Five prompts, one each on psychology, economics, politics, accountability and the case. From here on you may name the lesson, bring in the case and use every word listed above.

---

## 1. One-time Firebase set-up

1. Open the Firebase console, project **frontier-feed-9759d**.
2. **Authentication → Sign-in method:** both **Anonymous** and **Email/Password** must show *Enabled*. If Anonymous is off, participants see "Anonymous sign-in is switched off for this project" and cannot join.
3. **Authentication → Users → Add user:** create your facilitator email and password. Copy the **User UID** shown in the list.
4. **Realtime Database → Data:** add a top-level node `facilitators`. Under it add a child named with your UID and set its value to `true` (the boolean, not the text "true"). Without this, sign-in works but the app says the account is not on the facilitator list, and it shows the UID it needs.
5. **Realtime Database → Rules:** paste the full contents of `database.rules.json` from the repository (each pull request that changes the rules lists the new text), then click **Publish**. Re-do this whenever a pull request says the rules changed.

## 2. Pre-class checklist

Do this the day before, then again 15 minutes before class.

- [ ] Open https://mxtdnl.github.io/frontier-feed/ on the projector laptop. The landing page shows the FEED wordmark and a "Session code" box.
- [ ] Sign in at `#/new` with your facilitator email. If you see "not on the facilitator allowlist", repeat set-up step 4.
- [ ] Run a **solo rehearsal** (section 8) at least once with the same laptop and projector. It takes about 10 minutes.
- [ ] Projector set to 1280×720 or 1920×1080, browser full-screen (F11 is for the browser, not the app). Zoom 100%.
- [ ] Second device for the console: your own laptop or phone, signed in with the same account.
- [ ] Phone on the room Wi-Fi opens the site and reaches the landing page.
- [ ] Decide the settings (section 3) and write the end rule down. The app never shows participants how many quarters there are.
- [ ] Have your case notes ready for the debrief (prompt 5 asks about the case).
- [ ] Browser: use a private window or a different browser for any device that will play as a firm. A browser signed in as the facilitator cannot also be a participant.

**No briefing deck yet.** The participant briefing deck in the `mxtdnl/slides` repository is the FRONTIER deck: it describes AI firms, pace and four cards. Do not use it for FEED. Present the app's briefing screen instead (section 4, "Briefing").

## 3. Create a session

1. Open `#/new` and sign in.
2. Choose settings, then press **Create session**:

| Setting | What it does | Suggested |
|---|---|---|
| Mode | **Team mode**: up to 16 firms, teams share a firm. **Multiplayer mode**: up to 50 firms, one person each. The mode name shows only on `#/new` and the console. | Team for teams of 3 to 5; Multiplayer when each person plays alone |
| Round timer (s) | Time to decide each quarter. You can add or remove 30 s later. | 120 |
| Auto-resolve at deadline | Resolves by itself when the timer ends. Off means you press F9. | Off for the first class |
| End mode | *Random within a range*: hidden end between the two numbers. *Fixed quarter*: you choose the end. *Manual (stops at 30)*: runs until you press END, or quarter 30. | Random, 10 to 14 |
| Transparency rule at start | Shows each firm's FEED, SAFEGUARDS and exposure on the board from the start. | Off |
| Automatic audit probability per youth design code per quarter | Chance each code is audited by itself each quarter. | 0.25 |
| Reveal TAU line on results screen | Draws the hidden trust level (TAU) on the trust trace at the end. | Off unless you plan to discuss it |
| Lit-room display mode | Slightly larger type and stronger rules and secondary text, for a bright room. | As needed |
| Seed | Random, or a fixed number to replay the same market. | Random |
| Bot firms | Computer-run firms (labelled BOT) for small classes and rehearsal, with fictional platform names. **Add 10 mixed** adds ten at once with mixed policies. Bots count towards the mode's firm limit. | Enough to reach 6 firms |

Bot policies (shown only on `#/new`): *cautious* (FEED 1, SAFEGUARDS 20), *standard* (FEED 2, SAFEGUARDS 10), *greedy* (FEED 3 or 4, SAFEGUARDS 5, BLITZ when allowed) and *mimic-leader* (copies the leader's FEED while the transparency rule is on, otherwise FEED 3; SAFEGUARDS 8). Bots never play CLONE, LAUNCH or the other cards, except BLITZ for greedy bots.

3. The projector page opens (`#/screen/…`) showing the **join code**, a QR code and the address. Leave it on the projector.
4. On the second device open `#/control/<same session id>`. The address of the projector page contains the id; replace `screen` with `control`.

## 4. Running the session

**Lobby.** Teams scan the QR code or type the code. One person founds the firm (name, ticker, PIN). Teammates join with the PIN. Firm names appear on the projector with a member count. Wait until every team shows. You need at least 2 firms (bots count).

- **Multiplayer mode:** each person presses **Found your firm**. The PIN they are shown lets them rejoin from another phone (**Rejoin your firm with its PIN**) if theirs dies. Nothing stops a second phone joining someone's firm with their PIN, so tell the room to keep PINs to themselves.
- **Firm names:** ask teams to invent a platform name. Do not let a team use the name of a real platform: the session must not name one before the results screen.
- **Above 16 firms** the lobby lists firms in up to 4 columns: ticker and devices joined, or BOT.

- **Use at least 6 firms.** One firm playing flat out (FEED 4, SAFEGUARDS 0) and playing LAUNCH every other quarter can trigger the crackdown on its own. By quarter 14 this happens in 8 or 9 sessions in 10 with 4 firms, 2 or 3 in 10 with 5 firms, 1 or 2 in 100 with 6 firms and never with 8. If the session runs on to quarter 30, it happens in most sessions with 6 firms and in up to 4 in 10 with 8 (FRONTIER Session 9 review, finding M1; re-measured in Session 17). Add bot firms on `#/new` to reach 6 if the class is small, and use a fixed 14-quarter end with fewer than 8 firms.
- **Check the console's FIRMS panel before the briefing.** A firm whose PRESENCE reads *none* has no devices: its founder founded or joined another firm. Press **REMOVE** on that row twice within 3 seconds. Otherwise it plays on AUTO defaults all session. REMOVE works only in the lobby.
- **Press LOCK JOINS** (DANGER panel) as soon as every team has formed. This stops anyone founding extra firms or trying more PINs. **REOPEN JOINS** undoes it while you are still in the lobby.

**Briefing.** Press **F9**. This locks firm creation: nobody new can join after this point. A team that missed the lobby must be added by starting a new session. The projector shows the MARKET lines, COMMITS, CONTROLS and the six CARDS. Read the MARKET lines aloud, word for word, including the three spending and insolvency lines.

**Each quarter.**
1. Press **F9** (or **Shift+A**) to open the quarter. The timer starts.
2. Watch the COMMITTED count in the top bar and the board heading; on the board a green box with a tick marks each firm that has committed. Teams can change their decision until the timer ends.
3. Press **F9** to resolve. Teams that did not commit get the default decision and are marked AUTO. The board reveals the new results.
4. Press **F9** again for the next quarter.

**Reading the projector.** The top bar shows FEED, the quarter, the phase as a coloured block with its word, the commit count during an open quarter, `TRANSPARENCY ON` or `OFF`, a short status, and the countdown on the right. The line under it says in one sentence what is happening and what teams should do; after each reveal it summarises the quarter (trust change, who is 1st, harm stories). The bar at the bottom shows only the keys that do something right now; the solid key is the one you most likely want next (usually **F9**, **F8** during a summit). Hidden keys still work if pressed. To type a command (`TRST`, `FIRM HLVY`, `HELP`), just start typing: the command line appears in the top bar.

**What a team sees on the phone.**
- The header has the firm's ticker, the quarter, the phase and, largest of all, the countdown on the right. Cash and last profit sit beneath it.
- The tabs are **DESK**, **BOOK**, **YDC** and **WIRE**.
- In the lobby, the briefing and quarter 1, the DESK opens with a three-step strip: DECIDE, COMMIT, REVEAL, one line each.
- The DESK shows FEED (four segments: 1 CHRONO, 2 RANKED, 3 AUTOPLAY, 4 STREAKS; the chosen one has an amber underline), SAFEGUARDS with 0% and 30% at the ends, and CARD with the chosen card's one-line effect under its name. The card rules are inside the card sheet.
- Directly above the COMMIT button sits a bordered ticket with the estimated cost and a four-step exposure meter with its word (LOW, MED, HIGH, SEVERE). If the settings would break a youth design code the firm belongs to, the ticket adds a line such as "▼ Breaks YDC-A: feed 2 or lower." It does not stop the firm committing. Ticket and button stay on screen on a small phone.
- After COMMIT the button becomes a green bar, "COMMITTED 14:02:31 · edit until close", with the device initials. If the team changes a setting the bar reads "CHANGES NOT COMMITTED" and a RECOMMIT button appears. After the timer ends the bar says the desk is locked.
- At the reveal, the card opens with one sentence ("You ranked 2nd of 9, ▲1. Profit 57.7."), then the figures, then notices with a coloured rule on the left (red for something that went against the firm).
- During a summit one banner is shown and the YDC tab opens. Code terms read "feed ≤ 2 · safeguards ≥ 15%". The form opens with no term ticked, and the line above SIGN shows exactly what will be signed ("You are signing: feed 2 or lower · safeguards 25 or higher").

**Board pages (above 16 firms).** The board shows 10 firms at a time and turns to the next page every 8 seconds; the heading reads `PAGE 2/5`. Above the page, the leader and the firm that moved most (3 places or more) stay pinned. Rotation holds for 30 seconds after you press any key, and while you type a command. Each reveal starts on page 1. Use `FIRM <TICKER>` for any one firm's history.

**Firm performance.** Across the top of the board, the VALUE SHARE strip shows each firm's share of the total value of firms above zero; the caption counts firms below zero. Each row shows SHARE (share of attention), PROFIT, VALUE, CHANGE, MOVE (places gained ▲ or lost ▼ since last quarter), a valuation bar from zero (red to the left when below zero) and, when there is room, a TREND line of the last 14 quarters on one scale for every firm. With the transparency rule on, the trend line is left out to make room. Type `FIRMS` for one small chart per firm on the same scale (pages of 16 above 16 firms, turning every 8 seconds), and `RANKS` for every firm's rank by quarter with the leader in amber and the biggest faller in red. Esc returns to the board.

**Summit.** Press **F8** during an open quarter or a reveal. The timer pauses and decisions are refused ("Industry summit in session"). Teams can propose, join and leave youth design codes. Press **F8** again to return.

**Audit.** Press **F6** (**Shift+F**), then the number of the code. The audit runs when the quarter resolves. The result appears in the wire, on the board as a BREACH tag, and on the console.

**Transparency rule.** **F7** (**Shift+D**) turns the FEED, GUARDS and EXPOSURE columns on or off. In lit-room mode they are headed FEED, GRD and EXPO, explained in the key strip under the board. They fill in at the next resolution. Turning it on or off puts a headline on the wire.

**Crackdown.** When trust falls below the hidden level, the reveal shows the crackdown headline: "Assembly suspends under-16 accounts on every platform; ad market collapse follows". It is the only time the word "collapse" appears before the results. Press **F9** to continue under the crackdown or **F10** to end.

**When to expect the crackdown (FRONTIER Session 17 calibration, same engine; 200 sessions per row and class size from 4 to 50 firms).**

| How the room plays | Crackdown |
|---|---|
| Every firm on a high feed (FEED 3 or 4, few safeguards) | Around quarter 5 (usually quarters 4 to 5) |
| Half the firms on a high feed, half holding back | Around quarter 10 (usually 8 to 11); by quarter 14 in every session measured |
| A class like the four FRONTIER live rooms of October 2026 (high feed on and off, moderate safeguards, many cards) | By quarter 14 in about half of sessions at 4 to 20 firms (45–57%), more often in very large rooms (64% at 30 firms, 94% at 50); median quarter 13 to 16 |
| A third of the firms on a high feed | Sometimes within 14 quarters (1–59% of sessions, depending on class size) |
| Every firm holding back (FEED 2, SAFEGUARDS 15) or on the defaults | Never, even over 30 quarters |

- **Safeguards do not make a high feed safe.** A room where every firm plays FEED 3 with the maximum SAFEGUARDS (30) still reaches the crackdown in about 45% of sessions.
- **Cards.** PUBLISH adds little trust (0.25 per card at 8 firms, scaled by class size). **SHARE** costs 15 and lowers every firm's harm-story risk that quarter. **LAUNCH** is free and adds 4 reach, but that quarter the firm's trust draw and its harm-story risk are each 1.5 times as high.
- With the default hidden end (quarter 10 to 14), a half-racing room can end a quarter or two before its crackdown. If you want every session to run long enough to see it, set **End mode** to **Fixed quarter** with 14 on `#/new`.
- Trust recovers slowly once the room eases off: about 1 to 1.5 points a quarter. A room that has fallen far rarely climbs back within a session.

**Ending.** The session ends by itself at the hidden end quarter, or after quarter 30. Press **F10** twice within 3 seconds to end early. If you press it during an open quarter, that quarter is discarded.

### Key map

| Key | Alternative | Action |
|---|---|---|
| F2 | Shift+B | Board |
| F3 | Shift+T | Trust history |
| F4 | Shift+P | Youth design codes (`YDC`) |
| F6 | Shift+F | Audit a code |
| F7 | Shift+D | Transparency rule on or off |
| F8 | Shift+S | Summit in or out |
| F9 | Shift+A | Advance: lobby → briefing → quarter → resolve → reveal → next quarter. After the session ends, opens and steps the results. |
| F10 | Shift+E | End the session (press twice within 3 s) |
| Esc | | Back to the board; on the results, one panel back |

Type in the command line at the top of the projector, then press Enter: `BOARD`, `TRST`, `YDC`, `WIRE`, `FIRM <TICKER>`, `FIRMS`, `RANKS`, `HARM`, `HELP`. F1, F5, F11 and F12 do nothing in the app, so the browser keeps them.

**Harm stories.** When the reveal ends, the right-hand panel lists the quarter's harm stories under HARM STORIES: each firm hit, its headline, the effect ("trust −1.0 · HRRN revenue −15% this quarter") and the cause. With the transparency rule on, the cause names the firm's feed, safeguards and story risk ("feed 4 · safeguards 5% · story risk 27%"); with it off, it says only "Story risk rises with the feed and falls with safeguards." The firm's row carries a red **HARM** tag until the next quarter resolves. More than 4 stories: "+N more"; type `HARM` for every harm story of the session. Harm-story headlines report leaks, testimony and investigations, never findings.

If a key press shows "Working on the last key. Press again in a moment.", the previous action is still finishing. Wait a second and press again.

### The console (`#/control/…`)

- **Control strip** at the top stays in view however far you scroll. Its buttons are grouped by what they do:
  - **ROUTINE:** **−30 s**, **+30 s**, **Pause** and **Resume**. Safe to press at any time.
  - **SESSION FLOW:** **F6 AUDIT**, **F7 TRANSPARENCY**, **F8 SUMMIT**, **F9 ADVANCE**. The key you are expected to press next is the solid one.
  - **IRREVERSIBLE** (red outline): **F10 END**, and the **END** and **TAU** buttons that show the hidden end quarter and TAU only while you hold them down. Use them privately. Never show the console on the projector.
  - A **NEXT** line under the groups names the key to press and why, for example "NEXT · F9 resolves quarter 3. 2 of 5 firms have committed; the rest take their defaults."
- **SESSION panel:** phase, quarter, trust (with CRACKDOWN once it has happened), timer and the **MODE** with its firm limit.
- **FIRMS panel:** who is online (a row of dots, one per device, filled when online; **ON** shows devices online out of joined), who has committed, when, AUTO forecast, bot policy. In the lobby each row also has **REMOVE** (press twice within 3 s). The table scrolls inside the panel. **SORT** by **FIRM**, **CMT** (firms still to commit first) or **ONLINE** (fewest online first). **SHOW** **NOT COMMITTED** (during an open quarter) or **OFFLINE** (human firms with no device online).
- **LOCK JOINS / REOPEN JOINS** (DANGER panel, lobby only): closes or reopens joining before the briefing.
- **YOUTH DESIGN CODES panel:** unaudited counts, an **AUDIT** button per code, audit outcomes.
- **EXPORT:** **DOWNLOAD HISTORY (.json)** and **DOWNLOAD DATA LINES (.txt)** (files `feed-<code>-history.json` and `feed-<code>-data.txt`). Download both before you delete the session.
- **WIRE LOG** (link at the top of the console, opens a new tab): every headline and code or transparency event of the session, by quarter. Use **◄ ►** or the arrow keys to change quarter, type a quarter number and press **GO**, or press **ALL**. At the top of each resolved quarter, the **QUARTER BRIEF** says where that quarter's trust change came from (recovery, the firms' draw, harm stories, PUBLISH and LOBBY, the crackdown), the three firms that drew the most trust with their rank, feed and safeguards, and the cards and audited breaches of the top and bottom halves of the board. Under each quarter, **NOT ON THE WIRE** lists what the headlines left out. Both are for you only and never appear on the projector or phones; the QUARTER BRIEF shows feed and safeguards even while the transparency rule is off. **COPY** puts the selected quarter (or all) on the clipboard as plain text for the debrief. The address is `#/wire/<session id>`, the same id as `#/control/…`.
- **DELETE SESSION:** press it, type the four-letter code, then press **CONFIRM DELETE**. It cannot be undone.

## 5. If something goes wrong

| What you see | What to do |
|---|---|
| The projector page was refreshed or the laptop slept | Reload the page and sign in if asked. The quarter, countdown and committed ticks come back from the database. Nothing is lost. |
| Two windows open for the same session | Safe. Pressing F9 in both resolves a quarter once. The second press is refused. |
| Console says **Resolution incomplete — retry** | The quarter did not finish writing. Press **Retry resolution** once. Nothing was written, so no results are half-saved. |
| Results do not appear after the session ends | The console shows "Results are not written yet". Press **Retry results**. Check the connection. |
| A team says "Joining is closed" | Joining closes at the briefing. A team that missed the lobby cannot be added to a running session. A returning device that was already in a firm can always reconnect. |
| A team's phone shows "Offline. Reconnecting automatically." | It reconnects by itself. Their last commit is kept. Committing is paused until the connection returns; they can recommit afterwards if the timer is still running. |
| A phone clock is wrong | Not a problem. The countdown and the deadline use the server clock. |
| A team did not commit in time | They receive the default decision, marked AUTO, and the quarter proceeds. |
| You pressed END by mistake | A single press only arms it for 3 seconds. A second press ends the session and cannot be undone. |
| The wrong person is on the facilitator list | Remove their UID under `facilitators` in the Realtime Database data tab. |
| A firm you do not recognise, or an unexpected device in a firm, appears in the lobby | Press **REMOVE** on that firm. If a device appears in the wrong firm, remove the firm and ask the team to found it again with a new PIN. Then press **LOCK JOINS**. |
| A team founded a firm with a real platform's name | In the lobby, press **REMOVE** on that firm and ask the team to found it again under an invented name. |
| More firms formed than the mode allows (16 in team mode, 50 in multiplayer mode), so F9 refuses to start | Press **REMOVE** on the extra firms (start with those whose PRESENCE reads *none*). The mode cannot be changed after creation; create a new multiplayer session if a team session is too small. |
| In multiplayer mode, someone's phone died | On another phone they open the site, type the code, press **Rejoin your firm with its PIN**, pick their ticker and enter the PIN they were shown when they founded it. |
| A phone says "Another device is joining this firm. Wait a few seconds and try again." | Several teammates joined the same firm in the same second; each join takes its turn, one per second. Ask them to press **Join the firm** again. If it keeps happening, press **LOCK JOINS** once every team has formed. |
| A wrong PIN always shows "Another device is joining this firm" after about 10 seconds | The Firebase rules are older than the app. Paste the current `database.rules.json` (set-up step 5). |
| A team cannot join with the PIN | Check that they chose the right firm. The PIN is shown on the founding phone and on its DESK tab. |
| "Anonymous sign-in is switched off for this project" on a phone | Anonymous sign-in is off. See set-up step 2. |
| The board lags behind after a network drop | Wait a few seconds. If a tick stays missing, reload the console. Committed ticks need one open projector or console window. |
| Anything else | Reload the page. If a quarter is stuck in RESOLVING, use Retry. If the database is unreachable, pause the class and check the Firebase status page. |

Never ask a participant to read out a hidden value. The projector and the participants' phones never show τ (TAU), the end quarter or unaudited violations.

## 6. After the last quarter

1. When the session ends, press **F9** on the projector to open the results.
2. Download both exports from the console, **before** deleting anything.
3. Participants see their own results card on their phones. It opens with one sentence, such as "You finished 2nd of 9, 12.5% below your peak.", then shows rank, valuation against the counterfactual (every firm at FEED 2 and SAFEGUARDS 15, no cards, no codes, same harm-story draws), their share of the damage and of the value as two short bars, their net contribution and rank by it, and their own undetected code violations.

## 7. Debrief flow

Allow 20 to 30 minutes. On the projector, press **F9** to step forward and **Esc** to step back. The step is saved, so a reload returns to the same panel.

Every panel opens with one bold sentence that states its main point, written from the session's data (for example "Trust fell from 72.0 to 45.6 over 14 quarters."). Read it out, then ask the room to discuss.

With about 20 firms or more, two panels hold a list that scrolls inside the panel (the heading and the axis stay in view):
- **FINAL BOARD**: every firm in rank order.
- **COUNTERFACTUAL**: the per-firm comparison on the right.
- Scroll with the mouse wheel or trackpad, or with **↓ ↑**, **Page Down**, **Page Up**, **Home** and **End**. F9 and Esc still move between panels.
- **ATTRIBUTION**: above 24 firms, the 12 firms with the largest share of the damage, then one **OTHERS** line that adds up the rest.
- **NET CONTRIBUTION**: above 24 firms, the 12 firms whose rank changed most, then one **OTHERS** line that adds up the rest; the slope chart on the left always shows every firm.

1. **FINAL BOARD.** Who finished first? Each firm has a line from its peak (hollow square) to its final valuation (solid square); red squares finished below zero. Ask which teams peaked early.
2. **TRUST TRACE.** Point at the labelled CRACKDOWN marker if there was one, and at the red squares (quarters that lost 5 or more trust). The hidden level (a dashed red line with a hatched band below it) is shown only if "Reveal TAU line on results screen" was switched on at creation.
3. **COUNTERFACTUAL.** Three figures: the industry's actual value, the ALTERNATIVE (every firm at FEED 2, SAFEGUARDS 15) and the VALUE LOST between them. If the industry finished below zero, no percentage is shown. The hatched area on the chart is the trust lost. On the right, each firm's actual valuation against its alternative. Check here, before prompt 2, whether any firm finished above its alternative. Ask whether any single firm could have prevented the loss.
4. **ATTRIBUTION.** Each firm's share of the damage (red, to the left) against its share of the value (amber, to the right). If no firm finished above zero, the right side says so. This is the fairness conversation.
5. **NET CONTRIBUTION.** The firms re-ranked by the value they created for the whole ad market, not only for themselves. On the left, a line runs from each firm's rank by valuation to its rank by net contribution; firms that moved 3 places or more are thick (green ▲ rose, red ▼ fell). On the right, each firm's net contribution is built up on one axis: its valuation (blue), plus or minus what its decisions did to every firm's revenue through trust, against FEED 2 and SAFEGUARDS 15 with no cards (green ▲ or red ▼), plus a research credit for each PUBLISH card (amber outline, labelled "not money": it never changed anyone's cash), minus the value it took from rivals with BLITZ, CLONE and LAUNCH (red outline). A crackdown's cost is charged to the firms that had drawn trust down before it. Under each firm, its conduct: ▲ what it did for the ad market, ▼ what it did against it. Ask the firm that led on valuation where it now sits, and why.
6. **YDC RECORD.** Violations that no audit caught are now shown. Under the table, each code has a row of quarter cells per firm: a solid red cell is a breach an audit found, a red outline is a breach no audit found, a dim dot is a quarter that kept the terms, and a blank cell is a quarter in which the firm was not bound (before it joined, after it left or was expelled, or after the code dissolved). Firms that left are marked "former". Ask what the codes did and did not achieve.
7. **DEBRIEF.** Five prompts, shown on screen (spec §15.5):
   1. Psychology: Which FEED level did you run, and what did that mean for a 14-year-old user? Did you choose it because of users or because of rivals?
   2. Economics: If every platform had held level 2, each would have been worth more. Why would no single firm hold back alone? Compare your share of the damage with your share of the value.
   3. Politics: The crackdown came only after damage built up past a hidden line. Why did the Assembly act late, and what did LOBBY buy you?
   4. Accountability: Which codes held: audits, fines or reputation? Would transparency from quarter 1 have changed your decisions?
   5. Reality check: Here the ad market tracked public trust every quarter. In the case discussed today, did it? If not, what replaces that signal: courts, regulation or design codes?

**Notes for each prompt.**
1. FEED 3 and 4 stand for autoplay, infinite scroll, streaks, variable rewards and late-night notifications. Ask firms whether they chose their FEED by looking at the board (rivals) or by thinking about users. The QUARTER BRIEF on `#/wire` shows which firms ran FEED 3 or 4 and when.
2. Read panel 3 first. If a firm finished above its alternative, say so: that firm is the answer to "why would no single firm hold back alone?". Holding back alone costs a firm share while rivals keep the higher feed, and its own draw moves trust by only about 1/N. Then compare panel 4.
3. The crackdown comes only when trust falls below a hidden level, so it arrives after the damage is done, and then it hits every firm. LOBBY waived the fine for a breach detected that quarter (the breach was still published) and cost public trust 0.5 each time. Turn on "Reveal TAU line" at creation if you want to show the line.
4. Use panel 6: which breaches were caught, which were not, and whether fines changed anyone's FEED. If you turned the transparency rule on part-way, compare the quarters before and after on the wire log.
5. In FEED the ad market falls with trust in the same quarter. Use your case notes to ask whether revenue in the real case fell with trust, and if not, what took its place.

The results screen is the only screen where the app's wording may name the commons problem directly. Use that vocabulary freely once you reach it, and bring in the case.

## 8. Solo rehearsal with bot firms (on the live site)

The computers in the cloud cannot reach the live database, so a live rehearsal uses the **in-app bot firms**. You need only your laptop, and optionally your phone.

1. Sign in at `#/new`.
2. Set **Round timer** to 30, **Auto-resolve at deadline** on, **Fixed quarter** 6, **Fixed, for rehearsal** seed 7 (the same market every time).
3. Under **BOT FIRMS** press **Add bot firm** six times. Give them different policies (cautious, standard, greedy, mimic-leader).
4. Press **Create session**. On your phone, in a private browser tab, open the site, type the code and found a firm with an invented name, for example Test Works with ticker TEST.
5. On the laptop press **F9** (briefing), **F9** (quarter 1). Commit a decision on the phone. Watch the board: all bots count as committed.
6. During a quarter, press **F8** (summit) and back, **F7** (transparency rule) and **F6** (audit) once you have proposed a code on the phone's YDC tab.
7. Open the console's **WIRE LOG** link and read a QUARTER BRIEF.
8. Let auto-resolve run through the quarters. When the session ends, press **F9** to step through the seven results panels and check the card on the phone.
9. On the console download both exports, then **DELETE SESSION**.

What to check: the countdown is the same on laptop and phone; the board is readable from the back of the room; your phone's result card appears at each reveal; the results panels fit the screen.

## 9. Running 40 to 50 people

- **Teams of 3 to 5** (10 to 16 firms): use **team mode**. A test with 16 firms on 50 devices ran 14 quarters without errors (`reports/scale-run.md`).
- **One person each** (up to 50 firms): use **multiplayer mode**. A test with 50 firms on 50 devices ran 14 quarters without errors. A large room reaches the crackdown on the same timetable as a small class: if half the people run a high feed, expect it around quarter 10, and by quarter 14 in every session measured. A room that plays like the October 2026 FRONTIER live classes reaches it more often at 30–50 people (64–94% by quarter 14) than at 10 (about 50%) (see "When to expect the crackdown" in section 4; `docs/CALIBRATION.md`, Session 17).
- **Connection limit (check before the class).** Every open browser tab holds one live connection to the database: about 50 phones plus the projector and the console. The free (Spark) plan has a limit on simultaneous connections. This has **not been verified**: the Firebase documentation could not be reached from the build environment. The limit is believed to be 100, but that has not been checked. To check it, open https://firebase.google.com/pricing and find the Realtime Database limit on simultaneous connections for the plan project frontier-feed-9759d is on (the Firebase console shows which plan the project uses).
- Ask participants to keep one tab open each. A second tab, or a laptop and a phone at the same time, counts twice.

## 10. Where the technical details are

- **Facilitator guide (PDF, facilitators only):** `docs/facilitator-guide/FEED-facilitator-guide.pdf`, a step-by-step walkthrough with screenshots. Rebuilt with `npm run guide:pdf`; screenshots with `npm run guide:shots`.
- The owner's reskin decisions: `docs/RESKIN.md`.
- Full rules and numbers: `docs/spec.md` (the FEED names are in §5.0).
- What each build session did, and what is still open: `docs/PROGRESS.md`.
- How the market was tuned: `docs/CALIBRATION.md` and `reports/calibration.md`.
- Automated checks (developer commands, run in Claude Code): `npm test`, `npm run test:rules`, `npm run test:e2e`, `npm run test:e2e:rehearsal`, `npm run test:e2e:long`, `npm run test:e2e:hardening`, `npm run test:a11y`, `npm run audit:build`.
