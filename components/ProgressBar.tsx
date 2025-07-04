import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { theme } from '../constants/theme';

interface ProgressBarProps {
  percent: number;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ percent }) => (
  <View style={styles.container}>
    <View style={styles.barBackground}>
      <View style={[styles.barFill, { width: `${percent}%` }]} />
    </View>
    <Text style={styles.label}>{percent}% Complete</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    marginVertical: theme.spacing.md,
  },
  barBackground: {
    height: 16,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.md,
    overflow: 'hidden',
  },
  barFill: {
    height: 16,
    backgroundColor: theme.colors.primary,
    borderRadius: theme.borderRadius.md,
  },
  label: {
    marginTop: theme.spacing.xs,
    color: theme.colors.text,
    fontSize: theme.typography.fontSize.sm,
    fontFamily: theme.typography.fontFamily.medium,
    textAlign: 'center',
  },
}); 