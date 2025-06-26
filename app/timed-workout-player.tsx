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
import { ArrowLeft, Play, Pause, SkipForward, RotateCcw, X, Camera as CameraIcon, Volume2, VolumeX } from 'lucide-react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import { Audio } from 'expo-av';
import { getTimedWorkout, getDynamicTimedWorkout, getCurrentInstruction, getNextInstruction, getUnifiedWorkout, getUnifiedWorkoutWithCustom } from '@/data/workouts';
import { useCustomWorkoutStore, useProgressStore, useOnboardingStore } from '@/stores';
import { TimedWorkout, TimedExercise, TimedPrompt } from '@/types/workout';

export default function TimedWorkoutPlayerScreen() {
  const { id } = useLocalSearchParams();
  const [workout, setWorkout] = useState<TimedWorkout | null>(null);
  
  // Get custom workouts from store
  const { customWorkouts } = useCustomWorkoutStore();
  const { completeWorkout } = useProgressStore();
  const { calculateWorkoutCalories } = useOnboardingStore();
  const [currentRound, setCurrentRound] = useState(1);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [elapsedTime, setElapsedTime] = useState(0); // Track elapsed time for prompts
  const [isPlaying, setIsPlaying] = useState(false);
  const [isResting, setIsResting] = useState(false);
  const [workoutCompleted, setWorkoutCompleted] = useState(false);
  const [currentInstruction, setCurrentInstruction] = useState<TimedPrompt | null>(null);
  const [nextInstruction, setNextInstruction] = useState<TimedPrompt | null>(null);
  const [countdown, setCountdown] = useState<number | null>(null);
  
  // Camera states
  const [permission, requestPermission] = useCameraPermissions();
  const [cameraMode, setCameraMode] = useState(false); // Camera mode toggle
  const [facing, setFacing] = useState<'front' | 'back'>('front');
  
  // Audio states
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [audioEnabled, setAudioEnabled] = useState(true);
  
  const intervalRef = useRef<number | null>(null);
  const lastPlayedInstructionRef = useRef<string | null>(null);

  // Audio setup and cleanup
  useEffect(() => {
    return () => {
      if (sound) {
        sound.unloadAsync();
      }
    };
  }, [sound]);

  // Auto-play audio when instruction changes
  useEffect(() => {
    const playInstructionAudio = async () => {
      if (!audioEnabled || !currentInstruction?.audioUrl) return;
      
      // Don't replay the same instruction audio
      const instructionKey = `${currentInstruction.instruction}-${elapsedTime}`;
      if (lastPlayedInstructionRef.current === instructionKey) return;
      
      try {
        // Stop any currently playing sound
        if (sound) {
          await sound.unloadAsync();
          setSound(null);
        }
        
        // Debug logging
        console.log(`🎧 Playing audio for: "${currentInstruction.instruction}" from: ${currentInstruction.audioUrl}`);
        
        // Load and play new audio
        const { sound: newSound } = await Audio.Sound.createAsync(
          { uri: currentInstruction.audioUrl },
          { shouldPlay: true, volume: 0.8 }
        );
        
        setSound(newSound);
        lastPlayedInstructionRef.current = instructionKey;
        
        // Auto-cleanup after audio finishes
        newSound.setOnPlaybackStatusUpdate((status) => {
          if (status.isLoaded && status.didJustFinish) {
            newSound.unloadAsync();
            setSound(null);
          }
        });
        
      } catch (error) {
        console.log('Error playing audio:', error);
      }
    };

    if (currentInstruction && isPlaying && !countdown) {
      playInstructionAudio();
    }
  }, [currentInstruction, audioEnabled, isPlaying, countdown]);

  useEffect(() => {
    // Set up audio
    Audio.setAudioModeAsync({
      allowsRecordingIOS: false,
      staysActiveInBackground: false,
      playsInSilentModeIOS: true,
      shouldDuckAndroid: true,
      playThroughEarpieceAndroid: false,
    });

    if (id) {
      const foundWorkout = getUnifiedWorkoutWithCustom(id as string, customWorkouts);
      if (foundWorkout) {
        setWorkout(foundWorkout);
        const firstRound = foundWorkout.exercises[0];
        setTimeRemaining(firstRound.duration);
        setElapsedTime(0);
        setIsResting(false);
        setCurrentRound(1);
        
        // Set initial instruction
        const initialInstruction = getCurrentInstruction(firstRound, 0);
        setCurrentInstruction(initialInstruction);
        setNextInstruction(getNextInstruction(firstRound, 0));
        
        // Start countdown sequence
        setCountdown(3);
        let countdownTimer = 3;
        const countdownInterval = setInterval(() => {
          countdownTimer--;
          if (countdownTimer > 0) {
            setCountdown(countdownTimer);
          } else {
            setCountdown(null);
            clearInterval(countdownInterval);
            // Start the actual workout timer
            setIsPlaying(true);
          }
        }, 1000);
      }
    }
  }, [id, customWorkouts]);

  useEffect(() => {
    if (isPlaying && timeRemaining > 0 && !isResting && workout) {
      intervalRef.current = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            handleRoundComplete();
            return 0;
          }
          return prev - 1;
        });
        
        setElapsedTime(prev => {
          const newElapsedTime = prev + 1;
          
          // Update current instruction based on elapsed time
          if (workout) {
            const currentRoundData = workout.exercises[currentRound - 1];
            const instruction = getCurrentInstruction(currentRoundData, newElapsedTime);
            const next = getNextInstruction(currentRoundData, newElapsedTime);
            
            setCurrentInstruction(instruction);
            setNextInstruction(next);
          }
          
          return newElapsedTime;
        });
      }, 1000);
    } else if (isPlaying && isResting && timeRemaining > 0) {
      // Rest period timer
      intervalRef.current = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            handleRestComplete();
            return 0;
          }
          return prev - 1;
        });
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
  }, [isPlaying, isResting, currentRound, workout]);

  const handleRoundComplete = () => {
    if (!workout) return;

    if (currentRound < workout.totalRounds) {
      // Start rest period
      setIsResting(true);
      setTimeRemaining(workout.restBetweenRounds);
      setCurrentInstruction({ time: 0, instruction: "Rest Period", type: "rest" });
      setNextInstruction(null);
    } else {
      // Workout completed
      handleWorkoutComplete();
    }
  };

  const handleRestComplete = () => {
    if (!workout) return;

    // Move to next round
    const nextRound = currentRound + 1;
    setCurrentRound(nextRound);
    setIsResting(false);
    setElapsedTime(0);
    
    const nextRoundData = workout.exercises[nextRound - 1];
    setTimeRemaining(nextRoundData.duration);
    
    // Set initial instruction for new round
    const initialInstruction = getCurrentInstruction(nextRoundData, 0);
    setCurrentInstruction(initialInstruction);
    setNextInstruction(getNextInstruction(nextRoundData, 0));
  };

  const handleWorkoutComplete = () => {
    setWorkoutCompleted(true);
    setIsPlaying(false);
    setCurrentInstruction({ time: 0, instruction: "Workout Complete!", type: "rest" });
    
    // Track workout completion with progress store
    if (workout) {
      const totalMinutes = workout.exercises.reduce((total, exercise) => 
        total + Math.floor(exercise.duration / 60), 0);
      
      // Calculate personalized calories based on user profile
      const personalizedCalories = calculateWorkoutCalories(totalMinutes, workout.category, workout.level);
      const caloriesBurned = personalizedCalories || workout.estimatedCalories || 0;
      
      // This automatically saves to AsyncStorage, updates stats, checks achievements, etc.
      completeWorkout(workout.id, totalMinutes, caloriesBurned, currentRound);
    }
    
    if (Platform.OS === 'web') {
      const shouldExit = confirm(`🥊 Workout Complete! Great job! You completed ${currentRound} rounds. Click OK to return to workouts.`);
      if (shouldExit) {
        router.back();
      }
    } else {
      Alert.alert(
        '🥊 Workout Complete!',
        `Great job! You completed ${currentRound} rounds and burned approximately ${workout?.estimatedCalories} calories.`,
        [{ text: 'Done', onPress: () => router.back() }]
      );
    }
  };

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const skipRound = () => {
    if (!workout) return;
    
    if (currentRound < workout.totalRounds) {
      setCurrentRound(prev => prev + 1);
      setIsResting(false);
      setElapsedTime(0);
      
      const nextRoundData = workout.exercises[currentRound];
      setTimeRemaining(nextRoundData.duration);
      
      const initialInstruction = getCurrentInstruction(nextRoundData, 0);
      setCurrentInstruction(initialInstruction);
      setNextInstruction(getNextInstruction(nextRoundData, 0));
    }
  };

  const restartRound = () => {
    if (!workout) return;
    
    if (isResting) {
      setTimeRemaining(workout.restBetweenRounds);
    } else {
      const currentRoundData = workout.exercises[currentRound - 1];
      setTimeRemaining(currentRoundData.duration);
      setElapsedTime(0);
      
      const initialInstruction = getCurrentInstruction(currentRoundData, 0);
      setCurrentInstruction(initialInstruction);
      setNextInstruction(getNextInstruction(currentRoundData, 0));
    }
  };

  const handleExit = () => {
    setIsPlaying(false);
    
    if (Platform.OS === 'web') {
      const shouldExit = confirm('Are you sure you want to exit? Your progress will be lost.');
      if (shouldExit) {
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
        }
        router.back();
      } else {
        setIsPlaying(true);
      }
    } else {
      Alert.alert(
        'Exit Workout',
        'Are you sure you want to exit? Your progress will be lost.',
        [
          { text: 'Cancel', style: 'cancel', onPress: () => setIsPlaying(true) },
          { 
            text: 'Exit', 
            style: 'destructive', 
            onPress: () => {
              if (intervalRef.current) {
                clearInterval(intervalRef.current);
              }
              router.back();
            }
          },
        ]
      );
    }
  };

  const toggleCameraMode = () => {
    setCameraMode(!cameraMode);
  };

  const flipCamera = () => {
    setFacing(current => (current === 'back' ? 'front' : 'back'));
  };

  const toggleAudio = () => {
    setAudioEnabled(!audioEnabled);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getInstructionColor = (type?: string) => {
    switch (type) {
      case 'combo': return '#FF4500';
      case 'defense': return '#00FF00';
      case 'movement': return '#00BFFF';
      case 'breathing': return '#FFD700';
      case 'stance': return '#FF69B4';
      case 'rest': return '#888';
      default: return '#FF4500';
    }
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

  const progress = (currentRound - 1) / workout.totalRounds;
  const circleProgress = isResting ? 
    (workout.restBetweenRounds - timeRemaining) / workout.restBetweenRounds : 
    (workout.exercises[currentRound - 1].duration - timeRemaining) / workout.exercises[currentRound - 1].duration;

  // Check camera permissions
  if (!permission) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.center}>
          <Text style={styles.errorText}>Loading camera...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!permission.granted) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.center}>
          <Text style={styles.errorText}>Camera permission required for the full workout experience</Text>
          <TouchableOpacity style={styles.backButton} onPress={requestPermission}>
            <Text style={styles.backButtonText}>Grant Camera Access</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.backButton, { backgroundColor: '#666', marginTop: 10 }]} onPress={() => router.back()}>
            <Text style={styles.backButtonText}>Skip Camera</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  // Render Camera Mode
  if (cameraMode && permission?.granted) {
    return (
      <View style={styles.container}>
        {/* Camera Background - TikTok Style */}
        <CameraView 
          style={styles.cameraBackground} 
          facing={facing}
        />

        {/* Overlay UI Container */}
        <SafeAreaView style={styles.overlayContainer}>
          {/* Header - Top Overlay */}
          <View style={styles.headerOverlay}>
            <TouchableOpacity style={styles.exitButton} onPress={handleExit}>
              <X size={24} color="#fff" />
            </TouchableOpacity>
            <Text style={styles.workoutTitle}>{workout.title}</Text>
            <View style={styles.headerRightButtons}>
              <TouchableOpacity style={styles.cameraButton} onPress={toggleAudio}>
                {audioEnabled ? (
                  <Volume2 size={20} color="#fff" />
                ) : (
                  <VolumeX size={20} color="#666" />
                )}
              </TouchableOpacity>
              <TouchableOpacity style={styles.cameraButton} onPress={toggleCameraMode}>
                <X size={24} color="#fff" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Round Info - Top Right */}
          <View style={styles.roundInfoOverlay}>
            <Text style={styles.roundText}>
              Round {currentRound}/{workout.totalRounds}
            </Text>
            <Text style={styles.timeText}>
              {formatTime(timeRemaining)}
            </Text>
          </View>

          {/* Main Instruction - Center */}
          <View style={styles.centerInstruction}>
            {countdown !== null ? (
              <>
                <Text style={styles.countdownText}>Get Ready!</Text>
                <Text style={styles.countdownNumber}>{countdown}</Text>
              </>
            ) : (
              <>
                <Text style={styles.mainInstructionText}>
                  {currentInstruction?.instruction || 'Ready'}
                </Text>
                <Text style={styles.timerOverlayText}>
                  {formatTime(timeRemaining)}
                </Text>
              </>
            )}
          </View>

          {/* Right Side Controls - Camera Style */}
          <View style={styles.rightControls}>
            <TouchableOpacity style={styles.rightControlButton} onPress={flipCamera}>
              <RotateCcw size={24} color="#fff" />
            </TouchableOpacity>
          </View>

          {/* Main Control - Center Bottom */}
          <View style={styles.centerControl}>
            <TouchableOpacity style={[
              styles.mainControlButton,
              isResting && styles.restControlButton
            ]} onPress={togglePlayPause}>
              {isPlaying ? (
                <Pause size={32} color="#fff" />
              ) : (
                <Play size={32} color="#fff" />
              )}
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </View>
    );
  }

  // Render Regular Workout Mode (Original Design)
  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.exitButton} onPress={handleExit}>
          <X size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.workoutTitle}>{workout.title}</Text>
        <View style={styles.headerRightButtons}>
          <TouchableOpacity style={styles.audioToggleButton} onPress={toggleAudio}>
            {audioEnabled ? (
              <Volume2 size={20} color="#FF4500" />
            ) : (
              <VolumeX size={20} color="#666" />
            )}
          </TouchableOpacity>
          <TouchableOpacity style={styles.cameraActivateButton} onPress={toggleCameraMode}>
            <CameraIcon size={24} color="#FF4500" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Round Info - Top Right */}
      <View style={styles.roundInfo}>
        <Text style={styles.roundText}>
          Round {currentRound}/{workout.totalRounds}
        </Text>
        <Text style={styles.timeText}>
          {formatTime(timeRemaining)}
        </Text>
      </View>

      {/* Progress Bar */}
      <View style={styles.progressContainer}>
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: `${progress * 100}%` }]} />
        </View>
      </View>

      {/* Main Timer Circle */}
      <View style={styles.timerContainer}>
        <View style={[
          styles.timerCircle, 
          isResting && styles.restCircle,
          {
            borderColor: circleProgress > 0.8 ? '#FF4500' : 
                         circleProgress > 0.5 ? '#FFB800' : 
                         circleProgress > 0.2 ? '#00FF00' : '#333',
            borderWidth: 8,
          }
        ]}>
          {countdown !== null ? (
            <Text style={styles.countdownNumberRegular}>{countdown}</Text>
          ) : (
            <Text style={styles.mainTimerText}>
              {formatTime(timeRemaining)}
            </Text>
          )}
        </View>
      </View>

      {/* Coach Instruction - Bottom Center */}
      <View style={styles.instructionContainer}>
        {countdown !== null ? (
          <>
            <Text style={styles.countdownTextRegular}>Get Ready!</Text>
            <Text style={styles.countdownNumberRegular}>{countdown}</Text>
          </>
        ) : (
          <View style={styles.instructionWithAudio}>
            <Text style={styles.instructionText}>
              {currentInstruction?.instruction || 'Ready'}
            </Text>
            {currentInstruction?.audioUrl && audioEnabled && (
              <View style={styles.audioIndicator}>
                <Volume2 size={16} color="#FF4500" />
              </View>
            )}
          </View>
        )}
      </View>

      {/* Clean Controls - Bottom */}
      <View style={styles.controls}>
        <TouchableOpacity style={styles.controlButton} onPress={restartRound}>
          <RotateCcw size={24} color="#fff" />
        </TouchableOpacity>
        
        <TouchableOpacity style={[
          styles.playButton,
          isResting && styles.restPlayButton
        ]} onPress={togglePlayPause}>
          {isPlaying ? (
            <Pause size={40} color="#fff" />
          ) : (
            <Play size={40} color="#fff" />
          )}
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.controlButton} onPress={skipRound}>
          <SkipForward size={24} color="#fff" />
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
  // Camera styles
  cameraBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  noCameraBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#1a1a1a',
  },
  overlayContainer: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  // Header overlay
  headerOverlay: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  cameraButton: {
    width: 40,
    height: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cameraActivateButton: {
    width: 40,
    height: 40,
    backgroundColor: 'rgba(255, 69, 0, 0.2)',
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#FF4500',
  },
  headerRightButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  audioToggleButton: {
    width: 40,
    height: 40,
    backgroundColor: 'rgba(255, 69, 0, 0.1)',
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#FF4500',
  },
  // Progress overlay
  progressOverlay: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  // Round info overlay
  roundInfoOverlay: {
    position: 'absolute',
    top: 100,
    right: 20,
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    padding: 12,
    borderRadius: 20,
  },
  // Center instruction
  centerInstruction: {
    position: 'absolute',
    top: '45%',
    left: 0,
    right: 0,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  mainInstructionText: {
    fontSize: 48,
    fontWeight: '900',
    color: '#fff',
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 8,
    marginBottom: 16,
  },
  timerOverlayText: {
    fontSize: 32,
    fontWeight: '700',
    color: '#FFB800',
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  countdownText: {
    fontSize: 28,
    fontWeight: '700',
    color: '#FF4500',
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 8,
    marginBottom: 16,
  },
  countdownNumber: {
    fontSize: 120,
    fontWeight: '900',
    color: '#FF4500',
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowOffset: { width: 0, height: 4 },
    textShadowRadius: 12,
  },
  countdownTextRegular: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FF4500',
    textAlign: 'center',
    marginBottom: 12,
  },
  countdownNumberRegular: {
    fontSize: 80,
    fontWeight: '900',
    color: '#FF4500',
    textAlign: 'center',
  },
  // Camera controls
  cameraControls: {
    position: 'absolute',
    right: 20,
    top: '50%',
    transform: [{ translateY: -50 }],
    gap: 16,
  },
  cameraControlButton: {
    width: 50,
    height: 50,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
  },
  // Right side controls - Snapchat style
  rightControls: {
    position: 'absolute',
    right: 20,
    top: '30%',
    gap: 24,
    alignItems: 'center',
  },
  rightControlButton: {
    width: 56,
    height: 56,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  controlLabel: {
    fontSize: 10,
    fontWeight: '600',
    color: '#fff',
    marginTop: 4,
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  // Mode selection - bottom
  modeSelection: {
    position: 'absolute',
    bottom: 100,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 32,
    paddingHorizontal: 40,
  },
  modeButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  activeModeButton: {
    backgroundColor: '#FF4500',
    borderColor: '#FF4500',
  },
  modeText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
    textAlign: 'center',
  },
  activeModeText: {
    color: '#fff',
    fontWeight: '700',
  },
  // Main control center
  centerControl: {
    position: 'absolute',
    bottom: 30,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  mainControlButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#FF4500',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 4,
    borderColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  restControlButton: {
    backgroundColor: '#888',
  },
  // Old bottom controls (keeping for backwards compatibility)
  bottomControls: {
    position: 'absolute',
    bottom: 50,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 60,
    gap: 40,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    paddingVertical: 20,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  errorText: {
    fontSize: 18,
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
    fontWeight: '600',
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
    fontWeight: '600',
    color: '#fff',
    flex: 1,
    textAlign: 'center',
    marginHorizontal: 16,
  },
  placeholder: {
    width: 40,
  },
  roundInfo: {
    alignItems: 'center',
    marginBottom: 20,
  },
  roundText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FF4500',
    backgroundColor: 'rgba(255, 69, 0, 0.2)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginBottom: 8,
  },
  timeText: {
    fontSize: 14,
    color: '#888',
  },
  progressContainer: {
    paddingHorizontal: 20,
    marginBottom: 40,
  },
  progressBar: {
    height: 4,
    backgroundColor: '#333',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#FF4500',
    borderRadius: 2,
  },
  timerContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 40,
  },
  timerCircle: {
    width: 280,
    height: 280,
    borderRadius: 140,
    backgroundColor: '#2a2a2a',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    borderWidth: 8,
    borderColor: '#333',
  },
  restCircle: {
    borderColor: '#555',
  },
  progressRing: {
    position: 'absolute',
    width: 280,
    height: 280,
    borderRadius: 140,
    borderWidth: 8,
    borderColor: '#FF4500',
    borderRightColor: 'transparent',
  },
  progressRingBg: {
    position: 'absolute',
    width: 280,
    height: 280,
    borderRadius: 140,
    borderWidth: 8,
    borderColor: '#333',
  },
  progressMask: {
    position: 'absolute',
    width: 140,
    height: 280,
    backgroundColor: '#2a2a2a',
    right: 0,
  },
  instructionText: {
    fontSize: 42,
    fontWeight: '700',
    color: '#FFFFFF',
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  instructionWithAudio: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  audioIndicator: {
    marginTop: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    backgroundColor: 'rgba(255, 69, 0, 0.2)',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  timerText: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFB800',
    textAlign: 'center',
  },
  mainTimerText: {
    fontSize: 48,
    fontWeight: '900',
    color: '#FFB800',
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  instructionContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 60,
    paddingHorizontal: 20,
    position: 'absolute',
    bottom: 120,
    left: 0,
    right: 0,
  },
  coachInstructionContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 40,
    paddingHorizontal: 20,
    minHeight: 120,
  },
  coachInstructionText: {
    fontSize: 48,
    fontWeight: '900',
    color: '#FFB800',
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 8,
  },
  nextInstructionContainer: {
    alignItems: 'center',
    marginBottom: 30,
    paddingHorizontal: 20,
  },
  nextInstructionLabel: {
    fontSize: 14,
    color: '#888',
    marginBottom: 4,
  },
  nextInstructionText: {
    fontSize: 16,
    color: '#ccc',
    textAlign: 'center',
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    bottom: 40,
    left: 0,
    right: 0,
  },
  controlButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#333',
    alignItems: 'center',
    justifyContent: 'center',
  },
  playButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#FF4500',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 30,
  },
  restPlayButton: {
    backgroundColor: '#888',
  },
  stats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  stat: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 20,
    fontWeight: '700',
    color: '#fff',
  },
  statLabel: {
    fontSize: 12,
    color: '#888',
    marginTop: 4,
  },
}); 