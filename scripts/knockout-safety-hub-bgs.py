"""Knock out letterbox canvas to transparent on Safety Hub mockups."""
from __future__ import annotations

from pathlib import Path

import numpy as np
from PIL import Image

Image.MAX_IMAGE_PIXELS = None

ROOT = Path(__file__).resolve().parents[1] / "assets"
BLACK = 22
WHITE = 248


def load_rgba(path: Path) -> np.ndarray:
    im = Image.open(path).convert("RGBA")
    return np.array(im)


def flood_from_seeds(mask: np.ndarray, seeds: np.ndarray) -> np.ndarray:
    fill = seeds & mask
    while True:
        dilated = fill.copy()
        dilated[1:, :] |= fill[:-1, :]
        dilated[:-1, :] |= fill[1:, :]
        dilated[:, 1:] |= fill[:, :-1]
        dilated[:, :-1] |= fill[:, 1:]
        nxt = dilated & mask
        if np.array_equal(nxt, fill):
            return fill
        fill = nxt


def edge_mask(mask: np.ndarray) -> np.ndarray:
    h, w = mask.shape
    seeds = np.zeros_like(mask)
    seeds[0, :] = True
    seeds[-1, :] = True
    seeds[:, 0] = True
    seeds[:, -1] = True
    return flood_from_seeds(mask, seeds)


def canvas_mask(arr: np.ndarray) -> np.ndarray:
    rgb = arr[..., :3].astype(np.int16)
    opaque = arr[..., 3] > 8
    black = (rgb.max(axis=2) <= BLACK) & opaque
    white = (rgb.min(axis=2) >= WHITE) & opaque
    return edge_mask(black | white)


def save_png_webp(arr: np.ndarray, dest: Path) -> None:
    im = Image.fromarray(arr, "RGBA")
    im.save(dest, optimize=True)
    webp = dest.with_suffix(".webp")
    im.save(webp, "WEBP", quality=84, method=4)
    print(f"  wrote {dest.name} / {webp.name} ({im.size[0]}x{im.size[1]})")


def knock_out(path: Path) -> None:
    print("transparent", path.name)
    arr = load_rgba(path)
    fill = canvas_mask(arr)
    arr[fill, 3] = 0
    save_png_webp(arr, path)


def main() -> None:
    names = [
        "safety-hero.png",
        "safety-mockup-web.png",
        "safety-mockup-mobile.png",
        "safety-hub-p1-01-exploration.png",
        "safety-hub-p1-02-dashboard-iterations.png",
        "safety-hub-p1-03-hub-flows.png",
        "safety-hub-p1-04-inspection-drilldown.png",
        "safety-hub-p1-05-category-flow.png",
        "safety-hub-p2-web-guess-free.png",
        "safety-hub-p2-mobile-guess-free.png",
        "safety-hub-phase1-exploration.png",
        "safety-hub-phase1-final.png",
        "safety-hub-phase1-flows.png",
        "safety-hub-phase1-hub-v1.png",
        "safety-hub-phase1-hub-v2.png",
        "safety-hub-phase1-iteration.png",
    ]
    for name in names:
        path = ROOT / name
        if path.exists():
            knock_out(path)
        else:
            print("skip missing", name)


if __name__ == "__main__":
    main()
