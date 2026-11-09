/*
 * Menu checker and meal ideas.
 *
 * Works in two environments:
 *  - Opened on claude.ai as an artifact: Claude reads menu photos and PDFs
 *    and can suggest meals (window.claude "sample" capability).
 *  - Opened anywhere else (a local file, GitHub Pages): menus are read on the
 *    device with pdf.js and Tesseract OCR, then screened with the keyword
 *    rules in fodmap-data.js. Meal ideas build an advanced web search (opened
 *    in the user's chosen search engine) and check pasted recipes.
 */
(function () {
  'use strict';

  var F = window.FODMAP;
  var $ = function (id) { return document.getElementById(id); };
  var PDFJS = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js';
  var PDFJS_WORKER = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
  var TESSERACT = 'https://cdn.jsdelivr.net/npm/tesseract.js@5.1.1/dist/tesseract.min.js';

  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  function tolerance() {
    var r = (window.IBSGuide && window.IBSGuide.reintro()) || {};
    var t = {};
    Object.keys(F.GROUPS).forEach(function (g) { t[g] = (r[g] && r[g].result) || ''; });
    return t;
  }
  function toleranceText() {
    var t = F.deriveTolerance(tolerance()), labels = { tolerated: 'tolerated', partial: 'tolerated in small amounts', trigger: 'TRIGGER', '': 'not tested yet' };
    return Object.keys(F.GROUPS).map(function (g) { return '- ' + F.GROUPS[g].name + ' [' + g + ']: ' + labels[t[g]]; }).join('\n');
  }

  var loaded = {};
  function loadScript(src) {
    if (!loaded[src]) {
      loaded[src] = new Promise(function (res, rej) {
        var s = document.createElement('script');
        s.src = src; s.onload = res;
        s.onerror = function () { delete loaded[src]; rej(new Error('Could not load ' + src)); };
        document.head.appendChild(s);
      });
    }
    return loaded[src];
  }

  /* ---------- Claude (only when opened on claude.ai) ---------- */
  var sample = null, canImages = false, maxImages = 1;
  if (window.claude && typeof window.claude.use === 'function') {
    window.claude.use('sample').then(function (s) {
      if (!s) return;
      sample = s;
      return s.limits().then(function (l) {
        canImages = !!(l && l.images);
        if (canImages) maxImages = Math.min(4, l.images.maxCount || 1);
      }).catch(function () {});
    }).then(updateModes).catch(function () {});
  }

  function updateModes() {
    if (sample) {
      $('menuMode').innerHTML = '<label class="inline">Checker <select id="menuEngine">' +
        '<option value="local">Keyword check (on this device)</option>' +
        '<option value="claude">Ask Claude to read it (optional, better for photos)</option></select></label>';
      $('mealAsk').hidden = false;
    }
  }

  function claudeError(e) {
    var c = e && e.code;
    if (c === 'not_granted' || c === 'sampling_disabled' || c === 'not_declared' || c === 'capability_disabled') {
      sample = null;
      $('menuMode').textContent = '';
      $('mealAsk').hidden = true;
      return 'Claude isn\'t available here, so switching to the on-device checker.';
    }
    if (c === 'rate_limited') return 'Too many requests right now. Please try again in a little while.';
    if (c === 'image_rejected') return 'That image couldn\'t be read. Try a clearer photo, or a JPEG or PNG.';
    if (c === 'cancelled') return 'Stopped.';
    return 'Something went wrong talking to Claude. Please try again.';
  }

  /* ---------- reading files ---------- */
  function status(msg) { $('menuStatus').textContent = msg; }

  function loadPdf(file) {
    return loadScript(PDFJS).then(function () {
      var lib = window.pdfjsLib;
      lib.GlobalWorkerOptions.workerSrc = PDFJS_WORKER;
      return file.arrayBuffer().then(function (buf) { return lib.getDocument({ data: buf }).promise; });
    });
  }

  function pdfText(pdf) {
    var pages = [], n = Math.min(pdf.numPages, 10);
    var chain = Promise.resolve();
    for (var i = 1; i <= n; i++) {
      (function (i) {
        chain = chain.then(function () { return pdf.getPage(i); }).then(function (p) { return p.getTextContent(); })
          .then(function (tc) {
            // Rebuild lines from text positions
            var lines = [], lastY = null, cur = '';
            tc.items.forEach(function (it) {
              var y = Math.round(it.transform[5]);
              if (lastY !== null && Math.abs(y - lastY) > 3) { lines.push(cur); cur = ''; }
              cur += (cur && !/\s$/.test(cur) ? ' ' : '') + it.str;
              lastY = y;
              if (it.hasEOL) { lines.push(cur); cur = ''; lastY = null; }
            });
            if (cur) lines.push(cur);
            pages.push(lines.join('\n'));
          });
      })(i);
    }
    return chain.then(function () { return pages.join('\n'); });
  }

  function pdfImages(pdf, max) {
    var out = [], n = Math.min(pdf.numPages, max), chain = Promise.resolve();
    for (var i = 1; i <= n; i++) {
      (function (i) {
        chain = chain.then(function () { return pdf.getPage(i); }).then(function (page) {
          var vp = page.getViewport({ scale: 1 });
          var scale = Math.min(2, 1600 / Math.max(vp.width, vp.height));
          vp = page.getViewport({ scale: scale });
          var c = document.createElement('canvas');
          c.width = vp.width; c.height = vp.height;
          return page.render({ canvasContext: c.getContext('2d'), viewport: vp }).promise.then(function () {
            return new Promise(function (res) { c.toBlob(res, 'image/png'); });
          }).then(function (b) { out.push(b); });
        });
      })(i);
    }
    return chain.then(function () { return out; });
  }

  function ocr(images) {
    return loadScript(TESSERACT).then(function () {
      var texts = [], chain = Promise.resolve();
      images.forEach(function (img, idx) {
        chain = chain.then(function () {
          return window.Tesseract.recognize(img, 'eng', {
            logger: function (m) {
              if (m.status === 'recognizing text') status('Reading text' + (images.length > 1 ? ' (page ' + (idx + 1) + ')' : '') + '… ' + Math.round(m.progress * 100) + '%');
            }
          }).then(function (r) { texts.push(r.data.text); });
        });
      });
      return chain.then(function () { return texts.join('\n'); });
    });
  }

  /* ---------- on-device menu analysis ---------- */
  var PRICE_ONLY = /^[\s$£€¥]*\d+([.,]\d{1,2})?\s*$/;
  var PRICE = /[$£€¥]\s?\d+([.,]\d{1,2})?/;
  var TRAILING_PRICE = /\s\d{1,3}([.,]\d{2})?$/;
  // Words that make up section headings ("SOUPS", "KIDS MEAL", "O12 CURRIES").
  // A line counts as a heading only if every word is one of these, so
  // "CAESAR SALAD" stays a dish while "SALADS" is a heading.
  var SECTION_WORDS = ('appetizer appetizers appetiser appetisers starter starters soup soups entree entrees entrée entrées ' +
    'main mains course courses salad salads side sides dessert desserts sweets drink drinks beverage beverages ' +
    'pizza pizzas pasta burger burgers sandwich sandwiches kid kids kids\' children childrens children\'s meal meals menu ' +
    'party platter platters specialty speciality special specials offer offers sausage sausages curries breakfast brunch ' +
    'lunch dinner small large plate plates sharing shareables bowls wraps tacos noodles grill grills seafood vegetarian vegan ' +
    'extras add-ons addons house our the and & of chef chef\'s combo combos favourites favorites classics signature signatures ' +
    'today\'s light bites snacks').split(' ');
  function isHeading(l) {
    if (PRICE.test(l) || l.length > 40) return false;
    var words = l.toLowerCase().replace(/[^a-zà-ÿ'&\s-]|\b\w*\d\w*\b/g, ' ').split(/\s+/).filter(Boolean);
    return words.length > 0 && words.length <= 4 && words.every(function (w) { return SECTION_WORDS.indexOf(w) !== -1; });
  }
  // Split a pasted, OCR'd or PDF menu into dishes. Each dish is a name line
  // plus any description lines under it, so "Fish & Chips" is judged together
  // with "Battered fillet of cod...".
  function splitMenu(text) {
    var raw = String(text).split(/\r?\n/).map(function (l) {
      return l.replace(/\s+/g, ' ').replace(/^[\s*•·▪◦‣-]+/, '').trim();
    });
    var lines = raw.filter(function (l) { return l && !PRICE_ONLY.test(l) && (l.match(/[a-zà-ÿ]/gi) || []).length >= 3; });
    // If the menu is written in capitals throughout, case can't tell names from descriptions
    var caps = lines.filter(function (l) { return l === l.toUpperCase(); }).length;
    var allCaps = lines.length && caps / lines.length > 0.8;
    var items = [], section = '';
    lines.forEach(function (l) {
      if (isHeading(l)) { section = l; return; }
      var prev = items[items.length - 1];
      var words = l.split(' ').length, upper = l === l.toUpperCase();
      var priced = PRICE.test(l) || TRAILING_PRICE.test(l);
      var looksLikeName = (upper && !allCaps && words <= 8) || (priced && words <= 8);
      var continues = prev && (/^[a-zà-ÿ(,&]/.test(l) || /[,&-]$/.test(prev.desc || prev.name));
      var sentence = words >= 6 && !looksLikeName;
      // A plain line right under a priced or capitalised dish name is its description
      var under = prev && !prev.desc && !looksLikeName && words >= 2 &&
        (PRICE.test(prev.name) || TRAILING_PRICE.test(prev.name) || (prev.name === prev.name.toUpperCase() && !allCaps));
      if (prev && (continues || sentence || under) && !(looksLikeName && !continues)) {
        prev.desc = prev.desc ? prev.desc + ' ' + l : l;
        return;
      }
      items.push({ name: l, desc: '', section: section });
    });
    return items;
  }

  function localAnalyze(text) {
    var tol = tolerance();
    return splitMenu(text).map(function (it) {
      var full = it.name + (it.desc ? ' ' + it.desc : '');
      var j = F.assess(full, tol);
      // "Name - description" on one line: keep the part before the dash as the name
      var parts = it.name.split(/\s[-–—:|]\s/);
      var name = parts[0].replace(/[$£€¥]\s?\d+([.,]\d+)?/g, '').replace(/\s\d+([.,]\d{1,2})?$/, '').replace(/\s{2,}/g, ' ').trim();
      var desc = (parts.slice(1).join(' - ') + ' ' + it.desc).trim();
      return {
        name: name.length > 70 ? name.slice(0, 67) + '…' : name,
        description: desc,
        section: it.section,
        verdict: j.verdict,
        groups: uniq(j.flags.map(function (f) { return f.group; })),
        reason: j.flags.length ? explain(j.flags)
          : j.verdict === 'good' ? 'Recognised low-FODMAP foods: ' + j.good.join(', ') + '. Nothing high-FODMAP was spotted, but the description may not list every ingredient, so ask about sauces and seasonings.'
          : 'The app doesn\'t recognise the foods in this dish, so it can\'t say whether it\'s low FODMAP. Ask what\'s in it.',
        ask: askFor(j.flags)
      };
    });
  }

  // One sentence per food (not per FODMAP group), naming the sources.
  function explain(flags) {
    var by = {}, order = [];
    flags.forEach(function (f) { if (!by[f.word]) { by[f.word] = []; order.push(f.word); } by[f.word].push(f); });
    return order.map(function (w) {
      var fs = by[w], names = uniq(fs.map(function (x) { return F.GROUPS[x.group].name; })).join(' and ');
      return F.describe(fs[0], names) + (fs[0].tested === 'partial' ? ' Small amounts were OK in your challenge.' : '');
    }).join(' ');
  }

  function askFor(flags) {
    var g = uniq(flags.map(function (f) { return f.group; }));
    var tips = [];
    if (g.indexOf('fructan-garlic') !== -1 || g.indexOf('fructan-onion') !== -1) tips.push('ask for it without garlic and onion, or with the sauce on the side');
    if (g.indexOf('lactose') !== -1) tips.push('ask for a dairy-free or lactose-free option');
    if (g.indexOf('fructan-grain') !== -1) tips.push('ask for a gluten-free bun, bread or pasta, or swap for rice or potatoes');
    if (g.indexOf('gos') !== -1) tips.push('ask to swap the beans or legumes for another vegetable');
    if (g.indexOf('mannitol') !== -1 || g.indexOf('polyol') !== -1) tips.push('ask to leave out the mushrooms, cauliflower or other high-polyol vegetables');
    return tips.join('; ');
  }
  function uniq(a) { return a.filter(function (x, i) { return a.indexOf(x) === i; }); }

  /* ---------- Claude menu analysis ---------- */
  function claudePrompt(text, hasImages) {
    return 'You are helping someone with IBS who is following the Monash University low FODMAP diet choose from a restaurant menu.\n\n' +
      (hasImages ? 'The attached image(s) show the menu. Read every dish you can see.\n' : '') +
      (text ? 'Menu text' + (hasImages ? ' (extracted, may be incomplete)' : '') + ':\n"""\n' + text.slice(0, 20000) + '\n"""\n' : '') +
      '\nTheir reintroduction results so far (groups they tolerate do not need to be avoided; "small amounts" means a modest portion is fine; untested groups should be treated as high FODMAP):\n' +
      toleranceText() +
      '\n\nFor each dish, judge it from the menu description and typical recipes (sauces, marinades, stocks and dressings often contain garlic and onion).\n' +
      'Reply with only JSON in this shape:\n' +
      '{"dishes":[{"name":"Grilled salmon","section":"Mains","verdict":"good|modify|avoid","groups":["fructan-garlic"],"reason":"short reason","ask":"what to ask the server, or empty"}],"best_picks":["dish name"]}\n' +
      'Use only these group ids: ' + Object.keys(F.GROUPS).join(', ') + '. Keep reasons under 25 words. Skip drinks unless they are notable.';
  }

  /* ---------- online lookup of typical ingredients ---------- */
  // Open Food Facts (real ingredient labels from packaged foods; open data, ODbL) and
  // Wikipedia (a short description of the dish; CC BY-SA). Only the food name is sent,
  // and only when the person taps a lookup button.
  var OFF_SEARCH = 'https://world.openfoodfacts.org/cgi/search.pl?search_simple=1&action=process&json=1&page_size=24&fields=product_name,ingredients_original_tags,ingredients_text_en&search_terms=';
  var WIKI_SEARCH = 'https://en.wikipedia.org/w/api.php?action=query&format=json&origin=*&redirects=1&prop=extracts%7Cinfo&inprop=url&exintro=1&explaintext=1&generator=search&gsrlimit=1&gsrsearch=';
  var lookupCache = {};
  var LOOKUP_KEY = 'ibs-lookup-v1', LOOKUP_DAYS = 7;
  function savedLookup(q) {
    try {
      var all = JSON.parse(localStorage.getItem(LOOKUP_KEY) || '{}'), r = all[q];
      return r && Date.now() - r.t < LOOKUP_DAYS * 864e5 ? r.d : null;
    } catch (e) { return null; }
  }
  function saveLookup(q, d) {
    try {
      var all = JSON.parse(localStorage.getItem(LOOKUP_KEY) || '{}');
      all[q] = { t: Date.now(), d: d };
      var keys = Object.keys(all);
      if (keys.length > 300) keys.sort(function (a, b) { return all[a].t - all[b].t; }).slice(0, keys.length - 300).forEach(function (k) { delete all[k]; });
      localStorage.setItem(LOOKUP_KEY, JSON.stringify(all));
    } catch (e) { /* storage full or blocked: skip caching */ }
  }
  function wait(ms) { return new Promise(function (r) { setTimeout(r, ms); }); }
  function cleanFoodName(n) {
    return String(n || '').replace(/[$£€]\s?\d+([.,]\d+)?/g, ' ').replace(/\(.*?\)/g, ' ')
      .replace(/^[\d\s\/½¼¾⅓⅔.,-]+(cups?|tbsp|tsp|tablespoons?|teaspoons?|g|kg|ml|l|oz|lbs?|pounds?|grams?|cloves?|slices?|pieces?|cans?|pinch|handful)?\.?\s+(of\s+)?/i, '')
      .replace(/(\s+[$£€]?\d+([.,]\d{1,2})?)+\s*$/, '')
      .replace(/\s+/g, ' ').trim().slice(0, 60);
  }
  // Fetch JSON; if the service is busy (429/503), wait and retry once.
  function getJSON(url, retried) {
    return fetch(url).then(function (r) {
      if ((r.status === 429 || r.status === 503) && !retried) {
        var after = Math.min(15, Number(r.headers.get('Retry-After')) || 6);
        return wait(after * 1000).then(function () { return getJSON(url, true); });
      }
      if (!r.ok) { var e = new Error('HTTP ' + r.status); e.busy = r.status === 429 || r.status === 503; throw e; }
      return r.json();
    });
  }
  // Open Food Facts gives each recognised ingredient a standard English tag
  // ("en:wheat-flour"). Use those, because the free-text English field is
  // sometimes left in another language. Fall back to the text if no tags.
  function productText(p) {
    var tags = (p.ingredients_original_tags || []).filter(function (t) { return /^en:/.test(t); })
      .map(function (t) { return t.slice(3).replace(/-/g, ' '); });
    if (tags.length) return tags.join(', ');
    return p.ingredients_text_en || '';
  }
  function lookupTypical(name) {
    var q = cleanFoodName(name);
    if (!q) return Promise.reject(new Error('empty'));
    if (lookupCache[q]) return lookupCache[q];
    var tol = tolerance(), saved = savedLookup(q), errs = {};
    var off = saved ? Promise.resolve(saved.off) : getJSON(OFF_SEARCH + encodeURIComponent(q)).catch(function (e) { errs.off = e.busy ? 'busy' : 'failed'; return null; });
    var wiki = saved ? Promise.resolve(saved.wiki) : getJSON(WIKI_SEARCH + encodeURIComponent(q)).catch(function (e) { errs.wiki = e.busy ? 'busy' : 'failed'; return null; });
    lookupCache[q] = Promise.all([off, wiki]).then(function (res) {
      if (!res[0] && !res[1]) { var err = new Error('offline'); err.errs = errs; throw err; }
      // Keep just what's needed, and remember complete answers for a week
      var offSlim = res[0] ? { products: (res[0].products || []).map(function (p) { return { t: productText(p) }; }) } : null;
      var wikiSlim = res[1] || null;
      if (!saved && offSlim && wikiSlim) saveLookup(q, { off: offSlim, wiki: wikiSlim });
      var prods = ((res[0] && res[0].products) || []).map(function (p) { return { t: p.t != null ? p.t : productText(p) }; })
        .filter(function (p) { return p.t && p.t.length > 3; }).slice(0, 20);
      var n = prods.length, counts = {};
      prods.forEach(function (p) {
        var seen = {};
        F.assess(p.t, tol).flags.forEach(function (f) {
          if (seen[f.word]) return; seen[f.word] = 1;
          (counts[f.word] = counts[f.word] || { flags: [], n: 0 }).n++;
          counts[f.word].flags = counts[f.word].flags.concat(f);
        });
        // keep each word's flags unique by group
      });
      var all = Object.keys(counts).map(function (w) { var c = counts[w]; c.word = w; c.share = c.n / n; return c; })
        .sort(function (a, b) { return b.n - a.n; });
      var common = all.filter(function (c) { return c.share >= 0.5; }), some = all.filter(function (c) { return c.share >= 0.2 && c.share < 0.5; });
      var pages = res[1] && res[1].query && res[1].query.pages, wp = pages ? pages[Object.keys(pages)[0]] : null;
      var wikiFlags = wp ? F.assess(wp.extract || '', tol).flags : [];
      var verdict;
      if (n >= 3) {
        verdict = common.some(function (c) { return c.flags.some(function (f) { return f.severity === 'avoid'; }); }) ? 'avoid'
          : (common.length || some.length) ? 'modify' : 'good';
      } else verdict = wikiFlags.length ? 'modify' : 'unknown';
      return { query: q, n: n, common: common, some: some, wiki: wp, wikiFlags: wikiFlags, verdict: verdict, errs: errs, cached: !!saved };
    });
    lookupCache[q].catch(function () { delete lookupCache[q]; });
    return lookupCache[q];
  }
  function lookupHTML(r) {
    function row(c) {
      var names = uniq(c.flags.map(function (f) { return F.GROUPS[f.group].name; })).join(' and ');
      return '<li><strong>' + esc(c.word) + '</strong>: in ' + c.n + ' of ' + r.n + ' products <span class="muted">(' + esc(names) + ')</span></li>';
    }
    var head = { avoid: 'Usually contains high-FODMAP ingredients', modify: 'Sometimes contains high-FODMAP ingredients', good: 'Typical ingredients look low FODMAP', unknown: 'Not enough information found' }[r.verdict];
    var html = '<div class="lookup-result ' + r.verdict + '"><p><span class="pill ' + r.verdict + '">' + esc(head) + '</span></p>';
    if (r.n) {
      html += '<p class="small">Checked the ingredient lists of ' + r.n + ' packaged “' + esc(r.query) + '” products on Open Food Facts against the app\'s food list.</p>';
      if (r.common.length) html += '<p class="small"><strong>Usually contains:</strong></p><ul class="small">' + r.common.map(row).join('') + '</ul>';
      if (r.some.length) html += '<p class="small"><strong>Sometimes contains:</strong></p><ul class="small">' + r.some.map(row).join('') + '</ul>';
      if (!r.common.length && !r.some.length) html += '<p class="small">None of the high-FODMAP foods on the app\'s list appeared in at least 1 in 5 of these products.</p>';
    } else if (r.errs.off) {
      html += '<p class="small">Open Food Facts was ' + (r.errs.off === 'busy' ? 'busy' : 'unavailable') + ', so no product ingredient lists were checked. Try again in a minute.</p>';
    } else {
      html += '<p class="small">No packaged products with English ingredient lists were found on Open Food Facts.</p>';
    }
    if (!r.wiki && r.errs.wiki) html += '<p class="small">Wikipedia was ' + (r.errs.wiki === 'busy' ? 'busy' : 'unavailable') + '.</p>';
    if (r.wiki) {
      var ex = String(r.wiki.extract || '').replace(/\s+/g, ' ').slice(0, 260);
      html += '<p class="small"><strong>Wikipedia, “' + esc(r.wiki.title) + '”:</strong> ' + esc(ex) + (ex.length >= 260 ? '…' : '') +
        (r.wikiFlags.length ? ' <em>Mentions: ' + esc(uniq(r.wikiFlags.map(function (f) { return f.word; })).join(', ')) + '.</em>' : '') +
        ' <a href="' + esc(r.wiki.fullurl || ('https://en.wikipedia.org/wiki/' + encodeURIComponent(r.wiki.title))) + '" target="_blank" rel="noopener">Read more ↗</a></p>';
    }
    html += '<p class="muted small">These are typical ingredients found online, not this restaurant\'s or brand\'s recipe. Ask how it\'s made. ' +
      'Product data from <a href="https://world.openfoodfacts.org/" target="_blank" rel="noopener">Open Food Facts</a> (ODbL); description from Wikipedia (CC BY-SA).</p></div>';
    return html;
  }
  function runLookup(name, out, btn) {
    if (btn) btn.disabled = true;
    out.innerHTML = '<p class="small">Looking up typical ingredients for “' + esc(cleanFoodName(name)) + '”…</p>';
    return lookupTypical(name).then(function (r) { out.innerHTML = lookupHTML(r); return r; }, function (e) {
      var busy = e && e.errs && (e.errs.off === 'busy' || e.errs.wiki === 'busy');
      out.innerHTML = '<p class="small">' + (busy ? 'Open Food Facts and Wikipedia are busy right now. Try again in a minute.' : 'Couldn\'t reach Open Food Facts or Wikipedia. Check your internet connection and try again.') + '</p>';
      return null;
    }).then(function (r) { if (btn) btn.disabled = false; return r; });
  }

  /* ---------- rendering ---------- */
  var VERDICT = { good: 'Likely OK', unknown: 'Not recognised: ask', modify: 'Ask or modify', avoid: 'Likely high FODMAP' };
  function renderMenu(dishes, best, source) {
    var order = { good: 0, unknown: 1, modify: 2, avoid: 3 };
    var counts = { good: 0, unknown: 0, modify: 0, avoid: 0 };
    dishes.forEach(function (d) { if (!order.hasOwnProperty(d.verdict)) d.verdict = 'modify'; counts[d.verdict]++; });
    var html = '<div class="menu-summary"><span class="pill good">' + counts.good + ' likely OK</span>' +
      '<span class="pill modify">' + counts.modify + ' ask or modify</span>' +
      '<span class="pill avoid">' + counts.avoid + ' likely high</span>' +
      (counts.unknown ? '<span class="pill unknown">' + counts.unknown + ' not recognised</span>' : '') +
      '<span class="small">Checked by ' + esc(source) + '</span></div>';
    if (best && best.length) html += '<p><strong>Best picks:</strong> ' + best.map(esc).join(', ') + '</p>';
    var toCheck = counts.unknown + counts.good;
    if (toCheck) html += '<div class="bulk-lookup"><button type="button" class="secondary small-btn" id="lookupAll">🔎 Look up the ' + toCheck + ' dish' + (toCheck === 1 ? '' : 'es') + ' that aren\'t flagged</button>' +
      '<button type="button" class="secondary small-btn" id="lookupStop" hidden>Stop</button><p class="small muted" id="lookupProgress">Checks typical ingredients one dish at a time, a few seconds apart, so the free services aren\'t overloaded.</p></div>';
    html += '<div class="filter" role="group" aria-label="Filter dishes">' +
      ['all', 'good', 'modify', 'avoid', 'unknown'].map(function (k) {
        return '<button type="button" class="secondary small-btn" data-filter="' + k + '">' + (k === 'all' ? 'All' : VERDICT[k]) + '</button>';
      }).join('') + '</div>';
    html += '<div class="dish-list">' + dishes.slice().sort(function (a, b) { return order[a.verdict] - order[b.verdict]; }).map(function (d) {
      return '<article class="dish ' + d.verdict + '" data-v="' + d.verdict + '"><header><h3>' + esc(d.name) + '</h3>' +
        '<span class="pill ' + d.verdict + '">' + VERDICT[d.verdict] + '</span></header>' +
        (d.section ? '<p class="small">' + esc(d.section) + '</p>' : '') +
        (d.description && d.description !== d.name ? '<p class="desc">' + esc(d.description) + '</p>' : '') +
        '<p>' + esc(d.reason || '') + '</p>' +
        ((d.groups || []).length ? '<p class="small">Groups: ' + d.groups.map(function (g) { return esc((F.GROUPS[g] || { name: g }).name); }).join(', ') + '</p>' : '') +
        (d.ask ? '<p class="ask"><strong>Ask:</strong> ' + esc(d.ask) + '</p>' : '') +
        '<div class="lookup"><button type="button" class="secondary small-btn" data-lookup="' + esc(d.name) + '">🔎 Look up typical ingredients online</button><div class="lookup-out"></div></div>' +
        '</article>';
    }).join('') + '</div>';
    if (!dishes.length) html = '<p class="small">No dishes found. Try a clearer photo, or paste the menu text.</p>';
    $('menuResults').innerHTML = html;
  }

  var bulkStop = false;
  function lookupAll() {
    var cards = Array.prototype.slice.call(document.querySelectorAll('#menuResults .dish[data-v="unknown"], #menuResults .dish[data-v="good"]')).slice(0, 30);
    var go = $('lookupAll'), stop = $('lookupStop'), prog = $('lookupProgress');
    bulkStop = false; go.disabled = true; stop.hidden = false;
    var i = 0;
    function next() {
      if (bulkStop || i >= cards.length) {
        prog.textContent = bulkStop ? 'Stopped after ' + i + ' of ' + cards.length + '.' : 'Done: looked up ' + cards.length + ' dish' + (cards.length === 1 ? '' : 'es') + '. Results are under each dish.';
        go.disabled = false; stop.hidden = true; return;
      }
      var card = cards[i++], b = card.querySelector('[data-lookup]'), name = b.getAttribute('data-lookup');
      prog.textContent = 'Looking up ' + i + ' of ' + cards.length + ': ' + name + '…';
      var cached = !!savedLookup(cleanFoodName(name));
      runLookup(name, b.nextElementSibling, b).then(function () { return cached ? null : wait(6500); }).then(next);
    }
    next();
  }

  $('menuResults').addEventListener('click', function (e) {
    if (e.target.id === 'lookupAll') { lookupAll(); return; }
    if (e.target.id === 'lookupStop') { bulkStop = true; return; }
    var lb = e.target.closest('[data-lookup]');
    if (lb) { runLookup(lb.getAttribute('data-lookup'), lb.nextElementSibling, lb); return; }
    var f = e.target.getAttribute('data-filter');
    if (!f) return;
    Array.prototype.forEach.call(document.querySelectorAll('#menuResults .dish'), function (d) {
      d.hidden = f !== 'all' && d.getAttribute('data-v') !== f;
    });
  });

  /* ---------- menu flow ---------- */
  var menuFile = null, ctl = null;
  $('menuFile').addEventListener('change', function () {
    menuFile = this.files[0] || null;
    status(menuFile ? 'Selected: ' + menuFile.name : '');
  });
  var drop = $('menuDrop');
  ['dragenter', 'dragover'].forEach(function (t) { drop.addEventListener(t, function (e) { e.preventDefault(); drop.classList.add('over'); }); });
  ['dragleave', 'drop'].forEach(function (t) { drop.addEventListener(t, function () { drop.classList.remove('over'); }); });
  drop.addEventListener('drop', function (e) {
    e.preventDefault();
    if (e.dataTransfer.files[0]) { menuFile = e.dataTransfer.files[0]; status('Selected: ' + menuFile.name); }
  });
  $('menuStop').addEventListener('click', function () { if (ctl) ctl.abort(); });

  $('menuCheck').addEventListener('click', function () {
    var pasted = $('menuText').value.trim();
    if (!menuFile && !pasted) { status('Choose a photo or PDF, or paste some menu text first.'); return; }
    var engine = sample && $('menuEngine') ? $('menuEngine').value : 'local';
    var btn = this;
    btn.disabled = true;
    $('menuResults').innerHTML = '';
    var isPdf = menuFile && (menuFile.type === 'application/pdf' || /\.pdf$/i.test(menuFile.name));
    var isImg = menuFile && /^image\//.test(menuFile.type);

    var job;
    if (engine === 'claude') {
      ctl = new AbortController();
      $('menuStop').hidden = false;
      job = (isPdf ? (status('Opening PDF…'), loadPdf(menuFile).then(function (pdf) {
        return Promise.all([pdfText(pdf), canImages ? pdfImages(pdf, maxImages) : []]);
      })) : Promise.resolve(['', isImg && canImages ? [menuFile] : []]))
        .then(function (r) {
          var text = [r[0], pasted].filter(Boolean).join('\n');
          var imgs = r[1];
          if (!text && !imgs.length) throw { code: 'local_only' };
          status('Claude is reading the menu… this can take up to a minute.');
          return sample.json(claudePrompt(text, imgs.length > 0), { images: imgs.length ? imgs : undefined, signal: ctl.signal });
        })
        .then(function (res) {
          var dishes = (res && Array.isArray(res.dishes)) ? res.dishes : [];
          renderMenu(dishes, res && res.best_picks, 'Claude');
          status('Done. Always double-check with staff: recipes vary.');
        });
    } else {
      job = (isPdf ? (status('Opening PDF…'), loadPdf(menuFile).then(function (pdf) {
        return pdfText(pdf).then(function (t) {
          if (t.replace(/\s/g, '').length > 40) return t;
          status('This PDF is a scan; reading the text from the page images…');
          return pdfImages(pdf, 4).then(ocr);
        });
      })) : isImg ? (status('Loading text reader…'), ocr([menuFile])) : Promise.resolve(''))
        .then(function (t) {
          var text = [t, pasted].filter(Boolean).join('\n');
          renderMenu(localAnalyze(text), null, 'on-device keyword check');
          status('Done. The keyword check can only see what the menu says, so ask staff about sauces and marinades.');
        });
    }
    job.catch(function (e) {
      if (e && e.code === 'local_only') status('Claude can\'t view images here. Switch to the quick keyword check.');
      else if (e && e.code) status(claudeError(e));
      else status('Couldn\'t read that file (' + (e && e.message ? e.message : 'unknown error') + '). Try another photo, or paste the text.');
    }).then(function () { btn.disabled = false; $('menuStop').hidden = true; });
  });

  /* ---------- meal ideas: advanced web search + recipe checker ---------- */
  function mstatus(m) { $('mealStatus').textContent = m; }

  // Words to leave out of a web search, per FODMAP group (well-known foods from the master list)
  var EXCLUDE_WORDS = {
    'fructan-garlic': ['garlic'], 'fructan-onion': ['onion', 'shallot'], 'fructan-grain': ['wheat'],
    'lactose': ['milk', 'cream'], 'gos': ['beans', 'lentils'], 'fructose': ['honey', 'mango'],
    'sorbitol': ['avocado', 'apple'], 'mannitol': ['mushroom', 'cauliflower']
  };
  var TRUSTED = ['monashfodmap.com', 'myginutrition.com', 'cdhf.ca'];
  var ENGINES = {
    google: 'https://www.google.com/search?q=', duckduckgo: 'https://duckduckgo.com/?q=', bing: 'https://www.bing.com/search?q='
  };
  var excludeOff = {};

  // Foods to leave out: every word for trigger groups; the main food only for groups
  // not tested yet (keeps searches short). Tolerated or "small amounts OK" groups add nothing.
  function suggestedExcludes() {
    var t = tolerance(), out = [];
    Object.keys(EXCLUDE_WORDS).forEach(function (g) {
      var words = t[g] === 'trigger' ? EXCLUDE_WORDS[g] : t[g] === '' ? EXCLUDE_WORDS[g].slice(0, 1) : [];
      words.forEach(function (w) { if (out.indexOf(w) === -1) out.push(w); });
    });
    return out;
  }
  function renderExcludeChips() {
    var words = suggestedExcludes();
    $('mealExcludeChips').innerHTML = words.length ? words.map(function (w) {
      return '<button type="button" class="chip' + (excludeOff[w] ? ' off' : '') + '" data-word="' + esc(w) + '" aria-pressed="' + (!excludeOff[w]) + '">' + (excludeOff[w] ? '+ ' : '✕ ') + esc(w) + '</button>';
    }).join('') : '<span class="muted small">Nothing to leave out: you tolerated every group you tested.</span>';
  }
  function buildQuery() {
    var v = function (id) { return ($(id).value || '').trim(); };
    var parts = ['low FODMAP'];
    if (v('mealDiet')) parts.push(v('mealDiet'));
    if (v('mealCuisine')) parts.push(v('mealCuisine'));
    if (v('mealIng')) parts.push(v('mealIng'));
    parts.push(v('mealType') ? v('mealType').toLowerCase() + ' recipe' : 'recipe');
    if (v('mealTime')) parts.push('under ' + v('mealTime') + ' minutes');
    if (v('mealNotes')) parts.push(v('mealNotes'));
    var ex = suggestedExcludes().filter(function (w) { return !excludeOff[w]; });
    v('mealExcludeExtra').split(',').forEach(function (w) { w = w.trim(); if (w && ex.indexOf(w) === -1) ex.push(w); });
    ex.forEach(function (w) { parts.push('-' + (/\s/.test(w) ? '"' + w + '"' : w)); });
    if ($('mealTrusted').checked) parts.push('(' + TRUSTED.map(function (d) { return 'site:' + d; }).join(' OR ') + ')');
    return parts.join(' ');
  }
  function updateQuery() { $('mealQuery').textContent = buildQuery(); }

  try { var savedEngine = localStorage.getItem('ibs-search-engine'); if (savedEngine && ENGINES[savedEngine]) $('mealEngine').value = savedEngine; } catch (e) { /* storage blocked */ }
  ['mealIng', 'mealType', 'mealTime', 'mealDiet', 'mealCuisine', 'mealNotes', 'mealExcludeExtra', 'mealTrusted', 'mealEngine'].forEach(function (id) {
    $(id).addEventListener('input', updateQuery); $(id).addEventListener('change', updateQuery);
  });
  $('mealEngine').addEventListener('change', function () { try { localStorage.setItem('ibs-search-engine', this.value); } catch (e) { /* ignore */ } });
  $('mealExcludeChips').addEventListener('click', function (e) {
    var b = e.target.closest('[data-word]'); if (!b) return;
    var w = b.getAttribute('data-word'); excludeOff[w] = !excludeOff[w];
    renderExcludeChips(); updateQuery();
  });
  // Refresh the suggestions whenever the Tools tab is opened (results may have changed)
  document.addEventListener('click', function (e) {
    if (e.target.closest('[data-tab="tools"],[data-subtab="meals"],[data-goto="tools"]')) setTimeout(function () { renderExcludeChips(); updateQuery(); }, 0);
  });
  renderExcludeChips(); updateQuery();

  $('mealSearch').addEventListener('click', function () {
    var url = ENGINES[$('mealEngine').value] + encodeURIComponent(buildQuery());
    var w = window.open(url, '_blank');
    if (w) { try { w.opener = null; } catch (e) { /* ignore */ } }
    mstatus(!w ? 'Your browser blocked the new tab. Copy the search instead.' : 'Opened in a new tab. Found a recipe? Paste its ingredients below to check them.');
  });
  $('mealCopy').addEventListener('click', function () {
    var q = buildQuery();
    (navigator.clipboard && navigator.clipboard.writeText ? navigator.clipboard.writeText(q) : Promise.reject())
      .then(function () { mstatus('Search copied.'); }, function () { mstatus('Copy this search: ' + q); });
  });

  // Check a pasted ingredient list against the master food list
  $('recipeCheck').addEventListener('click', function () {
    var lines = $('recipeText').value.split(/\r?\n/).map(function (l) { return l.trim(); }).filter(function (l) { return /[a-z]{3}/i.test(l); });
    if (!lines.length) { $('recipeResults').innerHTML = '<p class="small">Paste the recipe\'s ingredient list first, one ingredient per line.</p>'; return; }
    var tol = tolerance(), flagged = [], good = [], unknown = [];
    lines.forEach(function (l) {
      var a = F.assess(l, tol);
      if (a.flags.length) flagged.push({ line: l, j: a }); else if (a.verdict === 'good') good.push(l); else unknown.push(l);
    });
    var avoid = flagged.filter(function (x) { return x.j.verdict === 'avoid'; }).length;
    var verdict = avoid ? 'avoid' : flagged.length ? 'modify' : unknown.length ? 'unknown' : 'good';
    var check = flagged.length - avoid;
    var head = verdict === 'good' ? 'All ingredients recognised as low FODMAP'
      : [avoid ? avoid + ' ingredient' + (avoid === 1 ? '' : 's') + ' to swap' : '', check ? check + ' to check the amount' : '',
         unknown.length ? unknown.length + ' not recognised' : ''].filter(Boolean).join(' · ');
    var groups = uniq([].concat.apply([], flagged.map(function (x) { return x.j.flags.map(function (f) { return f.group; }); })));
    $('recipeResults').innerHTML = '<article class="dish ' + verdict + '"><header><h3>' + esc(head) + '</h3><span class="pill ' + verdict + '">' + VERDICT[verdict] + '</span></header>' +
      (flagged.length ? '<ul class="rv-list warn">' + flagged.map(function (x) {
        return '<li><strong>' + esc(x.line) + '</strong><br>' + esc(explain(x.j.flags)) + '</li>';
      }).join('') + '</ul>' : '') +
      (groups.length ? '<p class="small"><strong>Swap ideas:</strong></p><ul class="small">' + groups.map(function (g) { return '<li><strong>' + esc(F.GROUPS[g].name) + ':</strong> ' + esc(F.GROUPS[g].swap) + '</li>'; }).join('') + '</ul>' : '') +
      (good.length ? '<p class="small"><strong>Recognised as low FODMAP:</strong> ' + good.map(esc).join(' · ') + '</p>' : '') +
      (unknown.length ? '<p class="small"><strong>Not recognised:</strong> ' + unknown.map(esc).join(' · ') + '</p>' +
        '<div class="lookup"><button type="button" class="secondary small-btn" id="recipeLookup">🔎 Look up ' + (unknown.length === 1 ? 'it' : 'these ' + Math.min(unknown.length, 6)) + ' online</button><div id="recipeLookupOut"></div></div>' : '') +
      '<p class="muted small">Checked against the app\'s master food list (CDHF, Alberta Health Services, Michigan Medicine, Monash). Amounts and brands matter, so check with your dietitian.</p></article>';
    var rl = $('recipeLookup');
    if (rl) rl.addEventListener('click', function () {
      var out = $('recipeLookupOut'); out.innerHTML = ''; rl.disabled = true;
      var chain = Promise.resolve();
      unknown.slice(0, 6).forEach(function (line) {
        var box = document.createElement('div'); box.className = 'lookup-item';
        box.innerHTML = '<p class="small"><strong>' + esc(cleanFoodName(line)) + '</strong></p><div></div>';
        out.appendChild(box);
        var cached = !!savedLookup(cleanFoodName(line));
        chain = chain.then(function () { return runLookup(line, box.lastChild); }).then(function () { return cached ? null : wait(6500); });
      });
      chain.then(function () { rl.disabled = false; });
    });
  });

  // Check a single food or dish
  $('foodCheck').addEventListener('click', function () {
    var q = $('foodQuery').value.trim(), out = $('foodResult');
    if (!q) { out.innerHTML = '<p class="small">Type a food or dish first.</p>'; return; }
    var a = F.assess(q, tolerance());
    var reason = a.flags.length ? explain(a.flags)
      : a.verdict === 'good' ? 'Recognised as low FODMAP: ' + a.good.join(', ') + '.'
      : 'Not on the app\'s food list. Look it up online to see its typical ingredients.';
    out.innerHTML = '<article class="dish ' + a.verdict + '"><header><h3>' + esc(q) + '</h3><span class="pill ' + a.verdict + '">' + VERDICT[a.verdict] + '</span></header>' +
      '<p>' + esc(reason) + '</p><div class="lookup"><button type="button" class="secondary small-btn" data-lookup="' + esc(q) + '">🔎 Look up typical ingredients online</button><div class="lookup-out"></div></div></article>';
    if (a.verdict === 'unknown') { var b = out.querySelector('[data-lookup]'); runLookup(q, b.nextElementSibling, b); }
  });
  $('foodQuery').addEventListener('keydown', function (e) { if (e.key === 'Enter') { e.preventDefault(); $('foodCheck').click(); } });
  $('foodResult').addEventListener('click', function (e) {
    var lb = e.target.closest('[data-lookup]');
    if (lb) runLookup(lb.getAttribute('data-lookup'), lb.nextElementSibling, lb);
  });

  var mealCtl = null;
  $('mealAsk').addEventListener('click', function () {
    if (!sample) return;
    var btn = this;
    btn.disabled = true;
    mealCtl = new AbortController();
    mstatus('Claude is thinking up meal ideas…');
    $('mealResults').innerHTML = '';
    var prompt = 'Suggest 4 meal ideas for someone with IBS following the Monash University low FODMAP diet.\n' +
      'Main ingredient: ' + ($('mealIng').value.trim() || 'any') + '\nMeal: ' + ($('mealType').value || 'any') +
      '\nOther wishes: ' + ($('mealNotes').value.trim() || 'none') +
      '\n\nTheir reintroduction results (avoid TRIGGER and untested groups; tolerated groups are fine; "small amounts" means modest portions):\n' + toleranceText() +
      '\n\nUse everyday ingredients, give low FODMAP serving notes where they matter, and use garlic-infused oil or spring onion greens for flavor where useful.\n' +
      'Reply with only JSON: {"meals":[{"name":"","time_minutes":20,"why":"one sentence","ingredients":["150 g chicken breast"],"steps":["short step"],"watch":"portion notes or empty"}]}';
    sample.json(prompt, { signal: mealCtl.signal, cache: false }).then(function (res) {
      var meals = (res && Array.isArray(res.meals)) ? res.meals : [];
      $('mealResults').innerHTML = meals.map(function (m) {
        return '<article class="meal card"><div><header><h3>' + esc(m.name) + '</h3>' +
          (m.time_minutes ? '<span class="pill good">' + esc(m.time_minutes) + ' min</span>' : '') + '</header>' +
          '<p>' + esc(m.why) + '</p>' +
          '<details open><summary>Ingredients</summary><ul class="ings">' + (m.ingredients || []).map(function (i) { return '<li>' + esc(i) + '</li>'; }).join('') + '</ul></details>' +
          '<details><summary>Method</summary><ol>' + (m.steps || []).map(function (s) { return '<li>' + esc(s) + '</li>'; }).join('') + '</ol></details>' +
          (m.watch ? '<p class="small"><strong>Watch:</strong> ' + esc(m.watch) + '</p>' : '') +
          '</div></article>';
      }).join('');
      mstatus(meals.length ? 'Ideas from Claude. Check serving sizes in the Monash app.' : 'No ideas came back. Try again.');
    }).catch(function (e) { mstatus(claudeError(e)); }).then(function () { btn.disabled = false; });
  });

  // Exposed for testing
  window.IBSFeatures = { localAnalyze: localAnalyze, splitMenu: splitMenu };
})();
