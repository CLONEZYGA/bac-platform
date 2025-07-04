import React from 'react';
import { 
    TouchableOpacity, 
    Text, 
    StyleSheet, 
    ActivityIndicator,
    ViewStyle,
    TextStyle,
    TouchableOpacityProps
} from 'react-native';
import { theme } from '../constants/theme';

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'text';
type ButtonSize = 'small' | 'medium' | 'large';

interface ButtonProps extends TouchableOpacityProps {
    variant?: ButtonVariant;
    size?: ButtonSize;
    loading?: boolean;
    disabled?: boolean;
    title: string;
    style?: ViewStyle;
    textStyle?: TextStyle;
}

export const Button: React.FC<ButtonProps> = ({
    variant = 'primary',
    size = 'medium',
    loading = false,
    disabled = false,
    title,
    style,
    textStyle,
    ...props
}) => {
    const getBackgroundColor = () => {
        if (disabled) return theme.colors.disabled;
        switch (variant) {
            case 'primary':
                return theme.colors.primary;
            case 'secondary':
                return theme.colors.secondary;
            case 'outline':
            case 'text':
                return 'transparent';
            default:
                return theme.colors.primary;
        }
    };

    const getTextColor = () => {
        if (disabled) return theme.colors.textSecondary;
        switch (variant) {
            case 'primary':
            case 'secondary':
                return '#FFFFFF';
            case 'outline':
                return theme.colors.primary;
            case 'text':
                return theme.colors.primary;
            default:
                return '#FFFFFF';
        }
    };

    const getPadding = () => {
        switch (size) {
            case 'small':
                return theme.spacing.sm;
            case 'large':
                return theme.spacing.lg;
            default:
                return theme.spacing.md;
        }
    };

    const getBorderWidth = () => {
        return variant === 'outline' ? 1 : 0;
    };

    const getBorderColor = () => {
        if (disabled) return theme.colors.disabled;
        return variant === 'outline' ? theme.colors.primary : 'transparent';
    };

    return (
        <TouchableOpacity
            style={[
                styles.button,
                {
                    backgroundColor: getBackgroundColor(),
                    padding: getPadding(),
                    borderWidth: getBorderWidth(),
                    borderColor: getBorderColor(),
                },
                style,
            ]}
            disabled={disabled || loading}
            {...props}
        >
            {loading ? (
                <ActivityIndicator color={getTextColor()} />
            ) : (
                <Text
                    style={[
                        styles.text,
                        {
                            color: getTextColor(),
                            fontSize: size === 'small' ? theme.typography.fontSize.sm : theme.typography.fontSize.md,
                        },
                        textStyle,
                    ]}
                >
                    {title}
                </Text>
            )}
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    button: {
        borderRadius: theme.borderRadius.md,
        alignItems: 'center',
        justifyContent: 'center',
        ...theme.shadows.small,
    },
    text: {
        fontFamily: theme.typography.fontFamily.medium,
        textAlign: 'center',
    },
}); 