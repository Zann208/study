/* Content stays in its original nodes and order. This module only adds reading
   classes, scroll containers for reference tables, and device-local UI options. */
(() => {
  'use strict';
  const body = document.body;
  if (!body || !body.dataset.consoleId || body.dataset.consoleId === 'home' || window.StudyConsoleReading) return;
  const key = 'study-console-reading';
  const sizes = ['standard', 'large', 'larger'];
  const regionSelector = '.tab > .wrap, main > .wrap, main.wrap, main.mock-main, .main-inner, body > .wrap';
  const protectedSelector = 'svg,canvas,.lab-topology,.tree-diagram,.treebox,.btreebox,.diagram-dialog,.source-visual';
  const cardSelector = '.panel,.item,.card,.def,.agcard,.mock-card,details.note,.definition,.term-card';
  const callouts = [
    ['warning', '.box.trap,.box.mistakes,.tip.t-warn,div.trap,.exam-trap'],
    ['example', '.box.anl,.box.rl,.example,.example-box,.prof'],
    ['remember', '.memory,.agmemory,.agexp,.tip.t-good,.remember'],
    ['key', '.box.wild,.box.notes,.tldr,.takeaway,.scope,.sourceNote,.tip.t-info,.definition']
  ];
  body.classList.add('sc-reading');
  const scan = (node, selector) => [...(node.matches && node.matches(selector) ? [node] : []), ...node.querySelectorAll(selector)];
  const insideLesson = node => node.closest('.sc-reading-region') && !node.closest(protectedSelector);
  function annotate(node) {
    scan(node, regionSelector).forEach(region => {
      if (!region.parentElement.closest('.sc-reading-region')) region.classList.add('sc-reading-region');
    });
    scan(node, cardSelector).filter(insideLesson).forEach(card => card.classList.add('sc-reading-card'));
    callouts.forEach(([kind, selector]) => scan(node, selector).filter(insideLesson).forEach(callout => {
      callout.classList.add('sc-reading-callout'); callout.dataset.readingKind = kind;
    }));
    scan(node, '.box,.tip').filter(insideLesson).forEach(callout => {
      if (!callout.classList.contains('sc-reading-callout') && !callout.querySelector('input,select,textarea,button,svg,canvas')) {
        callout.classList.add('sc-reading-callout'); callout.dataset.readingKind = 'key';
      }
    });
    scan(node, 'table').filter(insideLesson).forEach(table => {
      // Leave calculators, editable tables, and diagram-like layouts in place.
      if (table.querySelector('input,select,textarea,button,svg,canvas') || table.getAttribute('role') === 'presentation') return;
      table.classList.add('sc-reading-table');
      if (!table.parentElement.closest('.tscroll,.table-wrap,.sc-table-wrap,.table-scroll,.sc-reading-table-scroll')) {
        const wrap = document.createElement('div');
        wrap.className = 'sc-reading-table-scroll';
        wrap.tabIndex = 0;
        wrap.setAttribute('role', 'region');
        wrap.setAttribute('aria-label', table.caption ? table.caption.textContent.trim() : 'Reference table');
        table.before(wrap); wrap.appendChild(table);
      } else {
        const wrap = table.closest('.tscroll,.table-wrap,.sc-table-wrap,.table-scroll,.sc-reading-table-scroll');
        if (wrap) wrap.classList.add('sc-reading-table-scroll');
      }
    });
    scan(node, '.grid,.g2,.g3,.grid2,.grid3,.two,.quick-grid,.terms').filter(insideLesson).forEach(grid => {
      const items = [...grid.children];
      if (items.length > 1 && items.every(item => item.matches('.sc-reading-card,.box,.quick')) &&
          !grid.querySelector('input,select,textarea,button,svg,canvas,iframe')) grid.classList.add('sc-reading-prose-grid');
    });
  }
  annotate(body);
  if (window.MutationObserver) {
    const pending = new Set();
    let scheduled = false;
    new MutationObserver(records => {
      records.forEach(record => record.addedNodes.forEach(node => {
        if (node.nodeType === 1 && !node.closest('.sc-global-header,' + protectedSelector)) pending.add(node);
      }));
      if (!scheduled && pending.size) {
        scheduled = true;
        requestAnimationFrame(() => {
          const nodes = [...pending]; pending.clear(); scheduled = false;
          nodes.filter(node => node.isConnected && !nodes.some(other => other !== node && other.contains(node))).forEach(annotate);
        });
      }
    }).observe(body, {childList: true, subtree: true});
  }

  function normalize(value) {
    return {size: sizes.includes(value?.size) ? value.size : 'standard', focus: value?.focus === true};
  }
  function read() {
    try {
      if (window.self !== window.top && window.parent.StudyConsoleReading) return normalize(window.parent.StudyConsoleReading.get());
    } catch {}
    try { return normalize(JSON.parse(localStorage.getItem(key) || 'null')); } catch { return normalize(null); }
  }
  let settings = read();
  let menu;
  function apply(value, preservePosition = false) {
    const anchor = preservePosition && document.elementFromPoint ? document.elementFromPoint(innerWidth / 2, 150)?.closest('p,li,h2,h3,h4,.ph') : null;
    const anchorTop = anchor?.getBoundingClientRect().top;
    settings = normalize(value);
    body.dataset.readingSize = settings.size;
    body.dataset.readingFocus = String(settings.focus);
    if (menu) {
      menu.querySelectorAll('[data-reading-size]').forEach(button => button.setAttribute('aria-pressed', String(button.dataset.readingSize === settings.size)));
      menu.querySelector('[data-reading-focus]').checked = settings.focus;
    }
    document.querySelectorAll('iframe').forEach(frame => {
      try { frame.contentWindow.StudyConsoleReading?.apply(settings); } catch {}
    });
    if (anchor && insideLesson(anchor)) requestAnimationFrame(() => {
      if (anchor.isConnected) window.scrollBy(0, anchor.getBoundingClientRect().top - anchorTop);
    });
  }
  function save(value) {
    apply(value, true);
    try { localStorage.setItem(key, JSON.stringify(settings)); } catch {}
  }
  window.StudyConsoleReading = {get: () => ({...settings}), apply: value => apply(value)};
  apply(settings);
  window.addEventListener('storage', event => { if (event.key === key || event.key === null) apply(read()); });
  window.addEventListener('pageshow', () => apply(read()));

  const actions = document.querySelector('.sc-global-actions');
  if (!actions || window.self !== window.top) return;
  const options = document.createElement('div');
  options.className = 'sc-reading-options';
  options.innerHTML = '<button class="sc-shell-button sc-reading-toggle" type="button" aria-label="Reading options" title="Reading options" aria-expanded="false" aria-controls="sc-reading-menu">Aa</button>' +
    '<div class="sc-reading-menu" id="sc-reading-menu" hidden>' +
    '<fieldset><legend>Text size</legend><div class="sc-reading-sizes">' +
    '<button type="button" data-reading-size="standard" aria-pressed="true">Standard</button>' +
    '<button type="button" data-reading-size="large" aria-pressed="false">Large</button>' +
    '<button type="button" data-reading-size="larger" aria-pressed="false">Larger</button></div></fieldset>' +
    '<label class="sc-reading-focus-option"><input type="checkbox" data-reading-focus><span><strong>Focus layout</strong><small>One column with more room between ideas.</small></span></label></div>';
  actions.prepend(options);
  const trigger = options.querySelector('button');
  menu = options.querySelector('.sc-reading-menu');
  function close(focus = false) {
    if (focus) trigger.focus();
    menu.hidden = true; trigger.setAttribute('aria-expanded', 'false');
  }
  trigger.addEventListener('click', () => {
    const open = menu.hidden;
    menu.hidden = !open; trigger.setAttribute('aria-expanded', String(open));
  });
  menu.querySelectorAll('[data-reading-size]').forEach(button => button.addEventListener('click', () => save({...settings, size: button.dataset.readingSize})));
  menu.querySelector('[data-reading-focus]').addEventListener('change', event => save({...settings, focus: event.target.checked}));
  options.addEventListener('keydown', event => {
    if (event.key === 'Escape') { event.preventDefault(); close(true); }
    if (event.target === trigger && event.key === 'ArrowDown') {
      event.preventDefault(); menu.hidden = false; trigger.setAttribute('aria-expanded', 'true'); menu.querySelector('button').focus();
    }
  });
  options.addEventListener('focusout', event => {
    if (event.relatedTarget) { if (!options.contains(event.relatedTarget)) close(); }
    else setTimeout(() => { if (!options.contains(document.activeElement)) close(); }, 0);
  });
  document.addEventListener('click', event => { if (!options.contains(event.target)) close(); });
  apply(settings);
})();
