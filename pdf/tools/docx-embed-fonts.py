#!/usr/bin/env python3
"""Embed the document fonts in a .docx (obfuscated .odttf parts, as Word does),
so colleagues without Libre Franklin / Source Code Pro installed still see them.
Usage: docx-embed-fonts.py <file.docx> <fonts dir with LibreFranklin-400/600.ttf, SourceCodePro-400/600.ttf>"""
import sys, zipfile, uuid, re, shutil, os, tempfile
docx, fdir = sys.argv[1], sys.argv[2]
FACES = [("Libre Franklin", "LibreFranklin-400.ttf", "embedRegular"), ("Libre Franklin", "LibreFranklin-600.ttf", "embedBold"),
         ("Source Code Pro", "SourceCodePro-400.ttf", "embedRegular"), ("Source Code Pro", "SourceCodePro-600.ttf", "embedBold")]
def obfuscate(data, guid):
    key = bytes.fromhex(guid.replace("-", ""))[::-1]
    out = bytearray(data)
    for i in range(32): out[i] ^= key[i % 16]
    return bytes(out)
tmp = tempfile.mkdtemp()
with zipfile.ZipFile(docx) as z: z.extractall(tmp)
ft = os.path.join(tmp, "word", "fontTable.xml"); xml = open(ft, encoding="utf-8").read()
rels_path = os.path.join(tmp, "word", "_rels", "fontTable.xml.rels")
rels = open(rels_path, encoding="utf-8").read() if os.path.exists(rels_path) else '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\n<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"></Relationships>'
os.makedirs(os.path.join(tmp, "word", "fonts"), exist_ok=True)
fonts = {}
for i, (family, fname, kind) in enumerate(FACES, 1):
    guid = str(uuid.uuid4()).upper()
    data = open(os.path.join(fdir, fname), "rb").read()
    open(os.path.join(tmp, "word", "fonts", f"font{i}.odttf"), "wb").write(obfuscate(data, guid))
    rid = f"rIdFont{i}"
    rels = rels.replace("</Relationships>", f'<Relationship Id="{rid}" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/font" Target="fonts/font{i}.odttf"/></Relationships>')
    fonts.setdefault(family, []).append(f'<w:{kind} r:id="{rid}" w:fontKey="{{{guid}}}"/>')
for family, embeds in fonts.items():
    xml = re.sub(r'<w:font w:name="%s">.*?</w:font>\s*' % re.escape(family), "", xml, flags=re.S)
    panose = "020B0604020202020204"
    xml = xml.replace("</w:fonts>", f'<w:font w:name="{family}"><w:panose1 w:val="{panose}"/><w:charset w:val="00"/><w:family w:val="{"modern" if "Code" in family else "swiss"}"/><w:pitch w:val="{"fixed" if "Code" in family else "variable"}"/>{"".join(embeds)}</w:font></w:fonts>')
if 'xmlns:r=' not in xml.split(">")[1]: xml = xml.replace("<w:fonts ", '<w:fonts xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" ', 1)
open(ft, "w", encoding="utf-8").write(xml); os.makedirs(os.path.dirname(rels_path), exist_ok=True); open(rels_path, "w", encoding="utf-8").write(rels)
ct = os.path.join(tmp, "[Content_Types].xml"); c = open(ct, encoding="utf-8").read()
if "odttf" not in c: c = c.replace("</Types>", '<Default Extension="odttf" ContentType="application/vnd.openxmlformats-officedocument.obfuscatedFont"/></Types>')
open(ct, "w", encoding="utf-8").write(c)
st = os.path.join(tmp, "word", "settings.xml"); sx = open(st, encoding="utf-8").read()
if "embedTrueTypeFonts" not in sx: sx = re.sub(r"(<w:settings[^>]*>)", r"\1<w:embedTrueTypeFonts/><w:saveSubsetFonts/>", sx, count=1)
open(st, "w", encoding="utf-8").write(sx)
out = docx + ".tmp"
with zipfile.ZipFile(out, "w", zipfile.ZIP_DEFLATED) as z:
    z.write(os.path.join(tmp, "[Content_Types].xml"), "[Content_Types].xml")
    for root, _, files in os.walk(tmp):
        for f in files:
            full = os.path.join(root, f); arc = os.path.relpath(full, tmp)
            if arc != "[Content_Types].xml": z.write(full, arc)
shutil.move(out, docx); shutil.rmtree(tmp); print("fonts embedded:", os.path.basename(docx))
