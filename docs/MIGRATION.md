# Cross-Repository Migration Checklist

The repositories for NETDES, WNET, ALGO, Privacy, and OS were not present in the supplied ZIP. They have not been modified. Use this checklist when migrating each one.

## Standard migration sequence

1. Create a branch or snapshot of the current console.
2. Inventory working tools, quizzes, calculators, simulators, search, progress keys, links, and keyboard behavior.
3. Link the versioned shared assets:
   - `https://zann208.github.io/study/shared/v1/study-system.css`
   - `https://zann208.github.io/study/shared/v1/study-system.js`
4. Set the correct `data-console-id` and canonical console name on `<body>`.
5. Remove the old global shell and let the shared shell provide:
   - `← Study Console`
   - current console identity
   - console switcher
   - theme toggle
6. Replace console-wide tokens, typography, buttons, links, cards, tables, forms, quiz chrome, and generic learning blocks with shared primitives.
7. Keep subject-specific tools and only the CSS required to express their unique layout or visualization.
8. Remove obsolete color systems, duplicate media queries, terminal/HUD decoration, old nav CSS, inline styling, dead classes, and unnecessary `!important`.
9. Confirm any existing localStorage keys continue to work. Do not rename them casually.
10. Test all functionality before and after visual cleanup.
11. Test light/dark, keyboard, touch, and widths from 320px through 1920px.
12. Compare the entry and exit experience with Study Console and Google Data Center; global navigation should feel identical.

## NETDES — Network Design & Troubleshooting

Preserve networking modules, configuration examples, troubleshooting flows, STP simulator, and bilingual behavior. Migrate the global shell first, then shared typography/forms/buttons, then normalize learning blocks around concepts, commands, examples, and practice. Do not simplify network diagrams or simulator controls merely to make them look like cards.

## WNET — Wireless Network Engineering

Preserve RF calculators, capacity/design tools, diagrams, Wi-Fi/security content, and numeric input behavior. Tables and calculation outputs may use wider content regions. Use the shared form/button system but retain subject-specific visualization CSS where RF concepts need it.

## ALGO — Algorithms & Data Structures

Preserve algorithm visualizers, pseudocode/code blocks, complexity notation, and interactive stepping. Use monospace only inside technical notation/code. Keep explanatory prose in the sans-serif reading system and normalize practice/answer feedback to shared learning blocks.

## Privacy — Privacy & Information Security

Preserve privacy/security explanations, exercises, risk/control reasoning, and any calculators or interactive review. Remove dashboard/hacker framing where present; security is the subject, not the visual theme. Semantic warning/error colors remain available for actual meaning.

## OS — Operating Systems & Scheduling

Preserve scheduler tools, Banker's Algorithm, process/memory exercises, tables, calculations, and step-by-step results. Give interactive tools the width they need while keeping explanations at reading width. Standardize inputs/buttons and keep numeric results readable on mobile.

## Acceptance checks per repository

- Same global header height, wording, switcher, theme behavior, and `← Study Console`
- Canonical subject title used in header, browser title, Study Console card, and switcher
- No page-level horizontal overflow at 320px
- Local overflow only for technical tables/code/diagrams when necessary
- Existing tools still produce the same results
- Search still finds the same material
- Quiz correctness and explanations are unchanged unless intentionally improved
- Existing progress/localStorage persists
- Mobile sidebar/drawer is keyboard and touch accessible
- Light and dark themes both support long study sessions
- No new framework or large dependency
