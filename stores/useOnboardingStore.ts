import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface UserProfile {
  gender: 'male' | 'female' | 'other';
  age: string;
  height: string;
  weight: string;
  stance: 'orthodox' | 'southpaw';
  experience: 'beginner' | 'intermediate' | 'advanced';
  goals: string[];
  fitnessLevel: 'low' | 'moderate' | 'high';
  injuries: string;
}

interface OnboardingState {
  // State
  isOnboardingComplete: boolean;
  userProfile: UserProfile | null;
  isLoading: boolean;
  shouldShowPaywallAfterOnboarding: boolean;

  // Actions
  setLoading: (loading: boolean) => void;
  completeOnboarding: (profile: UserProfile) => void;
  updateUserProfile: (profile: UserProfile) => void;
  resetOnboarding: () => void;
  setShouldShowPaywallAfterOnboarding: (show: boolean) => void;
  debugCurrentState: () => OnboardingState;
  
  // Computed values
  calculateBMR: () => number | null;
  calculateDailyCalories: () => number | null;
  calculateWorkoutCalories: (durationMinutes: number, workoutCategory?: string, workoutLevel?: string) => number | null;
  getActivityMultiplier: () => number;
  getRecommendedRestPeriod: () => number;
  getRecommendedWorkoutLevel: () => 'Beginner' | 'Intermediate' | 'Advanced';
}

export const useOnboardingStore = create<OnboardingState>()(
  persist(
    (set, get) => ({
      // Initial state
      isOnboardingComplete: false,
      userProfile: null,
      isLoading: false,
      shouldShowPaywallAfterOnboarding: false,

      // Actions
      setLoading: (loading: boolean) => {
        set({ isLoading: loading });
      },

      completeOnboarding: (profile: UserProfile) => {
        console.log('🎯 Zustand: COMPLETING ONBOARDING');
        console.log('🎯 Profile received:', profile);
        
        const newState = { 
          isOnboardingComplete: true, 
          userProfile: profile,
          isLoading: false,
          shouldShowPaywallAfterOnboarding: true
        };
        
        console.log('🎯 Zustand: Setting new state:', newState);
        set(newState);
        
        // Force verification of state change
        setTimeout(() => {
          const currentState = get();
          console.log('🎯 Zustand: VERIFICATION CHECK:', {
            isOnboardingComplete: currentState.isOnboardingComplete,
            hasProfile: !!currentState.userProfile,
            profileData: currentState.userProfile,
            shouldShowPaywall: currentState.shouldShowPaywallAfterOnboarding,
            isLoading: currentState.isLoading
          });
          
          // Double-check AsyncStorage directly
          AsyncStorage.getItem('onboarding-store').then(stored => {
            console.log('🎯 AsyncStorage verification:', stored);
          }).catch(err => {
            console.error('🎯 AsyncStorage error:', err);
          });
        }, 50);
      },

      updateUserProfile: (profile: UserProfile) => {
        set({ userProfile: profile });
      },

      resetOnboarding: () => {
        console.log('🎯 Zustand: RESETTING ONBOARDING');
        const resetState = { 
          isOnboardingComplete: false, 
          userProfile: null,
          isLoading: false,
          shouldShowPaywallAfterOnboarding: false
        };
        console.log('🎯 Zustand: Setting reset state:', resetState);
        set(resetState);
        
        // Verify reset
        setTimeout(() => {
          const currentState = get();
          console.log('🎯 Zustand: RESET VERIFICATION:', {
            isOnboardingComplete: currentState.isOnboardingComplete,
            hasProfile: !!currentState.userProfile,
          });
        }, 50);
      },

      setShouldShowPaywallAfterOnboarding: (show: boolean) => {
        set({ shouldShowPaywallAfterOnboarding: show });
      },

      // Computed values
      calculateBMR: () => {
        const { userProfile } = get();
        if (!userProfile) return null;

        const { gender, age, height, weight } = userProfile;
        const ageNum = parseInt(age);
        const heightNum = parseFloat(height);
        const weightNum = parseFloat(weight);

        if (isNaN(ageNum) || isNaN(heightNum) || isNaN(weightNum)) return null;

        // Mifflin-St Jeor Equation
        if (gender === 'male') {
          return 10 * weightNum + 6.25 * heightNum - 5 * ageNum + 5;
        } else {
          return 10 * weightNum + 6.25 * heightNum - 5 * ageNum - 161;
        }
      },

      getActivityMultiplier: () => {
        const { userProfile } = get();
        if (!userProfile) return 1.2;

        const { fitnessLevel, experience } = userProfile;
        
        // Base on fitness level
        let multiplier = 1.2; // Sedentary
        if (fitnessLevel === 'moderate') multiplier = 1.375; // Light activity
        if (fitnessLevel === 'high') multiplier = 1.55; // Moderate activity

        // Adjust for boxing experience
        if (experience === 'intermediate') multiplier += 0.1;
        if (experience === 'advanced') multiplier += 0.2;

        return Math.min(multiplier, 1.9); // Cap at very active
      },

      calculateDailyCalories: () => {
        const { calculateBMR, getActivityMultiplier } = get();
        const bmr = calculateBMR();
        if (!bmr) return null;

        return Math.round(bmr * getActivityMultiplier());
      },

      calculateWorkoutCalories: (durationMinutes: number, workoutCategory?: string, workoutLevel?: string) => {
        const { userProfile, calculateBMR } = get();
        if (!userProfile) return null;

        const bmr = calculateBMR();
        if (!bmr) return null;

        // Enhanced MET values for boxing activities
        const getWorkoutIntensity = (category?: string, level?: string) => {
          if (category === 'HIIT' || level === 'Advanced') return 'intense';
          if (category === 'Punching Bag') return 'heavy_bag';
          if (level === 'Intermediate') return 'moderate';
          return 'light';
        };

        const metValues = {
          light: 5.5,      // Light shadowboxing, technique practice
          moderate: 7.8,   // Moderate shadowboxing, combo practice
          intense: 10.5,   // High-intensity boxing, HIIT workouts
          heavy_bag: 8.3,  // Heavy bag training
          sparring: 11.0,  // Sparring (highest intensity)
        };

        const intensity = getWorkoutIntensity(workoutCategory, workoutLevel);
        const met = metValues[intensity];
        
        // Use BMR-based calculation (more accurate)
        const caloriesPerMinute = (bmr / 1440) * met;
        return Math.round(caloriesPerMinute * durationMinutes);
      },

      getRecommendedRestPeriod: () => {
        const { userProfile } = get();
        if (!userProfile) return 60;

        const { experience, fitnessLevel } = userProfile;
        
        // Base rest periods in seconds
        let restPeriod = 75; // Beginner default

        if (experience === 'intermediate') restPeriod = 60;
        if (experience === 'advanced') restPeriod = 45;

        // Adjust for fitness level
        if (fitnessLevel === 'high') restPeriod -= 10;
        if (fitnessLevel === 'low') restPeriod += 15;

        return Math.max(restPeriod, 30); // Minimum 30 seconds
      },

      getRecommendedWorkoutLevel: () => {
        const { userProfile } = get();
        if (!userProfile) return 'Beginner';
        
        const { experience, fitnessLevel } = userProfile;
        
        if (experience === 'advanced') return 'Advanced';
        if (experience === 'intermediate') return 'Intermediate';
        if (experience === 'beginner' && fitnessLevel === 'high') return 'Intermediate';
        
        return 'Beginner';
      },

      // Debug function to check current state
      debugCurrentState: () => {
        const currentState = get();
        console.log('🎯 CURRENT ONBOARDING STATE:', {
          isOnboardingComplete: currentState.isOnboardingComplete,
          hasProfile: !!currentState.userProfile,
          profileData: currentState.userProfile,
          isLoading: currentState.isLoading,
          shouldShowPaywall: currentState.shouldShowPaywallAfterOnboarding
        });
        
        // Also check AsyncStorage
        AsyncStorage.getItem('onboarding-store').then(stored => {
          console.log('🎯 ASYNCSTORAGE STATE:', stored);
        }).catch(err => {
          console.error('🎯 AsyncStorage error:', err);
        });
        
        return currentState;
      },
    }),
    {
      name: 'onboarding-store', // unique name for storage
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        isOnboardingComplete: state.isOnboardingComplete,
        userProfile: state.userProfile,
        shouldShowPaywallAfterOnboarding: state.shouldShowPaywallAfterOnboarding,
      }),
    }
  )
); 