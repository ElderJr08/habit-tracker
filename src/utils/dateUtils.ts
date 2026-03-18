export function getToday(): string {
  return formatDate(new Date());
}

export function formatDate(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function parseDate(dateStr: string): Date {
  const [y, m, d] = dateStr.split('-').map(Number);
  return new Date(y, m - 1, d);
}

export function subDays(dateStr: string, days: number): string {
  const d = parseDate(dateStr);
  d.setDate(d.getDate() - days);
  return formatDate(d);
}

export function getDayOfWeek(dateStr: string): number {
  return parseDate(dateStr).getDay();
}

export function isFuture(dateStr: string): boolean {
  return dateStr > getToday();
}

/** Returns 13 weeks of date strings as [week][day], ordered oldest→newest, Sunday first. */
export function getLast13Weeks(): string[][] {
  const today = new Date();
  // Start on the Sunday 13 weeks ago
  const start = new Date(today);
  start.setDate(today.getDate() - today.getDay() - 12 * 7);

  const weeks: string[][] = [];
  for (let w = 0; w < 13; w++) {
    const week: string[] = [];
    for (let d = 0; d < 7; d++) {
      const date = new Date(start);
      date.setDate(start.getDate() + w * 7 + d);
      week.push(formatDate(date));
    }
    weeks.push(week);
  }
  return weeks;
}

/** Last 7 days oldest→newest */
export function getLast7Days(): string[] {
  const today = getToday();
  return Array.from({ length: 7 }, (_, i) => subDays(today, 6 - i));
}

export function getMonthAbbrev(dateStr: string): string {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return months[parseDate(dateStr).getMonth()];
}

export function getDayAbbrev(dateStr: string): string {
  return ['S', 'M', 'T', 'W', 'T', 'F', 'S'][getDayOfWeek(dateStr)];
}

export function formatDisplayDate(date: Date): string {
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });
}
