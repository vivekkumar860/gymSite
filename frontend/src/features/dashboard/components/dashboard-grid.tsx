"use client";

import { TodaysWorkoutSection } from "./todays-workout-section";
import { CalorieProgressSection } from "./calorie-progress-section";
import { ProteinProgressSection } from "./protein-progress-section";
import { WaterTargetSection } from "./water-target-section";
import { SleepSummarySection } from "./sleep-summary-section";
import { HabitsChecklistSection } from "./habits-checklist-section";
import { StreakCountSection } from "./streak-count-section";
import { WeightTrendSection } from "./weight-trend-section";
import { WeeklySummarySection } from "./weekly-summary-section";

export function DashboardGrid() {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
      <div className="md:col-span-2 lg:col-span-2">
        <TodaysWorkoutSection />
      </div>

      <StreakCountSection />

      <CalorieProgressSection />
      <ProteinProgressSection />
      <WaterTargetSection />

      <SleepSummarySection />
      <div className="md:col-span-2">
        <HabitsChecklistSection />
      </div>

      <div className="md:col-span-2">
        <WeightTrendSection />
      </div>

      <div className="md:col-span-2 lg:col-span-3">
        <WeeklySummarySection />
      </div>
    </div>
  );
}
