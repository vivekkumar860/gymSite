import type { Metadata } from "next";
import { NutritionDailyView } from "@/features/nutrition";

export const metadata: Metadata = {
  title: "Nutrition - FitTrack",
};

export default function NutritionPage() {
  return <NutritionDailyView />;
}
