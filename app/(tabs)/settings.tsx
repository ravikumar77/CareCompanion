import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  Switch
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useUser } from '../../hooks/useUser';
import { 
  getPendingFamilyRequests, 
  approveFamilyMember, 
  rejectFamilyMember,
  getFamilyMembers,
  unlinkFamilyMember,
  PendingFamilyRequest,
  UserProfile
} from '../../utils/userService';
import { 
  User, 
  Bell, 
  Shield, 
  HelpCircle, 
  LogOut, 
  Settings as SettingsIcon, 
  Moon, 
  Volume2,
  Smartphone,
  Heart,
  Users,
  UserCheck,
  UserX,
  Copy
} from 'lucide-react-native';

export default function SettingsScreen() {
  const { user, userProfile, logout } = useUser();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [darkModeEnabled, setDarkModeEnabled] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [pendingRequests, setPendingRequests] = useState<PendingFamilyRequest[]>([]);
  const [familyMembers, setFamilyMembers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (userProfile?.userType === 'elder') {
      loadPendingRequests();
      loadFamilyMembers();
    }
  }, [userProfile]);

  const loadPendingRequests = async () => {
    if (!userProfile?.userId) return;
    
    try {
      const requests = await getPendingFamilyRequests(userProfile.userId);
      setPendingRequests(requests);
    } catch (error) {
      console.error('Error loading pending requests:', error);
    }
  };

  const loadFamilyMembers = async () => {
    if (!userProfile?.userId) return;
    
    try {
      const members = await getFamilyMembers(userProfile.userId);
      setFamilyMembers(members);
    } catch (error) {
      console.error('Error loading family members:', error);
    }
  };

  const handleApproveFamily = async (familyId: string) => {
    if (!userProfile?.userId) return;
    
    setLoading(true);
    try {
      await approveFamilyMember(userProfile.userId, familyId);
      await loadPendingRequests();
      await loadFamilyMembers();
      Alert.alert('Success', 'Family member approved successfully!');
    } catch (error: any) {
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRejectFamily = async (familyId: string) => {
    if (!userProfile?.userId) return;
    
    Alert.alert(
      'Reject Family Member',
      'Are you sure you want to reject this family member? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reject',
          style: 'destructive',
          onPress: async () => {
            setLoading(true);
            try {
              await rejectFamilyMember(userProfile.userId, familyId);
              await loadPendingRequests();
              Alert.alert('Success', 'Family member rejected.');
            } catch (error: any) {
              Alert.alert('Error', error.message);
            } finally {
              setLoading(false);
            }
          }
        }
      ]
    );
  };

  const handleUnlinkFamily = async (familyId: string, familyName: string) => {
    if (!userProfile?.userId) return;
    
    Alert.alert(
      'Unlink Family Member',
      `Are you sure you want to unlink ${familyName}? They will lose access to your care information.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Unlink',
          style: 'destructive',
          onPress: async () => {
            setLoading(true);
            try {
              await unlinkFamilyMember(userProfile.userId, familyId);
              await loadFamilyMembers();
              Alert.alert('Success', 'Family member unlinked successfully.');
            } catch (error: any) {
              Alert.alert('Error', error.message);
            } finally {
              setLoading(false);
            }
          }
        }
      ]
    );
  };

  const handleCopyElderCode = () => {
    if (userProfile?.elderCode) {
      // In a real app, you'd use Clipboard.setString
      Alert.alert(
        'Elder Code',
        `Your Elder Code is: ${userProfile.elderCode}\n\nShare this code with family members so they can link their accounts to yours.`,
        [{ text: 'OK' }]
      );
    }
  };

  const handleLogout = () => {
    Alert.alert(
      'Confirm Logout',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Sign Out', 
          style: 'destructive',
          onPress: async () => {
            try {
              await logout();
            } catch (error) {
              Alert.alert('Error', 'Failed to sign out. Please try again.');
            }
          }
        }
      ]
    );
  };

  const SettingItem = ({ 
    icon, 
    title, 
    subtitle, 
    onPress, 
    rightElement,
    showChevron = true 
  }: {
    icon: React.ReactNode;
    title: string;
    subtitle?: string;
    onPress?: () => void;
    rightElement?: React.ReactNode;
    showChevron?: boolean;
  }) => (
    <TouchableOpacity 
      style={styles.settingItem} 
      onPress={onPress}
      disabled={!onPress}
    >
      <View style={styles.settingItemLeft}>
        <View style={styles.settingIcon}>
          {icon}
        </View>
        <View style={styles.settingContent}>
          <Text style={styles.settingTitle}>{title}</Text>
          {subtitle && <Text style={styles.settingSubtitle}>{subtitle}</Text>}
        </View>
      </View>
      {rightElement && (
        <View style={styles.settingRight}>
          {rightElement}
        </View>
      )}
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Settings</Text>
          <Text style={styles.headerSubtitle}>Manage your account and preferences</Text>
        </View>

        {/* User Profile Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Profile</Text>
          <View style={styles.profileCard}>
            <View style={styles.profileIcon}>
              {userProfile?.userType === 'elder' ? (
                <Heart size={24} color="#2563EB" />
              ) : (
                <Users size={24} color="#2563EB" />
              )}
            </View>
            <View style={styles.profileInfo}>
              <Text style={styles.profileName}>
                {userProfile?.displayName || userProfile?.name || user?.displayName || 'User'}
              </Text>
              <Text style={styles.profileEmail}>{user?.email}</Text>
              <Text style={styles.profileType}>
                {userProfile?.userType === 'elder' ? 'Elder Account' : 'Family Caregiver'}
              </Text>
              {userProfile?.userType === 'elder' && userProfile?.elderCode && (
                <TouchableOpacity style={styles.elderCodeContainer} onPress={handleCopyElderCode}>
                  <Text style={styles.elderCodeText}>Code: {userProfile.elderCode}</Text>
                  <Copy size={16} color="#2563EB" />
                </TouchableOpacity>
              )}
            </View>
          </View>
        </View>

        {/* Elder-specific sections */}
        {userProfile?.userType === 'elder' && (
          <>
            {/* Pending Family Requests */}
            {pendingRequests.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Pending Family Requests</Text>
                <View style={styles.settingsGroup}>
                  {pendingRequests.map((request) => (
                    <View key={request.familyId} style={styles.requestItem}>
                      <View style={styles.requestInfo}>
                        <Text style={styles.requestName}>{request.name}</Text>
                        <Text style={styles.requestRelation}>
                          {request.relation.charAt(0).toUpperCase() + request.relation.slice(1)}
                        </Text>
                        <Text style={styles.requestDate}>
                          Requested: {request.requestedAt.toLocaleDateString()}
                        </Text>
                      </View>
                      <View style={styles.requestActions}>
                        <TouchableOpacity 
                          style={styles.approveButton}
                          onPress={() => handleApproveFamily(request.familyId)}
                          disabled={loading}
                        >
                          <UserCheck size={20} color="#FFFFFF" />
                        </TouchableOpacity>
                        <TouchableOpacity 
                          style={styles.rejectButton}
                          onPress={() => handleRejectFamily(request.familyId)}
                          disabled={loading}
                        >
                          <UserX size={20} color="#FFFFFF" />
                        </TouchableOpacity>
                      </View>
                    </View>
                  ))}
                </View>
              </View>
            )}

            {/* Connected Family Members */}
            {familyMembers.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Connected Family Members</Text>
                <View style={styles.settingsGroup}>
                  {familyMembers.map((member) => (
                    <View key={member.userId} style={styles.familyMemberItem}>
                      <View style={styles.familyMemberInfo}>
                        <Text style={styles.familyMemberName}>{member.name}</Text>
                        <Text style={styles.familyMemberRelation}>
                          {member.relation?.charAt(0).toUpperCase() + member.relation?.slice(1)}
                        </Text>
                        <Text style={styles.familyMemberEmail}>{member.email}</Text>
                      </View>
                      <TouchableOpacity 
                        style={styles.unlinkButton}
                        onPress={() => handleUnlinkFamily(member.userId, member.name)}
                        disabled={loading}
                      >
                        <UserX size={16} color="#EF4444" />
                      </TouchableOpacity>
                    </View>
                  ))}
                </View>
              </View>
            )}
          </>
        )}

        {/* Account Settings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account</Text>
          <View style={styles.settingsGroup}>
            <SettingItem
              icon={<User size={20} color="#64748B" />}
              title="Edit Profile"
              subtitle="Update your personal information"
              onPress={() => Alert.alert('Coming Soon', 'Profile editing will be available soon.')}
            />
            <SettingItem
              icon={<Shield size={20} color="#64748B" />}
              title="Privacy & Security"
              subtitle="Manage your privacy settings"
              onPress={() => Alert.alert('Coming Soon', 'Privacy settings will be available soon.')}
            />
          </View>
        </View>

        {/* Notifications */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Notifications</Text>
          <View style={styles.settingsGroup}>
            <SettingItem
              icon={<Bell size={20} color="#64748B" />}
              title="Push Notifications"
              subtitle="Receive alerts and reminders"
              rightElement={
                <Switch
                  value={notificationsEnabled}
                  onValueChange={setNotificationsEnabled}
                  trackColor={{ false: '#E2E8F0', true: '#2563EB' }}
                  thumbColor={notificationsEnabled ? '#FFFFFF' : '#64748B'}
                />
              }
              showChevron={false}
            />
            <SettingItem
              icon={<Volume2 size={20} color="#64748B" />}
              title="Sound Alerts"
              subtitle="Play sounds for notifications"
              rightElement={
                <Switch
                  value={soundEnabled}
                  onValueChange={setSoundEnabled}
                  trackColor={{ false: '#E2E8F0', true: '#2563EB' }}
                  thumbColor={soundEnabled ? '#FFFFFF' : '#64748B'}
                />
              }
              showChevron={false}
            />
          </View>
        </View>

        {/* App Settings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>App Settings</Text>
          <View style={styles.settingsGroup}>
            <SettingItem
              icon={<Moon size={20} color="#64748B" />}
              title="Dark Mode"
              subtitle="Switch to dark theme"
              rightElement={
                <Switch
                  value={darkModeEnabled}
                  onValueChange={setDarkModeEnabled}
                  trackColor={{ false: '#E2E8F0', true: '#2563EB' }}
                  thumbColor={darkModeEnabled ? '#FFFFFF' : '#64748B'}
                />
              }
              showChevron={false}
            />
            <SettingItem
              icon={<Smartphone size={20} color="#64748B" />}
              title="App Preferences"
              subtitle="Customize your app experience"
              onPress={() => Alert.alert('Coming Soon', 'App preferences will be available soon.')}
            />
          </View>
        </View>

        {/* Support */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Support</Text>
          <View style={styles.settingsGroup}>
            <SettingItem
              icon={<HelpCircle size={20} color="#64748B" />}
              title="Help & Support"
              subtitle="Get help and contact support"
              onPress={() => Alert.alert('Help & Support', 'For assistance, please contact our support team at support@familycarecompanion.com')}
            />
            <SettingItem
              icon={<SettingsIcon size={20} color="#64748B" />}
              title="About"
              subtitle="App version and information"
              onPress={() => Alert.alert('About', 'Family Care Companion v1.0.0\nBuilt with care for families everywhere.')}
            />
          </View>
        </View>

        {/* Logout */}
        <View style={styles.section}>
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <LogOut size={20} color="#EF4444" />
            <Text style={styles.logoutText}>Sign Out</Text>
          </TouchableOpacity>
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
  header: {
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 24,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1E293B',
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#64748B',
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 16,
    paddingHorizontal: 24,
  },
  profileCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 24,
    borderRadius: 16,
    padding: 24,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  profileIcon: {
    width: 56,
    height: 56,
    backgroundColor: '#EFF6FF',
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 4,
  },
  profileEmail: {
    fontSize: 14,
    color: '#64748B',
    marginBottom: 4,
  },
  profileType: {
    fontSize: 12,
    color: '#2563EB',
    fontWeight: '500',
    marginBottom: 8,
  },
  elderCodeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  elderCodeText: {
    fontSize: 12,
    color: '#2563EB',
    fontWeight: '600',
    marginRight: 4,
  },
  settingsGroup: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 24,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  settingItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingIcon: {
    width: 40,
    height: 40,
    backgroundColor: '#F8FAFC',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  settingContent: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1E293B',
    marginBottom: 2,
  },
  settingSubtitle: {
    fontSize: 14,
    color: '#64748B',
  },
  settingRight: {
    marginLeft: 16,
  },
  requestItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  requestInfo: {
    flex: 1,
  },
  requestName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 2,
  },
  requestRelation: {
    fontSize: 14,
    color: '#64748B',
    marginBottom: 2,
  },
  requestDate: {
    fontSize: 12,
    color: '#64748B',
  },
  requestActions: {
    flexDirection: 'row',
    gap: 8,
  },
  approveButton: {
    backgroundColor: '#22C55E',
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  rejectButton: {
    backgroundColor: '#EF4444',
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  familyMemberItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  familyMemberInfo: {
    flex: 1,
  },
  familyMemberName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 2,
  },
  familyMemberRelation: {
    fontSize: 14,
    color: '#64748B',
    marginBottom: 2,
  },
  familyMemberEmail: {
    fontSize: 12,
    color: '#64748B',
  },
  unlinkButton: {
    backgroundColor: '#FEF2F2',
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    marginHorizontal: 24,
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#EF4444',
    marginLeft: 8,
  },
});