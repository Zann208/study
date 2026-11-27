#!/usr/bin/env python3
"""Tag translatable blocks in a console page with data-i18n keys, without reformatting the file.

usage: i18n_tag.py PAGE OUT_JSON SECTION_ID[,SECTION_ID...] [--group-by article|section] [--dry]

A "unit" is the innermost block element (p, li, h1-h5, td, th, summary, dt, dd, caption,
figcaption, or a div/span with a known prose class) that has English text and holds no
other block inside it. Elements that already carry data-i18n are left alone. Keys are
<group>.<nnn>, where group is the enclosing article id (or section id).
Existing keys in the page are respected so the counter continues after them.
"""
import json, re, sys
from html.parser import HTMLParser

BLOCK = {'p', 'li', 'h1', 'h2', 'h3', 'h4', 'h5', 'td', 'th', 'summary', 'dt', 'dd', 'caption', 'figcaption'}
CONTAINER = {'div', 'ul', 'ol', 'table', 'tr', 'tbody', 'thead', 'section', 'article', 'details', 'dl', 'figure', 'pre', 'svg', 'form', 'nav', 'header', 'footer', 'aside', 'main'}
PROSE_CLASS = re.compile(r'\b(lesson|box|tldr|lede|sub|sub2|note|tag|hint|desc|lead|kicker|callout|intro|meta|caption|why|tip)\b')
VOID = {'br', 'img', 'hr', 'input', 'meta', 'link', 'wbr', 'source', 'col', 'area', 'base', 'embed', 'param', 'track'}
INLINE = {'b', 'strong', 'span', 'small', 'em', 'i', 'label', 'a'}
SKIP = {'script', 'style', 'pre', 'svg', 'code', 'textarea', 'select', 'canvas'}


class Tagger(HTMLParser):
    def __init__(self, src, sections, group_by):
        super().__init__(convert_charrefs=False)
        self.src = src
        self.lines = [0]
        for m in re.finditer('\n', src):
            self.lines.append(m.end())
        self.sections = set(sections)
        self.group_by = group_by
        self.stack = []  # dicts: tag, start, inner_start, unitable, has_block, tagged, group
        self.units = []  # (insert_pos, group, inner_start, inner_end)
        self.inl = []
        self.in_section = 0
        self.skip = 0

    def abspos(self):
        ln, col = self.getpos()
        return self.lines[ln - 1] + col

    def cur_group(self):
        if self.group_by == 'article':
            for fr in reversed(self.stack):
                if fr['tag'] in ('article', 'details') and fr.get('id'):
                    return fr['id']
            for fr in reversed(self.stack):
                if fr['tag'] == 'div' and fr.get('id') and 'panel' in fr.get('cls', ''):
                    return fr['id']
        for fr in reversed(self.stack):
            if fr.get('sec'):
                return fr['sec']
        return None

    def handle_starttag(self, tag, attrs):
        a = dict(attrs)
        pos = self.abspos()
        text = self.get_starttag_text()
        if tag in VOID:
            return
        fr = {'tag': tag, 'start': pos, 'inner': pos + len(text), 'id': a.get('id'), 'has_block': False,
              'text': False, 'cls': a.get('class') or '', 'locked': 'data-i18n' in a or 'data-my' in a or 'data-noi18n' in a}
        if tag == 'section' and a.get('id') in self.sections:
            fr['sec'] = a['id']
            self.in_section += 1
        if tag in SKIP:
            self.skip += 1
        cls = a.get('class') or ''
        fr['unitable'] = (tag in BLOCK) or (tag in ('div', 'span') and bool(PROSE_CLASS.search(cls)))
        fr['inline'] = (not fr['unitable'] and tag in INLINE and not a.get('id')
                        and not re.search(r'\b(badge|eqn|ic|bv|bl|num|mono|kbd|count)\b', cls))
        # a block start marks every open ancestor as holding a block
        if tag in BLOCK or tag in CONTAINER or fr['unitable']:
            for anc in self.stack:
                anc['has_block'] = True
        if fr['locked']:
            for anc in self.stack:
                anc['has_block'] = True  # never wrap an already-keyed element
        self.stack.append(fr)

    def handle_startendtag(self, tag, attrs):
        pass

    def handle_data(self, data):
        if self.skip or not self.stack:
            return
        if re.search(r'[A-Za-z]{2,}', data):
            for anc in self.stack:
                anc['text'] = True

    def handle_endtag(self, tag):
        if tag in VOID:
            return
        # pop to the matching tag (tolerate unclosed inline tags)
        idx = None
        for i in range(len(self.stack) - 1, -1, -1):
            if self.stack[i]['tag'] == tag:
                idx = i
                break
        if idx is None:
            return
        while len(self.stack) > idx:
            fr = self.stack.pop()
            end = self.abspos()
            if fr['tag'] in SKIP:
                self.skip -= 1
            if fr.get('sec'):
                self.in_section -= 1
            if (self.in_section and fr['unitable'] and fr['text'] and not fr['has_block'] and not fr['locked']
                    and not self.skip and not any(x['locked'] for x in self.stack)):
                self.stack.append(fr)  # so cur_group sees enclosing frames correctly
                g = self.cur_group()
                self.stack.pop()
                tag_end = fr['start'] + 1 + len(fr['tag'])
                self.units.append((tag_end, g, fr['inner'], end))
            elif (self.in_section and fr.get('inline') and fr['text'] and not fr['has_block'] and not fr['locked']
                    and not self.skip and not any(x['locked'] for x in self.stack)):
                self.stack.append(fr)
                g = self.cur_group()
                self.stack.pop()
                self.inl.append((fr['start'] + 1 + len(fr['tag']), g, fr['inner'], end))


def main():
    page, out_json, secs = sys.argv[1], sys.argv[2], sys.argv[3].split(',')
    group_by = 'article'
    if '--group-by' in sys.argv:
        group_by = sys.argv[sys.argv.index('--group-by') + 1]
    dry = '--dry' in sys.argv
    src = open(page, encoding='utf-8').read()
    t = Tagger(src, secs, group_by)
    t.feed(src)
    t.close()
    existing = {}
    for k in re.findall(r'data-i18n="([^"]+)"', src):
        g, _, n = k.rpartition('.')
        if n.isdigit():
            existing[g] = max(existing.get(g, 0), int(n))
    counters = dict(existing)
    units = list(t.units)
    # inline orphans: accept outermost ones that sit outside every block unit
    inl = sorted(t.inl, key=lambda u: (u[2], -u[3]))
    taken = []
    for u in inl:
        if any(b[2] <= u[2] and u[3] <= b[3] for b in units):
            continue
        if any(b[2] <= u[2] and u[3] <= b[3] for b in taken):
            continue
        taken.append(u)
    units = sorted(units + taken, key=lambda u: u[2])
    out = {}
    inserts = []
    units = [u for u in units if not re.search(r'<(input|select|textarea|button|canvas)\b|\sid="', src[u[2]:u[3]])]
    for tag_end, g, i0, i1 in units:
        counters[g] = counters.get(g, 0) + 1
        key = '%s.%03d' % (g, counters[g])
        out[key] = src[i0:i1].strip()
        inserts.append((tag_end, ' data-i18n="%s"' % key))
    new = src
    for pos, ins in sorted(inserts, reverse=True):
        new = new[:pos] + ins + new[pos:]
    if not dry:
        open(page, 'w', encoding='utf-8').write(new)
    prev = {}
    try:
        prev = json.load(open(out_json, encoding='utf-8'))
    except Exception:
        pass
    prev.update(out)
    json.dump(prev, open(out_json, 'w', encoding='utf-8'), ensure_ascii=False, indent=0)
    print('tagged', len(out), 'units; chars', sum(len(v) for v in out.values()))


if __name__ == '__main__':
    main()
