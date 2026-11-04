#!/usr/bin/env bash
# PDF from the Word master: what colleagues run after editing a .docx.
# Usage: ./pdf/docx-to-pdf.sh "pdf/out/QSAR Flex 4.0 Release Notes.docx" [more .docx]
# Needs LibreOffice (brew install --cask libreoffice) with the document fonts
# installed (pdf/out/fonts/*.ttf, or the "QSAR Flex fonts" folder). Word's own
# File > Save As > PDF works too and keeps the same look.
set -euo pipefail
OUT="${OUT:-$(dirname "$0")/out/from-word}"; mkdir -p "$OUT"
/Applications/LibreOffice.app/Contents/MacOS/soffice --headless --convert-to pdf --outdir "$OUT" "$@" >/dev/null 2>&1
for f in "$@"; do echo "$OUT/$(basename "${f%.docx}").pdf"; done
