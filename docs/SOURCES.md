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

### BSG guidelines on the management of IBS (2021)
Vasant DH, Paine PA, Black CJ, et al. *Gut.* 2021;70:1214–1240. doi:10.1136/gutjnl-2021-324598
- Record: [PubMed 33903147](https://pubmed.ncbi.nlm.nih.gov/33903147/) ✓ (citation confirmed in several reference lists)
- Second listing: [BSG guideline page](https://www.bsg.org.uk/clinical-resource/british-society-of-gastroenterology-guidelines) and the [Gut full text](https://gut.bmj.com/content/70/7/1214.long) ✓
- Claims ✓: **confirmed by the project owner reading the full text on November 4, 2026:**
  - "First-line dietary advice should be offered to all patients with IBS" (strong; quality of evidence weak)
  - "Food elimination diets based on IgG antibodies are not recommended" (strong; moderate)
  - Soluble fibre such as ispaghula is effective, while insoluble fibre (such as wheat bran) "should be avoided as it may exacerbate symptoms". Soluble fibre should start "at a low dose (3–4 g/day)" and be built up gradually (strong; moderate).
  - Low FODMAP is "a second-line dietary therapy" whose "implementation should be supervised by a trained dietitian", with FODMAPs "reintroduced according to tolerance" (weak; very low)
  - "A gluten-free diet is not recommended in IBS" (weak; very low). The guideline also says any benefit may come mainly from "a reduction in dietary fructan content" rather than from removing gluten.
  - A low FODMAP diet needs close monitoring "to avoid nutritional deficiencies or the development of overly restrictive eating habits", and the guideline recommends screening high-risk patients (for example with the SCOFF questionnaire) before starting.
  - A low FODMAP diet may reduce Bifidobacteria and total bacterial count, and "the long-term consequences of this are unknown".

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

## Independent trials and reviews (beyond Monash)

### Staudacher et al., *Gastroenterology* 2017 (King's College London)
A diet low in FODMAPs reduces symptoms in patients with IBS and a probiotic restores Bifidobacterium species. 2017;153:936–947
- Record: [PubMed 28625832](https://pubmed.ncbi.nlm.nih.gov/28625832/) ✓
- Second listing: [Gastroenterology full text](https://www.gastrojournal.org/article/S0016-5085(17)35744-X/fulltext) and the [King's College London repository](https://kclpure.kcl.ac.uk/ws/files/75711310/Diet_Low_in_FODMAPs_STAUDACHER_Publishedonline15June2017_GREEN_AAM_CC_BY_NC_ND_.pdf) ✓
- Claim ✓: blinded, sham-diet-controlled trial. In the per-protocol analysis (people who completed the trial), 61% on low FODMAP reported adequate relief vs 39% on the sham diet (P = .042). The app says "people who completed".

### Eswaran et al., *Am J Gastroenterol* 2016 (University of Michigan)
A randomized controlled trial comparing the low FODMAP diet vs. modified NICE guidelines in US adults with IBS-D. 2016;111(12):1824–1832
- Record: [journal abstract](https://journals.lww.com/ajg/abstract/2016/12000/a_randomized_controlled_trial_comparing_the_low.31.aspx) ✓ (the citation is also confirmed in several PubMed reference lists; the PubMed record itself didn't come up in search)
- Second listing: [Michigan Medicine news release](https://www.michiganmedicine.org/health-lab/clinical-trial-demonstrates-success-low-fodmap-diet) ✓
- Claim ✓: the primary composite endpoint didn't differ (P = .13); low FODMAP gave greater reductions in pain, bloating and urgency; 40–50% reported adequate relief with either diet. The news release's "20% of controls" figure wasn't confirmed, so the app doesn't use it.

### Böhn et al., *Gastroenterology* 2015 (University of Gothenburg)
Diet low in FODMAPs reduces symptoms of IBS as well as traditional dietary advice. 2015;149(6):1399–1407
- Record: [PubMed 26255043](https://pubmed.ncbi.nlm.nih.gov/26255043/) ✓
- Second listing: the [Gastroenterology issue contents](https://www.gastrojournal.org/issue/S0016-5085(15)X0012-6) and [trial registry NCT02107625](https://clinicaltrials.gov/study/NCT02107625) (Göteborg University) ✓
- Claim ✓: 50% (low FODMAP) vs 46% (traditional advice) responded after 4 weeks (P = .72), with no evidence that low FODMAP was superior

### Rej et al., *Clin Gastroenterol Hepatol* 2022 (University of Sheffield)
Efficacy and acceptability of dietary therapies in non-constipated IBS: traditional dietary advice vs low FODMAP vs gluten-free. 2022;20(12):2876–2887. PMID 35240330
- Record: [PubMed 35240330](https://pubmed.ncbi.nlm.nih.gov/35240330/) ✓ (PMID and DOI 10.1016/j.cgh.2022.02.045 confirmed via a PubMed reference listing)
- Second listing: [CGH journal PDF](https://www.cghjournal.org/article/S1542-3565(22)00202-6/pdf), [White Rose repository](https://eprints.whiterose.ac.uk/id/eprint/184498/) and [ClinicalTrials.gov NCT04072991](https://clinicaltrials.gov/study/NCT04072991) ✓
- Claim ✓: no difference in response between the three diets; traditional advice was easier and cheaper to follow (the authors' conclusion, plus a UK consensus summary)

### Black, Staudacher & Ford, *Gut* 2022 (University of Leeds)
Efficacy of a low FODMAP diet in IBS: systematic review and network meta-analysis. 2022;71(6):1117–1126
- Record: [White Rose university repository](https://eprints.whiterose.ac.uk/id/eprint/182000/) with the [accepted manuscript](https://eprints.whiterose.ac.uk/id/eprint/182000/3/gutjnl-2021-325214R2%20CLEAN.pdf) ✓
- Second listing: the citation (Gut 2022;71:1117–1126) confirmed in several PubMed and PMC reference lists ✓
- Claim ✓: low FODMAP ranked first for all endpoints studied, including global symptoms, abdominal pain and bloating. For bowel habit it ranked first but wasn't statistically superior, so the app mentions only symptoms, pain and bloating.

### Michigan Medicine Health Lab: "The Low FODMAP Diet: A 'Liberating' Route to IBS Relief"
University of Michigan's academic medical center; interview with gastroenterologist Shanti Eswaran, MD (about 2017–2018)
- Record: [the article on michiganmedicine.org](https://www.michiganmedicine.org/health-lab/low-fodmap-diet-liberating-route-ibs-relief), found by a search of the official domain ✓
- Second listing: the same link was supplied by the project owner, and the article describes Eswaran's US trial, which matches the verified Eswaran 2016 study above ✓
- Claims ✓: the quote "At first, the diet is very restrictive… once patients go through the process and discover what they can and can't eat, they actually find it liberating"; the elimination phase "is restrictive and not nutritionally complete"; dietitian guidance makes it safest. This is a news article, so it's used for context and quotes, not for research findings.

### Considered but not included
- **Dionne et al., *Am J Gastroenterol* 2018** (McMaster University meta-analysis of gluten-free and low FODMAP diets). The record was confirmed, but its findings were confirmed only once, so it isn't cited.

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
| BSG credited for dietitian supervision and the gluten-free advice | **Changed** to NICE and the Canadian guideline until the BSG wording was confirmed. **BSG reinstated** after the owner checked the full text, which also added: soluble fibre starting at 3–4 g/day, avoiding wheat bran, no IgG food tests, and eating-disorder screening. |
| Specific challenge amounts (for example "½ cup milk on Day 1") | **Removed.** They weren't from a verified source. The app now uses Monash's verified structure (moderate serve, then a larger serve, then your usual amount) and tells people to ask their dietitian for exact amounts. |
| "Mango or honey" for the fructose test | **Changed** to mango only, which is Monash's verified example. |
| ACG credited for "long-term restriction reduces gut bacteria" | **Changed** to Staudacher 2012, the primary study. |
| "Fatty meals" in the NICE drinks-and-meals advice | **Removed.** It wasn't in the verified NICE text. |
| "Spread fruit out: one serve per meal" tip | **Changed** to NICE's "about 3 portions a day". |
| "Spread fruit out" in Learn, Phase 1 | **Changed** to NICE's "about 3 portions a day". |
| NIDDK credited for "rule out other conditions first" | **Changed** to NICE and ACG. |
| Monash app has serving sizes for "thousands of foods" | **Removed** the number, which wasn't verified. |
| NICE first-line advice included "gradual soluble fiber" | **Removed.** It wasn't in the verified NICE text. Fiber advice is credited to ACG and NIDDK instead. |
| BSG credited alongside ACG in several places | **Removed.** Only verified sources are cited. |

## About the Monash FODMAP app
The Monash University FODMAP Diet app is made by the Monash department that developed the diet, but it's a paid app that couldn't be checked for this project. So the app is **not used as a source of facts**. IBS Domination cites only Monash's public university web pages, which passed all three checks, and mentions the app only as an optional food guide. Exact serving sizes are left to each person's dietitian.

## Not yet verified (please review)
- **Example test foods** other than mango (milk, mushrooms, wheat bread, garlic, onion, lentils). These are labeled as common examples, and the app tells people to confirm them with their dietitian.
- **The food keyword lists** used by the menu checker and diet score (`js/fodmap-data.js`). These follow Monash's food groupings but weren't checked food by food.
- **The book quotes** on the Today screen. These are from public-domain classics; check them against the original texts.
- **Tips without a "Read more" link** (for example "hard cheeses are low in lactose"). These are general knowledge and don't cite a source.
