#!/usr/bin/env python3
"""Give the pandoc Word export the document's look, so the Word file is the
master and a PDF saved from it reads as the designed document.

Libre Franklin in black, green headings, the version in green, ruled tables,
grey captions, cropped figures (the same crops as the HTML build, as real
Word picture crops), the MultiCASE logo on the cover and in the running
head, the document name in the header, page numbers in the footer, a page
per major section, and two-column sections where the design has them.
Usage: docx-style.py <file.docx> "<running head>" "<cover line>"
"""
import sys, copy, warnings, re
warnings.filterwarnings("ignore")
from docx import Document
from docx.shared import Pt, RGBColor, Mm, Emu
from docx.enum.text import WD_ALIGN_PARAGRAPH, WD_BREAK
from docx.oxml.ns import qn
from docx.oxml import OxmlElement

GREEN = RGBColor(0x04, 0x91, 0x4E); INK = RGBColor(0x11, 0x14, 0x17)
INK2 = RGBColor(0x3B, 0x42, 0x48); INK3 = RGBColor(0x6B, 0x74, 0x7C); LINE = "D9DBD6"
SANS, MONO = "Libre Franklin", "Source Code Pro"
LOGO = __file__.rsplit("/", 1)[0] + "/mc-logo.png"
TEXT_W_MM = 170   # A4 minus 20 mm margins

def set_fonts(rpr, name):
    rf = rpr.find(qn("w:rFonts"))
    if rf is None: rf = OxmlElement("w:rFonts"); rpr.insert(0, rf)
    for a in ("w:asciiTheme", "w:hAnsiTheme", "w:cstheme", "w:eastAsiaTheme"):   # theme fonts override explicit ones
        if rf.get(qn(a)) is not None: del rf.attrib[qn(a)]
    for a in ("w:ascii", "w:hAnsi", "w:cs"): rf.set(qn(a), name)
    rf.set(qn("w:eastAsia"), "Yu Gothic UI")

def font(style, name=SANS, size=None, bold=None, color=None, italic=None):
    f = style.font; f.name = name
    set_fonts(style.element.get_or_add_rPr(), name)
    if size: f.size = Pt(size)
    if bold is not None: f.bold = bold
    if italic is not None: f.italic = italic
    if color is not None: f.color.rgb = color

def ensure_style(doc, name, base="Normal"):
    names = [s.name for s in doc.styles]
    if name in names: return doc.styles[name]
    from docx.enum.style import WD_STYLE_TYPE
    s = doc.styles.add_style(name, WD_STYLE_TYPE.PARAGRAPH); s.base_style = doc.styles[base]; return s

def strip_theme_fonts(doc):
    """Every rFonts in styles and body loses its theme attributes, and the
    theme's own faces become the document faces, so nothing falls back to
    Aptos/Calibri on a machine that lacks them."""
    for root in (doc.styles.element, doc.element.body):
        for rf in root.iter(qn("w:rFonts")):
            for a in ("w:asciiTheme", "w:hAnsiTheme", "w:cstheme", "w:eastAsiaTheme"):
                if rf.get(qn(a)) is not None: del rf.attrib[qn(a)]
            if rf.get(qn("w:ascii")) is None:
                for a in ("w:ascii", "w:hAnsi", "w:cs"): rf.set(qn(a), SANS)
    for part in doc.part.package.parts:
        if part.partname.endswith("theme1.xml"):
            xml = part.blob.decode("utf-8")
            import re as _re
            xml = _re.sub(r'(<a:latin typeface=")[^"]*(")', r"\g<1>" + SANS + r"\2", xml)
            part._blob = xml.encode("utf-8")

def style_document(doc):
    st = doc.styles
    font(st["Normal"], size=9.3 if COMPACT else 10, color=INK)
    st["Normal"].paragraph_format.space_after = Pt(3 if COMPACT else 6); st["Normal"].paragraph_format.line_spacing = 1.12 if COMPACT else 1.2
    for name, size, before in (("Heading 1", 26, 0), ("Heading 2", 15, 0), ("Heading 3", 12, 8 if COMPACT else 10)):
        s = st[name]; font(s, size=size, bold=True, color=GREEN, italic=False)
        pf = s.paragraph_format; pf.space_before = Pt(before); pf.space_after = Pt(4); pf.keep_with_next = True
        if name == "Heading 2":
            pf.space_before = Pt(26)
            if SECTION_PAGES: pf.page_break_before = True   # the brochure: one section per page, as designed
        if name == "Heading 1": pf.space_before = Pt(2 if COMPACT else 24)
    for name in ("Image Caption", "Caption", "Table Caption"):
        if name in [x.name for x in st]:
            s = st[name]; font(s, size=8.5, color=INK2, italic=False); s.paragraph_format.space_after = Pt(10); s.paragraph_format.space_before = Pt(2)
    for name in ("Verbatim Char", "Source Code"):
        if name in [x.name for x in st]: font(st[name], name=MONO, size=8.5, color=INK)
    for name in ("Body Text", "First Paragraph", "Compact"):
        if name in [x.name for x in st]: font(st[name], size=10, color=INK)
    addr = ensure_style(doc, "Address"); font(addr, size=8.5, color=INK2); addr.paragraph_format.space_before = Pt(18)
    dl = ensure_style(doc, "Document Line"); font(dl, size=12, color=INK2); dl.paragraph_format.space_after = Pt(14)
    lead = ensure_style(doc, "Lead"); font(lead, size=11 if COMPACT else 11.5, color=INK); lead.paragraph_format.line_spacing = 1.3; lead.paragraph_format.right_indent = Mm(30)
    from docx.enum.style import WD_STYLE_TYPE
    # pandoc creates the custom character style empty; give it its look either way
    def char_style(style_name, **kw):
        cs = st[style_name] if style_name in [x.name for x in st] else st.add_style(style_name, WD_STYLE_TYPE.CHARACTER); font(cs, **kw); return cs
    char_style("Bundle", size=8.5, bold=True, color=GREEN)
    char_style("Greek", name="Arial", color=INK)            # Libre Franklin carries no Greek
    lk = char_style("Link", color=GREEN); lk.font.underline = True
    char_style("Key", name="Segoe UI Symbol", color=INK)   # ⌘ ⌥ ⇧: a face that has them on Windows; macOS Word substitutes
    for cname, colour in (("Callout", "111417"), ("Callout Warn", "B4700A")):
        co = ensure_style(doc, cname); font(co, size=10, color=INK)
        pPr = co.element.get_or_add_pPr(); bd = OxmlElement("w:pBdr"); lf = OxmlElement("w:left")
        lf.set(qn("w:val"), "single"); lf.set(qn("w:sz"), "12"); lf.set(qn("w:color"), colour); lf.set(qn("w:space"), "10"); bd.append(lf); pPr.append(bd)
        co.paragraph_format.left_indent = Mm(4); co.paragraph_format.space_before = Pt(6); co.paragraph_format.space_after = Pt(10)
    ck = ensure_style(doc, "Check"); font(ck, size=10, color=INK)
    ck.paragraph_format.left_indent = Mm(6); ck.paragraph_format.first_line_indent = Mm(-6); ck.paragraph_format.space_after = Pt(4)
    ensure_style(doc, "Pair")
    ar = ensure_style(doc, "Address Right", "Address"); ar.paragraph_format.alignment = WD_ALIGN_PARAGRAPH.RIGHT; ar.paragraph_format.space_before = Pt(0)
    ch = ensure_style(doc, "Closing Head"); font(ch, size=13, bold=True, color=GREEN); ch.paragraph_format.space_before = Pt(2); ch.paragraph_format.space_after = Pt(4); ch.paragraph_format.keep_with_next = True
    char_style("Step Number", size=9, bold=True, color=GREEN)
    char_style("Bundle Note", size=8.5, bold=False, color=INK3)
    for cname, after in (("Code Line", 0),):
        cl = ensure_style(doc, cname); font(cl, name=MONO, size=8, color=INK)
        pf = cl.paragraph_format; pf.space_before = Pt(0); pf.space_after = Pt(after); pf.line_spacing = 1.25
        pf.left_indent = Mm(6); pf.first_line_indent = Mm(-4)   # a wrapped line indents, so it reads as a continuation
    if "Source Code" in [x.name for x in st]:
        sc = st["Source Code"]; sc.paragraph_format.left_indent = Mm(3); sc.paragraph_format.space_after = Pt(8)
        pPr = sc.element.get_or_add_pPr(); shd = OxmlElement("w:shd"); shd.set(qn("w:val"), "clear"); shd.set(qn("w:fill"), "F1F2EF"); pPr.append(shd)
        bd = OxmlElement("w:pBdr"); lf = OxmlElement("w:left"); lf.set(qn("w:val"), "single"); lf.set(qn("w:sz"), "8"); lf.set(qn("w:color"), "111417"); lf.set(qn("w:space"), "8"); bd.append(lf); pPr.append(bd)

def all_tables(doc):
    """Every table in the body, nested ones included, innermost first."""
    from docx.table import Table
    out = []
    def walk(tbls):
        for t in tbls:
            for row in t.rows:
                for cell in row.cells: walk(cell.tables)
            out.append(t)
    walk(doc.tables)
    return out

def rule_tables(doc):
    for t in all_tables(doc):
        tblPr = t._tbl.tblPr
        if t.rows and t.rows[0].cells and t.rows[0].cells[0].text.strip().startswith("MultiCASE Inc."):
            for old in tblPr.findall(qn("w:tblBorders")): tblPr.remove(old)
            b = OxmlElement("w:tblBorders")
            for edge in ("top", "bottom", "left", "right", "insideH", "insideV"):
                e = OxmlElement(f"w:{edge}"); e.set(qn("w:val"), "nil"); b.append(e)
            tblPr.append(b)
            for cell in t.rows[0].cells:
                for p in cell.paragraphs:
                    p.style = doc.styles["Address"]
            t.rows[0].cells[1].paragraphs[0].alignment = WD_ALIGN_PARAGRAPH.RIGHT
            continue
        for old in tblPr.findall(qn("w:tblBorders")): tblPr.remove(old)
        has_header = t.rows[0]._tr.find(qn("w:trPr")) is not None and t.rows[0]._tr.find(qn("w:trPr")).find(qn("w:tblHeader")) is not None
        b = OxmlElement("w:tblBorders")
        for edge, sz, col in (("top", 6, "6B747C"), ("bottom", 6, "6B747C"), ("insideH", 4, LINE)):
            if edge == "top" and has_header: continue      # the design rules under the header, not above it
            e = OxmlElement(f"w:{edge}"); e.set(qn("w:val"), "single"); e.set(qn("w:sz"), str(sz)); e.set(qn("w:color"), col); b.append(e)
        for edge in ("left", "right", "insideV") + (("top",) if has_header else ()):
            e = OxmlElement(f"w:{edge}"); e.set(qn("w:val"), "nil"); b.append(e)
        tblPr.append(b)
        if has_header:
            for cell in t.rows[0].cells:
                tcPr = cell._tc.get_or_add_tcPr(); tb = OxmlElement("w:tcBorders"); bt = OxmlElement("w:bottom")
                bt.set(qn("w:val"), "single"); bt.set(qn("w:sz"), "6"); bt.set(qn("w:color"), "6B747C"); tb.append(bt); tcPr.append(tb)
        if t.rows and t.rows[0].cells and t.rows[0].cells[0].paragraphs and (t.rows[0].cells[0].paragraphs[0].text.strip().startswith("⟦PAIR") or t.rows[0].cells[0].paragraphs[0].text.strip() == "⟦CODE⟧"):
            tag = t.rows[0].cells[0].paragraphs[0].text.strip()
            for old in tblPr.findall(qn("w:tblBorders")): tblPr.remove(old)
            b = OxmlElement("w:tblBorders")
            for edge in ("top", "bottom", "left", "right", "insideH", "insideV"):
                e = OxmlElement(f"w:{edge}"); e.set(qn("w:val"), "nil"); b.append(e)
            tblPr.append(b)
            mar = OxmlElement("w:tblCellMar")
            for side, w in (("left", 0), ("right", 400)):
                e = OxmlElement(f"w:{side}"); e.set(qn("w:w"), str(w)); e.set(qn("w:type"), "dxa"); mar.append(e)
            tblPr.append(mar)
            if tag == "⟦PAIR:KEEP⟧" and sum(len(c.text) for c in t.rows[0].cells) < 900:
                trPr = t.rows[0]._tr.get_or_add_trPr(); trPr.append(OxmlElement("w:cantSplit"))
            if tag == "⟦PAIR:RULE⟧":
                b = tblPr.find(qn("w:tblBorders")); top = b.find(qn("w:top")); top.set(qn("w:val"), "single"); top.set(qn("w:sz"), "4"); top.set(qn("w:color"), "6B747C")
                for cell in t.rows[0].cells:
                    for p in cell.paragraphs[:2]: p.paragraph_format.space_before = Pt(6)
            if tag == "⟦CODE⟧":
                cell = t.rows[0].cells[0]; tcPr = cell._tc.get_or_add_tcPr()
                shd = OxmlElement("w:shd"); shd.set(qn("w:val"), "clear"); shd.set(qn("w:fill"), "F1F2EF"); tcPr.append(shd)
                tb = OxmlElement("w:tcBorders"); lf = OxmlElement("w:left"); lf.set(qn("w:val"), "single"); lf.set(qn("w:sz"), "8"); lf.set(qn("w:color"), "111417"); tb.append(lf); tcPr.append(tb)
                for old in tblPr.findall(qn("w:tblCellMar")): tblPr.remove(old)
                mar = OxmlElement("w:tblCellMar")
                for side, w in (("top", 80), ("bottom", 80), ("left", 140), ("right", 140)):
                    e = OxmlElement(f"w:{side}"); e.set(qn("w:w"), str(w)); e.set(qn("w:type"), "dxa"); mar.append(e)
                tblPr.append(mar)
                trPr = t.rows[0]._tr.get_or_add_trPr(); trPr.append(OxmlElement("w:cantSplit"))
                first = cell.paragraphs[0]._p; first.getparent().remove(first)
                nxt = t._tbl.getnext()   # breathing room after the panel
                if nxt is not None and nxt.tag == qn("w:p"):
                    from docx.text.paragraph import Paragraph
                    Paragraph(nxt, t._parent).paragraph_format.space_before = Pt(8)
                continue
            if tag == "⟦PAIR:CLOSE⟧":
                b = tblPr.find(qn("w:tblBorders")); top = b.find(qn("w:top")); top.set(qn("w:val"), "single"); top.set(qn("w:sz"), "6"); top.set(qn("w:color"), "6B747C")
                for cell in t.rows[0].cells:
                    for p in cell.paragraphs[:2]: p.paragraph_format.space_before = Pt(10)
            for cell in t.rows[0].cells:
                first = cell.paragraphs[0]._p
                if cell.paragraphs[0].text.strip().startswith("⟦PAIR"): first.getparent().remove(first)
                for p in cell.paragraphs:
                    # Writer reads keep-with-next at the top of a cell as "keep the row with
                    # the next block", so a tall pair row never splits and pushes a page
                    if p.style.name.startswith("Heading"): p.paragraph_format.space_before = Pt(2)
                    if p._p.find(".//" + qn("w:drawing")) is None: p.paragraph_format.keep_with_next = False
            for cell in t.rows[0].cells:   # top-aligned, and the row may break across pages
                tcPr = cell._tc.get_or_add_tcPr(); va = OxmlElement("w:vAlign"); va.set(qn("w:val"), "top"); tcPr.append(va)
            continue
        if t.rows and t.rows[0].cells and t.rows[0].cells[0].text.startswith("⟦LIST⟧"):
            for old in tblPr.findall(qn("w:tblBorders")): tblPr.remove(old)
            b = OxmlElement("w:tblBorders")
            for edge in ("top", "bottom", "left", "right", "insideH", "insideV"):
                e = OxmlElement(f"w:{edge}"); e.set(qn("w:val"), "nil"); b.append(e)
            tblPr.append(b)
            first = t.rows[0].cells[0].paragraphs[0]
            for r in first.runs: r.text = r.text.replace("⟦LIST⟧", "")
            for row in t.rows:
                for c_i, cell in enumerate(row.cells):
                    for p in cell.paragraphs:
                        p.paragraph_format.space_after = Pt(1.5); p.paragraph_format.space_before = Pt(1.5)
                        for run in p.runs:
                            run.font.size = Pt(9); run.font.name = SANS; set_fonts(run._r.get_or_add_rPr(), SANS)
                            if c_i in (0, 2): run.font.color.rgb = INK3
            continue
        header = t.rows[0]._tr.find(qn("w:trPr")) is not None and t.rows[0]._tr.find(qn("w:trPr")).find(qn("w:tblHeader")) is not None
        dense = len(t.rows) > 10
        for old in tblPr.findall(qn("w:tblCellMar")): tblPr.remove(old)
        mar = OxmlElement("w:tblCellMar")
        for side, w in (("left", 0), ("right", 120)):
            e = OxmlElement(f"w:{side}"); e.set(qn("w:w"), str(w)); e.set(qn("w:type"), "dxa"); mar.append(e)
        tblPr.append(mar)
        for old in tblPr.findall(qn("w:tblInd")): tblPr.remove(old)
        ind = OxmlElement("w:tblInd"); ind.set(qn("w:w"), "0"); ind.set(qn("w:type"), "dxa"); tblPr.append(ind)
        # a row never splits across pages; a table of up to six rows stays whole, and
        # the last row of a short table keeps the paragraph that follows it
        n_rows = len(t.rows)
        total_chars = sum(len(c.text) for row in t.rows for c in row.cells)
        short = n_rows <= 5 and total_chars < 700
        for r_i, row in enumerate(t.rows):
            trPr = row._tr.get_or_add_trPr()
            row_chars = sum(len(c.text) for c in row.cells)
            if row_chars < 500 and trPr.find(qn("w:cantSplit")) is None: trPr.append(OxmlElement("w:cantSplit"))
            is_bundle = any(rs.get(qn("w:val")) == "Bundle" for rs in row._tr.iter(qn("w:rStyle")))
            keep = is_bundle or (short and r_i < n_rows - 1) or r_i < min(4, n_rows - 1)   # no two-row stubs at a page foot
            if keep:
                for cell in row.cells:
                    for p in cell.paragraphs: p.paragraph_format.keep_with_next = True
        prev = t._tbl.getprevious()
        if prev is not None and prev.tag == qn("w:p"):
            from docx.text.paragraph import Paragraph
            Paragraph(prev, t._parent).paragraph_format.keep_with_next = True
        for r_i, row in enumerate(t.rows):
            for c_i, cell in enumerate(row.cells):
                for p in cell.paragraphs:
                    p.paragraph_format.space_after = Pt(2 if dense else 3); p.paragraph_format.space_before = Pt(2 if dense else 3); p.paragraph_format.line_spacing = 1.12
                    for run in p.runs:
                        rs = run._r.rPr.find(qn("w:rStyle")) if run._r.rPr is not None else None
                        rsv = rs.get(qn("w:val")) if rs is not None else None
                        is_code = rsv in ("VerbatimChar", "SourceCodeChar")
                        run.font.size = Pt(7.5 if dense else 8.5)
                        if is_code: run.font.name = MONO; set_fonts(run._r.get_or_add_rPr(), MONO)
                        elif rsv == "Greek": pass
                        else: run.font.name = SANS; set_fonts(run._r.get_or_add_rPr(), SANS)
                        if r_i == 0 and header: run.font.bold = True

def tab_right(p):
    pPr = p._p.get_or_add_pPr(); tabs = OxmlElement("w:tabs"); tb = OxmlElement("w:tab")
    tb.set(qn("w:val"), "right"); tb.set(qn("w:pos"), str(int(TEXT_W_MM * 56.7))); tabs.append(tb); pPr.append(tabs)

def header_footer(doc, running):
    for i, sec in enumerate(doc.sections):
        sec.page_height = Mm(297); sec.page_width = Mm(210)
        sec.top_margin = Mm(16 if COMPACT else 26); sec.bottom_margin = Mm(20 if COMPACT else 24); sec.left_margin = Mm(20); sec.right_margin = Mm(20)
        sec.header_distance = Mm(8); sec.footer_distance = Mm(9)
        sec.different_first_page_header_footer = (i == 0)   # the cover carries no running head
        sec.header.is_linked_to_previous = False; sec.footer.is_linked_to_previous = False
        hp = sec.header.paragraphs[0]; hp.text = ""
        hp.add_run().add_picture(LOGO, width=Mm(16))
        r = hp.add_run("\t" + running); r.font.size = Pt(8); r.font.color.rgb = INK3; r.font.name = SANS; set_fonts(r._r.get_or_add_rPr(), SANS)
        tab_right(hp)
        pPr = hp._p.get_or_add_pPr(); bd = OxmlElement("w:pBdr"); bt = OxmlElement("w:bottom")
        bt.set(qn("w:val"), "single"); bt.set(qn("w:sz"), "4"); bt.set(qn("w:color"), LINE); bt.set(qn("w:space"), "6"); bd.append(bt); pPr.append(bd)
        fp = sec.footer.paragraphs[0]; fp.text = ""
        foot = re.sub(r" · [A-Z][a-z]+ \d{4}$", "", running)   # the date belongs to the running head only
        r = fp.add_run(foot + "\t"); r.font.size = Pt(8); r.font.color.rgb = INK3; r.font.name = SANS; set_fonts(r._r.get_or_add_rPr(), SANS)
        pr = fp.add_run(); pr.font.size = Pt(8); pr.font.color.rgb = INK2; pr.font.name = SANS
        for tag, txt in (("begin", None), (None, "PAGE"), ("end", None)):
            if tag: fc = OxmlElement("w:fldChar"); fc.set(qn("w:fldCharType"), tag); pr._r.append(fc)
            else: it = OxmlElement("w:instrText"); it.set(qn("xml:space"), "preserve"); it.text = txt; pr._r.append(it)
        tab_right(fp)
        pPr = fp._p.get_or_add_pPr(); bd = OxmlElement("w:pBdr"); bt = OxmlElement("w:top")
        bt.set(qn("w:val"), "single"); bt.set(qn("w:sz"), "4"); bt.set(qn("w:color"), LINE); bt.set(qn("w:space"), "6"); bd.append(bt); pPr.append(bd)

def set_cols(sectPr, n):
    for old in sectPr.findall(qn("w:cols")): sectPr.remove(old)
    c = OxmlElement("w:cols"); c.set(qn("w:num"), str(n)); c.set(qn("w:space"), "567")
    dg = sectPr.find(qn("w:docGrid"))
    if dg is not None: dg.addprevious(c)
    else: sectPr.append(c)

def two_columns(doc):
    body = doc.element.body
    final = body.find(qn("w:sectPr"))
    in_two = False
    paras = list(doc.paragraphs)
    for idx, p in enumerate(paras):
        t = p.text.strip()
        if t not in ("⟦TWO-COLUMNS⟧", "⟦ONE-COLUMN⟧"): continue
        pPr = p._p.get_or_add_pPr()
        for r in list(p.runs): r._r.getparent().remove(r._r)
        sp = copy.deepcopy(final)
        for x in sp.findall(qn("w:type")): sp.remove(x)
        ty = OxmlElement("w:type"); ty.set(qn("w:val"), "continuous"); sp.insert(0, ty)
        set_cols(sp, 2 if in_two else 1)            # properties of the section being closed
        for hd in sp.findall(qn("w:headerReference")) + sp.findall(qn("w:footerReference")): sp.remove(hd)
        pPr.append(sp)
        pf = p.paragraph_format; pf.space_after = Pt(0); pf.space_before = Pt(0); pf.line_spacing = Pt(1)
        in_two = (t == "⟦TWO-COLUMNS⟧")
    set_cols(final, 1)

def green_captions(doc):
    for p in doc.paragraphs:
        if p.style.name == "Image Caption":
            prev = p._p.getprevious()
            if prev is not None and prev.find(".//" + qn("w:drawing")) is not None:
                pj = prev.find(qn("w:pPr")); pj = pj.find(qn("w:jc")) if pj is not None else None
                if pj is not None and pj.get(qn("w:val")) == "center":
                    p.paragraph_format.alignment = WD_ALIGN_PARAGRAPH.CENTER
                    p.paragraph_format.left_indent = Mm(30); p.paragraph_format.right_indent = Mm(30)
            for r in p.runs:
                if r.bold: r.font.color.rgb = GREEN
    for t in doc.tables:
        for row in t.rows:
            for cell in row.cells:
                for p in cell.paragraphs:
                    if p.style.name == "Image Caption":
                        for r in p.runs:
                            if r.bold: r.font.color.rgb = GREEN

def keep_figures(doc):
    """The image paragraph stays with its caption; the paragraph before a
    figure stays with the figure, so a figure never opens a column alone."""
    paras = doc.paragraphs
    for i, p in enumerate(paras):
        if p._p.find(".//" + qn("w:drawing")) is not None and i > 0:
            prev = paras[i - 1]
            prev_pPr = prev._p.pPr
            is_list = prev_pPr is not None and prev_pPr.find(qn("w:numPr")) is not None
            ext = p._p.find(".//" + qn("wp:extent")); tall = ext is not None and int(ext.get("cy")) > int(Mm(55))
            # a short figure travels with the paragraph that introduces it; a tall one would drag
            # heading and paragraph onto the next page and leave half a page empty
            if prev.text.strip() and not is_list and not tall: prev.paragraph_format.keep_with_next = True
            pf = p.paragraph_format
            pf.keep_with_next = True; pf.keep_together = True
            pf.line_spacing = 1.0; pf.space_after = Pt(2); pf.space_before = Pt(4); pf.left_indent = Mm(0); pf.first_line_indent = Mm(0)   # proportional spacing on a tall inline picture opened a 1-2 cm gap above the caption

def checkboxes(doc):
    """'☐ text' paragraphs: the box, a tab to the hanging indent, then the text."""
    def fix(p):
        if p.style.name != "Check" or not p.runs: return
        r = p.runs[0]
        if r.text.startswith("\u2610"):
            rest = r.text[1:].lstrip("\u2003 ")
            r.text = "\u2610"
            tab = OxmlElement("w:tab"); r._r.append(tab)
            if rest:
                nr = copy.deepcopy(r._r)
                for child in list(nr):
                    if child.tag != qn("w:rPr"): nr.remove(child)
                t = OxmlElement("w:t"); t.set(qn("xml:space"), "preserve"); t.text = rest; nr.append(t)
                r._r.addnext(nr)
            else:
                for run in p.runs[1:]:
                    if run.text.startswith("\u2003") or run.text.startswith(" "): run.text = run.text.lstrip("\u2003 ")
                    break
            pPr = p._p.get_or_add_pPr(); tabs = OxmlElement("w:tabs"); tb = OxmlElement("w:tab")
            tb.set(qn("w:val"), "left"); tb.set(qn("w:pos"), str(int(6 * 56.7))); tabs.append(tb); pPr.append(tabs)
    for p in doc.paragraphs: fix(p)
    for t in all_tables(doc):
        for row in t.rows:
            for cell in row.cells:
                for p in cell.paragraphs: fix(p)

def grey_bullets(doc):
    """Pandoc's bullet levels draw a heavy Symbol-font bullet; the design uses a small grey dot.
    Edited on the numbering part's element tree (a blob swap is not serialised)."""
    try: num = doc.part.numbering_part.element
    except Exception: return
    for lvl in num.iter(qn("w:lvl")):
        fmt = lvl.find(qn("w:numFmt"))
        if fmt is None or fmt.get(qn("w:val")) != "bullet": continue
        lt = lvl.find(qn("w:lvlText"))
        if lt is not None: lt.set(qn("w:val"), "\u2022")
        for old in lvl.findall(qn("w:rPr")): lvl.remove(old)
        rPr = OxmlElement("w:rPr")
        rf = OxmlElement("w:rFonts")
        for a in ("w:ascii", "w:hAnsi", "w:cs"): rf.set(qn(a), SANS)
        col = OxmlElement("w:color"); col.set(qn("w:val"), "6B747C")
        sz = OxmlElement("w:sz"); sz.set(qn("w:val"), "24")
        rPr.append(rf); rPr.append(col); rPr.append(sz); lvl.append(rPr)

def tighten_lists(doc):
    """Pandoc's list numbering indents 12.7 mm; the design indents 4 mm."""
    for p in doc.paragraphs:
        pPr = p._p.pPr
        if pPr is not None and pPr.find(qn("w:numPr")) is not None:
            p.paragraph_format.left_indent = Mm(5); p.paragraph_format.first_line_indent = Mm(-3.5)
            p.paragraph_format.space_after = Pt(1.5 if COMPACT else 3)
    for t in all_tables(doc):
        for row in t.rows:
            for cell in row.cells:
                for p in cell.paragraphs:
                    pPr = p._p.pPr
                    if pPr is not None and pPr.find(qn("w:numPr")) is not None:
                        p.paragraph_format.left_indent = Mm(5); p.paragraph_format.first_line_indent = Mm(-3.5)

def crop_pictures(doc):
    """crop:l,t,r,b,aspect|alt in the picture description -> srcRect + extent."""
    body = doc.element.body
    for docPr in body.iter(qn("wp:docPr")):
        d = docPr.get("descr") or ""
        m = re.match(r"crop:([\d.]+),([\d.]+),([\d.]+),([\d.]+),([\d.]+),([\d.]+)mm\|(.*)$", d, re.S)
        if not m: continue
        l, t, r, b, aspect, wmm = (float(x) for x in m.groups()[:6])
        docPr.set("descr", m.group(7))
        anchor = docPr.getparent()
        for att in ("distT", "distB", "distL", "distR"): anchor.set(att, "0")
        extent = anchor.find(qn("wp:extent"))
        cx = int(Mm(wmm)); cy = int(cx * aspect)   # pandoc clamps wide pictures; the design width wins
        extent.set("cx", str(cx)); extent.set("cy", str(cy))
        # a picture narrower than the text block sits centred unless it is inside a table cell
        para = anchor
        while para is not None and para.tag != qn("w:p"): para = para.getparent()
        if para is not None and wmm < 100:
            in_cell = False; up = para.getparent()
            while up is not None:
                if up.tag == qn("w:tc"): in_cell = True; break
                up = up.getparent()
            if not in_cell:
                pPr = para.find(qn("w:pPr"))
                if pPr is None: pPr = OxmlElement("w:pPr"); para.insert(0, pPr)
                for old in pPr.findall(qn("w:jc")): pPr.remove(old)
                jc = OxmlElement("w:jc"); jc.set(qn("w:val"), "center"); pPr.append(jc)
        for ext in anchor.iter(qn("a:ext")): ext.set("cx", str(cx)); ext.set("cy", str(cy))
        blipFill = next(anchor.iter(qn("pic:blipFill")), None)
        if blipFill is None: continue
        for old in blipFill.findall(qn("a:srcRect")): blipFill.remove(old)
        src = OxmlElement("a:srcRect")
        src.set("l", str(int(l * 100000))); src.set("t", str(int(t * 100000)))
        src.set("r", str(int((1 - r) * 100000))); src.set("b", str(int((1 - b) * 100000)))
        blip = blipFill.find(qn("a:blip")); blip.addnext(src)
        # a hairline frame around the picture, like the PDF's figure frame
        spPr = next(anchor.iter(qn("pic:spPr")), None)
        if spPr is not None:
            for old in spPr.findall(qn("a:ln")): spPr.remove(old)
            ln = OxmlElement("a:ln"); ln.set("w", "6350"); sf = OxmlElement("a:solidFill"); clr = OxmlElement("a:srgbClr"); clr.set("val", LINE); sf.append(clr); ln.append(sf); spPr.append(ln)

def cover(doc, cover_line):
    """Logo at the top, the title with its version in green, the document line
    and the lead paragraph as their own styles, a page break after the cover."""
    paras = doc.paragraphs
    title = next((p for p in paras if p.style.name == "Heading 1"), None)
    if title is None: return
    # the logo above the title
    logo_p = title.insert_paragraph_before(); logo_p.add_run().add_picture(LOGO, width=Mm(34 if COMPACT else 44)); logo_p.paragraph_format.space_after = Pt(4 if COMPACT else 24)
    # "QSAR Flex 4.0": version in green
    text = title.text
    m = re.match(r"^(.*?)(\d+\.\d+)$", text.strip())
    if m:
        for r in list(title.runs): r._r.getparent().remove(r._r)
        a = title.add_run(m.group(1)); b = title.add_run(m.group(2)); b.font.color.rgb = GREEN
        for r in (a, b): r.font.name = SANS; set_fonts(r._r.get_or_add_rPr(), SANS)
    title.style.font.color.rgb = INK   # the heading-1 style is the title: black, version green
    # the two paragraphs after the title: document line, lead-in
    nxt = title._p.getnext()
    seen = 0
    while nxt is not None and seen < 2:
        if nxt.tag == qn("w:p"):
            from docx.text.paragraph import Paragraph
            para = Paragraph(nxt, title._parent)
            if para.text.strip():
                para.style = doc.styles["Document Line" if seen == 0 else "Lead"]
                if seen == 0:
                    for r in para.runs: r.font.bold = True if "·" not in r.text else r.font.bold
                seen += 1
        nxt = nxt.getnext()
    # the cover ends at the address: a page break after it
    for t in doc.tables:
        if t.rows and t.rows[0].cells and t.rows[0].cells[0].text.strip().startswith("MultiCASE Inc."):
            # a page break where the address stood; the address itself goes to the first-page footer
            nxt = t._tbl.getnext()
            while nxt is not None and nxt.tag == qn("w:p") and not "".join(nxt.itertext()).strip() and nxt.find(".//" + qn("w:drawing")) is None: nxt = nxt.getnext()
            if nxt is not None and nxt.tag != qn("w:sectPr"):   # something follows the cover: break to a new page
                brk = OxmlElement("w:p"); r = OxmlElement("w:r"); b = OxmlElement("w:br"); b.set(qn("w:type"), "page"); r.append(b); brk.append(r)
                pPr = OxmlElement("w:pPr"); sp = OxmlElement("w:spacing"); sp.set(qn("w:after"), "0"); sp.set(qn("w:line"), "20"); sp.set(qn("w:lineRule"), "exact"); pPr.append(sp); brk.insert(0, pPr)
                t._tbl.addnext(brk)
            sec = doc.sections[0]; sec.different_first_page_header_footer = True
            ff = sec.first_page_footer; ff.is_linked_to_previous = False
            rule = ff.paragraphs[0]; rule.text = ""
            pPr = rule._p.get_or_add_pPr(); bd = OxmlElement("w:pBdr"); bt = OxmlElement("w:top")
            bt.set(qn("w:val"), "single"); bt.set(qn("w:sz"), "4"); bt.set(qn("w:color"), LINE); bt.set(qn("w:space"), "8"); bd.append(bt); pPr.append(bd)
            rule.paragraph_format.space_after = Pt(0); rule.paragraph_format.line_spacing = Pt(2)
            ff._element.append(t._tbl)   # moves the table out of the body
            for cell in t.rows[0].cells:
                for p in cell.paragraphs: p.paragraph_format.space_before = Pt(0)
            break
    else:
        addr = [p for p in doc.paragraphs if p.style.name == "Address"]
        if addr and addr[-1].runs: addr[-1].runs[-1].add_break(WD_BREAK.PAGE)

SECTION_PAGES = False
COMPACT = False      # a one-page document: smaller logo and type so it stays one page in Word too

def main():
    global SECTION_PAGES
    global COMPACT
    args = [a for a in sys.argv[1:] if a not in ("--section-pages", "--compact")]; SECTION_PAGES = "--section-pages" in sys.argv; COMPACT = "--compact" in sys.argv
    path, running, cover_line = args[0], args[1], args[2] if len(args) > 2 else ""
    doc = Document(path)
    for t in doc.element.body.iter(qn("w:t")):
        if t.text and "\u200b" in t.text: t.text = t.text.replace("\u200b", "")
    style_document(doc); strip_theme_fonts(doc); rule_tables(doc); tighten_lists(doc); grey_bullets(doc); checkboxes(doc); two_columns(doc); crop_pictures(doc); keep_figures(doc); green_captions(doc); header_footer(doc, running); cover(doc, cover_line)
    # a page break with nothing after it would print a blank last page in Word
    body = doc.element.body
    for p in list(body.iterchildren(qn("w:p")))[::-1]:
        if p.find(".//" + qn("w:br")) is not None and not "".join(p.itertext()).strip():
            nxt = p.getnext()
            while nxt is not None and nxt.tag == qn("w:p") and not "".join(nxt.itertext()).strip() and nxt.find(".//" + qn("w:drawing")) is None: nxt = nxt.getnext()
            if nxt is None or nxt.tag == qn("w:sectPr"): body.remove(p)
        break
    doc.save(path); print("styled", path.rsplit("/", 1)[-1])

if __name__ == "__main__": main()
