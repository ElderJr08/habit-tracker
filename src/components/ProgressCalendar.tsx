import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Habit } from '../types/habit';
import { getLast13Weeks, getToday, isFuture, getMonthAbbrev } from '../utils/dateUtils';

interface Props {
  habit: Habit;
}

const CELL = 14;
const GAP = 3;

export function ProgressCalendar({ habit }: Props) {
  const { t } = useTranslation();
  const abbrev = t('days.abbrev', { returnObjects: true }) as string[];

  const weeks = getLast13Weeks();
  const completionSet = new Set(habit.completions);
  const today = getToday();
  const createdDate = habit.createdAt.substring(0, 10);

  function cellColor(dateStr: string): string {
    if (isFuture(dateStr)) return '#27272a';
    if (dateStr < createdDate) return 'transparent';
    if (completionSet.has(dateStr)) return habit.color;
    return '#27272a';
  }

  function cellOpacity(dateStr: string): number {
    if (isFuture(dateStr)) return 0.3;
    if (completionSet.has(dateStr)) return 1;
    return 0.5;
  }

  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
      <View>
        {/* Month labels row */}
        <View style={{ flexDirection: 'row', marginLeft: 18, marginBottom: 4 }}>
          {weeks.map((week, wi) => {
            const prevMonth =
              wi > 0 ? new Date(weeks[wi - 1][0]).getMonth() : -1;
            const thisMonth = new Date(week[0]).getMonth();
            return (
              <View key={wi} style={{ width: CELL + GAP }}>
                {thisMonth !== prevMonth ? (
                  <Text style={{ color: '#71717a', fontSize: 10 }}>
                    {getMonthAbbrev(week[0])}
                  </Text>
                ) : null}
              </View>
            );
          })}
        </View>

        {/* Grid */}
        <View style={{ flexDirection: 'row' }}>
          {/* Day-of-week labels */}
          <View style={{ marginRight: GAP }}>
            {abbrev.map((label, i) => (
              <View key={i} style={{ height: CELL, marginBottom: GAP, justifyContent: 'center' }}>
                <Text style={{ color: '#52525b', fontSize: 9, width: 10 }}>
                  {i % 2 === 1 ? label : ''}
                </Text>
              </View>
            ))}
          </View>

          {/* Weeks */}
          {weeks.map((week, wi) => (
            <View key={wi} style={{ marginRight: GAP }}>
              {week.map((dateStr, di) => (
                <View
                  key={di}
                  style={{
                    width: CELL,
                    height: CELL,
                    borderRadius: 3,
                    backgroundColor: cellColor(dateStr),
                    opacity: cellOpacity(dateStr),
                    marginBottom: GAP,
                    borderWidth: dateStr === today ? 1 : 0,
                    borderColor: '#fff',
                  }}
                />
              ))}
            </View>
          ))}
        </View>
      </View>
    </ScrollView>
  );
}
