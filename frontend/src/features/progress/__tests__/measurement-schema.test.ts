import { describe, it, expect } from "vitest";
import {
  measurementFormSchema,
  MEASUREMENT_SITES,
} from "../schemas/measurement-schema";

const validPayload = {
  site: "CHEST" as const,
  valueCm: 95.5,
  measuredAt: "2026-03-26",
};

describe("measurementFormSchema", () => {
  it("accepts a valid payload with all required fields", () => {
    const result = measurementFormSchema.safeParse(validPayload);
    expect(result.success).toBe(true);
  });

  it("accepts optional notes", () => {
    const result = measurementFormSchema.safeParse({
      ...validPayload,
      notes: "Post-workout",
    });
    expect(result.success).toBe(true);
  });

  it("rejects a lowercase site value", () => {
    const result = measurementFormSchema.safeParse({
      ...validPayload,
      site: "chest",
    });
    expect(result.success).toBe(false);
  });

  it("rejects a free-text site value not in the enum", () => {
    const result = measurementFormSchema.safeParse({
      ...validPayload,
      site: "biceps",
    });
    expect(result.success).toBe(false);
  });

  it("rejects missing site", () => {
    const { site: _, ...noSite } = validPayload;
    const result = measurementFormSchema.safeParse(noSite);
    expect(result.success).toBe(false);
  });

  it("rejects non-positive valueCm", () => {
    const result = measurementFormSchema.safeParse({
      ...validPayload,
      valueCm: 0,
    });
    expect(result.success).toBe(false);
  });

  it("rejects notes over 300 characters", () => {
    const result = measurementFormSchema.safeParse({
      ...validPayload,
      notes: "x".repeat(301),
    });
    expect(result.success).toBe(false);
  });

  it("accepts all valid site enum values", () => {
    for (const site of MEASUREMENT_SITES) {
      const result = measurementFormSchema.safeParse({
        ...validPayload,
        site,
      });
      expect(result.success, `expected ${site} to be valid`).toBe(true);
    }
  });
});
