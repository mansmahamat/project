import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Alert,
} from 'react-native';
import { Trophy, Star, Flame } from 'lucide-react-native';
import { useProgressStore, formatTime } from '@/stores';

interface ProgressIntegrationProps {
  workoutId: string;
  workoutTitle: string;
  onClose?: () => void;
}

export const WorkoutCompletionModal: React.FC<ProgressIntegrationProps> = ({
  workoutId,
  workoutTitle,
  onClose,
}) => {
  const { completeWorkout, progress } = useProgressStore();
  const [visible, setVisible] = useState(false);

  const handleCompleteWorkout = (durationMinutes: number, caloriesBurned: number, roundsCompleted: number) => {
    // Update progress
    completeWorkout(workoutId, durationMinutes, caloriesBurned, roundsCompleted);
    
    // Show completion modal
    setVisible(true);
  };

  const handleClose = () => {
    setVisible(false);
    onClose?.();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={handleClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <View style={styles.header}>
            <Trophy size={48} color="#FFB800" />
            <Text style={styles.title}>Workout Complete!</Text>
            <Text style={styles.subtitle}>You crushed it! 🥊</Text>
          </View>

          <View style={styles.stats}>
            <View style={styles.statItem}>
              <Flame size={20} color="#FF6B35" />
              <Text style={styles.statValue}>{progress.workoutsCompleted}</Text>
              <Text style={styles.statLabel}>Total Workouts</Text>
            </View>
            <View style={styles.statItem}>
              <Star size={20} color="#8B5CF6" />
              <Text style={styles.statValue}>{progress.currentStreak}</Text>
              <Text style={styles.statLabel}>Day Streak</Text>
            </View>
          </View>

          <TouchableOpacity style={styles.button} onPress={handleClose}>
            <Text style={styles.buttonText}>Continue</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

// Achievement Notification Component
export const AchievementNotification: React.FC<{ 
  achievement: { title: string; description: string; icon: string };
  visible: boolean;
  onClose: () => void;
}> = ({ achievement, visible, onClose }) => (
  <Modal
    visible={visible}
    transparent
    animationType="slide"
    onRequestClose={onClose}
  >
    <View style={styles.achievementOverlay}>
      <View style={styles.achievementModal}>
        <Text style={styles.achievementIcon}>{achievement.icon}</Text>
        <Text style={styles.achievementTitle}>Achievement Unlocked!</Text>
        <Text style={styles.achievementName}>{achievement.title}</Text>
        <Text style={styles.achievementDescription}>{achievement.description}</Text>
        
        <TouchableOpacity style={styles.achievementButton} onPress={onClose}>
          <Text style={styles.achievementButtonText}>Awesome!</Text>
        </TouchableOpacity>
      </View>
    </View>
  </Modal>
);

// Hook for easy workout completion tracking
export const useWorkoutCompletion = () => {
  const { completeWorkout, progress } = useProgressStore();
  const [newAchievements, setNewAchievements] = useState<any[]>([]);
  
  const trackWorkoutCompletion = (
    workoutId: string,
    durationMinutes: number,
    caloriesBurned: number,
    roundsCompleted: number
  ) => {
    const previousAchievements = progress.achievements.length;
    
    // Complete the workout (this will check for new achievements)
    completeWorkout(workoutId, durationMinutes, caloriesBurned, roundsCompleted);
    
    // Check if new achievements were unlocked
    setTimeout(() => {
      const newAchievementCount = progress.achievements.length;
      if (newAchievementCount > previousAchievements) {
        const recentAchievements = progress.achievements.slice(-1); // Get latest achievement
        setNewAchievements(recentAchievements);
      }
    }, 100);
  };

  return {
    trackWorkoutCompletion,
    newAchievements,
    clearNewAchievements: () => setNewAchievements([]),
    progress,
  };
};

// Example usage component for workout player integration
export const WorkoutPlayerIntegration: React.FC<{
  workoutId: string;
  workoutDuration: number;
  estimatedCalories: number;
  totalRounds: number;
}> = ({ workoutId, workoutDuration, estimatedCalories, totalRounds }) => {
  const { trackWorkoutCompletion, newAchievements, clearNewAchievements } = useWorkoutCompletion();
  
  const handleWorkoutComplete = () => {
    // Track the completed workout
    trackWorkoutCompletion(workoutId, workoutDuration, estimatedCalories, totalRounds);
    
    // Show success message
    Alert.alert(
      'Workout Complete! 🥊',
      `You completed a ${workoutDuration}-minute workout and burned approximately ${estimatedCalories} calories!`,
      [{ text: 'Awesome!', style: 'default' }]
    );
  };

  return (
    <View style={styles.integrationContainer}>
      <TouchableOpacity style={styles.completeButton} onPress={handleWorkoutComplete}>
        <Text style={styles.completeButtonText}>Complete Workout</Text>
      </TouchableOpacity>
      
      {/* Show achievement notifications */}
      {newAchievements.map((achievement, index) => (
        <AchievementNotification
          key={achievement.id}
          achievement={achievement}
          visible={true}
          onClose={() => {
            const updatedAchievements = [...newAchievements];
            updatedAchievements.splice(index, 1);
            clearNewAchievements();
          }}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modal: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    maxWidth: 300,
    width: '100%',
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#111827',
    marginTop: 16,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
  },
  stats: {
    flexDirection: 'row',
    gap: 24,
    marginBottom: 24,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: '#111827',
    marginTop: 8,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#6B7280',
  },
  button: {
    backgroundColor: '#FF6B35',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 32,
    minWidth: 120,
  },
  buttonText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
    textAlign: 'center',
  },
  achievementOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  achievementModal: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 32,
    alignItems: 'center',
    maxWidth: 300,
    width: '100%',
  },
  achievementIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  achievementTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#FFB800',
    marginBottom: 8,
  },
  achievementName: {
    fontSize: 22,
    fontFamily: 'Inter-Bold',
    color: '#111827',
    marginBottom: 8,
    textAlign: 'center',
  },
  achievementDescription: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 24,
  },
  achievementButton: {
    backgroundColor: '#FFB800',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
  achievementButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
  },
  integrationContainer: {
    padding: 20,
  },
  completeButton: {
    backgroundColor: '#00D4AA',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 24,
    alignItems: 'center',
  },
  completeButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
  },
}); 