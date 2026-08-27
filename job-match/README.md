# Folio

AI shortlist for product & UI/UX designers. Scores live roles against a local profile, then generates a tailored resume and cover letter in one click.

Your profile stays on this machine. Built to be shared with other designers — swap `data/profile.json` and they get their own matches.

## Run

```bash
cd job-match
npm start
```

Open http://localhost:3847

## What it searches

Public / open APIs and RSS feeds, no login:

- Remotive
- RemoteOK
- Jobicy (including EMEA / Europe / APAC / UAE)
- Arbeitnow + Arbeitnow UK
- The Muse
- Himalayas (worldwide + Egypt / UAE / South Africa search)
- Himalayas RSS
- We Work Remotely (design + product RSS)
- Working Nomads
- 4dayweek.io
- Nomado24 (Germany / EU remote)
- Greenhouse boards (GitLab, Remote, Intercom, Figma, N26, Adyen, Careem, …)
- Lever boards (Spotify, Webflow, Framer, …)

Optional: set `JSEARCH_API_KEY` (RapidAPI JSearch) to also pull Indeed / LinkedIn-indexed postings.

LinkedIn, Indeed, and X do not offer a free official feed we can legally scrape. That is why those are optional via JSearch, not built-in scraping.

## How ranking works

Each job gets 0–100 from:

- Title fit (product / UI/UX vs graphic-only or executive)
- Seniority realism
- Skill overlap with the profile
- Domain (SaaS, systems, research, AI)
- Location realism (remote, home country, EMEA, GCC vs US-only / no-sponsor)

Only strong matches (72+ by default) are shown. Up to 20 a day. Weaker roles are dropped, not padded in.

## Generate

Select a job → **Generate resume + letter**. Output is tailored from `data/profile.json` plus keywords found in that JD. Download DOCX or PDF.

Edit `data/profile.json` if titles, bullets, or location rules change. That is the only file another designer needs to personalize.
