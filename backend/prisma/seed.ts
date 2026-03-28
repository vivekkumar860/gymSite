import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import * as fs from 'fs';
import * as path from 'path';

const prisma = new PrismaClient();

const BCRYPT_SALT_ROUNDS = 12;

// ── Exercise name → image slug mapping ─────────────────────
// Maps seeded exercise names to the dataset image folder slugs
const EXERCISE_IMAGE_MAP: Record<string, string> = {
  'Barbell Bench Press': 'bench-press',
  'Push-Up': 'push-up',
  'Cable Fly': 'chest-fly-machine',
  'Barbell Deadlift': 'deadlift',
  'Pull-Up': 'pull-up',
  'Lat Pulldown': 'lat-pulldown',
  'Overhead Press': 'shoulder-press',
  'Lateral Raise': 'lateral-raises',
  'Barbell Curl': 'barbell-biceps-curl',
  'Tricep Pushdown': 'tricep-pushdown',
  'Barbell Squat': 'squat',
  'Romanian Deadlift': 'romanian-deadlift',
  'Hip Thrust': 'hip-thrust',
  'Plank': 'plank',
};

async function main(): Promise<void> {
  console.log('Seeding database...');

  // ── Admin user ──────────────────────────────────────────
  const adminPasswordHash = await bcrypt.hash('Admin123!', BCRYPT_SALT_ROUNDS);

  const admin = await prisma.user.upsert({
    where: { email: 'admin@gymplatform.com' },
    update: {},
    create: {
      username: 'admin',
      email: 'admin@gymplatform.com',
      role: 'ADMIN',
      accountStatus: 'ACTIVE',
      credentials: {
        create: {
          provider: 'EMAIL',
          passwordHash: adminPasswordHash,
          emailVerifiedAt: new Date(),
        },
      },
      profile: {
        create: {
          firstName: 'Platform',
          lastName: 'Admin',
          timezone: 'UTC',
        },
      },
    },
  });

  console.log(`Admin user created: ${admin.id}`);

  // ── Test member ─────────────────────────────────────────
  const memberPasswordHash = await bcrypt.hash('TestPass123!', BCRYPT_SALT_ROUNDS);

  const testUser = await prisma.user.upsert({
    where: { email: 'test@gymplatform.com' },
    update: {},
    create: {
      username: 'testuser',
      email: 'test@gymplatform.com',
      role: 'MEMBER',
      accountStatus: 'ACTIVE',
      credentials: {
        create: {
          provider: 'EMAIL',
          passwordHash: memberPasswordHash,
          emailVerifiedAt: new Date(),
        },
      },
      profile: {
        create: {
          firstName: 'Test',
          lastName: 'User',
          dateOfBirth: new Date('1995-06-15'),
          biologicalSex: 'MALE',
          heightCm: 178.0,
          fitnessLevel: 'INTERMEDIATE',
          dietaryPreference: 'NO_PREFERENCE',
          timezone: 'Asia/Kolkata',
        },
      },
    },
  });

  console.log(`Test user created: ${testUser.id}`);

  // ── Exercise library ────────────────────────────────────
  const exercises = [
    // Chest
    { exerciseName: 'Barbell Bench Press', primaryMuscle: 'CHEST' as const, secondaryMuscle: 'TRICEPS' as const, equipment: 'BARBELL' as const, difficulty: 'INTERMEDIATE' as const, isCompound: true, instructions: 'Lie flat, lower bar to mid-chest, press up.' },
    { exerciseName: 'Dumbbell Incline Press', primaryMuscle: 'CHEST' as const, secondaryMuscle: 'SHOULDERS' as const, equipment: 'DUMBBELL' as const, difficulty: 'INTERMEDIATE' as const, isCompound: true, instructions: 'Set bench to 30-45 degrees, press dumbbells up.' },
    { exerciseName: 'Push-Up', primaryMuscle: 'CHEST' as const, secondaryMuscle: 'TRICEPS' as const, equipment: 'BODYWEIGHT' as const, difficulty: 'BEGINNER' as const, isCompound: true, instructions: 'Hands shoulder-width, lower chest to floor.' },
    { exerciseName: 'Cable Fly', primaryMuscle: 'CHEST' as const, equipment: 'CABLE' as const, difficulty: 'INTERMEDIATE' as const, isCompound: false, instructions: 'Arms wide, bring handles together at chest height.' },
    // Back
    { exerciseName: 'Barbell Deadlift', primaryMuscle: 'BACK' as const, secondaryMuscle: 'HAMSTRINGS' as const, equipment: 'BARBELL' as const, difficulty: 'ADVANCED' as const, isCompound: true, instructions: 'Hinge at hips, grip bar, stand up.' },
    { exerciseName: 'Pull-Up', primaryMuscle: 'BACK' as const, secondaryMuscle: 'BICEPS' as const, equipment: 'BODYWEIGHT' as const, difficulty: 'INTERMEDIATE' as const, isCompound: true, instructions: 'Hang from bar, pull chin above bar.' },
    { exerciseName: 'Barbell Row', primaryMuscle: 'BACK' as const, secondaryMuscle: 'BICEPS' as const, equipment: 'BARBELL' as const, difficulty: 'INTERMEDIATE' as const, isCompound: true, instructions: 'Bend 45 degrees, pull bar to lower chest.' },
    { exerciseName: 'Lat Pulldown', primaryMuscle: 'BACK' as const, secondaryMuscle: 'BICEPS' as const, equipment: 'CABLE' as const, difficulty: 'BEGINNER' as const, isCompound: true, instructions: 'Pull bar to upper chest, squeeze lats.' },
    // Shoulders
    { exerciseName: 'Overhead Press', primaryMuscle: 'SHOULDERS' as const, secondaryMuscle: 'TRICEPS' as const, equipment: 'BARBELL' as const, difficulty: 'INTERMEDIATE' as const, isCompound: true, instructions: 'Press bar from shoulders overhead.' },
    { exerciseName: 'Lateral Raise', primaryMuscle: 'SHOULDERS' as const, equipment: 'DUMBBELL' as const, difficulty: 'BEGINNER' as const, isCompound: false, instructions: 'Raise dumbbells to sides at shoulder height.' },
    // Arms
    { exerciseName: 'Barbell Curl', primaryMuscle: 'BICEPS' as const, equipment: 'BARBELL' as const, difficulty: 'BEGINNER' as const, isCompound: false, instructions: 'Curl bar from thighs to shoulders.' },
    { exerciseName: 'Tricep Pushdown', primaryMuscle: 'TRICEPS' as const, equipment: 'CABLE' as const, difficulty: 'BEGINNER' as const, isCompound: false, instructions: 'Push cable bar down, extend elbows fully.' },
    // Legs
    { exerciseName: 'Barbell Squat', primaryMuscle: 'QUADRICEPS' as const, secondaryMuscle: 'GLUTES' as const, equipment: 'BARBELL' as const, difficulty: 'INTERMEDIATE' as const, isCompound: true, instructions: 'Bar on back, squat to parallel or below.' },
    { exerciseName: 'Romanian Deadlift', primaryMuscle: 'HAMSTRINGS' as const, secondaryMuscle: 'GLUTES' as const, equipment: 'BARBELL' as const, difficulty: 'INTERMEDIATE' as const, isCompound: true, instructions: 'Hinge forward with slight knee bend.' },
    { exerciseName: 'Leg Press', primaryMuscle: 'QUADRICEPS' as const, secondaryMuscle: 'GLUTES' as const, equipment: 'MACHINE' as const, difficulty: 'BEGINNER' as const, isCompound: true, instructions: 'Press platform away, do not lock knees.' },
    { exerciseName: 'Hip Thrust', primaryMuscle: 'GLUTES' as const, secondaryMuscle: 'HAMSTRINGS' as const, equipment: 'BARBELL' as const, difficulty: 'INTERMEDIATE' as const, isCompound: true, instructions: 'Back on bench, drive hips up with bar.' },
    { exerciseName: 'Standing Calf Raise', primaryMuscle: 'CALVES' as const, equipment: 'MACHINE' as const, difficulty: 'BEGINNER' as const, isCompound: false, instructions: 'Rise onto toes, squeeze at top.' },
    // Core
    { exerciseName: 'Plank', primaryMuscle: 'CORE' as const, equipment: 'BODYWEIGHT' as const, difficulty: 'BEGINNER' as const, isCompound: false, instructions: 'Hold straight body on forearms and toes.' },
    { exerciseName: 'Cable Woodchop', primaryMuscle: 'CORE' as const, equipment: 'CABLE' as const, difficulty: 'INTERMEDIATE' as const, isCompound: false, instructions: 'Rotate torso pulling cable diagonally.' },
    // Full body
    { exerciseName: 'Kettlebell Swing', primaryMuscle: 'FULL_BODY' as const, secondaryMuscle: 'GLUTES' as const, equipment: 'KETTLEBELL' as const, difficulty: 'INTERMEDIATE' as const, isCompound: true, instructions: 'Hinge and swing kettlebell to shoulder height.' },
  ];

  for (const exercise of exercises) {
    const slug = exercise.exerciseName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    const imageSlug = EXERCISE_IMAGE_MAP[exercise.exerciseName];
    const imageUrl = imageSlug ? `/exercises/${imageSlug}/001.jpg` : null;

    await prisma.exercise.upsert({
      where: { exerciseName: exercise.exerciseName },
      update: { imageUrl },
      create: {
        ...exercise,
        slug,
        imageUrl,
        createdBy: admin.id,
      },
    });
  }

  console.log(`Seeded ${exercises.length} exercises (${Object.keys(EXERCISE_IMAGE_MAP).length} with images)`);

  // ── Test user goal ──────────────────────────────────────
  await prisma.goal.upsert({
    where: { id: '00000000-0000-0000-0000-000000000001' },
    update: {},
    create: {
      id: '00000000-0000-0000-0000-000000000001',
      userId: testUser.id,
      goalType: 'GAIN_MUSCLE',
      title: 'Reach 80kg lean',
      targetValue: 80.0,
      targetUnit: 'kg',
      currentValue: 72.5,
      deadline: new Date('2026-09-01'),
      goalStatus: 'ACTIVE',
    },
  });

  console.log('Test goal created');

  // ── Onboarding steps for test user ──────────────────────
  const onboardingSteps = ['PROFILE_CREATED', 'GOAL_SELECTED', 'FITNESS_LEVEL_SET'] as const;

  for (const step of onboardingSteps) {
    await prisma.onboardingCompletion.upsert({
      where: {
        uq_onboarding_user_step: {
          userId: testUser.id,
          step,
        },
      },
      update: {},
      create: {
        userId: testUser.id,
        step,
      },
    });
  }

  console.log('Onboarding steps seeded');

  // ── Food items from Indian RDA dataset ────────────────────
  await seedFoodItems();

  console.log('Seeding complete!');
}

// ── Food items seed ────────────────────────────────────────
interface CsvFoodRow {
  Food_items: string;
  Breakfast: string;
  Lunch: string;
  Dinner: string;
  VegNovVeg: string;
  Calories: string;
  Fats: string;
  Proteins: string;
  Carbohydrates: string;
  Fibre: string;
}

async function seedFoodItems(): Promise<void> {
  const csvPath = path.resolve(__dirname, '../../Datasets/indian_rda_based_diet_recommendation_system.csv');

  if (!fs.existsSync(csvPath)) {
    console.log('Food items CSV not found, skipping food seed');
    return;
  }

  const raw = fs.readFileSync(csvPath, 'utf-8');
  const lines = raw.split('\n').filter((l) => l.trim());
  const header = lines[0].split(',');

  const col = (name: string) => header.indexOf(name);

  let seeded = 0;
  let skipped = 0;

  for (let i = 1; i < lines.length; i++) {
    const fields = lines[i].split(',');
    const name = fields[col('Food_items')]?.trim();
    const calories = Math.round(parseFloat(fields[col('Calories')] ?? '0'));

    if (!name || calories <= 0) {
      skipped++;
      continue;
    }

    const proteinG = parseFloat(fields[col('Proteins')] ?? '0');
    const carbsG = parseFloat(fields[col('Carbohydrates')] ?? '0');
    const fatG = parseFloat(fields[col('Fats')] ?? '0');
    const fibreG = parseFloat(fields[col('Fibre')] ?? '0');
    const vegFlag = fields[col('VegNovVeg')]?.trim();
    const isVeg = vegFlag !== '1';
    const forBreakfast = fields[col('Breakfast')]?.trim() === '1';
    const forLunch = fields[col('Lunch')]?.trim() === '1';
    const forDinner = fields[col('Dinner')]?.trim() === '1';

    await prisma.foodItem.upsert({
      where: { name },
      update: {
        calories,
        proteinG,
        carbsG,
        fatG,
        fibreG: fibreG || null,
        isVeg,
        forBreakfast,
        forLunch,
        forDinner,
      },
      create: {
        name,
        calories,
        proteinG,
        carbsG,
        fatG,
        fibreG: fibreG || null,
        isVeg,
        forBreakfast,
        forLunch,
        forDinner,
        cuisine: 'INDIAN',
      },
    });
    seeded++;
  }

  console.log(`Seeded ${seeded} food items (${skipped} skipped)`);
}

main()
  .catch((e) => {
    console.error('Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
