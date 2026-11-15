# 28 Days: Handoff for Claude Code

## Status
- DONE: index.html, style.css, data.js (all 8 days of story), packing.js (backpack + period products), tracker.js (symptom log + Body Literacy)
- TODO: main.js (the game engine that connects everything)

## Prompt to paste into Claude Code

Read every file in this folder first (index.html, style.css, data.js, packing.js, tracker.js). Then write main.js, the game engine, using plain JavaScript with no modules and no frameworks. The game has to run when someone double-clicks index.html.

Requirements:
1. Create `window.Game = { route: null, dayIndex: 0, stats: { energy: 70, grades: 70, money: 40, health: 70 }, backpack: [], log: [], bodyLiteracy: 0, redFlagsLogged: 0, finaleGood: false }`. tracker.js already updates Game.bodyLiteracy and Game.redFlagsLogged.
2. Screen flow:
   - Title screen: show the "28 Days" title, the CAST list, TEEN_NOTE, and a Start button.
   - Route select: two buttons. "Story A: A typical cycle" sets route "typical". "Story B: 'That's just how periods are'" sets route "warning".
   - For each day in DAYS, run these steps in order:
     a. Packing.start(day, route, ids => ...), then set Game.backpack = ids.
     b. Packing report: compute protection using FLOW_FACTOR = {none:0, light:1.5, medium:1, heavy:0.5, soaked:0.25}. Each product's protection = min(item.hours * factor, item.maxHours || Infinity). Add these up. If the total is less than day.hoursAway, the player leaks. With spare pants ("pants") the penalty is energy -5. Without them it's grades -10 and health -5. If the flow is soaked, add a 🚩 line: "Needing to change every 1–2 hours is a warning sign." If truth.pain >= 5, give energy +5 when "pain" or "heat" was packed, otherwise energy -10. Apply every day.needs entry the player didn't pack.
     c. Scene: show day[route].text and the choices as buttons, with number keys 1–3 as shortcuts. Each choice shows a "Needs: X or Y" tag with ✓ or ✗. A choice succeeds if any item in `requires` is in Game.backpack (no requires means it always succeeds). If `requiresLogs` is set, the choice needs Game.redFlagsLogged >= requiresLogs. On success apply effects and show result. On failure apply failEffects and show failResult. Show stat changes as green or red chips. If a choice has good:true and succeeds, set Game.finaleGood = true.
     d. Tracker.open(day, route, ...). Skip this on the finale day.
     e. Fact card: show the SPEAKERS[fact.speaker] icon and name with the fact text in a speech bubble.
   - After the finale scene, pick the ending. The typical route uses ENDINGS.typical. The warning route uses ENDINGS.warningGood if Game.finaleGood, otherwise ENDINGS.warningBad.
   - Report card: show final stats, Body Literacy, and red flags caught. Stars: score = average of the stats * 0.7 + min(bodyLiteracy, 100) * 0.3. Give 3 stars at 75 or above, 2 stars at 55 or above, otherwise 1.
   - Learn screen: a product table built from ITEMS (only items with hours), the WARNING_SIGNS list, and a "Play the other story" button that resets Game.
3. HUD (#hud): show it during play. It contains "Day X" plus a phase pill, an SVG cycle wheel of 28 segments colored by phase (menstrual days 1–5 #e05666, follicular 6–13 #f0a35e, ovulation 14 #4fae84, luteal 15–28 #7b7fd4) with the current day highlighted, and 4 stat bars. Keep stats between 0 and 100.
4. Use the existing CSS classes in style.css: card, choices, choice, req ok/no, chip up/down, report-line good/bad/flag, fact, bubble, routes, route, cast, stars, products, signs.

When you're done, open index.html, play through both routes, and fix any bugs.
