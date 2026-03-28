import { describe, it, expect } from "vitest";
import { generatePlanSchema } from "../schemas/generate-plan-schema";

describe("generatePlanSchema", () => {
  const valid = {
    goal: "GAIN_MUSCLE",
    experienceLevel: "INTERMEDIATE",
    daysPerWeek: 4,
    durationWeeks: 8,
    sessionDurationMinutes: 60,
    availableEquipment: ["BARBELL", "DUMBBELL"],
    injuryRestrictions: [],
  };

  it("accepts a valid input", () => {
    const result = generatePlanSchema.safeParse(valid);
    expect(result.success).toBe(true);
  });

  it("requires durationWeeks, sessionDurationMinutes and injuryRestrictions", () => {
    const minimal = {
      goal: "LOSE_WEIGHT",
      experienceLevel: "BEGINNER",
      daysPerWeek: 3,
      availableEquipment: ["BODYWEIGHT"],
    };
    const result = generatePlanSchema.safeParse(minimal);
    expect(result.success).toBe(false);

    const withAll = {
      ...minimal,
      durationWeeks: 8,
      sessionDurationMinutes: 60,
      injuryRestrictions: [],
    };
    expect(generatePlanSchema.safeParse(withAll).success).toBe(true);
  });

  it("rejects missing goal", () => {
    const { goal, ...rest } = valid;
    const result = generatePlanSchema.safeParse(rest);
    expect(result.success).toBe(false);
  });

  it("rejects missing experienceLevel", () => {
    const { experienceLevel, ...rest } = valid;
    const result = generatePlanSchema.safeParse(rest);
    expect(result.success).toBe(false);
  });

  it("rejects empty availableEquipment array", () => {
    const result = generatePlanSchema.safeParse({
      ...valid,
      availableEquipment: [],
    });
    expect(result.success).toBe(false);
  });

  it("rejects invalid goal value", () => {
    const result = generatePlanSchema.safeParse({
      ...valid,
      goal: "FLY_TO_MOON",
    });
    expect(result.success).toBe(false);
  });

  it("rejects daysPerWeek out of range", () => {
    expect(
      generatePlanSchema.safeParse({ ...valid, daysPerWeek: 0 }).success,
    ).toBe(false);
    expect(
      generatePlanSchema.safeParse({ ...valid, daysPerWeek: 8 }).success,
    ).toBe(false);
  });

  it("rejects sessionDurationMinutes out of range", () => {
    expect(
      generatePlanSchema.safeParse({ ...valid, sessionDurationMinutes: 10 })
        .success,
    ).toBe(false);
    expect(
      generatePlanSchema.safeParse({ ...valid, sessionDurationMinutes: 200 })
        .success,
    ).toBe(false);
  });

  it("rejects string numbers (valueAsNumber handles coercion in the form)", () => {
    const result = generatePlanSchema.safeParse({
      ...valid,
      daysPerWeek: "4",
      durationWeeks: "12",
      sessionDurationMinutes: "45",
    });
    expect(result.success).toBe(false);
  });
});
