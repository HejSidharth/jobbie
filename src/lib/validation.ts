import type { PortfolioSite } from "@/types/portfolio";

export type ValidationResult = {
  errors: string[];
  warnings: string[];
};

function isValidUrl(value: string) {
  try {
    new URL(value);
    return true;
  } catch {
    return false;
  }
}

export function validatePortfolio(site: PortfolioSite): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (!site.site.pageTitle.trim()) {
    errors.push("Site title is required.");
  }

  if (!site.profile.displayName.trim()) {
    errors.push("Profile display name is required.");
  }

  if (site.sections.showExperience) {
    for (const item of site.experience) {
      if (item.href && !isValidUrl(item.href)) {
        errors.push(`Experience "${item.company}" has an invalid link.`);
      }
    }
  }

  if (site.sections.showFeaturedProjects) {
    for (const item of site.featuredProjects) {
      if (item.href && !isValidUrl(item.href)) {
        errors.push(`Featured project "${item.title}" has an invalid link.`);
      }
    }
  }

  for (const custom of site.social.customLinks) {
    if (!isValidUrl(custom.href)) {
      errors.push(`Social link "${custom.label}" has an invalid URL.`);
    }
  }

  if (!site.profile.avatarHoverAssetId) {
    warnings.push("Hover avatar is missing; hover interaction will fall back to the primary avatar.");
  }

  if (!site.social.github && !site.social.linkedin && site.social.customLinks.length === 0) {
    warnings.push("No social links are configured.");
  }

  return { errors, warnings };
}
