import { auth, db } from './firebase';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  User,
  updateProfile
} from 'firebase/auth';
import { 
  doc, 
  setDoc, 
  getDoc, 
  collection, 
  addDoc, 
  query, 
  where, 
  getDocs,
  orderBy,
  updateDoc,
  arrayUnion,
  arrayRemove,
  deleteDoc
} from 'firebase/firestore';

// User Types
export type UserType = 'elder' | 'family';
export type RelationType = 'son' | 'daughter' | 'spouse' | 'sibling' | 'grandchild' | 'caregiver' | 'other';
export type ReminderType = 'medication' | 'appointment' | 'checkup' | 'exercise';
export type MoodType = 'happy' | 'sad' | 'anxious' | 'calm' | 'tired' | 'energetic';
export type CheckInStatus = 'pending' | 'responded' | 'ignored' | 'no_response';

// User Profile Interfaces - Updated to match specification
export interface UserProfile {
  userId: string;
  userType: UserType;
  displayName: string;
  name: string;
  email: string;
  phone?: string;
  age?: number; // For elders
  relation?: RelationType; // For family members
  elderId?: string; // For family users, linking to elder userId
  elderCode?: string; // For elders - unique code for family linking
  isApproved?: boolean; // For family members - elder approval status
  createdAt: Date;
  lastActive: Date;
}

export interface ElderData {
  elderId: string;
  userId: string; // linked to Users collection
  medicalInfo?: {
    conditions: string[];
    medications: string[];
    allergies: string[];
    doctorContact?: string;
  };
  emergencyContacts: EmergencyContact[];
  assignedFamilyIds: string[];
  pendingFamilyRequests?: PendingFamilyRequest[];
  location?: {
    latitude: number;
    longitude: number;
    lastUpdated: Date;
  };
}

export interface PendingFamilyRequest {
  familyId: string;
  name: string;
  relation: RelationType;
  requestedAt: Date;
}

export interface EmergencyContact {
  id: string;
  name: string;
  phoneNumber: string;
  relationship: string;
  isPrimary: boolean;
}

// Data Models - Updated to match specification
export interface Reminder {
  reminderId: string;
  elderId: string;
  type: ReminderType;
  title: string;
  description?: string;
  time: string; // HH:MM format
  status: 'pending' | 'taken' | 'missed';
  daysOfWeek?: number[]; // 0-6 (Sunday-Saturday)
  isActive: boolean;
  createdBy?: string; // Family member userId
  createdAt: Date;
  lastTriggered?: Date;
}

export interface MoodLog {
  moodId: string;
  elderId: string;
  moodType: MoodType;
  notes?: string;
  timestamp: Date;
}

export interface SOSAlert {
  sosId: string;
  elderId: string;
  location?: {
    latitude: number;
    longitude: number;
  };
  timestamp: Date;
  isResolved: boolean;
  resolvedBy?: string;
  resolvedAt?: Date;
}

export interface CheckIn {
  checkInId: string;
  elderId: string;
  familyId: string;
  message: string;
  status: CheckInStatus;
  sentAt: Date;
  respondedAt?: Date;
  response?: string;
}

// Helper function to generate elder code
const generateElderCode = (): string => {
  const prefix = 'E';
  const numbers = Math.floor(1000 + Math.random() * 9000);
  const letters = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `${prefix}${numbers}-${letters}`;
};

// User Registration Functions - Updated to match specification
export const registerElderUser = async (
  email: string,
  password: string,
  name: string,
  age: number,
  phone?: string
): Promise<UserProfile> => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    await updateProfile(user, { displayName: name });

    const elderCode = generateElderCode();
    
    // Create user profile in Users collection
    const userProfile: UserProfile = {
      userId: user.uid,
      userType: 'elder',
      displayName: name,
      name,
      email,
      phone,
      age,
      elderCode,
      createdAt: new Date(),
      lastActive: new Date(),
    };

    await setDoc(doc(db, 'users', user.uid), userProfile);

    // Create elder data in Elders collection
    const elderData: ElderData = {
      elderId: user.uid,
      userId: user.uid,
      emergencyContacts: [],
      assignedFamilyIds: [],
      pendingFamilyRequests: [],
    };

    await setDoc(doc(db, 'elders', user.uid), elderData);

    return userProfile;
  } catch (error: any) {
    throw new Error(`Elder registration failed: ${error.message}`);
  }
};

export const registerFamilyUser = async (
  email: string,
  password: string,
  name: string,
  relation: RelationType,
  elderCode: string,
  relationDescription?: string,
  phone?: string
): Promise<UserProfile> => {
  try {
    // First, verify the elder code exists
    const usersQuery = query(
      collection(db, 'users'),
      where('elderCode', '==', elderCode),
      where('userType', '==', 'elder')
    );
    const userSnapshot = await getDocs(usersQuery);

    if (userSnapshot.empty) {
      throw new Error('Invalid elder code. Please check and try again.');
    }

    const elderUserDoc = userSnapshot.docs[0];
    const elderUserData = elderUserDoc.data() as UserProfile;

    // Create family user account
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    await updateProfile(user, { displayName: name });

    // Create user profile in Users collection
    const familyUserProfile: UserProfile = {
      userId: user.uid,
      userType: 'family',
      displayName: name,
      name,
      email,
      phone,
      relation,
      elderId: elderUserData.userId,
      isApproved: false, // Requires elder approval
      createdAt: new Date(),
      lastActive: new Date(),
    };

    await setDoc(doc(db, 'users', user.uid), familyUserProfile);

    // Add family member to elder's pending approvals
    const pendingRequest: PendingFamilyRequest = {
      familyId: user.uid,
      name,
      relation,
      requestedAt: new Date(),
    };

    await updateDoc(doc(db, 'elders', elderUserData.userId), {
      pendingFamilyRequests: arrayUnion(pendingRequest)
    });

    return familyUserProfile;
  } catch (error: any) {
    throw new Error(`Family member registration failed: ${error.message}`);
  }
};

// Elder Approval Functions
export const approveFamilyMember = async (elderId: string, familyId: string): Promise<void> => {
  try {
    // Update family member approval status
    await updateDoc(doc(db, 'users', familyId), {
      isApproved: true
    });

    // Add family member to elder's assigned family list
    await updateDoc(doc(db, 'elders', elderId), {
      assignedFamilyIds: arrayUnion(familyId)
    });

    // Remove from pending requests (we'll need to get the request first to remove it properly)
    const elderDoc = await getDoc(doc(db, 'elders', elderId));
    if (elderDoc.exists()) {
      const elderData = elderDoc.data() as ElderData;
      const updatedPendingRequests = elderData.pendingFamilyRequests?.filter(
        req => req.familyId !== familyId
      ) || [];
      
      await updateDoc(doc(db, 'elders', elderId), {
        pendingFamilyRequests: updatedPendingRequests
      });
    }
  } catch (error: any) {
    throw new Error(`Failed to approve family member: ${error.message}`);
  }
};

export const rejectFamilyMember = async (elderId: string, familyId: string): Promise<void> => {
  try {
    // Remove from pending requests
    const elderDoc = await getDoc(doc(db, 'elders', elderId));
    if (elderDoc.exists()) {
      const elderData = elderDoc.data() as ElderData;
      const updatedPendingRequests = elderData.pendingFamilyRequests?.filter(
        req => req.familyId !== familyId
      ) || [];
      
      await updateDoc(doc(db, 'elders', elderId), {
        pendingFamilyRequests: updatedPendingRequests
      });
    }

    // Delete family member account
    await deleteDoc(doc(db, 'users', familyId));
  } catch (error: any) {
    throw new Error(`Failed to reject family member: ${error.message}`);
  }
};

// Reminder Management - Updated to match specification
export const createReminder = async (reminder: Omit<Reminder, 'reminderId'>): Promise<string> => {
  try {
    const docRef = await addDoc(collection(db, 'reminders'), {
      ...reminder,
      createdAt: new Date(),
    });
    return docRef.id;
  } catch (error: any) {
    throw new Error(`Failed to create reminder: ${error.message}`);
  }
};

export const getElderReminders = async (elderId: string): Promise<Reminder[]> => {
  try {
    const remindersQuery = query(
      collection(db, 'reminders'),
      where('elderId', '==', elderId),
      where('isActive', '==', true),
      orderBy('time')
    );
    const snapshot = await getDocs(remindersQuery);
    return snapshot.docs.map(doc => ({
      reminderId: doc.id,
      ...doc.data()
    })) as Reminder[];
  } catch (error: any) {
    throw new Error(`Failed to fetch reminders: ${error.message}`);
  }
};

export const updateReminderStatus = async (
  reminderId: string, 
  status: 'pending' | 'taken' | 'missed'
): Promise<void> => {
  try {
    await updateDoc(doc(db, 'reminders', reminderId), {
      status,
      lastTriggered: new Date(),
    });
  } catch (error: any) {
    throw new Error(`Failed to update reminder status: ${error.message}`);
  }
};

// Mood Logging - Updated to match specification
export const logMood = async (elderId: string, moodType: MoodType, notes?: string): Promise<string> => {
  try {
    const docRef = await addDoc(collection(db, 'moodLogs'), {
      elderId,
      moodType,
      notes,
      timestamp: new Date(),
    });
    return docRef.id;
  } catch (error: any) {
    throw new Error(`Failed to log mood: ${error.message}`);
  }
};

export const getElderMoodLogs = async (elderId: string, limit: number = 30): Promise<MoodLog[]> => {
  try {
    const moodQuery = query(
      collection(db, 'moodLogs'),
      where('elderId', '==', elderId),
      orderBy('timestamp', 'desc')
    );
    const snapshot = await getDocs(moodQuery);
    return snapshot.docs.slice(0, limit).map(doc => ({
      moodId: doc.id,
      ...doc.data()
    })) as MoodLog[];
  } catch (error: any) {
    throw new Error(`Failed to fetch mood logs: ${error.message}`);
  }
};

// SOS Alert Management - Updated to match specification
export const createSOSAlert = async (
  elderId: string,
  location?: { latitude: number; longitude: number }
): Promise<string> => {
  try {
    const docRef = await addDoc(collection(db, 'sosAlerts'), {
      elderId,
      location,
      timestamp: new Date(),
      isResolved: false,
    });
    return docRef.id;
  } catch (error: any) {
    throw new Error(`Failed to create SOS alert: ${error.message}`);
  }
};

export const resolveSOSAlert = async (sosId: string, resolvedBy: string): Promise<void> => {
  try {
    await updateDoc(doc(db, 'sosAlerts', sosId), {
      isResolved: true,
      resolvedBy,
      resolvedAt: new Date(),
    });
  } catch (error: any) {
    throw new Error(`Failed to resolve SOS alert: ${error.message}`);
  }
};

// Check-in Management - Updated to match specification
export const sendCheckIn = async (
  elderId: string,
  familyId: string,
  message: string
): Promise<string> => {
  try {
    const docRef = await addDoc(collection(db, 'checkIns'), {
      elderId,
      familyId,
      message,
      status: 'pending',
      sentAt: new Date(),
    });
    return docRef.id;
  } catch (error: any) {
    throw new Error(`Failed to send check-in: ${error.message}`);
  }
};

export const respondToCheckIn = async (
  checkInId: string,
  response: string
): Promise<void> => {
  try {
    await updateDoc(doc(db, 'checkIns', checkInId), {
      status: 'responded',
      response,
      respondedAt: new Date(),
    });
  } catch (error: any) {
    throw new Error(`Failed to respond to check-in: ${error.message}`);
  }
};

export const getElderCheckIns = async (elderId: string): Promise<CheckIn[]> => {
  try {
    const checkInsQuery = query(
      collection(db, 'checkIns'),
      where('elderId', '==', elderId),
      orderBy('sentAt', 'desc')
    );
    const snapshot = await getDocs(checkInsQuery);
    return snapshot.docs.map(doc => ({
      checkInId: doc.id,
      ...doc.data()
    })) as CheckIn[];
  } catch (error: any) {
    throw new Error(`Failed to fetch check-ins: ${error.message}`);
  }
};

// User Profile Management - Updated to match specification
export const getUserProfile = async (userId: string): Promise<UserProfile | null> => {
  try {
    const userDoc = await getDoc(doc(db, 'users', userId));
    if (userDoc.exists()) {
      return userDoc.data() as UserProfile;
    }
    return null;
  } catch (error: any) {
    throw new Error(`Failed to fetch user profile: ${error.message}`);
  }
};

export const updateUserProfile = async (
  userId: string,
  updates: Partial<UserProfile>
): Promise<void> => {
  try {
    await updateDoc(doc(db, 'users', userId), {
      ...updates,
      lastActive: new Date(),
    });
  } catch (error: any) {
    throw new Error(`Failed to update user profile: ${error.message}`);
  }
};

// Elder Data Management
export const getElderData = async (elderId: string): Promise<ElderData | null> => {
  try {
    const elderDoc = await getDoc(doc(db, 'elders', elderId));
    if (elderDoc.exists()) {
      return elderDoc.data() as ElderData;
    }
    return null;
  } catch (error: any) {
    throw new Error(`Failed to fetch elder data: ${error.message}`);
  }
};

export const updateElderData = async (
  elderId: string,
  updates: Partial<ElderData>
): Promise<void> => {
  try {
    await updateDoc(doc(db, 'elders', elderId), updates);
  } catch (error: any) {
    throw new Error(`Failed to update elder data: ${error.message}`);
  }
};

// Family Management - Updated to match specification
export const getFamilyMembers = async (elderId: string): Promise<UserProfile[]> => {
  try {
    const familyQuery = query(
      collection(db, 'users'),
      where('elderId', '==', elderId),
      where('userType', '==', 'family'),
      where('isApproved', '==', true)
    );
    const snapshot = await getDocs(familyQuery);
    return snapshot.docs.map(doc => doc.data()) as UserProfile[];
  } catch (error: any) {
    throw new Error(`Failed to fetch family members: ${error.message}`);
  }
};

export const getPendingFamilyRequests = async (elderId: string): Promise<PendingFamilyRequest[]> => {
  try {
    const elderData = await getElderData(elderId);
    return elderData?.pendingFamilyRequests || [];
  } catch (error: any) {
    throw new Error(`Failed to fetch pending family requests: ${error.message}`);
  }
};

export const unlinkFamilyMember = async (elderId: string, familyId: string): Promise<void> => {
  try {
    // Remove family member from elder's assigned list
    await updateDoc(doc(db, 'elders', elderId), {
      assignedFamilyIds: arrayRemove(familyId)
    });

    // Update family member to unlink them
    await updateDoc(doc(db, 'users', familyId), {
      elderId: '',
      isApproved: false
    });
  } catch (error: any) {
    throw new Error(`Failed to unlink family member: ${error.message}`);
  }
};

// Legacy function for backward compatibility
export const createUserProfile = async (
  user: User,
  userType: 'elder' | 'family',
  additionalData?: any
): Promise<void> => {
  const userData = {
    uid: user.uid,
    email: user.email,
    fullName: user.displayName || '',
    role: userType === 'elder' ? 'elderly' : 'family_member',
    createdAt: new Date(),
    lastActive: new Date(),
    ...additionalData
  };

  await setDoc(doc(db, 'users', user.uid), userData);
};