/*
 * Builds docs/FOOD_LIST.md from js/fodmap-data.js, so the document always
 * matches what the app uses. Run: node scripts/build-food-list.js
 */
'use strict';
var path = require('path'), fs = require('fs');
global.window = {};
require(path.join(__dirname, '..', 'js', 'fodmap-data.js'));
var F = window.FODMAP;

var SRC = {
  C: '[CDHF](https://cdhf.ca/en/understanding-the-fodmap-diet/)',
  A: '[AHS](https://www.albertahealthservices.ca/assets/info/nutrition/if-nfs-low-fodmap-eating-form.pdf)',
  M: '[Michigan](https://myginutrition.com/)',
  N: '[Monash](https://www.monashfodmap.com/about-fodmap-and-ibs/high-and-low-fodmap-foods/)'
};
var LEVEL = {
  high: 'High',
  serve: 'Amount matters',
  usually: 'Usually made with a high-FODMAP ingredient (app inference)',
  often: 'Often made with a high-FODMAP ingredient (app inference)'
};
function tags(src) {
  if (!src || src === 'app') return 'App inference';
  return src.split('').map(function (c) { return 'C A M N'.indexOf(c) !== -1 ? c : ''; }).filter(Boolean).join(', ');
}
function groups(g) { return g.split('|').map(function (x) { return F.GROUPS[x].name; }).join('; '); }
function cell(s) { return String(s || '').replace(/\|/g, '/'); }

var out = [];
out.push('# Master food list');
out.push('');
out.push('This is the list the app uses to check menus, score your daily food log and filter meal ideas. It is generated from `js/fodmap-data.js` by `scripts/build-food-list.js`, so it always matches the app.');
out.push('');
out.push('## Where these foods come from');
out.push('');
out.push('| Tag | Source | Who wrote it | Date | How it was checked |');
out.push('|---|---|---|---|---|');
out.push('| **C** | Canadian Digestive Health Foundation, [Understanding the Low FODMAP Diet: Foods, Phases and Tips for Managing IBS](https://cdhf.ca/en/understanding-the-fodmap-diet/) | Kelsey Moore, BSc, RD, and Andrea Senchuk, RD (registered dietitians) | Updated June 10, 2026 | Full text supplied by the project owner and read in full |');
out.push('| **A** | Alberta Health Services, [Low FODMAP Eating](https://www.albertahealthservices.ca/assets/info/nutrition/if-nfs-low-fodmap-eating-form.pdf) (handout 404120-NFS) | AHS Nutrition Services registered dietitians | December 2017 | Full PDF supplied by the project owner and read in full |');
out.push('| **M** | Michigan Medicine, MyGINutrition [High FODMAP Foods](https://myginutrition.com/downloads/High_FODMAP_foods.pdf) and [Low FODMAP Foods](https://myginutrition.com/downloads/Low_FODMAP_foods.pdf) | University of Michigan gastroenterology team | Undated; probably roughly 10 years old | Both PDFs downloaded and read in full (November 4, 2026). Their FODMAP-group columns are graphics, so the groups come from the other sources |');
out.push('| **N** | Monash University, [High and low FODMAP foods](https://www.monashfodmap.com/about-fodmap-and-ibs/high-and-low-fodmap-foods/) | Monash University Department of Gastroenterology | Page copyright 2019 | Page downloaded and read in full (November 4, 2026). It names the main FODMAP group for each food group |');
out.push('');
out.push('**Honesty notes**');
out.push('- All four sources were read in full. A food is tagged with every source that lists it. Serving sizes are as each source gives them.');
out.push('- None of these are university research papers or journals. CDHF is a national charity, AHS is a provincial public health authority, and Michigan Medicine and Monash are university health organizations. All four are written by registered dietitians or university clinicians for patients.');
out.push('- The sources are different ages: CDHF was updated in 2026, AHS is from 2017, the Monash page is from 2019, and the Michigan lists are undated (probably older). Monash retested many foods in 2025. CDHF, AHS and Monash all say the Monash FODMAP app has the most current data.');
out.push('- A food is shown as a good choice, with its amount, when every source that lists it gives a low-FODMAP serving, even if one source says *more* than that is high (for example broccoli: Michigan says more than ½ cup is high). It is flagged "amount matters" when a source lists it as high without a serving size, or the sources disagree.');
out.push('- **App inference** means no source lists that word. These are dishes or products the app flags because they are *usually* or *often* made with an ingredient the sources list as high (for example, bread is usually made with wheat). The app always labels these as its own guess.');
out.push('- **Amount matters** means a source gives a low-FODMAP serving, or the sources disagree. The note explains which.');
out.push('');

var byLevel = { high: [], serve: [], usually: [], often: [] };
F.FOODS.forEach(function (f) { byLevel[f[2]].push(f); });
[['high', 'High-FODMAP foods'], ['serve', 'Amount matters (a low-FODMAP serving exists, or the sources disagree)'],
 ['usually', 'Usually made with a high-FODMAP ingredient (app inference)'], ['often', 'Often made with a high-FODMAP ingredient (app inference)']].forEach(function (sec) {
  var list = byLevel[sec[0]].slice().sort(function (a, b) { return a[0].localeCompare(b[0]); });
  out.push('## ' + sec[1] + ' (' + list.length + ')');
  out.push('');
  out.push('| Food word | FODMAP group | Sources | Notes |');
  out.push('|---|---|---|---|');
  list.forEach(function (f) { out.push('| ' + cell(f[0]) + ' | ' + cell(groups(f[1])) + ' | ' + tags(f[3]) + ' | ' + cell(f[4]) + ' |'); });
  out.push('');
});

var good = F.GOOD.slice().sort(function (a, b) { return a[0].localeCompare(b[0]); });
out.push('## Low-FODMAP foods (' + good.length + ')');
out.push('');
out.push('Used to praise good choices in the daily review. Serving sizes are the low-FODMAP amounts the sources give; more than that can be high. Meat, poultry, fish, seafood, eggs and fats such as oil, butter and ghee contain no FODMAPs (CDHF, AHS).');
out.push('');
out.push('| Food word | Low-FODMAP serving | Sources |');
out.push('|---|---|---|');
good.forEach(function (g) { out.push('| ' + cell(g[0]) + ' | ' + cell(g[1]) + ' | ' + tags(g[2]) + ' |'); });
out.push('');
out.push('## Where the sources disagree');
out.push('');
out.push('| Food | What the sources say | What the app does |');
out.push('|---|---|---|');
[['Grapes', 'CDHF and AHS: high in excess fructose. Michigan\'s low list includes grapes.', 'Amount matters: flagged as "ask or modify"'],
 ['Asparagus', 'CDHF and Monash: high. AHS: 3 spears are low.', 'Amount matters'],
 ['Red bell pepper', 'CDHF: red, yellow and orange are high. AHS: 1 cup red is low.', 'Amount matters'],
 ['Brussels sprouts', 'CDHF: high. AHS: 4 sprouts are low.', 'Amount matters'],
 ['Honeydew', 'CDHF: high. AHS: ½ cup is low.', 'Amount matters'],
 ['Cow\'s milk', 'CDHF, Michigan, Monash: high. AHS: ¼ cup is low.', 'Amount matters'],
 ['Yogurt', 'CDHF, Michigan, Monash: high. AHS: ½ cup is low.', 'Amount matters'],
 ['Cottage cheese', 'CDHF, Michigan: high. AHS: ½ cup is low.', 'Amount matters'],
 ['Banana', 'CDHF: ripe is high, firm is low. AHS: 1 medium is low. Monash: firm is low.', 'Amount matters'],
 ['Celery, corn, snow peas', 'CDHF: high. AHS (and Michigan for corn and snow peas) give small low serves.', 'Amount matters'],
 ['Sweet potato', 'AHS: high in mannitol. CDHF: ⅓ cup is low.', 'Amount matters'],
 ['Potato', 'All list it as low, but CDHF says ¼ cup and AHS says 1 cup.', 'Praised as a good choice; both serving sizes shown'],
 ['Blueberries', 'All list them as low, but AHS says ⅓ cup and CDHF says 1 cup.', 'Praised as a good choice; both serving sizes shown'],
 ['Seitan', 'Made from wheat. AHS: 2 Tbsp is low. Michigan lists it as a protein source.', 'Amount matters'],
 ['Corn syrup', 'CDHF: high in fructans. Michigan: low.', 'Amount matters'],
 ['Molasses', 'Michigan: high. AHS: 1 Tbsp is low.', 'Amount matters'],
 ['Rice milk', 'Michigan: high. Monash: low.', 'Amount matters'],
 ['Soy milk', 'Made from whole soybeans: high (CDHF, Michigan, Monash). Made from soy protein: low (Monash).', 'Amount matters, with both explained'],
 ['Red bell pepper (update)', 'CDHF and Monash: high. Michigan and AHS (1 cup): low.', 'Amount matters'],
 ['Pumpkin', 'CDHF: high. Michigan: less than ½ cup canned is low.', 'Amount matters'],
 ['Erythritol', 'Michigan lists it on both its high and low lists. Monash names it among the sugar polyols.', 'Amount matters'],
 ['Soda / cola', 'CDHF: regular and diet cola are high. AHS: glucose-fructose sodas are high. Michigan: 8 oz diet or sugar-sweetened soda is low.', 'Amount matters'],
 ['Barbecue sauce', 'Monash: low. (The app used to guess it was often made with onion.)', 'No longer flagged; praised as a low choice']
].forEach(function (r) { out.push('| ' + r.join(' | ') + ' |'); });
out.push('');
fs.writeFileSync(path.join(__dirname, '..', 'docs', 'FOOD_LIST.md'), out.join('\n'));
console.log('Wrote docs/FOOD_LIST.md: ' + F.FOODS.length + ' flagged words, ' + good.length + ' low-FODMAP words');
