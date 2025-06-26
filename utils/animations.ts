import { 
  useSharedValue, 
  useAnimatedStyle, 
  withSpring, 
  withSequence,
  withDelay,
  withTiming,
  withRepeat,
  interpolate,
  Extrapolate,
  runOnJS
} from 'react-native-reanimated';
import { HapticFeedback } from './haptics';

// Spring animation presets
export const SpringPresets = {
  gentle: { damping: 20, stiffness: 90 },
  bouncy: { damping: 10, stiffness: 100 },
  snappy: { damping: 15, stiffness: 200 },
  slow: { damping: 25, stiffness: 60 },
};

// Timing animation presets
export const TimingPresets = {
  fast: { duration: 150 },
  medium: { duration: 300 },
  slow: { duration: 500 },
  quick: { duration: 100 },
};

// Micro animation hooks
export const useButtonPress = (options = {}) => {
  const scale = useSharedValue(1);
  
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const onPressIn = () => {
    runOnJS(HapticFeedback.light)();
    scale.value = withSpring(0.95, SpringPresets.snappy);
  };

  const onPressOut = () => {
    scale.value = withSpring(1, SpringPresets.gentle);
  };

  return { animatedStyle, onPressIn, onPressOut };
};

export const usePulseAnimation = (intensity = 1.1) => {
  const scale = useSharedValue(1);
  
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const startPulse = () => {
    scale.value = withRepeat(
      withSequence(
        withTiming(intensity, TimingPresets.fast),
        withTiming(1, TimingPresets.fast)
      ),
      3,
      false
    );
  };

  return { animatedStyle, startPulse };
};

export const useSlideIn = (direction = 'bottom') => {
  const translateY = useSharedValue(direction === 'bottom' ? 50 : -50);
  const opacity = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
    opacity: opacity.value,
  }));

  const slideIn = () => {
    translateY.value = withSpring(0, SpringPresets.bouncy);
    opacity.value = withTiming(1, TimingPresets.medium);
  };

  const slideOut = () => {
    translateY.value = withSpring(direction === 'bottom' ? 50 : -50, SpringPresets.snappy);
    opacity.value = withTiming(0, TimingPresets.fast);
  };

  return { animatedStyle, slideIn, slideOut };
};

export const useProgressAnimation = () => {
  const progress = useSharedValue(0);
  
  const animatedStyle = useAnimatedStyle(() => ({
    width: `${progress.value}%`,
  }));

  const animateProgress = (targetProgress: number, withHaptic = true) => {
    if (withHaptic) {
      runOnJS(HapticFeedback.selection)();
    }
    progress.value = withSpring(targetProgress, SpringPresets.gentle);
  };

  return { animatedStyle, animateProgress, progress };
};

export const useShake = () => {
  const translateX = useSharedValue(0);
  
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  const shake = () => {
    runOnJS(HapticFeedback.warning)();
    translateX.value = withSequence(
      withTiming(-5, { duration: 50 }),
      withTiming(5, { duration: 50 }),
      withTiming(-5, { duration: 50 }),
      withTiming(5, { duration: 50 }),
      withTiming(0, { duration: 50 })
    );
  };

  return { animatedStyle, shake };
};

export const useRotateAnimation = () => {
  const rotation = useSharedValue(0);
  
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ rotateZ: `${rotation.value}deg` }],
  }));

  const spin = () => {
    rotation.value = withSequence(
      withTiming(360, { duration: 500 }),
      withTiming(0, { duration: 0 })
    );
  };

  const wiggle = () => {
    rotation.value = withSequence(
      withTiming(-5, { duration: 100 }),
      withTiming(5, { duration: 100 }),
      withTiming(-5, { duration: 100 }),
      withTiming(0, { duration: 100 })
    );
  };

  return { animatedStyle, spin, wiggle };
};

export const useBounceAnimation = () => {
  const scale = useSharedValue(1);
  
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const bounce = () => {
    runOnJS(HapticFeedback.success)();
    scale.value = withSequence(
      withSpring(1.2, SpringPresets.bouncy),
      withSpring(1, SpringPresets.gentle)
    );
  };

  const bigBounce = () => {
    runOnJS(HapticFeedback.achievement)();
    scale.value = withSequence(
      withSpring(1.5, SpringPresets.bouncy),
      withSpring(1, SpringPresets.gentle)
    );
  };

  return { animatedStyle, bounce, bigBounce };
};

export const useHeartbeat = () => {
  const scale = useSharedValue(1);
  
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const startHeartbeat = () => {
    scale.value = withRepeat(
      withSequence(
        withTiming(1.1, { duration: 100 }),
        withTiming(1, { duration: 100 }),
        withTiming(1.1, { duration: 100 }),
        withTiming(1, { duration: 400 })
      ),
      -1,
      false
    );
  };

  const stopHeartbeat = () => {
    scale.value = withSpring(1, SpringPresets.gentle);
  };

  return { animatedStyle, startHeartbeat, stopHeartbeat };
};

export const useFadeAnimation = () => {
  const opacity = useSharedValue(1);
  
  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  const fadeIn = () => {
    opacity.value = withTiming(1, TimingPresets.medium);
  };

  const fadeOut = () => {
    opacity.value = withTiming(0, TimingPresets.medium);
  };

  const blink = () => {
    opacity.value = withSequence(
      withTiming(0, TimingPresets.quick),
      withTiming(1, TimingPresets.quick)
    );
  };

  return { animatedStyle, fadeIn, fadeOut, blink };
}; 