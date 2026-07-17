import { describe, it, expect, vi, afterEach } from "vitest";
import { analyticsToken } from "../src/utils/analytics";

afterEach(() => {
  vi.unstubAllEnvs();
});

describe("analyticsToken (beacon Cloudflare Web Analytics)", () => {
  it("è spento in dev, anche con token", () => {
    vi.stubEnv("PROD", false);
    vi.stubEnv("CF_BEACON_TOKEN", "tok");
    expect(analyticsToken()).toBeNull();
  });

  it("in produzione senza token resta spento", () => {
    vi.stubEnv("PROD", true);
    vi.stubEnv("CF_BEACON_TOKEN", "");
    expect(analyticsToken()).toBeNull();
  });

  it("in produzione con token è acceso", () => {
    vi.stubEnv("PROD", true);
    vi.stubEnv("CF_BEACON_TOKEN", "tok");
    expect(analyticsToken()).toBe("tok");
  });

  it("nelle anteprime Workers resta spento anche con token", () => {
    vi.stubEnv("PROD", true);
    vi.stubEnv("CF_BEACON_TOKEN", "tok");
    vi.stubEnv("WORKERS_CI_BRANCH", "feat/qualcosa");
    expect(analyticsToken()).toBeNull();
  });

  it("sul deploy di main (produzione reale) con token è acceso", () => {
    vi.stubEnv("PROD", true);
    vi.stubEnv("CF_BEACON_TOKEN", "tok");
    vi.stubEnv("WORKERS_CI_BRANCH", "main");
    expect(analyticsToken()).toBe("tok");
  });
});
