import { fireEvent, render, screen, waitFor } from "@testing-library/react";

import { JobsExplorer } from "@/components/jobs/JobsExplorer";

const jobsPayload = {
  generatedAt: "2026-03-26T00:00:00.000Z",
  timezone: "America/Chicago",
  pageSize: 50,
  totalJobs: 2,
  jobs: [
    {
      id: "job-1",
      category: "intern",
      company: "Acme",
      role: "Frontend Engineer Intern",
      location: "Remote",
      applicationUrl: "https://example.com/job-1",
      postedDate: "2026-03-25",
      isPostedToday: true,
    },
    {
      id: "job-2",
      category: "new_grad",
      company: "Beta",
      role: "Software Engineer",
      location: "Austin, TX",
      applicationUrl: "https://example.com/job-2",
      postedDate: "2026-03-24",
      isPostedToday: false,
    },
  ],
};

const metaPayload = {
  generatedAt: "2026-03-26T00:00:00.000Z",
  timezone: "America/Chicago",
  activeJobCount: 2,
  todayJobCount: 1,
  parseWarnings: [],
};

describe("JobsExplorer", () => {
  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
    vi.stubGlobal("fetch", vi.fn(async (input: RequestInfo | URL) => {
      const url = String(input);
      const payload = url.includes("jobs-meta.json") ? metaPayload : jobsPayload;

      return new Response(JSON.stringify(payload), {
        status: 200,
        headers: {
          "content-type": "application/json",
        },
      });
    }));
    window.scrollTo = vi.fn();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("archives a job out of the main list and keeps it in archived storage", async () => {
    render(<JobsExplorer />);

    expect(await screen.findByText("Frontend Engineer Intern")).toBeInTheDocument();

    fireEvent.click(screen.getByLabelText("Archive job"));

    await waitFor(() => {
      expect(screen.queryByText("Frontend Engineer Intern")).not.toBeInTheDocument();
    });

    expect(localStorage.getItem("jobbie-archived-jobs")).toBe(JSON.stringify(["job-1"]));

    fireEvent.click(screen.getByRole("button", { name: "Archived" }));

    expect(await screen.findByText("Frontend Engineer Intern")).toBeInTheDocument();
  });
});
