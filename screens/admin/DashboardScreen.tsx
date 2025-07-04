import React, { useState } from 'react';
import {
    View,
    StyleSheet,
    ScrollView,
    Text,
    TouchableOpacity,
    FlatList,
} from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { Button, NavigationButtons } from '../../components';
import { theme } from '../../constants/theme';

// Mock data - this would come from your backend
const mockApplications = [
    {
        id: '1',
        studentName: 'John Doe',
        email: 'john.doe@example.com',
        status: 'pending',
        submittedDate: '2024-03-15',
        documents: ['ID Card', 'Academic Certificate', 'Proof of Address'],
    },
    {
        id: '2',
        studentName: 'Jane Smith',
        email: 'jane.smith@example.com',
        status: 'in_review',
        submittedDate: '2024-03-14',
        documents: ['ID Card', 'Academic Certificate'],
    },
    {
        id: '3',
        studentName: 'Mike Johnson',
        email: 'mike.johnson@example.com',
        status: 'approved',
        submittedDate: '2024-03-13',
        documents: ['ID Card', 'Academic Certificate', 'Proof of Address'],
    },
];

type ApplicationStatus = 'pending' | 'in_review' | 'approved' | 'rejected';

export default function AdminDashboardScreen() {
    const { user, signOut } = useAuth();
    const [selectedStatus, setSelectedStatus] = useState<ApplicationStatus | 'all'>('all');

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

    const filteredApplications = mockApplications.filter(app =>
        selectedStatus === 'all' ? true : app.status === selectedStatus
    );

    const renderApplicationCard = ({ item }: { item: typeof mockApplications[0] }) => (
        <View style={styles.applicationCard}>
            <View style={styles.applicationHeader}>
                <View>
                    <Text style={styles.studentName}>{item.studentName}</Text>
                    <Text style={styles.studentEmail}>{item.email}</Text>
                </View>
                <Text
                    style={[
                        styles.statusBadge,
                        { backgroundColor: getStatusColor(item.status) },
                    ]}
                >
                    {getStatusText(item.status)}
                </Text>
            </View>

            <View style={styles.applicationDetails}>
                <Text style={styles.detailLabel}>Submitted:</Text>
                <Text style={styles.detailValue}>{item.submittedDate}</Text>
            </View>

            <View style={styles.documentsList}>
                <Text style={styles.documentsLabel}>Documents:</Text>
                {item.documents.map((doc, index) => (
                    <Text key={index} style={styles.documentItem}>
                        • {doc}
                    </Text>
                ))}
            </View>

            <View style={styles.actionButtons}>
                <Button
                    title="View Details"
                    variant="outline"
                    size="small"
                    onPress={() => {
                        // TODO: Navigate to application details
                        console.log('View details for:', item.id);
                    }}
                />
                {item.status === 'pending' && (
                    <Button
                        title="Start Review"
                        size="small"
                        onPress={() => {
                            // TODO: Start review process
                            console.log('Start review for:', item.id);
                        }}
                    />
                )}
            </View>
        </View>
    );

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.welcomeText}>
                    Welcome, Admin {user?.email}
                </Text>
                <Button
                    title="Sign Out"
                    variant="outline"
                    size="small"
                    onPress={signOut}
                />
            </View>

            <View style={styles.filters}>
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.filterContainer}
                >
                    {['all', 'pending', 'in_review', 'approved', 'rejected'].map((status) => (
                        <TouchableOpacity
                            key={status}
                            style={[
                                styles.filterButton,
                                selectedStatus === status && styles.filterButtonActive,
                            ]}
                            onPress={() => setSelectedStatus(status as ApplicationStatus | 'all')}
                        >
                            <Text
                                style={[
                                    styles.filterButtonText,
                                    selectedStatus === status && styles.filterButtonTextActive,
                                ]}
                            >
                                {getStatusText(status)}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            </View>

            <FlatList
                data={filteredApplications}
                renderItem={renderApplicationCard}
                keyExtractor={(item) => item.id}
                contentContainerStyle={[styles.listContent, { paddingBottom: 100 }]}
                showsVerticalScrollIndicator={false}
            />
            
            <NavigationButtons 
                showBack={false}
                forwardLabel="View Students"
                onForwardPress={() => {
                    // Navigate to Students screen
                    console.log('Navigating to Students...');
                }}
            />
        </View>
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
    filters: {
        paddingVertical: theme.spacing.md,
        borderBottomWidth: 1,
        borderBottomColor: theme.colors.border,
    },
    filterContainer: {
        paddingHorizontal: theme.spacing.lg,
        gap: theme.spacing.sm,
    },
    filterButton: {
        paddingHorizontal: theme.spacing.md,
        paddingVertical: theme.spacing.sm,
        borderRadius: theme.borderRadius.round,
        backgroundColor: theme.colors.surface,
        borderWidth: 1,
        borderColor: theme.colors.border,
    },
    filterButtonActive: {
        backgroundColor: theme.colors.primary,
        borderColor: theme.colors.primary,
    },
    filterButtonText: {
        fontSize: theme.typography.fontSize.sm,
        color: theme.colors.text,
        fontFamily: theme.typography.fontFamily.medium,
    },
    filterButtonTextActive: {
        color: '#FFFFFF',
    },
    listContent: {
        padding: theme.spacing.lg,
    },
    applicationCard: {
        backgroundColor: theme.colors.surface,
        borderRadius: theme.borderRadius.lg,
        padding: theme.spacing.lg,
        marginBottom: theme.spacing.md,
        ...theme.shadows.small,
    },
    applicationHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: theme.spacing.md,
    },
    studentName: {
        fontSize: theme.typography.fontSize.lg,
        color: theme.colors.text,
        fontFamily: theme.typography.fontFamily.bold,
        marginBottom: theme.spacing.xs,
    },
    studentEmail: {
        fontSize: theme.typography.fontSize.sm,
        color: theme.colors.textSecondary,
    },
    statusBadge: {
        paddingHorizontal: theme.spacing.sm,
        paddingVertical: theme.spacing.xs,
        borderRadius: theme.borderRadius.round,
        fontSize: theme.typography.fontSize.xs,
        color: '#FFFFFF',
        fontFamily: theme.typography.fontFamily.medium,
    },
    applicationDetails: {
        flexDirection: 'row',
        marginBottom: theme.spacing.md,
    },
    detailLabel: {
        fontSize: theme.typography.fontSize.sm,
        color: theme.colors.textSecondary,
        marginRight: theme.spacing.xs,
    },
    detailValue: {
        fontSize: theme.typography.fontSize.sm,
        color: theme.colors.text,
        fontFamily: theme.typography.fontFamily.medium,
    },
    documentsList: {
        marginBottom: theme.spacing.md,
    },
    documentsLabel: {
        fontSize: theme.typography.fontSize.sm,
        color: theme.colors.textSecondary,
        marginBottom: theme.spacing.xs,
    },
    documentItem: {
        fontSize: theme.typography.fontSize.sm,
        color: theme.colors.text,
        marginBottom: theme.spacing.xs,
    },
    actionButtons: {
        flexDirection: 'row',
        gap: theme.spacing.md,
    },
}); 