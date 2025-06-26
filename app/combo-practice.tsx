import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Alert,
} from 'react-native';
import { ArrowLeft, Play, Pause, SkipForward, RotateCcw, X } from 'lucide-react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { getComboById } from '@/data/punches';
import { Combo } from '@/types/workout';
import { PunchSequenceDisplay } from '@/components/PunchSequenceDisplay';

export default function ComboPracticeScreen() {
  const { id } = useLocalSearchParams();
  const [combo, setCombo] = useState<Combo | null>(null);
  const [currentRound, setCurrentRound] = useState(1);
  const [timeRemaining, setTimeRemaining] = useState(30); // 30 seconds per round
  const [isPlaying, setIsPlaying] = useState(false);
  const [isResting, setIsResting] = useState(false);
  const [totalRounds] = useState(3);
  const [restPeriod] = useState(15);
  const [currentPunchIndex, setCurrentPunchIndex] = useState(0);
  const [totalPracticeTime, setTotalPracticeTime] = useState(0);
  
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (id) {
      const foundCombo = getComboById(id as string);
      setCombo(foundCombo || null);
    }
  }, [id]);

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
        setTotalPracticeTime(prev => prev + 1);
        
        // Update punch progression for combo practice
        if (!isResting && combo) {
          const roundDuration = 30;
          const punchCount = combo.sequence.length;
          const timePerPunch = roundDuration / (punchCount * 3); // 3 repetitions per round
          const elapsedTime = roundDuration - timeRemaining;
          const newPunchIndex = Math.floor(elapsedTime / timePerPunch) % punchCount;
          setCurrentPunchIndex(newPunchIndex);
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
  }, [isPlaying, timeRemaining, isResting, combo]);

  const handleTimerComplete = () => {
    if (isResting) {
      // Rest period is over, start next round
      setIsResting(false);
      setCurrentPunchIndex(0);
      if (currentRound < totalRounds) {
        setCurrentRound(prev => prev + 1);
        setTimeRemaining(30);
      } else {
        handlePracticeComplete();
      }
    } else {
      // Round is over, start rest period or complete practice
      if (currentRound < totalRounds) {
        setIsResting(true);
        setCurrentPunchIndex(0);
        setTimeRemaining(restPeriod);
      } else {
        handlePracticeComplete();
      }
    }
  };

  const handlePracticeComplete = () => {
    setIsPlaying(false);
    
    Alert.alert(
      'Practice Complete!',
      `Great job practicing ${combo?.name}! You completed ${currentRound} rounds in ${Math.floor(totalPracticeTime / 60)} minutes.`,
      [
        {
          text: 'Done',
          onPress: () => router.back(),
        },
        {
          text: 'Practice Again',
          onPress: () => {
            setCurrentRound(1);
            setTimeRemaining(30);
            setIsResting(false);
            setCurrentPunchIndex(0);
            setTotalPracticeTime(0);
          },
        },
      ]
    );
  };

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const skipRound = () => {
    if (currentRound < totalRounds) {
      setCurrentRound(prev => prev + 1);
      setTimeRemaining(30);
      setIsResting(false);
      setCurrentPunchIndex(0);
    } else {
      handlePracticeComplete();
    }
  };

  const restartRound = () => {
    setTimeRemaining(isResting ? restPeriod : 30);
    setCurrentPunchIndex(0);
  };

  const handleExit = () => {
    Alert.alert(
      'Exit Practice',
      'Are you sure you want to exit? Your progress will be lost.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Exit', style: 'destructive', onPress: () => router.back() },
      ]
    );
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (!combo) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.center}>
          <Text style={styles.errorText}>Combo not found</Text>
        </View>
      </SafeAreaView>
    );
  }

  const progress = currentRound / totalRounds;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.exitButton} onPress={handleExit}>
          <X size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.comboTitle}>{combo.name}</Text>
        <View style={{ width: 40 }} />
      </View>

      <View style={styles.roundInfo}>
        <Text style={styles.roundText}>Round {currentRound}/{totalRounds}</Text>
      </View>

      <View style={styles.progressContainer}>
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: `${progress * 100}%` }]} />
        </View>
      </View>

      <View style={styles.timerContainer}>
        <View style={styles.timerCircle}>
          <Text style={styles.timerText}>{formatTime(timeRemaining)}</Text>
          <Text style={styles.timerLabel}>
            {isResting ? 'Rest' : 'Practice'}
          </Text>
        </View>
      </View>

      <View style={styles.comboInfo}>
        {isResting ? (
          <>
            <Text style={styles.comboName}>Rest Period</Text>
            <Text style={styles.nextRoundText}>
              Next: Round {currentRound < totalRounds ? currentRound + 1 : 'Complete'}
            </Text>
          </>
        ) : (
          <>
            <Text style={styles.comboName}>{combo.name}</Text>
            <Text style={styles.comboDescription}>{combo.description}</Text>
            
            <View style={styles.sequenceContainer}>
              <PunchSequenceDisplay 
                sequence={combo.sequence} 
                size="large" 
                showNumbers={true}
                currentPunch={currentPunchIndex}
              />
            </View>
            
            <View style={styles.instructions}>
              <Text style={styles.instructionTitle}>Focus Points:</Text>
              {combo.tips.slice(0, 2).map((tip, index) => (
                <Text key={index} style={styles.instructionText}>
                  • {tip}
                </Text>
              ))}
            </View>
          </>
        )}
      </View>

      <View style={styles.controls}>
        <TouchableOpacity style={styles.controlButton} onPress={restartRound}>
          <RotateCcw size={24} color="#fff" />
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.playButton} onPress={togglePlayPause}>
          {isPlaying ? (
            <Pause size={32} color="#fff" />
          ) : (
            <Play size={32} color="#fff" />
          )}
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.controlButton} onPress={skipRound}>
          <SkipForward size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      <View style={styles.stats}>
        <View style={styles.stat}>
          <Text style={styles.statValue}>{Math.floor(totalPracticeTime / 60)}</Text>
          <Text style={styles.statLabel}>Minutes</Text>
        </View>
        <View style={styles.stat}>
          <Text style={styles.statValue}>{combo.sequence.length}</Text>
          <Text style={styles.statLabel}>Punches</Text>
        </View>
        <View style={styles.stat}>
          <Text style={styles.statValue}>{currentRound}</Text>
          <Text style={styles.statLabel}>Round</Text>
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
  },
  errorText: {
    fontSize: 18,
    fontFamily: 'Inter-Regular',
    color: '#666',
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
    backgroundColor: '#333',
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  comboTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#fff',
    flex: 1,
    textAlign: 'center',
    marginHorizontal: 16,
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
    width: 200,
    height: 200,
    borderRadius: 100,
    borderWidth: 6,
    borderColor: '#FF4500',
    alignItems: 'center',
    justifyContent: 'center',
  },
  timerText: {
    fontSize: 36,
    fontFamily: 'Inter-Bold',
    color: '#fff',
  },
  timerLabel: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#FF4500',
    marginTop: 8,
  },
  comboInfo: {
    paddingHorizontal: 20,
    marginBottom: 40,
    alignItems: 'center',
  },
  comboName: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 8,
  },
  comboDescription: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#ccc',
    textAlign: 'center',
    marginBottom: 24,
  },
  sequenceContainer: {
    marginBottom: 24,
  },
  nextRoundText: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#FF4500',
    textAlign: 'center',
  },
  instructions: {
    alignItems: 'flex-start',
    width: '100%',
  },
  instructionTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#fff',
    marginBottom: 8,
  },
  instructionText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#ccc',
    marginBottom: 4,
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
});