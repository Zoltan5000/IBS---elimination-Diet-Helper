# IBS Elimination Diet Guide

A static, single-page web guide that walks someone with IBS through the three-phase **low FODMAP elimination diet** to find their food triggers. Open `index.html` in a browser; no build step or server is needed.

## What it covers

1. **Before you start:** red flag symptoms, celiac testing before cutting wheat, finding a dietitian, plus a checklist
2. **Learn FODMAPs:** the six groups, common sources and swaps
3. **Track a baseline:** a week of symptom scoring before any change
4. **Phase 1, Eliminate (2–6 weeks):** do's and don'ts, label reading, a sample day
5. **Check-in:** compares baseline and Phase 1 diary scores, and says what to do if the diet didn't help
6. **Phase 2, Reintroduce:** the 3-day challenge, washout periods, example test foods
7. **Phase 3, Personalise:** builds a personal summary from the tracker results

## Built-in tools

- **Symptom diary:** daily 0–10 scores for bloating, pain, gas and urgency, plus Bristol stool type, stress, food and notes. It draws a chart colored by phase and exports a CSV to share with a dietitian.
- **Reintroduction tracker:** one card per FODMAP group (fructans split into grains, garlic and onion) for the test food, day-by-day notes and a result.
- **Diet guidelines at a glance:** 12 key rules, each citing its source.
- **Restaurant menu checker:** upload a menu photo or PDF, or paste the text. By default it runs entirely on the device: PDF text is extracted with [pdf.js](https://mozilla.github.io/pdf.js/), photos are read with [Tesseract.js](https://tesseract.projectnaptha.com/) OCR, and each dish is screened against a high-FODMAP keyword list (`js/fodmap-data.js`). Dishes are marked *likely OK*, *ask or modify*, or *likely high FODMAP*. The verdicts take the person's reintroduction results into account, so tolerated groups aren't flagged. When the page is opened on claude.ai as an artifact, there's an optional choice to have Claude read the menu instead.
- **Meal ideas:** searches the free [TheMealDB](https://www.themealdb.com/) recipe API online, checks every ingredient against the person's triggers, shows the cleanest recipes first and suggests swaps. On claude.ai there's also an optional "Ask Claude for ideas" button.

Diary and tracker data are stored in the browser's `localStorage` on that device only. pdf.js and Tesseract are loaded from a CDN the first time they're needed, so the menu checker and meal ideas need an internet connection.

## Files

- `index.html`: the guide's content and layout
- `css/style.css`: styles, with light and dark modes
- `js/app.js`: step navigation, checklist, symptom diary and reintroduction tracker
- `js/fodmap-data.js`: FODMAP keyword rules and the verdict logic
- `js/features.js`: the menu checker and meal ideas

## Sources

The content is drawn from university and medical sources, cited inline and listed on the page:

- Monash University Department of Gastroenterology (the developers of the low FODMAP diet)
- ACG Clinical Guideline: Management of IBS (Lacy et al., *Am J Gastroenterol* 2021)
- British Society of Gastroenterology IBS guidelines (Vasant et al., *Gut* 2021)
- NICE CG61: IBS in adults
- NIH / NIDDK patient guidance on IBS diet
- University of Michigan FODMAP reintroduction trial (NCT03052439)
- ACG celiac disease guideline update (Rubio-Tapia et al., 2023)

> This guide is educational and not a substitute for care from a clinician or FODMAP-trained registered dietitian.
