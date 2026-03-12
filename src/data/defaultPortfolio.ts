import type { PortfolioSite } from "@/types/portfolio";

export const defaultPortfolio: PortfolioSite = {
  version: 1,
  site: {
    siteName: "Sidharth Rao Hejamadi",
    pageTitle: "Sidharth Hejamadi - Portfolio",
    tagline: "Coding, designing, and building.",
    university: "University of Illinois at Urbana-Champaign",
    major: "Computer Science and Statistics",
    contactEmail: "hejamadisidharth@gmail.com",
    seo: {
      title: "Sidharth Hejamadi - Portfolio",
      description:
        "Portfolio site for a builder-friendly clone of Sidharth Hejamadi's portfolio.",
    },
  },
  profile: {
    displayName: "Sidharth Rao Hejamadi",
    introHtml:
      "This is what I do. I am Sidharth Rao Hejamadi. I'm a junior at the University of Illinois at Urbana-Champaign studying Computer Science and Statistics.",
    avatarTipsEnabled: true,
  },
  sections: {
    showExperience: true,
    showFeaturedProjects: true,
  },
  experience: [
    {
      id: "exp-whatnot",
      company: "WhatNot",
      role: "Incoming SWE Intern",
      period: "Summer 2026",
      href: "https://www.whatnot.com",
    },
  ],
  featuredProjects: [
    {
      id: "featured-slideboard",
      title: "SlideBoard",
      subtitle: "Whiteboard Presentations",
      description: "A local-first whiteboard presentation app with editable slides and present mode",
      href: "https://slideboard.hejamadi.com",
    },
  ],
  social: {
    github: "https://github.com/HejSidharth",
    linkedin: "https://www.linkedin.com/in/sidharth-hejamadi",
    customLinks: [],
  },
  dock: {
    showThemeToggle: true,
    showAccessibilityMenu: true,
    homeLabel: "Home",
  },
  assets: {
    assets: [],
  },
};
