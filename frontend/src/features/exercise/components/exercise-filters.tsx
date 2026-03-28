"use client";

import type { ExerciseFilters as ExerciseFiltersType } from "../types/exercise.types";
import { Input } from "@/components/ui/input";
import { SearchIcon } from "lucide-react";
import { cn } from "@/lib/utils";

const MUSCLE_GROUPS = [
  { value: "CHEST", label: "Chest" },
  { value: "BACK", label: "Back" },
  { value: "SHOULDERS", label: "Shoulders" },
  { value: "BICEPS", label: "Biceps" },
  { value: "TRICEPS", label: "Triceps" },
  { value: "FOREARMS", label: "Forearms" },
  { value: "QUADRICEPS", label: "Quads" },
  { value: "HAMSTRINGS", label: "Hamstrings" },
  { value: "GLUTES", label: "Glutes" },
  { value: "CALVES", label: "Calves" },
  { value: "CORE", label: "Core" },
  { value: "FULL_BODY", label: "Full Body" },
] as const;

const EQUIPMENT = [
  { value: "BARBELL", label: "Barbell" },
  { value: "DUMBBELL", label: "Dumbbell" },
  { value: "CABLE", label: "Cable" },
  { value: "MACHINE", label: "Machine" },
  { value: "BODYWEIGHT", label: "Bodyweight" },
  { value: "KETTLEBELL", label: "Kettlebell" },
  { value: "RESISTANCE_BAND", label: "Band" },
  { value: "OTHER", label: "Other" },
] as const;

type ExerciseFiltersProps = {
  filters: ExerciseFiltersType;
  onFiltersChange: (filters: ExerciseFiltersType) => void;
};

export function ExerciseFilters({
  filters,
  onFiltersChange,
}: ExerciseFiltersProps) {
  return (
    <div className="space-y-4">
      {/* Search */}
      <div className="relative">
        <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
        <Input
          placeholder="Search exercises..."
          value={filters.search ?? ""}
          onChange={(e) =>
            onFiltersChange({ ...filters, search: e.target.value || undefined })
          }
          className="pl-10 glass rounded-xl border-border/30 focus:border-primary/40 focus:ring-primary/20 sm:max-w-sm"
        />
      </div>

      {/* Muscle group chips */}
      <div className="space-y-2">
        <p className="font-mono text-[10px] uppercase tracking-widest text-primary/60">Muscle Group</p>
        <div className="flex flex-wrap gap-2">
          <FilterChip
            label="All"
            isActive={!filters.primaryMuscle}
            onClick={() => onFiltersChange({ ...filters, primaryMuscle: undefined })}
          />
          {MUSCLE_GROUPS.map((group) => (
            <FilterChip
              key={group.value}
              label={group.label}
              isActive={filters.primaryMuscle === group.value}
              onClick={() =>
                onFiltersChange({
                  ...filters,
                  primaryMuscle: filters.primaryMuscle === group.value ? undefined : group.value,
                })
              }
            />
          ))}
        </div>
      </div>

      {/* Equipment chips */}
      <div className="space-y-2">
        <p className="font-mono text-[10px] uppercase tracking-widest text-primary/60">Equipment</p>
        <div className="flex flex-wrap gap-2">
          <FilterChip
            label="All"
            isActive={!filters.equipment}
            onClick={() => onFiltersChange({ ...filters, equipment: undefined })}
          />
          {EQUIPMENT.map((eq) => (
            <FilterChip
              key={eq.value}
              label={eq.label}
              isActive={filters.equipment === eq.value}
              onClick={() =>
                onFiltersChange({
                  ...filters,
                  equipment: filters.equipment === eq.value ? undefined : eq.value,
                })
              }
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function FilterChip({
  label,
  isActive,
  onClick,
}: {
  label: string;
  isActive: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "rounded-full px-3 py-1.5 text-sm font-medium transition-all duration-200",
        isActive
          ? "bg-primary text-primary-foreground glow-sm"
          : "glass border border-border/30 text-muted-foreground hover:border-primary/40 hover:text-foreground"
      )}
    >
      {label}
    </button>
  );
}
