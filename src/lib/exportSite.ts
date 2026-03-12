import JSZip from "jszip";
import {
  createExportReadme,
  createTemplateApp,
  createTemplateAssetManifest,
  createTemplateIndexHtml,
  createTemplateMain,
  createTemplatePackageJson,
  createTemplatePortfolioData,
  createTemplatePortfolioLoader,
  createTemplateStyles,
  createTemplateTsconfig,
  createTemplateTsconfigNode,
  createTemplateTypes,
  createTemplateViteConfig,
} from "@/templates/export-template/templateFiles";
import type { ExportResult, PortfolioSite } from "@/types/portfolio";
import { validatePortfolio } from "@/lib/validation";

function extensionForMime(mimeType: string) {
  if (mimeType.includes("png")) return "png";
  if (mimeType.includes("jpeg")) return "jpg";
  if (mimeType.includes("webp")) return "webp";
  if (mimeType.includes("svg")) return "svg";
  return "bin";
}

function decodeDataUrl(dataUrl: string) {
  const match = dataUrl.match(/^data:([^;]+);base64,(.+)$/);
  if (match) {
    return Uint8Array.from(atob(match[2]), (char) => char.charCodeAt(0));
  }

  const plain = dataUrl.match(/^data:([^,]+),(.+)$/);
  if (plain) {
    return decodeURIComponent(plain[2]);
  }

  throw new Error("Unsupported data URL.");
}

function sanitizeFileSegment(input: string) {
  return input.replace(/[^a-z0-9.-]+/gi, "-").replace(/^-+|-+$/g, "").toLowerCase() || "asset";
}

export async function exportPortfolioSite(site: PortfolioSite): Promise<ExportResult> {
  const validation = validatePortfolio(site);
  if (validation.errors.length > 0) {
    throw new Error(validation.errors.join("\n"));
  }

  const zip = new JSZip();

  zip.file("package.json", createTemplatePackageJson());
  zip.file("tsconfig.json", createTemplateTsconfig());
  zip.file("tsconfig.node.json", createTemplateTsconfigNode());
  zip.file("vite.config.ts", createTemplateViteConfig());
  zip.file("index.html", createTemplateIndexHtml(site.site.pageTitle));
  zip.file(".gitignore", "node_modules\ndist\n");
  zip.file("README.md", createExportReadme(site.site.siteName));
  zip.file("src/main.tsx", createTemplateMain());
  zip.file("src/App.tsx", createTemplateApp());
  zip.file("src/types.ts", createTemplateTypes());
  zip.file("src/styles.css", createTemplateStyles());

  const exportedAssets: Array<{ id: string; fileName: string }> = [];
  const assetFolder = zip.folder("src/generated-assets");
  if (!assetFolder) {
    throw new Error("Could not create generated-assets folder.");
  }

  const exportedSite: PortfolioSite = JSON.parse(JSON.stringify(site)) as PortfolioSite;
  exportedSite.assets.assets = exportedSite.assets.assets.map((asset) => {
    if (!asset.dataUrl) {
      return asset;
    }

    const ext = extensionForMime(asset.mimeType);
    const fileName = `${sanitizeFileSegment(asset.id)}.${ext}`;
    assetFolder.file(fileName, decodeDataUrl(asset.dataUrl));
    exportedAssets.push({ id: asset.id, fileName });
    return {
      ...asset,
      dataUrl: undefined,
      remoteUrl: undefined,
      resolvedUrl: undefined,
    };
  });

  zip.file("src/generated-assets/index.ts", createTemplateAssetManifest(exportedAssets));
  zip.file("src/data/portfolio.json", createTemplatePortfolioData(exportedSite));
  zip.file("src/data/portfolio.ts", createTemplatePortfolioLoader());

  const zipBlob = await zip.generateAsync({ type: "blob" });
  return {
    zipBlob,
    fileName: `${sanitizeFileSegment(site.site.siteName || "portfolio-site")}.zip`,
    warnings: validation.warnings,
  };
}
