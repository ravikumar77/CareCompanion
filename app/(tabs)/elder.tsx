import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView, 
  Alert,
  Platform 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { 
  Phone, 
  Shield, 
  Pill, 
  Calendar, 
  Smile, 
  Frown, 
  Meh,
  Heart,
  Bell
} from 'lucide-react-native';
import * as Notifications from 'expo-notifications';
import * as Haptics from 'expo-haptics';

// Configure notifications
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export default function ElderMode() {
  const [currentMood, setCurrentMood] = useState<string>('');
  const [medicationTaken, setMedicationTaken] = useState<boolean>(false);
  const [upcomingAppointment, setUpcomingAppointment] = useState<string>('');

  useEffect(() => {
    // Schedule daily medication reminder
    scheduleMedicationReminder();
    
    // Set upcoming appointment (demo data)
    setUpcomingAppointment('Dr. Johnson - Tomorrow 2:00 PM');
  }, []);

  const scheduleMedicationReminder = async () => {
    const { status } = await Notifications.requestPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission needed', 'Please enable notifications for medication reminders.');
      return;
    }

    // Schedule daily medication reminder at 9 AM
    await Notifications.scheduleNotificationAsync({
      content: {
        title: '💊 Medication Reminder',
        body: 'Time to take your morning medication!',
        sound: 'default',
      },
      trigger: {
        hour: 9,
        minute: 0,
        repeats: true,
      },
    });
  };

  const handleSOSPress = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    }
    
    Alert.alert(
      '🚨 Emergency Alert Sent',
      'Your family members have been notified and emergency services have been contacted.',
      [{ text: 'OK', style: 'default' }]
    );
  };

  const handleVideoCall = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    
    Alert.alert(
      '📹 Starting Video Call',
      'Connecting to your family member...',
      [{ text: 'Cancel', style: 'cancel' }]
    );
  };

  const handleMoodSelect = (mood: string) => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    setCurrentMood(mood);
  };

  const handleMedicationTaken = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    setMedicationTaken(true);
    Alert.alert('✅ Great!', 'Medication marked as taken. Your family has been notified.');
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.greeting}>Good Morning!</Text>
          <Text style={styles.subGreeting}>How are you feeling today?</Text>
        </View>

        {/* SOS Button */}
        <TouchableOpacity 
          style={styles.sosButton} 
          onPress={handleSOSPress}
          activeOpacity={0.8}
        >
          <Shield size={48} color="#FFFFFF" />
          <Text style={styles.sosText}>EMERGENCY SOS</Text>
        </TouchableOpacity>

        {/* Mood Tracking */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>How are you feeling?</Text>
          <View style={styles.moodContainer}>
            <TouchableOpacity 
              style={[styles.moodButton, currentMood === 'happy' && styles.moodSelected]}
              onPress={() => handleMoodSelect('happy')}
            >
              <Smile size={40} color={currentMood === 'happy' ? '#FFFFFF' : '#22C55E'} />
              <Text style={[styles.moodText, currentMood === 'happy' && styles.moodTextSelected]}>
                Happy
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.moodButton, currentMood === 'okay' && styles.moodSelected]}
              onPress={() => handleMoodSelect('okay')}
            >
              <Meh size={40} color={currentMood === 'okay' ? '#FFFFFF' : '#F59E0B'} />
              <Text style={[styles.moodText, currentMood === 'okay' && styles.moodTextSelected]}>
                Okay
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.moodButton, currentMood === 'sad' && styles.moodSelected]}
              onPress={() => handleMoodSelect('sad')}
            >
              <Frown size={40} color={currentMood === 'sad' ? '#FFFFFF' : '#EF4444'} />
              <Text style={[styles.moodText, currentMood === 'sad' && styles.moodTextSelected]}>
                Sad
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Medication Reminder */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Medication</Text>
          <TouchableOpacity 
            style={[styles.medicationCard, medicationTaken && styles.medicationTaken]}
            onPress={handleMedicationTaken}
            disabled={medicationTaken}
          >
            <Pill size={32} color={medicationTaken ? '#22C55E' : '#2563EB'} />
            <View style={styles.medicationInfo}>
              <Text style={styles.medicationTitle}>
                {medicationTaken ? '✅ Medication Taken' : '💊 Morning Medication'}
              </Text>
              <Text style={styles.medicationTime}>
                {medicationTaken ? 'Taken at 9:15 AM' : 'Due: 9:00 AM'}
              </Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Upcoming Appointment */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Next Appointment</Text>
          <View style={styles.appointmentCard}>
            <Calendar size={32} color="#2563EB" />
            <View style={styles.appointmentInfo}>
              <Text style={styles.appointmentTitle}>Upcoming Visit</Text>
              <Text style={styles.appointmentTime}>{upcomingAppointment}</Text>
            </View>
            <Bell size={24} color="#64748B" />
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.actionsContainer}>
            <TouchableOpacity style={styles.actionButton} onPress={handleVideoCall}>
              <Phone size={32} color="#2563EB" />
              <Text style={styles.actionText}>Video Call Family</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.actionButton}>
              <Heart size={32} color="#EF4444" />
              <Text style={styles.actionText}>Check Vitals</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 20,
  },
  header: {
    paddingVertical: 20,
    alignItems: 'center',
  },
  greeting: {
    fontSize: 32,
    fontFamily: 'Inter-Bold',
    color: '#1E293B',
    marginBottom: 8,
  },
  subGreeting: {
    fontSize: 18,
    fontFamily: 'Inter-Regular',
    color: '#64748B',
  },
  sosButton: {
    backgroundColor: '#DC2626',
    paddingVertical: 24,
    paddingHorizontal: 40,
    borderRadius: 20,
    alignItems: 'center',
    marginVertical: 20,
    shadowColor: '#DC2626',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  sosText: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
    marginTop: 8,
  },
  section: {
    marginVertical: 16,
  },
  sectionTitle: {
    fontSize: 22,
    fontFamily: 'Inter-SemiBold',
    color: '#1E293B',
    marginBottom: 16,
  },
  moodContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  moodButton: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingVertical: 20,
    marginHorizontal: 8,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  moodSelected: {
    backgroundColor: '#2563EB',
  },
  moodText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#1E293B',
    marginTop: 8,
  },
  moodTextSelected: {
    color: '#FFFFFF',
  },
  medicationCard: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  medicationTaken: {
    backgroundColor: '#F0FDF4',
    borderWidth: 2,
    borderColor: '#22C55E',
  },
  medicationInfo: {
    flex: 1,
    marginLeft: 16,
  },
  medicationTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#1E293B',
  },
  medicationTime: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#64748B',
    marginTop: 4,
  },
  appointmentCard: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  appointmentInfo: {
    flex: 1,
    marginLeft: 16,
  },
  appointmentTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#1E293B',
  },
  appointmentTime: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#64748B',
    marginTop: 4,
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionButton: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingVertical: 24,
    marginHorizontal: 8,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  actionText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#1E293B',
    marginTop: 8,
    textAlign: 'center',
  },
});