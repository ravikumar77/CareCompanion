import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Alert,
  Animated
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Shield, Phone, MapPin, Clock, X, Heart, TriangleAlert as AlertTriangle } from 'lucide-react-native';

export default function EmergencyScreen() {
  const [countdown, setCountdown] = useState(10);
  const [isActivated, setIsActivated] = useState(false);
  const [pulseAnim] = useState(new Animated.Value(1));

  useEffect(() => {
    // Start countdown immediately
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          setIsActivated(true);
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    // Pulse animation
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.2,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
      ])
    );
    pulse.start();

    return () => {
      clearInterval(timer);
      pulse.stop();
    };
  }, []);

  useEffect(() => {
    if (isActivated) {
      // Simulate emergency activation
      Alert.alert(
        '🚨 Emergency Activated',
        'Emergency services have been contacted and your family has been notified.',
        [
          { 
            text: 'OK', 
            onPress: () => router.back()
          }
        ]
      );
    }
  }, [isActivated]);

  const handleCancel = () => {
    Alert.alert(
      'Cancel Emergency',
      'Are you sure you want to cancel the emergency alert?',
      [
        { text: 'Continue Emergency', style: 'cancel' },
        { 
          text: 'Cancel', 
          style: 'destructive',
          onPress: () => router.back()
        }
      ]
    );
  };

  const handleCallNow = () => {
    setIsActivated(true);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.cancelButton} onPress={handleCancel}>
            <X size={24} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        {/* Emergency Icon */}
        <Animated.View style={[styles.emergencyIcon, { transform: [{ scale: pulseAnim }] }]}>
          <Shield size={80} color="#FFFFFF" />
        </Animated.View>

        {/* Status */}
        <View style={styles.statusContainer}>
          {!isActivated ? (
            <>
              <Text style={styles.emergencyTitle}>Emergency SOS</Text>
              <Text style={styles.countdownText}>{countdown}</Text>
              <Text style={styles.statusText}>
                Emergency services will be contacted automatically
              </Text>
            </>
          ) : (
            <>
              <Text style={styles.emergencyTitle}>Emergency Activated</Text>
              <Text style={styles.statusText}>
                Help is on the way
              </Text>
            </>
          )}
        </View>

        {/* Emergency Info */}
        <View style={styles.infoContainer}>
          <View style={styles.infoItem}>
            <MapPin size={24} color="#FFFFFF" />
            <View style={styles.infoText}>
              <Text style={styles.infoLabel}>Location</Text>
              <Text style={styles.infoValue}>123 Oak Street, Springfield</Text>
            </View>
          </View>

          <View style={styles.infoItem}>
            <Clock size={24} color="#FFFFFF" />
            <View style={styles.infoText}>
              <Text style={styles.infoLabel}>Time</Text>
              <Text style={styles.infoValue}>{new Date().toLocaleTimeString()}</Text>
            </View>
          </View>

          <View style={styles.infoItem}>
            <Heart size={24} color="#FFFFFF" />
            <View style={styles.infoText}>
              <Text style={styles.infoLabel}>Medical Info</Text>
              <Text style={styles.infoValue}>Diabetes, Heart Condition</Text>
            </View>
          </View>
        </View>

        {/* Action Buttons */}
        {!isActivated && (
          <View style={styles.actionButtons}>
            <TouchableOpacity 
              style={styles.callNowButton}
              onPress={handleCallNow}
            >
              <Phone size={24} color="#FFFFFF" />
              <Text style={styles.callNowText}>Call Emergency Now</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.cancelEmergencyButton}
              onPress={handleCancel}
            >
              <Text style={styles.cancelEmergencyText}>Cancel Emergency</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Emergency Contacts Being Notified */}
        <View style={styles.contactsContainer}>
          <Text style={styles.contactsTitle}>Notifying:</Text>
          <View style={styles.contactsList}>
            <View style={styles.contactItem}>
              <Text style={styles.contactName}>• Emergency Services (911)</Text>
            </View>
            <View style={styles.contactItem}>
              <Text style={styles.contactName}>• Dr. Sarah Johnson</Text>
            </View>
            <View style={styles.contactItem}>
              <Text style={styles.contactName}>• Family Members</Text>
            </View>
          </View>
        </View>

        {/* Warning */}
        <View style={styles.warningContainer}>
          <AlertTriangle size={20} color="#FCD34D" />
          <Text style={styles.warningText}>
            Only use for real emergencies. False alarms may result in charges.
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#DC2626',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    justifyContent: 'space-between',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingTop: 10,
  },
  cancelButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  emergencyIcon: {
    alignSelf: 'center',
    marginVertical: 20,
  },
  statusContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  emergencyTitle: {
    fontSize: 32,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 16,
  },
  countdownText: {
    fontSize: 72,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 16,
  },
  statusText: {
    fontSize: 18,
    fontFamily: 'Inter-Regular',
    color: '#FFFFFF',
    textAlign: 'center',
    opacity: 0.9,
  },
  infoContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 16,
    padding: 20,
    marginVertical: 20,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  infoText: {
    marginLeft: 12,
    flex: 1,
  },
  infoLabel: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#FFFFFF',
    opacity: 0.8,
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
  },
  actionButtons: {
    marginVertical: 20,
  },
  callNowButton: {
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  callNowText: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#DC2626',
    marginLeft: 8,
  },
  cancelEmergencyButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  cancelEmergencyText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
  },
  contactsContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    padding: 16,
    marginVertical: 10,
  },
  contactsTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  contactsList: {
    marginLeft: 8,
  },
  contactItem: {
    marginBottom: 4,
  },
  contactName: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#FFFFFF',
    opacity: 0.9,
  },
  warningContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(252, 211, 77, 0.2)',
    padding: 12,
    borderRadius: 8,
    marginBottom: 20,
  },
  warningText: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#FCD34D',
    marginLeft: 8,
    flex: 1,
  },
});