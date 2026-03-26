/** Shape of a habit definition response. */
export interface HabitResponseDto {
  id: string;
  habitName: string;
  frequency: string;
  targetValue: number | null;
  unitLabel: string | null;
  isActive: boolean;
  colorHex: string | null;
  currentStreak: number;
  longestStreak: number;
}

/** Shape of a habit entry response. */
export interface HabitEntryResponseDto {
  id: string;
  habitId: string;
  entryDate: string;
  isCompleted: boolean;
  recordedValue: number | null;
  notes: string | null;
}
