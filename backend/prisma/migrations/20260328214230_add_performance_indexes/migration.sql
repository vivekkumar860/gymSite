-- CreateIndex
CREATE INDEX "idx_body_measurements_user_site" ON "body_measurements"("user_id", "site");

-- CreateIndex
CREATE INDEX "idx_exercises_is_active" ON "exercises"("is_active");

-- CreateIndex
CREATE INDEX "idx_food_items_breakfast" ON "food_items"("for_breakfast");

-- CreateIndex
CREATE INDEX "idx_food_items_lunch" ON "food_items"("for_lunch");

-- CreateIndex
CREATE INDEX "idx_food_items_dinner" ON "food_items"("for_dinner");

-- CreateIndex
CREATE INDEX "idx_milestones_goal" ON "goal_milestones"("goal_id");

-- CreateIndex
CREATE INDEX "idx_habit_definitions_user_active" ON "habit_definitions"("user_id", "is_active");

-- CreateIndex
CREATE INDEX "idx_habit_entries_habit" ON "habit_entries"("habit_id");

-- CreateIndex
CREATE INDEX "idx_habit_entries_habit_date" ON "habit_entries"("habit_id", "entry_date");

-- CreateIndex
CREATE INDEX "idx_meal_templates_plan" ON "meal_templates"("nutrition_plan_id");

-- CreateIndex
CREATE INDEX "idx_day_exercises_day" ON "workout_day_exercises"("day_id");

-- CreateIndex
CREATE INDEX "idx_day_exercises_exercise" ON "workout_day_exercises"("exercise_id");

-- CreateIndex
CREATE INDEX "idx_workout_days_plan" ON "workout_days"("plan_id");

-- CreateIndex
CREATE INDEX "idx_sessions_day" ON "workout_sessions"("day_id");

-- CreateIndex
CREATE INDEX "idx_sessions_user_status" ON "workout_sessions"("user_id", "session_status");
