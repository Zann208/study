# Regression and Responsive Verification

## Automated structural checks

49 structural/function-preservation checks passed.

Checked:
- local CSS/JS asset paths resolve
- HTML IDs remain unique
- no inline style attributes remain
- one H1 per page
- Google DC search hooks and search index remain present
- Google DC quiz options remain present
- Google DC glossary filters remain present
- Google DC progress/localStorage key remains `gdc-hackathon-module1`
- Google DC countdown date remains unchanged
- shared JavaScript passes `node --check`
- Google DC inline JavaScript passes `node --check`
- Google DC mobile drawer uses the same 900px breakpoint as its CSS and keeps `aria-expanded` synchronized
- no unnecessary `!important` outside the reduced-motion safeguard
- old cyan/neon/grid design tokens are absent
- six canonical console launch cards remain
- console names are unique and consistent

## Responsive source audit

The shared system was reviewed against these target widths:

- 320
- 360
- 375
- 390
- 430
- 768
- 820
- 1024
- 1280
- 1440
- 1920 px

The canonical responsive rules use:
- 900px: course sidebar becomes an off-canvas mobile sheet and main content becomes full width
- 700px: Google DC multi-column learning/card structures reduce
- 640px: shared global shell and page spacing tighten
- 520px: Google DC controls and lesson flows tighten further

Tables use local overflow containers, grid children use `minmax(0,1fr)` where appropriate, and mobile course navigation does not require shrinking the desktop sidebar.

## Browser-render limitation

A local Chromium headless render was attempted, but the available container Chromium terminates during GPU initialization before rendering a page. Because of that environment limitation, this package does **not** claim a physical iPhone Safari / Android Chrome / desktop Safari / Firefox visual-device run.

Before publishing, perform a final visual pass in real browsers or DevTools at the matrix above, concentrating on:
- global header and console switcher
- Google DC sidebar open/close behavior
- search results positioning
- lesson table local scrolling
- quiz tap targets
- light/dark theme
- 320px page overflow

The implementation is intentionally CSS/vanilla-JS and uses graceful baselines for unsupported enhancements.
