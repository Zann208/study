#!/usr/bin/env python3
"""Merge Burmese translation sources (TSV: key<TAB>html, one per line) into a lazy-loaded JS bundle.

usage: build_my.py SRC_DIR OUT_JS VAR_NAME [EN_JSON]
With EN_JSON, prints coverage and warns about keys that are not in the page or whose
inline tags (<b>, <code>, ...) do not match the English source.
"""
import glob, json, os, re, sys
from collections import Counter

src_dir, out_js, var = sys.argv[1], sys.argv[2], sys.argv[3]
en = json.load(open(sys.argv[4], encoding='utf-8')) if len(sys.argv) > 4 else None
s = {}
for f in sorted(glob.glob(os.path.join(src_dir, '*.tsv'))):
    for n, line in enumerate(open(f, encoding='utf-8'), 1):
        line = line.rstrip('\n')
        if not line.strip() or line.startswith('#'):
            continue
        if '\t' not in line:
            print('WARN no tab: %s:%d' % (f, n)); continue
        k, v = line.split('\t', 1)
        k, v = k.strip(), v.strip()
        if k in s and s[k] != v:
            print('WARN duplicate key %s (%s:%d)' % (k, f, n))
        s[k] = v

def tags(h):
    return Counter(t.lower() for t in re.findall(r'</?\s*([a-zA-Z0-9]+)', h))

if en is not None:
    bad = [k for k in s if k not in en]
    for k in bad:
        print('WARN unknown key', k)
    for k, v in s.items():
        if k in en and tags(v) != tags(en[k]):
            print('WARN tag mismatch', k, dict(tags(en[k])), dict(tags(v)))
    tot = sum(len(v) for v in en.values()); got = sum(len(en[k]) for k in s if k in en)
    print('coverage: %d/%d units, %.1f%% of English text' % (len(s), len(en), 100.0 * got / max(tot, 1)))

body = json.dumps({'s': s}, ensure_ascii=False, separators=(',', ':'))
open(out_js, 'w', encoding='utf-8').write(
    '/* Burmese (Myanmar) layer. Keys match data-i18n attributes in index.html. Built from i18n/my/*.tsv. */\n'
    'window.%s=%s;\n' % (var, body))
print('wrote', out_js, len(s), 'keys')
