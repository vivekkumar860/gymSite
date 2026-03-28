import type { GeneratedMeal, FoodItem } from '../interfaces/nutrition.interfaces';
import type { FoodItemRecord } from '../repositories/food-item.repository';

/**
 * Build a single meal from database food items, targeting specific macro goals.
 *
 * Algorithm:
 * 1. Sort foods by protein density (protein per calorie)
 * 2. Greedily pick foods until calorie target is met (3-4 items)
 * 3. Scale final portions to hit exact calorie target
 *
 * Returns null if insufficient foods are available (caller should fall back).
 */
export function buildMealFromDbFoods(
  mealName: string,
  mealOrder: number,
  targetCalories: number,
  targetProteinG: number,
  targetCarbsG: number,
  targetFatG: number,
  availableFoods: FoodItemRecord[],
): GeneratedMeal | null {
  if (availableFoods.length === 0) return null;

  // Sort by protein density (protein per calorie) descending
  const sorted = [...availableFoods].sort((a, b) => {
    const densityA = a.calories > 0 ? a.proteinG / a.calories : 0;
    const densityB = b.calories > 0 ? b.proteinG / b.calories : 0;
    return densityB - densityA;
  });

  // Greedy selection: pick foods up to ~95% of calorie target, max 4 items
  const selected: { food: FoodItemRecord; portionCals: number }[] = [];
  let accumulated = 0;
  const maxPerItem = targetCalories * 0.4;

  for (const food of sorted) {
    if (selected.length >= 4) break;
    if (accumulated >= targetCalories * 0.95) break;

    const remaining = targetCalories - accumulated;
    const portionCals = Math.min(food.calories, maxPerItem, remaining);
    if (portionCals <= 0) continue;

    selected.push({ food, portionCals });
    accumulated += portionCals;
  }

  // If we assembled less than 50% of the target, not enough food data
  if (accumulated < targetCalories * 0.5) return null;

  // Scale all portions to hit exact calorie target
  const finalScale = targetCalories / accumulated;

  const foodItems: FoodItem[] = selected.map(({ food, portionCals }) => {
    const itemScale = (portionCals * finalScale) / food.calories;
    const grams = Math.round(100 * itemScale);

    return {
      name: food.name,
      quantity: `${grams} g`,
      calories: Math.round(food.calories * itemScale),
      proteinG: Math.round(food.proteinG * itemScale),
      carbsG: Math.round(food.carbsG * itemScale),
      fatG: Math.round(food.fatG * itemScale),
    };
  });

  return {
    mealName,
    mealOrder,
    calories: targetCalories,
    proteinG: targetProteinG,
    carbsG: targetCarbsG,
    fatG: targetFatG,
    notes: `DB-generated ${mealName.toLowerCase()} from Indian RDA foods`,
    foodItems,
  };
}
