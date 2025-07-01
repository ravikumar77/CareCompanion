import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Picker
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { auth } from '../../utils/firebase';
import { 
  registerElderUser, 
  registerFamilyUser, 
  RelationType 
} from '../../utils/userService';
import { router } from 'expo-router';
import { Eye, EyeOff, Mail, Lock, User, Heart, Users, Hash } from 'lucide-react-native';



export default function RegisterScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [userType, setUserType] = useState<'elder' | 'family'>('elder');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // New state variables
  const [age, setAge] = useState(''); // Elder-specific
  const [elderCode, setElderCode] = useState(''); // Family-specific
  const [relation, setRelation] = useState<RelationType>('son'); // Family-specific
  const [relationDescription, setRelationDescription] = useState(''); // Family-specific

  const handleRegister = async () => {
    if (!email || !password || !confirmPassword || !displayName) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    if (password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters long');
      return;
    }

    // Additional validation based on user type
    if (userType === 'elder' && !age) {
      Alert.alert('Error', 'Please enter your age');
      return;
    }

    if (userType === 'family' && !elderCode.trim()) {
      Alert.alert('Error', 'Please enter the Elder Code to link your account');
      return;
    }

    setLoading(true);
    try {
      if (userType === 'elder') {
        // Register as Elder
        const elderUser = await registerElderUser(
          email,
          password,
          displayName,
          parseInt(age),
          phoneNumber || undefined
        );

        Alert.alert(
          'Elder Account Created!', 
          `Your Elder Code is: ${elderUser.elderCode}\n\nShare this code with your family members so they can link their accounts to yours.`,
          [{ text: 'OK', onPress: () => router.replace('/(tabs)') }]
        );
      } else {
        // Register as Family Member
        await registerFamilyUser(
          email,
          password,
          displayName,
          relation,
          elderCode.trim().toUpperCase(),
          relationDescription || undefined,
          phoneNumber || undefined
        );

        Alert.alert(
          'Family Account Created!', 
          'Your account has been created and linked to the elder. You may need approval from the elder to access all features.',
          [{ text: 'OK', onPress: () => router.replace('/(tabs)') }]
        );
      }
    } catch (error: any) {
      Alert.alert('Registration Failed', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          {/* Logo and Title */}
          <View style={styles.headerContainer}>
            <View style={styles.logoContainer}>
              <Heart size={64} color="#2563EB" />
            </View>
            <Text style={styles.title}>Family Care Companion</Text>
            <Text style={styles.subtitle}>Create your account to get started</Text>
          </View>

          {/* Registration Form */}
          <View style={styles.formContainer}>
            <View style={styles.inputContainer}>
              <User size={20} color="#6B7280" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Full Name"
                value={displayName}
                onChangeText={setDisplayName}
                autoCapitalize="words"
              />
            </View>

            <View style={styles.inputContainer}>
              <Mail size={20} color="#6B7280" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Email address"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>

            <View style={styles.inputContainer}>
              <Lock size={20} color="#6B7280" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                autoCapitalize="none"
              />
              <TouchableOpacity
                style={styles.eyeIcon}
                onPress={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff size={20} color="#6B7280" />
                ) : (
                  <Eye size={20} color="#6B7280" />
                )}
              </TouchableOpacity>
            </View>

            <View style={styles.inputContainer}>
              <Lock size={20} color="#6B7280" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Confirm Password"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry={!showConfirmPassword}
                autoCapitalize="none"
              />
              <TouchableOpacity
                style={styles.eyeIcon}
                onPress={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? (
                  <EyeOff size={20} color="#6B7280" />
                ) : (
                  <Eye size={20} color="#6B7280" />
                )}
              </TouchableOpacity>
            </View>

            {/* User Type Selection */}
            <View style={styles.userTypeContainer}>
              <Text style={styles.userTypeLabel}>I am:</Text>
              <View style={styles.userTypeButtons}>
                <TouchableOpacity
                  style={[
                    styles.userTypeButton,
                    userType === 'elder' && styles.userTypeButtonActive
                  ]}
                  onPress={() => setUserType('elder')}
                >
                  <Heart size={20} color={userType === 'elder' ? '#FFFFFF' : '#2563EB'} />
                  <Text style={[
                    styles.userTypeButtonText,
                    userType === 'elder' && styles.userTypeButtonTextActive
                  ]}>Elder</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.userTypeButton,
                    userType === 'family' && styles.userTypeButtonActive
                  ]}
                  onPress={() => setUserType('family')}
                >
                  <Users size={20} color={userType === 'family' ? '#FFFFFF' : '#2563EB'} />
                  <Text style={[
                    styles.userTypeButtonText,
                    userType === 'family' && styles.userTypeButtonTextActive
                  ]}>Family Caregiver</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Elder-specific fields */}
            {userType === 'elder' && (
              <View style={styles.inputContainer}>
                <User size={20} color="#6B7280" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Age"
                  value={age}
                  onChangeText={setAge}
                  keyboardType="numeric"
                />
              </View>
            )}

            {/* Family-specific fields */}
            {userType === 'family' && (
              <>
                <View style={styles.inputContainer}>
                  <Hash size={20} color="#6B7280" style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    placeholder="Elder Code (e.g., E1234-ABCD)"
                    value={elderCode}
                    onChangeText={setElderCode}
                    autoCapitalize="characters"
                  />
                </View>

                <View style={styles.inputContainer}>
                  <Heart size={20} color="#6B7280" style={styles.inputIcon} />
                  <Text style={styles.userTypeLabel}>Relationship:</Text>
                </View>
                <View style={styles.relationContainer}>
                  {(['son', 'daughter', 'spouse', 'sibling', 'grandchild', 'caregiver', 'other'] as RelationType[]).map((rel) => (
                    <TouchableOpacity
                      key={rel}
                      style={[styles.relationOption, relation === rel && styles.relationOptionSelected]}
                      onPress={() => setRelation(rel)}
                    >
                      <Text style={[styles.relationText, relation === rel && styles.relationTextSelected]}>
                        {rel.charAt(0).toUpperCase() + rel.slice(1)}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>

                {relation === 'other' && (
                  <View style={styles.inputContainer}>
                    <User size={20} color="#6B7280" style={styles.inputIcon} />
                    <TextInput
                      style={styles.input}
                      placeholder="Describe your relationship"
                      value={relationDescription}
                      onChangeText={setRelationDescription}
                    />
                  </View>
                )}
              </>
            )}

            <TouchableOpacity
              style={[styles.registerButton, loading && styles.registerButtonDisabled]}
              onPress={handleRegister}
              disabled={loading}
            >
              <Text style={styles.registerButtonText}>
                {loading ? 'Creating Account...' : 'Create Account'}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Sign In Link */}
          <View style={styles.signinContainer}>
            <Text style={styles.signinText}>Already have an account? </Text>
            <TouchableOpacity onPress={() => router.push('/(auth)/login')}>
              <Text style={styles.signinLink}>Sign In</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  keyboardView: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  headerContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logoContainer: {
    width: 120,
    height: 120,
    backgroundColor: '#EFF6FF',
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1E293B',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#64748B',
    textAlign: 'center',
  },
  formContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 16,
    backgroundColor: '#F8FAFC',
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#1E293B',
  },
  eyeIcon: {
    padding: 4,
  },
  userTypeContainer: {
    marginBottom: 24,
  },
  userTypeLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 12,
  },
  userTypeButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  userTypeButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#2563EB',
    backgroundColor: '#FFFFFF',
  },
  userTypeButtonActive: {
    backgroundColor: '#2563EB',
  },
  userTypeButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2563EB',
    marginLeft: 8,
  },
  userTypeButtonTextActive: {
    color: '#FFFFFF',
  },
  registerButton: {
    backgroundColor: '#2563EB',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  registerButtonDisabled: {
    backgroundColor: '#94A3B8',
  },
  registerButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  signinContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  signinText: {
    color: '#6B7280',
    fontSize: 14,
  },
  signinLink: {
    color: '#2563EB',
    fontSize: 14,
    fontWeight: '600',
  },
  relationContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  relationOption: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    backgroundColor: '#F9FAFB',
  },
  relationOptionSelected: {
    borderColor: '#2563EB',
    backgroundColor: '#EBF4FF',
  },
  relationText: {
    fontSize: 14,
    color: '#6B7280',
  },
  relationTextSelected: {
    color: '#2563EB',
    fontWeight: '600',
  },
});