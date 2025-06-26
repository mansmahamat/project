import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  ScrollView,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { User, Save, X, Edit3, Activity } from 'lucide-react-native';
import { useOnboardingStore, UserProfile } from '@/stores';

interface EditableProfileSectionProps {
  onCancel: () => void;
}

export default function EditableProfileSection({ onCancel }: EditableProfileSectionProps) {
  const router = useRouter();
  const userProfile = useOnboardingStore((state) => state.userProfile);
  const updateUserProfile = useOnboardingStore((state) => state.updateUserProfile);
  const calculateBMR = useOnboardingStore((state) => state.calculateBMR);
  const calculateDailyCalories = useOnboardingStore((state) => state.calculateDailyCalories);
  const getRecommendedWorkoutLevel = useOnboardingStore((state) => state.getRecommendedWorkoutLevel);
  const getRecommendedRestPeriod = useOnboardingStore((state) => state.getRecommendedRestPeriod);

  const [editedProfile, setEditedProfile] = useState<UserProfile>(
    userProfile || {
      gender: 'male',
      age: '',
      height: '',
      weight: '',
      stance: 'orthodox',
      experience: 'beginner',
      goals: [],
      fitnessLevel: 'moderate',
      injuries: '',
    }
  );

  const updateField = (field: keyof UserProfile, value: any) => {
    setEditedProfile(prev => ({ ...prev, [field]: value }));
  };

  const toggleGoal = (goal: string) => {
    setEditedProfile(prev => ({
      ...prev,
      goals: prev.goals.includes(goal)
        ? prev.goals.filter(g => g !== goal)
        : [...prev.goals, goal]
    }));
  };

  const validateAndSave = () => {
    // Basic validation
    if (!editedProfile.age || !editedProfile.height || !editedProfile.weight) {
      Alert.alert('Validation Error', 'Please fill in age, height, and weight.');
      return;
    }

    if (editedProfile.goals.length === 0) {
      Alert.alert('Validation Error', 'Please select at least one training goal.');
      return;
    }

    // Update the store
    updateUserProfile(editedProfile);
    
    Alert.alert(
      'Profile Updated',
      'Your profile has been successfully updated!',
      [{ text: 'OK', onPress: onCancel }]
    );
  };

  const bmr = calculateBMR();
  const dailyCalories = calculateDailyCalories();
  const recommendedLevel = getRecommendedWorkoutLevel();
  const recommendedRest = getRecommendedRestPeriod();

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <User size={20} color="#FF6B35" />
          <Text style={styles.title}>Edit Profile</Text>
        </View>
        <View style={styles.headerRight}>
          <TouchableOpacity style={styles.cancelButton} onPress={onCancel}>
            <X size={20} color="#6B7280" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Basic Information */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Basic Information</Text>
        
        <View style={styles.fieldGroup}>
          <Text style={styles.fieldLabel}>Gender</Text>
          <View style={styles.optionRow}>
            {['male', 'female', 'other'].map((option) => (
              <TouchableOpacity
                key={option}
                style={[
                  styles.optionButton,
                  editedProfile.gender === option && styles.optionButtonActive
                ]}
                onPress={() => updateField('gender', option)}
              >
                <Text style={[
                  styles.optionText,
                  editedProfile.gender === option && styles.optionTextActive
                ]}>
                  {option.charAt(0).toUpperCase() + option.slice(1)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.fieldGroup}>
          <Text style={styles.fieldLabel}>Age</Text>
          <TextInput
            style={styles.textInput}
            placeholder="Enter your age"
            value={editedProfile.age}
            onChangeText={(text) => updateField('age', text)}
            keyboardType="numeric"
          />
        </View>

        <View style={styles.fieldGroup}>
          <Text style={styles.fieldLabel}>Height (cm)</Text>
          <TextInput
            style={styles.textInput}
            placeholder="170"
            value={editedProfile.height}
            onChangeText={(text) => updateField('height', text)}
            keyboardType="numeric"
          />
        </View>

        <View style={styles.fieldGroup}>
          <Text style={styles.fieldLabel}>Weight (kg)</Text>
          <TextInput
            style={styles.textInput}
            placeholder="70"
            value={editedProfile.weight}
            onChangeText={(text) => updateField('weight', text)}
            keyboardType="numeric"
          />
        </View>
      </View>

      {/* Boxing Setup */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Boxing Setup</Text>
        
        <View style={styles.fieldGroup}>
          <Text style={styles.fieldLabel}>Stance</Text>
          <View style={styles.optionRow}>
            {['orthodox', 'southpaw'].map((option) => (
              <TouchableOpacity
                key={option}
                style={[
                  styles.optionButton,
                  editedProfile.stance === option && styles.optionButtonActive
                ]}
                onPress={() => updateField('stance', option)}
              >
                <Text style={[
                  styles.optionText,
                  editedProfile.stance === option && styles.optionTextActive
                ]}>
                  {option.charAt(0).toUpperCase() + option.slice(1)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.fieldGroup}>
          <Text style={styles.fieldLabel}>Experience Level</Text>
          <View style={styles.optionColumn}>
            {[
              { key: 'beginner', label: 'Beginner', desc: 'New to boxing' },
              { key: 'intermediate', label: 'Intermediate', desc: '6 months - 2 years' },
              { key: 'advanced', label: 'Advanced', desc: '2+ years' }
            ].map((option) => (
              <TouchableOpacity
                key={option.key}
                style={[
                  styles.experienceOption,
                  editedProfile.experience === option.key && styles.experienceOptionActive
                ]}
                onPress={() => updateField('experience', option.key)}
              >
                <View style={styles.experienceContent}>
                  <Text style={[
                    styles.experienceLabel,
                    editedProfile.experience === option.key && styles.experienceLabelActive
                  ]}>
                    {option.label}
                  </Text>
                  <Text style={styles.experienceDesc}>{option.desc}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>

      {/* Goals & Fitness */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Goals & Fitness</Text>
        
        <View style={styles.fieldGroup}>
          <Text style={styles.fieldLabel}>Training Goals</Text>
          <View style={styles.goalsGrid}>
            {[
              'Lose Weight', 'Build Muscle', 'Learn Self-Defense',
              'Improve Fitness', 'Stress Relief', 'Competition Prep'
            ].map((goal) => (
              <TouchableOpacity
                key={goal}
                style={[
                  styles.goalChip,
                  editedProfile.goals.includes(goal) && styles.goalChipActive
                ]}
                onPress={() => toggleGoal(goal)}
              >
                <Text style={[
                  styles.goalText,
                  editedProfile.goals.includes(goal) && styles.goalTextActive
                ]}>
                  {goal}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.fieldGroup}>
          <Text style={styles.fieldLabel}>Fitness Level</Text>
          <View style={styles.optionRow}>
            {['low', 'moderate', 'high'].map((option) => (
              <TouchableOpacity
                key={option}
                style={[
                  styles.optionButton,
                  editedProfile.fitnessLevel === option && styles.optionButtonActive
                ]}
                onPress={() => updateField('fitnessLevel', option)}
              >
                <Text style={[
                  styles.optionText,
                  editedProfile.fitnessLevel === option && styles.optionTextActive
                ]}>
                  {option.charAt(0).toUpperCase() + option.slice(1)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.fieldGroup}>
          <Text style={styles.fieldLabel}>Health Notes (Optional)</Text>
          <TextInput
            style={[styles.textInput, styles.textArea]}
            placeholder="Any injuries or health concerns..."
            value={editedProfile.injuries}
            onChangeText={(text) => updateField('injuries', text)}
            multiline
            numberOfLines={3}
          />
        </View>
      </View>

      {/* Live Recommendations Preview */}
      {editedProfile.age && editedProfile.height && editedProfile.weight && (
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Activity size={16} color="#FF6B35" />
            <Text style={styles.sectionTitle}>Updated Recommendations</Text>
          </View>
          <View style={styles.recommendationsGrid}>
            <View style={styles.recommendationItem}>
              <Text style={styles.recommendationLabel}>Workout Level</Text>
              <Text style={styles.recommendationValue}>{recommendedLevel}</Text>
            </View>
            <View style={styles.recommendationItem}>
              <Text style={styles.recommendationLabel}>Rest Period</Text>
              <Text style={styles.recommendationValue}>{recommendedRest}s</Text>
            </View>
            {bmr && (
              <View style={styles.recommendationItem}>
                <Text style={styles.recommendationLabel}>BMR</Text>
                <Text style={styles.recommendationValue}>{Math.round(bmr)} cal</Text>
              </View>
            )}
            {dailyCalories && (
              <View style={styles.recommendationItem}>
                <Text style={styles.recommendationLabel}>Daily Calories</Text>
                <Text style={styles.recommendationValue}>{dailyCalories} cal</Text>
              </View>
            )}
          </View>
        </View>
      )}

      {/* Save Button */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.saveButton} onPress={validateAndSave}>
          <Save size={16} color="#FFFFFF" />
          <Text style={styles.saveButtonText}>Save Changes</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginLeft: 8,
  },
  cancelButton: {
    padding: 8,
  },
  section: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginLeft: 4,
  },
  fieldGroup: {
    marginBottom: 20,
  },
  fieldLabel: {
    fontSize: 14,
    fontWeight: '600',
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
    backgroundColor: '#FFFFFF',
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  optionRow: {
    flexDirection: 'row',
    gap: 8,
  },
  optionColumn: {
    gap: 8,
  },
  optionButton: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    alignItems: 'center',
  },
  optionButtonActive: {
    backgroundColor: '#FF6B35',
    borderColor: '#FF6B35',
  },
  optionText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6B7280',
  },
  optionTextActive: {
    color: '#FFFFFF',
  },
  experienceOption: {
    padding: 12,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
  },
  experienceOptionActive: {
    backgroundColor: '#FFF5F5',
    borderColor: '#FF6B35',
  },
  experienceContent: {
    flex: 1,
  },
  experienceLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 2,
  },
  experienceLabelActive: {
    color: '#FF6B35',
  },
  experienceDesc: {
    fontSize: 12,
    color: '#6B7280',
  },
  goalsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  goalChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 16,
    marginBottom: 8,
  },
  goalChipActive: {
    backgroundColor: '#FF6B35',
    borderColor: '#FF6B35',
  },
  goalText: {
    fontSize: 12,
    color: '#6B7280',
  },
  goalTextActive: {
    color: '#FFFFFF',
  },
  recommendationsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  recommendationItem: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: '#F8F9FA',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  recommendationLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 4,
    textAlign: 'center',
  },
  recommendationValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FF6B35',
    textAlign: 'center',
  },
  buttonContainer: {
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  saveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FF6B35',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 12,
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
}); 