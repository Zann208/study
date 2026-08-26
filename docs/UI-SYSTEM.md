# Study Console UI System v1

`/shared/v1/` is the canonical UI generation for Study Console. Versioned assets let every console opt into a known design without future changes silently breaking older repositories.

## Design principles

Study Console is a learning environment first. The interface should be calm, readable, technical, and consistent. Learning content must dominate visual attention. Decorative terminal, HUD, grid, glow, particle, and neon patterns are intentionally excluded.

## Files

- `shared/v1/study-system.css` — tokens, global shell, layout, controls, learning blocks, tables, quiz primitives, themes, responsive behavior.
- `shared/v1/study-system.js` — global shell, console switcher, theme persistence, recent-console tracking, shared mobile-course navigation hook, optional copy behavior.
- `google-dc-hackathon/gdc.css` — subject-specific structures for the included Google Data Center console only.

External repositories may consume the hosted v1 assets from:

```html
<link rel="stylesheet" href="https://zann208.github.io/study/shared/v1/study-system.css">
<script src="https://zann208.github.io/study/shared/v1/study-system.js"></script>
```

Do not point production consoles at an unversioned `latest` asset. A future v2 should live beside v1.

## Color tokens

The system uses a neutral foundation and one primary burgundy identity accent.

| Token | Purpose |
|---|---|
| `--sc-bg` | page background |
| `--sc-surface` | primary raised surface |
| `--sc-surface-2` | quiet secondary surface |
| `--sc-text` | primary text |
| `--sc-muted` | secondary text |
| `--sc-line` | separators and neutral borders |
| `--sc-accent` | Study Console identity and primary action |
| `--sc-ok` | correct / completed |
| `--sc-info` | informational |
| `--sc-warn` | caution / exam note |
| `--sc-danger` | error / incorrect |

Subject identity should not introduce a new dominant palette. Console-specific colors are allowed only when they carry real semantic meaning.

## Themes

The initial theme follows the operating system. The shared theme button stores an explicit `light` or `dark` choice in `localStorage` under `study-console-theme`.

Light mode uses warm off-white surfaces and dark charcoal text. Dark mode uses neutral charcoal surfaces and comfortable off-white text. Neither mode should become a cybersecurity dashboard.

## Typography

Body and learning text use the shared sans-serif stack. Monospace is limited to code, commands, IP addresses, configuration, algorithm notation, identifiers, and small technical metadata.

Recommended reading text:
- body: 16–18px
- line-height: approximately 1.6–1.75
- reading width: `--sc-reading` (780px by default)

Do not force wide tools or tables into the reading width; they may use the wider content area when needed.

## Spacing

Canonical spacing tokens:

`4, 8, 12, 16, 24, 32, 48, 64px`

Use `--sc-s1` through `--sc-s8`. Add a non-token value only when a technical component genuinely requires it.

## Radius

- small controls: `--sc-radius-sm` (6px)
- cards/panels: `--sc-radius` (8px)
- larger structural panels: `--sc-radius-lg` (10px)
- pills: statuses only

## Global navigation

Every migrated console sets two body attributes:

```html
<body data-console-id="algo" data-console-name="Algorithms & Data Structures">
```

Use these IDs:
- `home`
- `netdes`
- `wnet`
- `algo`
- `privacy`
- `os`
- `gdc`

`study-system.js` creates the same global shell everywhere. Detailed consoles receive the same visible return route: `← Study Console`, current console name, console switcher, and theme control.

Do not create a competing global header inside a subject repository.

## Sidebar and lesson navigation

Detailed consoles may use a course sidebar when they contain modules. The shared layout supports:
- desktop sticky sidebar
- mobile off-canvas sidebar
- full-width lesson content on small screens
- semantic links for current sections

A right rail is optional and should only be introduced when a lesson is long enough for an on-page outline to genuinely improve navigation.

## Learning blocks

Use a small family of visual treatments rather than unique cards for every pedagogical idea.

- `.sc-learning-block.definition` — definition / concept / remember
- `.sc-learning-block.info` — why it matters / reference
- `.sc-learning-block.tip` — exam tip / caution
- `.sc-learning-block.correct` — correct / completed
- `.sc-learning-block.warning` — warning / incorrect

The label and wording distinguish `Example`, `Worked Example`, `Step-by-Step`, `Try It`, `Common Mistake`, and similar content. Do not create a new color for each label.

## Buttons

- `.sc-button` — secondary
- `.sc-button.sc-button-primary` — primary
- `.sc-button.sc-button-quiet` — quiet/text action

Buttons share consistent sizing, focus, hover, and pressed behavior. Danger styling should be used only for destructive actions.

## Cards

`.sc-card` is a restrained neutral container. Subject cards use hierarchy:
1. title
2. short educational description
3. optional factual metadata
4. one primary action

Avoid tag clouds, rainbow borders, glows, and multiple competing calls to action.

## Tables

Wrap tables in `.sc-table-wrap`. Horizontal scrolling belongs inside the table wrapper, never on the page. Use comfortable row padding and a clear but quiet header. Keep the first column emphasized when it helps scanning.

## Code and commands

Use `.sc-code` for a simple technical block and `.sc-code-label` for an optional language or command label. Horizontal scrolling stays local to the code block. Decorative terminal chrome is not part of the system.

## Quiz UI

Shared quiz primitives:
- `.sc-quiz`
- `.sc-question`
- `.sc-options`
- `.sc-option`
- `.sc-feedback`

Questions remain neutral until answered. Green is reserved for correct; red for incorrect. Feedback should explain why whenever the underlying content provides an explanation.

## Progress

Use a compact progress bar and plain-language label. Progress should support learning, not dominate the page. Store progress locally only where the console already supports it or where the learning state is explicit.

Do not fabricate percentages.

## Search

Search should be a normal labeled search field with results showing:
- title
- console
- module/section
- short context

Avoid command-palette or terminal presentation.

## Responsive behavior

Primary shared breakpoints:
- `900px` — course sidebar becomes a mobile sheet; content takes full width
- `640px` — tighter global shell and mobile spacing

Console-specific layouts may add one nearby breakpoint where the subject tool requires it, but avoid dozens of unrelated media queries.

Test at approximately:
`320, 360, 375, 390, 430, 768, 820, 1024, 1280, 1440, 1920px`.

Requirements:
- no horizontal page scrolling
- tables/code scroll locally
- touch targets approach 44px where practical
- cards stack before becoming cramped
- sidebars become drawers rather than shrinking
- learning text remains readable

## Accessibility

Preserve semantic HTML, heading hierarchy, keyboard navigation, labels, and ARIA where needed. The system provides `:focus-visible` and respects `prefers-reduced-motion`.

Do not turn informational `div` elements into fake buttons. Do not remove focus visibility when suppressing browser tap decoration.

## Adding a new console

A new console should require only:
1. add its metadata/link to the console list in `study-system.js`
2. set `data-console-id` and `data-console-name`
3. link the versioned shared stylesheet/script
4. build its lessons/tools with shared primitives
5. add only genuinely subject-specific CSS
6. test navigation, mobile, theme, keyboard, and preserved tools

It should not invent a new navigation, palette, button system, or card architecture.
