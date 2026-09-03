/**
 * Production site build:
 * 1) Ensure home-critical assets live under web/public
 * 2) Static-export the Next home (the Figma draft)
 * 3) Merge export + existing /assets + /preview into dist/
 */
import { copyFileSync, cpSync, existsSync, mkdirSync, rmSync } from "node:fs";
import { dirname, join } from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const web = join(root, "web");
const dist = join(root, "dist");
const publicDir = join(web, "public");
const publicAssets = join(publicDir, "assets");

const HOME_ASSETS = [
  "novartis-wordmark-figma5248.svg",
  "Hassan-CV-resume.pdf",
];

function run(command, args, cwd) {
  const result = spawnSync(command, args, {
    cwd,
    shell: true,
    stdio: "inherit",
    env: process.env,
  });
  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
}

mkdirSync(publicAssets, { recursive: true });

for (const file of HOME_ASSETS) {
  const from = join(root, "assets", file);
  if (!existsSync(from)) {
    console.error(`Missing required asset: assets/${file}`);
    process.exit(1);
  }
  copyFileSync(from, join(publicAssets, file));
}

const favicon = join(root, "favicon.svg");
if (existsSync(favicon)) {
  copyFileSync(favicon, join(publicDir, "favicon.svg"));
}

console.log("Building Next static export…");
run("npm", ["run", "build"], web);

const out = join(web, "out");
if (!existsSync(out)) {
  console.error("Next export folder missing: web/out");
  process.exit(1);
}

rmSync(dist, { recursive: true, force: true });
mkdirSync(dist, { recursive: true });

cpSync(out, dist, { recursive: true });
cpSync(join(root, "assets"), join(dist, "assets"), { recursive: true });
cpSync(join(root, "preview"), join(dist, "preview"), { recursive: true });

if (existsSync(favicon)) {
  copyFileSync(favicon, join(dist, "favicon.svg"));
}

for (const extra of ["404.html", "robots.txt", "sitemap.xml"]) {
  const src = join(root, extra);
  if (existsSync(src)) {
    copyFileSync(src, join(dist, extra));
  }
}

console.log("Production site ready in dist/");
