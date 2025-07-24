import React, { useState } from 'react';
import {
    View,
    StyleSheet,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    Text,
    TouchableOpacity,
    Alert,
    TextInput,
    Image,
} from 'react-native';
import { useNavigation, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Button } from '../../components';
import { useAuth } from '../../context/AuthContext';
import { theme } from '../../constants/theme';
import axios from 'axios';
import TermsAndPrivacyScreen from './TermsAndPrivacyScreen';
import { getApiUrl, checkServerHealth } from '@/app/services/api.ts';
import NetInfo from '@react-native-community/netinfo';
import * as Device from 'expo-device';

const API_BASE = getApiUrl();

type RootStackParamList = {
    Login: undefined;
    Register: { hasAcceptedTerms?: boolean };
    TermsAndPrivacy: { section?: 'terms' | 'privacy' };
    Main: undefined;
};

type RegisterScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Register'>;

type RegisterScreenRouteProp = RouteProp<RootStackParamList, 'Register'>;

interface RegisterScreenProps {
    route: RegisterScreenRouteProp;
}

export default function RegisterScreen({ route }: RegisterScreenProps) {
    const navigation = useNavigation<RegisterScreenNavigationProp>();
    const { signUp } = useAuth();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [agree, setAgree] = useState(route.params?.hasAcceptedTerms || false);
    const [loading, setLoading] = useState(false);
    const [loadingProgress, setLoadingProgress] = useState(0);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const validate = () => {
        if (!name.trim() || !email || !password || !confirmPassword) {
            setError('All fields are required.');
            return false;
        }
        if (name.trim().length < 2) {
            setError('Please enter your full name.');
            return false;
        }
        if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
            setError('Please enter a valid email address.');
            return false;
        }
        if (password.length < 6) {
            setError('Password must be at least 6 characters.');
            return false;
        }
        if (password !== confirmPassword) {
            setError('Passwords do not match.');
            return false;
        }
        if (!agree) {
            setError('You must agree to the Terms and Privacy Policy.');
            return false;
        }
        setError('');
        return true;
    };

    const handleRegister = async () => {
        if (!validate()) return;
        
        setLoading(true);
        setLoadingProgress(0);
        setError('');
        
        // Debug information
        console.log('Registration Debug Info:', {
            apiUrl: API_BASE,
            platform: Platform.OS,
            isDevice: await Device.isDevice
        });

        let progressInterval: NodeJS.Timeout | null = null;
        
        try {
            // Check network connectivity
            const networkState = await NetInfo.fetch();
            console.log('Network State:', networkState);
            
            if (!networkState.isConnected) {
                throw new Error('No internet connection. Please check your network settings.');
            }

            // Check server health
            const isHealthy = await checkServerHealth();
            if (!isHealthy) {
                throw new Error('Unable to connect to server. Please try again later.');
            }
            
            // Start progress animation
            progressInterval = setInterval(() => {
                setLoadingProgress(prev => {
                    if (prev >= 90) return prev; // Stop at 90% until complete
                    return prev + 10;
                });
            }, 500);

            console.log('Starting registration process...');
            
            // Sign up the user
            await signUp(email, password, 'student', name);
            console.log('Registration successful');
            setSuccess(true);
            
            // Set progress to 100% on success
            setLoadingProgress(100);
            
            // The user will be automatically logged in since signUp sets the user in AuthContext
            setTimeout(() => {
                navigation.reset({
                    index: 0,
                    routes: [{ name: 'Main' }],
                });
            }, 500); // Short delay to show 100%
            
        } catch (error: any) {
            console.error('Registration error:', error);
            if (error?.response?.data?.message) {
                setError(error.response.data.message);
            } else if (error?.message) {
                setError(error.message);
            } else {
                setError('Registration failed. Please try again.');
            }
            setLoadingProgress(0);
        } finally {
            if (progressInterval) {
                clearInterval(progressInterval);
            }
            if (!success) {
                setLoading(false);
            }
        }
    };

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
            <ScrollView
                contentContainerStyle={styles.scrollContent}
                keyboardShouldPersistTaps="handled"
            >
                <View style={styles.content}>
                    <Image source={require('../../assets/bac-logo.png')} style={styles.logo} />
                    <Text style={styles.title}>Register</Text>
                    {error ? <Text style={styles.error}>{error}</Text> : null}
                    {success ? <Text style={styles.success}>Registration successful!</Text> : null}
                    <TextInput style={styles.input} placeholder="Full Name" value={name} onChangeText={setName} />
                    <TextInput style={styles.input} placeholder="Email" value={email} onChangeText={setEmail} autoCapitalize="none" keyboardType="email-address" />
                    <TextInput style={styles.input} placeholder="Password" value={password} onChangeText={setPassword} secureTextEntry />
                    <TextInput style={styles.input} placeholder="Confirm Password" value={confirmPassword} onChangeText={setConfirmPassword} secureTextEntry />
                    <View style={styles.checkboxRow}>
                        <TouchableOpacity onPress={() => setAgree((a: boolean) => !a)}>
                            <View style={[styles.checkbox, agree && styles.checkboxChecked]} />
                        </TouchableOpacity>
                        <Text style={styles.checkboxLabel}>I agree to the</Text>
                        <TouchableOpacity onPress={() => navigation.push('TermsAndPrivacy', { section: 'terms' })}>
                            <Text style={[styles.link, { marginHorizontal: 2 }]}>Terms</Text>
                        </TouchableOpacity>
                        <Text style={styles.checkboxLabel}>and</Text>
                        <TouchableOpacity onPress={() => navigation.push('TermsAndPrivacy', { section: 'privacy' })}>
                            <Text style={[styles.link, { marginLeft: 2 }]}>Privacy Policy</Text>
                        </TouchableOpacity>
                    </View>
                    <TouchableOpacity 
                        style={[styles.button, !agree && { opacity: 0.6 }]} 
                        onPress={handleRegister} 
                        disabled={loading || !agree}
                    >
                        <Text style={styles.buttonText}>
                            {loading ? `Registering ${loadingProgress}%` : 'Register'}
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => navigation.replace('Login')}>
                        <Text style={styles.link}>Back to Login</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.background,
    },
    scrollContent: {
        flexGrow: 1,
    },
    content: {
        flex: 1,
        padding: theme.spacing.xl,
        justifyContent: 'center',
        alignItems: 'center',
    },
    logo: {
        width: 80,
        height: 80,
        marginBottom: theme.spacing.lg,
    },
    title: {
        fontSize: theme.typography.fontSize.xxxl,
        fontFamily: theme.typography.fontFamily.bold,
        color: theme.colors.text,
        marginBottom: theme.spacing.xs,
    },
    input: {
        width: 220,
        padding: 12,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        marginBottom: theme.spacing.md,
        backgroundColor: '#fff',
    },
    button: {
        backgroundColor: theme.colors.primary,
        padding: 16,
        borderRadius: 8,
        marginVertical: 12,
        width: 220,
        alignItems: 'center',
    },
    buttonText: {
        color: '#fff',
        fontSize: theme.typography.fontSize.md,
        fontFamily: theme.typography.fontFamily.bold,
    },
    link: {
        color: theme.colors.primary,
        fontSize: theme.typography.fontSize.sm,
        fontFamily: theme.typography.fontFamily.medium,
        marginTop: theme.spacing.md,
        textDecorationLine: 'underline',
    },
    error: {
        color: theme.colors.error,
        marginBottom: 8,
        textAlign: 'center',
    },
    success: {
        color: theme.colors.success || 'green',
        marginBottom: 8,
        textAlign: 'center',
    },
    checkboxRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: theme.spacing.md,
    },
    checkbox: {
        width: 20,
        height: 20,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 4,
        marginRight: 8,
        backgroundColor: '#fff',
    },
    checkboxChecked: {
        backgroundColor: theme.colors.primary,
        borderColor: theme.colors.primary,
    },
    checkboxLabel: {
        fontSize: theme.typography.fontSize.sm,
        color: theme.colors.text,
    },
}); 