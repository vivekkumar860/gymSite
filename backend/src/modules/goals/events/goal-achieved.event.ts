/** Emitted when a goal is marked as achieved. */
export class GoalAchievedEvent {
  constructor(
    public readonly userId: string,
    public readonly goalId: string,
    public readonly goalType: string,
    public readonly achievedAt: Date,
  ) {}
}
