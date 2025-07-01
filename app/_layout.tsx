import { useEffect, useState } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useFrameworkReady } from '@/hooks/useFrameworkReady';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from '@/utils/firebase';
import { View, ActivityIndicator, StyleSheet } from 'react-native';

export default function RootLayout() {
  useFrameworkReady();
  
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setIsLoading(false);
    });

    return unsubscribe;
  }, []);

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2563EB" />
      </View>
    );
  }

  return (
    <>
      <Stack screenOptions={{ headerShown: false }}>
        {user ? (
          // Authenticated user screens
          <>
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="emergency" options={{ headerShown: false }} />
            <Stack.Screen name="video-call" options={{ headerShown: false }} />
          </>
        ) : (
          // Unauthenticated user screens
          <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        )}
        <Stack.Screen name="+not-found" />
      </Stack>
      <StatusBar style="auto" />
    </>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
  },
});