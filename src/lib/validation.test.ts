import { defaultPortfolio } from "@/data/defaultPortfolio";
import { validatePortfolio } from "@/lib/validation";

describe("validatePortfolio", () => {
  it("accepts the seeded portfolio", () => {
    const result = validatePortfolio(defaultPortfolio);
    expect(result.errors).toHaveLength(0);
  });

  it("rejects invalid urls", () => {
    const invalid = JSON.parse(JSON.stringify(defaultPortfolio));
    invalid.featuredProjects[0].href = "not-a-url";

    const result = validatePortfolio(invalid);
    expect(result.errors.some((entry: string) => entry.includes("invalid link"))).toBe(true);
  });
});
