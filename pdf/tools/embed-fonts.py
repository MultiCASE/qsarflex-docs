#!/usr/bin/env python3
"""Regenerate pdf/fonts.css — Geist + Geist Mono, base64-embedded.

    python3 pdf/tools/embed-fonts.py

Why embed at all: the renderer loads the HTML from file://, and a webfont that
is still arriving when page.pdf() fires silently falls back to Helvetica. The
whole document is typeset on Geist's metrics, so that reflows every page.
Embedding removes the network from the render entirely.

Only the `latin` subset is taken — the documents are English, and pulling every
subset triples the file for nothing. Needs network access; run it only when the
typeface changes.
"""
import base64
import pathlib
import re
import urllib.request

CSS_API = (
    "https://fonts.googleapis.com/css2"
    "?family=Geist:wght@300;400;500;600;700"
    "&family=Geist+Mono:wght@400;500;600"
    "&display=swap"
)
# Google serves woff2 only to a browser-ish UA; anything else gets ttf.
UA = ("Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 "
      "(KHTML, like Gecko) Chrome/124.0 Safari/537.36")

OUT = pathlib.Path(__file__).resolve().parent.parent / "fonts.css"


def fetch(url: str) -> bytes:
    return urllib.request.urlopen(
        urllib.request.Request(url, headers={"User-Agent": UA})
    ).read()


def main() -> None:
    css = fetch(CSS_API).decode()
    blocks = re.findall(r"/\*\s*([\w\-\[\]]+)\s*\*/\s*(@font-face\s*\{.*?\})", css, re.S)

    out, cache = [], {}
    for subset, block in blocks:
        if subset != "latin":
            continue
        url = re.search(r"url\((https://[^)]+)\)", block).group(1)
        if url not in cache:
            cache[url] = base64.b64encode(fetch(url)).decode()
        block = re.sub(r"url\(https://[^)]+\)",
                       f"url(data:font/woff2;base64,{cache[url]})", block)
        # the unicode-range only matters when several subsets coexist
        out.append(re.sub(r"unicode-range:[^;]+;", "", block))

    if not out:
        raise SystemExit("no latin @font-face blocks found — did the CSS API change?")

    OUT.write_text("\n".join(out))
    print(f"{OUT.name}: {len(out)} faces, {OUT.stat().st_size / 1024:.0f} KB")


if __name__ == "__main__":
    main()
