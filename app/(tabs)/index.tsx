import React, { useMemo } from 'react';
import { View, Text, ScrollView, Pressable, Alert } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { useHabitStore } from '../../src/store/habitStore';
import { HabitCard } from '../../src/components/HabitCard';
import { getToday, getDayOfWeek } from '../../src/utils/dateUtils';

export default function HomeScreen() {
  const { t, i18n } = useTranslation();
  const { habits, setLanguage } = useHabitStore();
  const today = getToday();
  const dow = getDayOfWeek(today);

  const todayHabits = useMemo(
    () =>
      habits.filter(
        (h) =>
          h.frequency === 'daily' ||
          (Array.isArray(h.frequency) && h.frequency.includes(dow))
      ),
    [habits, dow]
  );

  const completedCount = todayHabits.filter((h) =>
    h.completions.includes(today)
  ).length;

  const progress =
    todayHabits.length > 0 ? completedCount / todayHabits.length : 0;
  const allDone = todayHabits.length > 0 && completedCount === todayHabits.length;

  const locale = i18n.language === 'pt' ? 'pt-BR' : 'en-US';
  const formattedDate = new Date().toLocaleDateString(locale, {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });

  const handleLanguagePress = () => {
    Alert.alert(t('language.selectTitle'), undefined, [
      {
        text: `${i18n.language === 'en' ? '✓ ' : ''}${t('language.en')}`,
        onPress: () => setLanguage('en'),
      },
      {
        text: `${i18n.language === 'pt' ? '✓ ' : ''}${t('language.pt')}`,
        onPress: () => setLanguage('pt'),
      },
      { text: i18n.language === 'pt' ? 'Cancelar' : 'Cancel', style: 'cancel' },
    ]);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#09090b' }} edges={['top']}>
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={{ paddingHorizontal: 20, paddingTop: 16, paddingBottom: 8 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
            <Text style={{ color: '#52525b', fontSize: 13, flex: 1 }}>
              {formattedDate}
            </Text>
            <View style={{ flexDirection: 'row', gap: 10 }}>
              <Pressable
                onPress={handleLanguagePress}
                style={{
                  backgroundColor: '#27272a',
                  width: 36,
                  height: 36,
                  borderRadius: 18,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Ionicons name="globe-outline" size={19} color="#fff" />
              </Pressable>
              <Pressable
                onPress={() => router.push('/habit/new')}
                style={{
                  backgroundColor: '#27272a',
                  width: 36,
                  height: 36,
                  borderRadius: 18,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Ionicons name="add" size={22} color="#fff" />
              </Pressable>
            </View>
          </View>
          <Text style={{ color: '#fff', fontSize: 30, fontWeight: 'bold' }}>
            {t('home.title')}
          </Text>
        </View>

        {/* Progress bar */}
        {todayHabits.length > 0 && (
          <View style={{ paddingHorizontal: 20, marginBottom: 24 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 }}>
              <Text style={{ color: '#71717a', fontSize: 13 }}>
                {allDone
                  ? t('home.allDone')
                  : t('home.progress', { done: completedCount, total: todayHabits.length })}
              </Text>
              <Text style={{ color: '#71717a', fontSize: 13 }}>
                {Math.round(progress * 100)}%
              </Text>
            </View>
            <View style={{ backgroundColor: '#27272a', borderRadius: 99, height: 6 }}>
              <View
                style={{
                  backgroundColor: allDone ? '#22c55e' : '#3b82f6',
                  borderRadius: 99,
                  height: 6,
                  width: `${progress * 100}%`,
                }}
              />
            </View>
          </View>
        )}

        {/* Habit list */}
        <View style={{ paddingHorizontal: 20 }}>
          {todayHabits.length === 0 ? (
            <View style={{ alignItems: 'center', paddingTop: 80 }}>
              <Ionicons name="leaf-outline" size={56} color="#27272a" style={{ marginBottom: 16 }} />
              <Text style={{ color: '#fff', fontSize: 20, fontWeight: '600', marginBottom: 8 }}>
                {t('home.noHabits.title')}
              </Text>
              <Text style={{ color: '#52525b', fontSize: 14, textAlign: 'center', marginBottom: 32, lineHeight: 20 }}>
                {t('home.noHabits.subtitle')}
              </Text>
              <Pressable
                onPress={() => router.push('/habit/new')}
                style={{
                  backgroundColor: '#22c55e',
                  paddingHorizontal: 28,
                  paddingVertical: 14,
                  borderRadius: 14,
                }}
              >
                <Text style={{ color: '#fff', fontWeight: '700', fontSize: 15 }}>
                  {t('home.noHabits.button')}
                </Text>
              </Pressable>
            </View>
          ) : (
            todayHabits.map((habit) => (
              <HabitCard
                key={habit.id}
                habit={habit}
                onPress={() => router.push(`/habit/${habit.id}`)}
              />
            ))
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
