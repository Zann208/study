/* Study Console language layer (EN / MY) for consoles in this repository.
   Usage, before the console's manifest script:
     <script src="../shared/v3/lang.js?v=..." data-store="dbLang" data-bundle="./i18n/my.js?v=..."></script>
   Elements carrying data-i18n="key" are swapped with the Burmese HTML in the bundle
   (window.SC_MY = { s: { key: html } }), which loads only when MY is chosen.
   Missing keys fall back to English. The manifest uses window.SCLang as its i18n block. */
(function () {
  'use strict';
  if (window.SCLang) return;
  var me = document.currentScript;
  var KEY = (me && me.getAttribute('data-store')) || 'scLang';
  var SRC = (me && me.getAttribute('data-bundle')) || './i18n/my.js';
  var ORDER = ['en', 'my'], ORIG = new WeakMap(), loading = false, waiting = [];

  function read() { try { return localStorage.getItem(KEY) === 'my' ? 'my' : 'en'; } catch (e) { return 'en'; } }
  function write(v) { try { localStorage.setItem(KEY, v); } catch (e) {} }
  var LANG = read();

  var css = document.createElement('style');
  css.textContent =
    'body.my{font-family:"Noto Sans Myanmar","Myanmar Text","Myanmar Sangam MN","Padauk",var(--font-sans,system-ui),sans-serif}' +
    'body.my #main p,body.my #main li,body.my #main td,body.my #main th,body.my #main summary,body.my #main dd,body.my #main figcaption{line-height:1.95}' +
    'body.my #main h1,body.my #main h2,body.my #main h3,body.my #main h4,body.my #main h5{line-height:1.6;letter-spacing:0!important;text-transform:none!important}' +
    'body.my #main th,body.my #main .tag,body.my #main .kicker,body.my #main .eyebrow{letter-spacing:0!important;text-transform:none!important}';
  document.head.appendChild(css);

  function flush() { loading = false; var w = waiting; waiting = []; w.forEach(function (f) { f(); }); }
  function load(cb) {
    if (!document.getElementById('scMyFont')) {
      var l = document.createElement('link'); l.id = 'scMyFont'; l.rel = 'stylesheet';
      l.href = 'https://fonts.googleapis.com/css2?family=Noto+Sans+Myanmar:wght@400;600;700&display=swap';
      document.head.appendChild(l);
    }
    if (window.SC_MY) { cb(); return; }
    waiting.push(cb);
    if (loading) return; loading = true;
    var s = document.createElement('script'); s.src = SRC;
    s.onload = flush;
    s.onerror = function () { LANG = 'en'; write('en'); flush(); };
    document.head.appendChild(s);
  }

  function paint() {
    if (LANG === 'my' && !window.SC_MY) { load(paint); return; }
    var M = (LANG === 'my' && window.SC_MY) ? window.SC_MY.s : null;
    document.querySelectorAll('[data-i18n]').forEach(function (el) {
      if (!ORIG.has(el)) ORIG.set(el, el.innerHTML);
      var v = M && M[el.getAttribute('data-i18n')], want = v || ORIG.get(el);
      if (el.innerHTML !== want) el.innerHTML = want;
    });
    document.documentElement.lang = LANG;
    if (document.body) document.body.classList.toggle('my', LANG === 'my');
    document.dispatchEvent(new CustomEvent('sc-lang', { detail: LANG }));
  }

  window.SCLang = {
    langs: [{ code: 'en', label: 'EN', name: 'English' }, { code: 'my', label: 'MY', name: 'Burmese' }],
    get: function () { return LANG; },
    set: function (l) { if (ORDER.indexOf(l) < 0 || l === LANG) return; LANG = l; write(l); paint(); },
    apply: paint
  };
  if (LANG === 'my') {
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', paint);
    else paint();
  }
})();
