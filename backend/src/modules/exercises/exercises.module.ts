import { Module } from '@nestjs/common';
import { ExerciseController } from './controllers/exercise.controller';
import { AdminExerciseController } from './controllers/admin-exercise.controller';
import { ExerciseService } from './services/exercise.service';
import { ExerciseRepository } from './repositories/exercise.repository';
import { EXERCISE_REPOSITORY } from './interfaces';

@Module({
  controllers: [ExerciseController, AdminExerciseController],
  providers: [
    ExerciseService,
    { provide: EXERCISE_REPOSITORY, useClass: ExerciseRepository },
  ],
  exports: [ExerciseService, EXERCISE_REPOSITORY],
})
export class ExercisesModule {}
