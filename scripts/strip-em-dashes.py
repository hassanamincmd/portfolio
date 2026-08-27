import re
from pathlib import Path

FILES = [
    Path(r"c:\My Website\index.html"),
    Path(r"c:\My Website\case-study-meridian.html"),
    Path(r"c:\My Website\case-study-safety-hub.html"),
    Path(r"c:\My Website\case-study-qualifications.html"),
    Path(r"c:\My Website\case-study-icancare.html"),
]

EM = r"(?:&mdash;|—)"


def replace_em(text: str) -> str:
    text = re.sub(rf"\s+{EM}\s+([^—<&]{{1,90}}?)\s+{EM}\s+", r" (\1) ", text)
    text = re.sub(rf"(<cite>){EM}\s*", r"\1", text)
    text = re.sub(rf"(\.\d{{2}})\s*{EM}\s*", r"\1 ", text)
    text = re.sub(rf"(finding \d{{2}})\s*{EM}\s*", r"\1: ", text, flags=re.I)
    text = re.sub(rf"(>\s*\d{{2}})\s*{EM}\s*", r"\1 ", text)
    text = re.sub(EM, "___EM___", text)
    parts = text.split("___EM___")
    if len(parts) == 1:
        return text
    out = [parts[0]]
    for p in parts[1:]:
        prev = out[-1]
        nxt = p.lstrip()
        stripped_prev = prev.rstrip(" \t")
        first = nxt[:1]
        if "<!--" in stripped_prev[-24:]:
            out.append(" - ")
            out.append(p)
            continue
        if first.isupper():
            if stripped_prev and stripped_prev[-1] not in ".!?:;,":
                out.append(". ")
            else:
                out.append(" ")
        elif first:
            if stripped_prev.endswith(("web", "mobile", "Web", "Mobile")):
                out.append(": ")
            elif stripped_prev and stripped_prev[-1] not in ".!?:;,":
                out.append(", ")
            else:
                out.append(" ")
        else:
            out.append(" ")
        out.append(p)
    return "".join(out)


def main() -> None:
    for path in FILES:
        raw = path.read_text(encoding="utf-8")
        new = replace_em(raw)
        path.write_text(new, encoding="utf-8")
        before = len(re.findall(r"—|&mdash;", raw))
        after = len(re.findall(r"—|&mdash;", new))
        print(f"{path.name}: {before} -> {after}")


if __name__ == "__main__":
    main()
