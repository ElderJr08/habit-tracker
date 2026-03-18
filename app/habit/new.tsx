import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  Pressable,
  Alert,
} from 'react-native';
import { router, useLocalSearchParams, Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as Notifications from 'expo-notifications';
import { useTranslation } from 'react-i18next';
import { useHabitStore } from '../../src/store/habitStore';
import { HabitIcon } from '../../src/components/HabitIcon';

const ICONS: string[] = [
  'barbell-outline', 'walk-outline', 'book-outline', 'water-outline',
  'leaf-outline', 'nutrition-outline', 'moon-outline', 'trophy-outline',
  'pencil-outline', 'color-palette-outline', 'musical-notes-outline', 'flower-outline',
  'home-outline', 'medkit-outline', 'bicycle-outline', 'fitness-outline',
  'cafe-outline', 'sunny-outline', 'brain', 'heart-outline',
  'happy-outline', 'bed-outline', 'journal-outline', 'star-outline',
  'flash-outline', 'glasses-outline', 'headset-outline', 'camera-outline',
  'basketball-outline', 'football-outline',
];

const COLORS = [
  '#ef4444', '#f97316', '#f59e0b', '#eab308',
  '#84cc16', '#22c55e', '#14b8a6', '#06b6d4',
  '#3b82f6', '#8b5cf6', '#a855f7', '#ec4899',
];

export default function NewHabitScreen() {
  const { t } = useTranslation();
  const { id } = useLocalSearchParams<{ id?: string }>();
  const { habits, addHabit, updateHabit } = useHabitStore();
  const editing = id ? habits.find((h) => h.id === id) : null;

  const [name, setName] = useState(editing?.name ?? '');
  const [icon, setIcon] = useState(editing?.emoji ?? 'barbell-outline');
  const [color, setColor] = useState(editing?.color ?? '#22c55e');
  const [frequency, setFrequency] = useState<'daily' | number[]>(
    editing?.frequency ?? 'daily'
  );
  const [reminder, setReminder] = useState(editing?.reminderTime ?? '');
  const [showIcons, setShowIcons] = useState(false);

  const isEditing = !!editing;
  const days = t('days.short', { returnObjects: true }) as string[];

  const isDayOn = (d: number) =>
    frequency === 'daily' || (frequency as number[]).includes(d);

  const toggleDay = (d: number) => {
    if (frequency === 'daily') {
      setFrequency([d]);
      return;
    }
    const arr = frequency as number[];
    const next = arr.includes(d) ? arr.filter((x) => x !== d) : [...arr, d].sort();
    setFrequency(next.length === 0 ? 'daily' : next);
  };

  const handleSave = async () => {
    if (!name.trim()) {
      Alert.alert(t('habit.alerts.missingName'), t('habit.alerts.missingNameMsg'));
      return;
    }

    if (reminder) {
      const { status } = await Notifications.requestPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(t('habit.alerts.notificationsOff'), t('habit.alerts.notificationsOffMsg'));
      }
    }

    const data = {
      name: name.trim(),
      emoji: icon,
      color,
      frequency,
      reminderTime: reminder.trim() || undefined,
    };

    if (isEditing) {
      updateHabit(editing.id, data);
    } else {
      addHabit(data);
    }

    router.back();
  };

  return (
    <>
      <Stack.Screen options={{ title: isEditing ? t('habit.editTitle') : t('habit.newTitle') }} />

      <ScrollView
        style={{ flex: 1, backgroundColor: '#09090b' }}
        contentContainerStyle={{ paddingBottom: 48 }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Icon preview */}
        <Pressable
          onPress={() => setShowIcons((v) => !v)}
          style={{
            alignItems: 'center',
            paddingVertical: 36,
            backgroundColor: color + '18',
          }}
        >
          <View
            style={{
              width: 80,
              height: 80,
              borderRadius: 40,
              backgroundColor: color + '30',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: 12,
            }}
          >
            <HabitIcon name={icon} size={40} color={color} />
          </View>
          <Text style={{ color: '#52525b', fontSize: 12, marginTop: 4 }}>
            {t('habit.tapToChangeEmoji')}
          </Text>
        </Pressable>

        {/* Icon picker */}
        {showIcons && (
          <View
            style={{
              backgroundColor: '#18181b',
              marginHorizontal: 20,
              borderRadius: 16,
              padding: 16,
              marginTop: 12,
              flexDirection: 'row',
              flexWrap: 'wrap',
              gap: 8,
            }}
          >
            {ICONS.map((ic) => (
              <Pressable
                key={ic}
                onPress={() => { setIcon(ic); setShowIcons(false); }}
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: 12,
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: icon === ic ? color + '40' : '#27272a',
                  borderWidth: icon === ic ? 2 : 0,
                  borderColor: color,
                }}
              >
                <Ionicons name={ic as any} size={26} color={icon === ic ? color : '#71717a'} />
              </Pressable>
            ))}
          </View>
        )}

        {/* Name */}
        <View style={{ marginHorizontal: 20, marginTop: 20 }}>
          <Label>{t('habit.name')}</Label>
          <TextInput
            value={name}
            onChangeText={setName}
            placeholder={t('habit.namePlaceholder')}
            placeholderTextColor="#52525b"
            autoFocus={!isEditing}
            style={{
              backgroundColor: '#18181b',
              color: '#fff',
              borderRadius: 14,
              paddingHorizontal: 16,
              paddingVertical: 14,
              fontSize: 16,
            }}
          />
        </View>

        {/* Color */}
        <View style={{ marginHorizontal: 20, marginTop: 20 }}>
          <Label>{t('habit.color')}</Label>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10 }}>
            {COLORS.map((c) => (
              <Pressable
                key={c}
                onPress={() => setColor(c)}
                style={{
                  width: 38,
                  height: 38,
                  borderRadius: 19,
                  backgroundColor: c,
                  borderWidth: color === c ? 3 : 0,
                  borderColor: '#fff',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {color === c && (
                  <Ionicons name="checkmark" size={18} color="#fff" />
                )}
              </Pressable>
            ))}
          </View>
        </View>

        {/* Frequency */}
        <View style={{ marginHorizontal: 20, marginTop: 20 }}>
          <Label>{t('habit.frequency')}</Label>
          <View style={{ backgroundColor: '#18181b', borderRadius: 14, overflow: 'hidden' }}>
            <Pressable
              onPress={() => setFrequency('daily')}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingHorizontal: 16,
                paddingVertical: 14,
                backgroundColor: frequency === 'daily' ? '#27272a' : 'transparent',
              }}
            >
              <Text style={{ color: '#fff', fontSize: 15 }}>{t('habit.everyDay')}</Text>
              {frequency === 'daily' && (
                <Ionicons name="checkmark" size={18} color="#22c55e" />
              )}
            </Pressable>

            <View style={{ height: 1, backgroundColor: '#27272a' }} />

            <View style={{ padding: 16 }}>
              <Text style={{ color: '#71717a', fontSize: 12, marginBottom: 10 }}>
                {t('habit.specificDays')}
              </Text>
              <View style={{ flexDirection: 'row', gap: 6 }}>
                {days.map((day, i) => {
                  const on = frequency !== 'daily' && isDayOn(i);
                  return (
                    <Pressable
                      key={i}
                      onPress={() => toggleDay(i)}
                      style={{
                        flex: 1,
                        aspectRatio: 1,
                        borderRadius: 8,
                        backgroundColor: on ? color : '#27272a',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <Text style={{ color: on ? '#fff' : '#71717a', fontSize: 12, fontWeight: '600' }}>
                        {day[0]}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
            </View>
          </View>
        </View>

        {/* Reminder */}
        <View style={{ marginHorizontal: 20, marginTop: 20, marginBottom: 28 }}>
          <Label>{t('habit.reminder')}</Label>
          <TextInput
            value={reminder}
            onChangeText={setReminder}
            placeholder={t('habit.reminderPlaceholder')}
            placeholderTextColor="#52525b"
            keyboardType="numeric"
            maxLength={5}
            style={{
              backgroundColor: '#18181b',
              color: '#fff',
              borderRadius: 14,
              paddingHorizontal: 16,
              paddingVertical: 14,
              fontSize: 16,
            }}
          />
        </View>

        {/* Save */}
        <Pressable
          onPress={handleSave}
          style={{
            marginHorizontal: 20,
            paddingVertical: 16,
            borderRadius: 16,
            alignItems: 'center',
            backgroundColor: color,
          }}
        >
          <Text style={{ color: '#fff', fontWeight: '700', fontSize: 16 }}>
            {isEditing ? t('habit.save') : t('habit.create')}
          </Text>
        </Pressable>

        <Pressable
          onPress={() => router.back()}
          style={{ marginTop: 12, paddingVertical: 14, alignItems: 'center' }}
        >
          <Text style={{ color: '#52525b', fontSize: 15 }}>{t('habit.cancel')}</Text>
        </Pressable>
      </ScrollView>
    </>
  );
}

function Label({ children }: { children: string }) {
  return (
    <Text
      style={{
        color: '#71717a',
        fontSize: 11,
        fontWeight: '600',
        letterSpacing: 0.8,
        marginBottom: 8,
      }}
    >
      {children}
    </Text>
  );
}
