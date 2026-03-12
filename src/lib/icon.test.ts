import { parseDomain } from "@/lib/icon";

describe("parseDomain", () => {
  it("extracts hostname from full urls", () => {
    expect(parseDomain("https://www.example.com/path")).toBe("example.com");
  });

  it("extracts hostname from bare domains", () => {
    expect(parseDomain("faces.notion.com")).toBe("faces.notion.com");
  });
});
