import type { CanonicalJob, ParsedJobRow } from "@/jobs/types";
import { parseMonthDayToPlainDate } from "@/jobs/date";
import { buildCanonicalJobs } from "@/jobs/normalize";
import { normalizeUrl } from "@/jobs/utils";

const baseRow: ParsedJobRow = {
  company: "Ramp",
  role: "Software Engineer",
  location: "New York, NY",
  applicationUrl: "https://jobs.ashbyhq.com/ramp/abc?utm_source=github&ref=vansh",
  sourcePostedText: "Mar 09",
  category: "new_grad",
  sourceId: "source_a",
  sourceRowHash: "row_a",
  sourceCompanyText: "Ramp",
  sourceRoleText: "Software Engineer",
};

describe("normalizeUrl", () => {
  it("strips common tracking params", () => {
    expect(normalizeUrl(baseRow.applicationUrl)).toBe("https://jobs.ashbyhq.com/ramp/abc");
  });
});

describe("parseMonthDayToPlainDate", () => {
  it("infers the previous year when the date would otherwise be too far in the future", () => {
    expect(parseMonthDayToPlainDate("Dec 31", { year: 2026, month: 1, day: 2 })).toEqual({
      year: 2025,
      month: 12,
      day: 31,
    });
  });
});

describe("buildCanonicalJobs", () => {
  it("inherits arrow companies and merges duplicate URLs across sources", () => {
    const existingJobs: CanonicalJob[] = [
      {
        id: "job_existing",
        category: "new_grad",
        company: "Ramp",
        role: "Software Engineer",
        location: "New York, NY",
        applicationUrl: "https://jobs.ashbyhq.com/ramp/abc",
        postedDate: "2026-03-08",
        isPostedToday: false,
        firstSeenAt: "2026-03-08T09:00:00-06:00",
        lastSeenAt: "2026-03-08T09:00:00-06:00",
        sources: [{ sourceId: "source_a", sourcePostedText: "Mar 08" }],
      },
    ];

    const result = buildCanonicalJobs({
      rows: [
        baseRow,
        {
          ...baseRow,
          sourceId: "source_b",
          sourceRowHash: "row_b",
          company: "↳",
        },
      ],
      existingJobs,
      now: new Date("2026-03-09T15:00:00Z"),
      timezone: "America/Chicago",
    });

    expect(result.jobs).toHaveLength(1);
    expect(result.jobs[0]).toMatchObject({
      company: "Ramp",
      role: "Software Engineer",
      applicationUrl: "https://jobs.ashbyhq.com/ramp/abc",
      postedDate: "2026-03-09",
      isPostedToday: true,
    });
    expect(result.jobs[0].sources).toHaveLength(2);
  });

  it("drops rows with unparseable dates", () => {
    const result = buildCanonicalJobs({
      rows: [{ ...baseRow, sourcePostedText: "unknown" }],
      existingJobs: [],
      now: new Date("2026-03-09T15:00:00Z"),
      timezone: "America/Chicago",
    });

    expect(result.jobs).toHaveLength(0);
    expect(result.warnings[0]).toContain("could not parse posted date");
  });
});
