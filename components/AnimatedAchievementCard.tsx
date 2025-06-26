import React, { useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Zap, Lock } from 'lucide-react-native';
import Animated from 'react-native-reanimated';
import { useButtonPress, useBounceAnimation, useSlideIn, useFadeAnimation } from '@/utils/animations';
import { HapticFeedback } from '@/utils/haptics';

interface AnimatedAchievementCardProps {
  achievement: {
    id: string;
    title: string;
    description: string;
    icon: string;
    rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
    xpReward: number;
    secret?: boolean;
  };
  unlocked: boolean;
  onPress?: () => void;
  delay?: number;
}

export const AnimatedAchievementCard: React.FC<AnimatedAchievementCardProps> = ({
  achievement,
  unlocked,
  onPress,
  delay = 0,
}) => {
  // Animation hooks
  const { animatedStyle: pressStyle, onPressIn, onPressOut } = useButtonPress();
  const { animatedStyle: bounceStyle, bounce } = useBounceAnimation();
  const { animatedStyle: slideStyle, slideIn } = useSlideIn();
  const { animatedStyle: fadeStyle, fadeIn } = useFadeAnimation();

  // Animate in on mount
  useEffect(() => {
    const timer = setTimeout(() => {
      slideIn();
      fadeIn();
    }, delay);
    
    return () => clearTimeout(timer);
  }, [delay]);

  // Animate when unlocked changes
  useEffect(() => {
    if (unlocked) {
      bounce();
      HapticFeedback.achievement();
    }
  }, [unlocked]);

  const getRarityColor = () => {
    switch (achievement.rarity) {
      case 'common': return '#9CA3AF';
      case 'uncommon': return '#10B981';
      case 'rare': return '#3B82F6';
      case 'epic': return '#8B5CF6';
      case 'legendary': return '#F59E0B';
      default: return '#9CA3AF';
    }
  };

  const handlePress = () => {
    if (unlocked) {
      HapticFeedback.success();
      bounce();
    } else {
      HapticFeedback.light();
    }
    onPress?.();
  };

  const isSecret = achievement.secret && !unlocked;

  return (
    <Animated.View style={[slideStyle, fadeStyle]}>
      <Animated.View style={[pressStyle, bounceStyle]}>
        <TouchableOpacity
          style={[
            styles.card,
            unlocked ? styles.unlockedCard : styles.lockedCard,
          ]}
          onPress={handlePress}
          onPressIn={onPressIn}
          onPressOut={onPressOut}
          activeOpacity={0.8}
        >
          {/* Rarity Indicator */}
          <View
            style={[
              styles.rarityIndicator,
              { backgroundColor: getRarityColor() },
            ]}
          >
            <Text style={styles.rarityText}>
              {achievement.rarity.toUpperCase()}
            </Text>
          </View>

          {/* Achievement Icon */}
          <View style={styles.iconContainer}>
            {isSecret ? (
              <Lock size={32} color="#9CA3AF" />
            ) : (
              <Text style={styles.achievementIcon}>
                {unlocked ? achievement.icon : '🔒'}
              </Text>
            )}
          </View>

          {/* Achievement Info */}
          <View style={styles.content}>
            <Text
              style={[
                styles.title,
                !unlocked && styles.lockedText,
              ]}
              numberOfLines={2}
            >
              {isSecret ? 'Secret Achievement' : achievement.title}
            </Text>
            <Text
              style={[
                styles.description,
                !unlocked && styles.lockedText,
              ]}
              numberOfLines={3}
            >
              {isSecret ? 'Complete to unlock' : achievement.description}
            </Text>
          </View>

          {/* XP Reward */}
          {!isSecret && (
            <View style={styles.xpBadge}>
              <Zap size={12} color="#FFB800" />
              <Text style={styles.xpText}>+{achievement.xpReward}</Text>
            </View>
          )}

          {/* Unlock Status Overlay */}
          {unlocked && (
            <View style={styles.unlockedOverlay}>
              <View style={styles.unlockedBadge}>
                <Text style={styles.unlockedText}>✓</Text>
              </View>
            </View>
          )}
        </TouchableOpacity>
      </Animated.View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    padding: 16,
    margin: 8,
    borderWidth: 2,
    minHeight: 140,
    position: 'relative',
    overflow: 'hidden',
  },
  unlockedCard: {
    backgroundColor: '#F0FDF4',
    borderColor: '#BBF7D0',
  },
  lockedCard: {
    backgroundColor: '#F9FAFB',
    borderColor: '#E5E7EB',
  },
  rarityIndicator: {
    position: 'absolute',
    top: 8,
    right: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  rarityText: {
    fontSize: 8,
    fontFamily: 'Inter-Bold',
    color: '#fff',
  },
  iconContainer: {
    alignItems: 'center',
    marginBottom: 12,
  },
  achievementIcon: {
    fontSize: 32,
  },
  content: {
    flex: 1,
    alignItems: 'center',
  },
  title: {
    fontSize: 14,
    fontFamily: 'Inter-Bold',
    color: '#111827',
    textAlign: 'center',
    marginBottom: 8,
  },
  description: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 16,
  },
  lockedText: {
    color: '#9CA3AF',
  },
  xpBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginTop: 8,
    gap: 4,
  },
  xpText: {
    fontSize: 10,
    fontFamily: 'Inter-Bold',
    color: '#F59E0B',
  },
  unlockedOverlay: {
    position: 'absolute',
    top: 8,
    left: 8,
  },
  unlockedBadge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#10B981',
    alignItems: 'center',
    justifyContent: 'center',
  },
  unlockedText: {
    color: '#fff',
    fontSize: 12,
    fontFamily: 'Inter-Bold',
  },
}); 