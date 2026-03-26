import { Module } from '@nestjs/common';
import { HabitsModule } from '../habits/habits.module';
import { ProgressController } from './controllers/progress.controller';
import { ProgressCommandService } from './services/progress-command.service';
import { ProgressQueryService } from './services/progress-query.service';
import { ProgressFacade } from './facades/progress.facade';
import { ProgressRepository } from './repositories/progress.repository';
import { WorkoutCompletedListener } from './listeners/workout-completed.listener';
import { HabitEntryListener } from './listeners/habit-entry.listener';

@Module({
  imports: [HabitsModule],
  controllers: [ProgressController],
  providers: [
    ProgressCommandService,
    ProgressQueryService,
    ProgressFacade,
    ProgressRepository,
    WorkoutCompletedListener,
    HabitEntryListener,
  ],
  exports: [ProgressQueryService],
})
export class ProgressModule {}
