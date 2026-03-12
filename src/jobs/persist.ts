import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

import type { CanonicalJob, JobSummary, JobsFile, JobsIndexFile, JobsMetaFile } from "@/jobs/types";

const JOBS_FILE_NAME = "jobs.json";
const JOBS_INDEX_FILE_NAME = "jobs-index.json";
const JOBS_TODAY_FILE_NAME = "jobs-today.json";
const JOBS_META_FILE_NAME = "jobs-meta.json";
const JOBS_PAGE_SIZE = 50;

async function readJsonFile<T>(filePath: string): Promise<T | null> {
  try {
    const raw = await readFile(filePath, "utf8");
    return JSON.parse(raw) as T;
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") {
      return null;
    }

    throw error;
  }
}

function stringifyJson(value: unknown): string {
  return `${JSON.stringify(value, null, 2)}\n`;
}

function toJobSummary(job: CanonicalJob): JobSummary {
  return {
    id: job.id,
    category: job.category,
    company: job.company,
    role: job.role,
    location: job.location,
    applicationUrl: job.applicationUrl,
    postedDate: job.postedDate,
    isPostedToday: job.isPostedToday,
  };
}

export async function loadExistingJobs(outputDir: string): Promise<CanonicalJob[]> {
  const jobsFile = await readJsonFile<JobsFile>(path.join(outputDir, JOBS_FILE_NAME));
  return jobsFile?.jobs ?? [];
}

export async function loadExistingMeta(outputDir: string): Promise<JobsMetaFile | null> {
  return readJsonFile<JobsMetaFile>(path.join(outputDir, JOBS_META_FILE_NAME));
}

export async function writeOutputs(outputDir: string, jobs: JobsFile, jobsToday: JobsFile, meta: JobsMetaFile): Promise<void> {
  const jobsIndex: JobsIndexFile = {
    generatedAt: jobs.generatedAt,
    timezone: jobs.timezone,
    pageSize: JOBS_PAGE_SIZE,
    totalJobs: jobs.jobs.length,
    jobs: jobs.jobs.map(toJobSummary),
  };

  await mkdir(outputDir, { recursive: true });
  await writeFile(path.join(outputDir, JOBS_FILE_NAME), stringifyJson(jobs), "utf8");
  await writeFile(path.join(outputDir, JOBS_INDEX_FILE_NAME), stringifyJson(jobsIndex), "utf8");
  await writeFile(path.join(outputDir, JOBS_TODAY_FILE_NAME), stringifyJson(jobsToday), "utf8");
  await writeFile(path.join(outputDir, JOBS_META_FILE_NAME), stringifyJson(meta), "utf8");
}
