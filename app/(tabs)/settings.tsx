import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView, 
  Alert,
  Switch,
  Image
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { User, Bell, Shield, Heart, Phone, MapPin, Settings as SettingsIcon, CircleHelp as HelpCircle, LogOut, ChevronRight, Moon, Volume2, Smartphone, Users, Lock, Eye } from 'lucide-react-native';

export default function SettingsScreen() {
  const [notifications, setNotifications] = useState(true);
  const [locationSharing, setLocationSharing] = useState(true);
  const [emergencyAlerts, setEmergencyAlerts] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);

  const handleProfileEdit = () => {
    Alert.alert('Edit Profile', 'Profile editing functionality would open here.');
  };

  const handleEmergencyContacts = () => {
    Alert.alert('Emergency Contacts', 'Manage your emergency contacts and family members.');
  };

  const handlePrivacySettings = () => {
    Alert.alert('Privacy Settings', 'Configure your privacy and data sharing preferences.');
  };

  const handleHelp = () => {
    Alert.alert('Help & Support', 'Access help documentation and contact support.');
  };

  const handleLogout = () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Sign Out', style: 'destructive' }
      ]
    );
  };

  const SettingItem = ({ 
    icon, 
    title, 
    subtitle, 
    onPress, 
    showSwitch = false, 
    switchValue = false, 
    onSwitchChange,
    showChevron = true 
  }: any) => (
    <TouchableOpacity style={styles.settingItem} onPress={onPress}>
      <View style={styles.settingIcon}>
        {icon}
      </View>
      <View style={styles.settingContent}>
        <Text style={styles.settingTitle}>{title}</Text>
        {subtitle && <Text style={styles.settingSubtitle}>{subtitle}</Text>}
      </View>
      {showSwitch ? (
        <Switch
          value={switchValue}
          onValueChange={onSwitchChange}
          trackColor={{ false: '#E2E8F0', true: '#2563EB' }}
          thumbColor={switchValue ? '#FFFFFF' : '#FFFFFF'}
        />
      ) : showChevron ? (
        <ChevronRight size={20} color="#64748B" />
      ) : null}
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Settings</Text>
          <Text style={styles.subtitle}>Customize your experience</Text>
        </View>

        {/* Profile Section */}
        <View style={styles.profileCard}>
          <Image 
            source={{ uri: 'https://images.pexels.com/photos/3768131/pexels-photo-3768131.jpeg?auto=compress&cs=tinysrgb&w=400' }}
            style={styles.profileImage}
          />
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>Rose Thompson</Text>
            <Text style={styles.profileEmail}>rose.thompson@email.com</Text>
            <Text style={styles.profileStatus}>Elder Mode Active</Text>
          </View>
          <TouchableOpacity style={styles.editButton} onPress={handleProfileEdit}>
            <Text style={styles.editButtonText}>Edit</Text>
          </TouchableOpacity>
        </View>

        {/* Notifications Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Notifications</Text>
          
          <SettingItem
            icon={<Bell size={24} color="#2563EB" />}
            title="Push Notifications"
            subtitle="Receive alerts and reminders"
            showSwitch={true}
            switchValue={notifications}
            onSwitchChange={setNotifications}
            showChevron={false}
          />

          <SettingItem
            icon={<Shield size={24} color="#DC2626" />}
            title="Emergency Alerts"
            subtitle="Critical health and safety notifications"
            showSwitch={true}
            switchValue={emergencyAlerts}
            onSwitchChange={setEmergencyAlerts}
            showChevron={false}
          />

          <SettingItem
            icon={<Volume2 size={24} color="#22C55E" />}
            title="Sound & Vibration"
            subtitle="Audio feedback for notifications"
            showSwitch={true}
            switchValue={soundEnabled}
            onSwitchChange={setSoundEnabled}
            showChevron={false}
          />
        </View>

        {/* Privacy & Security */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Privacy & Security</Text>
          
          <SettingItem
            icon={<MapPin size={24} color="#22C55E" />}
            title="Location Sharing"
            subtitle="Share location with family members"
            showSwitch={true}
            switchValue={locationSharing}
            onSwitchChange={setLocationSharing}
            showChevron={false}
          />

          <SettingItem
            icon={<Lock size={24} color="#64748B" />}
            title="Privacy Settings"
            subtitle="Control your data and sharing preferences"
            onPress={handlePrivacySettings}
          />

          <SettingItem
            icon={<Eye size={24} color="#64748B" />}
            title="Data & Analytics"
            subtitle="Manage health data collection"
            onPress={() => Alert.alert('Data Settings', 'Configure data collection preferences.')}
          />
        </View>

        {/* Family & Contacts */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Family & Contacts</Text>
          
          <SettingItem
            icon={<Users size={24} color="#2563EB" />}
            title="Family Members"
            subtitle="Manage connected family accounts"
            onPress={() => Alert.alert('Family Members', 'Manage your connected family members.')}
          />

          <SettingItem
            icon={<Phone size={24} color="#DC2626" />}
            title="Emergency Contacts"
            subtitle="Set up emergency contact information"
            onPress={handleEmergencyContacts}
          />

          <SettingItem
            icon={<Heart size={24} color="#EF4444" />}
            title="Healthcare Providers"
            subtitle="Manage doctor and clinic information"
            onPress={() => Alert.alert('Healthcare Providers', 'Manage your healthcare provider contacts.')}
          />
        </View>

        {/* App Settings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>App Settings</Text>
          
          <SettingItem
            icon={<Moon size={24} color="#64748B" />}
            title="Dark Mode"
            subtitle="Switch to dark theme"
            showSwitch={true}
            switchValue={darkMode}
            onSwitchChange={setDarkMode}
            showChevron={false}
          />

          <SettingItem
            icon={<Smartphone size={24} color="#64748B" />}
            title="Device Settings"
            subtitle="Configure device-specific options"
            onPress={() => Alert.alert('Device Settings', 'Configure device-specific settings.')}
          />

          <SettingItem
            icon={<SettingsIcon size={24} color="#64748B" />}
            title="Advanced Settings"
            subtitle="Additional configuration options"
            onPress={() => Alert.alert('Advanced Settings', 'Access advanced configuration options.')}
          />
        </View>

        {/* Support */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Support</Text>
          
          <SettingItem
            icon={<HelpCircle size={24} color="#22C55E" />}
            title="Help & Support"
            subtitle="Get help and contact support"
            onPress={handleHelp}
          />

          <SettingItem
            icon={<LogOut size={24} color="#DC2626" />}
            title="Sign Out"
            subtitle="Sign out of your account"
            onPress={handleLogout}
            showChevron={false}
          />
        </View>

        {/* App Version */}
        <View style={styles.versionInfo}>
          <Text style={styles.versionText}>Family Care Companion</Text>
          <Text style={styles.versionNumber}>Version 1.0.0</Text>
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
  profileCard: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 6,
  },
  profileImage: {
    width: 64,
    height: 64,
    borderRadius: 32,
    marginRight: 16,
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: '#1E293B',
    marginBottom: 2,
  },
  profileEmail: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#64748B',
    marginBottom: 4,
  },
  profileStatus: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
    color: '#22C55E',
  },
  editButton: {
    backgroundColor: '#2563EB',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
  },
  editButtonText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
  },
  section: {
    marginVertical: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#1E293B',
    marginBottom: 12,
    marginLeft: 4,
  },
  settingItem: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  settingIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  settingContent: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#1E293B',
    marginBottom: 2,
  },
  settingSubtitle: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#64748B',
  },
  versionInfo: {
    alignItems: 'center',
    paddingVertical: 20,
    marginTop: 20,
  },
  versionText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#64748B',
    marginBottom: 4,
  },
  versionNumber: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#94A3B8',
  },
});