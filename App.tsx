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
import LearnMoreScreen from './screens/shared/LearnMoreScreen';
import TermsAndPrivacyScreen from './screens/shared/TermsAndPrivacyScreen';
import StudentDashboardScreen from './screens/student/DashboardScreen';
import AdminDashboardScreen from './screens/admin/DashboardScreen';
import StudentNavigator from './navigation/StudentNavigator';
// import AdminNavigator from './navigation/AdminNavigator'; // REMOVED

const Stack = createNativeStackNavigator();

// Navigation component that handles auth state
const Navigation = () => {
    const { user, loading } = useAuth();

    if (loading) {
        // TODO: Add a proper loading screen
        return null;
    }

    if (!user) {
        // Auth screens
        return (
            <Stack.Navigator screenOptions={{ headerShown: false }}>
                <Stack.Screen name="Login" component={LoginScreen} />
                <Stack.Screen name="LoginForm" component={LoginForm} />
                <Stack.Screen name="Register" component={RegisterScreen} />
                <Stack.Screen name="LearnMore" component={LearnMoreScreen} />
                <Stack.Screen name="TermsAndPrivacy" component={TermsAndPrivacyScreen} />
            </Stack.Navigator>
        );
    }
    if (user.role === 'admin') {
        return <Text>Admins must use the admin portal.</Text>;
    }
    // Default: student
    return <StudentNavigator />;
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
