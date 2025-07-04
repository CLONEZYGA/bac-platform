import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AuthProvider, useAuth } from './context/AuthContext';
import { theme } from './constants/theme';
import TabNavigator from './navigation/TabNavigator';
import { UserProvider } from './context/UserContext';

// Import screens (we'll create these next)
import LoginScreen, { LoginForm } from './screens/shared/LoginScreen';
import RegisterScreen from './screens/shared/RegisterScreen';
import StudentDashboardScreen from './screens/student/DashboardScreen';
import AdminDashboardScreen from './screens/admin/DashboardScreen';

const Stack = createNativeStackNavigator();

// Navigation component that handles auth state
const Navigation = () => {
    const { user, loading } = useAuth();

    if (loading) {
        // TODO: Add a proper loading screen
        return null;
    }

    return (
        <Stack.Navigator
            screenOptions={{
                headerStyle: {
                    backgroundColor: theme.colors.primary,
                },
                headerTintColor: '#fff',
                headerTitleStyle: {
                    fontFamily: theme.typography.fontFamily.medium,
                },
            }}
        >
            {!user ? (
                // Auth screens
                <>
                    <Stack.Screen 
                        name="Login" 
                        component={LoginScreen}
                        options={{ headerShown: false }}
                    />
                    <Stack.Screen 
                        name="LoginForm" 
                        component={LoginForm}
                        options={{ headerShown: false }}
                    />
                    <Stack.Screen 
                        name="Register" 
                        component={RegisterScreen}
                        options={{ headerShown: false }}
                    />
                </>
            ) : (
                // Main app screens (tab navigator)
                <Stack.Screen 
                    name="Main" 
                    component={TabNavigator}
                    options={{ headerShown: false }}
                />
            )}
        </Stack.Navigator>
    );
};

export default function App() {
    return (
        <SafeAreaProvider>
            <AuthProvider>
                <UserProvider>
                    <NavigationContainer>
                        <Navigation />
                        <StatusBar style="light" />
                    </NavigationContainer>
                </UserProvider>
            </AuthProvider>
        </SafeAreaProvider>
    );
}
