import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { useHabitStore } from '../../src/store/habitStore';
import {
  calculateCurrentStreak,
  calculateBestStreak,
  getCompletionRate,
} from '../../src/utils/streakUtils';
import { HabitIcon } from '../../src/components/HabitIcon';
import { Habit } from '../../src/types/habit';

export default function StatsScreen() {
  const { t } = useTranslation();
  const { habits } = useHabitStore();

  const totalCompletions = habits.reduce((s, h) => s + h.completions.length, 0);
  const bestStreak = habits.reduce(
    (best, h) => Math.max(best, calculateBestStreak(h)),
    0
  );
  const overallRate =
    habits.length > 0
      ? habits.reduce((s, h) => s + getCompletionRate(h), 0) / habits.length
      : 0;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#09090b' }} edges={['top']}>
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
      >
        <View style={{ paddingHorizontal: 20, paddingTop: 16, paddingBottom: 24 }}>
          <Text style={{ color: '#fff', fontSize: 30, fontWeight: 'bold' }}>
            {t('stats.title')}
          </Text>
        </View>

        {/* Summary row */}
        <View style={{ flexDirection: 'row', paddingHorizontal: 20, gap: 12, marginBottom: 28 }}>
          <SummaryCard
            label={t('stats.completion')}
            value={`${Math.round(overallRate * 100)}%`}
            iconName="trending-up-outline"
            iconColor="#22c55e"
          />
          <SummaryCard
            label={t('stats.bestStreak')}
            value={`${bestStreak}d`}
            iconName="flame-outline"
            iconColor="#f97316"
          />
          <SummaryCard
            label={t('stats.totalDone')}
            value={String(totalCompletions)}
            iconName="checkmark-circle-outline"
            iconColor="#3b82f6"
          />
        </View>

        {/* Per-habit breakdown */}
        <View style={{ paddingHorizontal: 20 }}>
          <Text style={{ color: '#fff', fontWeight: '600', fontSize: 18, marginBottom: 12 }}>
            {t('stats.habits')}
          </Text>

          {habits.length === 0 ? (
            <View style={{ alignItems: 'center', paddingTop: 40 }}>
              <Ionicons name="bar-chart-outline" size={48} color="#3f3f46" />
              <Text style={{ color: '#52525b', fontSize: 14, textAlign: 'center', marginTop: 12 }}>
                {t('stats.noHabits')}
              </Text>
            </View>
          ) : (
            habits.map((h) => <HabitStatRow key={h.id} habit={h} />)
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function SummaryCard({
  label,
  value,
  iconName,
  iconColor,
}: {
  label: string;
  value: string;
  iconName: string;
  iconColor: string;
}) {
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: '#18181b',
        borderRadius: 16,
        padding: 14,
        alignItems: 'center',
      }}
    >
      <Ionicons name={iconName as any} size={26} color={iconColor} style={{ marginBottom: 6 }} />
      <Text style={{ color: '#fff', fontSize: 20, fontWeight: 'bold' }}>{value}</Text>
      <Text style={{ color: '#52525b', fontSize: 11, textAlign: 'center', marginTop: 2 }}>
        {label}
      </Text>
    </View>
  );
}

function HabitStatRow({ habit }: { habit: Habit }) {
  const { t } = useTranslation();
  const streak = calculateCurrentStreak(habit);
  const best = calculateBestStreak(habit);
  const rate = getCompletionRate(habit);

  return (
    <View style={{ backgroundColor: '#18181b', borderRadius: 16, padding: 16, marginBottom: 12 }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
        <View style={{ marginRight: 10 }}>
          <HabitIcon name={habit.emoji} size={24} color={habit.color} />
        </View>
        <Text style={{ color: '#fff', fontWeight: '600', fontSize: 15, flex: 1 }}>
          {habit.name}
        </Text>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
          <Ionicons name="flame-outline" size={14} color="#f97316" />
          <Text style={{ color: '#71717a', fontSize: 13 }}>{streak}</Text>
        </View>
      </View>

      <View style={{ backgroundColor: '#27272a', borderRadius: 99, height: 6, marginBottom: 6 }}>
        <View
          style={{
            height: 6,
            borderRadius: 99,
            backgroundColor: habit.color,
            width: `${rate * 100}%`,
          }}
        />
      </View>

      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        <Text style={{ color: '#52525b', fontSize: 12 }}>
          {t('stats.last30Days', { rate: Math.round(rate * 100) })}
        </Text>
        <Text style={{ color: '#52525b', fontSize: 12 }}>
          {t('stats.best', { days: best })}
        </Text>
      </View>
    </View>
  );
}
