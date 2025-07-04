import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { theme } from '../constants/theme';

interface ToastProps {
  message: string;
  visible: boolean;
  onHide: () => void;
}

export const Toast: React.FC<ToastProps> = ({ message, visible, onHide }) => {
  const opacity = React.useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.timing(opacity, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }).start();
      const timer = setTimeout(() => {
        Animated.timing(opacity, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }).start(() => onHide());
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [visible]);

  if (!visible) return null;
  return (
    <Animated.View style={[styles.toast, { opacity }]}> 
      <Text style={styles.text}>{message}</Text>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  toast: {
    position: 'absolute',
    bottom: 48,
    left: 24,
    right: 24,
    backgroundColor: theme.colors.primary,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    alignItems: 'center',
    zIndex: 1000,
    ...theme.shadows.medium,
  },
  text: {
    color: '#fff',
    fontSize: theme.typography.fontSize.md,
    fontFamily: theme.typography.fontFamily.medium,
  },
}); 