import { syncJobs } from "@/jobs/sync";

async function main() {
  const result = await syncJobs();
  console.log(
    `Synced ${result.meta.activeJobCount} active jobs and ${result.meta.todayJobCount} jobs posted today to public/data.`,
  );
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
