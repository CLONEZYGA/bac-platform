import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { theme } from '../../constants/theme';
import { useUser } from '../../context/UserContext';
import { NavigationButtons } from '../../components/NavigationButtons';

export default function NotificationsScreen() {
  const { user } = useUser();
  const notifications = user.notifications || [];
  
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Notifications</Text>
      <FlatList
        data={notifications}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={styles.notificationCard}>
            <Text style={styles.notificationTitle}>{item.title}</Text>
            <Text style={styles.notificationDescription}>{item.description}</Text>
            <Text style={styles.notificationDate}>{item.date}</Text>
          </View>
        )}
        ListEmptyComponent={<Text style={styles.noNotifications}>No notifications.</Text>}
        style={{ width: '100%' }}
        contentContainerStyle={{ alignItems: 'center', paddingBottom: 100 }}
      />
      
      <NavigationButtons 
        backLabel="Dashboard"
        forwardLabel="My Classes"
        onForwardPress={() => {
          // Navigate to My Classes screen
          console.log('Navigating to My Classes...');
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
  notificationCard: {
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
  notificationTitle: {
    fontSize: theme.typography.fontSize.lg,
    color: theme.colors.primary,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  notificationDescription: {
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.text,
    marginBottom: 4,
  },
  notificationDate: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.textSecondary,
    textAlign: 'right',
  },
  noNotifications: {
    color: theme.colors.textSecondary,
    marginTop: 24,
  },
}); 