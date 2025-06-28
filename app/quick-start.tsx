import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Alert,
  Platform,
  ScrollView,
  Modal,
} from 'react-native';
import { ArrowLeft, Play, Pause, SkipForward, RotateCcw, X, Settings, Volume2, VolumeX, Video, List, CircleCheck as CheckCircle, Circle } from 'lucide-react-native';
import { router } from 'expo-router';
import { QUICK_START_PROGRAM, FREESTYLE_CALLOUTS, QuickStartInstruction, QuickStartSection } from '@/data/workouts';
import { PunchSequenceDisplay } from '@/components/PunchSequenceDisplay';
import VideoPlayer from '@/components/VideoPlayer';
import * as Haptics from 'expo-haptics';

interface FlatInstruction extends QuickStartInstruction {
  sectionTitle: string;
  globalIndex: number;
  completed: boolean;
}

export default function QuickStartScreen() {
  const [currentInstructionIndex, setCurrentInstructionIndex] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [programCompleted, setProgramCompleted] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [hapticEnabled, setHapticEnabled] = useState(true);
  const [showSettings, setShowSettings] = useState(false);
  const [showVideo, setShowVideo] = useState(false);
  const [showInstructionList, setShowInstructionList] = useState(false);
  const [currentFreestyleCallout, setCurrentFreestyleCallout] = useState(0);
  const [freestyleCalloutTime, setFreestyleCalloutTime] = useState(0);
  const [completedInstructions, setCompletedInstructions] = useState<Set<number>>(new Set());
  
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const freestyleIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const startTimeRef = useRef<number>(0);

  // Flatten all instructions with global indexing
  const flatInstructions: FlatInstruction[] = [];
  let globalIndex = 0;
  QUICK_START_PROGRAM.forEach(section => {
    section.instructions.forEach(instruction => {
      flatInstructions.push({
        ...instruction,
        sectionTitle: section.title,
        globalIndex: globalIndex++,
        completed: completedInstructions.has(globalIndex)
      });
    });
  });

  const currentInstruction = flatInstructions[currentInstructionIndex];

  useEffect(() => {
    if (currentInstruction) {
      setTimeRemaining(currentInstruction.duration);
      setShowVideo(currentInstruction.type === 'demo' && !!currentInstruction.videoUrl);
      startTimeRef.current = Date.now();
    }
  }, [currentInstructionIndex]);

  useEffect(() => {
    if (isPlaying && timeRemaining > 0 && !programCompleted) {
      intervalRef.current = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            handleInstructionComplete();
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
  }, [isPlaying, timeRemaining, programCompleted]);

  // Freestyle callout system - but keep display static
  useEffect(() => {
    if (isPlaying && currentInstruction?.type === 'freestyle' && currentInstruction.id.includes('round')) {
      freestyleIntervalRef.current = setInterval(() => {
        setFreestyleCalloutTime(prev => {
          if (prev <= 0) {
            // Change callout every 3-5 seconds but don't change the main display
            setCurrentFreestyleCallout(Math.floor(Math.random() * FREESTYLE_CALLOUTS.length));
            playFeedback();
            return Math.floor(Math.random() * 3) + 3; // 3-5 seconds
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (freestyleIntervalRef.current) {
        clearInterval(freestyleIntervalRef.current);
        freestyleIntervalRef.current = null;
      }
    }

    return () => {
      if (freestyleIntervalRef.current) {
        clearInterval(freestyleIntervalRef.current);
      }
    };
  }, [isPlaying, currentInstruction]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      if (freestyleIntervalRef.current) {
        clearInterval(freestyleIntervalRef.current);
      }
    };
  }, []);

  const playFeedback = () => {
    // Play sound/haptic feedback
    if (Platform.OS !== 'web') {
      if (hapticEnabled) {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      }
    }
    
    if (soundEnabled) {
      // Web audio feedback
      if (Platform.OS === 'web') {
        try {
          const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
          const oscillator = audioContext.createOscillator();
          const gainNode = audioContext.createGain();
          
          oscillator.connect(gainNode);
          gainNode.connect(audioContext.destination);
          
          oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
          gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
          gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
          
          oscillator.start(audioContext.currentTime);
          oscillator.stop(audioContext.currentTime + 0.1);
        } catch (error) {
          console.log('Audio feedback not available');
        }
      }
    }
  };

  const handleInstructionComplete = () => {
    playFeedback();
    
    // Mark current instruction as completed
    setCompletedInstructions(prev => new Set([...prev, currentInstruction.globalIndex]));

    // Check if all instructions are completed
    if (completedInstructions.size + 1 >= flatInstructions.length) {
      handleProgramComplete();
    } else {
      // Auto-advance to next uncompleted instruction
      const nextIndex = findNextUncompletedInstruction();
      if (nextIndex !== -1) {
        setCurrentInstructionIndex(nextIndex);
      } else {
        handleProgramComplete();
      }
    }
  };

  const findNextUncompletedInstruction = (): number => {
    for (let i = currentInstructionIndex + 1; i < flatInstructions.length; i++) {
      if (!completedInstructions.has(i)) {
        return i;
      }
    }
    // If no uncompleted instruction found after current, look from beginning
    for (let i = 0; i < currentInstructionIndex; i++) {
      if (!completedInstructions.has(i)) {
        return i;
      }
    }
    return -1;
  };

  const handleProgramComplete = () => {
    setProgramCompleted(true);
    setIsPlaying(false);
    
    const totalTime = Math.floor((Date.now() - startTimeRef.current) / 1000 / 60);
    
    if (Platform.OS === 'web') {
      const shouldExit = confirm(`🥊 Quick-Start Boxing Complete! You've completed all ${flatInstructions.length} instructions in ${totalTime} minutes. You're ready to box! Click OK to return.`);
      if (shouldExit) {
        router.back();
      }
    } else {
      Alert.alert(
        '🥊 Quick-Start Boxing Complete!',
        `You've completed all ${flatInstructions.length} instructions in ${totalTime} minutes. You're ready to box!`,
        [
          {
            text: 'Done',
            onPress: () => router.back(),
          },
          {
            text: 'Restart Program',
            onPress: () => {
              setCurrentInstructionIndex(0);
              setCompletedInstructions(new Set());
              setProgramCompleted(false);
              startTimeRef.current = Date.now();
            },
          },
        ]
      );
    }
  };

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const skipInstruction = () => {
    const nextIndex = findNextUncompletedInstruction();
    if (nextIndex !== -1) {
      setCurrentInstructionIndex(nextIndex);
    } else {
      handleProgramComplete();
    }
  };

  const restartInstruction = () => {
    setTimeRemaining(currentInstruction.duration);
  };

  const handleInstructionSelect = (index: number) => {
    setCurrentInstructionIndex(index);
    setShowInstructionList(false);
    setIsPlaying(false);
  };

  const markInstructionComplete = (index: number) => {
    setCompletedInstructions(prev => new Set([...prev, index]));
  };

  const markInstructionIncomplete = (index: number) => {
    setCompletedInstructions(prev => {
      const newSet = new Set(prev);
      newSet.delete(index);
      return newSet;
    });
  };

  const handleExit = () => {
    setIsPlaying(false);
    
    if (Platform.OS === 'web') {
      const shouldExit = confirm('Are you sure you want to exit Quick-Start Boxing? Your progress will be saved.');
      if (shouldExit) {
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
        }
        if (freestyleIntervalRef.current) {
          clearInterval(freestyleIntervalRef.current);
          freestyleIntervalRef.current = null;
        }
        router.back();
      } else {
        setIsPlaying(true);
      }
    } else {
      Alert.alert(
        'Exit Quick-Start Boxing',
        'Are you sure you want to exit? Your progress will be saved.',
        [
          { 
            text: 'Cancel', 
            style: 'cancel',
            onPress: () => setIsPlaying(true)
          },
          { 
            text: 'Exit', 
            style: 'destructive', 
            onPress: () => {
              if (intervalRef.current) {
                clearInterval(intervalRef.current);
                intervalRef.current = null;
              }
              if (freestyleIntervalRef.current) {
                clearInterval(freestyleIntervalRef.current);
                freestyleIntervalRef.current = null;
              }
              router.back();
            }
          },
        ]
      );
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'demo': return '#00D4AA';
      case 'practice': return '#FF6B35';
      case 'combo': return '#FFB800';
      case 'freestyle': return '#8B5CF6';
      default: return '#9CA3AF';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'demo': return '📹';
      case 'practice': return '🥊';
      case 'combo': return '🔥';
      case 'freestyle': return '⚡';
      default: return '📝';
    }
  };

  if (!currentInstruction) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.center}>
          <Text style={styles.errorText}>Program not found</Text>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <Text style={styles.backButtonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  // Calculate progress
  const progress = completedInstructions.size / flatInstructions.length;

  // For freestyle rounds, we keep the main display static but show callouts in a smaller area
  const isFreestyleRound = currentInstruction.type === 'freestyle' && currentInstruction.id.includes('round');

  return (
    <SafeAreaView style={styles.container}>
      {/* Fixed Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.exitButton} onPress={handleExit}>
          <X size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.workoutTitle}>Quick-Start Boxing</Text>
        <View style={styles.headerButtons}>
          <TouchableOpacity style={styles.listButton} onPress={() => setShowInstructionList(true)}>
            <List size={24} color="#FF6B35" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.settingsButton} onPress={() => setShowSettings(!showSettings)}>
            <Settings size={24} color="#FF6B35" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Scrollable Content */}
      <ScrollView 
        style={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContentContainer}
      >

      {/* Instruction List Modal */}
      <Modal
        visible={showInstructionList}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Select Instruction</Text>
            <TouchableOpacity onPress={() => setShowInstructionList(false)}>
              <X size={24} color="#111827" />
            </TouchableOpacity>
          </View>
          
          <View style={styles.progressSummary}>
            <Text style={styles.progressSummaryText}>
              {completedInstructions.size} of {flatInstructions.length} completed ({Math.round(progress * 100)}%)
            </Text>
            <View style={styles.progressBarSmall}>
              <View style={[styles.progressFillSmall, { width: `${progress * 100}%` }]} />
            </View>
          </View>

          <ScrollView style={styles.instructionsList}>
            {QUICK_START_PROGRAM.map((section, sectionIndex) => (
              <View key={section.id} style={styles.sectionGroup}>
                <Text style={styles.sectionGroupTitle}>{section.title}</Text>
                {section.instructions.map((instruction, instructionIndex) => {
                  const globalIdx = flatInstructions.findIndex(fi => fi.id === instruction.id);
                  const isCompleted = completedInstructions.has(globalIdx);
                  const isCurrent = globalIdx === currentInstructionIndex;
                  
                  return (
                    <TouchableOpacity
                      key={instruction.id}
                      style={[
                        styles.instructionListItem,
                        isCurrent && styles.instructionListItemCurrent,
                        isCompleted && styles.instructionListItemCompleted
                      ]}
                      onPress={() => handleInstructionSelect(globalIdx)}
                    >
                      <View style={styles.instructionListLeft}>
                        <View style={styles.instructionNumber}>
                          <Text style={styles.instructionNumberText}>{globalIdx + 1}</Text>
                        </View>
                        <View style={styles.instructionInfo}>
                          <View style={styles.instructionTitleRow}>
                            <Text style={styles.instructionTypeIcon}>
                              {getTypeIcon(instruction.type)}
                            </Text>
                            <Text style={styles.instructionListTitle}>{instruction.title}</Text>
                          </View>
                          <Text style={styles.instructionListDuration}>
                            {formatTime(instruction.duration)} • {instruction.type}
                          </Text>
                        </View>
                      </View>
                      
                      <TouchableOpacity
                        style={styles.completionToggle}
                        onPress={(e) => {
                          e.stopPropagation();
                          if (isCompleted) {
                            markInstructionIncomplete(globalIdx);
                          } else {
                            markInstructionComplete(globalIdx);
                          }
                        }}
                      >
                        {isCompleted ? (
                          <CheckCircle size={24} color="#4CAF50" />
                        ) : (
                          <Circle size={24} color="#9CA3AF" />
                        )}
                      </TouchableOpacity>
                    </TouchableOpacity>
                  );
                })}
              </View>
            ))}
          </ScrollView>
        </SafeAreaView>
      </Modal>

      {/* Settings Panel */}
      {showSettings && (
        <View style={styles.settingsPanel}>
          <Text style={styles.settingsTitle}>Settings</Text>
          
          <View style={styles.settingRow}>
            <Text style={styles.settingLabel}>Sound Cues</Text>
            <TouchableOpacity
              style={[styles.toggleButton, soundEnabled && styles.toggleButtonActive]}
              onPress={() => setSoundEnabled(!soundEnabled)}
            >
              {soundEnabled ? (
                <Volume2 size={20} color="#fff" />
              ) : (
                <VolumeX size={20} color="#9CA3AF" />
              )}
            </TouchableOpacity>
          </View>

          {Platform.OS !== 'web' && (
            <View style={styles.settingRow}>
              <Text style={styles.settingLabel}>Haptic Feedback</Text>
              <TouchableOpacity
                style={[styles.toggleButton, hapticEnabled && styles.toggleButtonActive]}
                onPress={() => setHapticEnabled(!hapticEnabled)}
              >
                <Text style={[
                  styles.toggleButtonText,
                  hapticEnabled && styles.toggleButtonTextActive
                ]}>
                  {hapticEnabled ? 'ON' : 'OFF'}
                </Text>
              </TouchableOpacity>
            </View>
          )}

          {currentInstruction.videoUrl && (
            <View style={styles.settingRow}>
              <Text style={styles.settingLabel}>Show Video</Text>
              <TouchableOpacity
                style={[styles.toggleButton, showVideo && styles.toggleButtonActive]}
                onPress={() => setShowVideo(!showVideo)}
              >
                <Video size={20} color={showVideo ? "#fff" : "#9CA3AF"} />
              </TouchableOpacity>
            </View>
          )}
        </View>
      )}

      {/* Enhanced Current Instruction Info */}
      <View style={styles.enhancedCurrentInfo}>
        <View style={styles.enhancedInfoHeader}>
          <View style={styles.stepIndicator}>
            <Text style={styles.stepNumber}>{currentInstructionIndex + 1}</Text>
            <Text style={styles.stepTotal}>of {flatInstructions.length}</Text>
          </View>
          <View style={[styles.modernTypeBadge, { backgroundColor: getTypeColor(currentInstruction.type) }]}>
            <Text style={styles.typeEmoji}>{getTypeIcon(currentInstruction.type)}</Text>
            <Text style={styles.modernTypeBadgeText}>{currentInstruction.type.toUpperCase()}</Text>
          </View>
        </View>
        
        <Text style={styles.modernSectionTitle}>{currentInstruction.sectionTitle}</Text>
        <Text style={styles.modernInstructionTitle}>{currentInstruction.title}</Text>
        
        <View style={styles.enhancedProgressContainer}>
          <View style={styles.enhancedProgressBar}>
            <View style={[
              styles.enhancedProgressFill, 
              { 
                width: `${progress * 100}%`,
                backgroundColor: getTypeColor(currentInstruction.type)
              }
            ]} />
          </View>
          <Text style={styles.enhancedProgressText}>
            {Math.round(progress * 100)}% Complete
          </Text>
        </View>
      </View>

      {/* Video Section */}
      {showVideo && currentInstruction.videoUrl && (
        <View style={styles.videoSection}>
          <VideoPlayer 
            videoUrl={currentInstruction.videoUrl}
            title={currentInstruction.title}
            height={180}
            autoplay={isPlaying}
            showControls={true}
            loop={true}
            muted={false}
          />
        </View>
      )}

      {/* Timer */}
      <View style={styles.timerContainer}>
        <View style={[
          styles.timerCircle,
          timeRemaining <= 5 && styles.timerCircleWarning,
          { borderColor: getTypeColor(currentInstruction.type) }
        ]}>
          <Text style={styles.timerText}>{formatTime(timeRemaining)}</Text>
          <Text style={[styles.timerLabel, { color: getTypeColor(currentInstruction.type) }]}>
            {currentInstruction.type}
          </Text>
        </View>
      </View>

      {/* STATIC VISUAL CUE - This is the main display that stays constant */}
      <View style={styles.staticVisualContainer}>
        <Text style={[
          styles.staticVisualText,
          { color: getTypeColor(currentInstruction.type) }
        ]}>
          {currentInstruction.visualCue}
        </Text>
        
        {/* Show punch sequence visually if available */}
        {currentInstruction.punchSequence && currentInstruction.punchSequence.length > 0 && (
          <View style={styles.punchSequenceContainer}>
            <PunchSequenceDisplay 
              sequence={currentInstruction.punchSequence} 
              size="large" 
              showNumbers={true}
            />
          </View>
        )}

        {/* For freestyle rounds, show current callout in smaller text */}
        {isFreestyleRound && (
          <View style={styles.freestyleCalloutContainer}>
            <Text style={styles.freestyleCalloutLabel}>Current Callout:</Text>
            <Text style={styles.freestyleCalloutText}>
              {FREESTYLE_CALLOUTS[currentFreestyleCallout]?.visualCue || 'FREESTYLE'}
            </Text>
          </View>
        )}
      </View>

      {/* Instructions */}
      <View style={styles.instructionsContainer}>
        <Text style={styles.instructionTitle}>{currentInstruction.title}</Text>
        <Text style={styles.instructionDescription}>{currentInstruction.description}</Text>
        
        <View style={styles.instructionsList}>
          {currentInstruction.instructions.slice(0, 3).map((instruction, index) => (
            <Text key={index} style={styles.instructionText}>
              • {instruction}
            </Text>
          ))}
        </View>
      </View>

      {/* Controls */}
      <View style={styles.controls}>
        <TouchableOpacity style={styles.controlButton} onPress={restartInstruction}>
          <RotateCcw size={24} color="#fff" />
        </TouchableOpacity>
        
        <TouchableOpacity style={[
          styles.playButton,
          { backgroundColor: getTypeColor(currentInstruction.type) }
        ]} onPress={togglePlayPause}>
          {isPlaying ? (
            <Pause size={32} color="#fff" />
          ) : (
            <Play size={32} color="#fff" />
          )}
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.controlButton} onPress={skipInstruction}>
          <SkipForward size={24} color="#fff" />
        </TouchableOpacity>
      </View>

        {/* Stats */}
        <View style={styles.stats}>
          <View style={styles.stat}>
            <Text style={styles.statValue}>{Math.floor((Date.now() - startTimeRef.current) / 1000 / 60)}</Text>
            <Text style={styles.statLabel}>Minutes</Text>
          </View>
          <View style={styles.stat}>
            <Text style={styles.statValue}>{completedInstructions.size}</Text>
            <Text style={styles.statLabel}>Completed</Text>
          </View>
          <View style={styles.stat}>
            <Text style={styles.statValue}>{flatInstructions.length - completedInstructions.size}</Text>
            <Text style={styles.statLabel}>Remaining</Text>
          </View>
        </View>
      </ScrollView>
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
    backgroundColor: '#FF6B35',
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
  headerButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  listButton: {
    width: 40,
    height: 40,
    backgroundColor: 'rgba(255, 107, 53, 0.2)',
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  settingsButton: {
    width: 40,
    height: 40,
    backgroundColor: 'rgba(255, 107, 53, 0.2)',
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  modalTitle: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: '#111827',
  },
  progressSummary: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#F9FAFB',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  progressSummaryText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#111827',
    marginBottom: 8,
  },
  progressBarSmall: {
    height: 4,
    backgroundColor: '#E5E7EB',
    borderRadius: 2,
  },
  progressFillSmall: {
    height: '100%',
    backgroundColor: '#FF6B35',
    borderRadius: 2,
  },
  instructionsList: {
    flex: 1,
  },
  sectionGroup: {
    marginBottom: 24,
  },
  sectionGroupTitle: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#111827',
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: '#F3F4F6',
  },
  instructionListItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  instructionListItemCurrent: {
    backgroundColor: 'rgba(255, 107, 53, 0.1)',
    borderLeftWidth: 4,
    borderLeftColor: '#FF6B35',
  },
  instructionListItemCompleted: {
    backgroundColor: 'rgba(76, 175, 80, 0.1)',
  },
  instructionListLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  instructionNumber: {
    width: 32,
    height: 32,
    backgroundColor: '#FF6B35',
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  instructionNumberText: {
    fontSize: 14,
    fontFamily: 'Inter-Bold',
    color: '#fff',
  },
  instructionInfo: {
    flex: 1,
  },
  instructionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  instructionTypeIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  instructionListTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#111827',
    flex: 1,
  },
  instructionListDuration: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#6B7280',
  },
  completionToggle: {
    padding: 8,
  },
  settingsPanel: {
    backgroundColor: '#2a2a2a',
    marginHorizontal: 20,
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  settingsTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#fff',
    marginBottom: 16,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  settingLabel: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#ccc',
  },
  toggleButton: {
    width: 40,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#333',
    alignItems: 'center',
    justifyContent: 'center',
  },
  toggleButtonActive: {
    backgroundColor: '#FF6B35',
  },
  toggleButtonText: {
    fontSize: 10,
    fontFamily: 'Inter-Bold',
    color: '#9CA3AF',
  },
  toggleButtonTextActive: {
    color: '#fff',
  },
  currentInfo: {
    alignItems: 'center',
    marginBottom: 16,
    paddingHorizontal: 20,
  },
  currentInfoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 12,
  },
  currentNumber: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: '#FF6B35',
  },
  typeBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  typeBadgeText: {
    fontSize: 12,
    fontFamily: 'Inter-Bold',
    color: '#fff',
    textTransform: 'uppercase',
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#fff',
    marginBottom: 4,
  },
  progressText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#ccc',
    textAlign: 'center',
  },
  progressContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  progressBar: {
    height: 6,
    backgroundColor: '#333',
    borderRadius: 3,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#FF6B35',
    borderRadius: 3,
  },
  videoSection: {
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 12,
    overflow: 'hidden',
  },
  timerContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  timerCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  timerCircleWarning: {
    borderColor: '#FFB800',
  },
  timerText: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    color: '#fff',
  },
  timerLabel: {
    fontSize: 8,
    fontFamily: 'Inter-Medium',
    marginTop: 2,
  },
  // STATIC VISUAL CUE CONTAINER - Main display area
  staticVisualContainer: {
    alignItems: 'center',
    marginBottom: 30,
    paddingHorizontal: 20,
    backgroundColor: '#2a2a2a',
    marginHorizontal: 20,
    borderRadius: 20,
    paddingVertical: 40,
  },
  staticVisualText: {
    fontSize: 64,
    fontFamily: 'Inter-Bold',
    textAlign: 'center',
    marginBottom: 20,
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 0, height: 4 },
    textShadowRadius: 12,
    letterSpacing: 2,
  },
  punchSequenceContainer: {
    marginBottom: 20,
  },
  freestyleCalloutContainer: {
    backgroundColor: 'rgba(139, 92, 246, 0.2)',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(139, 92, 246, 0.3)',
  },
  freestyleCalloutLabel: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
    color: '#8B5CF6',
    marginBottom: 8,
  },
  freestyleCalloutText: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#8B5CF6',
  },
  instructionsContainer: {
    paddingHorizontal: 20,
    marginBottom: 30,
    alignItems: 'center',
  },
  instructionTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 8,
  },
  instructionDescription: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#ccc',
    textAlign: 'center',
    marginBottom: 16,
  },
  instructionText: {
    fontSize: 13,
    fontFamily: 'Inter-Regular',
    color: '#999',
    marginBottom: 4,
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    marginBottom: 30,
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
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
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
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: '#fff',
  },
  statLabel: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#666',
    marginTop: 4,
  },
  // Enhanced Current Info Styles
  enhancedCurrentInfo: {
    backgroundColor: '#2a2a2a',
    marginHorizontal: 20,
    borderRadius: 20,
    padding: 24,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#333',
  },
  enhancedInfoHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  stepIndicator: {
    alignItems: 'center',
  },
  stepNumber: {
    fontSize: 28,
    fontFamily: 'Inter-Bold',
    color: '#FF6B35',
    lineHeight: 32,
  },
  stepTotal: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#999',
  },
  modernTypeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 8,
  },
  typeEmoji: {
    fontSize: 16,
  },
  modernTypeBadgeText: {
    fontSize: 12,
    fontFamily: 'Inter-Bold',
    color: '#fff',
    letterSpacing: 0.5,
  },
  modernSectionTitle: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#999',
    marginBottom: 8,
    textAlign: 'center',
  },
  modernInstructionTitle: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 28,
  },
  enhancedProgressContainer: {
    alignItems: 'center',
  },
  enhancedProgressBar: {
    width: '100%',
    height: 8,
    backgroundColor: '#333',
    borderRadius: 4,
    marginBottom: 12,
  },
  enhancedProgressFill: {
    height: '100%',
    borderRadius: 4,
  },
  enhancedProgressText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#ccc',
  },
  // Scroll Container Styles
  scrollContent: {
    flex: 1,
  },
  scrollContentContainer: {
    paddingBottom: 40,
  },
});