const UA = "FolioJobMatch/1.0 (contact.hassan.amin@gmail.com)";
const DESIGN_RE =
  /product design|ui\/ux|ux\/ui|ui ux|ux designer|ui designer|experience designer|interaction designer|product designer/i;

async function getJson(url, headers = {}) {
  const res = await fetch(url, {
    headers: { "User-Agent": UA, Accept: "application/json", ...headers },
  });
  if (!res.ok) throw new Error(`${res.status} ${url}`);
  return res.json();
}

async function getText(url) {
  const res = await fetch(url, {
    headers: { "User-Agent": UA, Accept: "application/rss+xml, text/xml, */*" },
  });
  if (!res.ok) throw new Error(`${res.status} ${url}`);
  return res.text();
}

function cleanText(html) {
  return String(html || "")
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/\s+/g, " ")
    .trim();
}

function job({
  id,
  source,
  title,
  company,
  location,
  url,
  description,
  postedAt,
  salary,
}) {
  return {
    id: String(id || `${source}-${title}-${company}`).slice(0, 180),
    source,
    title: title || "Untitled role",
    company: company || "Unknown company",
    location: location || "Not specified",
    url: url || "",
    description: cleanText(description).slice(0, 8000),
    postedAt: postedAt || null,
    salary: salary || "",
  };
}

function isDesign(title, extra = "") {
  return DESIGN_RE.test(`${title} ${extra}`);
}

function settledJobs(batches, pick) {
  return batches.flatMap((result) =>
    result.status === "fulfilled" ? pick(result.value) : []
  );
}

function parseRss(xml, source) {
  return xml
    .split("<item>")
    .slice(1)
    .map((block, i) => {
      const rawTitle =
        (block.match(/<title><!\[CDATA\[(.*?)\]\]><\/title>/) ||
          block.match(/<title>(.*?)<\/title>/) || [, ""])[1];
      const url = (block.match(/<link>(.*?)<\/link>/) || [, ""])[1];
      const description =
        (block.match(/<description><!\[CDATA\[([\s\S]*?)\]\]><\/description>/) ||
          block.match(/<content:encoded><!\[CDATA\[([\s\S]*?)\]\]><\/content:encoded>/) ||
          [, ""])[1];
      const company = (rawTitle.split(":")[0] || "Company").trim();
      const role = (rawTitle.split(":").slice(1).join(":") || rawTitle).trim();
      return job({
        id: `${source}-${url || i}`,
        source,
        title: role,
        company,
        location: "Remote",
        url,
        description,
      });
    });
}

async function remotive() {
  const urls = [
    "https://remotive.com/api/remote-jobs?category=design",
    "https://remotive.com/api/remote-jobs?search=product%20designer",
    "https://remotive.com/api/remote-jobs?search=ux%20designer",
    "https://remotive.com/api/remote-jobs?search=ui%20designer",
    "https://remotive.com/api/remote-jobs?search=senior%20product%20designer",
    "https://remotive.com/api/remote-jobs?search=experience%20designer",
    "https://remotive.com/api/remote-jobs?search=ui%2Fux",
    "https://remotive.com/api/remote-jobs?search=emea%20designer",
  ];
  const batches = await Promise.allSettled(urls.map((u) => getJson(u)));
  return settledJobs(batches, (value) =>
    (value.jobs || []).map((j) =>
      job({
        id: `remotive-${j.id}`,
        source: "Remotive",
        title: j.title,
        company: j.company_name,
        location: j.candidate_required_location || "Remote",
        url: j.url,
        description: j.description,
        postedAt: j.publication_date,
        salary: j.salary,
      })
    )
  );
}

async function remoteok() {
  const urls = [
    "https://remoteok.com/api",
    "https://remoteok.com/api?tag=design",
  ];
  const batches = await Promise.allSettled(urls.map((u) => getJson(u)));
  return settledJobs(batches, (data) =>
    (Array.isArray(data) ? data : [])
      .filter((j) => j && j.position && j.company)
      .map((j) =>
        job({
          id: `remoteok-${j.id || j.slug}`,
          source: "RemoteOK",
          title: j.position,
          company: j.company,
          location: j.location || (j.location_code ? String(j.location_code) : "Remote"),
          url: j.url || j.apply_url,
          description: j.description,
          postedAt: j.date,
          salary: [j.salary_min, j.salary_max].filter(Boolean).join(" - "),
        })
      )
  );
}

async function jobicy() {
  const urls = [
    "https://jobicy.com/api/v2/remote-jobs?count=100&tag=design",
    "https://jobicy.com/api/v2/remote-jobs?count=100&tag=ux",
    "https://jobicy.com/api/v2/remote-jobs?count=100&tag=ui",
    "https://jobicy.com/api/v2/remote-jobs?count=100&tag=product",
    "https://jobicy.com/api/v2/remote-jobs?count=100&geo=emea",
    "https://jobicy.com/api/v2/remote-jobs?count=100&geo=europe&tag=design",
    "https://jobicy.com/api/v2/remote-jobs?count=50&geo=apac&tag=design",
    "https://jobicy.com/api/v2/remote-jobs?count=50&geo=united-arab-emirates",
    "https://jobicy.com/api/v2/remote-jobs?count=100&industry=design-multimedia",
    "https://jobicy.com/api/v2/remote-jobs?count=100&industry=web-app-design",
  ];
  const batches = await Promise.allSettled(urls.map((u) => getJson(u)));
  return settledJobs(batches, (value) =>
    (value.jobs || []).map((j) =>
      job({
        id: `jobicy-${j.id}`,
        source: "Jobicy",
        title: j.jobTitle,
        company: j.companyName,
        location: j.jobGeo || "Remote",
        url: j.url,
        description: j.jobDescription,
        postedAt: j.pubDate,
        salary: j.annualSalaryMin
          ? `${j.annualSalaryMin}-${j.annualSalaryMax || ""} ${j.salaryCurrency || ""}`
          : "",
      })
    )
  );
}

async function arbeitnow() {
  const urls = [];
  for (const page of [1, 2, 3, 4, 5, 6, 7, 8]) {
    urls.push(`https://www.arbeitnow.com/api/job-board-api?page=${page}`);
  }
  urls.push("https://www.arbeitnow.co.uk/api/job-board-api");
  urls.push("https://www.arbeitnow.co.uk/api/job-board-api?page=2");
  const batches = await Promise.allSettled(urls.map((u) => getJson(u)));
  return settledJobs(batches, (value) =>
    (value.data || [])
      .filter((j) => /design|ux|ui|product designer/i.test(`${j.title} ${j.description || ""}`))
      .map((j) =>
        job({
          id: `arbeitnow-${j.slug}`,
          source: "Arbeitnow",
          title: j.title,
          company: j.company_name,
          location: `${j.location || ""}${j.remote ? " / Remote" : ""}`.trim(),
          url: j.url,
          description: j.description,
          postedAt: j.created_at,
        })
      )
  );
}

async function themuse() {
  const urls = [];
  for (const page of [0, 1, 2, 3, 4, 5]) {
    urls.push(
      `https://www.themuse.com/api/public/jobs?category=UX%20and%20Design&page=${page}`
    );
    urls.push(
      `https://www.themuse.com/api/public/jobs?category=Design%20and%20UX&page=${page}`
    );
  }
  const batches = await Promise.allSettled(urls.map((u) => getJson(u)));
  return settledJobs(batches, (value) =>
    (value.results || []).map((j) =>
      job({
        id: `muse-${j.id}`,
        source: "The Muse",
        title: j.name,
        company: j.company?.name,
        location: (j.locations || []).map((l) => l.name).join(", ") || "Various",
        url: j.refs?.landing_page,
        description: j.contents,
        postedAt: j.publication_date,
      })
    )
  );
}

function himalayasLocation(j) {
  const locks = j.locationRestrictions || j.locations || [];
  if (Array.isArray(locks) && locks.length) return locks.join(", ");
  if (j.location || j.jobLocation) return j.location || j.jobLocation;
  return "Worldwide";
}

function unixOrDate(value) {
  if (value == null || value === "") return null;
  if (typeof value === "number") {
    return new Date(value > 1e12 ? value : value * 1000).toISOString();
  }
  return value;
}

async function himalayas() {
  const urls = [
    "https://himalayas.app/jobs/api?limit=20&offset=0",
    "https://himalayas.app/jobs/api?limit=20&offset=20",
    "https://himalayas.app/jobs/api?limit=20&offset=40",
    "https://himalayas.app/jobs/api/search?q=product%20designer&worldwide=true&page=1",
    "https://himalayas.app/jobs/api/search?q=product%20designer&worldwide=true&page=2",
    "https://himalayas.app/jobs/api/search?q=product%20designer&worldwide=true&page=3",
    "https://himalayas.app/jobs/api/search?q=ux%20designer&worldwide=true&page=1",
    "https://himalayas.app/jobs/api/search?q=ux%20designer&worldwide=true&page=2",
    "https://himalayas.app/jobs/api/search?q=ui%20designer&worldwide=true&page=1",
    "https://himalayas.app/jobs/api/search?q=product%20designer&country=egypt&page=1",
    "https://himalayas.app/jobs/api/search?q=product%20designer&country=united-arab-emirates&page=1",
    "https://himalayas.app/jobs/api/search?q=ux%20designer&country=south-africa&page=1",
    "https://himalayas.app/jobs/api/search?q=designer&seniority=Senior&page=1",
  ];
  const batches = await Promise.allSettled(urls.map((u) => getJson(u)));
  return settledJobs(batches, (value) => {
    const list = value.jobs || value.data || [];
    return (Array.isArray(list) ? list : [])
      .filter((j) => isDesign(j.title || j.jobTitle || "", j.description || j.excerpt || ""))
      .map((j) =>
        job({
          id: `himalayas-${j.guid || j.id || j.slug}`,
          source: "Himalayas",
          title: j.title || j.jobTitle,
          company: j.companyName || j.company,
          location: himalayasLocation(j),
          url: j.applicationLink || j.url,
          description: j.description || j.excerpt,
          postedAt: unixOrDate(j.pubDate || j.publishedAt),
        })
      );
  });
}

async function weworkremotely() {
  const urls = [
    "https://weworkremotely.com/categories/remote-design-jobs.rss",
    "https://weworkremotely.com/categories/remote-product-jobs.rss",
  ];
  const batches = await Promise.allSettled(urls.map((u) => getText(u)));
  return settledJobs(batches, (xml) => parseRss(xml, "We Work Remotely"));
}

async function himalayasRss() {
  const xml = await getText("https://himalayas.app/jobs/rss");
  return parseRss(xml, "Himalayas RSS").filter((j) => isDesign(j.title, j.description));
}

async function workingNomads() {
  const data = await getJson("https://www.workingnomads.com/api/exposed_jobs/");
  return (Array.isArray(data) ? data : [])
    .filter((j) =>
      isDesign(
        j.title,
        `${j.category_name || ""} ${Array.isArray(j.tags) ? j.tags.join(" ") : j.tags || ""}`
      )
    )
    .map((j) =>
      job({
        id: `wn-${j.url}`,
        source: "Working Nomads",
        title: j.title,
        company: j.company_name,
        location: j.location || "Remote",
        url: j.url,
        description: j.description,
        postedAt: j.pub_date,
      })
    );
}

async function fourDayWeek() {
  const urls = [
    "https://4dayweek.io/api/v2/jobs?q=product%20designer&limit=100&page=1",
    "https://4dayweek.io/api/v2/jobs?q=ux%20designer&limit=100&page=1",
    "https://4dayweek.io/api/v2/jobs?q=ui%20designer&limit=50&page=1",
    "https://4dayweek.io/api/v2/jobs?category=design&limit=100&page=1",
    "https://4dayweek.io/api/v2/jobs?category=design&limit=100&page=2",
    "https://4dayweek.io/api/v2/jobs?work_arrangement=remote&q=designer&limit=100&page=1",
  ];
  const batches = await Promise.allSettled(urls.map((u) => getJson(u)));
  return settledJobs(batches, (value) =>
    (value.data || value.jobs || [])
      .filter((j) => isDesign(j.title, j.description || ""))
      .map((j) => {
        const locs = Array.isArray(j.locations)
          ? j.locations
              .map((l) => [l.city, l.country, l.work_arrangement].filter(Boolean).join(" "))
              .join(", ")
          : "";
        const worldwide = j.company?.hires_worldwide ? "Worldwide" : "";
        return job({
          id: `4day-${j.id || j.slug}`,
          source: "4dayweek",
          title: j.title,
          company: j.company?.name || j.company_name,
          location: [locs, worldwide, j.work_arrangement].filter(Boolean).join(" · ") || "Remote",
          url: j.url || (j.slug ? `https://4dayweek.io/jobs/${j.slug}` : ""),
          description: j.description,
          postedAt: j.posted_at,
        });
      })
  );
}

async function nomado24() {
  const urls = [
    "https://api.nomado24.de/api/public/v1/jobs?per_page=100&page=1&q=designer",
    "https://api.nomado24.de/api/public/v1/jobs?per_page=100&page=1&q=product%20designer",
    "https://api.nomado24.de/api/public/v1/jobs?per_page=100&page=1&q=ux",
    "https://api.nomado24.de/api/public/v1/jobs?per_page=100&page=2&q=designer",
  ];
  const batches = await Promise.allSettled(urls.map((u) => getJson(u)));
  return settledJobs(batches, (value) =>
    (value.data || [])
      .filter((j) => isDesign(j.title, (j.tags || []).join(" ")))
      .map((j) =>
        job({
          id: `nomado-${j.slug}`,
          source: "Nomado24",
          title: j.title,
          company: j.companyName,
          location: j.location || (j.remote ? "Remote" : ""),
          url: j.url,
          description: (j.tags || []).join(", "),
          postedAt: j.publishedAt,
        })
      )
  );
}

const GREENHOUSE_BOARDS = [
  "gitlab",
  "remotecom",
  "intercom",
  "figma",
  "vercel",
  "stripe",
  "n26",
  "getyourguide",
  "adyen",
  "careem",
  "monzo",
  "anthropic",
  "contentful",
  "typeform",
  "wolt",
  "jumia",
];

async function greenhouse() {
  const boards = await Promise.allSettled(
    GREENHOUSE_BOARDS.map(async (slug) => {
      const list = await getJson(
        `https://boards-api.greenhouse.io/v1/boards/${slug}/jobs`
      );
      const design = (list.jobs || []).filter((j) => isDesign(j.title));
      const details = await Promise.allSettled(
        design.slice(0, 20).map((j) =>
          getJson(`https://boards-api.greenhouse.io/v1/boards/${slug}/jobs/${j.id}`)
        )
      );
      return settledJobs(details, (j) => [
        job({
          id: `gh-${slug}-${j.id}`,
          source: "Greenhouse",
          title: j.title,
          company: j.company_name || slug,
          location: j.location?.name || "Not specified",
          url: j.absolute_url,
          description: j.content,
          postedAt: j.updated_at || j.created_at,
        }),
      ]);
    })
  );
  return settledJobs(boards, (rows) => rows);
}

const LEVER_BOARDS = [
  "spotify",
  "netflix",
  "airbnb",
  "twilio",
  "dropbox",
  "duolingo",
  "grammarly",
  "webflow",
  "framer",
  "procore",
];

async function lever() {
  const boards = await Promise.allSettled(
    LEVER_BOARDS.map(async (slug) => {
      const list = await getJson(
        `https://api.lever.co/v0/postings/${slug}?mode=json`
      );
      return (Array.isArray(list) ? list : [])
        .filter((j) => isDesign(j.text || j.categories?.team || ""))
        .map((j) =>
          job({
            id: `lever-${slug}-${j.id}`,
            source: "Lever",
            title: j.text,
            company: slug,
            location:
              [j.categories?.location, j.categories?.commitment, j.workplaceType]
                .filter(Boolean)
                .join(" · ") || "Not specified",
            url: j.hostedUrl || j.applyUrl,
            description: j.descriptionPlain || j.description,
            postedAt: j.createdAt ? new Date(j.createdAt).toISOString() : null,
          })
        );
    })
  );
  return settledJobs(boards, (rows) => rows);
}

async function jsearch(query, apiKey) {
  if (!apiKey) return [];
  const queries = [
    query || "senior product designer remote EMEA",
    "product designer remote worldwide",
    "UI UX designer remote Egypt",
    "senior UX designer remote MENA",
    "product designer remote Middle East",
    "product designer remote Africa",
  ];
  const batches = await Promise.allSettled(
    queries.map((q) =>
      getJson(
        `https://jsearch.p.rapidapi.com/search?query=${encodeURIComponent(
          q
        )}&page=1&num_pages=1&date_posted=month`,
        {
          "X-RapidAPI-Key": apiKey,
          "X-RapidAPI-Host": "jsearch.p.rapidapi.com",
        }
      )
    )
  );
  return settledJobs(batches, (value) =>
    (value.data || []).map((j) =>
      job({
        id: `jsearch-${j.job_id}`,
        source: "JSearch",
        title: j.job_title,
        company: j.employer_name,
        location:
          [j.job_city, j.job_country].filter(Boolean).join(", ") ||
          (j.job_is_remote ? "Remote" : ""),
        url: j.job_apply_link || j.job_google_link,
        description: j.job_description,
        postedAt: j.job_posted_at_datetime_utc,
        salary: j.job_min_salary
          ? `${j.job_min_salary}-${j.job_max_salary || ""} ${j.job_salary_currency || ""}`
          : "",
      })
    )
  );
}

export async function fetchAllJobs(options = {}) {
  const sources = [
    ["Remotive", remotive],
    ["RemoteOK", remoteok],
    ["Jobicy", jobicy],
    ["Arbeitnow", arbeitnow],
    ["The Muse", themuse],
    ["Himalayas", himalayas],
    ["Himalayas RSS", himalayasRss],
    ["We Work Remotely", weworkremotely],
    ["Working Nomads", workingNomads],
    ["4dayweek", fourDayWeek],
    ["Nomado24", nomado24],
    ["Greenhouse", greenhouse],
    ["Lever", lever],
  ];
  if (process.env.JSEARCH_API_KEY) {
    sources.push([
      "JSearch",
      () => jsearch(options.query, process.env.JSEARCH_API_KEY),
    ]);
  }

  const settled = await Promise.allSettled(sources.map(([, fn]) => fn()));
  const jobs = [];
  const sourceStatus = {};
  settled.forEach((result, i) => {
    const name = sources[i][0];
    if (result.status === "fulfilled") {
      sourceStatus[name] = result.value.length;
      jobs.push(...result.value);
    } else {
      sourceStatus[name] = `error: ${result.reason?.message || "failed"}`;
    }
  });

  const seen = new Set();
  const unique = [];
  for (const item of jobs) {
    const key = `${normKey(item.title)}|${normKey(item.company)}`;
    if (seen.has(key)) continue;
    seen.add(key);
    unique.push(item);
  }
  return { jobs: unique, sourceStatus };
}

function normKey(value) {
  return String(value || "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "");
}
