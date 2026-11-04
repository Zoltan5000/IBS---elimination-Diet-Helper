# Master food list

This is the list the app uses to check menus, score your daily food log and filter meal ideas. It is generated from `js/fodmap-data.js` by `scripts/build-food-list.js`, so it always matches the app.

## Where these foods come from

| Tag | Source | Who wrote it | Date | How it was checked |
|---|---|---|---|---|
| **C** | Canadian Digestive Health Foundation, [Understanding the Low FODMAP Diet: Foods, Phases and Tips for Managing IBS](https://cdhf.ca/en/understanding-the-fodmap-diet/) | Kelsey Moore, BSc, RD, and Andrea Senchuk, RD (registered dietitians) | Updated June 10, 2026 | Full text supplied by the project owner and read in full |
| **A** | Alberta Health Services, [Low FODMAP Eating](https://www.albertahealthservices.ca/assets/info/nutrition/if-nfs-low-fodmap-eating-form.pdf) (handout 404120-NFS) | AHS Nutrition Services registered dietitians | December 2017 | Full PDF supplied by the project owner and read in full |
| **M** | Michigan Medicine, MyGINutrition [High FODMAP Foods](https://myginutrition.com/downloads/High_FODMAP_foods.pdf) and [Low FODMAP Foods](https://myginutrition.com/downloads/Low_FODMAP_foods.pdf) | University of Michigan gastroenterology team | Undated; probably roughly 10 years old | Both PDFs downloaded and read in full (November 4, 2026). Their FODMAP-group columns are graphics, so the groups come from the other sources |
| **N** | Monash University, [High and low FODMAP foods](https://www.monashfodmap.com/about-fodmap-and-ibs/high-and-low-fodmap-foods/) | Monash University Department of Gastroenterology | Page copyright 2019 | Page downloaded and read in full (November 4, 2026). It names the main FODMAP group for each food group |

**Honesty notes**
- All four sources were read in full. A food is tagged with every source that lists it. Serving sizes are as each source gives them.
- None of these are university research papers or journals. CDHF is a national charity, AHS is a provincial public health authority, and Michigan Medicine and Monash are university health organizations. All four are written by registered dietitians or university clinicians for patients.
- The sources are different ages: CDHF was updated in 2026, AHS is from 2017, the Monash page is from 2019, and the Michigan lists are undated (probably older). Monash retested many foods in 2025. CDHF, AHS and Monash all say the Monash FODMAP app has the most current data.
- A food is shown as a good choice, with its amount, when every source that lists it gives a low-FODMAP serving, even if one source says *more* than that is high (for example broccoli: Michigan says more than ½ cup is high). It is flagged "amount matters" when a source lists it as high without a serving size, or the sources disagree.
- **App inference** means no source lists that word. These are dishes or products the app flags because they are *usually* or *often* made with an ingredient the sources list as high (for example, bread is usually made with wheat). The app always labels these as its own guess.
- **Amount matters** means a source gives a low-FODMAP serving, or the sources disagree. The note explains which.

## High-FODMAP foods (119)

| Food word | FODMAP group | Sources | Notes |
|---|---|---|---|
| agave | Fructose | C, A, M |  |
| all-purpose flour | Fructans (wheat, rye, barley) | M |  |
| apple | Fructose; Sorbitol (a polyol) | C, A, M, N |  |
| apple juice | Fructose; Sorbitol (a polyol) | C, A, N |  |
| applesauce | Fructose; Sorbitol (a polyol) | A |  |
| apricot | Fructans (other fruits and vegetables); Sorbitol (a polyol) | C, A, M |  |
| artichoke | Fructans (other fruits and vegetables) | C, A, M, N |  |
| baked bean | GOS (legumes, some nuts) | C, M, N |  |
| barley | Fructans (wheat, rye, barley); GOS (legumes, some nuts) | C, A, M, N |  |
| black bean | GOS (legumes, some nuts); Fructans (other fruits and vegetables) | C, A |  |
| blackberries | Sorbitol (a polyol) | C, A, M |  |
| blackberry | Sorbitol (a polyol) | C, A, M |  |
| borlotti | GOS (legumes, some nuts) | C |  |
| bortolotti | GOS (legumes, some nuts) | C |  |
| boysenberry | FODMAPs (type not given by the sources) | M |  |
| bulgur | Fructans (wheat, rye, barley) | M |  |
| cappuccino | Lactose | C | espresso drinks with cow's milk (CDHF) |
| carob | FODMAPs (type not given by the sources) | M |  |
| cashew | GOS (legumes, some nuts) | C, A, M, N |  |
| cauliflower | Mannitol (a polyol) | C, A, M |  |
| cherries | Fructose; Sorbitol (a polyol) | C, A, M, N |  |
| cherry | Fructose; Sorbitol (a polyol) | C, A, M, N |  |
| chicory | Fructans (other fruits and vegetables) | C, A, M | chicory root (inulin) |
| coconut water | FODMAPs (type not given by the sources) | C |  |
| condensed milk | Lactose | C, N |  |
| couscous | Fructans (wheat, rye, barley) | C, A, M |  |
| cream cheese | Lactose | C, M, N |  |
| currant | Fructans (other fruits and vegetables) | C | dried currants |
| custard | Lactose | C, M, N |  |
| custard apple | FODMAPs (type not given by the sources) | M |  |
| dandelion tea | FODMAPs (type not given by the sources) | M |  |
| dried apricot | Fructans (other fruits and vegetables); Sorbitol (a polyol) | C |  |
| dried cranberries | Fructans (other fruits and vegetables) | C |  |
| dried cranberry | Fructans (other fruits and vegetables) | C |  |
| falafel | GOS (legumes, some nuts) | N | Monash lists falafel as high in GOS |
| fennel tea | FODMAPs (type not given by the sources) | M |  |
| fig | Fructans (other fruits and vegetables); Fructose | C, M, N | dried figs (fructans) and figs (excess fructose) |
| flat white | Lactose | C | espresso drinks with cow's milk (CDHF) |
| fructo-oligosaccharide | Fructans (other fruits and vegetables) | C, A, M |  |
| fructooligosaccharide | Fructans (other fruits and vegetables) | C, A, M |  |
| fructose | Fructose | A, M | listed as an ingredient (crystalline fructose, fructose solids) |
| fructose-glucose | Fructose | C |  |
| fruit juice concentrate | Fructose | M |  |
| garlic | Fructans (garlic) | C, A, M, N | including garlic powder and garlic salt |
| gelato | Lactose | M |  |
| glucose-fructose | Fructose | C, A |  |
| glycerin | Polyols (sugar alcohols) | M |  |
| glycerol | Polyols (sugar alcohols) | M | also called glycerin |
| grape juice | Fructose | A |  |
| grapefruit | Fructans (other fruits and vegetables) | C, A, M |  |
| green pea | GOS (legumes, some nuts) | C, N |  |
| high fructose corn syrup | Fructose | C, A, M |  |
| high-fructose corn syrup | Fructose | C, A, M |  |
| honey | Fructose | C, A, M |  |
| horseradish | Sorbitol (a polyol) | A |  |
| houmous | Fructans (other fruits and vegetables); GOS (legumes, some nuts) | C |  |
| hummus | Fructans (other fruits and vegetables); GOS (legumes, some nuts) | C | listed under fructans by CDHF; made from chickpeas (GOS) |
| ice cream | Lactose | C, M, N | lactose-free ice cream is low (CDHF, Michigan) |
| inulin | Fructans (other fruits and vegetables) | C, A, M |  |
| isomalt | Polyols (sugar alcohols) | C, A, M |  |
| kamut | Fructans (wheat, rye, barley) | M |  |
| kidney bean | GOS (legumes, some nuts); Fructans (other fruits and vegetables) | C, A, M, N |  |
| lactitol | Polyols (sugar alcohols) | M |  |
| latte | Lactose | C | espresso drinks with cow's milk (CDHF); lactose-free or almond milk versions are low |
| leek | Fructans (onion) | C, A, M, N | the green parts are low (CDHF: 1 cup) |
| legume flour | GOS (legumes, some nuts) | C |  |
| lima bean | GOS (legumes, some nuts); Fructans (other fruits and vegetables) | A |  |
| longan | Sorbitol (a polyol) | A, M |  |
| lychee | Sorbitol (a polyol) | C, A, M |  |
| maltitol | Polyols (sugar alcohols) | C, A, M |  |
| mango | Fructose | C, A, M, N |  |
| mannitol | Mannitol (a polyol) | C, A, M |  |
| mascarpone | Lactose | C, M, N |  |
| milk powder | Lactose | C |  |
| milk solids | Lactose | M | dry milk solids |
| mocha | Lactose | C | espresso drinks with cow's milk (CDHF) |
| muesli | Fructans (wheat, rye, barley) | A |  |
| mung bean | GOS (legumes, some nuts); Fructans (other fruits and vegetables) | A |  |
| mushroom | Mannitol (a polyol); Fructans (other fruits and vegetables) | C, A, M, N |  |
| nashi | Fructose; Sorbitol (a polyol) | N | nashi pears (Monash) |
| nectarine | Fructans (other fruits and vegetables); Sorbitol (a polyol) | C, A, M, N |  |
| oat milk | FODMAPs (type not given by the sources) | M | listed on Michigan's high-FODMAP list |
| onion | Fructans (onion) | C, A, M, N | including onion powder and onion salt |
| pea | GOS (legumes, some nuts) | C, N | green pea |
| peach | Fructans (other fruits and vegetables); Sorbitol (a polyol) | C, A, M, N |  |
| pear | Fructose; Sorbitol (a polyol) | C, A, M, N |  |
| persimmon | Fructans (other fruits and vegetables) | C, A, M |  |
| pistachio | GOS (legumes, some nuts); Fructans (other fruits and vegetables) | C, A, M, N |  |
| plum | Fructans (other fruits and vegetables); Sorbitol (a polyol) | C, A, M, N |  |
| polydextrose | FODMAPs (type not given by the sources) | M |  |
| pomegranate | Fructans (other fruits and vegetables); Fructose | C, A | pomegranate seeds (CDHF) and pomegranate juice (AHS) |
| pomegranate juice | Fructose | A |  |
| port wine | FODMAPs (type not given by the sources) | C |  |
| portobello | Mannitol (a polyol); Fructans (other fruits and vegetables) | C, A, M, N | a type of mushroom |
| powdered milk | Lactose | C |  |
| prune | Fructans (other fruits and vegetables); Sorbitol (a polyol) | C, A, M |  |
| rambutan | Fructans (other fruits and vegetables) | A |  |
| ricotta | Lactose | C, M, N |  |
| rum | FODMAPs (type not given by the sources) | C, M |  |
| rye | Fructans (wheat, rye, barley) | C, A, M, N | AHS says 1 slice of sourdough rye bread is low |
| savoy cabbage | FODMAPs (type not given by the sources) | M | other cabbage is low (CDHF, AHS, Michigan) |
| shallot | Fructans (onion) | A, M |  |
| shiitake | Mannitol (a polyol); Fructans (other fruits and vegetables) | C, A, M, N | a type of mushroom |
| silken tofu | GOS (legumes, some nuts) | C | firm tofu is low (CDHF, AHS, Michigan, Monash) |
| snap pea | Fructose | C, M |  |
| sorbitol | Sorbitol (a polyol) | C, A, M |  |
| soy bean | GOS (legumes, some nuts); Fructans (other fruits and vegetables) | C, A, M |  |
| soybean | GOS (legumes, some nuts); Fructans (other fruits and vegetables) | C, A, M |  |
| split pea | GOS (legumes, some nuts); Fructans (other fruits and vegetables) | A, N |  |
| sugar-free gum | Sorbitol (a polyol) | A |  |
| sugar-free syrup | Sorbitol (a polyol) | A |  |
| textured vegetable protein | FODMAPs (type not given by the sources) | M |  |
| tomato juice | Fructose | C |  |
| tomato paste | FODMAPs (type not given by the sources) | M |  |
| vegetarian mince | FODMAPs (type not given by the sources) | N |  |
| wasabi | Sorbitol (a polyol) | A | AHS lists horseradish sauce (wasabi) |
| watermelon | Fructans (other fruits and vegetables); Fructose; Mannitol (a polyol) | C, A, M, N |  |
| wheat | Fructans (wheat, rye, barley) | C, A, M, N | AHS: avoid foods with wheat in the first 5 ingredients. Michigan lists wheat starch, wheat dextrin and wheat maltodextrin as low |
| xylitol | Polyols (sugar alcohols) | C, A, M |  |

## Amount matters (a low-FODMAP serving exists, or the sources disagree) (47)

| Food word | FODMAP group | Sources | Notes |
|---|---|---|---|
| almond | GOS (legumes, some nuts); Fructans (other fruits and vegetables) | A, M | 10 almonds or fewer are low (AHS, Michigan); more is high (Michigan) |
| asparagus | Fructose | C, A, M, N | CDHF and Monash list it as high; AHS says 3 spears are low |
| avocado | Sorbitol (a polyol) | A, M | ⅛ of an avocado is low (AHS, Michigan); more is high (AHS, Michigan) |
| banana | Fructans (other fruits and vegetables) | C, A, M, N | a firm banana is low (CDHF, Monash); AHS says 1 medium banana is low; a ripe banana is high in fructans (CDHF) |
| beet | Fructans (other fruits and vegetables) | C, A, M | CDHF lists beets as high, but ⅓ cup canned (CDHF), 4 slices boiled (AHS) or 2 slices (Michigan) are low |
| beetroot | Fructans (other fruits and vegetables) | C, A, M | ⅓ cup canned (CDHF), 4 slices boiled (AHS) or 2 slices (Michigan) are low |
| bell pepper | Fructose | C, A, M, N | CDHF and Monash list red bell pepper as high; green is low (CDHF, AHS, Michigan, Monash); AHS says 1 cup red is low, and Michigan lists red as low |
| brussels sprout | Fructans (other fruits and vegetables) | C, A, M | CDHF lists them as high; AHS says 4 sprouts and Michigan says ½ cup or less are low |
| buttermilk | Lactose | A | AHS says ⅓ cup is low |
| celery | Mannitol (a polyol) | C, A, M, N | Monash says celery is rich in mannitol and CDHF lists it as high; AHS says ¼ stalk and Michigan says ½ stalk or less is low |
| chai | FODMAPs (type not given by the sources) | C | strong chai is high; weak tea is low (CDHF) |
| chamomile | FODMAPs (type not given by the sources) | C, M | Michigan lists chamomile tea as high; CDHF says strong chamomile tea is high |
| chickpea | GOS (legumes, some nuts) | C, A, M, N | canned and rinsed chickpeas are low in small serves (CDHF ¼ cup, Michigan ¼ cup, AHS ½ cup, Monash small amounts) |
| cocoa powder | FODMAPs (type not given by the sources) | M | 1 Tbsp or less is low; more is high (Michigan) |
| cola | Fructose | C, A, M | CDHF lists regular and diet cola as high; AHS lists soft drinks made with glucose-fructose as high; Michigan says 8 oz of diet or sugar-sweetened soda is low |
| corn | Polyols (sugar alcohols) | C, A, M | CDHF lists corn as high; ½ cup canned corn (CDHF) or ½ cob (AHS, Michigan) is low |
| corn syrup | Fructans (other fruits and vegetables) | C, M | sources disagree: CDHF lists corn syrup as high in fructans, Michigan lists corn syrup as low |
| cottage cheese | Lactose | C, A, M, N | listed as high by CDHF and Michigan; AHS says ½ cup is low |
| cream | Lactose | C | CDHF says ½ cup whipped cream is low |
| dried fruit | Fructans (other fruits and vegetables); Fructose | M, N | Monash lists dried fruit as high in excess fructose; Michigan says 1 Tbsp or less is low |
| erythritol | Polyols (sugar alcohols) | M, N | Michigan lists erythritol on both its high and low lists (marked with an asterisk); Monash names it among the sugar polyols |
| evaporated milk | Lactose | C, A, N | CDHF lists it as high; AHS says 2½ Tbsp is low |
| garbanzo | GOS (legumes, some nuts) | C, A, M, N | canned and rinsed are low in small serves (CDHF and Michigan ¼ cup, AHS ½ cup) |
| grape | Fructose | C, A, M | CDHF and AHS list grapes as high; Michigan's low list includes them. Sources disagree, so check the amount |
| green onion | Fructans (onion) | C, A, M, N | the white part or whole spring onion is high (CDHF, Michigan, Monash); the green tops are low (CDHF, AHS, Michigan) |
| hazelnut | GOS (legumes, some nuts); Fructans (other fruits and vegetables) | A, M | 10 hazelnuts are low (AHS); more than 10 is high (Michigan) |
| honeydew | Fructans (other fruits and vegetables) | C, A, M | CDHF lists it as high; AHS says ½ cup is low, and Michigan lists it as low |
| kefir | Lactose | A | AHS says ½ cup is low |
| lemonade | Fructose | C, A | CDHF says ¾ cup is low; AHS lists frozen concentrated lemonade as high |
| lentil | GOS (legumes, some nuts) | C, A, M, N | boiled lentils are high (AHS); canned and rinsed are low in small serves (CDHF ⅓ cup, AHS and Michigan ½ cup) |
| milk | Lactose | C, A, M, N | cow's milk is high (CDHF, Michigan, Monash); AHS says ¼ cup is low |
| molasses | FODMAPs (type not given by the sources) | A, M | sources disagree: Michigan lists molasses as high, AHS says 1 Tbsp is low |
| oolong | FODMAPs (type not given by the sources) | C, M | Michigan lists oolong tea as high; CDHF says strong oolong is high |
| orange juice | Fructose | C, A | CDHF lists it as high; AHS says ½ cup is low |
| pumpkin | Fructans (other fruits and vegetables); Polyols (sugar alcohols) | C, M | CDHF lists pumpkin as high; Michigan says less than ½ cup canned pumpkin is low |
| raisin | Fructans (other fruits and vegetables) | C, M | CDHF lists raisins as high; Michigan says 1 Tbsp is low |
| red pepper | Fructose | C, A, M, N | CDHF and Monash list red peppers as high; AHS says 1 cup is low, and Michigan lists red and green peppers as low |
| rice milk | FODMAPs (type not given by the sources) | M, N | sources disagree: Michigan lists rice milk as high, Monash lists it as low |
| scallion | Fructans (onion) | C, A, M, N | the white part or whole spring onion is high (CDHF, Michigan, Monash); the green tops are low (CDHF, AHS, Michigan) |
| seitan | Fructans (wheat, rye, barley) | A, M | vital wheat protein; AHS says 2 Tbsp is low, and Michigan lists seitan as a protein source |
| snow pea | Mannitol (a polyol); Fructans (other fruits and vegetables); GOS (legumes, some nuts) | C, A, M | listed as high by CDHF and AHS; 5 pods or fewer are low (AHS, Michigan) |
| sour cream | Lactose | A | AHS says ¼ cup is low |
| soy milk | GOS (legumes, some nuts) | C, M, N | soy milk made from whole soybeans is high (CDHF, Michigan, Monash); soy milk made from soy protein is low (Monash) |
| spring onion | Fructans (onion) | C, A | the white part is high (CDHF); the green tops are low (CDHF, AHS) |
| sweet potato | Mannitol (a polyol) | C, A, M | AHS lists it as high in mannitol; CDHF says ⅓ cup and Michigan says ½ cup or less is low |
| yoghurt | Lactose | C, A, M, N | listed as high by CDHF, Michigan and Monash; AHS says ½ cup is low |
| yogurt | Lactose | C, A, M, N | listed as high by CDHF, Michigan and Monash; AHS says ½ cup is low |

## Usually made with a high-FODMAP ingredient (app inference) (66)

| Food word | FODMAP group | Sources | Notes |
|---|---|---|---|
| aioli | Fructans (garlic) | App inference | usually made with garlic |
| alfredo | Lactose | App inference | usually a cream sauce |
| bagel | Fructans (wheat, rye, barley) | App inference | usually made with wheat |
| baguette | Fructans (wheat, rye, barley) | App inference | usually made with wheat |
| battered | Fructans (wheat, rye, barley) | App inference | usually wheat flour |
| bechamel | Lactose | App inference | usually made with milk |
| béchamel | Lactose | App inference | usually made with milk |
| biscuit | Fructans (wheat, rye, barley) | N | usually made with wheat flour; Monash lists biscuits and snack products as high |
| bread | Fructans (wheat, rye, barley) | N | usually made with wheat; wheat, rye and barley breads are high (Monash), while sourdough, spelt and gluten-free breads are low (CDHF, AHS, Michigan, Monash) |
| breadcrumb | Fructans (wheat, rye, barley) | App inference | usually wheat bread |
| breaded | Fructans (wheat, rye, barley) | App inference | usually wheat breadcrumbs |
| brioche | Fructans (wheat, rye, barley) | App inference | usually made with wheat |
| bun | Fructans (wheat, rye, barley) | App inference | usually made with wheat |
| burger | Fructans (wheat, rye, barley) | App inference | usually a wheat bun |
| burrito | Fructans (wheat, rye, barley) | App inference | usually a wheat tortilla |
| cake | Fructans (wheat, rye, barley) | App inference | usually wheat flour |
| chimichurri | Fructans (garlic) | App inference | usually made with garlic |
| cookie | Fructans (wheat, rye, barley) | App inference | usually wheat flour |
| cracker | Fructans (wheat, rye, barley) | N | usually made with wheat flour; Monash lists rye crispbread and snack products as high |
| croissant | Fructans (wheat, rye, barley) | App inference | usually wheat flour |
| crouton | Fructans (wheat, rye, barley) | App inference | usually wheat bread |
| dal | GOS (legumes, some nuts) | App inference | usually made from lentils or split peas |
| dhal | GOS (legumes, some nuts) | App inference | usually made from lentils or split peas |
| dumpling | Fructans (wheat, rye, barley) | App inference | usually a wheat wrapper |
| farro | Fructans (wheat, rye, barley) | App inference | a type of wheat |
| fettuccine | Fructans (wheat, rye, barley) | App inference | usually wheat pasta |
| flour | Fructans (wheat, rye, barley) | App inference | usually wheat flour; arrowroot, buckwheat, corn, millet, quinoa, rice and sorghum flours are low (CDHF) |
| flour tortilla | Fructans (wheat, rye, barley) | App inference | usually made with wheat; corn tortillas are low (CDHF) |
| garlic bread | Fructans (garlic); Fructans (wheat, rye, barley) | App inference | made with garlic and usually wheat bread |
| gnocchi | Fructans (wheat, rye, barley) | App inference | usually made with wheat flour |
| granola | Fructans (wheat, rye, barley); Fructose | A | often made with muesli or dried fruit; AHS lists muesli-based and fruit-filled granola bars as high |
| gremolata | Fructans (garlic) | App inference | usually made with garlic |
| kimchi | Fructans (garlic); Fructans (onion) | App inference | usually made with garlic and onion |
| lasagna | Fructans (wheat, rye, barley) | App inference | usually wheat pasta |
| lasagne | Fructans (wheat, rye, barley) | App inference | usually wheat pasta |
| linguine | Fructans (wheat, rye, barley) | App inference | usually wheat pasta |
| mac and cheese | Lactose | App inference | usually made with milk |
| macaroni | Fructans (wheat, rye, barley) | App inference | usually wheat pasta |
| milkshake | Lactose | App inference | usually made with milk and ice cream |
| muffin | Fructans (wheat, rye, barley) | App inference | usually wheat flour |
| naan | Fructans (wheat, rye, barley) | App inference | usually made with wheat |
| noodle | Fructans (wheat, rye, barley) | App inference | usually made with wheat; rice noodles and 100% buckwheat soba are low (CDHF) |
| orzo | Fructans (wheat, rye, barley) | App inference | usually wheat pasta |
| pancake | Fructans (wheat, rye, barley) | App inference | usually wheat flour |
| panko | Fructans (wheat, rye, barley) | App inference | usually wheat breadcrumbs |
| pasta | Fructans (wheat, rye, barley) | A, M, N | usually made with wheat; wheat pasta is high (AHS, Michigan, Monash), and gluten-free pasta is low (CDHF, AHS) |
| pastry | Fructans (wheat, rye, barley) | App inference | usually wheat flour |
| penne | Fructans (wheat, rye, barley) | App inference | usually wheat pasta |
| pesto | Fructans (garlic) | App inference | usually made with garlic |
| pie | Fructans (wheat, rye, barley) | App inference | usually a wheat crust |
| pita | Fructans (wheat, rye, barley) | App inference | usually made with wheat |
| pizza | Fructans (wheat, rye, barley) | App inference | usually a wheat crust |
| ramen | Fructans (wheat, rye, barley) | App inference | usually wheat noodles |
| ravioli | Fructans (wheat, rye, barley) | App inference | usually wheat pasta |
| refried bean | GOS (legumes, some nuts) | App inference | made from dried beans |
| sandwich | Fructans (wheat, rye, barley) | App inference | usually wheat bread |
| scampi | Fructans (garlic) | App inference | usually cooked with garlic |
| semolina | Fructans (wheat, rye, barley) | App inference | made from wheat |
| sofrito | Fructans (onion); Fructans (garlic) | App inference | usually made with onion and garlic |
| spaghetti | Fructans (wheat, rye, barley) | App inference | usually wheat pasta |
| tempura | Fructans (wheat, rye, barley) | App inference | usually wheat flour batter |
| toast | Fructans (wheat, rye, barley) | App inference | usually wheat bread |
| tzatziki | Fructans (garlic); Lactose | App inference | usually made with garlic and yogurt |
| udon | Fructans (wheat, rye, barley) | App inference | usually wheat noodles |
| waffle | Fructans (wheat, rye, barley) | App inference | usually wheat flour |
| wrap | Fructans (wheat, rye, barley) | App inference | usually a wheat tortilla |

## Often made with a high-FODMAP ingredient (app inference) (33)

| Food word | FODMAP group | Sources | Notes |
|---|---|---|---|
| bean | GOS (legumes, some nuts) | App inference | often a dried bean, and most dried beans are high in GOS (CDHF, AHS, Michigan, Monash); green beans are low |
| bolognese | Fructans (onion); Fructans (garlic) | App inference | often made with onion and garlic |
| broth | Fructans (onion); Fructans (garlic) | App inference | often made with onion and garlic |
| caesar | Fructans (garlic) | App inference | the dressing is often made with garlic |
| canned fruit | FODMAPs (type not given by the sources) | M | Michigan lists canned fruit in natural juice as high |
| carbonara | Lactose | App inference | sometimes made with cream |
| chili | Fructans (onion); GOS (legumes, some nuts) | App inference | often made with onion and beans |
| chilli | Fructans (onion); GOS (legumes, some nuts) | App inference | often made with onion and beans |
| creamy | Lactose | App inference | often made with cream or milk |
| curry | Fructans (onion); Fructans (garlic) | App inference | often made with onion and garlic |
| ginger ale | Fructose | A | often sweetened with glucose-fructose, which AHS lists as high |
| gravy | Fructans (onion); Fructans (wheat, rye, barley) | N | often made with onion and wheat flour; Monash lists meats served with gravy or sauces that may contain high-FODMAP ingredients as high |
| guacamole | Fructans (onion); Sorbitol (a polyol) | App inference | often made with onion; avocado is low only in small serves (AHS, Michigan) |
| marinade | Fructans (onion); Fructans (garlic) | N | often made with garlic or onion; Monash lists garlic- and onion-based marinades as high |
| marinara | Fructans (onion); Fructans (garlic) | App inference | often made with onion and garlic |
| marinated | Fructans (onion); Fructans (garlic) | N | often made with garlic or onion; Monash lists marinated meats as high |
| meatball | Fructans (onion); Fructans (wheat, rye, barley) | A | often made with onion and breadcrumbs; AHS lists canned pasta with meatballs as high |
| natural flavor | FODMAPs (type not given by the sources) | M | Michigan lists "natural flavor" in savory foods as high, because it can include garlic or onion |
| ragu | Fructans (onion); Fructans (garlic) | App inference | often made with onion and garlic |
| ranch | Fructans (garlic); Fructans (onion) | App inference | the dressing is often made with garlic and onion |
| relish | Fructans (onion) | App inference | often made with onion |
| salami | Fructans (garlic); Fructans (onion) | N | processed meats such as salami often contain garlic or onion; Monash lists them as high |
| salsa | Fructans (onion); Fructans (garlic) | App inference | often made with onion and garlic |
| sausage | Fructans (garlic); Fructans (onion) | N | processed meats such as sausage often contain garlic or onion; Monash lists them as high |
| seasoning | Fructans (onion); Fructans (garlic) | A | may contain garlic or onion; AHS advises avoiding mixed spice blends that may contain them |
| soda | Fructose | A, M | often sweetened with glucose-fructose (high-fructose corn syrup), which AHS lists as high; Michigan says 8 oz of diet or sugar-sweetened soda is low |
| soup | Fructans (onion); Fructans (garlic) | App inference | often made with onion and garlic |
| spice blend | Fructans (onion); Fructans (garlic) | A | may contain garlic or onion; AHS advises avoiding mixed spice blends that may contain them |
| stew | Fructans (onion); Fructans (garlic) | App inference | often made with onion and garlic |
| stock | Fructans (onion); Fructans (garlic) | App inference | often made with onion and garlic |
| sugar free | Sorbitol (a polyol) | A | often sweetened with sugar alcohols; AHS lists sugar-free gum, syrup and frozen desserts as high in sorbitol |
| sugar-free | Sorbitol (a polyol) | A | often sweetened with sugar alcohols; AHS lists sugar-free gum, syrup and frozen desserts as high in sorbitol |
| tomato sauce | Fructans (onion); Fructans (garlic); Fructose | A | often made with onion and garlic; AHS lists canned pasta with tomato sauce as high in fructose |

## Low-FODMAP foods (182)

Used to praise good choices in the daily review. Serving sizes are the low-FODMAP amounts the sources give; more than that can be high. Meat, poultry, fish, seafood, eggs and fats such as oil, butter and ghee contain no FODMAPs (CDHF, AHS).

| Food word | Low-FODMAP serving | Sources |
|---|---|---|
| alfalfa | ½ cup | A, M |
| almond butter | 1 Tbsp | M |
| almond milk | 1 cup | C, M, N |
| arrowroot |  | C, M |
| arugula | 2 cups | C |
| asafoetida |  | M |
| aspartame |  | A, M |
| aubergine | 1 cup | N |
| bamboo shoot |  | M |
| barbecue sauce |  | N |
| basil |  | M |
| bbq sauce |  | N |
| bean shoot |  | M |
| bean sprouts | 2 cups | C, M |
| beef | no FODMAPs | C, A, M, N |
| black tea | 1 cup, weak | C |
| blueberries | ⅓ cup (AHS) to 1 cup (CDHF) | C, A, M, N |
| blueberry | ⅓ cup (AHS) to 1 cup (CDHF) | C, A, M, N |
| bok choy | 1 cup | C, A, M, N |
| brazil nuts | 10 nuts | C, A, M |
| brie |  | M, N |
| broccoli | ½ cup (AHS, Michigan) to ¾ cup heads (CDHF) | C, A, M |
| brown rice | 1 cup cooked | C, A, M |
| brown sugar | ¼ cup (CDHF) or 1 Tbsp (AHS) | C, A, M |
| buckwheat | ½ cup groats | C |
| butter | no FODMAPs | C, N |
| butternut squash | ¼ cup | A, M |
| cabbage | ½–¾ cup | C, A, M |
| camembert |  | M, N |
| cantaloupe | ½ cup | A, M, N |
| carrot | 1 medium | C, A, M, N |
| cheddar | 2 slices (CDHF) or 50 g (AHS) | C, A, N |
| chia | 2 Tbsp | C, A, M |
| chicken | no FODMAPs | C, A, M, N |
| chives | ½ cup | A, M |
| choko |  | M |
| choy sum |  | M |
| chutney |  | N |
| cilantro |  | M |
| cinnamon |  | M |
| clementine |  | M |
| coconut milk | canned, for cooking (Michigan) | M |
| cod | no FODMAPs | C, A |
| coffee | 1 cup drip | C, M |
| collard greens | 1 cup | C |
| corn tortilla | 2 small | C |
| cornflakes | ½ cup | A |
| courgette | ½ cup | A, M |
| cranberry juice | ¾ cup, 100% | C, N |
| cucumber | ½–1 cup | C, A, N |
| cumin |  | M |
| dark chocolate |  | N |
| dragon fruit | 1 medium | C |
| durian |  | M |
| egg | no FODMAPs | C, A, M, N |
| eggplant | 1 cup | C, A, M, N |
| eggs | no FODMAPs | C, A, M, N |
| endive |  | M |
| espresso | 30 ml | C |
| fennel | 1 cup or less (Michigan) | M |
| feta |  | N |
| firm tofu | 1 cup (CDHF) or 100 g (AHS) | C, A, M, N |
| fish | no FODMAPs | C, A, M, N |
| flax | 2 Tbsp | A, M |
| flaxseed | 1 Tbsp ground (Michigan) or 2 Tbsp (AHS) | A, M |
| garlic infused oil | no FODMAPs | C, A |
| garlic-infused oil | no FODMAPs | C, A |
| ghee | no FODMAPs | C |
| ginger |  | M |
| gluten free |  | C, A, M, N |
| gluten-free |  | C, A, M, N |
| golden syrup |  | M |
| green beans | 15 beans | C, M, N |
| green pepper | ¼ pepper (CDHF) to ½ cup (AHS) | C, A, M, N |
| green tea | 1 cup | C |
| guava | 1 medium | C |
| ham | no FODMAPs | A |
| hard cheese | 2 slices (CDHF) or 50 g (AHS) | C, A, M, N |
| hemp hearts | 3 Tbsp | C |
| hemp milk |  | M |
| kale | ½ cup | C |
| kiwi | 1–2 medium | C, A, M, N |
| kiwifruit | 1–2 medium | C, A, M, N |
| kumquat | 4 medium | C |
| lactose free | as tolerated (AHS) | C, A, M, N |
| lactose-free | as tolerated (AHS) | C, A, M, N |
| lamb | no FODMAPs | C, A |
| lemon |  | A, M |
| lemongrass |  | M |
| lettuce | 1–1½ cups | C, A, M, N |
| lime |  | M |
| linseed | 2 Tbsp | A |
| macadamia | 15–20 nuts | C, A, N |
| macadamias | 15–20 nuts | C, A, N |
| mandarin | 1 medium | C, M, N |
| maple syrup | 2 Tbsp | C, A, M, N |
| mayonnaise |  | N |
| millet | ½ cup | C, M |
| mint |  | M |
| mozzarella | 2 slices (CDHF) or 50 g (AHS) | C, A, N |
| oat bran | 2 Tbsp | A |
| oatmeal | ½ cup cooked | A, M |
| oats | ⅓–½ cup dry (AHS, Michigan) or ½ cup gluten-free oats (CDHF) | C, A, M, N |
| okra | 6 pods (Michigan) or 7 (CDHF) | C, M |
| olive oil | no FODMAPs | C, A, M |
| olives |  | M |
| orange | 1 medium | C, A, M, N |
| oranges | 1 medium | C, A, M, N |
| oregano |  | M |
| papaya | 1 cup | C, M |
| paprika |  | M |
| parmesan | 2 slices | C, N |
| parsley |  | M |
| parsnip | 1 medium | C, M |
| passion fruit | 2 medium | C, M |
| passionfruit | 2 medium | C, M |
| peanut butter | 2 Tbsp | A, M |
| peanuts | 32 nuts | C, A, M, N |
| pecans | 15 halves | C, M |
| pepitas |  | N |
| peppermint tea | 1 cup | C |
| pine nuts | 2 tsp | C, M |
| pineapple | ½–1 cup | C, A, M, N |
| polenta |  | M |
| poppy seeds |  | M |
| pork | no FODMAPs | C, A, M |
| porridge | ½ cup cooked | A |
| potato | ¼ cup (CDHF) to 1 cup (AHS) | C, A, M, N |
| potatoes | ¼ cup (CDHF) to 1 cup (AHS) | C, A, M, N |
| prawn | no FODMAPs | C, M, N |
| psyllium |  | M |
| pumpkin seeds | 3 Tbsp | C, M, N |
| quinoa | 1 cup cooked | C, A, M, N |
| quinoa flakes |  | N |
| radish | 4 radishes | C |
| raspberries | ½ cup | A, M |
| raspberry | ½ cup | A, M |
| rhubarb | 1 cup | C, M |
| rice | 1 cup cooked | C, A, M, N |
| rice cakes | 4 cakes | C, N |
| rice malt syrup |  | N |
| rice noodles | ½ cup | C |
| rooibos | 1 cup, weak | C |
| rosemary |  | M |
| rutabaga | ¼ cup | C, M |
| salmon | no FODMAPs | C, A |
| sauerkraut | ⅓ cup | C |
| seafood | no FODMAPs | C, M, N |
| seaweed | 2 sheets | C |
| sesame | 3 Tbsp | C, M |
| shrimp | no FODMAPs | C, M, N |
| soba | ⅓ cup (100% buckwheat) | C |
| sorbet |  | M |
| sorghum |  | C, M |
| sourdough | 2 slices (CDHF) | C, M, N |
| soy sauce |  | M, N |
| spaghetti squash | ½ cup | C, M |
| spelt | 2 slices spelt bread (AHS) | A, M, N |
| spinach | 1½–2 cups | C, A, M |
| stevia |  | A, M |
| strawberries | ½ cup | A, M |
| strawberry | ½ cup | A, M |
| sunflower seeds |  | M |
| swiss chard | 1½ cups | C, M |
| swiss cheese | 2 slices | C, N |
| table sugar |  | N |
| tahini | 1 Tbsp | M |
| tangelo |  | M |
| tapioca |  | M |
| taro |  | M |
| tempeh | 1 cup (CDHF) or 100 g (AHS) | C, A, M, N |
| thyme |  | M |
| tofu | 100 g plain (AHS) | A, M |
| tomato | 1 medium | C, A, M |
| tuna | no FODMAPs | C, A |
| turkey | no FODMAPs | C, A, M |
| turmeric |  | M |
| turnip | ½ medium | C, M |
| walnuts | 10–15 halves | C, A, M, N |
| whey protein isolate |  | M |
| yam | ⅓ cup | C, M |
| zucchini | ½ cup | A, M |

## Where the sources disagree

| Food | What the sources say | What the app does |
|---|---|---|
| Grapes | CDHF and AHS: high in excess fructose. Michigan's low list includes grapes. | Amount matters: flagged as "ask or modify" |
| Asparagus | CDHF and Monash: high. AHS: 3 spears are low. | Amount matters |
| Red bell pepper | CDHF: red, yellow and orange are high. AHS: 1 cup red is low. | Amount matters |
| Brussels sprouts | CDHF: high. AHS: 4 sprouts are low. | Amount matters |
| Honeydew | CDHF: high. AHS: ½ cup is low. | Amount matters |
| Cow's milk | CDHF, Michigan, Monash: high. AHS: ¼ cup is low. | Amount matters |
| Yogurt | CDHF, Michigan, Monash: high. AHS: ½ cup is low. | Amount matters |
| Cottage cheese | CDHF, Michigan: high. AHS: ½ cup is low. | Amount matters |
| Banana | CDHF: ripe is high, firm is low. AHS: 1 medium is low. Monash: firm is low. | Amount matters |
| Celery, corn, snow peas | CDHF: high. AHS (and Michigan for corn and snow peas) give small low serves. | Amount matters |
| Sweet potato | AHS: high in mannitol. CDHF: ⅓ cup is low. | Amount matters |
| Potato | All list it as low, but CDHF says ¼ cup and AHS says 1 cup. | Praised as a good choice; both serving sizes shown |
| Blueberries | All list them as low, but AHS says ⅓ cup and CDHF says 1 cup. | Praised as a good choice; both serving sizes shown |
| Seitan | Made from wheat. AHS: 2 Tbsp is low. Michigan lists it as a protein source. | Amount matters |
| Corn syrup | CDHF: high in fructans. Michigan: low. | Amount matters |
| Molasses | Michigan: high. AHS: 1 Tbsp is low. | Amount matters |
| Rice milk | Michigan: high. Monash: low. | Amount matters |
| Soy milk | Made from whole soybeans: high (CDHF, Michigan, Monash). Made from soy protein: low (Monash). | Amount matters, with both explained |
| Red bell pepper (update) | CDHF and Monash: high. Michigan and AHS (1 cup): low. | Amount matters |
| Pumpkin | CDHF: high. Michigan: less than ½ cup canned is low. | Amount matters |
| Erythritol | Michigan lists it on both its high and low lists. Monash names it among the sugar polyols. | Amount matters |
| Soda / cola | CDHF: regular and diet cola are high. AHS: glucose-fructose sodas are high. Michigan: 8 oz diet or sugar-sweetened soda is low. | Amount matters |
| Barbecue sauce | Monash: low. (The app used to guess it was often made with onion.) | No longer flagged; praised as a low choice |
