import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { useRouter, useSegments } from 'expo-router';
import { useOnboardingStore, useNavigationStore } from '@/stores';

interface OnboardingGateProps {
  children: React.ReactNode;
}

export default function OnboardingGate({ children }: OnboardingGateProps) {
  const isOnboardingComplete = useOnboardingStore((state) => state.isOnboardingComplete);
  const setLoading = useOnboardingStore((state) => state.setLoading);
  const isCompletingOnboarding = useNavigationStore((state) => state.isCompletingOnboarding);
  const router = useRouter();
  const segments = useSegments();
  const [isInitialized, setIsInitialized] = React.useState(false);

  useEffect(() => {
    // Small delay to ensure Zustand persistence has loaded
    setTimeout(() => {
      setIsInitialized(true);
    }, 200);
  }, []);

  useEffect(() => {
    if (!isInitialized) return; // Wait for initialization

    const inOnboarding = segments[0] === 'onboarding';
    
    console.log('OnboardingGate CHECK:', {
      isOnboardingComplete,
      inOnboarding,
      isCompletingOnboarding,
      segments: segments.join('/'),
      isInitialized
    });

    // DO NOT interfere if currently completing onboarding
    if (isCompletingOnboarding) {
      console.log('🚀 OnboardingGate: COMPLETION IN PROGRESS - Not interfering');
      return;
    }

    // ONLY redirect new users to onboarding, never interfere with completed users or onboarding process
    if (isOnboardingComplete === false && !inOnboarding && segments.length > 0) {
      console.log('NEW USER: Redirecting to onboarding...');
      router.replace('/onboarding');
    } else {
      console.log('OnboardingGate: NOT redirecting - user is completed or onboarding');
    }
    // Never redirect users who have completed onboarding or are currently onboarding
  }, [isOnboardingComplete, isInitialized, segments, router]);

  // Show loading screen while initializing
  if (!isInitialized) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FF6B35" />
        <Text style={styles.loadingText}>Loading your boxing profile...</Text>
      </View>
    );
  }

  return <>{children}</>;
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
  },
}); 