# Study Console UI v2

UI v2 is the shared interface for the Study hub, NETDES, WNET, ALGO, Privacy, OS, and Google Data Center preparation. It is a presentation and navigation update. Subject content remains owned by its original repository.

## Interface

- Cool neutral surfaces, blue primary actions, readable sans-serif UI, and distinct semantic feedback colors.
- One compact header with a home link, accessible console switcher, subject controls, and shared light/dark control.
- Subjects and Engineering Lab have separate groups on the homepage and in the switcher.
- Subject tabs and search controls are moved into the header as the original DOM nodes, preserving IDs and event handlers. They open inside the Sections menu at narrow widths or whenever the tabs no longer fit beside the picker and utility controls. Available space is checked after resizing, font loading, and utility changes. The NETDES More menu continues to handle desktop overflow.
- ALGO and Data Center sidebar buttons share the header on mobile. Standalone exam tools also use this header; embedded lesson pages keep inheriting their parent's shell.
- The header height is measured; the old local-toolbar offset is zero. No second sticky subject header remains.
- The topic/lab rail stays collapsed while reading. Hover just below the header or use its Jump button to reveal it. Pointer exit dismisses it, while keyboard focus keeps active controls available. Escape and outside clicks dismiss it. The rail is inert when closed and absent outside relevant study sections.
- Switcher focus dismissal checks the incoming focus target. A focusout microtask must not hide links during pointer or keyboard focus transfer.
- Existing mobile drawers gain focus handling, Escape dismissal, and accessible open/closed state.
- The existing recent-console preference drives Continue learning. Stored URLs are restricted to the selected console's own path.
- Lessons use a shared reading layout: a clear page/lesson/topic type scale, a limited prose width, larger paragraph and table text, aligned lesson headers, and distinct key-idea/example/remember/warning callouts. Original code whitespace and diagram markup are preserved.
- The header's Aa control offers Standard, Large, and Larger text plus a Focus layout. Focus narrows the reading lane and stacks prose grids; it never hides lessons, changes answers, or changes the original expanded/collapsed state of notes.
- Card header titles use the same margin reset for both h2 and h3, so badges, titles, and status labels align without inheriting the spacing between prose sections.

## Canonical files

| File | Responsibility |
|---|---|
| `shared/v2/theme-init.js` | Applies theme before styling, reconciles legacy theme classes, and synchronizes embedded pages and other tabs. |
| `shared/v2/study-system.css` | Tokens, shared header, controls, states, and responsive primitives. |
| `shared/v2/study-system.js` | Console navigation, theme control, recent-console state, keyboard support, and mobile drawer enhancements. |
| `shared/v2/legacy-console.css` | Maps existing UI variables and controls to v2 without altering learning logic. |
| `shared/v2/reading.css` | Canonical lesson typography, content spacing, reference tables, semantic callouts, and reading-option presentation. |
| `shared/v2/reading.js` | Adds presentation classes and informational-table scroll wrappers without rewriting lesson nodes. Provides reading preferences and formats subsequently inserted content. |
| Subject `study-console-adapter.css` | Only subject-specific layout adjustments. |

`shared/v1/` is retained unchanged. Do not modify v1 to deliver a v2 feature or add another general override layer in subject repositories.

## Content protection

Original lab numbers, headings, definitions, examples, formulas, questions, answers, code samples, SVG topology markup, and functional subject scripts must remain intact during UI work. Professor topology positions, labels, links, and lab numbering are source-of-truth constraints. These rules take precedence over older guidance about renaming academic structure.

Nine subject/exam HTML pages were checked by reversing only the shared-asset references and removing the new theme-loader/bridge tags. Their complete bytes matched the original committed files. Every existing tracked JavaScript file remained unchanged. The main hub is the only rewritten HTML page.

UI-only changes may modify shared styles, adapters, interface behavior, and asset references. Content edits need a separate user request. Preserve all existing learning-progress keys. Shared UI uses `study-console-theme`, `study-console-last`, and the device-local `study-console-reading` preference for text size and focus layout. Reading preferences also apply to embedded lesson pages.

The September 10 identity cleanup was explicitly requested: remove personal names, student IDs, instructor names, and course-code labels from active and legacy pages, exam views, dynamic templates, and downloadable notes. Named examples use an anonymous sample value with the same explanation. Keep technical lab credentials and exact source filenames, even where their digits overlap a course code; they are required to reproduce the original labs. Do not change repository addresses or learning-progress keys.

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

The navigation follow-up runs the actual page scripts in a simulated DOM across ten entry pages and both desktop and compact menu states. It checks link activation and focus handoff, original subject-tab handlers after reparenting, sidebar actions, and pointer/keyboard/touch-button rail dismissal. Subject HTML changes are limited to the matching CSS/JS cache version, and subject scripts remain unchanged.

The reading follow-up preserves all nine lesson/exam entry files byte-for-byte after removing the two reading asset tags. Runtime checks compare lesson text and order, code blocks, SVG markup, form values, expanded/collapsed note state, and existing storage before and after reading enhancement. Text-size/focus changes and dynamic content formatting are checked separately. Reference tables containing inputs or diagram elements are excluded from scroll wrapping.

These are source and programmatic checks. A real-browser visual and interaction walkthrough is a separate verification step; do not describe source checks as a device/browser test.
