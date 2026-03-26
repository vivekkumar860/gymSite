import { Module } from '@nestjs/common';
import { HabitController } from './controllers/habit.controller';
import { HabitService } from './services/habit.service';
import { HabitRepository } from './repositories/habit.repository';
import { StreakCalculatorService } from './services/streak-calculator.service';
import { HABIT_REPOSITORY } from './interfaces';

@Module({
  controllers: [HabitController],
  providers: [
    HabitService,
    { provide: HABIT_REPOSITORY, useClass: HabitRepository },
    StreakCalculatorService,
  ],
  exports: [HabitService, StreakCalculatorService],
})
export class HabitsModule {}
