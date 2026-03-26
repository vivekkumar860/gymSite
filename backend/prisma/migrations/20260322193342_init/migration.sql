-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('MEMBER', 'TRAINER', 'ADMIN');

-- CreateEnum
CREATE TYPE "AccountStatus" AS ENUM ('ACTIVE', 'SUSPENDED', 'DEACTIVATED');

-- CreateEnum
CREATE TYPE "AuthProvider" AS ENUM ('EMAIL', 'GOOGLE', 'APPLE');

-- CreateEnum
CREATE TYPE "BiologicalSex" AS ENUM ('MALE', 'FEMALE', 'NOT_SPECIFIED');

-- CreateEnum
CREATE TYPE "FitnessLevel" AS ENUM ('BEGINNER', 'INTERMEDIATE', 'ADVANCED');

-- CreateEnum
CREATE TYPE "DietaryPreference" AS ENUM ('NO_PREFERENCE', 'VEGETARIAN', 'VEGAN', 'KETO', 'PALEO', 'HALAL');

-- CreateEnum
CREATE TYPE "MuscleGroup" AS ENUM ('CHEST', 'BACK', 'SHOULDERS', 'BICEPS', 'TRICEPS', 'FOREARMS', 'QUADRICEPS', 'HAMSTRINGS', 'GLUTES', 'CALVES', 'CORE', 'FULL_BODY');

-- CreateEnum
CREATE TYPE "EquipmentType" AS ENUM ('BARBELL', 'DUMBBELL', 'CABLE', 'MACHINE', 'BODYWEIGHT', 'KETTLEBELL', 'RESISTANCE_BAND', 'OTHER');

-- CreateEnum
CREATE TYPE "ExerciseDifficulty" AS ENUM ('BEGINNER', 'INTERMEDIATE', 'ADVANCED');

-- CreateEnum
CREATE TYPE "MovementPattern" AS ENUM ('PUSH', 'PULL', 'HINGE', 'SQUAT', 'LUNGE', 'CARRY', 'ROTATION');

-- CreateEnum
CREATE TYPE "PlanStatus" AS ENUM ('DRAFT', 'ACTIVE', 'PAUSED', 'COMPLETED', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "SessionStatus" AS ENUM ('IN_PROGRESS', 'COMPLETED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "DietType" AS ENUM ('BULKING', 'CUTTING', 'MAINTENANCE', 'RECOMPOSITION');

-- CreateEnum
CREATE TYPE "MealPlanType" AS ENUM ('INDIAN_VEGETARIAN', 'INDIAN_NON_VEG', 'VEGAN', 'HOSTEL_BUDGET', 'OFFICE_GOING');

-- CreateEnum
CREATE TYPE "ActivityLevel" AS ENUM ('SEDENTARY', 'LIGHTLY_ACTIVE', 'MODERATELY_ACTIVE', 'VERY_ACTIVE', 'EXTREMELY_ACTIVE');

-- CreateEnum
CREATE TYPE "BudgetPreference" AS ENUM ('LOW', 'MEDIUM', 'HIGH');

-- CreateEnum
CREATE TYPE "HabitFrequency" AS ENUM ('DAILY', 'WEEKLY', 'CUSTOM');

-- CreateEnum
CREATE TYPE "ProgressMetricType" AS ENUM ('BODY_WEIGHT', 'BODY_FAT_PCT', 'RESTING_HEART_RATE');

-- CreateEnum
CREATE TYPE "MeasurementSite" AS ENUM ('NECK', 'CHEST', 'LEFT_BICEP', 'RIGHT_BICEP', 'WAIST', 'HIPS', 'LEFT_THIGH', 'RIGHT_THIGH', 'LEFT_CALF', 'RIGHT_CALF');

-- CreateEnum
CREATE TYPE "PhotoPose" AS ENUM ('FRONT_RELAXED', 'BACK_RELAXED', 'SIDE_LEFT', 'SIDE_RIGHT', 'FRONT_FLEXING', 'BACK_FLEXING');

-- CreateEnum
CREATE TYPE "GoalType" AS ENUM ('LOSE_WEIGHT', 'GAIN_MUSCLE', 'INCREASE_STRENGTH', 'IMPROVE_ENDURANCE', 'MAINTAIN', 'CUSTOM');

-- CreateEnum
CREATE TYPE "GoalStatus" AS ENUM ('ACTIVE', 'ACHIEVED', 'ABANDONED', 'EXPIRED');

-- CreateEnum
CREATE TYPE "OnboardingStep" AS ENUM ('PROFILE_CREATED', 'GOAL_SELECTED', 'FITNESS_LEVEL_SET', 'FIRST_PLAN_CREATED', 'FIRST_SESSION_LOGGED');

-- CreateEnum
CREATE TYPE "AdminActionType" AS ENUM ('CREATE', 'UPDATE', 'DELETE', 'SUSPEND_USER', 'RESTORE_USER');

-- CreateTable
CREATE TABLE "users" (
    "id" UUID NOT NULL,
    "username" VARCHAR(30) NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "role" "UserRole" NOT NULL DEFAULT 'MEMBER',
    "account_status" "AccountStatus" NOT NULL DEFAULT 'ACTIVE',
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "auth_credentials" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "provider" "AuthProvider" NOT NULL DEFAULT 'EMAIL',
    "password_hash" VARCHAR(255),
    "email_verified_at" TIMESTAMPTZ,
    "failed_login_count" SMALLINT NOT NULL DEFAULT 0,
    "locked_until" TIMESTAMPTZ,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "auth_credentials_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "auth_sessions" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "refresh_token" VARCHAR(512) NOT NULL,
    "device_name" VARCHAR(100),
    "ip_address" VARCHAR(45),
    "expires_at" TIMESTAMPTZ NOT NULL,
    "revoked_at" TIMESTAMPTZ,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "auth_sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "password_reset_tokens" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "token_hash" VARCHAR(255) NOT NULL,
    "expires_at" TIMESTAMPTZ NOT NULL,
    "used_at" TIMESTAMPTZ,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "password_reset_tokens_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "profiles" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "first_name" VARCHAR(50),
    "last_name" VARCHAR(50),
    "date_of_birth" DATE,
    "biological_sex" "BiologicalSex" NOT NULL DEFAULT 'NOT_SPECIFIED',
    "height_cm" DECIMAL(5,1),
    "fitness_level" "FitnessLevel" NOT NULL DEFAULT 'BEGINNER',
    "dietary_preference" "DietaryPreference" NOT NULL DEFAULT 'NO_PREFERENCE',
    "timezone" VARCHAR(50) NOT NULL DEFAULT 'UTC',
    "avatar_url" VARCHAR(500),
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "profiles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "onboarding_completions" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "step" "OnboardingStep" NOT NULL,
    "completed_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "onboarding_completions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "exercises" (
    "id" UUID NOT NULL,
    "exercise_name" VARCHAR(100) NOT NULL,
    "slug" VARCHAR(120) NOT NULL,
    "primary_muscle" "MuscleGroup" NOT NULL,
    "secondary_muscle" "MuscleGroup",
    "equipment" "EquipmentType" NOT NULL,
    "difficulty" "ExerciseDifficulty" NOT NULL DEFAULT 'BEGINNER',
    "movement_pattern" "MovementPattern",
    "instructions" TEXT,
    "video_url" VARCHAR(500),
    "is_compound" BOOLEAN NOT NULL DEFAULT false,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,
    "created_by" UUID,

    CONSTRAINT "exercises_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "workout_plans" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "plan_name" VARCHAR(100) NOT NULL,
    "description" TEXT,
    "plan_status" "PlanStatus" NOT NULL DEFAULT 'DRAFT',
    "goal_id" UUID,
    "duration_weeks" SMALLINT,
    "days_per_week" SMALLINT NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "workout_plans_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "workout_days" (
    "id" UUID NOT NULL,
    "plan_id" UUID NOT NULL,
    "day_name" VARCHAR(60) NOT NULL,
    "day_order" SMALLINT NOT NULL,
    "focus_area" VARCHAR(60),
    "scheduled_date" DATE,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "workout_days_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "workout_day_exercises" (
    "id" UUID NOT NULL,
    "day_id" UUID NOT NULL,
    "exercise_id" UUID NOT NULL,
    "exercise_order" SMALLINT NOT NULL,
    "target_sets" SMALLINT NOT NULL,
    "target_reps_min" SMALLINT NOT NULL,
    "target_reps_max" SMALLINT NOT NULL,
    "rest_seconds" SMALLINT NOT NULL DEFAULT 60,
    "notes" VARCHAR(300),
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "workout_day_exercises_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "workout_sessions" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "day_id" UUID,
    "session_status" "SessionStatus" NOT NULL DEFAULT 'IN_PROGRESS',
    "started_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completed_at" TIMESTAMPTZ,
    "notes" TEXT,
    "rating" SMALLINT,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "workout_sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "workout_set_logs" (
    "id" UUID NOT NULL,
    "session_id" UUID NOT NULL,
    "exercise_id" UUID NOT NULL,
    "set_number" SMALLINT NOT NULL,
    "weight_kg" DECIMAL(6,2),
    "reps_completed" SMALLINT NOT NULL,
    "rpe" DECIMAL(3,1),
    "is_warmup" BOOLEAN NOT NULL DEFAULT false,
    "is_failure" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "workout_set_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "nutrition_plans" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "plan_name" VARCHAR(100) NOT NULL,
    "diet_type" "DietType" NOT NULL,
    "daily_calories" SMALLINT NOT NULL,
    "daily_protein_g" SMALLINT NOT NULL,
    "daily_carbs_g" SMALLINT NOT NULL,
    "daily_fat_g" SMALLINT NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "meal_plan_type" "MealPlanType",
    "activity_level" "ActivityLevel",
    "goal_type" "GoalType",
    "budget_preference" "BudgetPreference",
    "height_cm" DECIMAL(5,1),
    "weight_kg" DECIMAL(5,1),
    "age_at_creation" SMALLINT,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "nutrition_plans_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "meal_templates" (
    "id" UUID NOT NULL,
    "nutrition_plan_id" UUID NOT NULL,
    "meal_name" VARCHAR(60) NOT NULL,
    "meal_order" SMALLINT NOT NULL,
    "calories" SMALLINT NOT NULL,
    "protein_g" SMALLINT NOT NULL,
    "carbs_g" SMALLINT NOT NULL,
    "fat_g" SMALLINT NOT NULL,
    "notes" VARCHAR(500),
    "food_items" JSONB,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "meal_templates_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "habit_definitions" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "habit_name" VARCHAR(80) NOT NULL,
    "frequency" "HabitFrequency" NOT NULL DEFAULT 'DAILY',
    "target_value" DECIMAL(8,2),
    "unit_label" VARCHAR(30),
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "color_hex" CHAR(7),
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "habit_definitions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "habit_entries" (
    "id" UUID NOT NULL,
    "habit_id" UUID NOT NULL,
    "entry_date" DATE NOT NULL,
    "is_completed" BOOLEAN NOT NULL DEFAULT false,
    "recorded_value" DECIMAL(8,2),
    "notes" VARCHAR(300),
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "habit_entries_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "progress_entries" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "metric_type" "ProgressMetricType" NOT NULL,
    "recorded_value" DECIMAL(7,2) NOT NULL,
    "recorded_at" DATE NOT NULL,
    "notes" VARCHAR(300),
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "progress_entries_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "body_measurements" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "site" "MeasurementSite" NOT NULL,
    "value_cm" DECIMAL(5,1) NOT NULL,
    "measured_at" DATE NOT NULL,
    "notes" VARCHAR(300),
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "body_measurements_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "progress_photos" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "pose" "PhotoPose" NOT NULL,
    "storage_path" VARCHAR(500) NOT NULL,
    "taken_at" DATE NOT NULL,
    "notes" VARCHAR(300),
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "progress_photos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "goals" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "goal_type" "GoalType" NOT NULL,
    "title" VARCHAR(100) NOT NULL,
    "description" TEXT,
    "target_value" DECIMAL(8,2),
    "target_unit" VARCHAR(20),
    "current_value" DECIMAL(8,2),
    "deadline" DATE,
    "goal_status" "GoalStatus" NOT NULL DEFAULT 'ACTIVE',
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "goals_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "goal_milestones" (
    "id" UUID NOT NULL,
    "goal_id" UUID NOT NULL,
    "title" VARCHAR(100) NOT NULL,
    "target_value" DECIMAL(8,2),
    "milestone_order" SMALLINT NOT NULL,
    "is_achieved" BOOLEAN NOT NULL DEFAULT false,
    "achieved_at" TIMESTAMPTZ,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "goal_milestones_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "admin_audit_logs" (
    "id" UUID NOT NULL,
    "admin_user_id" UUID NOT NULL,
    "action_type" "AdminActionType" NOT NULL,
    "target_table" VARCHAR(60) NOT NULL,
    "target_record_id" UUID NOT NULL,
    "change_summary" JSONB,
    "ip_address" VARCHAR(45),
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "admin_audit_logs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_username_key" ON "users"("username");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE INDEX "idx_users_account_status" ON "users"("account_status");

-- CreateIndex
CREATE INDEX "idx_users_role" ON "users"("role");

-- CreateIndex
CREATE UNIQUE INDEX "auth_credentials_user_id_provider_key" ON "auth_credentials"("user_id", "provider");

-- CreateIndex
CREATE UNIQUE INDEX "auth_sessions_refresh_token_key" ON "auth_sessions"("refresh_token");

-- CreateIndex
CREATE INDEX "idx_auth_sessions_user" ON "auth_sessions"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "password_reset_tokens_token_hash_key" ON "password_reset_tokens"("token_hash");

-- CreateIndex
CREATE INDEX "idx_password_reset_tokens_user" ON "password_reset_tokens"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "profiles_user_id_key" ON "profiles"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "onboarding_completions_user_id_step_key" ON "onboarding_completions"("user_id", "step");

-- CreateIndex
CREATE UNIQUE INDEX "exercises_exercise_name_key" ON "exercises"("exercise_name");

-- CreateIndex
CREATE UNIQUE INDEX "exercises_slug_key" ON "exercises"("slug");

-- CreateIndex
CREATE INDEX "idx_exercises_primary_muscle" ON "exercises"("primary_muscle");

-- CreateIndex
CREATE INDEX "idx_exercises_equipment" ON "exercises"("equipment");

-- CreateIndex
CREATE INDEX "idx_exercises_difficulty" ON "exercises"("difficulty");

-- CreateIndex
CREATE INDEX "idx_workout_plans_user_status" ON "workout_plans"("user_id", "plan_status");

-- CreateIndex
CREATE UNIQUE INDEX "workout_days_plan_id_day_order_key" ON "workout_days"("plan_id", "day_order");

-- CreateIndex
CREATE UNIQUE INDEX "workout_day_exercises_day_id_exercise_order_key" ON "workout_day_exercises"("day_id", "exercise_order");

-- CreateIndex
CREATE INDEX "idx_sessions_user_date" ON "workout_sessions"("user_id", "started_at" DESC);

-- CreateIndex
CREATE INDEX "idx_set_logs_session" ON "workout_set_logs"("session_id");

-- CreateIndex
CREATE INDEX "idx_set_logs_exercise_date" ON "workout_set_logs"("exercise_id", "created_at" DESC);

-- CreateIndex
CREATE UNIQUE INDEX "workout_set_logs_session_id_exercise_id_set_number_key" ON "workout_set_logs"("session_id", "exercise_id", "set_number");

-- CreateIndex
CREATE INDEX "idx_nutrition_plans_user" ON "nutrition_plans"("user_id");

-- CreateIndex
CREATE INDEX "idx_nutrition_plans_user_active" ON "nutrition_plans"("user_id", "is_active");

-- CreateIndex
CREATE UNIQUE INDEX "meal_templates_nutrition_plan_id_meal_order_key" ON "meal_templates"("nutrition_plan_id", "meal_order");

-- CreateIndex
CREATE INDEX "idx_habit_definitions_user" ON "habit_definitions"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "habit_definitions_user_id_habit_name_key" ON "habit_definitions"("user_id", "habit_name");

-- CreateIndex
CREATE INDEX "idx_habit_entries_date" ON "habit_entries"("entry_date" DESC);

-- CreateIndex
CREATE UNIQUE INDEX "habit_entries_habit_id_entry_date_key" ON "habit_entries"("habit_id", "entry_date");

-- CreateIndex
CREATE INDEX "idx_progress_entries_user_metric_date" ON "progress_entries"("user_id", "metric_type", "recorded_at" DESC);

-- CreateIndex
CREATE UNIQUE INDEX "progress_entries_user_id_metric_type_recorded_at_key" ON "progress_entries"("user_id", "metric_type", "recorded_at");

-- CreateIndex
CREATE INDEX "idx_body_measurements_user_date" ON "body_measurements"("user_id", "measured_at" DESC);

-- CreateIndex
CREATE UNIQUE INDEX "body_measurements_user_id_site_measured_at_key" ON "body_measurements"("user_id", "site", "measured_at");

-- CreateIndex
CREATE INDEX "idx_progress_photos_user_date" ON "progress_photos"("user_id", "taken_at" DESC);

-- CreateIndex
CREATE INDEX "idx_goals_user_status" ON "goals"("user_id", "goal_status");

-- CreateIndex
CREATE UNIQUE INDEX "goal_milestones_goal_id_milestone_order_key" ON "goal_milestones"("goal_id", "milestone_order");

-- CreateIndex
CREATE INDEX "idx_audit_logs_admin" ON "admin_audit_logs"("admin_user_id", "created_at" DESC);

-- CreateIndex
CREATE INDEX "idx_audit_logs_target" ON "admin_audit_logs"("target_table", "target_record_id");

-- AddForeignKey
ALTER TABLE "auth_credentials" ADD CONSTRAINT "auth_credentials_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "auth_sessions" ADD CONSTRAINT "auth_sessions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "password_reset_tokens" ADD CONSTRAINT "password_reset_tokens_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "profiles" ADD CONSTRAINT "profiles_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "onboarding_completions" ADD CONSTRAINT "onboarding_completions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "exercises" ADD CONSTRAINT "exercises_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "workout_plans" ADD CONSTRAINT "workout_plans_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "workout_plans" ADD CONSTRAINT "workout_plans_goal_id_fkey" FOREIGN KEY ("goal_id") REFERENCES "goals"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "workout_days" ADD CONSTRAINT "workout_days_plan_id_fkey" FOREIGN KEY ("plan_id") REFERENCES "workout_plans"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "workout_day_exercises" ADD CONSTRAINT "workout_day_exercises_day_id_fkey" FOREIGN KEY ("day_id") REFERENCES "workout_days"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "workout_day_exercises" ADD CONSTRAINT "workout_day_exercises_exercise_id_fkey" FOREIGN KEY ("exercise_id") REFERENCES "exercises"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "workout_sessions" ADD CONSTRAINT "workout_sessions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "workout_sessions" ADD CONSTRAINT "workout_sessions_day_id_fkey" FOREIGN KEY ("day_id") REFERENCES "workout_days"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "workout_set_logs" ADD CONSTRAINT "workout_set_logs_session_id_fkey" FOREIGN KEY ("session_id") REFERENCES "workout_sessions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "workout_set_logs" ADD CONSTRAINT "workout_set_logs_exercise_id_fkey" FOREIGN KEY ("exercise_id") REFERENCES "exercises"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "nutrition_plans" ADD CONSTRAINT "nutrition_plans_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "meal_templates" ADD CONSTRAINT "meal_templates_nutrition_plan_id_fkey" FOREIGN KEY ("nutrition_plan_id") REFERENCES "nutrition_plans"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "habit_definitions" ADD CONSTRAINT "habit_definitions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "habit_entries" ADD CONSTRAINT "habit_entries_habit_id_fkey" FOREIGN KEY ("habit_id") REFERENCES "habit_definitions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "progress_entries" ADD CONSTRAINT "progress_entries_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "body_measurements" ADD CONSTRAINT "body_measurements_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "progress_photos" ADD CONSTRAINT "progress_photos_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "goals" ADD CONSTRAINT "goals_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "goal_milestones" ADD CONSTRAINT "goal_milestones_goal_id_fkey" FOREIGN KEY ("goal_id") REFERENCES "goals"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "admin_audit_logs" ADD CONSTRAINT "admin_audit_logs_admin_user_id_fkey" FOREIGN KEY ("admin_user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
