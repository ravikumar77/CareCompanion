import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView, 
  Alert,
  Platform,
  Image
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { 
  Phone, 
  Shield, 
  Pill, 
  Calendar, 
  Smile, 
  Frown, 
  Meh,
  Heart,
  Bell,
  MapPin,
  Camera,
  MessageCircle,
  Clock
} from 'lucide-react-native';

export default function ElderCareScreen() {
  const [currentMood, setCurrentMood] = useState<string>('');
  const [medicationTaken, setMedicationTaken] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<string>('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    };
    
    updateTime();
    const interval = setInterval(updateTime, 1000);
    
    return () => clearInterval(interval);
  }, []);

  const handleSOSPress = () => {
    router.push('/emergency');
  };

  const handleVideoCall = () => {
    router.push('/video-call');
  };

  const handleMoodSelect = (mood: string) => {
    setCurrentMood(mood);
    Alert.alert('Mood Logged', `Your mood has been recorded as ${mood}. Your family has been notified.`);
  };

  const handleMedicationTaken = () => {
    setMedicationTaken(true);
    Alert.alert('✅ Great!', 'Medication marked as taken. Your family has been notified.');
  };

  const handleQuickCall = () => {
    Alert.alert('📞 Calling', 'Calling your primary contact...');
  };

  const handleCheckIn = () => {
    Alert.alert('💬 Check-in', 'Sending a quick "I\'m okay" message to your family.');
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header with Time */}
        <View style={styles.header}>
          <Image 
            source={{ uri: 'https://images.pexels.com/photos/3768131/pexels-photo-3768131.jpeg?auto=compress&cs=tinysrgb&w=400' }}
            style={styles.profileImage}
          />
          <View style={styles.headerText}>
            <Text style={styles.greeting}>Good Morning, Rose!</Text>
            <Text style={styles.timeText}>{currentTime}</Text>
            <Text style={styles.dateText}>{new Date().toLocaleDateString('en-US', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}</Text>
          </View>
        </View>

        {/* SOS Emergency Button */}
        <TouchableOpacity 
          style={styles.sosButton} 
          onPress={handleSOSPress}
          activeOpacity={0.8}
        >
          <Shield size={48} color="#FFFFFF" />
          <Text style={styles.sosText}>EMERGENCY SOS</Text>
          <Text style={styles.sosSubtext}>Press and hold for 3 seconds</Text>
        </TouchableOpacity>

        {/* Quick Actions Row */}
        <View style={styles.quickActionsRow}>
          <TouchableOpacity style={styles.quickAction} onPress={handleVideoCall}>
            <Phone size={32} color="#2563EB" />
            <Text style={styles.quickActionText}>Video Call</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.quickAction} onPress={handleQuickCall}>
            <MessageCircle size={32} color="#22C55E" />
            <Text style={styles.quickActionText}>Quick Call</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.quickAction} onPress={handleCheckIn}>
            <Heart size={32} color="#EF4444" />
            <Text style={styles.quickActionText}>Check-in</Text>
          </TouchableOpacity>
        </View>

        {/* Mood Tracking */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>How are you feeling today?</Text>
          <View style={styles.moodContainer}>
            <TouchableOpacity 
              style={[styles.moodButton, currentMood === 'happy' && styles.moodSelected]}
              onPress={() => handleMoodSelect('happy')}
            >
              <Smile size={48} color={currentMood === 'happy' ? '#FFFFFF' : '#22C55E'} />
              <Text style={[styles.moodText, currentMood === 'happy' && styles.moodTextSelected]}>
                Great
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.moodButton, currentMood === 'okay' && styles.moodSelected]}
              onPress={() => handleMoodSelect('okay')}
            >
              <Meh size={48} color={currentMood === 'okay' ? '#FFFFFF' : '#F59E0B'} />
              <Text style={[styles.moodText, currentMood === 'okay' && styles.moodTextSelected]}>
                Okay
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.moodButton, currentMood === 'sad' && styles.moodSelected]}
              onPress={() => handleMoodSelect('sad')}
            >
              <Frown size={48} color={currentMood === 'sad' ? '#FFFFFF' : '#EF4444'} />
              <Text style={[styles.moodText, currentMood === 'sad' && styles.moodTextSelected]}>
                Not Great
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Today's Schedule */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Today's Schedule</Text>
          
          {/* Medication Reminder */}
          <TouchableOpacity 
            style={[styles.scheduleCard, medicationTaken && styles.medicationTaken]}
            onPress={handleMedicationTaken}
            disabled={medicationTaken}
          >
            <View style={styles.scheduleIcon}>
              <Pill size={28} color={medicationTaken ? '#22C55E' : '#2563EB'} />
            </View>
            <View style={styles.scheduleInfo}>
              <Text style={styles.scheduleTitle}>
                {medicationTaken ? '✅ Morning Medication' : '💊 Morning Medication'}
              </Text>
              <Text style={styles.scheduleTime}>
                {medicationTaken ? 'Taken at 9:15 AM' : 'Due: 9:00 AM'}
              </Text>
            </View>
            <Clock size={20} color="#64748B" />
          </TouchableOpacity>

          {/* Appointment */}
          <View style={styles.scheduleCard}>
            <View style={styles.scheduleIcon}>
              <Calendar size={28} color="#2563EB" />
            </View>
            <View style={styles.scheduleInfo}>
              <Text style={styles.scheduleTitle}>Doctor Appointment</Text>
              <Text style={styles.scheduleTime}>Tomorrow at 2:00 PM</Text>
              <Text style={styles.scheduleLocation}>Dr. Johnson - Cardiology</Text>
            </View>
            <Bell size={20} color="#64748B" />
          </View>

          {/* Exercise Reminder */}
          <View style={styles.scheduleCard}>
            <View style={styles.scheduleIcon}>
              <Heart size={28} color="#EF4444" />
            </View>
            <View style={styles.scheduleInfo}>
              <Text style={styles.scheduleTitle}>Daily Walk</Text>
              <Text style={styles.scheduleTime}>3:00 PM - 30 minutes</Text>
              <Text style={styles.scheduleLocation}>Around the neighborhood</Text>
            </View>
            <MapPin size={20} color="#64748B" />
          </View>
        </View>

        {/* Weather & Location */}
        <View style={styles.weatherCard}>
          <View style={styles.weatherInfo}>
            <Text style={styles.weatherTemp}>72°F</Text>
            <Text style={styles.weatherDesc}>Sunny</Text>
            <Text style={styles.weatherLocation}>📍 Home - Safe</Text>
          </View>
          <Image 
            source={{ uri: 'https://images.pexels.com/photos/281260/pexels-photo-281260.jpeg?auto=compress&cs=tinysrgb&w=400' }}
            style={styles.weatherImage}
          />
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
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 20,
    paddingHorizontal: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    marginVertical: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: 16,
  },
  headerText: {
    flex: 1,
  },
  greeting: {
    fontSize: 28,
    fontFamily: 'Inter-Bold',
    color: '#1E293B',
    marginBottom: 4,
  },
  timeText: {
    fontSize: 24,
    fontFamily: 'Inter-SemiBold',
    color: '#2563EB',
    marginBottom: 2,
  },
  dateText: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#64748B',
  },
  sosButton: {
    backgroundColor: '#DC2626',
    paddingVertical: 32,
    paddingHorizontal: 40,
    borderRadius: 24,
    alignItems: 'center',
    marginVertical: 20,
    shadowColor: '#DC2626',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 12,
  },
  sosText: {
    fontSize: 28,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
    marginTop: 12,
  },
  sosSubtext: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#FFFFFF',
    opacity: 0.9,
    marginTop: 4,
  },
  quickActionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 16,
  },
  quickAction: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingVertical: 24,
    marginHorizontal: 6,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  quickActionText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#1E293B',
    marginTop: 8,
    textAlign: 'center',
  },
  section: {
    marginVertical: 16,
  },
  sectionTitle: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
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
    paddingVertical: 24,
    marginHorizontal: 6,
    borderRadius: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  moodSelected: {
    backgroundColor: '#2563EB',
    transform: [{ scale: 1.05 }],
  },
  moodText: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#1E293B',
    marginTop: 12,
  },
  moodTextSelected: {
    color: '#FFFFFF',
  },
  scheduleCard: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  medicationTaken: {
    backgroundColor: '#F0FDF4',
    borderWidth: 2,
    borderColor: '#22C55E',
  },
  scheduleIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  scheduleInfo: {
    flex: 1,
  },
  scheduleTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#1E293B',
    marginBottom: 4,
  },
  scheduleTime: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#2563EB',
    marginBottom: 2,
  },
  scheduleLocation: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#64748B',
  },
  weatherCard: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  weatherInfo: {
    flex: 1,
  },
  weatherTemp: {
    fontSize: 36,
    fontFamily: 'Inter-Bold',
    color: '#1E293B',
    marginBottom: 4,
  },
  weatherDesc: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#64748B',
    marginBottom: 8,
  },
  weatherLocation: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#22C55E',
  },
  weatherImage: {
    width: 80,
    height: 80,
    borderRadius: 16,
  },
});