import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Clock, Flame, Target, TrendingUp, Lock, Crown } from 'lucide-react-native';
import { Workout } from '@/types/workout';
import { PunchSequenceDisplay } from './PunchSequenceDisplay';

interface WorkoutCardProps {
  workout: Workout;
  onPress: () => void;
  size?: 'small' | 'medium' | 'large';
  isCustom?: boolean;
}

export function WorkoutCard({ workout, onPress, size = 'medium', isCustom = false }: WorkoutCardProps) {
  const cardStyle = size === 'large' ? styles.cardLarge : size === 'small' ? styles.cardSmall : styles.cardMedium;
  const imageStyle = size === 'large' ? styles.imageLarge : size === 'small' ? styles.imageSmall : styles.imageMedium;
  const isPremium = workout.premium || isCustom;

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'Beginner': return '#00D4AA';
      case 'Intermediate': return '#FFB800';
      case 'Advanced': return '#FF6B35';
      default: return '#9CA3AF';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'HIIT': return '#FF6B35';
      case 'Freestyle': return '#8B5CF6';
      case 'Defense': return '#00D4AA';
      case 'Footwork': return '#FFB800';
      case 'Combos': return '#EC4899';
      case 'Punching Bag': return '#F59E0B';
      default: return '#6B7280';
    }
  };

  // Check if workout has combo exercises
  const hasComboExercises = workout.exercises.some(exercise => exercise.punchSequence && exercise.punchSequence.length > 0);

  return (
    <TouchableOpacity 
      style={[
        styles.card, 
        cardStyle, 
        isPremium && styles.premiumCard
      ]} 
      onPress={onPress} 
      activeOpacity={0.95}
    >
      <View style={styles.imageContainer}>
        <Image 
          source={{ uri: workout.imageUrl }} 
          style={[
            styles.image, 
            imageStyle,
            isPremium && styles.premiumImage
          ]} 
        />
        
        {/* Premium Overlay with Lock */}
        {isPremium && (
          <View style={styles.premiumOverlay}>
            <View style={styles.lockContainer}>
              <Lock size={32} color="#FFFFFF" />
            </View>
          </View>
        )}
        
        <View style={styles.imageOverlay}>
          <View style={[styles.levelBadge, { backgroundColor: getLevelColor(workout.level) }]}>
            <Text style={styles.levelText}>{workout.level}</Text>
          </View>
          
          <View style={styles.badgeContainer}>
            {/* Premium Badge */}
            {isPremium && (
              <View style={styles.premiumBadge}>
                <Crown size={12} color="#FFD700" />
                <Text style={styles.premiumBadgeText}>
                  {isCustom ? 'CUSTOM' : 'PREMIUM'}
                </Text>
              </View>
            )}
            
            {workout.featured && (
              <View style={styles.featuredBadge}>
                <TrendingUp size={12} color="#fff" />
                <Text style={styles.featuredText}>Featured</Text>
              </View>
            )}
          </View>
        </View>
      </View>
      
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={[
            styles.title, 
            isPremium && styles.premiumTitle
          ]} numberOfLines={2}>
            {isPremium ? `🔒 ${workout.title}` : workout.title}
          </Text>
          <View style={[styles.categoryBadge, { backgroundColor: getCategoryColor(workout.category) }]}>
            <Text style={styles.categoryText}>{workout.category}</Text>
          </View>
        </View>
        
        {/* Premium unlock message */}
        {isPremium && (
          <View style={styles.premiumMessage}>
            <Crown size={14} color="#FFD700" />
            <Text style={styles.premiumMessageText}>Tap to unlock premium content</Text>
          </View>
        )}
        
        <Text style={[
          styles.description,
          isPremium && styles.premiumDescription
        ]} numberOfLines={2}>
          {workout.description}
        </Text>
        
        {hasComboExercises && size !== 'small' && !isPremium && (
          <View style={styles.comboPreview}>
            {workout.exercises
              .filter(exercise => exercise.punchSequence && exercise.punchSequence.length > 0)
              .slice(0, 1)
              .map((exercise, index) => (
                <View key={index} style={styles.comboContainer}>
                  <Text style={styles.comboLabel}>Featured Combo:</Text>
                  <PunchSequenceDisplay 
                    sequence={exercise.punchSequence!} 
                    size="small" 
                    showNumbers={true}
                  />
                </View>
              ))
            }
          </View>
        )}
        
        <View style={styles.stats}>
          <View style={styles.stat}>
            <Clock size={16} color={isPremium ? "#D1D5DB" : "#6B7280"} />
            <Text style={[styles.statText, isPremium && styles.premiumStatText]}>
              {workout.duration}min
            </Text>
          </View>
          <View style={styles.stat}>
            <Flame size={16} color={isPremium ? "#D1D5DB" : "#6B7280"} />
            <Text style={[styles.statText, isPremium && styles.premiumStatText]}>
              {workout.calories}
            </Text>
          </View>
          <View style={styles.stat}>
            <Target size={16} color={isPremium ? "#D1D5DB" : "#6B7280"} />
            <Text style={[styles.statText, isPremium && styles.premiumStatText]}>
              {workout.rounds} rounds
            </Text>
          </View>
        </View>
        
        {workout.equipment.length > 0 && (
          <View style={styles.equipmentContainer}>
            <Text style={styles.equipmentLabel}>Equipment needed</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  cardSmall: {
    width: 280,
    marginRight: 16,
  },
  cardMedium: {
    marginHorizontal: 20,
    marginBottom: 16,
  },
  cardLarge: {
    marginHorizontal: 20,
    marginBottom: 20,
  },
  imageContainer: {
    position: 'relative',
  },
  image: {
    width: '100%',
    backgroundColor: '#F3F4F6',
  },
  imageSmall: {
    height: 140,
  },
  imageMedium: {
    height: 180,
  },
  imageLarge: {
    height: 220,
  },
  imageOverlay: {
    position: 'absolute',
    top: 12,
    left: 12,
    right: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  levelBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  levelText: {
    fontSize: 11,
    fontFamily: 'Inter-SemiBold',
    color: '#fff',
  },
  featuredBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  featuredText: {
    fontSize: 10,
    fontFamily: 'Inter-SemiBold',
    color: '#fff',
  },
  content: {
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  title: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#111827',
    flex: 1,
    marginRight: 12,
  },
  categoryBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  categoryText: {
    fontSize: 10,
    fontFamily: 'Inter-SemiBold',
    color: '#fff',
  },
  description: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    marginBottom: 12,
    lineHeight: 20,
  },
  comboPreview: {
    marginBottom: 12,
  },
  comboContainer: {
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  comboLabel: {
    fontSize: 11,
    fontFamily: 'Inter-SemiBold',
    color: '#FF6B35',
    marginBottom: 8,
  },
  stats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  stat: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 6,
  },
  statText: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#6B7280',
  },
  equipmentContainer: {
    marginTop: 4,
  },
  equipmentLabel: {
    fontSize: 11,
    fontFamily: 'Inter-Medium',
    color: '#F59E0B',
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  premiumCard: {
    borderWidth: 2,
    borderColor: '#FFD700',
    shadowColor: '#FFD700',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },
  premiumImage: {
    opacity: 0.7,
  },
  premiumOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  lockContainer: {
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    padding: 12,
    borderRadius: 50,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  badgeContainer: {
    flexDirection: 'column',
    alignItems: 'flex-end',
    gap: 6,
  },
  premiumBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 215, 0, 0.9)',
    shadowColor: '#FFD700',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  premiumBadgeText: {
    fontSize: 10,
    fontFamily: 'Inter-Bold',
    color: '#000',
  },
  premiumTitle: {
    color: '#1F2937',
  },
  premiumMessage: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#FFD700',
  },
  premiumMessageText: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
    color: '#F59E0B',
    flex: 1,
  },
  premiumDescription: {
    color: '#6B7280',
  },
  premiumStatText: {
    color: '#9CA3AF',
  },
});