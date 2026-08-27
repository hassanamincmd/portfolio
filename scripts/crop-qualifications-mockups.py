"""Crop mockup PNGs to content bounds; removes outer letterbox without touching interiors."""
from __future__ import annotations

from pathlib import Path

import numpy as np
from PIL import Image

Image.MAX_IMAGE_PIXELS = None

ROOT = Path(__file__).resolve().parents[1] / "assets"
BLACK = 22


def crop_letterbox(path: Path, pad: int = 0) -> None:
    print("crop letterbox", path.name)
    im = Image.open(path).convert("RGBA")
    arr = np.array(im)
    rgb = arr[..., :3].astype(np.int16)
    # Letterbox is pure black; mockup art is everything else.
    content = rgb.max(axis=2) > BLACK
    if not content.any():
        print("  skip: no content")
        return
    ys, xs = np.where(content)
    left = max(0, int(xs.min()) - pad)
    top = max(0, int(ys.min()) - pad)
    right = min(im.width, int(xs.max()) + 1 + pad)
    bottom = min(im.height, int(ys.max()) + 1 + pad)
    cropped = im.crop((left, top, right, bottom))
    cropped.save(path, optimize=True)
    cropped.save(path.with_suffix(".webp"), "WEBP", quality=88, method=4)
    print(f"  {im.size} -> {cropped.size}")


def main() -> None:
    # Restore pristine sources first if needed — run after git checkout d40b7ce
    for name in ("sc-mockup-1.png", "mockup-3.png"):
        p = ROOT / name
        if p.exists():
            crop_letterbox(p)


if __name__ == "__main__":
    main()
