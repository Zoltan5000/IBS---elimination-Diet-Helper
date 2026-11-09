/*
 * Master food list for the menu checker, diet score and meal ideas.
 *
 * Every food is tagged with the sources that list it:
 *   C = Canadian Digestive Health Foundation, "Understanding the Low FODMAP Diet"
 *       (Moore K, Senchuk A, registered dietitians; updated June 10, 2026). Full text checked.
 *   A = Alberta Health Services, "Low FODMAP Eating" handout 404120-NFS
 *       (AHS Nutrition Services registered dietitians; December 2017). Full text checked.
 *   M = Michigan Medicine, MyGINutrition "High FODMAP Foods" and "Low FODMAP Foods"
 *       PDFs (myginutrition.com/downloads). Read in full; the PDFs' FODMAP-group
 *       columns are graphics, so groups come from the other sources.
 *   N = Monash University, "High and low FODMAP foods" (monashfodmap.com, page
 *       copyright 2019). Read in full.
 *   app = the app's own inference (for dishes, which no source lists).
 *
 * Levels:
 *   high    = listed as high FODMAP, with no low-FODMAP serving given by any source
 *   serve   = a source gives a low-FODMAP serving size, or the sources disagree:
 *             the amount matters
 *   usually = app inference: the food is normally made from a high-FODMAP
 *             ingredient (for example bread is usually made with wheat)
 *   often   = app inference: the dish is often made with garlic, onion or
 *             another high-FODMAP ingredient (for example gravy)
 *
 * The full list with every source tag is in docs/FOOD_LIST.md.
 * This is a screening aid. FODMAP content depends on the recipe and the serving.
 */
(function () {
  'use strict';

  var GROUPS = {
    'fructose':       { name: 'Fructose', swap: 'maple syrup instead of honey; oranges, kiwi, strawberries, blueberries or pineapple instead of apples, pears or mango' },
    'lactose':        { name: 'Lactose', swap: 'lactose-free milk, yogurt or ice cream; almond milk; hard cheeses such as cheddar, mozzarella, parmesan or swiss' },
    'fructan-grain':  { name: 'Fructans (wheat, rye, barley)', swap: 'rice, potato, oats, quinoa, millet, gluten-free bread or pasta, or sourdough or spelt bread' },
    'fructan-garlic': { name: 'Fructans (garlic)', swap: 'garlic-infused oil, which carries the flavor without the FODMAPs' },
    'fructan-onion':  { name: 'Fructans (onion)', swap: 'chives, the green tops of spring onions, the green parts of leeks, or asafoetida (Michigan)' },
    'fructan-other':  { name: 'Fructans (other fruits and vegetables)', swap: 'low-FODMAP fruits and vegetables such as oranges, kiwi, carrot, cucumber, spinach or zucchini' },
    'gos':            { name: 'GOS (legumes, some nuts)', swap: 'small serves of canned, rinsed lentils or chickpeas; firm tofu or tempeh; peanuts, walnuts or macadamias' },
    'sorbitol':       { name: 'Sorbitol (a polyol)', swap: 'oranges, kiwi, pineapple, strawberries or blueberries; sweeteners that don\'t end in "-ol"' },
    'mannitol':       { name: 'Mannitol (a polyol)', swap: 'zucchini, carrot, eggplant, green beans, potato or green bell pepper' },
    'polyol':         { name: 'Polyols (sugar alcohols)', swap: 'low-FODMAP fruits and vegetables, and sweeteners that don\'t end in "-ol"' },
    'unspecified':    { name: 'FODMAPs (type not given by the sources)', swap: 'a low-FODMAP alternative such as weak black tea, green or peppermint tea, or drip coffee' }
  };

  var SOURCES = {
    C: 'CDHF', A: 'Alberta Health Services', M: 'Michigan Medicine', N: 'Monash', app: 'app\'s guess'
  };

  // [word, groups ('|'-separated), level, sources, note, phrases to ignore when matching this word]
  var FOODS = [
    // ---- fructans: vegetables, fruits and other ----
    ['artichoke', 'fructan-other', 'high', 'CAMN'],
    ['chicory', 'fructan-other', 'high', 'CAM', 'chicory root (inulin)'],
    ['inulin', 'fructan-other', 'high', 'CAM'],
    ['fructooligosaccharide', 'fructan-other', 'high', 'CAM'],
    ['fructo-oligosaccharide', 'fructan-other', 'high', 'CAM'],
    ['hummus', 'fructan-other|gos', 'high', 'C', 'listed under fructans by CDHF; made from chickpeas (GOS)'],
    ['houmous', 'fructan-other|gos', 'high', 'C'],
    ['pumpkin', 'fructan-other|polyol', 'serve', 'CM', 'CDHF lists pumpkin as high; Michigan says less than ½ cup canned pumpkin is low', ['pumpkin seed', 'pumpkin seeds']],
    ['beet', 'fructan-other', 'serve', 'CAM', 'CDHF lists beets as high, but ⅓ cup canned (CDHF), 4 slices boiled (AHS) or 2 slices (Michigan) are low'],
    ['beetroot', 'fructan-other', 'serve', 'CAM', '⅓ cup canned (CDHF), 4 slices boiled (AHS) or 2 slices (Michigan) are low'],
    ['brussels sprout', 'fructan-other', 'serve', 'CAM', 'CDHF lists them as high; AHS says 4 sprouts and Michigan says ½ cup or less are low'],
    ['dried apricot', 'fructan-other|sorbitol', 'high', 'C'],
    ['banana', 'fructan-other', 'serve', 'CAMN', 'a firm banana is low (CDHF, Monash); AHS says 1 medium banana is low; a ripe banana is high in fructans (CDHF)'],
    ['dried cranberry', 'fructan-other', 'high', 'C'], ['dried cranberries', 'fructan-other', 'high', 'C'],
    ['currant', 'fructan-other', 'high', 'C', 'dried currants'],
    ['fig', 'fructan-other|fructose', 'high', 'CMN', 'dried figs (fructans) and figs (excess fructose)'],
    ['grapefruit', 'fructan-other', 'high', 'CAM'],
    ['honeydew', 'fructan-other', 'serve', 'CAM', 'CDHF lists it as high; AHS says ½ cup is low, and Michigan lists it as low'],
    ['nectarine', 'fructan-other|sorbitol', 'high', 'CAMN'],
    ['persimmon', 'fructan-other', 'high', 'CAM'],
    ['pomegranate', 'fructan-other|fructose', 'high', 'CA', 'pomegranate seeds (CDHF) and pomegranate juice (AHS)'],
    ['prune', 'fructan-other|sorbitol', 'high', 'CAM'],
    ['raisin', 'fructan-other', 'serve', 'CM', 'CDHF lists raisins as high; Michigan says 1 Tbsp is low'],
    ['dried fruit', 'fructan-other|fructose', 'serve', 'MN', 'Monash lists dried fruit as high in excess fructose; Michigan says 1 Tbsp or less is low'],
    ['watermelon', 'fructan-other|fructose|mannitol', 'high', 'CAMN'],
    ['rambutan', 'fructan-other', 'high', 'A'],
    ['apricot', 'fructan-other|sorbitol', 'high', 'CAM'],
    ['plum', 'fructan-other|sorbitol', 'high', 'CAMN'],
    ['peach', 'fructan-other|sorbitol', 'high', 'CAMN'],
    ['corn syrup', 'fructan-other', 'serve', 'CM', 'sources disagree: CDHF lists corn syrup as high in fructans, Michigan lists corn syrup as low', ['high fructose corn syrup', 'high-fructose corn syrup', 'high-maltose corn syrup']],
    // ---- fructans: garlic and onion ----
    ['garlic', 'fructan-garlic', 'high', 'CAMN', 'including garlic powder and garlic salt'],
    ['onion', 'fructan-onion', 'high', 'CAMN', 'including onion powder and onion salt', ['spring onion', 'fructan-onion', 'serve', 'CAMN', 'the white part or whole spring onion is high (CDHF, Michigan, Monash); the green tops are low (CDHF, AHS, Michigan)']],
    ['shallot', 'fructan-onion', 'high', 'AM'],
    ['leek', 'fructan-onion', 'high', 'CAMN', 'the green parts are low (CDHF: 1 cup)'],
    ['spring onion', 'fructan-onion', 'serve', 'CA', 'the white part is high (CDHF); the green tops are low (CDHF, AHS)'],
    ['green onion', 'fructan-onion', 'serve', 'CAMN', 'the white part or whole spring onion is high (CDHF, Michigan, Monash); the green tops are low (CDHF, AHS, Michigan)'],
    ['scallion', 'fructan-onion', 'serve', 'CAMN', 'the white part or whole spring onion is high (CDHF, Michigan, Monash); the green tops are low (CDHF, AHS, Michigan)'],
    // ---- fructans: grains ----
    ['wheat', 'fructan-grain', 'high', 'CAMN', 'AHS: avoid foods with wheat in the first 5 ingredients. Michigan lists wheat starch, wheat dextrin and wheat maltodextrin as low', ['buckwheat', 'wheat protein', 'wheat starch', 'wheat dextrin', 'wheat maltodextrin']],
    ['rye', 'fructan-grain', 'high', 'CAMN', 'AHS says 1 slice of sourdough rye bread is low'],
    ['barley', 'fructan-grain|gos', 'high', 'CAMN'],
    ['couscous', 'fructan-grain', 'high', 'CAM'],
    ['bulgur', 'fructan-grain', 'high', 'M'],
    ['kamut', 'fructan-grain', 'high', 'M'],
    ['all-purpose flour', 'fructan-grain', 'high', 'M'],
    ['muesli', 'fructan-grain', 'high', 'A'],
    ['seitan', 'fructan-grain', 'serve', 'AM', 'vital wheat protein; AHS says 2 Tbsp is low, and Michigan lists seitan as a protein source'],
    // usually made from wheat (app inference; wheat is high in all four sources)
    ['bread', 'fructan-grain', 'usually', 'N', 'usually made with wheat; wheat, rye and barley breads are high (Monash), while sourdough, spelt and gluten-free breads are low (CDHF, AHS, Michigan, Monash)'],
    ['bun', 'fructan-grain', 'usually', 'app', 'usually made with wheat'],
    ['bagel', 'fructan-grain', 'usually', 'app', 'usually made with wheat'],
    ['baguette', 'fructan-grain', 'usually', 'app', 'usually made with wheat'],
    ['brioche', 'fructan-grain', 'usually', 'app', 'usually made with wheat'],
    ['toast', 'fructan-grain', 'usually', 'app', 'usually wheat bread'],
    ['flour tortilla', 'fructan-grain', 'usually', 'app', 'usually made with wheat; corn tortillas are low (CDHF)'],
    ['wrap', 'fructan-grain', 'usually', 'app', 'usually a wheat tortilla'],
    ['burrito', 'fructan-grain', 'usually', 'app', 'usually a wheat tortilla'],
    ['pasta', 'fructan-grain', 'usually', 'AMN', 'usually made with wheat; wheat pasta is high (AHS, Michigan, Monash), and gluten-free pasta is low (CDHF, AHS)'],
    ['spaghetti', 'fructan-grain', 'usually', 'app', 'usually wheat pasta'],
    ['linguine', 'fructan-grain', 'usually', 'app', 'usually wheat pasta'],
    ['penne', 'fructan-grain', 'usually', 'app', 'usually wheat pasta'],
    ['fettuccine', 'fructan-grain', 'usually', 'app', 'usually wheat pasta'],
    ['macaroni', 'fructan-grain', 'usually', 'app', 'usually wheat pasta'],
    ['lasagna', 'fructan-grain', 'usually', 'app', 'usually wheat pasta'],
    ['lasagne', 'fructan-grain', 'usually', 'app', 'usually wheat pasta'],
    ['ravioli', 'fructan-grain', 'usually', 'app', 'usually wheat pasta'],
    ['orzo', 'fructan-grain', 'usually', 'app', 'usually wheat pasta'],
    ['gnocchi', 'fructan-grain', 'usually', 'app', 'usually made with wheat flour'],
    ['noodle', 'fructan-grain', 'usually', 'app', 'usually made with wheat; rice noodles and 100% buckwheat soba are low (CDHF)'],
    ['ramen', 'fructan-grain', 'usually', 'app', 'usually wheat noodles'],
    ['udon', 'fructan-grain', 'usually', 'app', 'usually wheat noodles'],
    ['pizza', 'fructan-grain', 'usually', 'app', 'usually a wheat crust'],
    ['naan', 'fructan-grain', 'usually', 'app', 'usually made with wheat'],
    ['pita', 'fructan-grain', 'usually', 'app', 'usually made with wheat'],
    ['crouton', 'fructan-grain', 'usually', 'app', 'usually wheat bread'],
    ['breadcrumb', 'fructan-grain', 'usually', 'app', 'usually wheat bread'],
    ['breaded', 'fructan-grain', 'usually', 'app', 'usually wheat breadcrumbs'],
    ['battered', 'fructan-grain', 'usually', 'app', 'usually wheat flour'],
    ['tempura', 'fructan-grain', 'usually', 'app', 'usually wheat flour batter'],
    ['panko', 'fructan-grain', 'usually', 'app', 'usually wheat breadcrumbs'],
    ['pastry', 'fructan-grain', 'usually', 'app', 'usually wheat flour'],
    ['pie', 'fructan-grain', 'usually', 'app', 'usually a wheat crust', ['shepherd\'s pie', 'cottage pie']],
    ['croissant', 'fructan-grain', 'usually', 'app', 'usually wheat flour'],
    ['cake', 'fructan-grain', 'usually', 'app', 'usually wheat flour', ['rice cake', 'rice cakes']],
    ['cookie', 'fructan-grain', 'usually', 'app', 'usually wheat flour'],
    ['biscuit', 'fructan-grain', 'usually', 'N', 'usually made with wheat flour; Monash lists biscuits and snack products as high'],
    ['muffin', 'fructan-grain', 'usually', 'app', 'usually wheat flour'],
    ['pancake', 'fructan-grain', 'usually', 'app', 'usually wheat flour'],
    ['waffle', 'fructan-grain', 'usually', 'app', 'usually wheat flour'],
    ['dumpling', 'fructan-grain', 'usually', 'app', 'usually a wheat wrapper'],
    ['sandwich', 'fructan-grain', 'usually', 'app', 'usually wheat bread'],
    ['burger', 'fructan-grain', 'usually', 'app', 'usually a wheat bun'],
    ['cracker', 'fructan-grain', 'usually', 'N', 'usually made with wheat flour; Monash lists rye crispbread and snack products as high'],
    ['semolina', 'fructan-grain', 'usually', 'app', 'made from wheat'],
    ['farro', 'fructan-grain', 'usually', 'app', 'a type of wheat'],
    ['flour', 'fructan-grain', 'usually', 'app', 'usually wheat flour; arrowroot, buckwheat, corn, millet, quinoa, rice and sorghum flours are low (CDHF)', ['gram flour', 'chickpea flour', 'rice flour', 'corn flour', 'cornflour', 'buckwheat flour', 'millet flour', 'quinoa flour', 'sorghum flour', 'arrowroot flour']],
    ['gram flour', 'gos', 'usually', 'app', 'made from ground dried chickpeas, and dried legumes are high in GOS (CDHF, AHS, Michigan, Monash)'],
    ['chickpea flour', 'gos', 'usually', 'app', 'made from ground dried chickpeas, and dried legumes are high in GOS (CDHF, AHS, Michigan, Monash)'],
    ['granola', 'fructan-grain|fructose', 'usually', 'A', 'often made with muesli or dried fruit; AHS lists muesli-based and fruit-filled granola bars as high'],
    // ---- GOS: legumes and nuts ----
    ['baked bean', 'gos', 'high', 'CMN'],
    ['black bean', 'gos|fructan-other', 'high', 'CA'],
    ['borlotti', 'gos', 'high', 'C'],
    ['bortolotti', 'gos', 'high', 'C'],
    ['kidney bean', 'gos|fructan-other', 'high', 'CAMN'],
    ['lima bean', 'gos|fructan-other', 'high', 'A'],
    ['mung bean', 'gos|fructan-other', 'high', 'A'],
    ['split pea', 'gos|fructan-other', 'high', 'AN'],
    ['soybean', 'gos|fructan-other', 'high', 'CAM'],
    ['soy bean', 'gos|fructan-other', 'high', 'CAM'],
    ['soy milk', 'gos', 'serve', 'CMN', 'soy milk made from whole soybeans is high (CDHF, Michigan, Monash); soy milk made from soy protein is low (Monash)'],
    ['silken tofu', 'gos', 'high', 'C', 'firm tofu is low (CDHF, AHS, Michigan, Monash)'],
    ['legume flour', 'gos', 'high', 'C'],
    ['chickpea', 'gos', 'serve', 'CAMN', 'canned and rinsed chickpeas are low in small serves (CDHF ¼ cup, Michigan ¼ cup, AHS ½ cup, Monash small amounts)'],
    ['garbanzo', 'gos', 'serve', 'CAMN', 'canned and rinsed are low in small serves (CDHF and Michigan ¼ cup, AHS ½ cup)'],
    ['lentil', 'gos', 'serve', 'CAMN', 'boiled lentils are high (AHS); canned and rinsed are low in small serves (CDHF ⅓ cup, AHS and Michigan ½ cup)'],
    ['green pea', 'gos', 'high', 'CN'],
    ['pea', 'gos', 'high', 'CN', 'green pea', ['snow pea', 'mannitol|fructan-other|gos', 'serve', 'CAM', 'listed as high by CDHF and AHS; 5 pods or fewer are low (AHS, Michigan)']],
    ['cashew', 'gos', 'high', 'CAMN'],
    ['pistachio', 'gos|fructan-other', 'high', 'CAMN'],
    ['bean', 'gos', 'often', 'app', 'often a dried bean, and most dried beans are high in GOS (CDHF, AHS, Michigan, Monash); green beans are low',
      ['green bean', 'green bean', 'string bean', 'string bean', 'french bean', 'french bean', 'bean sprout', 'bean sprout', 'vanilla bean', 'coffee bean', 'coffee bean', 'jelly bean', 'jelly bean', 'baked bean', 'black bean', 'kidney bean', 'lima bean', 'mung bean', 'soy bean']],
    ['refried bean', 'gos', 'usually', 'app', 'made from dried beans'],
    ['falafel', 'gos', 'high', 'N', 'Monash lists falafel as high in GOS'],
    ['dal', 'gos', 'usually', 'app', 'usually made from lentils or split peas'],
    ['dhal', 'gos', 'usually', 'app', 'usually made from lentils or split peas'],
    // ---- lactose ----
    ['milk', 'lactose', 'serve', 'CAMN', 'cow\'s milk is high (CDHF, Michigan, Monash); AHS says ¼ cup is low',
      ['almond milk', 'soy milk', 'oat milk', 'rice milk', 'coconut milk', 'hemp milk', 'lactose-free milk', 'lactose free milk']],
    ['condensed milk', 'lactose', 'high', 'CN'],
    ['evaporated milk', 'lactose', 'serve', 'CAN', 'CDHF lists it as high; AHS says 2½ Tbsp is low'],
    ['powdered milk', 'lactose', 'high', 'C'],
    ['milk powder', 'lactose', 'high', 'C'],
    ['custard', 'lactose', 'high', 'CMN'],
    ['ice cream', 'lactose', 'high', 'CMN', 'lactose-free ice cream is low (CDHF, Michigan)'],
    ['yogurt', 'lactose', 'serve', 'CAMN', 'listed as high by CDHF, Michigan and Monash; AHS says ½ cup is low'],
    ['yoghurt', 'lactose', 'serve', 'CAMN', 'listed as high by CDHF, Michigan and Monash; AHS says ½ cup is low'],
    ['ricotta', 'lactose', 'high', 'CMN'],
    ['cottage cheese', 'lactose', 'serve', 'CAMN', 'listed as high by CDHF and Michigan; AHS says ½ cup is low'],
    ['cream cheese', 'lactose', 'high', 'CMN'],
    ['mascarpone', 'lactose', 'high', 'CMN'],
    ['buttermilk', 'lactose', 'serve', 'A', 'AHS says ⅓ cup is low'],
    ['sour cream', 'lactose', 'serve', 'A', 'AHS says ¼ cup is low'],
    ['kefir', 'lactose', 'serve', 'A', 'AHS says ½ cup is low'],
    ['cream', 'lactose', 'serve', 'C', 'CDHF says ½ cup whipped cream is low', ['ice cream', 'sour cream', 'cream cheese', 'coconut cream', 'lactose-free cream']],
    ['latte', 'lactose', 'high', 'C', 'espresso drinks with cow\'s milk (CDHF); lactose-free or almond milk versions are low'],
    ['cappuccino', 'lactose', 'high', 'C', 'espresso drinks with cow\'s milk (CDHF)'],
    ['flat white', 'lactose', 'high', 'C', 'espresso drinks with cow\'s milk (CDHF)'],
    ['mocha', 'lactose', 'high', 'C', 'espresso drinks with cow\'s milk (CDHF)'],
    ['oat milk', 'unspecified', 'high', 'M', 'listed on Michigan\'s high-FODMAP list'],
    ['rice milk', 'unspecified', 'serve', 'MN', 'sources disagree: Michigan lists rice milk as high, Monash lists it as low'],
    ['milkshake', 'lactose', 'usually', 'app', 'usually made with milk and ice cream'],
    ['gelato', 'lactose', 'high', 'M'],
    ['alfredo', 'lactose', 'usually', 'app', 'usually a cream sauce'],
    ['bechamel', 'lactose', 'usually', 'app', 'usually made with milk'],
    ['béchamel', 'lactose', 'usually', 'app', 'usually made with milk'],
    ['carbonara', 'lactose', 'often', 'app', 'sometimes made with cream'],
    ['mac and cheese', 'lactose', 'usually', 'app', 'usually made with milk'],
    ['creamy', 'lactose', 'often', 'app', 'often made with cream or milk'],
    // ---- excess fructose ----
    ['honey', 'fructose', 'high', 'CAM'],
    ['agave', 'fructose', 'high', 'CAM'],
    ['high fructose corn syrup', 'fructose', 'high', 'CAM'],
    ['high-fructose corn syrup', 'fructose', 'high', 'CAM'],
    ['glucose-fructose', 'fructose', 'high', 'CA'],
    ['fructose-glucose', 'fructose', 'high', 'C'],
    ['apple', 'fructose|sorbitol', 'high', 'CAMN', '', ['pineapple']],
    ['applesauce', 'fructose|sorbitol', 'high', 'A'],
    ['apple juice', 'fructose|sorbitol', 'high', 'CAN'],
    ['pear', 'fructose|sorbitol', 'high', 'CAMN'],
    ['mango', 'fructose', 'high', 'CAMN'],
    ['cherry', 'fructose|sorbitol', 'high', 'CAMN', '', ['cherry tomato', 'cherry tomatoes']],
    ['cherries', 'fructose|sorbitol', 'high', 'CAMN'],
    ['grape', 'fructose', 'serve', 'CAM', 'CDHF and AHS list grapes as high; Michigan\'s low list includes them. Sources disagree, so check the amount', ['grapefruit']],
    ['grape juice', 'fructose', 'high', 'A'],
    ['asparagus', 'fructose', 'serve', 'CAMN', 'CDHF and Monash list it as high; AHS says 3 spears are low'],
    ['bell pepper', 'fructose', 'serve', 'CAMN', 'CDHF and Monash list red bell pepper as high; green is low (CDHF, AHS, Michigan, Monash); AHS says 1 cup red is low, and Michigan lists red as low'],
    ['red pepper', 'fructose', 'serve', 'CAMN', 'CDHF and Monash list red peppers as high; AHS says 1 cup is low, and Michigan lists red and green peppers as low'],
    ['snap pea', 'fructose', 'high', 'CM'],
    ['tomato juice', 'fructose', 'high', 'C'],
    ['orange juice', 'fructose', 'serve', 'CA', 'CDHF lists it as high; AHS says ½ cup is low'],
    ['pomegranate juice', 'fructose', 'high', 'A'],
    ['cola', 'fructose', 'serve', 'CAM', 'CDHF lists regular and diet cola as high; AHS lists soft drinks made with glucose-fructose as high; Michigan says 8 oz of diet or sugar-sweetened soda is low'],
    ['soda', 'fructose', 'often', 'AM', 'often sweetened with glucose-fructose (high-fructose corn syrup), which AHS lists as high; Michigan says 8 oz of diet or sugar-sweetened soda is low'],
    ['ginger ale', 'fructose', 'often', 'A', 'often sweetened with glucose-fructose, which AHS lists as high'],
    ['lemonade', 'fructose', 'serve', 'CA', 'CDHF says ¾ cup is low; AHS lists frozen concentrated lemonade as high'],
    ['coconut water', 'unspecified', 'high', 'C'],
    ['rum', 'unspecified', 'high', 'CM'],
    ['port wine', 'unspecified', 'high', 'C'],
    ['chai', 'unspecified', 'serve', 'C', 'strong chai is high; weak tea is low (CDHF)'],
    ['chamomile', 'unspecified', 'serve', 'CM', 'Michigan lists chamomile tea as high; CDHF says strong chamomile tea is high'],
    ['oolong', 'unspecified', 'serve', 'CM', 'Michigan lists oolong tea as high; CDHF says strong oolong is high'],
    // ---- polyols ----
    ['blackberry', 'sorbitol', 'high', 'CAM'], ['blackberries', 'sorbitol', 'high', 'CAM'],
    
    ['lychee', 'sorbitol', 'high', 'CAM'],
    ['longan', 'sorbitol', 'high', 'AM'],
    ['avocado', 'sorbitol', 'serve', 'AM', '⅛ of an avocado is low (AHS, Michigan); more is high (AHS, Michigan)'],
    ['sorbitol', 'sorbitol', 'high', 'CAM'],
    ['mannitol', 'mannitol', 'high', 'CAM'],
    ['xylitol', 'polyol', 'high', 'CAM'],
    ['maltitol', 'polyol', 'high', 'CAM'],
    ['isomalt', 'polyol', 'high', 'CAM'],
    ['sugar-free gum', 'sorbitol', 'high', 'A'],
    ['sugar-free syrup', 'sorbitol', 'high', 'A'],
    ['sugar-free', 'sorbitol', 'often', 'A', 'often sweetened with sugar alcohols; AHS lists sugar-free gum, syrup and frozen desserts as high in sorbitol'],
    ['sugar free', 'sorbitol', 'often', 'A', 'often sweetened with sugar alcohols; AHS lists sugar-free gum, syrup and frozen desserts as high in sorbitol'],
    ['horseradish', 'sorbitol', 'high', 'A'],
    ['wasabi', 'sorbitol', 'high', 'A', 'AHS lists horseradish sauce (wasabi)'],
    ['mushroom', 'mannitol|fructan-other', 'high', 'CAMN'],
    ['portobello', 'mannitol|fructan-other', 'high', 'CAMN', 'a type of mushroom'],
    ['shiitake', 'mannitol|fructan-other', 'high', 'CAMN', 'a type of mushroom'],
    ['cauliflower', 'mannitol', 'high', 'CAM'],
    ['celery', 'mannitol', 'serve', 'CAMN', 'Monash says celery is rich in mannitol and CDHF lists it as high; AHS says ¼ stalk and Michigan says ½ stalk or less is low'],
    ['corn', 'polyol', 'serve', 'CAM', 'CDHF lists corn as high; ½ cup canned corn (CDHF) or ½ cob (AHS, Michigan) is low', ['corn tortilla', 'corn tortillas', 'corn bread', 'corn flour', 'corn syrup', 'corn flakes', 'corn pasta', 'corn starch', 'cornstarch', 'baby corn']],
    ['snow pea', 'mannitol|fructan-other|gos', 'serve', 'CAM', 'listed as high by CDHF and AHS; 5 pods or fewer are low (AHS, Michigan)'],
    ['sweet potato', 'mannitol', 'serve', 'CAM', 'AHS lists it as high in mannitol; CDHF says ⅓ cup and Michigan says ½ cup or less is low'],
    // ---- dishes often made with garlic or onion (app inference) ----
    ['garlic bread', 'fructan-garlic|fructan-grain', 'usually', 'app', 'made with garlic and usually wheat bread'],
    ['aioli', 'fructan-garlic', 'usually', 'app', 'usually made with garlic'],
    ['pesto', 'fructan-garlic', 'usually', 'app', 'usually made with garlic'],
    ['tzatziki', 'fructan-garlic|lactose', 'usually', 'app', 'usually made with garlic and yogurt'],
    ['chimichurri', 'fructan-garlic', 'usually', 'app', 'usually made with garlic'],
    ['scampi', 'fructan-garlic', 'usually', 'app', 'usually cooked with garlic'],
    ['gremolata', 'fructan-garlic', 'usually', 'app', 'usually made with garlic'],
    ['kimchi', 'fructan-garlic|fructan-onion', 'usually', 'app', 'usually made with garlic and onion'],
    ['sofrito', 'fructan-onion|fructan-garlic', 'usually', 'app', 'usually made with onion and garlic'],
    ['gravy', 'fructan-onion|fructan-grain', 'often', 'N', 'often made with onion and wheat flour; Monash lists meats served with gravy or sauces that may contain high-FODMAP ingredients as high'],
    ['stock', 'fructan-onion|fructan-garlic', 'often', 'app', 'often made with onion and garlic'],
    ['broth', 'fructan-onion|fructan-garlic', 'often', 'app', 'often made with onion and garlic'],
    ['soup', 'fructan-onion|fructan-garlic', 'often', 'app', 'often made with onion and garlic'],
    ['curry', 'fructan-onion|fructan-garlic', 'often', 'app', 'often made with onion and garlic'],
    ['stew', 'fructan-onion|fructan-garlic', 'often', 'app', 'often made with onion and garlic'],
    ['chili', 'fructan-onion|gos', 'often', 'app', 'often made with onion and beans', ['red chili', 'red chili', 'chili flakes']],
    ['chilli', 'fructan-onion|gos', 'often', 'app', 'often made with onion and beans', ['red chilli', 'chilli flakes']],
    ['salsa', 'fructan-onion|fructan-garlic', 'often', 'app', 'often made with onion and garlic'],
    ['guacamole', 'fructan-onion|sorbitol', 'often', 'app', 'often made with onion; avocado is low only in small serves (AHS, Michigan)'],
    ['marinara', 'fructan-onion|fructan-garlic', 'often', 'app', 'often made with onion and garlic'],
    ['tomato sauce', 'fructan-onion|fructan-garlic|fructose', 'often', 'A', 'often made with onion and garlic; AHS lists canned pasta with tomato sauce as high in fructose'],
    ['bolognese', 'fructan-onion|fructan-garlic', 'often', 'app', 'often made with onion and garlic'],
    ['ragu', 'fructan-onion|fructan-garlic', 'often', 'app', 'often made with onion and garlic'],
    
    
    ['marinade', 'fructan-onion|fructan-garlic', 'often', 'N', 'often made with garlic or onion; Monash lists garlic- and onion-based marinades as high'],
    ['marinated', 'fructan-onion|fructan-garlic', 'often', 'N', 'often made with garlic or onion; Monash lists marinated meats as high'],
    ['seasoning', 'fructan-onion|fructan-garlic', 'often', 'A', 'may contain garlic or onion; AHS advises avoiding mixed spice blends that may contain them'],
    ['spice blend', 'fructan-onion|fructan-garlic', 'often', 'A', 'may contain garlic or onion; AHS advises avoiding mixed spice blends that may contain them'],
    ['caesar', 'fructan-garlic', 'often', 'app', 'the dressing is often made with garlic'],
    ['ranch', 'fructan-garlic|fructan-onion', 'often', 'app', 'the dressing is often made with garlic and onion'],
    ['relish', 'fructan-onion', 'often', 'app', 'often made with onion'],
    ['meatball', 'fructan-onion|fructan-grain', 'often', 'A', 'often made with onion and breadcrumbs; AHS lists canned pasta with meatballs as high'],
    ['boysenberry', 'unspecified', 'high', 'M'],
    ['custard apple', 'unspecified', 'high', 'M'],
    ['canned fruit', 'unspecified', 'often', 'M', 'Michigan lists canned fruit in natural juice as high'],
    ['nashi', 'fructose|sorbitol', 'high', 'N', 'nashi pears (Monash)'],
    ['savoy cabbage', 'unspecified', 'high', 'M', 'other cabbage is low (CDHF, AHS, Michigan)'],
    ['tomato paste', 'unspecified', 'high', 'M'],
    ['almond', 'gos|fructan-other', 'serve', 'AM', '10 almonds or fewer are low (AHS, Michigan); more is high (Michigan)', ['almond milk', 'almond butter', 'almond flour']],
    ['hazelnut', 'gos|fructan-other', 'serve', 'AM', '10 hazelnuts are low (AHS); more than 10 is high (Michigan)'],
    ['cocoa powder', 'unspecified', 'serve', 'M', '1 Tbsp or less is low; more is high (Michigan)'],
    ['carob', 'unspecified', 'high', 'M'],
    ['textured vegetable protein', 'unspecified', 'high', 'M'],
    ['vegetarian mince', 'unspecified', 'high', 'N'],
    ['natural flavor', 'unspecified', 'often', 'M', 'Michigan lists "natural flavor" in savory foods as high, because it can include garlic or onion'],
    ['sausage', 'fructan-garlic|fructan-onion', 'often', 'N', 'processed meats such as sausage often contain garlic or onion; Monash lists them as high'],
    ['salami', 'fructan-garlic|fructan-onion', 'often', 'N', 'processed meats such as salami often contain garlic or onion; Monash lists them as high'],
    ['dandelion tea', 'unspecified', 'high', 'M'],
    ['fennel tea', 'unspecified', 'high', 'M'],
    ['fructose', 'fructose', 'high', 'AM', 'listed as an ingredient (crystalline fructose, fructose solids)', ['high fructose', 'high-fructose', 'glucose-fructose', 'fructose-glucose']],
    ['fruit juice concentrate', 'fructose', 'high', 'M'],
    ['lactitol', 'polyol', 'high', 'M'],
    ['erythritol', 'polyol', 'serve', 'MN', 'Michigan lists erythritol on both its high and low lists (marked with an asterisk); Monash names it among the sugar polyols'],
    ['glycerol', 'polyol', 'high', 'M', 'also called glycerin'],
    ['glycerin', 'polyol', 'high', 'M'],
    ['polydextrose', 'unspecified', 'high', 'M'],
    ['molasses', 'unspecified', 'serve', 'AM', 'sources disagree: Michigan lists molasses as high, AHS says 1 Tbsp is low'],
    ['milk solids', 'lactose', 'high', 'M', 'dry milk solids'],
    // ---- added Nov 2026 after testing: common foods missing from the sources' lists (app inference unless tagged) ----
    ['pretzel', 'fructan-grain', 'usually', 'app', 'usually made with wheat flour'],
    ['cereal', 'fructan-grain', 'usually', 'N', 'often made with wheat; Monash lists breakfast cereals as high. Some, like cornflakes (AHS) and gluten-free cereals (Michigan), are low', ['rice cereal']],
    ['scone', 'fructan-grain', 'usually', 'app', 'usually made with wheat flour'],
    ['donut', 'fructan-grain', 'usually', 'app', 'usually made with wheat flour'],
    ['doughnut', 'fructan-grain', 'usually', 'app', 'usually made with wheat flour'],
    ['brownie', 'fructan-grain', 'usually', 'app', 'usually made with wheat flour'],
    ['churro', 'fructan-grain', 'usually', 'app', 'usually made with wheat flour'],
    ['crepe', 'fructan-grain|lactose', 'usually', 'app', 'usually made with wheat flour and milk'],
    ['strudel', 'fructan-grain', 'usually', 'app', 'usually wheat pastry'],
    ['danish', 'fructan-grain', 'usually', 'app', 'usually wheat pastry'],
    ['dinner roll', 'fructan-grain', 'usually', 'app', 'usually made with wheat'],
    ['bread roll', 'fructan-grain', 'usually', 'app', 'usually made with wheat'],
    ['hot dog', 'fructan-grain|fructan-garlic|fructan-onion', 'usually', 'N', 'usually a wheat bun and a processed sausage, which often contains garlic or onion (Monash lists processed meats as high)'],
    ['spring roll', 'fructan-grain|fructan-garlic', 'usually', 'app', 'usually a wheat wrapper, often with garlic', ['rice paper spring roll', 'fresh spring roll']],
    ['egg roll', 'fructan-grain|fructan-garlic', 'usually', 'app', 'usually a wheat wrapper, often with garlic or onion'],
    ['wonton', 'fructan-grain|fructan-garlic', 'usually', 'app', 'usually a wheat wrapper, often with garlic or spring onion'],
    ['gyoza', 'fructan-grain|fructan-garlic', 'usually', 'app', 'usually a wheat wrapper, often with garlic'],
    ['pakora', 'gos|fructan-onion', 'usually', 'app', 'usually a gram (chickpea) flour batter, often with onion'],
    ['bhaji', 'gos|fructan-onion', 'usually', 'app', 'usually onion in a gram (chickpea) flour batter'],
    ['tikka', 'fructan-garlic|lactose', 'often', 'app', 'usually marinated in yogurt with garlic and spices'],
    ['tandoori', 'fructan-garlic|lactose', 'often', 'app', 'usually marinated in yogurt with garlic and spices'],
    ['spaetzle', 'fructan-grain', 'usually', 'app', 'egg noodles made with wheat flour'],
    ['spätzle', 'fructan-grain', 'usually', 'app', 'egg noodles made with wheat flour'],
    ['spatzle', 'fructan-grain', 'usually', 'app', 'egg noodles made with wheat flour'],
    ['chowder', 'fructan-onion|lactose', 'usually', 'app', 'usually made with onion, and New England style with milk or cream'],
    ['potato salad', 'fructan-onion', 'often', 'app', 'often made with onion'],
    ['obatzda', 'fructan-onion|lactose', 'usually', 'app', 'a Bavarian cheese spread usually made with onion and soft cheese'],
    ['dry rub', 'fructan-garlic|fructan-onion', 'often', 'app', 'often made with garlic or onion powder'],
    ['spice rub', 'fructan-garlic|fructan-onion', 'often', 'app', 'often made with garlic or onion powder'],
    ['samosa', 'fructan-grain|fructan-onion|gos', 'usually', 'app', 'usually wheat pastry with onion and often peas'],
    ['empanada', 'fructan-grain|fructan-onion', 'usually', 'app', 'usually wheat pastry, often with onion'],
    ['pierogi', 'fructan-grain|fructan-onion', 'usually', 'app', 'usually a wheat dough, often with onion'],
    ['quesadilla', 'fructan-grain', 'usually', 'app', 'usually a wheat flour tortilla; corn tortillas are low (CDHF)', ['corn quesadilla']],
    ['enchilada', 'fructan-onion|fructan-garlic', 'often', 'app', 'the sauce is often made with onion and garlic'],
    ['fajita', 'fructan-onion|fructan-grain', 'often', 'app', 'often cooked with onion and served in wheat tortillas'],
    ['stuffing', 'fructan-grain|fructan-onion', 'usually', 'app', 'usually bread with onion'],
    ['meatloaf', 'fructan-onion|fructan-grain', 'usually', 'app', 'usually made with onion and breadcrumbs'],
    ['cheesecake', 'lactose|fructan-grain', 'usually', 'app', 'usually made with cream cheese and a wheat biscuit base'],
    ['pudding', 'lactose', 'often', 'app', 'often made with milk'],
    ['mousse', 'lactose', 'often', 'app', 'often made with cream'],
    ['milk chocolate', 'lactose', 'often', 'app', 'contains milk; Monash lists dark chocolate as low'],
    ['cheese sauce', 'lactose|fructan-grain', 'usually', 'app', 'usually made with milk and wheat flour'],
    ['fondue', 'lactose|fructan-garlic', 'often', 'app', 'often made with garlic'],
    ['smoothie', 'fructose|lactose', 'often', 'app', 'often made with high-FODMAP fruit, juice, yogurt or milk'],
    ['protein bar', 'fructan-other|polyol', 'often', 'A', 'often contain inulin, chicory root or sugar alcohols, which AHS tells you to check labels for'],
    ['energy bar', 'fructan-other|polyol', 'often', 'A', 'often contain inulin, dried fruit or sugar alcohols (AHS label list)'],
    ['fruit juice', 'fructose', 'often', 'CA', 'apple, orange and grape juices are listed as high (CDHF, AHS); cranberry juice is low (CDHF)'],
    ['onion ring', 'fructan-onion|fructan-grain', 'usually', 'app', 'onion in a wheat batter'],
    ['hot sauce', 'fructan-garlic', 'often', 'N', 'often made with garlic; Monash says sauces can contain garlic and onion'],
    ['sriracha', 'fructan-garlic', 'usually', 'app', 'usually made with garlic'],
    ['teriyaki', 'fructan-garlic|fructan-onion', 'often', 'N', 'often made with garlic or onion; Monash says sauces and marinades can contain them'],
    ['hoisin', 'fructan-garlic', 'often', 'N', 'often made with garlic; Monash says sauces can contain it'],
    ['stir fry', 'fructan-garlic|fructan-onion', 'often', 'app', 'often cooked with garlic, onion or a garlic-based sauce'],
    ['stir-fry', 'fructan-garlic|fructan-onion', 'often', 'app', 'often cooked with garlic, onion or a garlic-based sauce'],
    ['pad thai', 'fructan-garlic|fructan-onion', 'usually', 'app', 'usually made with garlic and shallots'],
    ['fried rice', 'fructan-garlic|fructan-onion', 'often', 'app', 'often made with onion, spring onion or garlic'],
    ['risotto', 'fructan-onion|fructan-garlic', 'often', 'app', 'often made with onion and stock'],
    ['paella', 'fructan-onion|fructan-garlic', 'often', 'app', 'often made with onion and garlic'],
    ['pho', 'fructan-onion', 'often', 'app', 'the broth is often made with onion'],
    ['biryani', 'fructan-onion|fructan-garlic', 'usually', 'app', 'usually made with onion and garlic'],
    ['masala', 'fructan-onion|fructan-garlic', 'often', 'app', 'the sauce is often made with onion and garlic'],
    ['korma', 'fructan-onion|lactose|gos', 'often', 'app', 'often made with onion, cream and cashews'],
    ['shawarma', 'fructan-garlic', 'often', 'app', 'often marinated with garlic and served with garlic sauce'],
    ['gyro', 'fructan-onion|fructan-garlic|fructan-grain', 'often', 'app', 'often served with onion, tzatziki and pita'],
    ['kebab', 'fructan-onion|fructan-garlic', 'often', 'N', 'often marinated; Monash lists marinated meats as high'],
    ['baba ganoush', 'fructan-garlic', 'usually', 'app', 'usually made with garlic'],
    ['shepherd\'s pie', 'fructan-onion', 'often', 'app', 'the filling is often made with onion and stock'],
    ['cottage pie', 'fructan-onion', 'often', 'app', 'the filling is often made with onion and stock'],
    ['sauce', 'fructan-garlic|fructan-onion', 'often', 'N', 'Monash says sauces can contain garlic and onion, so ask; soy sauce, barbecue sauce and mayonnaise are low (Monash)',
      ['soy sauce', 'bbq sauce', 'barbecue sauce', 'tomato sauce', 'cheese sauce', 'hot sauce', 'fish sauce', 'apple sauce']],
    ['dressing', 'fructan-garlic|fructan-onion', 'often', 'N', 'Monash says dressings and condiments can contain garlic and onion, so ask for it on the side'],
    ['dip', 'fructan-garlic|fructan-onion', 'often', 'N', 'Monash says dips can contain garlic and onion']
  ];

  // Phrases removed before matching. `suppress` clears a FODMAP group for the whole item.
  var NEGATIONS = [
    { re: /garlic[- ]infused( olive)? oil|onion[- ]infused( olive)? oil|garlic oil|infused oils?/g },
    { re: /\b(no|without|hold the|minus) (garlic|onions?)\b/g },
    { re: /\blactose[- ]free\b/g, suppress: 'lactose' },
    { re: /\balmond milk\b/g, suppress: 'lactose' },
    { re: /\b(gluten[- ]free|\bgf\b)/g, suppress: 'fructan-grain' },
    { re: /\b(rice|glass|soba|buckwheat soba|rice vermicelli) noodles?\b/g },
    { re: /\b(sourdough|spelt|spelt sourdough|gluten[- ]free) (bread|toast|buns?|rolls?)\b/g },
    { re: /\b(on|with|served on) (sourdough|spelt|gluten[- ]free)( bread| toast)?\b/g, suppress: 'fructan-grain' },
    { re: /\bsourdough\b/g },
    { re: /\b(arrowroot|buckwheat|corn|millet|quinoa|rice|sorghum|almond|coconut|oat) flours?\b/g },
    { re: /\brice (paper|pasta|cakes?)\b/g },
    { re: /\bcorn (tortillas?|tacos?|pasta)\b/g },
    { re: /\bgreen (tops of )?(spring onions?|scallions?|onions?)\b/g },
    { re: /\b(spring onion|green onion|scallion) (greens?|tops?)\b/g },
    { re: /\bleek (greens?|tops?|leaves)\b|\bgreen parts? of (the )?leeks?\b/g },
    { re: /\bfirm tofu\b/g },
    { re: /\bpeanut butter\b/g }
  ];

  // Low-FODMAP foods, used to praise good choices. [word, serving size note, sources]
  var GOOD = [
    // proteins and fats: no FODMAPs
    ['chicken', 'no FODMAPs', 'CAMN'], ['turkey', 'no FODMAPs', 'CAM'], ['beef', 'no FODMAPs', 'CAMN'], ['steak', 'no FODMAPs (beef)', 'CAMN'], ['pork', 'no FODMAPs', 'CAM'],
    ['lamb', 'no FODMAPs', 'CA'], ['ham', 'no FODMAPs', 'A'], ['fish', 'no FODMAPs', 'CAMN'], ['salmon', 'no FODMAPs', 'CA'],
    ['tuna', 'no FODMAPs', 'CA'], ['cod', 'no FODMAPs', 'CA'], ['shrimp', 'no FODMAPs', 'CMN'], ['prawn', 'no FODMAPs', 'CMN'],
    ['seafood', 'no FODMAPs', 'CMN'], ['egg', 'no FODMAPs', 'CAMN'], ['eggs', 'no FODMAPs', 'CAMN'], ['tempeh', '1 cup (CDHF) or 100 g (AHS)', 'CAMN'],
    ['olive oil', 'no FODMAPs', 'CAM'], ['butter', 'no FODMAPs', 'CN'], ['ghee', 'no FODMAPs', 'C'],
    ['garlic-infused oil', 'no FODMAPs', 'CA'], ['garlic infused oil', 'no FODMAPs', 'CA'],
    // vegetables
    ['arugula', '2 cups', 'C'], ['bean sprouts', '2 cups', 'CM'], ['bean shoot', '', 'M'], ['alfalfa', '½ cup', 'AM'], ['bamboo shoot', '', 'M'],
    ['bok choy', '1 cup', 'CAMN'], ['choy sum', '', 'M'], ['broccoli', '½ cup (AHS, Michigan) to ¾ cup heads (CDHF)', 'CAM'],
    ['cabbage', '½–¾ cup', 'CAM'], ['carrot', '1 medium', 'CAMN'], ['collard greens', '1 cup', 'C'], ['cucumber', '½–1 cup', 'CAN'],
    ['eggplant', '1 cup', 'CAMN'], ['aubergine', '1 cup', 'N'], ['green beans', '15 beans', 'CMN'], ['kale', '½ cup', 'C'],
    ['lettuce', '1–1½ cups', 'CAMN'], ['endive', '', 'M'], ['okra', '6 pods (Michigan) or 7 (CDHF)', 'CM'], ['parsnip', '1 medium', 'CM'],
    ['potato', '¼ cup (CDHF) to 1 cup (AHS)', 'CAMN'], ['potatoes', '¼ cup (CDHF) to 1 cup (AHS)', 'CAMN'], ['radish', '4 radishes', 'C'],
    ['rutabaga', '¼ cup', 'CM'], ['sauerkraut', '⅓ cup', 'C'], ['seaweed', '2 sheets', 'C'], ['spinach', '1½–2 cups', 'CAM'],
    ['spaghetti squash', '½ cup', 'CM'], ['butternut squash', '¼ cup', 'AM'], ['swiss chard', '1½ cups', 'CM'], ['tomato', '1 medium', 'CAM'],
    ['turnip', '½ medium', 'CM'], ['yam', '⅓ cup', 'CM'], ['taro', '', 'M'], ['choko', '', 'M'], ['zucchini', '½ cup', 'AM'], ['courgette', '½ cup', 'AM'],
    ['fennel', '1 cup or less (Michigan)', 'M'], ['olives', '', 'M'], ['chives', '½ cup', 'AM'], ['green pepper', '¼ pepper (CDHF) to ½ cup (AHS)', 'CAMN'],
    // fruits
    ['blueberries', '⅓ cup (AHS) to 1 cup (CDHF)', 'CAMN'], ['blueberry', '⅓ cup (AHS) to 1 cup (CDHF)', 'CAMN'], ['strawberries', '½ cup', 'AM'],
    ['strawberry', '½ cup', 'AM'], ['raspberries', '½ cup', 'AM'], ['raspberry', '½ cup', 'AM'],
    ['kiwi', '1–2 medium', 'CAMN'], ['kiwifruit', '1–2 medium', 'CAMN'], ['orange', '1 medium', 'CAMN'], ['oranges', '1 medium', 'CAMN'],
    ['mandarin', '1 medium', 'CMN'], ['clementine', '', 'M'], ['tangelo', '', 'M'], ['pineapple', '½–1 cup', 'CAMN'], ['cantaloupe', '½ cup', 'AMN'],
    ['papaya', '1 cup', 'CM'], ['passionfruit', '2 medium', 'CM'], ['passion fruit', '2 medium', 'CM'], ['dragon fruit', '1 medium', 'C'],
    ['guava', '1 medium', 'C'], ['rhubarb', '1 cup', 'CM'], ['kumquat', '4 medium', 'C'], ['durian', '', 'M'], ['lemon', '', 'AM'], ['lime', '', 'M'],
    // grains
    ['rice', '1 cup cooked', 'CAMN'], ['brown rice', '1 cup cooked', 'CAM'], ['quinoa', '1 cup cooked', 'CAMN'], ['quinoa flakes', '', 'N'],
    ['oats', '⅓–½ cup dry (AHS, Michigan) or ½ cup gluten-free oats (CDHF)', 'CAMN'], ['oatmeal', '½ cup cooked', 'AM'], ['porridge', '½ cup cooked', 'A'],
    ['millet', '½ cup', 'CM'], ['buckwheat', '½ cup groats', 'C'], ['polenta', '', 'M'], ['sorghum', '', 'CM'], ['tapioca', '', 'M'], ['arrowroot', '', 'CM'],
    ['psyllium', '', 'M'], ['corn tortilla', '2 small', 'C'], ['rice noodles', '½ cup', 'C'], ['soba', '⅓ cup (100% buckwheat)', 'C'],
    ['rice cakes', '4 cakes', 'CN'], ['sourdough', '2 slices (CDHF)', 'CMN'], ['spelt', '2 slices spelt bread (AHS)', 'AMN'],
    ['gluten-free', '', 'CAMN'], ['gluten free', '', 'CAMN'], ['cornflakes', '½ cup', 'A'], ['oat bran', '2 Tbsp', 'A'],
    // legumes, nuts and seeds
    ['firm tofu', '1 cup (CDHF) or 100 g (AHS)', 'CAMN'], ['tofu', '100 g plain (AHS)', 'AM'],
    ['peanuts', '32 nuts', 'CAMN'], ['peanut butter', '2 Tbsp', 'AM'], ['almond butter', '1 Tbsp', 'M'], ['tahini', '1 Tbsp', 'M'],
    ['walnuts', '10–15 halves', 'CAMN'], ['macadamias', '15–20 nuts', 'CAN'], ['macadamia', '15–20 nuts', 'CAN'], ['pecans', '15 halves', 'CM'],
    ['brazil nuts', '10 nuts', 'CAM'], ['chia', '2 Tbsp', 'CAM'], ['flaxseed', '1 Tbsp ground (Michigan) or 2 Tbsp (AHS)', 'AM'],
    ['flax', '2 Tbsp', 'AM'], ['linseed', '2 Tbsp', 'A'], ['pumpkin seeds', '3 Tbsp', 'CMN'], ['pepitas', '', 'N'], ['sunflower seeds', '', 'M'],
    ['sesame', '3 Tbsp', 'CM'], ['poppy seeds', '', 'M'], ['pine nuts', '2 tsp', 'CM'], ['hemp hearts', '3 Tbsp', 'C'],
    // dairy and alternatives
    ['lactose-free', 'as tolerated (AHS)', 'CAMN'], ['lactose free', 'as tolerated (AHS)', 'CAMN'], ['almond milk', '1 cup', 'CMN'], ['hemp milk', '', 'M'],
    ['coconut milk', 'canned, for cooking (Michigan)', 'M'], ['cheddar', '2 slices (CDHF) or 50 g (AHS)', 'CAN'], ['parmesan', '2 slices', 'CN'],
    ['mozzarella', '2 slices (CDHF) or 50 g (AHS)', 'CAN'], ['swiss cheese', '2 slices', 'CN'], ['brie', '', 'MN'], ['camembert', '', 'MN'],
    ['feta', '', 'N'], ['hard cheese', '2 slices (CDHF) or 50 g (AHS)', 'CAMN'], ['sorbet', '', 'M'], ['whey protein isolate', '', 'M'],
    // sweeteners, sauces, herbs and drinks
    ['maple syrup', '2 Tbsp', 'CAMN'], ['brown sugar', '¼ cup (CDHF) or 1 Tbsp (AHS)', 'CAM'], ['table sugar', '', 'N'], ['rice malt syrup', '', 'N'],
    ['golden syrup', '', 'M'], ['stevia', '', 'AM'], ['aspartame', '', 'AM'], ['dark chocolate', '', 'N'],
    ['soy sauce', '', 'MN'], ['mayonnaise', '', 'N'], ['chutney', '', 'N'], ['bbq sauce', '', 'N'], ['barbecue sauce', '', 'N'],
    ['basil', '', 'M'], ['ginger', '', 'M'], ['cilantro', '', 'M'], ['parsley', '', 'M'], ['oregano', '', 'M'], ['rosemary', '', 'M'], ['thyme', '', 'M'],
    ['mint', '', 'M'], ['cumin', '', 'M'], ['paprika', '', 'M'], ['turmeric', '', 'M'], ['cinnamon', '', 'M'], ['lemongrass', '', 'M'], ['asafoetida', '', 'M'],
    ['green tea', '1 cup', 'C'], ['peppermint tea', '1 cup', 'C'], ['black tea', '1 cup, weak', 'C'], ['rooibos', '1 cup, weak', 'C'],
    ['coffee', '1 cup drip', 'CM'], ['espresso', '30 ml', 'C'], ['cranberry juice', '¾ cup, 100%', 'CN']
  ];

  function esc(s) { return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); }
  function wordRe(w) { return new RegExp('(^|[^a-zà-ÿ])' + esc(w) + '(s|es)?(?![a-zà-ÿ])', 'i'); }

  var COMPILED = FOODS.map(function (r) {
    return { word: r[0], groups: r[1].split('|'), level: r[2], src: r[3], note: r[4] || '',
      re: wordRe(r[0]), except: (r[5] || []).map(function (p) { return new RegExp(esc(p), 'gi'); }) };
  });
  var FLAGGED = {}; FOODS.forEach(function (f) { FLAGGED[f[0]] = 1; });
  GOOD = GOOD.filter(function (g) { return !FLAGGED[g[0]]; });
  var GOOD_RE = GOOD.map(function (g) { return { w: g[0], serve: g[1], src: g[2], re: wordRe(g[0]) }; });

  function prep(text) {
    var t = ' ' + String(text || '').toLowerCase().replace(/[’']/g, '\'') + ' ';
    var suppressed = {};
    NEGATIONS.forEach(function (n) {
      n.re.lastIndex = 0;
      if (n.re.test(t)) {
        if (n.suppress) suppressed[n.suppress] = true;
        n.re.lastIndex = 0;
        t = t.replace(n.re, ' ');
      }
    });
    return { t: t, suppressed: suppressed, orig: ' ' + String(text || '').toLowerCase().replace(/[’']/g, '\'') + ' ' };
  }

  /** Find high-FODMAP matches. Returns one entry per word and group: {word, group, level, src, note}. */
  function scan(text) {
    var p = prep(text), out = [], seen = {};
    COMPILED.forEach(function (c) {
      var t = p.t;
      // An exception phrase anywhere in the original text (e.g. "rice paper spring roll") skips this word
      if (c.except.some(function (re) { re.lastIndex = 0; var hit = re.test(p.orig); re.lastIndex = 0; return hit && !c.re.test(p.orig.replace(re, ' ')); })) return;
      c.except.forEach(function (re) { t = t.replace(re, ' '); });
      if (!c.re.test(t)) return;
      c.groups.forEach(function (g) {
        if (p.suppressed[g]) return;
        var k = c.word + '|' + g;
        if (!seen[k]) { seen[k] = 1; out.push({ word: c.word, group: g, level: c.level, src: c.src, note: c.note }); }
      });
    });
    // A longer phrase ("ice cream") replaces its shorter part ("cream") for the same group.
    return out.filter(function (m) {
      return !out.some(function (o) { return o !== m && o.group === m.group && o.word.length > m.word.length && o.word.indexOf(m.word) !== -1; });
    });
  }

  /** Low-FODMAP foods mentioned in the text (longest phrases win). */
  function scanGood(text) {
    var t = ' ' + String(text || '').toLowerCase().replace(/sweet potato(es)?/g, ' ') + ' ';
    var hits = GOOD_RE.filter(function (g) { return g.re.test(t); }).map(function (g) { return g.w; });
    return hits.filter(function (h) { return !hits.some(function (o) { return o !== h && o.length > h.length && o.indexOf(h) !== -1; }); });
  }

  /** Fill in tolerance for groups that have no challenge of their own. */
  function deriveTolerance(t) {
    t = t || {};
    function combine(ids) {
      var r = ids.map(function (i) { return t[i] || ''; });
      if (r.indexOf('trigger') !== -1) return 'trigger';
      if (r.indexOf('') !== -1) return '';
      if (r.indexOf('partial') !== -1) return 'partial';
      return 'tolerated';
    }
    var out = {};
    for (var k in t) out[k] = t[k];
    out['fructan-other'] = combine(['fructan-grain', 'fructan-garlic', 'fructan-onion']);
    out.polyol = combine(['sorbitol', 'mannitol']);
    out.unspecified = '';
    return out;
  }

  /**
   * Turn matches into a verdict using the person's reintroduction results.
   * tolerance: { groupId: 'tolerated' | 'partial' | 'trigger' | '' }
   */
  function judge(matches, tolerance) {
    tolerance = deriveTolerance(tolerance);
    var flags = [];
    matches.forEach(function (m) {
      var t = tolerance[m.group] || '';
      if (t === 'tolerated') return;
      var sev;
      if (m.level === 'high' || m.level === 'usually') sev = t === 'partial' ? 'modify' : 'avoid';
      else sev = 'modify';
      flags.push({ word: m.word, group: m.group, level: m.level, src: m.src, note: m.note, severity: sev, tested: t });
    });
    var verdict = flags.some(function (f) { return f.severity === 'avoid'; }) ? 'avoid'
      : flags.length ? 'modify' : 'good';
    return { verdict: verdict, flags: flags };
  }

  /**
   * Check text and say how confident the app can be:
   * 'avoid' / 'modify' when high-FODMAP foods are found, 'good' only when the
   * app recognises low-FODMAP foods and finds nothing high, and 'unknown' when
   * it recognises nothing at all (not on the list does not mean safe).
   */
  function assess(text, tolerance) {
    var j = judge(scan(text), tolerance), good = scanGood(text);
    var verdict = j.flags.length ? j.verdict : good.length ? 'good' : 'unknown';
    return { verdict: verdict, flags: j.flags, good: good };
  }

  /** Names of the sources for a tag string like "CAM", or "the app's guess". */
  function sourceNames(src) {
    if (!src || src === 'app') return 'app\'s guess';
    return src.split('').map(function (c) { return SOURCES[c]; }).filter(Boolean).join(', ');
  }

  /** One plain-language sentence explaining a flag, with its sources. */
  function describe(f, groupNames) {
    var g = groupNames || GROUPS[f.group].name;
    var src = ' (' + sourceNames(f.src) + ')';
    var note = f.note ? ': ' + f.note : '';
    if (f.level === 'high') return '“' + f.word + '” is high in ' + g + src + (f.note ? '. ' + capital(f.note) + '.' : '.');
    if (f.level === 'serve') return '“' + f.word + '” is low FODMAP only in small serves' + note + '.';
    var n = f.note || (f.level === 'usually' ? 'usually' : 'often') + ' made with a high-FODMAP ingredient';
    // Notes are written to follow "is", follow the word directly ("may contain"), or stand alone
    var lead = /^(usually|often|made|sometimes|a|an|the|onion|egg)\b/.test(n) ? '” is ' : /^(may|contains)\b/.test(n) ? '” ' : '”: ';
    if (lead === '”: ') n = capital(n);
    return '“' + f.word + lead + n + ' (' + g + '; ' + sourceNames(f.src) + ').' + (f.level === 'usually' ? '' : ' Ask how it\'s made.');
  }
  function capital(s) { return s.charAt(0).toUpperCase() + s.slice(1); }

  window.FODMAP = {
    GROUPS: GROUPS, SOURCES: SOURCES, FOODS: FOODS, GOOD: GOOD,
    scan: scan, scanGood: scanGood, judge: judge, assess: assess, deriveTolerance: deriveTolerance,
    describe: describe, sourceNames: sourceNames
  };
})();
