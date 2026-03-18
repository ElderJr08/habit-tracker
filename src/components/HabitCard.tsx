import React, { useCallback } from 'react';
import { View, Text, Pressable } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withSequence,
} from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { Habit } from '../types/habit';
import { useHabitStore } from '../store/habitStore';
import { calculateCurrentStreak } from '../utils/streakUtils';
import { getToday } from '../utils/dateUtils';
import { HabitIcon } from './HabitIcon';

interface Props {
  habit: Habit;
  onPress?: () => void;
}

export function HabitCard({ habit, onPress }: Props) {
  const { t } = useTranslation();
  const { toggleCompletion } = useHabitStore();
  const completed = habit.completions.includes(getToday());
  const streak = calculateCurrentStreak(habit);

  const cardScale = useSharedValue(1);
  const checkScale = useSharedValue(completed ? 1 : 0);

  const cardStyle = useAnimatedStyle(() => ({
    transform: [{ scale: cardScale.value }],
  }));

  const checkStyle = useAnimatedStyle(() => ({
    transform: [{ scale: checkScale.value }],
    opacity: checkScale.value,
  }));

  const handleToggle = useCallback(() => {
    cardScale.value = withSequence(
      withSpring(0.97, { damping: 20 }),
      withSpring(1, { damping: 10 })
    );
    if (!completed) {
      checkScale.value = withSequence(
        withSpring(1.4, { damping: 6 }),
        withSpring(1, { damping: 12 })
      );
    } else {
      checkScale.value = withSpring(0, { damping: 15 });
    }
    toggleCompletion(habit.id);
  }, [completed, habit.id, cardScale, checkScale, toggleCompletion]);

  return (
    <Animated.View style={[cardStyle, { marginBottom: 12 }]}>
      <Pressable
        onPress={onPress}
        style={{
          backgroundColor: '#18181b',
          borderRadius: 16,
          padding: 16,
          flexDirection: 'row',
          alignItems: 'center',
          borderLeftWidth: 4,
          borderLeftColor: habit.color,
        }}
      >
        <View style={{ marginRight: 14, width: 32, alignItems: 'center' }}>
          <HabitIcon name={habit.emoji} size={28} color={habit.color} />
        </View>

        <View style={{ flex: 1 }}>
          <Text style={{ color: '#fff', fontWeight: '600', fontSize: 16 }}>
            {habit.name}
          </Text>
          {streak > 0 && (
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 3 }}>
              <Ionicons name="flame-outline" size={13} color="#f97316" />
              <Text style={{ color: '#71717a', fontSize: 13 }}>
                {t('habit.streak', { count: streak })}
              </Text>
            </View>
          )}
        </View>

        <Pressable
          onPress={handleToggle}
          hitSlop={12}
          style={{
            width: 32,
            height: 32,
            borderRadius: 16,
            borderWidth: 2,
            borderColor: completed ? habit.color : '#52525b',
            backgroundColor: completed ? habit.color : 'transparent',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {completed && (
            <Animated.View style={checkStyle}>
              <Ionicons name="checkmark" size={18} color="#fff" />
            </Animated.View>
          )}
        </Pressable>
      </Pressable>
    </Animated.View>
  );
}
