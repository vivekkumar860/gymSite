import { describe, it, expect } from "vitest";
import { formatErrorMessage } from "../format-error";

describe("formatErrorMessage", () => {
  it("replaces 'Failed to fetch' with user-friendly message", () => {
    const msg = formatErrorMessage(new TypeError("Failed to fetch"));
    expect(msg).toContain("Unable to connect");
  });

  it("replaces 'NetworkError' with user-friendly message", () => {
    const msg = formatErrorMessage(new Error("NetworkError when attempting to fetch resource"));
    expect(msg).toContain("Unable to connect");
  });

  it("replaces 'Load failed' (Safari) with user-friendly message", () => {
    const msg = formatErrorMessage(new TypeError("Load failed"));
    expect(msg).toContain("Unable to connect");
  });

  it("passes through API error messages unchanged", () => {
    const msg = formatErrorMessage(new Error("Validation failed: email is required"));
    expect(msg).toBe("Validation failed: email is required");
  });

  it("returns fallback for null/undefined", () => {
    expect(formatErrorMessage(null)).toBe("Something went wrong. Please try again.");
    expect(formatErrorMessage(undefined)).toBe("Something went wrong. Please try again.");
  });

  it("uses custom fallback", () => {
    expect(formatErrorMessage(null, "Custom fallback")).toBe("Custom fallback");
  });

  it("handles string errors", () => {
    expect(formatErrorMessage("some error")).toBe("some error");
  });
});
