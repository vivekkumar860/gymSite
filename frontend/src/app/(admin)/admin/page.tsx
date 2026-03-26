import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { ROUTES } from "@/config/routes";

export const metadata: Metadata = {
  title: "Admin - FitTrack",
};

export default function AdminPage() {
  redirect(ROUTES.admin.dashboard);
}
