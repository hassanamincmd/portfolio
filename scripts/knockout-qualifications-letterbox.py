"""Knock edge-connected black/white letterbox to transparent; keep mockup interiors."""
from __future__ import annotations

from pathlib import Path

import numpy as np
from PIL import Image

Image.MAX_IMAGE_PIXELS = None

ROOT = Path(__file__).resolve().parents[1] / "assets"
BLACK = 22
WHITE = 248
MASK_MAX = 1600


def flood_from_seeds(mask: np.ndarray, seeds: np.ndarray) -> np.ndarray:
    fill = seeds & mask
    for _ in range(mask.shape[0] + mask.shape[1] + 4):
        dilated = fill.copy()
        dilated[1:, :] |= fill[:-1, :]
        dilated[:-1, :] |= fill[1:, :]
        dilated[:, 1:] |= fill[:, :-1]
        dilated[:, :-1] |= fill[:, 1:]
        nxt = dilated & mask
        if np.array_equal(nxt, fill):
            return fill
        fill = nxt
    return fill


def letterbox_mask(w: int, h: int, im: Image.Image) -> np.ndarray:
    scale = min(1.0, MASK_MAX / max(w, h))
    sw, sh = max(1, int(w * scale)), max(1, int(h * scale))
    small = im.resize((sw, sh), Image.Resampling.BILINEAR)
    arr = np.array(small)
    rgb = arr[..., :3].astype(np.int16)
    opaque = arr[..., 3] > 8
    black = (rgb.max(axis=2) <= BLACK) & opaque
    mask = black
    seeds = np.zeros_like(mask)
    seeds[0, :] = seeds[-1, :] = seeds[:, 0] = seeds[:, -1] = True
    fill_s = flood_from_seeds(mask, seeds)
    fill = np.array(
        Image.fromarray(fill_s.astype(np.uint8) * 255).resize((w, h), Image.Resampling.NEAREST)
    ) > 0
    return fill


def knock_out(path: Path) -> None:
    print("letterbox -> transparent", path.name)
    im = Image.open(path).convert("RGBA")
    w, h = im.size
    fill = letterbox_mask(w, h, im)
    arr = np.array(im)
    arr[fill, 3] = 0
    out = Image.fromarray(arr, "RGBA")
    out.save(path, optimize=True)
    out.save(path.with_suffix(".webp"), "WEBP", quality=84, method=4)
    print(f"  {path.name} ({w}x{h}), cleared {int(fill.sum())} px")


def main() -> None:
    for name in ("sc-mockup-1.png", "mockup-3.png"):
        p = ROOT / name
        if p.exists():
            knock_out(p)


if __name__ == "__main__":
    main()
