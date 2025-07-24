import React from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

type RootStackParamList = {
  Register: undefined;
  TermsAndPrivacy: {
    section: 'terms' | 'privacy';
  };
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const LearnMoreScreen = ({ navigation }: { navigation: NavigationProp }) => {
  const insets = useSafeAreaInsets();
  return (
    <ScrollView 
      contentContainerStyle={[
        styles.container,
        {
          paddingTop: insets.top + 20,
          paddingBottom: insets.bottom + 20,
        }
      ]}
    >
      <Image source={require('../../assets/bac-logo.png')} style={styles.logo} />
      <Text style={styles.header}>Explore Botswana Accountancy College</Text>

      <View style={styles.card}>
        <Text style={styles.title}>📚 Academic Programs</Text>
        <Text style={styles.content}>
          Dive into programs like BSc Computing, BCom Accounting, ACCA, CIMA and more. BAC offers qualifications that empower you globally.
        </Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.title}>🏫 Campus Life</Text>
        <Text style={styles.content}>
          Experience a vibrant student life with clubs, housing, cafeteria vibes, and a modern library. Your journey starts here.
        </Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.title}>📝 Admission & Registration</Text>
        <Text style={styles.content}>
          Simple steps to become a BAC student. Apply online or walk into any BAC campus and join the legacy.
        </Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.title}>📄 Resources</Text>
        <Text style={styles.content}>
          Grab your PDF prospectus, academic calendar, or detailed course catalog — available anytime.
        </Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.title}>📞 Contact Us</Text>
<Text style={styles.content}>
  Gaborone Campus: +267 395 3062{'\n'}Email: admissions@bac.ac.bw
</Text>
      </View>

      <TouchableOpacity 
        style={styles.button}
        onPress={() => navigation.replace('Register')}
      >
        <Text style={styles.buttonText}>Apply Now</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingTop: 60, // Add extra padding for status bar
    paddingBottom: 34, // Add extra padding for bottom navigation/home indicator
    backgroundColor: '#edf2f7',
    alignItems: 'center',
  },
  logo: {
    width: 100,
    height: 100,
    resizeMode: 'contain',
    marginBottom: 10,
  },
  header: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#0a2c61',
    textAlign: 'center',
    marginBottom: 20,
  },
  card: {
    backgroundColor: '#ffffff',
    width: '100%',
    padding: 16,
    borderRadius: 14,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 6,
    color: '#1a202c',
  },
  content: {
    fontSize: 15,
    lineHeight: 22,
    color: '#4a5568',
  },
  button: {
    marginTop: 30,
    backgroundColor: '#004080',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 25,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default LearnMoreScreen;
