import json
import sys
import zipfile
import xml.etree.ElementTree as ET
from pathlib import Path


def from_docx(path: Path) -> str:
    with zipfile.ZipFile(path) as zipped:
        xml = zipped.read("word/document.xml")
    lines = []
    for para in ET.fromstring(xml).iter(
        "{http://schemas.openxmlformats.org/wordprocessingml/2006/main}p"
    ):
        texts = [
            node.text or ""
            for node in para.iter(
                "{http://schemas.openxmlformats.org/wordprocessingml/2006/main}t"
            )
        ]
        line = "".join(texts).strip()
        if line:
            lines.append(line)
    return "\n".join(lines)


def from_pdf(path: Path) -> str:
    try:
        from pypdf import PdfReader
    except ImportError as err:
        raise RuntimeError("pypdf is not installed") from err
    reader = PdfReader(str(path))
    chunks = []
    for page in reader.pages:
        try:
            text = page.extract_text(extraction_mode="layout") or ""
        except TypeError:
            text = page.extract_text() or ""
        if text.strip():
            chunks.append(text)
    return "\n".join(chunks)


def main():
    payload = json.load(sys.stdin)
    path = Path(payload["path"])
    suffix = path.suffix.lower()
    if suffix in {".txt", ".md"}:
        text = path.read_text(encoding="utf-8", errors="ignore")
    elif suffix == ".docx":
        text = from_docx(path)
    elif suffix == ".pdf":
        text = from_pdf(path)
    else:
        raise RuntimeError(f"Unsupported file type: {suffix}")
    if not text.strip():
        raise RuntimeError(
            "This file opened but had no selectable text. If it is a scanned PDF, export a DOCX or paste the text."
        )
    json.dump({"text": text}, sys.stdout)


if __name__ == "__main__":
    try:
        main()
    except Exception as err:
        json.dump({"error": str(err)}, sys.stdout)
        sys.exit(1)
