const listEl = document.getElementById("list");
const detailEl = document.getElementById("detail");
const statusEl = document.getElementById("status");
const refreshBtn = document.getElementById("refresh");
const remoteOnly = document.getElementById("remoteOnly");
const minScore = document.getElementById("minScore");

let jobs = [];
let applied = [];
let selectedId = null;
let docs = null;
let docTab = "cover";
let profile = null;
let view = "shortlist";
let manualDocs = null;
let manualJob = null;
let manualTab = "resume";
let pendingApplyJob = null;
let questionDraft = "";
let answersText = "";

async function loadProfile() {
  const res = await fetch("/api/profile");
  profile = await res.json();
  renderCopyBar();
  renderAvatar();
}

function initials(name) {
  return String(name || "F")
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join("");
}

function renderAvatar() {
  const btn = document.getElementById("profileBtn");
  if (btn && profile) btn.textContent = initials(profile.name);
  const badge = document.getElementById("appliedBadge");
  if (badge) badge.textContent = String(applied.length);
}

function isApplied(id) {
  return applied.some((job) => job.id === id);
}

async function loadApplied() {
  const res = await fetch("/api/applied");
  const data = await res.json();
  applied = data.jobs || [];
  renderAvatar();
  renderApplied();
  if (document.getElementById("drawer")?.dataset.panel === "applied") {
    renderDrawer("applied");
  }
}

async function setApplied(job, appliedState) {
  const res = await fetch("/api/applied", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ job, applied: appliedState }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Could not update applied");
  applied = data.jobs || [];
  renderAvatar();
  renderApplied();
  if (appliedState) {
    if (selectedId === job.id) {
      selectedId = null;
      docs = null;
    }
    await loadJobs(false);
  } else {
    renderList();
    renderDetail();
  }
  if (document.getElementById("drawer")?.dataset.panel === "applied") {
    renderDrawer("applied");
  }
}

async function dismissJob(job) {
  const res = await fetch("/api/jobs/dismiss", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id: job.id }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Could not remove posting");
  if (selectedId === job.id) {
    selectedId = null;
    docs = null;
  }
  await loadJobs(false);
}

function openApplyConfirm(job) {
  pendingApplyJob = job;
  const box = document.getElementById("confirm");
  const back = document.getElementById("confirmBack");
  document.getElementById("confirmMeta").textContent =
    `${job.title} · ${job.company}`;
  box.hidden = false;
  back.hidden = false;
  box.classList.add("is-open");
  back.classList.add("is-open");
}

function closeApplyConfirm() {
  pendingApplyJob = null;
  const box = document.getElementById("confirm");
  const back = document.getElementById("confirmBack");
  box.classList.remove("is-open");
  back.classList.remove("is-open");
  box.hidden = true;
  back.hidden = true;
}

function openPosting(job) {
  if (!job?.url) return;
  window.open(job.url, "_blank", "noopener,noreferrer");
}

function renderCopyBar() {
  if (!profile) return;
  const bar = document.getElementById("copybar");
  if (!bar) return;
  const items = [
    ["Name", profile.name],
    ["Email", profile.email],
    ["LinkedIn", profile.linkedin],
    ["Portfolio", profile.portfolio],
  ];
  bar.innerHTML = items
    .map(
      ([label, value]) =>
        `<button type="button" class="copy-chip" data-copy="${escapeAttr(value)}"><small>${escapeHtml(label)}</small> ${escapeHtml(value)}</button>`
    )
    .join("");
  bar.querySelectorAll(".copy-chip").forEach((btn) => {
    btn.addEventListener("click", async () => {
      await navigator.clipboard.writeText(btn.dataset.copy);
      const label = btn.querySelector("small").textContent;
      btn.querySelector("small").textContent = "Copied";
      setTimeout(() => {
        btn.querySelector("small").textContent = label;
      }, 1200);
    });
  });
}

async function loadJobs(refresh = false) {
  if (!refreshBtn) return;
  refreshBtn.disabled = true;
  statusEl.textContent = "Scanning public boards…";
  listEl.innerHTML = `<div class="card empty">Fetching and scoring roles against your profile.</div>`;
  try {
    const params = new URLSearchParams({
      remoteOnly: remoteOnly.checked ? "1" : "0",
      minScore: minScore.value,
      limit: "20",
      refresh: refresh ? "1" : "0",
    });
    const res = await fetch(`/api/jobs?${params}`);
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Could not load jobs");
    jobs = (data.jobs || []).filter((job) => !isApplied(job.id));
    const sources = Object.entries(data.sourceStatus || {})
      .map(([k, v]) => `${k}: ${v}`)
      .join(" · ");
    statusEl.innerHTML = `
      <span class="stat"><b>${jobs.length}</b> of ${data.dailyLimit || 20} matches</span>
      <span class="stat"><b>${data.scanned}</b> scanned</span>
      <span class="stat"><b>${data.floor || 72}+</b> floor</span>
      <span class="stat">${data.cached ? "Cached 15 min" : "Fresh pull"}</span>
      <span class="sources">${sources}</span>
    `;
    renderList();
    renderApplied();
    if (selectedId && jobs.some((job) => job.id === selectedId)) {
      renderDetail();
    } else if (jobs[0]) {
      selectJob(jobs[0].id);
    } else {
      selectedId = null;
      listEl.innerHTML = `<div class="card empty">No open roles on the shortlist. Applied jobs are in Pipeline below.</div>`;
      detailEl.innerHTML = `<p class="empty">Nothing selected.</p>`;
    }
  } catch (err) {
    statusEl.textContent = err.message;
    listEl.innerHTML = `<div class="card error">${err.message}</div>`;
  } finally {
    refreshBtn.disabled = false;
  }
}

function renderList() {
  if (!listEl) return;
  const openJobs = jobs.filter((job) => !isApplied(job.id));
  if (!openJobs.length) {
    listEl.innerHTML = `<div class="card empty">No open roles on the shortlist. Applied jobs are in Pipeline below.</div>`;
    return;
  }
  listEl.innerHTML = openJobs
    .map(
      (job) => `
      <button type="button" class="job ${job.id === selectedId ? "is-active" : ""}" data-id="${escapeAttr(job.id)}">
        <div class="job-top">
          <div>
            <h2>${escapeHtml(job.title)}</h2>
            <div class="meta">${escapeHtml(job.company)} · ${escapeHtml(job.location)} · ${escapeHtml(job.source)}</div>
          </div>
          <div class="score">
            <b>${job.match?.score ?? "—"}</b>
            <span>${escapeHtml(job.match?.band || "")}</span>
          </div>
        </div>
        <div class="pills">
          ${job.match?.remote ? `<span class="pill good">Remote-friendly</span>` : ""}
          ${(job.match?.skillHits || []).slice(0, 4).map((s) => `<span class="pill">${escapeHtml(s)}</span>`).join("")}
        </div>
      </button>`
    )
    .join("");

  listEl.querySelectorAll(".job").forEach((btn) => {
    btn.addEventListener("click", () => selectJob(btn.dataset.id));
  });
}

function renderApplied() {
  const mount = document.getElementById("appliedList");
  const count = document.getElementById("appliedCount");
  if (!mount || !count) return;
  count.textContent = `${applied.length} saved`;
  if (!applied.length) {
    mount.innerHTML = `<div class="card empty">Generate a resume, then click Done applying when you have submitted.</div>`;
    return;
  }
  mount.innerHTML = applied
    .map(
      (job) => `
      <div class="job is-applied">
        <div class="job-top">
          <div>
            <h2>${escapeHtml(job.title)}</h2>
            <div class="meta">${escapeHtml(job.company)} · ${escapeHtml(job.location || "")}</div>
            <div class="meta">Applied ${escapeHtml((job.appliedAt || "").slice(0, 10))}</div>
          </div>
        </div>
        <div class="actions">
          ${job.url ? `<button type="button" class="btn-link" data-open-url="${escapeAttr(job.url)}">Open posting</button>` : ""}
          <button type="button" class="btn-danger-ghost" data-remove-applied="${escapeAttr(job.id)}">Remove</button>
        </div>
      </div>`
    )
    .join("");
  mount.querySelectorAll("[data-open-url]").forEach((btn) => {
    btn.addEventListener("click", () => window.open(btn.dataset.openUrl, "_blank", "noopener,noreferrer"));
  });
  mount.querySelectorAll("[data-remove-applied]").forEach((btn) => {
    btn.addEventListener("click", async () => {
      const job = applied.find((item) => item.id === btn.dataset.removeApplied);
      if (!job) return;
      try {
        await setApplied(job, false);
      } catch (err) {
        alert(err.message);
      }
    });
  });
}

function selectApplied(id) {
  const saved = applied.find((job) => job.id === id);
  if (!saved) return;
  setView("shortlist");
  openDrawer("applied");
}

function selectJob(id) {
  selectedId = id;
  docs = null;
  docTab = "cover";
  renderList();
  renderDetail();
}

function currentJob() {
  return jobs.find((j) => j.id === selectedId && !isApplied(j.id));
}

function renderDetail() {
  const job = currentJob();
  const questionsCard = document.getElementById("questionsCard");
  if (!job || !detailEl) {
    if (detailEl) {
      detailEl.innerHTML = `<p class="eyebrow">Selected role</p><p class="empty">Choose a match to see why it ranked, then generate a tailored resume and cover letter.</p>`;
    }
    if (questionsCard) questionsCard.hidden = true;
    return;
  }
  if (questionsCard) questionsCard.hidden = false;
  detailEl.innerHTML = `
    <p class="eyebrow">${escapeHtml(job.match?.band || "Role")} · ${job.match?.score ?? "—"}/100</p>
    <h2>${escapeHtml(job.title)}</h2>
    <p class="meta">${escapeHtml(job.company)} · ${escapeHtml(job.location)} · ${escapeHtml(job.source)}</p>
    <div class="actions">
      ${job.url ? `<button type="button" class="btn-link" id="openPosting">Open posting</button>` : ""}
      <button type="button" class="btn-primary" id="gen">Generate resume + letter</button>
      ${docs ? `<button type="button" class="btn-primary" id="doneApplying">Done applying</button>` : ""}
      <button type="button" class="btn-danger-ghost" id="dismissJob">Remove posting</button>
    </div>
    <p class="meta">Why it ranked</p>
    <ul class="reasons">${(job.match?.reasons || []).map((r) => `<li>${escapeHtml(r)}</li>`).join("")}</ul>
    <p class="meta" style="margin-top:16px">Job description</p>
    <div class="jd">${escapeHtml((job.description || "No description returned by this board.").slice(0, 2500))}</div>
    <div id="docs"></div>
  `;
  document.getElementById("gen").addEventListener("click", generate);
  document.getElementById("openPosting")?.addEventListener("click", () => openPosting(job));
  document.getElementById("doneApplying")?.addEventListener("click", () => openApplyConfirm(job));
  document.getElementById("dismissJob").addEventListener("click", async () => {
    if (!confirm(`Remove ${job.title} at ${job.company} from today’s shortlist?`)) return;
    try {
      await dismissJob(job);
    } catch (err) {
      alert(err.message);
    }
  });
  if (docs) renderDocs("docs", docs, job, "shortlist");
  syncQuestionsUi();
}

function syncQuestionsUi() {
  const input = document.getElementById("questionsInput");
  const out = document.getElementById("answersOut");
  if (!input || !out) return;
  if (document.activeElement !== input) input.value = questionDraft;
  if (!answersText) {
    out.innerHTML = "";
    return;
  }
  out.innerHTML = `
    <div class="answers-box">
      <p class="meta">Model answers</p>
      <textarea readonly id="answersText">${escapeHtml(answersText)}</textarea>
      <div class="actions">
        <button type="button" class="btn-primary" id="copyAnswers">Copy answers</button>
      </div>
    </div>
  `;
  document.getElementById("copyAnswers").addEventListener("click", async (e) => {
    await navigator.clipboard.writeText(answersText);
    e.target.textContent = "Copied";
  });
}

async function answerQuestions() {
  const job = currentJob();
  const input = document.getElementById("questionsInput");
  const btn = document.getElementById("answerBtn");
  if (!job) {
    alert("Select a role first.");
    return;
  }
  questionDraft = input.value;
  if (!questionDraft.trim()) {
    alert("Paste the custom questions first.");
    return;
  }
  btn.disabled = true;
  btn.textContent = "Answering…";
  try {
    const res = await fetch("/api/answer", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ job, questions: questionDraft }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Could not answer");
    answersText = data.text || "";
    syncQuestionsUi();
  } catch (err) {
    alert(err.message);
  } finally {
    btn.disabled = false;
    btn.textContent = "Answer";
  }
}

async function generate() {
  const job = currentJob();
  const btn = document.getElementById("gen");
  btn.disabled = true;
  btn.textContent = "Writing…";
  try {
    const res = await fetch("/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ job }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Generate failed");
    docs = data;
    renderDetail();
  } catch (err) {
    alert(err.message);
  } finally {
    const genBtn = document.getElementById("gen");
    if (genBtn) {
      genBtn.disabled = false;
      genBtn.textContent = "Generate resume + letter";
    }
  }
}

function renderDocs(mountId, pack, job, mode) {
  const mount = document.getElementById(mountId);
  if (!mount || !pack) return;
  const active = mode === "manual" ? manualTab : docTab;
  mount.innerHTML = `
    <div class="docs">
      <div class="tabs">
        <button type="button" class="${active === "cover" ? "btn-primary" : "btn-ghost"}" data-tab="cover">Cover letter</button>
        <button type="button" class="${active === "resume" ? "btn-primary" : "btn-ghost"}" data-tab="resume">Tailored resume</button>
      </div>
      <textarea readonly id="${mountId}-text">${escapeHtml(active === "cover" ? pack.coverText : pack.resumeText)}</textarea>
      <div class="actions">
        <button type="button" class="btn-primary" data-copy>Copy text</button>
        <button type="button" class="btn-ghost" data-dl="docx">Download DOCX</button>
        <button type="button" class="btn-ghost" data-dl="pdf">Download PDF</button>
        <button type="button" class="btn-ghost" data-dl-all="docx">Both as DOCX</button>
        <button type="button" class="btn-ghost" data-dl-all="pdf">Both as PDF</button>
      </div>
      <p class="meta">ATS plain-text layout. A copy also lands in Desktop / CV Resume.</p>
      <p class="meta">Matched JD skills: ${(pack.matchedSkills || []).slice(0, 10).map(escapeHtml).join(", ") || "general product design language"}</p>
    </div>
  `;
  mount.querySelectorAll("[data-tab]").forEach((btn) => {
    btn.addEventListener("click", () => {
      if (mode === "manual") manualTab = btn.dataset.tab;
      else docTab = btn.dataset.tab;
      renderDocs(mountId, pack, job, mode);
    });
  });
  mount.querySelector("[data-copy]").addEventListener("click", async (e) => {
    const text = active === "cover" ? pack.coverText : pack.resumeText;
    await navigator.clipboard.writeText(text);
    e.target.textContent = "Copied";
  });
  mount.querySelectorAll("[data-dl]").forEach((btn) => {
    btn.addEventListener("click", () =>
      downloadFile(job, active === "cover" ? "cover" : "resume", btn.dataset.dl, btn, pack)
    );
  });
  mount.querySelectorAll("[data-dl-all]").forEach((btn) => {
    btn.addEventListener("click", async () => {
      await downloadFile(job, "resume", btn.dataset.dlAll, btn, pack);
      await downloadFile(job, "cover", btn.dataset.dlAll, btn, pack);
    });
  });
}

async function downloadFile(job, kind, format, btn, pack) {
  const original = btn.textContent;
  btn.disabled = true;
  btn.textContent = "Saving…";
  try {
    const res = await fetch("/api/download", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        job,
        kind,
        format,
        resumeText: pack === manualDocs ? document.getElementById("manualResume")?.value : "",
        mode: pack === manualDocs ? "manual" : "profile",
      }),
    });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      throw new Error(data.error || "Download failed");
    }
    const blob = await res.blob();
    const name =
      res.headers.get("X-Saved-As") ||
      `${slugify(job.company)}-${slugify(job.title)}-${kind}.${format}`;
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = name;
    a.click();
    btn.textContent = "Saved";
    setTimeout(() => {
      btn.textContent = original;
      btn.disabled = false;
    }, 1200);
  } catch (err) {
    alert(err.message);
    btn.textContent = original;
    btn.disabled = false;
  }
}

async function uploadManualResume(file) {
  const status = document.getElementById("manualFileStatus");
  if (!file) return;
  status.textContent = `Reading ${file.name}…`;
  try {
    let text = "";
    if (/\.(txt|md)$/i.test(file.name)) {
      text = await file.text();
    } else {
      const data = await fileToBase64(file);
      const res = await fetch("/api/manual/extract", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ filename: file.name, data }),
      });
      const payload = await res.json();
      if (!res.ok) throw new Error(payload.error || "Could not read file");
      text = payload.text;
    }
    if (!text.trim()) throw new Error("That file had no readable text.");
    document.getElementById("manualResume").value = text;
    status.textContent = `Loaded ${file.name} · ${text.split(/\s+/).length} words. Review it, then scan.`;
  } catch (err) {
    status.textContent = err.message;
    alert(err.message);
  }
}

function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("Could not read file"));
    reader.onload = () => {
      const value = String(reader.result || "");
      resolve(value.includes(",") ? value.split(",")[1] : value);
    };
    reader.readAsDataURL(file);
  });
}

async function generateManual() {
  const btn = document.getElementById("manualGen");
  const jd = document.getElementById("manualJd").value.trim();
  const resumeText = document.getElementById("manualResume").value.trim();
  if (!jd) {
    alert("Paste the full job description first.");
    return;
  }
  if (!resumeText) {
    alert("Paste or upload a resume. Manual mode will not use the saved profile.");
    return;
  }
  btn.disabled = true;
  btn.textContent = "Scanning…";
  try {
    const res = await fetch("/api/manual", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: document.getElementById("manualTitle").value,
        company: document.getElementById("manualCompany").value,
        jd,
        resumeText,
      }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Scan failed");
    manualDocs = data;
    manualJob = data.job;
    manualTab = "resume";
    const scan = data.scan || {};
    const out = document.getElementById("manualOut");
    out.innerHTML = `
      <p class="eyebrow">Scanned</p>
      <h2>${escapeHtml(manualJob.title)}</h2>
      <p class="meta">${escapeHtml(manualJob.company)} · ${scan.roles || 0} roles · ${scan.bullets || 0} bullets · ${scan.skillsFound || 0} skills</p>
      <div class="pills">
        ${(scan.overlap || []).slice(0, 8).map((s) => `<span class="pill good">${escapeHtml(s)}</span>`).join("")}
      </div>
      ${
        (scan.warnings || []).length
          ? `<ul class="reasons">${scan.warnings.map((w) => `<li>${escapeHtml(w)}</li>`).join("")}</ul>`
          : ""
      }
      <div class="actions">
        <button type="button" class="btn-primary" id="manualMarkApplied">Mark as applied</button>
      </div>
      <div id="manualDocs"></div>
    `;
    document.getElementById("manualMarkApplied").addEventListener("click", async () => {
      try {
        await setApplied(manualJob, true);
        document.getElementById("manualMarkApplied").textContent = "Saved to Applied";
      } catch (err) {
        alert(err.message);
      }
    });
    renderDocs("manualDocs", manualDocs, manualJob, "manual");
  } catch (err) {
    alert(err.message);
  } finally {
    btn.disabled = false;
    btn.textContent = "Scan and tailor";
  }
}

function setView(next) {
  view = next;
  document.getElementById("view-shortlist").hidden = next !== "shortlist";
  document.getElementById("view-manual").hidden = next !== "manual";
  document.querySelectorAll(".app-tabs [data-view]").forEach((btn) => {
    const on = btn.dataset.view === next;
    btn.classList.toggle("is-on", on);
    btn.setAttribute("aria-selected", on ? "true" : "false");
  });
}

function closeMenu() {
  const menu = document.getElementById("profileMenu");
  menu.classList.remove("is-open");
  menu.hidden = true;
  document.getElementById("profileBtn").setAttribute("aria-expanded", "false");
}

function toggleMenu() {
  const menu = document.getElementById("profileMenu");
  const open = !menu.classList.contains("is-open");
  menu.classList.toggle("is-open", open);
  menu.hidden = !open;
  document.getElementById("profileBtn").setAttribute("aria-expanded", open ? "true" : "false");
}

function openDrawer(panel) {
  closeMenu();
  const drawer = document.getElementById("drawer");
  const back = document.getElementById("drawerBack");
  drawer.hidden = false;
  back.hidden = false;
  drawer.classList.add("is-open");
  back.classList.add("is-open");
  drawer.dataset.panel = panel;
  renderDrawer(panel);
}

function closeDrawer() {
  const drawer = document.getElementById("drawer");
  const back = document.getElementById("drawerBack");
  drawer.classList.remove("is-open");
  back.classList.remove("is-open");
  drawer.hidden = true;
  back.hidden = true;
}

function field(label, id, value, type = "text") {
  if (type === "textarea") {
    return `<label class="field tight"><span>${label}</span><textarea id="${id}">${escapeHtml(value || "")}</textarea></label>`;
  }
  return `<label class="field"><span>${label}</span><input id="${id}" type="${type}" value="${escapeAttr(value || "")}" /></label>`;
}

function experienceFields(prefix, item, index) {
  return `
    <div class="exp-card" data-exp="${prefix}-${index}">
      ${field("Title", `${prefix}-title-${index}`, item.title)}
      ${field("Company", `${prefix}-company-${index}`, item.company)}
      ${field("Dates", `${prefix}-dates-${index}`, item.dates)}
      ${field("Type", `${prefix}-type-${index}`, item.type)}
      ${field("Bullets (one per line)", `${prefix}-bullets-${index}`, (item.bullets || []).join("\n"), "textarea")}
    </div>`;
}

function collectExperience(prefix) {
  return [...document.querySelectorAll(`[data-exp^="${prefix}-"]`)].map((card, index) => ({
    title: document.getElementById(`${prefix}-title-${index}`)?.value.trim() || "",
    company: document.getElementById(`${prefix}-company-${index}`)?.value.trim() || "",
    dates: document.getElementById(`${prefix}-dates-${index}`)?.value.trim() || "",
    type: document.getElementById(`${prefix}-type-${index}`)?.value.trim() || "Full-time",
    bullets: (document.getElementById(`${prefix}-bullets-${index}`)?.value || "")
      .split("\n")
      .map((line) => line.replace(/^[-*•]\s*/, "").trim())
      .filter(Boolean),
  })).filter((item) => item.title && item.company);
}

function renderDrawer(panel) {
  const titles = {
    details: ["Account", "Personal details"],
    skills: ["Craft", "Skills & experience"],
    applied: ["Pipeline", "Applied jobs"],
  };
  document.getElementById("drawerEyebrow").textContent = titles[panel][0];
  document.getElementById("drawerTitle").textContent = titles[panel][1];
  const body = document.getElementById("drawerBody");
  if (panel === "details") {
    body.innerHTML = `
      ${field("Name", "p-name", profile.name)}
      ${field("Headline", "p-headline", profile.headline)}
      ${field("Email", "p-email", profile.email, "email")}
      ${field("Phone", "p-phone", profile.phone)}
      ${field("Location", "p-location", profile.location)}
      ${field("LinkedIn", "p-linkedin", profile.linkedin)}
      ${field("Portfolio", "p-portfolio", profile.portfolio)}
      ${field("Years of experience", "p-years", profile.yearsExperience, "number")}
      ${field("Languages (comma separated)", "p-languages", (profile.languages || []).join(", "))}
      ${field("Summary", "p-summary", profile.summary, "textarea")}
      <div class="actions"><button type="button" class="btn-primary" id="saveDetails">Save details</button></div>
    `;
    document.getElementById("saveDetails").addEventListener("click", saveDetails);
    return;
  }
  if (panel === "skills") {
    body.innerHTML = `
      ${field("Skills (comma or new line)", "p-skills", (profile.skills || []).join(", "), "textarea")}
      <p class="meta">Experience</p>
      <div id="expList">${(profile.experience || []).map((item, i) => experienceFields("exp", item, i)).join("")}</div>
      <button type="button" class="btn-ghost" id="addExp">Add role</button>
      <p class="meta" style="margin-top:20px">Additional / freelance</p>
      <div id="addList">${(profile.additional || []).map((item, i) => experienceFields("add", item, i)).join("")}</div>
      <button type="button" class="btn-ghost" id="addAdd">Add additional role</button>
      <div class="actions" style="margin-top:16px"><button type="button" class="btn-primary" id="saveSkills">Save skills &amp; experience</button></div>
    `;
    document.getElementById("addExp").addEventListener("click", () => {
      profile.experience = [
        ...(profile.experience || []),
        { title: "", company: "", dates: "", type: "Full-time", bullets: [] },
      ];
      renderDrawer("skills");
    });
    document.getElementById("addAdd").addEventListener("click", () => {
      profile.additional = [
        ...(profile.additional || []),
        { title: "", company: "", dates: "", type: "Freelance", bullets: [] },
      ];
      renderDrawer("skills");
    });
    document.getElementById("saveSkills").addEventListener("click", saveSkills);
    return;
  }
  if (!applied.length) {
    body.innerHTML = `<p class="empty">No applied roles yet. Mark a shortlist job or a manual JD as applied and it will land here.</p>`;
    return;
  }
  body.innerHTML = applied
    .map(
      (job) => `
      <div class="applied-row">
        <strong>${escapeHtml(job.title)}</strong>
        <div class="meta">${escapeHtml(job.company)} · ${escapeHtml(job.location || "")}</div>
        <div class="meta">Applied ${escapeHtml((job.appliedAt || "").slice(0, 10))} · ${escapeHtml(job.source || "")}</div>
        <div class="actions">
          ${job.url ? `<button type="button" class="btn-link" data-open-url="${escapeAttr(job.url)}">Open posting</button>` : ""}
          <button type="button" class="btn-danger-ghost" data-unmark="${escapeAttr(job.id)}">Remove</button>
        </div>
      </div>`
    )
    .join("");
  body.querySelectorAll("[data-open-url]").forEach((btn) => {
    btn.addEventListener("click", () => window.open(btn.dataset.openUrl, "_blank", "noopener,noreferrer"));
  });
  body.querySelectorAll("[data-unmark]").forEach((btn) => {
    btn.addEventListener("click", async () => {
      const job = applied.find((item) => item.id === btn.dataset.unmark);
      if (job) await setApplied(job, false);
    });
  });
}

async function saveDetails() {
  await saveProfile({
    name: document.getElementById("p-name").value.trim(),
    headline: document.getElementById("p-headline").value.trim(),
    email: document.getElementById("p-email").value.trim(),
    phone: document.getElementById("p-phone").value.trim(),
    location: document.getElementById("p-location").value.trim(),
    linkedin: document.getElementById("p-linkedin").value.trim(),
    portfolio: document.getElementById("p-portfolio").value.trim(),
    yearsExperience: Number(document.getElementById("p-years").value) || profile.yearsExperience,
    languages: document.getElementById("p-languages").value.split(",").map((s) => s.trim()).filter(Boolean),
    summary: document.getElementById("p-summary").value.trim(),
  });
}

async function saveSkills() {
  await saveProfile({
    skills: document.getElementById("p-skills").value.split(/[\n,]/).map((s) => s.trim()).filter(Boolean),
    experience: collectExperience("exp"),
    additional: collectExperience("add"),
  });
}

async function saveProfile(patch) {
  const res = await fetch("/api/profile", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(patch),
  });
  const data = await res.json();
  if (!res.ok) {
    alert(data.error || "Could not save profile");
    return;
  }
  profile = data;
  renderCopyBar();
  renderAvatar();
  alert("Saved on this machine.");
}

function escapeHtml(value) {
  return String(value || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
function escapeAttr(value) {
  return escapeHtml(value).replace(/'/g, "&#39;");
}
function slugify(value) {
  return String(value || "job")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 60);
}

document.querySelectorAll(".app-tabs [data-view]").forEach((btn) => {
  btn.addEventListener("click", () => setView(btn.dataset.view));
});
document.getElementById("profileBtn").addEventListener("click", (e) => {
  e.stopPropagation();
  toggleMenu();
});
document.getElementById("profileMenu").addEventListener("click", (e) => {
  const btn = e.target.closest("[data-panel]");
  if (btn) openDrawer(btn.dataset.panel);
});
document.getElementById("drawerClose").addEventListener("click", closeDrawer);
document.getElementById("drawerBack").addEventListener("click", closeDrawer);
document.getElementById("confirmYes").addEventListener("click", async () => {
  const job = pendingApplyJob;
  closeApplyConfirm();
  if (!job) return;
  try {
    await setApplied(job, true);
  } catch (err) {
    alert(err.message);
  }
});
document.getElementById("confirmNo").addEventListener("click", closeApplyConfirm);
document.getElementById("confirmBack").addEventListener("click", closeApplyConfirm);
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    closeDrawer();
    closeApplyConfirm();
    closeMenu();
  }
});
document.addEventListener("click", (e) => {
  if (!e.target.closest(".profile-wrap")) closeMenu();
});
document.getElementById("manualGen").addEventListener("click", generateManual);
document.getElementById("manualClear").addEventListener("click", () => {
  document.getElementById("manualTitle").value = "";
  document.getElementById("manualCompany").value = "";
  document.getElementById("manualJd").value = "";
  document.getElementById("manualResume").value = "";
  document.getElementById("manualFileStatus").textContent = "";
  document.getElementById("manualOut").innerHTML =
    `<p class="eyebrow">Output</p><p class="empty">Paste a JD and generate. You will get a tailored resume and cover letter you can copy or download.</p>`;
  manualDocs = null;
  manualJob = null;
});
document.getElementById("manualUpload").addEventListener("click", () => {
  document.getElementById("manualFile").click();
});
document.getElementById("manualFile").addEventListener("change", (e) => {
  uploadManualResume(e.target.files?.[0]);
  e.target.value = "";
});
document.getElementById("answerBtn").addEventListener("click", answerQuestions);
document.getElementById("questionsInput").addEventListener("input", (e) => {
  questionDraft = e.target.value;
});
refreshBtn.addEventListener("click", () => loadJobs(true));
loadProfile()
  .then(() => loadApplied())
  .then(() => loadJobs(false));
