/* Study Console hub: v3 manifest plus the two hub behaviours, subject icons and
   "Continue learning". Learning progress is never written here; only the shared
   recent-console key (study-console-last) is read and, on a launch click, updated. */
(function () {
  'use strict';
  var LAST = 'study-console-last';
  var S = window.StudyShell;

  function read(k) { try { return localStorage.getItem(k); } catch (e) { return null; } }
  function write(k, v) { try { localStorage.setItem(k, v); } catch (e) {} }
  function consoleById(id) {
    if (!S) return null;
    for (var i = 0; i < S.consoles.length; i++) if (S.consoles[i].id === id) return S.consoles[i];
    return null;
  }
  // A stored link is followed only when it stays inside that console's own site.
  function approved(href, c) {
    try { var u = new URL(href, location.href); if (u.href.indexOf(c.href) === 0) return u.href; } catch (e) {}
    return c.href;
  }

  function paintIcons() {
    if (!S || !S.icon) return;
    Array.prototype.forEach.call(document.querySelectorAll('[data-sc-icon]'), function (n) { n.innerHTML = S.icon(n.getAttribute('data-sc-icon')); });
  }

  function renderContinue() {
    var area = document.querySelector('[data-continue-learning]');
    if (!area) return;
    var last = null;
    try { last = JSON.parse(read(LAST) || 'null'); } catch (e) { last = null; }
    var c = last && last.id !== 'home' ? consoleById(last.id) : null;
    area.hidden = !c;
    if (!c) return;
    area.querySelector('[data-continue-name]').textContent = c.name;
    var link = area.matches('a') ? area : area.querySelector('[data-continue-link]');
    if (link) link.href = approved(last.href || c.href, c);
    var mark = area.querySelector('[data-continue-icon]');
    if (mark && S.icon) mark.innerHTML = S.icon(c.icon);
  }

  Array.prototype.forEach.call(document.querySelectorAll('[data-console-launch]'), function (a) {
    a.addEventListener('click', function () {
      var c = consoleById(a.getAttribute('data-console-id'));
      if (c) write(LAST, JSON.stringify({ id: c.id, name: c.name, href: approved(a.href, c), at: Date.now() }));
    });
  });
  window.addEventListener('storage', function (e) { if (e.key === LAST || e.key === null) renderContinue(); });
  window.addEventListener('pageshow', renderContinue);

  function linkOut(id, title, badge) {
    var c = consoleById(id);
    return { id: 'c-' + id, title: title, badge: badge, href: c ? c.href : '#', console: id, track: false };
  }

  (window.StudyConsole = window.StudyConsole || []).push({
    id: 'home',
    kind: 'hub',
    title: 'Study Console',
    content: '#main',
    defaultView: 'overview',
    router: { show: function () {} },
    groups: [
      { label: 'Workspace', views: [{ id: 'overview', title: 'Overview', track: false }] },
      { label: 'Subjects', views: [
        linkOut('netdes', 'Network Design', 'NET'),
        linkOut('wnet', 'Wireless Networks', 'WLN'),
        linkOut('algo', 'Algorithms', 'ALG'),
        linkOut('privacy', 'Privacy & Security', 'PRV'),
        linkOut('os', 'Operating Systems', 'OS')
      ] },
      { label: 'Engineering Lab', views: [linkOut('gdc', 'Data Center Prep', 'GDC')] }
    ]
  });

  // Search button opens the frame's search across every console.
  Array.prototype.forEach.call(document.querySelectorAll('[data-open-search]'), function (b) {
    b.addEventListener('click', function () { if (S && S.openSearch) S.openSearch(); });
  });

  // Console tiles: the glow follows the pointer (pointer devices only, never with reduced motion).
  var fine = window.matchMedia && matchMedia('(hover: hover) and (pointer: fine)').matches;
  var still = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  var grid = document.querySelector('.home-grid');
  if (grid && fine && !still) {
    var pending = null;
    grid.addEventListener('pointermove', function (e) {
      var tile = e.target.closest && e.target.closest('.home-tile');
      if (!tile) return;
      if (pending) cancelAnimationFrame(pending);
      pending = requestAnimationFrame(function () {
        var r = tile.getBoundingClientRect();
        tile.style.setProperty('--mx', (e.clientX - r.left) + 'px');
        tile.style.setProperty('--my', (e.clientY - r.top) + 'px');
      });
    });
    grid.addEventListener('pointerout', function (e) {
      var tile = e.target.closest && e.target.closest('.home-tile');
      if (tile && !tile.contains(e.relatedTarget)) { tile.style.removeProperty('--mx'); tile.style.removeProperty('--my'); }
    });
  }

  // Pointer light on the whole page and through the title (mouse and trackpad only).
  if (fine && !still) {
    var glow = document.querySelector('.home-cursor'), title = document.querySelector('.home-title'), frame = null, last = null;
    window.addEventListener('pointermove', function (e) {
      if (e.pointerType && e.pointerType !== 'mouse' && e.pointerType !== 'pen') return;
      last = e;
      if (frame) return;
      frame = requestAnimationFrame(function () {
        frame = null;
        if (glow) { glow.style.transform = 'translate3d(' + last.clientX + 'px,' + last.clientY + 'px,0)'; glow.classList.add('is-on'); }
        if (title) {
          var r = title.getBoundingClientRect(), inside = last.clientX >= r.left && last.clientX <= r.right && last.clientY >= r.top && last.clientY <= r.bottom;
          title.classList.toggle('is-lit', inside);
          if (inside) { title.style.setProperty('--tx', (last.clientX - r.left) + 'px'); title.style.setProperty('--ty', (last.clientY - r.top) + 'px'); }
        }
      });
    }, { passive: true });
    document.documentElement.addEventListener('pointerleave', function () { if (glow) glow.classList.remove('is-on'); if (title) title.classList.remove('is-lit'); });
  }

  // Author message: plays like a conversation the first time it scrolls into view.
  var chat = document.querySelector('.home-chat');
  if (chat && !still && 'IntersectionObserver' in window) {
    var msgs = chat.querySelectorAll('[data-chat-msg]'), status = chat.querySelector('[data-chat-status]');
    chat.classList.add('is-staged');
    var io = new IntersectionObserver(function (entries) {
      if (!entries.some(function (en) { return en.isIntersecting; })) return;
      io.disconnect();
      var t = 0;
      Array.prototype.forEach.call(msgs, function (m, i) {
        setTimeout(function () { chat.classList.add('is-typing'); }, t);
        t += i === 0 ? 900 : 1300;
        setTimeout(function () { chat.classList.remove('is-typing'); m.classList.add('is-in'); }, t);
        t += 250;
      });
      setTimeout(function () { if (status) status.classList.add('is-in'); }, t + 200);
    }, { threshold: 0.35 });
    io.observe(chat);
  }

  paintIcons();
  renderContinue();
})();
