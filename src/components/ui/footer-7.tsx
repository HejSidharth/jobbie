import React from "react";
import { FaGithub, FaLinkedin, FaTwitter } from "react-icons/fa";

import { Icons } from "@/components/ui/icons";

interface Footer7Props {
  logo?: {
    url: string;
    src?: string;
    alt: string;
    title: string;
    icon?: React.ReactElement;
  };
  sections?: Array<{
    title: string;
    links: Array<{ name: string; href: string }>;
  }>;
  description?: string;
  socialLinks?: Array<{
    icon: React.ReactElement;
    href: string;
    label: string;
  }>;
  copyright?: string;
  legalLinks?: Array<{
    name: string;
    href: string;
  }>;
}

const defaultSections = [
  {
    title: "Product",
    links: [
      { name: "Jobs", href: "/jobs" },
      { name: "Portfolio Builder", href: "/portfolio" },
      { name: "Resume Maker", href: "#" },
      { name: "Company Questions", href: "#" },
    ],
  },
  {
    title: "Resources",
    links: [
      { name: "Internships", href: "/jobs" },
      { name: "New Grad", href: "/jobs" },
      { name: "Open Source", href: "https://github.com/HejSidharth" },
      { name: "Roadmap", href: "#" },
    ],
  },
  {
    title: "About",
    links: [
      { name: "Made by Hejamadi", href: "https://hejamadi.com" },
      { name: "GitHub", href: "https://github.com/HejSidharth" },
      { name: "LinkedIn", href: "https://www.linkedin.com" },
      { name: "Contact", href: "mailto:hejamadisidharth@gmail.com" },
    ],
  },
];

const defaultSocialLinks = [
  { icon: <FaGithub className="size-5" />, href: "https://github.com/HejSidharth", label: "GitHub" },
  { icon: <FaTwitter className="size-5" />, href: "https://twitter.com", label: "Twitter" },
  { icon: <FaLinkedin className="size-5" />, href: "https://www.linkedin.com", label: "LinkedIn" },
];

const defaultLegalLinks = [
  { name: "Open Source", href: "https://github.com/HejSidharth" },
  { name: "Contact", href: "mailto:hejamadisidharth@gmail.com" },
];

export const Footer7 = ({
  logo = {
    url: "/",
    alt: "Jobbie logo",
    title: "Jobbie",
    icon: <Icons.logo className="h-8 w-8" />,
  },
  sections = defaultSections,
  description = "An open-source toolkit for finding jobs, building your portfolio, shaping your resume, and getting ready for company-specific application questions.",
  socialLinks = defaultSocialLinks,
  copyright = "© 2026 Jobbie. Built for students and early-career engineers.",
  legalLinks = defaultLegalLinks,
}: Footer7Props) => {
  return (
    <section className="w-full py-16">
      <div className="flex w-full flex-col justify-between gap-10 border-t border-border/80 pt-10 lg:flex-row lg:items-start lg:text-left">
        <div className="flex w-full flex-col justify-between gap-6 lg:max-w-sm lg:items-start">
          <div className="flex items-center gap-3 lg:justify-start">
            <a href={logo.url} className="flex items-center gap-3">
              {logo.icon ?? (logo.src ? <img src={logo.src} alt={logo.alt} title={logo.title} className="h-8" /> : null)}
              <h2 className="text-xl font-semibold">{logo.title}</h2>
            </a>
          </div>
          <p className="max-w-[32rem] text-sm leading-relaxed text-muted-foreground">{description}</p>
          <ul className="flex items-center space-x-6 text-muted-foreground">
            {socialLinks.map((social, idx) => (
              <li key={idx} className="font-medium transition-colors hover:text-primary">
                <a href={social.href} target="_blank" rel="noreferrer" aria-label={social.label}>
                  {social.icon}
                </a>
              </li>
            ))}
          </ul>
        </div>
        <div className="grid w-full gap-6 md:grid-cols-3 lg:max-w-3xl lg:gap-20">
          {sections.map((section, sectionIdx) => (
            <div key={sectionIdx}>
              <h3 className="mb-4 font-bold">{section.title}</h3>
              <ul className="space-y-3 text-sm text-muted-foreground">
                {section.links.map((link, linkIdx) => (
                  <li key={linkIdx} className="font-medium transition-colors hover:text-primary">
                    <a href={link.href}>{link.name}</a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
      <div className="mt-8 flex flex-col justify-between gap-4 border-t border-border/80 py-8 text-xs font-medium text-muted-foreground md:flex-row md:items-center md:text-left">
        <p className="order-2 lg:order-1">{copyright}</p>
        <ul className="order-1 flex flex-col gap-2 md:order-2 md:flex-row md:gap-6">
          {legalLinks.map((link, idx) => (
            <li key={idx} className="transition-colors hover:text-primary">
              <a href={link.href}>{link.name}</a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};
