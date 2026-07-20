import { Platform } from 'react-native';

const tintColorLight = '#0F766E'; // Teal-700
const tintColorDark = '#5EEAD4'; // Teal-300

export const AppColors = {
  primary: '#0F766E', // Deep Teal
  primaryLight: '#0D9488',
  primaryDark: '#115E59',
  secondary: '#3B82F6', // Blue as secondary
  secondaryLight: '#60A5FA',
  accent: '#F59E0B', // Amber
  danger: '#EF4444',
  dangerLight: '#FCA5A5',
  warning: '#F97316',
  success: '#10B981', // Emerald
  white: '#FFFFFF',
  black: '#000000',
  gray50: '#F8FAFC',
  gray100: '#F1F5F9',
  gray200: '#E2E8F0',
  gray300: '#CBD5E1',
  gray400: '#94A3B8',
  gray500: '#64748B',
  gray600: '#475569',
  gray700: '#334155',
  gray800: '#1E293B',
  gray900: '#0F172A',
  priorityHigh: '#EF4444',
  priorityMedium: '#F59E0B',
  priorityLow: '#10B981',
};

export const AppShadows = {
  sm: {
    shadowColor: AppColors.gray900,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  md: {
    shadowColor: AppColors.gray900,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  lg: {
    shadowColor: AppColors.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 8,
  },
};

export const Colors = {
  light: {
    text: '#0F172A',
    background: '#F8FAFC',
    tint: tintColorLight,
    icon: '#64748B',
    tabIconDefault: '#94A3B8',
    tabIconSelected: tintColorLight,
    card: '#FFFFFF',
    cardBorder: '#E2E8F0',
    textSecondary: '#475569',
    textMuted: '#94A3B8',
  },
  dark: {
    text: '#F8FAFC',
    background: '#0F172A',
    tint: tintColorDark,
    icon: '#94A3B8',
    tabIconDefault: '#64748B',
    tabIconSelected: tintColorDark,
    card: '#1E293B',
    cardBorder: '#334155',
    textSecondary: '#94A3B8',
    textMuted: '#64748B',
  },
};

export const Fonts = Platform.select({
  ios: {
    sans: 'system-ui',
    serif: 'ui-serif',
    rounded: 'ui-rounded',
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded: "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});
