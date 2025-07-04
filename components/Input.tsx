import React, { useState } from 'react';
import {
    View,
    TextInput,
    Text,
    StyleSheet,
    ViewStyle,
    TextStyle,
    TextInputProps,
} from 'react-native';
import { theme } from '../constants/theme';

interface InputProps extends TextInputProps {
    label?: string;
    error?: string;
    containerStyle?: ViewStyle;
    labelStyle?: TextStyle;
    inputStyle?: TextStyle;
    errorStyle?: TextStyle;
}

export const Input: React.FC<InputProps> = ({
    label,
    error,
    containerStyle,
    labelStyle,
    inputStyle,
    errorStyle,
    ...props
}) => {
    const [isFocused, setIsFocused] = useState(false);

    return (
        <View style={[styles.container, containerStyle]}>
            {label && (
                <Text style={[styles.label, labelStyle]}>
                    {label}
                </Text>
            )}
            <TextInput
                style={[
                    styles.input,
                    {
                        borderColor: error
                            ? theme.colors.error
                            : isFocused
                            ? theme.colors.primary
                            : theme.colors.border,
                    },
                    inputStyle,
                ]}
                placeholderTextColor={theme.colors.placeholder}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                {...props}
            />
            {error && (
                <Text style={[styles.error, errorStyle]}>
                    {error}
                </Text>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginBottom: theme.spacing.md,
    },
    label: {
        fontSize: theme.typography.fontSize.sm,
        color: theme.colors.text,
        marginBottom: theme.spacing.xs,
        fontFamily: theme.typography.fontFamily.medium,
    },
    input: {
        height: 48,
        borderWidth: 1,
        borderRadius: theme.borderRadius.md,
        paddingHorizontal: theme.spacing.md,
        fontSize: theme.typography.fontSize.md,
        color: theme.colors.text,
        backgroundColor: theme.colors.background,
        fontFamily: theme.typography.fontFamily.regular,
    },
    error: {
        color: theme.colors.error,
        fontSize: theme.typography.fontSize.xs,
        marginTop: theme.spacing.xs,
        fontFamily: theme.typography.fontFamily.regular,
    },
}); 