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
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Button } from '../../components';
import { useAuth } from '../../context/AuthContext';
import { theme } from '../../constants/theme';
import axios from 'axios';

const API_BASE = 'http://localhost:3001/api';

type RootStackParamList = {
    Login: undefined;
    Register: undefined;
};

type RegisterScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Register'>;

export default function RegisterScreen() {
    const navigation = useNavigation<RegisterScreenNavigationProp>();
    const { signIn } = useAuth();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [agree, setAgree] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const validate = () => {
        if (!name || !email || !password || !confirmPassword) {
            setError('All fields are required.');
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
        try {
            const res = await axios.post(`${API_BASE}/register`, { name, email, password });
            if (res.data.success) {
                setSuccess(true);
                await signIn(email, password);
                navigation.replace('Main');
            } else {
                setError(res.data.message || 'Registration failed.');
            }
        } catch (err) {
            if (err.response && err.response.status === 409) {
                setError('Email already registered.');
            } else {
                setError('Server error or email already registered.');
            }
        } finally {
            setLoading(false);
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
                    <TouchableOpacity style={styles.checkboxRow} onPress={() => setAgree(a => !a)}>
                        <View style={[styles.checkbox, agree && styles.checkboxChecked]} />
                        <Text style={styles.checkboxLabel}>I agree to the <Text style={styles.link}>Terms</Text> and <Text style={styles.link}>Privacy Policy</Text></Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.button, !agree && { opacity: 0.6 }]} onPress={handleRegister} disabled={loading || !agree}>
                        <Text style={styles.buttonText}>{loading ? 'Registering...' : 'Register'}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => navigation.goBack()}>
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