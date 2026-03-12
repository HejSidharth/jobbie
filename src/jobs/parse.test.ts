import { readFileSync } from "node:fs";
import path from "node:path";

import { parseSourceReadme } from "@/jobs/parse";
import { JOB_SOURCES } from "@/jobs/sources";

function loadFixture(name: string): string {
  return readFileSync(path.resolve(__dirname, "__fixtures__", name), "utf8");
}

describe("parseSourceReadme", () => {
  it("parses simplify HTML table rows", () => {
    const result = parseSourceReadme(JOB_SOURCES[0], loadFixture("simplify.md"));
    expect(result.rows).toHaveLength(2);
    expect(result.rows[0]).toMatchObject({
      company: "SpotHero",
      role: "Engineering Intern",
      location: "Chicago, IL",
      applicationUrl: "https://spothero.com/careers/7695956/?utm_source=Simplify&ref=Simplify",
      sourcePostedText: "0d",
    });
  });

  it("parses markdown table rows", () => {
    const result = parseSourceReadme(JOB_SOURCES[1], loadFixture("vansh.md"));
    expect(result.rows).toHaveLength(2);
    expect(result.rows[0]).toMatchObject({
      company: "Ramp",
      role: "Software Engineer Intern",
      location: "New York, NY, Remote",
      sourcePostedText: "Mar 09",
    });
  });

  it("parses jobright markdown rows", () => {
    const result = parseSourceReadme(JOB_SOURCES[4], loadFixture("jobright.md"));
    expect(result.rows).toHaveLength(2);
    expect(result.rows[0]).toMatchObject({
      company: "Scout AI",
      role: "Firmware Engineer",
      location: "Sunnyvale, CA",
      sourcePostedText: "Mar 09",
    });
  });
});
