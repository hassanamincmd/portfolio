/**
 * Export case study pages as Upwork portfolio PDFs.
 * Max 5 PDFs per project, each under 10 MB.
 */
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const OUT_DIR = path.join(ROOT, 'exports', 'upwork');
const MAX_BYTES = 10 * 1024 * 1024;
const PORT = 8765;

const PRINT_CSS = `
  .header, .mobile-nav, .progress-line, footer, .header__menu-btn,
  [data-resume-modal], script { display: none !important; }
  html, body { overflow: visible !important; height: auto !important; }
  * { animation: none !important; transition: none !important; }
  .cover { min-height: auto !important; page-break-after: avoid; }
  section, .overview-bar { break-inside: avoid-page; }
`;

/** @type {Array<{ slug: string; name: string; file: string; parts: Array<{ name: string; blocks: number[] }> }>} */
const PROJECTS = [
  {
    slug: 'meridian',
    name: 'Meridian',
    file: 'case-study-meridian.html',
    parts: [
      { name: '01-overview', blocks: [0, 1] },
      { name: '02-problem-goal-process', blocks: [2, 3, 4] },
      { name: '03-features-dashboard-booking-builder', blocks: [5, 6, 7] },
      { name: '04-features-analytics-settings-auth', blocks: [8, 9, 10] },
      { name: '05-outcomes-reflections', blocks: [11, 12] },
    ],
  },
  {
    slug: 'safety-hub',
    name: 'Safety Hub',
    file: 'case-study-safety-hub.html',
    parts: [
      { name: '01-overview', blocks: [0, 1] },
      { name: '02-context-and-role', blocks: [2, 3] },
      { name: '03-phase-1-mobile', blocks: [4] },
      { name: '04-phase-2-dashboards', blocks: [5] },
      { name: '05-skills-reflections', blocks: [6, 7] },
    ],
  },
  {
    slug: 'qualifications',
    name: 'Qualifications Management',
    file: 'case-study-qualifications.html',
    parts: [
      { name: '01-overview', blocks: [0, 1] },
      { name: '02-context-role-system', blocks: [2, 3, 4] },
      { name: '03-mobile-safety-card', blocks: [5] },
      { name: '04-web-workers-table', blocks: [6] },
      { name: '05-tags-outcomes-reflections', blocks: [7, 8, 9, 10] },
    ],
  },
];

function mime(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  const map = {
    '.html': 'text/html; charset=utf-8',
    '.css': 'text/css; charset=utf-8',
    '.js': 'text/javascript; charset=utf-8',
    '.svg': 'image/svg+xml',
    '.png': 'image/png',
    '.webp': 'image/webp',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.mp4': 'video/mp4',
    '.woff2': 'font/woff2',
    '.pdf': 'application/pdf',
  };
  return map[ext] || 'application/octet-stream';
}

function startServer() {
  return new Promise((resolve) => {
    const server = http.createServer((req, res) => {
      const urlPath = decodeURIComponent((req.url || '/').split('?')[0]);
      const safe = path.normalize(urlPath).replace(/^(\.\.[/\\])+/, '');
      let filePath = path.join(ROOT, safe === '/' ? 'index.html' : safe.replace(/^\//, ''));

      if (fs.existsSync(filePath) && fs.statSync(filePath).isDirectory()) {
        filePath = path.join(filePath, 'index.html');
      }

      if (!filePath.startsWith(ROOT) || !fs.existsSync(filePath)) {
        res.writeHead(404);
        res.end('Not found');
        return;
      }

      res.writeHead(200, { 'Content-Type': mime(filePath) });
      fs.createReadStream(filePath).pipe(res);
    });

    server.listen(PORT, '127.0.0.1', () => resolve(server));
  });
}

function formatBytes(n) {
  return `${(n / (1024 * 1024)).toFixed(2)} MB`;
}

async function exportPart(page, baseUrl, blocks, outPath) {
  await page.goto(baseUrl, { waitUntil: 'networkidle', timeout: 120000 });
  await page.addStyleTag({ content: PRINT_CSS });
  await page.evaluate(() => {
    document.querySelectorAll('script').forEach((el) => el.remove());
  });

  await page.evaluate((indices) => {
    const blocks = [
      ...document.querySelectorAll('section.cover'),
      ...document.querySelectorAll('.overview-bar'),
      ...document.querySelectorAll('section.section'),
      ...document.querySelectorAll('section.feature'),
    ];

    blocks.forEach((el, i) => {
      el.style.display = indices.includes(i) ? '' : 'none';
    });

    document.querySelectorAll('section[style]').forEach((el) => {
      el.style.display = 'none';
    });
  }, blocks);

  await page.waitForTimeout(800);

  let scale = 1;
  for (let attempt = 0; attempt < 4; attempt++) {
    await page.pdf({
      path: outPath,
      format: 'A4',
      printBackground: true,
      preferCSSPageSize: false,
      margin: { top: '12mm', right: '10mm', bottom: '12mm', left: '10mm' },
      scale,
    });

    const size = fs.statSync(outPath).size;
    if (size <= MAX_BYTES) return { size, scale };

    scale -= 0.12;
    if (scale < 0.55) break;
  }

  const size = fs.statSync(outPath).size;
  if (size > MAX_BYTES) {
    throw new Error(`PDF still ${formatBytes(size)} after compression: ${outPath}`);
  }
  return { size, scale };
}

async function main() {
  fs.mkdirSync(OUT_DIR, { recursive: true });

  const server = await startServer();
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

  const summary = [];

  try {
    for (const project of PROJECTS) {
      const projectDir = path.join(OUT_DIR, project.slug);
      fs.mkdirSync(projectDir, { recursive: true });
      const baseUrl = `http://127.0.0.1:${PORT}/${project.file}`;

      for (const part of project.parts) {
        const filename = `${project.slug}-${part.name}.pdf`;
        const outPath = path.join(projectDir, filename);
        process.stdout.write(`Exporting ${filename}... `);

        const { size, scale } = await exportPart(page, baseUrl, part.blocks, outPath);
        console.log(`${formatBytes(size)}${scale < 1 ? ` (scale ${scale.toFixed(2)})` : ''}`);
        summary.push({ project: project.name, file: filename, size });
      }
    }
  } finally {
    await browser.close();
    server.close();
  }

  const readme = [
    '# Upwork Portfolio PDFs',
    '',
    'Generated from hassanamin.net case studies.',
    'Limit: up to 5 PDFs per project, max 10 MB each.',
    '',
    '## Files',
    '',
    ...summary.map((s) => `- **${s.project}** — \`${s.file}\` (${formatBytes(s.size)})`),
    '',
    '## Upload tips (Upwork)',
    '',
    '1. Portfolio → Add project → attach 1–5 PDFs per project.',
    '2. Use part 01 as the cover/thumbnail preview.',
    '3. Title each Upwork project: Meridian / Safety Hub / Qualifications Management.',
    '',
  ].join('\n');

  fs.writeFileSync(path.join(OUT_DIR, 'README.md'), readme);
  console.log(`\nDone. Output: ${OUT_DIR}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
