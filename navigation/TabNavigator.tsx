import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import DashboardScreen from '../screens/student/DashboardScreen';
import { View, Text } from 'react-native';
import ProfileScreen from '../screens/shared/ProfileScreen';
import AttendanceScreen from '../screens/student/AttendanceScreen';
import LessonsScreen from '../screens/student/LessonsScreen';
import NotificationsScreen from '../screens/student/NotificationsScreen';
import MyClassesScreen from '../screens/student/MyClassesScreen';

const Tab = createBottomTabNavigator();

function PlaceholderScreen({ name }: { name: string }) {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>{name} Screen (Coming Soon)</Text>
    </View>
  );
}

export default function TabNavigator() {
  return (
    <Tab.Navigator initialRouteName="Dashboard">
      <Tab.Screen name="Dashboard" component={DashboardScreen} />
      <Tab.Screen name="Admin" children={() => <PlaceholderScreen name="Admin" />} />
      <Tab.Screen name="Students" children={() => <PlaceholderScreen name="Students" />} />
      <Tab.Screen name="Notifications" component={NotificationsScreen} />
      <Tab.Screen name="My Classes" component={MyClassesScreen} />
      <Tab.Screen name="Attendance" component={AttendanceScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
      <Tab.Screen name="Lessons" component={LessonsScreen} />
    </Tab.Navigator>
  );
} 