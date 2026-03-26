import type { Metadata } from "next";
import { SettingsView } from "@/features/settings";

export const metadata: Metadata = {
  title: "Settings - FitTrack",
};

export default function SettingsPage() {
  return <SettingsView />;
}
