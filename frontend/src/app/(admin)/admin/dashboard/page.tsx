import type { Metadata } from "next";
import { AdminDashboardView } from "@/features/admin";

export const metadata: Metadata = {
  title: "Admin Dashboard - FitTrack",
};

export default function AdminDashboardPage() {
  return <AdminDashboardView />;
}
