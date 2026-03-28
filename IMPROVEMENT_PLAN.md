# FitTrack — Comprehensive Improvement & Enhancement Plan

> This document is a read-only plan. No code changes have been made.
> Generated from a full-stack audit of the gymSite repository.

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Critical Fixes (P0 — Must Fix Before Any Deployment)](#2-critical-fixes-p0)
3. [Security Hardening (P1)](#3-security-hardening-p1)
4. [Frontend Feature Completion (P1)](#4-frontend-feature-completion-p1)
5. [Backend Feature Completion (P1)](#5-backend-feature-completion-p1)
6. [Testing Strategy (P1)](#6-testing-strategy-p1)
7. [Infrastructure & DevOps (P1)](#7-infrastructure--devops-p1)
8. [UX & Accessibility (P2)](#8-ux--accessibility-p2)
9. [Performance Optimization (P2)](#9-performance-optimization-p2)
10. [New Features — Phase 1 (P2)](#10-new-features--phase-1-p2)
11. [New Features — Phase 2 (P3)](#11-new-features--phase-2-p3)
12. [Data & Analytics (P3)](#12-data--analytics-p3)
13. [Mobile & PWA (P3)](#13-mobile--pwa-p3)
14. [Technical Debt Backlog](#14-technical-debt-backlog)
15. [Implementation Timeline](#15-implementation-timeline)

---

## 1. Executive Summary

### Current State
FitTrack is a well-architected monorepo with a NestJS backend (12 feature modules, 85+ REST endpoints, 25+ Prisma models) and a Next.js 16 frontend (15 user-facing routes, 283 source files). The codebase demonstrates strong separation of concerns, event-driven architecture, and proper auth patterns.

### Critical Gaps
- **5 stub services** that throw 501 or return null (preferences, meal logging, food search, water, sleep)
- **2 broken UI features** (delete account, progress photos)
- **Zero rate limiting** on public auth endpoints
- **Zero security headers** (no Helmet)
- **~2.5% frontend test coverage**, ~7% backend test coverage
- **No CI/CD pipeline**, no Dockerfiles, no deployment config
- **No error tracking** (Sentry), no APM, no structured logging
- **No email delivery** (console adapter only)
- **No file storage** for production (local filesystem only)

### Strengths to Build On
- Clean module architecture with domain events
- Proper JWT auth with refresh token rotation and account lockout
- Comprehensive Prisma schema with correct indexes
- Zod validation at both API boundaries
- Role-based access control (MEMBER/TRAINER/ADMIN)
- Audit logging for admin actions
- ESLint boundary rules enforcing feature isolation

---

## 2. Critical Fixes (P0 — Must Fix Before Any Deployment)

### 2.1 Delete Account Button Does Nothing

**Problem**: `DangerZone` component accepts `onDeleteAccount` prop but `SettingsView` never passes it. Clicking "Delete Account" → confirm → callback is `undefined`.

**Files**:
- `frontend/src/features/settings/containers/settings-view.tsx` (line 85)
- `frontend/src/features/settings/components/danger-zone.tsx` (line 38)

**Fix**:
1. Add `DELETE /api/auth/me` endpoint to backend auth controller
2. Backend: Soft-delete user (set `accountStatus: DEACTIVATED`), revoke all sessions
3. Frontend: Wire `onDeleteAccount` in `SettingsView` to call `authService.deleteAccount()`
4. After success: clear tokens, redirect to login with toast "Account deleted"
5. Consider a 30-day grace period before hard deletion

**Estimated effort**: 4 hours

---

### 2.2 Preferences Save Always Fails (501)

**Problem**: `userService.updatePreferences()` throws `ApiError(501, "Preferences saving is not yet implemented")`. User sees toast "Failed to save preferences" with no explanation.

**Files**:
- `frontend/src/api/services/user.service.ts` (lines 69-76)
- `frontend/src/features/settings/containers/settings-view.tsx` (lines 74-78)

**Fix**:
1. Backend: Add `UserPreference` model to Prisma schema (userId, key, value JSON, updatedAt)
2. Backend: Add `GET /api/profiles/me/preferences` and `PATCH /api/profiles/me/preferences` endpoints
3. Frontend: Replace stub with real API calls
4. Alternatively (simpler): Store preferences in the existing `Profile` model by adding `weightUnit`, `distanceUnit`, `theme`, `notificationPrefs` columns

**Estimated effort**: 6 hours

---

### 2.3 Progress Photos Always Empty

**Problem**: `ProgressPhotoGrid` always receives `photos={[]}` (hardcoded). The `progressService.getProgressPhotos()` API exists but is never called. Additionally, the frontend schema (`photo.imageUrl`, `photo.date`) doesn't match backend response shape (`photo.storagePath`, `photo.takenAt`).

**Files**:
- `frontend/src/features/progress/containers/progress-overview-view.tsx` (line 169)
- `frontend/src/features/progress/components/progress-photo-grid.tsx`
- `frontend/src/api/schemas/progress.schema.ts` (lines 46-51)

**Fix**:
1. Fix schema mismatch: Align frontend schema fields with backend response
2. Add `useProgressPhotos()` hook calling `progressService.getProgressPhotos()`
3. Replace hardcoded `photos={[]}` with `photos={progressPhotos ?? []}`
4. Add photo upload UI (file input → `POST /api/progress/photos` with multipart)
5. Backend: Replace `LocalStorageAdapter` with cloud storage (S3/CloudFlare R2) for production
6. Add image optimization/thumbnailing

**Estimated effort**: 12 hours

---

### 2.4 Global Error Boundary Missing

**Problem**: No `error.tsx` or `global-error.tsx` in the Next.js app directory. Unhandled exceptions crash to the default Next.js error page. No React error boundary wrapping the provider tree.

**Files to create**:
- `frontend/src/app/error.tsx` — Catch-all for route segment errors
- `frontend/src/app/global-error.tsx` — Catch-all for root layout errors

**Fix**:
1. Create `error.tsx` with "Something went wrong" UI + "Try again" button
2. Create `global-error.tsx` for layout-level crashes
3. Both should log the error (to Sentry when available)
4. Include a "Go to Dashboard" fallback link

**Estimated effort**: 2 hours

---

### 2.5 Exercise Video URL Shown as Text

**Problem**: `ExerciseDetailCard` displays `exercise.videoUrl` as plain text "Video: {url}" instead of an embedded player.

**File**: `frontend/src/features/exercise/components/exercise-detail-card.tsx` (lines 21-24)

**Fix**:
1. If URL is YouTube/Vimeo: render `<iframe>` embed with proper aspect ratio
2. If URL is direct video file: render `<video>` element with controls
3. Add thumbnail extraction for list views
4. Add error handling for broken/inaccessible video URLs

**Estimated effort**: 3 hours

---

## 3. Security Hardening (P1)

### 3.1 Rate Limiting (CRITICAL)

**Problem**: Zero rate limiting on any endpoint. Auth endpoints (`/register`, `/login`, `/forgot-password`) are wide open to brute force.

**Fix**:
1. Install `@nestjs/throttler`
2. Apply global default: 60 requests/minute
3. Tighter limits on auth endpoints:
   - `/login`: 10 requests/minute per IP
   - `/register`: 5 requests/minute per IP
   - `/forgot-password`: 3 requests/hour per email
   - `/refresh`: 20 requests/minute per token
4. Return `429 Too Many Requests` with `Retry-After` header

**Estimated effort**: 3 hours

---

### 3.2 Security Headers (CRITICAL)

**Problem**: No Helmet middleware. Missing X-Frame-Options, CSP, HSTS, X-Content-Type-Options.

**Fix**:
1. Install `helmet` package
2. Add `app.use(helmet())` in `main.ts`
3. Configure CSP to allow the frontend origin
4. Add `Strict-Transport-Security` for HTTPS enforcement
5. Frontend: Add security headers in `next.config.ts`

**Estimated effort**: 2 hours

---

### 3.3 Request Body Size Limits

**Problem**: No limits on request payload size. Potential for large payload DoS.

**Fix**:
1. Add `app.use(express.json({ limit: '10kb' }))` for most endpoints
2. Increase limit for photo upload endpoints (`5mb`)
3. Add file type validation for uploads (accept only images)

**Estimated effort**: 1 hour

---

### 3.4 Log Sanitization

**Problem**: Logging interceptor logs full URLs which may include tokens/sensitive query params.

**Fix**:
1. Sanitize request URLs before logging (mask `token=`, `password=`, etc.)
2. Never log request bodies on auth endpoints
3. Add structured logging format (JSON) with correlation IDs
4. Consider `pino` or `winston` for structured log output

**Estimated effort**: 4 hours

---

### 3.5 Email Verification

**Problem**: `emailVerifiedAt` field exists in schema but verification flow not implemented. Users can register with fake emails.

**Fix**:
1. On registration: Generate verification token, send verification email
2. Add `GET /api/auth/verify-email?token=...` endpoint
3. Store `emailVerifiedAt` timestamp on verification
4. Optionally: Restrict certain features until email verified
5. Add resend verification email endpoint

**Estimated effort**: 8 hours

---

### 3.6 CORS Hardening for Production

**Problem**: `CORS_ORIGIN` defaults to `http://localhost:3000`. Must be explicitly set in production.

**Fix**:
1. Make `CORS_ORIGIN` required when `NODE_ENV=production` in env validation schema
2. Support multiple origins via comma-separated list
3. Log a warning if wildcard `*` is used

**Estimated effort**: 1 hour

---

### 3.7 Failed Auth Attempt Logging

**Problem**: Audit logs only track admin actions. Failed login/registration attempts not logged.

**Fix**:
1. Create `SecurityEvent` model or extend audit log
2. Log: Failed logins (IP, email, timestamp), account lockouts, password reset requests
3. Add admin endpoint to view security events
4. Consider alerting on anomalous patterns (e.g., 50+ failed logins from one IP)

**Estimated effort**: 6 hours

---

## 4. Frontend Feature Completion (P1)

### 4.1 Meal Logging

**Problem**: `logMeal()`, `updateMealItem()`, `deleteMealItem()` all throw 501. No UI for logging actual food intake against the plan.

**Files**:
- `frontend/src/api/services/nutrition.service.ts` (lines 297-312)

**Fix**:
1. Backend: Add `MealLog` model (userId, date, mealTemplateId, foodItems JSON, macros)
2. Backend: Add `POST /api/nutrition-plans/{planId}/logs`, `GET /api/nutrition-plans/{planId}/logs?date=`
3. Frontend: Add daily meal logging view showing planned meals with "Log" button
4. Frontend: Add progress tracking (planned vs. actual macros)
5. Frontend: Add food item quantity adjustment in logged meals

**Estimated effort**: 20 hours

---

### 4.2 Food Search

**Problem**: `searchFoods()` returns empty array. No food database search for custom meal logging.

**Fix**:
1. Backend: Seed the `FoodItem` table with comprehensive Indian food database (already partially exists with ~300 items in seed)
2. Backend: Add `GET /api/food-items?search=&isVeg=&limit=` endpoint with full-text search
3. Frontend: Add search-as-you-type food search component
4. Frontend: Show results with macros per serving
5. Long-term: Integrate external food API (e.g., USDA FoodData Central, OpenFoodFacts)

**Estimated effort**: 12 hours

---

### 4.3 Water & Sleep Tracking

**Problem**: `getWaterTarget()`, `logWater()`, `getSleepSummary()` all return null. Dashboard sections reference these but show nothing.

**Fix**:
1. Backend: Add `WaterLog` model (userId, date, amountMl, loggedAt)
2. Backend: Add `SleepLog` model (userId, date, durationMinutes, quality, loggedAt)
3. Backend: CRUD endpoints for both
4. Frontend: Add water tracking widget (cup icons, +250ml button, daily target ring)
5. Frontend: Add sleep tracking widget (bedtime/wake time picker, quality rating)
6. Dashboard: Wire water/sleep sections to real data

**Estimated effort**: 16 hours

---

### 4.4 Habit Edit & Delete

**Problem**: No UI to edit habit name/frequency/color or delete habits. Backend endpoints exist (`PATCH /habits/:id`, `DELETE /habits/:id`).

**Fix**:
1. Add "Edit" icon button to each habit card
2. Open edit dialog with pre-filled form (same as create form)
3. Add "Delete" option in edit dialog or as separate action
4. Confirm deletion with ConfirmDialog
5. Invalidate queries on success

**Estimated effort**: 4 hours

---

### 4.5 Goal Delete

**Problem**: No UI to delete goals. Backend endpoint exists (`DELETE /goals/:id`).

**Fix**:
1. Add delete button/menu item to goal card footer
2. Confirm deletion with ConfirmDialog
3. Wire to `goalsService.deleteGoal(id)`
4. Invalidate queries on success

**Estimated effort**: 2 hours

---

### 4.6 Measurement Edit & Delete

**Problem**: No UI to edit or delete body measurements. Only create exists.

**Fix**:
1. Add swipe-to-delete or delete button per measurement row
2. Add inline edit capability for value corrections
3. Wire to backend endpoints

**Estimated effort**: 4 hours

---

### 4.7 Set Deletion UI

**Problem**: `useDeleteSet` hook exists and is wired to `DELETE /workout-sessions/{id}/sets/{setId}` but no UI button exposes it.

**Fix**:
1. Add swipe-to-delete or long-press menu on ExerciseSetRow
2. Add ConfirmDialog for deletion
3. Wire to existing `useDeleteSet` mutation

**Estimated effort**: 3 hours

---

### 4.8 Workout Plan Management

**Problem**: Users can generate plans but cannot view, edit, or delete them. No plan management UI.

**Fix**:
1. Add `/workout/plans` page listing all user plans (active, paused, archived)
2. Show plan details: name, days, exercises per day, status
3. Add ability to switch active plan
4. Add ability to pause/archive old plans
5. Add ability to manually add/remove exercises from plan days

**Backend endpoints already exist**: `GET /api/workout-plans`, `PATCH /api/workout-plans/:id`, `DELETE /api/workout-plans/:id`

**Estimated effort**: 16 hours

---

## 5. Backend Feature Completion (P1)

### 5.1 Production Email Adapter

**Problem**: `ConsoleEmailAdapter` logs emails to console. No actual email delivery.

**Fix**:
1. Create `SendGridEmailAdapter` or `SESEmailAdapter` implementing `EmailPort`
2. Configure via environment variables
3. Swap adapter in `app.module.ts` based on `NODE_ENV`
4. Add email templates (password reset, verification, welcome)
5. Add email queue/retry logic (consider Bull/BullMQ)

**Estimated effort**: 8 hours

---

### 5.2 Production File Storage

**Problem**: `LocalStorageAdapter` stores files on local filesystem. Not scalable, lost on container restart.

**Fix**:
1. Create `S3StorageAdapter` implementing `FileStoragePort`
2. Configure bucket, region, credentials via env vars
3. Add presigned URL generation for direct uploads
4. Add image resizing/thumbnail generation (Sharp or AWS Lambda)
5. Swap adapter based on `NODE_ENV`

**Estimated effort**: 8 hours

---

### 5.3 API Documentation (Swagger/OpenAPI)

**Problem**: No API documentation despite `@nestjs/swagger` being available.

**Fix**:
1. Add Swagger decorators to all DTOs (`@ApiProperty`, `@ApiResponse`)
2. Configure SwaggerModule in `main.ts`
3. Add authentication scheme documentation
4. Generate OpenAPI spec and host at `/api/docs`
5. Add request/response examples

**Estimated effort**: 12 hours

---

### 5.4 Health Check Endpoint

**Problem**: No health check for load balancers, Kubernetes probes, or monitoring.

**Fix**:
1. Install `@nestjs/terminus`
2. Add `GET /api/health` endpoint checking:
   - Database connectivity (Prisma ping)
   - Memory usage
   - Disk space (for local storage)
3. Add `GET /api/health/ready` for readiness probes
4. Add `GET /api/health/live` for liveness probes

**Estimated effort**: 3 hours

---

### 5.5 Goal Milestones Frontend

**Problem**: Backend has full milestone CRUD (`GET/POST/DELETE /goals/:id/milestones`, `POST /goals/:id/milestones/:id/achieve`) but frontend has no milestone UI.

**Fix**:
1. Add milestone list inside expanded goal card
2. Add "Add Milestone" button with inline form
3. Show milestone progress as mini checkpoints on the progress bar
4. Add "Achieve" button per milestone
5. Celebration animation when milestone achieved

**Estimated effort**: 10 hours

---

### 5.6 Workout Day Rescheduling

**Problem**: Backend has `PATCH /workout-plans/days/:dayId/reschedule` but no frontend UI.

**Fix**:
1. Add "Reschedule" option when a workout day is missed
2. Show calendar date picker for new date
3. Update the workout plan display to reflect rescheduled days

**Estimated effort**: 4 hours

---

## 6. Testing Strategy (P1)

### 6.1 Current State

| Layer | Test Files | Source Files | Coverage |
|-------|-----------|-------------|----------|
| Backend unit | 20 specs | 281 files | ~7% |
| Backend E2E | 1 placeholder | — | ~0% |
| Frontend unit | 7 tests | 283 files | ~2.5% |
| Frontend component | 0 | — | 0% |
| Frontend E2E | 0 | — | 0% |

### 6.2 Recommended Test Strategy

**Phase 1 — Critical Path Coverage (Target: 40%)**

Backend:
- Auth flow: register → login → refresh → logout → password reset (E2E with supertest)
- Workout flow: create plan → start session → log sets → complete (E2E)
- Nutrition flow: generate plan → regenerate meals (E2E)
- All service methods (unit tests with mocked repositories)
- All mappers/DTOs (unit tests)
- Error handling paths

Frontend:
- Auth forms: login, register (React Testing Library)
- Critical hooks: `useTodayWorkout`, `useActiveNutritionPlan`, `useGoals` (mock API)
- Form validation: all Zod schemas (unit tests)
- API client: token refresh logic, error handling (unit tests)

**Phase 2 — Feature Coverage (Target: 70%)**

Backend:
- All repository methods with test database (integration)
- Guard/pipe behavior (unit)
- Event listeners (unit)
- Concurrent operations (session locking, plan activation)

Frontend:
- All page views: loading, error, empty, loaded states (RTL)
- Interactive components: habit card toggle, goal progress update, set logger
- Mobile responsiveness (visual regression with Playwright)

**Phase 3 — Confidence Coverage (Target: 85%)**

- E2E flows with Playwright (full browser automation)
- Performance tests (response time benchmarks)
- Accessibility tests (axe-core integration)
- Visual regression (screenshot comparison)

### 6.3 Coverage Enforcement

1. Add to `jest.config` / `vitest.config`:
   ```json
   coverageThreshold: {
     global: { branches: 40, functions: 50, lines: 50, statements: 50 }
   }
   ```
2. Block PR merge if coverage drops below threshold
3. Generate HTML coverage reports in CI

**Estimated effort**: 80 hours total across phases

---

## 7. Infrastructure & DevOps (P1)

### 7.1 CI/CD Pipeline (GitHub Actions)

**Problem**: No automated testing, linting, or deployment.

**Fix — Create `.github/workflows/ci.yml`**:

```yaml
# Trigger: push to main, PRs to main
Jobs:
  1. lint-backend:
     - npm ci, npm run lint
  2. lint-frontend:
     - npm ci, npm run lint
  3. test-backend:
     - Start PostgreSQL service container
     - npm ci, npx prisma migrate deploy, npm run test:cov
     - Upload coverage artifact
  4. test-frontend:
     - npm ci, npm run test -- --coverage
     - Upload coverage artifact
  5. build-backend:
     - npm run build (verify compilation)
  6. build-frontend:
     - npm run build (verify Next.js build)
  7. deploy (main only):
     - Build Docker images
     - Push to container registry
     - Deploy to staging/production
```

**Estimated effort**: 8 hours

---

### 7.2 Dockerfiles

**Problem**: No Dockerfiles for backend or frontend.

**Fix**:

**Backend Dockerfile** (multi-stage):
```
Stage 1: Install deps + generate Prisma client
Stage 2: Build TypeScript
Stage 3: Production image (node:22-slim)
  - Copy dist/, node_modules/, prisma/
  - Expose 3001
  - CMD ["node", "dist/src/main.js"]
```

**Frontend Dockerfile** (multi-stage):
```
Stage 1: Install deps
Stage 2: Build Next.js (standalone output)
Stage 3: Production image (node:22-slim)
  - Copy standalone + static + public
  - Expose 3000
  - CMD ["node", "server.js"]
```

**docker-compose.yml** (full stack):
```yaml
services:
  postgres:
    image: postgres:16-alpine
  redis:
    image: redis:7-alpine
  backend:
    build: ./backend
    depends_on: [postgres, redis]
  frontend:
    build: ./frontend
    depends_on: [backend]
```

**Estimated effort**: 6 hours

---

### 7.3 Error Tracking (Sentry)

**Problem**: No error tracking. Exceptions vanish into console logs.

**Fix**:
1. Install `@sentry/nestjs` for backend, `@sentry/nextjs` for frontend
2. Configure DSN via environment variable
3. Capture all unhandled exceptions + rejected promises
4. Add user context (userId, email) for authenticated errors
5. Add source maps upload for readable stack traces
6. Set up alerts for error spikes

**Estimated effort**: 4 hours

---

### 7.4 Structured Logging

**Problem**: Console-only logging with no structure, no correlation IDs, no log shipping.

**Fix**:
1. Replace NestJS Logger with `pino` or `winston`
2. JSON output format: `{ timestamp, level, message, requestId, userId, duration }`
3. Add request ID middleware (generate UUID per request, pass through headers)
4. Ship logs to CloudWatch/Datadog/ELK via log driver or sidecar
5. Add log levels per environment (debug in dev, warn in prod)

**Estimated effort**: 8 hours

---

### 7.5 Database Connection Pooling

**Problem**: No visible connection pool configuration. Under load, Prisma will exhaust connections.

**Fix**:
1. Configure Prisma connection pool in `DATABASE_URL`:
   `?connection_limit=20&pool_timeout=10`
2. For production: Use PgBouncer as connection pooler in front of PostgreSQL
3. Add connection pool metrics to health check

**Estimated effort**: 2 hours

---

### 7.6 Environment Separation

**Problem**: No distinction between dev/staging/production configs.

**Fix**:
1. Create `.env.development`, `.env.staging`, `.env.production` templates
2. Add environment-specific config loading in `app.config.ts`
3. Different defaults per environment (e.g., log level, CORS, rate limits)
4. Never use default secrets in production (fail-fast validation)

**Estimated effort**: 3 hours

---

## 8. UX & Accessibility (P2)

### 8.1 Skip Navigation Link

**Problem**: No skip-to-main-content link. Keyboard users must tab through full sidebar.

**Fix**: Add visually hidden skip link as first child of `<body>`:
```tsx
<a href="#main-content" className="sr-only focus:not-sr-only focus:absolute ...">
  Skip to main content
</a>
```
Add `id="main-content"` to `<main>` element.

**Estimated effort**: 30 minutes

---

### 8.2 Form Accessibility

**Problem**: `aria-invalid` used inconsistently. Error messages not linked via `aria-describedby`.

**Fix**:
1. Update `FormFieldWrapper` to generate unique IDs and add `aria-describedby` to child input
2. Ensure all form fields use `aria-invalid={!!error}` consistently
3. Add `role="alert"` to error message containers for screen reader announcement
4. Add required attribute to all required fields (not just visual asterisk)

**Estimated effort**: 4 hours

---

### 8.3 Chart Accessibility

**Problem**: SVG charts (volume, weight trend, macro donut) lack descriptive alternatives.

**Fix**:
1. Add `aria-label` to all SVG chart containers with data summary
2. Add `<desc>` element inside SVGs with textual description of the data
3. For complex charts: Add a visually hidden data table alternative
4. Ensure chart colors meet WCAG contrast ratios

**Estimated effort**: 4 hours

---

### 8.4 Modal Focus Management

**Problem**: Focus not consistently returned to trigger element after dialog close.

**Fix**:
1. Audit all Dialog/Sheet usages for focus return behavior
2. Ensure Radix Dialog handles this (it usually does — verify with testing)
3. Add `autoFocus` to first focusable element in dialogs
4. Trap focus within modal while open (Radix handles this)

**Estimated effort**: 3 hours

---

### 8.5 Color Contrast Audit

**Problem**: `text-muted-foreground/80` and `text-primary/60` classes may fail WCAG AA contrast ratios (4.5:1 for normal text).

**Fix**:
1. Run automated contrast check on all color combinations
2. Adjust opacity values to meet 4.5:1 minimum
3. Specifically check: muted text on glass backgrounds, gradient-text readability, badge text on colored backgrounds
4. Test both light and dark modes

**Estimated effort**: 4 hours

---

### 8.6 DataTable Improvements

**Problem**: Admin DataTable is minimal — no column headers as `<th>`, no sort, no accessible pagination.

**Fix**:
1. Use semantic `<table>`, `<thead>`, `<th scope="col">`, `<tbody>`, `<tr>`, `<td>`
2. Add `aria-sort` for sortable columns
3. Add `aria-label` to pagination buttons
4. Add table `<caption>` for screen readers
5. Add row count announcement for screen readers

**Estimated effort**: 6 hours

---

## 9. Performance Optimization (P2)

### 9.1 Next.js Configuration

**Problem**: `next.config.ts` is empty — no optimization configured.

**Fix**:
1. Enable `output: 'standalone'` for Docker deployment
2. Configure image optimization with allowed domains
3. Add security headers via `headers()` function
4. Add redirect rules (e.g., `/` → `/dashboard`)
5. Enable `experimental.optimizePackageImports` for heavy libraries (lucide-react)
6. Configure `compress: true`

**Estimated effort**: 3 hours

---

### 9.2 API Response Caching

**Problem**: No HTTP caching headers on any backend response.

**Fix**:
1. Add `Cache-Control` headers for read-only endpoints:
   - Exercise list: `public, max-age=300` (5 min)
   - Exercise detail: `public, max-age=3600` (1 hour)
   - User-specific data: `private, no-cache` (revalidate with ETag)
2. Add `ETag` generation for list endpoints
3. Frontend: Configure TanStack Query `staleTime` to match cache headers

**Estimated effort**: 6 hours

---

### 9.3 Database Query Optimization

**Problem**: Some API calls chain multiple sequential queries (e.g., `getTodayWorkout` makes 5+ sequential requests from frontend).

**Fix**:
1. Backend: Add aggregate endpoints that return pre-joined data
   - `GET /api/workout-sessions/today` — single endpoint returning full workout with exercises and sets
   - `GET /api/dashboard/summary` — single endpoint replacing 7+ frontend calls
2. Use Prisma `include` and `select` to minimize data transfer
3. Add database-level caching (Redis) for expensive queries

**Estimated effort**: 12 hours

---

### 9.4 Bundle Size Optimization

**Fix**:
1. Audit bundle with `next build --analyze`
2. Lazy-load heavy pages (admin, settings, onboarding)
3. Use `next/dynamic` for large components (charts, forms)
4. Tree-shake lucide-react (import specific icons, not barrel)
5. Check for duplicate dependencies

**Estimated effort**: 4 hours

---

### 9.5 Image Optimization

**Problem**: Exercise images served as raw URLs with no optimization.

**Fix**:
1. Use `next/image` for all exercise images (automatic WebP, lazy loading, sizing)
2. Add image CDN (CloudFlare Images, Imgix, or Vercel Image Optimization)
3. Generate responsive srcsets for different screen sizes
4. Add blur placeholders for loading state

**Estimated effort**: 6 hours

---

## 10. New Features — Phase 1 (P2)

### 10.1 Global Search

**Problem**: No search functionality across exercises, workouts, or other content from the main app.

**Implementation**:
1. Add `Cmd+K` / `Ctrl+K` keyboard shortcut for quick search
2. Create `SearchDialog` component with categories: Exercises, Workouts, Goals
3. Backend: Add `GET /api/search?q=` endpoint that searches across entities
4. Frontend: Show results grouped by category with keyboard navigation
5. Use debounced input (300ms)

**Estimated effort**: 16 hours

---

### 10.2 Workout Templates

**Problem**: Plans are auto-generated only. No ability to save, reuse, or share workout templates.

**Implementation**:
1. Add "Save as Template" button on completed workout plans
2. Create template library page showing user's saved templates
3. Add "Use Template" option in plan creation flow
4. Allow editing template before applying
5. Backend: Add `WorkoutTemplate` model (or reuse plan with `isTemplate` flag)

**Estimated effort**: 16 hours

---

### 10.3 Workout Timer Improvements

**Problem**: Rest timer is basic countdown in a dialog. No interval timer, no EMOM, no AMRAP timer.

**Implementation**:
1. Add timer modes: Rest (existing), Interval (work/rest cycles), Stopwatch
2. Add audio notification when timer completes
3. Add vibration on mobile
4. Show timer as persistent banner during workout (not just dialog)
5. Auto-suggest rest time based on exercise type (compound: 3min, isolation: 90s)

**Estimated effort**: 12 hours

---

### 10.4 Exercise History Per Exercise

**Problem**: No way to see all past sets for a specific exercise (progress tracking per lift).

**Implementation**:
1. Add "History" tab or expandable section in ExerciseDetailCard
2. Show all logged sets for this exercise across all sessions
3. Display as chart: weight × reps over time
4. Show PR highlights with date achieved
5. Backend: `GET /api/exercises/:id/history?userId=`

**Estimated effort**: 10 hours

---

### 10.5 Superset / Circuit Grouping

**Problem**: Exercises in a workout day are flat list. No concept of supersets, circuits, or paired exercises.

**Implementation**:
1. Add `groupId` and `groupType` (superset/circuit/dropset) to `WorkoutDayExercise`
2. UI: Group exercises visually with connecting indicator
3. Rest timer: Different behavior for intra-group vs. inter-group rest
4. Plan generation: Support superset pairing (e.g., push + pull)

**Estimated effort**: 16 hours

---

### 10.6 Data Export

**Problem**: No ability to export workout history, measurements, or other data.

**Implementation**:
1. Add "Export Data" button in Settings page
2. Support CSV export for: workout history, body measurements, habit logs
3. Support JSON export for full data backup
4. Backend: `GET /api/export/workouts?format=csv&from=&to=`
5. Generate downloadable file and stream to client

**Estimated effort**: 10 hours

---

## 11. New Features — Phase 2 (P3)

### 11.1 Social Features — Follow & Share

1. Add `UserFollow` model (followerId, followedId)
2. Public profile pages with opt-in workout sharing
3. Activity feed showing friends' completed workouts
4. "Share Workout" button generating a shareable link
5. Privacy settings: public/friends-only/private

**Estimated effort**: 40 hours

---

### 11.2 Leaderboards

1. Weekly/monthly/all-time leaderboards by:
   - Total volume lifted
   - Workout streak
   - Most workouts completed
   - Highest single-lift PR
2. Opt-in (privacy-respecting)
3. Friend-only leaderboards

**Estimated effort**: 20 hours

---

### 11.3 Achievement System

1. Define achievements: "First Workout", "100kg Bench", "30-Day Streak", "10,000kg Volume Week"
2. Award badges automatically via domain event listeners
3. Display on user profile and dashboard
4. Notification when achievement unlocked
5. Progress towards next achievement

**Estimated effort**: 24 hours

---

### 11.4 Trainer Features

1. Trainer can create plans for assigned clients
2. Client sees trainer-assigned plans alongside self-generated ones
3. Trainer dashboard: view all client progress
4. In-app messaging between trainer and client
5. Trainer can comment on completed workouts

**Estimated effort**: 60 hours

---

### 11.5 Real-Time Notifications

1. WebSocket connection via `@nestjs/websockets` (Socket.IO or native WS)
2. Notification types: workout reminder, streak at risk, goal deadline approaching, trainer message
3. Push notifications via Web Push API (service worker)
4. Email digest (daily/weekly summary)
5. In-app notification bell with unread count

**Estimated effort**: 40 hours

---

### 11.6 AI-Powered Features

1. **Smart workout suggestions**: Recommend next exercise based on muscle group balance
2. **Deload detection**: Suggest deload week based on volume/fatigue trends
3. **Nutrition adjustment**: Auto-adjust calories based on weight trend
4. **Form tips**: AI-generated exercise tips based on logged RPE patterns
5. **Progress predictions**: Projected 1RM based on historical data

**Estimated effort**: 60 hours

---

## 12. Data & Analytics (P3)

### 12.1 Advanced Progress Dashboard

1. **Body composition chart**: Weight + body fat % overlaid on same timeline
2. **Volume progression chart**: Per exercise, per muscle group, total
3. **Frequency heatmap**: GitHub-style contribution graph for workout days
4. **Estimated 1RM tracking**: Epley/Brzycki formula applied to logged sets
5. **Training volume by muscle group over time**: Stacked area chart
6. **RPE distribution**: How hard are workouts trending?
7. **Rest time analysis**: Average rest between sets over time

**Estimated effort**: 30 hours

---

### 12.2 Admin Analytics Dashboard

1. **User growth chart**: New registrations over time
2. **Retention cohort analysis**: Week-over-week user retention
3. **Feature usage metrics**: Most-used features, least-used features
4. **Workout completion rate**: Started vs. completed sessions
5. **Popular exercises**: Most logged exercises across all users

**Estimated effort**: 20 hours

---

### 12.3 Reporting & Insights

1. **Weekly summary email**: Workouts completed, volume, streaks, macro adherence
2. **Monthly progress report**: Downloadable PDF with charts and stats
3. **Goal progress alerts**: Notify when ahead/behind goal pace
4. **Personal records celebration**: Special notification/animation when PR achieved

**Estimated effort**: 24 hours

---

## 13. Mobile & PWA (P3)

### 13.1 PWA Setup

1. Create `manifest.json` with app name, icons, theme color, display: standalone
2. Add service worker for:
   - Offline page caching (app shell)
   - API response caching (stale-while-revalidate for read endpoints)
   - Background sync for failed mutations (set logs, habit marks)
3. Add install prompt banner
4. Configure Next.js for PWA via `next-pwa`

**Estimated effort**: 16 hours

---

### 13.2 Offline Workout Logging

1. Cache active workout plan in IndexedDB
2. Allow set logging while offline
3. Queue logged sets for sync when connection restored
4. Show offline indicator in UI
5. Resolve conflicts (server wins for most data)

**Estimated effort**: 24 hours

---

### 13.3 Haptic Feedback

1. Add `navigator.vibrate()` calls for:
   - Timer completion (long pulse)
   - Set logged (short pulse)
   - Habit completed (double pulse)
   - PR achieved (pattern)
2. Respect system haptic preferences

**Estimated effort**: 2 hours

---

### 13.4 Native App Considerations

For future native app development:
1. Extract API service layer into shared package
2. Document all API endpoints with OpenAPI spec
3. Consider React Native or Capacitor for code sharing
4. Key native features: push notifications, camera (progress photos), health app integration (Apple Health, Google Fit)

---

## 14. Technical Debt Backlog

### 14.1 TypeScript Strictness

**Problem**: Backend has `noImplicitAny: false` and `strictBindCallApply: false`.

**Fix**: Enable strict mode incrementally. Fix resulting type errors.

---

### 14.2 Frontend `"use client"` Overuse

**Problem**: Almost every component is marked `"use client"`. Some could be server components.

**Fix**: Audit components — move static/display-only components to server components. Keep `"use client"` only for components with hooks, event handlers, or browser APIs.

---

### 14.3 Inconsistent Error Messages

**Problem**: Some errors show raw API messages, some show generic text, some show nothing.

**Fix**: Create centralized error message map. All user-facing errors go through `formatErrorMessage()`. Never show raw server errors to users.

---

### 14.4 Admin Route Pages vs. Modals

**Problem**: Routes `exerciseNew` and `exerciseEdit` defined in `routes.ts` but pages don't exist. Feature uses modal dialogs instead.

**Fix**: Either remove the route definitions (if modal-only approach is intentional) or create the dedicated pages for deep-linking support.

---

### 14.5 Dashboard Summary Endpoint

**Problem**: Frontend dashboard makes 7+ parallel API calls to compose the dashboard view. The `GET /workouts/dashboard-summary` endpoint exists but doesn't aggregate all needed data.

**Fix**: Expand the dashboard summary endpoint to include: today's workout status, streak, calorie/protein progress, habits completion, weight trend, weekly summary. Single API call replaces 7.

---

### 14.6 Stale Task List from Previous Sessions

**Problem**: Task list contains completed items from prior redesign sessions (tasks #1-#20).

**Fix**: Clean up stale tasks. Use fresh task lists per session.

---

## 15. Implementation Timeline

### Sprint 1 (Week 1-2): Critical Fixes + Security
- [ ] 2.1 Delete account wiring
- [ ] 2.2 Preferences persistence
- [ ] 2.4 Global error boundary
- [ ] 2.5 Video embed
- [ ] 3.1 Rate limiting
- [ ] 3.2 Security headers
- [ ] 3.3 Body size limits

### Sprint 2 (Week 3-4): CI/CD + Testing Foundation
- [ ] 7.1 GitHub Actions CI/CD pipeline
- [ ] 7.2 Dockerfiles
- [ ] 7.3 Sentry integration
- [ ] 6.2 Phase 1 tests (critical path coverage)
- [ ] 5.4 Health check endpoints
- [ ] 3.4 Log sanitization

### Sprint 3 (Week 5-6): Feature Completion
- [ ] 4.4 Habit edit/delete UI
- [ ] 4.5 Goal delete UI
- [ ] 4.6 Measurement edit/delete UI
- [ ] 4.7 Set deletion UI
- [ ] 2.3 Progress photos (with cloud storage)
- [ ] 5.2 S3 storage adapter
- [ ] 5.1 Email adapter (SendGrid)

### Sprint 4 (Week 7-8): Feature Completion (continued)
- [ ] 4.1 Meal logging
- [ ] 4.2 Food search
- [ ] 4.8 Workout plan management
- [ ] 5.5 Goal milestones frontend
- [ ] 5.3 Swagger documentation

### Sprint 5 (Week 9-10): UX & Performance
- [ ] 8.1-8.6 Accessibility improvements
- [ ] 9.1-9.5 Performance optimization
- [ ] 3.5 Email verification
- [ ] 7.4 Structured logging

### Sprint 6 (Week 11-12): New Features Phase 1
- [ ] 10.1 Global search
- [ ] 10.3 Timer improvements
- [ ] 10.4 Exercise history per exercise
- [ ] 10.6 Data export

### Future Sprints: Phase 2 & 3
- Social features, leaderboards, achievements
- Trainer features
- Real-time notifications
- AI features
- PWA & offline support
- Advanced analytics

---

## Appendix: File Reference

### Backend Key Files
| File | Purpose |
|------|---------|
| `backend/src/main.ts` | App bootstrap, CORS, global filters |
| `backend/src/app.module.ts` | Module composition |
| `backend/prisma/schema.prisma` | Database schema (25+ models) |
| `backend/src/common/guards/` | JWT + Roles guards |
| `backend/src/common/filters/` | Global exception filter |
| `backend/src/infrastructure/adapters/` | Email + Storage ports |

### Frontend Key Files
| File | Purpose |
|------|---------|
| `frontend/src/app/globals.css` | Design system + CSS variables |
| `frontend/src/shared/components/app-shell.tsx` | Main layout shell |
| `frontend/src/api/client.ts` | API client with token refresh |
| `frontend/src/api/services/*.ts` | 10 API service files |
| `frontend/src/config/routes.ts` | All route definitions |

### Configuration Files
| File | Purpose |
|------|---------|
| `backend/docker-compose.yml` | Local dev database |
| `backend/.env.example` | Backend env template |
| `frontend/.env.example` | Frontend env template |
| `frontend/next.config.ts` | Next.js config (currently empty) |
| `frontend/vitest.config.ts` | Frontend test config |
