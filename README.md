# Study Console

Central landing page for the independent browser-based technical learning environments I build for myself.

**Live hub:** https://zann208.github.io/study/

## Purpose

Study Console is the **single navigation hub** for my personal technical learning system. Each subject area stays in its own repository or subfolder so it can grow independently without making the landing page fragile.

The consoles are designed for understanding, revision, calculations, troubleshooting practice, simulations, reference, and active recall. They use plain HTML, CSS and JavaScript so they remain easy to host, inspect and maintain.


## Shared UI architecture

The canonical interface is **Study Console UI v3** under `shared/v3/`. Every console uses one master frame (top bar, left menu, search, progress, theme, language and reading controls) drawn by the shared shell from a small manifest the console provides. Consoles stay separately deployable.

- `shared/v3/boot.js` is the only tag a page needs: it applies the theme before paint, supports `?ui=v2` rollback, and loads the versioned v3 assets.
- `shared/v3/tokens.css`, `shell.css`, `shell.js`, `components.css` and `bridge.css` are the tokens, frame, components and legacy-variable adapter.
- `shared/v3/diagram.js` is the shared diagram standard; `shared/v3/preview.html` is the live design-system page.
- [UI v3 architecture, manifest contract, rollback and cache busting](docs/UI-SYSTEM-V3.md).

UI v2 (`shared/v2/`) stays live as the frozen rollback: each migrated page keeps a `*.v2.html` snapshot, reachable with `?ui=v2`. `shared/v1/` is retained unchanged for compatibility.

## Current consoles

| Console | Focus | Source | Live |
|---|---|---|---|
| **NET** | Network Design & Management | [netdes](https://github.com/Zann208/netdes) | [open](https://zann208.github.io/netdes/) |
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
[Study Console](https://zann208.github.io/study/)
