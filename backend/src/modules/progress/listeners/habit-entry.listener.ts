import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { DOMAIN_EVENTS } from '../../../common/constants';
import { HabitEntryLoggedEvent } from '../../habits/events/habit-entry-logged.event';

/**
 * Listens for habit entry events and processes them for progress tracking.
 * Currently logs the event — extend to update goal progress, etc.
 */
@Injectable()
export class HabitEntryListener {
  private readonly logger = new Logger(HabitEntryListener.name);

  @OnEvent(DOMAIN_EVENTS.HABIT_ENTRY_LOGGED)
  async handle(event: HabitEntryLoggedEvent): Promise<void> {
    this.logger.log(
      `Habit entry for user ${event.userId}: habit ${event.habitId}, completed=${event.isCompleted}`,
    );
  }
}
