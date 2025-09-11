import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ViewStyle,
} from 'react-native';
import { theme } from '@/constants/theme';

export interface FloatingActionButtonProps {
  onPress: () => void;
  icon?: string;
  size?: 'sm' | 'md' | 'lg';
  position?: 'bottom-right' | 'bottom-left' | 'bottom-center';
  color?: string;
  disabled?: boolean;
  style?: ViewStyle;
  testID?: string;
}

export const FloatingActionButton: React.FC<FloatingActionButtonProps> = ({
  onPress,
  icon = '+',
  size = 'md',
  position = 'bottom-right',
  color = theme.colors.primary,
  disabled = false,
  style,
  testID,
}) => {
  const buttonStyle = [
    styles.base,
    styles[size],
    styles[position],
    { backgroundColor: color },
    disabled && styles.disabled,
    style,
  ];

  const textStyle = [
    styles.icon,
    styles[`${size}Icon`],
    disabled && styles.disabledIcon,
  ];

  return (
    <TouchableOpacity
      style={buttonStyle}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.8}
      testID={testID}
    >
      <Text style={textStyle}>{icon}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  base: {
    position: 'absolute',
    borderRadius: theme.borderRadius.full,
    alignItems: 'center',
    justifyContent: 'center',
    ...theme.shadows.lg,
  },
  
  // Sizes
  sm: {
    width: 48,
    height: 48,
  },
  md: {
    width: 56,
    height: 56,
  },
  lg: {
    width: 64,
    height: 64,
  },
  
  // Positions
  'bottom-right': {
    bottom: theme.spacing.xl,
    right: theme.spacing.xl,
  },
  'bottom-left': {
    bottom: theme.spacing.xl,
    left: theme.spacing.xl,
  },
  'bottom-center': {
    bottom: theme.spacing.xl,
    alignSelf: 'center',
  },
  
  // States
  disabled: {
    opacity: 0.5,
  },
  
  // Icon styles
  icon: {
    color: theme.colors.white,
    fontWeight: theme.typography.bold,
  },
  smIcon: {
    fontSize: theme.typography.lg,
  },
  mdIcon: {
    fontSize: theme.typography.xl,
  },
  lgIcon: {
    fontSize: theme.typography['2xl'],
  },
  disabledIcon: {
    opacity: 0.7,
  },
});
