import React, { useEffect, useRef, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, Button, ActivityIndicator, Platform } from 'react-native';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useAuth } from '../../context/AuthContext';

// Default content in case file loading fails
const DEFAULT_CONTENT = `Terms and Conditions\n\nLoading failed. Please try again.`;

type RootStackParamList = {
  Login: undefined;
  Register: { hasAcceptedTerms?: boolean };
  TermsAndPrivacy: {
    section?: 'terms' | 'privacy';
  };
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

interface TermsAndPrivacyParams {
  section?: 'terms' | 'privacy';
  hasAccepted?: boolean;
}

export default function TermsAndPrivacyScreen() {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<RouteProp<Record<string, TermsAndPrivacyParams>, string>>();
  const insets = useSafeAreaInsets();
  const section = route.params?.section;
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const scrollViewRef = useRef<ScrollView>(null);
  const termsRef = useRef<View>(null);
  const privacyRef = useRef<View>(null);
  const [termsY, setTermsY] = useState(0);
  const [privacyY, setPrivacyY] = useState(0);
  const [showSuccess, setShowSuccess] = useState(false);

  const loadContent = async () => {
    try {
      setLoading(true);
      setError('');

      const content = `Terms and Conditions

1. Acceptance of Terms
By accessing and using the BAC Platform, you agree to be bound by these Terms and Conditions. If you do not agree with any part of these terms, you may not use our services.

2. User Registration
2.1 You must provide accurate and complete information when registering
2.2 You are responsible for maintaining the confidentiality of your account
2.3 You must be at least 18 years old to register

3. Educational Services
3.1 BAC provides various educational programs and services
3.2 Course availability may vary
3.3 We reserve the right to modify course content

Privacy Policy

1. Information Collection
1.1 We collect personal information during registration
1.2 Academic records and performance data are maintained
1.3 Usage data is collected for platform improvement

2. Data Protection
2.1 Your information is protected using industry-standard security measures
2.2 We do not sell your personal information
2.3 Access to your data is strictly controlled

3. Communication
3.1 We may contact you regarding your courses
3.2 You can opt-out of non-essential communications
3.3 Emergency notifications cannot be opted out`;

      setContent(content);
    } catch (e) {
      console.error('Error loading content:', e);
      setContent(DEFAULT_CONTENT);
      setError('Failed to load terms and privacy policy. Please check your internet connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadContent();
  }, []);

  useEffect(() => {
    // Scroll to the relevant section after layout
    if (!loading && section && scrollViewRef.current) {
      setTimeout(() => {
        if (section === 'terms' && termsY) {
          scrollViewRef.current?.scrollTo({ y: termsY, animated: true });
        } else if (section === 'privacy' && privacyY) {
          scrollViewRef.current?.scrollTo({ y: privacyY, animated: true });
        }
      }, 300);
    }
  }, [loading, section, termsY, privacyY]);

  const renderContent = () => {
    const containerStyle = {
      ...styles.container,
      paddingTop: insets.top,
      paddingBottom: insets.bottom,
    };

    if (loading) {
      return (
        <View style={[containerStyle, styles.centerContent]}>
          <ActivityIndicator size="large" color="#004080" />
          <Text style={styles.loadingText}>Loading content...</Text>
        </View>
      );
    }
    
    return (
      <View style={containerStyle}>
        <ScrollView 
          ref={scrollViewRef} 
          contentContainerStyle={[
            styles.content,
            { paddingBottom: 100 + insets.bottom }
          ]}
        >
          {error && (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>{error}</Text>
              <Button 
                title="Try Again" 
                onPress={loadContent}
              />
            </View>
          )}
          <View
            ref={termsRef}
            onLayout={e => setTermsY(e.nativeEvent.layout.y)}
          >
            <Text style={styles.title}>Terms and Conditions</Text>
          </View>
          <Text style={styles.text}>
            {content.split('Privacy Policy')[0]}
          </Text>
          <View
            ref={privacyRef}
            onLayout={e => setPrivacyY(e.nativeEvent.layout.y)}
          >
            <Text style={styles.title}>Privacy Policy</Text>
          </View>
          <Text style={styles.text}>
            {content.split('Privacy Policy')[1]}
          </Text>
        </ScrollView>
        <View style={[
            styles.buttonContainer,
            {
              bottom: insets.bottom,
              paddingBottom: insets.bottom + 16
            }
          ]}>
          <View style={styles.completionContainer}>
            {showSuccess && (
              <Text style={styles.successMessage}>Registration completed successfully!</Text>
            )}
            <Button
              title="Accept & Continue"
              onPress={() => {
                // Navigate back to Register screen with acceptance status
                navigation.navigate('Register', { hasAcceptedTerms: true });
              }}
            />
          </View>
        </View>
      </View>
    );
  };

  return renderContent();
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    position: 'relative',
  },
  completionContainer: {
    alignItems: 'center',
    width: '100%',
  },
  successMessage: {
    color: '#4CAF50',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  errorContainer: {
    backgroundColor: '#fff8f8',
    padding: 16,
    marginBottom: 20,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ffcdd2',
  },
  centerContent: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  errorText: {
    color: 'red',
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
  },
  content: {
    padding: 24,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 12,
    marginTop: 24,
  },
  text: {
    fontSize: 16,
    marginBottom: 16,
    color: '#333',
  },
  buttonContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: 16,
    paddingTop: 16,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderColor: '#eee',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
}); 