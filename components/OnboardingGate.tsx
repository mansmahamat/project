import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { useRouter, useSegments } from 'expo-router';
import { useOnboardingStore, useNavigationStore } from '@/stores';

interface OnboardingGateProps {
  children: React.ReactNode;
}

export default function OnboardingGate({ children }: OnboardingGateProps) {
  const isOnboardingComplete = useOnboardingStore((state) => state.isOnboardingComplete);
  const isCompletingOnboarding = useNavigationStore((state) => state.isCompletingOnboarding);
  const router = useRouter();
  const segments = useSegments();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Give Zustand persistence time to rehydrate (shorter delay)
    const timer = setTimeout(() => {
      setIsReady(true);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!isReady) return; // Wait for initialization

    const inOnboarding = segments[0] === 'onboarding';
    
    console.log('OnboardingGate CHECK:', {
      isOnboardingComplete,
      inOnboarding,
      isCompletingOnboarding,
      segments: segments.join('/'),
      isReady
    });

    // DO NOT interfere if currently completing onboarding
    if (isCompletingOnboarding) {
      console.log('🚀 OnboardingGate: COMPLETION IN PROGRESS - Not interfering');
      return;
    }

    // Only redirect to onboarding if user hasn't completed it AND isn't already there
    if (isOnboardingComplete === false && !inOnboarding) {
      console.log('🔄 OnboardingGate: Redirecting to onboarding...');
      router.replace('/onboarding');
    }
  }, [isOnboardingComplete, isReady, segments, isCompletingOnboarding, router]);

  // Show minimal loading only during initial setup
  if (!isReady) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FF6B35" />
        <Text style={styles.loadingText}>Initializing...</Text>
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