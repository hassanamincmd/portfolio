"""Replace black letterbox / canvas with white on Safety Hub assets."""
from __future__ import annotations

from pathlib import Path

import numpy as np
from PIL import Image

Image.MAX_IMAGE_PIXELS = None

ROOT = Path(__file__).resolve().parents[1] / "assets"
BLACK = 22


def load_rgba(path: Path, max_edge: int = 2400) -> np.ndarray:
    im = Image.open(path).convert("RGBA")
    if max(im.size) > max_edge:
        im.thumbnail((max_edge, max_edge), Image.Resampling.LANCZOS)
        print(f"  resized to {im.size}")
    return np.array(im)


def near_black(arr: np.ndarray) -> np.ndarray:
    rgb = arr[..., :3].astype(np.int16)
    return (rgb.max(axis=2) <= BLACK) & (arr[..., 3] > 8)


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


def edge_black_mask(arr: np.ndarray) -> np.ndarray:
    black = near_black(arr)
    h, w = black.shape
    seeds = np.zeros_like(black)
    seeds[0, :] = True
    seeds[-1, :] = True
    seeds[:, 0] = True
    seeds[:, -1] = True
    return flood_from_seeds(black, seeds)


def center_black_mask(arr: np.ndarray) -> np.ndarray:
    black = near_black(arr)
    h, w = black.shape
    seeds = np.zeros_like(black)
    seeds[h // 2, w // 2] = True
    return flood_from_seeds(black, seeds)


def save_png_webp(arr: np.ndarray, dest: Path) -> None:
    im = Image.fromarray(arr, "RGBA")
    im.save(dest, optimize=True)
    webp = dest.with_suffix(".webp")
    im.convert("RGB").save(webp, "WEBP", quality=82, method=4)
    print(f"  wrote {dest.name} and {webp.name} ({im.size[0]}x{im.size[1]})")


def whiten_letterbox(path: Path) -> None:
    print("letterbox", path.name)
    arr = load_rgba(path)
    fill = edge_black_mask(arr)
    arr[fill, :3] = 255
    arr[fill, 3] = 255
    save_png_webp(arr, path)


def whiten_pcor(path: Path, max_width: int = 1600) -> None:
    print("thumbnail", path.name)
    im = Image.open(path).convert("RGBA")
    if im.width > max_width:
        h = round(im.height * (max_width / im.width))
        im = im.resize((max_width, h), Image.Resampling.LANCZOS)
    arr = np.array(im)
    logo = center_black_mask(arr)
    black = near_black(arr)
    canvas = black & ~logo
    arr[canvas, :3] = 255
    arr[canvas, 3] = 255
    save_png_webp(arr, path)


def main() -> None:
    whiten_pcor(ROOT / "pcor.png")

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
            whiten_letterbox(path)
        else:
            print("skip missing", name)


if __name__ == "__main__":
    main()
