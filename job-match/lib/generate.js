function orderBullets(jobText, bullets) {
  const hay = String(jobText || "").toLowerCase();
  return [...(bullets || [])].sort((a, b) => overlap(b, hay) - overlap(a, hay));
}

function overlap(text, hay) {
  return String(text || "")
    .toLowerCase()
    .split(/[^a-z0-9]+/)
    .filter((word) => word.length > 4)
    .filter((word) => hay.includes(word)).length;
}

function keywordBridge(jobText, profile) {
  const hay = jobText.toLowerCase();
  return profile.skills.filter((s) => hay.includes(s.toLowerCase()));
}

export function fileSlug(job, kind, profile = {}) {
  const name = String(profile.name || "Resume")
    .replace(/[^\w\s-]+/g, "")
    .trim()
    .replace(/\s+/g, "-");
  const company = String(job.company || "Company")
    .replace(/[^\w\s-]+/g, "")
    .trim()
    .replace(/\s+/g, "-");
  const title = String(job.title || "Role")
    .replace(/[^\w\s-]+/g, "")
    .trim()
    .replace(/\s+/g, "-");
  return `${name}_${kind}_${company}_${title}`.slice(0, 120);
}

export function inferJobFromJd(jd, title = "", company = "") {
  const lines = String(jd || "")
    .split(/\n/)
    .map((line) => line.trim())
    .filter(Boolean);
  let nextTitle = title.trim();
  let nextCompany = company.trim();
  if (!nextTitle && lines[0] && lines[0].length < 90) nextTitle = lines[0];
  if (!nextCompany) {
    const labeled = lines.find((line) => /^(company|employer)\s*[:]/i.test(line));
    const at = String(jd).match(/\b(?:at|@)\s+([A-Z][\w&.'\s-]{1,50})/);
    if (labeled) nextCompany = labeled.split(/[:]/).slice(1).join(":").trim();
    else if (at) nextCompany = at[1].trim();
    else if (lines[1] && lines[1].length < 50 && !/the|and|with|you/i.test(lines[1])) {
      nextCompany = lines[1];
    }
  }
  return {
    id: `manual-${Date.now()}`,
    title: nextTitle || "Pasted role",
    company: nextCompany || "Company",
    location: "Pasted JD",
    source: "Manual",
    description: String(jd || "").slice(0, 8000),
    url: "",
  };
}

function parseJobBlocks(lines) {
  const jobs = [];
  let current = null;
  for (const raw of lines) {
    const line = raw.trim();
    if (!line) continue;
    const isBullet = /^[-*•–]/.test(line);
    if (isBullet && current) {
      current.bullets.push(line.replace(/^[-*•–]\s*/, ""));
      continue;
    }
    if (current && /\|/.test(line) && !current.company) {
      const parts = line.split("|").map((part) => part.trim());
      current.company = parts[0] || current.company;
      current.dates = parts[1] || current.dates;
      current.type = parts[2] || current.type;
      continue;
    }
    if (current && (current.bullets.length || current.company)) {
      jobs.push(current);
      current = null;
    }
    if (!current) {
      current = { title: line, company: "", dates: "", type: "Full-time", bullets: [] };
    } else if (!current.company) {
      current.company = line;
    }
  }
  if (current) jobs.push(current);
  return jobs.filter((item) => item.title);
}

export function parseResumeText(text) {
  const lines = String(text || "").split(/\r?\n/);
  const full = lines.join("\n");
  const sections = {
    summary: [],
    skills: [],
    experience: [],
    additional: [],
    education: [],
    certifications: [],
    languages: [],
  };
  let current = "preamble";
  const preamble = [];
  for (const raw of lines) {
    const line = raw.trim();
    if (!line) continue;
    const header = line.replace(/[:]+$/, "");
    if (/^(professional summary|summary|profile)$/i.test(header)) {
      current = "summary";
      continue;
    }
    if (/^(skills|core skills|technical skills)$/i.test(header)) {
      current = "skills";
      continue;
    }
    if (/^additional/i.test(header)) {
      current = "additional";
      continue;
    }
    if (/^(professional experience|work experience|experience)$/i.test(header)) {
      current = "experience";
      continue;
    }
    if (/^education/i.test(header)) {
      current = "education";
      continue;
    }
    if (/^certif/i.test(header)) {
      current = "certifications";
      continue;
    }
    if (/^languages$/i.test(header)) {
      current = "languages";
      continue;
    }
    if (current === "preamble") preamble.push(line);
    else if (sections[current]) sections[current].push(line);
  }

  const skills = sections.skills
    .join(", ")
    .split(/[,|•·]/)
    .map((item) => item.trim())
    .filter((item) => item.length > 1 && item.length < 48);

  return {
    name: preamble[0] && preamble[0].length < 60 ? preamble[0] : "",
    headline: preamble[1] && preamble[1].length < 80 ? preamble[1] : "",
    email: (full.match(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i) || [])[0] || "",
    phone: (full.match(/(\+?\d[\d\s().-]{8,}\d)/) || [])[0] || "",
    linkedin:
      (full.match(/https?:\/\/\S*linkedin\S+/i) ||
        full.match(/linkedin\.com\/in\/\S+/i) || [])[0] || "",
    portfolio: (full.match(/https?:\/\/(?![^\s]*linkedin)\S+/i) || [])[0] || "",
    summary: sections.summary.join(" "),
    skills,
    experience: parseJobBlocks(sections.experience),
    additional: parseJobBlocks(sections.additional),
    education: sections.education.map((line, i) =>
      i % 2 === 0
        ? { title: line, school: sections.education[i + 1] || "", dates: "" }
        : null
    ).filter(Boolean),
    certifications: sections.certifications.map((line) => line.replace(/^[-*•]\s*/, "")),
    languages: sections.languages
      .join(" | ")
      .split(/[|,]/)
      .map((item) => item.trim())
      .filter(Boolean),
  };
}

export function mergeProfileWithResume(profile, resumeText) {
  if (!resumeText || !String(resumeText).trim()) return profile;
  const parsed = parseResumeText(resumeText);
  const overlay = { ...profile };
  for (const key of ["name", "headline", "email", "phone", "linkedin", "portfolio", "summary"]) {
    if (parsed[key]) overlay[key] = parsed[key];
  }
  if (parsed.skills.length) overlay.skills = parsed.skills;
  if (parsed.experience.length) overlay.experience = parsed.experience;
  if (parsed.additional.length) overlay.additional = parsed.additional;
  if (parsed.education.length) overlay.education = parsed.education;
  if (parsed.certifications.length) overlay.certifications = parsed.certifications;
  if (parsed.languages.length) overlay.languages = parsed.languages;
  return overlay;
}

function orderSkills(jobText, skills) {
  const hay = String(jobText || "").toLowerCase();
  const matched = [];
  const rest = [];
  for (const skill of skills || []) {
    if (hay.includes(String(skill).toLowerCase())) matched.push(skill);
    else rest.push(skill);
  }
  return { matched, line: [...matched, ...rest].join(", ") };
}

export function generateDocuments(profile, job, options = {}) {
  profile = mergeProfileWithResume(profile, options.resumeText);
  const jd = `${job.title} ${job.company} ${job.description || ""}`;
  const { matched, line: skillLine } = orderSkills(jd, profile.skills);
  const summary = String(profile.summary || "").trim();

  const resumeLines = [
    profile.name.toUpperCase(),
    profile.headline,
    `${profile.location} | ${profile.phone} | ${profile.email}`,
    `LinkedIn: ${String(profile.linkedin || "").replace("https://", "")} | Portfolio: ${profile.portfolio}`,
    "",
    "PROFESSIONAL SUMMARY",
    summary,
    "",
    "SKILLS",
    skillLine,
    "",
    "PROFESSIONAL EXPERIENCE",
    "",
  ];

  for (const jobExp of profile.experience || []) {
    resumeLines.push(jobExp.title);
    resumeLines.push(`${jobExp.company} | ${jobExp.dates} | ${jobExp.type}`);
    for (const bullet of orderBullets(jd, jobExp.bullets)) {
      resumeLines.push(`- ${bullet}`);
    }
    resumeLines.push("");
  }

  if ((profile.additional || []).length) {
    resumeLines.push("ADDITIONAL EXPERIENCE");
    for (const jobExp of profile.additional) {
      resumeLines.push(jobExp.title);
      resumeLines.push(`${jobExp.company} | ${jobExp.dates} | ${jobExp.type}`);
      for (const bullet of orderBullets(jd, jobExp.bullets)) {
        resumeLines.push(`- ${bullet}`);
      }
      resumeLines.push("");
    }
  }

  resumeLines.push("EDUCATION");
  for (const ed of profile.education || []) {
    resumeLines.push(ed.title);
    resumeLines.push(`${ed.school} | ${ed.dates}`);
    resumeLines.push("");
  }

  resumeLines.push("CERTIFICATIONS");
  for (const cert of profile.certifications || []) {
    resumeLines.push(`- ${cert}`);
  }
  resumeLines.push("", "LANGUAGES", (profile.languages || []).join(" | "));
  resumeLines.push("", "PORTFOLIO", profile.portfolio);

  return {
    resumeText: resumeLines.join("\n"),
    coverText: buildCover(profile, job, jd),
    matchedSkills: matched,
    summary,
  };
}

function buildCover(profile, job, jd) {
  const title = job.title || "the open role";
  const company = job.company || "your team";
  const recent = (profile.experience || [])
    .slice(0, 3)
    .map((item) => `${item.title} at ${item.company}`)
    .filter((item) => !item.includes("undefined"))
    .join("; ");
  const proof = (profile.experience || [])
    .flatMap((item) => orderBullets(jd, item.bullets).slice(0, 1))
    .slice(0, 2);

  return [
    profile.name,
    `${profile.location} | ${profile.phone} | ${profile.email}`,
    profile.portfolio,
    "",
    `Re: ${title}`,
    "",
    `I am applying for the ${title} role at ${company}.`,
    "",
    String(profile.summary || "").trim(),
    "",
    recent ? `Recent roles: ${recent}.` : "",
    ...proof.map((bullet) => bullet),
    "",
    `Portfolio: ${String(profile.portfolio || "").replace("https://", "")}`,
    "",
    "Thank you for your time.",
    "",
    "Sincerely,",
    profile.name,
  ]
    .filter((line, i, arr) => line !== "" || arr[i - 1] !== "")
    .join("\n");
}

function splitQuestions(raw) {
  const text = String(raw || "").trim();
  if (!text) return [];
  const blocks = text
    .split(/\n\s*\n+/)
    .map((block) => block.trim())
    .filter(Boolean);
  if (blocks.length > 1) return blocks;
  const numbered = text
    .split(/\n(?=\s*(?:\d+[.)]\s+|[-*]\s+|Q\d+[:.)]\s*))/i)
    .map((block) => block.trim())
    .filter(Boolean);
  if (numbered.length > 1) return numbered;
  return [text];
}

function rankBullets(profile, question, job) {
  const qWords = tokenize(question);
  const jobWords = tokenize(`${job?.title || ""} ${job?.description || ""}`);
  const combined = [...new Set([...qWords, ...jobWords])];
  const allRoles = [
    ...(profile.experience || []),
    ...(profile.additional || []),
  ];
  const pool = allRoles.flatMap((role) =>
    (role.bullets || []).map((bullet) => {
      const bWords = tokenize(bullet);
      const roleWords = tokenize(`${role.title} ${role.company}`);
      const qHits = combined.filter((w) => bWords.includes(w) || roleWords.includes(w)).length;
      const directHits = qWords.filter((w) => bWords.includes(w)).length;
      return { bullet, title: role.title, company: role.company, score: qHits + directHits * 2 };
    })
  );
  pool.sort((a, b) => b.score - a.score);
  return pool.filter((p) => p.score > 0).slice(0, 3);
}

function tokenize(text) {
  return String(text || "").toLowerCase().split(/[^a-z0-9]+/).filter((w) => w.length > 3);
}

function matchingSkills(profile, text) {
  const lower = text.toLowerCase();
  return (profile.skills || []).filter((s) => lower.includes(String(s).toLowerCase()));
}

function latestRole(profile) {
  const r = profile.experience?.[0];
  if (!r) return { title: "Product Designer", company: "my current company" };
  return r;
}

function answerOne(profile, job, question) {
  const q = question.replace(/^\s*(?:\d+[.)]\s*|[-*]\s*|Q\d+[:.)]\s*)/i, "").trim();
  if (!q) return { question: q, answer: "" };

  const lower = q.toLowerCase();
  const proof = rankBullets(profile, q, job);
  const latest = latestRole(profile);
  const years = profile.yearsExperience || 5;
  const jobTitle = job?.title || "this role";
  const company = job?.company || "your company";
  const jobDesc = (job?.description || "").toLowerCase();

  const qSkills = matchingSkills(profile, q + " " + (job?.description || ""));
  const topSkills = qSkills.length ? qSkills.slice(0, 6) : (profile.skills || []).slice(0, 6);

  const domainHits = (profile.domains || []).filter((d) => jobDesc.includes(d.toLowerCase()));

  const lines = [];

  // --- Detect question type and build a real answer ---

  const isYears = /years|experience|how long|background/i.test(q);
  const isWhy = /why .*(?:apply|interest|role|company|position|join|want)|motivation|what attract/i.test(q);
  const isStrength = /strength|skill|stack|tool|proficien|expertise|capable|qualif/i.test(q);
  const isChallenge = /challenge|difficult|obstacle|problem.*solved|conflict|disagree|mistake|failure|learned/i.test(q);
  const isExample = /example|tell me about|describe a time|walk.*through|project|case study|proudest|achievement/i.test(q);
  const isSalary = /salary|compensation|expect.*pay|rate|hourly/i.test(q);
  const isLocation = /remote|location|relocat|visa|egypt|cairo|timezone|where.*based|work.*from/i.test(q);
  const isAvailability = /availab|start.*date|when.*can.*start|notice.*period|immediately/i.test(q);
  const isManagement = /manage|lead|mentor|team.*size|direct.*report|supervised/i.test(q);
  const isDesignProcess = /process|approach|methodology|how.*do.*you.*design|workflow|design.*think/i.test(q);
  const isPortfolio = /portfolio|case.*study|work.*sample|examples.*of.*work/i.test(q);

  if (isYears) {
    lines.push(`I have ${years} years of professional experience in product and UI/UX design across enterprise SaaS, agency, and consulting environments.`);
    lines.push(`Most recently I worked as ${latest.title} at ${latest.company}, and before that I led a design team of 4 at Caspian Digital Solutions for over 2 years.`);
  } else if (isWhy) {
    const hooks = [];
    if (domainHits.length) hooks.push(`my background in ${domainHits.slice(0, 2).join(" and ")}`);
    if (qSkills.length) hooks.push(`my daily use of ${qSkills.slice(0, 3).join(", ")}`);
    if (!hooks.length) hooks.push(`my experience shipping end-to-end product design`);
    lines.push(`The ${jobTitle} role at ${company} is a strong fit because ${hooks.join(", and ")} aligns directly with what the role needs.`);
    if (proof.length) {
      lines.push(`For context, as ${proof[0].title} at ${proof[0].company} I ${proof[0].bullet.charAt(0).toLowerCase() + proof[0].bullet.slice(1).replace(/\.$/, "")}, which is the kind of impact I want to continue delivering.`);
    }
  } else if (isManagement) {
    const mgmtBullets = proof.filter((p) => /led|managed|directed|mentor|team/i.test(p.bullet));
    if (mgmtBullets.length) {
      lines.push(`Yes. As ${mgmtBullets[0].title} at ${mgmtBullets[0].company}, I ${mgmtBullets[0].bullet.charAt(0).toLowerCase() + mgmtBullets[0].bullet.slice(1).replace(/\.$/, "")}.`);
    } else {
      lines.push(`At Caspian Digital Solutions I managed and directed a UX design team of 4, delivering over 20 digital products annually with a 95% stakeholder approval rate.`);
    }
  } else if (isDesignProcess) {
    lines.push(`My process typically follows: discovery and stakeholder alignment, user research or competitive analysis, information architecture and user flows, wireframes, high-fidelity prototyping in Figma, usability testing, and iterating through to developer handoff.`);
    lines.push(`I adapt the depth of each phase to the project — a 0-to-1 product gets heavier research upfront, while a feature iteration leans on existing data and faster cycles.`);
  } else if (isStrength) {
    lines.push(`My core toolkit includes ${topSkills.join(", ")}. I work end-to-end from research through shipped UI.`);
    if (proof.length) {
      lines.push(`A concrete example: as ${proof[0].title} at ${proof[0].company}, I ${proof[0].bullet.charAt(0).toLowerCase() + proof[0].bullet.slice(1).replace(/\.$/, "")}.`);
    }
  } else if (isChallenge || isExample) {
    if (proof.length) {
      const p = proof[0];
      lines.push(`As ${p.title} at ${p.company}, I ${p.bullet.charAt(0).toLowerCase() + p.bullet.slice(1).replace(/\.$/, "")}.`);
      if (proof.length > 1) {
        lines.push(`Similarly, as ${proof[1].title} at ${proof[1].company}, I ${proof[1].bullet.charAt(0).toLowerCase() + proof[1].bullet.slice(1).replace(/\.$/, "")}.`);
      }
    } else {
      lines.push(`At ${latest.title} at ${latest.company}, I ${(latest.bullets?.[0] || "delivered cross-platform product design work").charAt(0).toLowerCase() + (latest.bullets?.[0] || "delivered cross-platform product design work").slice(1).replace(/\.$/, "")}.`);
    }
  } else if (isSalary) {
    lines.push(`I'm flexible on compensation and happy to discuss a figure that reflects the role's scope, seniority level, and your standard range for the region. I don't have a rigid number — I prioritize role fit and growth.`);
  } else if (isLocation) {
    lines.push(`I'm based in ${profile.location || "Cairo, Egypt"} and set up for remote work across EMEA timezones. I have experience collaborating asynchronously with distributed teams across NA, EMEA, and APAC.`);
  } else if (isAvailability) {
    lines.push(`I can start immediately or within two weeks, depending on your onboarding timeline.`);
  } else if (isPortfolio) {
    lines.push(`My portfolio is at ${profile.portfolio || "hassanamin.net"} — it includes case studies from enterprise SaaS, government, and consulting projects covering end-to-end product design, design systems, and research-led UI work.`);
  } else {
    // Generic fallback — still use proof bullets to stay specific
    if (proof.length) {
      lines.push(`Based on my experience: as ${proof[0].title} at ${proof[0].company}, I ${proof[0].bullet.charAt(0).toLowerCase() + proof[0].bullet.slice(1).replace(/\.$/, "")}.`);
      if (proof.length > 1) {
        lines.push(`Additionally, as ${proof[1].title} at ${proof[1].company}, I ${proof[1].bullet.charAt(0).toLowerCase() + proof[1].bullet.slice(1).replace(/\.$/, "")}.`);
      }
    } else {
      lines.push(`With ${years} years in product and UI/UX design, I bring hands-on experience in ${topSkills.slice(0, 4).join(", ")} across ${domainHits.length ? domainHits.join(", ") : "enterprise SaaS, agency, and consulting"} environments.`);
    }
  }

  // For non-salary/location/availability answers, append relevant proof if not already used
  if (!isSalary && !isLocation && !isAvailability && !isChallenge && !isExample && !isPortfolio) {
    const usedBullets = lines.join(" ");
    for (const p of proof) {
      if (!usedBullets.includes(p.bullet)) {
        lines.push(`Relevant experience: as ${p.title} at ${p.company}, I ${p.bullet.charAt(0).toLowerCase() + p.bullet.slice(1).replace(/\.$/, "")}.`);
        break;
      }
    }
  }

  return {
    question: q,
    answer: lines.filter(Boolean).join(" "),
  };
}

export function answerApplicationQuestions(profile, job, questionsText) {
  const questions = splitQuestions(questionsText);
  if (!questions.length) {
    throw new Error("Paste at least one application question.");
  }
  const answers = questions.map((question) => answerOne(profile, job || {}, question));
  const text = answers
    .map((item, index) => `Q${index + 1}. ${item.question}\nA${index + 1}. ${item.answer}`)
    .join("\n\n");
  return { answers, text, count: answers.length };
}
