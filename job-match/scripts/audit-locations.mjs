import { fetchAllJobs } from "../lib/fetch-jobs.js";
import { scoreJob, STRONG_MIN, classifyLocation } from "../lib/score.js";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const profile = JSON.parse(
  fs.readFileSync(path.join(path.dirname(fileURLToPath(import.meta.url)), "../data/profile.json"), "utf8")
);

const { jobs } = await fetchAllJobs();
const passed = [];
const product = [];
for (const job of jobs) {
  const t = String(job.title || "").toLowerCase();
  const isPd = /product designer|ux designer|ui\/ux|ui ux|experience designer/.test(t);
  const geo = classifyLocation(job.location, `${job.title} ${job.location} ${job.description}`.toLowerCase());
  const match = scoreJob(job, profile);
  if (isPd) {
    product.push({
      title: job.title,
      company: job.company,
      location: job.location,
      geo: geo.ok ? "ALLOW" : geo.reason,
      score: match.score,
      qualified: match.qualified,
    });
  }
  if (match.qualified && match.score >= STRONG_MIN) {
    passed.push({
      score: match.score,
      location: job.location,
      title: job.title,
      company: job.company,
      reasons: match.reasons,
      desc: String(job.description || "").slice(0, 280).replace(/\s+/g, " "),
    });
  }
}

console.log("scanned", jobs.length);
console.log("passed", passed.length);
for (const job of passed) {
  console.log("\nPASS", job.score, "|", job.location, "|", job.company, "-", job.title);
  console.log(" ", job.reasons.join(" · "));
  console.log(" ", job.desc);
}
console.log("\n--- all product-title geo decisions ---");
for (const job of product) {
  console.log(job.qualified ? "IN " : "out", job.score, "|", job.geo, "|", job.location, "|", job.company);
}
