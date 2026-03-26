"use client";

import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  MUSCLE_GROUPS,
  EQUIPMENT_TYPES,
  DIFFICULTY_LEVELS,
} from "../schemas/exercise-form-schema";
import type { AdminExerciseFilterState } from "../../types/admin.types";

type ExerciseFiltersProps = {
  filters: AdminExerciseFilterState;
  onFiltersChange: (filters: AdminExerciseFilterState) => void;
};

export function ExerciseFilters({
  filters,
  onFiltersChange,
}: ExerciseFiltersProps) {
  const updateFilter = (key: keyof AdminExerciseFilterState, value: string | null) => {
    onFiltersChange({ ...filters, [key]: value ?? "all" });
  };

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
      <Input
        placeholder="Search exercises..."
        value={filters.search}
        onChange={(e) => updateFilter("search", e.target.value)}
        className="sm:max-w-xs"
      />

      <Select
        value={filters.primaryMuscle}
        onValueChange={(value) => updateFilter("primaryMuscle", value)}
      >
        <SelectTrigger className="w-44">
          <SelectValue placeholder="All muscles" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All muscles</SelectItem>
          {MUSCLE_GROUPS.map((muscle) => (
            <SelectItem key={muscle} value={muscle}>
              {muscle.replace(/_/g, " ")}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={filters.equipment}
        onValueChange={(value) => updateFilter("equipment", value)}
      >
        <SelectTrigger className="w-44">
          <SelectValue placeholder="All equipment" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All equipment</SelectItem>
          {EQUIPMENT_TYPES.map((eq) => (
            <SelectItem key={eq} value={eq}>
              {eq.replace(/_/g, " ")}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={filters.difficulty}
        onValueChange={(value) => updateFilter("difficulty", value)}
      >
        <SelectTrigger className="w-40">
          <SelectValue placeholder="All levels" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All levels</SelectItem>
          {DIFFICULTY_LEVELS.map((level) => (
            <SelectItem key={level} value={level}>
              {level}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={filters.isActive}
        onValueChange={(value) => updateFilter("isActive", value)}
      >
        <SelectTrigger className="w-36">
          <SelectValue placeholder="All status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All status</SelectItem>
          <SelectItem value="true">Active</SelectItem>
          <SelectItem value="false">Archived</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
