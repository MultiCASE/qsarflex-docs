#!/usr/bin/env python3
"""Regenerate pdf/images.css — the two marks, base64-embedded as CSS variables.

    python3 pdf/tools/embed-images.py

Same reason as the fonts: no network at render time, and no relative-path
breakage if the HTML is ever opened from somewhere else. The marks are used as
background-image, so they arrive as `--img-mark` and `--img-mc`.

Sources in pdf/assets/:
  qsarflex-mark.png  — the green molecular knot, trimmed to its bounding box.
                       Originally QSARFlexMac/scripts/dmg-assets/qsarflex-logo.png
  multicase-hex.png  — the MultiCASE hexagon, cropped away from its white
                       wordmark so it can sit on any ground. The wordmark is set
                       as live type in the HTML instead.

Requires Pillow (pip install pillow).
"""
import base64
import io
import pathlib

from PIL import Image

HERE = pathlib.Path(__file__).resolve().parent
ASSETS = HERE.parent / "assets"
OUT = HERE.parent / "images.css"

# (variable name, file, max box) — downscaling keeps the CSS from bloating; the
# marks are never drawn larger than ~170mm.
SOURCES = [
    ("--img-mark", "qsarflex-mark.png", (900, 900)),
    ("--img-mc", "multicase-hex.png", (600, 600)),
]


def encode(path: pathlib.Path, box: tuple[int, int]) -> str:
    im = Image.open(path).convert("RGBA")
    im.thumbnail(box, Image.LANCZOS)
    buf = io.BytesIO()
    im.save(buf, "PNG", optimize=True)
    return base64.b64encode(buf.getvalue()).decode()


def main() -> None:
    lines = [":root {"]
    for var, name, box in SOURCES:
        path = ASSETS / name
        if not path.exists():
            raise SystemExit(f"missing {path}")
        lines.append(f"  {var}: url(data:image/png;base64,{encode(path, box)});")
    lines.append("}")

    OUT.write_text("\n".join(lines) + "\n")
    print(f"{OUT.name}: {len(SOURCES)} images, {OUT.stat().st_size / 1024:.0f} KB")


if __name__ == "__main__":
    main()
