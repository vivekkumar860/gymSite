import type { Metadata } from "next";
import { AdminUserDetailView } from "@/features/admin";

export const metadata: Metadata = {
  title: "User Detail - FitTrack Admin",
};

export default async function AdminUserDetailPage({
  params,
}: {
  params: Promise<{ userId: string }>;
}) {
  const { userId } = await params;
  return <AdminUserDetailView userId={userId} />;
}
