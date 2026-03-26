import { describe, it, expect, vi, beforeEach } from "vitest";
import { getWeightTrend, getWaterTarget, getWeeklySummary } from "../dashboard.service";
import { clearTokens, storeTokens } from "../../client";

const mockFetch = vi.fn();
vi.stubGlobal("fetch", mockFetch);

function jsonResponse(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

describe("dashboard.service", () => {
  beforeEach(() => {
    mockFetch.mockReset();
    clearTokens();
    storeTokens("test-token", "test-refresh");
  });

  describe("getWeightTrend", () => {
    it("maps progress entries to weight trend response", async () => {
      const entries = [
        { id: "e1", metricType: "BODY_WEIGHT", recordedValue: 80.5, recordedAt: "2025-06-10", notes: null },
        { id: "e2", metricType: "BODY_WEIGHT", recordedValue: 81.0, recordedAt: "2025-06-09", notes: null },
        { id: "e3", metricType: "BODY_WEIGHT", recordedValue: 81.2, recordedAt: "2025-06-08", notes: null },
      ];
      mockFetch.mockResolvedValueOnce(jsonResponse(entries));

      const result = await getWeightTrend(14);

      expect(result.currentWeight).toBe(80.5);
      expect(result.changeFromLast).toBe(-0.5);
      expect(result.unit).toBe("kg");
      // Entries should be reversed for chart (oldest first)
      expect(result.entries).toHaveLength(3);
      expect(result.entries[0].weight).toBe(81.2);
      expect(result.entries[2].weight).toBe(80.5);
    });

    it("returns empty trend when no entries exist", async () => {
      mockFetch.mockResolvedValueOnce(jsonResponse([]));

      const result = await getWeightTrend(14);

      expect(result.entries).toHaveLength(0);
      expect(result.currentWeight).toBeNull();
      expect(result.changeFromLast).toBeNull();
    });

    it("handles single entry (no changeFromLast)", async () => {
      const entries = [
        { id: "e1", metricType: "BODY_WEIGHT", recordedValue: 75.0, recordedAt: "2025-06-10", notes: null },
      ];
      mockFetch.mockResolvedValueOnce(jsonResponse(entries));

      const result = await getWeightTrend(14);

      expect(result.currentWeight).toBe(75.0);
      expect(result.changeFromLast).toBeNull();
      expect(result.entries).toHaveLength(1);
    });
  });

  describe("getWeeklySummary", () => {
    it("returns parsed weekly summary from backend", async () => {
      const backendResponse = {
        days: [
          { date: "2026-03-18", dayLabel: "Wed", workoutCompleted: true, habitsCompleted: 3, habitsTotal: 5 },
          { date: "2026-03-19", dayLabel: "Thu", workoutCompleted: false, habitsCompleted: 2, habitsTotal: 5 },
          { date: "2026-03-20", dayLabel: "Fri", workoutCompleted: true, habitsCompleted: 5, habitsTotal: 5 },
          { date: "2026-03-21", dayLabel: "Sat", workoutCompleted: false, habitsCompleted: 0, habitsTotal: 5 },
          { date: "2026-03-22", dayLabel: "Sun", workoutCompleted: false, habitsCompleted: 1, habitsTotal: 5 },
          { date: "2026-03-23", dayLabel: "Mon", workoutCompleted: true, habitsCompleted: 4, habitsTotal: 5 },
          { date: "2026-03-24", dayLabel: "Tue", workoutCompleted: false, habitsCompleted: 0, habitsTotal: 5 },
        ],
        workoutsCompleted: 3,
        workoutsPlanned: 4,
      };
      mockFetch.mockResolvedValueOnce(jsonResponse(backendResponse));

      const result = await getWeeklySummary();

      expect(result).not.toBeNull();
      expect(result!.days).toHaveLength(7);
      expect(result!.workoutsCompleted).toBe(3);
      expect(result!.workoutsPlanned).toBe(4);
      expect(result!.days[0].workoutCompleted).toBe(true);
      expect(result!.days[0].habitsCompleted).toBe(3);
    });

    it("returns null when backend returns an error", async () => {
      mockFetch.mockResolvedValueOnce(
        jsonResponse({ message: "Internal server error" }, 500),
      );

      const result = await getWeeklySummary();
      expect(result).toBeNull();
    });
  });

  describe("unsupported features return null", () => {
    it("getWaterTarget returns null", async () => {
      const result = await getWaterTarget("2025-06-10");
      expect(result).toBeNull();
    });
  });
});
