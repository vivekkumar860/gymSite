"use client";

import { TodaysWorkoutSection } from "./todays-workout-section";
import { CalorieProgressSection } from "./calorie-progress-section";
import { ProteinProgressSection } from "./protein-progress-section";
import { HabitsChecklistSection } from "./habits-checklist-section";
import { StreakCountSection } from "./streak-count-section";
import { WeightTrendSection } from "./weight-trend-section";
import { WeeklySummarySection } from "./weekly-summary-section";

export function DashboardGrid() {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-12">
      {/* Row 1 */}
      <div className="md:col-span-7 animate-slide-up" style={{ animationDelay: "0ms" }}>
        <TodaysWorkoutSection />
      </div>
      <div className="md:col-span-2 animate-slide-up" style={{ animationDelay: "50ms" }}>
        <StreakCountSection />
      </div>
      <div className="md:col-span-3 animate-slide-up" style={{ animationDelay: "100ms" }}>
        <WeeklySummarySection />
      </div>

      {/* Row 2 */}
      <div className="md:col-span-3 animate-slide-up" style={{ animationDelay: "50ms" }}>
        <CalorieProgressSection />
      </div>
      <div className="md:col-span-3 animate-slide-up" style={{ animationDelay: "100ms" }}>
        <ProteinProgressSection />
      </div>
      <div className="md:col-span-6 animate-slide-up" style={{ animationDelay: "150ms" }}>
        <HabitsChecklistSection />
      </div>

      {/* Row 3 */}
      <div className="md:col-span-12 animate-slide-up" style={{ animationDelay: "100ms" }}>
        <WeightTrendSection />
      </div>
    </div>
  );
}
