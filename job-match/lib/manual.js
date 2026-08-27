import { fileSlug, inferJobFromJd } from "./generate.js";

const HEADER = {
  summary:
    /^(professional\s+summary|summary|profile|about(\s+me)?|objective|career\s+summary)$/i,
  skills:
    /^(skills|core\s+skills|technical\s+skills|key\s+skills|tools|toolkit|competenc)/i,
  experience:
    /^(professional\s+experience|work\s+experience|employment|experience|work\s+history|career(\s+history)?)$/i,
  additional:
    /^(additional(\s+experience)?|freelance|consulting|selected\s+projects|projects)$/i,
  education: /^(education|academic|qualifications)$/i,
  certifications: /^(certifications?|certificates|licenses?)$/i,
  languages: /^(languages?)$/i,
};

const DATE =
  /\b(?:(?:jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*\.?\s+)?(?:19|20)\d{2}\b/i;
const DATE_RANGE =
  /(?:19|20)\d{2}.{0,24}(?:present|current|now|(?:19|20)\d{2}|(?:jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec))/i;

function clean(text) {
  return String(text || "")
    .replace(/\r/g, "")
    .replace(/\u00a0/g, " ")
    .replace(/[•●▪◦]/g, "-")
    .replace(/[–—]/g, "-")
    .replace(/[ \t]+\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function linesOf(text) {
  return clean(text)
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
}

function classifyHeader(line) {
  const header = line.replace(/[:]+$/, "").trim();
  if (header.length > 48) return null;
  for (const [key, re] of Object.entries(HEADER)) {
    if (re.test(header)) return key;
  }
  return null;
}

function overlap(text, hay) {
  return String(text || "")
    .toLowerCase()
    .split(/[^a-z0-9+#./]+/)
    .filter((word) => word.length > 3)
    .filter((word) => hay.includes(word)).length;
}

function extractContact(full) {
  const email = (full.match(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i) || [])[0] || "";
  const phone = (full.match(/(?:\+\d{1,3}[\s.-]?)?(?:\(?\d{2,4}\)?[\s.-]?){2,4}\d{3,4}/) || [])[0] || "";
  const linkedin =
    (full.match(/https?:\/\/\S*linkedin\S+/i) ||
      full.match(/linkedin\.com\/in\/[A-Za-z0-9_-]+/i) || [])[0] || "";
  const urls = [...full.matchAll(/https?:\/\/[^\s)]+/gi)].map((m) => m[0]);
  const behance = (full.match(/behance\.net\/[A-Za-z0-9_-]+/i) || [])[0] || "";
  const portfolio =
    urls.find((url) => !/linkedin|mailto/i.test(url)) ||
    (behance ? `https://${behance}` : "");
  return { email, phone, linkedin, portfolio };
}

function normalizeFlattened(text) {
  return text
    .replace(
      /\b(PROFESSIONAL SUMMARY|CAREER SUMMARY|WORK EXPERIENCE|PROFESSIONAL EXPERIENCE|EXPERIENCE|EDUCATION|SKILLS|CERTIFICATIONS|LANGUAGES)\b/gi,
      "\n$1\n"
    )
    .replace(
      /\b((?:Senior\s+)?(?:Product|UI\/UX|UX\/UI|UX|UI)\s+Designer)\s+at\s+/gi,
      "\n$1 at "
    );
}

function guessName(text, contact) {
  const skip = /^(resume|cv|curriculum vitae|contact|phone|email|linkedin)$/i;
  const notName = /designer|product|engineer|manager|university|linkedin|resume|skills|summary/i;
  const slug = (contact.linkedin || "").match(/\/in\/([a-z0-9-]+)/i);
  if (slug) {
    return slug[1]
      .split("-")
      .filter(Boolean)
      .map((part) => part[0].toUpperCase() + part.slice(1))
      .join(" ");
  }
  for (const line of linesOf(text).slice(0, 12)) {
    if (skip.test(line) || notName.test(line)) continue;
    if (/@|linkedin|\+\d|http|behance|phone|email/i.test(line)) continue;
    if (/^[A-Z][a-z]+(?:\s+[A-Z][a-z]+){1,2}$/.test(line)) return line;
  }
  const pair = [...text.matchAll(/\b([A-Z][a-z]{2,}\s+[A-Z][a-z]{2,})\b/g)]
    .map((item) => item[1])
    .find((item) => !notName.test(item));
  return pair || "";
}

function guessHeadline(text) {
  const hit = text.match(
    /\b((?:Senior\s+)?Product Designer\s*\/\s*UI\/UX Designer|(?:Senior\s+)?(?:Product|UI\/UX|UX\/UI|UX|UI)\s+Designer)\b/i
  );
  return hit ? hit[1] : "";
}

function jobsFromProse(text) {
  const jobs = [];
  const re =
    /((?:Senior\s+)?(?:Product|UI\/UX|UX\/UI|UX|UI)\s+Designer)\s+at\s+([A-Z][A-Za-z0-9&.\s-]{1,50}?)\s*(?:\(([^)]+)\))?\s*\[([^\]]+)\]/gi;
  let match;
  while ((match = re.exec(text))) {
    const after = text.slice(match.index + match[0].length);
    const nextRole = after.search(
      /\b(?:Senior\s+)?(?:Product|UI\/UX|UX\/UI|UX|UI)\s+Designer\s+at\b|\b(?:B\.?\s*Sc\.?|Education|Skills)\b/i
    );
    const chunk = (nextRole >= 0 ? after.slice(0, nextRole) : after.slice(0, 400)).trim();
    jobs.push({
      title: match[1].trim(),
      company: match[2].trim(),
      type: match[3] || "",
      dates: match[4].trim(),
      bullets: chunk
        ? [chunk.replace(/^[\s.:-]+/, "").trim()].filter((item) => item.length > 20)
        : [],
    });
  }
  return jobs;
}

function educationFromProse(text) {
  const found = [];
  const re =
    /((?:E-business\s+)?B\.?\s*Sc\.?[^()]{8,90}?(?:University|Institute|College|Technology)[^()]{0,40})\s*\(([^)]*(?:19|20)\d{2}[^)]*)\)/gi;
  let match;
  while ((match = re.exec(text))) {
    found.push(`${match[1].replace(/\s+/g, " ").trim()} | ${match[2].trim()}`);
  }
  return [...new Set(found)];
}

function shortSummary(text) {
  const cut = text.search(
    /\b(?:Senior\s+)?(?:Product|UI\/UX|UX\/UI|UX|UI)\s+Designer\s+at\b/i
  );
  const head = (cut > 0 ? text.slice(0, cut) : text).replace(/\s+/g, " ").trim();
  const sentences = head
    .split(/(?<=\.)\s+/)
    .map((item) => item.replace(/^.*?(?=[A-Z][a-z]+ Designer|Product Designer|UI\/UX)/, "").trim())
    .filter((item) => item.length > 50 && !/@|linkedin|\+\d{8}/i.test(item));
  return sentences.slice(0, 2).join(" ");
}

function parseSkills(lines) {
  const blob = lines.join(", ");
  return blob
    .split(/[,|/•·\n]/)
    .map((item) => item.replace(/^[-]\s*/, "").trim())
    .filter((item) => item.length > 1 && item.length < 42);
}

function parseJobs(lines) {
  const jobs = [];
  let current = null;

  const push = () => {
    if (current && (current.title || current.company)) jobs.push(current);
    current = null;
  };

  for (const line of lines) {
    const bullet = /^[-*]\s+/.test(line);
    if (bullet) {
      if (!current) current = { title: "", company: "", dates: "", type: "", bullets: [] };
      current.bullets.push(line.replace(/^[-*]\s+/, "").trim());
      continue;
    }

    if (DATE_RANGE.test(line) || (DATE.test(line) && line.length < 80)) {
      if (current && (current.bullets.length || current.company || current.title)) {
        if (!current.dates) current.dates = line;
        else {
          push();
          current = { title: "", company: "", dates: line, type: "", bullets: [] };
        }
      } else {
        current = { title: "", company: "", dates: line, type: "", bullets: [] };
      }
      continue;
    }

    if (/\|/.test(line) && line.length < 100) {
      const parts = line.split("|").map((part) => part.trim());
      if (!current) current = { title: "", company: "", dates: "", type: "", bullets: [] };
      if (!current.company) current.company = parts[0];
      if (parts[1] && DATE.test(parts[1])) current.dates = parts[1];
      else if (parts[1] && !current.title) current.title = current.title || parts[1];
      if (parts[2]) current.type = parts[2];
      continue;
    }

    const looksLikeTitle =
      line.length < 80 &&
      /designer|design|manager|lead|director|researcher|writer|engineer|consultant|advisor|specialist/i.test(
        line
      );

    if (looksLikeTitle) {
      if (current && (current.bullets.length || current.title)) push();
      current = { title: line, company: current?.company || "", dates: current?.dates || "", type: "", bullets: [] };
      continue;
    }

    if (current && !current.company && line.length < 70) {
      current.company = line;
      continue;
    }

    if (current && line.length > 40) {
      current.bullets.push(line);
    }
  }
  push();
  return jobs.filter((job) => job.title || job.company || job.bullets.length);
}

function harvestSkillsFromBody(text, known = []) {
  const hay = text.toLowerCase();
  const extras = [];
  const candidates = [
    "Figma", "FigJam", "Framer", "Sketch", "Adobe XD", "Photoshop", "Illustrator",
    "Zeplin", "Miro", "Notion", "Jira", "WCAG", "Accessibility", "Design Systems",
    "User Research", "Usability Testing", "UserTesting", "Prototyping", "Wireframing",
    "Interaction Design", "UX Writing", "Cursor", "Claude", "ChatGPT",
  ];
  for (const skill of [...known, ...candidates]) {
    if (hay.includes(skill.toLowerCase()) && !extras.some((item) => item.toLowerCase() === skill.toLowerCase())) {
      extras.push(skill);
    }
  }
  return extras;
}

export function scanResume(raw) {
  const original = clean(raw);
  const text = normalizeFlattened(original);
  const warnings = [];
  if (text.length < 120) {
    return {
      ok: false,
      warnings: ["Resume text is too short to scan. Paste the full resume or upload the file."],
      contact: {},
      summary: "",
      skills: [],
      experience: [],
      additional: [],
      education: [],
      certifications: [],
      languages: [],
      name: "",
      headline: "",
      location: "",
      rawLength: text.length,
    };
  }

  const contact = extractContact(text);
  const sections = {
    summary: [],
    skills: [],
    experience: [],
    additional: [],
    education: [],
    certifications: [],
    languages: [],
    preamble: [],
  };
  let current = "preamble";
  for (const line of linesOf(text)) {
    const header = classifyHeader(line);
    if (header) {
      current = header;
      continue;
    }
    sections[current]?.push(line);
  }

  let experience = jobsFromProse(original);
  if (!experience.length) experience = parseJobs(sections.experience);
  else warnings.push("Split roles from the resume text (no Experience heading).");
  const additional = parseJobs(sections.additional);
  let education = educationFromProse(original);
  if (!education.length) education = sections.education;

  if (!sections.skills.length) {
    warnings.push("No Skills heading found. Pulled tools mentioned in the resume body.");
  }

  const summary = shortSummary(original);
  if (!summary) warnings.push("No short summary found. Left that section blank on purpose.");

  const name = guessName(text, contact);
  const headline = guessHeadline(text);
  const location =
    sections.preamble.find((line) => /cairo|egypt|london|dubai|remote/i.test(line) && line.length < 80) ||
    "";

  const skillList = parseSkills(sections.skills);
  const harvested = harvestSkillsFromBody(text, skillList);

  if (!experience.length) {
    warnings.push("Could not split experience into roles.");
  }

  return {
    ok: experience.length > 0 || skillList.length > 0 || Boolean(summary),
    warnings,
    contact,
    name,
    headline,
    location,
    summary,
    skills: harvested.length ? harvested : skillList,
    experience,
    additional,
    education,
    certifications: sections.certifications.map((line) => line.replace(/^[-*]\s*/, "")),
    languages: parseSkills(sections.languages),
    rawLength: text.length,
    roleCount: experience.length + additional.length,
    bulletCount: [...experience, ...additional].reduce((n, job) => n + job.bullets.length, 0),
  };
}

export function scanJd(raw, title = "", company = "") {
  const job = inferJobFromJd(raw, title, company);
  const text = clean(raw);
  const hay = text.toLowerCase();
  const asks = [];
  const phrases = [
    "figma", "design system", "design systems", "wcag", "accessibility",
    "user research", "usability", "prototype", "prototyping", "wireframe",
    "interaction", "handoff", "ai", "cursor", "mobile", "web", "saas",
    "stakeholder", "workshop", "localization", "design thinking",
  ];
  for (const phrase of phrases) {
    if (hay.includes(phrase)) asks.push(phrase);
  }
  return { job, asks, length: text.length };
}

export function tailorManual({ resumeText, jd, title, company }) {
  const resume = scanResume(resumeText);
  const posting = scanJd(jd, title, company);
  if (!resume.ok) {
    const error = resume.warnings[0] || "Could not scan that resume.";
    const err = new Error(error);
    err.scan = { resume, posting };
    throw err;
  }
  if (posting.length < 40) {
    const err = new Error("Paste the full job description, not just the title.");
    err.scan = { resume, posting };
    throw err;
  }

  const jdHay = `${posting.job.title} ${posting.job.company} ${posting.job.description}`.toLowerCase();
  const matched = resume.skills.filter((skill) => jdHay.includes(skill.toLowerCase()));
  const otherSkills = resume.skills.filter((skill) => !matched.includes(skill));
  const skillLine = [...matched, ...otherSkills].join(", ");

  const orderJobs = (jobs) =>
    jobs.map((job) => ({
      ...job,
      bullets: [...job.bullets].sort((a, b) => overlap(b, jdHay) - overlap(a, jdHay)),
    }));

  const experience = orderJobs(resume.experience);
  const additional = orderJobs(resume.additional);
  const name = resume.name || "RESUME";
  const headline = resume.headline;
  const loc = resume.location || "";
  const contactLine = /@|\+\d/.test(loc)
    ? loc
    : [loc, resume.contact.phone, resume.contact.email].filter(Boolean).join(" | ");
  const links = [
    resume.contact.linkedin ? `LinkedIn: ${resume.contact.linkedin.replace(/^https?:\/\//, "")}` : "",
    resume.contact.portfolio ? `Portfolio: ${resume.contact.portfolio}` : "",
  ]
    .filter(Boolean)
    .join(" | ");

  const resumeLines = [
    name.toUpperCase(),
    headline,
    contactLine,
    links,
    "",
    resume.summary ? "PROFESSIONAL SUMMARY" : "",
    resume.summary,
    "",
    skillLine ? "SKILLS" : "",
    skillLine,
    "",
    experience.length ? "PROFESSIONAL EXPERIENCE" : "",
    "",
  ].filter((line, i, arr) => line !== "" || arr[i - 1] !== "");

  for (const job of experience) {
    if (job.title) resumeLines.push(job.title);
    resumeLines.push([job.company, job.dates, job.type].filter(Boolean).join(" | "));
    for (const bullet of job.bullets) resumeLines.push(`- ${bullet}`);
    resumeLines.push("");
  }

  if (additional.length) {
    resumeLines.push("ADDITIONAL EXPERIENCE");
    for (const job of additional) {
      if (job.title) resumeLines.push(job.title);
      resumeLines.push([job.company, job.dates, job.type].filter(Boolean).join(" | "));
      for (const bullet of job.bullets) resumeLines.push(`- ${bullet}`);
      resumeLines.push("");
    }
  }

  if (resume.education.length) {
    resumeLines.push("EDUCATION");
    for (const line of resume.education) resumeLines.push(line);
    resumeLines.push("");
  }
  if (resume.certifications.length) {
    resumeLines.push("CERTIFICATIONS");
    for (const line of resume.certifications) resumeLines.push(`- ${line}`);
    resumeLines.push("");
  }
  if (resume.languages.length) {
    resumeLines.push("LANGUAGES");
    resumeLines.push(resume.languages.join(" | "));
  }

  const proof = experience.flatMap((job) => job.bullets.slice(0, 1)).slice(0, 2);
  const recent = experience
    .slice(0, 3)
    .map((job) => [job.title, job.company].filter(Boolean).join(" at "))
    .filter(Boolean)
    .join("; ");

  const coverText = [
    name,
    contactLine,
    resume.contact.portfolio || resume.contact.linkedin,
    "",
    `Re: ${posting.job.title}`,
    "",
    `I am applying for the ${posting.job.title} role at ${posting.job.company}.`,
    "",
    resume.summary,
    "",
    recent ? `Recent roles: ${recent}.` : "",
    ...proof,
    "",
    "Thank you for your time.",
    "",
    "Sincerely,",
    name,
  ]
    .filter((line, i, arr) => line !== "" || arr[i - 1] !== "")
    .join("\n");

  return {
    job: posting.job,
    resumeText: resumeLines.join("\n").replace(/\n{3,}/g, "\n\n"),
    coverText,
    matchedSkills: matched,
    summary: resume.summary,
    scan: {
      name,
      roles: resume.roleCount,
      bullets: resume.bulletCount,
      skillsFound: resume.skills.length,
      jdAsks: posting.asks,
      overlap: matched,
      warnings: resume.warnings,
    },
    filenames: {
      resume: fileSlug(posting.job, "Resume", { name }),
      cover: fileSlug(posting.job, "Cover-Letter", { name }),
    },
  };
}
