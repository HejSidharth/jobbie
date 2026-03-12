import { createId } from "@/lib/ids";
import type { AssetRecord, IconSource } from "@/types/portfolio";

export function parseDomain(input: string) {
  const trimmed = input.trim();
  if (!trimmed) {
    throw new Error("A website URL or domain is required.");
  }

  try {
    const withProtocol = /^https?:\/\//.test(trimmed) ? trimmed : `https://${trimmed}`;
    const url = new URL(withProtocol);
    return url.hostname.replace(/^www\./, "");
  } catch {
    throw new Error("Enter a valid website URL or domain.");
  }
}

async function responseToDataUrl(response: Response) {
  const blob = await response.blob();
  const arrayBuffer = await blob.arrayBuffer();
  const base64 = btoa(
    new Uint8Array(arrayBuffer).reduce((acc, byte) => acc + String.fromCharCode(byte), ""),
  );
  return `data:${blob.type || "image/png"};base64,${base64}`;
}

export async function fetchIconAsset(inputUrl: string): Promise<{
  asset: AssetRecord;
  source: IconSource;
}> {
  const resolvedDomain = parseDomain(inputUrl);
  const candidates = [
    {
      method: "google-s2" as const,
      url: `https://www.google.com/s2/favicons?domain=${resolvedDomain}&sz=256`,
    },
    {
      method: "clearbit" as const,
      url: `https://logo.clearbit.com/${resolvedDomain}`,
    },
  ];

  for (const candidate of candidates) {
    try {
      const response = await fetch(candidate.url);
      if (!response.ok) {
        continue;
      }

      const dataUrl = await responseToDataUrl(response);
      const asset: AssetRecord = {
        id: createId("asset"),
        kind: "icon",
        name: `${resolvedDomain} icon`,
        mimeType: response.headers.get("content-type") || "image/png",
        source: "remote-fetch",
        dataUrl,
        resolvedUrl: dataUrl,
        remoteUrl: candidate.url,
      };

      return {
        asset,
        source: {
          inputUrl,
          resolvedDomain,
          fetchMethod: candidate.method,
          fetchedAt: new Date().toISOString(),
        },
      };
    } catch {
      continue;
    }
  }

  throw new Error(`Could not fetch an icon for ${resolvedDomain}.`);
}
