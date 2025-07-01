
import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView, 
  Alert,
  Dimensions
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useUser } from '../../hooks/useUser';
import { router } from 'expo-router';
import { 
  Heart, 
  Pill, 
  Calendar, 
  Phone, 
  Shield, 
  Smile,
  Clock,
  Bell,
  MapPin,
  Activity,
  Users,
  TrendingUp
} from 'lucide-react-native';

const { width } = Dimensions.get('window');

export default function HomeScreen() {
  const { user, userProfile, loading } = useUser();
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000); // Update every minute

    return () => clearInterval(timer);
  }, []);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const QuickActionButton = ({ 
    icon, 
    title, 
    subtitle, 
    onPress, 
    color = '#2563EB',
    backgroundColor = '#EFF6FF'
  }: {
    icon: React.ReactNode;
    title: string;
    subtitle?: string;
    onPress: () => void;
    color?: string;
    backgroundColor?: string;
  }) => (
    <TouchableOpacity 
      style={[styles.quickActionButton, { backgroundColor }]} 
      onPress={onPress}
    >
      <View style={[styles.quickActionIcon, { backgroundColor: color }]}>
        {icon}
      </View>
      <Text style={styles.quickActionTitle}>{title}</Text>
      {subtitle && <Text style={styles.quickActionSubtitle}>{subtitle}</Text>}
    </TouchableOpacity>
  );

  const StatCard = ({ 
    icon, 
    title, 
    value, 
    color = '#2563EB' 
  }: {
    icon: React.ReactNode;
    title: string;
    value: string;
    color?: string;
  }) => (
    <View style={styles.statCard}>
      <View style={[styles.statIcon, { backgroundColor: `${color}20` }]}>
        {React.cloneElement(icon as React.ReactElement, { size: 20, color })}
      </View>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statTitle}>{title}</Text>
    </View>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <Text style={styles.greeting}>
              Good {currentTime.getHours() < 12 ? 'Morning' : currentTime.getHours() < 18 ? 'Afternoon' : 'Evening'}
            </Text>
            <Text style={styles.userName}>
              {userProfile?.displayName || user?.displayName || 'User'}
            </Text>
            <Text style={styles.date}>{formatDate(currentTime)}</Text>
          </View>
          <View style={styles.timeContainer}>
            <Text style={styles.time}>{formatTime(currentTime)}</Text>
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.quickActionsGrid}>
            {userProfile?.userType === 'elder' ? (
              <>
                <QuickActionButton
                  icon={<Shield size={24} color="#FFFFFF" />}
                  title="Emergency"
                  subtitle="Get help now"
                  onPress={() => router.push('/emergency')}
                  color="#EF4444"
                  backgroundColor="#FEF2F2"
                />
                <QuickActionButton
                  icon={<Pill size={24} color="#FFFFFF" />}
                  title="Medications"
                  subtitle="View reminders"
                  onPress={() => Alert.alert('Coming Soon', 'Medication tracking will be available soon.')}
                  color="#059669"
                  backgroundColor="#ECFDF5"
                />
                <QuickActionButton
                  icon={<Phone size={24} color="#FFFFFF" />}
                  title="Call Family"
                  subtitle="Quick contact"
                  onPress={() => router.push('/video-call')}
                  color="#7C3AED"
                  backgroundColor="#F3E8FF"
                />
                <QuickActionButton
                  icon={<Smile size={24} color="#FFFFFF" />}
                  title="Mood Check"
                  subtitle="How are you?"
                  onPress={() => Alert.alert('Coming Soon', 'Mood tracking will be available soon.')}
                  color="#F59E0B"
                  backgroundColor="#FFFBEB"
                />
              </>
            ) : (
              <>
                <QuickActionButton
                  icon={<Activity size={24} color="#FFFFFF" />}
                  title="Elder Status"
                  subtitle="Check activity"
                  onPress={() => router.push('/(tabs)/family')}
                  color="#2563EB"
                  backgroundColor="#EFF6FF"
                />
                <QuickActionButton
                  icon={<Bell size={24} color="#FFFFFF" />}
                  title="Alerts"
                  subtitle="View notifications"
                  onPress={() => Alert.alert('Coming Soon', 'Alert management will be available soon.')}
                  color="#EF4444"
                  backgroundColor="#FEF2F2"
                />
                <QuickActionButton
                  icon={<Phone size={24} color="#FFFFFF" />}
                  title="Call Elder"
                  subtitle="Video call"
                  onPress={() => router.push('/video-call')}
                  color="#059669"
                  backgroundColor="#ECFDF5"
                />
                <QuickActionButton
                  icon={<MapPin size={24} color="#FFFFFF" />}
                  title="Location"
                  subtitle="Track location"
                  onPress={() => Alert.alert('Coming Soon', 'Location tracking will be available soon.')}
                  color="#7C3AED"
                  backgroundColor="#F3E8FF"
                />
              </>
            )}
          </View>
        </View>

        {/* Stats/Summary */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            {userProfile?.userType === 'elder' ? 'Today\'s Summary' : 'Care Overview'}
          </Text>
          <View style={styles.statsGrid}>
            {userProfile?.userType === 'elder' ? (
              <>
                <StatCard
                  icon={<Pill />}
                  title="Medications"
                  value="2/3"
                  color="#059669"
                />
                <StatCard
                  icon={<Calendar />}
                  title="Appointments"
                  value="1"
                  color="#2563EB"
                />
                <StatCard
                  icon={<Smile />}
                  title="Mood"
                  value="Good"
                  color="#F59E0B"
                />
                <StatCard
                  icon={<Activity />}
                  title="Activity"
                  value="Active"
                  color="#7C3AED"
                />
              </>
            ) : (
              <>
                <StatCard
                  icon={<Users />}
                  title="Connected"
                  value="1"
                  color="#2563EB"
                />
                <StatCard
                  icon={<Bell />}
                  title="Alerts"
                  value="0"
                  color="#059669"
                />
                <StatCard
                  icon={<TrendingUp />}
                  title="Compliance"
                  value="85%"
                  color="#F59E0B"
                />
                <StatCard
                  icon={<Heart />}
                  title="Health"
                  value="Good"
                  color="#EF4444"
                />
              </>
            )}
          </View>
        </View>

        {/* Recent Activity */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent Activity</Text>
          <View style={styles.activityCard}>
            <View style={styles.activityItem}>
              <View style={styles.activityIcon}>
                <Clock size={16} color="#64748B" />
              </View>
              <View style={styles.activityContent}>
                <Text style={styles.activityTitle}>Welcome to Family Care Companion!</Text>
                <Text style={styles.activityTime}>Just now</Text>
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
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#64748B',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 24,
  },
  headerContent: {
    flex: 1,
  },
  greeting: {
    fontSize: 16,
    color: '#64748B',
    marginBottom: 4,
  },
  userName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1E293B',
    marginBottom: 4,
  },
  date: {
    fontSize: 14,
    color: '#64748B',
  },
  timeContainer: {
    backgroundColor: '#2563EB',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
  },
  time: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 16,
    paddingHorizontal: 24,
  },
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 24,
    gap: 12,
  },
  quickActionButton: {
    width: (width - 60) / 2,
    backgroundColor: '#EFF6FF',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  quickActionIcon: {
    width: 48,
    height: 48,
    backgroundColor: '#2563EB',
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  quickActionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 4,
  },
  quickActionSubtitle: {
    fontSize: 12,
    color: '#64748B',
    textAlign: 'center',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 24,
    gap: 12,
  },
  statCard: {
    width: (width - 60) / 2,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  statIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1E293B',
    marginBottom: 4,
  },
  statTitle: {
    fontSize: 14,
    color: '#64748B',
    textAlign: 'center',
  },
  activityCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 24,
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  activityIcon: {
    width: 32,
    height: 32,
    backgroundColor: '#F8FAFC',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  activityContent: {
    flex: 1,
  },
  activityTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1E293B',
    marginBottom: 2,
  },
  activityTime: {
    fontSize: 12,
    color: '#64748B',
  },
});
