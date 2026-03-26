"use client";

import type { AdminExercise } from "@/api/services/admin.service";
import { DataTable } from "@/shared/components/data-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type ExerciseTableProps = {
  exercises: AdminExercise[];
  isLoading?: boolean;
  onEdit: (exercise: AdminExercise) => void;
  onArchive: (id: string) => void;
  onUnarchive: (id: string) => void;
};

export function ExerciseTable({
  exercises,
  isLoading,
  onEdit,
  onArchive,
  onUnarchive,
}: ExerciseTableProps) {
  const columns = [
    {
      key: "exerciseName",
      header: "Name",
      render: (row: AdminExercise) => (
        <span className="font-medium">{row.exerciseName}</span>
      ),
    },
    {
      key: "primaryMuscle",
      header: "Muscle",
      render: (row: AdminExercise) => row.primaryMuscle.replace(/_/g, " "),
    },
    {
      key: "equipment",
      header: "Equipment",
      render: (row: AdminExercise) => row.equipment.replace(/_/g, " "),
    },
    {
      key: "difficulty",
      header: "Difficulty",
      render: (row: AdminExercise) => (
        <Badge
          variant={
            row.difficulty === "ADVANCED"
              ? "destructive"
              : row.difficulty === "INTERMEDIATE"
                ? "default"
                : "secondary"
          }
        >
          {row.difficulty}
        </Badge>
      ),
    },
    {
      key: "isActive",
      header: "Status",
      render: (row: AdminExercise) => (
        <Badge variant={row.isActive ? "default" : "outline"}>
          {row.isActive ? "Active" : "Archived"}
        </Badge>
      ),
    },
    {
      key: "actions",
      header: "Actions",
      render: (row: AdminExercise) => (
        <DropdownMenu>
          <DropdownMenuTrigger render={<Button variant="ghost" size="sm" />}>
            ...
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onEdit(row)}>
              Edit
            </DropdownMenuItem>
            {row.isActive ? (
              <DropdownMenuItem onClick={() => onArchive(row.id)}>
                Archive
              </DropdownMenuItem>
            ) : (
              <DropdownMenuItem onClick={() => onUnarchive(row.id)}>
                Unarchive
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  return (
    <DataTable<AdminExercise & Record<string, unknown>>
      columns={
        columns as Parameters<
          typeof DataTable<AdminExercise & Record<string, unknown>>
        >[0]["columns"]
      }
      data={exercises as (AdminExercise & Record<string, unknown>)[]}
      isLoading={isLoading}
      emptyMessage="No exercises found"
    />
  );
}
