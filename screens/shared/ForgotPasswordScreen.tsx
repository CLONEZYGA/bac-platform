import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import axios from 'axios';
import { theme } from '../../constants/theme';
import Constants from 'expo-constants';
import * as api from '../../services/api';

const API_BASE = Constants.expoConfig?.extra?.API_BASE_URL || 'http://localhost:3001/api';

export default function ForgotPasswordScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleReset = async () => {
    if (!email || !newPassword) {
      Alert.alert('Error', 'All fields are required.');
      return;
    }
    setLoading(true);
    setError('');
    setSuccess(false);
    try {
      const res = await api.resetPassword(email, newPassword);
      if (res.data.success) {
        setSuccess(true);
      } else {
        setError(res.data.message || 'Password reset failed.');
      }
    } catch (err) {
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError('Server error. Please try again later.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Reset Password</Text>
      <TextInput style={styles.input} placeholder="Email" value={email} onChangeText={setEmail} autoCapitalize="none" />
      <TextInput style={styles.input} placeholder="New Password" value={newPassword} onChangeText={setNewPassword} secureTextEntry />
      <TouchableOpacity style={styles.button} onPress={handleReset} disabled={loading}>
        <Text style={styles.buttonText}>{loading ? 'Resetting...' : 'Reset Password'}</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Text style={styles.link}>Back to Login</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: theme.colors.background },
  title: { fontSize: 28, fontWeight: 'bold', marginBottom: 32, color: theme.colors.primary },
  input: { width: 220, padding: 12, borderWidth: 1, borderColor: '#ccc', borderRadius: 8, marginBottom: 16, backgroundColor: '#fff' },
  button: { backgroundColor: theme.colors.primary, padding: 16, borderRadius: 8, marginVertical: 12, width: 220, alignItems: 'center' },
  buttonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  link: { color: theme.colors.primary, marginTop: 16, textDecorationLine: 'underline' },
}); 