/* Study Console UI v3 — boot loader. Load synchronously as the first script in <head>:
     <script src="https://zann208.github.io/study/shared/v3/boot.js?v=20261025-1"
             data-console="algo" data-v2="v2.html"></script>
   - Applies the shared theme before first paint (replaces v2 theme-init.js).
   - Writes the v3 stylesheets and shell script, versioned with this file's ?v.
   - Inside an iframe, loads tokens + components only (no frame).
   - ?ui=v2 (remembered for the tab) sends the page to its frozen v2 snapshot (data-v2).
     ?ui=v3 clears that. */
(function () {
  'use strict';
  var script = document.currentScript;
  var root = document.documentElement;
  var src = script && script.src ? script.src : '';
  var base = src.replace(/[^/]*$/, '');
  var version = (/[?&]v=([^&#]+)/.exec(src) || [])[1] || '';
  var q = version ? '?v=' + version : '';
  var v2 = script && script.getAttribute('data-v2');
  var embedded = window.self !== window.top;

  /* ---------- rollback override ---------- */
  var m = /[?&]ui=(v2|v3)\b/.exec(location.search), ui = null;
  try {
    if (m) sessionStorage.setItem('study-console-ui', m[1]);
    ui = sessionStorage.getItem('study-console-ui');
  } catch (e) { ui = m ? m[1] : null; }
  if (ui === 'v2' && v2 && !embedded) {
    location.replace(v2 + location.search.replace(/([?&])ui=v2&?/, '$1').replace(/[?&]$/, '') + location.hash);
    return;
  }

  /* ---------- theme (same contract as v2 theme-init.js) ---------- */
  var KEY = 'study-console-theme';
  var media = window.matchMedia ? window.matchMedia('(prefers-color-scheme: dark)') : null;
  function valid(t) { return t === 'light' || t === 'dark'; }
  function read() { try { return localStorage.getItem(KEY); } catch (e) { return null; } }
  function inherited() {
    try { return embedded && window.parent.document.documentElement.dataset.theme; } catch (e) { return null; }
  }
  function apply(theme) {
    if (!valid(theme)) theme = media && media.matches ? 'dark' : 'light';
    root.dataset.theme = theme;
    root.style.colorScheme = theme;
    root.classList.toggle('dark', theme === 'dark');
    root.classList.toggle('light', theme === 'light');
    if (document.body) {
      document.body.classList.toggle('dark', theme === 'dark');
      document.body.classList.toggle('light', theme === 'light');
    }
    var meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.content = theme === 'dark' ? '#000000' : '#f5f5f7';
    var frames = document.querySelectorAll('iframe');
    for (var i = 0; i < frames.length; i++) {
      try { if (frames[i].contentWindow.StudyConsoleTheme) frames[i].contentWindow.StudyConsoleTheme.apply(theme); } catch (e) { /* cross-origin */ }
    }
    document.dispatchEvent(new CustomEvent('sc-theme-change', { detail: theme }));
  }
  function refresh() { apply(inherited() || read()); }
  window.StudyConsoleTheme = {
    apply: apply,
    set: function (theme) { if (!valid(theme)) return; try { localStorage.setItem(KEY, theme); } catch (e) {} apply(theme); }
  };
  refresh();
  document.addEventListener('DOMContentLoaded', refresh, { once: true });
  window.addEventListener('pageshow', refresh);
  window.addEventListener('storage', function (e) { if (e.key === KEY || e.key === null) refresh(); });
  if (media && media.addEventListener) media.addEventListener('change', function () { if (!valid(read())) refresh(); });

  /* ---------- assets ---------- */
  root.classList.add('sc-v3');
  root.setAttribute('data-sc-ui', 'v3');
  if (embedded) root.classList.add('sc-embedded');
  if (script && script.getAttribute('data-console')) root.setAttribute('data-sc-console', script.getAttribute('data-console'));
  // Restore the frame's last layout before the first paint so the page does not jump when the shell mounts.
  if (!embedded) {
    try {
      if (localStorage.getItem('study-console-v3-menu-hidden') === '1') root.classList.add('sc3-menu-hidden');
      var secs = JSON.parse(localStorage.getItem('study-console-v3-sections') || '{}');
      if (secs && secs[location.pathname + (location.hash || '#')]) root.classList.add('sc3-has-sections');
    } catch (e) { /* storage blocked */ }
  }

  var tags = [
    '<link rel="preconnect" href="https://fonts.googleapis.com">',
    '<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>',
    // Only used where SF Pro / SF Mono are not installed. Loaded without blocking the first paint.
    '<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap" media="print" onload="this.media=\'all\'">',
    '<link rel="stylesheet" href="' + base + 'tokens.css' + q + '">'
  ];
  if (!embedded) tags.push('<link rel="stylesheet" href="' + base + 'shell.css' + q + '">');
  tags.push('<link rel="stylesheet" href="' + base + 'components.css' + q + '">');
  tags.push('<link rel="stylesheet" href="' + base + 'bridge.css' + q + '">');
  tags.push('<link rel="stylesheet" href="' + base + 'reading.css' + q + '">');
  if (!embedded) tags.push('<script src="' + base + 'shell.js' + q + '"><\/script>');
  document.write(tags.join(''));
})();
