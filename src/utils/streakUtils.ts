import { Habit } from '../types/habit';
import { getToday, subDays, getDayOfWeek } from './dateUtils';

function isDueOn(habit: Habit, dateStr: string): boolean {
  if (habit.frequency === 'daily') return true;
  return (habit.frequency as number[]).includes(getDayOfWeek(dateStr));
}

export function calculateCurrentStreak(habit: Habit): number {
  const completionSet = new Set(habit.completions);
  const createdDate = habit.createdAt.substring(0, 10);
  let streak = 0;
  let date = getToday();

  // If today is a due day but not completed, start counting from yesterday
  if (isDueOn(habit, date) && !completionSet.has(date)) {
    date = subDays(date, 1);
  }

  for (let i = 0; i < 1000; i++) {
    if (date < createdDate) break;
    if (isDueOn(habit, date)) {
      if (completionSet.has(date)) {
        streak++;
      } else {
        break;
      }
    }
    date = subDays(date, 1);
  }

  return streak;
}

export function calculateBestStreak(habit: Habit): number {
  const sorted = [...habit.completions].sort();
  if (sorted.length === 0) return 0;

  let best = 1;
  let current = 1;

  for (let i = 1; i < sorted.length; i++) {
    const prev = new Date(sorted[i - 1]);
    const curr = new Date(sorted[i]);
    const diff = Math.round((curr.getTime() - prev.getTime()) / 86_400_000);
    if (diff === 1) {
      current++;
      best = Math.max(best, current);
    } else {
      current = 1;
    }
  }

  return best;
}

/** Completion rate over the last `days` days (default 30). */
export function getCompletionRate(habit: Habit, days = 30): number {
  const today = getToday();
  const createdDate = habit.createdAt.substring(0, 10);
  const completionSet = new Set(habit.completions);
  let due = 0;
  let done = 0;

  for (let i = 0; i < days; i++) {
    const date = subDays(today, i);
    if (date < createdDate) break;
    if (isDueOn(habit, date)) {
      due++;
      if (completionSet.has(date)) done++;
    }
  }

  return due === 0 ? 0 : done / due;
}
