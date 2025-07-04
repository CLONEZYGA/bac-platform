import React from 'react';
import {
    View,
    StyleSheet,
    ScrollView,
    Text,
    TouchableOpacity,
    TextInput,
} from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { Button, NavigationButtons } from '../../components';
import { theme } from '../../constants/theme';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Badge } from '../../components/Badge';
import { Tooltip } from '../../components/Tooltip';
import { Toast } from '../../components/Toast';
import { ProgressBar } from '../../components/ProgressBar';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Mock data - this would come from your backend
const mockApplicationStatus = {
    status: 'pending', // 'pending' | 'approved' | 'rejected' | 'in_review'
    lastUpdated: '2024-03-15',
    documents: [
        { name: 'ID Card', status: 'approved' },
        { name: 'Academic Certificate', status: 'pending' },
        { name: 'Proof of Address', status: 'in_review' },
    ],
};

const statusExplanations: Record<string, string> = {
    approved: 'This document is approved. No further action needed.',
    pending: 'This document is pending. Please upload or update as required.',
    in_review: 'This document is under review. Check back soon.',
    rejected: 'This document was rejected. Please re-upload a valid document.',
};

const statusColors: Record<string, string> = {
    approved: theme.colors.approved || theme.colors.success,
    pending: theme.colors.pending || theme.colors.warning,
    in_review: theme.colors.inReview || theme.colors.info,
    rejected: theme.colors.rejected || theme.colors.error,
};

const GRADEBOOK_UNLOCK_KEY = 'gradebook_unlocked';

export default function DashboardScreen() {
    const { user, signOut } = useAuth();
    const [toast, setToast] = React.useState<{ visible: boolean; message: string }>({ visible: false, message: '' });
    const [unlockCode, setUnlockCode] = React.useState('');
    const [unlockSuccess, setUnlockSuccess] = React.useState(false);
    const [gradebookUnlocked, setGradebookUnlocked] = React.useState(false);

    React.useEffect(() => {
        AsyncStorage.getItem(GRADEBOOK_UNLOCK_KEY).then(val => {
            if (val === 'true') setGradebookUnlocked(true);
        });
    }, []);

    const handleUnlock = async () => {
        // For dev: accept any 4-digit code
        if (/^\d{4}$/.test(unlockCode)) {
            await AsyncStorage.setItem(GRADEBOOK_UNLOCK_KEY, 'true');
            setGradebookUnlocked(true);
            setUnlockSuccess(true);
            setUnlockCode('');
            setToast({ visible: true, message: 'Gradebook Login now available' });
            setTimeout(() => setUnlockSuccess(false), 2000);
        } else {
            setToast({ visible: true, message: 'Enter a valid 4-digit code' });
        }
    };

    // Mock: add lastUpdated to each doc
    const documents = mockApplicationStatus.documents.map((doc, i) => ({
        ...doc,
        lastUpdated: `2024-03-1${i + 2}`,
    }));
    const totalDocs = documents.length;
    const completedDocs = documents.filter(doc => doc.status === 'approved').length;
    const progressPercent = Math.round((completedDocs / totalDocs) * 100);
    const stalled = documents.some(doc => doc.status === 'rejected' || doc.status === 'pending');

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'approved':
                return theme.colors.success;
            case 'rejected':
                return theme.colors.error;
            case 'in_review':
                return theme.colors.info;
            default:
                return theme.colors.warning;
        }
    };

    const getStatusText = (status: string) => {
        return status.split('_').map(word => 
            word.charAt(0).toUpperCase() + word.slice(1)
        ).join(' ');
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
                    <View style={styles.statusCard}>
                        <View style={styles.statusHeader}>
                            <Text style={styles.statusLabel}>Current Status:</Text>
                            <Text
                                style={[
                                    styles.statusValue,
                                    { color: getStatusColor(mockApplicationStatus.status) },
                                ]}
                            >
                                {getStatusText(mockApplicationStatus.status)}
                            </Text>
                        </View>
                        <Text style={styles.lastUpdated}>
                            Last updated: {mockApplicationStatus.lastUpdated}
                        </Text>
                    </View>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Required Documents</Text>
                    <ProgressBar percent={progressPercent} />
                    {stalled && (
                        <View style={styles.stalledBox}>
                            <Text style={styles.stalledText}>Your application is stalled due to missing or rejected documents. Please resolve to proceed.</Text>
                        </View>
                    )}
                    {documents.map((doc, index) => (
                        <View key={index} style={styles.documentCard}>
                            <View style={styles.documentInfo}>
                                <Text style={styles.documentName}>{doc.name}</Text>
                                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 4 }}>
                                    <Badge color={statusColors[doc.status]} label={getStatusText(doc.status)} />
                                    <Tooltip text={statusExplanations[doc.status]} />
                                </View>
                                <Text style={styles.lastUpdated}>Last updated: {doc.lastUpdated}</Text>
                            </View>
                            {doc.status !== 'approved' && (
                                <Button
                                    title="Upload"
                                    size="large"
                                    onPress={() => {
                                        setToast({ visible: true, message: `Uploaded ${doc.name} successfully!` });
                                    }}
                                    style={{ minWidth: 120 }}
                                />
                            )}
                        </View>
                    ))}
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Quick Actions</Text>
                    <View style={styles.actionsContainer}>
                        <TouchableOpacity style={styles.actionButton} onPress={() => setToast({ visible: true, message: 'Download started!' })}>
                            <Text style={styles.actionButtonText}>Download All Docs</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.actionButton} onPress={() => setToast({ visible: true, message: 'Contacting support...' })}>
                            <Text style={styles.actionButtonText}>Contact Support</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.actionButton} onPress={() => setToast({ visible: true, message: 'Viewing timeline...' })}>
                            <Text style={styles.actionButtonText}>Application Timeline</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
            
            <NavigationButtons 
                showBack={false}
                forwardLabel="View Classes"
                onForwardPress={() => {
                    // Navigate to My Classes screen
                    setToast({ visible: true, message: 'Navigating to My Classes...' });
                }}
            />
            
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
    documentCard: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: theme.colors.surface,
        borderRadius: theme.borderRadius.md,
        padding: theme.spacing.md,
        marginBottom: theme.spacing.sm,
        ...theme.shadows.small,
    },
    documentInfo: {
        flex: 1,
    },
    documentName: {
        fontSize: theme.typography.fontSize.md,
        color: theme.colors.text,
        fontFamily: theme.typography.fontFamily.medium,
        marginBottom: theme.spacing.xs,
    },
    stalledBox: {
        backgroundColor: theme.colors.warning,
        borderRadius: theme.borderRadius.md,
        padding: theme.spacing.md,
        marginBottom: theme.spacing.md,
    },
    stalledText: {
        color: theme.colors.text,
        fontSize: theme.typography.fontSize.md,
        fontFamily: theme.typography.fontFamily.medium,
    },
    actionsContainer: {
        flexDirection: 'column',
        gap: theme.spacing.md,
    },
    actionButton: {
        backgroundColor: theme.colors.primary,
        borderRadius: theme.borderRadius.md,
        padding: theme.spacing.lg,
        alignItems: 'center',
        marginBottom: theme.spacing.md,
        ...theme.shadows.small,
    },
    actionButtonText: {
        color: '#FFFFFF',
        fontSize: theme.typography.fontSize.lg,
        fontFamily: theme.typography.fontFamily.bold,
    },
    input: {
        borderWidth: 1,
        borderColor: theme.colors.border,
        borderRadius: theme.borderRadius.md,
        padding: theme.spacing.md,
    },
}); 