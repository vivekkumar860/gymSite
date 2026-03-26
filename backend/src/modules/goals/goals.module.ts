import { Module } from '@nestjs/common';
import { GoalController } from './controllers/goal.controller';
import { GoalService } from './services/goal.service';
import { GoalRepository } from './repositories/goal.repository';
import { GOAL_REPOSITORY } from './interfaces';

@Module({
  controllers: [GoalController],
  providers: [
    GoalService,
    { provide: GOAL_REPOSITORY, useClass: GoalRepository },
  ],
  exports: [GoalService],
})
export class GoalsModule {}
