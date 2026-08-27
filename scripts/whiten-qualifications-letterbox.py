"""Full-resolution: whiten edge-connected letterbox only; never touch mockup interiors."""
from __future__ import annotations

from pathlib import Path

import numpy as np
from PIL import Image

Image.MAX_IMAGE_PIXELS = None

ROOT = Path(__file__).resolve().parents[1] / "assets"
BLACK = 22
BG = (244, 241, 234, 255)  # --bg cream paper


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


def whiten_letterbox(path: Path) -> None:
    print("whiten letterbox", path.name)
    im = Image.open(path).convert("RGBA")
    arr = np.array(im)
    h, w = arr.shape[:2]
    rgb = arr[..., :3].astype(np.int16)
    opaque = arr[..., 3] > 8
    black = (rgb.max(axis=2) <= BLACK) & opaque
    seeds = np.zeros(black.shape, dtype=bool)
    seeds[0, :] = seeds[-1, :] = seeds[:, 0] = seeds[:, -1] = True
    fill = flood_from_seeds(black, seeds)
    arr[fill, 0] = BG[0]
    arr[fill, 1] = BG[1]
    arr[fill, 2] = BG[2]
    arr[fill, 3] = 255
    out = Image.fromarray(arr, "RGBA")
    out.save(path, optimize=True)
    out.save(path.with_suffix(".webp"), "WEBP", quality=88, method=4)
    print(f"  {w}x{h}, letterbox px {int(fill.sum())}")


def main() -> None:
    for name in ("sc-mockup-1.png", "mockup-3.png"):
        p = ROOT / name
        if p.exists():
            whiten_letterbox(p)


if __name__ == "__main__":
    main()
