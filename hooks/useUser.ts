import { useState, useEffect } from 'react';
import { User, onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from '@/utils/firebase';
import { getUserProfile, UserProfile } from '@/utils/userService';

export function useUser() {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      try {
        setUser(firebaseUser);
        
        if (firebaseUser) {
          // Load user profile from Firestore
          const profile = await getUserProfile(firebaseUser.uid);
          setUserProfile(profile);
        } else {
          setUserProfile(null);
        }
      } catch (err) {
        console.error('Error loading user profile:', err);
        setError('Failed to load user profile');
      } finally {
        setLoading(false);
      }
    });

    return unsubscribe;
  }, []);

  const logout = async () => {
    try {
      setLoading(true);
      
      // Sign out from Firebase - this will trigger the auth state change
      await signOut(auth);
      
      // Clear local state
      setUser(null);
      setUserProfile(null);
      setError(null);
    } catch (err) {
      console.error('Error signing out:', err);
      setError('Failed to sign out');
    } finally {
      setLoading(false);
    }
  };

  const refreshProfile = async () => {
    if (user) {
      try {
        const profile = await getUserProfile(user.uid);
        setUserProfile(profile);
      } catch (err) {
        console.error('Error refreshing profile:', err);
        setError('Failed to refresh profile');
      }
    }
  };

  return {
    user,
    userProfile,
    loading,
    error,
    logout,
    refreshProfile,
    isAuthenticated: !!user,
    isElder: userProfile?.userType === 'elder',
    isFamily: userProfile?.userType === 'family'
  };
}