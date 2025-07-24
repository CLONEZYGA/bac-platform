import axios, { AxiosError, AxiosInstance, AxiosResponse } from 'axios';
import Constants from 'expo-constants';
import { Platform } from 'react-native';
import * as Device from 'expo-device';
import NetInfo from '@react-native-community/netinfo';

// Types
export interface AuthResponse {
    success: boolean;
    userId: string;
    token: string;
    message?: string;
    user?: {
        id: string;
        name: string;
        email: string;
        role: 'student' | 'admin';
        initials: string;
    };
}

export interface User {
    id: string;
    name: string;
    email: string;
    role: 'student' | 'admin';
    initials: string;
    group?: string;
    notifications?: any[];
    classes?: any[];
    lessons?: any[];
}

// API URL Configuration
export const getApiUrl = () => {
    if (__DEV__) {
        // Handle development environment
        if (Platform.OS === 'android') {
            if (Device.isDevice) {
                // Physical Android device
                return 'http://192.168.8.8:3001/api';
            } else {
                // Android emulator
                return 'http://10.0.2.2:3001/api';
            }
        } else if (Platform.OS === 'ios') {
            // For iOS simulators and physical devices
            return Device.isDevice 
                ? 'http://192.168.8.8:3001/api'  // Physical iOS device
                : 'http://localhost:3001/api';     // iOS simulator
        }
        // Web platform
        return 'http://localhost:3001/api';
    }
    // Production environment
    return Constants.expoConfig?.extra?.API_BASE_URL || 'http://192.168.8.24:3001/api';
};

// Create axios instance with configuration
const axiosInstance = axios.create({
    baseURL: getApiUrl(),
    timeout: 15000, // 15 second timeout
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
    }
});

// Network check function
const checkNetworkConnection = async () => {
    const networkState = await NetInfo.fetch();
    if (!networkState.isConnected) {
        throw new Error('No internet connection available');
    }
};

// Add request interceptor for network checks
axiosInstance.interceptors.request.use(
    async (config) => {
        await checkNetworkConnection();
        return config;
    },
    (error) => {
        return Promise.reject(new Error('Network request failed. Please check your connection.'));
    }
);

// Add response interceptor for error handling
axiosInstance.interceptors.response.use(
    (response) => response,
    (error: AxiosError) => {
        if (error.code === 'ECONNABORTED') {
            throw new Error('Request timed out. Please try again.');
        }
        if (!error.response) {
            throw new Error('Unable to connect to server. Please check your internet connection.');
        }
        throw error;
    }
);

// Auth functions
export const signUp = async (
    email: string,
    password: string,
    role: 'student' | 'admin',
    name: string  // Make name required
): Promise<AuthResponse> => {
    try {
        if (!email || !password || !name) {
            throw new Error('Email, password, and name are required');
        }

        const response = await axiosInstance.post<AuthResponse>('/register', {
            email,
            password,
            role,
            name
        });

        if (!response.data || !response.data.success) {
            const message = response.data?.message || 'Registration failed';
            throw new Error(message);
        }

        if (!response.data.token || !response.data.userId || !response.data.user) {
            throw new Error('Invalid server response: missing required fields');
        }

        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            if (error.response?.status === 409) {
                throw new Error('This email is already registered');
            }
            const message = error.response?.data?.message || error.message;
            throw new Error(`Registration failed: ${message}`);
        }
        if (error instanceof Error) {
            throw error;
        }
        throw new Error('Registration failed. Please try again.');
    }
};

export const login = async (
    email: string,
    password: string
): Promise<AuthResponse> => {
    try {
        const response = await axiosInstance.post<AuthResponse>('/auth/login', {
            email,
            password
        });

        if (!response.data) {
            throw new Error('Invalid server response');
        }

        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            const message = error.response?.data?.message || error.message;
            throw new Error(`Login failed: ${message}`);
        }
        if (error instanceof Error) {
            throw error;
        }
        throw new Error('Login failed. Please try again.');
    }
};

export const fetchUser = async (
    userId: string,
    token: string
): Promise<User> => {
    try {
        const response = await axiosInstance.get<User>(`/users/${userId}`, {
            headers: { Authorization: `Bearer ${token}` }
        });

        if (!response.data) {
            throw new Error('Invalid server response');
        }

        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            const message = error.response?.data?.message || error.message;
            throw new Error(`Failed to fetch user: ${message}`);
        }
        if (error instanceof Error) {
            throw error;
        }
        throw new Error('Failed to fetch user data');
    }
};

// Health check function
export const checkServerHealth = async (): Promise<boolean> => {
    try {
        await axiosInstance.get('/health');
        return true;
    } catch {
        return false;
    }
};

// Class attendance functions
export interface AttendanceRecord {
    id: string;
    studentId: string;
    classId: string;
    date: string;
    status: 'present' | 'absent' | 'late';
}

export const markAttendance = async (
    classId: string,
    status: 'present' | 'absent' | 'late',
    token: string
): Promise<AttendanceRecord> => {
    try {
        const response = await axiosInstance.post<AttendanceRecord>(
            '/attendance/mark',
            { classId, status },
            { headers: { Authorization: `Bearer ${token}` } }
        );

        if (!response.data) {
            throw new Error('Invalid server response');
        }

        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            const message = error.response?.data?.message || error.message;
            throw new Error(`Failed to mark attendance: ${message}`);
        }
        if (error instanceof Error) {
            throw error;
        }
        throw new Error('Failed to mark attendance');
    }
};

export const getAttendanceHistory = async (
    studentId: string,
    token: string
): Promise<AttendanceRecord[]> => {
    try {
        const response = await axiosInstance.get<AttendanceRecord[]>(
            `/attendance/history/${studentId}`,
            { headers: { Authorization: `Bearer ${token}` } }
        );

        if (!response.data) {
            throw new Error('Invalid server response');
        }

        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            const message = error.response?.data?.message || error.message;
            throw new Error(`Failed to fetch attendance history: ${message}`);
        }
        if (error instanceof Error) {
            throw error;
        }
        throw new Error('Failed to fetch attendance history');
    }
};

// Export the configured axios instance for other API calls
export const apiClient = axiosInstance;