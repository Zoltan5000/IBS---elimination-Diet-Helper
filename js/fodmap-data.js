/*
 * Keyword rules for spotting common high-FODMAP ingredients in menu text and
 * recipe ingredient lists. Based on the food groupings in the Monash University
 * FODMAP guidance (see sources on the page). This is a screening aid only:
 * exact FODMAP content depends on the recipe and the serving size.
 *
 * level "contains" = the word names a high-FODMAP food
 * level "often"    = the dish usually contains one (e.g. gravy usually has onion)
 * level "portion"  = fine in small serves, high in larger ones
 */
(function () {
  'use strict';

  var GROUPS = {
    'fructose':       { name: 'Fructose', swap: 'maple syrup instead of honey; orange, kiwi or berries instead of apple, pear or mango' },
    'lactose':        { name: 'Lactose', swap: 'lactose-free milk, cream or yogurt; hard cheeses such as parmesan or cheddar' },
    'fructan-grain':  { name: 'Fructans (wheat, rye, barley)', swap: 'rice, potato, oats, quinoa, gluten-free bread or pasta, spelt sourdough' },
    'fructan-garlic': { name: 'Fructans (garlic)', swap: 'garlic-infused oil, which carries the flavor without the FODMAPs' },
    'fructan-onion':  { name: 'Fructans (onion)', swap: 'green tops of spring onion, chives, or asafoetida' },
    'gos':            { name: 'GOS (legumes, some nuts)', swap: 'small serves of canned, rinsed lentils or chickpeas; firm tofu; peanuts or walnuts' },
    'sorbitol':       { name: 'Sorbitol', swap: 'grapes, pineapple, citrus; avoid sweeteners ending in "-itol"' },
    'mannitol':       { name: 'Mannitol', swap: 'zucchini, carrot, bell pepper, green beans or eggplant instead of mushroom or cauliflower' }
  };

  // [pattern, group, level]. Patterns are matched as whole words, with optional plural.
  var RULES = [
    // fructose
    ['honey', 'fructose', 'contains'], ['mango', 'fructose', 'contains'], ['apple', 'fructose', 'contains'],
    ['applesauce', 'fructose', 'contains'], ['pear', 'fructose', 'contains'], ['watermelon', 'fructose', 'contains'],
    ['agave', 'fructose', 'contains'], ['high fructose corn syrup', 'fructose', 'contains'], ['fig', 'fructose', 'contains'],
    ['asparagus', 'fructose', 'contains'], ['sugar snap pea', 'fructose', 'contains'], ['sun-dried tomato', 'fructose', 'portion'],
    ['cherry', 'sorbitol', 'contains'], ['cherries', 'sorbitol', 'contains'],
    // lactose
    ['milk', 'lactose', 'contains'], ['cream', 'lactose', 'contains'], ['creamy', 'lactose', 'often'], ['ice cream', 'lactose', 'contains'],
    ['yogurt', 'lactose', 'contains'], ['yoghurt', 'lactose', 'contains'], ['ricotta', 'lactose', 'contains'],
    ['cottage cheese', 'lactose', 'contains'], ['mascarpone', 'lactose', 'contains'], ['cream cheese', 'lactose', 'contains'],
    ['custard', 'lactose', 'contains'], ['buttermilk', 'lactose', 'contains'], ['condensed milk', 'lactose', 'contains'],
    ['bechamel', 'lactose', 'contains'], ['béchamel', 'lactose', 'contains'], ['alfredo', 'lactose', 'contains'],
    ['sour cream', 'lactose', 'contains'], ['gelato', 'lactose', 'contains'], ['milkshake', 'lactose', 'contains'],
    ['latte', 'lactose', 'contains'], ['cappuccino', 'lactose', 'contains'], ['carbonara', 'lactose', 'often'],
    ['mac and cheese', 'lactose', 'contains'], ['burrata', 'lactose', 'portion'], ['mozzarella', 'lactose', 'portion'],
    // fructans: grains
    ['wheat', 'fructan-grain', 'contains'], ['bread', 'fructan-grain', 'contains'], ['bun', 'fructan-grain', 'contains'],
    ['brioche', 'fructan-grain', 'contains'], ['baguette', 'fructan-grain', 'contains'], ['toast', 'fructan-grain', 'contains'],
    ['flour tortilla', 'fructan-grain', 'contains'], ['wrap', 'fructan-grain', 'contains'], ['burrito', 'fructan-grain', 'contains'],
    ['pasta', 'fructan-grain', 'contains'], ['spaghetti', 'fructan-grain', 'contains'], ['linguine', 'fructan-grain', 'contains'],
    ['penne', 'fructan-grain', 'contains'], ['fettuccine', 'fructan-grain', 'contains'], ['lasagna', 'fructan-grain', 'contains'],
    ['lasagne', 'fructan-grain', 'contains'], ['ravioli', 'fructan-grain', 'contains'], ['gnocchi', 'fructan-grain', 'often'],
    ['noodle', 'fructan-grain', 'often'], ['ramen', 'fructan-grain', 'contains'], ['udon', 'fructan-grain', 'contains'],
    ['couscous', 'fructan-grain', 'contains'], ['bulgur', 'fructan-grain', 'contains'], ['farro', 'fructan-grain', 'contains'],
    ['semolina', 'fructan-grain', 'contains'], ['orzo', 'fructan-grain', 'contains'], ['rye', 'fructan-grain', 'contains'],
    ['barley', 'fructan-grain', 'contains'], ['pizza', 'fructan-grain', 'contains'], ['naan', 'fructan-grain', 'contains'],
    ['pita', 'fructan-grain', 'contains'], ['crouton', 'fructan-grain', 'contains'], ['breadcrumb', 'fructan-grain', 'contains'],
    ['breaded', 'fructan-grain', 'contains'], ['battered', 'fructan-grain', 'contains'], ['tempura', 'fructan-grain', 'contains'],
    ['panko', 'fructan-grain', 'contains'], ['pastry', 'fructan-grain', 'contains'], ['pie', 'fructan-grain', 'contains'],
    ['croissant', 'fructan-grain', 'contains'], ['cake', 'fructan-grain', 'contains'], ['cookie', 'fructan-grain', 'contains'],
    ['muffin', 'fructan-grain', 'contains'], ['pancake', 'fructan-grain', 'contains'], ['waffle', 'fructan-grain', 'contains'],
    ['dumpling', 'fructan-grain', 'contains'], ['seitan', 'fructan-grain', 'contains'], ['flour', 'fructan-grain', 'often'],
    ['inulin', 'fructan-grain', 'contains'], ['chicory', 'fructan-grain', 'contains'], ['sandwich', 'fructan-grain', 'contains'],
    ['burger', 'fructan-grain', 'often'], ['sub', 'fructan-grain', 'often'], ['taco', 'fructan-grain', 'portion'],
    // fructans: garlic
    ['garlic', 'fructan-garlic', 'contains'], ['aioli', 'fructan-garlic', 'contains'], ['pesto', 'fructan-garlic', 'contains'],
    ['tzatziki', 'fructan-garlic', 'contains'], ['chimichurri', 'fructan-garlic', 'contains'], ['scampi', 'fructan-garlic', 'contains'],
    ['gremolata', 'fructan-garlic', 'contains'], ['caesar', 'fructan-garlic', 'often'], ['ranch', 'fructan-garlic', 'often'], ['kimchi', 'fructan-garlic', 'contains'], ['hummus', 'fructan-garlic', 'often'],
    ['marinara', 'fructan-garlic', 'often'], ['curry', 'fructan-garlic', 'often'], ['garlic bread', 'fructan-grain', 'contains'],
    // fructans: onion
    ['onion', 'fructan-onion', 'contains'], ['shallot', 'fructan-onion', 'contains'], ['leek', 'fructan-onion', 'contains'],
    ['scallion', 'fructan-onion', 'portion'], ['salsa', 'fructan-onion', 'often'], ['guacamole', 'fructan-onion', 'often'],
    ['marinara', 'fructan-onion', 'often'], ['bolognese', 'fructan-onion', 'often'], ['ragu', 'fructan-onion', 'often'],
    ['gravy', 'fructan-onion', 'often'], ['stock', 'fructan-onion', 'often'], ['broth', 'fructan-onion', 'often'],
    ['soup', 'fructan-onion', 'often'], ['curry', 'fructan-onion', 'often'], ['sofrito', 'fructan-onion', 'contains'],
    ['relish', 'fructan-onion', 'often'], ['chili', 'fructan-onion', 'often'], ['chilli', 'fructan-onion', 'often'],
    ['stew', 'fructan-onion', 'often'], ['kimchi', 'fructan-onion', 'contains'], ['bbq sauce', 'fructan-onion', 'often'],
    ['barbecue sauce', 'fructan-onion', 'often'], ['ketchup', 'fructan-onion', 'portion'],
    // GOS
    ['bean', 'gos', 'contains'], ['refried', 'gos', 'contains'], ['chickpea', 'gos', 'contains'], ['garbanzo', 'gos', 'contains'],
    ['hummus', 'gos', 'contains'], ['houmous', 'gos', 'contains'], ['falafel', 'gos', 'contains'], ['lentil', 'gos', 'contains'],
    ['dal', 'gos', 'contains'], ['dhal', 'gos', 'contains'], ['split pea', 'gos', 'contains'], ['cashew', 'gos', 'contains'],
    ['pistachio', 'gos', 'contains'], ['soybean', 'gos', 'contains'], ['soy milk', 'gos', 'often'],
    // sorbitol
    ['avocado', 'sorbitol', 'portion'], ['guacamole', 'sorbitol', 'portion'], ['blackberry', 'sorbitol', 'contains'],
    ['blackberries', 'sorbitol', 'contains'], ['apricot', 'sorbitol', 'contains'], ['peach', 'sorbitol', 'contains'],
    ['peaches', 'sorbitol', 'contains'], ['plum', 'sorbitol', 'contains'], ['prune', 'sorbitol', 'contains'],
    ['nectarine', 'sorbitol', 'contains'], ['lychee', 'sorbitol', 'contains'], ['sorbitol', 'sorbitol', 'contains'],
    ['sugar-free', 'sorbitol', 'often'], ['sugar free', 'sorbitol', 'often'], ['apple', 'sorbitol', 'contains'], ['pear', 'sorbitol', 'contains'],
    // mannitol
    ['mushroom', 'mannitol', 'contains'], ['portobello', 'mannitol', 'contains'], ['shiitake', 'mannitol', 'contains'],
    ['cauliflower', 'mannitol', 'contains'], ['celery', 'mannitol', 'portion'], ['snow pea', 'mannitol', 'contains'],
    ['sweet potato', 'mannitol', 'portion'], ['mannitol', 'mannitol', 'contains']
  ];

  // Phrases removed before matching. `suppress` clears a group for the whole item.
  var NEGATIONS = [
    { re: /garlic[- ]infused( olive)? oil|garlic oil/g },
    { re: /\b(no|without|hold the|minus) (garlic|onions?)\b/g },
    { re: /\blactose[- ]free\b/g, suppress: 'lactose' },
    { re: /\b(gluten[- ]free|\bgf\b)/g, suppress: 'fructan-grain' },
    { re: /\b(rice|glass|rice vermicelli|soba 100%) noodles?\b/g },
    { re: /\brice (paper|pasta|cakes?|flour)\b/g },
    { re: /\bcorn (tortillas?|tacos?)\b/g },
    { re: /\b(coconut|almond|lactose[- ]free|oat) milk\b/g },
    { re: /\bcoconut cream\b/g },
    { re: /\bgreen (tops of )?(spring onion|scallion)s?\b/g },
    { re: /\bspring onion greens?\b/g },
    { re: /\bpeanut butter\b/g },
    { re: /\b(green|string|french) beans?\b/g },
    { re: /\bbean ?sprouts?\b/g },
    { re: /\bvanilla bean\b/g }
  ];

  function esc(s) { return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); }
  var COMPILED = RULES.map(function (r) {
    return { re: new RegExp('(^|[^a-zà-ÿ])' + esc(r[0]) + '(s|es)?(?![a-zà-ÿ])', 'i'), word: r[0], group: r[1], level: r[2] };
  });

  /** Find FODMAP matches in a piece of text. Returns [{word, group, level}] (one per word/group pair). */
  function scan(text) {
    var t = ' ' + String(text || '').toLowerCase() + ' ';
    var suppressed = {};
    NEGATIONS.forEach(function (n) {
      n.re.lastIndex = 0;
      if (n.re.test(t)) {
        if (n.suppress) suppressed[n.suppress] = true;
        n.re.lastIndex = 0;
        t = t.replace(n.re, ' ');
      }
    });
    var seen = {}, out = [];
    COMPILED.forEach(function (c) {
      if (suppressed[c.group]) return;
      if (c.re.test(t)) {
        var k = c.word + '|' + c.group;
        if (!seen[k]) { seen[k] = 1; out.push({ word: c.word, group: c.group, level: c.level }); }
      }
    });
    // A longer phrase ("ice cream") shouldn't also report its shorter part ("cream") for the same group.
    return out.filter(function (m) {
      return !out.some(function (o) { return o !== m && o.group === m.group && o.word.length > m.word.length && o.word.indexOf(m.word) !== -1; });
    });
  }

  /**
   * Turn matches into a verdict using the person's reintroduction results.
   * tolerance: { groupId: 'tolerated' | 'partial' | 'trigger' | '' }
   */
  function judge(matches, tolerance) {
    tolerance = tolerance || {};
    var flags = [];
    matches.forEach(function (m) {
      var t = tolerance[m.group] || '';
      if (t === 'tolerated') return;
      var sev;
      if (m.level === 'contains') sev = t === 'partial' ? 'modify' : 'avoid';
      else sev = 'modify';
      flags.push({ word: m.word, group: m.group, level: m.level, severity: sev, tested: t });
    });
    var verdict = flags.some(function (f) { return f.severity === 'avoid'; }) ? 'avoid'
      : flags.length ? 'modify' : 'good';
    return { verdict: verdict, flags: flags };
  }

  // Common low-FODMAP foods (at normal serves), used to praise good choices.
  var GOOD = ['rice', 'brown rice', 'oats', 'oatmeal', 'porridge', 'quinoa', 'polenta', 'potato', 'potatoes', 'egg', 'eggs',
    'chicken', 'turkey', 'beef', 'pork', 'lamb', 'fish', 'salmon', 'tuna', 'cod', 'prawns', 'shrimp', 'firm tofu', 'tofu', 'tempeh',
    'carrot', 'zucchini', 'courgette', 'spinach', 'kale', 'lettuce', 'cucumber', 'tomato', 'bell pepper', 'capsicum', 'eggplant',
    'green beans', 'bok choy', 'bean sprouts', 'parsnip', 'olives', 'strawberries', 'strawberry', 'blueberries', 'raspberries',
    'orange', 'oranges', 'mandarin', 'kiwi', 'grapes', 'pineapple', 'cantaloupe', 'lactose-free', 'lactose free', 'cheddar',
    'parmesan', 'feta', 'brie', 'swiss cheese', 'gluten-free', 'gluten free', 'spelt sourdough', 'sourdough', 'corn tortilla', 'rice noodles',
    'rice cakes', 'maple syrup', 'peanut butter', 'peanuts', 'walnuts', 'macadamias', 'pumpkin seeds', 'chia', 'linseed', 'flaxseed',
    'garlic-infused oil', 'garlic infused oil', 'olive oil', 'chives', 'ginger', 'basil', 'popcorn', 'almond milk', 'coconut milk'];
  var GOOD_RE = GOOD.map(function (w) { return { w: w, re: new RegExp('(^|[^a-zà-ÿ])' + esc(w) + '(s|es)?(?![a-zà-ÿ])', 'i') }; });

  /** Low-FODMAP foods mentioned in the text (longest phrases win). */
  function scanGood(text) {
    var t = ' ' + String(text || '').toLowerCase().replace(/sweet potato(es)?/g, ' ') + ' ';
    var hits = GOOD_RE.filter(function (g) { return g.re.test(t); }).map(function (g) { return g.w; });
    return hits.filter(function (h) { return !hits.some(function (o) { return o !== h && o.length > h.length && o.indexOf(h) !== -1; }); });
  }

  window.FODMAP = { GROUPS: GROUPS, scan: scan, judge: judge, scanGood: scanGood };
})();
