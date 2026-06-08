/**
 * Nitro template — site-wide settings.
 * Projects: `projects.js` (3 placeholders) · Blog: `posts.js`
 */

export const site = {
  brand: ".amin",
  domain: "hassanamin.net",
  name: "Hassan",
  email: "contact.hassan.amin@gmail.com",
  availability: "available for new projects",

  nav: [
    { to: "/projects", label: "projects" },
    { to: "/about", label: "about" },
    { to: "/blog", label: "notes" },
    { to: "/contact", label: "contact" }
  ],

  headerCta: {
    label: "get in touch",
    href: "mailto:contact.hassan.amin@gmail.com"
  },

  hero: {
    greeting: "Hey, I'm Hassan",
    prefix: "a product design partner with focus on",
    words: ["no-code websites", "software interfaces", "interactive experiences"],
    interval: 2,
    animationDuration: 0.3
  },

  about: {
    homeTagline:
      "my craft is building experiences that bring value to people and celebrate function over form. let's hide the ego and give some freedom to creativity and make the first small step changing the world to a better place.",
    homeSummary: "",
    pageIntro:
      "my craft is building experiences that bring value to people and celebrate function over form. let's hide the ego and give some freedom to creativity and make the first small step changing the world to a better place.",
    image:
      "https://framerusercontent.com/images/INr3fWPwNzKVuKbZgjxl5xvZaSA.jpg",
    imageAlt: "About portrait",
    bio: [
      "I'm a product designer who cares about clarity, systems, and outcomes—not decoration for its own sake.",
      "I work across research, interface design, and design ops—often partnering with engineering and product to ship work that holds up in the real world."
    ],
    tools: ["Figma", "Framer", "Cursor", "Claude", "FigJam", "Principle"]
  },

  cta: {
    label: ".say hello",
    headline:
      "i'm open for freelance projects, feel free to email me to see how we can collaborate"
  },

  social: {
    linkedin: "https://www.linkedin.com/in/hassan-mo-amin/",
    behance: "https://behance.net/hassan-amin",
    resume:
      "https://docs.google.com/document/d/1HGmgiDDspkzYrs9ZOtdyzWfKbgUCsM8V/"
  }
};

/** Scroll progress line colors (Nitro template) — one per project card */
export const progressLineColors = [
  "hsl(64, 100%, 50%)",
  "hsl(207, 100%, 54%)",
  "hsl(319, 100%, 50%)"
];
