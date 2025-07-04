import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { theme } from '../../constants/theme';
import { useUser } from '../../context/UserContext';
import { NavigationButtons } from '../../components/NavigationButtons';

export default function ProfileScreen() {
  const { user, setUser, useMock, setUseMock } = useUser();

  return (
    <View style={styles.container}>
      {/* Data Mode Toggle */}
      <View style={styles.toggleContainer}>
        <TouchableOpacity
          style={[styles.toggleButton, useMock && styles.toggleActive]}
          onPress={() => setUseMock(true)}
        >
          <Text style={styles.toggleText}>Mock Data</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.toggleButton, !useMock && styles.toggleActive]}
          onPress={() => setUseMock(false)}
        >
          <Text style={styles.toggleText}>Real Data</Text>
        </TouchableOpacity>
      </View>
      {/* User Switcher */}
      <View style={styles.switcherContainer}>
        <TouchableOpacity
          style={[styles.switcherButton, user.id === 'thuto' && styles.switcherActive]}
          onPress={() => setUser && setUser({ ...user, ...require('../../context/UserContext').users.thuto })}
        >
          <Text style={styles.switcherText}>Thuto Moleps</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.switcherButton, user.id === 'amy' && styles.switcherActive]}
          onPress={() => setUser && setUser({ ...user, ...require('../../context/UserContext').users.amy })}
        >
          <Text style={styles.switcherText}>Amy Mosdada</Text>
        </TouchableOpacity>
      </View>
      <Text style={styles.userIdText}>Current User: {user.id}</Text>
      <View style={styles.avatarContainer}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{user.initials}</Text>
        </View>
        <Text style={styles.name}>{user.name}</Text>
        <Text style={styles.program}>{user.program}</Text>
        <Text style={styles.group}>{user.group}</Text>
      </View>
      <View style={styles.menu}>
        <TouchableOpacity style={styles.menuItem}>
          <Text style={styles.menuText}>Registered</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuItem}>
          <Text style={styles.menuText}>Applications</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuItem}>
          <Text style={styles.menuText}>My Profile</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuItem}>
          <Text style={styles.menuText}>Attendance</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuItem}>
          <Text style={[styles.menuText, { color: theme.colors.error }]}>Logout</Text>
        </TouchableOpacity>
      </View>
      
      <NavigationButtons 
        showForward={false}
        backLabel="Attendance"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    alignItems: 'center',
    paddingTop: 16,
  },
  toggleContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 8,
    gap: 8,
  },
  toggleButton: {
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 8,
    backgroundColor: '#E0E6F0',
    marginHorizontal: 4,
  },
  toggleActive: {
    backgroundColor: theme.colors.primary,
  },
  toggleText: {
    color: theme.colors.text,
    fontWeight: 'bold',
  },
  switcherContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 8,
    gap: 8,
  },
  switcherButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: '#E0E6F0',
    marginHorizontal: 4,
  },
  switcherActive: {
    backgroundColor: theme.colors.primary,
  },
  switcherText: {
    color: theme.colors.text,
    fontWeight: 'bold',
  },
  userIdText: {
    color: theme.colors.textSecondary,
    fontSize: 12,
    marginBottom: 4,
  },
  avatarContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: theme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  avatarText: {
    color: '#fff',
    fontSize: 32,
    fontWeight: 'bold',
  },
  name: {
    fontSize: theme.typography.fontSize.xl,
    fontFamily: theme.typography.fontFamily.bold,
    color: theme.colors.text,
    marginBottom: 4,
  },
  program: {
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.textSecondary,
    textAlign: 'center',
  },
  group: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.textSecondary,
    marginTop: 2,
    textAlign: 'center',
  },
  menu: {
    width: '90%',
    backgroundColor: '#F4F8FF',
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  menuItem: {
    paddingVertical: 16,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E6F0',
  },
  menuText: {
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.text,
  },
}); 