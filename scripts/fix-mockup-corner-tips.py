"""Remove black corner tips where phone frames meet the cream letterbox."""
from __future__ import annotations

from pathlib import Path

import numpy as np
from PIL import Image

Image.MAX_IMAGE_PIXELS = None

ROOT = Path(__file__).resolve().parents[1] / "assets"
CREAM = np.array([244, 241, 234, 255], dtype=np.uint8)
BLACK = 35
WHITE = 235


def shift(mask: np.ndarray, dy: int, dx: int) -> np.ndarray:
    h, w = mask.shape
    out = np.zeros_like(mask)
    ys = slice(max(0, -dy), h - max(0, dy))
    xs = slice(max(0, -dx), w - max(0, dx))
    sy = slice(max(0, dy), h - max(0, -dy))
    sx = slice(max(0, dx), w - max(0, -dx))
    out[sy, sx] = mask[ys, xs]
    return out


def neighbor_mask(mask: np.ndarray, radius: int = 1) -> np.ndarray:
    out = mask.copy()
    for dy in range(-radius, radius + 1):
        for dx in range(-radius, radius + 1):
            if dy == 0 and dx == 0:
                continue
            out |= shift(mask, dy, dx)
    return out


def flood(mask: np.ndarray, seeds: np.ndarray) -> np.ndarray:
    fill = seeds & mask
    while True:
        nxt = fill.copy()
        nxt |= shift(fill, -1, 0)
        nxt |= shift(fill, 1, 0)
        nxt |= shift(fill, 0, -1)
        nxt |= shift(fill, 0, 1)
        nxt &= mask
        if np.array_equal(nxt, fill):
            return fill
        fill = nxt


def fix_corners(path: Path) -> None:
    arr = np.array(Image.open(path).convert("RGBA"))
    rgb = arr[..., :3].astype(np.int16)
    alpha = arr[..., 3]

    cream = (np.abs(rgb - CREAM[:3]).sum(axis=2) <= 24) & (alpha > 8)
    black = (rgb.max(axis=2) <= BLACK) & (alpha > 8)
    white = (rgb.min(axis=2) >= WHITE) & (alpha > 8)

    cream_near = neighbor_mask(cream, 1)
    white_near = neighbor_mask(white, 2)

    # Black wedged between cream (outside) and white (inside) at rounded corners.
    tips = black & cream_near & white_near

    # Also remove small black specks directly touching cream (outer bezel bleed).
    touch_cream = black & cream_near & ~white_near
    small_specks = np.zeros_like(black)
    remaining = touch_cream.copy()
    h, w = black.shape
    visited = np.zeros_like(black)
    for y in range(h):
        xs = np.where(remaining[y])[0]
        for x in xs:
            if visited[y, x]:
                continue
            stack = [(y, x)]
            component = []
            while stack:
                cy, cx = stack.pop()
                if cy < 0 or cy >= h or cx < 0 or cx >= w:
                    continue
                if visited[cy, cx] or not remaining[cy, cx]:
                    continue
                visited[cy, cx] = True
                component.append((cy, cx))
                stack.extend([(cy - 1, cx), (cy + 1, cx), (cy, cx - 1), (cy, cx + 1)])
            if len(component) <= 120:
                for cy, cx in component:
                    small_specks[cy, cx] = True

    # Never eat interior UI: skip large black regions not touching image edge cream path.
    interior_black = black & ~cream_near
    ui_black = flood(black, interior_black) & black
    tips &= ~ui_black
    small_specks &= ~ui_black

    fix = tips | small_specks
    count = int(fix.sum())
    print(f"{path.name}: {count:,} corner-tip px")
    if count:
        arr[fix] = CREAM
        out = Image.fromarray(arr, "RGBA")
        out.save(path, optimize=True)
        out.save(path.with_suffix(".webp"), "WEBP", quality=88, method=4)


def main() -> None:
    for name in ("sc-mockup-1.png", "mockup-3.png"):
        path = ROOT / name
        if path.exists():
            fix_corners(path)


if __name__ == "__main__":
    main()
