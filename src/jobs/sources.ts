import type { SourceDefinition } from "@/jobs/types";

export const JOBS_TIMEZONE = "America/Chicago";

export const JOB_SOURCES: SourceDefinition[] = [
  {
    id: "simplify_summer_2026",
    label: "Simplify Summer 2026 Internships",
    category: "intern",
    branch: "dev",
    rawReadmeUrl: "https://raw.githubusercontent.com/SimplifyJobs/Summer2026-Internships/dev/README.md",
    sourceType: "simplify_html_table",
  },
  {
    id: "vansh_summer_2026",
    label: "Vansh Summer 2026 Internships",
    category: "intern",
    branch: "dev",
    rawReadmeUrl: "https://raw.githubusercontent.com/vanshb03/Summer2026-Internships/dev/README.md",
    sourceType: "markdown_table",
  },
  {
    id: "simplify_new_grad_2026",
    label: "Simplify New Grad 2026",
    category: "new_grad",
    branch: "dev",
    rawReadmeUrl: "https://raw.githubusercontent.com/SimplifyJobs/New-Grad-Positions/dev/README.md",
    sourceType: "simplify_html_table",
  },
  {
    id: "vansh_new_grad_2026",
    label: "Vansh New Grad 2026",
    category: "new_grad",
    branch: "dev",
    rawReadmeUrl: "https://raw.githubusercontent.com/vanshb03/New-Grad-2026/dev/README.md",
    sourceType: "markdown_table",
  },
  {
    id: "jobright_new_grad_2026",
    label: "Jobright New Grad 2026",
    category: "new_grad",
    branch: "master",
    rawReadmeUrl: "https://raw.githubusercontent.com/jobright-ai/2026-Software-Engineer-New-Grad/master/README.md",
    sourceType: "jobright_markdown_table",
  },
];
