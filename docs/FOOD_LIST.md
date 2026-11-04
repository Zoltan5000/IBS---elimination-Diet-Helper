# Master food list

This is the list the app uses to check menus, score your daily food log and filter meal ideas. It is generated from `js/fodmap-data.js` by `scripts/build-food-list.js`, so it always matches the app.

## Where these foods come from

| Tag | Source | Who wrote it | Date | How it was checked |
|---|---|---|---|---|
| **C** | Canadian Digestive Health Foundation, [Understanding the Low FODMAP Diet: Foods, Phases and Tips for Managing IBS](https://cdhf.ca/en/understanding-the-fodmap-diet/) | Kelsey Moore, BSc, RD, and Andrea Senchuk, RD (registered dietitians) | Updated June 10, 2026 | Full text supplied by the project owner and read in full |
| **A** | Alberta Health Services, [Low FODMAP Eating](https://www.albertahealthservices.ca/assets/info/nutrition/if-nfs-low-fodmap-eating-form.pdf) (handout 404120-NFS) | AHS Nutrition Services registered dietitians | December 2017 | Full PDF supplied by the project owner and read in full |
| **M** | Michigan Medicine, [MyGINutrition](https://myginutrition.com/) high- and low-FODMAP food lists | University of Michigan gastroenterology team | Older; the lists look roughly 10 years old | **Partial.** The site couldn't be opened from the build environment; only foods named in searches of myginutrition.com are tagged |
| **N** | Monash University, [High and low FODMAP foods](https://www.monashfodmap.com/about-fodmap-and-ibs/high-and-low-fodmap-foods/) | Monash University Department of Gastroenterology | Web page, date not shown | **Partial.** Only foods named in searches of monashfodmap.com are tagged |

**Honesty notes**
- **C** and **A** are the main sources, because their full text was read. **M** and **N** only add confirmation where a search showed the food on their lists. A food *without* an M or N tag may still be on those lists; it just wasn't confirmed.
- None of these are university research papers or journals. CDHF is a national charity, AHS is a provincial public health authority, and Michigan Medicine and Monash are university health organizations. All four are written by registered dietitians or university clinicians for patients.
- The AHS handout is from 2017, and Monash retested many foods in 2025. CDHF and AHS both say the Monash FODMAP app has the most current data.
- **App inference** means no source lists that word. These are dishes or products the app flags because they are *usually* or *often* made with an ingredient the sources list as high (for example, bread is usually made with wheat). The app always labels these as its own guess.
- **Amount matters** means a source gives a low-FODMAP serving, or the sources disagree. The note explains which.

## High-FODMAP foods (107)

| Food word | FODMAP group | Sources | Notes |
|---|---|---|---|
| agave | Fructose | C, A, M |  |
| all-purpose flour | Fructans (wheat, rye, barley) | M |  |
| apple | Fructose; Sorbitol (a polyol) | C, A, M, N |  |
| apple juice | Fructose; Sorbitol (a polyol) | C, A |  |
| applesauce | Fructose; Sorbitol (a polyol) | A |  |
| apricot | Fructans (other fruits and vegetables); Sorbitol (a polyol) | C, A, M |  |
| artichoke | Fructans (other fruits and vegetables) | C, A, N |  |
| baked bean | GOS (legumes, some nuts) | C, M, N |  |
| barley | Fructans (wheat, rye, barley); GOS (legumes, some nuts) | C, A, M, N |  |
| black bean | GOS (legumes, some nuts); Fructans (other fruits and vegetables) | C, A |  |
| blackberries | Sorbitol (a polyol) | C, A |  |
| blackberry | Sorbitol (a polyol) | C, A |  |
| borlotti | GOS (legumes, some nuts) | C |  |
| bortolotti | GOS (legumes, some nuts) | C |  |
| bulgur | Fructans (wheat, rye, barley) | M |  |
| cappuccino | Lactose | C | espresso drinks with cow's milk (CDHF) |
| cashew | GOS (legumes, some nuts) | C, A, N |  |
| cauliflower | Mannitol (a polyol) | C, A |  |
| cherries | Fructose; Sorbitol (a polyol) | C, A, N |  |
| cherry | Fructose; Sorbitol (a polyol) | C, A, N |  |
| chicory | Fructans (other fruits and vegetables) | C, A | chicory root (inulin) |
| coconut water | FODMAPs (type not given by the sources) | C |  |
| cola | Fructose | C, A | CDHF lists regular and diet cola; AHS lists soft drinks made with glucose-fructose |
| condensed milk | Lactose | C |  |
| corn syrup | Fructans (other fruits and vegetables) | C | listed under fructans (sweeteners) by CDHF |
| couscous | Fructans (wheat, rye, barley) | C, A, M |  |
| cream cheese | Lactose | C, N |  |
| currant | Fructans (other fruits and vegetables) | C | dried currants |
| custard | Lactose | C |  |
| dried apricot | Fructans (other fruits and vegetables); Sorbitol (a polyol) | C |  |
| dried cranberries | Fructans (other fruits and vegetables) | C |  |
| dried cranberry | Fructans (other fruits and vegetables) | C |  |
| dried fruit | Fructans (other fruits and vegetables) | N |  |
| fig | Fructans (other fruits and vegetables); Fructose | C | dried figs (fructans) and figs (excess fructose) |
| flat white | Lactose | C | espresso drinks with cow's milk (CDHF) |
| fructo-oligosaccharide | Fructans (other fruits and vegetables) | C, A |  |
| fructooligosaccharide | Fructans (other fruits and vegetables) | C, A |  |
| fructose-glucose | Fructose | C |  |
| garlic | Fructans (garlic) | C, A, M, N | including garlic powder and garlic salt |
| glucose-fructose | Fructose | C, A |  |
| grape juice | Fructose | A |  |
| grapefruit | Fructans (other fruits and vegetables) | C, A |  |
| green pea | GOS (legumes, some nuts) | C |  |
| high fructose corn syrup | Fructose | C, A, M |  |
| high-fructose corn syrup | Fructose | C, A, M |  |
| honey | Fructose | C, A, M |  |
| horseradish | Sorbitol (a polyol) | A |  |
| houmous | Fructans (other fruits and vegetables); GOS (legumes, some nuts) | C |  |
| hummus | Fructans (other fruits and vegetables); GOS (legumes, some nuts) | C | listed under fructans by CDHF; made from chickpeas (GOS) |
| ice cream | Lactose | C, M, N | lactose-free ice cream is low (CDHF, Michigan) |
| inulin | Fructans (other fruits and vegetables) | C, A |  |
| isomalt | Polyols (sugar alcohols) | C, A |  |
| kamut | Fructans (wheat, rye, barley) | M |  |
| kidney bean | GOS (legumes, some nuts); Fructans (other fruits and vegetables) | C, A, M, N |  |
| latte | Lactose | C | espresso drinks with cow's milk (CDHF); lactose-free or almond milk versions are low |
| leek | Fructans (onion) | C, A, M, N | the green parts are low (CDHF: 1 cup) |
| legume flour | GOS (legumes, some nuts) | C |  |
| lima bean | GOS (legumes, some nuts); Fructans (other fruits and vegetables) | A |  |
| longan | Sorbitol (a polyol) | A |  |
| lychee | Sorbitol (a polyol) | C, A |  |
| maltitol | Polyols (sugar alcohols) | C, A, M |  |
| mango | Fructose | C, A, M, N |  |
| mannitol | Mannitol (a polyol) | C, A |  |
| mascarpone | Lactose | C, N |  |
| milk powder | Lactose | C |  |
| mocha | Lactose | C | espresso drinks with cow's milk (CDHF) |
| muesli | Fructans (wheat, rye, barley) | A |  |
| mung bean | GOS (legumes, some nuts); Fructans (other fruits and vegetables) | A |  |
| mushroom | Mannitol (a polyol); Fructans (other fruits and vegetables) | C, A, M, N |  |
| nectarine | Fructans (other fruits and vegetables); Sorbitol (a polyol) | C, A |  |
| oat milk | FODMAPs (type not given by the sources) | M | listed on Michigan's high-FODMAP list |
| onion | Fructans (onion) | C, A, M, N | including onion powder and onion salt |
| pea | GOS (legumes, some nuts) | C | green pea |
| peach | Fructans (other fruits and vegetables); Sorbitol (a polyol) | C, A |  |
| pear | Fructose; Sorbitol (a polyol) | C, A, M, N |  |
| persimmon | Fructans (other fruits and vegetables) | C, A |  |
| pistachio | GOS (legumes, some nuts); Fructans (other fruits and vegetables) | C, A, N |  |
| plum | Fructans (other fruits and vegetables); Sorbitol (a polyol) | C, A |  |
| pomegranate | Fructans (other fruits and vegetables); Fructose | C, A | pomegranate seeds (CDHF) and pomegranate juice (AHS) |
| pomegranate juice | Fructose | A |  |
| port wine | FODMAPs (type not given by the sources) | C |  |
| portobello | Mannitol (a polyol); Fructans (other fruits and vegetables) | C, A, M, N | a type of mushroom |
| powdered milk | Lactose | C |  |
| prune | Fructans (other fruits and vegetables); Sorbitol (a polyol) | C, A |  |
| pumpkin | Fructans (other fruits and vegetables); Polyols (sugar alcohols) | C |  |
| raisin | Fructans (other fruits and vegetables) | C |  |
| rambutan | Fructans (other fruits and vegetables) | A |  |
| rice milk | FODMAPs (type not given by the sources) | M | listed on Michigan's high-FODMAP list |
| ricotta | Lactose | C, M, N |  |
| rum | FODMAPs (type not given by the sources) | C |  |
| rye | Fructans (wheat, rye, barley) | C, A, M, N | AHS says 1 slice of sourdough rye bread is low |
| shallot | Fructans (onion) | A, M |  |
| shiitake | Mannitol (a polyol); Fructans (other fruits and vegetables) | C, A, M, N | a type of mushroom |
| silken tofu | GOS (legumes, some nuts) | C | firm tofu is low (CDHF, AHS, Michigan, Monash) |
| snap pea | Fructose | C |  |
| sorbitol | Sorbitol (a polyol) | C, A, M |  |
| soy bean | GOS (legumes, some nuts); Fructans (other fruits and vegetables) | C, A |  |
| soy milk | GOS (legumes, some nuts) | C, M | Michigan: soy milk made from whole soybeans |
| soybean | GOS (legumes, some nuts); Fructans (other fruits and vegetables) | C, A |  |
| split pea | GOS (legumes, some nuts); Fructans (other fruits and vegetables) | A, N |  |
| sugar-free gum | Sorbitol (a polyol) | A |  |
| sugar-free syrup | Sorbitol (a polyol) | A |  |
| tomato juice | Fructose | C |  |
| wasabi | Sorbitol (a polyol) | A | AHS lists horseradish sauce (wasabi) |
| watermelon | Fructans (other fruits and vegetables); Fructose; Mannitol (a polyol) | C, A, M, N |  |
| wheat | Fructans (wheat, rye, barley) | C, A, M, N | AHS: avoid foods with wheat in the first 5 ingredients |
| xylitol | Polyols (sugar alcohols) | C, A, M |  |

## Amount matters (a low-FODMAP serving exists, or the sources disagree) (35)

| Food word | FODMAP group | Sources | Notes |
|---|---|---|---|
| asparagus | Fructose | C, A, N | CDHF and Monash list it as high; AHS says 3 spears are low |
| avocado | Sorbitol (a polyol) | A, M | ⅛ of an avocado is low (AHS, Michigan); more is high in sorbitol (AHS) |
| banana | Fructans (other fruits and vegetables) | C, A, M, N | a firm banana is low (CDHF, Monash); AHS says 1 medium banana is low; a ripe banana is high in fructans (CDHF) |
| beet | Fructans (other fruits and vegetables) | C, A | CDHF lists beets as high, but ⅓ cup canned beets (CDHF) or 4 slices boiled beet (AHS) are low |
| beetroot | Fructans (other fruits and vegetables) | C, A | ⅓ cup canned (CDHF) or 4 slices boiled (AHS) are low |
| bell pepper | Fructose | C, A | CDHF lists red, yellow and orange peppers as high; green peppers are low (CDHF ¼ pepper, AHS ½ cup); AHS also says 1 cup red pepper is low |
| brussels sprout | Fructans (other fruits and vegetables) | C, A | CDHF lists them as high; AHS says 4 Brussels sprouts are low |
| buttermilk | Lactose | A | AHS says ⅓ cup is low |
| celery | Polyols (sugar alcohols) | C, A | CDHF lists celery as high; AHS says ¼ stalk is low |
| chai | FODMAPs (type not given by the sources) | C | strong chai is high; weak tea is low (CDHF) |
| chamomile | FODMAPs (type not given by the sources) | C | strong chamomile tea is high (CDHF) |
| chickpea | GOS (legumes, some nuts) | C, A, M, N | canned and rinsed chickpeas are low in small serves (CDHF ¼ cup, AHS ½ cup, Monash small amounts) |
| corn | Polyols (sugar alcohols) | C, A, M | CDHF lists corn as high; ½ cup canned corn (CDHF) or ½ cob (AHS, Michigan) is low |
| cottage cheese | Lactose | C, A, M, N | listed as high by CDHF and Michigan; AHS says ½ cup is low |
| cream | Lactose | C | CDHF says ½ cup whipped cream is low |
| evaporated milk | Lactose | C, A | CDHF lists it as high; AHS says 2½ Tbsp is low |
| garbanzo | GOS (legumes, some nuts) | C, A, M, N | canned and rinsed are low in small serves (CDHF ¼ cup, AHS ½ cup) |
| grape | Fructose | C, A, M | CDHF and AHS list grapes as high; Michigan's low list includes them. Sources disagree, so check the amount |
| green onion | Fructans (onion) | C, A | the white part is high (CDHF); the green tops are low (CDHF, AHS) |
| honeydew | Fructans (other fruits and vegetables) | C, A | CDHF lists it as high; AHS says ½ cup is low |
| kefir | Lactose | A | AHS says ½ cup is low |
| lemonade | Fructose | C, A | CDHF says ¾ cup is low; AHS lists frozen concentrated lemonade as high |
| lentil | GOS (legumes, some nuts) | C, A, M, N | boiled lentils are high (AHS); canned and rinsed are low in small serves (CDHF ⅓ cup, AHS ½ cup) |
| milk | Lactose | C, A, M, N | cow's milk is high (CDHF, Michigan, Monash); AHS says ¼ cup is low |
| oolong | FODMAPs (type not given by the sources) | C | strong oolong tea is high (CDHF) |
| orange juice | Fructose | C, A | CDHF lists it as high; AHS says ½ cup is low |
| red pepper | Fructose | C, A | CDHF lists red peppers as high; AHS says 1 cup red pepper is low |
| scallion | Fructans (onion) | C, A | the white part is high (CDHF); the green tops are low (CDHF, AHS) |
| seitan | Fructans (wheat, rye, barley) | A, M | vital wheat protein; AHS says 2 Tbsp is low, and Michigan lists seitan as a protein source |
| snow pea | Mannitol (a polyol); Fructans (other fruits and vegetables); GOS (legumes, some nuts) | C, A, M | listed as high by CDHF and AHS; 5 pods or fewer are low (AHS, Michigan) |
| sour cream | Lactose | A | AHS says ¼ cup is low |
| spring onion | Fructans (onion) | C, A | the white part is high (CDHF); the green tops are low (CDHF, AHS) |
| sweet potato | Mannitol (a polyol) | C, A | AHS lists it as high in mannitol; CDHF says ⅓ cup is low |
| yoghurt | Lactose | C, A, M, N | listed as high by CDHF, Michigan and Monash; AHS says ½ cup is low |
| yogurt | Lactose | C, A, M, N | listed as high by CDHF, Michigan and Monash; AHS says ½ cup is low |

## Usually made with a high-FODMAP ingredient (app inference) (68)

| Food word | FODMAP group | Sources | Notes |
|---|---|---|---|
| aioli | Fructans (garlic) | App inference | usually made with garlic |
| alfredo | Lactose | App inference | usually a cream sauce |
| bagel | Fructans (wheat, rye, barley) | App inference | usually made with wheat |
| baguette | Fructans (wheat, rye, barley) | App inference | usually made with wheat |
| battered | Fructans (wheat, rye, barley) | App inference | usually wheat flour |
| bechamel | Lactose | App inference | usually made with milk |
| béchamel | Lactose | App inference | usually made with milk |
| biscuit | Fructans (wheat, rye, barley) | App inference | usually wheat flour |
| bread | Fructans (wheat, rye, barley) | App inference | usually made with wheat; sourdough, spelt and gluten-free breads are low (CDHF, AHS, Michigan, Monash) |
| breadcrumb | Fructans (wheat, rye, barley) | App inference | usually wheat bread |
| breaded | Fructans (wheat, rye, barley) | App inference | usually wheat breadcrumbs |
| brioche | Fructans (wheat, rye, barley) | App inference | usually made with wheat |
| bun | Fructans (wheat, rye, barley) | App inference | usually made with wheat |
| burger | Fructans (wheat, rye, barley) | App inference | usually a wheat bun |
| burrito | Fructans (wheat, rye, barley) | App inference | usually a wheat tortilla |
| cake | Fructans (wheat, rye, barley) | App inference | usually wheat flour |
| chimichurri | Fructans (garlic) | App inference | usually made with garlic |
| cookie | Fructans (wheat, rye, barley) | App inference | usually wheat flour |
| cracker | Fructans (wheat, rye, barley) | App inference | usually wheat flour |
| croissant | Fructans (wheat, rye, barley) | App inference | usually wheat flour |
| crouton | Fructans (wheat, rye, barley) | App inference | usually wheat bread |
| dal | GOS (legumes, some nuts) | App inference | usually made from lentils or split peas |
| dhal | GOS (legumes, some nuts) | App inference | usually made from lentils or split peas |
| dumpling | Fructans (wheat, rye, barley) | App inference | usually a wheat wrapper |
| falafel | GOS (legumes, some nuts) | App inference | usually made from chickpeas or fava beans |
| farro | Fructans (wheat, rye, barley) | App inference | a type of wheat |
| fettuccine | Fructans (wheat, rye, barley) | App inference | usually wheat pasta |
| flour | Fructans (wheat, rye, barley) | App inference | usually wheat flour; arrowroot, buckwheat, corn, millet, quinoa, rice and sorghum flours are low (CDHF) |
| flour tortilla | Fructans (wheat, rye, barley) | App inference | usually made with wheat; corn tortillas are low (CDHF) |
| garlic bread | Fructans (garlic); Fructans (wheat, rye, barley) | App inference | made with garlic and usually wheat bread |
| gelato | Lactose | App inference | usually made with milk |
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

## Often made with a high-FODMAP ingredient (app inference) (31)

| Food word | FODMAP group | Sources | Notes |
|---|---|---|---|
| barbecue sauce | Fructans (onion); Fructans (garlic); Fructose | App inference | often made with onion, garlic and sweeteners |
| bbq sauce | Fructans (onion); Fructans (garlic); Fructose | App inference | often made with onion, garlic and sweeteners |
| bean | GOS (legumes, some nuts) | App inference | often a dried bean, and most dried beans are high in GOS (CDHF, AHS, Michigan, Monash); green beans are low |
| bolognese | Fructans (onion); Fructans (garlic) | App inference | often made with onion and garlic |
| broth | Fructans (onion); Fructans (garlic) | App inference | often made with onion and garlic |
| caesar | Fructans (garlic) | App inference | the dressing is often made with garlic |
| carbonara | Lactose | App inference | sometimes made with cream |
| chili | Fructans (onion); GOS (legumes, some nuts) | App inference | often made with onion and beans |
| chilli | Fructans (onion); GOS (legumes, some nuts) | App inference | often made with onion and beans |
| creamy | Lactose | App inference | often made with cream or milk |
| curry | Fructans (onion); Fructans (garlic) | App inference | often made with onion and garlic |
| ginger ale | Fructose | A | often sweetened with glucose-fructose, which AHS lists as high |
| gravy | Fructans (onion); Fructans (wheat, rye, barley) | App inference | often made with onion and wheat flour |
| guacamole | Fructans (onion); Sorbitol (a polyol) | App inference | often made with onion; avocado is low only in small serves (AHS, Michigan) |
| marinade | Fructans (onion); Fructans (garlic) | App inference | often made with garlic or onion |
| marinara | Fructans (onion); Fructans (garlic) | App inference | often made with onion and garlic |
| marinated | Fructans (onion); Fructans (garlic) | App inference | often made with garlic or onion |
| meatball | Fructans (onion); Fructans (wheat, rye, barley) | A | often made with onion and breadcrumbs; AHS lists canned pasta with meatballs as high |
| ragu | Fructans (onion); Fructans (garlic) | App inference | often made with onion and garlic |
| ranch | Fructans (garlic); Fructans (onion) | App inference | the dressing is often made with garlic and onion |
| relish | Fructans (onion) | App inference | often made with onion |
| salsa | Fructans (onion); Fructans (garlic) | App inference | often made with onion and garlic |
| seasoning | Fructans (onion); Fructans (garlic) | A | may contain garlic or onion; AHS advises avoiding mixed spice blends that may contain them |
| soda | Fructose | A | often sweetened with glucose-fructose (high-fructose corn syrup), which AHS lists as high |
| soup | Fructans (onion); Fructans (garlic) | App inference | often made with onion and garlic |
| spice blend | Fructans (onion); Fructans (garlic) | A | may contain garlic or onion; AHS advises avoiding mixed spice blends that may contain them |
| stew | Fructans (onion); Fructans (garlic) | App inference | often made with onion and garlic |
| stock | Fructans (onion); Fructans (garlic) | App inference | often made with onion and garlic |
| sugar free | Sorbitol (a polyol) | A | often sweetened with sugar alcohols; AHS lists sugar-free gum, syrup and frozen desserts as high in sorbitol |
| sugar-free | Sorbitol (a polyol) | A | often sweetened with sugar alcohols; AHS lists sugar-free gum, syrup and frozen desserts as high in sorbitol |
| tomato sauce | Fructans (onion); Fructans (garlic); Fructose | A | often made with onion and garlic; AHS lists canned pasta with tomato sauce as high in fructose |

## Low-FODMAP foods (129)

Used to praise good choices in the daily review. Serving sizes are the low-FODMAP amounts the sources give; more than that can be high. Meat, poultry, fish, seafood, eggs and fats such as oil, butter and ghee contain no FODMAPs (CDHF, AHS).

| Food word | Low-FODMAP serving | Sources |
|---|---|---|
| alfalfa | ½ cup | A, M |
| almond milk | 1 cup | C, N |
| almonds | 10 nuts | A, M |
| arugula | 2 cups | C |
| bamboo shoot |  | M |
| bean sprouts | 2 cups | C |
| beef | no FODMAPs | C, A |
| black tea | 1 cup, weak | C |
| blueberries | ⅓ cup (AHS) to 1 cup (CDHF) | C, A, M, N |
| bok choy | 1 cup | C, A |
| brazil nuts | 10 nuts | C, A, M |
| brie |  | N |
| broccoli | ½–¾ cup | C, A, M |
| brown rice | 1 cup cooked | C, A, M |
| brown sugar | ¼ cup (CDHF) or 1 Tbsp (AHS) | C, A |
| buckwheat | ½ cup groats | C |
| butter | no FODMAPs | C |
| butternut squash | ¼ cup | A |
| cabbage | ½–¾ cup | C, A |
| cantaloupe | ½ cup | A, M, N |
| carrot | 1 medium | C, A, M, N |
| cheddar | 2 slices (CDHF) or 50 g (AHS) | C, A, N |
| chia | 2 Tbsp | C, A, M |
| chicken | no FODMAPs | C, A |
| chives | ½ cup | A |
| cod | no FODMAPs | C, A |
| coffee | 1 cup drip | C |
| collard greens | 1 cup | C |
| corn tortilla | 2 small | C |
| cornflakes | ½ cup | A |
| courgette | ½ cup | A, M |
| cranberry juice | ¾ cup, 100% | C |
| cucumber | ½–1 cup | C, A, N |
| dragon fruit | 1 medium | C |
| egg | no FODMAPs | C, A, N |
| eggplant | 1 cup | C, A, M, N |
| eggs | no FODMAPs | C, A, N |
| espresso | 30 ml | C |
| feta |  | N |
| firm tofu | 1 cup (CDHF) or 100 g (AHS) | C, A, M, N |
| fish | no FODMAPs | C, A |
| flax | 2 Tbsp | A |
| flaxseed | 2 Tbsp | A |
| garlic infused oil | no FODMAPs | C, A |
| garlic-infused oil | no FODMAPs | C, A |
| ghee | no FODMAPs | C |
| gluten free |  | C, A |
| gluten-free |  | C, A |
| green beans | 15 beans | C, N |
| green pepper | ¼ pepper (CDHF) to ½ cup (AHS) | C, A |
| green tea | 1 cup | C |
| guava | 1 medium | C |
| ham | no FODMAPs | A |
| hard cheese | 2 slices (CDHF) or 50 g (AHS) | C, A, N |
| hazelnuts | 10 nuts | A |
| hemp hearts | 3 Tbsp | C |
| kale | ½ cup | C |
| kiwi | 1–2 medium | C, A, M, N |
| kiwifruit | 1–2 medium | C, A, M, N |
| kumquat | 4 medium | C |
| lactose free | as tolerated (AHS) | C, A, M, N |
| lactose-free | as tolerated (AHS) | C, A, M, N |
| lamb | no FODMAPs | C, A |
| lemon |  | A, M |
| lettuce | 1–1½ cups | C, A, N |
| linseed | 2 Tbsp | A |
| macadamia | 15–20 nuts | C, A, N |
| macadamias | 15–20 nuts | C, A, N |
| mandarin | 1 medium | C, N |
| maple syrup | 2 Tbsp | C, A |
| millet | ½ cup | C, M |
| molasses | 1 Tbsp | A |
| mozzarella | 2 slices (CDHF) or 50 g (AHS) | C, A, N |
| oat bran | 2 Tbsp | A |
| oatmeal | ½ cup cooked | A, M |
| oats | ⅓ cup dry (AHS) or ½ cup gluten-free oats (CDHF) | C, A, N |
| okra | 7 pods | C |
| olive oil | no FODMAPs | C, A |
| orange | 1 medium | C, A, N |
| oranges | 1 medium | C, A, N |
| papaya | 1 cup | C |
| parmesan | 2 slices | C, N |
| parsnip | 1 medium | C |
| passionfruit | 2 medium | C |
| peanut butter | 2 Tbsp | A |
| peanuts | 32 nuts | C, A, N |
| pecans | 15 halves | C |
| peppermint tea | 1 cup | C |
| pine nuts | 2 tsp | C, M |
| pineapple | ½–1 cup | C, A, M, N |
| pork | no FODMAPs | C, A |
| porridge | ½ cup cooked | A |
| potato | ¼ cup (CDHF) to 1 cup (AHS) | C, A, M, N |
| potatoes | ¼ cup (CDHF) to 1 cup (AHS) | C, A, M, N |
| prawn | no FODMAPs | C |
| pumpkin seeds | 3 Tbsp | C, M, N |
| quinoa | 1 cup cooked | C, A, M, N |
| radish | 4 radishes | C |
| raspberries | ½ cup | A |
| rhubarb | 1 cup | C |
| rice | 1 cup cooked | C, A, N |
| rice cakes | 4 cakes | C |
| rice noodles | ½ cup | C |
| rooibos | 1 cup, weak | C |
| rutabaga | ¼ cup | C |
| salmon | no FODMAPs | C, A |
| sauerkraut | ⅓ cup | C |
| seafood | no FODMAPs | C |
| seaweed | 2 sheets | C |
| sesame | 3 Tbsp | C, M |
| shrimp | no FODMAPs | C |
| soba | ⅓ cup (100% buckwheat) | C |
| sourdough | 2 slices (CDHF) | C, M, N |
| spaghetti squash | ½ cup | C |
| spelt | 2 slices spelt bread (AHS) | A, M, N |
| spinach | 1½–2 cups | C, A, M |
| strawberries | ½ cup | A |
| sunflower seeds |  | M |
| swiss chard | 1½ cups | C |
| swiss cheese | 2 slices | C, N |
| tempeh | 1 cup (CDHF) or 100 g (AHS) | C, A, M |
| tofu | 100 g plain (AHS) | A |
| tomato | 1 medium | C, A |
| tuna | no FODMAPs | C, A |
| turkey | no FODMAPs | C, A |
| turnip | ½ medium | C |
| walnuts | 10–15 halves | C, A, N |
| yam | ⅓ cup | C |
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
