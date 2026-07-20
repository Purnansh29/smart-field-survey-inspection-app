import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AppColors, AppShadows } from '@/constants/theme';

type HeroSectionProps = {
  name: string;
  date: string;
  progressPercent: number;
};

export default function HeroSection({ name, date, progressPercent }: HeroSectionProps) {
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

  return (
    <View style={styles.container}>
      {/* Greeting Row */}
      <View style={styles.greetingHeader}>
        <View>
          <Text style={styles.greetingText}>👋 {getGreeting()},</Text>
          <Text style={styles.nameText}>{name}</Text>
          <Text style={styles.subtitleText}>Ready for today's inspections?</Text>
        </View>
        <View style={styles.dateBadge}>
          <Ionicons name="calendar-outline" size={14} color={AppColors.primary} />
          <Text style={styles.dateText}>{date}</Text>
        </View>
      </View>

      {/* Progress Card */}
      <View style={styles.progressCard}>
        <View style={styles.progressLeft}>
          <Text style={styles.progressLabel}>Today's Progress</Text>
          <View style={styles.progressCircleContainer}>
            <View style={[styles.progressCircle, { borderTopColor: AppColors.primary, borderRightColor: AppColors.primary, borderBottomColor: AppColors.primary }]} />
            <View style={styles.progressInnerCircle}>
              <Text style={styles.progressPercent}>{progressPercent}%</Text>
            </View>
          </View>
        </View>

        <View style={styles.progressRight}>
          <View style={styles.trendRow}>
            <Ionicons name="trending-up-outline" size={16} color={AppColors.primary} />
            <Text style={styles.trendText}>On Track</Text>
          </View>
          <Text style={styles.trendSubtitle}>You're doing great!</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingTop: 24,
    paddingBottom: 16,
  },
  greetingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 24,
  },
  greetingText: {
    fontSize: 16,
    color: AppColors.gray500,
    fontWeight: '500',
    marginBottom: 4,
  },
  nameText: {
    fontSize: 28,
    fontWeight: '800',
    color: AppColors.gray900,
    letterSpacing: -0.5,
    marginBottom: 4,
  },
  subtitleText: {
    fontSize: 14,
    color: AppColors.gray500,
  },
  dateBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: AppColors.primary + '15',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 6,
  },
  dateText: {
    fontSize: 12,
    fontWeight: '600',
    color: AppColors.primary,
  },
  progressCard: {
    backgroundColor: AppColors.white,
    borderRadius: 20,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    ...AppShadows.md,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  progressLeft: {
    flex: 1,
    alignItems: 'center',
    borderRightWidth: 1,
    borderRightColor: AppColors.gray100,
    paddingRight: 20,
  },
  progressLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: AppColors.gray800,
    marginBottom: 12,
    alignSelf: 'flex-start',
  },
  progressCircleContainer: {
    width: 80,
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressCircle: {
    position: 'absolute',
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 6,
    borderColor: AppColors.gray200,
    transform: [{ rotate: '45deg' }],
  },
  progressInnerCircle: {
    width: 60,
    height: 60,
    backgroundColor: AppColors.white,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressPercent: {
    fontSize: 22,
    fontWeight: '800',
    color: AppColors.gray900,
  },
  progressRight: {
    flex: 1,
    paddingLeft: 20,
    justifyContent: 'center',
  },
  trendRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 6,
  },
  trendText: {
    fontSize: 16,
    fontWeight: '700',
    color: AppColors.primary,
  },
  trendSubtitle: {
    fontSize: 13,
    color: AppColors.gray500,
  },
});
