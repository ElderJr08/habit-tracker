export interface Habit {
  id: string;
  name: string;
  emoji: string;
  color: string;
  frequency: 'daily' | number[]; // number[] = days of week [0=Sun … 6=Sat]
  reminderTime?: string; // "HH:mm"
  createdAt: string; // ISO date string
  completions: string[]; // array of "YYYY-MM-DD" date strings
}
