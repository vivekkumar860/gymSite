import { Injectable } from '@nestjs/common';
import type { HabitStreak } from '../domain/habit';

const MS_PER_DAY = 86_400_000;

/** Calculates current and longest streaks from a list of completed dates. */
@Injectable()
export class StreakCalculatorService {
  /** Calculate streaks from a descending list of completed dates. */
  calculateStreak(completedDates: Date[]): HabitStreak {
    if (completedDates.length === 0) {
      return { currentStreak: 0, longestStreak: 0 };
    }

    const today = this.stripTime(new Date());
    const sorted = completedDates
      .map((d) => this.stripTime(d).getTime())
      .sort((a, b) => b - a);

    const unique = [...new Set(sorted)];

    const currentStreak = this.countCurrentStreak(unique, today.getTime());
    const longestStreak = this.countLongestStreak(unique);

    return { currentStreak, longestStreak };
  }

  private countCurrentStreak(dates: number[], todayMs: number): number {
    if (dates.length === 0) return 0;

    const diffFromToday = todayMs - dates[0];
    if (diffFromToday > MS_PER_DAY) return 0;

    let streak = 1;
    for (let i = 1; i < dates.length; i++) {
      const gap = dates[i - 1] - dates[i];
      if (gap !== MS_PER_DAY) break;
      streak++;
    }

    return streak;
  }

  private countLongestStreak(dates: number[]): number {
    if (dates.length === 0) return 0;

    let longest = 1;
    let current = 1;

    for (let i = 1; i < dates.length; i++) {
      const gap = dates[i - 1] - dates[i];
      if (gap === MS_PER_DAY) {
        current++;
        longest = Math.max(longest, current);
      } else {
        current = 1;
      }
    }

    return longest;
  }

  private stripTime(date: Date): Date {
    return new Date(
      Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()),
    );
  }
}
