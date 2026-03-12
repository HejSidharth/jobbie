import { create } from "zustand";
import { defaultPortfolio } from "@/data/defaultPortfolio";
import { loadDraft, saveDraft } from "@/lib/persistence";
import { createId } from "@/lib/ids";
import type {
  AssetRecord,
  ExperienceItem,
  FeaturedProject,
  PortfolioSite,
  PreviewRoute,
  SocialLink,
} from "@/types/portfolio";

type BuilderState = {
  portfolio: PortfolioSite;
  selectedSection: string;
  previewRoute: PreviewRoute;
  lastSavedAt?: string;
  setSelectedSection: (section: string) => void;
  setPreviewRoute: (route: PreviewRoute) => void;
  updatePortfolio: (updater: (draft: PortfolioSite) => PortfolioSite) => void;
  resetPortfolio: () => void;
  upsertAsset: (asset: AssetRecord) => void;
  removeAsset: (assetId: string) => void;
  addExperience: () => void;
  removeExperience: (id: string) => void;
  addFeaturedProject: () => void;
  removeFeaturedProject: (id: string) => void;
  addCustomLink: () => void;
};

function clonePortfolio(portfolio: PortfolioSite) {
  return JSON.parse(JSON.stringify(portfolio)) as PortfolioSite;
}

const restored = loadDraft();
const initialPortfolio = restored?.data ?? defaultPortfolio;

export const useBuilderStore = create<BuilderState>((set) => ({
  portfolio: initialPortfolio,
  selectedSection: "site",
  previewRoute: { type: "home" },
  lastSavedAt: restored?.savedAt,
  setSelectedSection: (selectedSection) => set({ selectedSection }),
  setPreviewRoute: (previewRoute) => set({ previewRoute }),
  updatePortfolio: (updater) =>
    set((state) => {
      const next = updater(clonePortfolio(state.portfolio));
      saveDraft(next);
      return {
        portfolio: next,
        lastSavedAt: new Date().toISOString(),
      };
    }),
  resetPortfolio: () =>
    set(() => {
      saveDraft(defaultPortfolio);
      return {
        portfolio: clonePortfolio(defaultPortfolio),
        lastSavedAt: new Date().toISOString(),
      };
    }),
  upsertAsset: (asset) =>
    set((state) => {
      const next = clonePortfolio(state.portfolio);
      const existingIndex = next.assets.assets.findIndex((entry) => entry.id === asset.id);
      if (existingIndex >= 0) {
        next.assets.assets[existingIndex] = asset;
      } else {
        next.assets.assets.push(asset);
      }
      saveDraft(next);
      return { portfolio: next, lastSavedAt: new Date().toISOString() };
    }),
  removeAsset: (assetId) =>
    set((state) => {
      const next = clonePortfolio(state.portfolio);
      next.assets.assets = next.assets.assets.filter((entry) => entry.id !== assetId);
      saveDraft(next);
      return { portfolio: next, lastSavedAt: new Date().toISOString() };
    }),
  addExperience: () =>
    set((state) => {
      const next = clonePortfolio(state.portfolio);
      const item: ExperienceItem = {
        id: createId("experience"),
        company: "New Company",
        role: "Role",
        period: "2026",
      };
      next.experience.push(item);
      saveDraft(next);
      return { portfolio: next, lastSavedAt: new Date().toISOString() };
    }),
  removeExperience: (id) =>
    set((state) => {
      const next = clonePortfolio(state.portfolio);
      next.experience = next.experience.filter((item) => item.id !== id);
      saveDraft(next);
      return { portfolio: next, lastSavedAt: new Date().toISOString() };
    }),
  addFeaturedProject: () =>
    set((state) => {
      const next = clonePortfolio(state.portfolio);
      const item: FeaturedProject = {
        id: createId("featured"),
        title: "New Project",
        subtitle: "Subtitle",
        description: "Describe this project.",
        href: "https://example.com",
      };
      next.featuredProjects.push(item);
      saveDraft(next);
      return { portfolio: next, lastSavedAt: new Date().toISOString() };
    }),
  removeFeaturedProject: (id) =>
    set((state) => {
      const next = clonePortfolio(state.portfolio);
      next.featuredProjects = next.featuredProjects.filter((item) => item.id !== id);
      saveDraft(next);
      return { portfolio: next, lastSavedAt: new Date().toISOString() };
    }),
  addCustomLink: () =>
    set((state) => {
      const next = clonePortfolio(state.portfolio);
      const item: SocialLink = {
        id: createId("social"),
        label: "Custom Link",
        href: "https://example.com",
      };
      next.social.customLinks.push(item);
      saveDraft(next);
      return { portfolio: next, lastSavedAt: new Date().toISOString() };
    }),
}));
