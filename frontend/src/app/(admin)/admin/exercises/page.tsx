import type { Metadata } from "next";
import { AdminExercisesView } from "@/features/admin/exercises";

export const metadata: Metadata = {
  title: "Manage Exercises - FitTrack Admin",
};

export default function AdminExercisesPage() {
  return <AdminExercisesView />;
}
