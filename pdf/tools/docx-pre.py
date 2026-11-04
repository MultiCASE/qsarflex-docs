#!/usr/bin/env python3
"""HTML -> HTML for the Word export: things pandoc's HTML reader drops
(classes on <p>) or flattens (a path block as an inline span) become
blocks it understands."""
import re, sys
s = open(sys.argv[1]).read()
s = re.sub(r'<p class="callout plain">(.*?)</p>', r'<div class="callout-plain"><p>\1</p></div>', s, flags=re.S)
s = re.sub(r'<p class="callout">(.*?)</p>', r'<div class="callout"><p>\1</p></div>', s, flags=re.S)
# platform label + path block -> a bold line and a <pre> (keeps the lines); a lone path block -> a <pre>
s = re.sub(r'<span class="plat">([^<]*)</span>\s*<span class="pathblock"(?: style="[^"]*")?>(.*?)</span>', r'<p><b>\1</b></p><pre>\2</pre>', s, flags=re.S)
s = re.sub(r'<span class="pathblock"(?: style="[^"]*")?>(.*?)</span>', r'<pre>\1</pre>', s, flags=re.S)
s = re.sub(r'<span class="plat">([^<]*)</span>', r'<p><b>\1</b></p>', s)
s = re.sub(r'<td class="y">(?!<b>)(.*?)</td>', r'<td class="y"><b>\1</b></td>', s, flags=re.S)
# checklists: a box glyph in front of each item, as plain paragraphs
s = re.sub(r'<ul class="check">(.*?)</ul>', lambda m: '<div class="checklist">' + re.sub(r'<li>(.*?)</li>', '<p>\u2610\u2003\\1</p>', m.group(1), flags=re.S) + '</div>', s, flags=re.S)

# column widths: pandoc ignores width styles on <th>/<td>, but reads a
# <colgroup>. Build one per table from the first row's width styles; columns
# without a width share what is left. A table whose first row has a key
# column (td.k) and no widths gets 28% for it.
def colgroup(m):
    table = m.group(0)
    if "<colgroup" in table: return table
    first = re.search(r"<tr[^>]*>(.*?)</tr>", table, re.S)
    if not first: return table
    cells = re.findall(r"<(t[hd])([^>]*)>", first.group(1))
    if not cells: return table
    widths = []
    for tag, attrs in cells:
        w = re.search(r"width:\s*([\d.]+)%", attrs)
        span = re.search(r'colspan="(\d+)"', attrs)
        n = int(span.group(1)) if span else 1
        widths.append(float(w.group(1)) / 100 if w else None)
        for _ in range(n - 1): widths.append(None)
    if all(w is None for w in widths):
        if 'class="k"' in first.group(1) and len(widths) == 2: widths = [0.28, 0.72]
        elif 'class="k"' in first.group(1) and len(widths) == 3: widths = [0.26, 0.37, 0.37]
        else: widths = [1 / len(widths)] * len(widths)
    fixed = sum(w for w in widths if w is not None); free = [i for i, w in enumerate(widths) if w is None]
    for i in free: widths[i] = max(0.08, (1 - fixed) / len(free))
    total = sum(widths); widths = [w / total for w in widths]
    cg = "<colgroup>" + "".join(f'<col style="width:{w*100:.1f}%">' for w in widths) + "</colgroup>"
    return re.sub(r"(<table[^>]*>)", r"\1" + cg, table, count=1)
s = re.sub(r'<span class="path">(.*?)</span>', r'<code>\1</code>', s, flags=re.S)   # inline paths are code
s = re.sub(r'<td class="host">(.*?)</td>', lambda m: '<td class="host"><code>' + m.group(1).replace('<br>', '</code><br><code>') + '</code></td>', s, flags=re.S)
s = re.sub(r"<table[^>]*>.*?</table>", colgroup, s, flags=re.S)
# pandoc drops cell classes: carry the key column's weight and the number column's alignment as markup
s = re.sub(r'<td class="k">(?!<b>)(.*?)</td>', r'<td class="k"><b>\1</b></td>', s, flags=re.S)
s = re.sub(r'<td class="num">', '<td class="num" style="text-align:right">', s)
# Libre Franklin has no Greek: mark Greek letters so Word gets a face that does
s = re.sub(r"([\u0370-\u03ff]+)", r'<span class="greek">\1</span>', s)   # Greek letters
s = re.sub(r"([\u2318\u2325\u21e7]+)", r'<span class="key">\1</span>', s)         # Mac key glyphs
s = re.sub(r'<td class="mn">(?!<b>)(.*?)</td>', r'<td class="mn"><b>\1</b></td>', s, flags=re.S)
sys.stdout.write(s)
