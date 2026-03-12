import type { DraftEnvelope, PortfolioSite } from "@/types/portfolio";
import { withResolvedAssets } from "@/lib/assets";

export const STORAGE_KEY = "portfolio-clone-builder:v1";

export function createEnvelope(data: PortfolioSite): DraftEnvelope {
  return {
    schemaVersion: 1,
    savedAt: new Date().toISOString(),
    data: {
      ...data,
      assets: withResolvedAssets(data.assets),
    },
  };
}

export function saveDraft(data: PortfolioSite, storage: Storage = localStorage) {
  storage.setItem(STORAGE_KEY, JSON.stringify(createEnvelope(data)));
}

export function loadDraft(storage: Storage = localStorage): DraftEnvelope | null {
  const raw = storage.getItem(STORAGE_KEY);
  if (!raw) {
    return null;
  }

  try {
    const parsed = JSON.parse(raw) as DraftEnvelope;
    if (parsed.schemaVersion !== 1) {
      return null;
    }
    return {
      ...parsed,
      data: {
        ...parsed.data,
        sections: {
          showExperience: parsed.data.sections?.showExperience ?? true,
          showFeaturedProjects: parsed.data.sections?.showFeaturedProjects ?? true,
        },
        assets: withResolvedAssets(parsed.data.assets),
      },
    };
  } catch {
    return null;
  }
}
