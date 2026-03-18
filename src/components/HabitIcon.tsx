import React from 'react';
import { Ionicons } from '@expo/vector-icons';

interface Props {
  name: string;
  size: number;
  color?: string;
}

const DEFAULT = 'star-outline';

/** Checks if the string is a valid Ionicons name (e.g. "barbell-outline") */
function isIconName(str: string): boolean {
  return typeof str === 'string' && /^[a-z][a-z0-9-]*$/.test(str);
}

export function HabitIcon({ name, size, color = '#fff' }: Props) {
  const icon = isIconName(name) ? name : DEFAULT;
  return <Ionicons name={icon as any} size={size} color={color} />;
}
