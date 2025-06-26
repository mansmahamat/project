import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Workout } from '@/types/workout';

export interface CustomExercise {
  id: string;
  name: string;
  description: string;
  duration: number;
  selectedMoves: CustomMove[];
}

export interface CustomMove {
  id: string;
  type: 'combo' | 'defense' | 'movement' | 'breathing' | 'stance';
  displayText: string;
  voiceCue: string;
  punchSequence?: number[];
  description: string;
  intensity: 'low' | 'medium' | 'high';
}

export interface CustomWorkout extends Omit<Workout, 'exercises'> {
  isCustom: true;
  exercises: CustomExercise[];
  createdAt: string;
}

interface CustomWorkoutState {
  customWorkouts: CustomWorkout[];
  addCustomWorkout: (workout: Omit<CustomWorkout, 'id' | 'createdAt'>) => void;
  updateCustomWorkout: (id: string, workout: Partial<CustomWorkout>) => void;
  deleteCustomWorkout: (id: string) => void;
  getCustomWorkout: (id: string) => CustomWorkout | undefined;
}

// Predefined moves that users can choose from
export const AVAILABLE_MOVES: CustomMove[] = [
  // Basic Punches
  {
    id: 'jab',
    type: 'combo',
    displayText: '1',
    voiceCue: 'Jab',
    punchSequence: [1],
    description: 'Quick straight lead hand punch',
    intensity: 'low'
  },
  {
    id: 'cross',
    type: 'combo',
    displayText: '2',
    voiceCue: 'Cross',
    punchSequence: [2],
    description: 'Power straight rear hand punch',
    intensity: 'medium'
  },
  {
    id: 'left-hook',
    type: 'combo',
    displayText: '3',
    voiceCue: 'Left hook',
    punchSequence: [3],
    description: 'Left hook to head or body',
    intensity: 'medium'
  },
  {
    id: 'right-hook',
    type: 'combo',
    displayText: '4',
    voiceCue: 'Right hook',
    punchSequence: [4],
    description: 'Right hook to head or body',
    intensity: 'medium'
  },
  {
    id: 'left-uppercut',
    type: 'combo',
    displayText: '5',
    voiceCue: 'Left uppercut',
    punchSequence: [5],
    description: 'Left uppercut from below',
    intensity: 'high'
  },
  {
    id: 'right-uppercut',
    type: 'combo',
    displayText: '6',
    voiceCue: 'Right uppercut',
    punchSequence: [6],
    description: 'Right uppercut from below',
    intensity: 'high'
  },

  // 2-Punch Combinations
  {
    id: 'jab-cross',
    type: 'combo',
    displayText: '1-2',
    voiceCue: 'Jab-cross',
    punchSequence: [1, 2],
    description: 'Basic one-two combination',
    intensity: 'medium'
  },
  {
    id: 'jab-hook',
    type: 'combo',
    displayText: '1-3',
    voiceCue: 'Jab-left hook',
    punchSequence: [1, 3],
    description: 'Jab followed by left hook',
    intensity: 'medium'
  },
  {
    id: 'cross-hook',
    type: 'combo',
    displayText: '2-3',
    voiceCue: 'Cross-hook',
    punchSequence: [2, 3],
    description: 'Cross followed by left hook',
    intensity: 'high'
  },
  {
    id: 'double-jab',
    type: 'combo',
    displayText: '1-1',
    voiceCue: 'Double jab',
    punchSequence: [1, 1],
    description: 'Two quick jabs',
    intensity: 'medium'
  },
  {
    id: 'hooks',
    type: 'combo',
    displayText: '3-4',
    voiceCue: 'Hook combination',
    punchSequence: [3, 4],
    description: 'Left hook, right hook',
    intensity: 'high'
  },

  // 3-Punch Combinations
  {
    id: 'classic-combo',
    type: 'combo',
    displayText: '1-2-3',
    voiceCue: 'One-two-three',
    punchSequence: [1, 2, 3],
    description: 'Classic jab-cross-hook combo',
    intensity: 'high'
  },
  {
    id: 'double-jab-cross',
    type: 'combo',
    displayText: '1-1-2',
    voiceCue: 'Double jab cross',
    punchSequence: [1, 1, 2],
    description: 'Setup with double jab, finish with cross',
    intensity: 'medium'
  },
  {
    id: 'jab-cross-hook',
    type: 'combo',
    displayText: '1-2-4',
    voiceCue: 'Jab-cross-right hook',
    punchSequence: [1, 2, 4],
    description: 'Jab, cross, right hook',
    intensity: 'high'
  },

  // 4+ Punch Combinations
  {
    id: 'power-combo',
    type: 'combo',
    displayText: '1-2-3-4',
    voiceCue: 'Power combination',
    punchSequence: [1, 2, 3, 4],
    description: 'Full four-punch combination',
    intensity: 'high'
  },
  {
    id: 'volume-combo',
    type: 'combo',
    displayText: '1-1-2-3',
    voiceCue: 'Volume combination',
    punchSequence: [1, 1, 2, 3],
    description: 'High-volume four-punch combo',
    intensity: 'high'
  },

  // Body Shots
  {
    id: 'body-jab',
    type: 'combo',
    displayText: '1 Body',
    voiceCue: 'Jab to body',
    punchSequence: [1],
    description: 'Jab targeting the body',
    intensity: 'medium'
  },
  {
    id: 'body-cross',
    type: 'combo',
    displayText: '2 Body',
    voiceCue: 'Cross to body',
    punchSequence: [2],
    description: 'Cross targeting the body',
    intensity: 'high'
  },
  {
    id: 'body-hook',
    type: 'combo',
    displayText: '3 Body',
    voiceCue: 'Hook to body',
    punchSequence: [3],
    description: 'Left hook to the body/liver',
    intensity: 'high'
  },

  // Defense Moves
  {
    id: 'slip-left',
    type: 'defense',
    displayText: 'SLIP LEFT',
    voiceCue: 'Slip left',
    description: 'Slip head to the left',
    intensity: 'low'
  },
  {
    id: 'slip-right',
    type: 'defense',
    displayText: 'SLIP RIGHT',
    voiceCue: 'Slip right',
    description: 'Slip head to the right',
    intensity: 'low'
  },
  {
    id: 'duck',
    type: 'defense',
    displayText: 'DUCK',
    voiceCue: 'Duck',
    description: 'Duck under punches',
    intensity: 'medium'
  },
  {
    id: 'block',
    type: 'defense',
    displayText: 'BLOCK',
    voiceCue: 'Block',
    description: 'Block with gloves',
    intensity: 'low'
  },
  {
    id: 'parry',
    type: 'defense',
    displayText: 'PARRY',
    voiceCue: 'Parry',
    description: 'Deflect incoming punch',
    intensity: 'low'
  },
  {
    id: 'roll',
    type: 'defense',
    displayText: 'ROLL',
    voiceCue: 'Roll under',
    description: 'Roll under hooks',
    intensity: 'medium'
  },

  // Movement
  {
    id: 'move-forward',
    type: 'movement',
    displayText: 'FORWARD',
    voiceCue: 'Move forward',
    description: 'Step forward with purpose',
    intensity: 'low'
  },
  {
    id: 'move-back',
    type: 'movement',
    displayText: 'BACK',
    voiceCue: 'Move back',
    description: 'Step back and reset',
    intensity: 'low'
  },
  {
    id: 'circle-left',
    type: 'movement',
    displayText: 'CIRCLE LEFT',
    voiceCue: 'Circle left',
    description: 'Move in a circle to the left',
    intensity: 'medium'
  },
  {
    id: 'circle-right',
    type: 'movement',
    displayText: 'CIRCLE RIGHT',
    voiceCue: 'Circle right',
    description: 'Move in a circle to the right',
    intensity: 'medium'
  },
  {
    id: 'pivot-left',
    type: 'movement',
    displayText: 'PIVOT LEFT',
    voiceCue: 'Pivot left',
    description: 'Pivot on front foot to the left',
    intensity: 'medium'
  },
  {
    id: 'pivot-right',
    type: 'movement',
    displayText: 'PIVOT RIGHT',
    voiceCue: 'Pivot right',
    description: 'Pivot on front foot to the right',
    intensity: 'medium'
  },
  {
    id: 'lateral-left',
    type: 'movement',
    displayText: 'STEP LEFT',
    voiceCue: 'Step left',
    description: 'Lateral step to the left',
    intensity: 'low'
  },
  {
    id: 'lateral-right',
    type: 'movement',
    displayText: 'STEP RIGHT',
    voiceCue: 'Step right',
    description: 'Lateral step to the right',
    intensity: 'low'
  },

  // Stance & Breathing
  {
    id: 'guard-up',
    type: 'stance',
    displayText: 'GUARD UP',
    voiceCue: 'Guard up',
    description: 'Raise and tighten guard',
    intensity: 'low'
  },
  {
    id: 'reset-stance',
    type: 'stance',
    displayText: 'RESET',
    voiceCue: 'Reset stance',
    description: 'Return to proper boxing stance',
    intensity: 'low'
  },
  {
    id: 'stay-balanced',
    type: 'stance',
    displayText: 'BALANCE',
    voiceCue: 'Stay balanced',
    description: 'Focus on balance and posture',
    intensity: 'low'
  },
  {
    id: 'breathe',
    type: 'breathing',
    displayText: 'BREATHE',
    voiceCue: 'Breathe',
    description: 'Focus on controlled breathing',
    intensity: 'low'
  },
  {
    id: 'exhale-punch',
    type: 'breathing',
    displayText: 'EXHALE',
    voiceCue: 'Exhale with punches',
    description: 'Breathe out with each punch',
    intensity: 'low'
  }
];

export const useCustomWorkoutStore = create<CustomWorkoutState>()(
  persist(
    (set, get) => ({
      customWorkouts: [],

      addCustomWorkout: (workoutData) => {
        const id = `custom-${Date.now()}`;
        const newWorkout: CustomWorkout = {
          ...workoutData,
          id,
          createdAt: new Date().toISOString(),
          isCustom: true,
        };

        set((state) => ({
          customWorkouts: [...state.customWorkouts, newWorkout]
        }));
      },

      updateCustomWorkout: (id, updates) => {
        set((state) => ({
          customWorkouts: state.customWorkouts.map(workout =>
            workout.id === id ? { ...workout, ...updates } : workout
          )
        }));
      },

      deleteCustomWorkout: (id) => {
        set((state) => ({
          customWorkouts: state.customWorkouts.filter(workout => workout.id !== id)
        }));
      },

      getCustomWorkout: (id) => {
        return get().customWorkouts.find(workout => workout.id === id);
      },
    }),
    {
      name: 'custom-workouts-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

// Helper functions
export const getMovesByType = (type: CustomMove['type']): CustomMove[] => {
  return AVAILABLE_MOVES.filter(move => move.type === type);
};

export const getMoveById = (id: string): CustomMove | undefined => {
  return AVAILABLE_MOVES.find(move => move.id === id);
};

export const getMovesForWorkout = (selectedMoveIds: string[]): CustomMove[] => {
  return selectedMoveIds.map(id => getMoveById(id)).filter(Boolean) as CustomMove[];
}; 