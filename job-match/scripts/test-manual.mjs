import { tailorManual } from "../lib/manual.js";

const resume = `Hassan Amin
UI/UX Designer | Product Designer
Cairo, Egypt | +20 10 668 74 777 | contact.hassan.amin@gmail.com
linkedin.com/in/hassan-mo-amin
https://hassanamin.net

PROFESSIONAL SUMMARY
Product and UI/UX designer with 5 years building digital products for enterprise, agency, and government clients.

SKILLS
Figma, FigJam, Design Systems, Accessibility, WCAG, User Research, Prototyping

PROFESSIONAL EXPERIENCE
Product Designer 2
Procore Technologies | May 2025 - July 2026 | Full-time
- Designed and shipped 3 cross-platform Quality and Safety projects.
- Built high-fidelity interfaces focused on data clarity, WCAG accessibility, and localization.
- Partnered with UX researchers on generative studies and usability tests.

Senior UI/UX Designer
Caspian Digital Solutions | November 2022 - February 2025 | Full-time
- Managed and directed a UX design team of 4, delivering over 20 digital products annually.
`;

const out = tailorManual({
  resumeText: resume,
  jd: "Senior Product Designer. Must use Figma and design systems. WCAG required. User research a plus. Remote EMEA.",
  title: "Senior Product Designer",
  company: "Acme",
});
console.log(JSON.stringify(out.scan, null, 2));
console.log(out.resumeText.slice(0, 450));
