"use client";

import { toast } from "sonner";
import { useProfile } from "../hooks/use-profile";
import { useUpdateProfile } from "../hooks/use-update-profile";
import { usePreferences } from "../hooks/use-preferences";
import { useUpdatePreferences } from "../hooks/use-update-preferences";
import { ProfileForm } from "../components/profile-form";
import { PreferencesForm } from "../components/preferences-form";
import { DangerZone } from "../components/danger-zone";
import { PageHeader } from "@/shared/components/page-header";
import { LoadingSkeleton } from "@/shared/components/loading-skeleton";
import { ErrorBoundaryCard } from "@/shared/components/error-boundary-card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export function SettingsView() {
  const { profile, isLoading: profileLoading, error: profileError } =
    useProfile();
  const { preferences, isLoading: prefsLoading, error: prefsError } =
    usePreferences();
  const updateProfile = useUpdateProfile();
  const updatePreferences = useUpdatePreferences();

  if (profileLoading || prefsLoading) {
    return <LoadingSkeleton variant="detail" />;
  }

  if (profileError || prefsError) {
    return <ErrorBoundaryCard message="Failed to load settings." />;
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Settings"
        description="Manage your profile and preferences."
      />

      <Tabs defaultValue="profile">
        <TabsList>
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="preferences">Preferences</TabsTrigger>
          <TabsTrigger value="account">Account</TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="mt-4">
          <ProfileForm
            defaultValues={
              profile
                ? {
                    firstName: profile.firstName ?? "",
                    lastName: profile.lastName ?? "",
                  }
                : undefined
            }
            onSubmit={(data) =>
              updateProfile.mutate(
                { firstName: data.firstName, lastName: data.lastName },
                {
                  onSuccess: () => toast.success("Profile updated"),
                  onError: (err) =>
                    toast.error(err.message || "Failed to update profile"),
                },
              )
            }
            isSubmitting={updateProfile.isPending}
          />
        </TabsContent>

        <TabsContent value="preferences" className="mt-4">
          <PreferencesForm
            defaultValues={preferences}
            onSubmit={(data) =>
              updatePreferences.mutate(data, {
                onSuccess: () => toast.success("Preferences saved"),
                onError: (err) =>
                  toast.error(err.message || "Failed to save preferences"),
              })
            }
            isSubmitting={updatePreferences.isPending}
          />
        </TabsContent>

        <TabsContent value="account" className="mt-4">
          <DangerZone />
        </TabsContent>
      </Tabs>
    </div>
  );
}
