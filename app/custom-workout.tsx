import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  TextInput,
  Alert,
} from 'react-native';
import { ArrowLeft, Plus, Minus, Play, Target, Shield, Navigation, Heart, User, Save } from 'lucide-react-native';
import { router } from 'expo-router';
import { 
  useCustomWorkoutStore, 
  AVAILABLE_MOVES, 
  getMovesByType, 
  CustomMove,
  CustomExercise 
} from '@/stores/useCustomWorkoutStore';

export default function CustomWorkoutScreen() {
  const addCustomWorkout = useCustomWorkoutStore((state) => state.addCustomWorkout);

  // Workout Settings
  const [workoutName, setWorkoutName] = useState('My Custom Workout');
  const [workoutDescription, setWorkoutDescription] = useState('A custom boxing workout');
  const [workoutLevel, setWorkoutLevel] = useState<'Beginner' | 'Intermediate' | 'Advanced'>('Beginner');
  const [totalRounds, setTotalRounds] = useState(3);
  const [roundDuration, setRoundDuration] = useState(180); // 3 minutes in seconds
  const [restBetweenRounds, setRestBetweenRounds] = useState(60);

  // Round Configuration
  const [selectedRound, setSelectedRound] = useState(1);
  const [roundMoves, setRoundMoves] = useState<{ [roundNumber: number]: string[] }>({
    1: []
  });

  // Move selection
  const [selectedMoveType, setSelectedMoveType] = useState<'combo' | 'defense' | 'movement' | 'breathing' | 'stance'>('combo');

  const moveTypes = [
    { type: 'combo' as const, label: 'Combos', icon: Target, color: '#FF4500' },
    { type: 'defense' as const, label: 'Defense', icon: Shield, color: '#3B82F6' },
    { type: 'movement' as const, label: 'Movement', icon: Navigation, color: '#10B981' },
    { type: 'breathing' as const, label: 'Breathing', icon: Heart, color: '#8B5CF6' },
    { type: 'stance' as const, label: 'Stance', icon: User, color: '#F59E0B' },
  ];

  // Initialize rounds when totalRounds changes
  React.useEffect(() => {
    const newRoundMoves: { [roundNumber: number]: string[] } = {};
    for (let i = 1; i <= totalRounds; i++) {
      newRoundMoves[i] = roundMoves[i] || [];
    }
    setRoundMoves(newRoundMoves);
  }, [totalRounds]);

  const handleAddRound = () => {
    if (totalRounds < 10) {
      setTotalRounds(totalRounds + 1);
    }
  };

  const handleRemoveRound = () => {
    if (totalRounds > 1) {
      setTotalRounds(totalRounds - 1);
      if (selectedRound > totalRounds - 1) {
        setSelectedRound(totalRounds - 1);
      }
    }
  };

  const toggleMoveForRound = (moveId: string, roundNumber: number) => {
    setRoundMoves(prev => {
      const currentMoves = prev[roundNumber] || [];
      const isSelected = currentMoves.includes(moveId);
      
      return {
        ...prev,
        [roundNumber]: isSelected 
          ? currentMoves.filter(id => id !== moveId)
          : [...currentMoves, moveId]
      };
    });
  };

  const calculateEstimatedCalories = () => {
    const baseCaloriesPerMinute = workoutLevel === 'Beginner' ? 8 : workoutLevel === 'Intermediate' ? 10 : 12;
    const totalWorkoutMinutes = (totalRounds * roundDuration) / 60;
    return Math.round(totalWorkoutMinutes * baseCaloriesPerMinute);
  };

  const handleSaveWorkout = () => {
    if (!workoutName.trim()) {
      Alert.alert('Error', 'Please enter a workout name');
      return;
    }

    // Check if all rounds have at least one move
    for (let i = 1; i <= totalRounds; i++) {
      if (!roundMoves[i] || roundMoves[i].length === 0) {
        Alert.alert('Error', `Round ${i} needs at least one move selected`);
        return;
      }
    }

    // Create exercises for each round
    const exercises: CustomExercise[] = [];
    for (let i = 1; i <= totalRounds; i++) {
      const selectedMoveIds = roundMoves[i] || [];
      const selectedMoveObjects = selectedMoveIds.map(id => 
        AVAILABLE_MOVES.find(move => move.id === id)
      ).filter(Boolean) as CustomMove[];

      exercises.push({
        id: `round-${i}`,
        name: `Round ${i}`,
        description: `Custom round ${i} with ${selectedMoveObjects.length} moves`,
        duration: roundDuration,
        selectedMoves: selectedMoveObjects
      });
    }

    const customWorkout = {
      title: workoutName,
      description: workoutDescription,
      level: workoutLevel,
      category: 'Freestyle' as const,
      duration: Math.round((totalRounds * roundDuration + (totalRounds - 1) * restBetweenRounds) / 60),
      rounds: totalRounds,
      restPeriod: restBetweenRounds,
      calories: calculateEstimatedCalories(),
      equipment: [] as string[],
      imageUrl: 'https://images.pexels.com/photos/4761671/pexels-photo-4761671.jpeg',
      isCustom: true as const,
      exercises
    };

    addCustomWorkout(customWorkout);
    
    Alert.alert(
      'Workout Created!', 
      'Your custom workout has been saved successfully.',
      [
        {
          text: 'OK',
          onPress: () => router.back()
        }
      ]
    );
  };

  const currentRoundMoves = roundMoves[selectedRound] || [];
  const availableMoves = getMovesByType(selectedMoveType);

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <ArrowLeft size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.title}>Create Custom Workout</Text>
        <TouchableOpacity style={styles.saveButton} onPress={handleSaveWorkout}>
          <Save size={20} color="#FF4500" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Workout Info */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Workout Information</Text>
          
          <TextInput
            style={styles.textInput}
            placeholder="Workout Name"
            placeholderTextColor="#666"
            value={workoutName}
            onChangeText={setWorkoutName}
          />

          <TextInput
            style={[styles.textInput, styles.textArea]}
            placeholder="Workout Description"
            placeholderTextColor="#666"
            value={workoutDescription}
            onChangeText={setWorkoutDescription}
            multiline
            numberOfLines={3}
          />

          <View style={styles.levelButtons}>
            {(['Beginner', 'Intermediate', 'Advanced'] as const).map((level) => (
              <TouchableOpacity
                key={level}
                style={[
                  styles.levelButton,
                  workoutLevel === level && styles.levelButtonActive
                ]}
                onPress={() => setWorkoutLevel(level)}
              >
                <Text style={[
                  styles.levelButtonText,
                  workoutLevel === level && styles.levelButtonTextActive
                ]}>
                  {level}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Workout Settings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Workout Settings</Text>
          
          <View style={styles.settingRow}>
            <Text style={styles.settingLabel}>Total Rounds</Text>
            <View style={styles.counter}>
              <TouchableOpacity 
                style={styles.counterButton} 
                onPress={handleRemoveRound}
                disabled={totalRounds <= 1}
              >
                <Minus size={16} color={totalRounds <= 1 ? "#666" : "#fff"} />
              </TouchableOpacity>
              <Text style={styles.counterValue}>{totalRounds}</Text>
              <TouchableOpacity 
                style={styles.counterButton} 
                onPress={handleAddRound}
                disabled={totalRounds >= 10}
              >
                <Plus size={16} color={totalRounds >= 10 ? "#666" : "#fff"} />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.settingRow}>
            <Text style={styles.settingLabel}>Round Duration</Text>
            <View style={styles.counter}>
              <TouchableOpacity 
                style={styles.counterButton}
                onPress={() => setRoundDuration(Math.max(60, roundDuration - 30))}
              >
                <Minus size={16} color="#fff" />
              </TouchableOpacity>
              <Text style={styles.counterValue}>{Math.floor(roundDuration / 60)}:{(roundDuration % 60).toString().padStart(2, '0')}</Text>
              <TouchableOpacity 
                style={styles.counterButton}
                onPress={() => setRoundDuration(Math.min(600, roundDuration + 30))}
              >
                <Plus size={16} color="#fff" />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.settingRow}>
            <Text style={styles.settingLabel}>Rest Between Rounds</Text>
            <View style={styles.counter}>
              <TouchableOpacity 
                style={styles.counterButton}
                onPress={() => setRestBetweenRounds(Math.max(15, restBetweenRounds - 15))}
              >
                <Minus size={16} color="#fff" />
              </TouchableOpacity>
              <Text style={styles.counterValue}>{restBetweenRounds}s</Text>
              <TouchableOpacity 
                style={styles.counterButton}
                onPress={() => setRestBetweenRounds(Math.min(120, restBetweenRounds + 15))}
              >
                <Plus size={16} color="#fff" />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.settingRow}>
            <Text style={styles.settingLabel}>Estimated Calories</Text>
            <Text style={styles.caloriesValue}>{calculateEstimatedCalories()} cal</Text>
          </View>
        </View>

        {/* Round Selection */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Configure Rounds</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.roundTabs}>
            {Array.from({ length: totalRounds }, (_, i) => i + 1).map((roundNum) => (
              <TouchableOpacity
                key={roundNum}
                style={[
                  styles.roundTab,
                  selectedRound === roundNum && styles.roundTabActive
                ]}
                onPress={() => setSelectedRound(roundNum)}
              >
                <Text style={[
                  styles.roundTabText,
                  selectedRound === roundNum && styles.roundTabTextActive
                ]}>
                  Round {roundNum}
                </Text>
                {roundMoves[roundNum] && roundMoves[roundNum].length > 0 && (
                  <View style={styles.roundBadge}>
                    <Text style={styles.roundBadgeText}>{roundMoves[roundNum].length}</Text>
                  </View>
                )}
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Move Type Selection */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Select Move Type</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.moveTypeContainer}>
            {moveTypes.map(({ type, label, icon: Icon, color }) => (
              <TouchableOpacity
                key={type}
                style={[
                  styles.moveTypeButton,
                  selectedMoveType === type && { backgroundColor: color }
                ]}
                onPress={() => setSelectedMoveType(type)}
              >
                <Icon 
                  size={20} 
                  color={selectedMoveType === type ? '#fff' : color} 
                />
                <Text style={[
                  styles.moveTypeText,
                  { color: selectedMoveType === type ? '#fff' : color }
                ]}>
                  {label}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Available Moves */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            Add {moveTypes.find(t => t.type === selectedMoveType)?.label} to Round {selectedRound}
          </Text>
          <View style={styles.movesGrid}>
            {availableMoves.map((move) => {
              const isSelected = currentRoundMoves.includes(move.id);
              return (
                <TouchableOpacity
                  key={move.id}
                  style={[
                    styles.moveCard,
                    isSelected && styles.moveCardSelected
                  ]}
                  onPress={() => toggleMoveForRound(move.id, selectedRound)}
                >
                  <View style={styles.moveHeader}>
                    <Text style={[
                      styles.moveDisplayText,
                      isSelected && styles.moveDisplayTextSelected
                    ]}>
                      {move.displayText}
                    </Text>
                    <View style={[
                      styles.intensityBadge,
                      { backgroundColor: 
                        move.intensity === 'low' ? '#10B981' :
                        move.intensity === 'medium' ? '#F59E0B' : '#EF4444'
                      }
                    ]}>
                      <Text style={styles.intensityText}>
                        {move.intensity.charAt(0).toUpperCase()}
                      </Text>
                    </View>
                  </View>
                  <Text style={[
                    styles.moveDescription,
                    isSelected && styles.moveDescriptionSelected
                  ]}>
                    {move.description}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Selected Moves Preview */}
        {currentRoundMoves.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Round {selectedRound} Selected Moves ({currentRoundMoves.length})</Text>
            <View style={styles.selectedMovesContainer}>
              {currentRoundMoves.map((moveId) => {
                const move = AVAILABLE_MOVES.find(m => m.id === moveId);
                if (!move) return null;
                return (
                  <View key={moveId} style={styles.selectedMoveChip}>
                    <Text style={styles.selectedMoveText}>{move.displayText}</Text>
                  </View>
                );
              })}
            </View>
          </View>
        )}

        <View style={styles.bottomPadding} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a1a',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
  },
  backButton: {
    width: 40,
    height: 40,
    backgroundColor: '#333',
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveButton: {
    width: 40,
    height: 40,
    backgroundColor: '#333',
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: '#fff',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#fff',
    marginBottom: 16,
  },
  textInput: {
    backgroundColor: '#2a2a2a',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#fff',
    marginBottom: 12,
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  levelButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  levelButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#2a2a2a',
    borderRadius: 12,
    alignItems: 'center',
  },
  levelButtonActive: {
    backgroundColor: '#FF4500',
  },
  levelButtonText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#ccc',
  },
  levelButtonTextActive: {
    color: '#fff',
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  settingLabel: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#fff',
    flex: 1,
  },
  counter: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2a2a2a',
    borderRadius: 12,
    padding: 4,
  },
  counterButton: {
    width: 32,
    height: 32,
    backgroundColor: '#333',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  counterValue: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#fff',
    marginHorizontal: 16,
    minWidth: 40,
    textAlign: 'center',
  },
  caloriesValue: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#FF4500',
  },
  roundTabs: {
    flexDirection: 'row',
  },
  roundTab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
    borderRadius: 20,
    backgroundColor: '#2a2a2a',
    flexDirection: 'row',
    alignItems: 'center',
  },
  roundTabActive: {
    backgroundColor: '#FF4500',
  },
  roundTabText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#ccc',
  },
  roundTabTextActive: {
    color: '#fff',
  },
  roundBadge: {
    marginLeft: 8,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  roundBadgeText: {
    fontSize: 12,
    fontFamily: 'Inter-Bold',
    color: '#FF4500',
  },
  moveTypeContainer: {
    flexDirection: 'row',
  },
  moveTypeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginRight: 12,
    borderRadius: 20,
    backgroundColor: '#2a2a2a',
  },
  moveTypeText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    marginLeft: 6,
  },
  movesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  moveCard: {
    width: '48%',
    backgroundColor: '#2a2a2a',
    borderRadius: 12,
    padding: 12,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  moveCardSelected: {
    backgroundColor: 'rgba(255, 69, 0, 0.1)',
    borderColor: '#FF4500',
  },
  moveHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  moveDisplayText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#fff',
  },
  moveDisplayTextSelected: {
    color: '#FF4500',
  },
  intensityBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  intensityText: {
    fontSize: 10,
    fontFamily: 'Inter-Bold',
    color: '#fff',
  },
  moveDescription: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#ccc',
    lineHeight: 16,
  },
  moveDescriptionSelected: {
    color: '#fff',
  },
  selectedMovesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  selectedMoveChip: {
    backgroundColor: '#FF4500',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  selectedMoveText: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#fff',
  },
  bottomPadding: {
    height: 100,
  },
});