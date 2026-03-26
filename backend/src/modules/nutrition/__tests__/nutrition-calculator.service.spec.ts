import { NutritionCalculatorService } from '../services/nutrition-calculator.service';
import {
  MIN_SAFE_DAILY_CALORIES,
  MAX_SAFE_DAILY_CALORIES,
} from '../constants/nutrition.constants';

describe('NutritionCalculatorService', () => {
  let calculator: NutritionCalculatorService;

  beforeEach(() => {
    calculator = new NutritionCalculatorService();
  });

  describe('calculateTargets', () => {
    it('should calculate correct BMR for a male using Mifflin-St Jeor', () => {
      // Male, 25y, 175cm, 70kg, sedentary, maintain
      // BMR = 10*70 + 6.25*175 - 5*25 + 5 = 700 + 1093.75 - 125 + 5 = 1673.75 ≈ 1674
      const result = calculator.calculateTargets(
        25,
        'MALE',
        175,
        70,
        'SEDENTARY',
        'MAINTAIN',
      );
      expect(result.bmr).toBe(1674);
    });

    it('should calculate correct BMR for a female using Mifflin-St Jeor', () => {
      // Female, 30y, 160cm, 55kg, sedentary, maintain
      // BMR = 10*55 + 6.25*160 - 5*30 + (-161) = 550 + 1000 - 150 - 161 = 1239
      const result = calculator.calculateTargets(
        30,
        'FEMALE',
        160,
        55,
        'SEDENTARY',
        'MAINTAIN',
      );
      expect(result.bmr).toBe(1239);
    });

    it('should apply sedentary activity multiplier (1.2) for TDEE', () => {
      const result = calculator.calculateTargets(
        25,
        'MALE',
        175,
        70,
        'SEDENTARY',
        'MAINTAIN',
      );
      expect(result.tdee).toBe(Math.round(result.bmr * 1.2));
    });

    it('should apply very active multiplier (1.725) for TDEE', () => {
      const result = calculator.calculateTargets(
        25,
        'MALE',
        175,
        70,
        'VERY_ACTIVE',
        'MAINTAIN',
      );
      expect(result.tdee).toBe(Math.round(result.bmr * 1.725));
    });

    it('should subtract 500 calories for LOSE_WEIGHT goal', () => {
      const result = calculator.calculateTargets(
        25,
        'MALE',
        175,
        70,
        'SEDENTARY',
        'LOSE_WEIGHT',
      );
      const tdee = Math.round(result.bmr * 1.2);
      expect(result.dailyCalories).toBe(
        Math.max(MIN_SAFE_DAILY_CALORIES, tdee - 500),
      );
    });

    it('should add 300 calories for GAIN_MUSCLE goal', () => {
      const result = calculator.calculateTargets(
        25,
        'MALE',
        175,
        70,
        'SEDENTARY',
        'GAIN_MUSCLE',
      );
      const tdee = Math.round(result.bmr * 1.2);
      expect(result.dailyCalories).toBe(
        Math.min(MAX_SAFE_DAILY_CALORIES, tdee + 300),
      );
    });

    it('should clamp calories to MIN_SAFE_DAILY_CALORIES', () => {
      // Small, sedentary female losing weight — should clamp to minimum
      const result = calculator.calculateTargets(
        60,
        'FEMALE',
        145,
        40,
        'SEDENTARY',
        'LOSE_WEIGHT',
      );
      expect(result.dailyCalories).toBeGreaterThanOrEqual(
        MIN_SAFE_DAILY_CALORIES,
      );
    });

    it('should set dietType to CUTTING for LOSE_WEIGHT goal', () => {
      const result = calculator.calculateTargets(
        25,
        'MALE',
        175,
        70,
        'SEDENTARY',
        'LOSE_WEIGHT',
      );
      expect(result.dietType).toBe('CUTTING');
    });

    it('should set dietType to BULKING for GAIN_MUSCLE goal', () => {
      const result = calculator.calculateTargets(
        25,
        'MALE',
        175,
        70,
        'SEDENTARY',
        'GAIN_MUSCLE',
      );
      expect(result.dietType).toBe('BULKING');
    });

    it('should set dietType to MAINTENANCE for MAINTAIN goal', () => {
      const result = calculator.calculateTargets(
        25,
        'MALE',
        175,
        70,
        'SEDENTARY',
        'MAINTAIN',
      );
      expect(result.dietType).toBe('MAINTENANCE');
    });

    it('should calculate macro grams that are positive integers', () => {
      const result = calculator.calculateTargets(
        25,
        'MALE',
        175,
        70,
        'MODERATELY_ACTIVE',
        'GAIN_MUSCLE',
      );
      expect(result.dailyProteinG).toBeGreaterThan(0);
      expect(result.dailyCarbsG).toBeGreaterThan(0);
      expect(result.dailyFatG).toBeGreaterThan(0);
      expect(Number.isInteger(result.dailyProteinG)).toBe(true);
      expect(Number.isInteger(result.dailyCarbsG)).toBe(true);
      expect(Number.isInteger(result.dailyFatG)).toBe(true);
    });

    it('should return all expected fields in the result', () => {
      const result = calculator.calculateTargets(
        25,
        'MALE',
        175,
        70,
        'SEDENTARY',
        'MAINTAIN',
      );
      expect(result).toHaveProperty('bmr');
      expect(result).toHaveProperty('tdee');
      expect(result).toHaveProperty('dailyCalories');
      expect(result).toHaveProperty('dailyProteinG');
      expect(result).toHaveProperty('dailyCarbsG');
      expect(result).toHaveProperty('dailyFatG');
      expect(result).toHaveProperty('dietType');
    });
  });
});
