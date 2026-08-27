import http from "node:http";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawn } from "node:child_process";
import { fileURLToPath } from "node:url";
import { fetchAllJobs } from "./lib/fetch-jobs.js";
import { DAILY_LIMIT, STRONG_MIN, scoreJob } from "./lib/score.js";
import { fileSlug, generateDocuments, answerApplicationQuestions } from "./lib/generate.js";
import { tailorManual } from "./lib/manual.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PUBLIC = path.join(__dirname, "public");
const PROFILE_PATH = path.join(__dirname, "data", "profile.json");

function readProfile() {
  return JSON.parse(fs.readFileSync(PROFILE_PATH, "utf8"));
}

function writeProfile(next) {
  fs.writeFileSync(PROFILE_PATH, JSON.stringify(next, null, 2));
  PROFILE = next;
}

let PROFILE = readProfile();
const PORT = Number(process.env.PORT || 3847);

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
};

let cache = { at: 0, payload: null };
const CACHE_MS = 15 * 60 * 1000;
const SLATE_PATH = path.join(__dirname, "data", "daily-slate.json");
const APPLIED_PATH = path.join(__dirname, "data", "applied.json");

function todayKey() {
  return new Date().toISOString().slice(0, 10);
}

function readSlate() {
  try {
    return JSON.parse(fs.readFileSync(SLATE_PATH, "utf8"));
  } catch {
    return { date: "", ids: [], dismissed: [] };
  }
}

function writeSlate(slate) {
  fs.writeFileSync(SLATE_PATH, JSON.stringify(slate, null, 2));
}

function readApplied() {
  try {
    const data = JSON.parse(fs.readFileSync(APPLIED_PATH, "utf8"));
    return Array.isArray(data.jobs) ? data.jobs : [];
  } catch {
    return [];
  }
}

function writeApplied(jobs) {
  fs.writeFileSync(APPLIED_PATH, JSON.stringify({ jobs }, null, 2));
}

function snapshotJob(job, appliedAt) {
  return {
    id: job.id,
    title: job.title,
    company: job.company,
    location: job.location,
    url: job.url,
    source: job.source,
    description: job.description,
    match: job.match,
    appliedAt: appliedAt || new Date().toISOString(),
  };
}

function send(res, status, body, type = "application/json; charset=utf-8") {
  res.writeHead(status, {
    "Content-Type": type,
    "Cache-Control": "no-store",
  });
  if (Buffer.isBuffer(body) || typeof body === "string") {
    res.end(body);
    return;
  }
  res.end(JSON.stringify(body));
}

async function extractResume(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  if (ext === ".pdf") {
    try {
      const { extractPdfText } = await import("./lib/extract-pdf.mjs");
      const text = await extractPdfText(filePath);
      if (text.trim()) return text;
    } catch {
      // Fall through to Python / pypdf.
    }
  }
  return extractResumePython(filePath);
}

function extractResumePython(filePath) {
  return new Promise((resolve, reject) => {
    const script = path.join(__dirname, "lib", "extract-resume.py");
    const child = spawn("python", [script], { stdio: ["pipe", "pipe", "pipe"] });
    let stdout = "";
    let stderr = "";
    child.stdout.on("data", (chunk) => {
      stdout += chunk.toString();
    });
    child.stderr.on("data", (chunk) => {
      stderr += chunk.toString();
    });
    child.on("error", reject);
    child.on("close", (code) => {
      try {
        const data = JSON.parse(stdout || "{}");
        if (data.text) resolve(data.text);
        else reject(new Error(data.error || stderr || `extract failed (${code})`));
      } catch {
        reject(new Error(stderr || "Could not read that file."));
      }
    });
    child.stdin.end(JSON.stringify({ path: filePath }));
  });
}

function exportFile({ text, format, path: outPath, title }) {
  return new Promise((resolve, reject) => {
    const script = path.join(__dirname, "lib", "export-docs.py");
    const child = spawn("python", [script], { stdio: ["pipe", "pipe", "pipe"] });
    let stderr = "";
    child.stderr.on("data", (chunk) => {
      stderr += chunk.toString();
    });
    child.on("error", reject);
    child.on("close", (code) => {
      if (code === 0) resolve();
      else reject(new Error(stderr || `export failed (${code})`));
    });
    child.stdin.end(
      JSON.stringify({ text, format, path: outPath, title })
    );
  });
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    req.on("data", (c) => chunks.push(c));
    req.on("end", () => {
      try {
        resolve(JSON.parse(Buffer.concat(chunks).toString("utf8") || "{}"));
      } catch (err) {
        reject(err);
      }
    });
    req.on("error", reject);
  });
}

function removeFromSlate(id) {
  const slate = readSlate();
  slate.ids = (slate.ids || []).filter((item) => item !== id);
  writeSlate(slate);
  return slate;
}

async function rankedJobs(filters = {}) {
  const fresh = Date.now() - cache.at < CACHE_MS && cache.payload && !filters.refresh;
  const bundle = fresh ? cache.payload : await fetchAllJobs();
  if (!fresh) cache = { at: Date.now(), payload: bundle };

  const floor = Math.max(STRONG_MIN, Number(filters.minScore || STRONG_MIN));
  const limit = Math.min(DAILY_LIMIT, Number(filters.limit || DAILY_LIMIT));
  const appliedIds = new Set(readApplied().map((job) => job.id));
  const slate = readSlate();
  const dismissed = new Set(slate.dismissed || []);

  const scored = bundle.jobs
    .map((job) => {
      const match = scoreJob(job, PROFILE, filters);
      return { ...job, match };
    })
    .filter((job) => job.match.qualified && job.match.score >= floor)
    .filter((job) => !appliedIds.has(job.id) && !dismissed.has(job.id))
    .sort((a, b) => b.match.score - a.match.score);

  const today = todayKey();
  const stillGood = (slate.ids || []).filter(
    (id) => scored.some((job) => job.id === id) && !appliedIds.has(id) && !dismissed.has(id)
  );
  if (slate.date !== today) {
    slate.date = today;
    slate.ids = scored.slice(0, limit).map((job) => job.id);
    slate.dismissed = [];
    writeSlate(slate);
  } else {
    slate.ids = stillGood;
    for (const job of scored) {
      if (slate.ids.length >= limit) break;
      if (!slate.ids.includes(job.id)) slate.ids.push(job.id);
    }
    writeSlate(slate);
  }

  const byId = new Map(scored.map((job) => [job.id, job]));
  const picked = slate.ids
    .map((id) => byId.get(id))
    .filter(Boolean)
    .sort((a, b) => b.match.score - a.match.score)
    .slice(0, limit);

  return {
    generatedAt: new Date().toISOString(),
    cached: fresh,
    sourceStatus: bundle.sourceStatus,
    count: picked.length,
    scanned: bundle.jobs.length,
    floor,
    dailyLimit: limit,
    jobs: picked,
  };
}

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);

  try {
    if (req.method === "GET" && url.pathname === "/api/profile") {
      return send(res, 200, PROFILE);
    }

    if (req.method === "PUT" && url.pathname === "/api/profile") {
      const body = await readBody(req);
      if (!body || typeof body !== "object") {
        return send(res, 400, { error: "profile is required" });
      }
      const next = { ...PROFILE, ...body };
      if (!next.name || !next.email) {
        return send(res, 400, { error: "name and email are required" });
      }
      writeProfile(next);
      return send(res, 200, PROFILE);
    }

    if (req.method === "GET" && url.pathname === "/api/applied") {
      return send(res, 200, { jobs: readApplied() });
    }

    if (req.method === "POST" && url.pathname === "/api/applied") {
      const body = await readBody(req);
      if (!body.job || !body.job.id) {
        return send(res, 400, { error: "job is required" });
      }
      const current = readApplied();
      const exists = current.some((item) => item.id === body.job.id);
      let next = current;
      if (body.applied === false) {
        next = current.filter((item) => item.id !== body.job.id);
      } else if (!exists) {
        next = [snapshotJob(body.job), ...current];
        removeFromSlate(body.job.id);
      }
      writeApplied(next);
      return send(res, 200, { jobs: next });
    }

    if (req.method === "POST" && url.pathname === "/api/jobs/dismiss") {
      const body = await readBody(req);
      if (!body.id) return send(res, 400, { error: "id is required" });
      const slate = readSlate();
      slate.ids = (slate.ids || []).filter((id) => id !== body.id);
      slate.dismissed = [...new Set([...(slate.dismissed || []), body.id])];
      writeSlate(slate);
      return send(res, 200, { ok: true, ids: slate.ids });
    }

    if (req.method === "GET" && url.pathname === "/api/jobs") {
      const data = await rankedJobs({
        refresh: url.searchParams.get("refresh") === "1",
        remoteOnly: url.searchParams.get("remoteOnly") === "1",
        minScore: url.searchParams.get("minScore"),
        limit: url.searchParams.get("limit") || 10,
      });
      return send(res, 200, data);
    }

    if (req.method === "POST" && url.pathname === "/api/generate") {
      const body = await readBody(req);
      if (!body.job || !body.job.title) {
        return send(res, 400, { error: "job is required" });
      }
      const docs = generateDocuments(PROFILE, body.job);
      docs.job = body.job;
      docs.filenames = {
        resume: fileSlug(body.job, "Resume", PROFILE),
        cover: fileSlug(body.job, "Cover-Letter", PROFILE),
      };
      return send(res, 200, docs);
    }

    if (req.method === "POST" && url.pathname === "/api/answer") {
      const body = await readBody(req);
      if (!body.job || !body.job.title) {
        return send(res, 400, { error: "Select a job first." });
      }
      if (!String(body.questions || "").trim()) {
        return send(res, 400, { error: "Paste the custom questions first." });
      }
      try {
        return send(res, 200, answerApplicationQuestions(PROFILE, body.job, body.questions));
      } catch (err) {
        return send(res, 400, { error: err.message });
      }
    }

    if (req.method === "POST" && url.pathname === "/api/manual") {
      const body = await readBody(req);
      if (!String(body.jd || "").trim()) {
        return send(res, 400, { error: "Paste the full job description." });
      }
      if (!String(body.resumeText || "").trim()) {
        return send(res, 400, { error: "Paste or upload a resume first. Manual mode does not use the saved profile." });
      }
      try {
        return send(res, 200, tailorManual(body));
      } catch (err) {
        return send(res, 400, { error: err.message, scan: err.scan || null });
      }
    }

    if (req.method === "POST" && url.pathname === "/api/manual/extract") {
      const body = await readBody(req);
      if (!body.filename || !body.data) {
        return send(res, 400, { error: "Upload a resume file." });
      }
      const ext = path.extname(String(body.filename)).toLowerCase();
      if (![".txt", ".md", ".docx", ".pdf"].includes(ext)) {
        return send(res, 400, { error: "Use TXT, MD, DOCX, or PDF." });
      }
      const tmp = path.join(os.tmpdir(), `folio-resume-${Date.now()}${ext}`);
      fs.writeFileSync(tmp, Buffer.from(body.data, "base64"));
      try {
        const extracted = await extractResume(tmp);
        return send(res, 200, { text: extracted });
      } catch (err) {
        return send(res, 400, { error: err.message || "Could not read that file." });
      } finally {
        try { fs.unlinkSync(tmp); } catch {}
      }
    }

    if (req.method === "POST" && url.pathname === "/api/download") {
      const body = await readBody(req);
      if (!body.job || !body.job.title) {
        return send(res, 400, { error: "job is required" });
      }
      const format = body.format === "pdf" ? "pdf" : "docx";
      const kind = body.kind === "cover" ? "cover" : "resume";
      const docs =
        body.mode === "manual"
          ? tailorManual({
              resumeText: body.resumeText,
              jd: body.job.description,
              title: body.job.title,
              company: body.job.company,
            })
          : generateDocuments(PROFILE, body.job);
      const text = kind === "cover" ? docs.coverText : docs.resumeText;
      const base = fileSlug(
        body.job,
        kind === "cover" ? "Cover-Letter" : "Resume",
        body.mode === "manual" ? { name: docs.scan?.name || "Resume" } : PROFILE
      );
      const filename = `${base}.${format}`;
      const outPath = path.join(os.tmpdir(), filename);
      await exportFile({ text, format, path: outPath, title: base });

      const desktop = path.join(
        os.homedir(),
        "Desktop",
        "CV Resume",
        filename
      );
      try {
        fs.mkdirSync(path.dirname(desktop), { recursive: true });
        fs.copyFileSync(outPath, desktop);
      } catch {
        // Download still works if Desktop copy fails.
      }

      const file = fs.readFileSync(outPath);
      res.writeHead(200, {
        "Content-Type":
          format === "pdf"
            ? "application/pdf"
            : "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "Content-Disposition": `attachment; filename="${filename}"`,
        "Cache-Control": "no-store",
        "X-Saved-As": filename,
      });
      return res.end(file);
    }

    let filePath = path.join(
      PUBLIC,
      url.pathname === "/" ? "index.html" : url.pathname
    );
    if (!filePath.startsWith(PUBLIC)) return send(res, 403, "Forbidden", "text/plain");
    if (!fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
      filePath = path.join(PUBLIC, "index.html");
    }
    const ext = path.extname(filePath);
    send(res, 200, fs.readFileSync(filePath), MIME[ext] || "application/octet-stream");
  } catch (err) {
    send(res, 500, { error: err.message || "Server error" });
  }
});

server.listen(PORT, () => {
  console.log(`Folio running at http://localhost:${PORT}`);
});
