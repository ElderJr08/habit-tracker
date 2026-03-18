import React from 'react';
import { View, Text, ScrollView, Pressable, Alert } from 'react-native';
import { useLocalSearchParams, router, Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { useHabitStore } from '../../src/store/habitStore';
import { ProgressCalendar } from '../../src/components/ProgressCalendar';
import { WeeklyChart } from '../../src/components/WeeklyChart';
import { HabitIcon } from '../../src/components/HabitIcon';
import {
  calculateCurrentStreak,
  calculateBestStreak,
  getCompletionRate,
} from '../../src/utils/streakUtils';

export default function HabitDetailScreen() {
  const { t } = useTranslation();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { habits, deleteHabit } = useHabitStore();
  const habit = habits.find((h) => h.id === id);

  if (!habit) {
    return (
      <View style={{ flex: 1, backgroundColor: '#09090b', alignItems: 'center', justifyContent: 'center' }}>
        <Text style={{ color: '#fff' }}>Habit not found</Text>
      </View>
    );
  }

  const streak = calculateCurrentStreak(habit);
  const best = calculateBestStreak(habit);
  const rate = getCompletionRate(habit);

  const days = t('days.short', { returnObjects: true }) as string[];
  const freqLabel =
    habit.frequency === 'daily'
      ? t('detail.everyDay')
      : days
          .filter((_, i) => (habit.frequency as number[]).includes(i))
          .join(', ');

  const handleDelete = () => {
    Alert.alert(
      t('detail.delete.title'),
      t('detail.delete.message', { name: habit.name }),
      [
        { text: t('detail.delete.cancel'), style: 'cancel' },
        {
          text: t('detail.delete.confirm'),
          style: 'destructive',
          onPress: () => {
            deleteHabit(habit.id);
            router.back();
          },
        },
      ]
    );
  };

  return (
    <>
      <Stack.Screen
        options={{
          title: habit.name,
          headerRight: () => (
            <View style={{ flexDirection: 'row', gap: 20 }}>
              <Pressable
                onPress={() =>
                  router.push({ pathname: '/habit/new', params: { id: habit.id } })
                }
                hitSlop={8}
              >
                <Ionicons name="pencil-outline" size={20} color="#fff" />
              </Pressable>
              <Pressable onPress={handleDelete} hitSlop={8}>
                <Ionicons name="trash-outline" size={20} color="#ef4444" />
              </Pressable>
            </View>
          ),
        }}
      />

      <ScrollView
        style={{ flex: 1, backgroundColor: '#09090b' }}
        contentContainerStyle={{ paddingBottom: 48 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero */}
        <View
          style={{
            alignItems: 'center',
            paddingVertical: 36,
            backgroundColor: habit.color + '18',
          }}
        >
          <View
            style={{
              width: 80,
              height: 80,
              borderRadius: 40,
              backgroundColor: habit.color + '30',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: 12,
            }}
          >
            <HabitIcon name={habit.emoji} size={40} color={habit.color} />
          </View>
          <Text style={{ color: '#fff', fontSize: 24, fontWeight: 'bold' }}>
            {habit.name}
          </Text>
          <Text style={{ color: '#71717a', fontSize: 13, marginTop: 4 }}>
            {freqLabel}
          </Text>
        </View>

        {/* Stats row */}
        <View style={{ flexDirection: 'row', paddingHorizontal: 20, gap: 12, marginTop: 20, marginBottom: 20 }}>
          <StatBadge
            label={t('detail.currentStreak')}
            value={String(streak)}
            iconName="flame-outline"
            iconColor="#f97316"
            valueColor={habit.color}
          />
          <StatBadge
            label={t('detail.bestStreak')}
            value={String(best)}
            iconName="trophy-outline"
            iconColor="#eab308"
          />
          <StatBadge
            label={t('detail.completion')}
            value={`${Math.round(rate * 100)}%`}
          />
        </View>

        {/* Weekly chart */}
        <View style={{ marginHorizontal: 20, backgroundColor: '#18181b', borderRadius: 16, padding: 16, marginBottom: 16 }}>
          <Text style={{ color: '#fff', fontWeight: '600', fontSize: 15, marginBottom: 16 }}>
            {t('detail.thisWeek')}
          </Text>
          <WeeklyChart habit={habit} />
        </View>

        {/* Progress calendar */}
        <View style={{ marginHorizontal: 20, backgroundColor: '#18181b', borderRadius: 16, padding: 16, marginBottom: 16 }}>
          <Text style={{ color: '#fff', fontWeight: '600', fontSize: 15, marginBottom: 16 }}>
            {t('detail.progressCalendar')}
          </Text>
          <ProgressCalendar habit={habit} />
        </View>

        {/* Totals */}
        <View style={{ marginHorizontal: 20, backgroundColor: '#18181b', borderRadius: 16, padding: 16 }}>
          <Text style={{ color: '#71717a', fontSize: 13 }}>{t('detail.totalCompletions')}</Text>
          <Text style={{ color: '#fff', fontSize: 28, fontWeight: 'bold', marginTop: 4 }}>
            {habit.completions.length}
          </Text>
        </View>
      </ScrollView>
    </>
  );
}

function StatBadge({
  label,
  value,
  iconName,
  iconColor,
  valueColor,
}: {
  label: string;
  value: string;
  iconName?: string;
  iconColor?: string;
  valueColor?: string;
}) {
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: '#18181b',
        borderRadius: 14,
        padding: 12,
        alignItems: 'center',
        gap: 2,
      }}
    >
      {iconName && (
        <Ionicons name={iconName as any} size={18} color={iconColor ?? '#fff'} />
      )}
      <Text style={{ color: valueColor ?? '#fff', fontWeight: 'bold', fontSize: 18 }}>
        {value}
      </Text>
      <Text style={{ color: '#52525b', fontSize: 10, textAlign: 'center' }}>
        {label}
      </Text>
    </View>
  );
}
