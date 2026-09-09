# Study Console UI v2

UI v2 is the shared interface for the Study hub, NETDES, WNET, ALGO, Privacy, OS, and Google Data Center preparation. It is a presentation and navigation update. Subject content remains owned by its original repository.

## Interface

- Cool neutral surfaces, blue primary actions, readable sans-serif UI, and distinct semantic feedback colors.
- One global header with a home link, accessible console switcher, and shared light/dark control.
- Subjects and Engineering Lab have separate groups on the homepage and in the switcher.
- Subject tabs, search, tool controls, and sidebars retain their native handlers.
- Local toolbar heights are measured so sticky headers and section navigation do not overlap.
- Existing mobile drawers gain focus handling, Escape dismissal, and accessible open/closed state.
- The existing recent-console preference drives Continue learning. Stored URLs are restricted to the selected console's own path.

## Canonical files

| File | Responsibility |
|---|---|
| `shared/v2/theme-init.js` | Applies theme before styling, reconciles legacy theme classes, and synchronizes embedded pages and other tabs. |
| `shared/v2/study-system.css` | Tokens, shared header, controls, states, and responsive primitives. |
| `shared/v2/study-system.js` | Console navigation, theme control, recent-console state, keyboard support, and mobile drawer enhancements. |
| `shared/v2/legacy-console.css` | Maps existing UI variables and controls to v2 without altering learning logic. |
| Subject `study-console-adapter.css` | Only subject-specific layout adjustments. |

`shared/v1/` is retained unchanged. Do not modify v1 to deliver a v2 feature or add another general override layer in subject repositories.

## Content protection

Original lab numbers, headings, definitions, examples, formulas, questions, answers, code samples, SVG topology markup, and functional subject scripts must remain intact during UI work. Professor topology positions, labels, links, and lab numbering are source-of-truth constraints. These rules take precedence over older guidance about renaming academic structure.

Nine subject/exam HTML pages were checked by reversing only the shared-asset references and removing the new theme-loader/bridge tags. Their complete bytes matched the original committed files. Every existing tracked JavaScript file remained unchanged. The main hub is the only rewritten HTML page.

UI-only changes may modify shared styles, adapters, interface behavior, and asset references. Content edits need a separate user request. Preserve all existing learning-progress keys. UI v2 writes only the existing `study-console-theme` and `study-console-last` preferences.

## Delivery order

1. Publish the hub with all v2 assets while keeping v1 available.
2. Confirm v2 assets are served successfully.
3. Publish each subject repository's v2 references and adapter adjustments.
4. Verify Pages deployment and live source hashes for each changed entry point.

The WNET and Privacy `flatten-console.yml` workflows now perform read-only validation. They must never regenerate `index.html` from `legacy.html`. The maintained entry page is the deployable source of truth.

## Verification

- Exact content restoration checks for all nine subject/exam entry pages.
- Existing subject JavaScript unchanged; new shared JavaScript syntax checked.
- Theme state checks cover saved/system preferences, disabled storage, corrupt state, iframe inheritance, cross-tab changes, and legacy initialization.
- Local assets, primary routes, HTML IDs, and shared-asset inclusion checked.
- Responsive rules account for narrow screens, scrollable subject tabs, mobile drawers, reduced motion, and light/dark contrast.

These are source and programmatic checks. A real-browser visual and interaction walkthrough is a separate verification step; do not describe source checks as a device/browser test.
