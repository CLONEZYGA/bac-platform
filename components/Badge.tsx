import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { theme } from '../constants/theme';

interface BadgeProps {
  color: string;
  label: string;
}

export const Badge: React.FC<BadgeProps> = ({ color, label }) => (
  <View style={[styles.badge, { backgroundColor: color }]}> 
    <Text style={styles.label}>{label}</Text>
  </View>
);

const styles = StyleSheet.create({
  badge: {
    borderRadius: theme.borderRadius.round,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.xs,
    alignSelf: 'flex-start',
    marginRight: theme.spacing.sm,
  },
  label: {
    color: '#fff',
    fontSize: theme.typography.fontSize.sm,
    fontFamily: theme.typography.fontFamily.medium,
  },
}); 