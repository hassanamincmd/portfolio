import { classifyLocation } from "../lib/score.js";

const cases = [
  ["UK", "remote role in the uk", false, "Remote UK"],
  ["Remote UK", "", false, "Remote UK label"],
  ["United Kingdom", "fully remote", false, "UK country"],
  ["London", "hybrid", false, "London"],
  ["Dublin, Ireland", "remote possible", false, "Dublin"],
  ["Berlin; Munich", "senior product designer remote hybrid", false, "Germany cities"],
  ["Remote (Deutschland)", "ux designer", false, "Remote Germany"],
  ["Europe", "remote europe", false, "Europe is not Egypt"],
  ["LATAM, Canada, Europe, USA", "", false, "No Africa/MENA"],
  ["Flexible / Remote", "join our design team in new york", false, "Unspecified remote"],
  ["Remote", "must be based in the uk", false, "Desc locks UK"],
  ["Remote", "we are a global company with an office in london", false, "Global company is not worldwide hire"],
  ["USA", "remote us", false, "US"],
  ["New York, NY", "remote", false, "NYC"],
  ["EMEA", "senior product designer remote", true, "EMEA includes Egypt"],
  ["Worldwide", "", true, "Worldwide"],
  ["Anywhere", "remote", true, "Anywhere"],
  ["Egypt", "", true, "Egypt"],
  ["Cairo, Egypt", "hybrid", true, "Cairo"],
  ["MENA", "remote", true, "MENA"],
  ["Middle East", "remote", true, "Middle East"],
  ["Remote", "hiring worldwide from anywhere", true, "Remote + worldwide in JD"],
  ["Remote", "open to emea", true, "Remote + EMEA in JD"],
  ["South Africa", "remote", false, "South Africa is not Cairo"],
  ["Dubai", "onsite", true, "GCC onsite"],
  ["Dubai / Remote", "", false, "UAE-only remote"],
];

let failed = 0;
for (const [location, desc, expected, name] of cases) {
  const result = classifyLocation(location, `${location} ${desc}`.toLowerCase());
  const ok = result.ok === expected;
  if (!ok) {
    failed += 1;
    console.log("FAIL", name, "→", result.ok, result.reason || "allowed");
  } else {
    console.log("ok  ", name);
  }
}
if (failed) {
  console.error(`\n${failed} location checks failed`);
  process.exit(1);
}
console.log("\nAll location checks passed");
