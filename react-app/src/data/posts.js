/** Nitro blog posts — edit titles, dates, images, and body copy here. */

export const posts = [
  {
    slug: "starting-career-web-design",
    title: "Starting and Growing a Career in Web Design",
    date: "Apr 8, 2022",
    image:
      "https://framerusercontent.com/images/u5jNVG9wj9EcOdKVCMRYRudfPs.jpg?scale-down-to=1024&width=6000&height=4000",
    excerpt: "Lessons from the first years of designing for the web.",
    body: [
      "When you're starting out, the hardest part isn't learning tools—it's learning what to show and who it's for.",
      "A portfolio that reads like a gallery won't land the same roles as one that proves how you think."
    ]
  },
  {
    slug: "landing-page-performance",
    title: "Create a Landing Page That Performs Great",
    date: "Mar 15, 2022",
    image:
      "https://framerusercontent.com/images/xKHWSysrgFe1ub1CxmcYLHQdpc.jpg?width=1200&height=900",
    excerpt: "Structure, hierarchy, and speed for conversion-focused pages.",
    body: [
      "Performance is UX. Every extra second costs trust—and conversions.",
      "Start with a single primary action and remove everything that doesn't support it."
    ]
  },
  {
    slug: "designers-prepare-future",
    title: "How Can Designers Prepare for the Future?",
    date: "Feb 28, 2022",
    image:
      "https://framerusercontent.com/images/v2Cxh5gAzf3y5i5rvV7stpdreY.jpg?width=1200&height=900",
    excerpt: "Staying adaptable without chasing every new tool.",
    body: [
      "Foundations beat trends: research, systems thinking, and clear communication age well.",
      "Use new tools to ship faster—not to skip the thinking."
    ]
  }
];

export function getPost(slug) {
  return posts.find((post) => post.slug === slug);
}
