/*
 * IBS Domination: program logic.
 * The app walks someone through the Monash three-phase low FODMAP diet
 * (baseline, elimination, check-in, reintroduction, personalisation),
 * keeps a symptom log, and turns progress into a retro quest map.
 * All data stays in this browser (localStorage); backups are JSON files.
 */
(function () {
  'use strict';

  var KEY = 'ibs-helper-v2', OLD_KEY = 'ibs-guide-v1';
  function $(id) { return document.getElementById(id); }
  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  /* ---------- dates (local calendar days) ---------- */
  function iso(d) { var m = d.getMonth() + 1, x = d.getDate(); return d.getFullYear() + '-' + (m < 10 ? '0' : '') + m + '-' + (x < 10 ? '0' : '') + x; }
  function today() { return iso(new Date()); }
  function parse(s) { var p = String(s).split('-'); return new Date(+p[0], +p[1] - 1, +p[2]); }
  function diff(a, b) { return Math.round((parse(b) - parse(a)) / 864e5); }
  function addDays(s, n) { var d = parse(s); d.setDate(d.getDate() + n); return iso(d); }
  function ago(s) { var n = diff(s, today()); return n <= 0 ? 'today' : n === 1 ? 'yesterday' : n + ' days ago'; }
  function nice(s) { return parse(s).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' }); }

  /* ---------- program content ---------- */
  var PHASES = {
    prep:        { name: 'Get ready', icon: '🩺', color: 'var(--c-prep)', dur: 'Before you start',
                   you: 'See your doctor to confirm IBS, get tested for celiac disease while still eating gluten, and find a dietitian if you can.',
                   app: ['Readiness checklist', 'Red-flag symptoms', 'The guide in Learn'] },
    baseline:    { name: 'Baseline week', icon: '📝', color: 'var(--c-baseline)', dur: '7 days',
                   you: 'Eat as you normally do and log how you feel every day.',
                   app: ['Quick daily log', 'Streaks and coins', 'Symptom chart'] },
    elimination: { name: 'Elimination', icon: '🥗', color: 'var(--c-elimination)', dur: '2–6 weeks',
                   you: 'Swap high-FODMAP foods for low-FODMAP ones and keep logging.',
                   app: ['Week counter', 'Menu checker', 'Meal ideas', 'Daily tips'] },
    checkin:     { name: 'Check-in', icon: '📊', color: 'var(--c-prep)', dur: '1 day',
                   you: 'See whether your symptoms have improved enough to move on.',
                   app: ['Before and after comparison', 'Clear next step'] },
    reintro:     { name: 'Reintroduction', icon: '🧪', color: 'var(--c-reintro)', dur: '6–12 weeks',
                   you: 'Test one FODMAP group at a time: 3 challenge days, then a few days\' break.',
                   app: ['Day-by-day challenge coach', 'Reaction check-ins', 'Washout timer', 'Results'] },
    personal:    { name: 'Your diet', icon: '⭐', color: 'var(--c-personal)', dur: 'Long term',
                   you: 'Eat everything you tolerate and limit only your triggers. Retest them every few months.',
                   app: ['Your food results', 'Menu checker uses your results', 'Retest a group'] }
  };
  var ORDER = ['prep', 'baseline', 'elimination', 'checkin', 'reintro', 'personal'];

  // Serve sizes follow Monash's 3-day structure (moderate, then larger, then
  // your usual amount). Exact amounts aren't given here: Monash revised them in
  // 2025, so people confirm them with their dietitian. Mango as the fructose
  // test is from Monash; the other foods are common examples.
  var DOSES = ['a moderate serve', 'a larger serve', 'your usual-sized serve'];
  var GROUPS = [
    { id: 'lactose', name: 'Lactose', emoji: '🥛', food: 'cow\'s milk' },
    { id: 'fructose', name: 'Fructose', emoji: '🥭', food: 'mango' },
    { id: 'sorbitol', name: 'Sorbitol', emoji: '🍑', food: 'a sorbitol test food your dietitian suggests' },
    { id: 'mannitol', name: 'Mannitol', emoji: '🍄', food: 'button mushrooms' },
    { id: 'fructan-grain', name: 'Fructans: wheat', emoji: '🍞', food: 'wheat bread' },
    { id: 'fructan-garlic', name: 'Fructans: garlic', emoji: '🧄', food: 'garlic' },
    { id: 'fructan-onion', name: 'Fructans: onion', emoji: '🧅', food: 'onion' },
    { id: 'gos', name: 'GOS (legumes)', emoji: '🫘', food: 'canned lentils or chickpeas, rinsed' }
  ];
  GROUPS.forEach(function (g) { g.doses = DOSES; });

  var G = {}; GROUPS.forEach(function (g) { G[g.id] = g; });
  var RESULT = { tolerated: 'Tolerated', partial: 'Small amounts OK', trigger: 'Trigger' };
  var REACT = [
    { face: '😀', label: 'None' }, { face: '🙂', label: 'Mild' },
    { face: '😣', label: 'Moderate' }, { face: '😫', label: 'Severe' }
  ];
  // [tip, source URL or ''] — sources verified (see docs/SOURCES.md)
  var MON_OIL = 'https://www.monashfodmap.com/blog/all-about-onion-garlic-and-infused-oils-on-the-low-fodmap-diet/';
  var NICE_PUB = 'https://www.nice.org.uk/guidance/cg61/ifp/chapter/managing-irritable-bowel-syndrome';
  var TIPS = [
    ['Garlic-infused oil gives garlic flavor without the FODMAPs, because fructans dissolve in water but not in oil. Remove the garlic pieces before eating.', MON_OIL],
    ['Check labels for honey, inulin, chicory root, glucose-fructose, onion and garlic powder, and sweeteners ending in "-ol", such as sorbitol, mannitol and xylitol.', 'https://www.albertahealthservices.ca/assets/info/nutrition/if-nfs-low-fodmap-eating-form.pdf'],
    ['Keep fresh fruit to about 3 portions a day, and spread them out.', NICE_PUB],
    ['Hard cheeses like cheddar, mozzarella, parmesan and swiss are low in lactose in normal serves.', 'https://cdhf.ca/en/understanding-the-fodmap-diet/'],
    ['Use chives, the green tops of spring onions or the green parts of leeks for an onion flavor.', 'https://cdhf.ca/en/understanding-the-fodmap-diet/'],
    ['Eating out? Use the menu checker in Tools, and ask for sauces on the side.', ''],
    ['Choose soluble fiber, such as psyllium, over wheat bran, and add it gradually.', 'https://journals.lww.com/ajg/fulltext/10.14309/ajg.0000000000001036~acg-clinical-guideline-management-of-irritable-bowel'],
    ['Have regular meals and take your time eating. Try not to skip meals or leave long gaps.', NICE_PUB],
    ['Limit tea and coffee to 3 cups a day, and drink about 8 cups of fluid, mostly water.', NICE_PUB],
    ['Stress and poor sleep can flare IBS too. Note them in your log.', ''],
    ['Stuck for dinner ideas? Meal ideas in Tools builds a web search that leaves out your trigger foods.', ''],
    ['Portion size matters: many foods are fine in a small serve.', 'https://www.monashfodmap.com/blog/serving-size-and-fodmaps-why-it-so-important/'],
    ['A slip-up isn\'t a failure. Note it and carry on.', '']
  ];

  // Encouragement from public-domain books (quoted from the original texts).
  var QUOTES = [
    { t: 'Begin at the beginning, and go on till you come to the end: then stop.', who: 'the King', src: 'Lewis Carroll, Alice\'s Adventures in Wonderland (1865)', tags: ['start'] },
    { t: 'Why, sometimes I\'ve believed as many as six impossible things before breakfast.', who: 'the Queen', src: 'Lewis Carroll, Through the Looking-Glass (1871)', tags: ['start', 'general'] },
    { t: 'It\'s no use going back to yesterday, because I was a different person then.', who: 'Alice', src: 'Lewis Carroll, Alice\'s Adventures in Wonderland (1865)', tags: ['tough', 'progress'] },
    { t: 'You have plenty of courage, I am sure. All you need is confidence in yourself.', who: 'Oz', src: 'L. Frank Baum, The Wonderful Wizard of Oz (1900)', tags: ['general', 'challenge'] },
    { t: 'Isn\'t it nice to think that tomorrow is a new day with no mistakes in it yet?', who: 'Anne', src: 'L. M. Montgomery, Anne of Green Gables (1908)', tags: ['tough', 'general'] },
    { t: 'I\'m not afraid of storms, for I\'m learning how to sail my ship.', who: 'Amy', src: 'Louisa May Alcott, Little Women (1868)', tags: ['challenge', 'tough', 'progress'] },
    { t: 'Where you tend a rose, my lad, a thistle cannot grow.', who: '', src: 'Frances Hodgson Burnett, The Secret Garden (1911)', tags: ['good', 'general'] },
    { t: 'If you look the right way, you can see that the whole world is a garden.', who: '', src: 'Frances Hodgson Burnett, The Secret Garden (1911)', tags: ['good', 'finish'] },
    { t: 'The moment you doubt whether you can fly, you cease for ever to be able to do it.', who: '', src: 'J. M. Barrie, Peter and Wendy (1911)', tags: ['challenge', 'progress'] }
  ];
  function pickQuote(tag) {
    var list = QUOTES.filter(function (q) { return q.tags.indexOf(tag) !== -1; });
    if (!list.length) list = QUOTES;
    var day = Math.floor(Date.now() / 864e5);
    return list[day % list.length];
  }
  function quoteHTML(q) {
    return '<figure class="quote"><blockquote>“' + esc(q.t) + '”</blockquote><figcaption>' + (q.who ? esc(q.who) + ', ' : '') + '<cite>' + esc(q.src) + '</cite></figcaption></figure>';
  }
  function quoteCard(tag) { return '<div class="card quote-card"><div class="kicker">📖 A little encouragement</div>' + quoteHTML(pickQuote(tag)) + '</div>'; }

  /* ---------- state ---------- */
  function fresh() {
    return { v: 2, phase: 'prep', starts: { prep: today() }, checks: {}, diary: [], ch: {}, active: '', washoutUntil: '', outcome: '', sound: false, badges: {} };
  }
  function load() {
    try {
      var s = JSON.parse(localStorage.getItem(KEY));
      if (s && s.v === 2) return s;
      var old = JSON.parse(localStorage.getItem(OLD_KEY));
      if (old) return migrate(old);
    } catch (e) { /* ignore */ }
    return fresh();
  }
  function migrate(old) {
    var s = fresh();
    s.checks = old.checks || {};
    s.diary = (old.diary || []).map(function (e) { var x = {}; for (var k in e) x[k] = e[k]; return x; });
    Object.keys(old.reintro || {}).forEach(function (g) {
      var r = old.reintro[g];
      if (G[g] && r) s.ch[g] = { status: r.result ? 'done' : 'pending', result: r.result || '', food: r.food || '', days: [], end: r.result ? today() : '' };
    });
    var last = s.diary.length ? s.diary[s.diary.length - 1].phase : '';
    if (ORDER.indexOf(last) > 0) {
      s.phase = last;
      ORDER.forEach(function (p) {
        var first = s.diary.filter(function (e) { return e.phase === p; })[0];
        if (first) s.starts[p] = first.date;
      });
    }
    return s;
  }
  var state = load();
  var storageOk = true, persisted = null, deferredInstall = null;
  function save() {
    try { localStorage.setItem(KEY, JSON.stringify(state)); storageOk = true; } catch (e) { storageOk = false; }
    updateSavedChip();
  }
  // Ask the browser not to clear this site's data automatically (granted
  // silently by most browsers once the site is used or installed).
  function askPersist() {
    if (!navigator.storage || !navigator.storage.persisted) return;
    navigator.storage.persisted().then(function (p) {
      if (p || !state.diary.length) { persisted = p; updateSavedChip(); return; }
      return navigator.storage.persist().then(function (r) { persisted = r; updateSavedChip(); });
    }).catch(function () {});
  }
  function isStandalone() { return (window.matchMedia && matchMedia('(display-mode: standalone)').matches) || navigator.standalone === true; }
  function isIOS() { return /iphone|ipad|ipod/i.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1); }
  function isIOSSafari() { return isIOS() && !/crios|fxios|edgios|opios/i.test(navigator.userAgent); }
  function updateSavedChip() {
    var c = $('savedChip'); if (!c) return;
    c.classList.toggle('warn', !storageOk);
    c.innerHTML = storageOk ? '<span aria-hidden="true">✓</span> Saved <span class="long">on this device</span>' : '<span aria-hidden="true">⚠</span> Not saving';
  }

  function chal(id) { return state.ch[id] || (state.ch[id] = { status: 'pending', result: '', food: '', days: [], end: '' }); }
  function daysIn(p) { return state.starts[p] ? diff(state.starts[p], today()) + 1 : 0; }
  function phaseIdx(p) { return ORDER.indexOf(p || state.phase); }
  function entryFor(date) { return state.diary.filter(function (e) { return e.date === date; })[0]; }
  function avg(e) { var t = 0; ['bloating', 'pain', 'gas', 'urgency'].forEach(function (k) { t += Number(e[k]) || 0; }); return Math.round(t / 4 * 10) / 10; }
  function mean(a) { return a.length ? a.reduce(function (x, y) { return x + y; }, 0) / a.length : 0; }
  // Baseline symptom scores: real baseline logs, or the estimate entered when jumping in.
  function baselineScores(except) {
    var b = state.diary.filter(function (x) { return x !== except && (x.phase === 'baseline' || x.phase === 'prep'); }).map(avg);
    if (!b.length && state.baselineSummary) b = [avg(state.baselineSummary)];
    return b;
  }
  function doneCount() { return GROUPS.filter(function (g) { return chal(g.id).status === 'done'; }).length; }
  function streak() {
    var set = {}; state.diary.forEach(function (e) { set[e.date] = 1; });
    var d = set[today()] ? today() : addDays(today(), -1), n = 0;
    while (set[d]) { n++; d = addDays(d, -1); }
    return n;
  }
  function coins() { var s = {}; state.diary.forEach(function (e) { s[e.date] = 1; }); return Object.keys(s).length; }
  function score() { return coins() * 100 + doneCount() * 1000 + Object.keys(state.badges).length * 500; }
  function scoreColor(v) { return v < 2.5 ? 'var(--good)' : v < 5 ? 'var(--warn)' : 'var(--bad)'; }

  // Shared with features.js: reintroduction results for personalised checks
  window.IBSGuide = {
    reintro: function () {
      var o = {};
      GROUPS.forEach(function (g) { var c = chal(g.id); o[g.id] = { result: c.status === 'done' ? c.result : '', food: c.food }; });
      return o;
    }
  };

  /* ---------- UI helpers ---------- */
  var toastTimer;
  function toast(msg) {
    var t = $('toast'); t.textContent = msg; t.classList.add('show');
    clearTimeout(toastTimer); toastTimer = setTimeout(function () { t.classList.remove('show'); }, 2600);
  }
  function ring(value, max, label, sub) {
    var r = 40, c = 2 * Math.PI * r, f = Math.max(0, Math.min(1, max ? value / max : 0));
    return '<svg class="ring" viewBox="0 0 96 96" aria-hidden="true"><circle class="track" cx="48" cy="48" r="' + r + '"/>' +
      '<circle class="bar" cx="48" cy="48" r="' + r + '" stroke-dasharray="' + c + '" stroke-dashoffset="' + (c * (1 - f)) + '"/>' +
      '<text x="48" y="' + (sub ? 44 : 48) + '">' + esc(label) + '</text>' +
      (sub ? '<text class="ring-sub" x="48" y="64">' + esc(sub) + '</text>' : '') + '</svg>';
  }
  function hero(p, eyebrow, title, text, ringHtml, meter) {
    return '<div class="hero" style="--phase:' + PHASES[p].color + '"><div class="hero-row"><div style="flex:1">' +
      '<div class="eyebrow">' + esc(eyebrow) + '</div><h1>' + esc(title) + '</h1><p>' + esc(text) + '</p></div>' +
      (ringHtml || '') + '</div>' + (meter || '') + '</div>';
  }
  function hud() {
    return '<a class="hud" href="#plan" data-goto="plan" aria-label="Open quest map">' +
      '<span>SCORE<b>' + ('000000' + score()).slice(-6) + '</b></span>' +
      '<span><i class="px-coin"></i>×<b>' + coins() + '</b></span>' +
      '<span>★<b>' + doneCount() + '/8</b></span>' +
      '<span>🔥<b>' + streak() + '</b></span></a><!--nudge-->';
  }
  function logCard() {
    var e = entryFor(today());
    if (e) {
      return '<div class="card task"><div class="kicker">Today</div><h2>You logged today</h2>' +
        '<p class="done-today">✓ Symptom score ' + avg(e) + ' / 10' + (e.diet != null ? ' · Diet score ' + e.diet + ' / 100' : '') + '</p>' +
        '<div class="btn-row"><button type="button" class="btn primary" data-act="review">See today\'s review</button><a class="btn ghost" href="#log" data-goto="log">Update log</a></div></div>';
    }
    return '<div class="card task"><div class="kicker">Today</div><h2>How is your gut today?</h2>' +
      '<p class="muted">It takes about 30 seconds and earns you a coin.</p>' +
      '<div class="btn-row"><a class="btn accent" href="#log" data-goto="log">Log today</a></div></div>';
  }
  function tipCard() {
    var i = (daysIn(state.phase) + state.diary.length) % TIPS.length;
    var t = TIPS[i];
    return '<div class="card tip"><div class="card-head"><h2>💡 Tip</h2></div><p>' + esc(t[0]) + '</p>' +
      (t[1] ? '<p class="read-more"><a href="' + esc(t[1]) + '" target="_blank" rel="noopener">Read more ↗</a></p>' : '') + '</div>';
  }
  function toolCards() {
    return '<div class="features">' +
      feature('🍽️', 'Eating out?', 'Check a menu photo or PDF', 'tools', 'menu') +
      feature('🥘', 'Meal ideas', 'Search the web without your triggers', 'tools', 'meals') + '</div>';
  }
  function feature(icon, title, text, tab, sub) {
    return '<button type="button" class="feature" data-goto="' + tab + '"' + (sub ? ' data-sub="' + sub + '"' : '') + '>' +
      '<span class="f-icon">' + icon + '</span><b>' + esc(title) + '</b><span>' + esc(text) + '</span></button>';
  }

  /* ---------- founder message ---------- */
  function founderHTML() {
    return '<div class="card founder"><div class="founder-head">' + spriteSVG(44) +
      '<div><div class="kicker">A message from Zoltan</div><b>Founder of IBS Domination, the app to help you on your elimination diet</b></div></div>' +
      '<blockquote class="founder-msg">“Let’s go on a journey to get you more control and understanding of your diagnosis and maybe even have some fun along the way. This p**p doesn’t define you! You define it! Ok! Let’s go!!”</blockquote>' +
      '<p class="founder-sig">— Zoltan</p></div>';
  }

  /* ---------- jump in where you are (skip baseline etc.) ---------- */
  function openJumpIn(preselect) {
    function opt(v, icon, title, sub) {
      return '<label class="choice-card"><input type="radio" name="sit" value="' + v + '"><span><b>' + icon + ' ' + esc(title) + '</b><small>' + esc(sub) + '</small></span></label>';
    }
    function sl(name, label) {
      var v = state.baselineSummary ? state.baselineSummary[name] : 5;
      return '<label class="slider"><span>' + label + '</span><input type="range" name="' + name + '" min="0" max="10" value="' + v + '"><output>' + v + '</output></label>';
    }
    var o = document.createElement('div');
    o.className = 'sheet-backdrop jump-sheet';
    o.innerHTML = '<div class="sheet" role="dialog" aria-modal="true" aria-labelledby="jTitle">' +
      '<div class="sheet-head"><h2 id="jTitle">Jump in where you are</h2><button type="button" class="icon-btn" data-close aria-label="Close">✕</button></div>' +
      '<p class="muted">No need to start from scratch. Pick what fits you best.</p>' +
      '<form id="jumpForm"><fieldset class="choices"><legend class="sr">Where are you now?</legend>' +
      opt('baseline', '📝', 'I\'ve already tracked my symptoms', 'I know how my gut behaves on my normal diet.') +
      opt('elimination', '🥗', 'I\'m already on a low FODMAP diet', 'Maybe it\'s been hard to stick to. That\'s OK, this app is here for that.') +
      opt('reintro', '🧪', 'I\'m already reintroducing foods', 'I\'ve tested some food groups already.') +
      '</fieldset>' +
      '<div class="j-sec" data-for="elimination reintro" hidden><label class="field">When did you start the low FODMAP diet?<input type="date" name="elimStart" max="' + today() + '" value="' + addDays(today(), -14) + '"></label></div>' +
      '<div class="j-sec" data-for="baseline elimination reintro" hidden><h3>Your symptoms before any diet changes</h3>' +
      '<p class="muted small">Your best estimate of a typical day, from 0 (none) to 10 (worst). Your check-in compares against this.</p>' +
      sl('bloating', 'Bloating') + sl('pain', 'Pain') + sl('gas', 'Gas') + sl('urgency', 'Urgency') +
      '<div class="card tip"><p class="small"><strong>Why a thorough baseline helps:</strong> about 7 days of real logs gives the most accurate before-and-after picture. If you have notes from before, you can add past days any time in the Log tab by changing the date. An estimate is completely fine to get going.</p></div></div>' +
      '<div class="j-sec" data-for="reintro" hidden><h3>Groups you\'ve already tested</h3><div class="results">' + GROUPS.map(function (g) {
        var c = chal(g.id);
        return '<div class="result-row"><span class="emoji">' + g.emoji + '</span><span class="name">' + esc(g.name) + '</span><select data-jg="' + g.id + '" style="width:auto" aria-label="' + esc(g.name) + ' result">' +
          [['', 'Not tested yet'], ['tolerated', 'Tolerated'], ['partial', 'Small amounts OK'], ['trigger', 'Trigger']].map(function (x) {
            return '<option value="' + x[0] + '"' + (c.status === 'done' && c.result === x[0] ? ' selected' : '') + '>' + x[1] + '</option>';
          }).join('') + '</select></div>';
      }).join('') + '</div></div>' +
      '<div class="j-sec" data-for="baseline elimination reintro" hidden><label class="field">Anything else about your situation? (optional)<textarea name="notes" rows="3" placeholder="e.g. when you were diagnosed, foods you already know bother you, medications, what has been hard">' + esc((state.profile && state.profile.notes) || '') + '</textarea></label>' +
      '<label class="check-line"><input type="checkbox" name="doctor"' + (state.prepDone ? ' checked' : '') + '><span>I\'ve checked with my doctor (IBS diagnosis, celiac test)</span></label></div>' +
      '<div class="btn-row"><button type="submit" class="btn primary" disabled>Continue</button></div></form></div>';
    document.body.appendChild(o);
    var f = o.querySelector('#jumpForm');
    function close() { o.remove(); }
    o.addEventListener('click', function (ev) { if (ev.target === o || ev.target.closest('[data-close]')) close(); });
    Array.prototype.forEach.call(f.querySelectorAll('input[type=range]'), function (r) { r.addEventListener('input', function () { r.nextElementSibling.textContent = r.value; }); });
    f.addEventListener('change', function (ev) {
      if (ev.target.name !== 'sit') return;
      var v = ev.target.value;
      Array.prototype.forEach.call(f.querySelectorAll('.j-sec'), function (sec) { sec.hidden = sec.dataset.for.split(' ').indexOf(v) === -1; });
      f.querySelector('[type=submit]').disabled = false;
      f.querySelector('[type=submit]').textContent = { baseline: 'Save and start elimination', elimination: 'Save and continue my elimination', reintro: 'Save and continue reintroduction' }[v];
    });
    if (preselect) {
      var radio = f.querySelector('input[name=sit][value="' + preselect + '"]');
      if (radio) { radio.checked = true; radio.dispatchEvent(new Event('change', { bubbles: true })); }
    }
    f.addEventListener('submit', function (ev) {
      ev.preventDefault();
      var sit = (f.querySelector('input[name=sit]:checked') || {}).value;
      if (!sit) return;
      state.baselineSummary = { bloating: +f.bloating.value, pain: +f.pain.value, gas: +f.gas.value, urgency: +f.urgency.value, date: today(), source: 'estimate' };
      state.profile = { situation: sit, notes: f.notes.value, date: today() };
      if (f.doctor.checked) { ['prep-dx', 'prep-flags', 'prep-celiac'].forEach(function (k) { state.checks[k] = true; }); state.prepDone = state.prepDone || today(); }
      var start = f.elimStart.value && f.elimStart.value <= today() ? f.elimStart.value : today();
      state.starts.baseline = state.starts.baseline || today();
      if (sit === 'baseline') { state.starts.elimination = today(); }
      else { state.starts.elimination = start; }
      if (sit === 'reintro') {
        state.starts.checkin = today(); state.starts.reintro = today();
        Array.prototype.forEach.call(f.querySelectorAll('[data-jg]'), function (s2) {
          var c = chal(s2.dataset.jg);
          if (s2.value) { c.status = 'done'; c.result = s2.value; c.end = c.end || today(); }
          else if (c.status === 'done') { c.status = 'pending'; c.result = ''; }
        });
      }
      state.phase = sit === 'baseline' ? 'elimination' : sit;
      state.outcome = ''; state.active = state.phase === 'reintro' ? state.active : '';
      save(); close(); render(); go('today');
      celebrate('LEVEL SKIP!', { baseline: 'Baseline saved. On to elimination!', elimination: 'Welcome back to elimination. Let\'s keep it going!', reintro: 'Reintroduction picked up where you left off' }[sit]);
    });
  }

  /* ---------- journey at a glance (welcome + learn) ---------- */
  function journeyHTML() {
    return '<div class="journey">' + ORDER.map(function (p, i) {
      var ph = PHASES[p];
      return '<div class="phase-card" style="--pc:' + ph.color + '"><div class="ph-icon">' + ph.icon + '</div>' +
        '<div class="ph-body"><h3>' + (i + 1) + '. ' + esc(ph.name) + ' <span class="dur">' + esc(ph.dur) + '</span></h3>' +
        '<p class="you"><strong>You:</strong> ' + esc(ph.you) + '</p>' +
        '<p class="app-does"><strong>The app:</strong> ' + ph.app.map(function (a) { return '<span>' + esc(a) + '</span>'; }).join('') + '</p></div></div>';
    }).join('') + '</div>';
  }
  function featuresHTML() {
    return '<div class="features">' +
      feature('🏠', 'Today coach', 'Tells you exactly what to do each day', 'today') +
      feature('➕', 'Quick log', 'Rate symptoms in 30 seconds', 'log') +
      feature('🗺️', 'Quest map', 'Retro map of your progress, coins and badges', 'plan') +
      feature('🧪', 'Challenge coach', 'Food, amount and check-in for each test day', 'plan') +
      feature('🍽️', 'Menu checker', 'Upload a menu photo or PDF to see what fits', 'tools', 'menu') +
      feature('🥘', 'Meal ideas', 'Advanced web search that leaves out your triggers', 'tools', 'meals') +
      feature('📚', 'The guide', 'Step-by-step lessons with medical sources', 'learn') +
      feature('💾', 'Backup and install', 'Add to your home screen; move to a new phone', 'settings') +
      '</div>';
  }

  /* ---------- TODAY ---------- */
  var CHECKS = [
    ['prep-dx', 'A clinician has diagnosed IBS'],
    ['prep-flags', 'I have no red-flag symptoms, or they\'ve been checked (see Learn, step 1)'],
    ['prep-celiac', 'I\'ve been tested for celiac disease while eating gluten'],
    ['prep-rd', 'I\'ve found a dietitian, or talked to my doctor about this plan'],
    ['prep-app', 'I have a reliable food list, such as the Monash FODMAP app']
  ];

  function renderToday() {
    var p = state.phase, html = '';
    if (p === 'prep' && state.prepDone) {
      html += hero('prep', 'World 1 · Get ready', 'Step 1 done ✓', 'You\'ve checked with your doctor. Start your baseline week whenever you\'re ready.', ring(1, 1, '✓', 'done'));
      html += '<div class="card task"><div class="kicker">Next step</div><h2>Start your baseline week</h2>' +
        '<p>For 7 days, eat as you normally do and log how you feel. This gives you something to compare against later.</p>' +
        '<div class="btn-row"><button type="button" class="btn accent" data-act="phase" data-to="baseline">Start my baseline week</button></div>' +
        '<p class="muted small">Confirmed ' + esc(nice(state.prepDone)) + '. <button type="button" class="link" data-act="prepundo">Undo</button></p></div>';
      html += '<details class="card fold"><summary>How the app works</summary>' + journeyHTML() + featuresHTML() + '</details>';
      html += quoteCard('start');
    } else if (p === 'prep') {
      var done = CHECKS.filter(function (c) { return state.checks[c[0]]; }).length;
      html += founderHTML() +
        '<div class="welcome"><h1>Find out which foods trigger your IBS</h1>' +
        '<p>IBS Domination coaches you through the low FODMAP elimination diet, the approach developed at Monash University, tested by universities in the UK, US and Europe, and recommended in gastroenterology guidelines. It takes about 3 months, and the app tells you what to do each day.</p></div>' +
        '<div class="card jump-card"><h2>Already on your way?</h2><p>Maybe you\'ve been tracking your symptoms for a while, or you\'re already on a low FODMAP diet and finding it hard to stick to. You don\'t have to start over. Tell us where you are and we\'ll pick it up from there.</p>' +
        '<div class="btn-row"><button type="button" class="btn ghost" data-act="jumpin">Jump in where I am</button></div></div>' +
        '<div class="card task" id="readyCard"><div class="kicker">Step 1</div><div class="card-head"><h2>Check with your doctor first</h2><span class="muted small">' + done + ' of ' + CHECKS.length + '</span></div>' +
        '<p class="muted small">Other conditions can cause the same symptoms, and celiac tests only work while you\'re still eating gluten. See <a href="#learn" data-goto="learn">Learn, step 1</a> for the red-flag symptoms.</p>' +
        '<div class="checks">' + CHECKS.map(function (c) {
          return '<label><input type="checkbox" data-check="' + c[0] + '"' + (state.checks[c[0]] ? ' checked' : '') + '><span>' + esc(c[1]) + '</span></label>';
        }).join('') + '</div>' +
        '<div class="btn-row"><button type="button" class="btn primary" data-act="prepdone" data-start="1">✓ Done: start my baseline week</button></div>' +
        '<div class="btn-row"><button type="button" class="btn ghost" data-act="prepdone">✓ Done: I\'ll start later</button></div>' +
        '<p class="muted small">Confirming hides this checklist so it doesn\'t come back every day.</p></div>' +
        '<h2 class="section-title">Your journey at a glance</h2>' + journeyHTML() +
        '<h2 class="section-title">How the app helps</h2>' + featuresHTML() + quoteCard('start') +
        '<p class="legal-links"><a href="privacy.html">Privacy Policy</a> · <a href="consumer-health-data.html">Consumer Health Data Privacy Policy</a> · <a href="terms.html">Terms of Use</a></p>';
    } else if (p === 'baseline') {
      var d = daysIn('baseline'), logs = state.diary.filter(function (e) { return e.phase === 'baseline'; }).length;
      html += hero(p, 'World 2 · Baseline week', 'Day ' + Math.min(d, 7) + ' of 7', 'Eat as you normally do. Just log how you feel.', ring(Math.min(d, 7), 7, Math.min(d, 7) + '/7', 'days'));
      html += hud() + logCard();
      if (d >= 7 || logs >= 7) {
        html += '<div class="card good"><h2>Baseline complete 🎉</h2><p>You have ' + logs + ' days logged. Next: the elimination phase.</p>' +
          '<p class="muted small">Before you start, read "Phase 1" in Learn and plan your first week\'s meals.</p>' +
          '<div class="btn-row"><button type="button" class="btn primary" data-act="phase" data-to="elimination">Start elimination</button></div></div>';
      } else {
        html += '<div class="card"><h2>What\'s next</h2><p>In ' + (7 - d) + ' day' + (7 - d === 1 ? '' : 's') + ' you\'ll start the elimination phase. Use this week to read the guide and stock up on low-FODMAP basics.</p>' +
          '<div class="btn-row"><a class="btn ghost" href="#learn" data-goto="learn">Read the guide</a></div></div>' +
          '<div class="card jump-card"><h2>Already tracked your baseline?</h2><p>If you\'ve been keeping track of your symptoms before finding the app, enter your typical levels and move straight on. A full week of logs gives the most accurate comparison, but your best estimate is fine.</p>' +
          '<div class="btn-row"><button type="button" class="btn ghost" data-act="jumpin">Enter my baseline and skip ahead</button></div></div>';
      }
      html += tipCard();
    } else if (p === 'elimination') {
      var de = daysIn('elimination'), wk = Math.ceil(de / 7), dow = ((de - 1) % 7) + 1;
      var meter = '<div class="hero-meter"><div class="track"><div class="fill" style="width:' + Math.min(100, de / 42 * 100) + '%"></div></div>' +
        '<div class="labels"><span>Start</span><span>2 wks</span><span>4 wks</span><span>6 wks</span></div></div>';
      html += hero(p, 'World 3 · Elimination', 'Week ' + wk + ' · Day ' + dow, 'Strict low FODMAP. Aim for 2 to 6 weeks.', ring(Math.min(de, 28), 28, String(de), de === 1 ? 'day' : 'days'), meter);
      html += hud() + logCard();
      if (de >= 14) {
        html += '<div class="card good"><h2>Ready for your check-in?</h2><p>You\'ve done ' + de + ' days. You can check in now, or keep going a little longer. Guidelines say to keep this phase to no more than 4–6 weeks. <a href="https://www.gastrojournal.org/article/S0016-5085(21)04084-1/fulltext" target="_blank" rel="noopener">Read more ↗</a></p>' +
          '<div class="btn-row"><button type="button" class="btn primary" data-act="phase" data-to="checkin">Do my check-in</button></div></div>';
      } else {
        html += '<div class="card"><h2>Keep going 💪</h2><p>' + (14 - de) + ' more day' + (14 - de === 1 ? '' : 's') + ' until your first check-in.</p></div>';
      }
      html += tipCard() + toolCards();
    } else if (p === 'checkin') {
      html += hero(p, 'World 4 · Check-in', 'Did it help?', 'Here\'s how you felt before and during elimination.');
      var base = baselineScores();
      var elim = state.diary.filter(function (e) { return e.phase === 'elimination'; }).slice(-7).map(avg);
      if (base.length && elim.length) {
        var b = mean(base), r = mean(elim), pct = b > 0 ? Math.round((b - r) / b * 100) : 0;
        html += '<div class="card"><h2>Average symptom score</h2><div class="compare">' +
          '<div class="row"><span>Baseline' + (state.baselineSummary && !state.diary.some(function (x) { return x.phase === 'baseline'; }) ? '*' : '') + '</span><span class="bar"><i style="width:' + (b * 10) + '%;background:var(--c-baseline)"></i></span><span>' + b.toFixed(1) + '</span></div>' +
          '<div class="row"><span>Last 7 days</span><span class="bar"><i style="width:' + (r * 10) + '%;background:var(--c-elimination)"></i></span><span>' + r.toFixed(1) + '</span></div></div>' +
          '<p><strong>' + (pct > 0 ? pct + '% better.' : 'No improvement.') + '</strong> ' +
          (pct >= 30 ? 'That suggests FODMAPs play a role in your symptoms.' : pct > 0 ? 'A small change. Think about how you feel overall, too.' : 'FODMAPs may not be your main trigger.') + '</p>' +
          (state.baselineSummary && !state.diary.some(function (x) { return x.phase === 'baseline'; }) ? '<p class="muted small">* From the estimate you entered when you jumped in.</p>' : '') + '</div>';
      } else {
        html += '<div class="card warn"><p>There aren\'t enough baseline and elimination logs to compare. Go by how you feel overall.</p></div>';
      }
      html += '<div class="card"><h2>What now?</h2>' +
        '<div class="btn-row"><button type="button" class="btn primary" data-act="phase" data-to="reintro">It helped. Start reintroduction</button></div>' +
        '<div class="btn-row"><button type="button" class="btn ghost" data-act="extend">Give it 2 more weeks</button><button type="button" class="btn ghost" data-act="nohelp">It didn\'t help</button></div></div>';
    } else if (p === 'reintro') {
      html += renderReintroToday();
    } else if (p === 'personal') {
      html += renderPersonal();
    }
    if (p !== 'prep') {
      var te = entryFor(today());
      html += quoteCard(te && te.diet != null && te.diet < 60 ? 'tough' : { baseline: 'start', elimination: 'general', checkin: 'progress', reintro: 'challenge', personal: 'finish' }[p] || 'general');
    }
    var n = nudges();
    html = html.indexOf('<!--nudge-->') !== -1 ? html.replace('<!--nudge-->', n) : n + html;
    $('todayBody').innerHTML = html;
  }

  /* ---------- keeping data safe: nudges ---------- */
  function nudges() {
    var out = '';
    if (!storageOk) {
      out += '<div class="card bad"><h2>⚠️ This browser isn\'t saving your data</h2><p>It may be a private or incognito window, or storage is turned off. Open the app in a normal window so your logs are kept.</p></div>';
    }
    var t = today();
    var backupDue = state.diary.length >= 3 && !(state.backupSnooze > t) &&
      (state.backupNudge || !state.lastBackup || diff(state.lastBackup, t) >= 7);
    if (backupDue) {
      var why = state.backupNudge ? 'You just finished "' + esc(state.backupNudge) + '", so this is a good moment to save a copy.'
        : state.lastBackup ? 'Your last backup was ' + ago(state.lastBackup) + '.' : 'You haven\'t made a backup yet.';
      out += '<div class="card warn nudge"><h2>💾 Back up your progress</h2><p>' + why + ' A backup is one small file. Save it to iCloud Drive or Google Drive, or email it to yourself, and you can restore it on any device.</p>' +
        '<div class="btn-row"><button type="button" class="btn primary" data-act="backup">Save backup</button><button type="button" class="btn ghost" data-act="snooze-backup">Later</button></div></div>';
    }
    if (!isStandalone() && state.diary.length >= 1 && !state.installNever && !(state.installSnooze > t)) {
      var steps;
      if (isIOS()) {
        steps = isIOSSafari()
          ? '<ol class="steps"><li>Tap the <b>Share</b> button <span class="kbd">⬆︎</span> at the bottom of Safari.</li><li>Scroll down and tap <b>Add to Home Screen</b>.</li><li>Tap <b>Add</b>.</li></ol>'
          : '<p>Open this page in <b>Safari</b>, tap <b>Share</b> <span class="kbd">⬆︎</span>, then <b>Add to Home Screen</b>.</p>';
      } else if (deferredInstall) {
        steps = '<div class="btn-row"><button type="button" class="btn primary" data-act="install">Install app</button></div>';
      } else {
        steps = '<p>Open your browser menu <span class="kbd">⋮</span> and tap <b>Install app</b> or <b>Add to Home screen</b>.</p>';
      }
      out += '<div class="card tip nudge"><h2>📲 Add the app to your home screen</h2>' +
        '<p>It opens full-screen like a normal app' + (isIOS() ? ', and it protects your data: Safari can delete data from websites you haven\'t opened for 7 days, but home-screen apps are exempt. <a href="https://webkit.org/tracking-prevention/" target="_blank" rel="noopener">Read more ↗</a>' : ' and keeps your data safer.') + '</p>' + steps +
        '<div class="btn-row"><button type="button" class="btn ghost small" data-act="snooze-install">Later</button><button type="button" class="btn ghost small" data-act="never-install">Don\'t show again</button></div></div>';
    }
    return out;
  }

  function doBackup() {
    var name = 'ibs-domination-backup-' + today() + '.json', text = JSON.stringify(state, null, 1);
    function done() { state.lastBackup = today(); state.backupNudge = ''; state.backupSnooze = ''; save(); render(); toast('Backup saved 💾'); }
    try {
      var file = new File([text], name, { type: 'application/json' });
      if (navigator.canShare && navigator.canShare({ files: [file] }) && /android|iphone|ipad|ipod/i.test(navigator.userAgent + (isIOS() ? 'ipad' : ''))) {
        navigator.share({ files: [file], title: 'IBS Domination backup' }).then(done).catch(function (e) { if (e && e.name !== 'AbortError') { download(name, text, 'application/json'); done(); } });
        return;
      }
    } catch (e) { /* fall back to a download */ }
    download(name, text, 'application/json'); done();
  }

  function renderReintroToday() {
    var html = '', n = doneCount();
    var c = state.active && chal(state.active), g = state.active && G[state.active];
    if (c && g) {
      var dayN = c.days.length + 1, loggedToday = c.days.length && c.days[c.days.length - 1].date === today();
      if (loggedToday) dayN = c.days.length;
      html += hero('reintro', 'World 5 · Level ' + (GROUPS.indexOf(g) + 1) + ' · ' + g.name, 'Challenge day ' + dayN + ' of 3', 'Keep the rest of your diet low FODMAP.', ring(c.days.length, 3, c.days.length + '/3', 'days'));
      html += hud();
      html += '<div class="card task"><div class="kicker">' + (loggedToday ? 'Done for today' : 'Today\'s challenge') + '</div>' +
        '<div class="days3">' + [0, 1, 2].map(function (i) {
          var dd = c.days[i];
          return '<div class="d ' + (dd ? 'r' + dd.reaction : (i === c.days.length && !loggedToday ? 'now' : '')) + '">Day ' + (i + 1) + (dd ? '<br>' + REACT[dd.reaction].face : '') + '</div>';
        }).join('') + '</div>';
      if (loggedToday) {
        html += '<p class="done-today">✓ Day ' + c.days.length + ' logged.</p><p>Come back tomorrow for day ' + (c.days.length + 1) + ': ' + esc(g.doses[c.days.length]) + ' of ' + esc(c.food || g.food) + '.</p>';
      } else {
        html += '<h2>Eat ' + esc(g.doses[c.days.length]) + ' of ' + esc(c.food || g.food) + '</h2>' +
          '<div class="big-food"><span class="emoji">' + g.emoji + '</span><div><b>' + esc(g.name) + ' test</b><span class="muted small">Have it with a meal, then check in this evening or tomorrow morning.</span></div></div>' +
          '<p><strong>How did you feel afterwards?</strong></p><div class="reactions">' +
          REACT.map(function (r, i) { return '<button type="button" class="react" data-act="react" data-level="' + i + '"><span class="face">' + r.face + '</span>' + r.label + '</button>'; }).join('') + '</div>' +
          '<p class="muted small">Moderate or severe symptoms end the challenge early. That\'s useful information, not a failure.</p>';
      }
      html += '<p class="muted small">Ask your dietitian for the exact amount for each day. Monash updated its recommended serves in 2025. <a href="https://www.monashfodmap.com/blog/practical-tips-fodmap-reintroduction/" target="_blank" rel="noopener">Read more ↗</a></p>' +
        '<div class="btn-row"><button type="button" class="btn ghost small" data-act="cancel">Stop this challenge</button></div></div>';
      html += logCard();
      return html;
    }
    if (state.washoutUntil && diff(today(), state.washoutUntil) > 0) {
      var left = diff(today(), state.washoutUntil);
      html += hero('reintro', 'World 5 · Washout', left + ' day' + (left === 1 ? '' : 's') + ' to go', 'Back to strict low FODMAP so your gut settles before the next test.', ring(3 - left, 3, String(left), 'left'));
      html += hud() + logCard();
      html += '<div class="card"><h2>Feeling back to normal?</h2><p>Wait until your symptoms are back to baseline before the next test. Monash suggests a few days back on strict low FODMAP between challenges.</p>' +
        '<div class="btn-row"><button type="button" class="btn ghost" data-act="endwashout">I\'m back to normal, choose next test</button></div></div>';
      html += resultsCard();
      return html;
    }
    if (n === GROUPS.length) {
      html += hero('reintro', 'World 5 · Complete', 'All 8 groups tested!', 'You now know your triggers. Time to build your long-term diet.', ring(8, 8, '8/8', 'groups'));
      html += hud() + '<div class="card good"><h2>🏁 Reintroduction complete</h2><div class="btn-row"><button type="button" class="btn primary" data-act="phase" data-to="personal">Build my long-term diet</button></div></div>';
      html += resultsCard();
      return html;
    }
    html += hero('reintro', 'World 5 · Reintroduction', n + ' of 8 groups tested', 'Pick your next food challenge.', ring(n, 8, n + '/8', 'tested'));
    html += hud();
    var pending = GROUPS.filter(function (x) { return chal(x.id).status !== 'done'; });
    html += '<div class="card task"><div class="kicker">Next level</div><h2>Choose your next challenge</h2><p class="muted small">Test one group at a time. The suggested order works for most people, but any order is fine.</p><div class="results">' +
      pending.map(function (x, i) {
        return '<div class="result-row"><span class="emoji">' + x.emoji + '</span><span class="name">' + esc(x.name) + '<br><span class="muted small">Test food: ' + esc(x.food) + '</span></span>' +
          '<button type="button" class="btn ' + (i === 0 ? 'accent' : 'ghost') + ' small" data-act="start" data-g="' + x.id + '">' + (i === 0 ? 'Start' : 'Start') + '</button></div>';
      }).join('') + '</div></div>';
    html += resultsCard() + logCard();
    return html;
  }

  function resultsCard() {
    var done = GROUPS.filter(function (g) { return chal(g.id).status === 'done'; });
    if (!done.length) return '';
    return '<div class="card"><h2>Your results so far</h2><div class="results">' + done.map(function (g) {
      var c = chal(g.id);
      return '<div class="result-row"><span class="emoji">' + g.emoji + '</span><span class="name">' + esc(g.name) + '</span>' +
        '<select data-act="setresult" data-g="' + g.id + '" aria-label="Result for ' + esc(g.name) + '" style="width:auto">' +
        Object.keys(RESULT).map(function (k) { return '<option value="' + k + '"' + (c.result === k ? ' selected' : '') + '>' + RESULT[k] + '</option>'; }).join('') +
        '</select></div>';
    }).join('') + '</div><p class="muted small">You can change a result if you think the test was affected by stress, illness or your period.</p></div>';
  }

  function renderPersonal() {
    var html = '';
    if (state.outcome === 'nohelp') {
      html += hero('personal', 'Your next step', 'Talk to your clinician', 'The diet didn\'t clearly help, and that\'s useful to know.');
      html += '<div class="card"><h2>What to do now</h2><ul>' +
        '<li>Go back to your normal, varied diet.</li>' +
        '<li>Ask your doctor or dietitian about other options: soluble fiber such as psyllium, medicines for your IBS type, or gut-directed psychological therapies such as CBT or hypnotherapy.</li>' +
        '<li>Take your symptom log with you. Export it from the Log tab.</li></ul>' +
        '<div class="btn-row"><button type="button" class="btn ghost" data-act="restart">Start the program again</button></div></div>';
      return html;
    }
    var buckets = { tolerated: [], partial: [], trigger: [] };
    GROUPS.forEach(function (g) { var c = chal(g.id); if (c.status === 'done' && buckets[c.result]) buckets[c.result].push(g); });
    html += hero('personal', 'World 6 · Your diet', 'Your food results', 'Eat freely what you tolerate. Limit only your triggers.', ring(buckets.tolerated.length, 8, buckets.tolerated.length + '/8', 'tolerated'));
    html += hud();
    function block(title, cls, list, hint) {
      return '<div class="card ' + cls + '"><h2>' + title + '</h2>' + (list.length ? '<div class="results">' + list.map(function (g) {
        var c = chal(g.id);
        return '<div class="result-row"><span class="emoji">' + g.emoji + '</span><span class="name">' + esc(g.name) + '</span>' +
          (cls !== 'good' ? '<button type="button" class="btn ghost small" data-act="retest" data-g="' + g.id + '">Retest' + (c.end ? ' after ' + nice(addDays(c.end, 90)) : '') + '</button>' : '') + '</div>';
      }).join('') + '</div>' : '<p class="muted">' + hint + '</p>') + '</div>';
    }
    html += block('✅ Eat freely', 'good', buckets.tolerated, 'None yet');
    html += block('⚠️ Small amounts are fine', 'warn', buckets.partial, 'None');
    html += block('⛔ Limit for now', 'bad', buckets.trigger, 'None. Great news!');
    html += '<div class="card tip"><h2>Keep it flexible</h2><p>Tolerance often changes over time, so retest your triggers every few months. The menu checker and meal ideas now use these results.</p></div>' + toolCards();
    return html;
  }

  /* ---------- actions ---------- */
  function setPhase(p, opts) {
    var from = state.phase;
    state.phase = p;
    state.starts[p] = today();
    if (p !== 'personal') state.outcome = '';
    if (phaseIdx(p) > phaseIdx(from) && state.diary.length) { state.backupNudge = PHASES[from].name; state.backupSnooze = ''; }
    save();
    if (phaseIdx(p) > phaseIdx(from) && !(opts && opts.quiet)) celebrate('WORLD CLEAR!', PHASES[from].name + ' complete');
    render();
  }

  document.addEventListener('change', function (e) {
    var t = e.target;
    if (t.dataset.check) { state.checks[t.dataset.check] = t.checked; save(); renderToday(); return; }
    if (t.dataset.act === 'setresult') { chal(t.dataset.g).result = t.value; save(); toast('Result updated'); }
  });

  document.addEventListener('click', function (e) {
    var el = e.target.closest('[data-act],[data-goto]');
    if (!el) return;
    if (el.dataset.goto) {
      e.preventDefault();
      if (el.dataset.goto === 'settings') { openSettings(); return; }
      go(el.dataset.goto);
      if (el.dataset.sub) subtab(el.dataset.sub);
      return;
    }
    var a = el.dataset.act, gid = el.dataset.g;
    if (a === 'phase') {
      if (el.dataset.early && !confirm('Guidelines suggest a full baseline week first, so you can tell later whether the diet helped. Start elimination anyway?')) return;
      setPhase(el.dataset.to);
    } else if (a === 'extend') {
      state.phase = 'elimination'; save(); toast('Two more weeks. You\'ve got this!'); render();
    } else if (a === 'nohelp') {
      state.outcome = 'nohelp'; state.phase = 'personal'; state.starts.personal = today(); save(); render();
    } else if (a === 'restart') {
      if (confirm('Start the program again? Your symptom log is kept.')) { var d = state.diary; state = fresh(); state.diary = d; save(); render(); }
    } else if (a === 'start') {
      if (state.active) return;
      var c = chal(gid); c.status = 'active'; c.days = []; c.result = ''; c.food = c.food || ''; c.start = today();
      state.active = gid; state.washoutUntil = ''; save();
      toast(G[gid].emoji + ' ' + G[gid].name + ' challenge started');
      render(); go('today');
    } else if (a === 'react') {
      react(Number(el.dataset.level));
    } else if (a === 'cancel') {
      if (!confirm('Stop this challenge without a result? You can test this group again later.')) return;
      var cc = chal(state.active); cc.status = 'pending'; cc.days = []; state.active = ''; save(); render();
    } else if (a === 'endwashout') {
      state.washoutUntil = ''; save(); render();
    } else if (a === 'retest') {
      var rc = chal(gid); rc.status = 'pending'; rc.result = ''; rc.days = [];
      state.phase = 'reintro'; state.washoutUntil = ''; save(); toast('Added back to your challenges'); render(); go('today');
    } else if (a === 'level') {
      showLevel(el.dataset.level);
    } else if (a === 'jumpin') {
      openJumpIn(el.dataset.sit);
    } else if (a === 'prepdone') {
      ['prep-dx', 'prep-flags', 'prep-celiac'].forEach(function (k) { state.checks[k] = true; });
      state.prepDone = today(); save();
      if (el.dataset.start) setPhase('baseline'); else { toast('Step 1 done ✓'); render(); }
      window.scrollTo(0, 0);
    } else if (a === 'prepundo') {
      state.prepDone = ''; save(); render();
    } else if (a === 'review') {
      var re = entryFor(today()); if (re) showReview(re, false);
    } else if (a === 'backup') {
      doBackup();
    } else if (a === 'snooze-backup') {
      state.backupSnooze = addDays(today(), 2); state.backupNudge = ''; save(); render(); toast('We\'ll remind you in a couple of days');
    } else if (a === 'snooze-install') {
      state.installSnooze = addDays(today(), 3); save(); render();
    } else if (a === 'never-install') {
      state.installNever = true; save(); render(); toast('You can install any time from Settings');
    } else if (a === 'install') {
      if (deferredInstall) { deferredInstall.prompt(); deferredInstall.userChoice.then(function () { deferredInstall = null; render(); }); }
    }
  });

  function react(level) {
    var c = chal(state.active), g = G[state.active];
    c.days.push({ date: today(), reaction: level });
    var finished = level >= 2 || c.days.length === 3;
    if (finished) {
      if (level >= 2) c.result = c.days.length === 1 ? 'trigger' : 'partial';
      else c.result = level === 0 ? 'tolerated' : 'partial';
      c.status = 'done'; c.end = today();
      state.active = '';
      state.washoutUntil = addDays(today(), 3);
      save();
      celebrate('LEVEL CLEAR!', g.name + ': ' + RESULT[c.result]);
    } else {
      save();
      toast(REACT[level].face + ' Day ' + c.days.length + ' saved. See you tomorrow!');
      blip();
    }
    render();
  }

  /* ---------- diet review after each log ---------- */
  function dietReview(e) {
    var F = window.FODMAP, text = String(e.food || '').trim();
    var ph = e.phase === 'checkin' ? 'elimination' : e.phase, practice = ph === 'prep' || ph === 'baseline';
    var tol = {};
    if (ph === 'reintro' || ph === 'personal') GROUPS.forEach(function (g) { var c = chal(g.id); if (c.status === 'done') tol[g.id] = c.result; });
    var active = e.challenge && G[e.challenge] && ph === 'reintro' ? e.challenge : '';
    if (active) tol[active] = 'tolerated';
    // Check each item separately, so "lactose-free milk" doesn't excuse "creamy pasta".
    var parts = text.split(/[,.;\n]+|\s(?:and|then|plus)\s/i).filter(function (x) { return x.trim(); });
    var flags = [], seen = {};
    parts.forEach(function (part) {
      F.judge(F.scan(part), tol).flags.forEach(function (f) { var k = f.word + '|' + f.group; if (!seen[k]) { seen[k] = 1; flags.push(f); } });
    });
    var good = text ? F.scanGood(text) : [];
    var score = null, worst = {};
    var recognised = flags.length || good.length;
    if (text && recognised) {
      // One penalty per food (its worst flag): high -12, "often contains" -5, portion-dependent -3
      flags.forEach(function (f) {
        var pts = f.severity === 'avoid' ? 12 : f.level === 'often' ? 5 : 3;
        worst[f.word] = Math.max(worst[f.word] || 0, pts);
      });
      score = 100;
      Object.keys(worst).forEach(function (w) { score -= worst[w]; });
      score = Math.max(0, score);
    }
    var well = [], improve = [], st = streak();
    well.push('You logged today' + (st >= 2 ? ': that\'s a ' + st + '-day streak 🔥' : '') + '. Regular logs make your results reliable.');
    if (good.length) well.push('Good low-FODMAP choices: ' + good.slice(0, 6).join(', ') + '.');
    if (text && !flags.length) well.push(practice ? 'Nothing high-FODMAP spotted.' : 'No common high-FODMAP foods spotted. Nicely done!');
    if (active) well.push(G[active].emoji + ' Your ' + G[active].name.toLowerCase() + ' test food doesn\'t count against you. It\'s part of the challenge.');
    if (e.stool === '3' || e.stool === '4') well.push('Stool type ' + e.stool + ' is in the typical range.');
    var base = baselineScores(e);
    if (!practice && (base.length >= 3 || (state.baselineSummary && base.length)) && avg(e) < mean(base) - 0.5) well.push('Symptoms today (' + avg(e) + ') are below your baseline average (' + mean(base).toFixed(1) + ').');
    var byWord = {}, order = [];
    flags.forEach(function (f) { if (!byWord[f.word]) { byWord[f.word] = []; order.push(f.word); } byWord[f.word].push(f); });
    order.forEach(function (w) {
      var fs = byWord[w], f = fs[0], names = fs.map(function (x) { return F.GROUPS[x.group].name; }).filter(function (x, i, arr) { return arr.indexOf(x) === i; }).join(' and ');
      improve.push(F.describe(f, names) + ' Try instead: ' + F.GROUPS[f.group].swap + '.');
    });
    if (!text) improve.push('Add what you ate next time to get a diet score and tips.');
    else if (!recognised) improve.push('The app didn\'t recognise any of the foods you listed, so it can\'t score them. That doesn\'t mean they\'re low FODMAP: check them with the Learn food tables or your dietitian.');
    else if (text.split(/[,.;\n+&]|\band\b|\bwith\b/).filter(function (x) { return x.trim(); }).length < 3) improve.push('Add a bit more detail, like snacks, drinks and sauces, for a more accurate score.');
    if (Number(e.stress) >= 7) improve.push('Stress was high today, and stress alone can flare IBS. A short walk or a few slow breaths may help.');
    if (!practice && avg(e) >= 6 && flags.length) improve.push('Your symptoms were higher today. The foods above may be part of the reason.');
    var nFoods = Object.keys(worst || {}).length;
    var label = score == null ? (text ? 'Foods not recognised' : 'No score yet')
      : practice ? (nFoods ? 'Preview: ' + nFoods + ' food' + (nFoods === 1 ? '' : 's') + ' to swap later' : 'Already low-FODMAP friendly!')
      : score >= 90 ? 'Right on track!' : score >= 70 ? 'Mostly on track' : score >= 50 ? 'A few swaps needed' : 'Tough day. Tomorrow\'s a fresh start';
    return { score: score, label: label, well: well, improve: improve, practice: practice, personal: ph === 'personal' };
  }

  var reviewOpen = false, queued = [];
  function showReview(e, isNew) {
    var r = dietReview(e), col = r.score == null ? 'var(--muted)' : r.score >= 90 ? 'var(--good)' : r.score >= 70 ? 'var(--primary)' : r.score >= 50 ? 'var(--warn)' : 'var(--bad)';
    var rad = 40, c = 2 * Math.PI * rad, f = r.score == null ? 0 : r.score / 100;
    var o = document.createElement('div');
    o.className = 'sheet-backdrop review-sheet';
    o.innerHTML = '<div class="sheet" role="dialog" aria-modal="true" aria-labelledby="reviewTitle">' +
      '<div class="coin-strip"><i class="px-coin"></i> ' + (isNew ? '+1 COIN · ' + coins() + ' TOTAL' : 'UPDATED') + ' · SAVED ON THIS DEVICE</div>' +
      '<div class="review-head"><svg class="ring score-ring" viewBox="0 0 96 96" aria-hidden="true" style="--rc:' + col + '"><circle class="track" cx="48" cy="48" r="' + rad + '"/>' +
      '<circle class="bar" cx="48" cy="48" r="' + rad + '" stroke-dasharray="' + c + '" stroke-dashoffset="' + (c * (1 - f)) + '"/>' +
      '<text x="48" y="44">' + (r.score == null ? '–' : r.score) + '</text><text class="ring-sub" x="48" y="64">' + (r.score == null ? 'no food' : 'of 100') + '</text></svg>' +
      '<div><div class="kicker">' + (r.practice ? 'Practice diet score' : r.personal ? 'Your personal diet score' : 'Today\'s diet score') + '</div><h2 id="reviewTitle">' + esc(r.label) + '</h2>' +
      '<p class="muted small">' + (r.practice ? 'This week you eat as normal, so there\'s nothing to fix yet. This shows what would be flagged once elimination starts.'
        : r.personal ? 'Based on your own reintroduction results.' : 'Based on the foods you listed, compared with the low FODMAP diet.') + '</p></div></div>' +
      '<h3 class="rv-h good">What went well</h3><ul class="rv-list good">' + r.well.map(function (x) { return '<li>' + esc(x) + '</li>'; }).join('') + '</ul>' +
      (r.improve.length ? '<h3 class="rv-h warn">' + (r.practice ? 'Good to know for next week' : 'Where you could improve') + '</h3><ul class="rv-list warn">' + r.improve.map(function (x) { return '<li>' + esc(x) + '</li>'; }).join('') + '</ul>' : '') +
      quoteHTML(pickQuote(r.score != null && r.score < 60 ? 'tough' : r.score >= 90 ? 'good' : 'general')) +
      '<p class="muted small">The score is a guide based on keywords, and portions and recipes vary. Your dietitian has the final say.</p>' +
      '<div class="btn-row"><button type="button" class="btn primary" data-close>Got it</button><button type="button" class="btn ghost" data-close data-edit-log>Edit log</button></div></div>';
    function close(edit) {
      o.remove(); reviewOpen = false;
      if (edit) { go('log'); form.date.value = e.date; fillForm(e.date); }
      var q = queued; queued = []; q.forEach(function (a) { celebrate(a[0], a[1]); });
    }
    o.addEventListener('click', function (ev) {
      if (ev.target === o) return close(false);
      var b = ev.target.closest('[data-close]'); if (b) close(b.hasAttribute('data-edit-log'));
    });
    $('toast').classList.remove('show');
    document.body.appendChild(o); reviewOpen = true;
    var btn = o.querySelector('[data-close]'); if (btn) btn.focus();
  }

  /* ---------- LOG ---------- */
  var form = $('logForm');
  function fillForm(date) {
    var e = entryFor(date) || {};
    ['bloating', 'pain', 'gas', 'urgency', 'stress'].forEach(function (k) {
      form[k].value = e[k] || 0; form[k].nextElementSibling.textContent = form[k].value;
    });
    Array.prototype.forEach.call(form.querySelectorAll('input[name=stool]'), function (r) { r.checked = String(e.stool || '') === r.value; });
    form.food.value = e.food || ''; form.notes.value = e.notes || '';
    form.querySelector('button[type=submit]').textContent = entryFor(date) ? 'Update this day' : 'Save today\'s log';
  }
  form.date.addEventListener('change', function () { fillForm(form.date.value); });
  Array.prototype.forEach.call(form.querySelectorAll('input[type=range]'), function (r) {
    r.addEventListener('input', function () { r.nextElementSibling.textContent = r.value; });
  });
  form.addEventListener('submit', function (ev) {
    ev.preventDefault();
    var date = form.date.value || today(), existing = entryFor(date);
    var e = existing || { id: Date.now(), date: date, phase: state.phase };
    ['bloating', 'pain', 'gas', 'urgency', 'stress'].forEach(function (k) { e[k] = form[k].value; });
    var st = form.querySelector('input[name=stool]:checked'); e.stool = st ? st.value : '';
    e.food = form.food.value; e.notes = form.notes.value;
    if (state.active) e.challenge = state.active;
    e.diet = dietReview(e).score;
    if (!existing) { state.diary.push(e); state.diary.sort(function (a, b) { return a.date < b.date ? -1 : a.date > b.date ? 1 : 0; }); }
    save();
    if (!existing) { coinSound(); askPersist(); }
    render();
    if (!existing && date === today()) go('today');
    showReview(e, !existing);
  });

  function renderLog() {
    var ph = state.phase === 'checkin' ? 'elimination' : state.phase;
    var chip = $('logPhase'); chip.textContent = PHASES[ph].name; chip.style.setProperty('--phase', PHASES[ph].color);
    // chart: last 28 days
    var svg = $('chart'), W = 340, H = 140, L = 22, B = 20, T = 8, n = 28, bw = (W - L) / n;
    var map = {}; state.diary.forEach(function (e) { map[e.date] = e; });
    var h = '';
    [0, 5, 10].forEach(function (v) {
      var y = T + (H - T - B) * (1 - v / 10);
      h += '<line class="grid" x1="' + L + '" x2="' + W + '" y1="' + y + '" y2="' + y + '"/><text x="' + (L - 4) + '" y="' + (y + 3) + '" text-anchor="end">' + v + '</text>';
    });
    for (var i = 0; i < n; i++) {
      var d = addDays(today(), i - n + 1), e = map[d], x = L + i * bw + 1.5;
      if (e) {
        var v = avg(e), bh = Math.max(2, (H - T - B) * v / 10);
        h += '<rect x="' + x + '" y="' + (H - B - bh) + '" width="' + (bw - 3) + '" height="' + bh + '" rx="2" fill="' + PHASES[e.phase === 'checkin' ? 'elimination' : (PHASES[e.phase] ? e.phase : 'baseline')].color + '"><title>' + nice(d) + ': ' + v + '</title></rect>';
      }
      if (i % 7 === 0 || i === n - 1) h += '<text x="' + (x + bw / 2) + '" y="' + (H - 6) + '" text-anchor="middle">' + (i === n - 1 ? 'today' : parse(d).getDate() + '/' + (parse(d).getMonth() + 1)) + '</text>';
    }
    if (!state.diary.length) h += '<text x="' + (W / 2) + '" y="' + (H / 2) + '" text-anchor="middle">Your logs will show up here</text>';
    svg.innerHTML = h;
    var used = {}; state.diary.forEach(function (e) { used[e.phase === 'checkin' ? 'elimination' : e.phase] = 1; });
    $('legend').innerHTML = ORDER.filter(function (p) { return used[p]; }).map(function (p) { return '<span><i style="background:' + PHASES[p].color + '"></i>' + PHASES[p].name + '</span>'; }).join('');
    // history
    $('history').innerHTML = state.diary.length ? state.diary.slice().reverse().slice(0, 60).map(function (e) {
      var v = avg(e);
      return '<li><span class="score" style="background:' + scoreColor(v) + '">' + v + '</span><span class="txt"><b>' + nice(e.date) + '</b> <span class="meta">· ' + esc((PHASES[e.phase] || PHASES.baseline).name) +
        (e.challenge && G[e.challenge] ? ' · ' + G[e.challenge].emoji : '') + (e.stool ? ' · stool ' + esc(e.stool) : '') + (e.diet != null ? ' · diet ' + e.diet : '') + '</span>' +
        (e.food ? '<div class="food">' + esc(e.food) + '</div>' : '') + '</span>' +
        '<span><button type="button" class="link" data-edit="' + e.date + '" aria-label="Edit">✎</button><button type="button" class="link" data-del="' + e.id + '" aria-label="Delete">✕</button></span></li>';
    }).join('') : '<li class="muted">No logs yet.</li>';
  }
  $('history').addEventListener('click', function (e) {
    var del = e.target.getAttribute('data-del'), ed = e.target.getAttribute('data-edit');
    if (ed) { form.date.value = ed; fillForm(ed); window.scrollTo({ top: 0, behavior: 'smooth' }); }
    if (del && confirm('Delete this log?')) {
      state.diary = state.diary.filter(function (x) { return String(x.id) !== del; });
      save(); renderLog(); renderToday();
    }
  });
  $('exportCsv').addEventListener('click', function () {
    var cols = ['date', 'phase', 'challenge', 'bloating', 'pain', 'gas', 'urgency', 'stool', 'stress', 'food', 'notes'];
    var lines = [cols.join(',') + ',average'].concat(state.diary.map(function (e) {
      return cols.map(function (c) { return '"' + String(e[c] == null ? '' : e[c]).replace(/"/g, '""') + '"'; }).join(',') + ',' + avg(e);
    }));
    download('ibs-symptom-log.csv', lines.join('\n'), 'text/csv');
  });
  function download(name, text, type) {
    var a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([text], { type: type }));
    a.download = name; document.body.appendChild(a); a.click(); a.remove();
  }

  /* ---------- QUEST MAP (retro, gamified) ---------- */
  // Original pixel buddy: a friendly gut-shaped blob. G body, W eye white, K pupil, P cheek, D feet.
  var SPRITE = [
    '...GGGGGG...',
    '..GGGGGGGG..',
    '.GGGGGGGGGG.',
    '.GWWGGGGWWG.',
    'GGWKGGGGWKGG',
    'GGGGGGGGGGGG',
    'GPGGGKKGGGPG',
    'GGGGGGGGGGGG',
    '.GGGGGGGGGG.',
    '..GGGGGGGG..',
    '..DD....DD..',
    '.DDD....DDD.'
  ];
  var PAL = { G: '#4ade80', W: '#ffffff', K: '#1b1b2f', P: '#f9a8d4', D: '#166534' };
  function spriteSVG(size) {
    var r = '';
    SPRITE.forEach(function (row, y) {
      for (var x = 0; x < row.length; x++) if (PAL[row[x]]) r += '<rect x="' + x + '" y="' + y + '" width="1.02" height="1.02" fill="' + PAL[row[x]] + '"/>';
    });
    return '<svg class="buddy" viewBox="0 0 12 12" width="' + size + '" height="' + size + '" shape-rendering="crispEdges" aria-hidden="true">' + r + '</svg>';
  }

  function levels() {
    var p = phaseIdx(), worlds = [];
    function st(i) { return p > i ? 'done' : p === i ? 'current' : 'locked'; }
    var prepOk = p === 0 && state.prepDone;
    worlds.push({ n: 1, name: 'GET READY', phase: 'prep', levels: [{ id: 'prep', label: '1-1', icon: '🩺', state: prepOk ? 'done' : st(0), title: 'Get ready', text: PHASES.prep.you }] });
    var bl = state.diary.filter(function (e) { return e.phase === 'baseline'; }).length;
    worlds.push({ n: 2, name: 'BASELINE', phase: 'baseline', levels: [{ id: 'baseline', label: '2-1', icon: '📝', state: prepOk ? 'current' : st(1), coins: Math.min(7, bl), title: 'Baseline week', text: 'Log 7 days of normal eating. ' + Math.min(7, bl) + ' of 7 coins collected.' }] });
    var de = p === 2 ? daysIn('elimination') : p > 2 && state.starts.elimination ? diff(state.starts.elimination, state.starts.checkin || today()) : 0, el = [];
    for (var w = 1; w <= 6; w++) {
      var s = p < 2 ? 'locked' : de >= w * 7 ? 'done' : (p === 2 && de > (w - 1) * 7) ? 'current' : p > 2 ? 'skipped' : 'locked';
      el.push({ id: 'elim' + w, label: '3-' + w, icon: w <= 2 ? '🥗' : '✨', state: s, bonus: w > 2, title: 'Elimination week ' + w + (w > 2 ? ' (bonus)' : ''), text: w <= 2 ? 'Strict low FODMAP. Two weeks is the minimum before your check-in.' : 'Optional extra week. Stop by week 6 either way.' });
    }
    worlds.push({ n: 3, name: 'ELIMINATION', phase: 'elimination', levels: el });
    worlds.push({ n: 4, name: 'CHECK-IN', phase: 'checkin', levels: [{ id: 'checkin', label: 'BOSS', icon: '📊', state: st(3), boss: true, title: 'The check-in', text: 'Compare how you felt before and during elimination. If it helped, World 5 opens.' }] });
    worlds.push({ n: 5, name: 'REINTRODUCTION', phase: 'reintro', levels: GROUPS.map(function (g, i) {
      var c = chal(g.id), s = c.status === 'done' ? 'done' : state.active === g.id ? 'current' : p >= 4 ? 'open' : 'locked';
      return { id: 'g:' + g.id, label: '5-' + (i + 1), icon: g.emoji, state: s, result: c.status === 'done' ? c.result : '', title: g.name + ' challenge', text: '3 days of ' + g.food + ': a moderate serve, then a larger serve, then your usual amount.', group: g.id };
    }) });
    worlds.push({ n: 6, name: 'YOUR DIET', phase: 'personal', levels: [{ id: 'personal', label: 'GOAL', icon: '🏁', state: st(5), title: 'Your long-term diet', text: PHASES.personal.you }] });
    return worlds;
  }

  var BADGES = [
    { id: 'first-log', icon: '🪙', name: 'First coin', test: function () { return coins() >= 1; } },
    { id: 'streak7', icon: '🔥', name: '7-day streak', test: function () { return streak() >= 7; } },
    { id: 'baseline', icon: '📝', name: 'Baseline done', test: function () { return phaseIdx() > 1; } },
    { id: 'elim14', icon: '💪', name: '2 weeks strong', test: function () { return phaseIdx() > 2 || daysIn('elimination') >= 14 && state.phase === 'elimination'; } },
    { id: 'first-clear', icon: '⭐', name: 'First challenge', test: function () { return doneCount() >= 1; } },
    { id: 'coins30', icon: '💰', name: '30 coins', test: function () { return coins() >= 30; } },
    { id: 'all8', icon: '🏆', name: 'All 8 tested', test: function () { return doneCount() === 8; } },
    { id: 'goal', icon: '👑', name: 'Your diet', test: function () { return state.phase === 'personal' && state.outcome !== 'nohelp'; } }
  ];
  function checkBadges(silent) {
    var fresh = [];
    BADGES.forEach(function (b) { if (!state.badges[b.id] && b.test()) { state.badges[b.id] = today(); fresh.push(b); } });
    if (fresh.length) { save(); if (!silent) setTimeout(function () { celebrate('BADGE GET!', fresh[0].icon + ' ' + fresh[0].name); }, 900); }
  }

  function renderPlan() {
    var worlds = levels(), curWorld = 0;
    worlds.forEach(function (w) { if (w.levels.some(function (l) { return l.state === 'current'; })) curWorld = w.n; });
    var html = '<div class="retro">' +
      '<div class="px-hud"><span>SCORE<br><b>' + ('000000' + score()).slice(-6) + '</b></span><span><i class="px-coin"></i>×' + coins() + '</span>' +
      '<span>STARS<br><b>' + doneCount() + '/8</b></span><span>WORLD<br><b>' + (curWorld || worlds.filter(function (w) { return phaseIdx(w.phase) <= phaseIdx(); }).length) + '</b></span></div>';
    worlds.forEach(function (w) {
      var locked = w.levels.every(function (l) { return l.state === 'locked'; });
      html += '<section class="world' + (locked ? ' locked' : '') + '"><h2 class="px-title">WORLD ' + w.n + '<small>' + w.name + '</small></h2><div class="level-row">';
      w.levels.forEach(function (l) {
        var star = l.result ? '<span class="px-star ' + l.result + '">' + (l.result === 'tolerated' ? '★' : l.result === 'partial' ? '½' : '✕') + '</span>' : l.state === 'done' ? '<span class="px-star tolerated">★</span>' : '';
        html += '<button type="button" class="tile ' + l.state + (l.bonus ? ' bonus' : '') + (l.boss ? ' boss' : '') + '" data-act="level" data-level="' + l.id + '" aria-label="' + esc(l.title + ', ' + l.state) + '">' +
          (l.state === 'current' ? '<span class="buddy-wrap">' + spriteSVG(34) + '</span>' : '') +
          '<span class="t-icon">' + (l.state === 'locked' ? '🔒' : l.icon) + '</span><span class="t-label">' + l.label + '</span>' + star +
          (l.coins != null ? '<span class="t-coins">' + new Array(8).join('.').split('').map(function (_, i) { return '<i class="px-coin' + (i < l.coins ? '' : ' off') + '"></i>'; }).join('') + '</span>' : '') +
          '</button>';
      });
      html += '</div><div class="ground"></div>';
      if (w.n === 2 && phaseIdx() <= 1) html += '<button type="button" class="px-skip" data-act="jumpin" data-sit="baseline">ALREADY TRACKED YOUR SYMPTOMS? SKIP ▶</button>';
      html += '</section>';
    });
    html += '<div class="px-box" id="levelInfo" aria-live="polite"><p>TAP A LEVEL TO SEE WHAT\'S INSIDE.</p></div>';
    html += '<h2 class="px-title">BADGES</h2><div class="badges">' + BADGES.map(function (b) {
      var got = state.badges[b.id];
      return '<div class="px-badge' + (got ? ' got' : '') + '"><span>' + (got ? b.icon : '?') + '</span><small>' + (got ? esc(b.name) : '???') + '</small></div>';
    }).join('') + '</div>';
    html += '<p class="px-foot">1 COIN = 1 DAY LOGGED · ★ = TOLERATED · ½ = SMALL AMOUNTS OK · ✕ = TRIGGER (STILL A WIN: NOW YOU KNOW!)</p></div>';
    $('path').innerHTML = html;
  }

  function showLevel(id) {
    var l; levels().forEach(function (w) { w.levels.forEach(function (x) { if (x.id === id) l = x; }); });
    if (!l) return;
    var status = { done: 'CLEARED', current: 'YOU ARE HERE', locked: 'LOCKED', open: 'READY', skipped: 'SKIPPED (OPTIONAL)' }[l.state];
    var action = '';
    if (l.group && l.state === 'open' && state.phase === 'reintro' && !state.active) action = '<button type="button" class="px-btn" data-act="start" data-g="' + l.group + '">START LEVEL ▶</button>';
    if (l.state === 'current') action = '<button type="button" class="px-btn" data-goto="today">GO TO TODAY ▶</button>';
    if (l.id === 'baseline' && phaseIdx() <= 1) action += '<button type="button" class="px-btn alt" data-act="jumpin" data-sit="baseline">SKIP: ENTER MY BASELINE ▶</button>' +
      '<p>Already tracked how your gut behaves on your normal diet? Enter your typical symptom levels and go straight to elimination. A full week of logs gives the most accurate comparison, but your best estimate is fine.</p>';
    $('levelInfo').innerHTML = '<p class="px-small">' + esc(l.label) + ' · ' + status + (l.result ? ' · ' + esc(RESULT[l.result]).toUpperCase() : '') + '</p>' +
      '<h3>' + l.icon + ' ' + esc(l.title) + '</h3><p>' + esc(l.text) + '</p>' + action;
    blip();
  }

  /* ---------- celebrations and 8-bit sound ---------- */
  function celebrate(title, sub) {
    if (reviewOpen) { queued.push([title, sub]); return; }
    var o = document.createElement('div');
    o.className = 'celebrate'; o.setAttribute('role', 'status');
    var coinsHtml = '';
    for (var i = 0; i < 14; i++) coinsHtml += '<i class="px-coin fall" style="left:' + (Math.random() * 100) + '%;animation-delay:' + (Math.random() * .6) + 's"></i>';
    o.innerHTML = coinsHtml + '<div class="c-box">' + spriteSVG(64) + '<div class="c-title">' + esc(title) + '</div><div class="c-sub">' + esc(sub || '') + '</div><div class="c-hint">TAP TO CONTINUE</div></div>';
    o.addEventListener('click', function () { o.remove(); });
    document.body.appendChild(o);
    fanfare();
    setTimeout(function () { if (o.parentNode) o.remove(); }, 3500);
  }
  var actx = null;
  function tone(freq, start, dur, type) {
    if (!state.sound) return;
    try {
      actx = actx || new (window.AudioContext || window.webkitAudioContext)();
      var o = actx.createOscillator(), g = actx.createGain(), t = actx.currentTime + start;
      o.type = type || 'square'; o.frequency.setValueAtTime(freq, t);
      g.gain.setValueAtTime(.06, t); g.gain.exponentialRampToValueAtTime(.001, t + dur);
      o.connect(g); g.connect(actx.destination); o.start(t); o.stop(t + dur);
    } catch (e) { /* audio unavailable */ }
  }
  function blip() { tone(660, 0, .06); }
  function coinSound() { tone(988, 0, .08); tone(1319, .08, .25); }
  function fanfare() { [523, 659, 784, 1047].forEach(function (f, i) { tone(f, i * .1, .18); }); tone(1047, .45, .4, 'triangle'); }

  /* ---------- navigation ---------- */
  var TABS = ['today', 'plan', 'log', 'tools', 'learn'];
  function go(tab) {
    if (TABS.indexOf(tab) === -1) tab = 'today';
    TABS.forEach(function (t) { $('view-' + t).hidden = t !== tab; });
    Array.prototype.forEach.call(document.querySelectorAll('.tabbar a'), function (a) {
      if (a.dataset.tab === tab) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current');
    });
    if (location.hash !== '#' + tab) history.replaceState(null, '', '#' + tab);
    if (tab === 'log') { if (!form.date.value) form.date.value = today(); fillForm(form.date.value); }
    window.scrollTo(0, 0);
  }
  Array.prototype.forEach.call(document.querySelectorAll('.tabbar a'), function (a) {
    a.addEventListener('click', function (e) { e.preventDefault(); go(a.dataset.tab); });
  });
  window.addEventListener('hashchange', function () { var h = location.hash.slice(1); if (TABS.indexOf(h) !== -1) go(h); });

  function subtab(name) {
    Array.prototype.forEach.call(document.querySelectorAll('[data-subtab]'), function (b) {
      var on = b.dataset.subtab === name; b.classList.toggle('active', on); b.setAttribute('aria-selected', on);
    });
    $('menu').hidden = name !== 'menu'; $('meals').hidden = name !== 'meals';
  }
  Array.prototype.forEach.call(document.querySelectorAll('[data-subtab]'), function (b) {
    b.addEventListener('click', function () { subtab(b.dataset.subtab); });
  });

  /* ---------- settings, backup, install ---------- */
  function openSettings() {
    $('settings').hidden = false; $('soundToggle').checked = !!state.sound;
    var rows = [
      ['Where your data lives', storageOk ? 'In this browser, on this device only' : 'Not saving: open the app in a normal browser window'],
      ['Protected from automatic clean-up', persisted === true ? 'Yes' : isStandalone() ? 'Yes (installed app)' : persisted === false ? 'Not yet. Installing the app helps.' : 'Unknown in this browser'],
      ['Installed as an app', isStandalone() ? 'Yes' : 'No'],
      ['Last backup', state.lastBackup ? nice(state.lastBackup) + ' (' + ago(state.lastBackup) + ')' : 'Never'],
      ['Logs saved', state.diary.length + (state.diary.length === 1 ? ' day' : ' days')]
    ];
    $('dataStatus').innerHTML = rows.map(function (r) { return '<div><dt>' + esc(r[0]) + '</dt><dd>' + esc(r[1]) + '</dd></div>'; }).join('');
  }
  $('savedChip').addEventListener('click', openSettings);
  $('openSettings').addEventListener('click', openSettings);
  $('settings').addEventListener('click', function (e) { if (e.target === this || e.target.hasAttribute('data-close')) this.hidden = true; });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') $('settings').hidden = true; });
  $('soundToggle').addEventListener('change', function () { state.sound = this.checked; save(); if (state.sound) coinSound(); });
  $('backupBtn').addEventListener('click', function () { doBackup(); openSettings(); });
  $('restoreFile').addEventListener('change', function () {
    var f = this.files[0]; if (!f) return;
    var input = this;
    f.text().then(function (t) {
      var s = JSON.parse(t);
      if (!s || s.v !== 2 || !Array.isArray(s.diary)) throw new Error('bad');
      if (!confirm('Replace everything on this device with this backup (' + s.diary.length + ' logs)?')) return;
      state = s; save(); render(); toast('Backup restored'); $('settings').hidden = true;
    }).catch(function () { toast('That file isn\'t a valid backup.'); }).then(function () { input.value = ''; });
  });
  $('backPhase').addEventListener('click', function () {
    var i = phaseIdx();
    if (i <= 0) { toast('You\'re at the start already.'); return; }
    var prev = ORDER[i - 1];
    if (!confirm('Go back to "' + PHASES[prev].name + '"? Your logs and results are kept.')) return;
    state.phase = prev; state.outcome = ''; save(); render(); $('settings').hidden = true; go('today');
  });
  $('resetBtn').addEventListener('click', function () {
    if (!confirm('Erase all your logs and progress on this device? Download a backup first if you might want them.')) return;
    state = fresh(); save(); render(); $('settings').hidden = true; go('today');
  });
  window.addEventListener('beforeinstallprompt', function (e) { e.preventDefault(); deferredInstall = e; $('installBtn').hidden = false; renderToday(); });
  window.addEventListener('appinstalled', function () { deferredInstall = null; $('installBtn').hidden = true; toast('Installed! Open it from your home screen.'); renderToday(); });
  $('installBtn').addEventListener('click', function () {
    if (!deferredInstall) return;
    deferredInstall.prompt();
    deferredInstall.userChoice.then(function () { deferredInstall = null; $('installBtn').hidden = true; });
  });
  if ('serviceWorker' in navigator && /^https?:$/.test(location.protocol)) {
    window.addEventListener('load', function () { navigator.serviceWorker.register('sw.js').catch(function () {}); });
  }

  /* ---------- render ---------- */
  function render() {
    if (!PHASES[state.phase]) state.phase = 'prep';
    checkBadges();
    renderToday(); renderPlan(); renderLog();
  }
  $('learnFounder').innerHTML = founderHTML();
  $('jumpBtn').addEventListener('click', function () { $('settings').hidden = true; openJumpIn(); });
  $('learnJourney').innerHTML = journeyHTML() + '<h2 class="section-title">Everything the app can do</h2>' + featuresHTML();
  checkBadges(true);
  save();
  askPersist();
  render();
  form.date.value = today();
  go(location.hash.slice(1) || 'today');
})();
