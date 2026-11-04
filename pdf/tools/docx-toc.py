#!/usr/bin/env python3
"""Fill the IT guide's contents list with page numbers read from a rendering
of the same Word file. Usage: docx-toc.py <file.docx> <rendered.pdf>
The list's title cells get a right-aligned grey page number; LibreOffice and
Word paginate this document the same way to within a page, and the PDF that
goes out is made from this very file."""
import sys, re, subprocess
from docx import Document
from docx.shared import Pt, RGBColor, Mm
from docx.oxml.ns import qn
from docx.oxml import OxmlElement
docx_path, pdf_path = sys.argv[1], sys.argv[2]
pages = subprocess.run(["pdftotext", "-layout", pdf_path, "-"], capture_output=True, text=True).stdout.split("\f")
doc = Document(docx_path)
toc = next((t for t in doc.tables if len(t.columns) == 4 and t.rows[0].cells[0].text.strip() == "1"), None)
if toc is None: sys.exit("no contents table")
def page_of(n, title):
    pat = re.compile(r"^\s*" + re.escape(n) + r"\.\s+" + re.escape(title.strip()[:28]), re.M)
    for i, txt in enumerate(pages):
        if i == 0: continue                       # the cover lists every title
        if pat.search(txt): return i + 1
    return None
filled = 0
for row in toc.rows:
    for ci in (0, 2):
        n = row.cells[ci].text.strip(); tcell = row.cells[ci + 1]
        if not n: continue
        pg = page_of(n, tcell.text)
        if pg is None: continue
        p = tcell.paragraphs[0]
        r = p.add_run("\t" + str(pg)); r.font.size = Pt(9); r.font.color.rgb = RGBColor(0x6B, 0x74, 0x7C); r.font.name = "Libre Franklin"
        pPr = p._p.get_or_add_pPr(); tabs = OxmlElement("w:tabs"); tb = OxmlElement("w:tab")
        tb.set(qn("w:val"), "right"); tb.set(qn("w:pos"), str(int(70 * 56.7))); tabs.append(tb); pPr.append(tabs)
        filled += 1
doc.save(docx_path); print(f"contents: {filled} page numbers")
