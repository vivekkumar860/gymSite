import { Module } from '@nestjs/common';
import { NutritionController } from './controllers/nutrition.controller';
import { NutritionService } from './services/nutrition.service';
import { NutritionCalculatorService } from './services/nutrition-calculator.service';
import { MealPlanGeneratorService } from './services/meal-plan-generator.service';
import { NutritionPlanRepository } from './repositories/nutrition-plan.repository';
import { FoodItemRepository } from './repositories/food-item.repository';
import { NutritionFacade } from './facade/nutrition.facade';
import { MealPlanStrategyResolver } from './strategies/meal-plan-strategy.resolver';
import { IndianVegetarianMealStrategy } from './strategies/indian-vegetarian-meal.strategy';
import { IndianNonVegMealStrategy } from './strategies/indian-non-veg-meal.strategy';
import { VeganMealStrategy } from './strategies/vegan-meal.strategy';
import { HostelBudgetMealStrategy } from './strategies/hostel-budget-meal.strategy';
import { OfficeGoingMealStrategy } from './strategies/office-going-meal.strategy';

@Module({
  controllers: [NutritionController],
  providers: [
    NutritionService,
    NutritionCalculatorService,
    MealPlanGeneratorService,
    NutritionPlanRepository,
    FoodItemRepository,
    NutritionFacade,
    MealPlanStrategyResolver,
    IndianVegetarianMealStrategy,
    IndianNonVegMealStrategy,
    VeganMealStrategy,
    HostelBudgetMealStrategy,
    OfficeGoingMealStrategy,
  ],
  exports: [NutritionService, NutritionFacade],
})
export class NutritionModule {}
