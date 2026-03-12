import { createHash } from "node:crypto";

export function hashText(value: string): string {
  return createHash("sha256").update(value).digest("hex");
}

export function collapseWhitespace(value: string): string {
  return value
    .replace(/\u00a0/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function stripMarkdownFormatting(value: string): string {
  return collapseWhitespace(
    value
      .replace(/!\[[^\]]*]\([^)]*\)/g, "")
      .replace(/\[([^\]]+)]\([^)]*\)/g, "$1")
      .replace(/[*_`~]/g, "")
      .replace(/<\/?summary>/gi, " ")
      .replace(/<\/?details>/gi, " ")
      .replace(/<\/?strong>/gi, " ")
      .replace(/<\/?em>/gi, " ")
      .replace(/<br\s*\/?>/gi, ", ")
      .replace(/<\/br>/gi, ", ")
      .replace(/<[^>]+>/g, " ")
  );
}

export function normalizeCompanyText(value: string): string {
  return collapseWhitespace(stripMarkdownFormatting(value).replace(/^↳$/, "↳"));
}

export function normalizeDisplayText(value: string): string {
  return collapseWhitespace(stripMarkdownFormatting(value));
}

export function canonicalizeForKey(value: string): string {
  return normalizeDisplayText(value)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

export function normalizeUrl(rawUrl: string): string {
  const trimmed = rawUrl.trim();
  if (!trimmed) {
    return "";
  }

  let parsed: URL;
  try {
    parsed = new URL(trimmed);
  } catch {
    return trimmed;
  }

  parsed.hash = "";
  parsed.hostname = parsed.hostname.toLowerCase();
  parsed.protocol = parsed.protocol.toLowerCase();

  const keptParams = new URLSearchParams();
  for (const [key, value] of parsed.searchParams.entries()) {
    const normalizedKey = key.toLowerCase();
    if (
      normalizedKey.startsWith("utm_") ||
      normalizedKey === "gh_src" ||
      normalizedKey === "ref" ||
      normalizedKey === "source" ||
      normalizedKey === "codes"
    ) {
      continue;
    }

    keptParams.append(key, value);
  }

  parsed.search = keptParams.toString();
  parsed.pathname = parsed.pathname.replace(/\/+$/, "") || "/";
  return parsed.toString().replace(/\?$/, "");
}

export function extractFirstUrl(value: string): string {
  const htmlHrefMatch = value.match(/href="([^"]+)"/i);
  if (htmlHrefMatch) {
    return htmlHrefMatch[1].replace(/&amp;/g, "&");
  }

  const markdownLinkMatch = value.match(/\[[^\]]+]\((https?:\/\/[^)]+)\)/i);
  if (markdownLinkMatch) {
    return markdownLinkMatch[1];
  }

  const plainUrlMatch = value.match(/https?:\/\/\S+/i);
  return plainUrlMatch?.[0] ?? "";
}

export function splitMarkdownRow(line: string): string[] {
  const trimmed = line.trim().replace(/^\|/, "").replace(/\|$/, "");
  return trimmed.split("|").map((cell) => cell.trim());
}
