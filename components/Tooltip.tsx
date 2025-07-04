import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal } from 'react-native';
import { theme } from '../constants/theme';

interface TooltipProps {
  text: string;
}

export const Tooltip: React.FC<TooltipProps> = ({ text }) => {
  const [visible, setVisible] = useState(false);
  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => setVisible(true)}>
        <Text style={styles.icon}>ℹ️</Text>
      </TouchableOpacity>
      <Modal
        transparent
        visible={visible}
        animationType="fade"
        onRequestClose={() => setVisible(false)}
      >
        <TouchableOpacity style={styles.overlay} onPress={() => setVisible(false)}>
          <View style={styles.tooltipBox}>
            <Text style={styles.tooltipText}>{text}</Text>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginLeft: theme.spacing.xs,
  },
  icon: {
    fontSize: theme.typography.fontSize.md,
  },
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.2)',
  },
  tooltipBox: {
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    maxWidth: 250,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  tooltipText: {
    color: theme.colors.text,
    fontSize: theme.typography.fontSize.sm,
  },
}); 