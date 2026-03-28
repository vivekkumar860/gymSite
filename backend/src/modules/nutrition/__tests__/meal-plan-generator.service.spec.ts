import { MealPlanGeneratorService } from '../services/meal-plan-generator.service';
import { MealPlanStrategyResolver } from '../strategies/meal-plan-strategy.resolver';
import { IndianVegetarianMealStrategy } from '../strategies/indian-vegetarian-meal.strategy';
import { IndianNonVegMealStrategy } from '../strategies/indian-non-veg-meal.strategy';
import { VeganMealStrategy } from '../strategies/vegan-meal.strategy';
import { HostelBudgetMealStrategy } from '../strategies/hostel-budget-meal.strategy';
import { OfficeGoingMealStrategy } from '../strategies/office-going-meal.strategy';
import { FoodItemRepository } from '../repositories/food-item.repository';
import type { NutritionTargets } from '../interfaces/nutrition.interfaces';

describe('MealPlanGeneratorService', () => {
  let generator: MealPlanGeneratorService;
  let resolver: MealPlanStrategyResolver;
  let foodItemRepo: jest.Mocked<FoodItemRepository>;

  const targets: NutritionTargets = {
    bmr: 1674,
    tdee: 2009,
    dailyCalories: 2009,
    dailyProteinG: 150,
    dailyCarbsG: 201,
    dailyFatG: 67,
    dietType: 'MAINTENANCE',
  };

  beforeEach(() => {
    resolver = new MealPlanStrategyResolver(
      new IndianVegetarianMealStrategy(),
      new IndianNonVegMealStrategy(),
      new VeganMealStrategy(),
      new HostelBudgetMealStrategy(),
      new OfficeGoingMealStrategy(),
    );

    // Mock food repo returns empty → forces fallback to hardcoded templates
    foodItemRepo = {
      findForMeal: jest.fn().mockResolvedValue([]),
    } as any;

    generator = new MealPlanGeneratorService(resolver, foodItemRepo);
  });

  it('should fall back to templates when DB returns no foods (INDIAN_VEGETARIAN)', async () => {
    const meals = await generator.generate('INDIAN_VEGETARIAN', targets, 'MEDIUM');
    expect(meals.length).toBe(4);
    expect(meals[0].mealName).toBe('Breakfast');
  });

  it('should fall back to templates when DB returns no foods (INDIAN_NON_VEG)', async () => {
    const meals = await generator.generate('INDIAN_NON_VEG', targets, 'MEDIUM');
    expect(meals.length).toBe(4);
  });

  it('should fall back to templates when DB returns no foods (VEGAN)', async () => {
    const meals = await generator.generate('VEGAN', targets, 'MEDIUM');
    expect(meals.length).toBe(4);
  });

  it('should fall back to templates when DB returns no foods (HOSTEL_BUDGET)', async () => {
    const meals = await generator.generate('HOSTEL_BUDGET', targets, 'LOW');
    expect(meals.length).toBe(4);
  });

  it('should fall back to templates when DB returns no foods (OFFICE_GOING)', async () => {
    const meals = await generator.generate('OFFICE_GOING', targets, 'MEDIUM');
    expect(meals.length).toBe(5);
  });

  it('should assign sequential meal orders in fallback', async () => {
    const meals = await generator.generate('INDIAN_VEGETARIAN', targets, 'MEDIUM');
    meals.forEach((meal, index) => {
      expect(meal.mealOrder).toBe(index + 1);
    });
  });

  it('should include food items in every meal in fallback', async () => {
    const meals = await generator.generate('INDIAN_VEGETARIAN', targets, 'MEDIUM');
    meals.forEach((meal) => {
      expect(meal.foodItems.length).toBeGreaterThan(0);
      meal.foodItems.forEach((item) => {
        expect(item.name).toBeTruthy();
        expect(item.quantity).toBeTruthy();
        expect(item.calories).toBeGreaterThanOrEqual(0);
      });
    });
  });

  it('should produce non-zero calorie meals in fallback', async () => {
    const meals = await generator.generate('VEGAN', targets, 'HIGH');
    meals.forEach((meal) => {
      expect(meal.calories).toBeGreaterThan(0);
    });
  });

  describe('with DB foods available', () => {
    const dbFoods = [
      { id: '1', name: 'Poha', calories: 130, proteinG: 2.6, carbsG: 26.9, fatG: 1.5, fibreG: 1.1 },
      { id: '2', name: 'Dahi', calories: 60, proteinG: 3.1, carbsG: 7, fatG: 4, fibreG: null },
      { id: '3', name: 'Bananas', calories: 89, proteinG: 1.1, carbsG: 23, fatG: 0.3, fibreG: 2.6 },
      { id: '4', name: 'Idli', calories: 156, proteinG: 5, carbsG: 30.2, fatG: 1.7, fibreG: 2.1 },
    ];

    beforeEach(() => {
      foodItemRepo.findForMeal.mockResolvedValue(dbFoods);
    });

    it('should use DB foods when available', async () => {
      const meals = await generator.generate('INDIAN_VEGETARIAN', targets, 'MEDIUM');
      expect(meals.length).toBe(4);
      // DB-generated meals have food items from our mock data
      const allFoodNames = meals.flatMap((m) => m.foodItems.map((f) => f.name));
      const hasDbFoods = allFoodNames.some((n) =>
        dbFoods.some((f) => f.name === n),
      );
      expect(hasDbFoods).toBe(true);
    });
  });
});
