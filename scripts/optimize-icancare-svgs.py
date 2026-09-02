"""Extract embedded raster images from ICan Care SVGs and compress to WebP.

Note: external /assets/*.webp refs do NOT render when SVGs are used via <img>.
After running this script, run inline-icancare-svg-images.py before deploy.
"""
import base64
import io
import re
from pathlib import Path

from PIL import Image

ASSETS = Path(__file__).resolve().parents[1] / "assets"
SVG_GLOB = "icancare-*.svg"


def optimize_svg(svg_path: Path) -> None:
    text = svg_path.read_text(encoding="utf-8")
    if "data:image" not in text:
        return

    pattern = re.compile(r'xlink:href="data:image/([^;]+);base64,([^"]+)"')
    index = 0
    original_kb = svg_path.stat().st_size / 1024

    def replacer(match: re.Match) -> str:
        nonlocal index
        index += 1
        raw = base64.b64decode(match.group(2))
        out = ASSETS / f"{svg_path.stem}-img{index}.webp"
        im = Image.open(io.BytesIO(raw)).convert("RGB")
        im.save(out, "WEBP", quality=80, method=6)
        return f'xlink:href="/assets/{out.name}"'

    new_text = pattern.sub(replacer, text)
    svg_path.write_text(new_text, encoding="utf-8")
    new_kb = svg_path.stat().st_size / 1024
    print(f"{svg_path.name}: {original_kb:.1f} KB -> {new_kb:.1f} KB ({index} image(s))")


if __name__ == "__main__":
    for svg in sorted(ASSETS.glob(SVG_GLOB)):
        optimize_svg(svg)
