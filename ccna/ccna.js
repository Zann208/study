/* CCNA console: renders the track from CCNA_DATA and keeps personal progress in this browser. */
(function () {
  'use strict';
  var D = window.CCNA_DATA;
  var KEY = 'ccna-console-v1';
  var OBJ_NEXT = { todo: 'learning', learning: 'done', done: 'todo' };
  var OBJ_LABEL = { todo: 'Not started', learning: 'Learning', done: 'Done' };
  var LAB_NEXT = { planned: 'active', active: 'done', done: 'planned' };
  var LAB_LABEL = { planned: 'Planned', active: 'In progress', done: 'Done' };

  /* ---------- state ---------- */
  var mem = null;
  function blank() { return { v: 1, obj: {}, labs: {}, exam: '', scores: [] }; }
  function load() {
    var raw = null;
    try { raw = localStorage.getItem(KEY); } catch (e) { return mem || (mem = blank()); }
    try { return normalise(raw ? JSON.parse(raw) : blank()); } catch (e) { return blank(); }
  }
  function normalise(s) {
    var out = blank();
    if (!s || typeof s !== 'object') return out;
    ['obj', 'labs'].forEach(function (k) {
      if (s[k] && typeof s[k] === 'object') Object.keys(s[k]).forEach(function (id) { out[k][id] = String(s[k][id]); });
    });
    if (/^\d{4}-\d{2}-\d{2}$/.test(s.exam || '')) out.exam = s.exam;
    if (Array.isArray(s.scores)) {
      out.scores = s.scores.filter(function (r) { return r && isFinite(r.s) && r.s >= 0 && r.s <= 100; })
        .map(function (r) { return { d: String(r.d || '').slice(0, 10), s: Math.round(+r.s * 10) / 10, n: String(r.n || '').slice(0, 60) }; });
    }
    return out;
  }
  function save() {
    mem = S;
    try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) { /* kept in memory for this visit */ }
    if (window.StudyShell && StudyShell.refreshProgress) StudyShell.refreshProgress();
  }
  var S = load();

  /* ---------- helpers ---------- */
  function $(id) { return document.getElementById(id); }
  function esc(s) { return String(s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function objState(id) { return S.obj[id] === 'done' || S.obj[id] === 'learning' ? S.obj[id] : 'todo'; }
  function labState(l) { var s = S.labs[l.id]; return LAB_NEXT[s] ? s : (l.status || 'planned'); }
  function today() { var d = new Date(); return d.getFullYear() + '-' + ('0' + (d.getMonth() + 1)).slice(-2) + '-' + ('0' + d.getDate()).slice(-2); }
  function domainCount(d) {
    var done = 0, learn = 0;
    d.objectives.forEach(function (o) { var s = objState(o.id); if (s === 'done') done++; else if (s === 'learning') learn++; });
    return { done: done, learn: learn, total: d.objectives.length };
  }
  function overall() {
    var sum = 0, done = 0, total = 0;
    D.domains.forEach(function (d) { var c = domainCount(d); sum += d.weight * c.done / c.total; done += c.done; total += c.total; });
    return { pct: Math.round(sum), done: done, total: total };
  }

  /* ---------- render ---------- */
  var openDomains = {};
  function renderDomains() {
    var host = $('cc-domains'), html = '';
    D.domains.forEach(function (d) {
      var c = domainCount(d), pct = Math.round(100 * c.done / c.total);
      var state = c.done === c.total ? 'Complete' : (c.done || c.learn) ? c.done + '/' + c.total + ' done' : 'Not started';
      html += '<details class="cc-domain" id="' + d.id + '"' + (openDomains[d.id] ? ' open' : '') + '>' +
        '<summary class="cc-dsum"><span class="cc-dno">' + d.no + '</span><h3>' + esc(d.title) + '</h3><span class="cc-weight">' + d.weight + '%</span>' +
        '<div class="cc-dbar"><i style="width:' + pct + '%"></i></div><span class="cc-state">' + state + '</span></summary>' +
        '<ol class="cc-objs">';
      d.objectives.forEach(function (o) {
        var s = objState(o.id);
        html += '<li class="cc-obj" data-s="' + s + '"><span class="cc-oid">' + o.id + '</span><div class="cc-otext">' + esc(o.text);
        if (o.subs) html += '<ul class="cc-subs">' + o.subs.map(function (t) { return '<li>' + esc(t) + '</li>'; }).join('') + '</ul>';
        html += '</div><button type="button" class="cc-st" data-act="obj" data-id="' + o.id + '" aria-label="Objective ' + o.id + ': ' + OBJ_LABEL[s] + '. Change status">' + OBJ_LABEL[s] + '</button></li>';
      });
      html += '</ol></details>';
    });
    host.innerHTML = html;
  }

  function renderLabs() {
    var host = $('cc-labs'), html = '<div class="cc-tr cc-th"><span>ID</span><span>Lab</span><span>Domain</span><span>Tool</span><span>Status</span></div>';
    var done = 0, active = 0;
    D.labs.forEach(function (l) {
      var s = labState(l); if (s === 'done') done++; else if (s === 'active') active++;
      html += '<div class="cc-tr" data-s="' + s + '"><span class="cc-lid">' + l.id + '</span><span>' + esc(l.title) + '<small class="cc-objref">' + esc(l.obj.join(' · ')) + '</small></span>' +
        '<span>' + l.domain + '</span><span>' + esc(l.tool) + '</span>' +
        '<span><button type="button" class="cc-st" data-act="lab" data-id="' + l.id + '" aria-label="' + esc(l.id + ' ' + l.title) + ': ' + LAB_LABEL[s] + '. Change status">' + LAB_LABEL[s] + '</button></span></div>';
    });
    if (!D.labs.length) html += '<div class="cc-empty">No labs yet</div>';
    host.innerHTML = html;
    $('cc-labs-aside').textContent = done + ' done · ' + active + ' in progress · ' + D.labs.length + ' total';
    return done;
  }

  function renderCases() {
    var html = '';
    D.cases.forEach(function (c) {
      var tag = c.href ? 'a' : 'div';
      html += '<' + tag + ' class="cc-case"' + (c.href ? ' href="' + esc(c.href) + '"' : '') + '><span class="cc-slot-no">' + esc(c.id) + '</span><h3>' + esc(c.title) + '</h3><p>' + esc(c.summary || '') + '</p></' + tag + '>';
    });
    for (var i = D.cases.length; i < 3; i++) {
      html += '<div class="cc-slot"><span class="cc-slot-no">CS-0' + (i + 1) + '</span><span class="cc-slot-lines"><i></i><i></i><i></i></span></div>';
    }
    $('cc-cases').innerHTML = html;
    $('cc-cases-aside').textContent = D.cases.length + ' published';
  }

  function renderPractice() {
    var list = $('cc-scores'), html = '';
    S.scores.slice().reverse().forEach(function (r, i) {
      var idx = S.scores.length - 1 - i;
      html += '<li><span class="cc-sd">' + esc(r.d) + '</span><span class="cc-sn">' + esc(r.n || 'Practice test') + '</span><b>' + r.s + '%</b>' +
        '<button type="button" class="sc-btn sc-btn--sm sc-btn--ghost" data-act="del-score" data-i="' + idx + '" aria-label="Delete score from ' + esc(r.d) + '">Delete</button></li>';
    });
    list.innerHTML = html || '<li class="cc-empty">No practice scores yet</li>';
    var n = S.scores.length;
    $('cc-practice-aside').textContent = n ? n + ' logged' : '0 logged';
  }

  function renderProgress() {
    var o = overall(), labsDone = 0, n = S.scores.length;
    D.labs.forEach(function (l) { if (labState(l) === 'done') labsDone++; });
    var latest = n ? S.scores[n - 1].s + '%' : '–';
    var avg = n ? Math.round(S.scores.reduce(function (a, r) { return a + r.s; }, 0) / n) + '% avg' : '';
    $('cc-stat-obj').textContent = o.done + '/' + o.total;
    $('cc-stat-labs').textContent = labsDone + '/' + D.labs.length;
    $('cc-stat-cases').textContent = D.cases.length;
    $('cc-stat-score').textContent = latest;
    $('cc-stat-score-sub').textContent = avg ? 'Practice score · ' + avg : 'Practice score';
    $('cc-meter-pct').textContent = o.pct + '%';
    $('cc-meter-fill').style.width = o.pct + '%';
    $('cc-meter').setAttribute('aria-label', 'Overall progress ' + o.pct + ' percent, weighted by exam domain');
    var exam = $('cc-exam');
    if (exam.value !== S.exam) exam.value = S.exam;
    var txt = 'Exam date not set', chip = null;
    if (S.exam) {
      var p = S.exam.split('-'), t = new Date(+p[0], +p[1] - 1, +p[2]), n0 = new Date(), t0 = new Date(n0.getFullYear(), n0.getMonth(), n0.getDate());
      var days = Math.round((t - t0) / 864e5);
      txt = days > 1 ? 'Exam in ' + days + ' days' : days === 1 ? 'Exam tomorrow' : days === 0 ? 'Exam today' : 'Exam date passed';
      chip = txt;
    }
    $('cc-progress-aside').textContent = txt;
    var chipEl = $('cc-exam-chip');
    chipEl.hidden = !chip; if (chip) chipEl.textContent = chip;
  }

  function renderAll() { renderDomains(); renderLabs(); renderCases(); renderPractice(); renderProgress(); }

  /* ---------- events ---------- */
  document.addEventListener('click', function (e) {
    var b = e.target.closest && e.target.closest('[data-act]');
    if (!b) return;
    var act = b.getAttribute('data-act'), id = b.getAttribute('data-id');
    if (act === 'obj') {
      var next = OBJ_NEXT[objState(id)];
      if (next === 'todo') delete S.obj[id]; else S.obj[id] = next;
      save(); renderDomains(); renderProgress();
      var again = document.querySelector('[data-act="obj"][data-id="' + id + '"]'); if (again) again.focus();
    } else if (act === 'lab') {
      var lab = D.labs.filter(function (l) { return l.id === id; })[0];
      if (!lab) return;
      S.labs[id] = LAB_NEXT[labState(lab)];
      save(); renderLabs(); renderProgress();
      var again2 = document.querySelector('[data-act="lab"][data-id="' + id + '"]'); if (again2) again2.focus();
    } else if (act === 'del-score') {
      S.scores.splice(+b.getAttribute('data-i'), 1);
      save(); renderPractice(); renderProgress();
    } else if (act === 'export') {
      var blob = new Blob([JSON.stringify(S, null, 2)], { type: 'application/json' });
      var a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'ccna-progress-' + today() + '.json';
      document.body.appendChild(a); a.click(); a.remove(); setTimeout(function () { URL.revokeObjectURL(a.href); }, 500);
    } else if (act === 'import') {
      $('cc-import').click();
    }
  });
  document.addEventListener('toggle', function (e) {
    var t = e.target; if (t && t.classList && t.classList.contains('cc-domain')) openDomains[t.id] = t.open;
  }, true);

  $('cc-score-form').addEventListener('submit', function (e) {
    e.preventDefault();
    var v = parseFloat($('cc-score-val').value);
    if (!isFinite(v) || v < 0 || v > 100) { $('cc-score-val').focus(); return; }
    S.scores.push({ d: $('cc-score-date').value || today(), s: Math.round(v * 10) / 10, n: $('cc-score-name').value.trim().slice(0, 60) });
    S.scores.sort(function (a, b) { return a.d < b.d ? -1 : a.d > b.d ? 1 : 0; });
    $('cc-score-val').value = ''; $('cc-score-name').value = '';
    save(); renderPractice(); renderProgress();
  });
  $('cc-exam').addEventListener('change', function () {
    S.exam = /^\d{4}-\d{2}-\d{2}$/.test(this.value) ? this.value : '';
    save(); renderProgress();
  });
  $('cc-import').addEventListener('change', function () {
    var f = this.files && this.files[0], input = this; if (!f) return;
    var r = new FileReader();
    r.onload = function () {
      try { S = normalise(JSON.parse(r.result)); save(); renderAll(); $('cc-io-note').textContent = 'Imported ' + f.name; }
      catch (err) { $('cc-io-note').textContent = 'Could not read that file'; }
      input.value = '';
    };
    r.readAsText(f);
  });
  $('cc-score-date').value = today();

  /* ---------- shell manifest ---------- */
  function openFor(anchor) {
    var el = anchor && /^d\d$/.test(anchor) && $(anchor);
    if (el && el.tagName === 'DETAILS') { el.open = true; openDomains[anchor] = true; }
  }
  var terms = [];
  D.domains.forEach(function (d) {
    d.objectives.forEach(function (o) { terms.push({ title: o.id + ' ' + o.text, meta: 'Objective · ' + d.no, view: 'track', anchor: d.id }); });
  });
  D.labs.forEach(function (l) { terms.push({ title: l.id + ' ' + l.title, meta: 'Lab · ' + l.tool, view: 'track', anchor: 'labs' }); });

  renderAll();
  (window.StudyConsole = window.StudyConsole || []).push({
    id: 'ccna',
    code: 'CCN',
    title: 'Cisco CCNA 200-301',
    subtitle: 'Certification track',
    content: 'body > main',
    defaultView: 'track',
    router: { show: function (view, anchor) { openFor(anchor); } },
    groups: [
      { label: 'Console', views: [{ id: 'track', title: 'CCNA track', badge: 'CCN', children: [
        { id: 'overview', title: 'Overview', badge: 'OV' },
        { id: 'domains', title: 'Exam domains', badge: '01' },
        { id: 'labs', title: 'Labs', badge: '02' },
        { id: 'cases', title: 'Case studies', badge: '03' },
        { id: 'practice', title: 'Practice', badge: '04' },
        { id: 'progress', title: 'Progress', badge: '05' }
      ] }] }
    ],
    terms: terms,
    progress: { read: function () { var o = overall(); return { track: o.pct >= 100 ? 'done' : (o.done || S.scores.length) ? 'visited' : 'none' }; } },
    progressNote: 'Progress is saved in this browser. Export it from the Progress section to move it between devices.'
  });
  openFor((/^#\/track\/(d\d)$/.exec(location.hash) || [])[1]);
})();
