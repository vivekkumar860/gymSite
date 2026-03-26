/** Emitted when a habit entry is logged. */
export class HabitEntryLoggedEvent {
  constructor(
    public readonly userId: string,
    public readonly habitId: string,
    public readonly entryDate: string,
    public readonly isCompleted: boolean,
  ) {}
}
