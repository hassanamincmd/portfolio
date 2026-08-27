import fs from "node:fs";
import { getDocument } from "pdfjs-dist/legacy/build/pdf.mjs";

function itemsToLines(items) {
  const rows = [];
  for (const item of items) {
    const str = "str" in item ? item.str : "";
    if (!str) continue;
    const x = item.transform?.[4] ?? 0;
    const y = item.transform?.[5] ?? 0;
    const row = rows.find((entry) => Math.abs(entry.y - y) < 4);
    if (row) row.parts.push({ x, str });
    else rows.push({ y, parts: [{ x, str }] });
  }
  rows.sort((a, b) => b.y - a.y);
  return rows
    .map((row) => {
      row.parts.sort((a, b) => a.x - b.x);
      return row.parts
        .map((part) => part.str)
        .join(" ")
        .replace(/[ \t]+/g, " ")
        .trim();
    })
    .filter(Boolean);
}

export async function extractPdfText(filePath) {
  const data = new Uint8Array(fs.readFileSync(filePath));
  const loadingTask = getDocument({
    data,
    verbosity: 0,
    isEvalSupported: false,
    useSystemFonts: true,
    disableFontFace: true,
  });
  const pdf = await loadingTask.promise;
  const pages = [];
  for (let i = 1; i <= pdf.numPages; i += 1) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    const lines = itemsToLines(content.items);
    if (lines.length) pages.push(lines.join("\n"));
  }
  return pages.join("\n");
}
