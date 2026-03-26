"use client";

import { useState } from "react";
import { toast } from "sonner";
import { useMeasurements } from "../hooks/use-measurements";
import { useAddMeasurement } from "../hooks/use-add-measurement";
import { MeasurementForm } from "../components/measurement-form";
import { MeasurementChart } from "../components/measurement-chart";
import { ProgressPhotoGrid } from "../components/progress-photo-grid";
import { PageHeader } from "@/shared/components/page-header";
import { LoadingSkeleton } from "@/shared/components/loading-skeleton";
import { ErrorBoundaryCard } from "@/shared/components/error-boundary-card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import type { MeasurementFormSchema } from "../schemas/measurement-schema";

export function ProgressOverviewView() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const { measurements, isLoading, error } = useMeasurements();
  const addMeasurement = useAddMeasurement();

  function handleAddMeasurement(data: MeasurementFormSchema) {
    addMeasurement.mutate(data, {
      onSuccess: () => {
        setDialogOpen(false);
        toast.success("Measurement saved");
      },
      onError: (err) => {
        toast.error(err.message || "Failed to save measurement");
      },
    });
  }

  if (isLoading) {
    return <LoadingSkeleton variant="card" count={4} />;
  }

  if (error) {
    return (
      <ErrorBoundaryCard message="Failed to load progress data." />
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Progress" description="Track your body measurements and strength gains.">
        <Button onClick={() => setDialogOpen(true)}>Add Measurement</Button>
      </PageHeader>

      <Tabs defaultValue="measurements">
        <TabsList>
          <TabsTrigger value="measurements">Measurements</TabsTrigger>
          <TabsTrigger value="strength">Strength</TabsTrigger>
          <TabsTrigger value="photos">Photos</TabsTrigger>
        </TabsList>

        <TabsContent value="measurements" className="mt-4">
          <MeasurementChart
            measurements={measurements ?? []}
          />
        </TabsContent>

        <TabsContent value="strength" className="mt-4">
          <p className="py-8 text-center text-sm text-muted-foreground">
            Select an exercise to view strength progress.
          </p>
        </TabsContent>

        <TabsContent value="photos" className="mt-4">
          <ProgressPhotoGrid photos={[]} />
        </TabsContent>
      </Tabs>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Measurement</DialogTitle>
          </DialogHeader>
          <MeasurementForm
            onSubmit={handleAddMeasurement}
            isSubmitting={addMeasurement.isPending}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
