import { scanResume, tailorManual } from "../lib/manual.js";

const blob = `RESUME +201063350431 saasaada@gmail.com linkedin.com/in/sara-saada PROFESSIONAL SUMMARY Sara Saada +201063350431 saasaada@gmail.com linkedin.com/in/sara-saada behance.net/sarasaada Product Designer / UI/UX Designer with 3+ years of experience designing user-centered digital products across web and mobile platforms. Skilled in UX research, usability testing, information architecture, wireframing, prototyping, and design systems, with a strong focus on accessibility (WCAG) and business goals. Product Designer at iBuild (Freelance) [Mar 2026 - Jul 2026] Redesigned a B2B construction marketplace platform. UI/UX Designer at Caspian Digital Solutions (Remote) [Apr 2023 - Aug 2025] Delivered user-centered solutions for B2B SaaS products and conducted UX research. B.Sc. in Computer Engineering, Pharos University in Alexandria (Feb 2018 - Feb 2023). E-business B.Sc. in Computer Engineering, KTH Royal Institute of Technology - Sweden (2018 - 2023). SKILLS Figma, Prototyping, Interaction Design, Framer, Adobe XD, Photoshop, Illustrator, Jira, WCAG, Accessibility, Design Systems, Usability Testing, Wireframing, Claude, ChatGPT`;

const scan = scanResume(blob);
console.log(JSON.stringify({
  name: scan.name,
  headline: scan.headline,
  roles: scan.experience.map((j) => `${j.title} @ ${j.company} ${j.dates}`),
  education: scan.education,
  summary: scan.summary,
  skills: scan.skills.slice(0, 8),
  warnings: scan.warnings,
}, null, 2));

const out = tailorManual({
  resumeText: blob,
  jd: "Senior Product Designer. Figma, design systems, WCAG, user research. Remote EMEA.",
  title: "Senior Product Designer",
  company: "Test",
});
console.log("---OUTPUT HEAD---");
console.log(out.resumeText.split("\n").slice(0, 28).join("\n"));
