import type { Metadata } from "next";
import { NutritionPlanView } from "@/features/nutrition/containers/nutrition-plan-view";

export const metadata: Metadata = {
  title: "Create Nutrition Plan - FitTrack",
};

export default function NutritionPlanPage() {
  return <NutritionPlanView />;
}
