import JSZip from "jszip";
import { defaultPortfolio } from "@/data/defaultPortfolio";
import { exportPortfolioSite } from "@/lib/exportSite";

describe("exportPortfolioSite", () => {
  it("emits a zip with expected files", async () => {
    const result = await exportPortfolioSite(defaultPortfolio);
    const zip = await JSZip.loadAsync(await result.zipBlob.arrayBuffer());
    expect(zip.file("package.json")).toBeTruthy();
    expect(zip.file("src/App.tsx")).toBeTruthy();
    expect(zip.file("README.md")).toBeTruthy();
  });
});
