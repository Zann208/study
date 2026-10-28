# Study Console UI v3

UI v3 gives every console one master frame: the same top bar, left menu, spacing, controls and motion. Each console stays its own repository and deploys on its own. Content is untouched; only the presentation and navigation change. UI v2 remains live as a frozen rollback.

Live preview of tokens and components: https://zann208.github.io/study/shared/v3/preview.html

## Look

- Apple system typography. SF Pro (with Inter as the web fallback) for all reading and interface text, 17px body. SF Mono (with JetBrains Mono as the fallback) only for code, pseudocode, commands and configuration: `pre`, `code`, `kbd`, `samp`, `.mono`, `.code`, `.pseudo`, `.cli`, `.cmd`.
- True black background in dark mode, Apple grey (`#f5f5f7`) in light mode. No gradients behind content.
- One accent per console. Semantic colours (info, ok, warn, danger) carry meaning; the accent never does.
- A six-colour diagram palette that is tuned per theme and shared by every console.

## Files

| File | Responsibility |
|---|---|
| `shared/v3/boot.js` | First script in `<head>`. Applies the theme before paint, handles `?ui=v2` rollback, writes the v3 stylesheets and `shell.js` with the same `?v` as itself. Inside an iframe it loads styles only (`sc-embedded`). |
| `shared/v3/tokens.css` | The only CSS variable system: neutrals, accent, semantic, diagram, code and syntax colours; type, spacing, radius, shadow, motion and layout tokens. Light, system-dark and forced-dark blocks. |
| `shared/v3/shell.css` | The frame (`.sc3-` prefix): top bar, menu, drawer, section bar, popovers, search palette. |
| `shared/v3/shell.js` | `window.StudyShell`: console registry, mounting from a manifest, routing, search, progress, theme, language and reading controls, keyboard support. |
| `shared/v3/components.css` | Shared components (`.sc-` prefix): type contract, prose, cards, callouts, definitions, traps, tables, code blocks, buttons, tabs, segmented controls, inputs, chips, badges, lab panel and stepper, diagram frame and legend, quiz, mock exam, utilities. |
| `shared/v3/reading.css` | Reading layer over each console's lessons: section headers with an accent tint, subheads as real headings with a hairline above, 17px body text at 1.72 line height held near 70 characters, larger tables and callouts, card shadows in light mode. Scoped per console with `html[data-sc-console]`. |
| `shared/v3/bridge.css` | Backward-compatible adapter. Maps the legacy variable names consoles already use (`--bg`, `--panel`, `--ink`, `--cy`, `--am`, `--mono` and so on) and legacy hard-coded SVG colours onto v3 tokens, so existing lessons pick up the new look without being edited. |
| `shared/v3/diagram.js` | `window.StudyDiagram`: token-only SVG nodes, edges and legends. |
| `shared/v3/preview.html` | Live design-system page. |

## Adding the frame to a console

1. Replace the v2 theme script and shared stylesheets with one tag, first in `<head>`:

   ```html
   <script src="https://zann208.github.io/study/shared/v3/boot.js?v=20261028-1"
           data-console="algo" data-v2="index.v2.html"></script>
   ```

   Pages inside the study repo use a relative path (`./shared/v3/boot.js`, `../shared/v3/boot.js`).
2. Remove the console's own header, sidebar, drawer, switcher and theme markup and their CSS/JS. The frame draws all of it.
3. Push a manifest (below) from an inline or external script at the end of `<body>`.
4. Freeze the previous page as `index.v2.html` (and any stylesheet it needs as `*.v2.css`) for rollback.

## Manifest contract

```js
(window.StudyConsole = window.StudyConsole || []).push({
  id: 'algo',                       // registry id; selects name, accent and switcher entry
  kind: 'console',                  // 'console' (default), 'exam' (with parent) or 'hub'
  parent: 'algo',                   // for kind 'exam': the console it belongs to
  title: 'Algorithms & Data Structures',
  subtitle: 'Weekly notes, labs, practice',
  docTitle: 'Algorithms — Study Console', // optional document title suffix
  content: '#main',                 // the console's content element; it is never moved
  defaultView: 'home',
  restore: function () { return 'week4'; },          // optional: view to open with no hash
  router: { show: function (view, anchor) { go(view); } }, // calls the console's own tab/page switch
  viewElement: function (id) { return document.getElementById('page-' + id); }, // optional
  groups: [
    { label: 'Study', views: [
      { id: 'week4', title: 'Trees', titles: { my: '...' }, badge: 'W4',
        children: function () { return [{ id: 'bst', title: 'Binary search trees' }]; } },
      { id: 'mock', title: 'Midterm mock', href: 'midterm-mock.html', track: false }
    ] }
  ],
  terms: [{ title: 'AVL tree', meta: 'Term', view: 'week4', anchor: 'avl' }], // array or function
  index: { week4: ['Trees — the words you must know'] },                     // optional extra search headings
  progress: { read: function () { return { week4: 'done', week5: 'visited' }; } },
  progressNote: 'Progress is saved in this browser.',
  i18n: { langs: [{ code: 'en', label: 'EN', name: 'English' }, { code: 'my', label: 'MY', name: 'Myanmar' }],
          get: function () { return lang; }, set: function (code) { setLang(code); } }
});
```

- `children` (array or function) supplies menu sub-items, the sticky section bar and J/K stepping. Ids are element ids in the page.
- A view with `href` is a link-out. With `console` it is shown as that console. Link-outs are not tracked for progress unless `track: true`.
- Deep links: `#/view` and `#/view/anchor`.
- The shell calls `router.show` only; it never edits lesson markup. After a console redraws its sections it may call `StudyShell.refreshSections()` or `StudyShell.refreshProgress()`.

## Storage

Kept from v2 (unchanged meaning): `study-console-theme`, `study-console-last`, `study-console-reading`.

New in v3: `study-console-v3-menu` (collapsed groups), `study-console-v3-menu-hidden`, `study-console-v3-visited`, `study-console-v3-done`, `study-console-v3-sections` (pages that show the section bar, so its space is reserved before the first paint); session key `study-console-ui` (rollback choice).

Legacy per-console theme keys (`algoTheme`, `privTheme`, `osTheme`, `nd_light`, `wn_light`) are read once to migrate the theme. Each console's own progress and language keys are untouched and are read through its manifest.

## Rollback and cache busting

- `?ui=v2` on any page sends the session to that page's frozen `*.v2.html` (named by `data-v2`). `?ui=v3` returns to v3. The choice lasts for the browser session.
- Every shared asset is versioned from the `?v=` on `boot.js`. After changing anything under `shared/v3/`, bump the date stamp (`?v=YYYYMMDD-n`) in every console's boot tag so browsers fetch the new files together.
- Console-local stylesheets and scripts carry their own `?v=`.

## Diagrams

Use `StudyDiagram.create(host, { width, height, label })`, then `node`, `edge`, `text` and `legend`. Colours are written as `var(--sc-dg-N)` inline styles, so diagrams follow the theme without a redraw. Text is at least 13px at natural width; on narrow screens a diagram scales to at most 70% and then scrolls. Every diagram has an accessible name, and any colour that carries meaning appears in the legend. Tones: 1 teal, 2 violet, 3 amber, 4 rose, 5 blue, 6 green, 0 neutral.

Existing console diagrams keep their markup; `bridge.css` maps their legacy fills and strokes to the same palette.

## Frame behaviour

- Top bar (56px): brand, console switcher, breadcrumb, search (`/` or Ctrl/Cmd+K), progress, language (when the console has more than one), reading size and focus layout, theme.
- Left menu (268px): groups with remembered collapse, progress dots, current-page and current-section highlighting, Hide menu (`[`).
- Below 900px the menu becomes a drawer with a close button; below 600px header controls move into the drawer footer. All touch targets are at least 44px and respect safe-area insets.
- Wide tables get their own horizontal scroll; long inline code wraps.
- Frame space (top bar, menu, section bar, scrollbar) is reserved from the first paint by `boot.js`, so pages do not move when the shell mounts.
- Switching consoles is a normal page load; where the browser supports cross-document view transitions (Chrome 126+, Safari 18.2+) the bar and menu stay in place. Hovering a console link prefetches its HTML (Chrome).
- If a console changes page on its own (a button inside a lesson), the frame follows: menu, address and section bar update, and Back returns to the previous page.
- Iframes inside a console (ALG definition banks, PRV midterm pack) load the first time their page is opened.
- Long views (three or more top-level sections taller than three and a half screens) show one section at a time with Previous and Next cards at its end. "Show all" in the section bar switches back (remembered in `study-console-v3-paged`); the last section read per view is kept in `study-console-v3-page`. Search, J/K, deep links and a console's own `scrollIntoView` jumps reveal the right section; consoles that scroll by position call `StudyShell.reveal(el)` first. Printing shows every section.
- Reduced motion is honoured.

## Writing

Titles are the plain name of the page ("Chapters", "Final exam", "Cheat sheet"). No slogans, eyebrow labels, marketing lines, instructions on how to use the page, welcome dialogs or status words such as "exam ready". A line under a title only states scope (chapters, topics, term).

## QA checklist

- `node --check` on every changed script.
- jsdom smoke per page: boot ran, v3 assets present, no v2 assets, one header and one main, legacy chrome absent, every menu item navigates and the console shows that view, search returns results, theme toggles, no script errors.
- Chromium renders at 360, 768, 1024 and 1440 in light and dark: header 56px, no horizontal overflow, no touch target under 44px, no console errors.
- Content integrity: each migration asserts the lesson region is byte-identical to the v2 snapshot.
