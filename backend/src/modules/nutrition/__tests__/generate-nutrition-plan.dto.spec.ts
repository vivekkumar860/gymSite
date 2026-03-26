import { GenerateNutritionPlanSchema } from '../dto/generate-nutrition-plan.dto';

describe('GenerateNutritionPlanSchema', () => {
  const validInput = {
    age: 25,
    gender: 'MALE',
    heightCm: 175,
    weightKg: 70,
    activityLevel: 'MODERATELY_ACTIVE',
    goal: 'GAIN_MUSCLE',
    dietPreference: 'INDIAN_VEGETARIAN',
    budgetPreference: 'MEDIUM',
  };

  it('should accept valid input', () => {
    const result = GenerateNutritionPlanSchema.safeParse(validInput);
    expect(result.success).toBe(true);
  });

  it('should reject age below 13', () => {
    const result = GenerateNutritionPlanSchema.safeParse({
      ...validInput,
      age: 10,
    });
    expect(result.success).toBe(false);
  });

  it('should reject age above 100', () => {
    const result = GenerateNutritionPlanSchema.safeParse({
      ...validInput,
      age: 101,
    });
    expect(result.success).toBe(false);
  });

  it('should reject non-integer age', () => {
    const result = GenerateNutritionPlanSchema.safeParse({
      ...validInput,
      age: 25.5,
    });
    expect(result.success).toBe(false);
  });

  it('should reject NOT_SPECIFIED gender', () => {
    const result = GenerateNutritionPlanSchema.safeParse({
      ...validInput,
      gender: 'NOT_SPECIFIED',
    });
    expect(result.success).toBe(false);
  });

  it('should reject height below 100 cm', () => {
    const result = GenerateNutritionPlanSchema.safeParse({
      ...validInput,
      heightCm: 50,
    });
    expect(result.success).toBe(false);
  });

  it('should reject height above 250 cm', () => {
    const result = GenerateNutritionPlanSchema.safeParse({
      ...validInput,
      heightCm: 300,
    });
    expect(result.success).toBe(false);
  });

  it('should reject weight below 30 kg', () => {
    const result = GenerateNutritionPlanSchema.safeParse({
      ...validInput,
      weightKg: 20,
    });
    expect(result.success).toBe(false);
  });

  it('should reject weight above 300 kg', () => {
    const result = GenerateNutritionPlanSchema.safeParse({
      ...validInput,
      weightKg: 350,
    });
    expect(result.success).toBe(false);
  });

  it('should reject invalid activity level', () => {
    const result = GenerateNutritionPlanSchema.safeParse({
      ...validInput,
      activityLevel: 'SUPER_ACTIVE',
    });
    expect(result.success).toBe(false);
  });

  it('should reject invalid goal', () => {
    const result = GenerateNutritionPlanSchema.safeParse({
      ...validInput,
      goal: 'FLY',
    });
    expect(result.success).toBe(false);
  });

  it('should reject invalid diet preference', () => {
    const result = GenerateNutritionPlanSchema.safeParse({
      ...validInput,
      dietPreference: 'KETO',
    });
    expect(result.success).toBe(false);
  });

  it('should reject invalid budget preference', () => {
    const result = GenerateNutritionPlanSchema.safeParse({
      ...validInput,
      budgetPreference: 'ULTRA',
    });
    expect(result.success).toBe(false);
  });

  it('should reject missing required fields', () => {
    const result = GenerateNutritionPlanSchema.safeParse({});
    expect(result.success).toBe(false);
  });

  it('should accept decimal height and weight', () => {
    const result = GenerateNutritionPlanSchema.safeParse({
      ...validInput,
      heightCm: 175.5,
      weightKg: 70.2,
    });
    expect(result.success).toBe(true);
  });

  it('should accept all valid meal plan types', () => {
    const types = [
      'INDIAN_VEGETARIAN',
      'INDIAN_NON_VEG',
      'VEGAN',
      'HOSTEL_BUDGET',
      'OFFICE_GOING',
    ];
    types.forEach((type) => {
      const result = GenerateNutritionPlanSchema.safeParse({
        ...validInput,
        dietPreference: type,
      });
      expect(result.success).toBe(true);
    });
  });

  it('should accept all valid activity levels', () => {
    const levels = [
      'SEDENTARY',
      'LIGHTLY_ACTIVE',
      'MODERATELY_ACTIVE',
      'VERY_ACTIVE',
      'EXTREMELY_ACTIVE',
    ];
    levels.forEach((level) => {
      const result = GenerateNutritionPlanSchema.safeParse({
        ...validInput,
        activityLevel: level,
      });
      expect(result.success).toBe(true);
    });
  });
});
