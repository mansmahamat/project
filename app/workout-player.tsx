import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Alert,
  Platform,
} from 'react-native';
import { ArrowLeft, Play, Pause, SkipForward, RotateCcw, X, CircleHelp as HelpCircle } from 'lucide-react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { workouts } from '@/data/workouts';
import { Workout, Exercise } from '@/types/workout';
import { PunchSequenceDisplay } from '@/components/PunchSequenceDisplay';
import { useProgressStore, useOnboardingStore } from '@/stores';
import { useCustomWorkoutStore, CustomWorkout } from '@/stores/useCustomWorkoutStore';

export default function WorkoutPlayerScreen() {
  const { id } = useLocalSearchParams();
  const { completeWorkout } = useProgressStore();
  const { calculateWorkoutCalories } = useOnboardingStore();
  const { getCustomWorkout } = useCustomWorkoutStore();
  
  const [workout, setWorkout] = useState<Workout | CustomWorkout | null>(null);
  const [currentRound, setCurrentRound] = useState(1);
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isResting, setIsResting] = useState(false);
  const [workoutCompleted, setWorkoutCompleted] = useState(false);
  const [totalWorkoutTime, setTotalWorkoutTime] = useState(0);
  const [currentPunchIndex, setCurrentPunchIndex] = useState(0);
  const [showExitConfirm, setShowExitConfirm] = useState(false);
  
  const intervalRef = useRef<number | null>(null);
  const startTimeRef = useRef<number>(0);

  // Type guard to check if it's a custom workout
  const isCustomWorkout = (workout: Workout | CustomWorkout): workout is CustomWorkout => {
    return 'isCustom' in workout && workout.isCustom === true;
  };

  // Helper function to get punch sequence from exercise
  const getPunchSequence = (exercise: Exercise | any): number[] | undefined => {
    if (isCustomWorkout(workout!)) {
      // For custom workouts, get punch sequence from selected moves
      const customExercise = exercise as any;
      if (customExercise.selectedMoves) {
        const firstMove = customExercise.selectedMoves.find((move: any) => move.punchSequence);
        return firstMove?.punchSequence;
      }
      return undefined;
    } else {
      // For regular workouts
      return exercise.punchSequence;
    }
  };

  // Helper function to get exercise instructions
  const getExerciseInstructions = (exercise: Exercise | any): string[] => {
    if (isCustomWorkout(workout!)) {
      // For custom workouts, generate instructions from selected moves
      const customExercise = exercise as any;
      if (customExercise.selectedMoves) {
        return customExercise.selectedMoves.map((move: any) => `• ${move.description}`);
      }
      return ['• Follow the displayed moves', '• Maintain proper form', '• Keep breathing steady'];
    } else {
      // For regular workouts
      return exercise.instructions || [];
    }
  };

  useEffect(() => {
    if (id) {
      // First check regular workouts
      let foundWorkout: Workout | CustomWorkout | undefined = workouts.find(w => w.id === id);
      
      // If not found, check custom workouts
      if (!foundWorkout) {
        foundWorkout = getCustomWorkout(id as string);
      }
      
      if (foundWorkout) {
        setWorkout(foundWorkout);
        // For custom workouts, use the first exercise duration, or default to 3 minutes
        const firstExerciseDuration = foundWorkout.exercises?.[0]?.duration || 180;
        setTimeRemaining(firstExerciseDuration);
        startTimeRef.current = Date.now();
      }
    }
  }, [id, getCustomWorkout]);

  useEffect(() => {
    if (isPlaying && timeRemaining > 0) {
      intervalRef.current = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            handleTimerComplete();
            return 0;
          }
          return prev - 1;
        });
        setTotalWorkoutTime(prev => prev + 1);
        
        // Update punch progression for combo exercises
        if (!isResting && workout) {
          const currentExercise = workout.exercises[currentExerciseIndex];
          const punchSequence = getPunchSequence(currentExercise);
          if (punchSequence && punchSequence.length > 0) {
            const exerciseDuration = currentExercise.duration;
            const punchCount = punchSequence.length;
            const timePerPunch = exerciseDuration / (punchCount * 3); // Multiple repetitions
            const elapsedTime = exerciseDuration - timeRemaining;
            const newPunchIndex = Math.floor(elapsedTime / timePerPunch) % punchCount;
            setCurrentPunchIndex(newPunchIndex);
          }
        }
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isPlaying, timeRemaining, isResting, workout, currentExerciseIndex]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  const handleTimerComplete = () => {
    if (!workout) return;

    if (isResting) {
      // Rest period is over, start next round
      setIsResting(false);
      setCurrentPunchIndex(0);
      if (currentRound < workout.rounds) {
        setCurrentRound(prev => prev + 1);
        setCurrentExerciseIndex(0);
        setTimeRemaining(workout.exercises[0].duration);
      } else {
        handleWorkoutComplete();
      }
    } else {
      // Exercise/Round is over
      if (currentExerciseIndex < workout.exercises.length - 1) {
        // Next exercise in current round
        setCurrentExerciseIndex(prev => prev + 1);
        setTimeRemaining(workout.exercises[currentExerciseIndex + 1].duration);
      } else if (currentRound < workout.rounds) {
        // Start rest period before next round
        setIsResting(true);
        setCurrentPunchIndex(0);
        setTimeRemaining(workout.restPeriod);
      } else {
        // Workout completed
        handleWorkoutComplete();
      }
    }
  };

  const handleWorkoutComplete = () => {
    setWorkoutCompleted(true);
    setIsPlaying(false);
    
    // Track workout completion with progress store
    if (workout) {
      const durationMinutes = Math.floor(totalWorkoutTime / 60);
      
      // Calculate personalized calories based on user profile
      const personalizedCalories = calculateWorkoutCalories(durationMinutes, workout.category, workout.level);
      const caloriesBurned = personalizedCalories || workout.calories || 0;
      
      // This automatically saves to AsyncStorage, updates stats, checks achievements, etc.
      completeWorkout(workout.id, durationMinutes, caloriesBurned, currentRound);
    }

    if (Platform.OS === 'web') {
      // For web, use a simple confirm dialog
      const shouldExit = confirm(`🥊 Workout Complete! Great job! You completed ${currentRound} rounds (${Math.floor(totalWorkoutTime / 60)} minutes) and burned approximately ${workout?.calories} calories. Click OK to return to workouts.`);
      if (shouldExit) {
        router.back();
      }
    } else {
      Alert.alert(
        '🥊 Workout Complete!',
        `Great job! You completed ${currentRound} rounds (${Math.floor(totalWorkoutTime / 60)} minutes) and burned approximately ${workout?.calories} calories.`,
        [
          {
            text: 'Done',
            onPress: () => router.back(),
          },
        ]
      );
    }
  };

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const skipExercise = () => {
    if (!workout) return;
    
    if (currentExerciseIndex < workout.exercises.length - 1) {
      setCurrentExerciseIndex(prev => prev + 1);
      setTimeRemaining(workout.exercises[currentExerciseIndex + 1].duration);
    } else if (currentRound < workout.rounds) {
      setCurrentRound(prev => prev + 1);
      setCurrentExerciseIndex(0);
      setTimeRemaining(workout.exercises[0].duration);
    }
    setIsResting(false);
    setCurrentPunchIndex(0);
  };

  const restartExercise = () => {
    if (!workout) return;
    
    const currentExercise = workout.exercises[currentExerciseIndex];
    setTimeRemaining(isResting ? workout.restPeriod : currentExercise.duration);
    setCurrentPunchIndex(0);
  };

  const handleExitRequest = () => {
    // Stop the workout timer
    setIsPlaying(false);
    
    if (Platform.OS === 'web') {
      // For web, use a simple confirm dialog
      const shouldExit = confirm('Are you sure you want to exit? Your progress will be lost.');
      if (shouldExit) {
        // Clean up timer
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
        }
        router.back();
      } else {
        // Resume if they cancel
        setIsPlaying(true);
      }
    } else {
      // For mobile, use Alert
      Alert.alert(
        'Exit Workout',
        'Are you sure you want to exit? Your progress will be lost.',
        [
          { 
            text: 'Cancel', 
            style: 'cancel',
            onPress: () => {
              // Resume the workout if they cancel
              setIsPlaying(true);
            }
          },
          { 
            text: 'Exit', 
            style: 'destructive', 
            onPress: () => {
              // Clean up timer
              if (intervalRef.current) {
                clearInterval(intervalRef.current);
                intervalRef.current = null;
              }
              router.back();
            }
          },
        ]
      );
    }
  };

  const handleHelp = () => {
    // Pause the workout when opening help
    const wasPlaying = isPlaying;
    setIsPlaying(false);
    
    router.push('/punch-library');
    
    // Note: We don't auto-resume here as the user might spend time in the library
    // They can manually resume when they return
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (!workout) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.center}>
          <Text style={styles.errorText}>Workout not found</Text>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <Text style={styles.backButtonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const currentExercise = workout.exercises[currentExerciseIndex];
  const progress = ((currentRound - 1) * workout.exercises.length + currentExerciseIndex + 1) / 
                  (workout.rounds * workout.exercises.length);

  // Calculate if this is a full 3-minute round
  const isFullRound = currentExercise.duration === 180;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.exitButton} onPress={handleExitRequest}>
          <X size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.workoutTitle}>{workout.title}</Text>
        <TouchableOpacity style={styles.helpButton} onPress={handleHelp}>
          <HelpCircle size={24} color="#FF4500" />
        </TouchableOpacity>
      </View>

      <View style={styles.roundInfo}>
        <Text style={styles.roundText}>
          Round {currentRound}/{workout.rounds}
          {isFullRound && !isResting && ' • 3 MIN ROUND'}
        </Text>
        {isResting && (
          <Text style={styles.restText}>REST PERIOD</Text>
        )}
      </View>

      <View style={styles.progressContainer}>
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: `${progress * 100}%` }]} />
        </View>
      </View>

      <View style={styles.timerContainer}>
        <View style={[
          styles.timerCircle,
          isResting && styles.timerCircleRest,
          timeRemaining <= 10 && !isResting && styles.timerCircleWarning
        ]}>
          <Text style={[
            styles.timerText,
            isResting && styles.timerTextRest
          ]}>
            {formatTime(timeRemaining)}
          </Text>
          <Text style={[
            styles.timerLabel,
            isResting && styles.timerLabelRest
          ]}>
            {isResting ? 'Rest' : isFullRound ? 'Boxing Round' : 'Exercise'}
          </Text>
        </View>
      </View>

      <View style={styles.exerciseInfo}>
        {isResting ? (
          <>
            <Text style={styles.exerciseName}>Rest Period</Text>
            <Text style={styles.nextExerciseText}>
              Next: Round {currentRound < workout.rounds ? currentRound + 1 : 'Complete'}
            </Text>
            <Text style={styles.restInstructions}>
              • Breathe deeply and recover{'\n'}
              • Stay loose and relaxed{'\n'}
              • Prepare mentally for next round{'\n'}
              • Hydrate if needed
            </Text>
          </>
        ) : (
          <>
            <Text style={styles.exerciseName}>{currentExercise.name}</Text>
            <Text style={styles.exerciseDescription}>{currentExercise.description}</Text>
            
            {(() => {
              const punchSequence = getPunchSequence(currentExercise);
              return punchSequence && punchSequence.length > 0 && (
                <View style={styles.sequenceContainer}>
                  <PunchSequenceDisplay 
                    sequence={punchSequence} 
                    size="large" 
                    showNumbers={true}
                    currentPunch={currentPunchIndex}
                  />
                </View>
              );
            })()}
            
            <View style={styles.instructions}>
              {getExerciseInstructions(currentExercise).map((instruction, index) => (
                <Text key={index} style={styles.instructionText}>
                  {instruction}
                </Text>
              ))}
            </View>
          </>
        )}
      </View>

      <View style={styles.controls}>
        <TouchableOpacity style={styles.controlButton} onPress={restartExercise}>
          <RotateCcw size={24} color="#fff" />
        </TouchableOpacity>
        
        <TouchableOpacity style={[
          styles.playButton,
          isResting && styles.playButtonRest
        ]} onPress={togglePlayPause}>
          {isPlaying ? (
            <Pause size={32} color="#fff" />
          ) : (
            <Play size={32} color="#fff" />
          )}
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.controlButton} onPress={skipExercise}>
          <SkipForward size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      <View style={styles.stats}>
        <View style={styles.stat}>
          <Text style={styles.statValue}>{Math.floor(totalWorkoutTime / 60)}</Text>
          <Text style={styles.statLabel}>Minutes</Text>
        </View>
        <View style={styles.stat}>
          <Text style={styles.statValue}>{currentExerciseIndex + 1}</Text>
          <Text style={styles.statLabel}>Exercise</Text>
        </View>
        <View style={styles.stat}>
          <Text style={styles.statValue}>{Math.round((workout.calories / workout.duration) * (totalWorkoutTime / 60))}</Text>
          <Text style={styles.statLabel}>Calories</Text>
        </View>
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
    paddingHorizontal: 20,
  },
  errorText: {
    fontSize: 18,
    fontFamily: 'Inter-Regular',
    color: '#666',
    marginBottom: 20,
    textAlign: 'center',
  },
  backButton: {
    backgroundColor: '#FF4500',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
  },
  backButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
  },
  exitButton: {
    width: 40,
    height: 40,
    backgroundColor: '#FF4444',
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  workoutTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#fff',
    flex: 1,
    textAlign: 'center',
    marginHorizontal: 16,
  },
  helpButton: {
    width: 40,
    height: 40,
    backgroundColor: 'rgba(255, 69, 0, 0.2)',
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  roundInfo: {
    alignItems: 'center',
    marginBottom: 16,
  },
  roundText: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    color: '#FF4500',
    backgroundColor: 'rgba(255, 69, 0, 0.2)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  restText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#00D4AA',
    backgroundColor: 'rgba(0, 212, 170, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    marginTop: 8,
  },
  progressContainer: {
    paddingHorizontal: 20,
    marginBottom: 40,
  },
  progressBar: {
    height: 4,
    backgroundColor: '#333',
    borderRadius: 2,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#FF4500',
    borderRadius: 2,
  },
  timerContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  timerCircle: {
    width: 240,
    height: 240,
    borderRadius: 120,
    borderWidth: 8,
    borderColor: '#FF4500',
    alignItems: 'center',
    justifyContent: 'center',
  },
  timerCircleRest: {
    borderColor: '#00D4AA',
  },
  timerCircleWarning: {
    borderColor: '#FFB800',
  },
  timerText: {
    fontSize: 48,
    fontFamily: 'Inter-Bold',
    color: '#fff',
  },
  timerTextRest: {
    color: '#00D4AA',
  },
  timerLabel: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#FF4500',
    marginTop: 8,
  },
  timerLabelRest: {
    color: '#00D4AA',
  },
  exerciseInfo: {
    paddingHorizontal: 20,
    marginBottom: 40,
    alignItems: 'center',
  },
  exerciseName: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 8,
  },
  exerciseDescription: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#ccc',
    textAlign: 'center',
    marginBottom: 16,
  },
  sequenceContainer: {
    marginBottom: 16,
  },
  nextExerciseText: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#FF4500',
    textAlign: 'center',
    marginBottom: 16,
  },
  instructions: {
    alignItems: 'flex-start',
  },
  instructionText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#999',
    marginBottom: 4,
  },
  restInstructions: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#00D4AA',
    textAlign: 'center',
    lineHeight: 20,
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    marginBottom: 40,
    gap: 24,
  },
  controlButton: {
    width: 56,
    height: 56,
    backgroundColor: '#333',
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  playButton: {
    width: 80,
    height: 80,
    backgroundColor: '#FF4500',
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  playButtonRest: {
    backgroundColor: '#00D4AA',
  },
  stats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 20,
  },
  stat: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#fff',
  },
  statLabel: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#666',
    marginTop: 4,
  },
});