import React, { useState } from 'react';
import { View, Text, StyleSheet, Picker, TouchableOpacity, FlatList } from 'react-native';
import { theme } from '../../constants/theme';
import { useUser } from '../../context/UserContext';
import { NavigationButtons } from '../../components/NavigationButtons';

export default function LessonsScreen() {
  const { user } = useUser();
  const lessons = user.lessons || [];
  const subjects = Array.from(new Set(lessons.map(l => l.name)));
  const weeks = Array.from(new Set(lessons.map(l => l.week)));
  const [selectedSubject, setSelectedSubject] = useState(subjects[0] || '');
  const [selectedWeek, setSelectedWeek] = useState(weeks[0] || '');

  const filteredLessons = lessons.filter(
    l => l.name === selectedSubject && l.week === selectedWeek
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Lessons</Text>
      <View style={styles.filters}>
        <Picker
          selectedValue={selectedSubject}
          style={styles.picker}
          onValueChange={setSelectedSubject}
        >
          {subjects.map(s => <Picker.Item key={s} label={s} value={s} />)}
        </Picker>
        <Picker
          selectedValue={selectedWeek}
          style={styles.picker}
          onValueChange={setSelectedWeek}
        >
          {weeks.map(w => <Picker.Item key={w} label={w} value={w} />)}
        </Picker>
        <TouchableOpacity style={styles.applyButton}>
          <Text style={styles.applyButtonText}>Apply</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={filteredLessons}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={styles.lessonCard}>
            <Text style={styles.lessonName}>{item.name}</Text>
            <Text style={styles.lessonWeek}>{item.week}</Text>
          </View>
        )}
        ListEmptyComponent={<Text style={styles.noLessons}>No lessons found.</Text>}
        style={{ width: '100%' }}
        contentContainerStyle={{ alignItems: 'center', paddingBottom: 100 }}
      />
      
      <NavigationButtons 
        backLabel="My Classes"
        forwardLabel="Attendance"
        onForwardPress={() => {
          // Navigate to Attendance screen
          console.log('Navigating to Attendance...');
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
  filters: {
    width: '90%',
    backgroundColor: '#F4F8FF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
  },
  picker: {
    width: '100%',
    marginBottom: 12,
    backgroundColor: '#fff',
    borderRadius: 8,
  },
  applyButton: {
    backgroundColor: theme.colors.primary,
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: 'center',
    marginTop: 8,
  },
  applyButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: theme.typography.fontSize.md,
  },
  lessonCard: {
    width: '90%',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    alignItems: 'center',
  },
  lessonName: {
    fontSize: theme.typography.fontSize.lg,
    color: theme.colors.text,
    fontWeight: 'bold',
  },
  lessonWeek: {
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.textSecondary,
  },
  noLessons: {
    color: theme.colors.textSecondary,
    marginTop: 24,
  },
}); 