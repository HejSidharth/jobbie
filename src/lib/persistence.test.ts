import { defaultPortfolio } from "@/data/defaultPortfolio";
import { createEnvelope, loadDraft, saveDraft, STORAGE_KEY } from "@/lib/persistence";

describe("persistence", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("saves and loads draft data", () => {
    saveDraft(defaultPortfolio);
    const loaded = loadDraft();
    expect(loaded?.data.site.siteName).toBe(defaultPortfolio.site.siteName);
  });

  it("creates schema envelope", () => {
    const envelope = createEnvelope(defaultPortfolio);
    expect(envelope.schemaVersion).toBe(1);
    expect(localStorage.getItem(STORAGE_KEY)).toBeNull();
  });
});
