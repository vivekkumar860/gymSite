"use client";

import type { ExerciseFilters as ExerciseFiltersType } from "../types/exercise.types";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const MUSCLE_GROUPS = [
  { value: "CHEST", label: "Chest" },
  { value: "BACK", label: "Back" },
  { value: "SHOULDERS", label: "Shoulders" },
  { value: "BICEPS", label: "Biceps" },
  { value: "TRICEPS", label: "Triceps" },
  { value: "FOREARMS", label: "Forearms" },
  { value: "QUADRICEPS", label: "Quadriceps" },
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
  { value: "RESISTANCE_BAND", label: "Resistance Band" },
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
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
      <Input
        placeholder="Search exercises..."
        value={filters.search ?? ""}
        onChange={(e) =>
          onFiltersChange({ ...filters, search: e.target.value || undefined })
        }
        className="sm:max-w-xs"
      />

      <Select
        value={filters.primaryMuscle ?? ""}
        onValueChange={(value) =>
          onFiltersChange({
            ...filters,
            primaryMuscle: value || undefined,
          })
        }
      >
        <SelectTrigger>
          <SelectValue placeholder="Muscle group" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="">All muscles</SelectItem>
          {MUSCLE_GROUPS.map((group) => (
            <SelectItem key={group.value} value={group.value}>
              {group.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={filters.equipment ?? ""}
        onValueChange={(value) =>
          onFiltersChange({
            ...filters,
            equipment: value || undefined,
          })
        }
      >
        <SelectTrigger>
          <SelectValue placeholder="Equipment" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="">All equipment</SelectItem>
          {EQUIPMENT.map((eq) => (
            <SelectItem key={eq.value} value={eq.value}>
              {eq.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
