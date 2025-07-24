import React, { useEffect, useState } from 'react';
import {
    View,
    StyleSheet,
    ScrollView,
    Text,
    TouchableOpacity,
    TextInput,
    Modal,
} from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../../components';
import { theme } from '../../constants/theme';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Badge } from '../../components/Badge';
import { Tooltip } from '../../components/Tooltip';
import { Toast } from '../../components/Toast';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { connectSocket, onSocketEvent } from '../../services/api';
import axios from 'axios';

const API_BASE = 'http://localhost:3001/api';

export default function DashboardScreen() {
    const { user, signOut } = useAuth();
    const [toast, setToast] = useState({ visible: false, message: '' });
    const [application, setApplication] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [form, setForm] = useState({ name: '', email: '' });
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (!user) return;
        setLoading(true);
        // Fetch application for this student
        AsyncStorage.getItem('token').then(token => {
            axios.get(`${API_BASE}/users/${user.id}/application-status`, {
                headers: { Authorization: `Bearer ${token}` },
            })
                .then(res => setApplication(res.data))
                .catch(() => setApplication(null))
                .finally(() => setLoading(false));
        });
    }, [user]);

    // Real-time updates
    useEffect(() => {
        if (!user?.id) return;
        const socket = connectSocket(user.id);
        onSocketEvent('applicationStatusUpdated', (data) => {
            setApplication(data);
            setToast({ visible: true, message: 'Application status updated!' });
        });
        onSocketEvent('notification', (data) => {
            setToast({ visible: true, message: data.title });
        });
        return () => { if (socket) socket.disconnect(); };
    }, [user?.id]);

    const handleSubmit = async () => {
        setSubmitting(true);
        setError('');
        try {
            const token = await AsyncStorage.getItem('token');
            console.log('Submitting application with token:', token); // Debug log
            const res = await axios.post(`${API_BASE}/applications`, {
                studentName: form.name,
                email: form.email,
            }, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setApplication(res.data.application);
            setShowModal(false);
            setToast({ visible: true, message: 'Application submitted!' });
        } catch (e) {
            const backendError = e.response?.data?.error || 'Failed to submit application.';
            setError(backendError);
            if (backendError === 'Invalid token' || backendError === 'Missing or invalid token') {
                setTimeout(() => {
                    setError('Session expired. Please log in again.');
                    signOut();
                }, 1000);
            }
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.background }} edges={["top", "bottom"]}>
            <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 32 }}>
                <View style={styles.header}>
                    <Text style={styles.welcomeText}>
                        Welcome, {user?.email}
                    </Text>
                    <Button
                        title="Sign Out"
                        variant="outline"
                        size="small"
                        onPress={signOut}
                    />
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Application Status</Text>
                    {loading ? (
                        <Text>Loading...</Text>
                    ) : application ? (
                        <View style={styles.statusCard}>
                            <View style={styles.statusHeader}>
                                <Text style={styles.statusLabel}>Current Status:</Text>
                                <Text style={[styles.statusValue, { color: theme.colors.primary }]}> {application.status}</Text>
                            </View>
                            <Text style={styles.lastUpdated}>
                                Last updated: {application.lastUpdated}
                            </Text>
                        </View>
                    ) : (
                        <Button title="Submit Application" onPress={() => setShowModal(true)} />
                    )}
                </View>

                <Modal visible={showModal} animationType="slide" transparent>
                    <View style={styles.modalOverlay}>
                        <View style={styles.modalContent}>
                            <Text style={styles.sectionTitle}>Submit Application</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="Full Name"
                                value={form.name}
                                onChangeText={v => setForm(f => ({ ...f, name: v }))}
                            />
                            <TextInput
                                style={styles.input}
                                placeholder="Email"
                                value={form.email}
                                onChangeText={v => setForm(f => ({ ...f, email: v }))}
                                autoCapitalize="none"
                                keyboardType="email-address"
                            />
                            {error ? <Text style={{ color: 'red', marginBottom: 8 }}>{error}</Text> : null}
                            <Button title={submitting ? 'Submitting...' : 'Submit'} onPress={handleSubmit} disabled={submitting} />
                            <Button title="Cancel" variant="outline" onPress={() => setShowModal(false)} />
                        </View>
                    </View>
                </Modal>

            </ScrollView>
            <Toast message={toast.message} visible={toast.visible} onHide={() => setToast({ ...toast, visible: false })} />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.background,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: theme.spacing.lg,
        backgroundColor: theme.colors.primary,
    },
    welcomeText: {
        fontSize: theme.typography.fontSize.lg,
        color: '#FFFFFF',
        fontFamily: theme.typography.fontFamily.medium,
    },
    section: {
        padding: theme.spacing.lg,
    },
    sectionTitle: {
        fontSize: theme.typography.fontSize.xl,
        color: theme.colors.text,
        fontFamily: theme.typography.fontFamily.bold,
        marginBottom: theme.spacing.md,
    },
    statusCard: {
        backgroundColor: theme.colors.surface,
        borderRadius: theme.borderRadius.lg,
        padding: theme.spacing.lg,
        ...theme.shadows.small,
    },
    statusHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: theme.spacing.sm,
    },
    statusLabel: {
        fontSize: theme.typography.fontSize.md,
        color: theme.colors.text,
        fontFamily: theme.typography.fontFamily.medium,
    },
    statusValue: {
        fontSize: theme.typography.fontSize.md,
        fontFamily: theme.typography.fontFamily.bold,
    },
    lastUpdated: {
        fontSize: theme.typography.fontSize.sm,
        color: theme.colors.textSecondary,
    },
    input: {
        width: '100%',
        padding: 12,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        marginBottom: 16,
        backgroundColor: '#fff',
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.3)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        width: '90%',
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 24,
        alignItems: 'center',
    },
}); 