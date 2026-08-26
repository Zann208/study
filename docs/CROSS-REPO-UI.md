# Cross-repository Study Console UI

The canonical global shell remains:

- `/shared/v1/study-system.css`
- `/shared/v1/study-system.js`

Older subject repositories also load:

- `/shared/v1/legacy-console.css`

`legacy-console.css` is a presentation-only compatibility bridge. It maps the older NETDES/WNET/ALGO/Privacy/OS visual variables and common components onto the Study Console v1 palette without changing course content or repository-local learning logic.

Each migrated external repository keeps a small `study-console-adapter.css` for genuinely subject-specific layout differences.

## Architecture

1. Course repository retains its original HTML/content and functional scripts.
2. Study Console v1 supplies the identical global header, console switcher, theme and recent-console behavior.
3. `legacy-console.css` normalizes common older UI patterns.
4. Local adapter CSS handles only the remaining subject-specific presentation.

The long-term direction is to reduce adapter CSS over time, not add more override generations.

## Content safety

Before a migration is accepted, removing the UI-only injection must reproduce the exact pre-migration Git blob for the page. See `CONTENT-INTEGRITY.md`.
