from pathlib import Path
import base64, io, zipfile

# One-shot migration for the reviewed learning-first builder package.
# The payload is split into small repository chunks to avoid transport truncation.
EXPECTED = [
    'index.html','home.css','README.md','shared/v1/README.md',
    'shared/v1/study-system.js','shared/v1/study-system.css',
    'docs/TESTING.md','docs/MIGRATION.md','docs/UI-SYSTEM.md',
    'google-dc-hackathon/index.html','google-dc-hackathon/gdc.css'
]

repo = Path('.')
parts = sorted((repo / 'scripts' / 'payload').glob('part*.txt'))
if [p.name for p in parts] != [f'part{i:02d}.txt' for i in range(7)]:
    raise RuntimeError('Study Console migration payload is incomplete')
payload = ''.join(p.read_text(encoding='utf-8').strip() for p in parts)
raw = base64.b64decode(payload, validate=True)

with zipfile.ZipFile(io.BytesIO(raw)) as z:
    if z.namelist() != EXPECTED:
        raise RuntimeError(f'Unexpected package manifest: {z.namelist()}')
    bad = z.testzip()
    if bad:
        raise RuntimeError(f'Corrupt migration payload member: {bad}')
    for rel in EXPECTED:
        target = repo / rel
        target.parent.mkdir(parents=True, exist_ok=True)
        target.write_bytes(z.read(rel))

home = (repo / 'index.html').read_text(encoding='utf-8')
gdc = (repo / 'google-dc-hackathon/index.html').read_text(encoding='utf-8')
shared = (repo / 'shared/v1/study-system.js').read_text(encoding='utf-8')
checks = {
    'shared stylesheet': 'shared/v1/study-system.css' in home,
    'six console cards': home.count('data-console-launch') == 6,
    'continue learning': 'data-continue-learning' in home,
    'global return route': '← Study Console' in shared,
    'console switcher': 'data-sc-switch' in shared,
    'theme persistence': 'study-console-theme' in shared,
    'GDC search': 'const searchIndex=[' in gdc,
    'GDC quiz': gdc.count('class="q"') == 3,
    'GDC modules': gdc.count('class="module') == 10,
    'GDC progress key': 'gdc-hackathon-module1' in gdc,
    'GDC countdown': '2026-09-26T09:00:00+07:00' in gdc,
    'GDC responsive drawer': 'innerWidth<=900' in gdc,
    'GDC aria state': "setAttribute('aria-expanded'" in gdc,
}
failed = [name for name, ok in checks.items() if not ok]
if failed:
    raise RuntimeError('Study Console v1 guardrails failed: ' + ', '.join(failed))
print('Applied reviewed Study Console UI System v1')
