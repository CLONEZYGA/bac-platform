export const colors = {
    // Primary colors
    primary: '#1E88E5', // Main brand color
    primaryDark: '#1565C0',
    primaryLight: '#64B5F6',
    
    // Secondary colors
    secondary: '#26A69A', // Teal for accents
    secondaryDark: '#00897B',
    secondaryLight: '#4DB6AC',
    
    // Status colors
    success: '#4CAF50',
    error: '#F44336',
    warning: '#FFC107',
    info: '#2196F3',
    
    // Neutral colors
    background: '#FFFFFF',
    surface: '#F5F5F5',
    text: '#212121',
    textSecondary: '#757575',
    border: '#E0E0E0',
    
    // Additional UI colors
    disabled: '#BDBDBD',
    placeholder: '#9E9E9E',
    backdrop: 'rgba(0, 0, 0, 0.5)',
    
    // Document status colors
    pending: '#FFA726',
    approved: '#66BB6A',
    rejected: '#EF5350',
    inReview: '#29B6F6'
} as const;

export type ColorKeys = keyof typeof colors; 