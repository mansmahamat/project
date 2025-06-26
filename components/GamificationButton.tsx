 import React, { useEffect } from 'react';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import { Trophy, Crown } from 'lucide-react-native';
import Animated from 'react-native-reanimated';
import { useProgressStore } from '@/stores';
import { useButtonPress, usePulseAnimation, useRotateAnimation } from '@/utils/animations';
import { HapticFeedback } from '@/utils/haptics';

interface GamificationButtonProps {
  onPress: () => void;
}

export const GamificationButton: React.FC<GamificationButtonProps> = ({ onPress }) => {
  const { progress, getCurrentRank } = useProgressStore();
  
  // Animation hooks
  const { animatedStyle, onPressIn, onPressOut } = useButtonPress();
  const { animatedStyle: pulseStyle, startPulse } = usePulseAnimation(1.05);
  const { animatedStyle: crownRotation, wiggle } = useRotateAnimation();

  // Handle cases where progress might not be fully loaded yet
  if (!progress || typeof progress.totalXP !== 'number') {
    return (
      <Animated.View style={[animatedStyle, pulseStyle]}>
        <TouchableOpacity 
          style={styles.container} 
          onPress={() => {
            HapticFeedback.medium();
            onPress();
          }}
          onPressIn={onPressIn}
          onPressOut={onPressOut}
        >
          <View style={styles.iconContainer}>
            <Crown size={20} color="#fff" />
          </View>
          <View style={styles.info}>
            <Text style={styles.rank}>Loading...</Text>
            <Text style={styles.xp}>0 XP</Text>
          </View>
          <Trophy size={16} color="#FF6B35" />
        </TouchableOpacity>
      </Animated.View>
    );
  }

  const currentRank = getCurrentRank();

  // Trigger pulse animation when XP changes
  useEffect(() => {
    if (progress.totalXP > 0) {
      const timer = setTimeout(() => {
        startPulse();
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [progress.totalXP]);

  const handlePress = () => {
    HapticFeedback.medium();
    wiggle(); // Add a fun wiggle animation
    onPress();
  };

  return (
    <Animated.View style={[animatedStyle, pulseStyle]}>
      <TouchableOpacity 
        style={styles.container} 
        onPress={handlePress}
        onPressIn={onPressIn}
        onPressOut={onPressOut}
      >
        <Animated.View style={[styles.iconContainer, crownRotation]}>
          <Crown size={20} color="#fff" />
        </Animated.View>
        <View style={styles.info}>
          <Text style={styles.rank}>{currentRank.name}</Text>
          <Text style={styles.xp}>{progress.totalXP.toLocaleString()} XP</Text>
        </View>
        <Trophy size={16} color="#FF6B35" />
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 12,
    marginHorizontal: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  iconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#FF6B35',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  info: {
    flex: 1,
  },
  rank: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#111827',
  },
  xp: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
  },
}); 