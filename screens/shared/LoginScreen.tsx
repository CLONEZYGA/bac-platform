import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, TextInput, ImageBackground, Alert } from 'react-native';
import { theme } from '../../constants/theme';
import { Button } from '../../components/Button';
import { useAuth } from '../../context/AuthContext';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Define the navigation prop type
// Adjust RootStackParamList as needed for your app

type RootStackParamList = {
  Login: undefined;
  LoginForm: undefined;
  Register: undefined;
  ForgotPassword: undefined;
  Main: undefined;
  LearnMore: undefined;
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const GRADEBOOK_UNLOCK_KEY = 'gradebook_unlocked';

export default function LoginScreen({ navigation }: { navigation: NavigationProp }) {
  return (
    <ImageBackground source={require('../../assets/bac-back.png')} style={styles.background} resizeMode="contain">
      <View style={styles.overlay}>
        <Image source={require('../../assets/bac-logo.png')} style={styles.logo} />
        <Text style={styles.title}>Welcome to BAC Platform</Text>
        <Text style={styles.subtitle}>Your gateway to Thito & Gradebook</Text>
        <Button
          title="Log In"
          size="large"
          style={styles.button}
          onPress={() => navigation.navigate('LoginForm')}
        />
        <Button
          title="Sign Up"
          variant="outline"
          size="large"
          style={styles.button}
          onPress={() => navigation.navigate('Register')}
        />
        <TouchableOpacity onPress={() => navigation.navigate('LearnMore')}>
          <Text style={styles.learnMore}>Learn More</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
}

export function LoginForm({ navigation }: { navigation: NavigationProp }) {
  const [activeTab, setActiveTab] = useState<'gradebook' | 'thito'>('thito');
  const [gradebookUnlocked, setGradebookUnlocked] = useState(false);
  const [showUnlockMsg, setShowUnlockMsg] = useState(false);
  const [unlockCode, setUnlockCode] = useState('');
  const [unlockError, setUnlockError] = useState('');
  const [showUnlockUI, setShowUnlockUI] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem(GRADEBOOK_UNLOCK_KEY).then(val => {
      if (val === 'true') setGradebookUnlocked(true);
    });
  }, []);

  const handleTabPress = (tab: 'gradebook' | 'thito') => {
    if (tab === 'gradebook' && !gradebookUnlocked) {
      setShowUnlockUI(true);
      return;
    }
    setActiveTab(tab);
  };

  const handleUnlock = async () => {
    if (/^\d{4}$/.test(unlockCode)) {
      await AsyncStorage.setItem(GRADEBOOK_UNLOCK_KEY, 'true');
      setGradebookUnlocked(true);
      setActiveTab('gradebook');
      setShowUnlockMsg(true);
      setUnlockCode('');
      setUnlockError('');
      setShowUnlockUI(false);
      setTimeout(() => setShowUnlockMsg(false), 2000);
    } else {
      setUnlockError('Enter a valid 4-digit code');
    }
  };

  return (
    <View style={styles.bacLoginWrapper}>
      <View style={styles.bacCard}>
        <View style={styles.bacTabSwitcher}>
          <TouchableOpacity
            style={[styles.bacTab, activeTab === 'thito' && styles.bacTabActive]}
            onPress={() => handleTabPress('thito')}
            activeOpacity={0.8}
          >
            <Text style={[styles.bacTabText, activeTab === 'thito' && styles.bacTabTextActive]}>Thito Login</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.bacTab, activeTab === 'gradebook' && styles.bacTabActive, !gradebookUnlocked && styles.bacTabLocked]}
            onPress={() => handleTabPress('gradebook')}
            disabled={!gradebookUnlocked}
            activeOpacity={gradebookUnlocked ? 0.8 : 1}
          >
            <Text style={[styles.bacTabText, activeTab === 'gradebook' && styles.bacTabTextActive, !gradebookUnlocked && styles.bacTabTextLocked]}>Gradebook Login</Text>
            {!gradebookUnlocked && <Text style={styles.lockIcon}>🔒</Text>}
          </TouchableOpacity>
        </View>
        <View style={{ width: '100%', marginTop: 24 }}>
          {activeTab === 'thito' ? (
            <ThitoLoginForm navigation={navigation} />
          ) : (
            <GradebookLoginForm navigation={navigation} />
          )}
        </View>
        {!gradebookUnlocked && showUnlockUI && (
          <View style={styles.bacUnlockModal}>
            <Text style={styles.sectionTitle}>Unlock Gradebook Login</Text>
            <Text style={{ marginBottom: 8, color: theme.colors.textSecondary, textAlign: 'center' }}>
              Enter the 4-digit code from your Thito dashboard to unlock Gradebook login.
            </Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8, justifyContent: 'center' }}>
              <TextInput
                style={[styles.input, { width: 80, marginRight: 8, textAlign: 'center', backgroundColor: '#fff', borderColor: theme.colors.primary }]}
                placeholder="1234"
                value={unlockCode}
                onChangeText={setUnlockCode}
                keyboardType="number-pad"
                maxLength={4}
              />
              <Button
                title="Unlock"
                size="small"
                onPress={handleUnlock}
                style={{ minWidth: 80 }}
              />
            </View>
            {unlockError ? <Text style={{ color: theme.colors.error, textAlign: 'center' }}>{unlockError}</Text> : null}
            {showUnlockMsg && (
              <Text style={{ color: theme.colors.success || 'green', fontWeight: 'bold', textAlign: 'center' }}>Gradebook Login now available!</Text>
            )}
            <TouchableOpacity onPress={() => setShowUnlockUI(false)} style={{ marginTop: 8 }}>
              <Text style={{ color: theme.colors.primary, textAlign: 'center', textDecorationLine: 'underline' }}>Cancel</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </View>
  );
}

function GradebookLoginForm({ navigation }: { navigation: NavigationProp }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    // Mock login logic for Gradebook
    setTimeout(() => {
      setLoading(false);
      if (email && password) {
        navigation.replace('Main');
      } else {
        setError('Invalid credentials.');
      }
    }, 1000);
  };

  return (
    <View>
      <Text style={styles.title}>Gradebook Login</Text>
      <TextInput
        style={styles.input}
        placeholder="Gradebook Email"
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
      <Button
        title={loading ? 'Logging In...' : 'Log In'}
        size="large"
        style={styles.button}
        onPress={handleLogin}
        disabled={loading}
      />
      <TouchableOpacity onPress={() => navigation.navigate('ForgotPassword')}>
        <Text style={styles.forgot}>Forgot Password?</Text>
      </TouchableOpacity>
      {error && <Text style={{ color: 'red', marginTop: 8 }}>{error}</Text>}
    </View>
  );
}

function ThitoLoginForm({ navigation }: { navigation: NavigationProp }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { signIn, loading, error } = useAuth();

  const handleLogin = async () => {
    try {
      await signIn(email, password);
      navigation.replace('Main');
    } catch (e) {
      Alert.alert('Login Failed', error || 'Invalid credentials.');
    }
  };

  return (
    <View>
      <Text style={styles.title}>Thito Login</Text>
      <TextInput
        style={styles.input}
        placeholder="BAC Email"
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
      <Button
        title={loading ? 'Logging In...' : 'Log In'}
        size="large"
        style={styles.button}
        onPress={handleLogin}
        disabled={loading}
      />
      <TouchableOpacity onPress={() => navigation.navigate('ForgotPassword')}>
        <Text style={styles.forgot}>Forgot Password?</Text>
      </TouchableOpacity>
      {error && <Text style={{ color: 'red', marginTop: 8 }}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    resizeMode: 'cover',
    backgroundColor: theme.colors.background,
  },
  overlay: {
    flex: 1,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  bacLoginWrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    minHeight: 500,
    paddingVertical: 32,
    backgroundColor: 'rgba(245, 248, 255, 0.95)',
  },
  bacCard: {
    width: '95%',
    maxWidth: 400,
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 28,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.10,
    shadowRadius: 16,
    elevation: 8,
    alignItems: 'center',
  },
  bacTabSwitcher: {
    flexDirection: 'row',
    width: '100%',
    backgroundColor: '#F4F8FF',
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  bacTab: {
    flex: 1,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomWidth: 3,
    borderBottomColor: 'transparent',
    flexDirection: 'row',
    transitionDuration: '200ms',
  },
  bacTabActive: {
    borderBottomColor: theme.colors.primary,
    backgroundColor: '#fff',
  },
  bacTabText: {
    fontSize: theme.typography.fontSize.lg,
    color: theme.colors.textSecondary,
    fontFamily: theme.typography.fontFamily.bold,
  },
  bacTabTextActive: {
    color: theme.colors.primary,
    fontWeight: 'bold',
  },
  bacTabLocked: {
    opacity: 0.5,
  },
  bacTabTextLocked: {
    color: theme.colors.textSecondary,
  },
  bacUnlockModal: {
    position: 'absolute',
    top: 60,
    left: 0,
    right: 0,
    marginHorizontal: 0,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 10,
    zIndex: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: theme.colors.primary,
  },
  logo: {
    width: 96,
    height: 96,
    marginBottom: theme.spacing.xl,
  },
  title: {
    fontSize: theme.typography.fontSize.xxl,
    fontFamily: theme.typography.fontFamily.bold,
    color: theme.colors.primary,
    marginBottom: theme.spacing.md,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.xl,
    textAlign: 'center',
  },
  button: {
    width: '100%',
    marginBottom: theme.spacing.md,
  },
  learnMore: {
    color: theme.colors.primary,
    fontSize: theme.typography.fontSize.md,
    marginTop: theme.spacing.md,
    textAlign: 'center',
    textDecorationLine: 'underline',
  },
  input: {
    width: '100%',
    height: 48,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.borderRadius.md,
    paddingHorizontal: theme.spacing.md,
    fontSize: theme.typography.fontSize.md,
    marginBottom: theme.spacing.md,
    color: theme.colors.text,
    backgroundColor: theme.colors.background,
  },
  forgot: {
    color: theme.colors.primary,
    fontSize: theme.typography.fontSize.md,
    marginTop: theme.spacing.md,
    textAlign: 'center',
    textDecorationLine: 'underline',
  },
  backButton: {
    position: 'absolute',
    top: 16,
    left: 16,
    zIndex: 10,
    backgroundColor: 'rgba(255,255,255,0.7)',
    borderRadius: 20,
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  backButtonText: {
    fontSize: 24,
    color: theme.colors.primary,
    fontWeight: 'bold',
    lineHeight: 28,
  },
  sectionTitle: {
    fontSize: theme.typography.fontSize.xl,
    fontFamily: theme.typography.fontFamily.bold,
    color: theme.colors.primary,
    marginBottom: theme.spacing.md,
  },
  lockIcon: {
    marginLeft: 4,
    fontSize: 16,
  },
}); 