import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import { Habit } from '../types/habit';
import { getToday } from '../utils/dateUtils';
import i18n, { SupportedLanguage } from '../i18n';

interface HabitStore {
  habits: Habit[];
  language: SupportedLanguage | '';
  addHabit: (data: Omit<Habit, 'id' | 'createdAt' | 'completions'>) => void;
  updateHabit: (id: string, updates: Partial<Omit<Habit, 'id' | 'createdAt' | 'completions'>>) => void;
  deleteHabit: (id: string) => void;
  toggleCompletion: (habitId: string) => void;
  setLanguage: (lang: SupportedLanguage) => void;
}

export const useHabitStore = create<HabitStore>()(
  persist(
    (set, get) => ({
      habits: [],
      language: '',

      setLanguage: (lang) => {
        set({ language: lang });
        i18n.changeLanguage(lang);
      },

      addHabit: (data) => {
        const habit: Habit = {
          ...data,
          id: Date.now().toString(),
          createdAt: new Date().toISOString(),
          completions: [],
        };
        set((s) => ({ habits: [...s.habits, habit] }));
        scheduleReminder(habit);
      },

      updateHabit: (id, updates) => {
        set((s) => ({
          habits: s.habits.map((h) => (h.id === id ? { ...h, ...updates } : h)),
        }));
        const habit = get().habits.find((h) => h.id === id);
        if (habit) {
          cancelReminder(id);
          scheduleReminder({ ...habit, ...updates });
        }
      },

      deleteHabit: (id) => {
        cancelReminder(id);
        set((s) => ({ habits: s.habits.filter((h) => h.id !== id) }));
      },

      toggleCompletion: (habitId) => {
        const today = getToday();
        set((s) => ({
          habits: s.habits.map((h) => {
            if (h.id !== habitId) return h;
            const done = h.completions.includes(today);
            return {
              ...h,
              completions: done
                ? h.completions.filter((d) => d !== today)
                : [...h.completions, today],
            };
          }),
        }));
      },
    }),
    {
      name: 'habit-store',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

// ── Notification helpers ──────────────────────────────────────────────────────

export async function setupNotifications() {
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('habits', {
      name: 'Habit Reminders',
      importance: Notifications.AndroidImportance.HIGH,
    });
  }
}

async function scheduleReminder(habit: Partial<Habit> & { id: string }) {
  if (!habit.reminderTime) return;
  const [hour, minute] = habit.reminderTime.split(':').map(Number);
  try {
    await Notifications.scheduleNotificationAsync({
      identifier: `habit-${habit.id}`,
      content: {
        title: `${habit.emoji ?? ''} ${habit.name ?? 'Habit'} time!`,
        body: "Keep your streak going! 🔥",
        sound: true,
      },
      trigger: {
        hour,
        minute,
        repeats: true,
      } as any,
    });
  } catch (_) {}
}

async function cancelReminder(habitId: string) {
  try {
    await Notifications.cancelScheduledNotificationAsync(`habit-${habitId}`);
  } catch (_) {}
}
