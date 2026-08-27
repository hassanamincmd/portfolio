function norm(value) {
  return String(value || "")
    .toLowerCase()
    .replace(/[^a-z0-9+#.\s/-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export const STRONG_MIN = 72;
export const DAILY_LIMIT = 20;

function includesAny(text, terms) {
  return terms.some((term) => text.includes(term));
}

export function scoreJob(job, profile, filters = {}) {
  const title = norm(job.title);
  const company = norm(job.company);
  const location = norm(job.location);
  const desc = norm(job.description);
  const hay = `${title} ${company} ${location} ${desc}`;
  const reasons = [];
  let score = 0;

  const titleHits = profile.targetTitles.filter((t) =>
    title.includes(norm(t).replace("ii", "2"))
  );
  const coreTitle = includesAny(title, [
    "product designer",
    "ui/ux",
    "ux/ui",
    "ui ux",
    "ux designer",
    "product design",
    "experience designer",
    "interaction designer",
  ]);
  if (includesAny(title, ["product designer", "ui/ux", "ux/ui", "ui ux", "ux designer"])) {
    score += 28;
    reasons.push("Title matches product / UI/UX design");
  } else if (includesAny(title, ["product design", "experience designer", "interaction designer"])) {
    score += 18;
    reasons.push("Adjacent design title");
  } else {
    return fail("Title is not product / UI/UX");
  }

  if (includesAny(title, ["graphic designer", "visual designer", "brand designer", "motion designer"])) {
    return fail("Title is visual/brand, not product");
  }

  if (includesAny(title, ["staff", "principal", "director", "head of", "vp ", "vice president"])) {
    return fail("Seniority is above a realistic target");
  } else if (includesAny(title, ["lead", "manager", "senior"])) {
    score += 8;
    reasons.push("Senior / lead level is realistic");
  } else if (includesAny(title, ["junior", "intern", "graduate", "apprentice"])) {
    score -= 6;
    reasons.push("Junior title; possible overqualification");
  }

  const skillHits = profile.skills.filter((skill) => hay.includes(norm(skill)));
  if (skillHits.length < 3 && !includesAny(hay, ["figma", "design system", "user research"])) {
    return fail("Not enough skill overlap");
  }
  const skillScore = Math.min(24, skillHits.length * 2);
  score += skillScore;
  if (skillHits.length) {
    reasons.push(`Skills overlap: ${skillHits.slice(0, 6).join(", ")}`);
  }

  const domainHits = profile.domains.filter((d) => hay.includes(norm(d)));
  if (domainHits.length) {
    score += Math.min(10, domainHits.length * 3);
    reasons.push(`Domain fit: ${domainHits.slice(0, 3).join(", ")}`);
  }

  const geo = classifyLocation(location, hay);
  if (!geo.ok) return fail(geo.reason);

  if (geo.remote && (geo.worldwide || geo.egypt || geo.emea || geo.mena)) {
    score += 16;
    reasons.push("Remote and open to Cairo / your region");
  }

  if (geo.egypt) {
    score += 14;
    reasons.push("Egypt / Cairo listed");
  } else if (geo.mena) {
    score += 12;
    reasons.push("MENA / Middle East / Africa");
  } else if (geo.emea) {
    score += 10;
    reasons.push("EMEA region includes Egypt");
  } else if (geo.gcc) {
    score += 7;
    reasons.push("GCC onsite you have applied into");
  } else if (geo.worldwide) {
    score += 10;
    reasons.push("Worldwide / anywhere");
  }

  if (filters.remoteOnly && !geo.remote && !geo.egypt) {
    score -= 20;
  }

  if (includesAny(hay, ["figma"])) score += 4;
  if (includesAny(hay, ["design system", "design systems"])) score += 5;
  if (includesAny(hay, ["wcag", "accessibility"])) score += 4;
  if (includesAny(hay, ["usability", "user research", "usertesting"])) score += 4;
  if (includesAny(hay, ["ai", "cursor", "llm"])) {
    score += 3;
    reasons.push("AI-assisted design mentioned");
  }

  if (job.postedAt) {
    const ageDays = (Date.now() - new Date(job.postedAt).getTime()) / 86400000;
    if (!Number.isNaN(ageDays) && ageDays <= 14) {
      score += 4;
      reasons.push("Posted in the last 2 weeks");
    } else if (ageDays > 60) {
      score -= 4;
    }
  }

  score = Math.max(0, Math.min(100, Math.round(score)));
  const qualified = score >= STRONG_MIN && coreTitle;
  let band = "Below bar";
  if (qualified) band = score >= 85 ? "Excellent match" : "Strong match";

  return {
    score,
    band,
    qualified,
    reasons: reasons.slice(0, 6),
    skillHits,
    titleHits,
    remote: geo.remote,
  };
}

const US_LOCATION = [
  "usa",
  "u.s.",
  "u.s.a",
  "united states",
  "north america",
  "new york",
  "nyc",
  "brooklyn",
  "manhattan",
  "san francisco",
  "bay area",
  "los angeles",
  "seattle",
  "austin",
  "boston",
  "chicago",
  "denver",
  "miami",
  "atlanta",
  "portland",
  "dallas",
  "houston",
  "washington dc",
  "washington d.c",
  "california",
  "texas",
  "colorado",
  "massachusetts",
  "illinois",
  "florida",
  "oregon",
  "arizona",
  "georgia",
  "virginia",
];

const EGYPT_LOCATION = ["egypt", "cairo"];
const GCC_LOCATION = ["uae", "dubai", "saudi", "riyadh", "ksa", "qatar", "bahrain", "kuwait", "oman"];
const MENA_AFRICA = ["mena", "middle east", "north africa", "africa-wide"];
const OPEN_REGION = [
  "worldwide",
  "anywhere",
  "anywhere in the world",
  "work from anywhere",
  "location independent",
  "emea",
  ...MENA_AFRICA,
  ...EGYPT_LOCATION,
];

const COUNTRY_LOCKED = [
  "uk",
  "u.k.",
  "united kingdom",
  "great britain",
  "england",
  "scotland",
  "wales",
  "ireland",
  "northern ireland",
  "germany",
  "deutschland",
  "netherlands",
  "spain",
  "france",
  "italy",
  "portugal",
  "sweden",
  "norway",
  "denmark",
  "finland",
  "belgium",
  "austria",
  "switzerland",
  "poland",
  "berlin",
  "munich",
  "munchen",
  "mnchen",
  "münchen",
  "hamburg",
  "london",
  "manchester",
  "amsterdam",
  "dublin",
  "lisbon",
  "barcelona",
  "madrid",
  "paris",
  "singapore",
  "canada",
  "toronto",
  "vancouver",
  "montreal",
  "ottawa",
  "australia",
  "sydney",
  "melbourne",
  "south africa",
  "cape town",
  "johannesburg",
  "new zealand",
  "europe",
  "european",
  "eu only",
  "eu-only",
  "eea",
  "schengen",
];

const COUNTRY_LOCK_PHRASES = [
  "must be based in the uk",
  "must be located in the uk",
  "must live in the uk",
  "must reside in the uk",
  "must be uk based",
  "uk based only",
  "uk-based",
  "within the uk",
  "remote within the uk",
  "remote uk only",
  "uk remote only",
  "right to work in the uk",
  "right to work in the eu",
  "right to work in ireland",
  "right to work in germany",
  "eligible to work in the uk",
  "eligible to work in the eu",
  "must have the right to work",
  "must be in the eu",
  "must be based in europe",
  "must be located in europe",
  "must live in europe",
  "europe only",
  "eu only",
  "eu-only",
  "within the eu",
  "within europe",
  "based in germany",
  "based in the netherlands",
  "based in ireland",
  "german residence",
  "ok to work in germany",
];

const US_ONLY_PHRASES = [
  "must be in the us",
  "must be based in the us",
  "must reside in the united states",
  "must live in the us",
  "us only",
  "usa only",
  "united states only",
  "u.s. only",
  "us or canada only",
  "united states or canada",
  "north america only",
  "authorized to work in the us",
  "us work authorization",
  "eligible to work in the us",
  "must have us work",
  "gc only",
  "green card required",
  "est/pst",
  "pst / est",
  "us time zone",
  "us timezone",
  "us hours",
  "overlap with us",
  "overlap with pst",
  "overlap with est",
  "security clearance",
  "secret clearance",
  "us citizen",
  "u.s. citizen",
  "must be a us citizen",
];

function hasUsStateAbbrev(text) {
  return /(?:^|[\s,;/(])(?:al|ak|az|ar|ca|co|ct|dc|de|fl|ga|hi|ia|id|il|in|ks|ky|la|ma|md|me|mi|mn|mo|ms|mt|nc|nd|ne|nh|nj|nm|nv|ny|oh|ok|or|pa|ri|sc|sd|tn|tx|ut|va|vt|wa|wi|wv)(?:$|[\s,;/)])/.test(
    text
  );
}

function hasOpenRegion(text) {
  return includesAny(text, OPEN_REGION);
}

function hasCountryLock(text) {
  if (includesAny(text, COUNTRY_LOCKED)) return true;
  if (includesAny(text, COUNTRY_LOCK_PHRASES)) return true;
  if (/(?:^|[\s,;/(])eu(?:$|[\s,;/)])/.test(text)) return true;
  return false;
}

export function classifyLocation(location, hay) {
  const loc = norm(location);
  const egypt = includesAny(loc, EGYPT_LOCATION);
  const gcc = includesAny(loc, GCC_LOCATION);
  const mena =
    includesAny(loc, MENA_AFRICA) ||
    (/(?:^|[\s,;/])africa(?:$|[\s,;/])/.test(loc) && !loc.includes("south africa"));
  const emea = includesAny(loc, ["emea"]);
  const worldwide = includesAny(loc, [
    "worldwide",
    "anywhere",
    "anywhere in the world",
    "work from anywhere",
    "location independent",
  ]);
  const openFromLoc = egypt || mena || emea || worldwide || hasOpenRegion(loc);
  const remote = includesAny(loc, [
    "remote",
    "distributed",
    "anywhere",
    "worldwide",
    "work from home",
    "flexible",
  ]);
  const usFromLoc =
    includesAny(loc, US_LOCATION) ||
    hasUsStateAbbrev(loc) ||
    /(?:^|[\s,;/])us(?:$|[\s,;/])/.test(loc);
  const lockedFromLoc = hasCountryLock(loc) || usFromLoc;
  const lockedFromDesc = includesAny(hay, US_ONLY_PHRASES) || includesAny(hay, COUNTRY_LOCK_PHRASES);
  const openFromDesc = hasOpenRegion(hay);

  if (lockedFromDesc && !openFromLoc && !egypt) {
    return { ok: false, reason: "Requires living in the US / UK / EU — not Cairo" };
  }
  if (lockedFromLoc && !openFromLoc) {
    return {
      ok: false,
      reason: "Country-locked (UK / EU / US remote means you must live there)",
    };
  }
  if (gcc && !remote && !openFromLoc) {
    return { ok: true, reason: "", remote: false, egypt, gcc: true, mena, emea, worldwide };
  }
  if (openFromLoc) {
    return { ok: true, reason: "", remote: remote || emea || worldwide || mena, egypt, gcc, mena, emea, worldwide };
  }
  if (remote && openFromDesc && !lockedFromDesc) {
    return {
      ok: true,
      reason: "",
      remote: true,
      egypt: includesAny(hay, EGYPT_LOCATION),
      gcc,
      mena: includesAny(hay, MENA_AFRICA),
      emea: includesAny(hay, ["emea"]),
      worldwide: includesAny(hay, ["worldwide", "anywhere", "work from anywhere"]),
    };
  }
  if (remote) {
    return {
      ok: false,
      reason: "Remote with no region usually means UK/US/EU residents only",
    };
  }
  return { ok: false, reason: "Location does not support working from Cairo" };
}

function fail(reason) {
  return {
    score: 0,
    band: "Below bar",
    qualified: false,
    reasons: [reason],
    skillHits: [],
    titleHits: [],
    remote: false,
  };
}
