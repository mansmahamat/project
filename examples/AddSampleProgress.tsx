import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet, Alert } from 'react-native';
import Animated from 'react-native-reanimated';
import { useProgressStore } from '@/stores';
import { useButtonPress, useBounceAnimation } from '@/utils/animations';
import { HapticFeedback } from '@/utils/haptics';

export const AddSampleProgress: React.FC = () => {
  const { 
    completeWorkout, 
    resetProgress, 
    generateDailyChallenges, 
    awardXP, 
    getCurrentRank,
    progress 
  } = useProgressStore();

  // Animation hooks
  const { animatedStyle: addButtonStyle, onPressIn: addOnPressIn, onPressOut: addOnPressOut } = useButtonPress();
  const { animatedStyle: clearButtonStyle, onPressIn: clearOnPressIn, onPressOut: clearOnPressOut } = useButtonPress();
  const { animatedStyle: bounceStyle, bigBounce } = useBounceAnimation();

  const addSampleData = () => {
    // Add multiple completed workouts across different days with gamification
    const today = new Date();
    
    // Workout from 7 days ago (morning workout)
    const sevenDaysAgo = new Date(today);
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    sevenDaysAgo.setHours(7, 30, 0, 0); // 7:30 AM
    
    // Workout from 3 days ago (evening workout)
    const threeDaysAgo = new Date(today);
    threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);
    threeDaysAgo.setHours(18, 15, 0, 0); // 6:15 PM
    
    // Workout from yesterday (afternoon workout)
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    yesterday.setHours(14, 45, 0, 0); // 2:45 PM
    
    // Add diverse sample workouts to trigger multiple achievements
    completeWorkout('1', 12, 180, 3);  // Boxing Fundamentals (180 cal)
    completeWorkout('2', 18, 320, 4);  // HIIT Boxing Power (320 cal) 
    completeWorkout('3', 15, 160, 3);  // Boxing Footwork (160 cal)
    completeWorkout('15', 20, 240, 5); // Flash-Combo Speed (240 cal)
    completeWorkout('6', 25, 300, 6);  // Championship Training (300 cal)
    completeWorkout('14', 10, 120, 2); // Jab Pyramid (120 cal)
    completeWorkout('4', 22, 280, 4);  // Defense & Counter (280 cal)
    completeWorkout('17', 16, 200, 3); // Realistic Combinations (200 cal)
    
    // This should trigger multiple achievements:
    // - First Fight ✅
    // - Calorie Crusher (500+ cal) ✅  
    // - Calorie Master (1000+ cal) ✅
    // - Time Fighter (60+ min) ✅
    // - Time Master (120+ min) ✅
    
    // Generate daily challenges for testing
    generateDailyChallenges();
    
    // Add some bonus XP to help demonstrate rank progression
    awardXP(500);
    
    const currentRank = getCurrentRank();
    const totalCalories = 180 + 320 + 160 + 240 + 300 + 120 + 280 + 200; // 1800 calories
    const totalMinutes = 12 + 18 + 15 + 20 + 25 + 10 + 22 + 16; // 138 minutes
    
    // Trigger success animation and haptic
    bigBounce();
    HapticFeedback.workoutComplete();

    Alert.alert(
      '✅ Sample Data Added!',
      `🥊 8 workouts completed\n🔥 ${totalCalories} calories burned\n⏱️ ${totalMinutes} minutes trained\n🏆 Current rank: ${currentRank.name}\n⚡ ${progress.totalXP} XP earned\n\nCheck your Progress tab to see the gamification system in action!`,
      [{ text: 'Amazing!', style: 'default' }]
    );
  };

  const clearData = () => {
    Alert.alert(
      '🗑️ Clear All Data?',
      'This will remove all progress data. Are you sure?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Clear', 
          style: 'destructive', 
          onPress: () => {
            resetProgress();
            Alert.alert('✅ Data Cleared', 'All progress data has been cleared.');
          }
        }
      ]
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Progress Testing</Text>
      <Text style={styles.subtitle}>Add sample data to see the progress system in action</Text>
      
      <Animated.View style={[addButtonStyle, bounceStyle]}>
        <TouchableOpacity 
          style={styles.addButton} 
          onPress={() => {
            HapticFeedback.medium();
            addSampleData();
          }}
          onPressIn={addOnPressIn}
          onPressOut={addOnPressOut}
        >
          <Text style={styles.buttonText}>Add Sample Progress Data</Text>
        </TouchableOpacity>
      </Animated.View>
      
      <Animated.View style={clearButtonStyle}>
        <TouchableOpacity 
          style={[styles.addButton, styles.clearButton]} 
          onPress={() => {
            HapticFeedback.warning();
            clearData();
          }}
          onPressIn={clearOnPressIn}
          onPressOut={clearOnPressOut}
        >
          <Text style={[styles.buttonText, styles.clearButtonText]}>Clear All Data</Text>
        </TouchableOpacity>
      </Animated.View>
      
      <Text style={styles.note}>
        💡 Tip: Complete real workouts to see your actual progress tracking!
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 12,
    margin: 20,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  title: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#111827',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    marginBottom: 20,
  },
  addButton: {
    backgroundColor: '#FF6B35',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginBottom: 12,
    alignItems: 'center',
  },
  clearButton: {
    backgroundColor: '#E5E7EB',
  },
  buttonText: {
    color: '#fff',
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
  },
  clearButtonText: {
    color: '#6B7280',
  },
  note: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#8B5CF6',
    textAlign: 'center',
    marginTop: 16,
    fontStyle: 'italic',
  },
}); 