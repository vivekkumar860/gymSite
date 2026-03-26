import { MealPlanGeneratorService } from '../services/meal-plan-generator.service';
import { MealPlanStrategyResolver } from '../strategies/meal-plan-strategy.resolver';
import { IndianVegetarianMealStrategy } from '../strategies/indian-vegetarian-meal.strategy';
import { IndianNonVegMealStrategy } from '../strategies/indian-non-veg-meal.strategy';
import { VeganMealStrategy } from '../strategies/vegan-meal.strategy';
import { HostelBudgetMealStrategy } from '../strategies/hostel-budget-meal.strategy';
import { OfficeGoingMealStrategy } from '../strategies/office-going-meal.strategy';
import type { NutritionTargets } from '../interfaces/nutrition.interfaces';

describe('MealPlanGeneratorService', () => {
  let generator: MealPlanGeneratorService;
  let resolver: MealPlanStrategyResolver;

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
    generator = new MealPlanGeneratorService(resolver);
  });

  it('should generate meals for INDIAN_VEGETARIAN', () => {
    const meals = generator.generate('INDIAN_VEGETARIAN', targets, 'MEDIUM');
    expect(meals.length).toBe(4);
    expect(meals[0].mealName).toBe('Breakfast');
  });

  it('should generate meals for INDIAN_NON_VEG', () => {
    const meals = generator.generate('INDIAN_NON_VEG', targets, 'MEDIUM');
    expect(meals.length).toBe(4);
  });

  it('should generate meals for VEGAN', () => {
    const meals = generator.generate('VEGAN', targets, 'MEDIUM');
    expect(meals.length).toBe(4);
  });

  it('should generate meals for HOSTEL_BUDGET', () => {
    const meals = generator.generate('HOSTEL_BUDGET', targets, 'LOW');
    expect(meals.length).toBe(4);
  });

  it('should generate meals for OFFICE_GOING with 5 meals', () => {
    const meals = generator.generate('OFFICE_GOING', targets, 'MEDIUM');
    expect(meals.length).toBe(5);
  });

  it('should assign sequential meal orders', () => {
    const meals = generator.generate('INDIAN_VEGETARIAN', targets, 'MEDIUM');
    meals.forEach((meal, index) => {
      expect(meal.mealOrder).toBe(index + 1);
    });
  });

  it('should include food items in every meal', () => {
    const meals = generator.generate('INDIAN_VEGETARIAN', targets, 'MEDIUM');
    meals.forEach((meal) => {
      expect(meal.foodItems.length).toBeGreaterThan(0);
      meal.foodItems.forEach((item) => {
        expect(item.name).toBeTruthy();
        expect(item.quantity).toBeTruthy();
        expect(item.calories).toBeGreaterThanOrEqual(0);
      });
    });
  });

  it('should produce non-zero calorie meals', () => {
    const meals = generator.generate('VEGAN', targets, 'HIGH');
    meals.forEach((meal) => {
      expect(meal.calories).toBeGreaterThan(0);
    });
  });
});
