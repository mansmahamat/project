// MET (Metabolic Equivalent of Task) values for different boxing activities
export const MET_VALUES = {
  light: 5.5,      // Light shadowboxing, technique practice
  moderate: 7.8,   // Moderate shadowboxing, combo practice
  intense: 10.5,   // High-intensity boxing, HIIT workouts
  heavy_bag: 8.3,  // Heavy bag training
  sparring: 11.0,  // Sparring (highest intensity)
} as const;

export type WorkoutIntensity = keyof typeof MET_VALUES;

// Get workout intensity based on workout category and level
export const getWorkoutIntensity = (
  category: string,
  level: string
): WorkoutIntensity => {
  // HIIT and advanced workouts are intense
  if (category === 'HIIT' || level === 'Advanced') {
    return 'intense';
  }
  
  // Heavy bag workouts
  if (category === 'Punching Bag') {
    return 'heavy_bag';
  }
  
  // Intermediate workouts are moderate
  if (level === 'Intermediate') {
    return 'moderate';
  }
  
  // Beginner and technique work is light
  return 'light';
};

// Calculate personalized calories burned
export const calculatePersonalizedCalories = (
  sex: 'male' | 'female',
  weightKg: number,
  heightCm: number,
  ageYears: number,
  durationMinutes: number,
  intensity: WorkoutIntensity
): number => {
  // Calculate BMR using Mifflin-St Jeor formula
  let BMR: number;
  if (sex === 'male') {
    BMR = 10 * weightKg + 6.25 * heightCm - 5 * ageYears + 5;
  } else {
    BMR = 10 * weightKg + 6.25 * heightCm - 5 * ageYears - 161;
  }
  
  // Get MET value for the workout intensity
  const MET = MET_VALUES[intensity];
  
  // Calculate calories per minute
  const caloriesPerMinute = (BMR / 1440) * MET;
  
  // Calculate total calories burned
  const totalCalories = caloriesPerMinute * durationMinutes;
  
  return Math.round(totalCalories);
};

// Fallback calorie calculation when user profile is incomplete
export const getFallbackCalories = (
  durationMinutes: number,
  intensity: WorkoutIntensity
): number => {
  // Use average adult metrics for fallback
  // Average adult: 70kg, 170cm, 30 years, mixed gender
  const averageCaloriesPerMinute = intensity === 'light' ? 6.5 :
                                  intensity === 'moderate' ? 8.5 :
                                  intensity === 'intense' ? 11.0 :
                                  intensity === 'heavy_bag' ? 9.0 :
                                  12.0; // sparring
  
  return Math.round(averageCaloriesPerMinute * durationMinutes);
};

// Main function to get calories - uses personalized if available, fallback otherwise
export const getWorkoutCalories = (
  durationMinutes: number,
  workoutCategory: string,
  workoutLevel: string,
  userProfile?: {
    sex: 'male' | 'female';
    weightKg: number;
    heightCm: number;
    ageYears: number;
  }
): number => {
  const intensity = getWorkoutIntensity(workoutCategory, workoutLevel);
  
  if (userProfile && userProfile.sex && userProfile.weightKg && userProfile.heightCm && userProfile.ageYears) {
    return calculatePersonalizedCalories(
      userProfile.sex,
      userProfile.weightKg,
      userProfile.heightCm,
      userProfile.ageYears,
      durationMinutes,
      intensity
    );
  }
  
  return getFallbackCalories(durationMinutes, intensity);
};

// Helper function to get intensity description
export const getIntensityDescription = (intensity: WorkoutIntensity): string => {
  switch (intensity) {
    case 'light':
      return 'Light technique practice';
    case 'moderate':
      return 'Moderate shadowboxing';
    case 'intense':
      return 'High-intensity training';
    case 'heavy_bag':
      return 'Heavy bag training';
    case 'sparring':
      return 'Sparring intensity';
    default:
      return 'Boxing workout';
  }
};

// Example calculations for reference
export const getExampleCalories = () => {
  return {
    '15min_beginner': getWorkoutCalories(15, 'Freestyle', 'Beginner'),
    '20min_intermediate': getWorkoutCalories(20, 'Combos', 'Intermediate'),
    '30min_advanced': getWorkoutCalories(30, 'HIIT', 'Advanced'),
    '15min_heavy_bag': getWorkoutCalories(15, 'Punching Bag', 'Intermediate'),
  };
}; 