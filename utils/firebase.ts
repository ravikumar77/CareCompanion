import { initializeApp } from 'firebase/app';
import { initializeAuth, getReactNativePersistence, getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { Platform } from 'react-native';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY || "AIzaSyCEEgk1X0CvEzJ9e9a6xn3WxTsX1TObiJw",
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN || "familycare-d009d.firebaseapp.com",
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID || "familycare-d009d",
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET || "familycare-d009d.firebasestorage.app",
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "1011667681949",
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID || "1:1011667681949:android:4ce60eb62a072078854a74",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Auth with platform-specific persistence
export const auth = Platform.OS === 'web' 
  ? getAuth(app)
  : initializeAuth(app, {
      persistence: getReactNativePersistence(ReactNativeAsyncStorage)
    });

// Initialize Firestore
export const db = getFirestore(app);

export default app;