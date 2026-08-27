"""Fill square video-frame corners with page cream so the phone radius is clean."""
from __future__ import annotations

from pathlib import Path
import subprocess
import sys

import numpy as np
from PIL import Image

Image.MAX_IMAGE_PIXELS = None

ROOT = Path(__file__).resolve().parents[1]
FFMPEG = ROOT / "node_modules" / "ffmpeg-static" / "ffmpeg.exe"
SRC = ROOT / "assets" / "sc-mockup-vid.mp4"
FRAMES = ROOT / "assets" / "_vid-frames"
OUT = ROOT / "assets" / "sc-mockup-vid.mp4"
CREAM = np.array([244, 241, 234], dtype=np.uint8)
RADIUS = 64  # measured black tip ~56px; extra covers anti-alias


def ffmpeg(*args: str) -> None:
    cmd = [str(FFMPEG), "-y", *args]
    subprocess.run(cmd, check=True)


def corner_mask(h: int, w: int, r: int) -> np.ndarray:
    yy, xx = np.ogrid[:h, :w]
    outside = np.zeros((h, w), dtype=bool)
    outside |= (xx < r) & (yy < r) & (((xx - r) ** 2 + (yy - r) ** 2) > r * r)
    outside |= (xx >= w - r) & (yy < r) & (((xx - (w - 1 - r)) ** 2 + (yy - r) ** 2) > r * r)
    outside |= (xx < r) & (yy >= h - r) & (((xx - r) ** 2 + (yy - (h - 1 - r)) ** 2) > r * r)
    outside |= (xx >= w - r) & (yy >= h - r) & (
        ((xx - (w - 1 - r)) ** 2 + (yy - (h - 1 - r)) ** 2) > r * r
    )
    return outside


def main() -> None:
    FRAMES.mkdir(exist_ok=True)
    for old in FRAMES.glob("*.png"):
        old.unlink()

    ffmpeg("-i", str(SRC), str(FRAMES / "f_%04d.png"))
    files = sorted(FRAMES.glob("f_*.png"))
    if not files:
        sys.exit("no frames extracted")

    first = np.array(Image.open(files[0]).convert("RGB"))
    mask = corner_mask(first.shape[0], first.shape[1], RADIUS)
    print(f"{len(files)} frames, {int(mask.sum()):,} corner px, R={RADIUS}")

    for i, path in enumerate(files, 1):
        arr = np.array(Image.open(path).convert("RGB"))
        arr[mask] = CREAM
        Image.fromarray(arr, "RGB").save(path)
        if i == 1 or i == len(files) or i % 60 == 0:
            print(f"  {i}/{len(files)}")

    tmp = ROOT / "assets" / "sc-mockup-vid.tmp.mp4"
    ffmpeg(
        "-framerate",
        "30",
        "-i",
        str(FRAMES / "f_%04d.png"),
        "-c:v",
        "libx264",
        "-pix_fmt",
        "yuv420p",
        "-crf",
        "18",
        "-movflags",
        "+faststart",
        "-an",
        str(tmp),
    )
    tmp.replace(OUT)

    for old in FRAMES.glob("*.png"):
        old.unlink()
    FRAMES.rmdir()
    print("wrote", OUT)


if __name__ == "__main__":
    main()
