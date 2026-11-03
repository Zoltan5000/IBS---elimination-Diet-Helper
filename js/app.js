(function () {
  'use strict';

  /* ---------- storage (fails safely in private mode) ---------- */
  var KEY = 'ibs-guide-v1';
  function load() {
    try { return JSON.parse(localStorage.getItem(KEY)) || {}; } catch (e) { return {}; }
  }
  var state = load();
  state.diary = state.diary || [];
  state.checks = state.checks || {};
  state.reintro = state.reintro || {};
  state.step = state.step || 1;
  function save() {
    try { localStorage.setItem(KEY, JSON.stringify(state)); } catch (e) { /* ignore */ }
  }

  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  /* ---------- stepper ---------- */
  var steps = Array.prototype.slice.call(document.querySelectorAll('.step'));
  var nav = document.getElementById('stepNav');
  var prevBtn = document.getElementById('prevBtn');
  var nextBtn = document.getElementById('nextBtn');

  steps.forEach(function (s, i) {
    var li = document.createElement('li');
    var b = document.createElement('button');
    b.type = 'button';
    b.textContent = (i + 1) + '. ' + s.dataset.title;
    b.addEventListener('click', function () { go(i + 1, true); });
    li.appendChild(b);
    nav.appendChild(li);
  });

  function go(n, scroll) {
    n = Math.max(1, Math.min(steps.length, n));
    state.step = n;
    steps.forEach(function (s, i) { s.classList.toggle('active', i + 1 === n); });
    Array.prototype.forEach.call(nav.querySelectorAll('button'), function (b, i) {
      if (i + 1 === n) b.setAttribute('aria-current', 'step'); else b.removeAttribute('aria-current');
      b.classList.toggle('done', i + 1 < n);
    });
    document.getElementById('progressBar').style.width = (n / steps.length * 100) + '%';
    prevBtn.disabled = n === 1;
    nextBtn.textContent = n === steps.length ? 'Go to tools ↓' : 'Next step →';
    save();
    if (scroll) document.getElementById('main').scrollIntoView({ behavior: 'smooth' });
  }
  prevBtn.addEventListener('click', function () { go(state.step - 1, true); });
  nextBtn.addEventListener('click', function () {
    if (state.step === steps.length) document.getElementById('diary').scrollIntoView({ behavior: 'smooth' });
    else go(state.step + 1, true);
  });

  /* ---------- checklist ---------- */
  Array.prototype.forEach.call(document.querySelectorAll('.checklist input'), function (cb) {
    cb.checked = !!state.checks[cb.dataset.key];
    cb.addEventListener('change', function () { state.checks[cb.dataset.key] = cb.checked; save(); });
  });

  /* ---------- diary ---------- */
  var form = document.getElementById('diaryForm');
  var SYM = ['bloating', 'pain', 'gas', 'urgency'];
  var PHASE_LABEL = { baseline: 'Baseline', elimination: 'Elimination', reintro: 'Reintroduction', personal: 'Personalised' };

  form.date.value = new Date().toISOString().slice(0, 10);
  Array.prototype.forEach.call(form.querySelectorAll('input[type=range]'), function (r) {
    var out = r.previousElementSibling;
    r.addEventListener('input', function () { out.textContent = r.value; });
  });
  // Default the phase to the last one used
  if (state.diary.length) form.phase.value = state.diary[state.diary.length - 1].phase;

  function avg(e) {
    var t = 0; SYM.forEach(function (k) { t += Number(e[k]) || 0; });
    return Math.round(t / SYM.length * 10) / 10;
  }

  form.addEventListener('submit', function (ev) {
    ev.preventDefault();
    var e = { id: Date.now() };
    ['date', 'phase', 'stool', 'stress', 'food', 'notes'].concat(SYM).forEach(function (k) { e[k] = form[k].value; });
    state.diary.push(e);
    state.diary.sort(function (a, b) { return a.date < b.date ? -1 : a.date > b.date ? 1 : a.id - b.id; });
    save();
    form.food.value = ''; form.notes.value = '';
    renderDiary();
  });

  function renderDiary() {
    var tb = document.querySelector('#diaryTable tbody');
    if (!state.diary.length) {
      tb.innerHTML = '<tr><td colspan="6" class="small">No entries yet.</td></tr>';
    } else {
      tb.innerHTML = state.diary.slice().reverse().map(function (e) {
        return '<tr><td>' + esc(e.date) + '</td><td>' + esc(PHASE_LABEL[e.phase]) + '</td><td>' + avg(e) +
          '</td><td>' + esc(e.stool || '–') + '</td><td>' + esc(e.food) +
          '</td><td><button type="button" class="link" data-del="' + e.id + '" aria-label="Delete entry">✕</button></td></tr>';
      }).join('');
    }
    renderChart();
    renderCheckin();
  }

  document.querySelector('#diaryTable tbody').addEventListener('click', function (ev) {
    var id = ev.target.getAttribute('data-del');
    if (!id || !confirm('Delete this entry?')) return;
    state.diary = state.diary.filter(function (e) { return String(e.id) !== id; });
    save(); renderDiary();
  });

  function renderChart() {
    var svg = document.getElementById('chart');
    var W = 600, H = 200, L = 30, R = 10, T = 10, B = 24;
    var pts = state.diary;
    var html = '';
    for (var y = 0; y <= 10; y += 5) {
      var yy = T + (H - T - B) * (1 - y / 10);
      html += '<line class="grid" x1="' + L + '" x2="' + (W - R) + '" y1="' + yy + '" y2="' + yy + '"/>' +
        '<text x="' + (L - 6) + '" y="' + (yy + 4) + '" text-anchor="end">' + y + '</text>';
    }
    if (pts.length) {
      var n = pts.length;
      var xs = function (i) { return n === 1 ? (L + W - R) / 2 : L + (W - L - R) * i / (n - 1); };
      var ys = function (v) { return T + (H - T - B) * (1 - v / 10); };
      html += '<polyline class="line" points="' + pts.map(function (e, i) { return xs(i) + ',' + ys(avg(e)); }).join(' ') + '"/>';
      pts.forEach(function (e, i) {
        html += '<circle class="pt-' + esc(e.phase) + '" cx="' + xs(i) + '" cy="' + ys(avg(e)) + '" r="4"><title>' +
          esc(e.date) + ': ' + avg(e) + ' (' + esc(PHASE_LABEL[e.phase]) + ')</title></circle>';
      });
      html += '<text x="' + L + '" y="' + (H - 6) + '">' + esc(pts[0].date) + '</text>' +
        '<text x="' + (W - R) + '" y="' + (H - 6) + '" text-anchor="end">' + esc(pts[n - 1].date) + '</text>';
    } else {
      html += '<text x="' + (W / 2) + '" y="' + (H / 2) + '" text-anchor="middle">Your entries will appear here</text>';
    }
    svg.innerHTML = html;
  }

  function mean(arr) { return arr.reduce(function (a, b) { return a + b; }, 0) / arr.length; }

  function renderCheckin() {
    var el = document.getElementById('checkinResult');
    var base = state.diary.filter(function (e) { return e.phase === 'baseline'; }).map(avg);
    var elim = state.diary.filter(function (e) { return e.phase === 'elimination'; });
    // Use the most recent 7 elimination days, when symptoms have had time to settle
    var recent = elim.slice(-7).map(avg);
    if (!base.length || !recent.length) {
      el.textContent = 'Add Baseline and Phase 1 entries to the diary to see a comparison here.';
      return;
    }
    var b = mean(base), r = mean(recent);
    var pct = b > 0 ? Math.round((b - r) / b * 100) : 0;
    var msg = 'Baseline average: ' + b.toFixed(1) + ' / 10. Recent Phase 1 average (last ' + recent.length +
      ' entries): ' + r.toFixed(1) + ' / 10. ';
    if (pct >= 30) msg += 'That\'s about a ' + pct + '% improvement, which suggests FODMAPs are playing a role. You\'re likely ready for Phase 2.';
    else if (pct > 0) msg += 'That\'s a ' + pct + '% improvement. Keep going if you\'ve been on Phase 1 for less than 4 weeks; if it\'s been 4–6 weeks, discuss next steps with your clinician.';
    else msg += 'No improvement yet. If you\'ve followed Phase 1 closely for 4–6 weeks, talk to your clinician about other options.';
    if (elim.length < 14) msg += ' (You have ' + elim.length + ' Phase 1 entries. Two weeks or more gives a fairer comparison.)';
    el.textContent = msg;
  }

  document.getElementById('exportCsv').addEventListener('click', function () {
    var cols = ['date', 'phase', 'bloating', 'pain', 'gas', 'urgency', 'stool', 'stress', 'food', 'notes'];
    var lines = [cols.join(',') + ',average'].concat(state.diary.map(function (e) {
      return cols.map(function (c) { return '"' + String(e[c] == null ? '' : e[c]).replace(/"/g, '""') + '"'; }).join(',') + ',' + avg(e);
    }));
    var blob = new Blob([lines.join('\n')], { type: 'text/csv' });
    var a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'ibs-symptom-diary.csv';
    document.body.appendChild(a); a.click(); a.remove();
  });
  document.getElementById('printBtn').addEventListener('click', function () { window.print(); });

  /* ---------- reintroduction tracker ---------- */
  var GROUPS = [
    { id: 'fructose', name: 'Fructose', eg: 'e.g. mango or honey' },
    { id: 'lactose', name: 'Lactose', eg: 'e.g. cow\'s milk or yogurt' },
    { id: 'fructan-grain', name: 'Fructans: grains', eg: 'e.g. wheat bread' },
    { id: 'fructan-garlic', name: 'Fructans: garlic', eg: 'e.g. garlic' },
    { id: 'fructan-onion', name: 'Fructans: onion', eg: 'e.g. onion' },
    { id: 'gos', name: 'GOS', eg: 'e.g. canned lentils' },
    { id: 'sorbitol', name: 'Sorbitol', eg: 'a sorbitol food from the app' },
    { id: 'mannitol', name: 'Mannitol', eg: 'e.g. button mushrooms' }
  ];
  var RESULT = {
    '': 'Not tested',
    tolerated: 'Tolerated',
    partial: 'Tolerated in small amounts',
    trigger: 'Trigger'
  };
  var list = document.getElementById('reintroList');

  function renderReintro() {
    list.innerHTML = GROUPS.map(function (g) {
      var d = state.reintro[g.id] || {};
      var dayFields = [1, 2, 3].map(function (n) {
        return '<label>Day ' + n + ' amount and symptoms<input data-g="' + g.id + '" data-f="d' + n + '" value="' +
          esc(d['d' + n]) + '" placeholder="e.g. ½ cup, mild bloating"></label>';
      }).join('');
      var opts = Object.keys(RESULT).map(function (k) {
        return '<option value="' + k + '"' + (d.result === k ? ' selected' : '') + '>' + RESULT[k] + '</option>';
      }).join('');
      return '<div class="reintro-item"><h3>' + g.name + ' <span class="status ' + esc(d.result || '') + '">' +
        RESULT[d.result || ''] + '</span></h3><div class="row">' +
        '<label>Test food<input data-g="' + g.id + '" data-f="food" value="' + esc(d.food) + '" placeholder="' + g.eg + '"></label>' +
        dayFields +
        '<label>Result<select data-g="' + g.id + '" data-f="result">' + opts + '</select></label>' +
        '</div></div>';
    }).join('');
    renderSummary();
  }

  list.addEventListener('change', function (ev) {
    var t = ev.target, g = t.getAttribute('data-g');
    if (!g) return;
    state.reintro[g] = state.reintro[g] || {};
    state.reintro[g][t.getAttribute('data-f')] = t.value;
    save();
    if (t.tagName === 'SELECT') renderReintro(); else renderSummary();
  });

  function renderSummary() {
    var buckets = { tolerated: [], partial: [], trigger: [], '': [] };
    GROUPS.forEach(function (g) {
      var d = state.reintro[g.id] || {};
      buckets[d.result || ''].push(g.name + (d.food ? ' (' + d.food + ')' : ''));
    });
    function card(title, items, cls, hint) {
      return '<div class="card ' + cls + '"><h3>' + title + '</h3>' +
        (items.length ? '<ul>' + items.map(function (i) { return '<li>' + esc(i) + '</li>'; }).join('') + '</ul>' : '<p class="small">' + hint + '</p>') +
        '</div>';
    }
    document.getElementById('summary').innerHTML =
      card('Eat freely', buckets.tolerated, 'ok', 'None recorded yet') +
      card('Eat in your tolerated amounts', buckets.partial, 'warn', 'None recorded yet') +
      card('Limit for now, retest later', buckets.trigger, 'alert', 'None recorded yet') +
      card('Still to test', buckets[''], '', 'All groups tested');
  }

  window.IBSGuide = { reintro: function () { return state.reintro; } };

  go(state.step, false);
  renderDiary();
  renderReintro();
})();
