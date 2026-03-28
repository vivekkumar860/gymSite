import { EventEmitter2 } from '@nestjs/event-emitter';
import { NutritionFacade } from '../facade/nutrition.facade';
import { NutritionCalculatorService } from '../services/nutrition-calculator.service';
import { MealPlanGeneratorService } from '../services/meal-plan-generator.service';
import { NutritionPlanRepository } from '../repositories/nutrition-plan.repository';
import { NotFoundError, AuthorizationError } from '../../../common/errors';
import type { NutritionPlanWithMealsDomain } from '../domain/nutrition';
import type { GenerateNutritionPlanDto } from '../dto/generate-nutrition-plan.dto';

describe('NutritionFacade', () => {
  let facade: NutritionFacade;
  let calculator: jest.Mocked<NutritionCalculatorService>;
  let generator: jest.Mocked<MealPlanGeneratorService>;
  let repo: jest.Mocked<NutritionPlanRepository>;
  let emitter: jest.Mocked<EventEmitter2>;

  const userId = 'user-123';

  const mockTargets = {
    bmr: 1674,
    tdee: 2009,
    dailyCalories: 2009,
    dailyProteinG: 150,
    dailyCarbsG: 201,
    dailyFatG: 67,
    dietType: 'MAINTENANCE',
  };

  const mockMeals = [
    {
      mealName: 'Breakfast',
      mealOrder: 1,
      calories: 500,
      proteinG: 38,
      carbsG: 50,
      fatG: 17,
      notes: 'Test',
      foodItems: [
        {
          name: 'Oats',
          quantity: '80 g',
          calories: 300,
          proteinG: 10,
          carbsG: 50,
          fatG: 6,
        },
      ],
    },
  ];

  const mockPlanWithMeals: NutritionPlanWithMealsDomain = {
    id: 'plan-1',
    userId,
    planName: 'Test Plan',
    dietType: 'MAINTENANCE',
    dailyCalories: 2009,
    dailyProteinG: 150,
    dailyCarbsG: 201,
    dailyFatG: 67,
    bmr: 1650,
    tdee: 1980,
    isActive: true,
    mealPlanType: 'INDIAN_VEGETARIAN',
    activityLevel: 'SEDENTARY',
    goalType: 'MAINTAIN',
    budgetPreference: 'MEDIUM',
    heightCm: 175,
    weightKg: 70,
    ageAtCreation: 25,
    createdAt: new Date(),
    updatedAt: new Date(),
    meals: [
      {
        id: 'meal-1',
        nutritionPlanId: 'plan-1',
        mealName: 'Breakfast',
        mealOrder: 1,
        calories: 500,
        proteinG: 38,
        carbsG: 50,
        fatG: 17,
        notes: 'Test',
        foodItems: [],
      },
    ],
  };

  const generateDto: GenerateNutritionPlanDto = {
    age: 25,
    gender: 'MALE',
    heightCm: 175,
    weightKg: 70,
    activityLevel: 'SEDENTARY',
    goal: 'MAINTAIN',
    dietPreference: 'INDIAN_VEGETARIAN',
    budgetPreference: 'MEDIUM',
  };

  beforeEach(() => {
    calculator = {
      calculateTargets: jest.fn().mockReturnValue(mockTargets),
    } as any;

    generator = {
      generate: jest.fn().mockResolvedValue(mockMeals),
      generateSingleMeal: jest.fn().mockResolvedValue(mockMeals[0]),
    } as any;

    repo = {
      deactivateAllForUser: jest.fn().mockResolvedValue(undefined),
      createPlanWithMeals: jest.fn().mockResolvedValue(mockPlanWithMeals),
      findActivePlanWithMeals: jest.fn().mockResolvedValue(mockPlanWithMeals),
      findByIdWithMeals: jest.fn().mockResolvedValue(mockPlanWithMeals),
      replaceMeals: jest.fn().mockResolvedValue(undefined),
    } as any;

    emitter = {
      emit: jest.fn(),
    } as any;

    facade = new NutritionFacade(calculator, generator, repo, emitter);
  });

  describe('generatePlan', () => {
    it('should calculate targets, generate meals, and persist', async () => {
      const result = await facade.generatePlan(userId, generateDto);

      expect(calculator.calculateTargets).toHaveBeenCalledWith(
        25,
        'MALE',
        175,
        70,
        'SEDENTARY',
        'MAINTAIN',
      );
      expect(generator.generate).toHaveBeenCalledWith(
        'INDIAN_VEGETARIAN',
        mockTargets,
        'MEDIUM',
      );
      expect(repo.deactivateAllForUser).toHaveBeenCalledWith(userId);
      expect(repo.createPlanWithMeals).toHaveBeenCalled();
      expect(emitter.emit).toHaveBeenCalled();
      expect(result.id).toBe('plan-1');
      expect(result.meals).toHaveLength(1);
    });
  });

  describe('getActivePlan', () => {
    it('should return the active plan with meals', async () => {
      const result = await facade.getActivePlan(userId);
      expect(result.id).toBe('plan-1');
      expect(result.isActive).toBe(true);
    });

    it('should throw NotFoundError when no active plan exists', async () => {
      repo.findActivePlanWithMeals.mockResolvedValue(null);
      await expect(facade.getActivePlan(userId)).rejects.toThrow(NotFoundError);
    });
  });

  describe('regenerateMeals', () => {
    it('should regenerate meals for an owned plan with generation context', async () => {
      const result = await facade.regenerateMeals('plan-1', userId);
      expect(repo.replaceMeals).toHaveBeenCalledWith('plan-1', mockMeals);
      expect(result.id).toBe('plan-1');
    });

    it('should throw NotFoundError for non-existent plan', async () => {
      repo.findByIdWithMeals.mockResolvedValue(null);
      await expect(facade.regenerateMeals('missing', userId)).rejects.toThrow(
        NotFoundError,
      );
    });

    it('should throw AuthorizationError for non-owner', async () => {
      await expect(
        facade.regenerateMeals('plan-1', 'other-user'),
      ).rejects.toThrow(AuthorizationError);
    });

    it('should throw NotFoundError when plan has no generation context', async () => {
      repo.findByIdWithMeals.mockResolvedValue({
        ...mockPlanWithMeals,
        mealPlanType: null,
      });
      await expect(facade.regenerateMeals('plan-1', userId)).rejects.toThrow(
        NotFoundError,
      );
    });
  });
});
