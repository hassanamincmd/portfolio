/** Nitro project cards — replace these 3 placeholders with your real projects. */

export const projects = [
  {
    slug: "project-1",
    title: "your project one",
    projectType: "Add category",
    year: "2026",
    bg: "rgb(255, 98, 0)",
    fg: "rgb(0, 0, 0)",
    image:
      "https://framerusercontent.com/images/cak7U7dY4h898WLby7suvljdOcA.jpg?width=1920&height=1329"
  },
  {
    slug: "project-2",
    title: "your project two",
    projectType: "Add category",
    year: "2026",
    bg: "rgb(255, 255, 255)",
    fg: "rgb(31, 0, 255)",
    image:
      "https://framerusercontent.com/images/xKHWSysrgFe1ub1CxmcYLHQdpc.jpg?width=1920&height=1440"
  },
  {
    slug: "project-3",
    title: "your project three",
    projectType: "Add category",
    year: "2026",
    bg: "rgb(46, 53, 56)",
    fg: "rgb(179, 255, 203)",
    image:
      "https://framerusercontent.com/images/v2Cxh5gAzf3y5i5rvV7stpdreY.jpg?width=1920&height=1440"
  }
];

export function getProject(slug) {
  return projects.find((project) => project.slug === slug);
}

export function getProjectNeighbors(slug) {
  const index = projects.findIndex((project) => project.slug === slug);
  if (index === -1) return { prev: null, next: null };
  return {
    prev: index > 0 ? projects[index - 1] : null,
    next: index < projects.length - 1 ? projects[index + 1] : null
  };
}
