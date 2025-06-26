import ReactNativeHapticFeedback from 'react-native-haptic-feedback';

// Haptic feedback options
const hapticOptions = {
  enableVibrateFallback: true,
  ignoreAndroidSystemSettings: false,
};

export const HapticFeedback = {
  // Light feedback for subtle interactions
  light: () => {
    ReactNativeHapticFeedback.trigger('impactLight', hapticOptions);
  },

  // Medium feedback for button presses
  medium: () => {
    ReactNativeHapticFeedback.trigger('impactMedium', hapticOptions);
  },

  // Heavy feedback for important actions
  heavy: () => {
    ReactNativeHapticFeedback.trigger('impactHeavy', hapticOptions);
  },

  // Success feedback for positive actions
  success: () => {
    ReactNativeHapticFeedback.trigger('notificationSuccess', hapticOptions);
  },

  // Warning feedback
  warning: () => {
    ReactNativeHapticFeedback.trigger('notificationWarning', hapticOptions);
  },

  // Error feedback
  error: () => {
    ReactNativeHapticFeedback.trigger('notificationError', hapticOptions);
  },

  // Selection feedback for picker/selector changes
  selection: () => {
    ReactNativeHapticFeedback.trigger('selection', hapticOptions);
  },

  // Achievement unlock - celebratory pattern
  achievement: () => {
    ReactNativeHapticFeedback.trigger('notificationSuccess', hapticOptions);
    setTimeout(() => {
      ReactNativeHapticFeedback.trigger('impactLight', hapticOptions);
    }, 100);
    setTimeout(() => {
      ReactNativeHapticFeedback.trigger('impactLight', hapticOptions);
    }, 200);
  },

  // Workout complete - strong success
  workoutComplete: () => {
    ReactNativeHapticFeedback.trigger('notificationSuccess', hapticOptions);
    setTimeout(() => {
      ReactNativeHapticFeedback.trigger('impactHeavy', hapticOptions);
    }, 150);
  },

  // Level up - escalating pattern
  levelUp: () => {
    ReactNativeHapticFeedback.trigger('impactLight', hapticOptions);
    setTimeout(() => {
      ReactNativeHapticFeedback.trigger('impactMedium', hapticOptions);
    }, 100);
    setTimeout(() => {
      ReactNativeHapticFeedback.trigger('impactHeavy', hapticOptions);
    }, 200);
    setTimeout(() => {
      ReactNativeHapticFeedback.trigger('notificationSuccess', hapticOptions);
    }, 300);
  },
}; 