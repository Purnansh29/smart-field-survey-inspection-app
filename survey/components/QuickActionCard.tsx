import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AppColors, AppShadows } from '@/constants/theme';

type QuickActionCardProps = {
  title: string;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
  onPress: () => void;
};

export default function QuickActionCard({ title, icon, color, onPress }: QuickActionCardProps) {
  return (
    <Pressable
      style={({ pressed }) => [styles.card, pressed && styles.pressed]}
      onPress={onPress}
    >
      <View style={[styles.iconCircle, { borderColor: color + '40' }]}>
        <Ionicons name={icon} size={24} color={color} />
      </View>
      <Text style={styles.title}>{title}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: AppColors.white,
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 8,
    alignItems: 'center',
    justifyContent: 'center',
    ...AppShadows.sm,
    borderWidth: 1,
    borderColor: 'transparent',
    minHeight: 100,
  },
  pressed: {
    opacity: 0.8,
    transform: [{ scale: 0.96 }],
  },
  iconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  title: {
    fontSize: 12,
    fontWeight: '600',
    color: AppColors.gray700,
    textAlign: 'center',
  },
});
