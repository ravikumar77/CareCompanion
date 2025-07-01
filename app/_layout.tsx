import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState, useRef } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from '../utils/firebase';
import LoadingSpinner from '../components/LoadingSpinner'
import { useFrameworkReady } from '@/hooks/useFrameworkReady';

export default function RootLayout() {
  useFrameworkReady();
  const [user, setUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [initializing, setInitializing] = useState(true);
  const isMountedRef = useRef(true);

  useEffect(() => {
    isMountedRef.current = true;
    
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (isMountedRef.current) {
        setUser(user);
        if (initializing) {
          setInitializing(false);
        }
        setAuthLoading(false);
      }
    });

    return () => {
      isMountedRef.current = false;
      unsubscribe();
    };
  }, [initializing]);

  useEffect(() => {
    if (!authLoading && !initializing && isMountedRef.current) {
      SplashScreen.hideAsync();
    }
  }, [authLoading, initializing]);

  useEffect(() => {
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  if (authLoading || initializing) {
    return <LoadingSpinner />;
  }

  return (
    <ThemeProvider value={DefaultTheme}>
      <Stack screenOptions={{ headerShown: false }}>
        {user ? (
          <>
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="emergency" options={{ presentation: 'modal' }} />
            <Stack.Screen name="video-call" options={{ presentation: 'modal' }} />
            <Stack.Screen name="+not-found" />
          </>
        ) : (
          <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        )}
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}