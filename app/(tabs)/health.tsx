import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView, 
  Alert,
  Image
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { 
  Heart, 
  Activity, 
  Thermometer, 
  Droplets, 
  Brain, 
  Eye, 
  Pill,
  Calendar,
  TrendingUp,
  Plus,
  Clock,
  Target
} from 'lucide-react-native';

export default function HealthScreen() {
  const [vitals, setVitals] = useState({
    heartRate: 72,
    bloodPressure: '120/80',
    temperature: 98.6,
    oxygenSaturation: 98,
    weight: 165,
    bloodSugar: 95,
  });

  const [medications] = useState([
    { id: 1, name: 'Lisinopril', dosage: '10mg', frequency: 'Once daily', nextDose: '9:00 AM', taken: true },
    { id: 2, name: 'Metformin', dosage: '500mg', frequency: 'Twice daily', nextDose: '6:00 PM', taken: false },
    { id: 3, name: 'Vitamin D3', dosage: '1000 IU', frequency: 'Once daily', nextDose: '9:00 AM', taken: true },
  ]);

  const [appointments] = useState([
    { id: 1, doctor: 'Dr. Sarah Johnson', specialty: 'Cardiology', date: 'Tomorrow', time: '2:00 PM', type: 'Follow-up' },
    { id: 2, doctor: 'Dr. Michael Chen', specialty: 'Ophthalmology', date: 'Next Week', time: '10:30 AM', type: 'Annual Exam' },
  ]);

  const handleAddVital = (type: string) => {
    Alert.alert(
      `Record ${type}`,
      `Would you like to record a new ${type.toLowerCase()} reading?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Record', style: 'default' }
      ]
    );
  };

  const handleMedicationReminder = (medication: any) => {
    Alert.alert(
      'Medication Reminder',
      `Time to take ${medication.name} (${medication.dosage})`,
      [
        { text: 'Remind Later', style: 'cancel' },
        { text: 'Mark as Taken', style: 'default' }
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Health Dashboard</Text>
          <Text style={styles.subtitle}>Track your wellness journey</Text>
        </View>

        {/* Today's Overview */}
        <View style={styles.overviewCard}>
          <Text style={styles.cardTitle}>Today's Health Summary</Text>
          <View style={styles.overviewGrid}>
            <View style={styles.overviewItem}>
              <Heart size={24} color="#EF4444" />
              <Text style={styles.overviewValue}>Good</Text>
              <Text style={styles.overviewLabel}>Overall</Text>
            </View>
            <View style={styles.overviewItem}>
              <Pill size={24} color="#2563EB" />
              <Text style={styles.overviewValue}>2/3</Text>
              <Text style={styles.overviewLabel}>Medications</Text>
            </View>
            <View style={styles.overviewItem}>
              <Activity size={24} color="#22C55E" />
              <Text style={styles.overviewValue}>3,420</Text>
              <Text style={styles.overviewLabel}>Steps</Text>
            </View>
            <View style={styles.overviewItem}>
              <Target size={24} color="#F59E0B" />
              <Text style={styles.overviewValue}>85%</Text>
              <Text style={styles.overviewLabel}>Goals</Text>
            </View>
          </View>
        </View>

        {/* Vital Signs */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Vital Signs</Text>
            <TouchableOpacity style={styles.addButton} onPress={() => handleAddVital('Vital Sign')}>
              <Plus size={20} color="#2563EB" />
            </TouchableOpacity>
          </View>
          
          <View style={styles.vitalsGrid}>
            <TouchableOpacity 
              style={styles.vitalCard} 
              onPress={() => handleAddVital('Heart Rate')}
            >
              <Heart size={28} color="#EF4444" />
              <Text style={styles.vitalValue}>{vitals.heartRate}</Text>
              <Text style={styles.vitalUnit}>BPM</Text>
              <Text style={styles.vitalLabel}>Heart Rate</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.vitalCard}
              onPress={() => handleAddVital('Blood Pressure')}
            >
              <Activity size={28} color="#2563EB" />
              <Text style={styles.vitalValue}>{vitals.bloodPressure}</Text>
              <Text style={styles.vitalUnit}>mmHg</Text>
              <Text style={styles.vitalLabel}>Blood Pressure</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.vitalCard}
              onPress={() => handleAddVital('Temperature')}
            >
              <Thermometer size={28} color="#F59E0B" />
              <Text style={styles.vitalValue}>{vitals.temperature}</Text>
              <Text style={styles.vitalUnit}>°F</Text>
              <Text style={styles.vitalLabel}>Temperature</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.vitalCard}
              onPress={() => handleAddVital('Oxygen Saturation')}
            >
              <Droplets size={28} color="#22C55E" />
              <Text style={styles.vitalValue}>{vitals.oxygenSaturation}</Text>
              <Text style={styles.vitalUnit}>%</Text>
              <Text style={styles.vitalLabel}>Oxygen Sat</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Medications */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Today's Medications</Text>
          {medications.map((medication) => (
            <TouchableOpacity 
              key={medication.id} 
              style={[styles.medicationCard, medication.taken && styles.medicationTaken]}
              onPress={() => handleMedicationReminder(medication)}
            >
              <View style={styles.medicationIcon}>
                <Pill size={24} color={medication.taken ? '#22C55E' : '#2563EB'} />
              </View>
              <View style={styles.medicationInfo}>
                <Text style={styles.medicationName}>{medication.name}</Text>
                <Text style={styles.medicationDosage}>{medication.dosage} • {medication.frequency}</Text>
                <Text style={styles.medicationTime}>Next: {medication.nextDose}</Text>
              </View>
              <View style={styles.medicationStatus}>
                {medication.taken ? (
                  <Text style={styles.takenText}>✅ Taken</Text>
                ) : (
                  <Clock size={20} color="#F59E0B" />
                )}
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Upcoming Appointments */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Upcoming Appointments</Text>
          {appointments.map((appointment) => (
            <View key={appointment.id} style={styles.appointmentCard}>
              <Image 
                source={{ uri: 'https://images.pexels.com/photos/5327585/pexels-photo-5327585.jpeg?auto=compress&cs=tinysrgb&w=400' }}
                style={styles.doctorImage}
              />
              <View style={styles.appointmentInfo}>
                <Text style={styles.doctorName}>{appointment.doctor}</Text>
                <Text style={styles.specialty}>{appointment.specialty}</Text>
                <Text style={styles.appointmentType}>{appointment.type}</Text>
              </View>
              <View style={styles.appointmentTime}>
                <Text style={styles.appointmentDate}>{appointment.date}</Text>
                <Text style={styles.appointmentHour}>{appointment.time}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* Health Goals */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Health Goals</Text>
          <View style={styles.goalsCard}>
            <View style={styles.goalItem}>
              <Activity size={24} color="#22C55E" />
              <View style={styles.goalInfo}>
                <Text style={styles.goalTitle}>Daily Steps</Text>
                <Text style={styles.goalProgress}>3,420 / 5,000 steps</Text>
                <View style={styles.progressBar}>
                  <View style={[styles.progressFill, { width: '68%' }]} />
                </View>
              </View>
            </View>

            <View style={styles.goalItem}>
              <Heart size={24} color="#EF4444" />
              <View style={styles.goalInfo}>
                <Text style={styles.goalTitle}>Exercise Minutes</Text>
                <Text style={styles.goalProgress}>25 / 30 minutes</Text>
                <View style={styles.progressBar}>
                  <View style={[styles.progressFill, { width: '83%' }]} />
                </View>
              </View>
            </View>

            <View style={styles.goalItem}>
              <Droplets size={24} color="#2563EB" />
              <View style={styles.goalInfo}>
                <Text style={styles.goalTitle}>Water Intake</Text>
                <Text style={styles.goalProgress}>6 / 8 glasses</Text>
                <View style={styles.progressBar}>
                  <View style={[styles.progressFill, { width: '75%' }]} />
                </View>
              </View>
            </View>
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
  title: {
    fontSize: 28,
    fontFamily: 'Inter-Bold',
    color: '#1E293B',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#64748B',
  },
  overviewCard: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 6,
  },
  cardTitle: {
    fontSize: 20,
    fontFamily: 'Inter-SemiBold',
    color: '#1E293B',
    marginBottom: 16,
  },
  overviewGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  overviewItem: {
    alignItems: 'center',
    flex: 1,
  },
  overviewValue: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: '#1E293B',
    marginTop: 8,
    marginBottom: 4,
  },
  overviewLabel: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#64748B',
    textAlign: 'center',
  },
  section: {
    marginVertical: 12,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 22,
    fontFamily: 'Inter-Bold',
    color: '#1E293B',
  },
  addButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  vitalsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  vitalCard: {
    width: '48%',
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 16,
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  vitalValue: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#1E293B',
    marginTop: 8,
  },
  vitalUnit: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#64748B',
    marginBottom: 4,
  },
  vitalLabel: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
    color: '#64748B',
    textAlign: 'center',
  },
  medicationCard: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  medicationTaken: {
    backgroundColor: '#F0FDF4',
    borderWidth: 1,
    borderColor: '#22C55E',
  },
  medicationIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  medicationInfo: {
    flex: 1,
  },
  medicationName: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#1E293B',
    marginBottom: 2,
  },
  medicationDosage: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#64748B',
    marginBottom: 2,
  },
  medicationTime: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#2563EB',
  },
  medicationStatus: {
    alignItems: 'center',
  },
  takenText: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
    color: '#22C55E',
  },
  appointmentCard: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  doctorImage: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 12,
  },
  appointmentInfo: {
    flex: 1,
  },
  doctorName: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#1E293B',
    marginBottom: 2,
  },
  specialty: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#64748B',
    marginBottom: 2,
  },
  appointmentType: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
    color: '#2563EB',
  },
  appointmentTime: {
    alignItems: 'flex-end',
  },
  appointmentDate: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#1E293B',
    marginBottom: 2,
  },
  appointmentHour: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#64748B',
  },
  goalsCard: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  goalItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  goalInfo: {
    flex: 1,
    marginLeft: 12,
  },
  goalTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#1E293B',
    marginBottom: 4,
  },
  goalProgress: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#64748B',
    marginBottom: 8,
  },
  progressBar: {
    height: 6,
    backgroundColor: '#E2E8F0',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#2563EB',
    borderRadius: 3,
  },
});