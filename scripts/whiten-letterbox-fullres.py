"""Replace edge-connected black letterbox with page background (#f4f1ea).

Full-resolution flood from image borders through black pixels only.
Does not touch white artboards, phone UI, or interior black elements.
"""
from __future__ import annotations

from pathlib import Path

import numpy as np
from PIL import Image

Image.MAX_IMAGE_PIXELS = None

ROOT = Path(__file__).resolve().parents[1] / "assets"
BG = np.array([244, 241, 234, 255], dtype=np.uint8)
BLACK_THRESH = 25


def propagate(seeds: np.ndarray, mask: np.ndarray) -> np.ndarray:
    filled = seeds & mask
    while True:
        nxt = filled.copy()
        nxt[1:, :] |= filled[:-1, :]
        nxt[:-1, :] |= filled[1:, :]
        nxt[:, 1:] |= filled[:, :-1]
        nxt[:, :-1] |= filled[:, 1:]
        nxt &= mask
        if np.array_equal(nxt, filled):
            return filled
        filled = nxt


def whiten(path: Path) -> None:
    print(f"whiten {path.name}")
    im = Image.open(path).convert("RGBA")
    arr = np.array(im)
    rgb = arr[..., :3]
    alpha = arr[..., 3]
    black = (rgb.max(axis=2) <= BLACK_THRESH) & (alpha > 8)

    seeds = np.zeros(black.shape, dtype=bool)
    seeds[0, :] = black[0, :]
    seeds[-1, :] = black[-1, :]
    seeds[:, 0] = black[:, 0]
    seeds[:, -1] = black[:, -1]

    letterbox = propagate(seeds, black)
    count = int(letterbox.sum())
    print(f"  {count:,} letterbox px ({100 * count / letterbox.size:.1f}%)")

    arr[letterbox] = BG
    out = Image.fromarray(arr, "RGBA")
    out.save(path, optimize=True)
    webp = path.with_suffix(".webp")
    out.save(webp, "WEBP", quality=88, method=4)
    print(f"  wrote {path.name} + {webp.name}")


def main() -> None:
    for name in ("sc-mockup-1.png", "mockup-3.png"):
        path = ROOT / name
        if path.exists():
            whiten(path)
        else:
            print("missing", name)


if __name__ == "__main__":
    main()
