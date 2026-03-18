# Habit Tracker

A mobile app to build and track daily habits, built with React Native and Expo.

## Features

- Track daily and weekly habits
- Check off habits with animated feedback
- Streak tracking (current and best)
- Completion rate per habit
- Weekly bar chart
- GitHub-style progress calendar
- Statistics overview screen
- Create, edit, and delete habits
- Custom icon and color per habit
- Optional daily reminders (push notifications)
- English and Portuguese (BR) support
- Dark theme

## Tech Stack

- [Expo](https://expo.dev) (SDK 55) + [Expo Router](https://expo.github.io/router) v4
- React Native 0.83 (New Architecture)
- TypeScript
- Zustand + AsyncStorage (state persistence)
- React Native Reanimated v4
- NativeWind v4 (Tailwind CSS for React Native)
- i18next + react-i18next + expo-localization
- @expo/vector-icons (Ionicons)
- expo-notifications

## Getting Started

### Prerequisites

- Node.js 18+
- Expo CLI
- iOS Simulator or Android Emulator (or Expo Go on a physical device)

### Install

```bash
git clone https://github.com/ElderJr08/habit-tracker.git
cd habit-tracker
npm install
```

### Run

```bash
npx expo start
```

Press `i` for iOS simulator, `a` for Android emulator, or scan the QR code with Expo Go.

## Project Structure

```
app/
  (tabs)/
    index.tsx       # Home — today's habits
    stats.tsx       # Statistics screen
  habit/
    [id].tsx        # Habit detail (streaks, calendar, chart)
    new.tsx         # Create / edit habit
src/
  components/       # HabitCard, HabitIcon, ProgressCalendar, WeeklyChart
  store/            # Zustand store (habitStore)
  utils/            # dateUtils, streakUtils
  i18n/             # en.ts, pt.ts translations
  types/            # Habit type definition
```
