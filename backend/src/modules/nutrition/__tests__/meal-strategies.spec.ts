import { IndianVegetarianMealStrategy } from '../strategies/indian-vegetarian-meal.strategy';
import { IndianNonVegMealStrategy } from '../strategies/indian-non-veg-meal.strategy';
import { VeganMealStrategy } from '../strategies/vegan-meal.strategy';
import { HostelBudgetMealStrategy } from '../strategies/hostel-budget-meal.strategy';
import { OfficeGoingMealStrategy } from '../strategies/office-going-meal.strategy';
import type {
  NutritionTargets,
  MealPlanStrategy,
} from '../interfaces/nutrition.interfaces';

describe('Meal Plan Strategies', () => {
  const targets: NutritionTargets = {
    bmr: 1674,
    tdee: 2009,
    dailyCalories: 2000,
    dailyProteinG: 150,
    dailyCarbsG: 200,
    dailyFatG: 67,
    dietType: 'MAINTENANCE',
  };

  const highCalTargets: NutritionTargets = {
    bmr: 2200,
    tdee: 3300,
    dailyCalories: 3600,
    dailyProteinG: 225,
    dailyCarbsG: 450,
    dailyFatG: 100,
    dietType: 'BULKING',
  };

  const lowCalTargets: NutritionTargets = {
    bmr: 1200,
    tdee: 1440,
    dailyCalories: 1200,
    dailyProteinG: 120,
    dailyCarbsG: 90,
    dailyFatG: 40,
    dietType: 'CUTTING',
  };

  const strategies: {
    name: string;
    strategy: MealPlanStrategy;
    expectedMeals: number;
  }[] = [
    {
      name: 'IndianVegetarianMealStrategy',
      strategy: new IndianVegetarianMealStrategy(),
      expectedMeals: 4,
    },
    {
      name: 'IndianNonVegMealStrategy',
      strategy: new IndianNonVegMealStrategy(),
      expectedMeals: 4,
    },
    {
      name: 'VeganMealStrategy',
      strategy: new VeganMealStrategy(),
      expectedMeals: 4,
    },
    {
      name: 'HostelBudgetMealStrategy',
      strategy: new HostelBudgetMealStrategy(),
      expectedMeals: 4,
    },
    {
      name: 'OfficeGoingMealStrategy',
      strategy: new OfficeGoingMealStrategy(),
      expectedMeals: 5,
    },
  ];

  describe.each(strategies)('$name', ({ strategy, expectedMeals }) => {
    it(`should generate ${expectedMeals} meals`, () => {
      const meals = strategy.generateMeals(targets, 'MEDIUM');
      expect(meals).toHaveLength(expectedMeals);
    });

    it('should have sequential meal orders starting at 1', () => {
      const meals = strategy.generateMeals(targets, 'MEDIUM');
      meals.forEach((meal, i) => {
        expect(meal.mealOrder).toBe(i + 1);
      });
    });

    it('should have non-empty meal names', () => {
      const meals = strategy.generateMeals(targets, 'MEDIUM');
      meals.forEach((meal) => {
        expect(meal.mealName.length).toBeGreaterThan(0);
      });
    });

    it('should have food items in every meal', () => {
      const meals = strategy.generateMeals(targets, 'MEDIUM');
      meals.forEach((meal) => {
        expect(meal.foodItems.length).toBeGreaterThan(0);
      });
    });

    it('should produce positive calorie values for each meal', () => {
      const meals = strategy.generateMeals(targets, 'MEDIUM');
      meals.forEach((meal) => {
        expect(meal.calories).toBeGreaterThan(0);
        expect(meal.proteinG).toBeGreaterThanOrEqual(0);
        expect(meal.carbsG).toBeGreaterThanOrEqual(0);
        expect(meal.fatG).toBeGreaterThanOrEqual(0);
      });
    });

    it('should scale up correctly for high calorie targets', () => {
      const meals = strategy.generateMeals(highCalTargets, 'HIGH');
      const totalCalories = meals.reduce((sum, m) => sum + m.calories, 0);
      // Meal calories should be within 5% of daily target (due to rounding)
      expect(totalCalories).toBeGreaterThan(
        highCalTargets.dailyCalories * 0.95,
      );
      expect(totalCalories).toBeLessThan(highCalTargets.dailyCalories * 1.05);
    });

    it('should scale down correctly for low calorie targets', () => {
      const meals = strategy.generateMeals(lowCalTargets, 'LOW');
      const totalCalories = meals.reduce((sum, m) => sum + m.calories, 0);
      expect(totalCalories).toBeGreaterThan(lowCalTargets.dailyCalories * 0.95);
      expect(totalCalories).toBeLessThan(lowCalTargets.dailyCalories * 1.05);
    });

    it('should include notes in every meal', () => {
      const meals = strategy.generateMeals(targets, 'MEDIUM');
      meals.forEach((meal) => {
        expect(typeof meal.notes).toBe('string');
        expect(meal.notes.length).toBeGreaterThan(0);
      });
    });

    it('should include quantity and name for all food items', () => {
      const meals = strategy.generateMeals(targets, 'MEDIUM');
      meals.forEach((meal) => {
        meal.foodItems.forEach((item) => {
          expect(item.name).toBeTruthy();
          expect(item.quantity).toBeTruthy();
        });
      });
    });
  });

  describe('IndianVegetarianMealStrategy budget variations', () => {
    const strategy = new IndianVegetarianMealStrategy();

    it('should adjust food choices for LOW budget', () => {
      const meals = strategy.generateMeals(targets, 'LOW');
      const allFoodNames = meals.flatMap((m) => m.foodItems.map((f) => f.name));
      expect(allFoodNames).not.toContain('Paneer sabzi');
    });

    it('should include paneer for MEDIUM/HIGH budget', () => {
      const meals = strategy.generateMeals(targets, 'MEDIUM');
      const allFoodNames = meals.flatMap((m) => m.foodItems.map((f) => f.name));
      expect(allFoodNames).toContain('Paneer sabzi');
    });
  });

  describe('IndianNonVegMealStrategy budget variations', () => {
    const strategy = new IndianNonVegMealStrategy();

    it('should use egg curry instead of chicken curry for LOW budget', () => {
      const meals = strategy.generateMeals(targets, 'LOW');
      const lunchFoods = meals.find((m) => m.mealName === 'Lunch')!.foodItems;
      const foodNames = lunchFoods.map((f) => f.name);
      expect(foodNames).toContain('Egg curry');
      expect(foodNames).not.toContain('Chicken curry');
    });
  });

  describe('OfficeGoingMealStrategy', () => {
    const strategy = new OfficeGoingMealStrategy();

    it('should include a mid-morning snack', () => {
      const meals = strategy.generateMeals(targets, 'MEDIUM');
      const mealNames = meals.map((m) => m.mealName);
      expect(mealNames).toContain('Mid-Morning Snack');
    });

    it('should include an evening snack', () => {
      const meals = strategy.generateMeals(targets, 'MEDIUM');
      const mealNames = meals.map((m) => m.mealName);
      expect(mealNames).toContain('Evening Snack');
    });
  });
});
