# Study Console shared UI — v1

This directory is the versioned canonical Study Console UI system.

- `study-system.css` contains cross-console design tokens and reusable components.
- `study-system.js` creates the shared global navigation shell and owns shared theme/recent-console behavior.
- `legacy-console.css` is the presentation-only bridge used by migrated legacy subject consoles.

Production consoles reference `/study/shared/v1/` explicitly. The base v1 contract remains backward-compatible; breaking architecture changes require a new version.

See [`/docs/UI-SYSTEM.md`](../../docs/UI-SYSTEM.md), [`/docs/MIGRATION.md`](../../docs/MIGRATION.md), [`/docs/CROSS-REPO-UI.md`](../../docs/CROSS-REPO-UI.md), and [`/docs/CONTENT-INTEGRITY.md`](../../docs/CONTENT-INTEGRITY.md).
