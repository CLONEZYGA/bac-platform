import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { theme } from '../../constants/theme';
import { NavigationButtons } from '../../components/NavigationButtons';

// Mock attendance data
const attendanceData = [5, 7, 8, 6, 9, 10, 8, 7, 9, 10, 11, 12];

export default function AttendanceScreen() {
  const max = Math.max(...attendanceData);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Attendance Analysis</Text>
      <View style={styles.chartContainer}>
        <View style={styles.chart}>
          {attendanceData.map((value, idx) => (
            <View key={idx} style={styles.barWrapper}>
              <View
                style={[
                  styles.bar,
                  { height: `${(value / max) * 100}%` },
                ]}
              />
            </View>
          ))}
        </View>
      </View>
      
      <NavigationButtons 
        backLabel="Lessons"
        forwardLabel="Profile"
        onForwardPress={() => {
          // Navigate to Profile screen
          console.log('Navigating to Profile...');
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    alignItems: 'center',
    paddingTop: 48,
  },
  title: {
    fontSize: theme.typography.fontSize.xl,
    fontFamily: theme.typography.fontFamily.bold,
    color: theme.colors.text,
    marginBottom: 24,
  },
  chartContainer: {
    width: '90%',
    height: 220,
    backgroundColor: '#F4F8FF',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  chart: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    height: '100%',
    width: '100%',
    justifyContent: 'space-between',
  },
  barWrapper: {
    flex: 1,
    alignItems: 'center',
    marginHorizontal: 2,
    height: '100%',
    justifyContent: 'flex-end',
  },
  bar: {
    width: 16,
    backgroundColor: theme.colors.primary,
    borderRadius: 6,
  },
}); 