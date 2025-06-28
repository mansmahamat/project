export interface TechniqueReference {
  id: number;
  name: string;
  category: 'Punch' | 'Defense' | 'Footwork';
  description: string;
  demoVideoURL: string;
  instructions: string[];
  tips: string[];
}

export const TECHNIQUE_REFERENCES: TechniqueReference[] = [
  {
    id: 1,
    name: 'Jab',
    category: 'Punch',
    description: 'Fast straight punch with your lead hand',
    demoVideoURL: 'https://boyegcsxgufnheudjjyj.supabase.co/storage/v1/object/public/video-demo//How%20to%20Throw%20the%20Perfect%20Jab%20in%20Boxing.mp4',
    instructions: [
      'Start in proper boxing stance',
      'Extend lead hand straight forward',
      'Rotate fist on impact',
      'Return quickly to guard position',
      'Keep rear hand protecting face'
    ],
    tips: [
      'Use the jab to measure distance',
      'Keep it fast and snappy',
      'Don\'t telegraph the punch',
      'Step forward slightly for more reach'
    ]
  },
  {
    id: 2,
    name: 'Cross',
    category: 'Punch',
    description: 'Powerful straight punch with your rear hand',
    demoVideoURL: 'https://boyegcsxgufnheudjjyj.supabase.co/storage/v1/object/public/video-demo//How%20to%20Land%20the%20Cross%20in%20Boxing%20-%20NEVER%20MISS%20A%20PUNCH.mp4',
    instructions: [
      'Rotate hips and shoulders',
      'Drive rear hand straight forward',
      'Step forward with rear foot',
      'Turn rear foot on ball',
      'Return to guard position'
    ],
    tips: [
      'Generate power from your legs and hips',
      'Keep your chin tucked',
      'Don\'t drop your lead hand',
      'Follow through the target'
    ]
  },
  {
    id: 3,
    name: 'Left Hook',
    category: 'Punch',
    description: 'Hit the side of the head with your lead hand',
    demoVideoURL: 'https://boyegcsxgufnheudjjyj.supabase.co/storage/v1/object/public/video-demo//How%20to%20Throw%20a%20Lead%20Hook%20%20_%20%204%20Variations%20of%20Lead%20Hook.mp4',
    instructions: [
      'Keep elbow at 90-degree angle',
      'Rotate on lead foot',
      'Turn hips and shoulders',
      'Keep punch tight and compact',
      'Return to guard quickly'
    ],
    tips: [
      'Great for close-range fighting',
      'Can target head or body',
      'Step to the left for better angle',
      'Keep your right hand up for defense'
    ]
  },
  {
    id: 4,
    name: 'Right Hook',
    category: 'Punch',
    description: 'Hit the side of the head with your rear hand',
    demoVideoURL: 'https://boyegcsxgufnheudjjyj.supabase.co/storage/v1/object/public/video-demo//How%20to%20throw%20the%20right%20hook%20in%20Boxing%20_%20Subscribe%20for%20more%20like%20this.mp4',
    instructions: [
      'Pivot on rear foot',
      'Keep elbow parallel to ground',
      'Rotate hips explosively',
      'Keep punch short and tight',
      'Maintain balance throughout'
    ],
    tips: [
      'Powerful finishing punch',
      'Great counter-punch',
      'Don\'t wind up the punch',
      'Keep lead hand up for protection'
    ]
  },
  {
    id: 5,
    name: 'Left Uppercut',
    category: 'Punch',
    description: 'Punch upward with your lead hand',
    demoVideoURL: 'https://boyegcsxgufnheudjjyj.supabase.co/storage/v1/object/public/video-demo//How%20to%20Throw%20Lead%20Uppercut%20in%20Boxing.mp4',
    instructions: [
      'Bend knees slightly',
      'Drive up from legs',
      'Keep elbow close to body',
      'Punch upward through target',
      'Return to guard position'
    ],
    tips: [
      'Effective at close range',
      'Can target body or chin',
      'Use your legs for power',
      'Great for getting inside'
    ]
  },
  {
    id: 6,
    name: 'Right Uppercut',
    category: 'Punch',
    description: 'Punch upward with your rear hand',
    demoVideoURL: 'https://boyegcsxgufnheudjjyj.supabase.co/storage/v1/object/public/video-demo//How%20to%20Throw%20the%20Rear%20Uppercut%20in%20Boxing%20_%203%20Range.mp4',
    instructions: [
      'Drop rear shoulder slightly',
      'Drive up with rear hand',
      'Rotate hips upward',
      'Keep punch compact',
      'Follow through upward'
    ],
    tips: [
      'Devastating knockout punch',
      'Perfect for close combat',
      'Time it with opponent\'s movement',
      'Keep your guard up after'
    ]
  },
  {
    id: 7,
    name: 'Targeting the Body',
    category: 'Punch',
    description: 'How to vary levels when boxing',
    demoVideoURL: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    instructions: [
      'Change levels smoothly between head and body shots',
      'Bend knees to get under guard for body shots',
      'Target liver, solar plexus, and ribs',
      'Mix body-head combinations unpredictably',
      'Use body shots to slow down opponent'
    ],
    tips: [
      'Body shots accumulate damage over time',
      'Great for setting up head shots',
      'Drop your level, don\'t just aim low',
      'Watch for opponent to drop guard'
    ]
  },
  {
    id: 8,
    name: 'Doubling Punches',
    category: 'Punch',
    description: 'Reload your punches and be unpredictable',
    demoVideoURL: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
    instructions: [
      'Throw the same punch twice in succession',
      'First punch gauges distance and reaction',
      'Second punch exploits opened defense',
      'Works with jabs, hooks, and crosses',
      'Vary timing between punches'
    ],
    tips: [
      'Confuses opponent\'s timing',
      'Second punch often lands cleaner',
      'Practice double jabs and double hooks',
      'Don\'t make it predictable'
    ]
  },
  {
    id: 9,
    name: 'Check Hook',
    category: 'Punch',
    description: 'A pivoting hook used to counter an aggressive opponent',
    demoVideoURL: 'https://boyegcsxgufnheudjjyj.supabase.co/storage/v1/object/public/video-demo//Boxing%20How%20to%20throw%20a%20check%20hook.mp4',
    instructions: [
      'Throw lead hook while stepping back',
      'Pivot on rear foot as you hook',
      'Creates angle while striking',
      'Perfect for pressure fighters',
      'Reset to boxing stance after'
    ],
    tips: [
      'Great counter to straight punches',
      'Catches opponent moving forward',
      'Practice the timing extensively',
      'Use when opponent pressures'
    ]
  },
  {
    id: 10,
    name: 'Flicker Jab',
    category: 'Punch',
    description: 'Fast, snapping jab thrown with minimal shoulder rotation',
    demoVideoURL: 'https://boyegcsxgufnheudjjyj.supabase.co/storage/v1/object/public/video-demo//How%20and%20Why%20to%20use%20the%20Flicker%20Jab%20in%20Boxing%20(1).mp4',
    instructions: [
      'Throw jab with minimal telegraph',
      'Use mostly arm extension',
      'Keep shoulder movement subtle',
      'Focus on speed over power',
      'Return hand quickly to guard'
    ],
    tips: [
      'Hard for opponent to see coming',
      'Perfect for interrupting attacks',
      'Use to control distance',
      'Made famous by Thomas Hearns'
    ]
  },
  {
    id: 11,
    name: 'Philly Shell',
    category: 'Defense',
    description: 'A different kind of stance made for blocking and countering',
    demoVideoURL: 'https://boyegcsxgufnheudjjyj.supabase.co/storage/v1/object/public/video-demo//Philly%20Shell%20Defense%20_%20Boxing%20_%20How%20To%20_%20Boxing%20Tutorial.mp4',
    instructions: [
      'Lead hand drops low, rear hand high',
      'Lead shoulder up to deflect jabs',
      'Slight crouch for better angles',
      'Use lead shoulder as shield',
      'Counter immediately after deflection'
    ],
    tips: [
      'Made famous by Floyd Mayweather',
      'Great for counter-punchers',
      'Requires excellent timing',
      'Not recommended for beginners'
    ]
  },
  {
    id: 12,
    name: 'Slipping',
    category: 'Defense',
    description: 'A lateral movement where you slightly shift your head to either side to make a punch miss',
    demoVideoURL: 'https://boyegcsxgufnheudjjyj.supabase.co/storage/v1/object/public/video-demo//How%20To%20Slip%20Punches%20_%20Beginner%20Boxing%20Defense%20Training.mp4',
    instructions: [
      'Slight bend at waist',
      'Move head to outside of punch',
      'Keep feet planted',
      'Maintain guard position',
      'Return to center quickly'
    ],
    tips: [
      'Effective against straight punches',
      'Minimal movement required',
      'Sets up counter opportunities',
      'Practice slipping left and right'
    ]
  },
  {
    id: 13,
    name: 'Roll',
    category: 'Defense',
    description: 'A defensive movement where you bend your knees and move your head under a punch to avoid it',
    demoVideoURL: 'https://boyegcsxgufnheudjjyj.supabase.co/storage/v1/object/public/video-demo//How%20to%20Roll%20a%20Punch%20in%20Boxing%20_%20Defense%20101.mp4',
    instructions: [
      'Bend at knees and waist',
      'Keep hands up',
      'Roll head in circular motion',
      'Stay low throughout movement',
      'Come up ready to counter'
    ],
    tips: [
      'Great against hooks and uppercuts',
      'Keep your eyes on opponent',
      'Don\'t roll too far',
      'Practice both directions'
    ]
  },
  {
    id: 14,
    name: 'Dodge',
    category: 'Defense',
    description: 'A quick defensive movement to get completely out of range of an oncoming punch',
    demoVideoURL: 'https://boyegcsxgufnheudjjyj.supabase.co/storage/v1/object/public/video-demo//How%20To%20Dodge%20Punches%20_%204%20Drills%20For%20Boxing%20Head%20movement.mp4',
    instructions: [
      'Step back or to the side',
      'Keep hands up',
      'Maintain balance',
      'Watch for follow-up attacks',
      'Look for counter opportunities'
    ],
    tips: [
      'Creates distance from opponent',
      'Good for resetting position',
      'Don\'t back straight up',
      'Use angles when possible'
    ]
  },
  {
    id: 15,
    name: 'Stance',
    category: 'Footwork',
    description: 'One foot forward, hands to the chin',
    demoVideoURL: "https://boyegcsxgufnheudjjyj.supabase.co/storage/v1/object/public/video-demo//5%20Boxing%20Stance%20Mistakes%20you%20Shouldn't%20Do.mp4",
    instructions: [
      'Lead foot forward, rear foot back',
      'Feet shoulder-width apart',
      'Weight balanced on both feet',
      'Hands up protecting chin',
      'Knees slightly bent'
    ],
    tips: [
      'Foundation of all boxing',
      'Orthodox: left foot forward',
      'Southpaw: right foot forward',
      'Stay comfortable and balanced'
    ]
  },
  {
    id: 16,
    name: 'Footwork',
    category: 'Footwork',
    description: 'Always stay in movement when training with the app. Remaining active and stable is trickier than you\'d think',
    demoVideoURL: 'https://boyegcsxgufnheudjjyj.supabase.co/storage/v1/object/public/video-demo//videoplayback.mp4',
    instructions: [
      'Stay on balls of feet',
      'Keep feet shoulder-width apart',
      'Never cross feet',
      'Move with purpose',
      'Maintain boxing stance'
    ],
    tips: [
      'Foundation of all boxing',
      'Control distance and angles',
      'Practice ladder drills',
      'Stay light on your feet'
    ]
  },
  {
    id: 17,
    name: 'Pivot',
    category: 'Footwork',
    description: 'Rotate on one foot to create angles',
    demoVideoURL: 'https://boyegcsxgufnheudjjyj.supabase.co/storage/v1/object/public/video-demo//videoplayback%20(1).mp4',
    instructions: [
      'Pivot on front foot',
      'Turn body to create new angle',
      'Keep rear foot light',
      'Maintain balance throughout',
      'Reset to proper stance'
    ],
    tips: [
      'Great for avoiding straight attacks',
      'Creates counter-punch opportunities',
      'Practice both left and right pivots',
      'Don\'t over-rotate'
    ]
  },
  {
    id: 18,
    name: 'Shifting',
    category: 'Footwork',
    description: 'Quickly change your angle to gain an advantage',
    demoVideoURL: 'https://boyegcsxgufnheudjjyj.supabase.co/storage/v1/object/public/video-demo//videoplayback%20(2).mp4',
    instructions: [
      'Switch lead foot quickly',
      'Change stance temporarily',
      'Attack from new angle',
      'Return to original stance',
      'Maintain balance during shift'
    ],
    tips: [
      'Confuses opponent\'s timing',
      'Advanced footwork technique',
      'Creates unexpected angles',
      'Practice slowly at first'
    ]
  },
  {
    id: 19,
    name: 'L Step',
    category: 'Footwork',
    description: 'Evade attacks and creates counter angles',
    demoVideoURL: 'https://boyegcsxgufnheudjjyj.supabase.co/storage/v1/object/public/video-demo//videoplayback%20(3).mp4',
    instructions: [
      'Step to the side at 90-degree angle',
      'Move off the opponent\'s centerline',
      'Keep hands up during movement',
      'Position for counter-attack',
      'Reset to boxing stance'
    ],
    tips: [
      'Great for avoiding combinations',
      'Creates perfect counter opportunities',
      'Practice stepping both directions',
      'Keep your guard up while moving'
    ]
  },
  {
    id: 20,
    name: 'Shadow Boxing Tips',
    category: 'Footwork',
    description: 'Keep moving, stay engaged',
    demoVideoURL: 'https://boyegcsxgufnheudjjyj.supabase.co/storage/v1/object/public/video-demo//Quick%20Shadow%20Boxing%20Tutorial%20by%20Olympian.mp4',
    instructions: [
      'Visualize an opponent in front of you',
      'Move constantly - never static',
      'Practice combinations you use in training',
      'Include defensive movements',
      'Work on timing and rhythm'
    ],
    tips: [
      'Perfect technique when no pressure',
      'Build muscle memory',
      'Focus on form over speed',
      'Imagine countering opponent attacks'
    ]
  }
];

export const getTechniquesByCategory = (category: 'Punch' | 'Defense' | 'Footwork') => {
  return TECHNIQUE_REFERENCES.filter(technique => technique.category === category);
};

export const getTechniqueById = (id: number): TechniqueReference | undefined => {
  return TECHNIQUE_REFERENCES.find(technique => technique.id === id);
};

export const getPunchTechniques = () => {
  return getTechniquesByCategory('Punch');
};

export const getDefenseTechniques = () => {
  return getTechniquesByCategory('Defense');
};

export const getFootworkTechniques = () => {
  return getTechniquesByCategory('Footwork');
};

export const getAllTechniques = () => {
  return TECHNIQUE_REFERENCES;
};

export const getBasicPunches = () => {
  return TECHNIQUE_REFERENCES.filter(technique => 
    technique.id >= 1 && technique.id <= 6
  );
};

export const getAdvancedTechniques = () => {
  return TECHNIQUE_REFERENCES.filter(technique => 
    technique.id >= 7 && technique.id <= 10
  );
};

export const getMovementTechniques = () => {
  return TECHNIQUE_REFERENCES.filter(technique => 
    technique.category === 'Footwork'
  );
};