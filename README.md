# IBS Domination

> *"Let’s go on a journey to get you more control and understanding of your diagnosis and maybe even have some fun along the way. This p**p doesn’t define you! You define it! Ok! Let’s go!!"* — Zoltan, founder

An installable web app that coaches someone with IBS through the three-phase **low FODMAP elimination diet** to find their food triggers, week by week. It works on phones, tablets and desktops. Add it to the home screen and it runs full screen, like a regular app, and offline.

**Live:** https://zoltan5000.github.io/IBS---elimination-Diet-Helper/

## How it works

| Tab | What it does |
|---|---|
| **Today** | Your coach. Shows exactly where you are ("Week 2 · Day 4 of elimination", "Lactose challenge, day 2: drink 1 cup of milk"), what to do today, and the next step. New users get a welcome screen with the journey at a glance, everything the app can do, and a readiness checklist. |
| **Quest** | The gamified part: a retro pixel-art quest map. Each phase is a world and each week or food challenge is a level. You earn a coin for every day logged and a star for every challenge finished, a pixel buddy shows where you are, and there are badges, "LEVEL CLEAR!" celebrations and optional 8-bit sounds. |
| **Log** | Rate bloating, pain, gas, urgency and stress in about 30 seconds, plus stool type, food and notes. Includes a 4-week bar chart colored by phase, history, and a CSV export for your dietitian. |
| **Tools** | **Menu checker:** upload a menu photo or PDF, or paste the text, and each dish is marked likely OK, ask or modify, or likely high FODMAP, using *your* results. **Meal ideas:** online recipes (TheMealDB) checked against your triggers, with swaps. |
| **Learn** | The journey at a glance, the 7-step guide, 12 diet guidelines and every source. |

### The program
1. **Get ready:** red flags, celiac testing, a dietitian, and a checklist
2. **Baseline week:** 7 days of normal eating plus logging
3. **Elimination, 2–6 weeks:** a week counter, with a check-in unlocked at 2 weeks
4. **Check-in:** baseline compared with the last 7 days, then a clear next step (including what to do if the diet didn't help)
5. **Reintroduction:** 8 food challenges (lactose, fructose, sorbitol, mannitol, wheat, garlic, onion, GOS). Each one is 3 days of increasing amounts with a reaction check-in. Moderate or severe symptoms end a challenge early, and a 3-day washout timer runs before the next one.
6. **Your diet:** foods to eat freely, eat in small amounts, or limit, with a retest option

## Your data goes with you
Everything is saved on the device (`localStorage`), and nothing is uploaded. **Settings → Download backup** saves a file; **Restore** loads it on a new phone or browser. Progress from the first version of the guide is migrated automatically.

## Files
- `index.html`: the app shell and all content
- `css/style.css`: app styles (light and dark modes, responsive phone, tablet and desktop layouts, retro quest map)
- `js/app.js`: program logic, Today coach, quest map, log, badges, backup
- `js/fodmap-data.js`: FODMAP keyword rules used by the menu checker and meal ideas
- `js/features.js`: menu checker (pdf.js, Tesseract OCR) and meal ideas (TheMealDB)
- `manifest.webmanifest`, `sw.js`, `icons/`: install-as-app and offline support

## Sources
Monash University Department of Gastroenterology; ACG Clinical Guideline: Management of IBS (2021); British Society of Gastroenterology IBS guidelines (2021); NICE CG61; NIH/NIDDK; University of Michigan FODMAP reintroduction trial; ACG celiac guideline (2023). Full citations are in the app's Learn tab.

> Educational only. Not a substitute for care from a clinician or a FODMAP-trained registered dietitian.
