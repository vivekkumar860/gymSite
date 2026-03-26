import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { DOMAIN_EVENTS } from '../../../common/constants';
import { WorkoutSessionCompletedEvent } from '../../workouts/events/workout-session-completed.event';

/**
 * Listens for workout completion events and processes them for progress tracking.
 * Currently logs the event — extend to record PRs, update streaks, etc.
 */
@Injectable()
export class WorkoutCompletedListener {
  private readonly logger = new Logger(WorkoutCompletedListener.name);

  @OnEvent(DOMAIN_EVENTS.WORKOUT_SESSION_COMPLETED)
  async handle(event: WorkoutSessionCompletedEvent): Promise<void> {
    this.logger.log(
      `Workout completed for user ${event.userId}: ${event.totalSets} sets, ${event.totalVolume} volume, ${event.durationMinutes}min`,
    );
  }
}
