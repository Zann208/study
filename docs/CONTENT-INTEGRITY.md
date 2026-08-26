# Cross-repository UI migration — content integrity

This migration is presentation-only.

The builder package was checked against the current GitHub `main` branch before publication. The STUDY and Google DC files inside the builder package were older snapshots, so they were intentionally rejected; the already-approved current Study Console home and Google DC console remain the source of truth.

For NETDES, WNET, ALGO, Privacy and OS, each migrated HTML entry point was reconstructed back to its pre-migration form by removing only the injected shared CSS links, adapter CSS link, body metadata attributes and shared shell script. The reconstructed Git blob SHA matched the current GitHub source exactly before migration.

Verified current entry points:

- NETDES `index.html`
- WNET `index.html`
- ALGO `index.html`
- ALGO `midterm.html`
- Privacy `index.html`
- Privacy `midterm-pack.html`
- OS `index.html`

Additional checks confirmed that migration changes do not modify:

- visible course text
- inline functional JavaScript
- `<pre>` blocks
- `<code>` blocks
- table content/order
- headings/order

The migration only adds shared presentation assets and metadata used by the Study Console shell.

## Rule

Course content is read-only. If a future UI change would require changing definitions, formulas, questions, answers, examples, code, module order or exam material, stop and review it separately instead of silently editing the course content.
