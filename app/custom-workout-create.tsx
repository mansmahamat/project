import React, { useState, useContext, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Alert,
  SafeAreaView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { 
  ArrowLeft, 
  Save, 
  Plus, 
  Minus, 
  Clock, 
  Target,
  Dumbbell,
  Shield,
  Navigation,
  Heart,
  User
} from 'lucide-react-native';
import { 
  useCustomWorkoutStore, 
  AVAILABLE_MOVES, 
  getMovesByType, 
  CustomMove,
  CustomExercise 
} from '@/stores/useCustomWorkoutStore';
import { RevenueCatContext } from '@/hooks/useRevenueCat';

export default function CustomWorkoutCreateScreen() {
  const router = useRouter();
  const addCustomWorkout = useCustomWorkoutStore((state) => state.addCustomWorkout);
  
  // Premium check
  const { customerInfo } = useContext(RevenueCatContext);
  const activeEntitlements = customerInfo?.activeSubscriptions;
  const isPro = !!activeEntitlements?.length;

  // Redirect non-premium users
  useEffect(() => {
    if (!isPro) {
      Alert.alert(
        'Premium Feature',
        'Custom workouts are a premium feature. Please upgrade to create custom workouts.',
        [
          {
            text: 'OK',
            onPress: () => router.back()
          }
        ]
      );
    }
  }, [isPro, router]);

  // Workout Settings
  const [workoutName, setWorkoutName] = useState('');
  const [workoutDescription, setWorkoutDescription] = useState('');
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
    { type: 'combo' as const, label: 'Combos', icon: Target, color: '#FF6B35' },
    { type: 'defense' as const, label: 'Defense', icon: Shield, color: '#3B82F6' },
    { type: 'movement' as const, label: 'Movement', icon: Navigation, color: '#10B981' },
    { type: 'breathing' as const, label: 'Breathing', icon: Heart, color: '#8B5CF6' },
    { type: 'stance' as const, label: 'Stance', icon: User, color: '#F59E0B' },
  ];

  const handleAddRound = () => {
    if (totalRounds < 10) {
      const newRoundNumber = totalRounds + 1;
      setTotalRounds(newRoundNumber);
      setRoundMoves(prev => ({
        ...prev,
        [newRoundNumber]: []
      }));
    }
  };

  const handleRemoveRound = () => {
    if (totalRounds > 1) {
      const roundToRemove = totalRounds;
      setTotalRounds(totalRounds - 1);
      setRoundMoves(prev => {
        const newRounds = { ...prev };
        delete newRounds[roundToRemove];
        return newRounds;
      });
      
      // If we're viewing the removed round, switch to the last available round
      if (selectedRound === roundToRemove) {
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

    if (!workoutDescription.trim()) {
      Alert.alert('Error', 'Please enter a workout description');
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
          <ArrowLeft size={24} color="#1F2937" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Create Custom Workout</Text>
        <TouchableOpacity style={styles.saveButton} onPress={handleSaveWorkout}>
          <Save size={20} color="#FF6B35" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Workout Info */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Workout Information</Text>
          
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Workout Name</Text>
            <TextInput
              style={styles.textInput}
              placeholder="My Custom Workout"
              value={workoutName}
              onChangeText={setWorkoutName}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Description</Text>
            <TextInput
              style={[styles.textInput, styles.textArea]}
              placeholder="Describe your workout..."
              value={workoutDescription}
              onChangeText={setWorkoutDescription}
              multiline
              numberOfLines={3}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Difficulty Level</Text>
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
        </View>

        {/* Workout Settings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Workout Settings</Text>
          
          <View style={styles.settingsGrid}>
            <View style={styles.settingItem}>
              <Text style={styles.settingLabel}>Total Rounds</Text>
              <View style={styles.counterContainer}>
                <TouchableOpacity 
                  style={styles.counterButton} 
                  onPress={handleRemoveRound}
                  disabled={totalRounds <= 1}
                >
                  <Minus size={16} color={totalRounds <= 1 ? "#9CA3AF" : "#374151"} />
                </TouchableOpacity>
                <Text style={styles.counterValue}>{totalRounds}</Text>
                <TouchableOpacity 
                  style={styles.counterButton} 
                  onPress={handleAddRound}
                  disabled={totalRounds >= 10}
                >
                  <Plus size={16} color={totalRounds >= 10 ? "#9CA3AF" : "#374151"} />
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.settingItem}>
              <Text style={styles.settingLabel}>Round Duration</Text>
              <View style={styles.durationContainer}>
                <TouchableOpacity 
                  style={styles.durationButton}
                  onPress={() => setRoundDuration(Math.max(60, roundDuration - 30))}
                >
                  <Minus size={16} color="#374151" />
                </TouchableOpacity>
                <Text style={styles.durationText}>{Math.floor(roundDuration / 60)}:{(roundDuration % 60).toString().padStart(2, '0')}</Text>
                <TouchableOpacity 
                  style={styles.durationButton}
                  onPress={() => setRoundDuration(Math.min(600, roundDuration + 30))}
                >
                  <Plus size={16} color="#374151" />
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.settingItem}>
              <Text style={styles.settingLabel}>Rest Between Rounds</Text>
              <View style={styles.durationContainer}>
                <TouchableOpacity 
                  style={styles.durationButton}
                  onPress={() => setRestBetweenRounds(Math.max(15, restBetweenRounds - 15))}
                >
                  <Minus size={16} color="#374151" />
                </TouchableOpacity>
                <Text style={styles.durationText}>{restBetweenRounds}s</Text>
                <TouchableOpacity 
                  style={styles.durationButton}
                  onPress={() => setRestBetweenRounds(Math.min(120, restBetweenRounds + 15))}
                >
                  <Plus size={16} color="#374151" />
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.settingItem}>
              <Text style={styles.settingLabel}>Estimated Calories</Text>
              <Text style={styles.caloriesValue}>{calculateEstimatedCalories()} cal</Text>
            </View>
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
                  selectedMoveType === type && styles.moveTypeButtonActive,
                  { borderColor: color }
                ]}
                onPress={() => setSelectedMoveType(type)}
              >
                <Icon 
                  size={20} 
                  color={selectedMoveType === type ? '#FFFFFF' : color} 
                />
                <Text style={[
                  styles.moveTypeText,
                  selectedMoveType === type && styles.moveTypeTextActive,
                  { color: selectedMoveType === type ? '#FFFFFF' : color }
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
                        {move.intensity.toUpperCase()}
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
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
  },
  saveButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollView: {
    flex: 1,
  },
  section: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 16,
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 8,
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    color: '#1F2937',
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
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    alignItems: 'center',
  },
  levelButtonActive: {
    backgroundColor: '#FF6B35',
    borderColor: '#FF6B35',
  },
  levelButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6B7280',
  },
  levelButtonTextActive: {
    color: '#FFFFFF',
  },
  settingsGrid: {
    gap: 16,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  settingLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    flex: 1,
  },
  counterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  counterButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  counterValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    minWidth: 20,
    textAlign: 'center',
  },
  durationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  durationButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  durationText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
    minWidth: 40,
    textAlign: 'center',
  },
  caloriesValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FF6B35',
  },
  roundTabs: {
    flexDirection: 'row',
  },
  roundTab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    flexDirection: 'row',
    alignItems: 'center',
  },
  roundTabActive: {
    backgroundColor: '#FF6B35',
  },
  roundTabText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6B7280',
  },
  roundTabTextActive: {
    color: '#FFFFFF',
  },
  roundBadge: {
    marginLeft: 8,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  roundBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FF6B35',
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
    borderWidth: 2,
    backgroundColor: '#FFFFFF',
  },
  moveTypeButtonActive: {
    backgroundColor: '#FF6B35',
  },
  moveTypeText: {
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 6,
  },
  moveTypeTextActive: {
    color: '#FFFFFF',
  },
  movesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  moveCard: {
    width: '48%',
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    padding: 12,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  moveCardSelected: {
    backgroundColor: '#FFF5F5',
    borderColor: '#FF6B35',
  },
  moveHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  moveDisplayText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
  },
  moveDisplayTextSelected: {
    color: '#FF6B35',
  },
  intensityBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  intensityText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  moveDescription: {
    fontSize: 12,
    color: '#6B7280',
    lineHeight: 16,
  },
  moveDescriptionSelected: {
    color: '#374151',
  },
  selectedMovesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  selectedMoveChip: {
    backgroundColor: '#FF6B35',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  selectedMoveText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#FFFFFF',
  },
  bottomPadding: {
    height: 100,
  },
}); 