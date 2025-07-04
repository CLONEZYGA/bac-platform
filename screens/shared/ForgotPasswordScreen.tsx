import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import axios from 'axios';
import { theme } from '../../constants/theme';

const API_BASE = 'http://localhost:3001/api';

export default function ForgotPasswordScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleReset = async () => {
    if (!email || !newPassword) {
      Alert.alert('Error', 'All fields are required.');
      return;
    }
    setLoading(true);
    try {
      const res = await axios.post(`${API_BASE}/reset-password`, { email, newPassword });
      if (res.data.success) {
        Alert.alert('Success', 'Password reset. Please log in.');
        navigation.goBack();
      } else {
        Alert.alert('Reset Failed', res.data.message || 'Try again.');
      }
    } catch (err) {
      Alert.alert('Reset Failed', 'Server error or user not found.');
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