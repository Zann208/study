# Study Console shared UI — v1

This directory is the versioned canonical Study Console UI system.

- `study-system.css` contains cross-console design tokens and reusable components.
- `study-system.js` creates the shared global navigation shell and owns shared theme/recent-console behavior.

Production consoles should reference `/study/shared/v1/` explicitly. Do not mutate v1 incompatibly after external repositories adopt it; create `/shared/v2/` for breaking changes.

See [`/docs/UI-SYSTEM.md`](../../docs/UI-SYSTEM.md) for component rules and [`/docs/MIGRATION.md`](../../docs/MIGRATION.md) for cross-repository migration.
