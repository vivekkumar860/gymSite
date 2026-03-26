/** Domain representation of a habit definition. */
export interface HabitDefinitionDomain {
  id: string;
  userId: string;
  habitName: string;
  frequency: string;
  targetValue: number | null;
  unitLabel: string | null;
  isActive: boolean;
  colorHex: string | null;
  createdAt: Date;
}

/** Domain representation of a habit entry. */
export interface HabitEntryDomain {
  id: string;
  habitId: string;
  entryDate: Date;
  isCompleted: boolean;
  recordedValue: number | null;
  notes: string | null;
}

/** Streak information for a habit. */
export interface HabitStreak {
  currentStreak: number;
  longestStreak: number;
}
