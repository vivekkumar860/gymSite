import type { Metadata } from "next";
import { AdminUsersView } from "@/features/admin";

export const metadata: Metadata = {
  title: "Manage Users - FitTrack Admin",
};

export default function AdminUsersPage() {
  return <AdminUsersView />;
}
