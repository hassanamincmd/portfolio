"""Inline external WebP references in ICan Care SVGs so raster images render in <img> tags."""
import base64
import re
from pathlib import Path

ASSETS = Path(__file__).resolve().parents[1] / "assets"
SVG_GLOB = "icancare-*.svg"
HREF_PATTERN = re.compile(r'xlink:href="/assets/(icancare-[^"]+\.webp)"')


def inline_images(svg_path: Path) -> None:
    text = svg_path.read_text(encoding="utf-8")
    matches = HREF_PATTERN.findall(text)
    if not matches:
        return

    def replacer(match: re.Match) -> str:
        img_path = ASSETS / match.group(1)
        if not img_path.exists():
            raise FileNotFoundError(f"Missing raster for {svg_path.name}: {img_path.name}")
        data = base64.b64encode(img_path.read_bytes()).decode("ascii")
        return f'xlink:href="data:image/webp;base64,{data}"'

    svg_path.write_text(HREF_PATTERN.sub(replacer, text), encoding="utf-8")
    print(f"{svg_path.name}: inlined {len(matches)} image(s)")


if __name__ == "__main__":
    for svg in sorted(ASSETS.glob(SVG_GLOB)):
        inline_images(svg)
