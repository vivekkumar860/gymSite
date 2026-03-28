import { Global, Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ConfigModule } from '@nestjs/config';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { PrismaModule } from './infrastructure/database/prisma.module';
import { AuthModule } from './modules/auth/auth.module';
import { ProfilesModule } from './modules/profiles/profiles.module';
import { OnboardingModule } from './modules/onboarding/onboarding.module';
import { ExercisesModule } from './modules/exercises/exercises.module';
import { WorkoutsModule } from './modules/workouts/workouts.module';
import { NutritionModule } from './modules/nutrition/nutrition.module';
import { HabitsModule } from './modules/habits/habits.module';
import { GoalsModule } from './modules/goals/goals.module';
import { ProgressModule } from './modules/progress/progress.module';
import { AdminModule } from './modules/admin/admin.module';
import { HealthModule } from './modules/health/health.module';
import { FileStoragePort } from './infrastructure/adapters/storage/file-storage.port';
import { LocalStorageAdapter } from './infrastructure/adapters/storage/local-storage.adapter';
import { EmailPort } from './infrastructure/adapters/email/email.port';
import { ConsoleEmailAdapter } from './infrastructure/adapters/email/console-email.adapter';

/** Global infrastructure adapters — available to all modules without importing. */
@Global()
@Module({
  providers: [
    { provide: FileStoragePort, useClass: LocalStorageAdapter },
    { provide: EmailPort, useClass: ConsoleEmailAdapter },
  ],
  exports: [FileStoragePort, EmailPort],
})
class InfrastructureModule {}

@Module({
  imports: [
    // Global config — validates env vars at startup
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),

    // Event system for domain events
    EventEmitterModule.forRoot(),

    // Rate limiting — 100 requests per minute globally
    ThrottlerModule.forRoot([{ ttl: 60000, limit: 100 }]),

    // Database
    PrismaModule,

    // Global infrastructure adapters
    InfrastructureModule,

    // Feature modules — Phase 1: Identity
    AuthModule,
    ProfilesModule,
    OnboardingModule,

    // Phase 2: Core domain
    ExercisesModule,
    WorkoutsModule,
    NutritionModule,

    // Phase 3: Engagement
    HabitsModule,
    GoalsModule,
    ProgressModule,

    // Phase 4: Operations
    AdminModule,

    // Infrastructure
    HealthModule,
  ],
  providers: [
    // Apply rate limiting globally
    { provide: APP_GUARD, useClass: ThrottlerGuard },
  ],
})
export class AppModule {}
