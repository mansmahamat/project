import { Workout } from '@/types/workout';
import { TimedWorkout, TimedExercise, TimedPrompt } from '@/types/workout';

// Coaching Instructions for Coach Mode
export interface CoachingInstruction {
  id: string;
  type: 'combo' | 'movement' | 'breathing' | 'stance' | 'defense' | 'rest';
  displayText: string;
  voiceCue: string;
  duration: number; // seconds
  punchSequence?: number[];
  description: string;
  intensity: 'low' | 'medium' | 'high';
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

// Quick Start Program Structure
export interface QuickStartInstruction {
  id: string;
  type: 'demo' | 'practice' | 'combo' | 'freestyle';
  title: string;
  description: string;
  duration: number; // in seconds
  videoUrl?: string;
  punchSequence?: number[];
  instructions: string[];
  visualCue: string; // What to display prominently (e.g., "1", "3", "Slip", etc.)
  voiceCue: string; // What to announce
}

export interface QuickStartSection {
  id: string;
  title: string;
  description: string;
  duration: number; // total duration in minutes
  instructions: QuickStartInstruction[];
}

// Natural coaching flow instructions for Coach Mode
export const COACHING_INSTRUCTIONS: CoachingInstruction[] = [
  // Combo Instructions
  {
    id: 'jab',
    type: 'combo',
    displayText: '1',
    voiceCue: 'Jab',
    duration: 3,
    punchSequence: [1],
    description: 'Throw a quick jab',
    intensity: 'low'
  },
  {
    id: 'cross',
    type: 'combo',
    displayText: '2',
    voiceCue: 'Cross',
    duration: 3,
    punchSequence: [2],
    description: 'Power cross',
    intensity: 'medium'
  },
  {
    id: 'left-hook',
    type: 'combo',
    displayText: '3',
    voiceCue: 'Left hook',
    duration: 3,
    punchSequence: [3],
    description: 'Left hook to the head',
    intensity: 'medium'
  },
  {
    id: 'right-hook',
    type: 'combo',
    displayText: '4',
    voiceCue: 'Right hook',
    duration: 3,
    punchSequence: [4],
    description: 'Right hook to the head',
    intensity: 'medium'
  },
  {
    id: 'one-two',
    type: 'combo',
    displayText: '1-2',
    voiceCue: 'One-two',
    duration: 4,
    punchSequence: [1, 2],
    description: 'Jab-cross combination',
    intensity: 'medium'
  },
  {
    id: 'one-two-three',
    type: 'combo',
    displayText: '1-2-3',
    voiceCue: 'One-two-three',
    duration: 5,
    punchSequence: [1, 2, 3],
    description: 'Classic three-punch combo',
    intensity: 'high'
  },
  {
    id: 'double-jab-cross',
    type: 'combo',
    displayText: '1-1-2',
    voiceCue: 'Double jab cross',
    duration: 5,
    punchSequence: [1, 1, 2],
    description: 'Double jab setup with cross',
    intensity: 'medium'
  },
  {
    id: 'hooks',
    type: 'combo',
    displayText: '3-4',
    voiceCue: 'Hook combination',
    duration: 4,
    punchSequence: [3, 4],
    description: 'Left-right hook combo',
    intensity: 'high'
  },
  
  // Movement Instructions
  {
    id: 'move-forward',
    type: 'movement',
    displayText: 'MOVE FORWARD',
    voiceCue: 'Move forward',
    duration: 3,
    description: 'Step forward with purpose',
    intensity: 'low'
  },
  {
    id: 'move-back',
    type: 'movement',
    displayText: 'MOVE BACK',
    voiceCue: 'Move back',
    duration: 3,
    description: 'Step back and reset',
    intensity: 'low'
  },
  {
    id: 'circle-left',
    type: 'movement',
    displayText: 'CIRCLE LEFT',
    voiceCue: 'Circle left',
    duration: 4,
    description: 'Move to your left',
    intensity: 'medium'
  },
  {
    id: 'circle-right',
    type: 'movement',
    displayText: 'CIRCLE RIGHT',
    voiceCue: 'Circle right',
    duration: 4,
    description: 'Move to your right',
    intensity: 'medium'
  },
  {
    id: 'bounce',
    type: 'movement',
    displayText: 'BOUNCE',
    voiceCue: 'Stay light on your feet',
    duration: 3,
    description: 'Light bouncing movement',
    intensity: 'low'
  },
  
  // Breathing Instructions
  {
    id: 'breathe',
    type: 'breathing',
    displayText: 'BREATHE',
    voiceCue: 'Breathe',
    duration: 3,
    description: 'Focus on your breathing',
    intensity: 'low'
  },
  {
    id: 'exhale-punch',
    type: 'breathing',
    displayText: 'EXHALE',
    voiceCue: 'Exhale with your punches',
    duration: 3,
    description: 'Breathe out when punching',
    intensity: 'low'
  },
  {
    id: 'deep-breath',
    type: 'breathing',
    displayText: 'DEEP BREATH',
    voiceCue: 'Take a deep breath',
    duration: 4,
    description: 'Deep breathing for recovery',
    intensity: 'low'
  },
  
  // Stance Instructions
  {
    id: 'guard-up',
    type: 'stance',
    displayText: 'GUARD UP',
    voiceCue: 'Keep your guard up',
    duration: 3,
    description: 'Protect your face',
    intensity: 'low'
  },
  {
    id: 'chin-down',
    type: 'stance',
    displayText: 'CHIN DOWN',
    voiceCue: 'Chin down',
    duration: 3,
    description: 'Tuck your chin',
    intensity: 'low'
  },
  {
    id: 'stay-balanced',
    type: 'stance',
    displayText: 'BALANCE',
    voiceCue: 'Stay balanced',
    duration: 3,
    description: 'Maintain your balance',
    intensity: 'low'
  },
  {
    id: 'reset-stance',
    type: 'stance',
    displayText: 'RESET',
    voiceCue: 'Reset your stance',
    duration: 3,
    description: 'Return to proper stance',
    intensity: 'low'
  },
  
  // Defense Instructions
  {
    id: 'slip-left',
    type: 'defense',
    displayText: 'SLIP LEFT',
    voiceCue: 'Slip left',
    duration: 3,
    description: 'Slip to your left',
    intensity: 'medium'
  },
  {
    id: 'slip-right',
    type: 'defense',
    displayText: 'SLIP RIGHT',
    voiceCue: 'Slip right',
    duration: 3,
    description: 'Slip to your right',
    intensity: 'medium'
  },
  {
    id: 'duck',
    type: 'defense',
    displayText: 'DUCK',
    voiceCue: 'Duck down',
    duration: 3,
    description: 'Duck under punches',
    intensity: 'medium'
  },
  {
    id: 'block',
    type: 'defense',
    displayText: 'BLOCK',
    voiceCue: 'Block',
    duration: 3,
    description: 'Block with your gloves',
    intensity: 'low'
  },
  
  // Rest Instructions
  {
    id: 'active-rest',
    type: 'rest',
    displayText: 'ACTIVE REST',
    voiceCue: 'Active rest',
    duration: 5,
    description: 'Light movement and breathing',
    intensity: 'low'
  },
  {
    id: 'shake-it-out',
    type: 'rest',
    displayText: 'SHAKE IT OUT',
    voiceCue: 'Shake it out',
    duration: 4,
    description: 'Shake your arms and legs',
    intensity: 'low'
  },
  {
    id: 'stay-loose',
    type: 'rest',
    displayText: 'STAY LOOSE',
    voiceCue: 'Stay loose',
    duration: 3,
    description: 'Keep your muscles relaxed',
    intensity: 'low'
  }
];

// Rest Period Instructions by Level
export const REST_INSTRUCTIONS: RestInstruction[] = [
  {
    id: 'beginner-rest',
    level: 'Beginner',
    duration: 75, // 75 seconds (1:15)
    type: 'complete',
    instructions: [
      { time: 0, instruction: "Great work! Rest time!", type: 'mental' },
      { time: 5, instruction: "Breathe slowly and deeply", type: 'breathing' },
      { time: 15, instruction: "You're doing amazing! Hands up", type: 'posture' },
      { time: 25, instruction: "Shake out those shoulders", type: 'movement' },
      { time: 35, instruction: "Hydrate! Sip some water", type: 'hydration' },
      { time: 45, instruction: "Deep, controlled breaths", type: 'breathing' },
      { time: 55, instruction: "Relax and stay loose", type: 'movement' },
      { time: 65, instruction: "Next round coming up! You got this!", type: 'mental' },
      { time: 70, instruction: "5 seconds to go!", type: 'mental' }
    ]
  },
  {
    id: 'intermediate-rest',
    level: 'Intermediate', 
    duration: 52, // 52 seconds
    type: 'active',
    instructions: [
      { time: 0, instruction: "Awesome round! Active rest", type: 'movement' },
      { time: 5, instruction: "Keep those feet moving", type: 'movement' },
      { time: 12, instruction: "Hydrate and breathe deep", type: 'hydration' },
      { time: 20, instruction: "Visualize crushing this next round", type: 'mental' },
      { time: 30, instruction: "Stay loose, stay ready", type: 'movement' },
      { time: 40, instruction: "Mental preparation time", type: 'mental' },
      { time: 47, instruction: "Round 2 starting! Let's go!", type: 'mental' }
    ]
  },
  {
    id: 'advanced-rest',
    level: 'Advanced',
    duration: 37, // 37 seconds
    type: 'active', 
    instructions: [
      { time: 0, instruction: "Beast mode! Stay on your feet", type: 'movement' },
      { time: 5, instruction: "Light bounce, stay sharp", type: 'movement' },
      { time: 12, instruction: "Shadow those slips & rolls", type: 'movement' },
      { time: 20, instruction: "Next round: body shot attack", type: 'mental' },
      { time: 27, instruction: "Stay active, champion", type: 'movement' },
      { time: 32, instruction: "War time! Round starting!", type: 'mental' }
    ]
  }
];

// Quick-Start Boxing Program
export const QUICK_START_PROGRAM: QuickStartSection[] = [
  {
    id: 'fundamentals',
    title: 'Rapid Fundamentals',
    description: 'Learn all basic punches and defense quickly',
    duration: 15,
    instructions: [
      // Stance Demo
      {
        id: 'stance-demo',
        type: 'demo',
        title: 'Boxing Stance',
        description: 'Learn the proper boxing stance',
        duration: 60,
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
        visualCue: 'STANCE',
        voiceCue: 'Boxing stance',
        instructions: [
          'Feet shoulder-width apart',
          'Left foot forward, right foot back',
          'Knees slightly bent',
          'Hands up protecting face'
        ]
      },
      // Jab Demo & Practice
      {
        id: 'jab-demo',
        type: 'demo',
        title: 'Jab Technique',
        description: 'Master the jab - your most important punch',
        duration: 45,
        videoUrl: 'https://boyegcsxgufnheudjjyj.supabase.co/storage/v1/object/public/video-demo//Boxing%20Tips%20101%20_%20HOW%20TO_%20JAB.mp4',
        punchSequence: [1],
        visualCue: '1',
        voiceCue: 'Jab',
        instructions: [
          'Extend lead hand straight',
          'Rotate fist on impact',
          'Return quickly to guard',
          'Keep rear hand up'
        ]
      },
      {
        id: 'jab-practice',
        type: 'practice',
        title: 'Jab Practice',
        description: 'Practice throwing jabs with proper form',
        duration: 90,
        punchSequence: [1],
        visualCue: '1',
        voiceCue: 'Jab',
        instructions: [
          'Throw 20-30 jabs',
          'Focus on speed and form',
          'Keep other hand up',
          'Return to guard quickly'
        ]
      },
      // Cross Demo & Practice
      {
        id: 'cross-demo',
        type: 'demo',
        title: 'Cross Technique',
        description: 'Learn the power cross',
        duration: 45,
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
        punchSequence: [2],
        visualCue: '2',
        voiceCue: 'Cross',
        instructions: [
          'Rotate hips and shoulders',
          'Drive rear hand forward',
          'Step with rear foot',
          'Follow through target'
        ]
      },
      {
        id: 'cross-practice',
        type: 'practice',
        title: 'Cross Practice',
        description: 'Practice power crosses',
        duration: 90,
        punchSequence: [2],
        visualCue: '2',
        voiceCue: 'Cross',
        instructions: [
          'Throw 20-30 crosses',
          'Generate power from hips',
          'Keep chin tucked',
          'Don\'t drop lead hand'
        ]
      },
      // Left Hook Demo & Practice
      {
        id: 'left-hook-demo',
        type: 'demo',
        title: 'Left Hook Technique',
        description: 'Master the left hook',
        duration: 45,
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
        punchSequence: [3],
        visualCue: '3',
        voiceCue: 'Left hook',
        instructions: [
          'Keep elbow at 90 degrees',
          'Rotate on lead foot',
          'Turn hips and shoulders',
          'Keep punch compact'
        ]
      },
      {
        id: 'left-hook-practice',
        type: 'practice',
        title: 'Left Hook Practice',
        description: 'Practice left hooks',
        duration: 90,
        punchSequence: [3],
        visualCue: '3',
        voiceCue: 'Left hook',
        instructions: [
          'Throw 15-20 left hooks',
          'Focus on rotation',
          'Keep right hand up',
          'Step left for angle'
        ]
      },
      // Right Hook Demo & Practice
      {
        id: 'right-hook-demo',
        type: 'demo',
        title: 'Right Hook Technique',
        description: 'Learn the right hook',
        duration: 45,
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
        punchSequence: [4],
        visualCue: '4',
        voiceCue: 'Right hook',
        instructions: [
          'Pivot on rear foot',
          'Keep elbow parallel to ground',
          'Rotate hips explosively',
          'Maintain balance'
        ]
      },
      {
        id: 'right-hook-practice',
        type: 'practice',
        title: 'Right Hook Practice',
        description: 'Practice right hooks',
        duration: 90,
        punchSequence: [4],
        visualCue: '4',
        voiceCue: 'Right hook',
        instructions: [
          'Throw 15-20 right hooks',
          'Focus on power',
          'Keep lead hand up',
          'Don\'t wind up'
        ]
      },
      // Defense Techniques
      {
        id: 'slip-demo',
        type: 'demo',
        title: 'Slip Defense',
        description: 'Learn to slip punches',
        duration: 45,
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4',
        visualCue: 'SLIP',
        voiceCue: 'Slip',
        instructions: [
          'Slight bend at waist',
          'Move head to outside',
          'Keep feet planted',
          'Return to center quickly'
        ]
      },
      {
        id: 'slip-practice',
        type: 'practice',
        title: 'Slip Practice',
        description: 'Practice slipping left and right',
        duration: 90,
        visualCue: 'SLIP',
        voiceCue: 'Slip',
        instructions: [
          'Slip left and right',
          'Minimal movement',
          'Keep guard up',
          'Practice both sides'
        ]
      },
      // Footwork
      {
        id: 'footwork-demo',
        type: 'demo',
        title: 'Basic Footwork',
        description: 'Learn boxing movement',
        duration: 45,
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
        visualCue: 'MOVE',
        voiceCue: 'Footwork',
        instructions: [
          'Stay on balls of feet',
          'Never cross feet',
          'Move with purpose',
          'Maintain stance'
        ]
      },
      {
        id: 'footwork-practice',
        type: 'practice',
        title: 'Footwork Practice',
        description: 'Practice basic movement',
        duration: 90,
        visualCue: 'MOVE',
        voiceCue: 'Move',
        instructions: [
          'Forward, back, left, right',
          'Stay light on feet',
          'Keep balance',
          'Maintain guard'
        ]
      }
    ]
  },
  {
    id: 'combinations',
    title: 'Combining the Basics',
    description: 'Learn to chain punches together',
    duration: 15,
    instructions: [
      {
        id: 'combo-1-2',
        type: 'combo',
        title: 'Jab-Cross (1-2)',
        description: 'Basic one-two combination',
        duration: 120,
        punchSequence: [1, 2],
        visualCue: '1-2',
        voiceCue: 'One-two',
        instructions: [
          'Jab then cross',
          'Keep rhythm smooth',
          'Return to guard',
          'Repeat combination'
        ]
      },
      {
        id: 'combo-1-2-3',
        type: 'combo',
        title: 'Jab-Cross-Hook (1-2-3)',
        description: 'Classic three-punch combo',
        duration: 150,
        punchSequence: [1, 2, 3],
        visualCue: '1-2-3',
        voiceCue: 'One-two-three',
        instructions: [
          'Jab, cross, left hook',
          'Flow between punches',
          'Keep balance',
          'Finish strong'
        ]
      },
      {
        id: 'slip-counter',
        type: 'combo',
        title: 'Slip & Counter',
        description: 'Defensive counter-attack',
        duration: 150,
        punchSequence: [2, 3],
        visualCue: 'SLIP + 2-3',
        voiceCue: 'Slip and counter',
        instructions: [
          'Slip right, then counter',
          'Cross followed by hook',
          'Smooth transition',
          'Return to guard'
        ]
      },
      {
        id: 'progressive-combo',
        type: 'combo',
        title: 'Progressive Combo',
        description: 'Building up combinations',
        duration: 180,
        punchSequence: [1, 1, 2, 3, 2, 3],
        visualCue: '1-1-2-3-2-3',
        voiceCue: 'Progressive combination',
        instructions: [
          'Double jab setup',
          'Cross-hook finish',
          'Repeat the sequence',
          'Maintain rhythm'
        ]
      }
    ]
  },
  {
    id: 'freestyle',
    title: 'Freestyle Guided Workout',
    description: 'Put it all together with callouts',
    duration: 15,
    instructions: [
      {
        id: 'freestyle-warmup',
        type: 'freestyle',
        title: 'Freestyle Warm-up',
        description: 'Get loose with basic movements',
        duration: 60,
        visualCue: 'WARM UP',
        voiceCue: 'Warm up',
        instructions: [
          'Light movement',
          'Basic punches',
          'Stay loose',
          'Find your rhythm'
        ]
      },
      {
        id: 'freestyle-round-1',
        type: 'freestyle',
        title: 'Freestyle Round 1',
        description: 'First freestyle round with callouts',
        duration: 180,
        visualCue: 'ROUND 1',
        voiceCue: 'Round one',
        instructions: [
          'Follow the callouts',
          'Mix punches and movement',
          'Stay active',
          'Keep breathing'
        ]
      },
      {
        id: 'freestyle-rest-1',
        type: 'freestyle',
        title: 'Rest Period',
        description: 'Active recovery',
        duration: 60,
        visualCue: 'REST',
        voiceCue: 'Rest',
        instructions: [
          'Breathe deeply',
          'Stay loose',
          'Prepare for next round',
          'Hydrate if needed'
        ]
      },
      {
        id: 'freestyle-round-2',
        type: 'freestyle',
        title: 'Freestyle Round 2',
        description: 'Second freestyle round',
        duration: 180,
        visualCue: 'ROUND 2',
        voiceCue: 'Round two',
        instructions: [
          'Increase intensity',
          'Use all techniques',
          'Stay focused',
          'Push through fatigue'
        ]
      },
      {
        id: 'freestyle-cooldown',
        type: 'freestyle',
        title: 'Cool Down',
        description: 'Wind down and stretch',
        duration: 60,
        visualCue: 'COOL DOWN',
        voiceCue: 'Cool down',
        instructions: [
          'Slow movements',
          'Deep breathing',
          'Light stretching',
          'Great job!'
        ]
      }
    ]
  }
];

// Freestyle callouts for Quick-Start program
export const FREESTYLE_CALLOUTS = [
  { visualCue: '1', voiceCue: 'Jab', punchSequence: [1] },
  { visualCue: '2', voiceCue: 'Cross', punchSequence: [2] },
  { visualCue: '3', voiceCue: 'Left hook', punchSequence: [3] },
  { visualCue: '4', voiceCue: 'Right hook', punchSequence: [4] },
  { visualCue: '1-2', voiceCue: 'One-two', punchSequence: [1, 2] },
  { visualCue: '1-2-3', voiceCue: 'One-two-three', punchSequence: [1, 2, 3] },
  { visualCue: 'SLIP LEFT', voiceCue: 'Slip left' },
  { visualCue: 'SLIP RIGHT', voiceCue: 'Slip right' },
  { visualCue: 'MOVE', voiceCue: 'Keep moving' },
  { visualCue: 'DOUBLE UP', voiceCue: 'Double up' },
  { visualCue: 'BODY SHOT', voiceCue: 'Body shot' },
  { visualCue: 'HEAD SHOT', voiceCue: 'Head shot' },
  { visualCue: 'COMBO TIME', voiceCue: 'Combination time' },
  { visualCue: 'BREATHE', voiceCue: 'Breathe' },
  { visualCue: 'FASTER', voiceCue: 'Pick up the pace' },
  { visualCue: 'POWER', voiceCue: 'More power' }
];

// Main workout data
export const workouts: Workout[] = [
  {
    id: '1',
    title: 'Boxing Fundamentals',
    description: 'Master the basic punches and stances in proper 3-minute boxing rounds',
    level: 'Beginner',
    category: 'Freestyle',
    duration: 12, // 3 rounds × 3 minutes + 2 rest periods = 11 minutes total
    rounds: 3,
    restPeriod: 75, // Longer rest for beginners (1:15)
    calories: 180, // Realistic for beginner intensity
    equipment: [],
    imageUrl: 'https://images.pexels.com/photos/163403/box-sport-men-training-163403.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    featured: true,
    exercises: [
      {
        id: '1-1',
        name: 'Round 1: Stance & Jab Foundation',
        description: 'Learn proper stance and master the jab in a full 3-minute round',
        duration: 180, // Standard 3-minute boxing round
        punchSequence: [1],
        instructions: [
          'Maintain proper boxing stance throughout the round',
          'Practice jabs with proper form and technique',
          'Focus on footwork and balance between punches',
          'Keep non-punching hand up protecting your face',
          'Aim for 100-120 jabs over the 3 minutes'
        ]
      },
      {
        id: '1-2',
        name: 'Round 2: Cross Development',
        description: 'Add the power cross to your arsenal',
        duration: 180,
        punchSequence: [2],
        instructions: [
          'Focus on rear hand cross technique',
          'Rotate hips and shoulders for power generation',
          'Step forward slightly with each cross',
          'Return to guard position quickly after each punch',
          'Throw 80-100 crosses with proper form'
        ]
      },
      {
        id: '1-3',
        name: 'Round 3: Jab-Cross Combination',
        description: 'Combine jab and cross into basic 1-2 combinations',
        duration: 180,
        punchSequence: [1, 2],
        instructions: [
          'Practice smooth jab-cross combinations',
          'Maintain rhythm and flow between punches',
          'Focus on accuracy and technique over speed',
          'Keep breathing steady throughout combinations',
          'Complete 60-80 clean 1-2 combinations'
        ]
      }
    ]
  },
  {
    id: '19',
    title: 'Beginner Combination Mastery',
    description: 'Step-by-step combination training with footwork and defensive movements',
    level: 'Beginner',
    category: 'Combos',
    duration: 15, // 15-minute structured lesson
    rounds: 1,
    restPeriod: 0, // Continuous lesson format
    calories: 150,
    equipment: [],
    imageUrl: 'https://images.pexels.com/photos/1608099/pexels-photo-1608099.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    featured: true,
    exercises: [
      {
        id: '19-1',
        name: 'Introduction & Warm-up',
        description: 'Get ready and learn the basic stance',
        duration: 128, // 0:00 to 2:08
        instructions: [
          'Start in proper boxing stance',
          'Light warm-up movements',
          'Focus on breathing and posture',
          'Prepare for combination training'
        ]
      },
      {
        id: '19-2',
        name: 'Jab, Cross and Slip Combination',
        description: 'Learn the fundamental 1-2 with defensive slip',
        duration: 114, // 2:08 to 4:02 (114 seconds)
        punchSequence: [1, 2],
        instructions: [
          'Throw sharp jab (1)',
          'Follow with power cross (2)', 
          'Add slip movement after combination',
          'Practice slip left and slip right',
          'Reset to guard position',
          'Repeat combination with slip variations'
        ]
      },
      {
        id: '19-3',
        name: 'Lead Hook, Lead Uppercut and Roll',
        description: 'Advanced lead hand combinations with defensive roll',
        duration: 105, // 4:02 to 5:47 (105 seconds)
        punchSequence: [3, 5],
        instructions: [
          'Start with lead hook (3)',
          'Follow with lead uppercut (5)',
          'Add rolling movement under imaginary punches',
          'Keep lead hand active and sharp',
          'Practice smooth transitions',
          'Maintain balance throughout combinations'
        ]
      },
      {
        id: '19-4',
        name: 'Rear Uppercut Technique',
        description: 'Focus on proper rear uppercut form',
        duration: 50, // 5:47 to 6:37 (50 seconds)
        punchSequence: [6],
        instructions: [
          'Drive rear uppercut from legs',
          'Rotate hips and shoulders',
          'Keep punch compact and tight',
          'Return to guard quickly',
          'Practice power generation from ground up'
        ]
      },
      {
        id: '19-5',
        name: 'Rear Uppercut with Hook Combinations',
        description: 'Combine rear uppercut with left and right hooks',
        duration: 73, // 6:37 to 7:50 (73 seconds)
        punchSequence: [6, 3, 4],
        instructions: [
          'Start with rear uppercut (6)',
          'Flow into lead hook (3)',
          'Finish with rear hook (4)',
          'Maintain rhythm between punches',
          'Focus on hip rotation for power',
          'Keep combinations flowing smoothly'
        ]
      },
      {
        id: '19-6',
        name: 'Step In, Step Back Combinations',
        description: 'Advanced footwork with jab-cross and hook-cross',
        duration: 68, // 7:50 to 8:58 (68 seconds)
        punchSequence: [1, 2, 3, 2],
        instructions: [
          'Step forward with jab-cross (1-2)',
          'Step back to reset distance',
          'Practice hook-cross combination (3-2)',
          'Focus on distance management',
          'Maintain balance during footwork',
          'Keep combinations sharp while moving'
        ]
      },
      {
        id: '19-7',
        name: 'Footwork with Duck Defense',
        description: 'Previous combinations with added duck movement',
        duration: 70, // 8:58 to 10:08 (70 seconds)
        instructions: [
          'Repeat previous step combinations',
          'Add ducking under imaginary punches',
          'Duck back to avoid counters',
          'Keep head movement smooth',
          'Practice defensive positioning',
          'Combine offense and defense fluidly'
        ]
      },
      {
        id: '19-8',
        name: 'Advanced Movement Combinations',
        description: 'Complex footwork with multiple punch combinations',
        duration: 79, // 10:08 to 11:27 (79 seconds)
        punchSequence: [5, 2, 6, 3],
        instructions: [
          'Step left with lead uppercut (5)',
          'Follow with cross (2)',
          'Step right with rear uppercut (6)',
          'Finish with lead hook (3)',
          'Practice lateral movement',
          'Keep combinations flowing with footwork'
        ]
      },
      {
        id: '19-9',
        name: 'Jab and Rear Hook',
        description: 'Simple but effective jab setup with rear hook finish',
        duration: 37, // 11:27 to 12:04 (37 seconds)
        punchSequence: [1, 4],
        instructions: [
          'Sharp jab to create opening (1)',
          'Follow with powerful rear hook (4)',
          'Focus on jab setup',
          'Drive rear hook over the top',
          'Practice timing and distance'
        ]
      },
      {
        id: '19-10',
        name: 'Slip and Counter Combinations',
        description: 'Defensive slips with immediate counter-attacks',
        duration: 45, // 12:04 to 12:49 (45 seconds)
        punchSequence: [1, 2],
        instructions: [
          'Slip right to avoid imaginary punch',
          'Slip left to avoid follow-up',
          'Counter with jab (1)',
          'Follow with cross (2)',
          'Practice smooth defensive transitions',
          'Keep counters sharp and immediate'
        ]
      },
      {
        id: '19-11',
        name: 'Five-Punch Power Sequence',
        description: 'Advanced combination using all punch types',
        duration: 51, // 12:49 to 13:40 (51 seconds)
        punchSequence: [6, 5, 1, 2, 3],
        instructions: [
          'Start with rear uppercut (6)',
          'Lead uppercut (5)',
          'Jab (1)',
          'Cross (2)',
          'Finish with lead hook (3)',
          'Flow smoothly between all punches',
          'Maintain power throughout sequence'
        ]
      },
      {
        id: '19-12',
        name: 'Footwork Practice',
        description: 'Pure footwork and movement training',
        duration: 51, // 13:40 to 14:31 (51 seconds)
        instructions: [
          'Practice all learned footwork patterns',
          'Step in, step back movements',
          'Lateral movement left and right',
          'Maintain proper boxing stance',
          'Keep movement light and controlled',
          'Focus on balance and positioning'
        ]
      },
      {
        id: '19-13',
        name: 'Cool Down & Review',
        description: 'Wind down and review learned techniques',
        duration: 29, // 14:31 to 15:00 (29 seconds)
        instructions: [
          'Light shadow boxing review',
          'Practice favorite combinations',
          'Focus on technique over power',
          'Cool down breathing',
          'Reflect on learned skills'
        ]
      }
    ]
  },
  {
    id: '2',
    title: 'HIIT Boxing Power',
    description: 'High-intensity boxing training with proper 3-minute rounds',
    level: 'Intermediate',
    category: 'HIIT',
    duration: 18, // 4 rounds × 3 minutes + 3 rest periods = 17 minutes
    rounds: 4,
    restPeriod: 60, // Standard 1 minute rest
    calories: 320, // Higher intensity = more calories
    equipment: [],
    imageUrl: 'https://images.pexels.com/photos/927437/pexels-photo-927437.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    popular: true,
    exercises: [
      {
        id: '2-1',
        name: 'Round 1: Speed Combinations',
        description: 'Fast-paced jab-cross combinations with movement',
        duration: 180,
        punchSequence: [1, 2],
        instructions: [
          'Throw rapid 1-2 combinations every 3-4 seconds',
          'Add lateral movement between combinations',
          'Maintain high intensity throughout the round',
          'Focus on speed while keeping proper form',
          'Target 100+ combinations in the round'
        ]
      },
      {
        id: '2-2',
        name: 'Round 2: Hook Power',
        description: 'Power hooks with defensive movement',
        duration: 180,
        punchSequence: [3, 4],
        instructions: [
          'Alternate between left and right hooks',
          'Add slips and ducks between hook combinations',
          'Drive power from your core and hips',
          'Keep elbows at 90-degree angles',
          'Complete 80-100 hooks with maximum power'
        ]
      },
      {
        id: '2-3',
        name: 'Round 3: Three-Punch Flow',
        description: 'Classic 1-2-3 combination work',
        duration: 180,
        punchSequence: [1, 2, 3],
        instructions: [
          'Flow smoothly through jab-cross-hook sequence',
          'Add footwork pivots after each combination',
          'Maintain defensive posture between combos',
          'Increase pace in final 30 seconds',
          'Complete 60-80 three-punch combinations'
        ]
      },
      {
        id: '2-4',
        name: 'Round 4: All-Out Finish',
        description: 'High-intensity finish mixing all techniques',
        duration: 180,
        punchSequence: [1, 2, 3, 4],
        instructions: [
          'Mix all punch types in varied combinations',
          'Push maximum intensity for full 3 minutes',
          'Add constant movement and defense',
          'Final 30 seconds: maximum output',
          'Leave everything in this final round'
        ]
      }
    ]
  },
  {
    id: '3',
    title: 'Boxing Footwork Mastery',
    description: 'Develop agility and movement in proper boxing rounds',
    level: 'Beginner',
    category: 'Footwork',
    duration: 12,
    rounds: 3,
    restPeriod: 75, // Beginner rest period
    calories: 160,
    equipment: [],
    imageUrl: 'https://images.pexels.com/photos/1575381/pexels-photo-1575381.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    exercises: [
      {
        id: '3-1',
        name: 'Round 1: Basic Movement',
        description: 'Master fundamental boxing footwork patterns',
        duration: 180,
        instructions: [
          'Practice forward and backward steps',
          'Add lateral movement maintaining stance',
          'Never cross feet while moving',
          'Stay light on balls of feet',
          'Combine movement with basic jabs'
        ]
      },
      {
        id: '3-2',
        name: 'Round 2: Angles & Pivots',
        description: 'Learn to create angles with pivots',
        duration: 180,
        instructions: [
          'Pivot on front foot to create angles',
          'Practice both left and right pivots',
          'Add jab-pivot combinations',
          'Maintain balance throughout movements',
          'Focus on smooth, controlled pivots'
        ]
      },
      {
        id: '3-3',
        name: 'Round 3: Movement & Punching',
        description: 'Combine footwork with punch combinations',
        duration: 180,
        punchSequence: [1, 2],
        instructions: [
          'Move between each combination',
          'Practice hitting and moving',
          'Add defense during movement',
          'Vary directions and patterns',
          'Maintain boxing stance throughout'
        ]
      }
    ]
  },
  {
    id: '4',
    title: 'Defense & Counter Boxing',
    description: 'Master defensive techniques in championship-level rounds',
    level: 'Advanced',
    category: 'Defense',
    duration: 21, // 5 rounds × 3 minutes + 4 rest periods
    rounds: 5,
    restPeriod: 45, // Shorter rest for advanced athletes
    calories: 380,
    equipment: [],
    imageUrl: 'https://images.pexels.com/photos/1544774/pexels-photo-1544774.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    exercises: [
      {
        id: '4-1',
        name: 'Round 1: Slip & Counter',
        description: 'Master slipping with immediate counters',
        duration: 180,
        punchSequence: [1, 2],
        instructions: [
          'Practice slipping imaginary punches',
          'Counter immediately with 1-2 combinations',
          'Slip both left and right',
          'Keep head movement smooth and controlled',
          'Return to guard after every counter'
        ]
      },
      {
        id: '4-2',
        name: 'Round 2: Duck & Hook Counter',
        description: 'Duck under and counter with power hooks',
        duration: 180,
        punchSequence: [3, 4],
        instructions: [
          'Duck under imaginary punches',
          'Counter with devastating hook combinations',
          'Keep knees bent during ducks',
          'Explode up with counter hooks',
          'Maintain defensive awareness'
        ]
      },
      {
        id: '4-3',
        name: 'Round 3: Block & Strike',
        description: 'Active blocking with immediate counters',
        duration: 180,
        punchSequence: [1, 2, 3],
        instructions: [
          'Use gloves to actively block',
          'Counter immediately after blocks',
          'Vary your counter combinations',
          'Keep blocks tight and controlled',
          'Flow smoothly from defense to offense'
        ]
      },
      {
        id: '4-4',
        name: 'Round 4: Mixed Defense',
        description: 'Combine all defensive techniques',
        duration: 180,
        punchSequence: [1, 2, 3, 4],
        instructions: [
          'Mix slips, ducks, and blocks randomly',
          'Counter with varied combinations',
          'Add footwork to defensive movements',
          'Simulate realistic fight scenarios',
          'Maintain high defensive work rate'
        ]
      },
      {
        id: '4-5',
        name: 'Round 5: Championship Defense',
        description: 'Elite-level defensive boxing round',
        duration: 180,
        punchSequence: [1, 2, 3, 4, 5, 6],
        instructions: [
          'Demonstrate mastery of all techniques',
          'Flow seamlessly between defense and attack',
          'Add advanced counters and combinations',
          'Maintain championship-level intensity',
          'Finish strong like a true champion'
        ]
      }
    ]
  },
  {
    id: '5',
    title: 'Heavy Bag Warrior',
    description: 'Professional heavy bag training with authentic boxing rounds',
    level: 'Intermediate',
    category: 'Punching Bag',
    duration: 18, // 4 rounds × 3 minutes + 3 rest periods
    rounds: 4,
    restPeriod: 60,
    calories: 380, // High calorie burn due to heavy bag work
    equipment: ['Heavy Bag', 'Hand Wraps', 'Boxing Gloves'],
    imageUrl: 'https://images.pexels.com/photos/4162449/pexels-photo-4162449.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    featured: true,
    exercises: [
      {
        id: '5-1',
        name: 'Round 1: Power Foundation',
        description: 'Build power with basic combinations',
        duration: 180,
        punchSequence: [1, 2, 3],
        instructions: [
          'Focus on power over speed',
          'Drive through every punch',
          'Use full body weight behind strikes',
          'Breathe out forcefully with each punch',
          'Complete 80-100 power combinations'
        ]
      },
      {
        id: '5-2',
        name: 'Round 2: Volume Striking',
        description: 'High-volume combinations for conditioning',
        duration: 180,
        punchSequence: [1, 1, 2, 3, 4],
        instructions: [
          'Throw rapid five-punch combinations',
          'Maintain steady rhythm throughout',
          'Focus on endurance over power',
          'Keep punches sharp despite fatigue',
          'Target 60+ complete combinations'
        ]
      },
      {
        id: '5-3',
        name: 'Round 3: Body-Head Attack',
        description: 'Strategic body and head shot combinations',
        duration: 180,
        punchSequence: [1, 5, 6, 3],
        instructions: [
          'Start with jab, then body uppercuts',
          'Finish with head hook',
          'Change levels smoothly',
          'Keep combinations unpredictable',
          'Focus on different target zones'
        ]
      },
      {
        id: '5-4',
        name: 'Round 4: Championship Finish',
        description: 'All-out final round mixing power and volume',
        duration: 180,
        punchSequence: [1, 2, 3, 4, 5, 6],
        instructions: [
          'Use all punches in varied combinations',
          'Push maximum intensity',
          'Add constant movement around bag',
          'Final minute: leave everything',
          'Finish like a true champion'
        ]
      }
    ]
  },
  {
    id: '6',
    title: 'Professional Championship Training',
    description: 'Train like a professional boxer with championship-level rounds',
    level: 'Advanced',
    category: 'Combos',
    duration: 24, // 6 rounds × 3 minutes + 5 rest periods
    rounds: 6,
    restPeriod: 45, // Professional-style short rest
    calories: 450,
    equipment: [],
    imageUrl: 'https://images.pexels.com/photos/2600493/pexels-photo-2600493.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    popular: true,
    exercises: [
      {
        id: '6-1',
        name: 'Round 1: Technical Precision',
        description: 'Perfect technique with complex combinations',
        duration: 180,
        punchSequence: [1, 2, 3, 4],
        instructions: [
          'Focus on perfect technique',
          'Flow smoothly between all punches',
          'Maintain defensive posture',
          'Add subtle feints and setups',
          'Quality over quantity in combinations'
        ]
      },
      {
        id: '6-2',
        name: 'Round 2: Speed & Power',
        description: 'Combine maximum speed with devastating power',
        duration: 180,
        punchSequence: [1, 2, 3, 4, 5, 6],
        instructions: [
          'Alternate between speed and power',
          'Use all six punch types',
          'Add advanced footwork patterns',
          'Maintain championship pace',
          'Push physical and mental limits'
        ]
      },
      {
        id: '6-3',
        name: 'Round 3: Advanced Combinations',
        description: 'Master complex multi-punch combinations',
        duration: 180,
        punchSequence: [1, 6, 3, 2, 5, 4],
        instructions: [
          'Execute advanced combination sequences',
          'Flow seamlessly between all punches',
          'Add defensive movements between combos',
          'Visualize a skilled opponent',
          'Maintain elite-level intensity'
        ]
      },
      {
        id: '6-4',
        name: 'Round 4: Championship Pressure',
        description: 'Apply constant pressure like a champion',
        duration: 180,
        punchSequence: [1, 2, 3, 4, 5, 6],
        instructions: [
          'Maintain constant forward pressure',
          'Mix power shots with volume',
          'Add advanced defensive tactics',
          'Push through championship fatigue',
          'Demonstrate professional conditioning'
        ]
      },
      {
        id: '6-5',
        name: 'Round 5: Mental Warfare',
        description: 'Championship-level mental and physical challenge',
        duration: 180,
        punchSequence: [1, 2, 3, 4, 5, 6],
        instructions: [
          'Push through mental barriers',
          'Maintain technique under extreme fatigue',
          'Add strategic combination sequences',
          'Show championship heart',
          'Prepare for final championship round'
        ]
      },
      {
        id: '6-6',
        name: 'Round 6: Championship Finish',
        description: 'Leave everything in the ring - championship final round',
        duration: 180,
        punchSequence: [1, 2, 3, 4, 5, 6],
        instructions: [
          'Give everything you have left',
          'Demonstrate mastery of all techniques',
          'Maintain professional form despite fatigue',
          'Final minute: championship effort',
          'Finish like a true champion boxer'
        ]
      }
    ]
  },
  // Keep the specialized workouts that are already well-structured
  {
    id: '14',
    title: 'Jab Pyramid Heavy Bag',
    description: 'Classic conditioning drill - climb the jab pyramid from 1 to 10 then back down',
    level: 'Intermediate',
    category: 'Punching Bag',
    duration: 3,
    rounds: 1,
    restPeriod: 0,
    calories: 140,
    equipment: ['Heavy Bag', 'Hand Wraps', 'Boxing Gloves'],
    imageUrl: 'https://images.pexels.com/photos/8611978/pexels-photo-8611978.jpeg',
    featured: true,
    exercises: [
      {
        id: '14-1',
        name: 'Jab Pyramid Challenge',
        description: 'Work up from 1 jab to 10 jabs, then back down to 1',
        duration: 180, // 3 minutes
        punchSequence: [1], // Only jabs
        instructions: [
          'Start with 1 jab, return to guard',
          'Throw 2 jabs, return to guard',
          'Continue increasing by 1 each time up to 10 jabs',
          'Then work back down from 10 to 1',
          'Goal: Complete 2 full pyramids in 3 minutes',
          'Focus on crisp, sharp jabs with proper form',
          'Reset to guard position after each set',
          'Maintain rhythm and breathing throughout'
        ]
      }
    ]
  },
  {
    id: '15',
    title: 'Flash-Combo Speed Training',
    description: 'Professional speed training - lightning-fast 2-punch combinations',
    level: 'Advanced',
    category: 'HIIT',
    duration: 18, // 5 rounds × 3 minutes + 4 rest periods
    rounds: 5,
    restPeriod: 45,
    calories: 400,
    equipment: ['Heavy Bag', 'Hand Wraps', 'Boxing Gloves'],
    imageUrl: 'https://images.pexels.com/photos/4761594/pexels-photo-4761594.jpeg',
    featured: true,
    exercises: [
      {
        id: '15-1',
        name: 'Round 1: Flash Jab-Cross',
        description: 'Lightning-fast 1-2 combinations at maximum speed',
        duration: 180,
        punchSequence: [1, 2],
        instructions: [
          'Throw jab-cross at maximum speed',
          'Make both punches sound like ONE punch',
          'Focus purely on speed over power',
          'Keep combinations tight and crisp',
          'Target 150+ flash combinations',
          'Reset quickly between combos',
          'Maintain proper form at high speed'
        ]
      },
      {
        id: '15-2',
        name: 'Round 2: Flash Cross-Hook',
        description: 'Explosive cross-left hook speed combinations',
        duration: 180,
        punchSequence: [2, 3],
        instructions: [
          'Cross flows immediately into left hook',
          'No pause between punches',
          'Make it sound like one impact',
          'Use hip rotation for speed',
          'Keep hook tight and compact',
          'Lightning-fast transitions',
          'Complete 120+ speed combinations'
        ]
      },
      {
        id: '15-3',
        name: 'Round 3: Flash Jab-Right Hook',
        description: 'Speed jab setup into explosive right hook',
        duration: 180,
        punchSequence: [1, 4],
        instructions: [
          'Jab creates opening for right hook',
          'Hook comes over the top instantly',
          'Two punches = one sound',
          'Quick jab, explosive hook',
          'Pivot sharply on rear foot',
          'Keep combinations flowing',
          'Complete 120+ combinations'
        ]
      },
      {
        id: '15-4',
        name: 'Round 4: Flash Uppercut-Hook',
        description: 'Uppercut to hook combinations at maximum speed',
        duration: 180,
        punchSequence: [5, 3],
        instructions: [
          'Uppercut drives up into hook',
          'Seamless transition between punches',
          'Make them blur together',
          'Close range power combination',
          'Keep elbows tight',
          'Explosive hip movement',
          'Complete 100+ combinations'
        ]
      },
      {
        id: '15-5',
        name: 'Round 5: Speed Choice Mastery',
        description: 'Master your best 2-punch combination at elite speed',
        duration: 180,
        punchSequence: [1, 2, 3, 4, 5, 6],
        instructions: [
          'Choose your strongest 2-punch combo',
          'Focus on perfecting maximum speed',
          'Push your absolute speed limits',
          'Make two punches sound like one',
          'Show professional-level speed',
          'Finish with championship intensity',
          'Leave everything in this final round'
        ]
      }
    ]
  },
  {
    id: '7',
    title: 'Combination Fundamentals',
    description: 'Master the essential 2-punch combinations every boxer needs',
    level: 'Beginner',
    category: 'Combos',
    duration: 12, // 3 rounds × 3 minutes + 2 rest periods
    rounds: 3,
    restPeriod: 75, // Beginner rest period
    calories: 170,
    equipment: [],
    imageUrl: 'https://images.pexels.com/photos/1938126/pexels-photo-1938126.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    exercises: [
      {
        id: '7-1',
        name: 'Round 1: Jab-Cross Mastery (1-2)',
        description: 'Perfect the most fundamental boxing combination',
        duration: 180,
        punchSequence: [1, 2],
        instructions: [
          'Focus on clean, crisp 1-2 combinations',
          'Jab to set up distance, cross for power',
          'Return to guard after each combination',
          'Maintain proper stance throughout',
          'Complete 80-100 clean 1-2 combinations'
        ]
      },
      {
        id: '7-2',
        name: 'Round 2: Cross-Hook Power (2-3)',
        description: 'Learn to generate power with angle changes',
        duration: 180,
        punchSequence: [2, 3],
        instructions: [
          'Throw cross at moderate speed to set up hook',
          'Rotate hips fully for maximum hook power',
          'Keep hook compact and sharp',
          'Focus on different angles of attack',
          'Complete 60-80 power combinations'
        ]
      },
      {
        id: '7-3',
        name: 'Round 3: Hook Combinations (3-4)',
        description: 'Master left and right hook combinations',
        duration: 180,
        punchSequence: [3, 4],
        instructions: [
          'Alternate between left and right hooks',
          'Keep elbows at 90-degree angles',
          'Generate power from core rotation',
          'Maintain balance between hook exchanges',
          'Complete 50-70 hook combinations'
        ]
      }
    ]
  },
  {
    id: '8',
    title: 'Triple Threat Training',
    description: 'Master essential 3-punch combinations with proper flow',
    level: 'Beginner',
    category: 'Combos',
    duration: 12,
    rounds: 3,
    restPeriod: 75,
    calories: 185,
    equipment: [],
    imageUrl: 'https://images.pexels.com/photos/2261477/pexels-photo-2261477.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    exercises: [
      {
        id: '8-1',
        name: 'Round 1: Classic 1-2-3',
        description: 'The most iconic three-punch combination in boxing',
        duration: 180,
        punchSequence: [1, 2, 3],
        instructions: [
          'Jab to set distance and open guard',
          'Cross for power through the middle',
          'Hook to exploit opened defense',
          'Flow smoothly between all three punches',
          'Complete 50-70 complete sequences'
        ]
      },
      {
        id: '8-2',
        name: 'Round 2: Double Jab Setup (1-1-2)',
        description: 'Use double jabs to set up devastating crosses',
        duration: 180,
        punchSequence: [1, 1, 2],
        instructions: [
          'First jab gauges distance',
          'Second jab forces opponent to react',
          'Cross exploits the opening created',
          'Keep jabs sharp and quick',
          'Complete 60-80 setup combinations'
        ]
      },
      {
        id: '8-3',
        name: 'Round 3: Jab-Cross Return (1-2-1)',
        description: 'Learn to continue combinations after power shots',
        duration: 180,
        punchSequence: [1, 2, 1],
        instructions: [
          'Open with jab for distance',
          'Follow with power cross',
          'Return jab maintains pressure',
          'Perfect for outside range boxing',
          'Complete 70-90 continuation combinations'
        ]
      }
    ]
  },
  {
    id: '9',
    title: 'Uppercut Specialist Training',
    description: 'Master uppercut combinations for close-range dominance',
    level: 'Intermediate',
    category: 'Combos',
    duration: 15, // 4 rounds × 3 minutes + 3 rest periods
    rounds: 4,
    restPeriod: 60,
    calories: 280,
    equipment: [],
    imageUrl: 'https://images.pexels.com/photos/1756484/pexels-photo-1756484.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    exercises: [
      {
        id: '9-1',
        name: 'Round 1: Lead Uppercut-Cross (5-2)',
        description: 'Powerful close-range combination',
        duration: 180,
        punchSequence: [5, 2],
        instructions: [
          'Bend knees for explosive lead uppercut',
          'Transfer power from legs through body',
          'Follow immediately with straight cross',
          'Keep chin down during uppercut',
          'Complete 60-80 close-range combinations'
        ]
      },
      {
        id: '9-2',
        name: 'Round 2: Uppercut-Cross-Hook (5-2-3)',
        description: 'Extended uppercut combination with hook finish',
        duration: 180,
        punchSequence: [5, 2, 3],
        instructions: [
          'Lead uppercut forces guard down',
          'Cross exploits opened defense',
          'Hook catches opponent off guard',
          'Flow smoothly between level changes',
          'Complete 50-70 combination sequences'
        ]
      },
      {
        id: '9-3',
        name: 'Round 3: Double Uppercut-Hook (5-6-3)',
        description: 'Advanced uppercut combination for inside fighting',
        duration: 180,
        punchSequence: [5, 6, 3],
        instructions: [
          'Left uppercut to body or head',
          'Right uppercut continues pressure',
          'Left hook exploits lowered guard',
          'Perfect for close-range exchanges',
          'Complete 40-60 advanced combinations'
        ]
      },
      {
        id: '9-4',
        name: 'Round 4: Jab-Right Uppercut-Hook (1-6-3)',
        description: 'Setup uppercut combination with devastating finish',
        duration: 180,
        punchSequence: [1, 6, 3],
        instructions: [
          'Jab creates opening and distance',
          'Step in with explosive right uppercut',
          'Left hook finishes the sequence',
          'Use jab to close distance for uppercut',
          'Complete 50-70 setup combinations'
        ]
      }
    ]
  },
  {
    id: '10',
    title: 'Advanced Power Combinations',
    description: 'Elite-level combination work with maximum power output',
    level: 'Advanced',
    category: 'Combos',
    duration: 18, // 5 rounds × 3 minutes + 4 rest periods
    rounds: 5,
    restPeriod: 45,
    calories: 350,
    equipment: [],
    imageUrl: 'https://images.pexels.com/photos/7991628/pexels-photo-7991628.jpeg',
    exercises: [
      {
        id: '10-1',
        name: 'Round 1: Cross-Hook-Cross (2-3-2)',
        description: 'Devastating power combination from multiple angles',
        duration: 180,
        punchSequence: [2, 3, 2],
        instructions: [
          'Lead cross sets up opponent movement',
          'Hook catches lateral movement',
          'Return cross exploits opened guard',
          'Generate maximum power from hip rotation',
          'Complete 50-70 power combinations'
        ]
      },
      {
        id: '10-2',
        name: 'Round 2: Right Uppercut-Left Hook (6-3)',
        description: 'Close-range power combination',
        duration: 180,
        punchSequence: [6, 3],
        instructions: [
          'Right uppercut forces guard adjustment',
          'Left hook exploits opened defense',
          'Perfect for inside exchanges',
          'Focus on explosive hip generation',
          'Complete 60-80 close-range combinations'
        ]
      },
      {
        id: '10-3',
        name: 'Round 3: Jab-Right Hook (1-4)',
        description: 'Setup and knockout combination',
        duration: 180,
        punchSequence: [1, 4],
        instructions: [
          'Jab creates opening and reaction',
          'Right hook comes over the top',
          'Perfect for catching ducking opponents',
          'Rotate full body weight into hook',
          'Complete 50-70 knockout combinations'
        ]
      },
      {
        id: '10-4',
        name: 'Round 4: Cross-Hook-Uppercut (2-3-6)',
        description: 'Complex power combination against ropes',
        duration: 180,
        punchSequence: [2, 3, 6],
        instructions: [
          'Cross stuns and sets up position',
          'Hook exploits opened side',
          'Uppercut finishes with devastating power',
          'Perfect for cornered opponents',
          'Complete 40-60 finishing combinations'
        ]
      },
      {
        id: '10-5',
        name: 'Round 5: Elite Combination Flow',
        description: 'Chain together advanced combinations',
        duration: 180,
        punchSequence: [1, 2, 5, 6, 3],
        instructions: [
          'Flow between all combination types',
          'Use jab-cross to set up uppercuts',
          'Finish with devastating hook',
          'Demonstrate mastery of all techniques',
          'Complete 40-60 elite combinations'
        ]
      }
    ]
  },
  {
    id: '11',
    title: 'Body Shot Specialist',
    description: 'Master devastating body shots and body-head combinations',
    level: 'Intermediate',
    category: 'Combos',
    duration: 15,
    rounds: 4,
    restPeriod: 60,
    calories: 290,
    equipment: [],
    imageUrl: 'https://images.pexels.com/photos/7991629/pexels-photo-7991629.jpeg',
    exercises: [
      {
        id: '11-1',
        name: 'Round 1: Jab-Body Cross Setup',
        description: 'Use jab to set up devastating body crosses',
        duration: 180,
        punchSequence: [1, 2], // Jab to head, cross to body
        instructions: [
          'Jab high to lift opponent guard',
          'Drop level and drive cross to body',
          'Use legs to change levels smoothly',
          'Target liver and solar plexus areas',
          'Complete 60-80 body shot setups'
        ]
      },
      {
        id: '11-2',
        name: 'Round 2: Body Hook Combinations',
        description: 'Master body hooks from both sides',
        duration: 180,
        punchSequence: [3, 4], // Left and right body hooks
        instructions: [
          'Bend knees to get under opponent guard',
          'Drive hooks deep into body targets',
          'Alternate between left and right body hooks',
          'Keep punches compact and explosive',
          'Complete 50-70 body hook combinations'
        ]
      },
      {
        id: '11-3',
        name: 'Round 3: Body-Head Transitions',
        description: 'Flow smoothly between body and head targets',
        duration: 180,
        punchSequence: [1, 2, 3], // Jab head, cross body, hook head
        instructions: [
          'Start with jab to head',
          'Drop cross to body to lower guard',
          'Come back up with hook to head',
          'Master smooth level changes',
          'Complete 50-70 transition combinations'
        ]
      },
      {
        id: '11-4',
        name: 'Round 4: Liver Shot Mastery',
        description: 'Perfect the devastating left hook to liver',
        duration: 180,
        punchSequence: [1, 3], // Jab setup, left hook to liver
        instructions: [
          'Use jab to disguise liver shot setup',
          'Step left and drive hook to liver area',
          'Keep hook short and sharp',
          'Focus on precision over power',
          'Complete 40-60 liver shot combinations'
        ]
      }
    ]
  },
  {
    id: '12',
    title: 'Counter-Punching Mastery',
    description: 'Learn to counter-attack with precision and timing',
    level: 'Advanced',
    category: 'Defense',
    duration: 18,
    rounds: 5,
    restPeriod: 45,
    calories: 330,
    equipment: [],
    imageUrl: 'https://images.pexels.com/photos/7991631/pexels-photo-7991631.jpeg',
    exercises: [
      {
        id: '12-1',
        name: 'Round 1: Slip-Counter Basic',
        description: 'Master basic slip and counter fundamentals',
        duration: 180,
        punchSequence: [1, 2],
        instructions: [
          'Slip imaginary jab to outside',
          'Counter immediately with straight shots',
          'Keep head movement minimal and controlled',
          'Return to guard after countering',
          'Complete 60-80 slip-counter sequences'
        ]
      },
      {
        id: '12-2',
        name: 'Round 2: Duck-Counter Uppercuts',
        description: 'Duck under and counter with devastating uppercuts',
        duration: 180,
        punchSequence: [5, 6],
        instructions: [
          'Duck under imaginary straight punches',
          'Counter with explosive uppercuts',
          'Use legs to generate upward power',
          'Keep knees bent throughout duck',
          'Complete 50-70 duck-counter combinations'
        ]
      },
      {
        id: '12-3',
        name: 'Round 3: Parry-Counter Flow',
        description: 'Advanced parrying with immediate counters',
        duration: 180,
        punchSequence: [2, 3],
        instructions: [
          'Parry imaginary jabs with lead hand',
          'Counter with cross-hook combinations',
          'Keep parries subtle and efficient',
          'Flow smoothly from defense to offense',
          'Complete 50-70 parry-counter sequences'
        ]
      },
      {
        id: '12-4',
        name: 'Round 4: Roll-Counter System',
        description: 'Roll under hooks and counter with precision',
        duration: 180,
        punchSequence: [1, 4],
        instructions: [
          'Roll under imaginary hook punches',
          'Counter with jab-right hook combinations',
          'Keep rolling motion smooth and controlled',
          'Time counters for maximum effect',
          'Complete 40-60 roll-counter sequences'
        ]
      },
      {
        id: '12-5',
        name: 'Round 5: Advanced Counter Flow',
        description: 'Chain together all counter-punching techniques',
        duration: 180,
        punchSequence: [1, 2, 3, 4, 5, 6],
        instructions: [
          'Mix all defensive techniques randomly',
          'Counter with varied combinations',
          'Demonstrate timing and precision',
          'Show advanced counter-punching mastery',
          'Complete 40-60 advanced sequences'
        ]
      }
    ]
  },
  {
    id: '13',
    title: 'Defensive Specialist Elite',
    description: 'Master all defensive techniques with championship-level skill',
    level: 'Advanced',
    category: 'Defense',
    duration: 21,
    rounds: 6,
    restPeriod: 45,
    calories: 380,
    equipment: [],
    imageUrl: 'https://images.pexels.com/photos/4761671/pexels-photo-4761671.jpeg',
    exercises: [
      {
        id: '13-1',
        name: 'Round 1: Head Movement Flow',
        description: 'Constant head movement with occasional counters',
        duration: 180,
        punchSequence: [1, 2],
        instructions: [
          'Maintain constant subtle head movement',
          'Slip, duck, and weave continuously',
          'Add occasional counter punches',
          'Keep defensive movement smooth',
          'Focus on making yourself a difficult target'
        ]
      },
      {
        id: '13-2',
        name: 'Round 2: Footwork Defense',
        description: 'Use footwork to avoid and counter',
        duration: 180,
        punchSequence: [1, 3],
        instructions: [
          'Use pivots and angles to avoid attacks',
          'Step out of range and counter',
          'Circle and counter with jab-hook',
          'Maintain proper boxing stance',
          'Complete 60-80 footwork counters'
        ]
      },
      {
        id: '13-3',
        name: 'Round 3: Shoulder Roll Defense',
        description: 'Master the shoulder roll defensive style',
        duration: 180,
        punchSequence: [2, 3],
        instructions: [
          'Use lead shoulder to deflect punches',
          'Counter with quick cross-hook combinations',
          'Keep rear hand ready for counters',
          'Maintain low lead hand position',
          'Complete 50-70 shoulder roll counters'
        ]
      },
      {
        id: '13-4',
        name: 'Round 4: Philly Shell Advanced',
        description: 'Advanced Philly Shell defensive techniques',
        duration: 180,
        punchSequence: [1, 2, 3],
        instructions: [
          'Master the Philly Shell guard position',
          'Use shell to deflect and counter',
          'Keep lead hand low, rear hand high',
          'Counter with lightning-fast combinations',
          'Complete 50-70 shell counters'
        ]
      },
      {
        id: '13-5',
        name: 'Round 5: Defensive Pressure',
        description: 'Apply pressure while maintaining defense',
        duration: 180,
        punchSequence: [1, 2, 3, 4],
        instructions: [
          'Move forward while staying defensive',
          'Use head movement to close distance',
          'Counter while applying pressure',
          'Demonstrate aggressive defense',
          'Complete 50-70 pressure combinations'
        ]
      },
      {
        id: '13-6',
        name: 'Round 6: Championship Defense',
        description: 'Elite defensive mastery with all techniques',
        duration: 180,
        punchSequence: [1, 2, 3, 4, 5, 6],
        instructions: [
          'Use all defensive techniques fluidly',
          'Show mastery of timing and distance',
          'Counter with championship precision',
          'Demonstrate defensive artistry',
          'Complete 40-60 masterful sequences'
        ]
      }
    ]
  },
  {
    id: '14',
    title: 'Boxing Endurance Warrior',
    description: 'Build championship-level boxing conditioning and stamina',
    level: 'Intermediate',
    category: 'HIIT',
    duration: 24, // 6 rounds × 3 minutes + 5 rest periods
    rounds: 6,
    restPeriod: 60,
    calories: 420,
    equipment: [],
    imageUrl: 'https://images.pexels.com/photos/7991626/pexels-photo-7991626.jpeg',
    exercises: [
      {
        id: '14-1',
        name: 'Round 1: Volume Punching',
        description: 'High-volume punching for conditioning',
        duration: 180,
        punchSequence: [1, 2],
        instructions: [
          'Throw continuous 1-2 combinations',
          'Maintain steady pace throughout round',
          'Focus on endurance over power',
          'Keep breathing controlled and rhythmic',
          'Target 200+ combinations in round'
        ]
      },
      {
        id: '14-2',
        name: 'Round 2: Combination Endurance',
        description: 'Extended combinations for stamina building',
        duration: 180,
        punchSequence: [1, 2, 3, 2],
        instructions: [
          'Throw 4-punch combinations continuously',
          'Maintain form despite building fatigue',
          'Keep combinations sharp and clean',
          'Push through mental barriers',
          'Complete 100+ extended combinations'
        ]
      },
      {
        id: '14-3',
        name: 'Round 3: Constant Movement',
        description: 'Non-stop movement with punching',
        duration: 180,
        punchSequence: [1, 2, 3],
        instructions: [
          'Never stop moving throughout round',
          'Combine footwork with punching',
          'Add lateral movement and pivots',
          'Maintain boxing stance while moving',
          'Complete 80+ moving combinations'
        ]
      },
      {
        id: '14-4',
        name: 'Round 4: Speed Endurance',
        description: 'Maintain speed under fatigue',
        duration: 180,
        punchSequence: [1, 1, 2, 3],
        instructions: [
          'Throw fast combinations despite fatigue',
          'Maintain speed throughout entire round',
          'Focus on hand speed and snap',
          'Push through conditioning barriers',
          'Complete 120+ speed combinations'
        ]
      },
      {
        id: '14-5',
        name: 'Round 5: Championship Conditioning',
        description: 'Professional-level conditioning round',
        duration: 180,
        punchSequence: [1, 2, 3, 4, 5],
        instructions: [
          'Use all punches in varied combinations',
          'Maintain championship-level intensity',
          'Show mental toughness and determination',
          'Push through extreme fatigue',
          'Complete 80+ championship combinations'
        ]
      },
      {
        id: '14-6',
        name: 'Round 6: Warrior Finish',
        description: 'Final round - leave everything in the ring',
        duration: 180,
        punchSequence: [1, 2, 3, 4, 5, 6],
        instructions: [
          'Give everything you have left',
          'Demonstrate true warrior spirit',
          'Maintain technique under extreme fatigue',
          'Final minute: championship effort',
          'Prove you have the heart of a champion'
        ]
      }
    ]
  },
  {
    id: '15',
    title: 'Beginner Friendly Starter',
    description: 'Perfect first boxing workout - gentle introduction to boxing fundamentals',
    level: 'Beginner',
    category: 'Freestyle',
    duration: 9, // 2 rounds × 3 minutes + 1 rest period
    rounds: 2,
    restPeriod: 90, // Extra long rest for true beginners
    calories: 120,
    equipment: [],
    imageUrl: 'https://images.pexels.com/photos/7991580/pexels-photo-7991580.jpeg',
    exercises: [
      {
        id: '15-1',
        name: 'Round 1: Basic Jab Practice',
        description: 'Learn the most fundamental punch in boxing',
        duration: 180,
        punchSequence: [1],
        instructions: [
          'Stand in comfortable boxing stance',
          'Throw slow, controlled jabs',
          'Focus on form over speed or power',
          'Return hand to guard after each jab',
          'Take breaks when needed - learn at your pace'
        ]
      },
      {
        id: '15-2',
        name: 'Round 2: Adding the Cross',
        description: 'Combine jab with straight right hand',
        duration: 180,
        punchSequence: [1, 2],
        instructions: [
          'Start with single jabs',
          'Add slow crosses when comfortable',
          'Practice 1-2 combinations slowly',
          'Focus on balance and stance',
          'Rest between combinations as needed'
        ]
      }
    ]
  },
  {
    id: '16',
    title: 'Advanced Technique Mastery',
    description: 'Elite-level technical combinations for advanced boxers',
    level: 'Advanced',
    category: 'Combos',
    duration: 21, // 6 rounds × 3 minutes + 5 rest periods
    rounds: 6,
    restPeriod: 45,
    calories: 400,
    equipment: [],
    imageUrl: 'https://images.pexels.com/photos/4761594/pexels-photo-4761594.jpeg',
    exercises: [
      {
        id: '16-1',
        name: 'Round 1: Feint & Attack Mastery',
        description: 'Master feinting to set up devastating attacks',
        duration: 180,
        punchSequence: [1, 2, 3],
        instructions: [
          'Use subtle feints to create openings',
          'Feint jab, then throw real 1-2-3',
          'Mix real and fake punches unpredictably',
          'Focus on selling the feints',
          'Complete 50-70 feint combinations'
        ]
      },
      {
        id: '16-2',
        name: 'Round 2: Timing & Distance Control',
        description: 'Master the art of timing and distance',
        duration: 180,
        punchSequence: [1, 6, 3],
        instructions: [
          'Control distance with jab',
          'Step in with explosive uppercut',
          'Finish with perfectly timed hook',
          'Focus on precise timing',
          'Complete 40-60 timed combinations'
        ]
      },
      {
        id: '16-3',
        name: 'Round 3: Advanced Angles',
        description: 'Create and exploit angles like a professional',
        duration: 180,
        punchSequence: [2, 3, 2],
        instructions: [
          'Use pivots to create new angles',
          'Attack from unexpected positions',
          'Flow between angle changes smoothly',
          'Demonstrate advanced footwork',
          'Complete 50-70 angle combinations'
        ]
      },
      {
        id: '16-4',
        name: 'Round 4: Ring IQ Demonstration',
        description: 'Show high boxing IQ through varied tactics',
        duration: 180,
        punchSequence: [1, 2, 5, 3, 2],
        instructions: [
          'Use intelligent combination choices',
          'Mix power and setup punches',
          'Show understanding of boxing tactics',
          'Demonstrate ring generalship',
          'Complete 40-60 tactical combinations'
        ]
      },
      {
        id: '16-5',
        name: 'Round 5: Pressure Fighting',
        description: 'Apply constant intelligent pressure',
        duration: 180,
        punchSequence: [1, 1, 2, 3, 4],
        instructions: [
          'Maintain constant forward pressure',
          'Use doubles and triples effectively',
          'Never stop moving forward',
          'Show relentless attacking spirit',
          'Complete 60-80 pressure combinations'
        ]
      },
      {
        id: '16-6',
        name: 'Round 6: Technical Mastery',
        description: 'Demonstrate complete technical mastery',
        duration: 180,
        punchSequence: [1, 2, 3, 4, 5, 6],
        instructions: [
          'Flow seamlessly between all techniques',
          'Show mastery of every punch type',
          'Demonstrate championship-level skill',
          'Perfect technique under fatigue',
          'Prove your technical excellence'
        ]
      }
    ]
  },
  {
    id: '17',
    title: 'Realistic Boxing Combinations',
    description: 'Master 3 realistic boxing combinations used by professionals - perfect for intermediate training',
    level: 'Intermediate',
    category: 'Combos',
    duration: 12, // 3 rounds × 3 minutes + 2 rest periods = 11 minutes total
    rounds: 3,
    restPeriod: 60, // Standard intermediate rest
    calories: 220,
    equipment: [],
    imageUrl: 'https://images.pexels.com/photos/4761594/pexels-photo-4761594.jpeg',
    featured: true,
    exercises: [
      {
        id: '17-1',
        name: 'Round 1: Uppercut-Body Hook Combination',
        description: 'Devastating close-range combination - uppercut opens guard, hook punishes body',
        duration: 180,
        punchSequence: [6, 3], // Right uppercut, left hook to body
        instructions: [
          'Drive explosive uppercut from legs and core',
          'As opponent guard lifts, immediately hook to exposed body',
          'Keep uppercut compact - don\'t telegraph the movement',
          'Hook should target liver area or ribs',
          'Reset guard quickly after combination',
          'Practice both left uppercut-right hook and right uppercut-left hook',
          'Focus on smooth transition between punches'
        ]
      },
      {
        id: '17-2',
        name: 'Round 2: Fast Jab-Step-Body Shot',
        description: 'Quick setup and movement combination for creating angles and opportunities',
        duration: 180,
        punchSequence: [1, 2], // Fast jab, step, body cross
        instructions: [
          'Throw lightning-fast jab to gauge distance and distract',
          'Immediately step forward and slightly to your left',
          'Drive hard cross to opponent\'s body while stepping',
          'Use the step to generate extra power in body shot',
          'Target solar plexus or ribs with the body shot',
          'Keep head movement active during the sequence',
          'Reset to proper stance after combination'
        ]
      },
      {
        id: '17-3',
        name: 'Round 3: Jab-Lean Back-Step In 1-2-1',
        description: 'Advanced defensive counter combination with head movement and distance control',
        duration: 180,
        punchSequence: [1, 1, 2, 1], // Jab, lean back, step in with 1-2-1
        instructions: [
          'Start with sharp jab to test opponent reaction',
          'Lean back from waist to avoid counter punch',
          'Immediately step forward as you come back up',
          'Fire rapid 1-2-1 combination while stepping in',
          'Use the lean back to load up power for follow-up',
          'Keep feet grounded during lean - don\'t lift heels',
          'Final jab should be thrown while still moving forward',
          'This combination requires timing and distance control'
        ]
      }
    ]
  },
  {
    id: '18',
    title: 'FightCamp 3-Punch Fundamentals',
    description: 'Master the essential 3-punch combinations every beginner needs - based on FightCamp training methods',
    level: 'Beginner',
    category: 'Combos',
    duration: 15, // 4 rounds × 3 minutes + 3 rest periods
    rounds: 4,
    restPeriod: 75, // Beginner rest period
    calories: 200,
    equipment: [],
    imageUrl: 'https://images.pexels.com/photos/7991579/pexels-photo-7991579.jpeg',
    featured: true,
    exercises: [
      {
        id: '17-1',
        name: 'Round 1: The Classic 1-2-3',
        description: 'Master the most fundamental 3-punch combination - jab, cross, lead hook',
        duration: 180,
        punchSequence: [1, 2, 3],
        instructions: [
          'Start with weight shifted toward back foot',
          'Jab: Step forward with leading foot as you extend',
          'Cross: Rear leg catches up and pivots into shot',
          'Hook: Pivot on front foot, execute hook in place',
          'Cover distance with first two shots to be in range for hook',
          'Try cross to body, hook to head variation',
          'Always finish in proper boxing stance'
        ]
      },
      {
        id: '17-2',
        name: 'Round 2: Double Jab Setup (1-1-2)',
        description: 'Use double jabs to set up devastating crosses',
        duration: 180,
        punchSequence: [1, 1, 2],
        instructions: [
          'First jab: Step forward, back foot catches up',
          'Second jab: Shoot quickly before hand returns to guard',
          'Step forward and slightly to side for angle',
          'Cross: More power due to upper body rotation freedom',
          'Try overhand variation - arc over guard to top of head',
          'Practice 1-1-6 and 1-1-4 variations',
          'Use double jab to gauge distance and force reactions'
        ]
      },
      {
        id: '17-3',
        name: 'Round 3: Pull Counter (1-2-Pull-2)',
        description: 'Learn to negate counters with pull-back timing',
        duration: 180,
        punchSequence: [1, 2, 2],
        instructions: [
          'Execute standard 1-2 combination',
          'After cross, weight shifts to front foot',
          'Pull back: Push off front foot, step back',
          'Return back hand to guard during pull',
          'Final cross: Throw with small step or no step',
          'Use torque from extended back hand for power',
          'Try 1-2-pull-6 variation with rear uppercut'
        ]
      },
      {
        id: '17-4',
        name: 'Round 4: Slip Counter (1-2-Slip-6)',
        description: 'Advanced combination with defensive slip and uppercut finish',
        duration: 180,
        punchSequence: [1, 2, 6],
        instructions: [
          'Execute 1-2 stepping forward normally',
          'Slip: Step diagonally forward and out with back foot',
          'Twist upper body with slip to load up',
          'Rear uppercut: Throw without step, feet planted',
          'Get very close to opponent for uppercut range',
          'Bring back foot back to reset stance',
          'Perfect for getting under opponent guard'
        ]
      }
    ]
  },
  // ✅ PREMIUM BEGINNER SERIES - 10 Fundamental Workouts
  {
    id: '200',
    title: 'Jab Basics Mastery',
    description: 'Master the most fundamental punch in boxing with proper technique and movement',
    level: 'Beginner',
    category: 'Combos',
    duration: 11, // 3 rounds × 3 minutes + 2 rest periods
    rounds: 3,
    restPeriod: 75, // Beginner rest period
    calories: 140,
    equipment: [],
    imageUrl: 'https://images.pexels.com/photos/7991579/pexels-photo-7991579.jpeg',
    premium: true,
    exercises: [
      {
        id: '200-1',
        name: 'Round 1: Pure Jab Practice',
        description: 'Focus solely on perfecting your jab technique',
        duration: 180,
        punchSequence: [1],
        instructions: [
          'Throw clean, sharp jabs (1)',
          'Focus on proper form over speed',
          'Extend fully and snap back to guard',
          'Keep rear hand up for protection',
          'Breathe out with each jab',
          'Aim for 80-100 jabs this round'
        ]
      },
      {
        id: '200-2',
        name: 'Round 2: Double Jab Power',
        description: 'Practice double jab combinations for setup and control',
        duration: 180,
        punchSequence: [1, 1],
        instructions: [
          'Throw crisp double jabs (1-1)',
          'First jab gauges distance',
          'Second jab creates pressure',
          'Reset to guard between combinations',
          'Maintain steady rhythm',
          'Complete 50-70 double jab combinations'
        ]
      },
      {
        id: '200-3',
        name: 'Round 3: Jab with Head Movement',
        description: 'Combine jabs with defensive head movement',
        duration: 180,
        punchSequence: [1],
        instructions: [
          'Throw jab, then slip left',
          'Return to center after slip',
          'Focus on minimal head movement',
          'Keep balance throughout',
          'Jab with confidence, slip with control',
          'Practice timing between offense and defense'
        ]
      }
    ]
  },
  {
    id: '201',
    title: 'Cross Basics Foundation',
    description: 'Learn the power cross and fundamental 1-2 combination',
    level: 'Beginner',
    category: 'Combos',
    duration: 11,
    rounds: 3,
    restPeriod: 75,
    calories: 150,
    equipment: [],
    imageUrl: 'https://images.pexels.com/photos/8611978/pexels-photo-8611978.jpeg',
    premium: true,
    exercises: [
      {
        id: '201-1',
        name: 'Round 1: Cross Power Practice',
        description: 'Master the rear hand cross technique',
        duration: 180,
        punchSequence: [2],
        instructions: [
          'Practice powerful crosses (2)',
          'Rotate hips and shoulders fully',
          'Drive from rear foot',
          'Keep lead hand up for protection',
          'Focus on power generation',
          'Throw 60-80 clean crosses'
        ]
      },
      {
        id: '201-2',
        name: 'Round 2: Classic 1-2 Combination',
        description: 'Perfect the fundamental jab-cross combination',
        duration: 180,
        punchSequence: [1, 2],
        instructions: [
          'Sharp jab followed by power cross',
          'Jab sets up the cross',
          'Flow smoothly between punches',
          'Return to guard after each combo',
          'Maintain balance and form',
          'Complete 60-80 1-2 combinations'
        ]
      },
      {
        id: '201-3',
        name: 'Round 3: 1-2 with Slip Defense',
        description: 'Add defensive slip after combination',
        duration: 180,
        punchSequence: [1, 2],
        instructions: [
          'Throw 1-2, then slip right',
          'Slip away from imaginary counter',
          'Keep combinations sharp',
          'Focus on defensive timing',
          'Practice smooth transitions',
          'Combine offense with defense'
        ]
      }
    ]
  },
  {
    id: '202',
    title: 'Hooks Combination Training',
    description: 'Learn lead hooks and combination setups with defensive movement',
    level: 'Beginner',
    category: 'Combos',
    duration: 11,
    rounds: 3,
    restPeriod: 75,
    calories: 160,
    equipment: [],
    imageUrl: 'https://images.pexels.com/photos/9944640/pexels-photo-9944640.jpeg',
    premium: true,
    exercises: [
      {
        id: '202-1',
        name: 'Round 1: Lead Hook Mastery',
        description: 'Perfect your lead hook technique',
        duration: 180,
        punchSequence: [3],
        instructions: [
          'Practice lead hooks (3)',
          'Keep elbow at 90 degrees',
          'Rotate on lead foot',
          'Drive power from hips',
          'Keep hook compact and tight',
          'Throw 50-70 clean hooks'
        ]
      },
      {
        id: '202-2',
        name: 'Round 2: Jab-Hook Setup',
        description: 'Use jab to set up devastating hooks',
        duration: 180,
        punchSequence: [1, 3],
        instructions: [
          'Jab to create opening (1)',
          'Follow with lead hook (3)',
          'Jab sets distance and timing',
          'Hook exploits opened guard',
          'Maintain smooth flow',
          'Complete 50-70 jab-hook combinations'
        ]
      },
      {
        id: '202-3',
        name: 'Round 3: Cross-Hook with Slip',
        description: 'Advanced combination with defensive slip',
        duration: 180,
        punchSequence: [2, 3],
        instructions: [
          'Cross followed by lead hook (2-3)',
          'Add slip left after combination',
          'Focus on combination flow',
          'Practice defensive exit',
          'Keep punches sharp under movement',
          'Master timing and balance'
        ]
      }
    ]
  },
  {
    id: '203',
    title: 'Uppercuts Introduction',
    description: 'Learn both uppercuts and practice close-range combinations',
    level: 'Beginner',
    category: 'Combos',
    duration: 11,
    rounds: 3,
    restPeriod: 75,
    calories: 155,
    equipment: [],
    imageUrl: 'https://images.pexels.com/photos/7991627/pexels-photo-7991627.jpeg',
    premium: true,
    exercises: [
      {
        id: '203-1',
        name: 'Round 1: Left Uppercut Technique',
        description: 'Master the lead uppercut fundamentals',
        duration: 180,
        punchSequence: [5],
        instructions: [
          'Practice left uppercuts (5)',
          'Bend knees and drive up',
          'Keep punch compact',
          'Focus on upward trajectory',
          'Return to guard quickly',
          'Throw 40-60 uppercuts with power'
        ]
      },
      {
        id: '203-2',
        name: 'Round 2: Right Uppercut Power',
        description: 'Learn the devastating rear uppercut',
        duration: 180,
        punchSequence: [6],
        instructions: [
          'Practice right uppercuts (6)',
          'Generate power from rear side',
          'Rotate hips upward',
          'Keep elbow tight',
          'Focus on explosive movement',
          'Complete 40-60 rear uppercuts'
        ]
      },
      {
        id: '203-3',
        name: 'Round 3: Uppercut Combination',
        description: 'Combine both uppercuts fluidly',
        duration: 180,
        punchSequence: [5, 6],
        instructions: [
          'Left then right uppercut (5-6)',
          'Flow smoothly between sides',
          'Maintain close-range positioning',
          'Keep combinations tight',
          'Practice rhythm and timing',
          'Master the uppercut combo'
        ]
      }
    ]
  },
  {
    id: '204',
    title: 'Jab-Cross-Hook Mastery',
    description: 'Perfect the classic three-punch combination with defensive movement',
    level: 'Beginner',
    category: 'Combos',
    duration: 11,
    rounds: 3,
    restPeriod: 75,
    calories: 170,
    equipment: [],
    imageUrl: 'https://images.pexels.com/photos/7991625/pexels-photo-7991625.jpeg',
    premium: true,
    exercises: [
      {
        id: '204-1',
        name: 'Round 1: 1-2 Foundation',
        description: 'Perfect the jab-cross before adding the hook',
        duration: 180,
        punchSequence: [1, 2],
        instructions: [
          'Focus on clean 1-2 combinations',
          'Build solid foundation',
          'Ensure proper form on both punches',
          'Maintain steady rhythm',
          'Prepare for hook addition',
          'Complete 70-90 1-2 combinations'
        ]
      },
      {
        id: '204-2',
        name: 'Round 2: Classic 1-2-3',
        description: 'Add the lead hook to complete the classic combo',
        duration: 180,
        punchSequence: [1, 2, 3],
        instructions: [
          'Jab-Cross-Lead Hook (1-2-3)',
          'Flow smoothly through all three',
          'Maintain power on each punch',
          'Keep balance throughout',
          'Practice the classic combination',
          'Complete 50-70 full sequences'
        ]
      },
      {
        id: '204-3',
        name: 'Round 3: 1-2-3 with Slip Defense',
        description: 'Add defensive slip after the combination',
        duration: 180,
        punchSequence: [1, 2, 3],
        instructions: [
          'Execute 1-2-3, then slip right',
          'Combine offense with defense',
          'Keep combination sharp',
          'Practice defensive exit',
          'Focus on smooth transitions',
          'Master complete sequence'
        ]
      }
    ]
  },
  {
    id: '205',
    title: 'Body Shots Fundamentals',
    description: 'Learn to attack the body and mix levels effectively',
    level: 'Beginner',
    category: 'Combos',
    duration: 11,
    rounds: 3,
    restPeriod: 75,
    calories: 165,
    equipment: [],
    imageUrl: 'https://images.pexels.com/photos/7991629/pexels-photo-7991629.jpeg',
    premium: true,
    exercises: [
      {
        id: '205-1',
        name: 'Round 1: Jab to Body',
        description: 'Learn to target the body with jabs',
        duration: 180,
        punchSequence: [1],
        instructions: [
          'Throw jabs targeting the body',
          'Bend knees to reach body level',
          'Keep head up and guard ready',
          'Focus on liver and solar plexus areas',
          'Return to normal stance quickly',
          'Practice level changing technique'
        ]
      },
      {
        id: '205-2',
        name: 'Round 2: Body-Head Combination',
        description: 'Mix body jabs with head crosses',
        duration: 180,
        punchSequence: [1, 2],
        instructions: [
          'Jab to body, cross to head',
          'Change levels smoothly',
          'Use legs to move between levels',
          'Keep combinations flowing',
          'Practice level mixing',
          'Complete 60-80 body-head combos'
        ]
      },
      {
        id: '205-3',
        name: 'Round 3: Body Attack with Pivot',
        description: 'Add footwork to body shot combinations',
        duration: 180,
        punchSequence: [1, 2],
        instructions: [
          'Body jab, head cross, then pivot',
          'Use pivot to create new angle',
          'Combine punching with movement',
          'Practice tactical positioning',
          'Focus on punch-and-move strategy',
          'Master complete sequence'
        ]
      }
    ]
  },
  {
    id: '206',
    title: 'Defensive Footwork Training',
    description: 'Master defensive movement and counter-punching basics',
    level: 'Beginner',
    category: 'Defense',
    duration: 11,
    rounds: 3,
    restPeriod: 75,
    calories: 145,
    equipment: [],
    imageUrl: 'https://images.pexels.com/photos/4761671/pexels-photo-4761671.jpeg',
    premium: true,
    exercises: [
      {
        id: '206-1',
        name: 'Round 1: Slip Movement Practice',
        description: 'Master basic slip defense while moving',
        duration: 180,
        instructions: [
          'Practice slip left and slip right',
          'Add movement around the ring',
          'Keep slips small and controlled',
          'Maintain boxing stance while moving',
          'Focus on head movement timing',
          'Stay light on your feet'
        ]
      },
      {
        id: '206-2',
        name: 'Round 2: Slip and Counter Jab',
        description: 'Add counter jabs after defensive slips',
        duration: 180,
        punchSequence: [1],
        instructions: [
          'Slip imaginary punch',
          'Counter immediately with jab',
          'Practice slip-counter timing',
          'Keep counters sharp and fast',
          'Focus on defensive reactions',
          'Master basic counter-punching'
        ]
      },
      {
        id: '206-3',
        name: 'Round 3: Slip-Counter Combinations',
        description: 'Advanced slip with 1-2 counter combinations',
        duration: 180,
        punchSequence: [1, 2],
        instructions: [
          'Slip then counter with 1-2',
          'Practice defensive combo sequences',
          'Keep movements smooth and controlled',
          'Focus on immediate counter-attacks',
          'Master complete defensive system',
          'Combine defense with offense'
        ]
      }
    ]
  },
  {
    id: '207',
    title: 'Circle and Jab Strategy',
    description: 'Learn tactical movement while maintaining offensive pressure',
    level: 'Beginner',
    category: 'Footwork',
    duration: 11,
    rounds: 3,
    restPeriod: 75,
    calories: 155,
    equipment: [],
    imageUrl: 'https://images.pexels.com/photos/7991580/pexels-photo-7991580.jpeg',
    premium: true,
    exercises: [
      {
        id: '207-1',
        name: 'Round 1: Circle Left with Jabs',
        description: 'Constant lateral movement while jabbing',
        duration: 180,
        punchSequence: [1],
        instructions: [
          'Circle to your left continuously',
          'Throw jabs while moving',
          'Maintain proper stance while circling',
          'Keep movement smooth and controlled',
          'Never stop moving laterally',
          'Practice mobile jabbing technique'
        ]
      },
      {
        id: '207-2',
        name: 'Round 2: Circle Right with 1-2',
        description: 'Reverse direction with combination work',
        duration: 180,
        punchSequence: [1, 2],
        instructions: [
          'Circle to your right',
          'Throw 1-2 combinations while moving',
          'Practice changing directions',
          'Keep combinations sharp on the move',
          'Focus on mobile combination work',
          'Master directional changes'
        ]
      },
      {
        id: '207-3',
        name: 'Round 3: Advanced Circle Strategy',
        description: 'Complex movement with combination and pivot exits',
        duration: 180,
        punchSequence: [1, 2, 3],
        instructions: [
          'Circle, throw 1-2-3, then pivot out',
          'Practice complete tactical sequence',
          'Combine movement with combinations',
          'Add pivot escapes after attacking',
          'Master advanced ring movement',
          'Show tactical boxing intelligence'
        ]
      }
    ]
  },
  {
    id: '208',
    title: 'Rhythm and Tempo Control',
    description: 'Master timing variations and tempo changes in combinations',
    level: 'Beginner',
    category: 'Combos',
    duration: 11,
    rounds: 3,
    restPeriod: 75,
    calories: 150,
    equipment: [],
    imageUrl: 'https://images.pexels.com/photos/17892107/pexels-photo-17892107.jpeg',
    premium: true,
    exercises: [
      {
        id: '208-1',
        name: 'Round 1: Jab Tempo Variations',
        description: 'Practice jabs at different speeds and rhythms',
        duration: 180,
        punchSequence: [1],
        instructions: [
          'Throw slow, controlled jabs',
          'Switch to fast, snappy jabs',
          'Vary the tempo throughout round',
          'Practice timing disruption',
          'Focus on rhythm control',
          'Master tempo variations'
        ]
      },
      {
        id: '208-2',
        name: 'Round 2: 1-2 Rhythm Changes',
        description: 'Apply tempo control to combination work',
        duration: 180,
        punchSequence: [1, 2],
        instructions: [
          'Slow 1-2 combinations',
          'Fast explosive 1-2 combinations',
          'Mix speeds within the round',
          'Practice rhythm disruption',
          'Keep form consistent at all speeds',
          'Master combination tempo control'
        ]
      },
      {
        id: '208-3',
        name: 'Round 3: 1-2-3 Tempo Mastery',
        description: 'Advanced tempo control with three-punch combinations',
        duration: 180,
        punchSequence: [1, 2, 3],
        instructions: [
          'Practice 1-2-3 at different tempos',
          'Slow technical combinations',
          'Fast explosive combinations',
          'Random tempo changes',
          'Master advanced rhythm control',
          'Show tempo mastery'
        ]
      }
    ]
  },
  {
    id: '209',
    title: 'Beginner Defense Drill',
    description: 'Essential defensive techniques with proper covering and blocking',
    level: 'Beginner',
    category: 'Defense',
    duration: 11,
    rounds: 3,
    restPeriod: 75,
    calories: 140,
    equipment: [],
    imageUrl: 'https://images.pexels.com/photos/4761594/pexels-photo-4761594.jpeg',
    premium: true,
    exercises: [
      {
        id: '209-1',
        name: 'Round 1: Jab and Cover',
        description: 'Learn to protect yourself after attacking',
        duration: 180,
        punchSequence: [1],
        instructions: [
          'Throw jab, then cover up',
          'Practice tight defensive shell',
          'Keep elbows close to body',
          'Protect head and body after punching',
          'Focus on defensive instincts',
          'Master punch-and-cover sequence'
        ]
      },
      {
        id: '209-2',
        name: 'Round 2: Cross and Block',
        description: 'Add defensive blocks after power punches',
        duration: 180,
        punchSequence: [2],
        instructions: [
          'Throw cross, then block/cover',
          'Practice defensive reactions',
          'Keep hands up after punching',
          'Focus on protection fundamentals',
          'Build defensive muscle memory',
          'Master cross-and-cover technique'
        ]
      },
      {
        id: '209-3',
        name: 'Round 3: Complete Defense System',
        description: 'Combine attacking, slipping, and covering',
        duration: 180,
        punchSequence: [1, 2],
        instructions: [
          'Throw 1-2, then slip and cover',
          'Practice complete defensive system',
          'Combine multiple defensive techniques',
          'Focus on defensive combinations',
          'Master advanced defensive flow',
          'Show complete defensive mastery'
        ]
      }
    ]
  },

  // ✅ PREMIUM WORKOUTS SECTION - Champion-level training
  {
    id: '101',
    title: 'The Champion\'s Warmup',
    description: 'Perfect warm-up for champions - footwork foundation and light combos',
    level: 'Beginner',
    category: 'Footwork',
    duration: 10, // 2 rounds × 3 minutes + 1 rest = 10 minutes
    rounds: 2,
    restPeriod: 60,
    calories: 120,
    equipment: [],
    imageUrl: 'https://images.pexels.com/photos/7991579/pexels-photo-7991579.jpeg',
    premium: true,
    exercises: [
      {
        id: '101-1',
        name: 'Round 1: Footwork Foundation',
        description: 'Master boxing movement fundamentals',
        duration: 180,
        instructions: [
          'Practice forward and backward steps',
          'Add lateral movement maintaining stance',
          'Never cross feet while moving',
          'Stay light on balls of feet',
          'Combine movement with light jabs'
        ]
      },
      {
        id: '101-2',
        name: 'Round 2: Light Combo Flow',
        description: 'Add light shadowboxing with head movement',
        duration: 180,
        punchSequence: [1, 2],
        instructions: [
          'Light 1-2 combinations with movement',
          'Add head movement between combos',
          'Keep punches at 50% power for warm-up',
          'Focus on form and rhythm',
          'End with controlled shadowboxing'
        ]
      }
    ]
  },
  {
    id: '102',
    title: 'Fast Hands Drill',
    description: 'Speed and endurance training - non-stop action with active recovery',
    level: 'Intermediate',
    category: 'HIIT',
    duration: 12, // 3 rounds × 60s + 2 rest = 9 minutes + setup
    rounds: 3,
    restPeriod: 60,
    calories: 180,
    equipment: [],
    imageUrl: 'https://images.pexels.com/photos/7991622/pexels-photo-7991622.jpeg',
    premium: true,
    exercises: [
      {
        id: '102-1',
        name: 'Round 1: Non-Stop Jab-Cross',
        description: '60 seconds of continuous 1-2 combinations',
        duration: 60,
        punchSequence: [1, 2],
        instructions: [
          'Throw jab-cross non-stop for 60 seconds',
          'Focus on speed over power',
          'Keep breathing controlled and rhythmic',
          'Maintain proper form throughout',
          'Push through fatigue in final 15 seconds'
        ]
      },
      {
        id: '102-2',
        name: 'Round 2: Speed Endurance',
        description: 'Increased pace with active recovery cues',
        duration: 60,
        punchSequence: [1, 2],
        instructions: [
          'Faster pace than round 1',
          'Add light jumping jacks between combinations',
          'Stay light on your feet',
          'Breathe out forcefully with each punch',
          'Finish strong - championship mindset'
        ]
      },
      {
        id: '102-3',
        name: 'Round 3: Maximum Output',
        description: 'All-out speed for final round',
        duration: 60,
        punchSequence: [1, 2],
        instructions: [
          'Maximum speed and output',
          'Ignore fatigue - push through',
          'Keep combinations sharp and clean',
          'Final 20 seconds - everything you have',
          'Prove your hand speed and conditioning'
        ]
      }
    ]
  },
  {
    id: '103',
    title: 'Power Puncher',
    description: 'Heavy combinations with explosive power bursts and defensive recovery',
    level: 'Intermediate',
    category: 'Combos',
    duration: 15, // 3 rounds × 3 minutes + 2 rest = 11 minutes
    rounds: 3,
    restPeriod: 60,
    calories: 220,
    equipment: ['Heavy Bag'],
    imageUrl: 'https://images.pexels.com/photos/7991623/pexels-photo-7991623.jpeg',
    premium: true,
    exercises: [
      {
        id: '103-1',
        name: 'Round 1: Power Foundation',
        description: 'Build knockout power with 1-2-3 combinations',
        duration: 180,
        punchSequence: [1, 2, 3],
        instructions: [
          'Focus on power over speed',
          'Drive through every punch with full body weight',
          '10-second all-out power bursts every 30 seconds',
          'Active rest with rolls and slips between bursts',
          'Use heavy bag to develop knockout power'
        ]
      },
      {
        id: '103-2',
        name: 'Round 2: Complex Power Combos',
        description: 'Advanced power combinations with 2-3-2 sequence',
        duration: 180,
        punchSequence: [2, 3, 2],
        instructions: [
          'Cross-hook-cross power sequence',
          'Generate maximum force from hips',
          '10-second explosive bursts every 45 seconds',
          'Slip and roll during active recovery',
          'Focus on devastating power shots'
        ]
      },
      {
        id: '103-3',
        name: 'Round 3: Finishing Power',
        description: 'All-out power with defensive movements',
        duration: 180,
        punchSequence: [1, 2, 3, 2],
        instructions: [
          'Mix power shots with defensive slips',
          'Use full 1-2-3-2 finishing sequence',
          'Multiple 10-second power bursts',
          'Roll under imaginary hooks',
          'Finish like a champion - maximum power'
        ]
      }
    ]
  },
  {
    id: '104',
    title: 'Defense Masterclass',
    description: 'Master slips, rolls, blocks and counter-attacks like a pro',
    level: 'Intermediate',
    category: 'Defense',
    duration: 15, // 3 rounds × 3 minutes + 2 rest
    rounds: 3,
    restPeriod: 60,
    calories: 200,
    equipment: [],
    imageUrl: 'https://images.pexels.com/photos/4761671/pexels-photo-4761671.jpeg',
    premium: true,
    exercises: [
      {
        id: '104-1',
        name: 'Round 1: Slip & Counter Mastery',
        description: 'Perfect slipping technique with immediate counters',
        duration: 180,
        punchSequence: [1, 2],
        instructions: [
          'Drill slips left and right between jab-cross',
          'Counter immediately after each slip',
          'Keep head movement tight and controlled',
          'Practice slip-right, counter with 1-2',
          'Slip-left, counter with hooks and uppercuts'
        ]
      },
      {
        id: '104-2',
        name: 'Round 2: Roll & Hook Counter',
        description: 'Rolling under hooks with devastating counters',
        duration: 180,
        punchSequence: [3, 4, 5],
        instructions: [
          'Roll under imaginary hooks with tight movement',
          'Counter with short hooks and uppercuts',
          'Keep knees bent during rolls',
          'Flow from roll directly into counter punches',
          'Practice both left and right roll directions'
        ]
      },
      {
        id: '104-3',
        name: 'Round 3: Complete Defense System',
        description: 'Combine all defensive techniques fluidly',
        duration: 180,
        punchSequence: [1, 2, 3, 4, 5, 6],
        instructions: [
          'Mix slips, rolls, and blocks randomly',
          'Counter with varied punch combinations',
          'Flow seamlessly between all techniques',
          'Add footwork to defensive movements',
          'Demonstrate complete defensive mastery'
        ]
      }
    ]
  },
  {
    id: '105',
    title: 'Explosive HIIT Boxing',
    description: 'High-intensity calorie torcher with sprint finishes',
    level: 'Advanced',
    category: 'HIIT',
    duration: 18, // 3 rounds × 4 minutes + 2 rest = 14 minutes
    rounds: 3,
    restPeriod: 90, // Longer rest due to intensity
    calories: 350,
    equipment: ['Jump Rope'],
    imageUrl: 'https://images.pexels.com/photos/4761594/pexels-photo-4761594.jpeg',
    premium: true,
    exercises: [
      {
        id: '105-1',
        name: 'Round 1: Max Intensity Combos',
        description: '1-minute max intensity with 30-second recovery',
        duration: 240, // 4 minutes
        punchSequence: [1, 2, 3, 2, 3, 2],
        instructions: [
          '60 seconds maximum intensity 1-2-3-2-3-2 combos',
          '30 seconds jump rope recovery',
          'Repeat cycle 3 times per round',
          'Push maximum heart rate in work periods',
          'Active recovery - never fully stop moving'
        ]
      },
      {
        id: '105-2',
        name: 'Round 2: Calorie Burn Blast',
        description: 'Extended high-intensity with movement',
        duration: 240,
        punchSequence: [1, 2, 3, 4, 5],
        instructions: [
          'Non-stop combination work for 90 seconds',
          '30 seconds jump rope active recovery',
          'Add lateral movement during combos',
          'Maintain championship-level intensity',
          'Focus on maximum calorie burn'
        ]
      },
      {
        id: '105-3',
        name: 'Round 3: Sprint Finish',
        description: 'Final sprint with 20-punch burst finish',
        duration: 240,
        punchSequence: [1, 2, 3, 4, 5, 6],
        instructions: [
          'Mix all punches in varied combinations',
          'Build intensity throughout the round',
          'Final 30 seconds: 20 punches in 10 seconds',
          'Sprint finish - maximum output',
          'Leave everything in this final round'
        ]
      }
    ]
  },
  {
    id: '106',
    title: 'Inside Fighter\'s Drill',
    description: 'Close-range specialist training with body shots and uppercuts',
    level: 'Advanced',
    category: 'Combos',
    duration: 15, // 3 rounds × 3 minutes + 2 rest
    rounds: 3,
    restPeriod: 45, // Advanced rest period
    calories: 240,
    equipment: ['Heavy Bag'],
    imageUrl: 'https://images.pexels.com/photos/7991627/pexels-photo-7991627.jpeg',
    premium: true,
    exercises: [
      {
        id: '106-1',
        name: 'Round 1: Close-Range Foundation',
        description: 'Master short hooks and body shots',
        duration: 180,
        punchSequence: [3, 6, 3],
        instructions: [
          'Practice short hooks and body shots (3-6-3)',
          'Stay in close-range pocket',
          'Duck and counter after every combo',
          'Keep elbows tight for inside fighting',
          'Add push-ups between combinations for strength'
        ]
      },
      {
        id: '106-2',
        name: 'Round 2: Uppercut Specialist',
        description: 'Devastating uppercut combinations',
        duration: 180,
        punchSequence: [5, 6, 3, 4],
        instructions: [
          'Focus on explosive uppercut combinations',
          'Left uppercut, right uppercut, hooks',
          'Duck under imaginary punches',
          'Counter with uppercuts from ducked position',
          'Add planks between rounds for core strength'
        ]
      },
      {
        id: '106-3',
        name: 'Round 3: Inside War',
        description: 'All-out close-range warfare',
        duration: 180,
        punchSequence: [3, 6, 3, 5, 4],
        instructions: [
          'Combine all close-range techniques',
          'Constant pressure and movement',
          'Duck, counter, and clinch work',
          'Maintain close-range distance',
          'Fight like an inside specialist'
        ]
      }
    ]
  },
  {
    id: '107',
    title: 'Championship Round Simulation',
    description: 'Full-intensity professional fight simulation with unscripted rounds',
    level: 'Advanced',
    category: 'Freestyle',
    duration: 18, // 3 rounds × 3 minutes + 2 rest = 11 minutes
    rounds: 3,
    restPeriod: 60,
    calories: 320,
    equipment: [],
    imageUrl: 'https://images.pexels.com/photos/4761671/pexels-photo-4761671.jpeg',
    premium: true,
    exercises: [
      {
        id: '107-1',
        name: 'Round 1: Championship Opening',
        description: 'Unscripted 3-minute round like a real fight',
        duration: 180,
        punchSequence: [1, 2, 3, 4],
        instructions: [
          'Fight unscripted for full 3 minutes',
          'Mix jab-cross-hooks freely',
          'Add constant active movement',
          'Maintain championship pace throughout',
          'Simulate real fight conditions and pressure'
        ]
      },
      {
        id: '107-2',
        name: 'Round 2: Championship Pressure',
        description: 'Increase intensity and pressure like round 2',
        duration: 180,
        punchSequence: [1, 2, 3, 4, 5, 6],
        instructions: [
          'Increase pace and power from round 1',
          'Use all punches in varied combinations',
          'Add defensive movements constantly',
          'Simulate being pushed by opponent',
          'Maintain championship conditioning'
        ]
      },
      {
        id: '107-3',
        name: 'Round 3: Championship Heart',
        description: 'Final round with championship heart and determination',
        duration: 180,
        punchSequence: [1, 2, 3, 4, 5, 6],
        instructions: [
          'Show championship heart and will',
          'Fight through fatigue like a champion',
          'Maintain power and technique under pressure',
          'Final minute: championship determination',
          'Prove you belong at championship level'
        ]
      }
    ]
  },
  {
    id: '108',
    title: 'High-Volume Combo Workout',
    description: 'Elite conditioning with 200+ punches per round and burn-out finishes',
    level: 'Advanced',
    category: 'Combos',
    duration: 20, // 4 rounds × 3 minutes + 3 rest = 15 minutes
    rounds: 4,
    restPeriod: 45,
    calories: 380,
    equipment: [],
    imageUrl: 'https://images.pexels.com/photos/7991628/pexels-photo-7991628.jpeg',
    premium: true,
    exercises: [
      {
        id: '108-1',
        name: 'Round 1: Volume Foundation',
        description: 'Long combination repetition for volume',
        duration: 180,
        punchSequence: [1, 2, 3, 2, 5, 6, 3],
        instructions: [
          'Repeat long combo: 1-2-3-2-5-6-3',
          'Stay light on feet throughout',
          'Target 200+ punches this round',
          '20-second burn-out in final 20 seconds',
          'Focus on volume over power'
        ]
      },
      {
        id: '108-2',
        name: 'Round 2: Endurance Test',
        description: 'Maintain volume under increasing fatigue',
        duration: 180,
        punchSequence: [1, 2, 3, 4, 5, 6],
        instructions: [
          'Mix all punches in extended combinations',
          'Maintain 200+ punch target',
          'Push through building fatigue',
          'Explosive 20-second finish',
          'Test your boxing endurance limits'
        ]
      },
      {
        id: '108-3',
        name: 'Round 3: Volume Specialist',
        description: 'Prove your high-volume capabilities',
        duration: 180,
        punchSequence: [1, 1, 2, 3, 2, 3, 2],
        instructions: [
          'Double jab setups with combination finishes',
          'Exceed 200 punches per round',
          'Show advanced conditioning',
          '20-second all-out burn at end',
          'Demonstrate elite volume capabilities'
        ]
      },
      {
        id: '108-4',
        name: 'Round 4: Championship Volume',
        description: 'Elite-level volume with championship finish',
        duration: 180,
        punchSequence: [1, 2, 3, 4, 5, 6],
        instructions: [
          'Championship-level combination volume',
          'Use all techniques fluidly',
          'Maintain proper form despite fatigue',
          'Final 30 seconds: maximum volume output',
          'Finish like a true volume specialist'
        ]
      }
    ]
  },
  {
    id: '109',
    title: 'Fight Conditioning Circuit',
    description: 'Total-body fight preparation with combos, footwork, and strength exercises',
    level: 'Advanced',
    category: 'HIIT',
    duration: 24, // 4 rounds × 4 minutes + 3 rest = 19 minutes
    rounds: 4,
    restPeriod: 60,
    calories: 420,
    equipment: [],
    imageUrl: 'https://images.pexels.com/photos/7991629/pexels-photo-7991629.jpeg',
    premium: true,
    exercises: [
      {
        id: '109-1',
        name: 'Round 1: Fight Simulation',
        description: '3-minute boxing with footwork and sprawls',
        duration: 240, // 4 minutes
        punchSequence: [1, 2, 3, 4],
        instructions: [
          '3 minutes boxing combinations with footwork',
          'Add sprawls every 30 seconds',
          'Constant movement like real fight',
          'Between rounds: burpees and mountain climbers',
          'Build fight-ready stamina and conditioning'
        ]
      },
      {
        id: '109-2',
        name: 'Round 2: Combat Conditioning',
        description: 'Mixed boxing and bodyweight exercises',
        duration: 240,
        punchSequence: [1, 2, 3, 4, 5],
        instructions: [
          'Alternate 45 seconds boxing, 15 seconds burpees',
          'Add mountain climbers between combinations',
          'Maintain fight pace throughout',
          'Total-body conditioning focus',
          'Prepare body for fight demands'
        ]
      },
      {
        id: '109-3',
        name: 'Round 3: Elite Conditioning',
        description: 'Advanced circuit training for fighters',
        duration: 240,
        punchSequence: [1, 2, 3, 4, 5, 6],
        instructions: [
          'Complex boxing-bodyweight circuits',
          '30-second boxing, 10-second sprawls',
          'Add push-ups between combinations',
          'Elite-level conditioning demands',
          'Push conditioning to championship level'
        ]
      },
      {
        id: '109-4',
        name: 'Round 4: Fight-Ready Finish',
        description: 'Final test of fight conditioning',
        duration: 240,
        punchSequence: [1, 2, 3, 4, 5, 6],
        instructions: [
          'Prove your fight-ready conditioning',
          'Mix all boxing and strength elements',
          'Maintain intensity despite fatigue',
          'Final minute: everything you have',
          'Finish with championship conditioning'
        ]
      }
    ]
  },
  {
    id: '110',
    title: 'Advanced Defense & Counterattack',
    description: 'Elite-level defensive reactions with sprint conditioning and elite reflexes',
    level: 'Advanced',
    category: 'Defense',
    duration: 24, // 4 rounds × 4 minutes + 3 rest = 19 minutes
    rounds: 4,
    restPeriod: 45, // Pro-level rest
    calories: 380,
    equipment: [],
    imageUrl: 'https://images.pexels.com/photos/4761594/pexels-photo-4761594.jpeg',
    premium: true,
    exercises: [
      {
        id: '110-1',
        name: 'Round 1: Elite Reaction Training',
        description: 'Slip and counter different combinations every 10 seconds',
        duration: 240,
        punchSequence: [1, 2, 3, 4],
        instructions: [
          'Change slip and counter pattern every 10 seconds',
          'Sprint in place between defense patterns',
          'React to imaginary combinations instantly',
          'Maintain elite-level reaction speed',
          'Build defensive reflexes under pressure'
        ]
      },
      {
        id: '110-2',
        name: 'Round 2: Pressure Defense',
        description: 'Defensive mastery under simulated pressure',
        duration: 240,
        punchSequence: [1, 2, 3, 4, 5],
        instructions: [
          'Defense while sprinting in place',
          'Simulate pressure from aggressive opponent',
          'Counter-attack while under pressure',
          'Never stop moving during defensive work',
          'Push stamina and reflexes simultaneously'
        ]
      },
      {
        id: '110-3',
        name: 'Round 3: Advanced Counters',
        description: 'Complex counter-attacks under fatigue',
        duration: 240,
        punchSequence: [1, 2, 3, 4, 5, 6],
        instructions: [
          'Advanced counter combinations',
          'Maintain speed despite building fatigue',
          'Sprint intervals between counter sequences',
          'Show elite defensive capabilities',
          'Demonstrate championship-level reflexes'
        ]
      },
      {
        id: '110-4',
        name: 'Round 4: Elite Level Mastery',
        description: 'Championship-level defensive and conditioning finish',
        duration: 240,
        punchSequence: [1, 2, 3, 4, 5, 6],
        instructions: [
          'Demonstrate complete defensive mastery',
          'Maintain elite speed under extreme fatigue',
          'Push stamina and reflexes to limits',
          'Final minute: championship-level output',
          'Prove you belong at elite level'
        ]
      }
    ]
  }
];

// Utility functions for coaching instructions
export const getCoachingInstruction = (id: string): CoachingInstruction | undefined => {
  return COACHING_INSTRUCTIONS.find(instruction => instruction.id === id);
};

export const getRandomCoachingSequence = (duration: number, difficulty: 'beginner' | 'intermediate' | 'advanced'): string[] => {
  const sequence: string[] = [];
  let totalTime = 0;
  
  // Define instruction pools based on difficulty
  const comboInstructions = COACHING_INSTRUCTIONS.filter(i => i.type === 'combo');
  const supportInstructions = COACHING_INSTRUCTIONS.filter(i => i.type !== 'combo');
  
  const difficultySettings = {
    beginner: { comboRatio: 0.6, maxComboComplexity: 2 },
    intermediate: { comboRatio: 0.7, maxComboComplexity: 3 },
    advanced: { comboRatio: 0.8, maxComboComplexity: 4 }
  };
  
  const settings = difficultySettings[difficulty];
  
  while (totalTime < duration) {
    const useCombo = Math.random() < settings.comboRatio;
    
    if (useCombo) {
      // Add a combo instruction
      const availableCombos = comboInstructions.filter(c => 
        !c.punchSequence || c.punchSequence.length <= settings.maxComboComplexity
      );
      const combo = availableCombos[Math.floor(Math.random() * availableCombos.length)];
      sequence.push(combo.id);
      totalTime += combo.duration;
    } else {
      // Add a support instruction (movement, breathing, etc.)
      const support = supportInstructions[Math.floor(Math.random() * supportInstructions.length)];
      sequence.push(support.id);
      totalTime += support.duration;
    }
  }
  
  return sequence;
};

// Utility functions for Quick-Start program
export const getQuickStartProgram = () => QUICK_START_PROGRAM;

export const getTotalDuration = () => {
  return QUICK_START_PROGRAM.reduce((total, section) => total + section.duration, 0);
};

export const getTotalInstructions = () => {
  return QUICK_START_PROGRAM.reduce((total, section) => total + section.instructions.length, 0);
};

// Existing workout utility functions
export const getWorkoutsByCategory = (category: string) => {
  return workouts.filter(workout => workout.category === category);
};

export const getWorkoutsByLevel = (level: string) => {
  return workouts.filter(workout => workout.level === level);
};

export const getFeaturedWorkouts = () => {
  return workouts.filter(workout => workout.featured);
};

export const getPopularWorkouts = () => {
  return workouts.filter(workout => workout.popular);
};

export const getPremiumWorkouts = () => {
  return workouts.filter(workout => workout.premium);
};

// ✅ NEW: Data-Driven Timed Workouts
export const TIMED_WORKOUTS: TimedWorkout[] = [
  {
    id: "jab-cross-focus",
    title: "Jab-Cross Focus Training",
    description: "Master the fundamental 1-2 combination with proper 3-minute boxing rounds",
    level: "Beginner",
    category: "Combos",
    totalRounds: 3,
    restBetweenRounds: 75,
    estimatedCalories: 180,
    equipment: ["None"],
    imageUrl: "https://images.pexels.com/photos/17892107/pexels-photo-17892107.jpeg",
    featured: true,
    exercises: [
      {
        id: "jab-cross-round-1",
        round: 1,
        duration: 180, // 3-minute boxing round
        name: "Jab-Cross Fundamentals",
        prompts: [
          { time: 0, instruction: "Here we go! Hands up!", type: "stance", audioUrl: "https://boyegcsxgufnheudjjyj.supabase.co/storage/v1/object/public/coach//herewego.mp3" },
          { time: 5, instruction: "1", type: "combo", audioUrl: "https://boyegcsxgufnheudjjyj.supabase.co/storage/v1/object/public/coach//one-jab.mp3" },
          { time: 8, instruction: "2", type: "combo", audioUrl: "https://boyegcsxgufnheudjjyj.supabase.co/storage/v1/object/public/coach//two-cross.mp3" },
          { time: 12, instruction: "Good! 1-2", type: "combo", audioUrl: "https://boyegcsxgufnheudjjyj.supabase.co/storage/v1/object/public/coach//good-one-two.mp3" },
          { time: 16, instruction: "Keep that guard up!", type: "stance", audioUrl: "https://boyegcsxgufnheudjjyj.supabase.co/storage/v1/object/public/coach//keep-that-guard-up.mp3" },
          { time: 18, instruction: "1", type: "combo", audioUrl: "https://boyegcsxgufnheudjjyj.supabase.co/storage/v1/object/public/coach//one-jab.mp3" },
          { time: 22, instruction: "1-2", type: "combo", audioUrl: "https://boyegcsxgufnheudjjyj.supabase.co/storage/v1/object/public/coach//one-two.mp3" },
          { time: 25, instruction: "Duck low!", type: "defense", audioUrl: "https://boyegcsxgufnheudjjyj.supabase.co/storage/v1/object/public/coach//ducklow.mp3" },
          { time: 28, instruction: "1-2", type: "combo",  audioUrl: "https://boyegcsxgufnheudjjyj.supabase.co/storage/v1/object/public/coach//one-two.mp3" },
          { time: 32, instruction: "You got this!", type: "stance", audioUrl: "https://boyegcsxgufnheudjjyj.supabase.co/storage/v1/object/public/coach//You%20got%20this%20!.mp3" },
          { time: 35, instruction: "Slip", type: "defense" , audioUrl: "https://boyegcsxgufnheudjjyj.supabase.co/storage/v1/object/public/coach//slipp.mp3" },
          { time: 38, instruction: "1", type: "combo" , audioUrl: "https://boyegcsxgufnheudjjyj.supabase.co/storage/v1/object/public/coach//1-jab.mp3" },
          { time: 41, instruction: "2", type: "combo" , audioUrl: "https://boyegcsxgufnheudjjyj.supabase.co/storage/v1/object/public/coach//two-cross.mp3" },
          { time: 45, instruction: "Nice rhythm! 1-2", type: "combo" , audioUrl: "https://boyegcsxgufnheudjjyj.supabase.co/storage/v1/object/public/coach//Nice%20rhythm%20!!!%20%20One%20!%20two%20!.mp3" },
          { time: 50, instruction: "Breathe out with punches!", type: "breathing", audioUrl: "https://boyegcsxgufnheudjjyj.supabase.co/storage/v1/object/public/coach//Breathe%20out%20with%20punches!.mp3" },
          { time: 53, instruction: "Move those feet", type: "movement", audioUrl: "https://boyegcsxgufnheudjjyj.supabase.co/storage/v1/object/public/coach//Move%20those%20feet.mp3" },
          { time: 56, instruction: "1-2", type: "combo",  audioUrl: "https://boyegcsxgufnheudjjyj.supabase.co/storage/v1/object/public/coach//one-two.mp3" },
          { time: 60, instruction: "One minute in! Looking good!", type: "stance" },
          { time: 64, instruction: "1", type: "combo" ,audioUrl: "https://boyegcsxgufnheudjjyj.supabase.co/storage/v1/object/public/coach//herewego.mp3" },
          { time: 67, instruction: "1-2", type: "combo", audioUrl: "https://boyegcsxgufnheudjjyj.supabase.co/storage/v1/object/public/coach//one-two.mp3" },
          { time: 71, instruction: "Duck", type: "defense", audioUrl: "https://boyegcsxgufnheudjjyj.supabase.co/storage/v1/object/public/coach//Duck.mp3" },
          { time: 74, instruction: "1-2", type: "combo" , audioUrl: "https://boyegcsxgufnheudjjyj.supabase.co/storage/v1/object/public/coach//one-two.mp3" },
          { time: 78, instruction: "Keep going! Don't stop!", type: "stance", audioUrl: "https://boyegcsxgufnheudjjyj.supabase.co/storage/v1/object/public/coach//Keep%20going!%20Don't%20stop!.mp3" },
          { time: 81, instruction: "Slip", type: "defense", audioUrl: "https://boyegcsxgufnheudjjyj.supabase.co/storage/v1/object/public/coach//slipp.mp3" },
          { time: 84, instruction: "1", type: "combo", audioUrl: "https://boyegcsxgufnheudjjyj.supabase.co/storage/v1/object/public/coach//one-jab.mp3" },
          { time: 87, instruction: "Hard 2!", type: "combo", audioUrl: "https://boyegcsxgufnheudjjyj.supabase.co/storage/v1/object/public/coach//hard-two.mp3" },
          { time: 91, instruction: "1-2", type: "combo", audioUrl: "https://boyegcsxgufnheudjjyj.supabase.co/storage/v1/object/public/coach//one-two.mp3" },
          { time: 95, instruction: "Stay light on your feet", type: "movement", audioUrl: "https://boyegcsxgufnheudjjyj.supabase.co/storage/v1/object/public/coach//Stay%20light%20on%20your%20feet.mp3" },
          { time: 98, instruction: "2", type: "combo", audioUrl: "https://boyegcsxgufnheudjjyj.supabase.co/storage/v1/object/public/coach//two-cross.mp3" },
          { time: 101, instruction: "1-2", type: "combo", audioUrl: "https://boyegcsxgufnheudjjyj.supabase.co/storage/v1/object/public/coach//one-two.mp3" },
          { time: 105, instruction: "Chin down, eyes up!", type: "stance", audioUrl: "https://boyegcsxgufnheudjjyj.supabase.co/storage/v1/object/public/coach//Chin%20down,%20eyes%20up!.mp3" },
          { time: 108, instruction: "1", type: "combo", audioUrl: "https://boyegcsxgufnheudjjyj.supabase.co/storage/v1/object/public/coach//one-jab.mp3" },
          { time: 111, instruction: "1-2", type: "combo", audioUrl: "https://boyegcsxgufnheudjjyj.supabase.co/storage/v1/object/public/coach//one-two.mp3" },
          { time: 115, instruction: "Duck", type: "defense", audioUrl: "https://boyegcsxgufnheudjjyj.supabase.co/storage/v1/object/public/coach//Duck.mp3" },
          { time: 118, instruction: "1-2", type: "combo", audioUrl: "https://boyegcsxgufnheudjjyj.supabase.co/storage/v1/object/public/coach//one-two.mp3" },
          { time: 122, instruction: "Push through the burn!", type: "stance", audioUrl: "https://boyegcsxgufnheudjjyj.supabase.co/storage/v1/object/public/coach//Push%20through%20the%20burn!.mp3" },
          { time: 125, instruction: "Slip", type: "defense", audioUrl: "https://boyegcsxgufnheudjjyj.supabase.co/storage/v1/object/public/coach//slipp.mp3" },
          { time: 128, instruction: "1", type: "combo", audioUrl: "https://boyegcsxgufnheudjjyj.supabase.co/storage/v1/object/public/coach//one-jab.mp3" },
          { time: 131, instruction: "1-2", type: "combo", audioUrl: "https://boyegcsxgufnheudjjyj.supabase.co/storage/v1/object/public/coach//one-two.mp3" },
          { time: 135, instruction: "Two minutes! Halfway!", type: "stance", audioUrl: "https://boyegcsxgufnheudjjyj.supabase.co/storage/v1/object/public/coach//Two%20minutes!%20Halfway!.mp3" },
          { time: 138, instruction: "2", type: "combo", audioUrl: "https://boyegcsxgufnheudjjyj.supabase.co/storage/v1/object/public/coach//two-cross.mp3" },
          { time: 141, instruction: "1-2", type: "combo", audioUrl: "https://boyegcsxgufnheudjjyj.supabase.co/storage/v1/object/public/coach//one-two.mp3" },
          { time: 145, instruction: "Keep that energy up!", type: "stance", audioUrl: "https://boyegcsxgufnheudjjyj.supabase.co/storage/v1/object/public/coach//Keep%20that%20energy%20up!.mp3" },
          { time: 148, instruction: "Move", type: "movement", audioUrl: "https://boyegcsxgufnheudjjyj.supabase.co/storage/v1/object/public/coach//Move.mp3" },
          { time: 151, instruction: "1-2", type: "combo", audioUrl: "https://boyegcsxgufnheudjjyj.supabase.co/storage/v1/object/public/coach//one-two.mp3" },
          { time: 155, instruction: "1", type: "combo", audioUrl: "https://boyegcsxgufnheudjjyj.supabase.co/storage/v1/object/public/coach//one-jab.mp3" },
          { time: 158, instruction: "Final 20 seconds!", type: "stance", audioUrl: "https://boyegcsxgufnheudjjyj.supabase.co/storage/v1/object/public/coach//Final%2020%20seconds!.mp3" },
          { time: 161, instruction: "1-2", type: "combo", audioUrl: "https://boyegcsxgufnheudjjyj.supabase.co/storage/v1/object/public/coach//one-two.mp3" },
          { time: 165, instruction: "Duck", type: "defense", audioUrl: "https://boyegcsxgufnheudjjyj.supabase.co/storage/v1/object/public/coach//Duck.mp3" },
          { time: 168, instruction: "1-2", type: "combo", audioUrl: "https://boyegcsxgufnheudjjyj.supabase.co/storage/v1/object/public/coach//one-two.mp3" },
          { time: 172, instruction: "Strong finish! 1-2", type: "combo", audioUrl: "https://boyegcsxgufnheudjjyj.supabase.co/storage/v1/object/public/coach//Strong%20finish!%201-2.mp3" },
          { time: 176, instruction: "Perfect! Great round!", type: "stance", audioUrl: "https://boyegcsxgufnheudjjyj.supabase.co/storage/v1/object/public/coach//ElevenLabs_2025-06-26T13_05_28_Sports%20Guy%20-%20Excited%20and%20fast,%20giving%20you%20that%20play%20by%20play._pvc_sp108_s99_sb89_f2-5.mp3" }
        ]
      },
      {
        id: "jab-cross-round-2",
        round: 2,
        duration: 180, // 3-minute boxing round
        name: "Speed & Accuracy",
        prompts: [
          { time: 0, instruction: "Round 2! Let's go!", type: "stance" },
          { time: 3, instruction: "Pick up the pace! Fast 1-2", type: "combo" },
          { time: 7, instruction: "Sharp 1!", type: "combo" },
          { time: 10, instruction: "1-2", type: "combo" },
          { time: 14, instruction: "Duck low!", type: "defense" },
          { time: 17, instruction: "Beautiful! 1-2", type: "combo" },
          { time: 21, instruction: "Stay balanced!", type: "stance" },
          { time: 24, instruction: "Slip it!", type: "defense" },
          { time: 27, instruction: "1", type: "combo" },
          { time: 30, instruction: "Power 2!", type: "combo" },
          { time: 34, instruction: "1-2", type: "combo" },
          { time: 38, instruction: "Keep breathing!", type: "breathing" },
          { time: 41, instruction: "Move those feet", type: "movement" },
          { time: 44, instruction: "1-2", type: "combo" },
          { time: 48, instruction: "Double it up! 1-2", type: "combo" },
          { time: 53, instruction: "You're a warrior!", type: "stance" },
          { time: 56, instruction: "Duck", type: "defense" },
          { time: 59, instruction: "1-2", type: "combo" },
          { time: 63, instruction: "Hands up high!", type: "stance" },
          { time: 66, instruction: "Slip", type: "defense" },
          { time: 69, instruction: "1", type: "combo" },
          { time: 72, instruction: "1-2", type: "combo" },
          { time: 76, instruction: "Good form!", type: "stance" },
          { time: 79, instruction: "2", type: "combo" },
          { time: 82, instruction: "1-2", type: "combo" },
          { time: 86, instruction: "Circle out", type: "movement" },
          { time: 89, instruction: "1-2", type: "combo" },
          { time: 93, instruction: "Halfway! You got this!", type: "stance" },
          { time: 96, instruction: "1", type: "combo" },
          { time: 99, instruction: "1-2", type: "combo" },
          { time: 103, instruction: "Duck it!", type: "defense" },
          { time: 106, instruction: "1-2", type: "combo" },
          { time: 110, instruction: "Focus! Focus!", type: "stance" },
          { time: 113, instruction: "Slip", type: "defense" },
          { time: 116, instruction: "1", type: "combo" },
          { time: 119, instruction: "1-2", type: "combo" },
          { time: 123, instruction: "Breathe with your punches!", type: "breathing" },
          { time: 126, instruction: "2", type: "combo" },
          { time: 129, instruction: "1-2", type: "combo" },
          { time: 133, instruction: "Stay on your toes!", type: "movement" },
          { time: 136, instruction: "1-2", type: "combo" },
          { time: 140, instruction: "1", type: "combo" },
          { time: 143, instruction: "Eyes on target!", type: "stance" },
          { time: 146, instruction: "1-2", type: "combo" },
          { time: 150, instruction: "Duck", type: "defense" },
          { time: 153, instruction: "1-2", type: "combo" },
          { time: 157, instruction: "Final stretch!", type: "stance" },
          { time: 160, instruction: "Slip", type: "defense" },
          { time: 163, instruction: "1-2", type: "combo" },
          { time: 167, instruction: "Champion mentality!", type: "stance" },
          { time: 170, instruction: "1", type: "combo" },
          { time: 173, instruction: "1-2", type: "combo" },
          { time: 177, instruction: "Boom! Round complete!", type: "stance" }
        ]
      },
      {
        id: "jab-cross-round-3",
        round: 3,
        duration: 180, // 3-minute boxing round  
        name: "Power & Precision",
        prompts: [
          { time: 0, instruction: "Final round", type: "stance" },
          { time: 4, instruction: "Power 1-2", type: "combo" },
          { time: 8, instruction: "1", type: "combo" },
          { time: 12, instruction: "Hard 2", type: "combo" },
          { time: 16, instruction: "1-2", type: "combo" },
          { time: 21, instruction: "Duck", type: "defense" },
          { time: 24, instruction: "1-2", type: "combo" },
          { time: 29, instruction: "Slip", type: "defense" },
          { time: 32, instruction: "1", type: "combo" },
          { time: 36, instruction: "Power 2", type: "combo" },
          { time: 40, instruction: "1-2", type: "combo" },
          { time: 45, instruction: "Move", type: "movement" },
          { time: 48, instruction: "1-2", type: "combo" },
          { time: 53, instruction: "1", type: "combo" },
          { time: 57, instruction: "1-2", type: "combo" },
          { time: 62, instruction: "Duck", type: "defense" },
          { time: 65, instruction: "1-2", type: "combo" },
          { time: 70, instruction: "Slip", type: "defense" },
          { time: 73, instruction: "Power 1-2", type: "combo" },
          { time: 78, instruction: "1", type: "combo" },
          { time: 82, instruction: "2", type: "combo" },
          { time: 86, instruction: "1-2", type: "combo" },
          { time: 91, instruction: "Move", type: "movement" },
          { time: 94, instruction: "1-2", type: "combo" },
          { time: 99, instruction: "1", type: "combo" },
          { time: 103, instruction: "1-2", type: "combo" },
          { time: 108, instruction: "Duck", type: "defense" },
          { time: 111, instruction: "1-2", type: "combo" },
          { time: 116, instruction: "Slip", type: "defense" },
          { time: 119, instruction: "1-2", type: "combo" },
          { time: 124, instruction: "Final minute", type: "stance" },
          { time: 128, instruction: "1-2", type: "combo" },
          { time: 133, instruction: "1", type: "combo" },
          { time: 137, instruction: "Hard 2", type: "combo" },
          { time: 141, instruction: "1-2", type: "combo" },
          { time: 146, instruction: "Duck", type: "defense" },
          { time: 149, instruction: "1-2", type: "combo" },
          { time: 154, instruction: "Slip", type: "defense" },
          { time: 157, instruction: "Power 1-2", type: "combo" },
          { time: 162, instruction: "Championship", type: "stance" },
          { time: 166, instruction: "1-2", type: "combo" },
          { time: 171, instruction: "Final push", type: "combo" },
          { time: 175, instruction: "1-2", type: "combo" },
          { time: 179, instruction: "DONE!", type: "combo" }
        ]
      }
    ]
  },
  {
    id: "jab-jab-cross-focus",
    title: "Jab-Jab-Cross Training",
    description: "Master the 1-1-2 setup combo with proper 3-minute boxing rounds",
    level: "Beginner",
    category: "Combos",
    totalRounds: 3,
    restBetweenRounds: 75,
    estimatedCalories: 190,
    equipment: ["None"],
    imageUrl: "https://images.pexels.com/photos/8611978/pexels-photo-8611978.jpeg",
    featured: true,
    exercises: [
      {
        id: "jab-jab-cross-round-1",
        round: 1,
        duration: 180,
        name: "Setup & Control",
        prompts: [
          { time: 0, instruction: "Let's set up! Hands ready!", type: "stance" },
          { time: 4, instruction: "Perfect setup! 1-1-2", type: "combo" },
          { time: 9, instruction: "Chin tucked nice and tight!", type: "stance" },
          { time: 12, instruction: "1-1-2", type: "combo" },
          { time: 17, instruction: "Breathe through it!", type: "breathing" },
          { time: 20, instruction: "Quick 1!", type: "combo" },
          { time: 23, instruction: "Another 1!", type: "combo" },
          { time: 26, instruction: "Power 2!", type: "combo" },
          { time: 30, instruction: "That's the spirit! Keep going!", type: "stance" },
          { time: 33, instruction: "1-1-2", type: "combo" },
          { time: 38, instruction: "Duck under!", type: "defense" },
          { time: 41, instruction: "Great setup! 1-1-2", type: "combo" },
          { time: 46, instruction: "Guard stays high!", type: "stance" },
          { time: 49, instruction: "First jab!", type: "combo" },
          { time: 52, instruction: "Setup jab!", type: "combo" },
          { time: 55, instruction: "Cross!", type: "combo" },
          { time: 59, instruction: "Slip and move!", type: "defense" },
          { time: 62, instruction: "Beautiful! 1-1-2", type: "combo" },
          { time: 67, instruction: "Control your breathing!", type: "breathing" },
          { time: 70, instruction: "Light on those feet!", type: "movement" },
          { time: 73, instruction: "1-1-2", type: "combo" },
          { time: 78, instruction: "Chin down, stay protected!", type: "stance" },
          { time: 81, instruction: "Setup jab!", type: "combo" },
          { time: 84, instruction: "Setup jab!", type: "combo" },
          { time: 87, instruction: "Hard cross!", type: "combo" },
          { time: 91, instruction: "You've got great rhythm!", type: "stance" },
          { time: 94, instruction: "1-1-2", type: "combo" },
          { time: 99, instruction: "Duck low!", type: "defense" },
          { time: 102, instruction: "Perfect! 1-1-2", type: "combo" },
          { time: 107, instruction: "Stay loose and relaxed!", type: "breathing" },
          { time: 110, instruction: "Sharp 1!", type: "combo" },
          { time: 113, instruction: "Sharp 1!", type: "combo" },
          { time: 116, instruction: "Hard 2!", type: "combo" },
          { time: 120, instruction: "Halfway there! Looking strong!", type: "stance" },
          { time: 123, instruction: "1-1-2", type: "combo" },
          { time: 128, instruction: "Slip that punch!", type: "defense" },
          { time: 131, instruction: "Excellent! 1-1-2", type: "combo" },
          { time: 136, instruction: "Don't stop now! Keep going!", type: "stance" },
          { time: 139, instruction: "Setup 1!", type: "combo" },
          { time: 142, instruction: "Setup 1!", type: "combo" },
          { time: 145, instruction: "Power 2!", type: "combo" },
          { time: 149, instruction: "Breathe out with each punch!", type: "breathing" },
          { time: 152, instruction: "1-1-2", type: "combo" },
          { time: 157, instruction: "Keep moving!", type: "movement" },
          { time: 160, instruction: "1-1-2", type: "combo" },
          { time: 165, instruction: "Final push! You got this!", type: "stance" },
          { time: 168, instruction: "1!", type: "combo" },
          { time: 171, instruction: "1!", type: "combo" },
          { time: 174, instruction: "2!", type: "combo" },
          { time: 178, instruction: "Amazing work! Round done!", type: "stance" }
        ]
      },
      {
        id: "jab-jab-cross-round-2",
        round: 2,
        duration: 180,
        name: "Speed Building",
        prompts: [
          { time: 0, instruction: "Round 2", type: "stance" },
          { time: 3, instruction: "Fast 1-1-2", type: "combo" },
          { time: 7, instruction: "Chin down", type: "stance" },
          { time: 10, instruction: "1-1-2", type: "combo" },
          { time: 14, instruction: "Duck", type: "defense" },
          { time: 17, instruction: "Double up", type: "combo" },
          { time: 21, instruction: "1-1-2", type: "combo" },
          { time: 25, instruction: "Breathe", type: "breathing" },
          { time: 28, instruction: "1", type: "combo" },
          { time: 31, instruction: "1", type: "combo" },
          { time: 34, instruction: "Hard 2", type: "combo" },
          { time: 38, instruction: "Keep it up", type: "stance" },
          { time: 41, instruction: "1-1-2", type: "combo" },
          { time: 45, instruction: "Slip", type: "defense" },
          { time: 48, instruction: "1-1-2", type: "combo" },
          { time: 52, instruction: "Stay sharp", type: "stance" },
          { time: 55, instruction: "1", type: "combo" },
          { time: 58, instruction: "1", type: "combo" },
          { time: 61, instruction: "2", type: "combo" },
          { time: 65, instruction: "Good setup", type: "stance" },
          { time: 68, instruction: "1-1-2", type: "combo" },
          { time: 72, instruction: "Move", type: "movement" },
          { time: 75, instruction: "1-1-2", type: "combo" },
          { time: 79, instruction: "Breathe out", type: "breathing" },
          { time: 82, instruction: "1", type: "combo" },
          { time: 85, instruction: "1", type: "combo" },
          { time: 88, instruction: "2", type: "combo" },
          { time: 92, instruction: "Nice rhythm", type: "stance" },
          { time: 95, instruction: "1-1-2", type: "combo" },
          { time: 99, instruction: "Duck", type: "defense" },
          { time: 102, instruction: "1-1-2", type: "combo" },
          { time: 106, instruction: "Stay focused", type: "stance" },
          { time: 109, instruction: "1", type: "combo" },
          { time: 112, instruction: "1", type: "combo" },
          { time: 115, instruction: "2", type: "combo" },
          { time: 119, instruction: "Keep pushing", type: "stance" },
          { time: 122, instruction: "1-1-2", type: "combo" },
          { time: 126, instruction: "Slip", type: "defense" },
          { time: 129, instruction: "1-1-2", type: "combo" },
          { time: 133, instruction: "Breathe", type: "breathing" },
          { time: 136, instruction: "1", type: "combo" },
          { time: 139, instruction: "1", type: "combo" },
          { time: 142, instruction: "2", type: "combo" },
          { time: 146, instruction: "Final 30", type: "stance" },
          { time: 150, instruction: "1-1-2", type: "combo" },
          { time: 154, instruction: "Move", type: "movement" },
          { time: 157, instruction: "1-1-2", type: "combo" },
          { time: 161, instruction: "Last push", type: "stance" },
          { time: 165, instruction: "1", type: "combo" },
          { time: 168, instruction: "1", type: "combo" },
          { time: 171, instruction: "2", type: "combo" },
          { time: 175, instruction: "Finish strong", type: "combo" }
        ]
      },
      {
        id: "jab-jab-cross-round-3",
        round: 3,
        duration: 180,
        name: "Power Finish",
        prompts: [
          { time: 0, instruction: "Final round", type: "stance" },
          { time: 4, instruction: "Power 1-1-2", type: "combo" },
          { time: 8, instruction: "Chin tucked", type: "stance" },
          { time: 11, instruction: "1-1-2", type: "combo" },
          { time: 15, instruction: "Duck", type: "defense" },
          { time: 18, instruction: "Hard finish", type: "combo" },
          { time: 22, instruction: "1-1-2", type: "combo" },
          { time: 26, instruction: "Breathe deep", type: "breathing" },
          { time: 29, instruction: "1", type: "combo" },
          { time: 32, instruction: "1", type: "combo" },
          { time: 35, instruction: "Power 2", type: "combo" },
          { time: 39, instruction: "Drive through", type: "stance" },
          { time: 42, instruction: "1-1-2", type: "combo" },
          { time: 46, instruction: "Slip", type: "defense" },
          { time: 49, instruction: "1-1-2", type: "combo" },
          { time: 53, instruction: "Stay strong", type: "stance" },
          { time: 56, instruction: "1", type: "combo" },
          { time: 59, instruction: "1", type: "combo" },
          { time: 62, instruction: "2", type: "combo" },
          { time: 66, instruction: "Championship", type: "stance" },
          { time: 69, instruction: "1-1-2", type: "combo" },
          { time: 73, instruction: "Move", type: "movement" },
          { time: 76, instruction: "1-1-2", type: "combo" },
          { time: 80, instruction: "Control breath", type: "breathing" },
          { time: 83, instruction: "1", type: "combo" },
          { time: 86, instruction: "1", type: "combo" },
          { time: 89, instruction: "2", type: "combo" },
          { time: 93, instruction: "Looking good", type: "stance" },
          { time: 96, instruction: "1-1-2", type: "combo" },
          { time: 100, instruction: "Duck", type: "defense" },
          { time: 103, instruction: "1-1-2", type: "combo" },
          { time: 107, instruction: "Keep focus", type: "stance" },
          { time: 110, instruction: "1", type: "combo" },
          { time: 113, instruction: "1", type: "combo" },
          { time: 116, instruction: "Hard 2", type: "combo" },
          { time: 120, instruction: "Final minute", type: "stance" },
          { time: 124, instruction: "1-1-2", type: "combo" },
          { time: 128, instruction: "Slip", type: "defense" },
          { time: 131, instruction: "1-1-2", type: "combo" },
          { time: 135, instruction: "Power through", type: "stance" },
          { time: 138, instruction: "1", type: "combo" },
          { time: 141, instruction: "1", type: "combo" },
          { time: 144, instruction: "2", type: "combo" },
          { time: 148, instruction: "Almost there", type: "stance" },
          { time: 152, instruction: "1-1-2", type: "combo" },
          { time: 156, instruction: "Move", type: "movement" },
          { time: 159, instruction: "1-1-2", type: "combo" },
          { time: 163, instruction: "Final 15", type: "stance" },
          { time: 167, instruction: "1", type: "combo" },
          { time: 170, instruction: "1", type: "combo" },
          { time: 173, instruction: "Power 2", type: "combo" },
          { time: 177, instruction: "FINISH!", type: "combo" }
        ]
      }
    ]
  },
  {
    id: "jab-cross-hook-focus",
    title: "Jab-Cross-Hook Training",
    description: "Master the classic 1-2-3 combination with proper 3-minute boxing rounds",
    level: "Intermediate", 
    category: "Combos",
    totalRounds: 3,
    restBetweenRounds: 52,
    estimatedCalories: 210,
    equipment: ["None"],
    imageUrl: "https://images.pexels.com/photos/9944640/pexels-photo-9944640.jpeg",
    featured: true,
    exercises: [
      {
        id: "jab-cross-hook-round-1",
        round: 1,
        duration: 180,
        name: "Building the Foundation",
        prompts: [
          { time: 0, instruction: "Ready", type: "stance" },
          { time: 4, instruction: "1-2-3", type: "combo" },
          { time: 8, instruction: "Guard up", type: "stance" },
          { time: 11, instruction: "1-2-3", type: "combo" },
          { time: 16, instruction: "Breathe", type: "breathing" },
          { time: 19, instruction: "1", type: "combo" },
          { time: 22, instruction: "2", type: "combo" },
          { time: 25, instruction: "3", type: "combo" },
          { time: 29, instruction: "Nice flow", type: "stance" },
          { time: 32, instruction: "1-2-3", type: "combo" },
          { time: 37, instruction: "Duck", type: "defense" },
          { time: 40, instruction: "1-2-3", type: "combo" },
          { time: 45, instruction: "Chin down", type: "stance" },
          { time: 48, instruction: "1", type: "combo" },
          { time: 51, instruction: "2", type: "combo" },
          { time: 54, instruction: "3", type: "combo" },
          { time: 58, instruction: "Slip", type: "defense" },
          { time: 61, instruction: "1-2-3", type: "combo" },
          { time: 66, instruction: "Stay loose", type: "breathing" },
          { time: 69, instruction: "Move", type: "movement" },
          { time: 72, instruction: "1-2-3", type: "combo" },
          { time: 77, instruction: "Keep going", type: "stance" },
          { time: 80, instruction: "1", type: "combo" },
          { time: 83, instruction: "2", type: "combo" },
          { time: 86, instruction: "3", type: "combo" },
          { time: 90, instruction: "Halfway", type: "stance" },
          { time: 93, instruction: "1-2-3", type: "combo" },
          { time: 98, instruction: "Duck", type: "defense" },
          { time: 101, instruction: "1-2-3", type: "combo" },
          { time: 106, instruction: "Breathe out", type: "breathing" },
          { time: 109, instruction: "1", type: "combo" },
          { time: 112, instruction: "2", type: "combo" },
          { time: 115, instruction: "Hook", type: "combo" },
          { time: 119, instruction: "Good rhythm", type: "stance" },
          { time: 122, instruction: "1-2-3", type: "combo" },
          { time: 127, instruction: "Slip", type: "defense" },
          { time: 130, instruction: "1-2-3", type: "combo" },
          { time: 135, instruction: "Move around", type: "movement" },
          { time: 138, instruction: "1", type: "combo" },
          { time: 141, instruction: "2", type: "combo" },
          { time: 144, instruction: "3", type: "combo" },
          { time: 148, instruction: "Strong finish", type: "stance" },
          { time: 151, instruction: "1-2-3", type: "combo" },
          { time: 156, instruction: "Duck", type: "defense" },
          { time: 159, instruction: "1-2-3", type: "combo" },
          { time: 164, instruction: "Final push", type: "stance" },
          { time: 167, instruction: "1", type: "combo" },
          { time: 170, instruction: "2", type: "combo" },
          { time: 173, instruction: "3", type: "combo" },
          { time: 177, instruction: "Round 1 done", type: "stance" }
        ]
      },
      {
        id: "jab-cross-hook-round-2", 
        round: 2,
        duration: 180,
        name: "Power & Speed",
        prompts: [
          { time: 0, instruction: "Round 2", type: "stance" },
          { time: 3, instruction: "Power 1-2-3", type: "combo" },
          { time: 7, instruction: "Chin down", type: "stance" },
          { time: 10, instruction: "1-2-3", type: "combo" },
          { time: 14, instruction: "Duck", type: "defense" },
          { time: 17, instruction: "Fast combo", type: "combo" },
          { time: 21, instruction: "1-2-3", type: "combo" },
          { time: 25, instruction: "Breathe", type: "breathing" },
          { time: 28, instruction: "1", type: "combo" },
          { time: 31, instruction: "Hard 2", type: "combo" },
          { time: 34, instruction: "Hook", type: "combo" },
          { time: 37, instruction: "Keep it up", type: "stance" },
          { time: 40, instruction: "1-2-3", type: "combo" },
          { time: 44, instruction: "Slip", type: "defense" },
          { time: 47, instruction: "1-2-3", type: "combo" },
          { time: 51, instruction: "Stay sharp", type: "stance" },
          { time: 54, instruction: "1", type: "combo" },
          { time: 57, instruction: "2", type: "combo" },
          { time: 60, instruction: "3", type: "combo" },
          { time: 64, instruction: "Nice flow", type: "stance" },
          { time: 67, instruction: "1-2-3", type: "combo" },
          { time: 71, instruction: "Move", type: "movement" },
          { time: 74, instruction: "1-2-3", type: "combo" },
          { time: 78, instruction: "Control breath", type: "breathing" },
          { time: 81, instruction: "1", type: "combo" },
          { time: 84, instruction: "2", type: "combo" },
          { time: 87, instruction: "Hook", type: "combo" },
          { time: 91, instruction: "Strong combo", type: "stance" },
          { time: 94, instruction: "1-2-3", type: "combo" },
          { time: 98, instruction: "Duck", type: "defense" },
          { time: 101, instruction: "1-2-3", type: "combo" },
          { time: 105, instruction: "Keep pushing", type: "stance" },
          { time: 108, instruction: "1", type: "combo" },
          { time: 111, instruction: "2", type: "combo" },
          { time: 114, instruction: "3", type: "combo" },
          { time: 118, instruction: "Good power", type: "stance" },
          { time: 121, instruction: "1-2-3", type: "combo" },
          { time: 125, instruction: "Slip", type: "defense" },
          { time: 128, instruction: "1-2-3", type: "combo" },
          { time: 132, instruction: "Stay focused", type: "stance" },
          { time: 135, instruction: "1", type: "combo" },
          { time: 138, instruction: "2", type: "combo" },
          { time: 141, instruction: "Hook", type: "combo" },
          { time: 145, instruction: "Final 30", type: "stance" },
          { time: 149, instruction: "1-2-3", type: "combo" },
          { time: 153, instruction: "Move", type: "movement" },
          { time: 156, instruction: "1-2-3", type: "combo" },
          { time: 160, instruction: "Push harder", type: "stance" },
          { time: 164, instruction: "1", type: "combo" },
          { time: 167, instruction: "2", type: "combo" },
          { time: 170, instruction: "3", type: "combo" },
          { time: 174, instruction: "Almost done", type: "stance" },
          { time: 177, instruction: "Strong finish", type: "combo" }
        ]
      },
      {
        id: "jab-cross-hook-round-3",
        round: 3, 
        duration: 180,
        name: "Championship Finish",
        prompts: [
          { time: 0, instruction: "Final round", type: "stance" },
          { time: 4, instruction: "Championship", type: "combo" },
          { time: 7, instruction: "1-2-3", type: "combo" },
          { time: 11, instruction: "Guard strong", type: "stance" },
          { time: 14, instruction: "1-2-3", type: "combo" },
          { time: 18, instruction: "Duck", type: "defense" },
          { time: 21, instruction: "Power combo", type: "combo" },
          { time: 25, instruction: "1-2-3", type: "combo" },
          { time: 29, instruction: "Deep breath", type: "breathing" },
          { time: 32, instruction: "1", type: "combo" },
          { time: 35, instruction: "Power 2", type: "combo" },
          { time: 38, instruction: "Hook", type: "combo" },
          { time: 42, instruction: "Drive through", type: "stance" },
          { time: 45, instruction: "1-2-3", type: "combo" },
          { time: 49, instruction: "Slip", type: "defense" },
          { time: 52, instruction: "1-2-3", type: "combo" },
          { time: 56, instruction: "Stay strong", type: "stance" },
          { time: 59, instruction: "1", type: "combo" },
          { time: 62, instruction: "2", type: "combo" },
          { time: 65, instruction: "Hook", type: "combo" },
          { time: 69, instruction: "Warrior mode", type: "stance" },
          { time: 72, instruction: "1-2-3", type: "combo" },
          { time: 76, instruction: "Move", type: "movement" },
          { time: 79, instruction: "1-2-3", type: "combo" },
          { time: 83, instruction: "Control", type: "breathing" },
          { time: 86, instruction: "1", type: "combo" },
          { time: 89, instruction: "2", type: "combo" },
          { time: 92, instruction: "Hook", type: "combo" },
          { time: 96, instruction: "Looking good", type: "stance" },
          { time: 99, instruction: "1-2-3", type: "combo" },
          { time: 103, instruction: "Duck", type: "defense" },
          { time: 106, instruction: "1-2-3", type: "combo" },
          { time: 110, instruction: "Keep focus", type: "stance" },
          { time: 113, instruction: "1", type: "combo" },
          { time: 116, instruction: "Hard 2", type: "combo" },
          { time: 119, instruction: "Hook", type: "combo" },
          { time: 123, instruction: "Final minute", type: "stance" },
          { time: 127, instruction: "1-2-3", type: "combo" },
          { time: 131, instruction: "Slip", type: "defense" },
          { time: 134, instruction: "1-2-3", type: "combo" },
          { time: 138, instruction: "Power finish", type: "stance" },
          { time: 141, instruction: "1", type: "combo" },
          { time: 144, instruction: "2", type: "combo" },
          { time: 147, instruction: "Hook", type: "combo" },
          { time: 151, instruction: "Champion", type: "stance" },
          { time: 155, instruction: "1-2-3", type: "combo" },
          { time: 159, instruction: "Move", type: "movement" },
          { time: 162, instruction: "1-2-3", type: "combo" },
          { time: 166, instruction: "Final 10", type: "stance" },
          { time: 170, instruction: "1", type: "combo" },
          { time: 173, instruction: "2", type: "combo" },
          { time: 176, instruction: "Hook", type: "combo" },
          { time: 179, instruction: "CHAMPION!", type: "combo" }
        ]
      }
    ]
  },
  {
    id: "beginner-fundamentals-timed",
    title: "Beginner Boxing Fundamentals",
    description: "Coach-guided workout with timed instructions",
    level: "Beginner",
    category: "Combos",
    totalRounds: 3,
    restBetweenRounds: 75,
    estimatedCalories: 150,
    equipment: ["None"],
    imageUrl: "https://images.pexels.com/photos/7289993/pexels-photo-7289993.jpeg",
    featured: true,
    exercises: [
      {
        id: "round-1",
        round: 1,
        duration: 180, // 3 minutes
        name: "Fundamentals Round 1",
        prompts: [
          { time: 0, instruction: "Ready", type: "stance" },
          { time: 5, instruction: "1", type: "combo" },
          { time: 8, instruction: "1", type: "combo" },
          { time: 11, instruction: "2", type: "combo" },
          { time: 14, instruction: "1-2", type: "combo" },
          { time: 18, instruction: "Duck", type: "defense" },
          { time: 21, instruction: "1-2", type: "combo" },
          { time: 26, instruction: "3", type: "combo" },
          { time: 30, instruction: "Slip", type: "defense" },
          { time: 33, instruction: "2", type: "combo" },
          { time: 37, instruction: "1-2-3", type: "combo" },
          { time: 42, instruction: "Duck", type: "defense" },
          { time: 45, instruction: "1", type: "combo" },
          { time: 48, instruction: "4", type: "combo" },
          { time: 52, instruction: "1-2", type: "combo" },
          { time: 57, instruction: "Move", type: "movement" },
          { time: 60, instruction: "1-2 body", type: "combo" },
          { time: 65, instruction: "3-4", type: "combo" },
          { time: 70, instruction: "Slip", type: "defense" },
          { time: 73, instruction: "1-2", type: "combo" },
          { time: 78, instruction: "Duck", type: "defense" },
          { time: 81, instruction: "3", type: "combo" },
          { time: 85, instruction: "1-4", type: "combo" },
          { time: 90, instruction: "2-3", type: "combo" },
          { time: 95, instruction: "Duck", type: "defense" },
          { time: 98, instruction: "1-2", type: "combo" },
          { time: 103, instruction: "Move", type: "movement" },
          { time: 106, instruction: "3-4", type: "combo" },
          { time: 111, instruction: "1", type: "combo" },
          { time: 114, instruction: "Slip", type: "defense" },
          { time: 117, instruction: "2", type: "combo" },
          { time: 121, instruction: "1-2-3", type: "combo" },
          { time: 127, instruction: "Duck", type: "defense" },
          { time: 130, instruction: "4-3", type: "combo" },
          { time: 135, instruction: "1-2", type: "combo" },
          { time: 140, instruction: "Move", type: "movement" },
          { time: 143, instruction: "1", type: "combo" },
          { time: 146, instruction: "Duck", type: "defense" },
          { time: 149, instruction: "2-3", type: "combo" },
          { time: 154, instruction: "1-4", type: "combo" },
          { time: 159, instruction: "Slip", type: "defense" },
          { time: 162, instruction: "1-2", type: "combo" },
          { time: 167, instruction: "3", type: "combo" },
          { time: 171, instruction: "1-2-3", type: "combo" },
          { time: 176, instruction: "Finish", type: "combo" }
        ]
      },
      {
        id: "round-2",
        round: 2,
        duration: 180,
        name: "Combinations Round",
        prompts: [
          { time: 0, instruction: "Round 2 - Ready", type: "stance" },
          { time: 5, instruction: "1-2-3-4", type: "combo", intensity: "high" },
          { time: 15, instruction: "Step Back", type: "movement" },
          { time: 20, instruction: "2-3-2", type: "combo" },
          { time: 30, instruction: "Slip-1-2", type: "combo" },
          { time: 40, instruction: "3-4 Head", type: "combo" },
          { time: 50, instruction: "Breathe", type: "breathing" },
          { time: 55, instruction: "1-1-2", type: "combo" },
          { time: 65, instruction: "Move Right", type: "movement" },
          { time: 70, instruction: "4-3-2", type: "combo" },
          { time: 80, instruction: "Guard Check", type: "stance" },
          { time: 85, instruction: "1-6 Body", type: "combo" },
          { time: 95, instruction: "Slip Right", type: "defense" },
          { time: 100, instruction: "2-Hook-2", type: "combo", intensity: "high" },
          { time: 115, instruction: "Active Rest", type: "breathing" },
          { time: 120, instruction: "1-2-5-2", type: "combo" },
          { time: 135, instruction: "Duck-3-4", type: "combo" },
          { time: 150, instruction: "Final 30 Seconds", type: "stance", intensity: "high" },
          { time: 155, instruction: "1-2-3", type: "combo" },
          { time: 165, instruction: "4-3-2-1", type: "combo", intensity: "high" },
          { time: 175, instruction: "Finish Strong", type: "combo", intensity: "high" }
        ]
      },
      {
        id: "round-3",
        round: 3,
        duration: 180,
        name: "Power Round",
        prompts: [
          { time: 0, instruction: "Final Round", type: "stance" },
          { time: 5, instruction: "Power 1-2", type: "combo", intensity: "high" },
          { time: 15, instruction: "3 to Body", type: "combo", intensity: "medium" },
          { time: 25, instruction: "2-3-4-3", type: "combo", intensity: "high" },
          { time: 40, instruction: "Circle Out", type: "movement" },
          { time: 45, instruction: "1-4 Body-1", type: "combo" }, // Another variation like your screenshot
          { time: 60, instruction: "Slip-2-3", type: "combo" },
          { time: 75, instruction: "Breathe Control", type: "breathing" },
          { time: 80, instruction: "Power Hooks", type: "combo", intensity: "high" },
          { time: 95, instruction: "1-2-Duck-3", type: "combo" },
          { time: 110, instruction: "Move & Strike", type: "movement" },
          { time: 120, instruction: "Championship Round", type: "stance", intensity: "high" },
          { time: 130, instruction: "1-2-3-2", type: "combo", intensity: "high" },
          { time: 145, instruction: "Body Shots", type: "combo", intensity: "high" },
          { time: 160, instruction: "Last 20 Seconds", type: "stance", intensity: "high" },
          { time: 165, instruction: "Everything You Got", type: "combo", intensity: "high" },
          { time: 175, instruction: "FINISH!", type: "combo", intensity: "high" }
        ]
      }
    ]
  },
  {
    id: "intermediate-power-timed",
    title: "Intermediate Power Training",
    description: "High-intensity power combinations with precise timing",
    level: "Intermediate",
    category: "HIIT",
    totalRounds: 4,
    restBetweenRounds: 52,
    estimatedCalories: 220,
    equipment: ["Heavy Bag"],
    imageUrl: "https://images.pexels.com/photos/4761671/pexels-photo-4761671.jpeg",
    exercises: [
      {
        id: "power-round-1",
        round: 1,
        duration: 180,
        prompts: [
          { time: 0, instruction: "Power Training Start", type: "stance" },
          { time: 5, instruction: "Double Jab-2", type: "combo", intensity: "high" },
          { time: 12, instruction: "3-4-3", type: "combo", intensity: "high" },
          { time: 22, instruction: "Slip-2-Body", type: "combo" },
          { time: 32, instruction: "1-2-3-4-5-2", type: "combo", intensity: "high" },
          { time: 47, instruction: "Active Recovery", type: "breathing" },
          { time: 52, instruction: "Power 2-3", type: "combo", intensity: "high" },
          { time: 62, instruction: "Duck-Uppercut", type: "combo" },
          { time: 72, instruction: "1-6-3-2", type: "combo", intensity: "medium" },
          { time: 87, instruction: "Lateral Movement", type: "movement" },
          { time: 92, instruction: "4-3-2-Hook", type: "combo", intensity: "high" },
          { time: 107, instruction: "Body-Head-Body", type: "combo", intensity: "high" },
          { time: 122, instruction: "Final Minute", type: "stance", intensity: "high" },
          { time: 130, instruction: "1-2-5-6-3", type: "combo", intensity: "high" },
          { time: 145, instruction: "Power Finish", type: "combo", intensity: "high" },
          { time: 165, instruction: "Last 15", type: "stance", intensity: "high" },
          { time: 170, instruction: "ALL OUT", type: "combo", intensity: "high" }
        ]
      }
      // Additional rounds would go here...
    ]
  },
  {
    id: "rockbox-advanced-combinations",
    title: "RockBox Advanced Combinations",
    description: "Elite shadow boxing with complex combinations and defensive movements",
    level: "Advanced",
    category: "Combos",
    totalRounds: 4,
    restBetweenRounds: 37,
    estimatedCalories: 280,
    equipment: ["None"],
    imageUrl: "https://images.pexels.com/photos/4761594/pexels-photo-4761594.jpeg",
    featured: true,
    exercises: [
      {
        id: "rockbox-round-1",
        round: 1,
        duration: 180,
        name: "Level Change Mastery",
        prompts: [
          { time: 0, instruction: "Ready to rock", type: "stance" },
          { time: 5, instruction: "High 1, Low 1, 2", type: "combo" },
          { time: 12, instruction: "Use your legs", type: "stance" },
          { time: 15, instruction: "High 1, High 1, Low 1, Low 1, 2", type: "combo" },
          { time: 25, instruction: "Duck", type: "defense" },
          { time: 28, instruction: "2-3-2-5", type: "combo" },
          { time: 35, instruction: "Flow like water", type: "stance" },
          { time: 38, instruction: "2-3-2-5", type: "combo" },
          { time: 45, instruction: "Slip", type: "defense" },
          { time: 48, instruction: "1-2-3 face-3 body-2", type: "combo" },
          { time: 58, instruction: "Level change", type: "movement" },
          { time: 61, instruction: "1-2-slip-2-3 face-3 body-2-slip-2", type: "combo" },
          { time: 75, instruction: "Breathe", type: "breathing" },
          { time: 78, instruction: "High 1, Low 1, 2", type: "combo" },
          { time: 85, instruction: "Move", type: "movement" },
          { time: 88, instruction: "2-3-2-5", type: "combo" },
          { time: 95, instruction: "Duck", type: "defense" },
          { time: 98, instruction: "1-2-3 face-3 body-2", type: "combo" },
          { time: 108, instruction: "Halfway", type: "stance" },
          { time: 112, instruction: "High 1, High 1, Low 1, Low 1, 2", type: "combo" },
          { time: 122, instruction: "Slip", type: "defense" },
          { time: 125, instruction: "2-3-2-5", type: "combo" },
          { time: 132, instruction: "Flow", type: "stance" },
          { time: 135, instruction: "1-2-slip-2-3 face-3 body-2-slip-2", type: "combo" },
          { time: 149, instruction: "Duck", type: "defense" },
          { time: 152, instruction: "High 1, Low 1, 2", type: "combo" },
          { time: 159, instruction: "Move", type: "movement" },
          { time: 162, instruction: "2-3-2-5", type: "combo" },
          { time: 169, instruction: "Final push", type: "stance" },
          { time: 172, instruction: "1-2-3 face-3 body-2", type: "combo" },
          { time: 179, instruction: "Strong finish", type: "combo" }
        ]
      },
      {
        id: "rockbox-round-2",
        round: 2,
        duration: 180,
        name: "Pivot Power",
        prompts: [
          { time: 0, instruction: "Round 2 pivot power", type: "stance" },
          { time: 5, instruction: "3-2-3-pivot", type: "combo" },
          { time: 12, instruction: "Step forward 1-1-2", type: "combo" },
          { time: 19, instruction: "Pivot again", type: "movement" },
          { time: 22, instruction: "3-2-3-pivot", type: "combo" },
          { time: 29, instruction: "Advance 1-1-2", type: "combo" },
          { time: 36, instruction: "Duck", type: "defense" },
          { time: 39, instruction: "6-3-2-slip-2", type: "combo" },
          { time: 47, instruction: "Keep it tight", type: "stance" },
          { time: 50, instruction: "6-6-3-3-2-slip-2", type: "combo" },
          { time: 60, instruction: "Slip", type: "defense" },
          { time: 63, instruction: "3-2-3-pivot", type: "combo" },
          { time: 70, instruction: "Forward pressure", type: "movement" },
          { time: 73, instruction: "1-1-2", type: "combo" },
          { time: 80, instruction: "Breathe", type: "breathing" },
          { time: 83, instruction: "6-3-2-slip-2", type: "combo" },
          { time: 91, instruction: "Duck", type: "defense" },
          { time: 94, instruction: "3-2-3-pivot", type: "combo" },
          { time: 101, instruction: "Drive forward", type: "movement" },
          { time: 104, instruction: "1-1-2", type: "combo" },
          { time: 111, instruction: "Stay sharp", type: "stance" },
          { time: 114, instruction: "6-6-3-3-2-slip-2", type: "combo" },
          { time: 124, instruction: "Slip", type: "defense" },
          { time: 127, instruction: "3-2-3-pivot", type: "combo" },
          { time: 134, instruction: "Final minute", type: "stance" },
          { time: 138, instruction: "Advance 1-1-2", type: "combo" },
          { time: 145, instruction: "6-3-2-slip-2", type: "combo" },
          { time: 153, instruction: "Duck", type: "defense" },
          { time: 156, instruction: "3-2-3-pivot", type: "combo" },
          { time: 163, instruction: "Power finish", type: "stance" },
          { time: 167, instruction: "1-1-2", type: "combo" },
          { time: 174, instruction: "6-6-3-3-2-slip-2", type: "combo" },
          { time: 179, instruction: "PIVOT MASTER!", type: "combo" }
        ]
      },
      {
        id: "rockbox-round-3",
        round: 3,
        duration: 180,
        name: "Evasive Warrior",
        prompts: [
          { time: 0, instruction: "Evasive warrior", type: "stance" },
          { time: 5, instruction: "1-slip-1-4-5-duck", type: "combo" },
          { time: 14, instruction: "Move back", type: "movement" },
          { time: 17, instruction: "1-slip-1", type: "combo" },
          { time: 22, instruction: "Back with 4", type: "combo" },
          { time: 26, instruction: "Back with 5", type: "combo" },
          { time: 30, instruction: "Duck", type: "defense" },
          { time: 33, instruction: "6-3-2-slip-2", type: "combo" },
          { time: 41, instruction: "Stay tight", type: "stance" },
          { time: 44, instruction: "1-slip-1-4-5-duck", type: "combo" },
          { time: 53, instruction: "Retreat", type: "movement" },
          { time: 56, instruction: "3-2-3-pivot", type: "combo" },
          { time: 63, instruction: "Forward 1-1-2", type: "combo" },
          { time: 70, instruction: "Slip", type: "defense" },
          { time: 73, instruction: "1-slip-1-4-5-duck", type: "combo" },
          { time: 82, instruction: "Backward pressure", type: "movement" },
          { time: 85, instruction: "6-6-3-3-2-slip-2", type: "combo" },
          { time: 95, instruction: "Duck", type: "defense" },
          { time: 98, instruction: "3-2-3-pivot", type: "combo" },
          { time: 105, instruction: "Drive forward", type: "movement" },
          { time: 108, instruction: "1-1-2", type: "combo" },
          { time: 115, instruction: "Breathe control", type: "breathing" },
          { time: 118, instruction: "1-slip-1-4-5-duck", type: "combo" },
          { time: 127, instruction: "Retreat and strike", type: "movement" },
          { time: 130, instruction: "6-3-2-slip-2", type: "combo" },
          { time: 138, instruction: "Slip", type: "defense" },
          { time: 141, instruction: "3-2-3-pivot", type: "combo" },
          { time: 148, instruction: "Final 30", type: "stance" },
          { time: 152, instruction: "1-1-2", type: "combo" },
          { time: 159, instruction: "1-slip-1-4-5-duck", type: "combo" },
          { time: 168, instruction: "Everything together", type: "stance" },
          { time: 172, instruction: "6-6-3-3-2-slip-2", type: "combo" },
          { time: 179, instruction: "WARRIOR!", type: "combo" }
        ]
      },
      {
        id: "rockbox-round-4",
        round: 4,
        duration: 180,
        name: "Championship Flow",
        prompts: [
          { time: 0, instruction: "Championship round", type: "stance" },
          { time: 5, instruction: "Everything flows", type: "combo" },
          { time: 8, instruction: "High 1, Low 1, 2", type: "combo" },
          { time: 15, instruction: "2-3-2-5", type: "combo" },
          { time: 22, instruction: "1-2-slip-2-3 face-3 body-2-slip-2", type: "combo" },
          { time: 36, instruction: "Duck", type: "defense" },
          { time: 39, instruction: "3-2-3-pivot", type: "combo" },
          { time: 46, instruction: "Forward 1-1-2", type: "combo" },
          { time: 53, instruction: "6-3-2-slip-2", type: "combo" },
          { time: 61, instruction: "Slip", type: "defense" },
          { time: 64, instruction: "1-slip-1-4-5-duck", type: "combo" },
          { time: 73, instruction: "Move back", type: "movement" },
          { time: 76, instruction: "High 1, High 1, Low 1, Low 1, 2", type: "combo" },
          { time: 86, instruction: "Duck", type: "defense" },
          { time: 89, instruction: "2-3-2-5", type: "combo" },
          { time: 96, instruction: "Flow state", type: "stance" },
          { time: 99, instruction: "6-6-3-3-2-slip-2", type: "combo" },
          { time: 109, instruction: "3-2-3-pivot", type: "combo" },
          { time: 116, instruction: "Drive forward", type: "movement" },
          { time: 119, instruction: "1-1-2", type: "combo" },
          { time: 126, instruction: "Slip", type: "defense" },
          { time: 129, instruction: "1-2-slip-2-3 face-3 body-2-slip-2", type: "combo" },
          { time: 143, instruction: "Breathe deep", type: "breathing" },
          { time: 146, instruction: "1-slip-1-4-5-duck", type: "combo" },
          { time: 155, instruction: "Final minute", type: "stance" },
          { time: 159, instruction: "High 1, Low 1, 2", type: "combo" },
          { time: 166, instruction: "6-3-2-slip-2", type: "combo" },
          { time: 174, instruction: "Championship finish", type: "stance" },
          { time: 177, instruction: "ROCKBOX CHAMPION!", type: "combo" }
        ]
      }
    ]
  },
  {
    id: "jab-pyramid-heavy-bag",
    title: "Jab Pyramid Heavy Bag Drill",
    description: "Classic 3-minute jab pyramid drill - work up from 1 to 10 jabs, then back down. Complete 2 pyramids!",
    level: "Intermediate",
    category: "Punching Bag",
    totalRounds: 1,
    restBetweenRounds: 0,
    estimatedCalories: 120,
    equipment: ["Heavy Bag"],
    imageUrl: "https://images.pexels.com/photos/7289993/pexels-photo-7289993.jpeg",
    featured: true,
    exercises: [
      {
        id: "jab-pyramid-round",
        round: 1,
        duration: 180,
        name: "Jab Pyramid Challenge",
        prompts: [
          // First Pyramid - Going Up
          { time: 0, instruction: "Jab Pyramid! Let's go!", type: "stance" },
          { time: 3, instruction: "1 Jab", type: "combo" },
          { time: 5, instruction: "Reset to guard", type: "stance" },
          { time: 8, instruction: "2 Jabs", type: "combo" },
          { time: 11, instruction: "Back to guard", type: "stance" },
          { time: 14, instruction: "3 Jabs", type: "combo" },
          { time: 18, instruction: "Reset", type: "stance" },
          { time: 21, instruction: "4 Jabs", type: "combo" },
          { time: 26, instruction: "Guard up", type: "stance" },
          { time: 29, instruction: "5 Jabs", type: "combo" },
          { time: 35, instruction: "Reset", type: "stance" },
          { time: 38, instruction: "6 Jabs", type: "combo" },
          { time: 45, instruction: "Back to guard", type: "stance" },
          { time: 48, instruction: "7 Jabs", type: "combo" },
          { time: 56, instruction: "Reset", type: "stance" },
          { time: 59, instruction: "8 Jabs", type: "combo" },
          { time: 68, instruction: "Guard position", type: "stance" },
          { time: 71, instruction: "9 Jabs", type: "combo" },
          { time: 81, instruction: "Reset", type: "stance" },
          { time: 84, instruction: "10 Jabs! Peak!", type: "combo" },
          
          // Going Back Down
          { time: 95, instruction: "Now back down! 9 Jabs", type: "combo" },
          { time: 105, instruction: "Reset", type: "stance" },
          { time: 108, instruction: "8 Jabs", type: "combo" },
          { time: 117, instruction: "Guard up", type: "stance" },
          { time: 120, instruction: "7 Jabs", type: "combo" },
          { time: 128, instruction: "Reset", type: "stance" },
          { time: 131, instruction: "6 Jabs", type: "combo" },
          { time: 138, instruction: "Back to guard", type: "stance" },
          { time: 141, instruction: "5 Jabs", type: "combo" },
          { time: 147, instruction: "Reset", type: "stance" },
          { time: 150, instruction: "4 Jabs", type: "combo" },
          { time: 155, instruction: "Guard position", type: "stance" },
          { time: 158, instruction: "3 Jabs", type: "combo" },
          { time: 162, instruction: "Reset", type: "stance" },
          { time: 165, instruction: "2 Jabs", type: "combo" },
          { time: 168, instruction: "Back to guard", type: "stance" },
          { time: 171, instruction: "1 Jab", type: "combo" },
          { time: 173, instruction: "Pyramid 1 complete!", type: "stance" },
          
          // Quick instructions for potential second pyramid
          { time: 175, instruction: "Go again if time!", type: "stance" },
          { time: 177, instruction: "Push to the end!", type: "combo" },
          { time: 179, instruction: "Amazing work!", type: "stance" }
        ]
      }
    ]
  },
  {
    id: "flash-combo-speed-drill",
    title: "Flash-Combo Speed Drill",
    description: "Professional speed training - 5 rounds of lightning-fast 2-punch combinations",
    level: "Advanced", 
    category: "HIIT",
    totalRounds: 5,
    restBetweenRounds: 60,
    estimatedCalories: 300,
    equipment: ["Heavy Bag"],
    imageUrl: "https://images.pexels.com/photos/4761594/pexels-photo-4761594.jpeg",
    featured: true,
    exercises: [
      {
        id: "flash-round-1",
        round: 1,
        duration: 180,
        name: "Flash Jab-Cross",
        prompts: [
          { time: 0, instruction: "Round 1: Flash Jab-Cross!", type: "stance" },
          { time: 3, instruction: "Fast 1-2", type: "combo" },
          { time: 6, instruction: "Make it sound like ONE punch!", type: "stance" },
          { time: 9, instruction: "1-2", type: "combo" },
          { time: 12, instruction: "Lightning speed!", type: "stance" },
          { time: 15, instruction: "Flash 1-2", type: "combo" },
          { time: 18, instruction: "No pause between punches", type: "stance" },
          { time: 21, instruction: "1-2", type: "combo" },
          { time: 24, instruction: "Speed over power", type: "stance" },
          { time: 27, instruction: "Flash combo", type: "combo" },
          { time: 30, instruction: "Snap those punches!", type: "stance" },
          { time: 33, instruction: "1-2", type: "combo" },
          { time: 36, instruction: "Breathe with combos", type: "breathing" },
          { time: 39, instruction: "Flash 1-2", type: "combo" },
          { time: 42, instruction: "Two punches, one sound", type: "stance" },
          { time: 45, instruction: "1-2", type: "combo" },
          { time: 48, instruction: "Quick reset", type: "stance" },
          { time: 51, instruction: "Flash combo", type: "combo" },
          { time: 54, instruction: "Keep it crisp!", type: "stance" },
          { time: 57, instruction: "1-2", type: "combo" },
          { time: 60, instruction: "One minute in! Speed up!", type: "stance" },
          { time: 63, instruction: "Flash 1-2", type: "combo" },
          { time: 66, instruction: "Maximum velocity", type: "stance" },
          { time: 69, instruction: "1-2", type: "combo" },
          { time: 72, instruction: "Blur those punches", type: "stance" },
          { time: 75, instruction: "Flash combo", type: "combo" },
          { time: 78, instruction: "Sharp and fast", type: "stance" },
          { time: 81, instruction: "1-2", type: "combo" },
          { time: 84, instruction: "No telegraphing", type: "stance" },
          { time: 87, instruction: "Flash 1-2", type: "combo" },
          { time: 90, instruction: "Halfway! Push harder!", type: "stance" },
          { time: 93, instruction: "1-2", type: "combo" },
          { time: 96, instruction: "Lightning combinations", type: "stance" },
          { time: 99, instruction: "Flash combo", type: "combo" },
          { time: 102, instruction: "Speed demon mode", type: "stance" },
          { time: 105, instruction: "1-2", type: "combo" },
          { time: 108, instruction: "Invisible punches", type: "stance" },
          { time: 111, instruction: "Flash 1-2", type: "combo" },
          { time: 114, instruction: "Blink and miss", type: "stance" },
          { time: 117, instruction: "1-2", type: "combo" },
          { time: 120, instruction: "Final minute! All out!", type: "stance" },
          { time: 123, instruction: "Flash combo", type: "combo" },
          { time: 126, instruction: "Catch them off guard", type: "stance" },
          { time: 129, instruction: "1-2", type: "combo" },
          { time: 132, instruction: "Beat them to the punch", type: "stance" },
          { time: 135, instruction: "Flash 1-2", type: "combo" },
          { time: 138, instruction: "Pro-level speed", type: "stance" },
          { time: 141, instruction: "1-2", type: "combo" },
          { time: 144, instruction: "They'll never see it coming", type: "stance" },
          { time: 147, instruction: "Flash combo", type: "combo" },
          { time: 150, instruction: "Final 30 seconds!", type: "stance" },
          { time: 153, instruction: "1-2", type: "combo" },
          { time: 156, instruction: "Maximum speed", type: "stance" },
          { time: 159, instruction: "Flash 1-2", type: "combo" },
          { time: 162, instruction: "Lightning round", type: "stance" },
          { time: 165, instruction: "1-2", type: "combo" },
          { time: 168, instruction: "Flash finish", type: "combo" },
          { time: 171, instruction: "10 seconds!", type: "stance" },
          { time: 174, instruction: "Flash 1-2", type: "combo" },
          { time: 177, instruction: "FLASH!", type: "combo" }
        ]
      },
      {
        id: "flash-round-2",
        round: 2,
        duration: 180,
        name: "Flash Cross-Hook",
        prompts: [
          { time: 0, instruction: "Round 2: Cross-Hook!", type: "stance" },
          { time: 3, instruction: "2-3 flash", type: "combo" },
          { time: 6, instruction: "Cross flows to hook", type: "stance" },
          { time: 9, instruction: "2-3", type: "combo" },
          { time: 12, instruction: "Hip rotation speed", type: "movement" },
          { time: 15, instruction: "Flash 2-3", type: "combo" },
          { time: 18, instruction: "No pause!", type: "stance" },
          { time: 21, instruction: "2-3", type: "combo" },
          { time: 24, instruction: "One fluid motion", type: "stance" },
          { time: 27, instruction: "Flash combo", type: "combo" },
          { time: 30, instruction: "Lightning transitions", type: "stance" },
          { time: 33, instruction: "2-3", type: "combo" },
          { time: 36, instruction: "Tight and compact", type: "stance" },
          { time: 39, instruction: "Flash 2-3", type: "combo" },
          { time: 42, instruction: "Power to speed", type: "stance" },
          { time: 45, instruction: "2-3", type: "combo" },
          { time: 60, instruction: "One minute mark!", type: "stance" },
          { time: 90, instruction: "Halfway point!", type: "stance" },
          { time: 120, instruction: "Final minute push!", type: "stance" },
          { time: 150, instruction: "30 seconds left!", type: "stance" },
          { time: 177, instruction: "LIGHTNING!", type: "combo" }
        ]
      },
      {
        id: "flash-round-3",
        round: 3,
        duration: 180,
        name: "Flash Jab-Right Hook",
        prompts: [
          { time: 0, instruction: "Round 3: Jab-Right Hook!", type: "stance" },
          { time: 3, instruction: "1-4 flash", type: "combo" },
          { time: 6, instruction: "Jab opens, hook finishes", type: "stance" },
          { time: 9, instruction: "1-4", type: "combo" },
          { time: 12, instruction: "Pivot on rear foot", type: "movement" },
          { time: 15, instruction: "Flash 1-4", type: "combo" },
          { time: 60, instruction: "One minute in!", type: "stance" },
          { time: 90, instruction: "Halfway mark!", type: "stance" },
          { time: 120, instruction: "Final minute blast!", type: "stance" },
          { time: 150, instruction: "30 seconds!", type: "stance" },
          { time: 177, instruction: "FLASH MASTER!", type: "combo" }
        ]
      },
      {
        id: "flash-round-4",
        round: 4,
        duration: 180,
        name: "Flash Uppercut-Hook",
        prompts: [
          { time: 0, instruction: "Round 4: Uppercut-Hook!", type: "stance" },
          { time: 3, instruction: "5-3 flash", type: "combo" },
          { time: 6, instruction: "Up then over", type: "stance" },
          { time: 9, instruction: "5-3", type: "combo" },
          { time: 12, instruction: "Close range power", type: "stance" },
          { time: 15, instruction: "Flash 5-3", type: "combo" },
          { time: 60, instruction: "One minute mark!", type: "stance" },
          { time: 90, instruction: "Halfway there!", type: "stance" },
          { time: 120, instruction: "Final minute fury!", type: "stance" },
          { time: 150, instruction: "30 seconds left!", type: "stance" },
          { time: 177, instruction: "FLASH CHAMPION!", type: "combo" }
        ]
      },
      {
        id: "flash-round-5",
        round: 5,
        duration: 180,
        name: "Flash Free Choice",
        prompts: [
          { time: 0, instruction: "Round 5: Your choice!", type: "stance" },
          { time: 3, instruction: "Pick your combo", type: "combo" },
          { time: 6, instruction: "Make it flash", type: "stance" },
          { time: 9, instruction: "Your speed combo", type: "combo" },
          { time: 12, instruction: "Perfect your weakness", type: "stance" },
          { time: 15, instruction: "Flash combination", type: "combo" },
          { time: 60, instruction: "One minute in!", type: "stance" },
          { time: 90, instruction: "Halfway mark!", type: "stance" },
          { time: 120, instruction: "Final minute!", type: "stance" },
          { time: 150, instruction: "30 seconds!", type: "stance" },
          { time: 177, instruction: "FLASH MASTER!", type: "combo" }
        ]
      }
    ]
  },
  {
    id: "dynamic-boxing-fundamentals",
    title: "Dynamic Boxing Fundamentals",
    description: "Smart workout that adapts each round with different combinations - never the same twice!",
    level: "Beginner",
    category: "Combos",
    totalRounds: 3,
    restBetweenRounds: 75,
    estimatedCalories: 180,
    equipment: ["None"],
    imageUrl: "https://images.pexels.com/photos/17892107/pexels-photo-17892107.jpeg",
    featured: true,
    exercises: [
      {
        id: "dynamic-round-1",
        round: 1,
        duration: 180,
        name: "Adaptive Round 1",
        prompts: [] // Will be populated by generateDynamicPrompts()
      },
      {
        id: "dynamic-round-2", 
        round: 2,
        duration: 180,
        name: "Adaptive Round 2",
        prompts: [] // Will be populated by generateDynamicPrompts()
      },
      {
        id: "dynamic-round-3",
        round: 3,
        duration: 180,
        name: "Adaptive Round 3", 
        prompts: [] // Will be populated by generateDynamicPrompts()
      }
    ]
  },
  {
    id: "dynamic-intermediate-power",
    title: "Dynamic Intermediate Power",
    description: "Intermediate power training with varied combinations each session",
    level: "Intermediate",
    category: "HIIT",
    totalRounds: 4,
    restBetweenRounds: 52,
    estimatedCalories: 250,
    equipment: ["None"],
    imageUrl: "https://images.pexels.com/photos/4761671/pexels-photo-4761671.jpeg",
    featured: true,
    exercises: [
      {
        id: "dynamic-power-round-1",
        round: 1,
        duration: 180,
        name: "Adaptive Power Round 1",
        prompts: [] // Will be populated by generateDynamicPrompts()
      },
      {
        id: "dynamic-power-round-2",
        round: 2,
        duration: 180,
        name: "Adaptive Power Round 2",
        prompts: [] // Will be populated by generateDynamicPrompts()
      },
      {
        id: "dynamic-power-round-3",
        round: 3,
        duration: 180,
        name: "Adaptive Power Round 3",
        prompts: [] // Will be populated by generateDynamicPrompts()
      },
      {
        id: "dynamic-power-round-4",
        round: 4,
        duration: 180,
        name: "Adaptive Power Round 4",
        prompts: [] // Will be populated by generateDynamicPrompts()
      }
    ]
  },
  {
    id: "dynamic-advanced-elite",
    title: "Dynamic Advanced Elite",
    description: "Elite advanced training with complex, ever-changing combinations",
    level: "Advanced",
    category: "Combos",
    totalRounds: 5,
    restBetweenRounds: 37,
    estimatedCalories: 320,
    equipment: ["None"],
    imageUrl: "https://images.pexels.com/photos/4761594/pexels-photo-4761594.jpeg",
    featured: true,
    exercises: [
      {
        id: "dynamic-elite-round-1",
        round: 1,
        duration: 180,
        name: "Adaptive Elite Round 1",
        prompts: [] // Will be populated by generateDynamicPrompts()
      },
      {
        id: "dynamic-elite-round-2",
        round: 2,
        duration: 180,
        name: "Adaptive Elite Round 2",
        prompts: [] // Will be populated by generateDynamicPrompts()
      },
      {
        id: "dynamic-elite-round-3",
        round: 3,
        duration: 180,
        name: "Adaptive Elite Round 3",
        prompts: [] // Will be populated by generateDynamicPrompts()
      },
      {
        id: "dynamic-elite-round-4",
        round: 4,
        duration: 180,
        name: "Adaptive Elite Round 4",
        prompts: [] // Will be populated by generateDynamicPrompts()
      },
      {
        id: "dynamic-elite-round-5",
        round: 5,
        duration: 180,
        name: "Adaptive Elite Round 5",
        prompts: [] // Will be populated by generateDynamicPrompts()
      }
    ]
  }
];

// Audio URL mapping for common instructions
const AUDIO_LIBRARY: Record<string, string> = {
  "Here we go! Hands up!": "https://boyegcsxgufnheudjjyj.supabase.co/storage/v1/object/public/coach//hereegohandup.mp3",
  "1": "https://boyegcsxgufnheudjjyj.supabase.co/storage/v1/object/public/coach//jab.mp3", // Correct jab audio
  // Add more audio mappings as you create them
  // "2": "https://boyegcsxgufnheudjjyj.supabase.co/storage/v1/object/public/coach/cross.mp3",
  // "1-2": "https://boyegcsxgufnheudjjyj.supabase.co/storage/v1/object/public/coach/one-two.mp3",
  // "Duck": "https://boyegcsxgufnheudjjyj.supabase.co/storage/v1/object/public/coach/duck.mp3",
  // "Slip": "https://boyegcsxgufnheudjjyj.supabase.co/storage/v1/object/public/coach/slip.mp3",
};

// Helper function to get audio URL for instruction
export const getAudioUrlForInstruction = (instruction: string): string | undefined => {
  return AUDIO_LIBRARY[instruction];
};

// Helper function to add audio to prompts automatically
export const enhancePromptsWithAudio = (prompts: TimedPrompt[]): TimedPrompt[] => {
  return prompts.map(prompt => ({
    ...prompt,
    audioUrl: prompt.audioUrl || getAudioUrlForInstruction(prompt.instruction)
  }));
};

// Helper function to get timed workout by ID
export const getTimedWorkout = (id: string): TimedWorkout | undefined => {
  return TIMED_WORKOUTS.find(workout => workout.id === id);
};

// Dynamic Prompt Variation System
interface PromptVariation {
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  variations: TimedPrompt[][];
}

interface RoundTemplate {
  opening: TimedPrompt[];     // Fixed start
  middle: PromptVariation;    // Level-based variations
  closing: TimedPrompt[];     // Fixed finish
}

// Generate dynamic prompts based on level and round
export const generateDynamicPrompts = (
  roundNumber: number, 
  level: 'Beginner' | 'Intermediate' | 'Advanced',
  duration: number
): TimedPrompt[] => {
  const prompts: TimedPrompt[] = [];
  
  // Fixed Opening (0-10 seconds)
  const openings = {
    1: `Round ${roundNumber}! Let's go!`,
    2: `Round ${roundNumber}! Step it up!`,
    3: `Round ${roundNumber}! Push harder!`,
    4: `Round ${roundNumber}! Championship time!`,
    5: `Round ${roundNumber}! Final round!`
  };
  
  prompts.push(
    { 
      time: 0, 
      instruction: openings[roundNumber as keyof typeof openings] || `Round ${roundNumber}! Ready!`, 
      type: "stance",
      audioUrl: roundNumber === 1 ? "https://boyegcsxgufnheudjjyj.supabase.co/storage/v1/object/public/coach//hereegohandup.mp3" : undefined
    },
    { time: 3, instruction: "Hands up, eyes forward!", type: "stance" }
  );

  // Dynamic Middle Section (10 seconds to duration-15)
  const middleStart = 10;
  const middleEnd = duration - 15;
  const middleDuration = middleEnd - middleStart;
  
  // Create variations based on level
  const variations = getPromptVariations(level, middleStart, middleEnd);
  const selectedVariation = variations[Math.floor(Math.random() * variations.length)];
  
  prompts.push(...selectedVariation);

  // Fixed Closing (final 15 seconds)
  const closingStart = duration - 15;
  prompts.push(
    { time: closingStart, instruction: "Final 15 seconds!", type: "stance" },
    { time: closingStart + 5, instruction: "Push through!", type: "stance" },
    { time: closingStart + 10, instruction: "Almost there!", type: "stance" },
    { time: duration - 3, instruction: "Strong finish!", type: "combo" },
    { time: duration - 1, instruction: "Time!", type: "stance" }
  );

  return prompts;
};

// Get prompt variations based on level
const getPromptVariations = (
  level: 'Beginner' | 'Intermediate' | 'Advanced',
  startTime: number,
  endTime: number
): TimedPrompt[][] => {
  const duration = endTime - startTime;
  const interval = Math.floor(duration / 10); // Roughly 10 prompts in middle section
  
  if (level === 'Beginner') {
    return [
      // Variation 1: Basic combinations
      [
        { time: startTime, instruction: "1", type: "combo" },
        { time: startTime + interval, instruction: "2", type: "combo" },
        { time: startTime + interval * 2, instruction: "1-2", type: "combo" },
        { time: startTime + interval * 3, instruction: "Duck", type: "defense" },
        { time: startTime + interval * 4, instruction: "1-2", type: "combo" },
        { time: startTime + interval * 5, instruction: "3", type: "combo" },
        { time: startTime + interval * 6, instruction: "Slip", type: "defense" },
        { time: startTime + interval * 7, instruction: "1-2-3", type: "combo" },
        { time: startTime + interval * 8, instruction: "Move", type: "movement" },
        { time: startTime + interval * 9, instruction: "1-2", type: "combo" }
      ],
      // Variation 2: Defense focus
      [
        { time: startTime, instruction: "1-2", type: "combo" },
        { time: startTime + interval, instruction: "Duck low", type: "defense" },
        { time: startTime + interval * 2, instruction: "2", type: "combo" },
        { time: startTime + interval * 3, instruction: "Slip right", type: "defense" },
        { time: startTime + interval * 4, instruction: "1-3", type: "combo" },
        { time: startTime + interval * 5, instruction: "Move back", type: "movement" },
        { time: startTime + interval * 6, instruction: "1-2", type: "combo" },
        { time: startTime + interval * 7, instruction: "Duck", type: "defense" },
        { time: startTime + interval * 8, instruction: "3-2", type: "combo" },
        { time: startTime + interval * 9, instruction: "Guard up", type: "stance" }
      ],
      // Variation 3: Movement focus
      [
        { time: startTime, instruction: "1-2", type: "combo" },
        { time: startTime + interval, instruction: "Circle left", type: "movement" },
        { time: startTime + interval * 2, instruction: "2-3", type: "combo" },
        { time: startTime + interval * 3, instruction: "Step back", type: "movement" },
        { time: startTime + interval * 4, instruction: "1", type: "combo" },
        { time: startTime + interval * 5, instruction: "Move forward", type: "movement" },
        { time: startTime + interval * 6, instruction: "1-2-3", type: "combo" },
        { time: startTime + interval * 7, instruction: "Circle right", type: "movement" },
        { time: startTime + interval * 8, instruction: "2", type: "combo" },
        { time: startTime + interval * 9, instruction: "Reset stance", type: "stance" }
      ]
    ];
  } else if (level === 'Intermediate') {
    return [
      // Variation 1: Power combinations
      [
        { time: startTime, instruction: "1-2-3", type: "combo" },
        { time: startTime + interval, instruction: "Duck-uppercut", type: "combo" },
        { time: startTime + interval * 2, instruction: "2-3-2", type: "combo" },
        { time: startTime + interval * 3, instruction: "Slip-counter", type: "combo" },
        { time: startTime + interval * 4, instruction: "1-1-2", type: "combo" },
        { time: startTime + interval * 5, instruction: "3-4", type: "combo" },
        { time: startTime + interval * 6, instruction: "Body-head", type: "combo" },
        { time: startTime + interval * 7, instruction: "1-2-3-2", type: "combo" },
        { time: startTime + interval * 8, instruction: "Pivot-hook", type: "combo" },
        { time: startTime + interval * 9, instruction: "Double up", type: "combo" }
      ],
      // Variation 2: Technical boxing
      [
        { time: startTime, instruction: "Double jab-cross", type: "combo" },
        { time: startTime + interval, instruction: "Slip left", type: "defense" },
        { time: startTime + interval * 2, instruction: "3-2-3", type: "combo" },
        { time: startTime + interval * 3, instruction: "Step out", type: "movement" },
        { time: startTime + interval * 4, instruction: "1-6-2", type: "combo" },
        { time: startTime + interval * 5, instruction: "Duck-hook", type: "combo" },
        { time: startTime + interval * 6, instruction: "2-3-4", type: "combo" },
        { time: startTime + interval * 7, instruction: "Lateral move", type: "movement" },
        { time: startTime + interval * 8, instruction: "1-2-5", type: "combo" },
        { time: startTime + interval * 9, instruction: "Counter time", type: "combo" }
      ],
      // Variation 3: Flow sequences
      [
        { time: startTime, instruction: "1-2-3-4", type: "combo" },
        { time: startTime + interval, instruction: "Flow state", type: "stance" },
        { time: startTime + interval * 2, instruction: "5-3-2", type: "combo" },
        { time: startTime + interval * 3, instruction: "Move and strike", type: "movement" },
        { time: startTime + interval * 4, instruction: "1-1-2-3", type: "combo" },
        { time: startTime + interval * 5, instruction: "Body attack", type: "combo" },
        { time: startTime + interval * 6, instruction: "2-hook-2", type: "combo" },
        { time: startTime + interval * 7, instruction: "Circle out", type: "movement" },
        { time: startTime + interval * 8, instruction: "3-4-3", type: "combo" },
        { time: startTime + interval * 9, instruction: "Finish strong", type: "combo" }
      ]
    ];
  } else { // Advanced
    return [
      // Variation 1: Complex combinations
      [
        { time: startTime, instruction: "1-2-slip-2-3", type: "combo" },
        { time: startTime + interval, instruction: "Evasive counter", type: "combo" },
        { time: startTime + interval * 2, instruction: "6-3-2-slip-2", type: "combo" },
        { time: startTime + interval * 3, instruction: "Pivot warfare", type: "movement" },
        { time: startTime + interval * 4, instruction: "1-slip-1-4-5", type: "combo" },
        { time: startTime + interval * 5, instruction: "Level change", type: "movement" },
        { time: startTime + interval * 6, instruction: "3-2-3-pivot", type: "combo" },
        { time: startTime + interval * 7, instruction: "Forward pressure", type: "movement" },
        { time: startTime + interval * 8, instruction: "2-3-2-5-3", type: "combo" },
        { time: startTime + interval * 9, instruction: "Championship", type: "stance" }
      ],
      // Variation 2: Defensive mastery
      [
        { time: startTime, instruction: "Slip-counter-slip", type: "combo" },
        { time: startTime + interval, instruction: "Duck-uppercut-hook", type: "combo" },
        { time: startTime + interval * 2, instruction: "1-2-3 face-3 body", type: "combo" },
        { time: startTime + interval * 3, instruction: "Retreat counter", type: "movement" },
        { time: startTime + interval * 4, instruction: "6-6-3-3-2", type: "combo" },
        { time: startTime + interval * 5, instruction: "Evasive warrior", type: "stance" },
        { time: startTime + interval * 6, instruction: "1-slip-1-back-4", type: "combo" },
        { time: startTime + interval * 7, instruction: "Circle and strike", type: "movement" },
        { time: startTime + interval * 8, instruction: "High-low-high", type: "combo" },
        { time: startTime + interval * 9, instruction: "Elite finish", type: "combo" }
      ],
      // Variation 3: Pro combinations
      [
        { time: startTime, instruction: "1-1-2-3-4-5-2", type: "combo" },
        { time: startTime + interval, instruction: "Pro flow", type: "stance" },
        { time: startTime + interval * 2, instruction: "3-2-3-pivot-1-1-2", type: "combo" },
        { time: startTime + interval * 3, instruction: "Advance and destroy", type: "movement" },
        { time: startTime + interval * 4, instruction: "Body-head warfare", type: "combo" },
        { time: startTime + interval * 5, instruction: "Lightning combos", type: "combo" },
        { time: startTime + interval * 6, instruction: "1-2-slip-2-3-body-2", type: "combo" },
        { time: startTime + interval * 7, instruction: "Warrior mode", type: "stance" },
        { time: startTime + interval * 8, instruction: "Everything flows", type: "combo" },
        { time: startTime + interval * 9, instruction: "Champion finish", type: "combo" }
      ]
    ];
  }
};

// Helper function to get dynamic workout with populated prompts
export const getDynamicTimedWorkout = (id: string): TimedWorkout | undefined => {
  const workout = TIMED_WORKOUTS.find(w => w.id === id);
  if (!workout) return undefined;
  
  // Check if this is a dynamic workout (has empty prompts)
  const isDynamic = workout.exercises.some(exercise => exercise.prompts.length === 0);
  
  // Always enhance with audio for both static and dynamic workouts
  const enhancedWorkout = { ...workout };
  enhancedWorkout.exercises = workout.exercises.map(exercise => {
    const prompts = exercise.prompts.length === 0 
      ? generateDynamicPrompts(exercise.round, workout.level, exercise.duration)
      : exercise.prompts;
    
    return {
      ...exercise,
      prompts: enhancePromptsWithAudio(prompts)
    };
  });
  
  return enhancedWorkout;
};

// Apply dynamic prompts to any existing workout
export const makeDynamicWorkout = (workoutId: string): TimedWorkout | undefined => {
  const workout = getTimedWorkout(workoutId);
  if (!workout) return undefined;
  
  const dynamicWorkout = { ...workout };
  dynamicWorkout.exercises = workout.exercises.map(exercise => ({
    ...exercise,
    prompts: generateDynamicPrompts(exercise.round, workout.level, exercise.duration)
  }));
  
  return dynamicWorkout;
};

// Check if workout uses dynamic prompts
export const isDynamicWorkout = (workoutId: string): boolean => {
  const workout = TIMED_WORKOUTS.find(w => w.id === workoutId);
  if (!workout) return false;
  
  return workout.exercises.some(exercise => exercise.prompts.length === 0);
};

// Get variation info for a workout
export const getWorkoutVariationInfo = (level: 'Beginner' | 'Intermediate' | 'Advanced') => {
  const variations = getPromptVariations(level, 0, 100); // Sample call to get count
  return {
    level,
    variationCount: variations.length,
    description: level === 'Beginner' 
      ? '3 variations: Basic combos, Defense focus, Movement patterns'
      : level === 'Intermediate'
      ? '3 variations: Power combinations, Technical boxing, Flow sequences'  
      : '3 variations: Complex combinations, Defensive mastery, Pro combinations'
  };
};

// Get all unique instructions that could benefit from audio
export const getInstructionsNeedingAudio = (): string[] => {
  const allInstructions = new Set<string>();
  
  // Collect from all static workouts
  TIMED_WORKOUTS.forEach(workout => {
    workout.exercises.forEach(exercise => {
      exercise.prompts.forEach(prompt => {
        allInstructions.add(prompt.instruction);
      });
    });
  });
  
  // Collect from dynamic prompt variations
  const levels: ('Beginner' | 'Intermediate' | 'Advanced')[] = ['Beginner', 'Intermediate', 'Advanced'];
  levels.forEach(level => {
    const variations = getPromptVariations(level, 0, 180);
    variations.forEach(variation => {
      variation.forEach(prompt => {
        allInstructions.add(prompt.instruction);
      });
    });
  });
  
  return Array.from(allInstructions).sort();
};

// Get audio coverage statistics
export const getAudioCoverageStats = () => {
  const allInstructions = getInstructionsNeedingAudio();
  const instructionsWithAudio = allInstructions.filter(instruction => 
    getAudioUrlForInstruction(instruction) !== undefined
  );
  
  return {
    totalInstructions: allInstructions.length,
    instructionsWithAudio: instructionsWithAudio.length,
    coveragePercentage: Math.round((instructionsWithAudio.length / allInstructions.length) * 100),
    missingAudio: allInstructions.filter(instruction => 
      getAudioUrlForInstruction(instruction) === undefined
    )
  };
};

// Helper function to get current instruction based on elapsed time
export const getCurrentInstruction = (exercise: TimedExercise, elapsedSeconds: number): TimedPrompt | null => {
  // Find the most recent prompt that should be displayed
  const applicablePrompts = exercise.prompts.filter(prompt => prompt.time <= elapsedSeconds);
  
  if (applicablePrompts.length === 0) {
    return null;
  }
  
  // Return the latest applicable prompt
  return applicablePrompts[applicablePrompts.length - 1];
};

// Helper function to get next instruction
export const getNextInstruction = (exercise: TimedExercise, elapsedSeconds: number): TimedPrompt | null => {
  const futurePrompts = exercise.prompts.filter(prompt => prompt.time > elapsedSeconds);
  
  if (futurePrompts.length === 0) {
    return null;
  }
  
  // Return the next upcoming prompt
  return futurePrompts[0];
};

// Helper function to get rest instructions by level
export const getRestInstructionsByLevel = (level: 'Beginner' | 'Intermediate' | 'Advanced'): RestInstruction | undefined => {
  return REST_INSTRUCTIONS.find(rest => rest.level === level);
};

// Helper function to get current rest instruction based on elapsed time
export const getCurrentRestInstruction = (level: 'Beginner' | 'Intermediate' | 'Advanced', elapsedSeconds: number): RestPrompt | null => {
  const restInstructions = getRestInstructionsByLevel(level);
  
  if (!restInstructions) {
    return null;
  }
  
  // Find the most recent prompt that should be displayed
  const applicablePrompts = restInstructions.instructions.filter(prompt => prompt.time <= elapsedSeconds);
  
  if (applicablePrompts.length === 0) {
    return null;
  }
  
  // Return the latest applicable prompt
  return applicablePrompts[applicablePrompts.length - 1];
};

// Helper function to get next rest instruction
export const getNextRestInstruction = (level: 'Beginner' | 'Intermediate' | 'Advanced', elapsedSeconds: number): RestPrompt | null => {
  const restInstructions = getRestInstructionsByLevel(level);
  
  if (!restInstructions) {
    return null;
  }
  
  const futurePrompts = restInstructions.instructions.filter(prompt => prompt.time > elapsedSeconds);
  
  if (futurePrompts.length === 0) {
    return null;
  }
  
  // Return the next upcoming prompt
  return futurePrompts[0];
};

// Helper function to convert regular workout to timed workout format
export const convertToTimedWorkout = (workout: Workout): TimedWorkout => {
  const exercises: TimedExercise[] = [];
  
  // Create one exercise per round, each 3 minutes (180 seconds)
  for (let round = 1; round <= workout.rounds; round++) {
    const roundExercise: TimedExercise = {
      id: `${workout.id}-round-${round}`,
      round: round,
      duration: 180, // Standard 3-minute boxing round
      name: `Round ${round}`,
      prompts: generateWorkoutPrompts(workout, round)
    };
    exercises.push(roundExercise);
  }

  return {
    id: workout.id,
    title: workout.title,
    description: workout.description,
    level: workout.level,
    category: workout.category,
    totalRounds: workout.rounds,
    restBetweenRounds: workout.restPeriod,
    estimatedCalories: workout.calories,
    equipment: workout.equipment,
    imageUrl: workout.imageUrl,
    featured: workout.featured,
    popular: workout.popular,
    exercises: exercises
  };
};

// Generate prompts for regular workout converted to timed format
const generateWorkoutPrompts = (workout: Workout, round: number): TimedPrompt[] => {
  const prompts: TimedPrompt[] = [];
  const duration = 180; // 3 minutes
  
  // Opening
  prompts.push(
    { time: 0, instruction: `Round ${round}`, type: "stance" },
    { time: 3, instruction: "Hands up, let's go!", type: "stance" }
  );

  // Get exercises for this workout
  const exercises = workout.exercises || [];
  
  if (exercises.length === 0) {
    // If no specific exercises, generate based on level
    return generateDynamicPrompts(round, workout.level, duration);
  }

  // Create a structured boxing round with the exercises
  const timePerExercise = Math.floor((duration - 30) / exercises.length); // Leave 30 seconds for opening/closing
  
  exercises.forEach((exercise, index) => {
    const startTime = 15 + (index * timePerExercise);
    
    // Focus on punch sequences first
    if (exercise.punchSequence && exercise.punchSequence.length > 0) {
      const sequenceStr = exercise.punchSequence.join('-');
      prompts.push({
        time: startTime,
        instruction: sequenceStr,
        type: "combo"
      });
      
      // Add variations and movement
      prompts.push({
        time: startTime + 8,
        instruction: `Double ${sequenceStr}`,
        type: "combo"
      });
      
      prompts.push({
        time: startTime + 16,
        instruction: "Duck",
        type: "defense"
      });
      
      prompts.push({
        time: startTime + 20,
        instruction: sequenceStr,
        type: "combo"
      });
      
    } else {
      // If no punch sequence, create basic prompts
      prompts.push({
        time: startTime,
        instruction: exercise.name.includes('Jab') ? '1' :
                     exercise.name.includes('Cross') ? '2' :
                     exercise.name.includes('Hook') ? '3-4' :
                     exercise.name.includes('Uppercut') ? '5-6' : '1-2',
        type: "combo"
      });
    }

    // Add movement and defense between exercises
    if (index < exercises.length - 1) {
      prompts.push({
        time: startTime + timePerExercise - 8,
        instruction: "Slip",
        type: "defense"
      });
      
      prompts.push({
        time: startTime + timePerExercise - 4,
        instruction: "Move",
        type: "movement"
      });
    }
  });

  // Closing prompts - final push
  prompts.push(
    { time: duration - 20, instruction: "Final 20 seconds!", type: "stance" },
    { time: duration - 15, instruction: "1-2", type: "combo" },
    { time: duration - 12, instruction: "3-4", type: "combo" },
    { time: duration - 8, instruction: "Double up!", type: "combo" },
    { time: duration - 4, instruction: "Strong finish!", type: "combo" },
    { time: duration - 1, instruction: "Time!", type: "stance" }
  );

  return prompts;
};

// Helper function to get any workout as timed workout
export const getUnifiedWorkout = (id: string): TimedWorkout | undefined => {
  // First try timed workouts
  let timedWorkout = getDynamicTimedWorkout(id);
  if (timedWorkout) {
    return timedWorkout;
  }

  // Then try regular workouts and convert them
  const regularWorkout = workouts.find(w => w.id === id);
  if (regularWorkout) {
    return convertToTimedWorkout(regularWorkout);
  }

  return undefined;
};

// Helper function specifically for the workout player that can access custom workouts
export const getUnifiedWorkoutWithCustom = (id: string, customWorkouts?: any[]): TimedWorkout | undefined => {
  // First try timed workouts
  let timedWorkout = getDynamicTimedWorkout(id);
  if (timedWorkout) {
    return timedWorkout;
  }

  // Then try regular workouts and convert them
  const regularWorkout = workouts.find(w => w.id === id);
  if (regularWorkout) {
    return convertToTimedWorkout(regularWorkout);
  }

  // Finally try custom workouts if provided
  if (customWorkouts) {
    const customWorkout = customWorkouts.find(w => w.id === id);
    if (customWorkout) {
      return convertCustomWorkoutToTimed(customWorkout);
    }
  }

  return undefined;
};

// Convert custom workout to timed workout format
export const convertCustomWorkoutToTimed = (customWorkout: any): TimedWorkout => {
  const exercises: TimedExercise[] = [];
  
  // Create one exercise per round
  for (let round = 1; round <= customWorkout.rounds; round++) {
    const customExercise = customWorkout.exercises[round - 1];
    
    if (customExercise) {
      // Use the custom exercise data
      const prompts: TimedPrompt[] = [];
      const duration = customExercise.duration; // Already in seconds
      
      // Generate prompts based on selected moves
      const movesCount = customExercise.selectedMoves.length;
      const timePerMove = Math.floor((duration - 20) / movesCount); // Leave 20 seconds for opening/closing
      
      // Opening
      prompts.push(
        { time: 0, instruction: `Round ${round}! Let's go!`, type: "stance" },
        { time: 3, instruction: "Hands up!", type: "stance" }
      );
      
      // Add prompts for each selected move
      customExercise.selectedMoves.forEach((move: any, index: number) => {
        const startTime = 10 + (index * timePerMove);
        
        prompts.push({
          time: startTime,
          instruction: move.displayText,
          type: move.type as any
        });
        
        // Add some variations
        if (timePerMove > 15) {
          prompts.push({
            time: startTime + Math.floor(timePerMove / 3),
            instruction: move.displayText,
            type: move.type as any
          });
          
          prompts.push({
            time: startTime + Math.floor(timePerMove * 2 / 3),
            instruction: "Good! Keep going!",
            type: "stance"
          });
        }
      });
      
      // Closing
      prompts.push(
        { time: duration - 15, instruction: "Final 15 seconds!", type: "stance" },
        { time: duration - 10, instruction: "Push through!", type: "stance" },
        { time: duration - 5, instruction: "Almost done!", type: "stance" },
        { time: duration - 1, instruction: "Time!", type: "stance" }
      );
      
      exercises.push({
        id: `${customWorkout.id}-round-${round}`,
        round: round,
        duration: duration,
        name: customExercise.name || `Round ${round}`,
        prompts: prompts
      });
    } else {
      // Generate a basic round if no custom exercise data
      exercises.push({
        id: `${customWorkout.id}-round-${round}`,
        round: round,
        duration: 180, // Default 3 minutes
        name: `Round ${round}`,
        prompts: generateDynamicPrompts(round, customWorkout.level, 180)
      });
    }
  }

  return {
    id: customWorkout.id,
    title: customWorkout.title,
    description: customWorkout.description,
    level: customWorkout.level,
    category: customWorkout.category,
    totalRounds: customWorkout.rounds,
    restBetweenRounds: customWorkout.restPeriod,
    estimatedCalories: customWorkout.calories,
    equipment: customWorkout.equipment || [],
    imageUrl: customWorkout.imageUrl || 'https://images.pexels.com/photos/7991579/pexels-photo-7991579.jpeg',
    featured: false,
    exercises: exercises
  };
};