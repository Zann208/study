# Study Console

Central landing page for the independent browser-based technical learning environments I build for myself.

**Live hub:** https://zann208.github.io/study/

## Purpose

Study Console is the **single navigation hub** for my personal technical learning system. Each subject area stays in its own repository or subfolder so it can grow independently without making the landing page fragile.

The consoles are designed for understanding, revision, calculations, troubleshooting practice, simulations, reference, and active recall. They use plain HTML, CSS and JavaScript so they remain easy to host, inspect and maintain.


## Shared UI architecture

The canonical interface is **Study Console UI v2** under `shared/v2/`. The homepage separates Subjects from Engineering Lab, and every console uses the same global navigation and theme.

- `shared/v2/theme-init.js` applies the shared theme before the page is styled.
- `shared/v2/study-system.css` provides colors, typography, navigation, controls, and responsive primitives.
- `shared/v2/study-system.js` provides the console switcher, theme control, recent-console tracking, and accessible navigation enhancements.
- `shared/v2/legacy-console.css` connects existing subject interfaces to the shared system.
- `shared/v2/reading.css` and `reading.js` provide consistent lesson typography, content separation, reference-table layouts, and optional text-size/focus preferences without rewriting study material.
- Subject repositories keep their original lessons, tools, and small local layout adapters.
- [UI v2 architecture and content protection](docs/UI-SYSTEM-V2.md) documents the maintained system and delivery order.

External consoles use `https://zann208.github.io/study/shared/v2/`. The previous `shared/v1/` assets are retained unchanged for compatibility.

## Current consoles

| Console | Focus | Source | Live |
|---|---|---|---|
| **NET** | Network Design & Troubleshooting | [netdes](https://github.com/Zann208/netdes) | [open](https://zann208.github.io/netdes/) |
| **WLN** | Wireless Network Engineering | [wnet](https://github.com/Zann208/wnet) | [open](https://zann208.github.io/wnet/) |
| **ALG** | Algorithms & Data Structures | [algo](https://github.com/Zann208/algo) | [open](https://zann208.github.io/algo/) |
| **PRV** | Privacy & Information Security | [privacy](https://github.com/Zann208/privacy) | [open](https://zann208.github.io/privacy/) |
| **OS** | Operating Systems & Scheduling | [os](https://github.com/Zann208/os) | [open](https://zann208.github.io/os/) |
| **GDC** | Google Data Center Hardware Hackathon 2026 | this repository: `google-dc-hackathon/` | [open](https://zann208.github.io/study/google-dc-hackathon/) |

## Content preservation

During UI work, preserve original LAB numbers, professor topology fidelity, headings, technical content, examples, questions, answers, and learning-tool behavior. This takes precedence over older guidance below about renaming academic structure.

## Public identity rule

The consoles are presented as **my own technical learning environments**, not as mirrors of university courses.

Public-facing wording should therefore avoid:

- university course codes or subject numbers
- exact official course titles when they identify a specific university offering
- instructor names, class schedules, rooms, office hours, grading breakdowns, or LMS references
- labels such as `Lecture 01`, `Week 4`, `Worksheet 2`, `course handout`, or source-file identifiers when they expose the original class structure
- claims such as "built from lecture slides" or "for [course code] at [university]"

Keep the useful **technical content**: explanations, examples, tools, calculators, simulations, troubleshooting flows, practice questions, definitions, diagrams, and original organization. Rename structure into neutral product language such as **modules, topics, concepts, practice, workbench, reference, mastery, challenge, or review**.

Academic affiliation can still appear on the professional portfolio/resume where appropriate; it should not define the identity of the Study Console itself.

## Long-term structure

- `study` = central learning hub and cross-console navigation.
- Separate topic repos = the source of truth for each technical console.
- `google-dc-hackathon/` = competition-preparation console maintained inside this hub.
- `Zann208.github.io` = professional portfolio; it links to Study Console as a project rather than duplicating every console.
- `Zann208/Zann208` = GitHub profile README; it stays concise and recruiter-facing.

## Stability rules

1. Keep one clear source of truth for every console.
2. Prefer small, intentional edits over chains of patch scripts.
3. Do not add overlapping workflows that automatically rewrite generated HTML after normal edits.
4. Test navigation links and mobile layout after structural changes.
5. Keep topic-specific content inside its own repo; use this hub only for discovery and shared navigation.
6. Keep naming consistent: NET, WLN, ALG, PRV, OS and GDC.
7. Preserve `.nojekyll` for direct static GitHub Pages hosting.
8. Before adding new material, rewrite its framing into the console's own neutral topic structure rather than copying university labels.

## Technology

Vanilla HTML, CSS and JavaScript hosted with GitHub Pages. No framework is required for the central hub.

---
Built by **Zann** · [portfolio](https://zann208.github.io/) · [GitHub](https://github.com/Zann208)
