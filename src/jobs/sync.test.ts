import { mkdtemp, readFile, rm } from "node:fs/promises";
import os from "node:os";
import path from "node:path";

import { syncJobs } from "@/jobs/sync";
import { JOB_SOURCES } from "@/jobs/sources";
import type { SourceDefinition } from "@/jobs/types";

const fixtures: Record<string, string> = {
  simplify_summer_2026: `
<table>
<tbody>
<tr><td><strong>SpotHero</strong></td><td>Engineering Intern</td><td>Chicago, IL</td><td><a href="https://spothero.com/careers/7695956/?utm_source=Simplify">Apply</a></td><td>0d</td></tr>
</tbody>
</table>`,
  vansh_summer_2026: `
| Company | Role | Location | Application/Link | Date Posted |
| ------- | ---- | -------- | ---------------- | ----------- |
| **Ramp** | Software Engineer Intern | Remote | <a href="https://jobs.ashbyhq.com/ramp/intern?utm_source=vansh">Apply</a> | Mar 09 |`,
  simplify_new_grad_2026: `
<table>
<tbody>
<tr><td><strong>Cadence</strong></td><td>Software Engineer 1</td><td>San Jose, CA</td><td><a href="https://cadence.com/job?id=1&utm_source=Simplify">Apply</a></td><td>0d</td></tr>
</tbody>
</table>`,
  vansh_new_grad_2026: `
| Company | Role | Location | Application/Link | Date Posted |
| ------- | ---- | -------- | ---------------- | ----------- |
| **Cadence** | Software Engineer 1 | San Jose, CA | <a href="https://cadence.com/job?id=1&utm_source=vansh">Apply</a> | Mar 09 |`,
  jobright_new_grad_2026: `
| Company | Job Title | Location | Work Model | Date Posted |
| ----- | --------- | --------- | ---- | ------- |
| **[Scout AI](https://www.scout-ai.app/)** | **[Firmware Engineer](https://jobright.ai/jobs/info/69326e14a0dde7020e2e6ec6?utm_source=1103)** | Sunnyvale, CA | Hybrid | Mar 09 |`,
};

async function createTempDir() {
  return mkdtemp(path.join(os.tmpdir(), "jobs-sync-"));
}

function fixtureFetch(source: SourceDefinition): Promise<string> {
  const fixture = fixtures[source.id];
  if (!fixture) {
    return Promise.reject(new Error(`Missing fixture for ${source.id}`));
  }

  return Promise.resolve(fixture);
}

describe("syncJobs", () => {
  it("writes the three output files and merges duplicates across sources", async () => {
    const outputDir = await createTempDir();

    try {
      const result = await syncJobs({
        outputDir,
        now: new Date("2026-03-09T15:00:00Z"),
        timezone: "America/Chicago",
        fetchSource: fixtureFetch,
      });

      expect(result.meta.activeJobCount).toBe(4);
      expect(result.meta.todayJobCount).toBe(4);

      const jobs = JSON.parse(await readFile(path.join(outputDir, "jobs.json"), "utf8"));
      const index = JSON.parse(await readFile(path.join(outputDir, "jobs-index.json"), "utf8"));
      const today = JSON.parse(await readFile(path.join(outputDir, "jobs-today.json"), "utf8"));
      const meta = JSON.parse(await readFile(path.join(outputDir, "jobs-meta.json"), "utf8"));

      expect(jobs.jobs).toHaveLength(4);
      expect(index.jobs).toHaveLength(4);
      expect(index.pageSize).toBe(50);
      expect(today.jobs).toHaveLength(4);
      expect(meta.sourceCounts).toMatchObject(
        Object.fromEntries(JOB_SOURCES.map((source) => [source.id, 1])),
      );

      const cadence = jobs.jobs.find((job: { company: string; role: string }) => job.company === "Cadence");
      expect(cadence.sources).toHaveLength(2);
    } finally {
      await rm(outputDir, { recursive: true, force: true });
    }
  });

  it("fails when fewer than four sources succeed", async () => {
    const outputDir = await createTempDir();

    try {
      await expect(
        syncJobs({
          outputDir,
          now: new Date("2026-03-09T15:00:00Z"),
          timezone: "America/Chicago",
          fetchSource: async (source) => {
            if (source.id === "jobright_new_grad_2026" || source.id === "vansh_new_grad_2026") {
              throw new Error("boom");
            }

            return fixtureFetch(source);
          },
        }),
      ).rejects.toThrow("only 3 of 5 sources succeeded");
    } finally {
      await rm(outputDir, { recursive: true, force: true });
    }
  });
});
