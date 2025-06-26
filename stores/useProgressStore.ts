import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { 
  UserProgress, 
  Achievement, 
  CompletedWorkout, 
  BoxingRank, 
  DailyChallenge 
} from '@/types/workout';

interface ProgressStore {
  progress: UserProgress;
  
  // Core tracking functions
  completeWorkout: (workoutId: string, durationMinutes: number, caloriesBurned: number, roundsCompleted: number) => void;
  updateStreak: () => void;
  unlockAchievement: (achievementId: string) => void;
  addFavoriteWorkout: (workoutId: string) => void;
  removeFavoriteWorkout: (workoutId: string) => void;
  
  // Statistics functions
  getWeeklyStats: () => { workouts: number; calories: number; time: number };
  getMonthlyStats: () => { workouts: number; calories: number; time: number };
  getTodayStats: () => { workouts: number; calories: number; time: number };
  getRecentWorkouts: (count?: number) => CompletedWorkout[];
  
  // Goal tracking
  getWeeklyGoalProgress: () => { current: number; target: number; percentage: number };
  
  // Gamification functions
  checkAchievements: () => void;
  awardXP: (amount: number) => void;
  getCurrentRank: () => BoxingRank;
  generateDailyChallenges: () => void;
  completeDailyChallenge: (challengeId: string) => void;
  
  // Reset functions (for testing)
  resetProgress: () => void;
}

// Define achievements with unlock conditions
// Achievement Categories and Rarity
export type AchievementCategory = 'starter' | 'consistency' | 'performance' | 'exploration' | 'mastery' | 'legendary';
export type AchievementRarity = 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';

export interface ExtendedAchievement extends Omit<Achievement, 'unlockedAt'> {
  category: AchievementCategory;
  rarity: AchievementRarity;
  xpReward: number;
  secret?: boolean; // Hidden until unlocked
}

const ACHIEVEMENTS: ExtendedAchievement[] = [
  // 🥊 STARTER ACHIEVEMENTS (Common)
  {
    id: 'first_workout',
    title: 'First Fight',
    description: 'Complete your first workout',
    icon: '🥊',
    category: 'starter',
    rarity: 'common',
    xpReward: 100,
  },
  {
    id: 'first_combo',
    title: 'Combo Rookie',
    description: 'Learn your first combination',
    icon: '🤜',
    category: 'starter',
    rarity: 'common',
    xpReward: 50,
  },
  {
    id: 'first_technique',
    title: 'Technique Student',
    description: 'Watch your first technique video',
    icon: '📚',
    category: 'starter',
    rarity: 'common',
    xpReward: 25,
  },
  {
    id: 'profile_complete',
    title: 'Ready to Fight',
    description: 'Complete your fighter profile',
    icon: '👤',
    category: 'starter',
    rarity: 'common',
    xpReward: 75,
  },

  // 🔥 CONSISTENCY ACHIEVEMENTS
  {
    id: 'daily_fighter',
    title: 'Daily Fighter',
    description: 'Complete workouts for 3 days in a row',
    icon: '🔥',
    category: 'consistency',
    rarity: 'common',
    xpReward: 150,
  },
  {
    id: 'week_warrior',
    title: 'Week Warrior',
    description: 'Complete workouts for 7 days in a row',
    icon: '⚡',
    category: 'consistency',
    rarity: 'uncommon',
    xpReward: 300,
  },
  {
    id: 'fortnight_fighter',
    title: 'Fortnight Fighter',
    description: 'Complete workouts for 14 days in a row',
    icon: '🌟',
    category: 'consistency',
    rarity: 'rare',
    xpReward: 500,
  },
  {
    id: 'month_machine',
    title: 'Month Machine',
    description: 'Complete workouts for 30 days in a row',
    icon: '🏆',
    category: 'consistency',
    rarity: 'epic',
    xpReward: 1000,
  },
  {
    id: 'streak_legend',
    title: 'Streak Legend',
    description: 'Complete workouts for 100 days in a row',
    icon: '⭐',
    category: 'consistency',
    rarity: 'legendary',
    xpReward: 2500,
  },
  {
    id: 'weekend_warrior',
    title: 'Weekend Warrior',
    description: 'Work out every weekend for a month',
    icon: '🏖️',
    category: 'consistency',
    rarity: 'uncommon',
    xpReward: 200,
  },

  // 🔥 CALORIE & TIME ACHIEVEMENTS
  {
    id: 'calorie_crusher_500',
    title: 'Calorie Crusher',
    description: 'Burn 500 calories total',
    icon: '🔥',
    category: 'performance',
    rarity: 'common',
    xpReward: 200,
  },
  {
    id: 'calorie_crusher_1000',
    title: 'Calorie Master',
    description: 'Burn 1000 calories total',
    icon: '⚡',
    category: 'performance',
    rarity: 'uncommon',
    xpReward: 300,
  },
  {
    id: 'calorie_crusher_5000',
    title: 'Calorie Destroyer',
    description: 'Burn 5000 calories total',
    icon: '💥',
    category: 'performance',
    rarity: 'rare',
    xpReward: 750,
  },
  {
    id: 'calorie_crusher_10000',
    title: 'Inferno Fighter',
    description: 'Burn 10,000 calories total',
    icon: '🌋',
    category: 'performance',
    rarity: 'epic',
    xpReward: 1500,
  },
  {
    id: 'time_fighter_60',
    title: 'Time Fighter',
    description: 'Complete 1 hour of training',
    icon: '⏰',
    category: 'performance',
    rarity: 'common',
    xpReward: 200,
  },
  {
    id: 'time_fighter_300',
    title: 'Time Master',
    description: 'Complete 5 hours of training',
    icon: '⌚',
    category: 'performance',
    rarity: 'uncommon',
    xpReward: 400,
  },
  {
    id: 'time_fighter_600',
    title: 'Time Champion',
    description: 'Complete 10 hours of training',
    icon: '🕐',
    category: 'performance',
    rarity: 'rare',
    xpReward: 800,
  },
  {
    id: 'marathon_fighter',
    title: 'Marathon Fighter',
    description: 'Complete 50 hours of training',
    icon: '🏃‍♂️',
    category: 'performance',
    rarity: 'epic',
    xpReward: 2000,
  },

  // 🥊 WORKOUT COUNT ACHIEVEMENTS
  {
    id: 'bronze_fighter',
    title: 'Bronze Fighter',
    description: 'Complete 10 workouts total',
    icon: '🥉',
    category: 'performance',
    rarity: 'common',
    xpReward: 250,
  },
  {
    id: 'silver_fighter',
    title: 'Silver Fighter',
    description: 'Complete 25 workouts total',
    icon: '🥈',
    category: 'performance',
    rarity: 'uncommon',
    xpReward: 400,
  },
  {
    id: 'gold_fighter',
    title: 'Gold Fighter',
    description: 'Complete 50 workouts total',
    icon: '🥇',
    category: 'performance',
    rarity: 'rare',
    xpReward: 700,
  },
  {
    id: 'consistency_champion',
    title: 'Consistency Champion',
    description: 'Complete 100 workouts total',
    icon: '👑',
    category: 'performance',
    rarity: 'epic',
    xpReward: 1200,
  },
  {
    id: 'workout_legend',
    title: 'Workout Legend',
    description: 'Complete 500 workouts total',
    icon: '🏆',
    category: 'performance',
    rarity: 'legendary',
    xpReward: 3000,
  },

  // 🎯 ROUND ACHIEVEMENTS
  {
    id: 'round_rookie',
    title: 'Round Rookie',
    description: 'Complete 25 rounds total',
    icon: '🎯',
    category: 'performance',
    rarity: 'common',
    xpReward: 150,
  },
  {
    id: 'round_warrior',
    title: 'Round Warrior',
    description: 'Complete 100 rounds total',
    icon: '⚔️',
    category: 'performance',
    rarity: 'uncommon',
    xpReward: 300,
  },
  {
    id: 'round_master',
    title: 'Round Master',
    description: 'Complete 500 rounds total',
    icon: '🥇',
    category: 'performance',
    rarity: 'rare',
    xpReward: 600,
  },
  {
    id: 'round_legend',
    title: 'Round Legend',
    description: 'Complete 1,000 rounds total',
    icon: '👑',
    category: 'performance',
    rarity: 'epic',
    xpReward: 1500,
  },

  // 🚀 EXPLORATION ACHIEVEMENTS
  {
    id: 'technique_explorer',
    title: 'Technique Explorer',
    description: 'Watch 10 different technique videos',
    icon: '🔍',
    category: 'exploration',
    rarity: 'common',
    xpReward: 200,
  },
  {
    id: 'combo_collector',
    title: 'Combo Collector',
    description: 'Learn 15 different combinations',
    icon: '📚',
    category: 'exploration',
    rarity: 'uncommon',
    xpReward: 350,
  },
  {
    id: 'workout_explorer',
    title: 'Workout Explorer',
    description: 'Try 20 different workouts',
    icon: '🗺️',
    category: 'exploration',
    rarity: 'uncommon',
    xpReward: 400,
  },
  {
    id: 'category_master',
    title: 'Category Master',
    description: 'Complete workouts in all categories',
    icon: '🌟',
    category: 'exploration',
    rarity: 'rare',
    xpReward: 600,
  },
  {
    id: 'level_master',
    title: 'Level Master',
    description: 'Complete workouts at all difficulty levels',
    icon: '🎖️',
    category: 'exploration',
    rarity: 'rare',
    xpReward: 700,
  },

  // 💪 INTENSITY ACHIEVEMENTS
  {
    id: 'hiit_specialist',
    title: 'HIIT Specialist',
    description: 'Complete 10 HIIT workouts',
    icon: '💪',
    category: 'mastery',
    rarity: 'uncommon',
    xpReward: 350,
  },
  {
    id: 'defense_master',
    title: 'Defense Master',
    description: 'Complete 10 Defense workouts',
    icon: '🛡️',
    category: 'mastery',
    rarity: 'uncommon',
    xpReward: 350,
  },
  {
    id: 'combo_king',
    title: 'Combo King',
    description: 'Complete 15 Combo workouts',
    icon: '👑',
    category: 'mastery',
    rarity: 'rare',
    xpReward: 500,
  },
  {
    id: 'heavy_bag_destroyer',
    title: 'Heavy Bag Destroyer',
    description: 'Complete 20 Heavy Bag workouts',
    icon: '🥊',
    category: 'mastery',
    rarity: 'rare',
    xpReward: 600,
  },

  // 🏆 SPECIAL ACHIEVEMENTS
  {
    id: 'speed_demon',
    title: 'Speed Demon',
    description: 'Complete 5 Flash-Combo workouts',
    icon: '⚡',
    category: 'mastery',
    rarity: 'rare',
    xpReward: 550,
  },
  {
    id: 'custom_creator',
    title: 'Custom Creator',
    description: 'Create your first custom workout',
    icon: '⚙️',
    category: 'exploration',
    rarity: 'uncommon',
    xpReward: 300,
  },
  {
    id: 'perfectionist',
    title: 'Perfectionist',
    description: 'Complete 10 workouts without skipping',
    icon: '✨',
    category: 'mastery',
    rarity: 'rare',
    xpReward: 500,
    secret: true,
  },
  {
    id: 'early_bird',
    title: 'Early Bird',
    description: 'Complete 10 workouts before 8 AM',
    icon: '🌅',
    category: 'mastery',
    rarity: 'uncommon',
    xpReward: 400,
    secret: true,
  },
  {
    id: 'night_owl',
    title: 'Night Owl',
    description: 'Complete 10 workouts after 10 PM',
    icon: '🦉',
    category: 'mastery',
    rarity: 'uncommon',
    xpReward: 400,
    secret: true,
  },

  // 🎊 LEGENDARY ACHIEVEMENTS
  {
    id: 'boxing_god',
    title: 'Boxing God',
    description: 'Reach maximum level and complete 1000 workouts',
    icon: '⚡',
    category: 'legendary',
    rarity: 'legendary',
    xpReward: 5000,
    secret: true,
  },
  {
    id: 'champion',
    title: 'Undisputed Champion',
    description: 'Unlock all other achievements',
    icon: '🏆',
    category: 'legendary',
    rarity: 'legendary',
    xpReward: 10000,
    secret: true,
  },
];

// Boxing Rank System
export const BOXING_RANKS: BoxingRank[] = [
  { id: 'white', name: 'White Belt', level: 1, xpRequired: 0, color: '#FFFFFF', icon: '🥋', title: 'Rookie Fighter' },
  { id: 'yellow', name: 'Yellow Belt', level: 2, xpRequired: 500, color: '#FFD700', icon: '🥇', title: 'Apprentice Boxer' },
  { id: 'orange', name: 'Orange Belt', level: 3, xpRequired: 1200, color: '#FF8C00', icon: '🔥', title: 'Fighting Spirit' },
  { id: 'green', name: 'Green Belt', level: 4, xpRequired: 2500, color: '#32CD32', icon: '🌱', title: 'Rising Contender' },
  { id: 'blue', name: 'Blue Belt', level: 5, xpRequired: 4500, color: '#4169E1', icon: '💙', title: 'Skilled Pugilist' },
  { id: 'purple', name: 'Purple Belt', level: 6, xpRequired: 7500, color: '#8B008B', icon: '💜', title: 'Elite Fighter' },
  { id: 'brown', name: 'Brown Belt', level: 7, xpRequired: 12000, color: '#8B4513', icon: '🤎', title: 'Master Boxer' },
  { id: 'black1', name: 'Black Belt 1st Dan', level: 8, xpRequired: 18000, color: '#000000', icon: '🖤', title: 'Boxing Sensei' },
  { id: 'black2', name: 'Black Belt 2nd Dan', level: 9, xpRequired: 25000, color: '#1C1C1C', icon: '⚫', title: 'Grand Master' },
  { id: 'red', name: 'Red Belt', level: 10, xpRequired: 40000, color: '#DC143C', icon: '❤️', title: 'Legendary Champion' },
];

const initialProgress: UserProgress = {
  id: 'user1',
  workoutsCompleted: 0,
  totalTimeMinutes: 0,
  caloriesBurned: 0,
  currentStreak: 0,
  longestStreak: 0,
  achievements: [],
  favoriteWorkouts: [],
  completedWorkouts: [],
  // NEW GAMIFICATION FIELDS
  totalXP: 0,
  currentLevel: 1,
  dailyChallenges: [],
  weeklyGoal: {
    workouts: 0,
    target: 3,
    xpReward: 500,
  },
  unlockedTitles: ['Rookie Fighter'],
  selectedTitle: 'Rookie Fighter',
  stats: {
    workoutsByCategory: {},
    workoutsByLevel: {},
    workoutsByTime: { morning: 0, afternoon: 0, evening: 0, night: 0 },
    techniquesWatched: [],
    combosLearned: [],
    customWorkoutsCreated: 0,
    longestSession: 0,
    shortestSession: 0,
    averageCaloriesPerWorkout: 0,
    totalRounds: 0,
  },
};

// Migration function to handle old progress data
const migrateProgress = (storedProgress: any): UserProgress => {
  // If it's already a complete UserProgress object, return it
  if (storedProgress && typeof storedProgress.totalXP === 'number') {
    return storedProgress as UserProgress;
  }

  // Migrate old progress data by adding missing gamification fields
  const migratedProgress: UserProgress = {
    ...initialProgress, // Start with default values
    ...storedProgress, // Override with stored values
    // Ensure all new gamification fields exist with defaults
    totalXP: storedProgress?.totalXP || 0,
    currentLevel: storedProgress?.currentLevel || 1,
    dailyChallenges: storedProgress?.dailyChallenges || [],
    weeklyGoal: storedProgress?.weeklyGoal || {
      workouts: 0,
      target: 3,
      xpReward: 500,
    },
    unlockedTitles: storedProgress?.unlockedTitles || ['Rookie Fighter'],
    selectedTitle: storedProgress?.selectedTitle || 'Rookie Fighter',
    stats: {
      ...initialProgress.stats,
      ...storedProgress?.stats,
      workoutsByCategory: storedProgress?.stats?.workoutsByCategory || {},
      workoutsByLevel: storedProgress?.stats?.workoutsByLevel || {},
      workoutsByTime: storedProgress?.stats?.workoutsByTime || { morning: 0, afternoon: 0, evening: 0, night: 0 },
      techniquesWatched: storedProgress?.stats?.techniquesWatched || [],
      combosLearned: storedProgress?.stats?.combosLearned || [],
      customWorkoutsCreated: storedProgress?.stats?.customWorkoutsCreated || 0,
      longestSession: storedProgress?.stats?.longestSession || 0,
      shortestSession: storedProgress?.stats?.shortestSession || 0,
      averageCaloriesPerWorkout: storedProgress?.stats?.averageCaloriesPerWorkout || 0,
      totalRounds: storedProgress?.stats?.totalRounds || 0,
    },
  };

  return migratedProgress;
};

export const useProgressStore = create<ProgressStore>()(
  persist(
    (set, get) => ({
      progress: initialProgress,

      completeWorkout: (workoutId: string, durationMinutes: number, caloriesBurned: number, roundsCompleted: number) => {
        const { progress } = get();
        const now = new Date();
        
        const completedWorkout: CompletedWorkout = {
          workoutId,
          completedAt: now,
          durationMinutes,
          caloriesBurned,
          roundsCompleted,
        };

        // Update detailed stats for gamification
        const hour = now.getHours();
        let timeOfDay: 'morning' | 'afternoon' | 'evening' | 'night';
        if (hour >= 6 && hour < 12) timeOfDay = 'morning';
        else if (hour >= 12 && hour < 18) timeOfDay = 'afternoon';
        else if (hour >= 18 && hour < 22) timeOfDay = 'evening';
        else timeOfDay = 'night';

        const newProgress: UserProgress = {
          ...progress,
          workoutsCompleted: progress.workoutsCompleted + 1,
          totalTimeMinutes: progress.totalTimeMinutes + durationMinutes,
          caloriesBurned: progress.caloriesBurned + caloriesBurned,
          completedWorkouts: [completedWorkout, ...progress.completedWorkouts],
          totalXP: progress.totalXP + Math.floor(caloriesBurned / 10) + (durationMinutes * 2), // Base XP
          stats: {
            ...progress.stats,
            totalRounds: progress.stats.totalRounds + roundsCompleted,
            workoutsByTime: {
              ...progress.stats.workoutsByTime,
              [timeOfDay]: progress.stats.workoutsByTime[timeOfDay] + 1,
            },
            longestSession: Math.max(progress.stats.longestSession, durationMinutes),
            shortestSession: progress.stats.shortestSession === 0 ? durationMinutes : Math.min(progress.stats.shortestSession, durationMinutes),
            averageCaloriesPerWorkout: Math.round((progress.caloriesBurned + caloriesBurned) / (progress.workoutsCompleted + 1)),
          },
        };

        set({ progress: newProgress });

        // Trigger haptic feedback for workout completion
        const { HapticFeedback } = require('@/utils/haptics');
        HapticFeedback.workoutComplete();

        // Update streak after setting new progress
        get().updateStreak();
        
        // Check for achievement unlocks
        get().checkAchievements();
      },

      updateStreak: () => {
        const { progress } = get();
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);

        // Check if user worked out today
        const workedOutToday = progress.completedWorkouts.some(workout => {
          const workoutDate = new Date(workout.completedAt);
          workoutDate.setHours(0, 0, 0, 0);
          return workoutDate.getTime() === today.getTime();
        });

        // Check if user worked out yesterday
        const workedOutYesterday = progress.completedWorkouts.some(workout => {
          const workoutDate = new Date(workout.completedAt);
          workoutDate.setHours(0, 0, 0, 0);
          return workoutDate.getTime() === yesterday.getTime();
        });

        let newStreak = progress.currentStreak;

        if (workedOutToday) {
          // If worked out today but not continuing from yesterday, reset to 1
          if (!workedOutYesterday && progress.currentStreak === 0) {
            newStreak = 1;
          } else if (workedOutYesterday) {
            // Continue streak only if this is the first workout today
            const todayWorkouts = progress.completedWorkouts.filter(workout => {
              const workoutDate = new Date(workout.completedAt);
              workoutDate.setHours(0, 0, 0, 0);
              return workoutDate.getTime() === today.getTime();
            });
            
            if (todayWorkouts.length === 1) { // First workout today
              newStreak = progress.currentStreak + 1;
            }
          }
        }

        const newLongestStreak = Math.max(progress.longestStreak, newStreak);

        set(state => ({
          progress: {
            ...state.progress,
            currentStreak: newStreak,
            longestStreak: newLongestStreak,
          }
        }));
      },

      unlockAchievement: (achievementId: string) => {
        const { progress } = get();
        
        // Check if achievement is already unlocked
        if (progress.achievements.some(a => a.id === achievementId)) {
          return;
        }

        const achievement = ACHIEVEMENTS.find(a => a.id === achievementId);
        if (!achievement) return;

        // Trigger haptic feedback for achievement unlock
        const { HapticFeedback } = require('@/utils/haptics');
        HapticFeedback.achievement();

        const unlockedAchievement: Achievement = {
          ...achievement,
          unlockedAt: new Date(),
        };

        set(state => ({
          progress: {
            ...state.progress,
            achievements: [...state.progress.achievements, unlockedAchievement],
          }
        }));
      },



      addFavoriteWorkout: (workoutId: string) => {
        set(state => ({
          progress: {
            ...state.progress,
            favoriteWorkouts: [...state.progress.favoriteWorkouts.filter(id => id !== workoutId), workoutId],
          }
        }));
      },

      removeFavoriteWorkout: (workoutId: string) => {
        set(state => ({
          progress: {
            ...state.progress,
            favoriteWorkouts: state.progress.favoriteWorkouts.filter(id => id !== workoutId),
          }
        }));
      },

      getWeeklyStats: () => {
        const { progress } = get();
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

        const weeklyWorkouts = progress.completedWorkouts.filter(
          workout => new Date(workout.completedAt) >= oneWeekAgo
        );

        return {
          workouts: weeklyWorkouts.length,
          calories: weeklyWorkouts.reduce((sum, w) => sum + w.caloriesBurned, 0),
          time: weeklyWorkouts.reduce((sum, w) => sum + w.durationMinutes, 0),
        };
      },

      getMonthlyStats: () => {
        const { progress } = get();
        const oneMonthAgo = new Date();
        oneMonthAgo.setDate(oneMonthAgo.getDate() - 30);

        const monthlyWorkouts = progress.completedWorkouts.filter(
          workout => new Date(workout.completedAt) >= oneMonthAgo
        );

        return {
          workouts: monthlyWorkouts.length,
          calories: monthlyWorkouts.reduce((sum, w) => sum + w.caloriesBurned, 0),
          time: monthlyWorkouts.reduce((sum, w) => sum + w.durationMinutes, 0),
        };
      },

      getTodayStats: () => {
        const { progress } = get();
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        const todayWorkouts = progress.completedWorkouts.filter(workout => {
          const workoutDate = new Date(workout.completedAt);
          return workoutDate >= today && workoutDate < tomorrow;
        });

        return {
          workouts: todayWorkouts.length,
          calories: todayWorkouts.reduce((sum, w) => sum + w.caloriesBurned, 0),
          time: todayWorkouts.reduce((sum, w) => sum + w.durationMinutes, 0),
        };
      },

      getRecentWorkouts: (count = 10) => {
        const { progress } = get();
        return progress.completedWorkouts
          .sort((a, b) => new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime())
          .slice(0, count);
      },

      getWeeklyGoalProgress: () => {
        const weeklyStats = get().getWeeklyStats();
        const target = 3; // Goal: 3 workouts per week
        
        return {
          current: weeklyStats.workouts,
          target,
          percentage: Math.min((weeklyStats.workouts / target) * 100, 100),
        };
      },

      resetProgress: () => {
        set({ progress: initialProgress });
      },

      // Gamification methods
      checkAchievements: () => {
        const { progress } = get();
        
        ACHIEVEMENTS.forEach((achievement) => {
          // Skip if already unlocked
          if (progress.achievements.some(a => a.id === achievement.id)) return;
          
          let shouldUnlock = false;
          
          // Check unlock conditions based on achievement ID
          switch (achievement.id) {
            case 'first_workout':
              shouldUnlock = progress.workoutsCompleted >= 1;
              break;
            case 'calorie_crusher_500':
              shouldUnlock = progress.caloriesBurned >= 500;
              break;
            case 'calorie_crusher_1000':
              shouldUnlock = progress.caloriesBurned >= 1000;
              break;
            case 'calorie_crusher_5000':
              shouldUnlock = progress.caloriesBurned >= 5000;
              break;
            case 'calorie_crusher_10000':
              shouldUnlock = progress.caloriesBurned >= 10000;
              break;
            case 'time_fighter_60':
              shouldUnlock = progress.totalTimeMinutes >= 60;
              break;
            case 'time_fighter_300':
              shouldUnlock = progress.totalTimeMinutes >= 300;
              break;
            case 'time_fighter_600':
              shouldUnlock = progress.totalTimeMinutes >= 600;
              break;
            case 'marathon_fighter':
              shouldUnlock = progress.totalTimeMinutes >= 3000; // 50 hours
              break;
            case 'bronze_fighter':
              shouldUnlock = progress.workoutsCompleted >= 10;
              break;
            case 'silver_fighter':
              shouldUnlock = progress.workoutsCompleted >= 25;
              break;
            case 'gold_fighter':
              shouldUnlock = progress.workoutsCompleted >= 50;
              break;
            case 'consistency_champion':
              shouldUnlock = progress.workoutsCompleted >= 100;
              break;
            case 'workout_legend':
              shouldUnlock = progress.workoutsCompleted >= 500;
              break;
            case 'daily_fighter':
              shouldUnlock = progress.currentStreak >= 3;
              break;
            case 'week_warrior':
              shouldUnlock = progress.currentStreak >= 7;
              break;
            case 'fortnight_fighter':
              shouldUnlock = progress.currentStreak >= 14;
              break;
            case 'month_machine':
              shouldUnlock = progress.currentStreak >= 30;
              break;
            case 'streak_legend':
              shouldUnlock = progress.currentStreak >= 100;
              break;
            case 'round_rookie':
              shouldUnlock = progress.stats.totalRounds >= 25;
              break;
            case 'round_warrior':
              shouldUnlock = progress.stats.totalRounds >= 100;
              break;
            case 'round_master':
              shouldUnlock = progress.stats.totalRounds >= 500;
              break;
            case 'round_legend':
              shouldUnlock = progress.stats.totalRounds >= 1000;
              break;
            // Add more conditions as needed
          }
          
          if (shouldUnlock) {
            get().unlockAchievement(achievement.id);
            get().awardXP(achievement.xpReward);
          }
        });
      },

      awardXP: (amount: number) => {
        const { progress } = get();
        const oldRank = get().getCurrentRank();
        const newTotalXP = progress.totalXP + amount;
        
        set({
          progress: {
            ...progress,
            totalXP: newTotalXP,
          }
        });

        // Check if rank increased and trigger special haptic feedback
        const newRank = get().getCurrentRank();
        if (newRank.level > oldRank.level) {
          const { HapticFeedback } = require('@/utils/haptics');
          HapticFeedback.levelUp();
        } else if (amount > 0) {
          // Light haptic for XP gain
          const { HapticFeedback } = require('@/utils/haptics');
          HapticFeedback.light();
        }
      },

      getCurrentRank: (): BoxingRank => {
        const { progress } = get();
        
        // Find the highest rank the user qualifies for
        for (let i = BOXING_RANKS.length - 1; i >= 0; i--) {
          if (progress.totalXP >= BOXING_RANKS[i].xpRequired) {
            return BOXING_RANKS[i];
          }
        }
        
        return BOXING_RANKS[0]; // Default to first rank
      },

      generateDailyChallenges: () => {
        const today = new Date();
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        tomorrow.setHours(0, 0, 0, 0);
        
        const challenges: DailyChallenge[] = [
          {
            id: 'daily_workout',
            title: 'Daily Fighter',
            description: 'Complete 1 workout today',
            target: 1,
            progress: 0,
            type: 'workouts',
            xpReward: 100,
            completed: false,
            expiresAt: tomorrow,
          },
          {
            id: 'daily_calories',
            title: 'Calorie Burner',
            description: 'Burn 200 calories today',
            target: 200,
            progress: 0,
            type: 'calories',
            xpReward: 150,
            completed: false,
            expiresAt: tomorrow,
          },
          {
            id: 'daily_time',
            title: 'Time Fighter',
            description: 'Train for 15 minutes today',
            target: 15,
            progress: 0,
            type: 'time',
            xpReward: 125,
            completed: false,
            expiresAt: tomorrow,
          },
        ];
        
        set({
          progress: {
            ...get().progress,
            dailyChallenges: challenges,
          }
        });
      },

      completeDailyChallenge: (challengeId: string) => {
        const { progress } = get();
        const updatedChallenges = progress.dailyChallenges.map(challenge => {
          if (challenge.id === challengeId && !challenge.completed) {
            get().awardXP(challenge.xpReward);
            return { ...challenge, completed: true };
          }
          return challenge;
        });
        
        set({
          progress: {
            ...progress,
            dailyChallenges: updatedChallenges,
          }
        });
      },
    }),
    {
      name: 'boxing-progress-storage',
      storage: createJSONStorage(() => AsyncStorage),
      migrate: (persistedState: any, version: number) => {
        // If no persisted state, return initial state
        if (!persistedState) {
          return { progress: initialProgress };
        }

        // Migrate the progress data
        const migratedProgress = migrateProgress(persistedState.progress);
        
        return {
          ...persistedState,
          progress: migratedProgress,
        };
      },
      version: 1, // Increment this when you need to force a migration
    }
  )
);

// Export helper functions
export const formatTime = (minutes: number): string => {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  
  if (hours > 0) {
    return `${hours}h ${mins}m`;
  }
  return `${mins}m`;
};

export const formatDate = (date: Date): string => {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(date));
};

export const getStreakEmoji = (streak: number): string => {
  if (streak >= 30) return '🔥';
  if (streak >= 14) return '⚡';
  if (streak >= 7) return '💪';
  if (streak >= 3) return '👊';
  return '🥊';
};

// Get available achievements (all possible achievements)
export const getAvailableAchievements = () => ACHIEVEMENTS; 