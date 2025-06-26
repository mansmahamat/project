import { Punch, Combo } from '@/types/workout';

// Standard Boxing Punch Numbering System
export const PUNCHES: Punch[] = [
  {
    number: 1,
    name: 'Jab',
    description: 'Straight left hand to head or body',
    target: 'both',
    hand: 'left'
  },
  {
    number: 2,
    name: 'Cross',
    description: 'Straight right hand to head or body',
    target: 'both',
    hand: 'right'
  },
  {
    number: 3,
    name: 'Left Hook',
    description: 'Left-handed hook punch to head or body',
    target: 'both',
    hand: 'left'
  },
  {
    number: 4,
    name: 'Right Hook',
    description: 'Right-handed hook punch to head or body',
    target: 'both',
    hand: 'right'
  },
  {
    number: 5,
    name: 'Left Uppercut',
    description: 'Left-hand upward punch under chin or body',
    target: 'both',
    hand: 'left'
  },
  {
    number: 6,
    name: 'Right Uppercut',
    description: 'Right-hand upward punch under chin or body',
    target: 'both',
    hand: 'right'
  }
];

// Standard Boxing Combinations
export const COMBOS: Combo[] = [
  {
    id: 'combo-1',
    name: 'Jab-Cross (1-2)',
    sequence: [1, 2],
    description: 'Basic jab followed by straight right cross',
    level: 'Beginner',
    tips: [
      'Keep your guard up between punches',
      'Step forward slightly with the cross',
      'Rotate your hips for power'
    ]
  },
  {
    id: 'combo-2',
    name: 'Jab-Jab-Cross (1-1-2)',
    sequence: [1, 1, 2],
    description: 'Double jab to set up a strong cross',
    level: 'Beginner',
    tips: [
      'Use the first jab to measure distance',
      'Second jab to distract and set up',
      'Finish with a powerful cross'
    ]
  },
  {
    id: 'combo-3',
    name: 'Jab-Cross-Left Hook (1-2-3)',
    sequence: [1, 2, 3],
    description: 'Classic beginner combo for offense',
    level: 'Beginner',
    tips: [
      'Most fundamental combination in boxing',
      'Keep your right hand up when throwing the hook',
      'Step to the left slightly for the hook'
    ]
  },
  {
    id: 'combo-4',
    name: 'Jab-Cross-Left Hook-Right Hook (1-2-3-4)',
    sequence: [1, 2, 3, 4],
    description: 'Four-punch combination with alternating hooks',
    level: 'Intermediate',
    tips: [
      'Maintain balance throughout the combination',
      'Keep your guard up between punches',
      'Use head movement after the combo'
    ]
  },
  {
    id: 'combo-5',
    name: 'Left Hook-Right Cross (3-2)',
    sequence: [3, 2],
    description: 'Lead with a hook to set up the cross',
    level: 'Intermediate',
    tips: [
      'Step to the left with the hook',
      'Follow immediately with the cross',
      'Great for counter-attacking'
    ]
  },
  {
    id: 'combo-6',
    name: 'Jab-Left Uppercut-Right Hook (1-5-4)',
    sequence: [1, 5, 4],
    description: 'Jab to set up body work and head shot',
    level: 'Intermediate',
    tips: [
      'Use the jab to close distance',
      'Uppercut targets the body or chin',
      'Hook comes over the top'
    ]
  },
  {
    id: 'combo-7',
    name: 'Double Jab-Cross-Left Hook-Right Uppercut (1-1-2-3-6)',
    sequence: [1, 1, 2, 3, 6],
    description: 'Five-punch combination for advanced fighters',
    level: 'Advanced',
    tips: [
      'Requires excellent conditioning',
      'Focus on technique over speed',
      'Use footwork to maintain balance'
    ]
  },
  {
    id: 'combo-8',
    name: 'Left Uppercut-Right Uppercut-Left Hook (5-6-3)',
    sequence: [5, 6, 3],
    description: 'Body shots followed by head shot',
    level: 'Advanced',
    tips: [
      'Great for close-range fighting',
      'Keep your head low during uppercuts',
      'Finish with a wide hook'
    ]
  },
  {
    id: 'combo-9',
    name: 'Jab-Right Uppercut-Left Hook (1-6-3)',
    sequence: [1, 6, 3],
    description: 'Setup jab with power uppercut and hook',
    level: 'Intermediate',
    tips: [
      'Jab creates opening for uppercut',
      'Step in close for the uppercut',
      'Hook comes around the guard'
    ]
  },
  {
    id: 'combo-10',
    name: 'Cross-Left Hook-Right Hook (2-3-4)',
    sequence: [2, 3, 4],
    description: 'Power punches in succession',
    level: 'Advanced',
    tips: [
      'All power shots - use sparingly',
      'Requires excellent balance',
      'Great for finishing combinations'
    ]
  },
  {
    id: 'combo-11',
    name: 'Double Jab-Cross to Body-Uppercut-Hook to Body (1-1-2-5-3)',
    sequence: [1, 1, 2, 5, 3],
    description: 'Basic combo with body targeting and mixed levels',
    level: 'Intermediate',
    tips: [
      'Double jab sets up distance and timing',
      'Drop the cross to target body/ribs',
      'Left uppercut can target body or head',
      'Finish with left hook to body/liver area',
      'Mix head and body shots to confuse opponent'
    ]
  }
];

// Utility functions
export const getPunchByNumber = (number: number): Punch | undefined => {
  return PUNCHES.find(punch => punch.number === number);
};

export const formatPunchSequence = (sequence: number[]): string => {
  return sequence.map(num => getPunchByNumber(num)?.name || `Punch ${num}`).join(' - ');
};

export const formatPunchNumbers = (sequence: number[]): string => {
  return `(${sequence.join('-')})`;
};

export const getCombosByLevel = (level: 'Beginner' | 'Intermediate' | 'Advanced'): Combo[] => {
  return COMBOS.filter(combo => combo.level === level);
};

export const getComboById = (id: string): Combo | undefined => {
  return COMBOS.find(combo => combo.id === id);
};