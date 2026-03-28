import { describe, it, expect } from "vitest";
import { toLogSetDto } from "../types/workout.types";
import type { LogSetFormValues } from "../types/workout.types";

describe("toLogSetDto", () => {
  const base: LogSetFormValues = {
    reps: 10,
    weight: 80,
    weightUnit: "kg",
    isWarmup: false,
    isFailure: false,
  };

  it("maps isFailure correctly (not as isDropSet)", () => {
    const dto = toLogSetDto({ ...base, isFailure: true }, "ex-1", 1);
    expect(dto.isFailure).toBe(true);
    expect(dto).not.toHaveProperty("isDropSet");
  });

  it("maps isFailure=false correctly", () => {
    const dto = toLogSetDto({ ...base, isFailure: false }, "ex-1", 1);
    expect(dto.isFailure).toBe(false);
  });

  it("converts lbs to kg", () => {
    const dto = toLogSetDto({ ...base, weight: 100, weightUnit: "lbs" }, "ex-1", 1);
    expect(dto.weightKg).toBeCloseTo(45.36, 1);
  });

  it("passes kg weight through unchanged", () => {
    const dto = toLogSetDto({ ...base, weight: 60, weightUnit: "kg" }, "ex-1", 1);
    expect(dto.weightKg).toBe(60);
  });

  it("includes all required backend fields", () => {
    const dto = toLogSetDto(base, "ex-1", 3);
    expect(dto).toEqual({
      exerciseId: "ex-1",
      setNumber: 3,
      weightKg: 80,
      repsCompleted: 10,
      rpe: undefined,
      isWarmup: false,
      isFailure: false,
    });
  });
});
