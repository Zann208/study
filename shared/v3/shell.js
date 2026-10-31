/* Study Console UI v3 — master frame.
   Builds the top bar, console switcher, left menu, search, theme, language,
   reading size, progress and hash routing from a console manifest.
   It never queries a console's own markup; the console hands over a manifest
   (and, optionally, the element that holds its content).

   Usage (inside a console page, after its own scripts):
     StudyShell.mount({
       id: 'algo', router: { show: function (view) { go(view); } },
       groups: [{ label: 'Topics', views: [{ id: 'week1', title: 'Complexity', badge: 'W1' }] }],
       content: '#legacy-main'            // optional: adopted into the frame
     });
*/
(function () {
  'use strict';

  var HOME = 'https://zann208.github.io/study/';
  var KEYS = {
    theme: 'study-console-theme',          // shared with v2
    last: 'study-console-last',            // shared with v2
    reading: 'study-console-reading',      // shared with v2
    menu: 'study-console-v3-menu',         // collapsed groups per console
    menuHidden: 'study-console-v3-menu-hidden',
    sections: 'study-console-v3-sections',
    paged: 'study-console-v3-paged',
    page: 'study-console-v3-page',
    visited: 'study-console-v3-visited',
    done: 'study-console-v3-done',          // pages the learner marked done
    ui: 'study-console-ui'                 // sessionStorage: 'v2' forces the old shell
  };
  var LEGACY_THEME_KEYS = ['algoTheme', 'privTheme', 'osTheme'];
  var LEGACY_LIGHT_KEYS = ['nd_light', 'wn_light'];

  /* Single console registry. The hub cards and the switcher both read this. */
  var CONSOLES = [
    { id: 'home', code: 'SC', name: 'Study Console', short: 'Home', group: 'hub', href: HOME, icon: 'home',
      accent: { light: '#7a242c', dark: '#d26a75' } },
    { id: 'netdes', code: 'NET', name: 'Network Design & Management', short: 'Network Design', group: 'subjects',
      href: 'https://zann208.github.io/netdes/', icon: 'network', accent: { light: '#2f6862', dark: '#86b8b0' },
      blurb: 'Switching, VLANs, redundancy, and configuration verification.' },
    { id: 'wnet', code: 'WLN', name: 'Wireless Network Engineering', short: 'Wireless Networks', group: 'subjects',
      href: 'https://zann208.github.io/wnet/', icon: 'wireless', accent: { light: '#5e4a7d', dark: '#b3a0cf' },
      blurb: 'RF behavior, Wi-Fi design, capacity, and security.' },
    { id: 'algo', code: 'ALG', name: 'Algorithms & Data Structures', short: 'Algorithms', group: 'subjects',
      href: 'https://zann208.github.io/algo/', icon: 'algorithm', accent: { light: '#7d5a1e', dark: '#d1ad69' },
      blurb: 'Data structures, complexity, and problem-solving patterns.' },
    { id: 'privacy', code: 'PRV', name: 'Privacy & Information Security', short: 'Privacy & Security', group: 'subjects',
      href: 'https://zann208.github.io/privacy/', icon: 'shield', accent: { light: '#8e3f33', dark: '#dc9686' },
      blurb: 'Privacy principles, risk, controls, and information protection.' },
    { id: 'os', code: 'OS', name: 'Operating Systems & Scheduling', short: 'Operating Systems', group: 'subjects',
      href: 'https://zann208.github.io/os/', icon: 'system', accent: { light: '#4a6236', dark: '#a8bf8c' },
      blurb: 'Processes, memory, synchronization, and deadlock.' },
    { id: 'gdc', code: 'GDC', name: 'Google Data Center Hardware Hackathon', short: 'Data Center Prep', group: 'lab',
      href: HOME + 'google-dc-hackathon/', icon: 'server', accent: { light: '#36597a', dark: '#98b5d1' },
      blurb: 'Server hardware, networking, Linux, and troubleshooting.' },
    { id: 'ccna', code: 'CCN', name: 'Cisco CCNA 200-301', short: 'CCNA', group: 'cert',
      href: HOME + 'ccna/', icon: 'router', accent: { light: '#2b2b2b', dark: '#d6d6d6' },
      blurb: 'Exam domains, labs and case studies for the CCNA.' }
  ];

  var ICONS = {
    home: '<path d="M3 4h7v16H3zM14 4h7v7h-7zM14 15h7v5h-7z"/>',
    network: '<rect x="8" y="3" width="8" height="5" rx="1.5"/><rect x="2" y="16" width="7" height="5" rx="1.5"/><rect x="15" y="16" width="7" height="5" rx="1.5"/><path d="M12 8v4M5.5 16v-4h13v4"/>',
    wireless: '<path d="M2 8.5a16 16 0 0 1 20 0M5.5 12a10.5 10.5 0 0 1 13 0M9 15.5a5 5 0 0 1 6 0"/><circle cx="12" cy="19" r=".9"/>',
    algorithm: '<circle cx="12" cy="4" r="2"/><circle cx="5" cy="19" r="2"/><circle cx="19" cy="19" r="2"/><path d="M12 6v5M5 17v-6h14v6"/>',
    shield: '<path d="m12 3 8 3v6c0 5-8 9-8 9S4 17 4 12V6zM8.5 12l2.5 2.5 4.5-5"/>',
    system: '<rect x="3" y="4" width="18" height="13" rx="2"/><path d="M8 21h8M12 17v4M7 8l3 2.5L7 13M13 13h4"/>',
    router: '<circle cx="12" cy="12" r="9"/><path d="M12 5.5v4.2M10.2 7.3 12 5.5l1.8 1.8M12 18.5v-4.2M10.2 16.7 12 18.5l1.8-1.8M5.5 12h4.2M7.3 10.2 5.5 12l1.8 1.8M18.5 12h-4.2M16.7 10.2 18.5 12l-1.8 1.8"/>',
    server: '<rect x="4" y="3" width="16" height="7" rx="2"/><rect x="4" y="14" width="16" height="7" rx="2"/><path d="M8 6.5h.01M8 17.5h.01M12 6.5h4M12 17.5h4"/>',
    chevron: '<path d="m6 9 6 6 6-6"/>',
    menu: '<path d="M4 6h16M4 12h16M4 18h16"/>',
    close: '<path d="M6 6l12 12M18 6 6 18"/>',
    search: '<circle cx="11" cy="11" r="6.5"/><path d="m16 16 4.5 4.5"/>',
    sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M2 12h2M20 12h2M5 5l1.5 1.5M17.5 17.5 19 19M5 19l1.5-1.5M17.5 6.5 19 5"/>',
    moon: '<path d="M20.5 14A9 9 0 0 1 10 3.5 9 9 0 1 0 20.5 14Z"/>',
    text: '<path d="M4 19 9 5l5 14M5.8 14h6.4M15 19l3-8 3 8M15.9 16.6h4.2"/>',
    globe: '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c2.5 2.6 3.7 5.6 3.7 9s-1.2 6.4-3.7 9c-2.5-2.6-3.7-5.6-3.7-9S9.5 5.6 12 3Z"/>',
    page: '<path d="M7 3h7l4 4v14H7z"/><path d="M14 3v4h4"/>',
    hash: '<path d="M5 9h15M4 15h15M10 4 8 20M16 4l-2 16"/>',
    arrow: '<path d="M4 12h16m-6-6 6 6-6 6"/>',
    back: '<path d="M20 12H4m6-6-6 6 6 6"/>',
    sidebar: '<rect x="3" y="4" width="18" height="16" rx="2"/><path d="M9 4v16"/>',
    more: '<circle cx="5" cy="12" r="1.2"/><circle cx="12" cy="12" r="1.2"/><circle cx="19" cy="12" r="1.2"/>'
  };

  function icon(name, cls) {
    return '<svg class="sc3-icon' + (cls ? ' ' + cls : '') + '" viewBox="0 0 24 24" aria-hidden="true" focusable="false">' + (ICONS[name] || '') + '</svg>';
  }
  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  function read(key, fallback) {
    try { var v = localStorage.getItem(key); return v === null ? fallback : v; } catch (e) { return fallback; }
  }
  function write(key, value) { try { localStorage.setItem(key, value); } catch (e) { /* storage blocked */ } }
  function readJSON(key, fallback) {
    try { var v = JSON.parse(read(key, 'null')); return v && typeof v === 'object' ? v : fallback; } catch (e) { return fallback; }
  }
  function consoleById(id) {
    for (var i = 0; i < CONSOLES.length; i++) if (CONSOLES[i].id === id) return CONSOLES[i];
    return null;
  }
  function el(tag, attrs, html) {
    var node = document.createElement(tag);
    if (attrs) Object.keys(attrs).forEach(function (k) {
      if (attrs[k] === false || attrs[k] == null) return;
      if (k === 'class') node.className = attrs[k]; else node.setAttribute(k, attrs[k] === true ? '' : attrs[k]);
    });
    if (html != null) node.innerHTML = html;
    return node;
  }

  /* ---------- UI version override (rollback path) ---------- */
  function uiOverride() {
    var m = /[?&]ui=(v2|v3)\b/.exec(location.search);
    try {
      if (m) sessionStorage.setItem(KEYS.ui, m[1]);
      return sessionStorage.getItem(KEYS.ui);
    } catch (e) { return m ? m[1] : null; }
  }

  /* ---------- Theme ---------- */
  var media = window.matchMedia ? window.matchMedia('(prefers-color-scheme: dark)') : null;
  function storedTheme() {
    var t = read(KEYS.theme, null);
    if (t === 'light' || t === 'dark') return t;
    // One-time migration from v1/v2 per-console keys; nothing is deleted.
    for (var i = 0; i < LEGACY_THEME_KEYS.length; i++) {
      var v = read(LEGACY_THEME_KEYS[i], null);
      if (v === 'light' || v === 'dark') { write(KEYS.theme, v); return v; }
    }
    for (var j = 0; j < LEGACY_LIGHT_KEYS.length; j++) {
      var l = read(LEGACY_LIGHT_KEYS[j], null);
      if (l === '1' || l === '0') { var m = l === '1' ? 'light' : 'dark'; write(KEYS.theme, m); return m; }
    }
    return null;
  }
  function effectiveTheme() {
    var root = document.documentElement.dataset.theme;
    if (root === 'light' || root === 'dark') return root;
    return media && media.matches ? 'dark' : 'light';
  }
  function applyTheme(theme) {
    if (window.StudyConsoleTheme && window.StudyConsoleTheme.apply) { window.StudyConsoleTheme.apply(theme); }
    else {
      var root = document.documentElement;
      root.dataset.theme = theme;
      root.classList.toggle('dark', theme === 'dark');
      root.classList.toggle('light', theme === 'light');
      if (document.body) { document.body.classList.toggle('dark', theme === 'dark'); document.body.classList.toggle('light', theme === 'light'); }
    }
    state.theme = theme;
    paintAccent();
    if (state.ui) state.ui.render.theme();
    document.dispatchEvent(new CustomEvent('sc-theme-change', { detail: theme }));
  }
  function setTheme(theme) { write(KEYS.theme, theme); applyTheme(theme); }

  /* ---------- Accent ---------- */
  function paintAccent() {
    var c = state.console, root = document.documentElement;
    if (!c || !c.accent) return;
    var dark = effectiveTheme() === 'dark';
    root.style.setProperty('--sc-accent', dark ? c.accent.dark : c.accent.light);
    root.style.setProperty('--sc-on-accent', dark ? '#000000' : '#ffffff');
    root.setAttribute('data-sc-accent', c.id);
  }

  /* ---------- Reading preferences (same JSON shape as v2) ---------- */
  var SIZES = ['standard', 'large', 'larger'];
  function readingPrefs() {
    var v = readJSON(KEYS.reading, {});
    return { size: SIZES.indexOf(v.size) >= 0 ? v.size : 'standard', focus: v.focus === true };
  }
  function applyReading(p) {
    var b = document.body;
    b.dataset.readingSize = p.size;
    b.dataset.readingFocus = String(p.focus);
    document.documentElement.setAttribute('data-sc-read', p.size);
    if (state.ui) state.ui.render.reading(p);
  }
  function saveReading(p) { write(KEYS.reading, JSON.stringify(p)); applyReading(p); }

  /* ---------- State ---------- */
  var state = { manifest: null, console: null, views: [], byId: {}, current: null, ui: null, theme: null };

  function normalize(manifest) {
    var groups = manifest.groups || [{ label: '', views: manifest.views || [] }];
    var views = [], byId = {};
    groups.forEach(function (g, gi) {
      g.key = g.key || ('g' + gi + '-' + (g.label || '').toLowerCase().replace(/[^a-z0-9]+/g, '-'));
      (g.views || []).forEach(function (v) {
        v.group = g;
        if (v.href) { v.external = true; if (v.track === undefined) v.track = false; }
        views.push(v); byId[v.id] = v;
      });
    });
    return { groups: groups, views: views, byId: byId };
  }

  /* Sections of a view: static array or a function evaluated against the live page. */
  function childrenOf(v) {
    var list = v && v.children;
    try { if (typeof list === 'function') list = list(); } catch (e) { list = null; }
    return Array.isArray(list) ? list.filter(function (c) { return c && c.id && c.title; }) : [];
  }
  function sublistHTML(v, kids) {
    return '<ul class="sc3-sublist">' + kids.map(function (ch) {
      return '<li><a class="sc3-subitem" data-nav data-view="' + esc(v.id) + '" data-anchor="' + esc(ch.id) + '" href="#/' + esc(v.id) + '/' + esc(ch.id) + '">' +
        (ch.badge ? '<span class="sc3-subbadge">' + esc(ch.badge) + '</span>' : '') + '<span>' + esc(ch.title) + '</span></a></li>';
    }).join('') + '</ul>';
  }

  /* Menu label in the current language (views may carry titles: { my: '...' }) */
  function labelFor(v) {
    var l = currentLang();
    return (l !== 'en' && v.titles && v.titles[l]) ? v.titles[l] : v.title;
  }

  /* ---------- Progress ---------- */
  function visitedMap() { var all = readJSON(KEYS.visited, {}); return all[state.manifest.id] || {}; }
  function markVisited(id) {
    var all = readJSON(KEYS.visited, {});
    var mine = all[state.manifest.id] || {};
    if (mine[id]) return;
    mine[id] = 1; all[state.manifest.id] = mine;
    write(KEYS.visited, JSON.stringify(all));
  }
  function doneMap() { var all = readJSON(KEYS.done, {}); return all[state.manifest.id] || {}; }
  function setDone(id, on) {
    var all = readJSON(KEYS.done, {}), mine = all[state.manifest.id] || {};
    if (on) mine[id] = 1; else delete mine[id];
    all[state.manifest.id] = mine;
    write(KEYS.done, JSON.stringify(all));
  }
  function progressMap() {
    var out = {}, visited = visitedMap(), marked = doneMap(), fromConsole = {};
    try { fromConsole = (state.manifest.progress && state.manifest.progress.read && state.manifest.progress.read()) || {}; } catch (e) { fromConsole = {}; }
    state.views.forEach(function (v) {
      if (v.track === false) return;
      out[v.id] = (fromConsole[v.id] === 'done' || marked[v.id]) ? 'done' : (visited[v.id] || fromConsole[v.id] === 'visited') ? 'visited' : 'none';
    });
    return out;
  }

  /* ---------- Routing ---------- */
  function parseHash() {
    var m = /^#\/([A-Za-z0-9_.~-]+)(?:\/([A-Za-z0-9_.~-]+))?$/.exec(location.hash);
    return m ? { view: m[1], anchor: m[2] || null } : null;
  }
  function navigate(viewId, anchor, opts) {
    opts = opts || {};
    var hash = '#/' + viewId + (anchor ? '/' + anchor : '');
    if (location.hash !== hash) {
      if (opts.replace) history.replaceState(null, '', hash); else history.pushState(null, '', hash);
    }
    show(viewId, anchor, opts);
  }
  function show(viewId, anchor, opts) {
    var v = state.byId[viewId];
    if (!v) v = state.byId[state.manifest.defaultView] || state.views[0];
    if (!v) return;
    var changed = !state.current || state.current.id !== v.id;
    state.current = v;
    var main = state.ui.main;
    try {
      var r = state.manifest.router;
      if (typeof r === 'function') r(v.id, anchor);
      else if (r && typeof r.show === 'function') r.show(v.id, anchor);
      else if (r && typeof r.call === 'string' && typeof window[r.call] === 'function') window[r.call](v.id);
    } catch (e) { if (window.console) console.error('[StudyShell] router failed for', v.id, e); }
    markVisited(v.id);
    rememberLast();
    state.ui.render.active();
    state.ui.render.progress();
    if (anchor) {
      jumpToAnchor(anchor);
    } else if (changed && !(opts && opts.keepScroll)) {
      window.scrollTo(0, 0);
    }
    if (changed && !(opts && opts.initial)) {
      var h = (viewNode(v) || main).querySelector('h1');
      if (h && h.getClientRects().length) { h.setAttribute('tabindex', '-1'); h.focus({ preventScroll: true }); }
    }
    document.dispatchEvent(new CustomEvent('sc-view-change', { detail: { view: v.id, anchor: anchor } }));
  }
  function viewNode(v) {
    if (!v || v.external || !state.manifest.viewElement) return null;
    try { return state.manifest.viewElement(v.id) || null; } catch (e) { return null; }
  }
  /* A console can change page on its own (a button inside a lesson, its own shortcuts).
     Watch the view elements and bring the frame (menu, address, sections) in line. */
  function adoptView(v) {
    if (!v || (state.current && state.current.id === v.id)) return;
    state.current = v;
    var hash = '#/' + v.id;
    if (location.hash !== hash) history.pushState(null, '', hash);
    markVisited(v.id);
    rememberLast();
    state.ui.render.active();
    state.ui.render.progress();
    document.dispatchEvent(new CustomEvent('sc-view-change', { detail: { view: v.id, anchor: null, adopted: true } }));
  }
  function watchViews() {
    if (!window.MutationObserver || !state.manifest.viewElement) return;
    var pairs = [];
    state.views.forEach(function (v) { var n = viewNode(v); if (n) pairs.push([v, n]); });
    if (pairs.length < 2) return;
    var pending = false;
    function check() {
      pending = false;
      if (!state.ui) return;
      var cur = viewNode(state.current);
      if (cur && cur.getClientRects().length) return;
      for (var i = 0; i < pairs.length; i++) if (pairs[i][1].getClientRects().length) { adoptView(pairs[i][0]); return; }
    }
    state.viewWatch = new MutationObserver(function () { if (!pending) { pending = true; requestAnimationFrame(check); } });
    pairs.forEach(function (p) { state.viewWatch.observe(p[1], { attributes: true, attributeFilter: ['class', 'style', 'hidden'] }); });
  }
  /* A faint maroon light under the background field follows the pointer (mouse and trackpad
     only, never with reduced motion). It sits behind every card, so it never covers text. */
  var spotWired = false;
  function wireFieldSpot() {
    if (spotWired || !window.matchMedia || !matchMedia('(hover: hover) and (pointer: fine)').matches || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    var field = document.querySelector('.home-aurora, .sc3-field');
    if (!field) return;
    spotWired = true;
    var spot = document.createElement('span'); spot.className = 'sc3-spot';
    field.appendChild(spot);
    var last = null, frame = null;
    window.addEventListener('pointermove', function (e) {
      if (e.pointerType && e.pointerType !== 'mouse' && e.pointerType !== 'pen') return;
      last = e;
      if (frame) return;
      frame = requestAnimationFrame(function () {
        frame = null;
        var r = field.getBoundingClientRect();
        spot.style.transform = 'translate3d(' + (last.clientX - r.left) + 'px,' + (last.clientY - r.top) + 'px,0)';
        spot.classList.add('is-on');
      });
    }, { passive: true });
    document.documentElement.addEventListener('pointerleave', function () { spot.classList.remove('is-on'); });
  }

  /* ---------- One topic at a time ----------
     Long views (topics, chapters, labs) show one top-level section at a time with
     previous / next at its end. "Show all" in the section bar turns it off (remembered).
     Search, J/K, deep links and console jumps reveal the section they point into. */
  function pagedPref() { return read(KEYS.paged, '1') !== '0'; }
  function pageKey() { return location.pathname + '#' + (state.current ? state.current.id : ''); }
  function clearPaging() {
    var p = state.paging;
    if (p) {
      p.tops.forEach(function (t) { t.el.classList.remove('sc3-paged-hidden'); });
      if (p.pager && p.pager.parentNode) p.pager.parentNode.removeChild(p.pager);
    }
    state.paging = null;
    document.documentElement.classList.remove('sc3-paged');
  }
  function setupPaging(preferId) {
    clearPaging();
    var ui = state.ui, mode = ui && ui.sectionbar.querySelector('.sc3-sec-mode');
    if (!ui || ui.sectionbar.hidden || !state.current) { if (mode) mode.hidden = true; return; }
    var els = (state.sections || []).map(function (c) { var n = document.getElementById(c.id); return n ? { el: n, id: c.id, title: c.title, badge: c.badge } : null; }).filter(Boolean);
    var tops = els.filter(function (a) { return !els.some(function (b) { return b !== a && b.el.contains(a.el); }); });
    var total = 0;
    tops.forEach(function (t) { total += t.el.getBoundingClientRect().height; });
    var long = tops.length >= 3 && total > window.innerHeight * 3.5;
    if (mode) { mode.hidden = !long; }
    if (!long) return;
    var on = pagedPref();
    if (mode) { mode.textContent = on ? 'Show all' : 'One at a time'; mode.setAttribute('aria-pressed', String(!on)); }
    if (!on) return;
    var saved = readJSON(KEYS.page, {});
    var start = 0, want = preferId || saved[pageKey()];
    tops.forEach(function (t, i) { if (t.id === want) start = i; });
    state.paging = { active: true, tops: tops, cur: -1, pager: null };
    document.documentElement.classList.add('sc3-paged');
    showTop(start);
  }
  function showTop(i) {
    var p = state.paging;
    if (!p || i < 0 || i >= p.tops.length || i === p.cur) return;
    p.tops.forEach(function (t, k) { t.el.classList.toggle('sc3-paged-hidden', k !== i); });
    p.cur = i;
    var map = readJSON(KEYS.page, {}); map[pageKey()] = p.tops[i].id;
    var keys = Object.keys(map); if (keys.length > 100) delete map[keys[0]];
    write(KEYS.page, JSON.stringify(map));
    if (p.pager && p.pager.parentNode) p.pager.parentNode.removeChild(p.pager);
    var prev = p.tops[i - 1], next = p.tops[i + 1], v = state.current.id;
    function card(t, cls, label) {
      return t ? '<a class="sc3-pager-link ' + cls + '" href="#/' + esc(v) + '/' + esc(t.id) + '" data-sc3-page="' + esc(t.id) + '">' +
        '<small>' + label + '</small><b>' + esc((t.badge ? t.badge + '  ' : '') + t.title) + '</b></a>' : '<span class="sc3-pager-link is-empty"></span>';
    }
    var nav = document.createElement('nav');
    nav.className = 'sc3-pager'; nav.setAttribute('aria-label', 'Previous and next');
    nav.innerHTML = card(prev, 'is-prev', 'Previous') + '<span class="sc3-pager-count">' + (i + 1) + ' of ' + p.tops.length + '</span>' + card(next, 'is-next', 'Next');
    p.tops[i].el.parentNode.insertBefore(nav, p.tops[i].el.nextSibling);
    p.pager = nav;
  }
  // Show the section that contains el (used before any scroll to it). Returns true if it changed.
  function reveal(el) {
    var p = state.paging;
    if (!p || !el || !el.nodeType) return false;
    for (var i = 0; i < p.tops.length; i++) {
      if (p.tops[i].el === el || p.tops[i].el.contains(el)) {
        if (i === p.cur) return false;
        showTop(i);
        var h = '#/' + state.current.id + '/' + p.tops[i].id;
        if (location.hash !== h) history.replaceState(null, '', h);
        return true;
      }
    }
    return false;
  }
  document.addEventListener('click', function (e) {
    var a = e.target.closest && e.target.closest('a[data-sc3-page]');
    if (!a || e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0 || !state.current) return;
    e.preventDefault();
    navigate(state.current.id, a.getAttribute('data-sc3-page'), { keepScroll: true });
  });
  // Consoles scroll to their own targets (next-topic buttons, chapter maps); reveal the target first.
  if (!Element.prototype.__sc3Reveal) {
    var nativeScrollIntoView = Element.prototype.scrollIntoView;
    Element.prototype.scrollIntoView = function () { try { reveal(this); } catch (e) { /* ignore */ } return nativeScrollIntoView.apply(this, arguments); };
    Element.prototype.__sc3Reveal = true;
  }

  function jumpToAnchor(id) {
    var target = document.getElementById(id);
    if (!target) return;
    reveal(target);
    if (target.tagName === 'DETAILS') target.open = true;
    var parentDetails = target.parentElement && target.parentElement.closest('details');
    if (parentDetails) parentDetails.open = true;
    var offset = (state.ui ? state.ui.top.getBoundingClientRect().bottom : 0) + (state.ui && state.ui.sectionbar && !state.ui.sectionbar.hidden ? state.ui.sectionbar.offsetHeight : 0) + 12;
    state.sectionLock = Date.now() + 450;
    window.scrollTo({ top: Math.max(0, target.getBoundingClientRect().top + window.scrollY - offset), behavior: 'instant' });
    if (state.ui && state.ui.render.syncSection) state.ui.render.syncSection(id);
  }
  // boot.js reads this before the first paint to reserve the section bar's height.
  function rememberSections(show) {
    if (!state.current) return;
    var map = readJSON(KEYS.sections, {}), keys = [location.pathname + (location.hash || '#')], changed = false;
    if (state.bareLoad) { keys.push(location.pathname + '#'); state.bareLoad = false; }  // page opened without a hash
    keys.forEach(function (k) { if (!!map[k] !== show) { changed = true; if (show) map[k] = 1; else delete map[k]; } });
    if (!changed) return;
    var all = Object.keys(map); if (all.length > 200) delete map[all[0]];
    write(KEYS.sections, JSON.stringify(map));
  }
  function rememberLast() {
    var c = state.console;
    if (!c || c.id === 'home') return;
    write(KEYS.last, JSON.stringify({ id: c.id, name: c.name, href: c.href + '#/' + state.current.id, at: Date.now() }));
  }

  /* ---------- Search index ---------- */
  function buildIndex() {
    var items = [];
    state.views.forEach(function (v) {
      if (v.external) {
        items.push(v.console ? { type: 'console', title: labelFor(v), meta: v.group.label || 'Open', console: v.console, href: v.href }
                             : { type: 'link', title: labelFor(v), meta: v.group.label || 'Page', href: v.href });
        return;
      }
      items.push({ type: 'page', title: labelFor(v), meta: v.group.label, view: v.id });
      var heads = [];
      if (state.manifest.index && state.manifest.index[v.id]) heads = state.manifest.index[v.id];
      else if (state.manifest.viewElement) {
        var node = null;
        try { node = state.manifest.viewElement(v.id); } catch (e) { node = null; }
        if (node) heads = Array.prototype.map.call(node.querySelectorAll('h2,h3'), function (h) {
          if (!h.id) h.id = 'sc3-' + v.id + '-' + Math.random().toString(36).slice(2, 8);
          return { title: h.textContent.replace(/\s+/g, ' ').trim(), anchor: h.id };
        });
      }
      heads.forEach(function (h) {
        var t = typeof h === 'string' ? h : h.title;
        if (t) items.push({ type: 'section', title: t, meta: v.title, view: v.id, anchor: h.anchor || null });
      });
      childrenOf(v).forEach(function (ch) {
        items.push({ type: 'section', title: ch.title, meta: v.title + (ch.badge ? ' · ' + ch.badge : ''), view: v.id, anchor: ch.id });
      });
    });
    var terms = state.manifest.terms;
    try { if (typeof terms === 'function') terms = terms(); } catch (e) { terms = []; }
    (Array.isArray(terms) ? terms : []).forEach(function (t) {
      items.push({ type: 'term', title: t.title, meta: t.meta || 'Term', view: t.view, anchor: t.anchor || null });
    });
    var listed = {};
    items.forEach(function (it) { if (it.console) listed[it.console] = true; });
    CONSOLES.forEach(function (c) {
      if (c.id !== state.console.id && !listed[c.id]) items.push({ type: 'console', title: c.name, meta: 'Open console', console: c.id, href: c.href });
    });
    return items;
  }
  function score(item, q) {
    var t = item.title.toLowerCase(), i = t.indexOf(q);
    if (i < 0) {
      var words = q.split(/\s+/).filter(Boolean);
      if (!words.length || !words.every(function (w) { return t.indexOf(w) >= 0 || item.meta.toLowerCase().indexOf(w) >= 0; })) return -1;
      return 40;
    }
    var base = item.type === 'page' ? 100 : item.type === 'term' ? 90 : item.type === 'section' ? 70 : 50;
    return base + (i === 0 ? 20 : 0) - Math.min(t.length, 60) / 10;
  }

  /* ---------- Build UI ---------- */
  function build() {
    var m = state.manifest, c = state.console, body = document.body;
    body.classList.add('sc3');
    body.setAttribute('data-sc-console', m.id);
    if (m.kind) body.setAttribute('data-sc-kind', m.kind);


    var parent = m.kind === 'exam' && m.parent ? consoleById(m.parent) : null;
    var top = el('header', { class: 'sc3-top', role: 'banner' });
    top.innerHTML =
      '<div class="sc3-top-inner">' +
        '<button type="button" class="sc3-iconbtn sc3-menu-toggle" aria-controls="sc3-menu" aria-expanded="false" aria-label="Open menu">' + icon('menu') + '</button>' +
        '<div class="sc3-top-lead">' +
        '<a class="sc3-brand" href="' + esc(HOME) + '" data-console-target="home" aria-label="ISNE Study Console home">' +
          '<span class="sc3-logo" aria-hidden="true"><span class="sc3-logo-isne">ISNE</span><span class="sc3-logo-sub">STUDY CONSOLE</span></span></a>' +
        '<span class="sc3-sep" aria-hidden="true"></span>' +
        '<div class="sc3-switch">' +
          '<button type="button" class="sc3-switch-btn" aria-haspopup="true" aria-expanded="false" aria-controls="sc3-switch-pop" aria-label="Switch console. Current: ' + esc(c.name) + '" title="' + esc(c.name) + '">' +
            '<span class="sc3-switch-mark" aria-hidden="true">' + icon(c.icon || 'home') + '</span><span class="sc3-switch-code" aria-hidden="true">' + esc(c.code) + '</span>' +
            icon('chevron', 'sc3-caret') + '</button>' +
          '<div class="sc3-pop sc3-switch-pop" id="sc3-switch-pop" hidden></div>' +
        '</div>' +
        '</div>' +
        '<nav class="sc3-crumbs" aria-label="Breadcrumb"><ol></ol></nav>' +
        '<div class="sc3-actions">' +
          '<button type="button" class="sc3-search-btn" aria-haspopup="dialog" aria-label="Search pages and terms">' + icon('search') +
            '<span class="sc3-search-label">Search</span><kbd class="sc3-kbd">/</kbd></button>' +
          '<div class="sc3-progress-wrap">' +
            '<button type="button" class="sc3-progress" aria-haspopup="true" aria-expanded="false" aria-controls="sc3-progress-pop"></button>' +
            '<div class="sc3-pop sc3-progress-pop" id="sc3-progress-pop" hidden></div>' +
          '</div>' +
          '<div class="sc3-controls" data-sc3-controls></div>' +
        '</div>' +
      '</div>';

    var menu = el('nav', { class: 'sc3-menu', id: 'sc3-menu', 'aria-label': (m.kind === 'exam' ? 'Exam' : c.short) + ' pages' });
    var scrim = el('div', { class: 'sc3-scrim', hidden: true });
    var palette = el('div', { class: 'sc3-palette', role: 'dialog', 'aria-modal': 'true', 'aria-label': 'Search', hidden: true });
    palette.innerHTML =
      '<div class="sc3-palette-box">' +
        '<div class="sc3-palette-field">' + icon('search') +
          '<input id="sc3-search-input" type="search" autocomplete="off" spellcheck="false" placeholder="Search pages, sections and terms" aria-label="Search" aria-controls="sc3-search-list" aria-activedescendant="">' +
          '<kbd class="sc3-kbd">Esc</kbd></div>' +
        '<ul class="sc3-palette-list" id="sc3-search-list" role="listbox" aria-label="Results"></ul>' +
        '<div class="sc3-palette-foot"><span><kbd class="sc3-kbd">↑</kbd><kbd class="sc3-kbd">↓</kbd> move</span><span><kbd class="sc3-kbd">Enter</kbd> open</span><span><kbd class="sc3-kbd">Esc</kbd> close</span></div>' +
      '</div>';

    // Content stays where the console put it. A console <main> that is a direct child of
    // <body> is used as is (never moved, so iframes inside it do not reload); any other
    // element is wrapped in a new <main> at its own position.
    var content = null, main;
    if (typeof m.content === 'string') content = document.querySelector(m.content);
    else if (m.content && m.content.nodeType === 1) content = m.content;
    if (content && content.tagName === 'MAIN' && content.parentNode === body) {
      main = content;
    } else {
      main = el('main', { 'data-sc3-wrap': '' });
      if (content) { content.parentNode.insertBefore(main, content); main.appendChild(content); }
      else body.appendChild(main);
    }
    if (!main.id) main.id = 'sc3-main';
    main.classList.add('sc3-main');
    main.setAttribute('tabindex', '-1');
    var skip = el('a', { class: 'sc3-skip', href: '#' + main.id }, 'Skip to content');

    var sectionbar = el('div', { class: 'sc3-sectionbar', role: 'navigation', 'aria-label': 'Sections on this page', hidden: true });
    sectionbar.innerHTML =
      '<button type="button" class="sc3-iconbtn sc3-sec-prev" aria-label="Previous section" title="Previous section (K)">' + icon('chevron', 'sc3-rot90') + '</button>' +
      '<label class="sc3-sr" for="sc3-sec-select">Jump to section</label>' +
      '<select id="sc3-sec-select" class="sc3-sec-select"></select>' +
      '<button type="button" class="sc3-iconbtn sc3-sec-next" aria-label="Next section" title="Next section (J)">' + icon('chevron', 'sc3-rot270') + '</button>' +
      '<button type="button" class="sc3-sec-top">Top</button>' +
      '<button type="button" class="sc3-sec-mode" aria-pressed="false" hidden>Show all</button>';
    // Frame chrome goes in front of <main>; the layout is done in CSS (fixed menu, sticky bars).
    [skip, top, menu, scrim, sectionbar].forEach(function (n) { body.insertBefore(n, main); });
    body.insertBefore(palette, body.firstChild);
    // Light field behind every console (the hub draws its own, stronger one).
    if (!document.querySelector('.home-aurora') && !body.querySelector(':scope > .sc3-field')) {
      var field = el('div', { class: 'sc3-field', 'aria-hidden': 'true' });
      field.innerHTML = '<i class="sc3-field-a"></i><i class="sc3-field-b"></i><i class="sc3-field-c"></i>';
      body.insertBefore(field, body.firstChild);
    }
    wireFieldSpot();

    state.ui = { top: top, menu: menu, scrim: scrim, main: main, palette: palette, sectionbar: sectionbar, render: {} };
    buildMenu(parent);
    buildControls();
    wireSwitcher();
    wireDrawer();
    wireSearch();
    wireProgress();
    wireSections();
    wireKeys();
    if (read(KEYS.menuHidden, '0') === '1') document.documentElement.classList.add('sc3-menu-hidden');
  }

  function buildMenu(parent) {
    var m = state.manifest, ui = state.ui, menu = ui.menu;
    var collapsed = (readJSON(KEYS.menu, {})[m.id]) || [];
    var html = '<div class="sc3-menu-scroll">';
    if (parent) {
      html += '<a class="sc3-menu-back" href="' + esc(parent.href) + '" data-console-target="' + esc(parent.id) + '">' + icon('back') +
        '<span>Back to ' + esc(parent.short) + '</span></a>';
    }
    // The hub needs no title in its menu (the logo says it); consoles show their icon and name.
    var isHub = state.console.id === 'home';
    html += '<div class="sc3-menu-head">' + (isHub ? '' : '<div class="sc3-menu-id"><span class="sc3-menu-mark" aria-hidden="true">' + icon(state.console.icon || 'home') + '</span>' +
      '<span class="sc3-menu-names"><span class="sc3-menu-title">' + esc(m.title || state.console.name) + '</span></span></div>') +
      '<button type="button" class="sc3-iconbtn sc3-drawer-close" aria-label="Close menu">' + icon('close') + '</button></div>';
    state.groups.forEach(function (g) {
      var isCollapsed = collapsed.indexOf(g.key) >= 0;
      var listId = 'sc3-g-' + g.key;
      html += '<section class="sc3-group' + (isCollapsed ? ' is-collapsed' : '') + '" data-group="' + esc(g.key) + '">';
      if (g.label) {
        html += '<button type="button" class="sc3-group-btn" data-nav aria-expanded="' + (!isCollapsed) + '" aria-controls="' + listId + '">' +
          '<span>' + esc(g.label) + '</span><span class="sc3-group-count">' + g.views.length + '</span>' + icon('chevron', 'sc3-caret') + '</button>';
      }
      html += '<ul class="sc3-group-list" id="' + listId + '"' + (isCollapsed ? ' hidden' : '') + '>';
      g.views.forEach(function (v) {
        var href = v.href || ('#/' + v.id);
        html += '<li><a class="sc3-item" data-nav data-view="' + esc(v.id) + '" href="' + esc(href) + '"' + (v.href ? ' data-console-target="' + esc(v.console || '') + '"' : '') + '>' +
          '<span class="sc3-pdot" data-state="none" aria-hidden="true"></span>' + consoleMark(v.console) +
          '<span class="sc3-item-label">' + esc(labelFor(v)) + '</span>' +
          (v.badge ? '<span class="sc3-badge">' + esc(v.badge) + '</span>' : '') +
          '<span class="sc3-sr" data-sr-state></span></a>';
        html += '</li>';
      });
      html += '</ul></section>';
    });
    html += '</div><div class="sc3-menu-foot">' +
      '<div class="sc3-drawer-controls" data-sc3-drawer-controls></div>' +
      '</div>';
    menu.innerHTML = html;

    menu.addEventListener('click', function (e) {
      var gb = e.target.closest('.sc3-group-btn');
      if (gb) { toggleGroup(gb.parentNode); return; }
      var a = e.target.closest('a[data-view]');
      if (a && !a.hasAttribute('data-console-target')) {
        e.preventDefault();
        closeDrawer();
        navigate(a.dataset.view, a.dataset.anchor || null);
      }
      if (e.target.closest('.sc3-drawer-close')) closeDrawer(true);
    });
    menu.addEventListener('keydown', menuKeys);

    ui.render.active = function () {
      var cur = state.current && state.current.id;
      menu.querySelectorAll('.sc3-sublist').forEach(function (n) { n.remove(); });
      state.sections = childrenOf(state.current);
      if (state.sections.length) {
        var host = menu.querySelector('.sc3-item[data-view="' + (window.CSS && CSS.escape ? CSS.escape(cur) : cur) + '"]');
        if (host) host.parentNode.insertAdjacentHTML('beforeend', sublistHTML(state.current, state.sections));
      }
      if (ui.render.sections) ui.render.sections();
      menu.querySelectorAll('.sc3-item').forEach(function (a) {
        var on = a.dataset.view === cur;
        a.classList.toggle('is-active', on);
        if (on) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current');
        if (on) {
          var sec = a.closest('.sc3-group');
          if (sec && sec.classList.contains('is-collapsed')) toggleGroup(sec, true);
        }
      });
      rovingReset();
      var crumbs = ui.top.querySelector('.sc3-crumbs ol');
      var v = state.current, parts = [];
      if (v && v.group.label) parts.push('<li class="sc3-crumb-group">' + esc(v.group.label) + '</li>');
      if (v) parts.push('<li class="sc3-crumb-view" aria-current="page">' + esc(labelFor(v)) + '</li>');
      crumbs.innerHTML = parts.join('');
      document.title = (v ? v.title + ' · ' : '') + (state.manifest.docTitle || state.console.name);
    };
  }

  function toggleGroup(section, forceOpen) {
    var btn = section.querySelector('.sc3-group-btn'), list = section.querySelector('.sc3-group-list');
    var open = forceOpen === true ? true : section.classList.contains('is-collapsed');
    section.classList.toggle('is-collapsed', !open);
    list.hidden = !open;
    if (btn) btn.setAttribute('aria-expanded', String(open));
    var all = readJSON(KEYS.menu, {}), mine = all[state.manifest.id] || [], key = section.dataset.group;
    mine = mine.filter(function (k) { return k !== key; });
    if (!open) mine.push(key);
    all[state.manifest.id] = mine;
    write(KEYS.menu, JSON.stringify(all));
    rovingReset();
  }

  /* Roving tabindex: one tab stop in the menu, arrows move inside it. */
  function navItems() {
    return Array.prototype.filter.call(state.ui.menu.querySelectorAll('[data-nav]'), function (n) {
      return !n.closest('[hidden]');
    });
  }
  function rovingReset() {
    var items = navItems(), active = state.ui.menu.querySelector('.sc3-item.is-active');
    var target = items.indexOf(active) >= 0 ? active : items[0];
    items.forEach(function (n) { n.setAttribute('tabindex', n === target ? '0' : '-1'); });
    state.ui.menu.querySelectorAll('[data-nav]').forEach(function (n) { if (items.indexOf(n) < 0) n.setAttribute('tabindex', '-1'); });
  }
  function focusItem(n) {
    navItems().forEach(function (x) { x.setAttribute('tabindex', x === n ? '0' : '-1'); });
    n.focus();
  }
  function menuKeys(e) {
    var items = navItems(), i = items.indexOf(document.activeElement);
    if (i < 0) return;
    var cur = items[i], section = cur.closest('.sc3-group');
    if (e.key === 'ArrowDown') { e.preventDefault(); focusItem(items[Math.min(items.length - 1, i + 1)]); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); focusItem(items[Math.max(0, i - 1)]); }
    else if (e.key === 'Home') { e.preventDefault(); focusItem(items[0]); }
    else if (e.key === 'End') { e.preventDefault(); focusItem(items[items.length - 1]); }
    else if (e.key === 'ArrowLeft' && section) {
      e.preventDefault();
      var gb = section.querySelector('.sc3-group-btn');
      if (cur === gb && !section.classList.contains('is-collapsed')) toggleGroup(section);
      else if (gb) focusItem(gb);
    } else if (e.key === 'ArrowRight' && section && cur.classList.contains('sc3-group-btn')) {
      e.preventDefault();
      if (section.classList.contains('is-collapsed')) toggleGroup(section, true);
      else { var first = section.querySelector('.sc3-item'); if (first) focusItem(first); }
    }
  }

  function setMenuHidden(hidden) {
    document.documentElement.classList.toggle('sc3-menu-hidden', hidden);
    write(KEYS.menuHidden, hidden ? '1' : '0');
    syncMenuToggle();
  }
  // One control for the menu: the button at the top left shows and hides it on every screen size.
  function syncMenuToggle() {
    var t = state.ui && state.ui.top.querySelector('.sc3-menu-toggle');
    if (!t || narrow.matches) return;
    var hidden = document.documentElement.classList.contains('sc3-menu-hidden');
    t.setAttribute('aria-expanded', String(!hidden));
    t.setAttribute('aria-label', hidden ? 'Show menu' : 'Hide menu');
    t.title = (hidden ? 'Show menu' : 'Hide menu') + ' ([)';
  }

  /* ---------- Controls: theme, language, reading size ---------- */
  function buildControls() {
    var m = state.manifest, ui = state.ui;
    var langs = m.i18n && m.i18n.langs && m.i18n.langs.length > 1 ? m.i18n.langs : null;
    function controlsHTML(where) {
      var h = '';
      if (langs) {
        h += '<div class="sc3-seg" role="group" aria-label="Language">';
        langs.forEach(function (l) { h += '<button type="button" class="sc3-seg-btn" data-lang="' + esc(l.code) + '" aria-pressed="false" title="' + esc(l.name) + '">' + esc(l.label) + '</button>'; });
        h += '</div>';
      }
      h += '<div class="sc3-reading-wrap">' +
        '<button type="button" class="sc3-iconbtn sc3-reading-btn" aria-haspopup="true" aria-expanded="false" aria-controls="sc3-reading-' + where + '" aria-label="Reading size">' + icon('text') + '</button>' +
        '<div class="sc3-pop sc3-reading-pop" id="sc3-reading-' + where + '" hidden>' +
          '<p class="sc3-pop-title">Text size</p><div class="sc3-seg sc3-seg-wide" role="group" aria-label="Text size">' +
          SIZES.map(function (s) { return '<button type="button" class="sc3-seg-btn" data-size="' + s + '" aria-pressed="false">' + s.charAt(0).toUpperCase() + s.slice(1) + '</button>'; }).join('') +
          '</div><label class="sc3-check"><input type="checkbox" data-focus-toggle id="sc3-focus-' + where + '"><span><b>Focus layout</b><small>One column, narrower lines.</small></span></label>' +
        '</div></div>' +
        '<button type="button" class="sc3-iconbtn sc3-theme-btn" aria-pressed="false" aria-label="Dark theme">' + icon('moon', 'sc3-i-moon') + icon('sun', 'sc3-i-sun') + '</button>';
      return h;
    }
    var topControls = ui.top.querySelector('[data-sc3-controls]');
    var drawerControls = ui.menu.querySelector('[data-sc3-drawer-controls]');
    topControls.innerHTML = controlsHTML('top');
    drawerControls.innerHTML = controlsHTML('drawer');

    [topControls, drawerControls].forEach(function (box) {
      box.addEventListener('click', function (e) {
        var b;
        if ((b = e.target.closest('.sc3-theme-btn'))) setTheme(effectiveTheme() === 'dark' ? 'light' : 'dark');
        else if ((b = e.target.closest('[data-lang]'))) setLang(b.dataset.lang);
        else if ((b = e.target.closest('[data-size]'))) saveReading({ size: b.dataset.size, focus: readingPrefs().focus });
        else if ((b = e.target.closest('.sc3-reading-btn'))) togglePop(b, b.parentNode.querySelector('.sc3-reading-pop'));
      });
      box.addEventListener('change', function (e) {
        if (e.target.matches('[data-focus-toggle]')) saveReading({ size: readingPrefs().size, focus: e.target.checked });
      });
    });

    ui.render.theme = function () {
      var dark = effectiveTheme() === 'dark';
      document.querySelectorAll('.sc3-theme-btn').forEach(function (b) {
        b.setAttribute('aria-pressed', String(dark));
        b.setAttribute('title', dark ? 'Switch to light theme' : 'Switch to dark theme');
      });
    };
    ui.render.reading = function (p) {
      document.querySelectorAll('[data-size]').forEach(function (b) { b.setAttribute('aria-pressed', String(b.dataset.size === p.size)); });
      document.querySelectorAll('[data-focus-toggle]').forEach(function (i) { i.checked = p.focus; });
    };
    ui.render.lang = function () {
      if (!langs) return;
      var cur = currentLang();
      document.querySelectorAll('[data-lang]').forEach(function (b) { b.setAttribute('aria-pressed', String(b.dataset.lang === cur)); });
      ui.menu.querySelectorAll('.sc3-item[data-view]').forEach(function (a) {
        var v = state.byId[a.dataset.view], node = a.querySelector('.sc3-item-label');
        if (v && node) node.textContent = labelFor(v);
      });
      if (ui.render.active && state.current) ui.render.active();
    };
  }
  function currentLang() {
    var i = state.manifest.i18n;
    try { return (i && i.get && i.get()) || 'en'; } catch (e) { return 'en'; }
  }
  function setLang(code) {
    var i = state.manifest.i18n;
    try { if (i && i.set) i.set(code); } catch (e) { if (window.console) console.error('[StudyShell] language switch failed', e); }
    state.ui.render.lang();
  }

  /* ---------- Popovers ---------- */
  var openPop = null;
  function togglePop(btn, pop) {
    if (openPop && openPop.pop === pop) { closePop(true); return; }
    closePop(false);
    pop.hidden = false; btn.setAttribute('aria-expanded', 'true');
    openPop = { btn: btn, pop: pop };
    var first = pop.querySelector('a,button,input');
    if (first) first.focus();
  }
  function closePop(refocus) {
    if (!openPop) return;
    openPop.pop.hidden = true; openPop.btn.setAttribute('aria-expanded', 'false');
    if (refocus) openPop.btn.focus();
    openPop = null;
  }
  document.addEventListener('click', function (e) {
    if (openPop && !openPop.pop.contains(e.target) && !openPop.btn.contains(e.target)) closePop(false);
  });
  document.addEventListener('focusin', function (e) {
    if (openPop && !openPop.pop.contains(e.target) && !openPop.btn.contains(e.target)) closePop(false);
  });

  /* Small icon tile in a console's own colour, the same style as the hub's console tiles. */
  function accentVars(c) { return '--row-l:' + esc(c.accent.light) + ';--row-d:' + esc(c.accent.dark); }
  function consoleMark(id) {
    var c = id && consoleById(id);
    return c && c.accent ? '<span class="sc3-item-mark" style="' + accentVars(c) + '" aria-hidden="true">' + icon(c.icon) + '</span>' : '';
  }

  /* ---------- Console switcher ---------- */
  function wireSwitcher() {
    var ui = state.ui, btn = ui.top.querySelector('.sc3-switch-btn'), pop = ui.top.querySelector('.sc3-switch-pop');
    function row(c) {
      var cur = c.id === state.console.id;
      return '<a class="sc3-switch-row' + (cur ? ' is-current' : '') + '" href="' + esc(c.href) + '" data-console-target="' + esc(c.id) + '"' +
        (cur ? ' aria-current="page"' : '') + ' style="' + accentVars(c) + '">' +
        '<span class="sc3-switch-icon">' + icon(c.icon) + '</span>' +
        '<span class="sc3-switch-copy"><b>' + esc(c.name) + '</b><span>' + esc(c.code) + (c.blurb ? ' · ' + esc(c.blurb) : '') + '</span></span></a>';
    }
    function render() {
      var subjects = CONSOLES.filter(function (c) { return c.group === 'subjects'; });
      var lab = CONSOLES.filter(function (c) { return c.group === 'lab'; });
      var cert = CONSOLES.filter(function (c) { return c.group === 'cert'; });
      pop.innerHTML = row(consoleById('home')) +
        '<p class="sc3-pop-title">Subjects</p>' + subjects.map(row).join('') +
        '<p class="sc3-pop-title">Engineering Lab</p>' + lab.map(row).join('') +
        (cert.length ? '<p class="sc3-pop-title">Certification</p>' + cert.map(row).join('') : '');
    }
    btn.addEventListener('click', function () { render(); togglePop(btn, pop); });
    pop.addEventListener('keydown', function (e) {
      var links = Array.prototype.slice.call(pop.querySelectorAll('a')), i = links.indexOf(document.activeElement);
      if (e.key === 'ArrowDown') { e.preventDefault(); links[(i + 1) % links.length].focus(); }
      if (e.key === 'ArrowUp') { e.preventDefault(); links[(i - 1 + links.length) % links.length].focus(); }
    });
  }

  /* ---------- Drawer (narrow screens) ---------- */
  var narrow = window.matchMedia ? window.matchMedia('(max-width: 899px)') : { matches: false, addEventListener: function () {} };
  function openDrawer() {
    var ui = state.ui;
    document.documentElement.classList.add('sc3-drawer-open');
    ui.scrim.hidden = false;
    ui.top.querySelector('.sc3-menu-toggle').setAttribute('aria-expanded', 'true');
    ui.top.querySelector('.sc3-menu-toggle').setAttribute('aria-label', 'Close menu');
    ui.main.setAttribute('inert', '');
    var active = ui.menu.querySelector('.sc3-item.is-active') || navItems()[0];
    if (active) focusItem(active);
  }
  function closeDrawer(refocus) {
    var ui = state.ui;
    if (!document.documentElement.classList.contains('sc3-drawer-open')) return;
    document.documentElement.classList.remove('sc3-drawer-open');
    ui.scrim.hidden = true;
    ui.main.removeAttribute('inert');
    var t = ui.top.querySelector('.sc3-menu-toggle');
    t.setAttribute('aria-expanded', 'false'); t.setAttribute('aria-label', 'Open menu');
    if (refocus) t.focus();
  }
  function wireDrawer() {
    var ui = state.ui;
    ui.top.querySelector('.sc3-menu-toggle').addEventListener('click', function () {
      if (!narrow.matches) { setMenuHidden(!document.documentElement.classList.contains('sc3-menu-hidden')); return; }
      if (document.documentElement.classList.contains('sc3-drawer-open')) closeDrawer(true); else openDrawer();
    });
    ui.scrim.addEventListener('click', function () { closeDrawer(true); });
    syncMenuToggle();
    if (narrow.addEventListener) narrow.addEventListener('change', syncMenuToggle);
    ui.menu.addEventListener('keydown', function (e) {
      if (e.key !== 'Tab' || !document.documentElement.classList.contains('sc3-drawer-open')) return;
      var f = Array.prototype.filter.call(ui.menu.querySelectorAll('a[href],button,input'), function (n) {
        return !n.closest('[hidden]') && n.getClientRects().length && n.getAttribute('tabindex') !== '-1';
      });
      if (!f.length) return;
      if (e.shiftKey && document.activeElement === f[0]) { e.preventDefault(); f[f.length - 1].focus(); }
      else if (!e.shiftKey && document.activeElement === f[f.length - 1]) { e.preventDefault(); f[0].focus(); }
    });
    var onChange = function () { if (!narrow.matches) closeDrawer(false); };
    if (narrow.addEventListener) narrow.addEventListener('change', onChange); else if (narrow.addListener) narrow.addListener(onChange);
  }

  /* ---------- Search palette ---------- */
  var index = [], results = [], sel = 0, lastFocus = null;
  function wireSearch() {
    var ui = state.ui, pal = ui.palette, input = pal.querySelector('input'), list = pal.querySelector('.sc3-palette-list');
    ui.top.querySelector('.sc3-search-btn').addEventListener('click', openSearch);
    input.addEventListener('input', function () { sel = 0; renderResults(); });
    input.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowDown') { e.preventDefault(); sel = Math.min(results.length - 1, sel + 1); paintSel(); }
      else if (e.key === 'ArrowUp') { e.preventDefault(); sel = Math.max(0, sel - 1); paintSel(); }
      else if (e.key === 'Enter') { e.preventDefault(); pick(results[sel]); }
    });
    list.addEventListener('click', function (e) {
      var li = e.target.closest('[data-i]');
      if (li) { e.preventDefault(); pick(results[+li.dataset.i]); }
    });
    pal.addEventListener('mousedown', function (e) { if (e.target === pal) closeSearch(true); });
    function renderResults() {
      var q = input.value.trim().toLowerCase();
      if (!q) {
        results = index.filter(function (it) { return it.type === 'page'; }).slice(0, 12);
      } else {
        results = index.map(function (it) { return { it: it, s: score(it, q) }; })
          .filter(function (x) { return x.s >= 0; })
          .sort(function (a, b) { return b.s - a.s; })
          .slice(0, 30).map(function (x) { return x.it; });
      }
      var label = { page: 'Page', section: 'Section', term: 'Term', console: 'Console', link: 'Page' };
      var ic = { page: 'page', section: 'hash', term: 'text', console: 'arrow', link: 'page' };
      list.innerHTML = results.length ? results.map(function (r, i) {
        return '<li role="option" id="sc3-opt-' + i + '" data-i="' + i + '" aria-selected="false">' + icon(ic[r.type]) +
          '<span class="sc3-opt-title">' + esc(r.title) + '</span><span class="sc3-opt-meta">' + esc(r.type === 'page' ? r.meta || label.page : r.meta) + '</span>' +
          '<span class="sc3-opt-type">' + label[r.type] + '</span></li>';
      }).join('') : '<li class="sc3-empty">No pages or terms match "' + esc(input.value) + '". Try a shorter word.</li>';
      paintSel();
    }
    function paintSel() {
      list.querySelectorAll('[data-i]').forEach(function (li) {
        var on = +li.dataset.i === sel;
        li.setAttribute('aria-selected', String(on));
        if (on) { input.setAttribute('aria-activedescendant', li.id); li.scrollIntoView({ block: 'nearest' }); }
      });
    }
    state.ui.render.search = renderResults;
  }
  function openSearch() {
    var pal = state.ui.palette, input = pal.querySelector('input');
    lastFocus = document.activeElement;
    index = buildIndex();
    closePop(false); closeDrawer(false);
    pal.hidden = false;
    document.documentElement.classList.add('sc3-palette-open');
    input.value = ''; sel = 0;
    state.ui.render.search();
    input.focus();
  }
  function closeSearch(refocus) {
    var pal = state.ui.palette;
    if (pal.hidden) return;
    pal.hidden = true;
    document.documentElement.classList.remove('sc3-palette-open');
    if (refocus && lastFocus && lastFocus.focus) lastFocus.focus();
  }
  function pick(r) {
    if (!r) return;
    closeSearch(false);
    if (r.type === 'console') { goConsole(r.console, r.href); return; }
    if (r.type === 'link') { location.href = r.href; return; }
    navigate(r.view, r.anchor);
  }

  /* ---------- Progress ---------- */
  function wireProgress() {
    var ui = state.ui, btn = ui.top.querySelector('.sc3-progress'), pop = ui.top.querySelector('.sc3-progress-pop');
    btn.addEventListener('click', function () { togglePop(btn, pop); });
    pop.addEventListener('click', function (e) {
      var a = e.target.closest('a[data-view]');
      if (a) { e.preventDefault(); closePop(false); navigate(a.dataset.view); return; }
      var t = e.target.closest('[data-mark-done]');
      if (t && state.current) {
        setDone(state.current.id, t.getAttribute('aria-pressed') !== 'true');
        state.ui.render.progress();
        var again = pop.querySelector('[data-mark-done]');
        if (again) again.focus();
      }
    });
    ui.render.progress = function () {
      var p = progressMap(), ids = Object.keys(p);
      var done = ids.filter(function (k) { return p[k] === 'done'; }).length;
      var visited = ids.filter(function (k) { return p[k] === 'visited'; }).length;
      var total = ids.length, pct = total ? Math.round(done / total * 100) : 0;
      var r = 8, C = 2 * Math.PI * r, dash = (C * pct / 100).toFixed(2);
      btn.innerHTML = '<svg class="sc3-ring" viewBox="0 0 20 20" aria-hidden="true"><circle cx="10" cy="10" r="' + r + '" class="sc3-ring-bg"/>' +
        '<circle cx="10" cy="10" r="' + r + '" class="sc3-ring-fg" stroke-dasharray="' + dash + ' ' + C.toFixed(2) + '"/></svg>' +
        '<span class="sc3-progress-text">' + done + '<span class="sc3-progress-total">/' + total + '</span></span>';
      btn.setAttribute('aria-label', 'Progress: ' + done + ' of ' + total + ' pages done, ' + visited + ' visited');
      btn.hidden = total === 0;
      var next = null, n = state.views.length, start = Math.max(0, state.views.indexOf(state.current));
      for (var k = 1; k <= n && !next; k++) { var v = state.views[(start + k) % n]; if (p[v.id] && p[v.id] !== 'done' && v !== state.current) next = v; }
      pop.innerHTML = '<p class="sc3-pop-title">' + esc(state.console.short) + ' progress</p>' +
        '<div class="sc3-meter" role="img" aria-label="' + pct + ' percent done"><span style="width:' + pct + '%"></span></div>' +
        '<dl class="sc3-stats"><div><dt>Done</dt><dd>' + done + '</dd></div><div><dt>Visited</dt><dd>' + visited + '</dd></div><div><dt>Not started</dt><dd>' + (total - done - visited) + '</dd></div></dl>' +
        (state.current && p[state.current.id] ? '<button type="button" class="sc3-mark" data-mark-done aria-pressed="' + (p[state.current.id] === 'done') + '">' +
          '<span class="sc3-mark-box" aria-hidden="true"></span><span>' + (p[state.current.id] === 'done' ? 'Marked done: ' : 'Mark done: ') + esc(state.current.title) + '</span></button>' : '') +
        (next ? '<a class="sc3-next" href="#/' + esc(next.id) + '" data-view="' + esc(next.id) + '">Next: ' + esc(next.title) + icon('arrow') + '</a>' : '') +
        (state.manifest.progressNote ? '<p class="sc3-pop-note">' + esc(state.manifest.progressNote) + '</p>' : '') +
        '<p class="sc3-pop-note">Saved in this browser only.</p>';
      state.ui.menu.querySelectorAll('.sc3-item').forEach(function (a) {
        var s = p[a.dataset.view] || 'none';
        a.querySelector('.sc3-pdot').setAttribute('data-state', s);
        a.querySelector('[data-sr-state]').textContent = s === 'done' ? ', done' : s === 'visited' ? ', visited' : '';
      });
    };
  }

  /* ---------- Wide reference tables scroll inside their own box (as v2 reading.js did) ---------- */
  var seenTables = typeof WeakSet === 'function' ? new WeakSet() : null;
  function clippedByAncestor(node, stop) {
    for (var p = node.parentElement; p && p !== stop; p = p.parentElement) {
      if (/(auto|scroll|hidden|clip)/.test(getComputedStyle(p).overflowX)) return true;
    }
    return false;
  }
  function wrapTables(root) {
    if (!root || !seenTables) return;
    Array.prototype.forEach.call(root.querySelectorAll('table'), function (t) {
      if (seenTables.has(t)) return;
      seenTables.add(t);
      if (t.getAttribute('role') === 'presentation' || t.querySelector('input,select,textarea,button,svg,canvas')) return;
      if (clippedByAncestor(t, root)) return;
      var box = document.createElement('div');
      box.className = 'sc-table-scroll';
      box.tabIndex = 0;
      box.setAttribute('role', 'region');
      box.setAttribute('aria-label', t.caption ? t.caption.textContent.trim() : 'Table');
      t.parentNode.insertBefore(box, t);
      box.appendChild(t);
    });
  }
  function watchTables(main) {
    wrapTables(main);
    if (!window.MutationObserver) return;
    var pending = null;
    new MutationObserver(function () {
      if (pending) return;
      pending = setTimeout(function () { pending = null; wrapTables(main); }, 150);
    }).observe(main, { childList: true, subtree: true });
  }

  /* ---------- Section bar (pages with sections) ---------- */
  function wireSections() {
    var ui = state.ui, bar = ui.sectionbar, sel = bar.querySelector('select');
    var prev = bar.querySelector('.sc3-sec-prev'), next = bar.querySelector('.sc3-sec-next');
    function idx() { return sel.selectedIndex; }
    function go(i) {
      var s = state.sections || [];
      if (i < 0 || i >= s.length) return;
      sel.selectedIndex = i;
      navigate(state.current.id, s[i].id, { keepScroll: true, replace: true });
    }
    sel.addEventListener('change', function () { go(sel.selectedIndex); });
    prev.addEventListener('click', function () { go(idx() - 1); });
    next.addEventListener('click', function () { go(idx() + 1); });
    bar.querySelector('.sc3-sec-top').addEventListener('click', function () { window.scrollTo(0, 0); });
    ui.render.sections = function () {
      // The section bar is retired: sections are reached from the menu. The select is still
      // filled so the menu can highlight the section in view.
      var s = state.sections || [], show = s.length > 1 && !(state.current && state.current.sectionBar === false);
      bar.hidden = true;
      document.documentElement.classList.remove('sc3-has-sections');
      rememberSections(false);
      if (!show) { setupPaging(); return; }
      sel.innerHTML = s.map(function (c) { return '<option value="' + esc(c.id) + '">' + esc((c.badge ? c.badge + ' · ' : '') + c.title) + '</option>'; }).join('');
      setupPaging();
      sync();
    };
    var mode = bar.querySelector('.sc3-sec-mode');
    mode.addEventListener('click', function () {
      write(KEYS.paged, pagedPref() ? '0' : '1');
      var keep = state.paging && state.paging.active ? state.paging.tops[state.paging.cur] : null;
      setupPaging(keep ? keep.el.id : null);
      if (keep) jumpToAnchor(keep.el.id); else sync();
    });
    ui.render.syncSection = function (id) {
      var s = state.sections || [];
      for (var i = 0; i < s.length; i++) if (s[i].id === id) { sel.selectedIndex = i; break; }
      buttons();
    };
    function buttons() {
      prev.disabled = idx() <= 0; next.disabled = idx() >= (state.sections || []).length - 1;
      var curId = sel.value;
      ui.menu.querySelectorAll('.sc3-subitem').forEach(function (a) {
        var on = a.dataset.anchor === curId;
        a.classList.toggle('is-current', on);
        if (on) a.setAttribute('aria-current', 'location'); else a.removeAttribute('aria-current');
      });
    }
    function sync() {
      if (state.sectionLock && Date.now() < state.sectionLock) return;
      var s = state.sections || [], best = -1, first = -1, line = ui.top.getBoundingClientRect().bottom + bar.offsetHeight + 24;
      for (var i = 0; i < s.length; i++) {
        var n = document.getElementById(s[i].id);
        if (!n || !n.getClientRects().length) continue;
        if (first < 0) first = i;
        if (n.getBoundingClientRect().top <= line) best = i;
      }
      if (best < 0) best = Math.max(0, first);
      sel.selectedIndex = best; buttons();
    }
    var t = null;
    window.addEventListener('scroll', function () {
      if (t || bar.hidden) return;
      t = setTimeout(function () { t = null; if (state.ui === ui && !bar.hidden) sync(); }, 120);
    }, { passive: true });
    ui.render.stepSection = function (d) { if (!bar.hidden) go(idx() + d); };
  }

  /* ---------- Global keys ---------- */
  var keysWired = false;
  function wireKeys() {
    if (keysWired) return;
    keysWired = true;
    document.addEventListener('keydown', function (e) {
      if (!state.ui) return;
      var t = e.target, typing = t && (t.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName));
      if (e.key === 'Escape') {
        if (!state.ui.palette.hidden) { closeSearch(true); return; }
        if (openPop) { closePop(true); return; }
        closeDrawer(true);
        return;
      }
      if ((e.key === 'k' || e.key === 'K') && (e.metaKey || e.ctrlKey)) { e.preventDefault(); openSearch(); return; }
      if (typing || e.metaKey || e.ctrlKey || e.altKey) return;
      if (e.key === '/') { e.preventDefault(); openSearch(); }
      else if ((e.key === 'j' || e.key === 'J') && state.ui.render.stepSection) state.ui.render.stepSection(1);
      else if ((e.key === 'k' || e.key === 'K') && state.ui.render.stepSection) state.ui.render.stepSection(-1);
      else if (e.key === '[' && !narrow.matches) setMenuHidden(!document.documentElement.classList.contains('sc3-menu-hidden'));
    });
    window.addEventListener('hashchange', function () {
      var h = state.ui && parseHash();
      if (h) show(h.view, h.anchor, { keepScroll: false });
    });
  }

  /* ---------- Cross-console navigation ---------- */
  var consoleNavigator = null;   // prototype hook; real pages follow the link
  // Fetch the next console's HTML while the pointer rests on its link (Chrome; ignored elsewhere).
  function addPrefetchRules() {
    try {
      if (!HTMLScriptElement.supports || !HTMLScriptElement.supports('speculationrules') || document.getElementById('sc3-spec')) return;
      var sr = document.createElement('script');
      sr.type = 'speculationrules'; sr.id = 'sc3-spec';
      sr.textContent = JSON.stringify({ prefetch: [{ where: { selector_matches: 'a[data-console-target]' }, eagerness: 'moderate' }] });
      document.head.appendChild(sr);
    } catch (e) { /* not supported */ }
  }
  function goConsole(id, href) {
    if (consoleNavigator && consoleNavigator(id) !== false) return;
    location.href = href || (consoleById(id) || {}).href || HOME;
  }
  document.addEventListener('click', function (e) {
    var a = e.target.closest && e.target.closest('a[data-console-target]');
    if (!a || !a.dataset.consoleTarget || e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
    if (consoleNavigator) { e.preventDefault(); closePop(false); closeDrawer(false); goConsole(a.dataset.consoleTarget, a.href); }
  });

  /* ---------- Mount ---------- */
  function mount(manifest) {
    // Rollback is handled by boot.js (it redirects to the console's frozen v2 page).
    // Without boot.js (the prototype), ?ui=v2 still disables the frame for a quick comparison.
    if (!document.documentElement.classList.contains('sc-v3') && uiOverride() === 'v2') { document.documentElement.setAttribute('data-sc-ui', 'v2'); return false; }
    if (!manifest || !manifest.id) throw new Error('StudyShell.mount needs a manifest with an id');
    if (state.ui) unmount();
    state.manifest = manifest;
    state.bareLoad = !location.hash || location.hash === '#';
    state.console = consoleById(manifest.kind === 'exam' ? manifest.parent : manifest.id) ||
      { id: manifest.id, code: manifest.code || manifest.id.toUpperCase(), name: manifest.title, short: manifest.title, accent: manifest.accent };
    var n = normalize(manifest);
    state.groups = n.groups; state.views = n.views; state.byId = n.byId; state.current = null;
    document.documentElement.setAttribute('data-sc-ui', 'v3');
    var t = storedTheme();
    applyTheme(t || effectiveTheme());
    build();
    addPrefetchRules();
    applyReading(readingPrefs());
    state.ui.render.theme();
    state.ui.render.lang();
    var h = parseHash();
    var restore = null;
    try { restore = manifest.restore ? manifest.restore() : null; } catch (e) { restore = null; }
    var start = (h && state.byId[h.view]) ? h : { view: (restore && state.byId[restore]) ? restore : (manifest.defaultView || (state.views[0] && state.views[0].id)), anchor: null };
    navigate(start.view, start.anchor, { replace: true, initial: true });
    watchViews();
    setTimeout(function () { if (state.ui) watchTables(state.ui.main); }, 0);
    return true;
  }
  function unmount() {
    var b = document.body;
    clearPaging();
    if (state.viewWatch) { state.viewWatch.disconnect(); state.viewWatch = null; }
    ['.sc3-skip', '.sc3-top', '.sc3-palette', '.sc3-menu', '.sc3-scrim', '.sc3-sectionbar', '.sc3-field'].forEach(function (s) { var n = b.querySelector(s); if (n) n.remove(); });
    var main = b.querySelector('main.sc3-main');
    if (main && main.hasAttribute('data-sc3-wrap')) {
      while (main.firstChild) main.parentNode.insertBefore(main.firstChild, main);
      main.remove();
    } else if (main) main.classList.remove('sc3-main');
    document.documentElement.classList.remove('sc3-drawer-open', 'sc3-palette-open');
    openPop = null;
    state.ui = null;
  }
  if (media) {
    var onScheme = function () { if (!read(KEYS.theme, null) && state.ui) applyTheme(effectiveTheme()); };
    if (media.addEventListener) media.addEventListener('change', onScheme); else if (media.addListener) media.addListener(onScheme);
  }

  /* Consoles register with StudyConsole.push(manifest); this works whether the
     console's script runs before or after this file has loaded. */
  var queued = window.StudyConsole;
  window.StudyConsole = { push: function (m) { mount(m); return 1; } };

  window.StudyShell = {
    version: '3.0.0-proto',
    consoles: CONSOLES,
    keys: KEYS,
    icon: icon,
    mount: mount,
    navigate: navigate,
    refreshProgress: function () { if (state.ui) state.ui.render.progress(); },
    refreshSections: function () { if (state.ui) state.ui.render.active(); },
    reveal: function (el) { return reveal(el); },
    setTheme: setTheme,
    openSearch: openSearch,
    current: function () { return state.current && state.current.id; },
    _setConsoleNavigator: function (fn) { consoleNavigator = fn; }
  };
  if (queued && queued.length) {
    var run = function () { for (var i = 0; i < queued.length; i++) mount(queued[i]); };
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', run, { once: true }); else run();
  }
})();
