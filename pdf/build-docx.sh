#!/usr/bin/env bash
# The Word documents (the editable master) from the HTML sources: the same text
# through pandoc (tools/docx-filter.lua drops the page furniture and marks
# the two-column regions), then tools/docx-style.py gives the file the
# document's look: Libre Franklin, green headings, ruled tables, captions,
# logo + document name in the header, page numbers, two-column sections.
# Word cannot reproduce the fixed A4 layout; it reproduces the family look.
set -euo pipefail
cd "$(dirname "$0")"
mkdir -p out
SOFFICE=/Applications/LibreOffice.app/Contents/MacOS/soffice
build() { # $1 source  $2 output  $3 title  $4 running head  [$5 extra styler flag]
  python3 tools/docx-pre.py "$1" | pandoc -f html -t docx --resource-path=.:.. --lua-filter=tools/docx-filter.lua \
    -o "out/$2"
  python3 tools/docx-style.py "out/$2" "$4" "" ${5:-}
}
build release-notes.html   "QSAR Flex 4.0 Release Notes.docx"    "QSAR Flex 4.0 Release Notes"                     "QSAR Flex 4.0 · Release Notes · October 2026" --compact
build brochure.html        "QSAR Flex 4.0 Release Brochure.docx" "QSAR Flex 4.0 Release Brochure"                  "QSAR Flex 4.0 · Product brochure · October 2026" --section-pages
build it-requirements.html "QSAR Flex IT Requirements.docx"      "QSAR Flex 4.0 IT Requirements & Deployment Guide" "QSAR Flex 4.0 · IT Requirements & Deployment Guide"
# the IT guide's contents list: page numbers from a rendering of the file itself
if [ -x "$SOFFICE" ]; then
  T=$(mktemp -d); "$SOFFICE" --headless --convert-to pdf --outdir "$T" "out/QSAR Flex IT Requirements.docx" >/dev/null 2>&1
  python3 tools/docx-toc.py "out/QSAR Flex IT Requirements.docx" "$T/QSAR Flex IT Requirements.pdf"; rm -rf "$T"
fi
for f in out/*.docx; do python3 tools/docx-embed-fonts.py "$f" out/fonts; done
