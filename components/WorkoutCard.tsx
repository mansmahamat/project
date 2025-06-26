import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Clock, Flame, Target, TrendingUp } from 'lucide-react-native';
import { Workout } from '@/types/workout';
import { PunchSequenceDisplay } from './PunchSequenceDisplay';

interface WorkoutCardProps {
  workout: Workout;
  onPress: () => void;
  size?: 'small' | 'medium' | 'large';
}

export function WorkoutCard({ workout, onPress, size = 'medium' }: WorkoutCardProps) {
  const cardStyle = size === 'large' ? styles.cardLarge : size === 'small' ? styles.cardSmall : styles.cardMedium;
  const imageStyle = size === 'large' ? styles.imageLarge : size === 'small' ? styles.imageSmall : styles.imageMedium;

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
    <TouchableOpacity style={[styles.card, cardStyle]} onPress={onPress} activeOpacity={0.95}>
      <View style={styles.imageContainer}>
        <Image source={{ uri: workout.imageUrl }} style={[styles.image, imageStyle]} />
        <View style={styles.imageOverlay}>
          <View style={[styles.levelBadge, { backgroundColor: getLevelColor(workout.level) }]}>
            <Text style={styles.levelText}>{workout.level}</Text>
          </View>
          {workout.featured && (
            <View style={styles.featuredBadge}>
              <TrendingUp size={12} color="#fff" />
              <Text style={styles.featuredText}>Featured</Text>
            </View>
          )}
        </View>
      </View>
      
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title} numberOfLines={2}>{workout.title}</Text>
          <View style={[styles.categoryBadge, { backgroundColor: getCategoryColor(workout.category) }]}>
            <Text style={styles.categoryText}>{workout.category}</Text>
          </View>
        </View>
        
        <Text style={styles.description} numberOfLines={2}>
          {workout.description}
        </Text>
        
        {hasComboExercises && size !== 'small' && (
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
            <Clock size={16} color="#6B7280" />
            <Text style={styles.statText}>{workout.duration}min</Text>
          </View>
          <View style={styles.stat}>
            <Flame size={16} color="#6B7280" />
            <Text style={styles.statText}>{workout.calories}</Text>
          </View>
          <View style={styles.stat}>
            <Target size={16} color="#6B7280" />
            <Text style={styles.statText}>{workout.rounds} rounds</Text>
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
});