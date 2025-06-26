export interface Exercise {
  id: string;
  name: string;
  description: string;
  duration: number; // in seconds
  videoUrl?: string;
  instructions: string[];
  punchSequence?: number[]; // Array of punch numbers for combos
}

// New timed prompt structure for coach-style workouts
export interface TimedPrompt {
  time: number; // timestamp in seconds within the round
  instruction: string; // what to display (e.g., "Jab", "1-2", "Slip Left")
  voiceCue?: string; // optional voice instruction
  audioUrl?: string; // optional audio coaching file
  type?: 'combo' | 'movement' | 'defense' | 'stance' | 'breathing' | 'rest';
  intensity?: 'low' | 'medium' | 'high';
}

// Rest Period Instructions by Level
export interface RestInstruction {
  id: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  duration: number; // seconds
  type: 'complete' | 'active';
  instructions: RestPrompt[];
}

export interface RestPrompt {
  time: number; // seconds into rest period
  instruction: string;
  type: 'breathing' | 'hydration' | 'movement' | 'mental' | 'posture';
  audioUrl?: string; // Optional audio coaching
}

export interface TimedExercise {
  id: string;
  round: number;
  duration: number; // duration of the round in seconds
  name?: string; // optional round name
  prompts: TimedPrompt[]; // timed instructions throughout the round
}

export interface TimedWorkout {
  id: string;
  title: string;
  description: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  category: 'HIIT' | 'Freestyle' | 'Defense' | 'Footwork' | 'Combos' | 'Punching Bag';
  totalRounds: number;
  restBetweenRounds: number; // rest period between rounds in seconds
  exercises: TimedExercise[]; // one exercise per round with timed prompts
  equipment: string[];
  estimatedCalories: number;
  imageUrl: string;
  featured?: boolean;
  popular?: boolean;
}

export interface Workout {
  id: string;
  title: string;
  description: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  category: 'HIIT' | 'Freestyle' | 'Defense' | 'Footwork' | 'Combos' | 'Punching Bag';
  duration: number; // in minutes
  rounds: number;
  restPeriod: number; // in seconds
  exercises: Exercise[];
  equipment: string[];
  calories: number;
  imageUrl: string;
  featured?: boolean;
  popular?: boolean;
  premium?: boolean;
}

// Boxing Belt/Rank System
export interface BoxingRank {
  id: string;
  name: string;
  level: number;
  xpRequired: number;
  color: string;
  icon: string;
  title: string;
}

// Daily Challenges
export interface DailyChallenge {
  id: string;
  title: string;
  description: string;
  target: number;
  progress: number;
  type: 'workouts' | 'time' | 'calories' | 'combos' | 'techniques';
  xpReward: number;
  completed: boolean;
  expiresAt: Date;
}

export interface UserProgress {
  id: string;
  workoutsCompleted: number;
  totalTimeMinutes: number;
  caloriesBurned: number;
  currentStreak: number;
  longestStreak: number;
  achievements: Achievement[];
  favoriteWorkouts: string[];
  completedWorkouts: CompletedWorkout[];
  // NEW GAMIFICATION FIELDS
  totalXP: number;
  currentLevel: number;
  dailyChallenges: DailyChallenge[];
  weeklyGoal: {
    workouts: number;
    target: number;
    xpReward: number;
  };
  unlockedTitles: string[];
  selectedTitle?: string;
  // Detailed stats for achievements
  stats: {
    workoutsByCategory: { [category: string]: number };
    workoutsByLevel: { [level: string]: number };
    workoutsByTime: { morning: number; afternoon: number; evening: number; night: number };
    techniquesWatched: string[];
    combosLearned: string[];
    customWorkoutsCreated: number;
    longestSession: number; // minutes
    shortestSession: number; // minutes
    averageCaloriesPerWorkout: number;
    totalRounds: number;
  };
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlockedAt: Date;
}

// Extended Achievement for Gamification
export type AchievementCategory = 'starter' | 'consistency' | 'performance' | 'exploration' | 'mastery' | 'legendary';
export type AchievementRarity = 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';

export interface ExtendedAchievement extends Omit<Achievement, 'unlockedAt'> {
  category: AchievementCategory;
  rarity: AchievementRarity;
  xpReward: number;
  secret?: boolean; // Hidden until unlocked
}

export interface CompletedWorkout {
  workoutId: string;
  completedAt: Date;
  durationMinutes: number;
  caloriesBurned: number;
  roundsCompleted: number;
}

export interface Punch {
  number: number;
  name: string;
  description: string;
  target: 'head' | 'body' | 'both';
  hand: 'left' | 'right';
}

export interface Combo {
  id: string;
  name: string;
  sequence: number[];
  description: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  tips: string[];
}