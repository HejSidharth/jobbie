import type { AssetKind, AssetManifest, AssetRecord } from "@/types/portfolio";

function svgDataUrl(fill: string, label: string) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256"><rect width="256" height="256" rx="48" fill="${fill}"/><text x="50%" y="54%" dominant-baseline="middle" text-anchor="middle" font-family="Arial, sans-serif" font-size="44" fill="#ffffff">${label}</text></svg>`;
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

export function createSeedAsset(
  id: string,
  kind: AssetKind,
  name: string,
  fill: string,
  label: string,
): AssetRecord {
  return {
    id,
    kind,
    name,
    mimeType: "image/svg+xml",
    source: "upload",
    dataUrl: svgDataUrl(fill, label),
    resolvedUrl: svgDataUrl(fill, label),
  };
}

export function resolveAssetUrl(
  manifest: AssetManifest,
  assetId?: string,
  fallback?: string,
) {
  if (!assetId) {
    return fallback;
  }

  const asset = manifest.assets.find((entry) => entry.id === assetId);
  return asset?.resolvedUrl ?? asset?.dataUrl ?? asset?.remoteUrl ?? fallback;
}

export function withResolvedAssets(manifest: AssetManifest): AssetManifest {
  return {
    assets: manifest.assets.map((asset) => ({
      ...asset,
      resolvedUrl: asset.resolvedUrl ?? asset.dataUrl ?? asset.remoteUrl,
    })),
  };
}
