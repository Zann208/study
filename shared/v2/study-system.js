/* Shared interface only. Subject lessons and learning tools remain repository-local. */
(() => {
  'use strict';
  const root = document.documentElement;
  const body = document.body;
  if (!body || document.querySelector('.sc-global-header')) return;
  const HOME = 'https://zann208.github.io/study/';
  const CONSOLES = [
    { id: 'netdes', name: 'Network Design & Troubleshooting', short: 'Network Design', icon: 'network', href: 'https://zann208.github.io/netdes/' },
    { id: 'wnet', name: 'Wireless Network Engineering', short: 'Wireless Networks', icon: 'wireless', href: 'https://zann208.github.io/wnet/' },
    { id: 'algo', name: 'Algorithms & Data Structures', short: 'Algorithms', icon: 'algorithm', href: 'https://zann208.github.io/algo/' },
    { id: 'privacy', name: 'Privacy & Information Security', short: 'Privacy & Security', icon: 'shield', href: 'https://zann208.github.io/privacy/' },
    { id: 'os', name: 'Operating Systems & Scheduling', short: 'Operating Systems', icon: 'system', href: 'https://zann208.github.io/os/' },
    { id: 'gdc', name: 'Google Data Center Hardware Hackathon', short: 'Data Center Prep', icon: 'server', href: HOME + 'google-dc-hackathon/' }
  ];
  const paths = {
    home: '<path d="M3 4h7v16H3zM14 4h7v7h-7zM14 15h7v5h-7z"/>',
    network: '<rect x="8" y="3" width="8" height="5" rx="1.5"/><rect x="2" y="16" width="7" height="5" rx="1.5"/><rect x="15" y="16" width="7" height="5" rx="1.5"/><path d="M12 8v4M5.5 16v-4h13v4"/>',
    wireless: '<path d="M2 8.5a16 16 0 0 1 20 0M5.5 12a10.5 10.5 0 0 1 13 0M9 15.5a5 5 0 0 1 6 0"/><circle cx="12" cy="19" r=".9"/>',
    algorithm: '<circle cx="12" cy="4" r="2"/><circle cx="5" cy="19" r="2"/><circle cx="19" cy="19" r="2"/><path d="M12 6v5M5 17v-6h14v6"/>',
    shield: '<path d="m12 3 8 3v6c0 5-8 9-8 9S4 17 4 12V6zM8.5 12l2.5 2.5 4.5-5"/>',
    system: '<rect x="3" y="4" width="18" height="13" rx="2"/><path d="M8 21h8M12 17v4M7 8l3 2.5L7 13M13 13h4"/>',
    server: '<rect x="4" y="3" width="16" height="7" rx="2"/><rect x="4" y="14" width="16" height="7" rx="2"/><path d="M8 6.5h.01M8 17.5h.01M12 6.5h4M12 17.5h4"/>',
    chevron: '<path d="m6 9 6 6 6-6"/>',
    arrow: '<path d="M4 12h16m-6-6 6 6-6 6"/>',
    sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M2 12h2M20 12h2M5 5l1.5 1.5M17.5 17.5 19 19M5 19l1.5-1.5M17.5 6.5 19 5"/>',
    moon: '<path d="M20.5 14A9 9 0 0 1 10 3.5 9 9 0 1 0 20.5 14Z"/>'
  };
  const icon = (name, extra = '') => `<svg class="sc-icon ${extra}" viewBox="0 0 24 24" aria-hidden="true" focusable="false">${paths[name] || paths.home}</svg>`;
  document.querySelectorAll('[data-sc-icon]').forEach(node => { node.innerHTML = icon(node.dataset.scIcon); });
  if (window.self !== window.top) { body.classList.add('sc-embedded'); return; }
  const currentId = body.dataset.consoleId || 'home';
  const current = CONSOLES.find(console => console.id === currentId);
  const read = key => { try { return localStorage.getItem(key); } catch { return null; } };
  const write = (key, value) => { try { localStorage.setItem(key, value); } catch {} };
  const approvedURL = (value, console) => {
    if (typeof value !== 'string' || !value.trim()) return console.href;
    try {
      const url = new URL(value, console.href);
      const canonical = new URL(console.href);
      return url.origin === canonical.origin && url.pathname.startsWith(canonical.pathname) ? url.href : console.href;
    } catch { return console.href; }
  };
  const header = document.createElement('header');
  header.className = 'sc-global-header';
  const consoleLink = console => `<a href="${console.href}" ${console.id === currentId ? 'aria-current="page"' : ''}>${icon(console.icon)}<span>${console.name}</span></a>`;
  header.innerHTML = `<div class="sc-global-inner">
    <a class="sc-brand" href="${HOME}" aria-label="Study Console home"><span class="sc-brand-mark">${icon('home')}</span><span class="sc-brand-label">Study Console</span></a>
    <div class="sc-switch">
      <button class="sc-shell-button sc-switch-toggle" type="button" data-sc-switch aria-expanded="false" aria-controls="sc-console-menu" aria-label="Switch console: ${current ? current.short : 'Overview'}">${icon(current ? current.icon : 'home')}<span class="sc-switch-label">${current ? current.short : 'Overview'}</span>${icon('chevron', 'sc-chevron')}</button>
      <div class="sc-switch-menu" id="sc-console-menu" hidden aria-label="Study consoles">
        <a href="${HOME}" ${currentId === 'home' ? 'aria-current="page"' : ''}>${icon('home')}<span>All consoles</span></a>
        <p class="sc-menu-label">Subjects</p>${CONSOLES.filter(console => console.id !== 'gdc').map(consoleLink).join('')}
        <p class="sc-menu-label">Engineering Lab</p>${consoleLink(CONSOLES[5])}
      </div>
    </div>
    <div class="sc-global-actions"><button class="sc-shell-button sc-theme" type="button" data-sc-theme></button></div>
  </div>`;
  body.prepend(header);
  const switcher = header.querySelector('[data-sc-switch]');
  const menu = header.querySelector('#sc-console-menu');
  const close = (restoreFocus = false) => {
    switcher.setAttribute('aria-expanded', 'false'); menu.hidden = true;
    if (restoreFocus) switcher.focus();
  };
  const open = (last = false, focus = false) => {
    switcher.setAttribute('aria-expanded', 'true'); menu.hidden = false;
    if (focus) { const links = menu.querySelectorAll('a'); links[last ? links.length - 1 : 0].focus(); }
  };
  switcher.addEventListener('click', () => menu.hidden ? open() : close());
  switcher.addEventListener('keydown', event => {
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') { event.preventDefault(); open(event.key === 'ArrowUp', true); }
  });
  menu.addEventListener('keydown', event => {
    const links = [...menu.querySelectorAll('a')];
    const index = links.indexOf(document.activeElement);
    let next = null;
    if (event.key === 'ArrowDown') next = (index + 1) % links.length;
    if (event.key === 'ArrowUp') next = (index - 1 + links.length) % links.length;
    if (event.key === 'Home') next = 0;
    if (event.key === 'End') next = links.length - 1;
    if (next !== null) { event.preventDefault(); links[next].focus(); }
  });
  header.querySelector('.sc-switch').addEventListener('focusout', () => {
    queueMicrotask(() => { if (!header.querySelector('.sc-switch').contains(document.activeElement)) close(); });
  });
  document.addEventListener('click', event => { if (!header.querySelector('.sc-switch').contains(event.target)) close(); });
  document.addEventListener('keydown', event => { if (event.key === 'Escape' && !menu.hidden) { event.preventDefault(); close(true); } });
  // Course flashcard shortcuts must not react while the global controls have focus.
  header.addEventListener('keydown', event => {
    if (event.key === 'Escape' && !menu.hidden) { event.preventDefault(); close(true); }
    event.stopPropagation();
  });
  const themeButton = header.querySelector('[data-sc-theme]');
  function renderTheme() {
    const dark = root.dataset.theme === 'dark';
    themeButton.innerHTML = icon(dark ? 'sun' : 'moon') + '<span class="sc-theme-label">' + (dark ? 'Light' : 'Dark') + '</span>';
    themeButton.setAttribute('aria-label', dark ? 'Use light theme' : 'Use dark theme');
    themeButton.title = themeButton.getAttribute('aria-label');
  }
  themeButton.addEventListener('click', () => {
    const next = root.dataset.theme === 'dark' ? 'light' : 'dark';
    if (window.StudyConsoleTheme) window.StudyConsoleTheme.set(next);
    else { root.dataset.theme = next; write('study-console-theme', next); renderTheme(); }
  });
  document.addEventListener('sc-theme-change', renderTheme);
  renderTheme();
  // Only the existing recent-console preference is written; learning progress is never changed.
  function remember(console, href) { write('study-console-last', JSON.stringify({ id: console.id, name: console.name, href: approvedURL(href, console), at: Date.now() })); }
  function rememberCurrent() { if (current) remember(current, location.href); }
  function renderContinue() {
    const area = document.querySelector('[data-continue-learning]');
    if (!area) return;
    let last;
    try { last = JSON.parse(read('study-console-last') || 'null'); } catch { last = null; }
    const console = last && CONSOLES.find(item => item.id === last.id);
    area.hidden = !console;
    if (!console) return;
    area.querySelector('[data-continue-name]').textContent = console.name;
    area.querySelector('[data-continue-link]').href = approvedURL(last.href, console);
    const marker = area.querySelector('[data-continue-icon]');
    if (marker) marker.innerHTML = icon(console.icon);
  }
  document.querySelectorAll('[data-console-launch]').forEach(link => {
    link.addEventListener('click', () => { const console = CONSOLES.find(item => item.id === link.dataset.consoleId); if (console) remember(console, link.href); });
  });
  rememberCurrent(); renderContinue();
  window.addEventListener('pagehide', rememberCurrent);
  window.addEventListener('pageshow', () => { close(); rememberCurrent(); renderContinue(); });
  window.addEventListener('hashchange', rememberCurrent);
  window.addEventListener('storage', event => { if (event.key === 'study-console-last' || event.key === null) renderContinue(); });
  // Measure the native subject toolbar so sticky rows never overlap.
  const localNav = body.querySelector(':scope > nav, :scope > header#top, :scope > .shell > header#top');
  if (localNav) localNav.classList.add('sc-local-nav');
  if ('ResizeObserver' in window) {
    const resize = new ResizeObserver(() => {
      root.style.setProperty('--sc-header-h', Math.ceil(header.getBoundingClientRect().height) + 'px');
      if (localNav) root.style.setProperty('--sc-local-nav-h', Math.ceil(localNav.getBoundingClientRect().height) + 'px');
    });
    resize.observe(header); if (localNav) resize.observe(localNav);
  }
  const main = document.querySelector('main');
  if (main) {
    if (!main.id) main.id = 'sc-main-content';
    if (!main.hasAttribute('tabindex')) main.tabIndex = -1;
    const skip = document.createElement('a');
    skip.className = 'sc-skip'; skip.href = '#' + main.id; skip.textContent = 'Skip to learning content';
    skip.addEventListener('click', event => { event.preventDefault(); main.focus({ preventScroll: true }); main.scrollIntoView({ block: 'start' }); });
    body.prepend(skip);
  }

  // Enhance existing mobile drawers without replacing their click handlers.
  function enhanceDrawer(panel, trigger, backdrop, closeButton, state, breakpoint) {
    if (!panel || !trigger || !window.MutationObserver || !window.matchMedia) return;
    const query = breakpoint ? matchMedia('(max-width: ' + breakpoint + 'px)') : null;
    let wasOpen = false;
    let overflow = '';
    const isDrawer = () => !query || query.matches;
    const isOpen = () => isDrawer() && panel.classList.contains(state);
    const focusables = () => [...panel.querySelectorAll('a[href],button:not(:disabled),input:not(:disabled),select:not(:disabled),[tabindex="0"]')].filter(node => !node.hidden && node.getClientRects().length);
    const closeDrawer = () => { if (closeButton) closeButton.click(); else if (backdrop) backdrop.click(); else trigger.click(); };
    trigger.setAttribute('aria-controls', panel.id);
    function sync() {
      const openNow = isOpen();
      trigger.setAttribute('aria-expanded', String(openNow));
      panel.inert = isDrawer() && !openNow;
      if (panel.inert) panel.setAttribute('aria-hidden', 'true'); else panel.removeAttribute('aria-hidden');
      if (openNow && !wasOpen) {
        overflow = body.style.overflow;
        body.style.overflow = 'hidden';
        panel.setAttribute('role', 'dialog');
        panel.setAttribute('aria-modal', 'true');
        panel.setAttribute('aria-label', 'Subject navigation');
        (focusables()[0] || trigger).focus();
      } else if (!openNow && wasOpen) {
        body.style.overflow = overflow;
        panel.removeAttribute('role'); panel.removeAttribute('aria-modal');
        if (panel.contains(document.activeElement)) trigger.focus();
      }
      wasOpen = openNow;
    }
    new MutationObserver(sync).observe(panel, { attributes: true, attributeFilter: ['class'] });
    if (query && query.addEventListener) query.addEventListener('change', sync);
    document.addEventListener('keydown', event => {
      if (!isOpen()) return;
      if (event.key === 'Escape') { event.preventDefault(); event.stopImmediatePropagation(); closeDrawer(); trigger.focus(); }
      if (event.key === 'Tab') {
        const items = focusables();
        if (!items.length) return;
        if (event.shiftKey && document.activeElement === items[0]) { event.preventDefault(); items[items.length - 1].focus(); }
        else if (!event.shiftKey && document.activeElement === items[items.length - 1]) { event.preventDefault(); items[0].focus(); }
      }
    }, true);
    sync();
  }
  enhanceDrawer(document.getElementById('sb'), document.getElementById('sbT'), document.getElementById('sbB'), document.getElementById('sbX'), 'on');
  if (currentId === 'algo') enhanceDrawer(document.getElementById('side'), document.getElementById('burger'), document.getElementById('scrim'), null, 'open', 960);
  if (currentId === 'gdc') enhanceDrawer(document.getElementById('sidebar'), document.getElementById('menuBtn'), document.getElementById('overlay'), null, 'open', 900);
  const subjectSearch = document.getElementById('siteSearch');
  if (subjectSearch && !subjectSearch.hasAttribute('aria-label')) subjectSearch.setAttribute('aria-label', 'Search topics or terms');

  // Expose the selected section to assistive technology. Keep native tab logic.
  const navigation = currentId === 'algo' ? document.getElementById('side') : localNav;
  if (navigation && window.MutationObserver) {
    const syncSelection = () => navigation.querySelectorAll('.tabbtn,.navbtn').forEach(button => {
      if (button.classList.contains('on')) button.setAttribute('aria-current', 'page'); else button.removeAttribute('aria-current');
    });
    new MutationObserver(syncSelection).observe(navigation, { subtree: true, attributes: true, attributeFilter: ['class'], childList: true });
    syncSelection();
  }
  document.querySelectorAll('[data-copy-target]').forEach(button => {
    button.addEventListener('click', async () => {
      const target = document.querySelector(button.dataset.copyTarget);
      if (!target || !navigator.clipboard) return;
      try { await navigator.clipboard.writeText(target.textContent); const old = button.textContent; button.textContent = 'Copied'; setTimeout(() => { button.textContent = old; }, 1200); } catch {}
    });
  });
})();
