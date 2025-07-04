import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const API_BASE = 'http://localhost:3001/api'; // or your deployed backend

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
    signUp: (email: string, password: string, role: 'student' | 'admin') => Promise<void>;
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

    const signIn = async (email: string, password: string) => {
        try {
            setLoading(true);
            setError(null);

            const res = await axios.post(`${API_BASE}/login`, { email, password });
            if (res.data.success) {
                const userId = res.data.userId;
                const userRes = await axios.get(`${API_BASE}/users/${userId}`);
                const userData = userRes.data;
                const user: User = {
                    id: userData.id,
                    email: userData.email,
                    role: 'student', // or userData.role if available
                    displayName: userData.name,
                };
                await AsyncStorage.setItem('user', JSON.stringify(user));
                setUser(user);
            } else {
                setError('Invalid credentials');
                throw new Error('Invalid credentials');
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred during sign in');
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const signUp = async (email: string, password: string, role: 'student' | 'admin') => {
        try {
            setLoading(true);
            setError(null);
            // TODO: Implement actual registration endpoint
            const mockUser: User = {
                id: '1',
                email,
                role,
            };
            await AsyncStorage.setItem('user', JSON.stringify(mockUser));
            setUser(mockUser);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred during sign up');
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const signOut = async () => {
        try {
            setLoading(true);
            await AsyncStorage.removeItem('user');
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