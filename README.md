# Study Console

Central landing page for the browser-based study environments I build for coursework and technical preparation at Chiang Mai University.

**Live hub:** https://zann208.github.io/study/

## Purpose

The Study Console is the **single navigation hub**. Each course or preparation area stays in its own repository or subfolder so content can grow independently without making the landing page fragile.

The consoles are designed for revision, exam preparation, labs, calculations, troubleshooting practice and interactive learning. They use plain HTML, CSS and JavaScript so they remain easy to host, inspect and maintain.

## Current consoles

| Code | Console | Source | Live |
|---|---|---|---|
| **NET** | Computer Network Design & Management | [netdes](https://github.com/Zann208/netdes) | [open](https://zann208.github.io/netdes/) |
| **WLN** | Wireless & Broadband Computer Networks | [wnet](https://github.com/Zann208/wnet) | [open](https://zann208.github.io/wnet/) |
| **ALG** | Algorithms for iSNE | [algo](https://github.com/Zann208/algo) | [open](https://zann208.github.io/algo/) |
| **PRV** | The Cult of Privacy Technologies | [privacy](https://github.com/Zann208/privacy) | [open](https://zann208.github.io/privacy/) |
| **OS** | Operating Systems | [os](https://github.com/Zann208/os) | [open](https://zann208.github.io/os/) |
| **GDC** | Google Data Center Hardware Hackathon 2026 | this repository: `google-dc-hackathon/` | [open](https://zann208.github.io/study/google-dc-hackathon/) |

## Long-term structure

- `study` = central study hub and cross-course navigation.
- Separate course repos = the source of truth for each course console.
- `google-dc-hackathon/` = competition-preparation console maintained inside this hub.
- `Zann208.github.io` = professional portfolio; it should link to the Study Console as a project, not duplicate every course page.
- `Zann208/Zann208` = GitHub profile README; it should stay concise and recruiter-facing.

## Stability rules

1. Keep one clear source of truth for every console.
2. Prefer small, intentional edits over chains of patch scripts.
3. Do not add overlapping workflows that automatically rewrite generated HTML after normal edits.
4. Test navigation links and mobile layout after structural changes.
5. Keep course-specific content inside its course repo; use this hub only for discovery and shared navigation.
6. Keep naming consistent: NET, WLN, ALG, PRV, OS and GDC.
7. Preserve `.nojekyll` for direct static GitHub Pages hosting.

## Technology

Vanilla HTML, CSS and JavaScript hosted with GitHub Pages. No framework is required for the central hub.

---
Built by **Zann** · [portfolio](https://zann208.github.io/) · [GitHub](https://github.com/Zann208)
