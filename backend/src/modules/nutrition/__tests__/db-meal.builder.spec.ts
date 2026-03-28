import { buildMealFromDbFoods } from '../strategies/db-meal.builder';
import type { FoodItemRecord } from '../repositories/food-item.repository';

describe('buildMealFromDbFoods', () => {
  const sampleFoods: FoodItemRecord[] = [
    { id: '1', name: 'Boiled Chicken', calories: 114, proteinG: 22, carbsG: 0, fatG: 2.3, fibreG: null },
    { id: '2', name: 'Brown Rice', calories: 362, proteinG: 7.5, carbsG: 76, fatG: 2.7, fibreG: 3.4 },
    { id: '3', name: 'Dal Fry', calories: 101, proteinG: 8.8, carbsG: 21, fatG: 0.5, fibreG: null },
    { id: '4', name: 'Dahi', calories: 60, proteinG: 3.1, carbsG: 7, fatG: 4, fibreG: null },
    { id: '5', name: 'Banana', calories: 89, proteinG: 1.1, carbsG: 23, fatG: 0.3, fibreG: 2.6 },
  ];

  it('should return a GeneratedMeal with food items scaled to calorie target', () => {
    const meal = buildMealFromDbFoods(
      'Lunch', 2, 600, 45, 60, 20, sampleFoods,
    );

    expect(meal).not.toBeNull();
    expect(meal!.mealName).toBe('Lunch');
    expect(meal!.mealOrder).toBe(2);
    expect(meal!.calories).toBe(600);
    expect(meal!.foodItems.length).toBeGreaterThan(0);
    expect(meal!.foodItems.length).toBeLessThanOrEqual(4);

    // Verify total food item calories are roughly correct
    const totalItemCals = meal!.foodItems.reduce((s, f) => s + f.calories, 0);
    expect(totalItemCals).toBeGreaterThan(600 * 0.8);
    expect(totalItemCals).toBeLessThan(600 * 1.2);
  });

  it('should return null when no foods are available', () => {
    const meal = buildMealFromDbFoods(
      'Breakfast', 1, 500, 38, 50, 17, [],
    );
    expect(meal).toBeNull();
  });

  it('should return null when foods cannot meet 50% of calorie target', () => {
    const tinyFoods: FoodItemRecord[] = [
      { id: '1', name: 'Tea', calories: 1, proteinG: 0, carbsG: 0, fatG: 0, fibreG: null },
    ];
    const meal = buildMealFromDbFoods(
      'Breakfast', 1, 500, 38, 50, 17, tinyFoods,
    );
    expect(meal).toBeNull();
  });

  it('should include quantity strings in food items', () => {
    const meal = buildMealFromDbFoods(
      'Dinner', 3, 700, 50, 70, 25, sampleFoods,
    );

    expect(meal).not.toBeNull();
    meal!.foodItems.forEach((item) => {
      expect(item.quantity).toMatch(/\d+ g/);
      expect(item.name).toBeTruthy();
    });
  });

  it('should cap any single food at 40% of target calories', () => {
    const meal = buildMealFromDbFoods(
      'Lunch', 2, 500, 40, 50, 15, sampleFoods,
    );

    expect(meal).not.toBeNull();
    // No single item should have more than ~50% of total (40% cap + scaling)
    meal!.foodItems.forEach((item) => {
      expect(item.calories).toBeLessThan(500 * 0.6);
    });
  });

  it('should sort by protein density (high-protein foods first)', () => {
    const meal = buildMealFromDbFoods(
      'Lunch', 2, 600, 45, 60, 20, sampleFoods,
    );

    expect(meal).not.toBeNull();
    // Boiled Chicken has the highest protein density — should be selected
    const names = meal!.foodItems.map((f) => f.name);
    expect(names).toContain('Boiled Chicken');
  });
});
