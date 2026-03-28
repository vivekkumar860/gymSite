"use client";

import { useState } from "react";
import { toast } from "sonner";
import { useMeasurements } from "../hooks/use-measurements";
import { useAddMeasurement } from "../hooks/use-add-measurement";
import { useProgressSummary } from "../hooks/use-progress-summary";
import { useVolumeByWeek } from "@/features/workout/hooks/use-volume-by-week";
import { usePersonalRecords } from "@/features/workout/hooks/use-personal-records";
import { useProgressPhotos } from "../hooks/use-progress-photos";
import { MeasurementForm } from "../components/measurement-form";
import { MeasurementChart } from "../components/measurement-chart";
import { ProgressPhotoGrid } from "../components/progress-photo-grid";
import { WeeklyVolumeChart } from "@/shared/components/weekly-volume-chart";
import { PageHeader } from "@/shared/components/page-header";
import { LoadingSkeleton } from "@/shared/components/loading-skeleton";
import { ErrorBoundaryCard } from "@/shared/components/error-boundary-card";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
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
  const { data: summary, isLoading: summaryLoading } = useProgressSummary();
  const { data: volumeData } = useVolumeByWeek(12);
  const { data: prs } = usePersonalRecords();
  const { photos: progressPhotos } = useProgressPhotos();

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
    return (
      <div className="min-h-screen mesh-bg space-y-6 p-4 md:p-6">
        <PageHeader title="Progress" />
        <LoadingSkeleton variant="card" count={4} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen mesh-bg space-y-6 p-4 md:p-6">
        <PageHeader title="Progress" />
        <ErrorBoundaryCard message="Failed to load progress data." />
      </div>
    );
  }

  return (
    <div className="min-h-screen mesh-bg space-y-6 p-4 md:p-6">
      <PageHeader title="Progress" description="Track your body measurements and strength gains.">
        <Button onClick={() => setDialogOpen(true)} className="glow-primary">Add Measurement</Button>
      </PageHeader>

      {/* Summary stats */}
      {summaryLoading ? (
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="glass card-depth-2 rounded-xl p-4 text-center space-y-2">
              <Skeleton className="h-3 w-16 mx-auto" />
              <Skeleton className="h-6 w-12 mx-auto" />
            </div>
          ))}
        </div>
      ) : summary ? (
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          <StatChip label="Workouts" value={String(summary.totalWorkouts)} />
          <StatChip label="Total Volume" value={`${summary.totalVolume.toLocaleString()} kg`} isHighlight />
          <StatChip label="Current Streak" value={`${summary.currentStreak} days`} />
          <StatChip label="Longest Streak" value={`${summary.longestStreak} days`} />
        </div>
      ) : null}

      {/* Volume chart */}
      {volumeData && volumeData.length > 0 && (
        <Card className="glass card-depth-2 rounded-2xl border-border/30 animate-slide-up" style={{ animationDelay: "50ms" }}>
          <CardHeader>
            <CardTitle className="font-mono text-xs uppercase tracking-widest text-primary/60">Weekly Volume (12 weeks)</CardTitle>
          </CardHeader>
          <CardContent>
            <WeeklyVolumeChart data={volumeData} height={200} />
          </CardContent>
        </Card>
      )}

      {/* Muscle distribution */}
      {summary && summary.muscleGroupDistribution.length > 0 && (
        <Card className="glass card-depth-2 rounded-2xl border-border/30 animate-slide-up" style={{ animationDelay: "100ms" }}>
          <CardHeader>
            <CardTitle className="font-mono text-xs uppercase tracking-widest text-primary/60">Muscle Group Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {summary.muscleGroupDistribution.map((mg, i) => {
                const maxSets = summary.muscleGroupDistribution[0].setCount;
                const pct = maxSets > 0 ? (mg.setCount / maxSets) * 100 : 0;
                return (
                  <div key={mg.muscle} className="space-y-1">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium">{mg.muscle.replace(/_/g, " ")}</span>
                      <span className="font-mono text-xs text-muted-foreground">{mg.setCount} sets</span>
                    </div>
                    <div className="h-2 rounded-full bg-muted/50">
                      <div
                        className="h-2 rounded-full bg-gradient-to-r from-primary to-primary/40 transition-all"
                        style={{ width: `${pct}%`, opacity: 1 - i * 0.08 }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* PRs table */}
      {prs && prs.length > 0 && (
        <Card className="glass card-depth-2 rounded-2xl border-border/30 animate-slide-up" style={{ animationDelay: "150ms" }}>
          <CardHeader>
            <CardTitle className="font-mono text-xs uppercase tracking-widest text-primary/60">Personal Records</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {prs.map((pr) => (
                <div key={pr.exerciseId} className="flex items-center justify-between rounded-xl glass px-4 py-3 transition-colors hover:bg-amber-500/5">
                  <span className="text-sm font-medium truncate">{pr.exerciseName}</span>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground shrink-0">
                    <span className="font-mono font-bold text-amber-400">{pr.maxWeight}kg</span>
                    <span className="font-mono">{pr.maxReps} reps</span>
                    <span className="font-mono font-bold text-foreground">{pr.maxVolume}kg vol</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <Tabs defaultValue="measurements">
        <TabsList className="glass rounded-full p-1">
          <TabsTrigger value="measurements" className="rounded-full data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Measurements</TabsTrigger>
          <TabsTrigger value="photos" className="rounded-full data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Photos</TabsTrigger>
        </TabsList>

        <TabsContent value="measurements" className="mt-4">
          <MeasurementChart measurements={measurements ?? []} />
        </TabsContent>

        <TabsContent value="photos" className="mt-4">
          <ProgressPhotoGrid photos={progressPhotos ?? []} />
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

function StatChip({ label, value, isHighlight }: { label: string; value: string; isHighlight?: boolean }) {
  return (
    <div className="glass card-depth-2 rounded-xl p-4 text-center space-y-1 animate-slide-up">
      <p className="font-mono text-[10px] font-semibold uppercase tracking-widest text-primary/60">{label}</p>
      <p className={`text-2xl font-black tabular-nums ${isHighlight ? "gradient-text" : ""}`}>{value}</p>
    </div>
  );
}
