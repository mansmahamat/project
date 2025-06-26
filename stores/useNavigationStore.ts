import { create } from 'zustand';

interface NavigationState {
  isCompletingOnboarding: boolean;
  setCompletingOnboarding: (completing: boolean) => void;
}

export const useNavigationStore = create<NavigationState>((set) => ({
  isCompletingOnboarding: false,
  setCompletingOnboarding: (completing: boolean) => {
    console.log('🔄 Navigation: Setting completing onboarding to', completing);
    set({ isCompletingOnboarding: completing });
  },
})); 