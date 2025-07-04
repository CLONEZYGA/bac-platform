import { colors } from './colors';

export const theme = {
    colors,
    spacing: {
        xs: 4,
        sm: 8,
        md: 16,
        lg: 24,
        xl: 32,
        xxl: 48,
    },
    typography: {
        fontFamily: {
            regular: 'System',
            medium: 'System',
            bold: 'System',
        },
        fontSize: {
            xs: 12,
            sm: 14,
            md: 16,
            lg: 18,
            xl: 20,
            xxl: 24,
            xxxl: 32,
        },
    },
    borderRadius: {
        xs: 4,
        sm: 8,
        md: 12,
        lg: 16,
        xl: 24,
        round: 9999,
    },
    shadows: {
        small: {
            shadowColor: '#000',
            shadowOffset: {
                width: 0,
                height: 2,
            },
            shadowOpacity: 0.25,
            shadowRadius: 3.84,
            elevation: 2,
        },
        medium: {
            shadowColor: '#000',
            shadowOffset: {
                width: 0,
                height: 4,
            },
            shadowOpacity: 0.30,
            shadowRadius: 4.65,
            elevation: 4,
        },
        large: {
            shadowColor: '#000',
            shadowOffset: {
                width: 0,
                height: 6,
            },
            shadowOpacity: 0.37,
            shadowRadius: 7.49,
            elevation: 8,
        },
    },
    animation: {
        timing: {
            fast: 200,
            normal: 300,
            slow: 500,
        },
    },
} as const;

export type Theme = typeof theme;
export type SpacingKeys = keyof typeof theme.spacing;
export type TypographyKeys = keyof typeof theme.typography.fontSize;
export type BorderRadiusKeys = keyof typeof theme.borderRadius;
export type ShadowKeys = keyof typeof theme.shadows; 