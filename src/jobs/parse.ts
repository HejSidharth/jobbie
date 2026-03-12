import { JSDOM } from "jsdom";

import type { ParseResult, ParsedJobRow, SourceDefinition } from "@/jobs/types";
import {
  extractFirstUrl,
  hashText,
  normalizeCompanyText,
  normalizeDisplayText,
  splitMarkdownRow,
} from "@/jobs/utils";

function buildRow(source: SourceDefinition, company: string, role: string, location: string, application: string, posted: string): ParsedJobRow {
  const sourceCompanyText = normalizeCompanyText(company);
  const sourceRoleText = normalizeDisplayText(role);
  const normalizedLocation = normalizeDisplayText(location);
  const applicationUrl = extractFirstUrl(application).trim();
  const sourcePostedText = normalizeDisplayText(posted);

  return {
    company: sourceCompanyText,
    role: sourceRoleText,
    location: normalizedLocation,
    applicationUrl,
    sourcePostedText,
    category: source.category,
    sourceId: source.id,
    sourceCompanyText,
    sourceRoleText,
    sourceRowHash: hashText(
      [source.id, sourceCompanyText, sourceRoleText, normalizedLocation, applicationUrl, sourcePostedText].join("::"),
    ),
  };
}

function parseSimplifyHtmlTable(source: SourceDefinition, markdown: string): ParseResult {
  const dom = new JSDOM(markdown);
  const rows: ParsedJobRow[] = [];

  for (const tableRow of Array.from(dom.window.document.querySelectorAll("table tbody tr")) as HTMLTableRowElement[]) {
    const cells = Array.from(tableRow.querySelectorAll("td") as NodeListOf<HTMLTableCellElement>).map((cell) =>
      cell.innerHTML.trim(),
    );
    if (cells.length < 5) {
      continue;
    }

    rows.push(buildRow(source, cells[0], cells[1], cells[2], cells[3], cells[4]));
  }

  return { rows, warnings: [] };
}

function isSeparatorRow(cells: string[]): boolean {
  return cells.every((cell) => /^:?-{3,}:?$/.test(cell));
}

function extractMarkdownTables(markdown: string): string[][][] {
  const tables: string[][][] = [];
  const lines = markdown.split(/\r?\n/);

  for (let index = 0; index < lines.length; index += 1) {
    if (!lines[index].trim().startsWith("|")) {
      continue;
    }

    const header = splitMarkdownRow(lines[index]);
    const separatorLine = lines[index + 1];
    if (!separatorLine?.trim().startsWith("|")) {
      continue;
    }

    const separator = splitMarkdownRow(separatorLine);
    if (!isSeparatorRow(separator)) {
      continue;
    }

    const table: string[][] = [header];
    index += 2;

    while (index < lines.length && lines[index].trim().startsWith("|")) {
      table.push(splitMarkdownRow(lines[index]));
      index += 1;
    }

    tables.push(table);
  }

  return tables;
}

function parseMarkdownTable(source: SourceDefinition, markdown: string): ParseResult {
  const tables = extractMarkdownTables(markdown);
  const rows: ParsedJobRow[] = [];

  for (const table of tables) {
    const header = table[0].map((cell) => normalizeDisplayText(cell).toLowerCase());
    const companyIndex = header.indexOf("company");
    const roleIndex = header.includes("role") ? header.indexOf("role") : header.indexOf("job title");
    const locationIndex = header.indexOf("location");
    const postedIndex = header.indexOf("date posted");
    const applicationIndex =
      source.sourceType === "jobright_markdown_table" ? roleIndex : header.indexOf("application/link");

    if (companyIndex === -1 || roleIndex === -1 || locationIndex === -1 || postedIndex === -1 || applicationIndex === -1) {
      continue;
    }

    for (const row of table.slice(1)) {
      if (row.length <= postedIndex) {
        continue;
      }

      rows.push(
        buildRow(
          source,
          row[companyIndex] ?? "",
          row[roleIndex] ?? "",
          row[locationIndex] ?? "",
          row[applicationIndex] ?? "",
          row[postedIndex] ?? "",
        ),
      );
    }
  }

  return { rows, warnings: [] };
}

export function parseSourceReadme(source: SourceDefinition, markdown: string): ParseResult {
  switch (source.sourceType) {
    case "simplify_html_table":
      return parseSimplifyHtmlTable(source, markdown);
    case "markdown_table":
    case "jobright_markdown_table":
      return parseMarkdownTable(source, markdown);
    default:
      return { rows: [], warnings: [`Unsupported source type for ${source.id}`] };
  }
}
