import React from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { AppColors } from '@/constants/theme';

export default function MenuScreen() {
  const router = useRouter();

  const items = [
    { label: 'Dashboard', icon: 'home-outline', route: '/(tabs)/index' },
    { label: 'New Survey', icon: 'add-circle-outline', route: '/(tabs)/new-survey' },
    { label: 'History', icon: 'time-outline', route: '/(tabs)/history' },
    { label: 'Profile', icon: 'person-outline', route: '/(tabs)/profile' },
    { label: 'Camera', icon: 'camera-outline', route: '/(tabs)/camera' },
    { label: 'Location', icon: 'location-outline', route: '/(tabs)/location' },
    { label: 'Clipboard', icon: 'clipboard-outline', route: '/(tabs)/clipboard' },
    { label: 'Explore', icon: 'compass-outline', route: '/(tabs)/explore' },
    { label: 'Contacts', icon: 'people-outline', route: '/(tabs)/contacts' },
  ];

  const handlePress = (route: string) => {
    router.push(route);
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title" style={styles.title}>
        Menu
      </ThemedText>
      {items.map((item) => (
        <Pressable key={item.label} onPress={() => handlePress(item.route)} style={styles.item}>
          <Ionicons name={item.icon} size={24} color={AppColors.gray900} />
          <ThemedText type="body" style={styles.label}>
            {item.label}
          </ThemedText>
        </Pressable>
      ))}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppColors.white,
    paddingTop: 60,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    marginBottom: 30,
    color: AppColors.gray900,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: AppColors.gray200,
  },
  label: {
    marginLeft: 12,
    fontSize: 16,
    color: AppColors.gray900,
  },
});
