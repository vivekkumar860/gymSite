import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../infrastructure/database/prisma.service';

export interface FoodItemRecord {
  id: string;
  name: string;
  calories: number;
  proteinG: number;
  carbsG: number;
  fatG: number;
  fibreG: number | null;
}

@Injectable()
export class FoodItemRepository {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Find food items suitable for a given meal type.
   * If vegOnly is true, only vegetarian items are returned.
   * If vegOnly is false, both veg and non-veg items are returned.
   */
  async findForMeal(
    mealType: 'breakfast' | 'lunch' | 'dinner',
    vegOnly: boolean,
  ): Promise<FoodItemRecord[]> {
    const mealFilter =
      mealType === 'breakfast'
        ? { forBreakfast: true }
        : mealType === 'lunch'
          ? { forLunch: true }
          : { forDinner: true };

    const records = await this.prisma.foodItem.findMany({
      where: {
        ...mealFilter,
        ...(vegOnly ? { isVeg: true } : {}),
        calories: { gt: 0 },
      },
      select: {
        id: true,
        name: true,
        calories: true,
        proteinG: true,
        carbsG: true,
        fatG: true,
        fibreG: true,
      },
    });

    return records;
  }
}
