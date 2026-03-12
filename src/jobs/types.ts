export type JobCategory = "intern" | "new_grad";

export type SourceType = "simplify_html_table" | "markdown_table" | "jobright_markdown_table";

export type SourceDefinition = {
  id: string;
  label: string;
  category: JobCategory;
  branch: string;
  rawReadmeUrl: string;
  sourceType: SourceType;
};

export type ParsedJobRow = {
  company: string;
  role: string;
  location: string;
  applicationUrl: string;
  sourcePostedText: string;
  category: JobCategory;
  sourceId: string;
  sourceRowHash: string;
  sourceCompanyText: string;
  sourceRoleText: string;
};

export type CanonicalJobSource = {
  sourceId: string;
  sourcePostedText: string;
};

export type CanonicalJob = {
  id: string;
  category: JobCategory;
  company: string;
  role: string;
  location: string;
  applicationUrl: string;
  postedDate: string;
  isPostedToday: boolean;
  firstSeenAt: string;
  lastSeenAt: string;
  sources: CanonicalJobSource[];
};

export type JobSummary = Pick<
  CanonicalJob,
  "id" | "category" | "company" | "role" | "location" | "applicationUrl" | "postedDate" | "isPostedToday"
>;

export type JobsFile = {
  generatedAt: string;
  timezone: string;
  jobs: CanonicalJob[];
};

export type JobsIndexFile = {
  generatedAt: string;
  timezone: string;
  pageSize: number;
  totalJobs: number;
  jobs: JobSummary[];
};

export type JobsMetaFile = {
  generatedAt: string;
  timezone: string;
  sourceCounts: Record<string, number>;
  activeJobCount: number;
  todayJobCount: number;
  parseWarnings: string[];
};

export type ParseResult = {
  rows: ParsedJobRow[];
  warnings: string[];
};

export type SyncResult = {
  jobs: JobsFile;
  jobsToday: JobsFile;
  meta: JobsMetaFile;
};
