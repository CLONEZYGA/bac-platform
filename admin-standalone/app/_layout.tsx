import React, { useState } from 'react';
import AdminNavigator from './navigation/AdminNavigator';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import axios from 'axios';
import { TokenContext } from './services/token';

const DEFAULT_EMAIL = 'becarefulofpower@will.com';
const DEFAULT_PASS = 'check90b590';
const API_BASE = 'http://localhost:3001/api'; // Adjust as needed

function AdminLogin({ onLogin }: { onLogin: (token: string) => void }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await axios.post(`${API_BASE}/login`, { email, password });
      if (res.data.success && res.data.token) {
        onLogin(res.data.token);
      } else {
        setError('Invalid credentials');
      }
    } catch {
      setError('Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Admin Login</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      {error ? <Text style={styles.error}>{error}</Text> : null}
      <Button title={loading ? 'Logging in...' : 'Login'} onPress={handleLogin} disabled={loading} />
    </View>
  );
}

export default function RootLayout() {
  const [token, setToken] = useState<string | null>(null);
  return (
    <TokenContext.Provider value={token}>
      {token ? <AdminNavigator /> : <AdminLogin onLogin={setToken} />}
    </TokenContext.Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 24,
  },
  input: {
    width: 240,
    padding: 12,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    marginBottom: 16,
    backgroundColor: '#fff',
  },
  error: {
    color: 'red',
    marginBottom: 12,
  },
});
