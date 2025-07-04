import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { theme } from '../../constants/theme';
import { useUser } from '../../context/UserContext';
import { NavigationButtons } from '../../components/NavigationButtons';

export default function MyClassesScreen() {
  const { user } = useUser();
  const classes = user.classes || [];
  
  return (
    <View style={styles.container}>
      <Text style={styles.title}>My Classes</Text>
      <FlatList
        data={classes}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={styles.classCard}>
            <Text style={styles.subject}>{item.subject}</Text>
            <Text style={styles.instructor}>{item.instructor}</Text>
            <Text style={styles.time}>{item.time}</Text>
          </View>
        )}
        ListEmptyComponent={<Text style={styles.noClasses}>No classes found.</Text>}
        style={{ width: '100%' }}
        contentContainerStyle={{ alignItems: 'center', paddingBottom: 100 }}
      />
      
      <NavigationButtons 
        backLabel="Dashboard"
        forwardLabel="Lessons"
        onForwardPress={() => {
          // Navigate to Lessons screen
          console.log('Navigating to Lessons...');
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
  classCard: {
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
  },
  subject: {
    fontSize: theme.typography.fontSize.lg,
    color: theme.colors.primary,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  instructor: {
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.text,
    marginBottom: 4,
  },
  time: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.textSecondary,
  },
  noClasses: {
    color: theme.colors.textSecondary,
    marginTop: 24,
  },
}); 