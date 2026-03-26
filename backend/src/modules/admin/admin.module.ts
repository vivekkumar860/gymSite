import { Module } from '@nestjs/common';

// Controllers
import { AdminDashboardController } from './controllers/admin-dashboard.controller';
import { AdminUserController } from './controllers/admin-user.controller';
import { AdminExerciseController } from './controllers/admin-exercise.controller';

// Services
import { AdminUserService } from './services/admin-user.service';
import { AdminExerciseService } from './services/admin-exercise.service';
import { AdminAuditService } from './services/admin-audit.service';

// Repositories
import { AdminUserRepository } from './repositories/admin-user.repository';
import { AdminExerciseRepository } from './repositories/admin-exercise.repository';
import { AdminAuditRepository } from './repositories/admin-audit.repository';

// Facades
import { AdminDashboardFacade } from './facades/admin-dashboard.facade';

@Module({
  controllers: [
    AdminDashboardController,
    AdminUserController,
    AdminExerciseController,
  ],
  providers: [
    // Services
    AdminUserService,
    AdminExerciseService,
    AdminAuditService,

    // Repositories
    AdminUserRepository,
    AdminExerciseRepository,
    AdminAuditRepository,

    // Facades
    AdminDashboardFacade,
  ],
})
export class AdminModule {}
