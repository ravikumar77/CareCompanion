import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  Dimensions
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Heart, Users, Shield } from 'lucide-react-native';

const { width } = Dimensions.get('window');

export default function AuthIndexScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.logoContainer}>
            <Heart size={64} color="#2563EB" />
          </View>
          <Text style={styles.title}>Family Care Companion</Text>
          <Text style={styles.subtitle}>
            Connecting families through care, ensuring peace of mind for everyone
          </Text>
        </View>

        {/* Features */}
        <View style={styles.featuresContainer}>
          <View style={styles.feature}>
            <Shield size={32} color="#059669" />
            <Text style={styles.featureTitle}>Emergency Support</Text>
            <Text style={styles.featureDescription}>
              Instant SOS alerts and emergency response
            </Text>
          </View>
          
          <View style={styles.feature}>
            <Heart size={32} color="#EF4444" />
            <Text style={styles.featureTitle}>Health Monitoring</Text>
            <Text style={styles.featureDescription}>
              Track medications, mood, and wellness
            </Text>
          </View>
          
          <View style={styles.feature}>
            <Users size={32} color="#7C3AED" />
            <Text style={styles.featureTitle}>Family Connection</Text>
            <Text style={styles.featureDescription}>
              Stay connected with video calls and check-ins
            </Text>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionContainer}>
          <TouchableOpacity 
            style={styles.primaryButton}
            onPress={() => router.push('/(auth)/register')}
          >
            <Text style={styles.primaryButtonText}>Get Started</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.secondaryButton}
            onPress={() => router.push('/(auth)/login')}
          >
            <Text style={styles.secondaryButtonText}>Sign In</Text>
          </TouchableOpacity>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Trusted by families worldwide for elder care
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: 'space-between',
  },
  header: {
    alignItems: 'center',
    paddingTop: 40,
  },
  logoContainer: {
    width: 120,
    height: 120,
    backgroundColor: '#EBF4FF',
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1E293B',
    textAlign: 'center',
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 18,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 26,
    paddingHorizontal: 20,
  },
  featuresContainer: {
    paddingVertical: 40,
  },
  feature: {
    alignItems: 'center',
    marginBottom: 32,
    paddingHorizontal: 20,
  },
  featureTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1E293B',
    marginTop: 12,
    marginBottom: 8,
  },
  featureDescription: {
    fontSize: 16,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 22,
  },
  actionContainer: {
    paddingBottom: 20,
  },
  primaryButton: {
    backgroundColor: '#2563EB',
    borderRadius: 16,
    paddingVertical: 18,
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
  secondaryButton: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingVertical: 18,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#E2E8F0',
  },
  secondaryButtonText: {
    color: '#2563EB',
    fontSize: 18,
    fontWeight: '600',
  },
  footer: {
    alignItems: 'center',
    paddingBottom: 20,
  },
  footerText: {
    fontSize: 14,
    color: '#94A3B8',
    textAlign: 'center',
  },
});