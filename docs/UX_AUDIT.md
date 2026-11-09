# IBS Domination — UX/UI Audit

Scope: welcome page (first visit) and the Today, Quest, Log, Tools and Learn tabs, plus Settings and empty states · local copy of the app at the redesign commit (identical to the live site) · iPhone 13 (390×664), with iPhone SE and Pixel 7 for the first-screen check · light and dark mode · 9 November 2026.

Method: the `ux-ui-audit` skill's probes (core, heuristics, perception, LTR, focus after real Tab presses, routes), run with Playwright in Chromium. Contrast was re-measured against the real rendered pixels, because the app's pixel frames are drawn as border images, which the core probe can't see (it reported white header text "on white", 1:1, which is false). Safari was not available for testing.

## Summary

| Severity | Found | Fixed in this pass |
|---|---|---|
| Accessibility (WCAG 2.2) | 5 | 5 |
| Major | 2 | 1 (one is a trade-off for the owner to decide) |
| Note | 6 | 0 |

Before the fixes: 57 text elements below the contrast minimum, and 14 of 14 focus-ring checks failing in light mode. After the fixes: 0 of 2,076 text elements and 0 of 28 focus-ring checks fail, in both themes.

## Findings

**01 · Accessibility · every tab (light mode) · fixed**
The keyboard focus ring was gold on white, which is nearly invisible.
Keyboard and switch users couldn't see where they were.
```
outline 3px solid rgb(255,201,51) on rgb(255,255,255): 1.54:1. SC 1.4.11 needs 3:1.
on the tip box rgb(238,240,255): 1.36:1
```
FIX: indigo `#3d33b8` ring in light mode (8.88:1 on white); gold kept in dark mode (12.4:1).

**02 · Accessibility · Today · fixed**
The main button, "Log today", had white text on bright orange.
```
"Log today" 18.4px/700, rgb(255,255,255) on rgb(255,91,36): 3.1:1 (dark mode 2.85:1). SC 1.4.3 needs 4.5:1 below 18.66px bold.
```
FIX: dark ink text on the same orange: 5.4:1. The orange stays bright.

**03 · Accessibility · Log, dark mode · fixed**
Score tiles in the history list had white numbers on light yellow and green.
```
"2.8" white on rgb(251,191,36): 1.67:1 · "2.3" white on rgb(74,222,128): 1.74:1 (9 rows each). SC 1.4.3 needs 3:1 at this size.
```
FIX: dark text on the tiles in dark mode: 10.55:1 to 11.02:1.

**04 · Accessibility · Quest map · fixed**
The 8px pixel labels on finished and current levels were too faint.
```
"1-1" white on rgb(46,158,88): 3.42:1 · "3-2" white on rgb(255,122,61): 2.59:1. SC 1.4.3 needs 4.5:1.
```
FIX: darker green `#1e7a43` (5.36:1) and orange `#c94e14` (4.58:1).

**05 · Accessibility · Tools and Log · fixed**
The verdict pills and the phase chip were just under the minimum.
```
"likely OK" rgb(14,138,95) on rgb(230,246,238): 3.9:1
"likely high FODMAP" rgb(220,38,38) on rgb(253,236,236): 4.23:1
"Elimination" chip, white on rgb(15,143,108): 4.07:1
```
FIX: 5.62:1, 5.66:1 and 5.31:1.

**06 · Major · Tools, menu checker · fixed**
A grammar bug in the whole-menu lookup button.
```
"🔎 Look up the 1 dish that aren't flagged"
```
FIX: "1 dish that isn't flagged" / "5 dishes that aren't flagged".

**07 · Major · Today · trade-off for the owner**
Since the quote and tip moved to the top, the day's main task ("Log today") is no longer on the first screen of smaller phones.
The centre Log button in the bottom bar is always visible, so logging is still one tap away. But the card that explains the task now needs a scroll.
```
iPhone SE: "Log today" 381px below the visible area
iPhone 13: 169px below
Pixel 7: visible without scrolling
```
FIX options: keep it as is; put the tip first and the quote after the log card; or make the quote one line smaller.

**08 · Note · Today**
Two links on one screen are both called "Read more ↗" and go to different places (cdhf.ca and webkit.org). Screen-reader users who list the links can't tell them apart (SC 2.4.4 is met in context, so this is a note).

**09 · Note · Learn**
Citation links such as "[NICE]" are 27–37 × 10–12px. They're inline in sentences, so SC 2.5.8 exempts them, but they're hard to tap. "[Monash]" appears 21 times, pointing to 7 different sources.

**10 · Note · Log**
Each slider's accessible name includes its value ("Bloating 0"), so screen readers read the number twice.

**11 · Note · Tools**
Checking an empty menu shows "Choose a photo or PDF, or paste some menu text first" but leaves the previous results on screen underneath.

**12 · Note · Tools**
The heading order skips a level: the page heading is followed by "Check a food or dish" at level 3.

**13 · Note · every tab**
The "✓ Saved" chip is 76×31px at the top right (Fitts index 4.3, the hardest target on the page). It's above the 24px minimum, so it's acceptable for a status button that is rarely tapped.

## What works

- Contrast after the fixes: 2,076 text elements measured across both themes, median 13.79:1, lowest 3.6:1 (large text).
- Every form control has an accessible name (0 unnamed), with labels wrapping their inputs.
- No horizontal overflow on any tab at 390px.
- First paint 56ms on the local copy, with 10 requests and no console errors in either theme.
- One H1 per tab and landmarks present (main, nav, header).
- The first-screen choice count is in the healthy range: Today 9 interactive targets (Hick index 3.32), Tools 11, Log 14.
- Wording is consistently sentence case for labels; no ambiguous dates.

## Where to start

Findings 01–06 are already fixed. Next, by impact ÷ effort: 07 (owner decision, one-line change), 11, 10, 08, 12.
