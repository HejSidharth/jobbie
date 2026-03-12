export type AssetKind = "image" | "icon" | "favicon";
export type AssetSource = "upload" | "remote-fetch" | "manual-url";

export type AssetRecord = {
  id: string;
  kind: AssetKind;
  name: string;
  mimeType: string;
  source: AssetSource;
  dataUrl?: string;
  remoteUrl?: string;
  resolvedUrl?: string;
};

export type AssetManifest = {
  assets: AssetRecord[];
};

export type IconSource = {
  inputUrl: string;
  resolvedDomain: string;
  fetchMethod: "google-s2" | "clearbit";
  fetchedAt: string;
};

export type SiteSettings = {
  siteName: string;
  pageTitle: string;
  tagline: string;
  university: string;
  major: string;
  contactEmail: string;
  faviconAssetId?: string;
  seo: {
    title: string;
    description: string;
    ogImageAssetId?: string;
  };
};

export type ProfileSection = {
  displayName: string;
  introHtml: string;
  avatarAssetId?: string;
  avatarHoverAssetId?: string;
  avatarTipsEnabled: true;
};

export type HomepageSections = {
  showExperience: boolean;
  showFeaturedProjects: boolean;
};

export type ExperienceItem = {
  id: string;
  company: string;
  role: string;
  period: string;
  href?: string;
  description?: string;
  logoAssetId?: string;
  logoSource?: IconSource;
};

export type FeaturedProject = {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  href: string;
};

export type SocialLink = {
  id: string;
  label: string;
  href: string;
};

export type SocialLinks = {
  github?: string;
  linkedin?: string;
  customLinks: SocialLink[];
};

export type DockSettings = {
  showThemeToggle: boolean;
  showAccessibilityMenu: boolean;
  homeLabel: string;
};

export type PortfolioSite = {
  version: 1;
  site: SiteSettings;
  profile: ProfileSection;
  sections: HomepageSections;
  experience: ExperienceItem[];
  featuredProjects: FeaturedProject[];
  social: SocialLinks;
  dock: DockSettings;
  assets: AssetManifest;
};

export type DraftEnvelope = {
  schemaVersion: 1;
  savedAt: string;
  data: PortfolioSite;
};

export type ExportResult = {
  zipBlob: Blob;
  fileName: string;
  warnings: string[];
};

export type PreviewRoute = { type: "home" };
