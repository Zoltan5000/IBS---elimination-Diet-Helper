/*
 * Menu checker and meal ideas.
 *
 * Works in two environments:
 *  - Opened on claude.ai as an artifact: Claude reads menu photos and PDFs
 *    and can suggest meals (window.claude "sample" capability).
 *  - Opened anywhere else (a local file, GitHub Pages): menus are read on the
 *    device with pdf.js and Tesseract OCR, then screened with the keyword
 *    rules in fodmap-data.js; meal ideas come from TheMealDB's free API.
 */
(function () {
  'use strict';

  var F = window.FODMAP;
  var $ = function (id) { return document.getElementById(id); };
  var PDFJS = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js';
  var PDFJS_WORKER = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
  var TESSERACT = 'https://cdn.jsdelivr.net/npm/tesseract.js@5.1.1/dist/tesseract.min.js';
  var MEALDB = 'https://www.themealdb.com/api/json/v1/1/';

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
    var t = tolerance(), labels = { tolerated: 'tolerated', partial: 'tolerated in small amounts', trigger: 'TRIGGER', '': 'not tested yet' };
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
  function splitMenu(text) {
    var raw = String(text).split(/\r?\n/).map(function (l) { return l.replace(/\s+/g, ' ').trim(); });
    var items = [], section = '';
    raw.forEach(function (l) {
      if (!l || PRICE_ONLY.test(l) || (l.match(/[a-z]/gi) || []).length < 3) return;
      var letters = l.replace(/[^a-z]/gi, '');
      var isHeader = l.length < 30 && letters === letters.toUpperCase() && !/\d/.test(l) && F.scan(l).length === 0;
      if (isHeader) { section = l; return; }
      var prev = items[items.length - 1];
      // Description lines usually start lower-case or follow a line ending in a comma
      if (prev && (/^[a-z(,&]/.test(l) || /[,&-]$/.test(prev.text))) { prev.text += ' ' + l; return; }
      items.push({ text: l, section: section });
    });
    return items;
  }

  function localAnalyze(text) {
    var tol = tolerance();
    return splitMenu(text).map(function (it) {
      var j = F.judge(F.scan(it.text), tol);
      var name = it.text.split(/\s[-–—:|]\s|\s{2,}|\.\s/)[0].replace(/[$£€]\s?\d+([.,]\d+)?/g, '').trim();
      return {
        name: name.length > 70 ? name.slice(0, 67) + '…' : name,
        description: it.text,
        section: it.section,
        verdict: j.verdict,
        groups: uniq(j.flags.map(function (f) { return f.group; })),
        reason: j.flags.length ? j.flags.map(function (f) {
          return '"' + f.word + '" (' + F.GROUPS[f.group].name +
            (f.level === 'often' ? ', often contains' : f.level === 'portion' ? ', portion-dependent' : '') +
            (f.tested === 'partial' ? ', small amounts OK for you' : '') + ')';
        }).join('; ') : 'No common high-FODMAP ingredients spotted in the description.',
        ask: askFor(j.flags)
      };
    });
  }

  function askFor(flags) {
    var g = uniq(flags.map(function (f) { return f.group; }));
    var tips = [];
    if (g.indexOf('fructan-garlic') !== -1 || g.indexOf('fructan-onion') !== -1) tips.push('ask for it without garlic and onion, or with the sauce on the side');
    if (g.indexOf('lactose') !== -1) tips.push('ask for a dairy-free or lactose-free option');
    if (g.indexOf('fructan-grain') !== -1) tips.push('ask for a gluten-free bun, bread or pasta, or swap for rice or potatoes');
    if (g.indexOf('gos') !== -1) tips.push('ask to swap the beans or legumes for another vegetable');
    if (g.indexOf('mannitol') !== -1) tips.push('ask to leave out the mushrooms or cauliflower');
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

  /* ---------- rendering ---------- */
  var VERDICT = { good: 'Likely OK', modify: 'Ask or modify', avoid: 'Likely high FODMAP' };
  function renderMenu(dishes, best, source) {
    var order = { good: 0, modify: 1, avoid: 2 };
    var counts = { good: 0, modify: 0, avoid: 0 };
    dishes.forEach(function (d) { if (!order.hasOwnProperty(d.verdict)) d.verdict = 'modify'; counts[d.verdict]++; });
    var html = '<div class="menu-summary"><span class="pill good">' + counts.good + ' likely OK</span>' +
      '<span class="pill modify">' + counts.modify + ' ask or modify</span>' +
      '<span class="pill avoid">' + counts.avoid + ' likely high</span>' +
      '<span class="small">Checked by ' + esc(source) + '</span></div>';
    if (best && best.length) html += '<p><strong>Best picks:</strong> ' + best.map(esc).join(', ') + '</p>';
    html += '<div class="filter" role="group" aria-label="Filter dishes">' +
      ['all', 'good', 'modify', 'avoid'].map(function (k) {
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
        '</article>';
    }).join('') + '</div>';
    if (!dishes.length) html = '<p class="small">No dishes found. Try a clearer photo, or paste the menu text.</p>';
    $('menuResults').innerHTML = html;
  }

  $('menuResults').addEventListener('click', function (e) {
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

  /* ---------- meal ideas ---------- */
  function mstatus(m) { $('mealStatus').textContent = m; }

  function getJSON(url) {
    return fetch(url).then(function (r) { if (!r.ok) throw new Error('HTTP ' + r.status); return r.json(); });
  }

  function shuffle(a) {
    for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)); var t = a[i]; a[i] = a[j]; a[j] = t; }
    return a;
  }

  function mealIngredients(m) {
    var out = [];
    for (var i = 1; i <= 20; i++) {
      var ing = (m['strIngredient' + i] || '').trim();
      if (ing) out.push({ name: ing, measure: (m['strMeasure' + i] || '').trim() });
    }
    return out;
  }

  $('mealSearch').addEventListener('click', function () {
    var btn = this, ing = $('mealIng').value.trim().toLowerCase(), type = $('mealType').value;
    var notes = $('mealNotes').value.trim().toLowerCase();
    btn.disabled = true;
    mstatus('Searching recipes online…');
    $('mealResults').innerHTML = '';
    var url = ing ? MEALDB + 'filter.php?i=' + encodeURIComponent(ing.replace(/\s+/g, '_'))
      : type === 'Breakfast' ? MEALDB + 'filter.php?c=Breakfast'
      : MEALDB + 'filter.php?c=' + (/vegetarian|vegan/.test(notes) ? 'Vegetarian' : 'Chicken');
    getJSON(url).then(function (d) {
      var list = (d && d.meals) || [];
      if (!list.length && ing) return getJSON(MEALDB + 'search.php?s=' + encodeURIComponent(ing)).then(function (d2) { return (d2 && d2.meals) || []; });
      return list;
    }).then(function (list) {
      if (!list.length) throw new Error('none');
      var pick = shuffle(list.slice()).slice(0, 12);
      mstatus('Checking ' + pick.length + ' recipes against your triggers…');
      return Promise.all(pick.map(function (m) {
        return m.strInstructions ? m : getJSON(MEALDB + 'lookup.php?i=' + m.idMeal).then(function (x) { return x.meals && x.meals[0]; }).catch(function () { return null; });
      }));
    }).then(function (meals) {
      var tol = tolerance();
      var scored = meals.filter(Boolean).map(function (m) {
        var ings = mealIngredients(m);
        var flagged = [];
        ings.forEach(function (i) {
          var j = F.judge(F.scan(i.name), tol);
          if (j.flags.length) flagged.push({ ing: i, flags: j.flags, verdict: j.verdict });
        });
        var avoid = flagged.filter(function (f) { return f.verdict === 'avoid'; }).length;
        return { meal: m, ings: ings, flagged: flagged, score: avoid * 2 + (flagged.length - avoid) };
      }).sort(function (a, b) { return a.score - b.score; }).slice(0, 6);
      renderMeals(scored);
      mstatus(scored.length ? 'Recipes with the fewest triggers are shown first. Swaps are suggested for flagged ingredients.' : 'No recipes found.');
    }).catch(function (e) {
      if (e && e.message === 'none') mstatus('No recipes found for "' + ing + '". Try a simpler ingredient, like chicken or rice.');
      else mstatus('Couldn\'t reach the recipe site from here' + (sample ? '. Try "Ask Claude for ideas" instead.' : '. Check your internet connection and try again.'));
    }).then(function () { btn.disabled = false; });
  });

  function renderMeals(items) {
    $('mealResults').innerHTML = items.map(function (x) {
      var m = x.meal;
      var flaggedNames = x.flagged.map(function (f) { return f.ing.name; });
      var swaps = uniq([].concat.apply([], x.flagged.map(function (f) { return f.flags.map(function (fl) { return fl.group; }); })))
        .map(function (g) { return '<li><strong>' + esc(F.GROUPS[g].name) + ':</strong> ' + esc(F.GROUPS[g].swap) + '</li>'; }).join('');
      var v = x.flagged.some(function (f) { return f.verdict === 'avoid'; }) ? 'modify' : x.flagged.length ? 'modify' : 'good';
      return '<article class="meal card">' +
        (m.strMealThumb ? '<img src="' + esc(m.strMealThumb) + '/preview" alt="" loading="lazy">' : '') +
        '<div><header><h3>' + esc(m.strMeal) + '</h3><span class="pill ' + v + '">' + (v === 'good' ? 'No triggers spotted' : x.flagged.length + ' to swap') + '</span></header>' +
        '<p class="small">' + esc([m.strArea, m.strCategory].filter(Boolean).join(' · ')) + '</p>' +
        '<details><summary>Ingredients</summary><ul class="ings">' + x.ings.map(function (i) {
          var bad = flaggedNames.indexOf(i.name) !== -1;
          return '<li' + (bad ? ' class="flag"' : '') + '>' + esc(i.measure + ' ' + i.name) + (bad ? ' ⚠' : '') + '</li>';
        }).join('') + '</ul></details>' +
        (swaps ? '<p class="small"><strong>Swaps:</strong></p><ul class="small">' + swaps + '</ul>' : '') +
        '<p class="small"><a href="https://www.themealdb.com/meal/' + esc(m.idMeal) + '" target="_blank" rel="noopener">Full recipe on TheMealDB</a>' +
        (m.strSource ? ' · <a href="' + esc(m.strSource) + '" target="_blank" rel="noopener">original source</a>' : '') + '</p>' +
        '</div></article>';
    }).join('');
  }

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
