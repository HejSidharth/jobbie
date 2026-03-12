import path from "node:path";

import { buildCanonicalJobs } from "@/jobs/normalize";
import { parseSourceReadme } from "@/jobs/parse";
import { loadExistingJobs, loadExistingMeta, writeOutputs } from "@/jobs/persist";
import { JOB_SOURCES, JOBS_TIMEZONE } from "@/jobs/sources";
import type { JobsFile, JobsMetaFile, SourceDefinition, SyncResult } from "@/jobs/types";

export type SyncJobsOptions = {
  now?: Date;
  outputDir?: string;
  timezone?: string;
  fetchSource?: (source: SourceDefinition) => Promise<string>;
};

async function defaultFetchSource(source: SourceDefinition): Promise<string> {
  const response = await fetch(source.rawReadmeUrl);
  if (!response.ok) {
    throw new Error(`Failed to fetch ${source.id}: ${response.status} ${response.statusText}`);
  }

  return response.text();
}

export async function syncJobs(options: SyncJobsOptions = {}): Promise<SyncResult> {
  const now = options.now ?? new Date();
  const timezone = options.timezone ?? JOBS_TIMEZONE;
  const outputDir = options.outputDir ?? path.resolve(process.cwd(), "public/data");
  const fetchSource = options.fetchSource ?? defaultFetchSource;
  const existingJobs = await loadExistingJobs(outputDir);
  const existingMeta = await loadExistingMeta(outputDir);
  const warnings: string[] = [];
  const parsedRows = [];
  let successCount = 0;

  for (const source of JOB_SOURCES) {
    try {
      const markdown = await fetchSource(source);
      const result = parseSourceReadme(source, markdown);
      warnings.push(...result.warnings);

      if (result.rows.length === 0) {
        const previousCount = existingMeta?.sourceCounts[source.id] ?? 0;
        throw new Error(
          previousCount > 0
            ? `Parser returned zero rows for previously healthy source ${source.id}.`
            : `Parser returned zero rows for ${source.id}.`,
        );
      }

      parsedRows.push(...result.rows);
      successCount += 1;
    } catch (error) {
      warnings.push(`${source.id}: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  if (successCount < 4) {
    throw new Error(`Aborting jobs sync: only ${successCount} of ${JOB_SOURCES.length} sources succeeded.`);
  }

  const normalized = buildCanonicalJobs({
    rows: parsedRows,
    existingJobs,
    now,
    timezone,
  });

  const jobs: JobsFile = {
    generatedAt: normalized.generatedAt,
    timezone,
    jobs: normalized.jobs,
  };

  const jobsToday: JobsFile = {
    generatedAt: normalized.generatedAt,
    timezone,
    jobs: normalized.jobsToday,
  };

  const meta: JobsMetaFile = {
    generatedAt: normalized.generatedAt,
    timezone,
    sourceCounts: normalized.sourceCounts,
    activeJobCount: normalized.jobs.length,
    todayJobCount: normalized.jobsToday.length,
    parseWarnings: [...normalized.warnings, ...warnings],
  };

  await writeOutputs(outputDir, jobs, jobsToday, meta);
  return { jobs, jobsToday, meta };
}
