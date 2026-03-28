import { Module } from '@nestjs/common';
import { ExercisesModule } from '../exercises/exercises.module';
import { WorkoutPlanController } from './controllers/workout-plan.controller';
import { WorkoutSessionController } from './controllers/workout-session.controller';
import { WorkoutAnalyticsController } from './controllers/workout-analytics.controller';
import { WorkoutPlanService } from './services/workout-plan.service';
import { WorkoutSessionService } from './services/workout-session.service';
import { WorkoutAnalyticsService } from './services/workout-analytics.service';
import { WorkoutFacade } from './facades/workout.facade';
import { WorkoutPlanFactory } from './factories/workout-plan.factory';
import { WorkoutPlanRepository } from './repositories/workout-plan.repository';
import { WorkoutDayRepository } from './repositories/workout-day.repository';
import { WorkoutSessionRepository } from './repositories/workout-session.repository';
import {
  WORKOUT_PLAN_REPOSITORY,
  WORKOUT_DAY_REPOSITORY,
  WORKOUT_SESSION_REPOSITORY,
} from './interfaces';

@Module({
  imports: [ExercisesModule],
  controllers: [WorkoutPlanController, WorkoutSessionController, WorkoutAnalyticsController],
  providers: [
    WorkoutPlanService,
    WorkoutSessionService,
    WorkoutAnalyticsService,
    WorkoutFacade,
    WorkoutPlanFactory,
    { provide: WORKOUT_PLAN_REPOSITORY, useClass: WorkoutPlanRepository },
    { provide: WORKOUT_DAY_REPOSITORY, useClass: WorkoutDayRepository },
    { provide: WORKOUT_SESSION_REPOSITORY, useClass: WorkoutSessionRepository },
  ],
  exports: [WorkoutSessionService],
})
export class WorkoutsModule {}
