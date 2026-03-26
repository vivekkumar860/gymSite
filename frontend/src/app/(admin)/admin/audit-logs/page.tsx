import type { Metadata } from "next";
import { AdminAuditLogsView } from "@/features/admin";

export const metadata: Metadata = {
  title: "Audit Logs - FitTrack Admin",
};

export default function AdminAuditLogsPage() {
  return <AdminAuditLogsView />;
}
