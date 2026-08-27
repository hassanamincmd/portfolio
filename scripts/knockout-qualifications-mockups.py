"""Knock out letterbox canvas to transparent on Qualifications mockups."""
from __future__ import annotations

from pathlib import Path

import numpy as np
from PIL import Image

Image.MAX_IMAGE_PIXELS = None

ROOT = Path(__file__).resolve().parents[1] / "assets"
BLACK = 22
WHITE = 248
MASK_MAX = 1600


def load_rgba(path: Path) -> tuple[np.ndarray, Image.Image]:
    im = Image.open(path).convert("RGBA")
    return np.array(im), im


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


def canvas_mask_at_size(w: int, h: int, im: Image.Image) -> np.ndarray:
    scale = min(1.0, MASK_MAX / max(w, h))
    sw, sh = max(1, int(w * scale)), max(1, int(h * scale))
    small = im.resize((sw, sh), Image.Resampling.BILINEAR)
    arr = np.array(small)
    rgb = arr[..., :3].astype(np.int16)
    opaque = arr[..., 3] > 8
    black = (rgb.max(axis=2) <= BLACK) & opaque
    white = (rgb.min(axis=2) >= WHITE) & opaque
    mask = black | white
    seeds = np.zeros_like(mask)
    seeds[0, :] = seeds[-1, :] = seeds[:, 0] = seeds[:, -1] = True
    fill_s = flood_from_seeds(mask, seeds)
    fill = np.array(
        Image.fromarray(fill_s.astype(np.uint8) * 255).resize((w, h), Image.Resampling.NEAREST)
    ) > 0
    return fill


def knock_out(path: Path) -> None:
    print("transparent", path.name)
    im = Image.open(path)
    if getattr(im, "is_animated", False):
        frames: list[Image.Image] = []
        n = getattr(im, "n_frames", 1)
        for i in range(n):
            im.seek(i)
            frames.append(im.convert("RGBA"))
        w, h = frames[0].size
        fill = canvas_mask_at_size(w, h, frames[0])
        out_frames = []
        for fr in frames:
            arr = np.array(fr)
            arr[fill, 3] = 0
            out_frames.append(Image.fromarray(arr, "RGBA"))
        out_frames[0].save(
            path,
            save_all=True,
            append_images=out_frames[1:],
            duration=im.info.get("duration", 80),
            loop=0,
            optimize=False,
        )
        webp = path.with_suffix(".webp")
        out_frames[0].save(
            webp,
            save_all=True,
            append_images=out_frames[1:],
            duration=im.info.get("duration", 80),
            loop=0,
            quality=84,
            method=4,
        )
        print(f"  wrote {path.name} ({w}x{h}, {n} frames)")
        return

    arr, im_rgba = load_rgba(path)
    h, w = arr.shape[:2]
    fill = canvas_mask_at_size(w, h, im_rgba)
    arr[fill, 3] = 0
    out = Image.fromarray(arr, "RGBA")
    out.save(path, optimize=True)
    webp = path.with_suffix(".webp")
    out.save(webp, "WEBP", quality=84, method=4)
    print(f"  wrote {path.name} / {webp.name} ({w}x{h})")


def main() -> None:
    for name in ("sc-mockup-1.png", "sc-mockup-2.webp", "mockup-3.png"):
        path = ROOT / name
        if path.exists():
            knock_out(path)
        else:
            print("skip missing", name)


if __name__ == "__main__":
    main()
