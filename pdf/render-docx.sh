#!/usr/bin/env bash
# Render the Word files to PDF with LibreOffice and rasterise the pages, so
# the Word documents can be proofed the way the HTML PDFs are.
# Output: out/docx-render/<doc>.pdf, <doc>-N.png, <doc>-sheet.png
set -euo pipefail
cd "$(dirname "$0")"
R=out/docx-render; rm -rf "$R"; mkdir -p "$R"
/Applications/LibreOffice.app/Contents/MacOS/soffice --headless --convert-to pdf --outdir "$R" out/*.docx >/dev/null 2>&1
for f in "$R"/*.pdf; do n=$(basename "$f" .pdf | tr ' ' '_'); pdftoppm -r 55 -png "$f" "$R/$n"; echo "$n: $(pdfinfo "$f" | awk '/^Pages/{print $2}') pages"; done
python3 - "$R" <<'PY'
import sys, glob
from PIL import Image
R=sys.argv[1]
docs=sorted({p.rsplit('-',1)[0] for p in glob.glob(f"{R}/*-[0-9]*.png")})
for doc in docs:
    pages=sorted(glob.glob(f"{doc}-*.png"), key=lambda p:int(p.rsplit('-',1)[1][:-4]))
    ims=[Image.open(p) for p in pages]; cols=min(4,len(ims)); rows=(len(ims)+cols-1)//cols
    w,h=ims[0].size; sheet=Image.new("RGB",(cols*w+(cols+1)*10, rows*h+(rows+1)*10),"#888")
    for i,im in enumerate(ims): sheet.paste(im,(10+(i%cols)*(w+10),10+(i//cols)*(h+10)))
    sheet.save(f"{doc}-sheet.png")
PY
