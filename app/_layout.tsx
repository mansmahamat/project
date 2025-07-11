import React, { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useFrameworkReady } from '@/hooks/useFrameworkReady';
import { useFonts } from 'expo-font';
import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
} from '@expo-google-fonts/inter';
import * as SplashScreen from 'expo-splash-screen';
import OnboardingGate from '@/components/OnboardingGate';
import { RevenueCatProvider } from '@/hooks/useRevenueCat';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  useFrameworkReady();
  
  const [fontsLoaded, fontError] = useFonts({
    'Inter-Regular': Inter_400Regular,
    'Inter-Medium': Inter_500Medium,
    'Inter-SemiBold': Inter_600SemiBold,
    'Inter-Bold': Inter_700Bold,
  });

  useEffect(() => {
    if (fontsLoaded || fontError) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) {
    return null;
  }

  return (
    <RevenueCatProvider>
      <OnboardingGate>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="onboarding" options={{ headerShown: false }} />
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="workout-detail" options={{ headerShown: false }} />
          <Stack.Screen name="workout-player" options={{ headerShown: false }} />
          <Stack.Screen name="timed-workout-player" options={{ headerShown: false }} />

          <Stack.Screen name="quick-start" options={{ headerShown: false }} />
          <Stack.Screen name="custom-workout" options={{ headerShown: false }} />
          <Stack.Screen name="combos" options={{ headerShown: false }} />
          <Stack.Screen name="combo-detail" options={{ headerShown: false }} />
          <Stack.Screen name="combo-practice" options={{ headerShown: false }} />
          <Stack.Screen name="punch-library" options={{ headerShown: false }} />
          <Stack.Screen name="technique-detail" options={{ headerShown: false }} />
          <Stack.Screen name="+not-found" />
        </Stack>
        <StatusBar style="light" />
      </OnboardingGate>
    </RevenueCatProvider>
  );
}