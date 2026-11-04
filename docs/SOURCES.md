# Source verification log

Last checked: **November 4, 2026**

Every fact in IBS Domination that cites a source was checked three ways before it went into the app:

1. **The record:** the source's official listing (PubMed, or the organization's own site), confirming the title, authors, journal and year.
2. **A second listing:** the publisher's or organization's own page, confirming the record and the link the app uses.
3. **The claim:** the specific statement the app makes, found in that source (abstract, guideline text, or page).

A source or claim that failed any check was corrected or removed (see the end of this file).

> **How the checks were done:** the build environment couldn't open these sites directly, so each check used web searches restricted to the official domain (for example `pubmed.ncbi.nlm.nih.gov`, `journals.lww.com`, `nice.org.uk`, `monashfodmap.com`). Before publishing widely, someone should open each "Read more" link and confirm it once more by hand.

## Clinical guidelines

### ACG Clinical Guideline: Management of Irritable Bowel Syndrome (2021)
Lacy BE, Pimentel M, Brenner DM, et al. *Am J Gastroenterol.* 2021;116(1):17–44. doi:10.14309/ajg.0000000000001036
- Record: [PubMed 33315591](https://pubmed.ncbi.nlm.nih.gov/33315591/) ✓
- Second listing: [journal full text](https://journals.lww.com/ajg/fulltext/10.14309/ajg.0000000000001036~acg-clinical-guideline-management-of-irritable-bowel) and the January 2021 issue contents ✓
- Claims ✓:
  - Recommends a *limited trial* of a low FODMAP diet; the evidence is rated very low quality
  - Suggests celiac blood tests for people with IBS and diarrhea
  - Prefers soluble fiber (such as psyllium) over insoluble fiber (such as wheat bran)
  - Suggests *against* probiotics for overall IBS symptoms
  - Suggests gut-directed psychotherapy
  - Alarm features: rectal bleeding, unintentional weight loss, iron-deficiency anemia, and a family history of colorectal cancer, IBD or celiac disease. Sources disagree on the age cut-off for "new symptoms at an older age" (45 or 50), so the app says "later in life" without a number.

### NICE CG61: Irritable bowel syndrome in adults (last updated 2017)
- Record: [nice.org.uk/guidance/cg61](https://www.nice.org.uk/guidance/cg61) ✓
- Second listing: [Recommendations chapter](https://www.nice.org.uk/guidance/cg61/chapter/Recommendations), [public information page](https://www.nice.org.uk/guidance/cg61/ifp/chapter/managing-irritable-bowel-syndrome), and the NCBI Bookshelf addendum ✓
- Claims ✓:
  - Assess everyone for "red flag" indicators and refer if present (the current version points to NICE's suspected-cancer guideline, plus inflammatory markers for IBD). The original list included unexplained weight loss, rectal bleeding, a family history of bowel or ovarian cancer, and a lasting change to looser or more frequent stools.
  - Diet and lifestyle advice: regular meals, take time to eat, don't skip meals, at least 8 cups of fluid a day, tea and coffee limited to 3 cups, less alcohol and fewer fizzy drinks, fresh fruit limited to 3 portions a day
  - Further diet advice, such as low FODMAP, should come from a healthcare professional with dietary expertise

### Canadian Association of Gastroenterology IBS guideline
- Record: [PubMed 31294724](https://pubmed.ncbi.nlm.nih.gov/31294724/) ✓
- Second listing: [PMC full text](https://pmc.ncbi.nlm.nih.gov/articles/PMC6507291/) ✓
- Claim ✓: suggests a low FODMAP diet trial and advises *against* a gluten-free diet for IBS (conditional recommendation, very low-quality evidence)

### ACG Guidelines Update: Diagnosis and Management of Celiac Disease (2023)
Rubio-Tapia A, et al. *Am J Gastroenterol.* 2023;118(1):59–76
- Record: [PubMed 36602836](https://pubmed.ncbi.nlm.nih.gov/36602836/) ✓
- Second listing: [journal full text](https://journals.lww.com/ajg/fulltext/2023/01000/american_college_of_gastroenterology_guidelines.17.aspx) and [gi.org](http://gi.org/guideline/diagnosis-and-management-of-celiac-disease/) ✓
- Claim ✓: diagnostic testing should be done while eating gluten. For people already gluten-free, HLA testing comes first, then a supervised gluten challenge.

### BSG guidelines on the management of IBS (2021): further reading only
Vasant DH, Paine PA, Black CJ, et al. *Gut.* 2021;70:1214–1240
- Record: [PubMed 33903147](https://pubmed.ncbi.nlm.nih.gov/33903147/) ✓ (citation confirmed in several reference lists)
- Second listing: [BSG guideline page](https://www.bsg.org.uk/clinical-resource/british-society-of-gastroenterology-guidelines) ✓
- Claims **not confirmed three times**: "low FODMAP is second-line and should be supervised by a trained dietitian" and "a gluten-free diet is not recommended". Only one check matched each, so the app now credits NICE and the Canadian guideline for these points. BSG is listed as further reading.

## University research

### Monash University (developers of the low FODMAP diet)
| Page | Claims ✓ |
|---|---|
| [The 3 steps of the FODMAP diet](https://www.monashfodmap.com/blog/3-phases-low-fodmap-diet/) + [2026 info sheet](https://monashfodmap.com/documents/203/3-step_FODMAP_Diet_2026_A4_info_sheet.pdf) + [Monash Lens history](https://lens.monash.edu/20-years-of-fodmap-the-monash-discovery-that-revolutionised-ibs-care/) | Three steps (restriction, reintroduction, personalisation); restriction lasts 2–6 weeks; swap foods rather than cut out food groups; reintroduction takes about 6–8 weeks (blog) to 8–12 weeks (info sheet), shown in the app as "about 6 to 12 weeks" |
| [Practical tips for reintroduction](https://www.monashfodmap.com/blog/practical-tips-fodmap-reintroduction/), [diary function](https://www.monashfodmap.com/blog/reintroduction-using-diary-function/), [interpreting challenges](https://www.monashfodmap.com/blog/interpreting-reintroduction-challenges/) | Test one group at a time with a food that mainly contains that FODMAP (for example, mango for fructose); Day 1 moderate serve, Day 2 high serve, Day 3 higher or usual serve; a challenge is passed with no symptoms or only minor ones; return to low FODMAP for a few days between challenges |
| [Reintroduction update (2025)](https://www.monashfodmap.com/blog/reintroduction-update/) | Challenge foods and serve sizes were revised in April 2025 |
| [Serving size and FODMAPs](https://www.monashfodmap.com/blog/serving-size-and-fodmaps-why-it-so-important/) | Many foods are low FODMAP in small serves and high in large ones |
| [Garlic and onion infused oils](https://www.monashfodmap.com/blog/all-about-onion-garlic-and-infused-oils-on-the-low-fodmap-diet/) + [FAQ](http://www.monashfodmap.com/about-fodmap-and-ibs/frequently-asked-questions/) + Monash recipes | Fructans dissolve in water but not in fat, so infused oil is low FODMAP; remove the garlic pieces |
| [About FODMAPs and IBS](https://www.monashfodmap.com/about-fodmap-and-ibs/) + [Monash research page](https://monashfodmap.com/about-fodmap-and-ibs/research-monash-university/) | FODMAPs are poorly absorbed, draw water into the bowel, and are fermented by gut bacteria into gas, which stretches the bowel and triggers symptoms |
| [Not a lifetime diet](https://www.monashfodmap.com/blog/low-fodmap-diet-not-lifetime-diet/) | Strict low FODMAP isn't meant to be followed long-term |

### Halmos et al., *Gastroenterology* 2014 (Monash University)
Halmos EP, Power VA, Shepherd SJ, Gibson PR, Muir JG. A diet low in FODMAPs reduces symptoms of irritable bowel syndrome. 2014;146(1):67–75
- Record: [PubMed 24076059](https://pubmed.ncbi.nlm.nih.gov/24076059/) ✓
- Second listing: [Monash research portal](https://research.monash.edu/en/publications/a-diet-low-in-fodmaps-reduces-symptoms-of-irritable-bowel-syndrom/) and the [journal PDF](https://www.gastrojournal.org/article/s0016-5085(13)01407-8/pdf) ✓
- Claim ✓: in a controlled crossover trial, overall symptom scores were lower on the low FODMAP diet than on a typical Australian diet (22.8 vs 44.9 mm, P < .001)

### Staudacher et al., *J Nutr* 2012 (King's College London)
Fermentable carbohydrate restriction reduces luminal bifidobacteria and gastrointestinal symptoms in patients with IBS. 2012;142(8):1510–1518
- Record: [PubMed 22739368](https://pubmed.ncbi.nlm.nih.gov/22739368/) ✓
- Second listing: [ScienceDirect](https://www.sciencedirect.com/science/article/pii/S0022316622027122) ✓
- Claim ✓: 4 weeks of restriction lowered the concentration and proportion of bifidobacteria

### Eswaran et al., *Clin Gastroenterol Hepatol* 2025 (University of Michigan)
All FODMAPs Aren't Created Equal: Results of a Randomized Reintroduction Trial in Patients With IBS. 2025;23(2):351–358
- Record: [PubMed 38729390](https://pubmed.ncbi.nlm.nih.gov/38729390/) ✓
- Second listing: [CGH journal PDF](https://www.cghjournal.org/article/S1542-3565(24)00413-0/pdf) and [ClinicalTrials.gov NCT03052439](https://clinicaltrials.gov/study/NCT03052439) ✓
- Claim ✓: fructans (P = .007) and GOS (P = .04) were associated with worse abdominal pain

### Lewis & Heaton, *Scand J Gastroenterol* 1997 (Bristol Stool Form Scale)
Stool form scale as a useful guide to intestinal transit time. 1997;32(9):920–924. [doi:10.3109/00365529709011203](https://doi.org/10.3109/00365529709011203)
- Record and second listing: the citation and DOI were confirmed in multiple citing papers, and the scale runs from type 1 (hard lumps) to type 7 (liquid) ✓
- Claim ✓: types 3 and 4 are generally seen as the ideal range (an NHS dietetics leaflet and peer-reviewed reviews). Note that some frameworks also count type 5 as normal.

## Government health information

### NIH / NIDDK: Eating, Diet, & Nutrition for IBS
- Record: [niddk.nih.gov page](https://www.niddk.nih.gov/health-information/digestive-diseases/irritable-bowel-syndrome/eating-diet-nutrition) ✓
- Second listing: the NIDDK [IBS overview](https://www.niddk.nih.gov/health-information/digestive-diseases/irritable-bowel-syndrome) and [treatment](https://www.niddk.nih.gov/health-information/digestive-diseases/irritable-bowel-syndrome/treatment) pages ✓
- Claims ✓: add fiber slowly, 2 to 3 grams a day, to prevent gas and bloating; a doctor may suggest trying a low FODMAP diet for a few weeks

## App data (not medical)
- Safari's 7-day limit on website storage, and the home-screen exemption: [WebKit blog (2020)](https://webkit.org/blog/10218/full-third-party-cookie-blocking-and-more/), [WebKit tracking prevention](https://webkit.org/tracking-prevention/), and WebKit bug reports ✓

## Corrected or removed after checking
| Previously in the app | What changed |
|---|---|
| "In a University of Michigan study, patients reacted to an average of two groups" | **Removed.** This couldn't be found in the published trial. It was replaced with the verified finding about fructans and GOS. |
| Red flags: "symptoms that started after age 50", "fever, symptoms that wake you at night", "family history of celiac disease" | **Corrected** to the NICE and ACG lists. The age number was removed because sources disagree. |
| NIDDK: "write down what you eat… share with your doctor" | **Removed.** That advice is on NIDDK's *gas* page, not its IBS page. |
| NIDDK: "several smaller meals may help" | **Removed.** It came from an archived 2012 page and isn't on the current site. It was replaced with NICE's regular-meals advice. |
| "Return to strict low FODMAP for 2–3 days" between challenges | **Corrected** to "a few days, until symptoms settle". Monash gives no fixed number. |
| Reintroduction "8 to 12 weeks" | **Corrected** to "about 6 to 12 weeks", to cover both Monash figures. |
| BSG credited for dietitian supervision and the gluten-free advice | **Changed** to NICE and the Canadian guideline. The BSG wording couldn't be confirmed three times. |
| ACG credited for "long-term restriction reduces gut bacteria" | **Changed** to Staudacher 2012, the primary study. |
| "Fatty meals" in the NICE drinks-and-meals advice | **Removed.** It wasn't in the verified NICE text. |
| "Spread fruit out: one serve per meal" tip | **Changed** to NICE's "about 3 portions a day". |
| "Spread fruit out" in Learn, Phase 1 | **Changed** to NICE's "about 3 portions a day". |
| NIDDK credited for "rule out other conditions first" | **Changed** to NICE and ACG. |
| Monash app has serving sizes for "thousands of foods" | **Removed** the number, which wasn't verified. |
| NICE first-line advice included "gradual soluble fiber" | **Removed.** It wasn't in the verified NICE text. Fiber advice is credited to ACG and NIDDK instead. |
| BSG credited alongside ACG in several places | **Removed.** Only verified sources are cited. |

## Not yet verified (please review)
- **The BSG 2021 abstract wording**, listed above as further reading.
- **Example challenge amounts** (for example ½ cup of milk on Day 1). The app labels these as examples and tells users to check the Monash app, because Monash revised its amounts in 2025.
- **The food keyword lists** used by the menu checker and diet score (`js/fodmap-data.js`). These follow Monash's food groupings but weren't checked food by food.
- **The book quotes** on the Today screen. These are from public-domain classics; check them against the original texts.
- **Tips without a "Read more" link** (for example "hard cheeses are low in lactose"). These are general knowledge and don't cite a source.
