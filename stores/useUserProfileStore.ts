import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface UserProfile {
  sex: 'male' | 'female' | null;
  weightKg: number | null;
  heightCm: number | null;
  ageYears: number | null;
  isProfileComplete: boolean;
}

interface UserProfileStore {
  profile: UserProfile;
  updateProfile: (updates: Partial<UserProfile>) => void;
  resetProfile: () => void;
  calculateBMR: () => number | null;
}

const initialProfile: UserProfile = {
  sex: null,
  weightKg: null,
  heightCm: null,
  ageYears: null,
  isProfileComplete: false,
};

export const useUserProfileStore = create<UserProfileStore>()(
  persist(
    (set, get) => ({
      profile: initialProfile,

      updateProfile: (updates) => {
        set((state) => {
          const newProfile = { ...state.profile, ...updates };
          
          // Check if profile is complete
          const isComplete = !!(
            newProfile.sex &&
            newProfile.weightKg &&
            newProfile.heightCm &&
            newProfile.ageYears
          );
          
          return {
            profile: {
              ...newProfile,
              isProfileComplete: isComplete,
            },
          };
        });
      },

      resetProfile: () => {
        set({ profile: initialProfile });
      },

      calculateBMR: () => {
        const { profile } = get();
        
        if (!profile.isProfileComplete) {
          return null;
        }
        
        const { sex, weightKg, heightCm, ageYears } = profile;
        
        // Mifflin-St Jeor formula
        if (sex === 'male') {
          return 10 * weightKg! + 6.25 * heightCm! - 5 * ageYears! + 5;
        } else {
          return 10 * weightKg! + 6.25 * heightCm! - 5 * ageYears! - 161;
        }
      },
    }),
    {
      name: 'user-profile-storage',
      storage: {
        getItem: async (name) => {
          const value = await AsyncStorage.getItem(name);
          return value ? JSON.parse(value) : null;
        },
        setItem: async (name, value) => {
          await AsyncStorage.setItem(name, JSON.stringify(value));
        },
        removeItem: async (name) => {
          await AsyncStorage.removeItem(name);
        },
      },
    }
  )
); 