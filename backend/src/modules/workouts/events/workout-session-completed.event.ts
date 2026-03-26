/** Emitted when a workout session is completed. */
export class WorkoutSessionCompletedEvent {
  constructor(
    public readonly userId: string,
    public readonly sessionId: string,
    public readonly dayId: string | null,
    public readonly totalVolume: number,
    public readonly totalSets: number,
    public readonly durationMinutes: number,
    public readonly completedAt: Date,
  ) {}
}
