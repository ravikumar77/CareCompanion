import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView, 
  Alert,
  Platform,
  Dimensions,
  Image
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Phone, MapPin, Bell, Activity, Heart, Pill, Calendar, TrendingUp, TriangleAlert as AlertTriangle, CircleCheck as CheckCircle, Clock, User, MessageCircle, Shield, Battery, Wifi } from 'lucide-react-native';

const screenWidth = Dimensions.get('window').width;

export default function FamilyHubScreen() {
  const [elderStatus, setElderStatus] = useState({
    isOnline: true,
    lastActive: '2 minutes ago',
    mood: 'happy',
    medicationTaken: true,
    location: 'Home',
    batteryLevel: 85,
    heartRate: 72,
    steps: 3420,
  });

  const [alerts, setAlerts] = useState([
    { id: 1, type: 'medication', message: 'Morning medication taken on time', time: '9:15 AM', resolved: true, priority: 'low' },
    { id: 2, type: 'mood', message: 'Mood logged as Happy', time: '10:30 AM', resolved: true, priority: 'low' },
    { id: 3, type: 'location', message: 'Currently at home - all good', time: '2:15 PM', resolved: true, priority: 'low' },
    { id: 4, type: 'emergency', message: 'SOS button test completed', time: '1:45 PM', resolved: true, priority: 'high' },
  ]);

  const handleVideoCall = () => {
    router.push('/video-call');
  };

  const handleSendCheckIn = () => {
    Alert.alert(
      '💬 Check-in Sent',
      'A friendly check-in message has been sent to Rose.',
      [{ text: 'OK', style: 'default' }]
    );
  };

  const handleViewLocation = () => {
    Alert.alert(
      '📍 Location Tracking',
      'Rose is currently at home. Last updated 2 minutes ago.\n\nLocation: 123 Oak Street, Springfield\nAccuracy: ±5 meters',
      [{ text: 'View on Map', style: 'default' }, { text: 'OK', style: 'cancel' }]
    );
  };

  const handleEmergencyContact = () => {
    Alert.alert(
      '🚨 Emergency Contact',
      'Call Dr. Sarah Johnson immediately?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Call Now', style: 'destructive' }
      ]
    );
  };

  const getStatusColor = (isOnline: boolean) => {
    return isOnline ? '#22C55E' : '#EF4444';
  };

  const getMoodIcon = (mood: string) => {
    switch (mood) {
      case 'happy': return '😊';
      case 'okay': return '😐';
      case 'sad': return '😢';
      default: return '😊';
    }
  };

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'medication': return <Pill size={20} color="#2563EB" />;
      case 'mood': return <Heart size={20} color="#EF4444" />;
      case 'location': return <MapPin size={20} color="#22C55E" />;
      case 'emergency': return <Shield size={20} color="#DC2626" />;
      default: return <Bell size={20} color="#64748B" />;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <Text style={styles.title}>Family Dashboard</Text>
            <Text style={styles.subtitle}>Monitoring Rose's wellbeing</Text>
          </View>
          <Image 
            source={{ uri: 'https://images.pexels.com/photos/3768131/pexels-photo-3768131.jpeg?auto=compress&cs=tinysrgb&w=400' }}
            style={styles.elderImage}
          />
        </View>

        {/* Elder Status Card */}
        <View style={styles.statusCard}>
          <View style={styles.statusHeader}>
            <View style={styles.statusInfo}>
              <Text style={styles.elderName}>Rose Thompson</Text>
              <View style={styles.statusIndicator}>
                <View style={[styles.statusDot, { backgroundColor: getStatusColor(elderStatus.isOnline) }]} />
                <Text style={styles.statusText}>
                  {elderStatus.isOnline ? 'Online' : 'Offline'} • {elderStatus.lastActive}
                </Text>
              </View>
            </View>
            <TouchableOpacity style={styles.callButton} onPress={handleVideoCall}>
              <Phone size={24} color="#FFFFFF" />
            </TouchableOpacity>
          </View>

          <View style={styles.statusGrid}>
            <View style={styles.statusItem}>
              <Text style={styles.statusLabel}>Mood Today</Text>
              <Text style={styles.statusValue}>{getMoodIcon(elderStatus.mood)} Happy</Text>
            </View>
            <View style={styles.statusItem}>
              <Text style={styles.statusLabel}>Medication</Text>
              <Text style={[styles.statusValue, { color: '#22C55E' }]}>✅ Taken</Text>
            </View>
            <View style={styles.statusItem}>
              <Text style={styles.statusLabel}>Location</Text>
              <Text style={styles.statusValue}>🏠 {elderStatus.location}</Text>
            </View>
            <View style={styles.statusItem}>
              <Text style={styles.statusLabel}>Device Battery</Text>
              <Text style={styles.statusValue}>🔋 {elderStatus.batteryLevel}%</Text>
            </View>
          </View>

          {/* Health Metrics */}
          <View style={styles.healthMetrics}>
            <View style={styles.metric}>
              <Heart size={24} color="#EF4444" />
              <Text style={styles.metricValue}>{elderStatus.heartRate}</Text>
              <Text style={styles.metricLabel}>BPM</Text>
            </View>
            <View style={styles.metric}>
              <Activity size={24} color="#22C55E" />
              <Text style={styles.metricValue}>{elderStatus.steps.toLocaleString()}</Text>
              <Text style={styles.metricLabel}>Steps</Text>
            </View>
            <View style={styles.metric}>
              <Wifi size={24} color="#2563EB" />
              <Text style={styles.metricValue}>Strong</Text>
              <Text style={styles.metricLabel}>Signal</Text>
            </View>
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.actionsContainer}>
            <TouchableOpacity style={styles.actionButton} onPress={handleSendCheckIn}>
              <MessageCircle size={28} color="#2563EB" />
              <Text style={styles.actionText}>Send Check-in</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.actionButton} onPress={handleViewLocation}>
              <MapPin size={28} color="#22C55E" />
              <Text style={styles.actionText}>View Location</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.actionButton} onPress={handleEmergencyContact}>
              <Shield size={28} color="#DC2626" />
              <Text style={styles.actionText}>Emergency</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Recent Activity */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent Activity</Text>
          {alerts.map((alert) => (
            <View key={alert.id} style={[
              styles.alertCard,
              alert.priority === 'high' && styles.highPriorityAlert
            ]}>
              <View style={styles.alertIcon}>
                {getAlertIcon(alert.type)}
              </View>
              <View style={styles.alertContent}>
                <Text style={styles.alertMessage}>{alert.message}</Text>
                <Text style={styles.alertTime}>{alert.time}</Text>
              </View>
              <View style={styles.alertStatus}>
                {alert.resolved ? (
                  <CheckCircle size={20} color="#22C55E" />
                ) : (
                  <Clock size={20} color="#F59E0B" />
                )}
              </View>
            </View>
          ))}
        </View>

        {/* Weekly Summary */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>This Week's Summary</Text>
          <View style={styles.summaryCard}>
            <View style={styles.summaryGrid}>
              <View style={styles.summaryItem}>
                <Pill size={24} color="#2563EB" />
                <Text style={styles.summaryValue}>7/7</Text>
                <Text style={styles.summaryLabel}>Medications</Text>
              </View>
              <View style={styles.summaryItem}>
                <Heart size={24} color="#EF4444" />
                <Text style={styles.summaryValue}>5/7</Text>
                <Text style={styles.summaryLabel}>Happy Days</Text>
              </View>
              <View style={styles.summaryItem}>
                <Activity size={24} color="#22C55E" />
                <Text style={styles.summaryValue}>4/7</Text>
                <Text style={styles.summaryLabel}>Exercise</Text>
              </View>
              <View style={styles.summaryItem}>
                <Calendar size={24} color="#F59E0B" />
                <Text style={styles.summaryValue}>2</Text>
                <Text style={styles.summaryLabel}>Appointments</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Emergency Contacts */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Emergency Contacts</Text>
          
          <View style={styles.contactCard}>
            <User size={28} color="#2563EB" />
            <View style={styles.contactInfo}>
              <Text style={styles.contactName}>Dr. Sarah Johnson</Text>
              <Text style={styles.contactRole}>Primary Care Physician</Text>
              <Text style={styles.contactPhone}>(555) 123-4567</Text>
            </View>
            <TouchableOpacity style={styles.contactButton}>
              <Phone size={20} color="#2563EB" />
            </TouchableOpacity>
          </View>

          <View style={styles.contactCard}>
            <User size={28} color="#22C55E" />
            <View style={styles.contactInfo}>
              <Text style={styles.contactName}>Emergency Services</Text>
              <Text style={styles.contactRole}>24/7 Emergency Response</Text>
              <Text style={styles.contactPhone}>911</Text>
            </View>
            <TouchableOpacity style={styles.contactButton}>
              <Phone size={20} color="#DC2626" />
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
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 20,
    paddingHorizontal: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    marginVertical: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  headerContent: {
    flex: 1,
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
  elderImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  statusCard: {
    backgroundColor: '#FFFFFF',
    padding: 24,
    borderRadius: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 6,
  },
  statusHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  statusInfo: {
    flex: 1,
  },
  elderName: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#1E293B',
    marginBottom: 6,
  },
  statusIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 8,
  },
  statusText: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#64748B',
  },
  callButton: {
    backgroundColor: '#2563EB',
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  statusGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  statusItem: {
    width: '48%',
    marginBottom: 16,
  },
  statusLabel: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#64748B',
    marginBottom: 6,
  },
  statusValue: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#1E293B',
  },
  healthMetrics: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
  },
  metric: {
    alignItems: 'center',
  },
  metricValue: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: '#1E293B',
    marginTop: 8,
    marginBottom: 4,
  },
  metricLabel: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#64748B',
  },
  section: {
    marginVertical: 12,
  },
  sectionTitle: {
    fontSize: 22,
    fontFamily: 'Inter-Bold',
    color: '#1E293B',
    marginBottom: 16,
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionButton: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingVertical: 20,
    marginHorizontal: 6,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  actionText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#1E293B',
    marginTop: 8,
    textAlign: 'center',
  },
  alertCard: {
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
  highPriorityAlert: {
    borderLeftWidth: 4,
    borderLeftColor: '#DC2626',
  },
  alertIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  alertContent: {
    flex: 1,
  },
  alertMessage: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#1E293B',
    marginBottom: 4,
  },
  alertTime: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#64748B',
  },
  alertStatus: {
    marginLeft: 12,
  },
  summaryCard: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  summaryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  summaryItem: {
    width: '48%',
    alignItems: 'center',
    marginBottom: 16,
  },
  summaryValue: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#1E293B',
    marginTop: 8,
    marginBottom: 4,
  },
  summaryLabel: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#64748B',
    textAlign: 'center',
  },
  contactCard: {
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
  contactInfo: {
    flex: 1,
    marginLeft: 12,
  },
  contactName: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#1E293B',
    marginBottom: 2,
  },
  contactRole: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#64748B',
    marginBottom: 2,
  },
  contactPhone: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#2563EB',
  },
  contactButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
});