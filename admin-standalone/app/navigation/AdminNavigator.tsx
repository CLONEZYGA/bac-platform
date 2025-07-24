import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import AdminDashboardScreen from '../screens/DashboardScreen';
import ApplicationsScreen from '../screens/ApplicationsScreen';

const Tab = createBottomTabNavigator();

export default function AdminNavigator() {
  return (
    <Tab.Navigator initialRouteName="Admin Dashboard">
      <Tab.Screen name="Admin Dashboard" component={AdminDashboardScreen} />
      <Tab.Screen name="Applications" component={ApplicationsScreen} />
      {/* Add more admin screens here as needed */}
    </Tab.Navigator>
  );
} 