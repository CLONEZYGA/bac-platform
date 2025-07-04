import React from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { theme } from '../constants/theme';

interface NavigationButtonsProps {
  showBack?: boolean;
  showForward?: boolean;
  onBackPress?: () => void;
  onForwardPress?: () => void;
  backLabel?: string;
  forwardLabel?: string;
  style?: any;
}

export const NavigationButtons: React.FC<NavigationButtonsProps> = ({
  showBack = true,
  showForward = true,
  onBackPress,
  onForwardPress,
  backLabel = 'Back',
  forwardLabel = 'Next',
  style,
}) => {
  const navigation = useNavigation();

  const handleBackPress = () => {
    if (onBackPress) {
      onBackPress();
    } else {
      navigation.goBack();
    }
  };

  const handleForwardPress = () => {
    if (onForwardPress) {
      onForwardPress();
    }
  };

  return (
    <View style={[styles.container, style]}>
      {showBack && (
        <TouchableOpacity
          style={[styles.button, styles.backButton]}
          onPress={handleBackPress}
          activeOpacity={0.7}
        >
          <Text style={[styles.buttonText, styles.backButtonText]}>
            ← {backLabel}
          </Text>
        </TouchableOpacity>
      )}
      
      {showForward && (
        <TouchableOpacity
          style={[styles.button, styles.forwardButton]}
          onPress={handleForwardPress}
          activeOpacity={0.7}
        >
          <Text style={[styles.buttonText, styles.forwardButtonText]}>
            {forwardLabel} →
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    backgroundColor: theme.colors.surface,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },
  button: {
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    minWidth: 100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backButton: {
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  forwardButton: {
    backgroundColor: theme.colors.primary,
  },
  buttonText: {
    fontSize: theme.typography.fontSize.md,
    fontFamily: theme.typography.fontFamily.medium,
  },
  backButtonText: {
    color: theme.colors.text,
  },
  forwardButtonText: {
    color: '#FFFFFF',
  },
}); 