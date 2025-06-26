import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Image,
} from 'react-native';
import { ArrowLeft, Play, Clock, Target, Flame, Heart, Share, MoveVertical as MoreVertical } from 'lucide-react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { workouts } from '@/data/workouts';
import { useCustomWorkoutStore } from '@/stores';
import { Workout } from '@/types/workout';

export default function WorkoutDetailScreen() {
  const { id } = useLocalSearchParams();
  const [workout, setWorkout] = useState<Workout | null>(null);
  const [isFavorite, setIsFavorite] = useState(false);
  
  // Get custom workouts from store
  const { customWorkouts } = useCustomWorkoutStore();

  useEffect(() => {
    if (id) {
      // First check regular workouts
      let foundWorkout = workouts.find(w => w.id === id);
      
      // If not found, check custom workouts
      if (!foundWorkout) {
        const customWorkout = customWorkouts.find(w => w.id === id);
        if (customWorkout) {
          // Convert custom workout to regular workout format for display
          foundWorkout = {
            ...customWorkout,
            exercises: customWorkout.exercises.map(exercise => ({
              id: exercise.id,
              name: exercise.name,
              description: exercise.description,
              duration: exercise.duration,
              instructions: exercise.selectedMoves.map(move => move.description),
              punchSequence: exercise.selectedMoves.flatMap(move => move.punchSequence || [])
            }))
          };
        }
      }
      
      setWorkout(foundWorkout || null);
    }
  }, [id, customWorkouts]);

  if (!workout) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.center}>
          <Text style={styles.errorText}>Workout not found</Text>
        </View>
      </SafeAreaView>
    );
  }

  const handleStartWorkout = () => {
    // Use unified timed workout player for all workouts
    router.push(`/timed-workout-player?id=${workout.id}`);
  };



  const handleBack = () => {
    router.back();
  };

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'Beginner': return '#4CAF50';
      case 'Intermediate': return '#FF9800';
      case 'Advanced': return '#F44336';
      default: return '#666';
    }
  };



  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Image source={{ uri: workout.imageUrl }} style={styles.heroImage} />
          <View style={styles.headerOverlay}>
            <View style={styles.headerTop}>
              <TouchableOpacity style={styles.backButton} onPress={handleBack}>
                <ArrowLeft size={24} color="#fff" />
              </TouchableOpacity>
              <View style={styles.headerActions}>
                <TouchableOpacity style={styles.actionButton} onPress={toggleFavorite}>
                  <Heart 
                    size={24} 
                    color={isFavorite ? "#FF4500" : "#fff"} 
                    fill={isFavorite ? "#FF4500" : "transparent"}
                  />
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionButton}>
                  <Share size={24} color="#fff" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionButton}>
                  <MoreVertical size={24} color="#fff" />
                </TouchableOpacity>
              </View>
            </View>
            <View style={styles.headerBottom}>
              <Text style={[styles.level, { color: getLevelColor(workout.level) }]}>
                {workout.level}
              </Text>
              <Text style={styles.title}>{workout.title}</Text>
            </View>
          </View>
        </View>

        <View style={styles.content}>
          <View style={styles.stats}>
            <View style={styles.stat}>
              <Clock size={20} color="#FF4500" />
              <Text style={styles.statValue}>{workout.duration}</Text>
              <Text style={styles.statLabel}>minutes</Text>
            </View>
            <View style={styles.stat}>
              <Target size={20} color="#FF4500" />
              <Text style={styles.statValue}>{workout.rounds}</Text>
              <Text style={styles.statLabel}>rounds</Text>
            </View>
            <View style={styles.stat}>
              <Flame size={20} color="#FF4500" />
              <Text style={styles.statValue}>{workout.calories}</Text>
              <Text style={styles.statLabel}>calories</Text>
            </View>
          </View>



          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Description</Text>
            <Text style={styles.description}>{workout.description}</Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Equipment</Text>
            {workout.equipment.length > 0 ? (
              <View style={styles.equipmentList}>
                {workout.equipment.map((item, index) => (
                  <View key={index} style={styles.equipmentItem}>
                    <Text style={styles.equipmentText}>{item}</Text>
                  </View>
                ))}
              </View>
            ) : (
              <Text style={styles.noEquipmentText}>No equipment needed</Text>
            )}
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Exercises ({workout.exercises.length})</Text>
            {workout.exercises.map((exercise, index) => (
              <View key={exercise.id} style={styles.exerciseCard}>
                <View style={styles.exerciseHeader}>
                  <View style={styles.exerciseNumber}>
                    <Text style={styles.exerciseNumberText}>{index + 1}</Text>
                  </View>
                  <View style={styles.exerciseInfo}>
                    <Text style={styles.exerciseName}>{exercise.name}</Text>
                    <Text style={styles.exerciseDuration}>
                      {Math.floor(exercise.duration / 60)}:{(exercise.duration % 60).toString().padStart(2, '0')}
                    </Text>
                  </View>
                </View>
                <Text style={styles.exerciseDescription}>{exercise.description}</Text>
                <View style={styles.exerciseInstructions}>
                  <Text style={styles.instructionsHeader}>
                    Key Points
                  </Text>
                  {exercise.instructions.slice(0, 3).map((instruction, instrIndex) => (
                    <Text key={instrIndex} style={styles.instructionText}>
                      • {instruction}
                    </Text>
                  ))}
                  {exercise.instructions.length > 3 && (
                    <Text style={styles.moreInstructions}>
                      +{exercise.instructions.length - 3} more during workout...
                    </Text>
                  )}
                </View>
              </View>
            ))}
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Workout Structure</Text>
            <View style={styles.structureCard}>
              <View style={styles.structureRow}>
                <Text style={styles.structureLabel}>Rounds:</Text>
                <Text style={styles.structureValue}>{workout.rounds}</Text>
              </View>
              <View style={styles.structureRow}>
                <Text style={styles.structureLabel}>Rest between rounds:</Text>
                <Text style={styles.structureValue}>{workout.restPeriod}s</Text>
              </View>
              <View style={styles.structureRow}>
                <Text style={styles.structureLabel}>Total duration:</Text>
                <Text style={styles.structureValue}>~{workout.duration} minutes</Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.startButton} onPress={handleStartWorkout}>
          <Play size={24} color="#fff" />
          <Text style={styles.startButtonText}>Start Workout</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a1a',
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorText: {
    fontSize: 18,
    fontFamily: 'Inter-Regular',
    color: '#666',
  },
  header: {
    position: 'relative',
    height: 300,
  },
  heroImage: {
    width: '100%',
    height: '100%',
    backgroundColor: '#333',
  },
  headerOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    padding: 20,
    justifyContent: 'space-between',
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 40,
  },
  backButton: {
    width: 44,
    height: 44,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerActions: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    width: 44,
    height: 44,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerBottom: {
    paddingBottom: 20,
  },
  level: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    marginBottom: 8,
    paddingHorizontal: 12,
    paddingVertical: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  title: {
    fontSize: 32,
    fontFamily: 'Inter-Bold',
    color: '#fff',
    marginTop: 8,
  },
  content: {
    padding: 20,
  },
  stats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#2a2a2a',
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
  },
  stat: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#fff',
    marginVertical: 4,
  },
  statLabel: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#666',
  },

  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: 'Inter-SemiBold',
    color: '#fff',
    marginBottom: 16,
  },
  description: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#ccc',
    lineHeight: 24,
  },
  equipmentList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  equipmentItem: {
    backgroundColor: '#2a2a2a',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  equipmentText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#fff',
  },
  noEquipmentText: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#666',
    fontStyle: 'italic',
  },
  exerciseCard: {
    backgroundColor: '#2a2a2a',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  exerciseHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  exerciseNumber: {
    width: 32,
    height: 32,
    backgroundColor: '#FF4500',
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  exerciseNumberText: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    color: '#fff',
  },
  exerciseInfo: {
    flex: 1,
  },
  exerciseName: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#fff',
    marginBottom: 2,
  },
  exerciseDuration: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#FF4500',
  },
  exerciseDescription: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#ccc',
    marginBottom: 12,
  },
  exerciseInstructions: {
    gap: 4,
  },
  instructionsHeader: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
    color: '#FF6B35',
    marginBottom: 8,
  },
  instructionText: {
    fontSize: 13,
    fontFamily: 'Inter-Regular',
    color: '#999',
    lineHeight: 18,
  },
  moreInstructions: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#FF6B35',
    fontStyle: 'italic',
    marginTop: 4,
  },
  structureCard: {
    backgroundColor: '#2a2a2a',
    borderRadius: 12,
    padding: 16,
  },
  structureRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  structureLabel: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#ccc',
  },
  structureValue: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#fff',
  },
  footer: {
    padding: 20,
    backgroundColor: '#1a1a1a',
  },
  startButton: {
    backgroundColor: '#FF4500',
    borderRadius: 16,
    padding: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  startButtonText: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#fff',
  },
});