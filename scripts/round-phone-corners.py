"""Smooth phone bottom corners by replacing dark bezel slivers with cream."""
from __future__ import annotations

from pathlib import Path

import numpy as np
from PIL import Image

Image.MAX_IMAGE_PIXELS = None

ROOT = Path(__file__).resolve().parents[1] / "assets"
CREAM = (244, 241, 234, 255)
DARK_MAX = 55
CORNER_W = 380
CORNER_H = 700


def shift(mask: np.ndarray, dy: int, dx: int) -> np.ndarray:
    h, w = mask.shape
    out = np.zeros_like(mask)
    ys = slice(max(0, -dy), h - max(0, dy))
    xs = slice(max(0, -dx), w - max(0, dx))
    sy = slice(max(0, dy), h - max(0, -dy))
    sx = slice(max(0, dx), w - max(0, -dx))
    out[sy, sx] = mask[ys, xs]
    return out


def dilate(mask: np.ndarray, r: int) -> np.ndarray:
    out = mask.copy()
    for dy in range(-r, r + 1):
        for dx in range(-r, r + 1):
            if dy * dy + dx * dx > r * r:
                continue
            out |= shift(mask, dy, dx)
    return out


def phone_boxes(rgb: np.ndarray) -> list[tuple[int, int, int, int]]:
    cream = np.abs(rgb - CREAM[:3]).sum(axis=2) <= 24
    phone = ~cream
    h, w = phone.shape
    visited = np.zeros(phone.shape, dtype=bool)
    boxes: list[tuple[int, int, int, int, int]] = []
    for y in range(h):
        for x in range(w):
            if not phone[y, x] or visited[y, x]:
                continue
            stack = [(y, x)]
            pts = []
            while stack:
                cy, cx = stack.pop()
                if cy < 0 or cy >= h or cx < 0 or cx >= w:
                    continue
                if visited[cy, cx] or not phone[cy, cx]:
                    continue
                visited[cy, cx] = True
                pts.append((cy, cx))
                stack.extend([(cy - 1, cx), (cy + 1, cx), (cy, cx - 1), (cy, cx + 1)])
            if len(pts) > 500_000:
                ys = [p[0] for p in pts]
                xs = [p[1] for p in pts]
                boxes.append((min(xs), min(ys), max(xs), max(ys), len(pts)))
    boxes.sort(key=lambda b: b[4], reverse=True)
    return [(b[0], b[1], b[2], b[3]) for b in boxes[:2]]


def fix_corners(path: Path) -> None:
    im = Image.open(path).convert("RGBA")
    arr = np.array(im)
    h, w = arr.shape[:2]
    rgb = arr[..., :3].astype(np.int16)
    cream = (np.abs(rgb - CREAM[:3]).sum(axis=2) <= 24)
    white = rgb.min(axis=2) >= 235
    dark = (rgb.max(axis=2) <= DARK_MAX) & ~white

    cream_near = dilate(cream, 6)
    white_near = dilate(white, 18)
    wedge = dark & cream_near & white_near

    fix = np.zeros_like(wedge)
    yy, xx = np.ogrid[:h, :w]
    for x0, _y0, x1, y1 in phone_boxes(rgb):
        bottom = yy >= (y1 - CORNER_H)
        fix |= wedge & bottom & (xx <= (x0 + CORNER_W))
        fix |= wedge & bottom & (xx >= (x1 - CORNER_W))

    count = int(fix.sum())
    print(f"{path.name}: {count:,} corner px")
    if count:
        arr[fix] = CREAM
        out = Image.fromarray(arr, "RGBA")
        out.save(path, optimize=True)
        out.save(path.with_suffix(".webp"), "WEBP", quality=88, method=4)


def main() -> None:
    fix_corners(ROOT / "sc-mockup-1.png")


if __name__ == "__main__":
    main()
