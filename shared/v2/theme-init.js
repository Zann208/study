/* Study Console v2: apply the shared theme before styles paint. */
(() => {
  'use strict';
  const root = document.documentElement;
  const key = 'study-console-theme';
  const valid = value => value === 'light' || value === 'dark';
  const read = () => { try { return localStorage.getItem(key); } catch { return null; } };
  const media = window.matchMedia ? matchMedia('(prefers-color-scheme: dark)') : null;
  const embedded = window.self !== window.top;
  if (embedded) root.classList.add('sc-embedded');
  function inherited() {
    try { return embedded && window.parent.document.documentElement.dataset.theme; } catch { return null; }
  }
  function apply(theme) {
    if (!valid(theme)) theme = media && media.matches ? 'dark' : 'light';
    root.dataset.theme = theme;
    root.style.colorScheme = theme;
    root.classList.toggle('dark', theme === 'dark');
    root.classList.toggle('light', theme === 'light');
    if (document.body) {
      document.body.classList.toggle('light', theme === 'light');
      document.body.classList.toggle('dark', theme === 'dark');
    }
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.content = theme === 'dark' ? '#101621' : '#f5f7fb';
    document.querySelectorAll('iframe').forEach(frame => {
      try { if (frame.contentWindow.StudyConsoleTheme) frame.contentWindow.StudyConsoleTheme.apply(theme); } catch {}
    });
    document.dispatchEvent(new CustomEvent('sc-theme-change', { detail: theme }));
  }
  function refresh() { apply(inherited() || read()); }
  window.StudyConsoleTheme = {
    apply,
    set(theme) {
      if (!valid(theme)) return;
      try { localStorage.setItem(key, theme); } catch {}
      apply(theme);
    }
  };
  refresh();
  document.addEventListener('DOMContentLoaded', refresh, { once: true });
  window.addEventListener('pageshow', refresh);
  window.addEventListener('storage', event => { if (event.key === key || event.key === null) refresh(); });
  if (media && media.addEventListener) media.addEventListener('change', () => { if (!valid(read())) refresh(); });
})();
