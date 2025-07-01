
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

// User Profile Interfaces
export interface BaseUser {
  userId: string;
  userType: UserType;
  name: string;
  email: string;
  phone?: string;
  createdAt: Date;
  lastActive: Date;
}

export interface ElderUser extends BaseUser {
  userType: 'elder';
  age: number;
  elderCode: string; // Unique code for family linking
  medicalInfo?: {
    conditions: string[];
    medications: string[];
    allergies: string[];
    doctorContact?: string;
  };
  emergencyContacts: EmergencyContact[];
  assignedFamilyIds: string[];
  location?: {
    latitude: number;
    longitude: number;
    lastUpdated: Date;
  };
}

export interface FamilyUser extends BaseUser {
  userType: 'family';
  relation: RelationType;
  relationDescription?: string;
  elderId: string; // Linked elder's userId
  isApproved: boolean; // Elder approval status
}

export interface EmergencyContact {
  id: string;
  name: string;
  phoneNumber: string;
  relationship: string;
  isPrimary: boolean;
}

// Data Models
export interface Reminder {
  reminderId: string;
  elderId: string;
  type: ReminderType;
  title: string;
  description?: string;
  time: string; // HH:MM format
  daysOfWeek: number[]; // 0-6 (Sunday-Saturday)
  isActive: boolean;
  createdBy: string; // Family member userId
  createdAt: Date;
  lastTriggered?: Date;
  status: 'pending' | 'taken' | 'missed';
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

// User Registration Functions
export const registerElderUser = async (
  email: string,
  password: string,
  name: string,
  age: number,
  phone?: string
): Promise<ElderUser> => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    await updateProfile(user, { displayName: name });

    const elderCode = generateElderCode();
    const elderUser: ElderUser = {
      userId: user.uid,
      userType: 'elder',
      name,
      email,
      phone,
      age,
      elderCode,
      emergencyContacts: [],
      assignedFamilyIds: [],
      createdAt: new Date(),
      lastActive: new Date(),
    };

    await setDoc(doc(db, 'users', user.uid), elderUser);
    await setDoc(doc(db, 'elders', user.uid), elderUser);

    return elderUser;
  } catch (error) {
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
): Promise<FamilyUser> => {
  try {
    // First, verify the elder code exists
    const eldersQuery = query(
      collection(db, 'elders'),
      where('elderCode', '==', elderCode)
    );
    const elderSnapshot = await getDocs(eldersQuery);

    if (elderSnapshot.empty) {
      throw new Error('Invalid elder code. Please check and try again.');
    }

    const elderDoc = elderSnapshot.docs[0];
    const elderData = elderDoc.data() as ElderUser;

    // Create family user account
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    await updateProfile(user, { displayName: name });

    const familyUser: FamilyUser = {
      userId: user.uid,
      userType: 'family',
      name,
      email,
      phone,
      relation,
      relationDescription,
      elderId: elderData.userId,
      isApproved: false, // Requires elder approval
      createdAt: new Date(),
      lastActive: new Date(),
    };

    await setDoc(doc(db, 'users', user.uid), familyUser);

    // Add family member to elder's pending approvals
    await updateDoc(doc(db, 'elders', elderData.userId), {
      pendingFamilyRequests: arrayUnion({
        familyId: user.uid,
        name,
        relation,
        requestedAt: new Date(),
      })
    });

    return familyUser;
  } catch (error) {
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
      assignedFamilyIds: arrayUnion(familyId),
      pendingFamilyRequests: arrayRemove({
        familyId,
        requestedAt: new Date(),
      })
    });
  } catch (error) {
    throw new Error(`Failed to approve family member: ${error.message}`);
  }
};

export const rejectFamilyMember = async (elderId: string, familyId: string): Promise<void> => {
  try {
    // Remove from pending requests
    await updateDoc(doc(db, 'elders', elderId), {
      pendingFamilyRequests: arrayRemove({
        familyId,
        requestedAt: new Date(),
      })
    });

    // Delete family member account
    await deleteDoc(doc(db, 'users', familyId));
  } catch (error) {
    throw new Error(`Failed to reject family member: ${error.message}`);
  }
};

// Reminder Management
export const createReminder = async (reminder: Omit<Reminder, 'reminderId'>): Promise<string> => {
  try {
    const docRef = await addDoc(collection(db, 'reminders'), {
      ...reminder,
      createdAt: new Date(),
    });
    return docRef.id;
  } catch (error) {
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
  } catch (error) {
    throw new Error(`Failed to fetch reminders: ${error.message}`);
  }
};

// Mood Logging
export const logMood = async (elderId: string, moodType: MoodType, notes?: string): Promise<string> => {
  try {
    const docRef = await addDoc(collection(db, 'moodLogs'), {
      elderId,
      moodType,
      notes,
      timestamp: new Date(),
    });
    return docRef.id;
  } catch (error) {
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
  } catch (error) {
    throw new Error(`Failed to fetch mood logs: ${error.message}`);
  }
};

// SOS Alert Management
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
  } catch (error) {
    throw new Error(`Failed to create SOS alert: ${error.message}`);
  }
};

// Check-in Management
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
  } catch (error) {
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
  } catch (error) {
    throw new Error(`Failed to respond to check-in: ${error.message}`);
  }
};

// User Profile Management
export const getUserProfile = async (userId: string): Promise<ElderUser | FamilyUser | null> => {
  try {
    const userDoc = await getDoc(doc(db, 'users', userId));
    if (userDoc.exists()) {
      return userDoc.data() as ElderUser | FamilyUser;
    }
    return null;
  } catch (error) {
    throw new Error(`Failed to fetch user profile: ${error.message}`);
  }
};

export const updateUserProfile = async (
  userId: string,
  updates: Partial<ElderUser | FamilyUser>
): Promise<void> => {
  try {
    await updateDoc(doc(db, 'users', userId), {
      ...updates,
      lastActive: new Date(),
    });
  } catch (error) {
    throw new Error(`Failed to update user profile: ${error.message}`);
  }
};

// Family Management
export const getFamilyMembers = async (elderId: string): Promise<FamilyUser[]> => {
  try {
    const familyQuery = query(
      collection(db, 'users'),
      where('elderId', '==', elderId),
      where('userType', '==', 'family'),
      where('isApproved', '==', true)
    );
    const snapshot = await getDocs(familyQuery);
    return snapshot.docs.map(doc => doc.data()) as FamilyUser[];
  } catch (error) {
    throw new Error(`Failed to fetch family members: ${error.message}`);
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
  } catch (error) {
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
