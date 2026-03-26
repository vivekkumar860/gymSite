import { MealPlanStrategyResolver } from '../strategies/meal-plan-strategy.resolver';
import { IndianVegetarianMealStrategy } from '../strategies/indian-vegetarian-meal.strategy';
import { IndianNonVegMealStrategy } from '../strategies/indian-non-veg-meal.strategy';
import { VeganMealStrategy } from '../strategies/vegan-meal.strategy';
import { HostelBudgetMealStrategy } from '../strategies/hostel-budget-meal.strategy';
import { OfficeGoingMealStrategy } from '../strategies/office-going-meal.strategy';
import { ValidationError } from '../../../common/errors';

describe('MealPlanStrategyResolver', () => {
  let resolver: MealPlanStrategyResolver;

  beforeEach(() => {
    resolver = new MealPlanStrategyResolver(
      new IndianVegetarianMealStrategy(),
      new IndianNonVegMealStrategy(),
      new VeganMealStrategy(),
      new HostelBudgetMealStrategy(),
      new OfficeGoingMealStrategy(),
    );
  });

  it('should resolve INDIAN_VEGETARIAN to IndianVegetarianMealStrategy', () => {
    const strategy = resolver.resolve('INDIAN_VEGETARIAN');
    expect(strategy).toBeInstanceOf(IndianVegetarianMealStrategy);
  });

  it('should resolve INDIAN_NON_VEG to IndianNonVegMealStrategy', () => {
    const strategy = resolver.resolve('INDIAN_NON_VEG');
    expect(strategy).toBeInstanceOf(IndianNonVegMealStrategy);
  });

  it('should resolve VEGAN to VeganMealStrategy', () => {
    const strategy = resolver.resolve('VEGAN');
    expect(strategy).toBeInstanceOf(VeganMealStrategy);
  });

  it('should resolve HOSTEL_BUDGET to HostelBudgetMealStrategy', () => {
    const strategy = resolver.resolve('HOSTEL_BUDGET');
    expect(strategy).toBeInstanceOf(HostelBudgetMealStrategy);
  });

  it('should resolve OFFICE_GOING to OfficeGoingMealStrategy', () => {
    const strategy = resolver.resolve('OFFICE_GOING');
    expect(strategy).toBeInstanceOf(OfficeGoingMealStrategy);
  });

  it('should throw ValidationError for unsupported plan type', () => {
    expect(() => resolver.resolve('KETO' as any)).toThrow(ValidationError);
  });
});
