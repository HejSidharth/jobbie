import type { CanonicalJob, CanonicalJobSource, ParsedJobRow } from "@/jobs/types";
import { formatPlainDate, formatZonedTimestamp, getZonedPlainDate, parseAgeToPlainDate, parseMonthDayToPlainDate } from "@/jobs/date";
import { canonicalizeForKey, hashText, normalizeUrl } from "@/jobs/utils";

type BuildJobsInput = {
  rows: ParsedJobRow[];
  existingJobs: CanonicalJob[];
  now: Date;
  timezone: string;
};

type BuildJobsOutput = {
  generatedAt: string;
  jobs: CanonicalJob[];
  jobsToday: CanonicalJob[];
  warnings: string[];
  sourceCounts: Record<string, number>;
};

type InheritedRow = ParsedJobRow & {
  resolvedCompany: string;
};

function inheritCompany(rows: ParsedJobRow[]): InheritedRow[] {
  let previousCompany = "";
  return rows.map((row) => {
    const resolvedCompany = row.company === "↳" ? previousCompany : row.company;
    if (resolvedCompany) {
      previousCompany = resolvedCompany;
    }

    return {
      ...row,
      resolvedCompany,
    };
  });
}

function derivePostedDate(row: InheritedRow, runDate: ReturnType<typeof getZonedPlainDate>) {
  if (/^\d+d$/i.test(row.sourcePostedText)) {
    return parseAgeToPlainDate(row.sourcePostedText, runDate);
  }

  return parseMonthDayToPlainDate(row.sourcePostedText, runDate);
}

function buildFingerprint(row: InheritedRow): string {
  const normalizedUrl = normalizeUrl(row.applicationUrl);
  if (normalizedUrl) {
    return `url:${normalizedUrl}`;
  }

  return [
    "composite",
    canonicalizeForKey(row.resolvedCompany),
    canonicalizeForKey(row.role),
    canonicalizeForKey(row.location),
  ].join(":");
}

function mergeSourceEntries(sources: CanonicalJobSource[]): CanonicalJobSource[] {
  const deduped = new Map<string, CanonicalJobSource>();
  for (const source of sources) {
    deduped.set(`${source.sourceId}:${source.sourcePostedText}`, source);
  }

  return Array.from(deduped.values()).sort((left, right) =>
    left.sourceId.localeCompare(right.sourceId) || left.sourcePostedText.localeCompare(right.sourcePostedText),
  );
}

export function buildCanonicalJobs({ rows, existingJobs, now, timezone }: BuildJobsInput): BuildJobsOutput {
  const runDate = getZonedPlainDate(now, timezone);
  const todayIso = formatPlainDate(runDate);
  const generatedAt = formatZonedTimestamp(now, timezone);
  const existingById = new Map(existingJobs.map((job) => [job.id, job]));
  const warnings: string[] = [];
  const sourceCounts: Record<string, number> = {};
  const merged = new Map<string, CanonicalJob>();

  for (const row of inheritCompany(rows)) {
    sourceCounts[row.sourceId] = (sourceCounts[row.sourceId] ?? 0) + 1;

    const postedDate = derivePostedDate(row, runDate);
    if (!postedDate) {
      warnings.push(`Dropped row ${row.sourceRowHash} from ${row.sourceId}: could not parse posted date "${row.sourcePostedText}".`);
      continue;
    }

    const postedDateIso = formatPlainDate(postedDate);
    const fingerprint = buildFingerprint(row);
    const id = `job_${hashText(fingerprint).slice(0, 12)}`;
    const previous = merged.get(fingerprint) ?? existingById.get(id);
    const nextSource = { sourceId: row.sourceId, sourcePostedText: row.sourcePostedText };

    const candidate: CanonicalJob = {
      id,
      category: row.category,
      company: row.resolvedCompany,
      role: row.role,
      location: row.location,
      applicationUrl: normalizeUrl(row.applicationUrl),
      postedDate: previous ? (previous.postedDate < postedDateIso ? previous.postedDate : postedDateIso) : postedDateIso,
      isPostedToday: postedDateIso === todayIso,
      firstSeenAt: previous?.firstSeenAt ?? generatedAt,
      lastSeenAt: generatedAt,
      sources: mergeSourceEntries([...(previous?.sources ?? []), nextSource]),
    };

    if (!candidate.applicationUrl && previous?.applicationUrl) {
      candidate.applicationUrl = previous.applicationUrl;
    }

    merged.set(fingerprint, candidate);
  }

  const jobs = Array.from(merged.values()).sort((left, right) => {
    if (left.postedDate !== right.postedDate) {
      return right.postedDate.localeCompare(left.postedDate);
    }

    return left.company.localeCompare(right.company) || left.role.localeCompare(right.role);
  });

  const jobsToday = jobs.filter((job) => job.isPostedToday);

  return {
    generatedAt,
    jobs,
    jobsToday,
    warnings,
    sourceCounts,
  };
}
