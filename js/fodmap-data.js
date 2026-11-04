/*
 * Master food list for the menu checker, diet score and meal ideas.
 *
 * Every food is tagged with the sources that list it:
 *   C = Canadian Digestive Health Foundation, "Understanding the Low FODMAP Diet"
 *       (Moore K, Senchuk A, registered dietitians; updated June 10, 2026). Full text checked.
 *   A = Alberta Health Services, "Low FODMAP Eating" handout 404120-NFS
 *       (AHS Nutrition Services registered dietitians; December 2017). Full text checked.
 *   M = Michigan Medicine, MyGINutrition high- and low-FODMAP food lists.
 *       Partial: only foods confirmed through searches of myginutrition.com.
 *   N = Monash University, "High and low FODMAP foods" (monashfodmap.com).
 *       Partial: only foods confirmed through searches of monashfodmap.com.
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
    'fructan-onion':  { name: 'Fructans (onion)', swap: 'chives, the green tops of spring onions, or the green parts of leeks' },
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
    ['artichoke', 'fructan-other', 'high', 'CAN'],
    ['chicory', 'fructan-other', 'high', 'CA', 'chicory root (inulin)'],
    ['inulin', 'fructan-other', 'high', 'CA'],
    ['fructooligosaccharide', 'fructan-other', 'high', 'CA'],
    ['fructo-oligosaccharide', 'fructan-other', 'high', 'CA'],
    ['hummus', 'fructan-other|gos', 'high', 'C', 'listed under fructans by CDHF; made from chickpeas (GOS)'],
    ['houmous', 'fructan-other|gos', 'high', 'C'],
    ['pumpkin', 'fructan-other|polyol', 'high', 'C', '', ['pumpkin seed', 'pumpkin seed']],
    ['beet', 'fructan-other', 'serve', 'CA', 'CDHF lists beets as high, but ⅓ cup canned beets (CDHF) or 4 slices boiled beet (AHS) are low'],
    ['beetroot', 'fructan-other', 'serve', 'CA', '⅓ cup canned (CDHF) or 4 slices boiled (AHS) are low'],
    ['brussels sprout', 'fructan-other', 'serve', 'CA', 'CDHF lists them as high; AHS says 4 Brussels sprouts are low'],
    ['dried apricot', 'fructan-other|sorbitol', 'high', 'C'],
    ['banana', 'fructan-other', 'serve', 'CAMN', 'a firm banana is low (CDHF, Monash); AHS says 1 medium banana is low; a ripe banana is high in fructans (CDHF)'],
    ['dried cranberry', 'fructan-other', 'high', 'C'], ['dried cranberries', 'fructan-other', 'high', 'C'],
    ['currant', 'fructan-other', 'high', 'C', 'dried currants'],
    ['fig', 'fructan-other|fructose', 'high', 'C', 'dried figs (fructans) and figs (excess fructose)'],
    ['grapefruit', 'fructan-other', 'high', 'CA'],
    ['honeydew', 'fructan-other', 'serve', 'CA', 'CDHF lists it as high; AHS says ½ cup is low'],
    ['nectarine', 'fructan-other|sorbitol', 'high', 'CA'],
    ['persimmon', 'fructan-other', 'high', 'CA'],
    ['pomegranate', 'fructan-other|fructose', 'high', 'CA', 'pomegranate seeds (CDHF) and pomegranate juice (AHS)'],
    ['prune', 'fructan-other|sorbitol', 'high', 'CA'],
    ['raisin', 'fructan-other', 'high', 'C'],
    ['dried fruit', 'fructan-other', 'high', 'N'],
    ['watermelon', 'fructan-other|fructose|mannitol', 'high', 'CAMN'],
    ['rambutan', 'fructan-other', 'high', 'A'],
    ['apricot', 'fructan-other|sorbitol', 'high', 'CAM'],
    ['plum', 'fructan-other|sorbitol', 'high', 'CA'],
    ['peach', 'fructan-other|sorbitol', 'high', 'CA'],
    ['corn syrup', 'fructan-other', 'high', 'C', 'listed under fructans (sweeteners) by CDHF', ['high fructose corn syrup', 'high-fructose corn syrup']],
    // ---- fructans: garlic and onion ----
    ['garlic', 'fructan-garlic', 'high', 'CAMN', 'including garlic powder and garlic salt'],
    ['onion', 'fructan-onion', 'high', 'CAMN', 'including onion powder and onion salt', ['spring onion', 'green onion', 'onion tops', 'green tops of spring onion']],
    ['shallot', 'fructan-onion', 'high', 'AM'],
    ['leek', 'fructan-onion', 'high', 'CAMN', 'the green parts are low (CDHF: 1 cup)'],
    ['spring onion', 'fructan-onion', 'serve', 'CA', 'the white part is high (CDHF); the green tops are low (CDHF, AHS)'],
    ['green onion', 'fructan-onion', 'serve', 'CA', 'the white part is high (CDHF); the green tops are low (CDHF, AHS)'],
    ['scallion', 'fructan-onion', 'serve', 'CA', 'the white part is high (CDHF); the green tops are low (CDHF, AHS)'],
    // ---- fructans: grains ----
    ['wheat', 'fructan-grain', 'high', 'CAMN', 'AHS: avoid foods with wheat in the first 5 ingredients', ['buckwheat', 'wheat protein']],
    ['rye', 'fructan-grain', 'high', 'CAMN', 'AHS says 1 slice of sourdough rye bread is low'],
    ['barley', 'fructan-grain|gos', 'high', 'CAMN'],
    ['couscous', 'fructan-grain', 'high', 'CAM'],
    ['bulgur', 'fructan-grain', 'high', 'M'],
    ['kamut', 'fructan-grain', 'high', 'M'],
    ['all-purpose flour', 'fructan-grain', 'high', 'M'],
    ['muesli', 'fructan-grain', 'high', 'A'],
    ['seitan', 'fructan-grain', 'serve', 'AM', 'vital wheat protein; AHS says 2 Tbsp is low, and Michigan lists seitan as a protein source'],
    // usually made from wheat (app inference; wheat is high in all four sources)
    ['bread', 'fructan-grain', 'usually', 'app', 'usually made with wheat; sourdough, spelt and gluten-free breads are low (CDHF, AHS, Michigan, Monash)'],
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
    ['pie', 'fructan-grain', 'usually', 'app', 'usually a wheat crust'],
    ['croissant', 'fructan-grain', 'usually', 'app', 'usually wheat flour'],
    ['cake', 'fructan-grain', 'usually', 'app', 'usually wheat flour', ['rice cake', 'rice cakes']],
    ['cookie', 'fructan-grain', 'usually', 'app', 'usually wheat flour'],
    ['biscuit', 'fructan-grain', 'usually', 'app', 'usually wheat flour'],
    ['muffin', 'fructan-grain', 'usually', 'app', 'usually wheat flour'],
    ['pancake', 'fructan-grain', 'usually', 'app', 'usually wheat flour'],
    ['waffle', 'fructan-grain', 'usually', 'app', 'usually wheat flour'],
    ['dumpling', 'fructan-grain', 'usually', 'app', 'usually a wheat wrapper'],
    ['sandwich', 'fructan-grain', 'usually', 'app', 'usually wheat bread'],
    ['burger', 'fructan-grain', 'usually', 'app', 'usually a wheat bun'],
    ['cracker', 'fructan-grain', 'usually', 'app', 'usually wheat flour'],
    ['semolina', 'fructan-grain', 'usually', 'app', 'made from wheat'],
    ['farro', 'fructan-grain', 'usually', 'app', 'a type of wheat'],
    ['flour', 'fructan-grain', 'usually', 'app', 'usually wheat flour; arrowroot, buckwheat, corn, millet, quinoa, rice and sorghum flours are low (CDHF)'],
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
    ['soybean', 'gos|fructan-other', 'high', 'CA'],
    ['soy bean', 'gos|fructan-other', 'high', 'CA'],
    ['soy milk', 'gos', 'high', 'CM', 'Michigan: soy milk made from whole soybeans'],
    ['silken tofu', 'gos', 'high', 'C', 'firm tofu is low (CDHF, AHS, Michigan, Monash)'],
    ['legume flour', 'gos', 'high', 'C'],
    ['chickpea', 'gos', 'serve', 'CAMN', 'canned and rinsed chickpeas are low in small serves (CDHF ¼ cup, AHS ½ cup, Monash small amounts)'],
    ['garbanzo', 'gos', 'serve', 'CAMN', 'canned and rinsed are low in small serves (CDHF ¼ cup, AHS ½ cup)'],
    ['lentil', 'gos', 'serve', 'CAMN', 'boiled lentils are high (AHS); canned and rinsed are low in small serves (CDHF ⅓ cup, AHS ½ cup)'],
    ['green pea', 'gos', 'high', 'C'],
    ['pea', 'gos', 'high', 'C', 'green pea', ['snow pea', 'snap pea', 'sugar snap pea', 'split pea', 'chick pea']],
    ['cashew', 'gos', 'high', 'CAN'],
    ['pistachio', 'gos|fructan-other', 'high', 'CAN'],
    ['bean', 'gos', 'often', 'app', 'often a dried bean, and most dried beans are high in GOS (CDHF, AHS, Michigan, Monash); green beans are low',
      ['green bean', 'green bean', 'string bean', 'string bean', 'french bean', 'french bean', 'bean sprout', 'bean sprout', 'vanilla bean', 'coffee bean', 'coffee bean', 'jelly bean', 'jelly bean', 'baked bean', 'black bean', 'kidney bean', 'lima bean', 'mung bean', 'soy bean']],
    ['refried bean', 'gos', 'usually', 'app', 'made from dried beans'],
    ['falafel', 'gos', 'usually', 'app', 'usually made from chickpeas or fava beans'],
    ['dal', 'gos', 'usually', 'app', 'usually made from lentils or split peas'],
    ['dhal', 'gos', 'usually', 'app', 'usually made from lentils or split peas'],
    // ---- lactose ----
    ['milk', 'lactose', 'serve', 'CAMN', 'cow\'s milk is high (CDHF, Michigan, Monash); AHS says ¼ cup is low',
      ['almond milk', 'soy milk', 'oat milk', 'rice milk', 'coconut milk', 'lactose-free milk', 'lactose free milk', 'milk chocolate']],
    ['condensed milk', 'lactose', 'high', 'C'],
    ['evaporated milk', 'lactose', 'serve', 'CA', 'CDHF lists it as high; AHS says 2½ Tbsp is low'],
    ['powdered milk', 'lactose', 'high', 'C'],
    ['milk powder', 'lactose', 'high', 'C'],
    ['custard', 'lactose', 'high', 'C'],
    ['ice cream', 'lactose', 'high', 'CMN', 'lactose-free ice cream is low (CDHF, Michigan)'],
    ['yogurt', 'lactose', 'serve', 'CAMN', 'listed as high by CDHF, Michigan and Monash; AHS says ½ cup is low'],
    ['yoghurt', 'lactose', 'serve', 'CAMN', 'listed as high by CDHF, Michigan and Monash; AHS says ½ cup is low'],
    ['ricotta', 'lactose', 'high', 'CMN'],
    ['cottage cheese', 'lactose', 'serve', 'CAMN', 'listed as high by CDHF and Michigan; AHS says ½ cup is low'],
    ['cream cheese', 'lactose', 'high', 'CN'],
    ['mascarpone', 'lactose', 'high', 'CN'],
    ['buttermilk', 'lactose', 'serve', 'A', 'AHS says ⅓ cup is low'],
    ['sour cream', 'lactose', 'serve', 'A', 'AHS says ¼ cup is low'],
    ['kefir', 'lactose', 'serve', 'A', 'AHS says ½ cup is low'],
    ['cream', 'lactose', 'serve', 'C', 'CDHF says ½ cup whipped cream is low', ['ice cream', 'sour cream', 'cream cheese', 'coconut cream', 'lactose-free cream']],
    ['latte', 'lactose', 'high', 'C', 'espresso drinks with cow\'s milk (CDHF); lactose-free or almond milk versions are low'],
    ['cappuccino', 'lactose', 'high', 'C', 'espresso drinks with cow\'s milk (CDHF)'],
    ['flat white', 'lactose', 'high', 'C', 'espresso drinks with cow\'s milk (CDHF)'],
    ['mocha', 'lactose', 'high', 'C', 'espresso drinks with cow\'s milk (CDHF)'],
    ['oat milk', 'unspecified', 'high', 'M', 'listed on Michigan\'s high-FODMAP list'],
    ['rice milk', 'unspecified', 'high', 'M', 'listed on Michigan\'s high-FODMAP list'],
    ['milkshake', 'lactose', 'usually', 'app', 'usually made with milk and ice cream'],
    ['gelato', 'lactose', 'usually', 'app', 'usually made with milk'],
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
    ['apple juice', 'fructose|sorbitol', 'high', 'CA'],
    ['pear', 'fructose|sorbitol', 'high', 'CAMN'],
    ['mango', 'fructose', 'high', 'CAMN'],
    ['cherry', 'fructose|sorbitol', 'high', 'CAN', '', ['cherry tomato', 'cherry tomatoes']],
    ['cherries', 'fructose|sorbitol', 'high', 'CAN'],
    ['grape', 'fructose', 'serve', 'CAM', 'CDHF and AHS list grapes as high; Michigan\'s low list includes them. Sources disagree, so check the amount', ['grapefruit']],
    ['grape juice', 'fructose', 'high', 'A'],
    ['asparagus', 'fructose', 'serve', 'CAN', 'CDHF and Monash list it as high; AHS says 3 spears are low'],
    ['bell pepper', 'fructose', 'serve', 'CA', 'CDHF lists red, yellow and orange peppers as high; green peppers are low (CDHF ¼ pepper, AHS ½ cup); AHS also says 1 cup red pepper is low'],
    ['red pepper', 'fructose', 'serve', 'CA', 'CDHF lists red peppers as high; AHS says 1 cup red pepper is low'],
    ['snap pea', 'fructose', 'high', 'C'],
    ['tomato juice', 'fructose', 'high', 'C'],
    ['orange juice', 'fructose', 'serve', 'CA', 'CDHF lists it as high; AHS says ½ cup is low'],
    ['pomegranate juice', 'fructose', 'high', 'A'],
    ['cola', 'fructose', 'high', 'CA', 'CDHF lists regular and diet cola; AHS lists soft drinks made with glucose-fructose'],
    ['soda', 'fructose', 'often', 'A', 'often sweetened with glucose-fructose (high-fructose corn syrup), which AHS lists as high'],
    ['ginger ale', 'fructose', 'often', 'A', 'often sweetened with glucose-fructose, which AHS lists as high'],
    ['lemonade', 'fructose', 'serve', 'CA', 'CDHF says ¾ cup is low; AHS lists frozen concentrated lemonade as high'],
    ['coconut water', 'unspecified', 'high', 'C'],
    ['rum', 'unspecified', 'high', 'C'],
    ['port wine', 'unspecified', 'high', 'C'],
    ['chai', 'unspecified', 'serve', 'C', 'strong chai is high; weak tea is low (CDHF)'],
    ['chamomile', 'unspecified', 'serve', 'C', 'strong chamomile tea is high (CDHF)'],
    ['oolong', 'unspecified', 'serve', 'C', 'strong oolong tea is high (CDHF)'],
    // ---- polyols ----
    ['blackberry', 'sorbitol', 'high', 'CA'], ['blackberries', 'sorbitol', 'high', 'CA'],
    
    ['lychee', 'sorbitol', 'high', 'CA'],
    ['longan', 'sorbitol', 'high', 'A'],
    ['avocado', 'sorbitol', 'serve', 'AM', '⅛ of an avocado is low (AHS, Michigan); more is high in sorbitol (AHS)'],
    ['sorbitol', 'sorbitol', 'high', 'CAM'],
    ['mannitol', 'mannitol', 'high', 'CA'],
    ['xylitol', 'polyol', 'high', 'CAM'],
    ['maltitol', 'polyol', 'high', 'CAM'],
    ['isomalt', 'polyol', 'high', 'CA'],
    ['sugar-free gum', 'sorbitol', 'high', 'A'],
    ['sugar-free syrup', 'sorbitol', 'high', 'A'],
    ['sugar-free', 'sorbitol', 'often', 'A', 'often sweetened with sugar alcohols; AHS lists sugar-free gum, syrup and frozen desserts as high in sorbitol'],
    ['sugar free', 'sorbitol', 'often', 'A', 'often sweetened with sugar alcohols; AHS lists sugar-free gum, syrup and frozen desserts as high in sorbitol'],
    ['horseradish', 'sorbitol', 'high', 'A'],
    ['wasabi', 'sorbitol', 'high', 'A', 'AHS lists horseradish sauce (wasabi)'],
    ['mushroom', 'mannitol|fructan-other', 'high', 'CAMN'],
    ['portobello', 'mannitol|fructan-other', 'high', 'CAMN', 'a type of mushroom'],
    ['shiitake', 'mannitol|fructan-other', 'high', 'CAMN', 'a type of mushroom'],
    ['cauliflower', 'mannitol', 'high', 'CA'],
    ['celery', 'polyol', 'serve', 'CA', 'CDHF lists celery as high; AHS says ¼ stalk is low'],
    ['corn', 'polyol', 'serve', 'CAM', 'CDHF lists corn as high; ½ cup canned corn (CDHF) or ½ cob (AHS, Michigan) is low',
      ['corn tortilla', 'corn tortillas', 'corn bread', 'corn flour', 'corn syrup', 'corn flakes', 'corn pasta', 'corn starch', 'cornstarch', 'baby corn']],
    ['snow pea', 'mannitol|fructan-other|gos', 'serve', 'CAM', 'listed as high by CDHF and AHS; 5 pods or fewer are low (AHS, Michigan)'],
    ['sweet potato', 'mannitol', 'serve', 'CA', 'AHS lists it as high in mannitol; CDHF says ⅓ cup is low'],
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
    ['gravy', 'fructan-onion|fructan-grain', 'often', 'app', 'often made with onion and wheat flour'],
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
    ['bbq sauce', 'fructan-onion|fructan-garlic|fructose', 'often', 'app', 'often made with onion, garlic and sweeteners'],
    ['barbecue sauce', 'fructan-onion|fructan-garlic|fructose', 'often', 'app', 'often made with onion, garlic and sweeteners'],
    ['marinade', 'fructan-onion|fructan-garlic', 'often', 'app', 'often made with garlic or onion'],
    ['marinated', 'fructan-onion|fructan-garlic', 'often', 'app', 'often made with garlic or onion'],
    ['seasoning', 'fructan-onion|fructan-garlic', 'often', 'A', 'may contain garlic or onion; AHS advises avoiding mixed spice blends that may contain them'],
    ['spice blend', 'fructan-onion|fructan-garlic', 'often', 'A', 'may contain garlic or onion; AHS advises avoiding mixed spice blends that may contain them'],
    ['caesar', 'fructan-garlic', 'often', 'app', 'the dressing is often made with garlic'],
    ['ranch', 'fructan-garlic|fructan-onion', 'often', 'app', 'the dressing is often made with garlic and onion'],
    ['relish', 'fructan-onion', 'often', 'app', 'often made with onion'],
    ['meatball', 'fructan-onion|fructan-grain', 'often', 'A', 'often made with onion and breadcrumbs; AHS lists canned pasta with meatballs as high']
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
    ['chicken', 'no FODMAPs', 'CA'], ['turkey', 'no FODMAPs', 'CA'], ['beef', 'no FODMAPs', 'CA'], ['pork', 'no FODMAPs', 'CA'],
    ['lamb', 'no FODMAPs', 'CA'], ['ham', 'no FODMAPs', 'A'], ['fish', 'no FODMAPs', 'CA'], ['salmon', 'no FODMAPs', 'CA'],
    ['tuna', 'no FODMAPs', 'CA'], ['cod', 'no FODMAPs', 'CA'], ['shrimp', 'no FODMAPs', 'C'], ['prawn', 'no FODMAPs', 'C'],
    ['seafood', 'no FODMAPs', 'C'], ['egg', 'no FODMAPs', 'CAN'], ['eggs', 'no FODMAPs', 'CAN'],
    ['olive oil', 'no FODMAPs', 'CA'], ['butter', 'no FODMAPs', 'C'], ['ghee', 'no FODMAPs', 'C'],
    ['garlic-infused oil', 'no FODMAPs', 'CA'], ['garlic infused oil', 'no FODMAPs', 'CA'],
    // vegetables
    ['arugula', '2 cups', 'C'], ['bean sprouts', '2 cups', 'C'], ['alfalfa', '½ cup', 'AM'], ['bamboo shoot', '', 'M'],
    ['bok choy', '1 cup', 'CA'], ['broccoli', '½–¾ cup', 'CAM'], ['cabbage', '½–¾ cup', 'CA'], ['carrot', '1 medium', 'CAMN'],
    ['collard greens', '1 cup', 'C'], ['cucumber', '½–1 cup', 'CAN'], ['eggplant', '1 cup', 'CAMN'], ['green beans', '15 beans', 'CN'],
    ['kale', '½ cup', 'C'], ['lettuce', '1–1½ cups', 'CAN'], ['okra', '7 pods', 'C'], ['parsnip', '1 medium', 'C'],
    ['potato', '¼ cup (CDHF) to 1 cup (AHS)', 'CAMN'], ['potatoes', '¼ cup (CDHF) to 1 cup (AHS)', 'CAMN'], ['radish', '4 radishes', 'C'],
    ['rutabaga', '¼ cup', 'C'], ['sauerkraut', '⅓ cup', 'C'], ['seaweed', '2 sheets', 'C'], ['spinach', '1½–2 cups', 'CAM'],
    ['spaghetti squash', '½ cup', 'C'], ['butternut squash', '¼ cup', 'A'], ['swiss chard', '1½ cups', 'C'], ['tomato', '1 medium', 'CA'],
    ['turnip', '½ medium', 'C'], ['yam', '⅓ cup', 'C'], ['zucchini', '½ cup', 'AM'], ['courgette', '½ cup', 'AM'],
    ['chives', '½ cup', 'A'], ['green pepper', '¼ pepper (CDHF) to ½ cup (AHS)', 'CA'],
    // fruits
    ['blueberries', '⅓ cup (AHS) to 1 cup (CDHF)', 'CAMN'], ['strawberries', '½ cup', 'A'], ['raspberries', '½ cup', 'A'],
    ['kiwi', '1–2 medium', 'CAMN'], ['kiwifruit', '1–2 medium', 'CAMN'], ['orange', '1 medium', 'CAN'], ['oranges', '1 medium', 'CAN'],
    ['mandarin', '1 medium', 'CN'], ['pineapple', '½–1 cup', 'CAMN'], ['cantaloupe', '½ cup', 'AMN'], ['papaya', '1 cup', 'C'],
    ['passionfruit', '2 medium', 'C'], ['dragon fruit', '1 medium', 'C'], ['guava', '1 medium', 'C'], ['rhubarb', '1 cup', 'C'],
    ['kumquat', '4 medium', 'C'], ['lemon', '', 'AM'],
    // grains
    ['rice', '1 cup cooked', 'CAN'], ['brown rice', '1 cup cooked', 'CAM'], ['quinoa', '1 cup cooked', 'CAMN'], ['oats', '⅓ cup dry (AHS) or ½ cup gluten-free oats (CDHF)', 'CAN'],
    ['oatmeal', '½ cup cooked', 'AM'], ['porridge', '½ cup cooked', 'A'], ['millet', '½ cup', 'CM'], ['buckwheat', '½ cup groats', 'C'],
    ['corn tortilla', '2 small', 'C'], ['rice noodles', '½ cup', 'C'], ['soba', '⅓ cup (100% buckwheat)', 'C'], ['rice cakes', '4 cakes', 'C'],
    ['sourdough', '2 slices (CDHF)', 'CMN'], ['spelt', '2 slices spelt bread (AHS)', 'AMN'], ['gluten-free', '', 'CA'], ['gluten free', '', 'CA'],
    ['cornflakes', '½ cup', 'A'], ['oat bran', '2 Tbsp', 'A'],
    // legumes, nuts and seeds
    ['firm tofu', '1 cup (CDHF) or 100 g (AHS)', 'CAMN'], ['tofu', '100 g plain (AHS)', 'A'], ['tempeh', '1 cup (CDHF) or 100 g (AHS)', 'CAM'],
    ['peanuts', '32 nuts', 'CAN'], ['peanut butter', '2 Tbsp', 'A'], ['walnuts', '10–15 halves', 'CAN'], ['macadamias', '15–20 nuts', 'CAN'],
    ['macadamia', '15–20 nuts', 'CAN'], ['pecans', '15 halves', 'C'], ['brazil nuts', '10 nuts', 'CAM'], ['almonds', '10 nuts', 'AM'],
    ['hazelnuts', '10 nuts', 'A'], ['chia', '2 Tbsp', 'CAM'], ['flaxseed', '2 Tbsp', 'A'], ['flax', '2 Tbsp', 'A'], ['linseed', '2 Tbsp', 'A'],
    ['pumpkin seeds', '3 Tbsp', 'CMN'], ['sunflower seeds', '', 'M'], ['sesame', '3 Tbsp', 'CM'], ['pine nuts', '2 tsp', 'CM'], ['hemp hearts', '3 Tbsp', 'C'],
    // dairy and alternatives
    ['lactose-free', 'as tolerated (AHS)', 'CAMN'], ['lactose free', 'as tolerated (AHS)', 'CAMN'], ['almond milk', '1 cup', 'CN'],
    ['cheddar', '2 slices (CDHF) or 50 g (AHS)', 'CAN'], ['parmesan', '2 slices', 'CN'], ['mozzarella', '2 slices (CDHF) or 50 g (AHS)', 'CAN'],
    ['swiss cheese', '2 slices', 'CN'], ['brie', '', 'N'], ['feta', '', 'N'], ['hard cheese', '2 slices (CDHF) or 50 g (AHS)', 'CAN'],
    // sweeteners and drinks
    ['maple syrup', '2 Tbsp', 'CA'], ['brown sugar', '¼ cup (CDHF) or 1 Tbsp (AHS)', 'CA'], ['molasses', '1 Tbsp', 'A'],
    ['green tea', '1 cup', 'C'], ['peppermint tea', '1 cup', 'C'], ['black tea', '1 cup, weak', 'C'], ['rooibos', '1 cup, weak', 'C'],
    ['coffee', '1 cup drip', 'C'], ['espresso', '30 ml', 'C'], ['cranberry juice', '¾ cup, 100%', 'C']
  ];

  function esc(s) { return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); }
  function wordRe(w) { return new RegExp('(^|[^a-zà-ÿ])' + esc(w) + '(s|es)?(?![a-zà-ÿ])', 'i'); }

  var COMPILED = FOODS.map(function (r) {
    return { word: r[0], groups: r[1].split('|'), level: r[2], src: r[3], note: r[4] || '',
      re: wordRe(r[0]), except: (r[5] || []).map(function (p) { return new RegExp(esc(p), 'gi'); }) };
  });
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
    return { t: t, suppressed: suppressed };
  }

  /** Find high-FODMAP matches. Returns one entry per word and group: {word, group, level, src, note}. */
  function scan(text) {
    var p = prep(text), out = [], seen = {};
    COMPILED.forEach(function (c) {
      var t = p.t;
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
    if (f.level === 'usually') return '“' + f.word + '” is ' + (f.note || 'usually made with a high-FODMAP ingredient') + ' (' + g + '; ' + sourceNames(f.src) + ').';
    return '“' + f.word + '” is ' + (f.note || 'often made with a high-FODMAP ingredient') + ' (' + g + '; ' + sourceNames(f.src) + '). Ask how it\'s made.';
  }
  function capital(s) { return s.charAt(0).toUpperCase() + s.slice(1); }

  window.FODMAP = {
    GROUPS: GROUPS, SOURCES: SOURCES, FOODS: FOODS, GOOD: GOOD,
    scan: scan, scanGood: scanGood, judge: judge, deriveTolerance: deriveTolerance,
    describe: describe, sourceNames: sourceNames
  };
})();
