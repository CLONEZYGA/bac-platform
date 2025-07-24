import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';
import * as api from '../services/api';
import { Platform } from 'react-native';

interface ApiResponse {
    success: boolean;
    message?: string;
    data?: any;
}

interface AuthResponse extends ApiResponse {
    userId: string;
    token: string;
}

interface UserResponse {
    id: string;
    email: string;
    role: 'student' | 'admin';
    name?: string;
}

interface User {
    id: string;
    email: string;
    role: 'student' | 'admin';
    displayName?: string;
}

interface AuthContextType {
    user: User | null;
    loading: boolean;
    signIn: (email: string, password: string) => Promise<void>;
    signUp: (email: string, password: string, role: 'student' | 'admin', name?: string) => Promise<void>;
    signOut: () => Promise<void>;
    error: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        // Check for stored user data on app launch
        loadStoredUser();
    }, []);

    const loadStoredUser = async () => {
        try {
            const storedUser = await AsyncStorage.getItem('user');
            if (storedUser) {
                setUser(JSON.parse(storedUser));
            }
        } catch (err) {
            console.error('Error loading stored user:', err);
        } finally {
            setLoading(false);
        }
    };

    const checkNetworkConnection = async () => {
        const networkState = await NetInfo.fetch();
        if (!networkState.isConnected) {
            throw new Error('No internet connection available');
        }
    };

    const signIn = async (email: string, password: string) => {
        try {
            setLoading(true);
            setError(null);

            // Check network connection first
            await checkNetworkConnection();

            const res = await api.login(email, password) as AuthResponse;
            
            if (!res.success || !res.token || !res.userId) {
                throw new Error(res.message || 'Invalid credentials');
            }

            // Store token securely
            await AsyncStorage.setItem('token', res.token);

            try {
                // Fetch user profile with the new token
                const userRes = await api.fetchUser(res.userId, res.token) as UserResponse;
                
                if (!userRes || !userRes.id) {
                    throw new Error('Failed to fetch user data');
                }

                const user: User = {
                    id: userRes.id,
                    email: userRes.email,
                    role: userRes.role || 'student',
                    displayName: userRes.name,
                };

                // Store user profile
                await AsyncStorage.setItem('user', JSON.stringify(user));
                setUser(user);
            } catch (userError) {
                // Clean up if user fetch fails
                await AsyncStorage.removeItem('token');
                throw userError;
            }
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'An error occurred during sign in';
            setError(errorMessage);
            throw new Error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const signUp = async (email: string, password: string, role: 'student' | 'admin', name?: string) => {
        try {
            setLoading(true);
            setError(null);

            // Check network connection first
            await checkNetworkConnection();

            const res = await api.signUp(email, password, role, name) as AuthResponse;
            
            if (!res.success || !res.token || !res.userId) {
                throw new Error(res.message || 'Registration failed');
            }

            try {
                // Store token securely
                await AsyncStorage.setItem('token', res.token);

                if (!res.user) {
                    throw new Error('User data missing from response');
                }

                const user: User = {
                    id: res.userId,
                    email: res.user.email,
                    role: res.user.role,
                    displayName: res.user.name,
                    initials: res.user.initials
                };

                // Store user profile
                await AsyncStorage.setItem('user', JSON.stringify(user));
                setUser(user);
            } catch (userError) {
                // Clean up if user fetch fails
                await AsyncStorage.removeItem('token');
                throw userError;
            }
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'An error occurred during sign up';
            setError(errorMessage);
            throw new Error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const signOut = async () => {
        try {
            setLoading(true);
            await AsyncStorage.removeItem('user');
            await AsyncStorage.removeItem('token'); // Remove token
            setUser(null);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred during sign out');
            throw err;
        } finally {
            setLoading(false);
        }
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                loading,
                signIn,
                signUp,
                signOut,
                error,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}; 