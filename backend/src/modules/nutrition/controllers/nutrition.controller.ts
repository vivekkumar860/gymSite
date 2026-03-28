import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  UseGuards,
  ParseUUIDPipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { NutritionService } from '../services/nutrition.service';
import { NutritionFacade } from '../facade/nutrition.facade';
import { ZodValidationPipe } from '../../../common/pipes';
import { JwtAuthGuard } from '../../../common/guards';
import { CurrentUser } from '../../../common/decorators';
import { CreateNutritionPlanSchema } from '../dto/create-nutrition-plan.dto';
import { UpdateNutritionPlanSchema } from '../dto/update-nutrition-plan.dto';
import { CreateMealTemplateSchema } from '../dto/create-meal-template.dto';
import { GenerateNutritionPlanSchema } from '../dto/generate-nutrition-plan.dto';
import type {
  NutritionPlanResponseDto,
  MealTemplateResponseDto,
  NutritionPlanWithMealsResponseDto,
} from '../dto/nutrition-response.dto';

/** Handles nutrition plan and meal template endpoints. */
@Controller('nutrition-plans')
@UseGuards(JwtAuthGuard)
export class NutritionController {
  constructor(
    private readonly nutritionService: NutritionService,
    private readonly nutritionFacade: NutritionFacade,
  ) {}

  /** Generate a complete nutrition plan from user body stats and preferences. */
  @Post('generate')
  @HttpCode(HttpStatus.CREATED)
  async generatePlan(
    @CurrentUser() userId: string,
    @Body(new ZodValidationPipe(GenerateNutritionPlanSchema)) dto: any,
  ): Promise<NutritionPlanWithMealsResponseDto> {
    return this.nutritionFacade.generatePlan(userId, dto);
  }

  /** Get the user's currently active nutrition plan with meals. */
  @Get('active')
  async getActivePlan(
    @CurrentUser() userId: string,
  ): Promise<NutritionPlanWithMealsResponseDto> {
    return this.nutritionFacade.getActivePlan(userId);
  }

  /** Activate a specific nutrition plan, deactivating all others. */
  @Patch(':planId/activate')
  async activatePlan(
    @Param('planId', ParseUUIDPipe) planId: string,
    @CurrentUser() userId: string,
  ): Promise<NutritionPlanResponseDto> {
    return this.nutritionService.activatePlan(planId, userId);
  }

  /** Regenerate a single meal within a plan using its stored generation context. */
  @Post(':planId/meals/:mealId/regenerate')
  async regenerateSingleMeal(
    @Param('planId', ParseUUIDPipe) planId: string,
    @Param('mealId', ParseUUIDPipe) mealId: string,
    @CurrentUser() userId: string,
  ): Promise<NutritionPlanWithMealsResponseDto> {
    return this.nutritionFacade.regenerateSingleMeal(planId, mealId, userId);
  }

  /** Regenerate meals for an existing plan using its stored generation context. */
  @Post(':planId/regenerate')
  async regenerateMeals(
    @Param('planId', ParseUUIDPipe) planId: string,
    @CurrentUser() userId: string,
  ): Promise<NutritionPlanWithMealsResponseDto> {
    return this.nutritionFacade.regenerateMeals(planId, userId);
  }

  /** List all nutrition plans for the user. */
  @Get()
  async listPlans(
    @CurrentUser() userId: string,
  ): Promise<NutritionPlanResponseDto[]> {
    return this.nutritionService.getUserPlans(userId);
  }

  /** Get a single nutrition plan. */
  @Get(':planId')
  async getPlan(
    @Param('planId', ParseUUIDPipe) planId: string,
    @CurrentUser() userId: string,
  ): Promise<NutritionPlanResponseDto> {
    return this.nutritionService.getPlanById(planId, userId);
  }

  /** Create a new nutrition plan. */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createPlan(
    @CurrentUser() userId: string,
    @Body(new ZodValidationPipe(CreateNutritionPlanSchema)) dto: any,
  ): Promise<NutritionPlanResponseDto> {
    return this.nutritionService.createPlan(userId, dto);
  }

  /** Update a nutrition plan. */
  @Patch(':planId')
  async updatePlan(
    @Param('planId', ParseUUIDPipe) planId: string,
    @CurrentUser() userId: string,
    @Body(new ZodValidationPipe(UpdateNutritionPlanSchema)) dto: any,
  ): Promise<NutritionPlanResponseDto> {
    return this.nutritionService.updatePlan(planId, userId, dto);
  }

  /** Delete a nutrition plan. */
  @Delete(':planId')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deletePlan(
    @Param('planId', ParseUUIDPipe) planId: string,
    @CurrentUser() userId: string,
  ): Promise<void> {
    await this.nutritionService.deletePlan(planId, userId);
  }

  /** List meals in a plan. */
  @Get(':planId/meals')
  async listMeals(
    @Param('planId', ParseUUIDPipe) planId: string,
    @CurrentUser() userId: string,
  ): Promise<MealTemplateResponseDto[]> {
    return this.nutritionService.getPlanMeals(planId, userId);
  }

  /** Add a meal to a plan. */
  @Post(':planId/meals')
  @HttpCode(HttpStatus.CREATED)
  async addMeal(
    @Param('planId', ParseUUIDPipe) planId: string,
    @CurrentUser() userId: string,
    @Body(new ZodValidationPipe(CreateMealTemplateSchema)) dto: any,
  ): Promise<MealTemplateResponseDto> {
    return this.nutritionService.addMeal(planId, userId, dto);
  }

  /** Remove a meal from a plan. */
  @Delete(':planId/meals/:mealId')
  @HttpCode(HttpStatus.NO_CONTENT)
  async removeMeal(
    @Param('planId', ParseUUIDPipe) planId: string,
    @Param('mealId', ParseUUIDPipe) mealId: string,
    @CurrentUser() userId: string,
  ): Promise<void> {
    await this.nutritionService.removeMeal(mealId, planId, userId);
  }
}
