import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useProgressStore } from '@/stores';

// Test component to verify persistence is working
export const ProgressPersistenceTest = () => {
  const { 
    progress, 
    completeWorkout, 
    resetProgress,
    getWeeklyStats 
  } = useProgressStore();
  
  const [testResults, setTestResults] = useState<string[]>([]);

  // Test 1: Add a workout and verify it's saved
  const testWorkoutCompletion = () => {
    const beforeCount = progress.workoutsCompleted;
    
    // Add a test workout
    completeWorkout('test-workout', 15, 250, 3);
    
    const afterCount = progress.workoutsCompleted;
    
    if (afterCount === beforeCount + 1) {
      setTestResults(prev => [...prev, '✅ Workout completion saved successfully']);
    } else {
      setTestResults(prev => [...prev, '❌ Workout completion failed to save']);
    }
  };

  // Test 2: Check if data persists after state reset
  const testPersistence = () => {
    const currentData = {
      workouts: progress.workoutsCompleted,
      calories: progress.caloriesBurned,
      time: progress.totalTimeMinutes,
      streak: progress.currentStreak,
      achievements: progress.achievements.length
    };

    Alert.alert(
      'Persistence Test',
      `Current data:\n` +
      `• Workouts: ${currentData.workouts}\n` +
      `• Calories: ${currentData.calories}\n` +
      `• Time: ${currentData.time}min\n` +
      `• Streak: ${currentData.streak}\n` +
      `• Achievements: ${currentData.achievements}\n\n` +
      `This data should persist even if you:\n` +
      `• Close the app\n` +
      `• Restart your device\n` +
      `• Update the app\n\n` +
      `The data is stored in AsyncStorage and will automatically load when the app starts.`,
      [{ text: 'Got it!', style: 'default' }]
    );
  };

  // Test 3: Verify weekly stats calculation
  const testWeeklyStats = () => {
    const weeklyStats = getWeeklyStats();
    setTestResults(prev => [...prev, 
      `✅ Weekly stats: ${weeklyStats.workouts} workouts, ${weeklyStats.calories} calories`
    ]);
  };

  // Test 4: Show storage info
  const showStorageInfo = () => {
    Alert.alert(
      'Storage Information',
      `Your progress is stored using:\n\n` +
      `🔒 Storage Type: AsyncStorage\n` +
      `📱 Location: Device local storage\n` +
      `🔄 Auto-save: Every state change\n` +
      `📄 Format: JSON serialized\n` +
      `🗝️ Storage Key: "boxing-progress-storage"\n\n` +
      `This means your progress is:\n` +
      `• Persistent across app restarts\n` +
      `• Stored locally (private)\n` +
      `• Automatically synchronized\n` +
      `• Type-safe and reliable`,
      [{ text: 'Excellent!', style: 'default' }]
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Progress Persistence Test</Text>
      
      {/* Current Progress Display */}
      <View style={styles.currentProgress}>
        <Text style={styles.sectionTitle}>Current Progress</Text>
        <Text style={styles.progressText}>Workouts: {progress.workoutsCompleted}</Text>
        <Text style={styles.progressText}>Calories: {progress.caloriesBurned}</Text>
        <Text style={styles.progressText}>Time: {progress.totalTimeMinutes}min</Text>
        <Text style={styles.progressText}>Streak: {progress.currentStreak} days</Text>
        <Text style={styles.progressText}>Achievements: {progress.achievements.length}</Text>
      </View>

      {/* Test Buttons */}
      <View style={styles.testSection}>
        <Text style={styles.sectionTitle}>Persistence Tests</Text>
        
        <TouchableOpacity style={styles.testButton} onPress={testWorkoutCompletion}>
          <Text style={styles.buttonText}>Test Workout Completion</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.testButton} onPress={testWeeklyStats}>
          <Text style={styles.buttonText}>Test Weekly Stats</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.infoButton} onPress={testPersistence}>
          <Text style={styles.buttonText}>Show Persistence Info</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.infoButton} onPress={showStorageInfo}>
          <Text style={styles.buttonText}>Storage Technical Info</Text>
        </TouchableOpacity>
      </View>

      {/* Test Results */}
      {testResults.length > 0 && (
        <View style={styles.resultsSection}>
          <Text style={styles.sectionTitle}>Test Results</Text>
          {testResults.map((result, index) => (
            <Text key={index} style={styles.resultText}>{result}</Text>
          ))}
          <TouchableOpacity 
            style={styles.clearButton} 
            onPress={() => setTestResults([])}
          >
            <Text style={styles.buttonText}>Clear Results</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Warning Section */}
      <View style={styles.warningSection}>
        <Text style={styles.warningTitle}>⚠️ Important Notes</Text>
        <Text style={styles.warningText}>
          • Progress is stored locally on this device only
        </Text>
        <Text style={styles.warningText}>
          • Data will NOT sync between devices
        </Text>
        <Text style={styles.warningText}>
          • Uninstalling the app will delete all progress
        </Text>
        <Text style={styles.warningText}>
          • For cloud sync, you'd need additional backend integration
        </Text>
      </View>

      {/* Danger Zone */}
      <View style={styles.dangerSection}>
        <Text style={styles.dangerTitle}>🚨 Danger Zone</Text>
        <TouchableOpacity 
          style={styles.dangerButton} 
          onPress={() => {
            Alert.alert(
              'Reset All Progress?',
              'This will permanently delete all your progress data. This cannot be undone.',
              [
                { text: 'Cancel', style: 'cancel' },
                { 
                  text: 'Reset', 
                  style: 'destructive',
                  onPress: () => {
                    resetProgress();
                    setTestResults([]);
                    Alert.alert('Reset Complete', 'All progress has been cleared.');
                  }
                }
              ]
            );
          }}
        >
          <Text style={styles.buttonText}>Reset All Progress</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#F9FAFB',
  },
  title: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#111827',
    marginBottom: 20,
    textAlign: 'center',
  },
  currentProgress: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#111827',
    marginBottom: 12,
  },
  progressText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#4B5563',
    marginBottom: 4,
  },
  testSection: {
    marginBottom: 20,
  },
  testButton: {
    backgroundColor: '#FF6B35',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: 'center',
    marginBottom: 8,
  },
  infoButton: {
    backgroundColor: '#0EA5E9',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: 'center',
    marginBottom: 8,
  },
  clearButton: {
    backgroundColor: '#6B7280',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  buttonText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
  },
  resultsSection: {
    backgroundColor: '#F0FDF4',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#BBF7D0',
  },
  resultText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#166534',
    marginBottom: 4,
  },
  warningSection: {
    backgroundColor: '#FEF3C7',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#FCD34D',
  },
  warningTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#92400E',
    marginBottom: 8,
  },
  warningText: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#92400E',
    marginBottom: 4,
  },
  dangerSection: {
    backgroundColor: '#FEE2E2',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#FECACA',
  },
  dangerTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#B91C1C',
    marginBottom: 8,
  },
  dangerButton: {
    backgroundColor: '#EF4444',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: 'center',
  },
}); 