# FitTrack Frontend — Complete UI/UX Audit

---

## 1. Authentication — Login (`/login`)

### Route
- Full URL path: `/login`
- Auth required: No (public layout)
- File: `frontend/src/app/(public)/login/page.tsx`

### Layout
- Centered on screen via public layout (`flex min-h-screen items-center justify-center bg-muted/40 p-4`)
- Card container `max-w-md` centered horizontally
- Single column, no responsive breakpoints needed — card stays centered at all sizes
- No fixed/sticky elements

### Data Sources
- None — this is a form-only page. No data fetched on load.

### Interactive Elements — Clickable

| Element | Type | Location | Visual State | On Click / Action | Backend Call | Success | Error |
|---------|------|----------|-------------|-------------------|-------------|---------|-------|
| Email input | `<Input type="email">` | Card body, 1st field | Placeholder: `you@example.com`, required, autofocus, autoComplete="email" | User types email | None | — | HTML5 required validation |
| Password input | `<Input type="password">` | Card body, 2nd field | Placeholder: `••••••••`, required, autoComplete="current-password" | User types password | None | — | HTML5 required validation |
| "Sign in" button | `<Button type="submit">` | Card footer, full width | Default: "Sign in", loading: "Signing in...", disabled during load | Submits form | `POST /auth/login` via `authService.login()` | Stores tokens via `storeTokens()`, redirects to `callbackUrl` or `/dashboard`, calls `router.refresh()` | Shows error message in red box: error.message or "Login failed. Please try again." |
| "Create one" link | `<Link>` | Card footer, below button | Text: "Don't have an account? **Create one**", primary color, underline on hover | Navigates to `/register` | None | — | — |

### Non-Interactive Elements

| Element | Content | Visual Treatment | Conditional |
|---------|---------|-----------------|-------------|
| Card title | "Welcome back" | `text-2xl font-bold`, centered | Always shown |
| Card description | "Sign in to your account to continue" | Muted text, centered | Always shown |
| Error message | Dynamic error text | Red background (`bg-destructive/10`), red text, rounded-md, `p-3 text-sm` | Only shown when `error` state is non-null |

### Forms

**Login Form:**
- Trigger: Page load (always visible)
- Container: Inline within Card
- Fields:
  - **Email**: type=email, placeholder="you@example.com", required, autoFocus
  - **Password**: type=password, placeholder="••••••••", required
- Submit button: "Sign in" / "Signing in..."
- Loading state: Button disabled + text changes
- On success: Redirect to callbackUrl or `/dashboard`
- On error: Red error box appears above form fields

### States
- **Default**: Form with two empty fields, "Sign in" button enabled
- **Loading**: Button disabled, shows "Signing in..."
- **Error**: Red error banner appears above fields

### Toast Notifications
- None on this page (errors are inline)

### Navigation
- Links TO: `/register` via "Create one" link
- Navigates AWAY to: `callbackUrl` param or `/dashboard` on success
- Routes that lead here: Logout redirect, unauthenticated access attempts

### Animations and Transitions
- None (static form)

### Mobile Behavior
- Card stays centered, `p-4` padding on wrapper
- Touch targets adequate (standard input/button sizes)

### Known Issues / Gaps
- No "Forgot password" link exists
- No rate limiting or CAPTCHA visible in the frontend

---

## 2. Authentication — Register (`/register`)

### Route
- Full URL path: `/register`
- Auth required: No (public layout)
- File: `frontend/src/app/(public)/register/page.tsx`

### Layout
- Identical to login: centered card, `max-w-md`

### Data Sources
- None

### Interactive Elements — Clickable

| Element | Type | Location | Visual State | On Click / Action | Backend Call | Success | Error |
|---------|------|----------|-------------|-------------------|-------------|---------|-------|
| Username input | `<Input type="text">` | 1st field | Placeholder: `your_username`, required, minLength=3, maxLength=30, pattern=`^[a-zA-Z0-9_]+$`, autoFocus | User types username | None | — | HTML5 pattern validation: "Letters, numbers, and underscores only" |
| Email input | `<Input type="email">` | 2nd field | Placeholder: `you@example.com`, required | User types email | None | — | HTML5 required |
| Password input | `<Input type="password">` | 3rd field | Placeholder: `••••••••`, required, minLength=8 | User types password | None | — | — |
| Confirm Password input | `<Input type="password">` | 4th field | Placeholder: `••••••••`, required, minLength=8 | User types confirm | None | — | — |
| "Create account" button | `<Button type="submit">` | Footer, full width | Default: "Create account", loading: "Creating account..." | Submits form | `POST /auth/register` via `authService.register()` | Stores tokens, redirects to `/onboarding` | Error message or "Registration failed. Please try again." |
| "Sign in" link | `<Link>` | Footer, below button | "Already have an account? **Sign in**" | Navigates to `/login` | None | — | — |

### Non-Interactive Elements

| Element | Content | Visual Treatment | Conditional |
|---------|---------|-----------------|-------------|
| Card title | "Create an account" | `text-2xl font-bold`, centered | Always |
| Card description | "Start your fitness journey today" | Muted, centered | Always |
| Error message | Dynamic | Red bg, red text, `p-3 text-sm` | When error state set |

### Forms

**Register Form:**
- Trigger: Page load
- Container: Inline Card
- Fields:
  - **Username**: text, placeholder="your_username", 3-30 chars, alphanumeric+underscore
  - **Email**: email, placeholder="you@example.com", required
  - **Password**: password, placeholder="••••••••", min 8 chars
  - **Confirm Password**: password, placeholder="••••••••", min 8 chars
- Client validation: Password match check ("Passwords do not match."), length check ("Password must be at least 8 characters.")
- Submit: "Create account" / "Creating account..."
- On success: Redirect to `/onboarding`
- On error: Inline red error box

### States
- Default, Loading, Error (same pattern as login)

### Navigation
- Links TO: `/login`
- Navigates AWAY to: `/onboarding` on success

### Known Issues / Gaps
- No email verification flow
- No password strength indicator

---

## 3. Onboarding (`/onboarding`)

### Route
- Full URL path: `/onboarding`
- Auth required: Yes (auth layout)
- File: `frontend/src/app/(auth)/onboarding/page.tsx` → `frontend/src/features/onboarding/containers/onboarding-flow.tsx`

### Layout
- 7-step wizard with step indicator at top
- Each step wrapped in `StepLayout` providing title, description, back/next buttons
- Single column, centered content
- Progress persisted to `localStorage` under key `"onboarding-progress"`

### Data Sources
- **Onboarding store** (`onboarding-store.ts`): Custom hook using `localStorage` for step data persistence
- **useCompleteOnboarding**: Mutation hook calling `userService.completeOnboarding(data)` → `PATCH /profiles/me` + `POST /onboarding/complete-step` (3 times)
- No data fetched on load; all data is client-side form state

### Interactive Elements — Clickable

**Step Indicator:**

| Element | Type | Location | Visual State | On Click / Action |
|---------|------|----------|-------------|-------------------|
| Step circles (1-7) | Display only | Top of page | Current: ring highlight, Completed: checkmark, Future: numbered circle | Not clickable (display only) |

**Step 1 — Body Details:**

| Element | Type | Location | Visual State | On Click | Backend Call | Success | Error |
|---------|------|----------|-------------|---------|-------------|---------|-------|
| Height input | `<Input type="number">` | Form field | Placeholder varies, optional, max 300 | User types | None | — | Zod validation |
| Weight input | `<Input type="number">` | Form field | Optional, max 500 | User types | None | — | — |
| Date of Birth input | `<Input type="date">` | Form field | Optional | User selects date | None | — | — |
| Gender buttons | 4 button cards | Below inputs | "Male", "Female", "Other", "Prefer not to say" — single select, highlighted when active | Selects gender | None | — | — |
| "Continue" button | Button | Bottom right | Enabled always (all fields optional) | Merges data, advances to step 2 | None | — | — |

**Step 2 — Goal Selection:**

| Element | Type | Location | Visual State | On Click |
|---------|------|----------|-------------|---------|
| Goal cards (4) | Clickable cards | Grid | "Lose Weight", "Build Muscle", "Stay Fit", "Improve Endurance" — single select | Sets fitnessGoal |
| "Back" button | Button | Bottom left | Always enabled | Returns to step 1 |
| "Continue" button | Button | Bottom right | Enabled when goal selected | Advances to step 3 |

**Step 3 — Activity Schedule:**

| Element | Type | Location | Visual State | On Click |
|---------|------|----------|-------------|---------|
| Experience cards (3) | Clickable cards | Row | "Beginner", "Intermediate", "Advanced" | Sets experienceLevel |
| Day buttons (7) | Circular toggles | Row | "Sun" through "Sat", multi-select, highlighted when active | Toggles day selection |
| Back/Continue | Buttons | Bottom | Continue requires ≥1 day | Navigate steps |

**Step 4 — Equipment Access:**

| Element | Type | Location | Visual State | On Click |
|---------|------|----------|-------------|---------|
| Equipment toggles (8) | Button toggles | 2-column grid | "Full Gym", "Dumbbells", "Barbell & Rack", "Resistance Bands", "Pull-up Bar", "Kettlebell", "Bodyweight Only", "Cardio Machines" — multi-select | Toggles equipment |
| Back/Continue | Buttons | Bottom | Continue requires ≥1 equipment | Navigate steps |

**Step 5 — Injury Restrictions:**

| Element | Type | Location | Visual State | On Click |
|---------|------|----------|-------------|---------|
| "No injuries" / "I have injuries" toggle | Two-option toggle | Top | Single select | Shows/hides body area selection |
| Body area buttons (8) | Toggles | Conditional grid | "Shoulders", "Back", "Knees", "Wrists", "Ankles", "Hips", "Neck", "Elbows" — multi-select | Toggles injured area |
| Injury notes | `<Textarea>` | Below areas | Optional, max 500 chars | User types notes |
| Back/Continue | Buttons | Bottom | Always enabled | Navigate steps |

**Step 6 — Diet Preference:**

| Element | Type | Location | Visual State | On Click |
|---------|------|----------|-------------|---------|
| Diet cards (7) | Clickable cards | List | "No Preference", "Vegetarian", "Vegan", "Keto", "Paleo", "Mediterranean", "High Protein" — each has label + description, single select | Sets dietType |
| Back/Continue | Buttons | Bottom | Enabled when diet selected | Navigate steps |

**Step 7 — Summary:**

| Element | Type | Location | Visual State | On Click | Backend Call | Success | Error |
|---------|------|----------|-------------|---------|-------------|---------|-------|
| Edit buttons (per section) | Buttons | Right side of each section | "Edit" text | Navigates back to that specific step via `goToStep()` | None | — | — |
| "Complete Setup" button | Button | Bottom | Default: "Complete Setup", loading state | Validates full schema, submits | `PATCH /profiles/me` + 3x `POST /onboarding/complete-step` | Clears localStorage, redirects to `/dashboard` | Shows error text below button |

### Non-Interactive Elements

| Element | Content | Conditional |
|---------|---------|-------------|
| Step indicator | 7 circles with connecting lines | Always shown |
| Step title | Varies per step ("About You", "Your Goal", etc.) | Per step |
| Step description | Varies per step | Per step |
| Summary sections | Formatted display of all entered data, "Not set" for missing | Step 7 only |
| Submit error | Dynamic error text | Step 7, on API error |

### Navigation
- Routes TO: `/onboarding` from register page success
- Navigates AWAY to: `/dashboard` on completion
- Back navigation: "Back" button at each step (disabled at step 1)

### Known Issues / Gaps
- No skip/dismiss option for onboarding
- Data persisted to localStorage but no server-side draft saving

---

## 4. Dashboard (`/dashboard`)

### Route
- Full URL path: `/dashboard`
- Auth required: Yes
- File: `frontend/src/app/(auth)/dashboard/page.tsx` → `frontend/src/features/dashboard/containers/dashboard-view.tsx`

### Layout
- Root: `min-h-screen mesh-bg space-y-6 p-4 md:p-6`
- Hero stats card (full width) → Bento grid (12-column on md+, single column on mobile) → Recent workouts card
- Grid layout:
  - Row 1: Today's Workout (7 cols), Streak (2 cols), Weekly Summary (3 cols)
  - Row 2: Calories (3 cols), Protein (3 cols), Habits (6 cols)
  - Row 3: Weight Trend (12 cols)
- Mobile: all grid items stack to single column
- Staggered slide-up animations (0ms–150ms delays)

### Data Sources

| Data | Hook | Endpoint | Returns | Loading | Error | Empty |
|------|------|----------|---------|---------|-------|-------|
| Dashboard summary | `useDashboardSummary` | `GET /workouts/dashboard-summary` | weeklyWorkoutCount, todayCalorieTarget, activeGoalsCount, habitsCompletedToday, totalHabits, recentWorkouts | Hero shows skeleton chips | — | null check, hero not rendered |
| Today's workout | `useTodaysWorkout` | Complex: active plan → days → today's day → exercises → sessions → sets | Workout object or null | SectionShell skeleton | ErrorBoundaryCard with retry | "No workout scheduled for today." + "Create Workout Plan" button |
| Streak count | `useStreakCount` | Derived from `GET /habits` | { currentStreak, longestStreak } | SectionShell skeleton | ErrorBoundaryCard | SectionShell empty state |
| Calorie progress | `useCalorieProgress` | `GET /nutrition-plans/active` | { current, target, unit } | SectionShell skeleton | ErrorBoundaryCard | Defaults to 2000 kcal target |
| Protein progress | `useProteinProgress` | `GET /nutrition-plans/active` | { current, target, unit } | SectionShell skeleton | ErrorBoundaryCard | Defaults to 150g target |
| Habits checklist | `useHabitsChecklist` | `GET /habits` | Array of { id, name, completedToday, currentStreak } | SectionShell skeleton | ErrorBoundaryCard | SectionShell empty state |
| Weight trend | `useWeightTrend` | `GET /progress/entries?metricType=BODY_WEIGHT&limit=14` | { entries, currentWeight, changeFromLast, unit } | SectionShell skeleton | ErrorBoundaryCard | "No weight data recorded." |
| Weekly summary | `useWeeklySummary` | `GET /progress/weekly-summary` | { days[], workoutsCompleted, workoutsPlanned } | SectionShell skeleton | ErrorBoundaryCard | "No activity this week yet." |
| Recent workouts | Passed from `useDashboardSummary` | Part of dashboard-summary | Array of { id, name, completedAt, totalSets, totalVolume } | Skeleton rows | — | "No workouts logged yet." |

### Interactive Elements — Clickable

| Element | Type | Location | Visual State | On Click | Backend Call | Success | Error |
|---------|------|----------|-------------|---------|-------------|---------|-------|
| "Start" / "Continue" button | `<Button size="sm">` | Today's Workout card | "Start" if planned, "Continue" if in_progress, hidden if completed | `router.push(ROUTES.workout.today)` | None | Navigation | — |
| "Details" / "Review" button | `<Button size="sm" variant="outline">` | Today's Workout card | "Review" if completed, "Details" otherwise | `router.push(ROUTES.workout.today)` | None | Navigation | — |
| "Create Workout Plan" button | `<Button size="sm" variant="outline">` | Today's Workout empty state | Shown when no workout exists | `router.push(ROUTES.workout.plan)` | None | Navigation | — |
| Habit checkboxes | `<input type="checkbox">` | Habits checklist card | Checked when completedToday=true, disabled during toggle | Calls `onToggle(habitId, !completedToday)` | `POST /habits/{habitId}/entries` | Invalidates habit queries | — |
| SectionShell retry buttons | `<Button variant="outline">` | Any errored section | "Retry" text | Calls `refetch()` on respective hook | Re-fetches data | Data loads | Shows error again |

### Non-Interactive Elements

| Element | Content | Visual Treatment | Conditional |
|---------|---------|-----------------|-------------|
| Greeting | "Good morning" / "Good afternoon" / "Good evening" | `gradient-text text-2xl md:text-3xl font-black` | Always (time-based) |
| Date | Current date formatted as "weekday, month day" | `text-sm text-muted-foreground/80` | Always |
| Stat chips (4) | "This Week", "Calorie Target", "Active Goals", "Habits Today" | Glass cards with `border-glow`, font-mono labels | Always when summary loaded |
| Streak number | Large number + "days" | `text-3xl font-bold tabular-nums` | When data loaded |
| Streak best | "Best: X day(s)" | `text-xs text-muted-foreground` | When data loaded |
| Calorie progress bar | Progress bar with "Calories" label + "X / Y kcal" | Progress component | When data loaded |
| "X kcal remaining" / "Target reached" | Remaining text | `text-xs text-muted-foreground` | Below calorie progress |
| Protein progress bar | Same pattern as calories | Progress component | When data loaded |
| Habit list items | Name + streak badge | Checkbox + label, strikethrough when done | When habits exist |
| "{X}d streak" | Streak per habit | `text-xs text-muted-foreground tabular-nums` | When streak > 0 |
| Weight value | "{X.X}" | `text-2xl font-bold tabular-nums` | When weight data exists |
| Weight change | "+/-X.X kg" | Green (decrease) or red (increase) | When changeFromLast ≠ 0 |
| Weight trend bars | Bar chart | Primary color bars, responsive height | When > 1 entry |
| Weekly grid | 7 columns for each day | Day label + colored square + habits % | When summary loaded |
| "{X} of {Y} workouts completed" | Summary text | `text-sm text-muted-foreground` | When summary loaded |
| Recent workout rows | Name, date, sets, volume | Glass card rows | When recentWorkouts exists |
| Relative dates | "Today", "Yesterday", "X days ago", or "Mon DD" | `text-xs` | Per recent workout |

### Toast Notifications
- None directly on this page (habit toggle does not show toasts here; it does on the habits page)

### Navigation
- Links AWAY to: `/workout/today`, `/workout/plan`
- Routes TO this page: Login success, registration completion, root `/` redirect, sidebar "Dashboard" link

### Mobile Behavior
- All bento grid columns collapse to single column
- Stat chips: 2-column grid
- Bottom mobile nav visible with Dashboard highlighted

---

## 5. Today's Workout (`/workout/today`)

### Route
- Full URL path: `/workout/today`
- Auth required: Yes
- File: `frontend/src/app/(auth)/workout/today/page.tsx` → `frontend/src/features/workout/containers/today-workout-view.tsx`

### Layout
- Root: `min-h-screen mesh-bg space-y-6 p-4 md:p-6`
- PageHeader → (optional) WorkoutSummaryCard → WorkoutSessionHeader → list of WorkoutExerciseCards
- Exercise cards staggered with 50ms animation delays

### Data Sources

| Data | Hook | Endpoint | Loading | Error | Empty |
|------|------|----------|---------|-------|-------|
| Today's workout | `useTodayWorkout` | Complex multi-step via `workoutService.getTodayWorkout()` | `LoadingSkeleton variant="detail"` | ErrorBoundaryCard with retry | EmptyState: "No workout planned for today" + "Create Workout Plan" button |

### Interactive Elements — Clickable

| Element | Type | Location | Visual State | On Click | Backend Call | Success | Error |
|---------|------|----------|-------------|---------|-------------|---------|-------|
| "Start Workout" button | `<Button>` | Session header, right | "Start Workout" / "Starting...", glow-primary, PlayIcon | `startWorkout.mutate(workout.id)` | `POST /workout-sessions` | Invalidates today workout query | — |
| "Complete" button | `<Button>` | Session header, right (when active) | "Complete" / "Completing...", CheckCircleIcon | Opens confirm dialog | — | — | — |
| "Log Set" button | `<Button variant="outline">` | Bottom of each exercise card | "Log Set" + PlusIcon, full width | Opens set logger dialog with `setLogExerciseId(exercise.id)` | — | — | — |
| "Create Workout Plan" link | Button in EmptyState | Empty state section | Standard button | `router.push(ROUTES.workout.plan)` | None | Navigation | — |
| Confirm complete dialog "Complete Workout" | Button in ConfirmDialog | Dialog footer | Default variant | `completeWorkout.mutate(workout.id)` | `POST /workout-sessions/{id}/complete` | Invalidates queries | — |
| Confirm complete dialog "Cancel" | Button | Dialog footer | Outline variant | Closes dialog | None | — | — |
| Set logger dialog close | Dialog X / outside click | Dialog | — | Closes dialog, sets logExerciseId to null | None | — | — |
| Rest timer "Start" | Button | Timer dialog | "Start", disabled when remaining=0 | Starts countdown | None | — | — |
| Rest timer "Pause" | Button | Timer dialog (when running) | "Pause", outline variant | Pauses countdown | None | — | — |
| Rest timer "Reset" | Button | Timer dialog | "Reset", secondary variant | Resets to default seconds | None | — | — |
| Rest timer close | Dialog footer/outside click | Timer dialog | showCloseButton | Closes timer | None | — | — |

**Set Logger Form (inside dialog):**

| Field | Type | Placeholder | Validation | Default |
|-------|------|-------------|------------|---------|
| Reps | number input, inputMode="numeric" | "e.g. 10" | 1-999, required | 0 |
| Weight | number input, inputMode="decimal", step="any" | "e.g. 60" | 0-9999, required | 0 |
| Weight unit | kg/lbs toggle buttons | — | Required | "kg" |
| RPE | number, step=0.5, min=0, max=10 | "0 - 10" | 0-10, optional | — |
| Warmup | Switch toggle | — | Boolean | false |
| To failure | Switch toggle | — | Boolean | false |
| Submit | "Log Set" / "Saving..." | — | — | — |

- On submit: Calls `logSet.mutate({ sessionId, data })` → `POST /workout-sessions/{id}/sets`
- On success: Closes dialog, opens rest timer
- Weight conversion: lbs × 0.453592 → kg before sending

### Non-Interactive Elements

| Element | Content | Visual Treatment | Conditional |
|---------|---------|-----------------|-------------|
| Page title | "Today's Workout" | PageHeader, font-black tracking-tighter | Always |
| Workout name | Dynamic | `text-2xl font-black tracking-tighter` | When workout loaded |
| Status badge | "Planned" / "In Progress" / "Completed" / "Skipped" | Glass pill with colored dot (amber/green animate-pulse/blue/muted) | Always |
| Exercise count | "X exercises" | `text-sm text-muted-foreground/80` | Always |
| Elapsed timer | "HH:MM:SS" | `text-2xl font-mono font-black`, green text, glass pill | When status=in_progress |
| Exercise order pill | Number (1, 2, 3...) | `bg-primary/10 text-primary text-xs font-bold` rounded-lg | Per exercise card |
| Exercise name | Dynamic | `text-base font-bold` | Per exercise |
| Exercise notes | Dynamic | `text-xs text-muted-foreground/80 italic` | When notes exist |
| Set rows | "X reps × Y kg" | `font-mono text-sm`, set number in muted | Per logged set |
| Warmup badge | "Warmup" | Badge outline, italic text | When set.isWarmup |
| Failure badge | "Failure" | Badge secondary, line-through | When set.isFailure |
| RPE | "RPE X" | `font-mono text-xs text-muted-foreground` | When set.rpe exists |
| Gradient strip | 4px colored bar | `bg-gradient-to-r from-primary to-purple-500/60` | Top of each exercise card |
| Completion summary | Exercises, Sets, Volume, Duration | Green-themed card, CheckCircleIcon, stats grid | When status=completed |
| Rest timer countdown | "MM:SS" | `text-4xl font-black font-mono tabular-nums` | In timer dialog |
| Circular progress ring | SVG ring | Primary stroke, animated dashoffset | In timer dialog |
| "No sets logged yet." | Text | `text-sm text-muted-foreground/80` | When exercise has 0 sets |

### Dialogs / Modals

**Complete Workout Confirmation:**
- Trigger: "Complete" button in session header
- Title: "Complete Workout?"
- Description: "This will mark your workout as finished. You won't be able to log more sets after completing."
- Confirm: "Complete Workout"
- Cancel: "Cancel"

**Log Set Dialog:**
- Trigger: "Log Set" button on any exercise card
- Title: "Log Set"
- Body: SetLoggerForm component
- Close: X button, click outside

**Rest Timer Dialog:**
- Trigger: Automatically opens after successful set log
- Title: "Rest Timer" (monospace uppercase)
- Body: Circular SVG countdown + controls
- Close: Footer close button, click outside

### States
- **Loading**: PageHeader + detail skeleton
- **Error**: PageHeader + ErrorBoundaryCard with retry
- **Empty**: PageHeader + EmptyState "No workout planned for today" with CTA
- **Planned**: Session header with "Start Workout" button, no sets logged
- **In Progress**: Elapsed timer visible, "Complete" and "Log Set" buttons active
- **Completed**: Green summary card at top, no "Log Set" buttons, "Review" session header

### Toast Notifications
- None directly (mutations succeed silently; errors handled in UI)

### Navigation
- Links TO: This page from dashboard "Start"/"Continue"/"Details" buttons
- Navigates AWAY to: `/workout/plan` from empty state CTA

---

## 6. Workout Plan Generation (`/workout/plan`)

### Route
- Full URL path: `/workout/plan`
- Auth required: Yes
- File: `frontend/src/app/(auth)/workout/plan/page.tsx` → `frontend/src/features/workout/containers/workout-plan-view.tsx`

### Layout
- `space-y-6`, PageHeader + Card centered `max-w-lg`

### Data Sources
- None on load (form only)

### Interactive Elements — Clickable

| Element | Type | Location | Visual State | On Click | Backend Call | Success | Error |
|---------|------|----------|-------------|---------|-------------|---------|-------|
| Goal select | `<Select>` | 1st field | Placeholder: "Select your goal", options: "Lose Weight", "Gain Muscle", "Increase Strength", "Improve Endurance", "Maintain" | Selects goal | None | — | Zod validation |
| Experience select | `<Select>` | 2nd field | Placeholder: "Select level", options: "Beginner", "Intermediate", "Advanced" | Selects experience | None | — | Zod validation |
| Days/Week input | `<Input type="number">` | 3-col grid, 1st | min=1, max=7, default=3 | User types | None | — | — |
| Duration input | `<Input type="number">` | 3-col grid, 2nd | min=1, max=52, default=8 | User types | None | — | — |
| Session min input | `<Input type="number">` | 3-col grid, 3rd | min=20, max=120, step=5, default=60 | User types | None | — | — |
| Equipment switches (8) | `<Switch>` toggles | 2-col grid | "Barbell", "Dumbbell", "Cable", "Machine", "Bodyweight" (default on), "Kettlebell", "Resistance Band", "Other" | Toggles equipment | None | — | Min 1 required |
| "Generate Workout Plan" button | `<Button type="submit">` | Bottom, full width | "Generate Workout Plan" / "Generating Plan..." | Submits form | `POST /workout-plans/generate` via `workoutService.generateWorkoutPlan()` | Invalidates workout+dashboard queries, navigates to `/workout/today` | Shows error text below equipment |

### Non-Interactive Elements

| Element | Content | Visual Treatment | Conditional |
|---------|---------|-----------------|-------------|
| Page title | "Create Workout Plan" | PageHeader | Always |
| Description | "Tell us about your goals and we'll generate a personalised plan." | PageHeader description | Always |
| Error text | Dynamic API error | `text-sm text-destructive` | On form error |

### Toast Notifications
- None (success navigates away; errors shown inline)

### Navigation
- Routes TO: Dashboard empty state, today's workout empty state
- Navigates AWAY to: `/workout/today` on success

---

## 7. Workout History (`/workout/history`)

### Route
- Full URL path: `/workout/history`
- Auth required: Yes
- File: `frontend/src/app/(auth)/workout/history/page.tsx` → `frontend/src/features/workout/containers/workout-history-list.tsx`

### Layout
- `min-h-screen mesh-bg space-y-6 p-4 md:p-6`
- PageHeader → Timeline layout (vertical line left, cards branching right) → Pagination
- Timeline has dots on the left rail with cards offset to the right

### Data Sources

| Data | Hook | Endpoint | Loading | Error | Empty |
|------|------|----------|---------|-------|-------|
| Workout history | `useWorkoutHistory({ page, limit })` | `GET /workout-sessions/history?page=X&limit=20` | Card skeleton (6 items) | ErrorBoundaryCard | EmptyState: "No workout history" |

### Interactive Elements — Clickable

| Element | Type | Location | Visual State | On Click | Backend Call |
|---------|------|----------|-------------|---------|-------------|
| Workout cards | Clickable Card | Timeline layout | Glass card with name, date, stats, status badge | `router.push(\`/workout/history/${workout.id}\`)` | None |
| "Previous" button | `<Button variant="outline" size="sm">` | Pagination, left | Disabled when page=1 | `setPage(p - 1)` | Re-fetches |
| "Next" button | `<Button variant="outline" size="sm">` | Pagination, right | Disabled when page=totalPages | `setPage(p + 1)` | Re-fetches |

### Non-Interactive Elements

| Element | Content | Visual Treatment | Conditional |
|---------|---------|-----------------|-------------|
| Page title | "Workout History" | PageHeader font-black | Always |
| Description | "Your past workouts and performance" | PageHeader description | Always |
| Timeline line | Vertical line | `absolute w-0.5 bg-border/30` | When workouts exist |
| Timeline dots | Per-card circles | `size-3 rounded-full bg-primary glow-sm` | Per workout |
| Status badge | "Planned"/"In Progress"/"Completed"/"Skipped" | Badge variants | Per card |
| Date | Formatted "MMM d, yyyy" | CardDescription | Per card |
| Stats | "X exercises · Y sets · Z kg" | `font-mono text-sm` | Per card |
| Duration | "X min" | `font-mono text-xs` | When duration exists |
| Page indicator | "Page X of Y" | `font-mono text-sm text-muted-foreground` | When totalPages > 1 |

---

## 8. Workout Session Detail (`/workout/history/[id]`)

### Route
- Full URL path: `/workout/history/[id]`
- Auth required: Yes
- File: `frontend/src/app/(auth)/workout/history/[id]/page.tsx` → `frontend/src/features/workout/containers/workout-detail-view.tsx`

### Layout
- `min-h-screen mesh-bg space-y-6 p-4 md:p-6`
- PageHeader (with back button) → WorkoutSummaryCard (if completed) → WorkoutSessionHeader → Exercise cards → Notes

### Data Sources

| Data | Hook | Endpoint | Loading | Error | Empty |
|------|------|----------|---------|-------|-------|
| Workout detail | `useWorkoutDetail(workoutId)` | `GET /workout-sessions/{id}` + related data | Detail skeleton | ErrorBoundaryCard with retry | ErrorBoundaryCard "Workout not found." |

### Interactive Elements — Clickable

| Element | Type | Location | Visual State | On Click |
|---------|------|----------|-------------|---------|
| "Back to History" button | `<Button variant="outline" size="sm">` | PageHeader right | ArrowLeftIcon + text | `router.push(ROUTES.workout.history)` |

### Non-Interactive Elements
- Same as Today's Workout but read-only (no Log Set, no Start/Complete buttons)
- Completion summary shown when completed
- Notes section at bottom if workout has notes

### Navigation
- Routes TO: Clicking a card in workout history
- Back button goes to `/workout/history`

---

## 9. Exercise Library (`/exercises`)

### Route
- Full URL path: `/exercises`
- Auth required: Yes
- File: `frontend/src/app/(auth)/exercises/page.tsx` → `frontend/src/features/exercise/containers/exercise-library-view.tsx`

### Layout
- `min-h-screen mesh-bg space-y-6 p-4 md:p-6`
- Title → Filter chips → Exercise grid → Pagination
- Grid: 1 col mobile, 2 sm, 3 md, 4 xl

### Data Sources

| Data | Hook | Endpoint | Loading | Error | Empty |
|------|------|----------|---------|-------|-------|
| Exercises | `useExercises({ page, limit, search, primaryMuscle, equipment })` | `GET /exercises?page=X&limit=20&search=...&primaryMuscle=...&equipment=...` | Card skeleton (6 items) | ErrorBoundaryCard | EmptyState: "No exercises found" |

### Interactive Elements — Clickable

| Element | Type | Location | Visual State | On Click | Backend Call |
|---------|------|----------|-------------|---------|-------------|
| Search input | `<Input>` | Top | Placeholder: "Search exercises...", SearchIcon, glass styling | Filters exercises (resets page to 1) | Re-fetches with search param |
| Muscle group chips (13) | Button chips | Below search | "All" + 12 groups (Chest, Back, Shoulders, Biceps, Triceps, Forearms, Quads, Hamstrings, Glutes, Calves, Core, Full Body). Active: `bg-primary glow-sm`. Inactive: `glass border` | Toggles filter (re-fetches) | None |
| Equipment chips (9) | Button chips | Below muscle | "All" + 8 equipment types. Same styling as muscle | Toggles filter | None |
| Exercise cards | Clickable div | Grid | Image with gradient overlay, name over image, difficulty badge, muscle+equipment badges | `router.push(ROUTES.exercises.detail(slug))` | None |
| "Previous" / "Next" | Buttons | Pagination | Standard outline buttons | Page navigation | Re-fetches |

### Non-Interactive Elements

| Element | Content | Visual Treatment | Conditional |
|---------|---------|-----------------|-------------|
| Page title | "Exercise Library" | `text-2xl font-black tracking-tighter` | Always |
| Filter section labels | "Muscle Group", "Equipment" | `font-mono text-[10px] uppercase tracking-widest text-primary/60` | Always |
| Card images | Exercise image or initials fallback | `aspect-video`, gradient overlay, `group-hover:scale-105` | Per card |
| Exercise name on image | Dynamic | White text, bold, drop-shadow | Per card |
| Difficulty badge on image | "BEGINNER"/"INTERMEDIATE"/"ADVANCED" | Colored pill (green/amber/rose) | Per card |
| Muscle badge | e.g. "CHEST" | Outline badge with primary tint | Per card |
| Equipment badge | e.g. "BARBELL" | Outline badge | Per card |

---

## 10. Exercise Detail (`/exercises/[id]`)

### Route
- Full URL path: `/exercises/[exerciseId]` (param is slug)
- Auth required: Yes
- File: `frontend/src/app/(auth)/exercises/[exerciseId]/page.tsx` → `frontend/src/features/exercise/containers/exercise-detail-view.tsx`

### Layout
- `min-h-screen mesh-bg space-y-6 p-4 md:p-6`
- Hero image (or gradient placeholder) with overlaid name → Content card with details

### Data Sources

| Data | Hook | Endpoint | Loading | Error | Empty |
|------|------|----------|---------|-------|-------|
| Exercise | `useExerciseDetail(exerciseId)` | `GET /exercises/{slug}` | Detail skeleton | ErrorBoundaryCard | ErrorBoundaryCard "Exercise not found." |

### Interactive Elements — Clickable
- None (read-only detail page)

### Non-Interactive Elements

| Element | Content | Visual Treatment | Conditional |
|---------|---------|-----------------|-------------|
| Hero image | Exercise image or gradient with initials | `h-48`/`h-64`, dark gradient overlay | Always |
| Exercise name | Dynamic | `text-3xl font-black text-white` overlaid on image | Always |
| Difficulty badge | e.g. "BEGINNER" | `bg-primary/10 text-primary` | Always |
| Equipment badge | e.g. "BARBELL" | Outline badge | When exists |
| "Primary Muscle" label | Static | `font-mono text-xs uppercase tracking-widest text-primary/60` | Always |
| Primary muscle badge | e.g. "CHEST" | `bg-primary/10 text-primary` | Always |
| "Secondary Muscle" label | Static | Same mono style | When secondaryMuscle exists |
| Secondary muscle badge | Dynamic | Outline badge | When exists |
| "Instructions" label | Static | Same mono style | When instructions exist |
| Instructions text | Dynamic | `text-sm text-muted-foreground/80 leading-relaxed` | When exists |
| "Video: {url}" | Placeholder text | Centered in muted box | When videoUrl exists (no actual video player) |

### Known Issues / Gaps
- Video URL is displayed as text, not embedded — no video player implemented

---

## 11. Nutrition Plan View (`/nutrition`)

### Route
- Full URL path: `/nutrition`
- Auth required: Yes
- File: `frontend/src/app/(auth)/nutrition/page.tsx` → `frontend/src/features/nutrition/containers/nutrition-daily-view.tsx`

### Layout
- `min-h-screen mesh-bg space-y-6 p-4 md:p-6`
- Hero header → PlanStatsRow → MacroTargetsCard → Meal cards list → Plan history

### Data Sources

| Data | Hook | Endpoint | Loading | Error | Empty |
|------|------|----------|---------|-------|-------|
| Active plan | `useActiveNutritionPlan` | `GET /nutrition-plans/active` | Custom NutritionLoadingSkeleton | ErrorBoundaryCard with retry | Empty state with CTA to create plan |
| Plan history | `useNutritionPlanHistory` | `GET /nutrition-plans` | Skeleton in NutritionPlanHistoryCard | Error text + retry button | Hidden when ≤1 plan |

### Interactive Elements — Clickable

| Element | Type | Location | Visual State | On Click | Backend Call | Success | Error |
|---------|------|----------|-------------|---------|-------------|---------|-------|
| "Create Nutrition Plan" button | `<Button size="lg">` | Empty state | glow-primary, ArrowRightIcon | `router.push(ROUTES.nutrition.plan)` | None | — | — |
| "Update Plan" button | `<Button variant="ghost" size="sm">` | Hero header right | PencilIcon + text | `router.push(ROUTES.nutrition.plan)` | None | — | — |
| "Regenerate Meals" button | `<Button variant="outline" size="sm">` | Hero header right | "Regenerate Meals" / "Regenerating..." + spinner icon | Opens confirm dialog | — | — | — |
| Confirm regenerate "Regenerate" | Button in dialog | Dialog footer | "Regenerate" / "Regenerating..." | `regenerateMeals.mutate(plan.id)` | `POST /nutrition-plans/{id}/regenerate` | Toast: "Meals regenerated successfully" | Toast: error message |
| Per-meal regenerate icon | `<Button variant="ghost" size="icon-xs">` | Meal card header right | RefreshCwIcon, spins when regenerating | Opens per-meal confirm dialog | — | — | — |
| Per-meal confirm | Dialog | Per meal | Title: "Regenerate {meal.name}?" | `regenerateMeal.mutate({ planId, mealId })` | `POST /nutrition-plans/{planId}/meals/{mealId}/regenerate` | Toast on success | Toast on error |
| Plan history toggle | Button | History card header | ChevronDownIcon, rotates when open | Expands/collapses plan list | None | — | — |
| "Set Active" button | `<Button variant="outline" size="sm">` | Per inactive plan in history | "Set Active" / "Activating..." | Opens confirm dialog | — | — | — |
| Activate confirm | Dialog | Per plan | "Switch to {planName}?" | `activatePlan.mutate(planId)` | `PATCH /nutrition-plans/{planId}/activate` | Toast: "Plan activated" | Toast: error |
| History retry | `<Button variant="ghost" size="sm">` | Below meal cards | "Retry" text | `history.refetch()` | Re-fetches | — | — |

### Non-Interactive Elements

| Element | Content | Visual Treatment | Conditional |
|---------|---------|-----------------|-------------|
| Plan name | Dynamic | `text-2xl font-black tracking-tighter` | When plan loaded |
| Diet type badge | e.g. "Indian Vegetarian" | `bg-primary/10 text-primary border-primary/20` | When mealPlanType exists |
| Diet badge | e.g. "Bulking" | `bg-muted text-muted-foreground` | Always |
| Budget badge | e.g. "Medium Budget" | `bg-muted text-muted-foreground` | When budgetPreference exists |
| BMR/TDEE/Daily stat chips | Calorie values | Glass cards, font-black, font-mono labels | When values > 0 |
| Explanation text | "BMR → TDEE → Daily Target: how your calorie goal was calculated" | `text-xs text-muted-foreground/80` | When all 3 chips shown |
| Donut chart | SVG ring showing protein/carbs/fat distribution | 192×192px, colored segments, center shows total kcal | Always when plan loaded |
| Macro bars | 3 bars (protein/carbs/fat) with percentages | Colored bars with labels and grams | Always |
| Meal cards | Name, order, food items, macros footer | Colored left border (blue/amber/rose/emerald cycling), glass cards | Per meal |
| Food item rows | Name, quantity, kcal, protein/carbs/fat | `font-mono` macro values, hover highlight | Per food item |
| "Meal total" footer | Summed macros | `font-mono`, colored macro values | Per meal |
| Empty state icon | UtensilsCrossedIcon | `size-16 text-primary/40 animate-float` | When no plan |
| Empty state title | "Your nutrition plan lives here" | `gradient-text font-black` | When no plan |

### Toast Notifications

| Trigger | Type | Message |
|---------|------|---------|
| Regenerate all meals success | success | "Meals regenerated successfully" |
| Regenerate all meals error | error | Dynamic error message |
| Regenerate single meal success | success | Toast from hook |
| Regenerate single meal error | error | Toast from hook |
| Activate plan success | success | "Plan activated" |
| Activate plan error | error | Dynamic error message |

---

## 12. Nutrition Plan Generation (`/nutrition/plan`)

### Route
- Full URL path: `/nutrition/plan`
- Auth required: Yes
- File: `frontend/src/app/(auth)/nutrition/plan/page.tsx` → `frontend/src/features/nutrition/containers/nutrition-plan-view.tsx`

### Layout
- `min-h-screen mesh-bg space-y-6 p-4 md:p-6`
- Centered icon + PageHeader → Card form `max-w-lg`

### Interactive Elements — Clickable (GenerateNutritionPlanForm)

| Field | Type | Options / Validation | Default |
|-------|------|---------------------|---------|
| Gender | Select | "Male", "Female" (required) | — |
| Age | Number input | 13-100, required | 25 |
| Height (cm) | Number input | 100-250, step=0.1, required | 170 |
| Weight (kg) | Number input | 30-300, step=0.1, required | 70 |
| Activity Level | Select | "Sedentary", "Lightly Active", "Moderately Active", "Very Active", "Extremely Active" (required) | — |
| Goal | Select | "Lose Weight", "Gain Muscle", "Increase Strength", "Improve Endurance", "Maintain", "Custom" (required) | — |
| Diet Preference | Select | "Indian Vegetarian", "Indian Non-Veg", "Vegan", "Hostel Budget", "Office Going" (required) | — |
| Budget | Select | "Low", "Medium", "High" (required) | — |
| Submit button | Button | "Generate Nutrition Plan" / "Generating Plan..." + LoaderCircleIcon spinner | — |

- On success: Toast "Nutrition plan generated", redirects to `/nutrition`
- On error: Inline error box with TriangleAlertIcon

### Non-Interactive Elements

| Element | Content | Visual Treatment | Conditional |
|---------|---------|-----------------|-------------|
| SparklesIcon | Decorative | `size-6 text-primary/60` in primary/10 circle, `animate-float` | Always |
| Title | "Create Nutrition Plan" | PageHeader | Always |
| Description | "Enter your details and preferences to generate a personalised nutrition plan." | PageHeader | Always |
| Existing plan warning | "You already have an active plan: **{name}**. Submitting this form will replace it." | Yellow warning box with TriangleAlertIcon | When existingPlan exists |
| Section headers | "About You", "Your Activity", "Your Goals" | `font-mono text-xs uppercase tracking-widest text-muted-foreground` | Always |
| Activity description | e.g. "Light exercise 1-3 days/week" | `text-xs text-muted-foreground` below select | When activity selected |

---

## 13. Habits Tracker (`/habits`)

### Route
- Full URL path: `/habits`
- Auth required: Yes
- File: `frontend/src/app/(auth)/habits/page.tsx` → `frontend/src/features/habits/containers/habits-tracker-view.tsx`

### Layout
- `min-h-screen mesh-bg space-y-6 p-4 md:p-6`
- Glass header card (with progress ring) → HabitsGrid (3-col on lg, 2 on sm, 1 on mobile)

### Data Sources

| Data | Hook | Endpoint | Loading | Error | Empty |
|------|------|----------|---------|-------|-------|
| Habits | `useHabits` | `GET /habits` | Card skeleton (6 items) | ErrorBoundaryCard with retry | EmptyState: "No habits yet" |
| Today entries | React Query inline | `GET /habits/{id}/entries` per habit | — | — | Empty array default |

### Interactive Elements — Clickable

| Element | Type | Location | Visual State | On Click | Backend Call | Success | Error |
|---------|------|----------|-------------|---------|-------------|---------|-------|
| "New Habit" button | `<Button>` | Header card right | glow-primary | Opens create habit dialog | None | — | — |
| "Mark Done" button | Full-width button | Bottom of each habit card | "Mark Done" (outline) or "Done!" (green, with checkmark) | `handleToggleHabit(habitId)` | `POST /habits/{id}/entries` | Toast: "Habit logged!" | Toast: error message |
| "Create Habit" button (empty state) | Button | Empty state | Standard | Opens create habit dialog | None | — | — |
| Create habit dialog close | Dialog X/outside | Dialog | — | Closes dialog | None | — | — |

**Create Habit Form (inside dialog):**

| Field | Type | Placeholder | Validation | Default |
|-------|------|-------------|------------|---------|
| Name | Text input | "e.g. Drink water" | 1-100 chars, required | "" |
| Description | Textarea | "Optional description..." | Max 500, optional | "" |
| Frequency | Select | "Select frequency" | "Daily" / "Weekly" | "DAILY" |
| Target count | Number input | — | 1-100, integer | 1 |
| Color | 8 color circles | — | Optional | undefined |
| Submit | "Create Habit" / "Creating..." | — | — | — |

- On success: Toast "Habit created", closes dialog
- On error: Toast with error message

### Non-Interactive Elements

| Element | Content | Visual Treatment | Conditional |
|---------|---------|-----------------|-------------|
| Progress ring | SVG circle showing X% | 48×48, primary stroke, percentage in center | Always in header |
| Title | "Today's Habits" | `text-2xl font-black tracking-tighter` | Always |
| Completion count | "X/Y completed today" | `text-sm text-muted-foreground/80` | When totalCount > 0 |
| Habit name | Dynamic | `font-semibold` | Per card |
| Habit icon | Emoji | `text-2xl` | When icon exists |
| Streak badge | "🔥 X" | `bg-primary/10 text-primary border-primary/20` | When currentStreak > 0 |
| 28-day grid | 7×4 grid of squares | Colored squares (filled) or muted (empty) | Per card, proportional to streak |
| Frequency badge | "daily" / "weekly" | Outline badge, capitalize | Per card |
| Color picker circles | 8 colors | Rounded circles with scale on hover | In create form |

### Toast Notifications

| Trigger | Type | Message |
|---------|------|---------|
| Habit logged | success | "Habit logged!" |
| Log error | error | Dynamic error message |
| Habit created | success | "Habit created" |
| Create error | error | Dynamic error message |

---

## 14. Progress (`/progress`)

### Route
- Full URL path: `/progress`
- Auth required: Yes
- File: `frontend/src/app/(auth)/progress/page.tsx` → `frontend/src/features/progress/containers/progress-overview-view.tsx`

### Layout
- `min-h-screen mesh-bg space-y-6 p-4 md:p-6`
- PageHeader → Stat chips (4-col grid) → Volume chart → Muscle distribution → PRs table → Tabs (Measurements/Photos) → Dialog

### Data Sources

| Data | Hook | Endpoint | Loading | Error | Empty |
|------|------|----------|---------|-------|-------|
| Measurements | `useMeasurements` | `GET /progress/measurements` | Card skeleton (4 items) | ErrorBoundaryCard | — |
| Summary | `useProgressSummary` | `GET /workouts/progress-summary` | Skeleton stat chips | — | null renders nothing |
| Volume by week | `useVolumeByWeek(12)` | `GET /workouts/analytics/volume-by-week?weeks=12` | — | — | Hidden when empty |
| Personal records | `usePersonalRecords` | `GET /workouts/analytics/personal-records` | — | — | Hidden when empty |

### Interactive Elements — Clickable

| Element | Type | Location | Visual State | On Click | Backend Call | Success | Error |
|---------|------|----------|-------------|---------|-------------|---------|-------|
| "Add Measurement" button | `<Button>` | PageHeader right | glow-primary | Opens measurement dialog | None | — | — |
| "Measurements" tab | TabsTrigger | Tab bar | Rounded pill, active=primary | Shows measurements table | None | — | — |
| "Photos" tab | TabsTrigger | Tab bar | Rounded pill | Shows photo grid | None | — | — |
| PR rows | Hoverable div | PRs section | `hover:bg-amber-500/5` | Display only (no action) | None | — | — |

**Measurement Form (dialog):**

| Field | Type | Placeholder | Validation | Default |
|-------|------|-------------|------------|---------|
| Site | Select | "Select measurement site" | Required, 10 options (Neck, Chest, Left Bicep, Right Bicep, Waist, Hips, Left Thigh, Right Thigh, Left Calf, Right Calf) | — |
| Value (cm) | Number, step=0.1 | "0.0" | Positive number, required | — |
| Date | Date input | — | Required | Today's date |
| Notes | Textarea | "Any notes about this measurement..." | Max 300 chars, optional | — |
| Submit | "Save Measurement" / "Saving..." | — | — | — |

- On success: Toast "Measurement saved", closes dialog
- On error: Toast with error message

### Non-Interactive Elements

| Element | Content | Visual Treatment | Conditional |
|---------|---------|-----------------|-------------|
| Stat chips (4) | "Workouts", "Total Volume" (gradient-text), "Current Streak", "Longest Streak" | Glass cards, `text-2xl font-black tabular-nums` | When summary loaded |
| Volume chart | SVG bar chart, 12 weeks | Glass card, primary bars, mono week labels | When volumeData has items |
| Muscle bars | Gradient bars per muscle group | `bg-gradient-to-r from-primary to-primary/40`, font-mono labels | When distribution data exists |
| PR rows | Exercise name, max weight (amber), max reps, max volume | Glass row, `font-mono font-bold text-amber-400` for weight | When PRs exist |
| Measurement table | Date, Site, Value columns | Table format | When measurements exist |
| Photo grid | Image thumbnails | 2-4 col grid | When photos exist (currently always empty) |

### Toast Notifications

| Trigger | Type | Message |
|---------|------|---------|
| Measurement saved | success | "Measurement saved" |
| Save error | error | Dynamic error message |

### Known Issues / Gaps
- Photos tab always shows empty state (no upload mechanism)
- `ProgressPhotoGrid` renders `photos={[]}` — no photo upload feature

---

## 15. Goals (`/goals`)

### Route
- Full URL path: `/goals`
- Auth required: Yes
- File: `frontend/src/app/(auth)/goals/page.tsx` → `frontend/src/features/goals/containers/goals-overview-view.tsx`

### Layout
- `min-h-screen mesh-bg space-y-6 p-4 md:p-6`
- Glass header card (trophy icon + stats) → Goal cards grid (2-col on sm) → Dialog

### Data Sources

| Data | Hook | Endpoint | Loading | Error | Empty |
|------|------|----------|---------|-------|-------|
| Goals | `useGoals` | `GET /goals` (filtered to active client-side) | Card skeleton (4) | ErrorBoundaryCard | Custom empty state with floating trophy |

### Interactive Elements — Clickable

| Element | Type | Location | Visual State | On Click | Backend Call | Success | Error |
|---------|------|----------|-------------|---------|-------------|---------|-------|
| "Create Goal" button | `<Button>` | Header card right | glow-primary | Opens create dialog | None | — | — |
| "Create Goal" (empty) | `<Button>` | Empty state | glow-primary | Opens create dialog | None | — | — |
| "Update Progress" button | `<Button variant="outline" size="sm">` | Per active goal card | Opens inline editor | Shows input + Save/Cancel | — | — | — |
| "Save" (inline edit) | `<Button size="sm">` | Inline edit row | glow-sm | `updateGoal.mutate({ id, data: { currentValue } })` | `PATCH /goals/{id}` | Toast: "Progress updated" | Toast: error |
| "Cancel" (inline edit) | `<Button size="sm" variant="ghost">` | Inline edit row | — | Hides inline editor | None | — | — |
| "Mark Complete" button | `<Button variant="ghost" size="sm">` | Per active goal card | CheckCircle2Icon + text, `hover:bg-green-500/10` | Opens confirm dialog | — | — | — |
| Confirm complete | Button in dialog | Dialog | "Complete" | `updateGoal.mutate({ id, data: { goalStatus: "COMPLETED" } })` | `PATCH /goals/{id}` | Toast: "Goal completed!" | Toast: error |

**Create Goal Form (dialog):**

| Field | Type | Options / Placeholder | Validation | Default |
|-------|------|----------------------|------------|---------|
| Type | Select | "Select goal type": Lose Weight, Gain Muscle, Increase Strength, Improve Endurance, Maintain, Custom | Required enum | — |
| Title | Text input | "e.g., Lose 5kg by summer" | 1-200 chars, required | "" |
| Description | Textarea | "Optional description..." | Max 500, optional | "" |
| Target Value | Number, step=0.1 | "0" | Positive, required | — |
| Unit | Text input | "kg, reps, etc." | Optional | "" |
| Target Date | Date input | — | Required | "" |
| Submit | "Create Goal" / "Creating..." | — | Full width | — |

- On success: Toast "Goal created", closes dialog
- On error: Toast with error message

### Non-Interactive Elements

| Element | Content | Visual Treatment | Conditional |
|---------|---------|-----------------|-------------|
| Trophy icon | TrophyIcon | `size-6 text-amber-500` with amber glow, in primary/10 circle | Header card |
| Title | "Goals" | `text-2xl font-black tracking-tighter` | Always |
| Stats | "X active · Y completed" | `text-sm text-muted-foreground/80` | Always |
| Goal title | Dynamic | `text-base font-bold` | Per card |
| Description | Dynamic | `text-sm text-muted-foreground/80 line-clamp-2` | When exists |
| Status badge | "Active" / "Completed" / "Abandoned" | Secondary/default/destructive variant | Per card |
| Progress bar | Gradient fill | `from-primary to-primary/60` or green-500 when completed | Per card |
| Progress text | "X / Y unit" + "X%" | `font-mono font-bold` for percentage | Per card |
| Deadline | "Deadline: Mon DD, YYYY" | `font-mono text-xs` | When deadline exists |
| "Goal achieved" | Trophy icon + text | Green text | When completed |
| Left border glow | 4px border | Primary or green with box-shadow glow | Per card |
| Empty state trophy | TrophyIcon | `size-16 text-primary/30 animate-float` | When no goals |
| Empty title | "No goals yet" | `gradient-text font-black` | When no goals |

### Toast Notifications

| Trigger | Type | Message |
|---------|------|---------|
| Goal created | success | "Goal created" |
| Create error | error | Dynamic |
| Progress updated | success | "Progress updated" |
| Update error | error | Dynamic |
| Goal completed | success | "Goal completed!" |
| Complete error | error | Dynamic |

---

## 16. Settings (`/settings`)

### Route
- Full URL path: `/settings`
- Auth required: Yes
- File: `frontend/src/app/(auth)/settings/page.tsx` → `frontend/src/features/settings/containers/settings-view.tsx`

### Layout
- `space-y-6`, PageHeader → Tabs (3 tabs)

### Data Sources

| Data | Hook | Endpoint | Loading | Error |
|------|------|----------|---------|-------|
| Profile | `useProfile` | `GET /profiles/me` | LoadingSkeleton detail | ErrorBoundaryCard |
| Preferences | `usePreferences` | Returns hardcoded defaults (no backend) | LoadingSkeleton detail | ErrorBoundaryCard |

### Interactive Elements — Clickable

| Element | Type | Location | Visual State | On Click | Backend Call | Success | Error |
|---------|------|----------|-------------|---------|-------------|---------|-------|
| "Profile" tab | TabsTrigger | Tab bar | Default active | Shows profile form | None | — | — |
| "Preferences" tab | TabsTrigger | Tab bar | — | Shows preferences form | None | — | — |
| "Account" tab | TabsTrigger | Tab bar | — | Shows danger zone | None | — | — |
| First Name input | Text input | Profile tab | placeholder="First name" | User types | None | — | Required, max 100 |
| Last Name input | Text input | Profile tab | placeholder="Last name" | User types | None | — | Required, max 100 |
| "Save Changes" button | Button | Profile tab | "Save Changes" / "Saving..." | Submits profile form | `PATCH /profiles/me` | Toast: "Profile updated" | Toast: error |
| Weight Unit select | Select | Preferences tab | "Kilograms (kg)" / "Pounds (lbs)" | Changes value | None | — | — |
| Distance Unit select | Select | Preferences tab | "Kilometers (km)" / "Miles (mi)" | Changes value | None | — | — |
| Theme select | Select | Preferences tab | "Light" / "Dark" / "System" | Changes value | None | — | — |
| Email notifications switch | Switch | Preferences tab | Toggle | Toggles boolean | None | — | — |
| Push notifications switch | Switch | Preferences tab | Toggle | Toggles boolean | None | — | — |
| Workout reminders switch | Switch | Preferences tab | Toggle | Toggles boolean | None | — | — |
| "Save Preferences" button | Button | Preferences tab | "Save Preferences" / "Saving..." | Submits preferences | Throws ApiError 501 | Toast: "Preferences saved" (never reached) | Toast: "Preferences saving is not yet implemented. Your changes were not saved." |
| "Delete Account" button | Button variant="destructive" | Account tab | Red button | Opens confirm dialog | None | — | — |
| Delete confirm dialog | ConfirmDialog | Dialog | Title: "Delete Account", destructive variant | Calls `onDeleteAccount?.()` | **None — prop not passed** | — | — |

### Non-Interactive Elements

| Element | Content | Visual Treatment | Conditional |
|---------|---------|-----------------|-------------|
| Title | "Settings" | PageHeader | Always |
| Description | "Manage your profile and preferences." | PageHeader | Always |
| "Notifications" section header | "Notifications" | `text-sm font-medium` | In preferences tab |
| "Danger Zone" title | "Danger Zone" | `text-lg font-semibold text-destructive` | Account tab |
| Danger description | "Permanently delete your account and all associated data. This action cannot be undone." | `text-sm text-muted-foreground` | Account tab |

### Toast Notifications

| Trigger | Type | Message |
|---------|------|---------|
| Profile saved | success | "Profile updated" |
| Profile error | error | Dynamic |
| Preferences saved | success | "Preferences saved" (unreachable) |
| Preferences error | error | "Preferences saving is not yet implemented. Your changes were not saved." |

### Known Issues / Gaps
- **Preferences save always fails** — `updatePreferences()` throws `ApiError(501)` with message "Preferences saving is not yet implemented."
- **Delete Account does nothing** — `DangerZone` accepts `onDeleteAccount` prop but `SettingsView` does not pass it, so the confirm button calls `undefined?.()`
- Preferences data is hardcoded defaults, never persisted

---

## 17. Shared Components

### App Shell — `frontend/src/shared/components/app-shell.tsx`
- Desktop sidebar: 60px wide (`w-60`), glass backdrop-blur, hidden on mobile (`hidden lg:block`)
- 8 nav items: Dashboard, Today, Exercises, Nutrition, Habits, Progress, Goals, Settings
- Logo: "FitTrack" in `gradient-text font-black` with animated pulse dot
- Active nav: `glass-strong border-glow text-primary` with left indicator bar
- Inactive nav: `text-muted-foreground hover:bg-primary/5`
- User section: Avatar circle (initials), username, "Log out" button
- Mobile: Frosted glass header (`h-14`) with hamburger → Sheet slide-out with full Sidebar
- Main content: `flex-1 pb-20 md:pb-0` (bottom padding for mobile nav)
- Logout: Clears tokens, invalidates queries, redirects to `/login`

### Mobile Bottom Nav — `frontend/src/shared/components/mobile-bottom-nav.tsx`
- Fixed bottom bar, `md:hidden`
- 6 items: Dashboard, Today, Nutrition, Habits, Progress, Goals
- Active: `text-primary glow-sm` with drop-shadow on icon
- Glass-strong background with border-t

### PageHeader — `frontend/src/shared/components/page-header.tsx`
- Title: `text-2xl font-black tracking-tighter`
- Optional description: `text-sm text-muted-foreground/80`
- Optional children slot (right-aligned actions)

### EmptyState — `frontend/src/shared/components/empty-state.tsx`
- Centered column: optional icon (in primary/10 circle, `animate-float`), title (`font-black`), description, optional action button (`glow-primary`)

### LoadingSkeleton — `frontend/src/shared/components/loading-skeleton.tsx`
- 4 variants: "card" (grid of 3), "list" (rows with avatar), "detail" (heading+text+grid), "table" (header+rows)
- `count` prop controls number of items (default 3)

### ConfirmDialog — `frontend/src/shared/components/confirm-dialog.tsx`
- Props: open, onOpenChange, title, description, confirmLabel (default "Confirm"), cancelLabel (default "Cancel"), onConfirm, variant ("default"/"destructive")
- Footer: Cancel (outline) + Confirm (default or destructive)
- Closes on confirm click after calling onConfirm

### ErrorBoundaryCard — `frontend/src/shared/components/error-boundary-card.tsx`
- Title: defaults to "Something went wrong" (customizable)
- Message: required
- Optional "Retry" button
- Red border (`border-destructive/50`)

### FormFieldWrapper — `frontend/src/shared/components/form-field-wrapper.tsx`
- Label with optional red asterisk for required
- Children slot for input
- Error message below in destructive color

### WeeklyVolumeChart — `frontend/src/shared/components/weekly-volume-chart.tsx`
- SVG bar chart, responsive width, configurable height
- Bars: `fill-primary/60 hover:fill-primary`, rounded corners
- Week labels: font-mono
- Tooltip: `{volume}kg · {count} sessions`
- All-zero: "Start logging workouts to see your volume trend"

---

## SUMMARY SECTION

### Complete Interactive Element Count
- **Total buttons across app**: ~65 (including form submits, nav links, dialog triggers, toggles)
- **Total forms**: 9 (Login, Register, Set Logger, Workout Plan, Nutrition Plan, Create Habit, Create Goal, Measurement, Profile, Preferences)
- **Total dialogs/modals**: 11 (Log Set, Rest Timer, Complete Workout, Regenerate Meals, Regenerate Single Meal, Activate Plan, Create Habit, Create Goal, Add Measurement, Delete Account, Goal Complete)
- **Total API endpoints called**: 28 distinct endpoints
- **Total distinct pages/routes**: 15 user-facing + 1 root redirect + 1 404

### Feature Completeness Matrix

| Feature | Frontend UI | Backend Endpoint | Fully Wired | Notes |
|---------|-------------|-----------------|-------------|-------|
| Login | Yes | POST /auth/login | Yes | |
| Register | Yes | POST /auth/register | Yes | |
| Onboarding | Yes | PATCH /profiles/me + POST /onboarding/complete-step | Yes | |
| Dashboard summary | Yes | GET /workouts/dashboard-summary | Yes | |
| Today's workout | Yes | Complex multi-step composition | Yes | |
| Start workout | Yes | POST /workout-sessions | Yes | |
| Complete workout | Yes | POST /workout-sessions/{id}/complete | Yes | |
| Log set | Yes | POST /workout-sessions/{id}/sets | Yes | |
| Delete set | Hook exists | DELETE /workout-sessions/{id}/sets/{setId} | Partially | Hook exists but no UI delete button |
| Generate workout plan | Yes | POST /workout-plans/generate | Yes | |
| Workout history | Yes | GET /workout-sessions/history | Yes | |
| Workout detail | Yes | GET /workout-sessions/{id} | Yes | |
| Exercise library | Yes | GET /exercises | Yes | |
| Exercise detail | Yes | GET /exercises/{slug} | Yes | |
| Exercise video | UI placeholder | None | No | Shows URL as text, no player |
| Nutrition plan view | Yes | GET /nutrition-plans/active | Yes | |
| Generate nutrition plan | Yes | POST /nutrition-plans/generate | Yes | |
| Regenerate meals | Yes | POST /nutrition-plans/{id}/regenerate | Yes | |
| Regenerate single meal | Yes | POST /nutrition-plans/{id}/meals/{mealId}/regenerate | Yes | |
| Plan history | Yes | GET /nutrition-plans | Yes | |
| Activate plan | Yes | PATCH /nutrition-plans/{id}/activate | Yes | |
| Meal logging | No UI | Stub in service | No | Service has stub methods |
| Food search | No UI | Stub returns empty | No | Service has stub method |
| Habits CRUD | Create + read | POST /habits, GET /habits | Partial | No edit or delete UI |
| Habit logging | Yes | POST /habits/{id}/entries | Yes | |
| Water tracking | No UI | Stub returns null | No | Dashboard service stubs only |
| Sleep tracking | No UI | Stub returns null | No | Dashboard service stubs only |
| Progress summary | Yes | GET /workouts/progress-summary | Yes | |
| Measurements | Yes | GET + POST /progress/measurements | Yes | No edit/delete |
| Progress photos | UI exists | GET /progress/photos | No data | Grid renders but always empty, no upload |
| Volume by week | Yes | GET /workouts/analytics/volume-by-week | Yes | |
| Personal records | Yes | GET /workouts/analytics/personal-records | Yes | |
| Goals CRUD | Create + read + update | POST/GET/PATCH /goals | Partial | No delete UI |
| Profile update | Yes | PATCH /profiles/me | Yes | |
| Preferences save | UI exists | None (throws 501) | No | Always fails with "not yet implemented" |
| Account deletion | UI exists | None | No | Button does nothing (no handler passed) |
| Weight trend | Yes | GET /progress/entries?metricType=BODY_WEIGHT | Yes | |
| Weekly summary | Yes | GET /progress/weekly-summary | Yes | |

### Data Flow Summary

| Entity | Created | Read | Updated | Deleted | Full CRUD |
|--------|---------|------|---------|---------|-----------|
| User Account | /register | /auth/me, /profiles/me | /profiles/me (profile) | No (button broken) | No |
| Workout Plan | /workout/plan | /workout/today (derived) | No | No | No |
| Workout Session | Start button | /workout/today, /workout/history, /workout/history/[id] | Complete button | No | Partial |
| Exercise Set | Log Set dialog | Exercise cards in workout views | No | Hook exists, no UI | Partial |
| Exercise | No (admin only) | /exercises, /exercises/[id] | No | No | Read only |
| Nutrition Plan | /nutrition/plan | /nutrition | Regenerate meals, activate plan | No | Partial |
| Habit | Create dialog | /habits, /dashboard | No edit UI | No | Partial |
| Habit Entry | "Mark Done" button | /habits (today entries), /dashboard checklist | No | No | Create + Read |
| Goal | Create dialog | /goals | Update progress, mark complete | No | Partial |
| Measurement | Add dialog | /progress (table) | No | No | Create + Read |
| Progress Photo | No | /progress (empty grid) | No | No | None |

### Navigation Map

```
/ ──redirect──> /dashboard

/login ──success──> /dashboard (or callbackUrl)
       ──link──> /register

/register ──success──> /onboarding
          ──link──> /login

/onboarding ──complete──> /dashboard

/dashboard ──Start/Continue/Details──> /workout/today
           ──Create Workout Plan──> /workout/plan

/workout/today ──Create Workout Plan──> /workout/plan
/workout/plan ──success──> /workout/today
/workout/history ──card click──> /workout/history/[id]
/workout/history/[id] ──Back to History──> /workout/history

/exercises ──card click──> /exercises/[slug]

/nutrition ──Update Plan / Create──> /nutrition/plan
/nutrition/plan ──success──> /nutrition

Sidebar nav links (all pages):
  Dashboard ──> /dashboard
  Today ──> /workout/today
  Exercises ──> /exercises
  Nutrition ──> /nutrition
  Habits ──> /habits
  Progress ──> /progress
  Goals ──> /goals
  Settings ──> /settings

Mobile bottom nav (6 items):
  Dashboard, Today, Nutrition, Habits, Progress, Goals

Log out ──> /login
```

### Stub / Broken Feature List

| UI Element | Location | Issue |
|-----------|----------|-------|
| "Save Preferences" button | /settings, Preferences tab | Always throws `ApiError(501, "Preferences saving is not yet implemented.")` — `userService.updatePreferences()` is a stub |
| "Delete Account" button + confirm dialog | /settings, Account tab | `DangerZone` component's `onDeleteAccount` prop is never passed by `SettingsView`, so confirm does nothing |
| Preferences data | /settings, Preferences tab | `getPreferences()` returns hardcoded defaults (`{ weightUnit: "kg", distanceUnit: "km", theme: "system", notifications: all true }`) — never reads from backend |
| Water tracking dashboard section | Dashboard service | `getWaterTarget()` and `logWater()` return `null` — no backend model |
| Sleep tracking dashboard section | Dashboard service | `getSleepSummary()` returns `null` — no backend model |
| Progress photos grid | /progress, Photos tab | `ProgressPhotoGrid` always receives `photos={[]}` — no upload mechanism, backend endpoint exists but no UI to upload |
| Food search | Nutrition service | `searchFood()` returns empty array — stub |
| Meal logging | Nutrition service | `logMealItem()` and `removeMealItem()` — stub methods, no UI |
| Exercise video display | /exercises/[id] | Shows "Video: {url}" as plain text instead of embedded player |
| Delete set | Workout hooks | `useDeleteSet` hook exists and is wired to `DELETE /workout-sessions/{id}/sets/{setId}` but no UI button exposes it |
| Habit edit/delete | /habits | No UI to edit habit name/frequency or delete habits |
| Goal delete | /goals | No UI to delete goals |
| Measurement edit/delete | /progress | No UI to edit or delete measurements |
