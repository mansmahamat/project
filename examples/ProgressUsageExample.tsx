import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useProgressStore } from '@/stores';
import { useWorkoutCompletion } from '@/components/ProgressIntegration';

// Example 1: How to track progress in workout completion
export const WorkoutCompletionExample = () => {
  const { trackWorkoutCompletion } = useWorkoutCompletion();

  const handleWorkoutFinished = () => {
    // When a workout is completed, call this function
    trackWorkoutCompletion(
      'workout-1',    // workout ID
      15,            // duration in minutes
      240,           // calories burned
      3              // rounds completed
    );
    
    // This automatically:
    // ✅ Updates total workouts completed
    // ✅ Updates total time and calories
    // ✅ Updates streak (if workout today)
    // ✅ Checks and unlocks achievements
    // ✅ Stores workout history
  };

  return (
    <TouchableOpacity style={styles.button} onPress={handleWorkoutFinished}>
      <Text style={styles.buttonText}>Complete Workout</Text>
    </TouchableOpacity>
  );
};

// Example 2: How to show user stats anywhere in the app
export const UserStatsDisplay = () => {
  const { progress, getWeeklyStats, getTodayStats } = useProgressStore();
  const weeklyStats = getWeeklyStats();
  const todayStats = getTodayStats();

  return (
    <View style={styles.statsContainer}>
      <Text style={styles.title}>Your Boxing Journey</Text>
      
      {/* Total Progress */}
      <View style={styles.statRow}>
        <Text style={styles.label}>Total Workouts:</Text>
        <Text style={styles.value}>{progress.workoutsCompleted}</Text>
      </View>
      
      <View style={styles.statRow}>
        <Text style={styles.label}>Current Streak:</Text>
        <Text style={styles.value}>{progress.currentStreak} days 🔥</Text>
      </View>
      
      <View style={styles.statRow}>
        <Text style={styles.label}>Total Calories:</Text>
        <Text style={styles.value}>{progress.caloriesBurned}</Text>
      </View>
      
      {/* This Week */}
      <Text style={styles.subtitle}>This Week</Text>
      <View style={styles.statRow}>
        <Text style={styles.label}>Workouts:</Text>
        <Text style={styles.value}>{weeklyStats.workouts}</Text>
      </View>
      
      <View style={styles.statRow}>
        <Text style={styles.label}>Calories:</Text>
        <Text style={styles.value}>{weeklyStats.calories}</Text>
      </View>
      
      {/* Today */}
      <Text style={styles.subtitle}>Today</Text>
      <View style={styles.statRow}>
        <Text style={styles.label}>Workouts:</Text>
        <Text style={styles.value}>{todayStats.workouts}</Text>
      </View>
    </View>
  );
};

// Example 3: How to show achievements
export const AchievementsDisplay = () => {
  const { progress } = useProgressStore();
  
  return (
    <View style={styles.achievementsContainer}>
      <Text style={styles.title}>Achievements ({progress.achievements.length})</Text>
      
      {progress.achievements.length === 0 ? (
        <Text style={styles.emptyText}>Complete your first workout to unlock achievements!</Text>
      ) : (
        progress.achievements.map((achievement) => (
          <View key={achievement.id} style={styles.achievementItem}>
            <Text style={styles.achievementIcon}>{achievement.icon}</Text>
            <View style={styles.achievementText}>
              <Text style={styles.achievementTitle}>{achievement.title}</Text>
              <Text style={styles.achievementDescription}>{achievement.description}</Text>
              <Text style={styles.achievementDate}>
                Unlocked: {achievement.unlockedAt.toLocaleDateString()}
              </Text>
            </View>
          </View>
        ))
      )}
    </View>
  );
};

// Example 4: How to manage favorites
export const FavoritesExample = () => {
  const { progress, addFavoriteWorkout, removeFavoriteWorkout } = useProgressStore();
  
  const toggleFavorite = (workoutId: string) => {
    if (progress.favoriteWorkouts.includes(workoutId)) {
      removeFavoriteWorkout(workoutId);
    } else {
      addFavoriteWorkout(workoutId);
    }
  };

  return (
    <View style={styles.favoritesContainer}>
      <Text style={styles.title}>Favorite Workouts</Text>
      
      {progress.favoriteWorkouts.length === 0 ? (
        <Text style={styles.emptyText}>No favorite workouts yet</Text>
      ) : (
        progress.favoriteWorkouts.map((workoutId) => (
          <View key={workoutId} style={styles.favoriteItem}>
            <Text>Workout: {workoutId}</Text>
            <TouchableOpacity 
              style={styles.removeButton}
              onPress={() => toggleFavorite(workoutId)}
            >
              <Text style={styles.removeButtonText}>Remove</Text>
            </TouchableOpacity>
          </View>
        ))
      )}
      
      {/* Example of adding a favorite */}
      <TouchableOpacity 
        style={styles.addButton}
        onPress={() => toggleFavorite('workout-example')}
      >
        <Text style={styles.addButtonText}>
          {progress.favoriteWorkouts.includes('workout-example') 
            ? 'Remove from Favorites' 
            : 'Add Example to Favorites'
          }
        </Text>
      </TouchableOpacity>
    </View>
  );
};

// Example 5: How to reset progress (for testing)
export const ProgressResetExample = () => {
  const { resetProgress } = useProgressStore();
  
  return (
    <TouchableOpacity 
      style={[styles.button, styles.dangerButton]}
      onPress={resetProgress}
    >
      <Text style={styles.buttonText}>Reset All Progress (Testing)</Text>
    </TouchableOpacity>
  );
};

// Complete example combining all features
export const CompleteProgressExample = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.mainTitle}>Progress System Examples</Text>
      
      <UserStatsDisplay />
      <AchievementsDisplay />
      <FavoritesExample />
      <WorkoutCompletionExample />
      <ProgressResetExample />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#F9FAFB',
  },
  mainTitle: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#111827',
    marginBottom: 20,
    textAlign: 'center',
  },
  title: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#111827',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#4B5563',
    marginTop: 16,
    marginBottom: 8,
  },
  statsContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  label: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#6B7280',
  },
  value: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#111827',
  },
  achievementsContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  achievementItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  achievementIcon: {
    fontSize: 32,
    marginRight: 12,
  },
  achievementText: {
    flex: 1,
  },
  achievementTitle: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#111827',
  },
  achievementDescription: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
  },
  achievementDate: {
    fontSize: 10,
    fontFamily: 'Inter-Regular',
    color: '#9CA3AF',
    marginTop: 2,
  },
  favoritesContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  favoriteItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#9CA3AF',
    fontStyle: 'italic',
  },
  button: {
    backgroundColor: '#FF6B35',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: 'center',
    marginBottom: 12,
  },
  dangerButton: {
    backgroundColor: '#EF4444',
  },
  buttonText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
  },
  addButton: {
    backgroundColor: '#00D4AA',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    alignItems: 'center',
    marginTop: 8,
  },
  addButtonText: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
  },
  removeButton: {
    backgroundColor: '#F87171',
    borderRadius: 6,
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  removeButtonText: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
  },
}); 