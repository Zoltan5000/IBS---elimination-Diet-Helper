# Legal notes for the owner (privacy policy and terms drafts)

> **These are drafts and notes, not legal advice.** They're meant to save time when you meet a lawyer. Have a lawyer licensed where you live review everything before you publish final versions, and before you charge money or add accounts.

The drafts are in the app:
- [`privacy.html`](../privacy.html): Privacy Policy
- [`terms.html`](../terms.html): Terms of Use
- [`consumer-health-data.html`](../consumer-health-data.html): Consumer Health Data Privacy Policy (for Washington's My Health My Data Act)

Placeholders to fill in are in **[brackets]**: your legal name or business name, contact email, location, governing law and dates.

## 1. What the app actually does with data (checked in the code, November 2026)

| Data | Where it goes |
|---|---|
| Logs, food notes, challenge results, settings | **Browser localStorage on the user's device only** (`js/app.js`, key `ibs-helper-v2`). Never sent to the owner. |
| Backup file | Created on the device; the user chooses where to save or share it |
| App files | Cached on the device by the service worker (`sw.js`) for offline use |
| Page visits | GitHub Pages logs the visitor's IP address |
| PDF menu check | Downloads pdf.js from cdnjs (Cloudflare). The PDF is processed on the device. |
| Photo menu check | Downloads Tesseract.js and its language data from jsDelivr. The photo is processed on the device. |
| Meal ideas | **Opens** a web search in a new tab on the user's chosen search engine (Google, DuckDuckGo or Bing). The query can include foods left out (from the user's triggers). The app itself sends nothing. Pasted recipes are checked on the device. |
| Food look-ups | **Only** when the user taps *Look up*, or checks a single food the app doesn't recognise: sends the food or dish **name** to Open Food Facts (product search) and Wikipedia (article search). No logs are sent. Results are cached in localStorage (`ibs-lookup-v1`) for 7 days. Whole-menu look-ups are spaced 6.5 seconds apart, because Open Food Facts allows about 10 searches a minute. |
| "Ask Claude" options | **Only** when the page is opened on claude.ai: sends the chosen menu, or the meal request plus a summary of reintroduction results, to Anthropic through the viewer's own Claude account |
| Pixel font | **Self-hosted** (fonts/), so no requests go to Google Fonts. It's licensed under the SIL Open Font License 1.1 (fonts/OFL.txt). |

No cookies, analytics, ads, accounts or trackers.

## 2. Sources used for the drafts

Each source was found by searching the official domain shown. These are official pages, but laws change: a lawyer should confirm they're current.

### Health privacy laws and guidance
| Topic | What the source says (summary) | Source |
|---|---|---|
| **HIPAA doesn't usually cover consumer apps** | An app offered directly to consumers, not on behalf of a doctor, health plan or clearinghouse, is not likely to be a HIPAA covered entity or business associate | HHS: [Health App Use Scenarios & HIPAA (2016)](https://www.hhs.gov/sites/default/files/ocr-health-app-developer-scenarios-2-2016.pdf); [The access right, health apps & APIs](https://www.hhs.gov/hipaa/for-professionals/privacy/guidance/access-right-health-apps-apis/index.html) |
| **FTC Health Breach Notification Rule** | Updated in 2024 (in effect since July 29, 2024) to clarify that it covers health apps not covered by HIPAA. A "breach" includes unauthorized disclosures, not just hacks. | FTC: [Health Breach Notification Rule](https://www.ftc.gov/legal-library/browse/rules/health-breach-notification-rule); [2024 press release](https://www.ftc.gov/news-events/news/press-releases/2024/04/ftc-finalizes-changes-health-breach-notification-rule); [Basics for Business](https://www.ftc.gov/business-guidance/resources/health-breach-notification-rule-basics-business); [Mobile Health App Interactive Tool](https://search.ftc.gov/business-guidance/resources/mobile-health-apps-interactive-tool) |
| **Washington My Health My Data Act** | Applies to businesses that serve Washington consumers and collect, process, share or sell "consumer health data". Requires a *separate* consumer health data privacy policy, linked prominently from the homepage. Violations are enforced under the Consumer Protection Act, including private lawsuits. | Washington AG: [Protecting Washingtonians' Personal Health Data](https://www.atg.wa.gov/protecting-washingtonians-personal-health-data-and-privacy); [HB 1071 FAQ](https://www.atg.wa.gov/HB1071-FAQ) |
| **EU/UK GDPR** | Health data is a "special category" (Article 9). Processing it is prohibited unless an exception applies, and the EU Court of Justice reads "data concerning health" broadly, including inferred data. | [GDPR (EUR-Lex)](https://eur-lex.europa.eu/eli/reg/2016/679/oj/eng); [Article 9 (gdpr-info.eu)](https://gdpr-info.eu/art-9-gdpr/) |
| **Canada PIPEDA** | Applies to personal information handled in the course of commercial activity. The openness principle requires organisations to make their privacy practices readily available. | Office of the Privacy Commissioner: [PIPEDA fair information principles](https://www.priv.gc.ca/en/privacy-topics/privacy-laws-in-canada/the-personal-information-protection-and-electronic-documents-act-pipeda/p_principle/); [PIPEDA requirements in brief](https://www.priv.gc.ca/en/privacy-topics/privacy-laws-in-canada/the-personal-information-protection-and-electronic-documents-act-pipeda/pipeda_brief/) |
| **California CCPA/CPRA** | Health information is "sensitive personal information". It applies to businesses meeting thresholds, for example over $25 million in revenue (inflation-adjusted). Consumers have rights to know and to delete. | California AG: [CCPA](https://www.oag.ca.gov/privacy/ccpa); CPPA: [FAQ](https://cppa.ca.gov/faq.html) |
| **Children (COPPA)** | Applies to sites directed to children under 13, or to general-audience sites with actual knowledge they collect children's information. There's no duty to ask ages. | FTC: [Complying with COPPA FAQ](https://www.ftc.gov/business-guidance/resources/complying-coppa-frequently-asked-questions) |

### Third-party services the app uses
| Service | What the source says | Source |
|---|---|---|
| GitHub Pages | A visitor's IP address is logged and stored for security purposes, whether or not they're signed in. GitHub also says site publishers are responsible for posting an accurate privacy notice. | [What is GitHub Pages?](https://docs.github.com/en/pages/getting-started-with-github-pages/what-is-github-pages); [GitHub General Privacy Statement](https://docs.github.com/en/site-policy/privacy-policies/github-general-privacy-statement) |
| Google Fonts (no longer used) | Font requests include the visitor's IP address and browser headers; self-hosting avoids this. That's why the font is now self-hosted. | [Google Fonts privacy FAQ](https://developers.google.com/fonts/faq/privacy) |
| cdnjs (Cloudflare) | cdnjs is governed by Cloudflare's privacy policy, and Cloudflare may log IP addresses | [cdnjs](https://cdnjs.cloudflare.com/); [Cloudflare Privacy Policy](https://www.cloudflare.com/privacypolicy/) |
| jsDelivr | Processes IP addresses, browser type, referrer and visit times to deliver files and for statistics; says it doesn't sell personal data | [jsDelivr blog on IP handling](https://www.jsdelivr.com/blog/how-the-german-courts-ruling-on-google-fonts-affects-jsdelivr-and-why-it-is-safe-to-use/); [jsDelivr DPA](https://www.jsdelivr.com/documents/data-processing-agreement.pdf); [Documentation (Privacy Policy section)](https://www.jsdelivr.com/documentation) |
| TheMealDB (**no longer used**) | Removed in November 2026. Its free test key is for development only, and public or app-store apps need a paid supporter key. Meal ideas now uses a web search instead. | [API guide](https://www.themealdb.com/docs_api_guide.php); [Terms](https://www.themealdb.com/terms_of_use.php); [FAQ](https://www.themealdb.com/faq.php) |
| Search engines (Meal ideas) | The app only opens a search link; the search engine's own privacy policy applies | [Google](https://policies.google.com/privacy); [DuckDuckGo](https://duckduckgo.com/privacy); [Microsoft](https://www.microsoft.com/en-us/privacy/privacystatement) |
| Open Food Facts | Has its own privacy policy. Its search API is limited to about 10 requests per minute per IP and returns HTTP 503 when the limit is reached. Product data is under the Open Database License, so the app credits it under each look-up. | [Open Food Facts Privacy Policy](https://world.openfoodfacts.org/privacy) (title checked: "The Open Food Facts Privacy Policy"); [API documentation](https://openfoodfacts.github.io/openfoodfacts-server/api/) |
| Wikipedia (Wikimedia Foundation) | The Wikimedia privacy policy applies to API requests. Article text is CC BY-SA 4.0, so the app credits Wikipedia and links to the article. | [Wikimedia Privacy Policy](https://foundation.wikimedia.org/wiki/Special:MyLanguage/Policy:Privacy_policy) (link taken from Wikipedia's page footer; the page itself is blocked from the build environment); [CC BY-SA 4.0 text](https://en.wikipedia.org/wiki/Wikipedia:Text_of_the_Creative_Commons_Attribution-ShareAlike_4.0_International_License) |
| Anthropic (optional Claude features) | Consumer privacy practices for Claude | [Anthropic Privacy Center](https://privacy.anthropic.com/en/articles/10458704-how-does-anthropic-protect-the-personal-data-of-claude-ai-users) |

### Licenses for third-party pieces
| Item | License | Source |
|---|---|---|
| Press Start 2P font | SIL Open Font License 1.1 | `fonts/OFL.txt` (from the google/fonts repository) |
| Barlow Condensed font (headings and numbers) | SIL Open Font License 1.1 | `fonts/OFL-BarlowCondensed.txt` (from the @fontsource/barlow-condensed package; self-hosted) |
| pdf.js | Apache License 2.0 | [mozilla/pdf.js](https://github.com/mozilla/pdf.js/); [PDF.js home](https://mozilla.github.io/pdf.js/) |
| Tesseract.js | Apache License 2.0 | [LICENSE.md](https://github.com/naptha/tesseract.js/blob/master/LICENSE.md) |
| Light-bulb icon (`icons/light-bulb.png`, resized to 96px) | Flaticon free license: requires a credit line. Credit shown in Settings and in the Terms: "Light bulb icon by Magnific from Flaticon" | [Flaticon page](https://www.flaticon.com/free-icon/light-bulb_217871); image supplied by the owner |

### Content permissions
| Content | Terms | What to do |
|---|---|---|
| Alberta Health Services handout | "May be reproduced without permission for **non-profit** education purposes. This handout may not be changed without written permission" ([PDF](https://www.albertahealthservices.ca/assets/info/nutrition/if-nfs-low-fodmap-eating-form.pdf), page 7) | Fine while the app is free and non-profit. **Ask NutritionResources@albertahealthservices.ca before any commercial use.** |
| CDHF article | No reuse terms checked | Ask CDHF before commercial use |
| Michigan Medicine quotes | News article quotes, with attribution | Ask MichmedMedia@med.umich.edu before commercial use |
| Monash | "Monash University Low FODMAP Certified" is Monash's certification program; don't imply endorsement | Keep citations factual |

## 3. Open questions for a lawyer
1. **Washington My Health My Data Act:** does it apply when health data never leaves the user's device? GitHub's IP logs for a page about IBS, and searches sent to TheMealDB, might count as processing. Is the separate policy page enough, and where must it be linked?
2. **FTC Health Breach Notification Rule:** does the app count as a "vendor of personal health records" if the owner never holds any data? What would change if sync or accounts are added later?
3. **Medical device rules** (FDA in the US, Health Canada): does the menu checker or diet score cross from "general wellness or education" into regulated software?
4. **The "Ask Claude" features:** is the disclosure enough, given they send health-related prompts to Anthropic?
5. **Governing law, liability caps and dispute resolution** for where you live.
6. **Trademark:** is "IBS Domination" available, and should you register it?
7. **App license:** the repository has no LICENSE file yet, so by default nobody else may reuse the code. Choose one: keep it private, or pick an open-source license.

## 4. Before charging money or going public
- [ ] Fill in all [placeholders] in the three pages
- [ ] Lawyer review
- [x] ~~TheMealDB production key~~: no longer needed, since Meal ideas now uses a web search
- [ ] Check each search engine's terms on linking to search results (normally allowed)
- [ ] Written permission from AHS and CDHF for commercial use
- [x] Add the Flaticon credit line once the icon is added
- [ ] Choose a LICENSE for the code
