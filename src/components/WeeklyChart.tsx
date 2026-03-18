import React from 'react';
import { View, Text } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Habit } from '../types/habit';
import { getLast7Days, getDayOfWeek } from '../utils/dateUtils';

interface Props {
  habit: Habit;
}

const BAR_MAX = 72;

export function WeeklyChart({ habit }: Props) {
  const { t } = useTranslation();
  const dayNames = t('days.short', { returnObjects: true }) as string[];

  const days = getLast7Days();
  const completionSet = new Set(habit.completions);

  return (
    <View style={{ flexDirection: 'row', alignItems: 'flex-end', height: BAR_MAX + 24 }}>
      {days.map((dateStr) => {
        const done = completionSet.has(dateStr);
        const dow = getDayOfWeek(dateStr);
        return (
          <View
            key={dateStr}
            style={{ flex: 1, alignItems: 'center', justifyContent: 'flex-end' }}
          >
            <View
              style={{
                width: 28,
                height: done ? BAR_MAX : 14,
                backgroundColor: done ? habit.color : '#3f3f46',
                borderRadius: 6,
                marginBottom: 6,
              }}
            />
            <Text style={{ color: '#71717a', fontSize: 11 }}>
              {dayNames[dow][0]}
            </Text>
          </View>
        );
      })}
    </View>
  );
}
