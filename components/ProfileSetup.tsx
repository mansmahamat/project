import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
  ScrollView,
} from 'react-native';
import { User, Save, Calculator } from 'lucide-react-native';
import { useOnboardingStore } from '@/stores';

export const ProfileSetup: React.FC = () => {
  const { userProfile, updateUserProfile, calculateBMR, calculateWorkoutCalories } = useOnboardingStore();
  
  const [gender, setGender] = useState(userProfile?.gender || 'male');
  const [age, setAge] = useState(userProfile?.age || '');
  const [height, setHeight] = useState(userProfile?.height || '');
  const [weight, setWeight] = useState(userProfile?.weight || '');

  const handleSave = () => {
    if (!age || !height || !weight) {
      Alert.alert('Missing Information', 'Please fill in all fields for accurate calorie calculations.');
      return;
    }

    const updatedProfile = {
      ...userProfile,
      gender: gender as 'male' | 'female' | 'other',
      age,
      height,
      weight,
      stance: userProfile?.stance || 'orthodox',
      experience: userProfile?.experience || 'beginner',
      goals: userProfile?.goals || [],
      fitnessLevel: userProfile?.fitnessLevel || 'moderate',
      injuries: userProfile?.injuries || '',
    };

    updateUserProfile(updatedProfile);
    
    // Show example calculation
    const bmr = calculateBMR();
    const exampleCalories = calculateWorkoutCalories(15, 'Combos', 'Intermediate');
    
    Alert.alert(
      '✅ Profile Updated!',
      `Your calorie calculations are now personalized!\n\nExample: A 15-minute intermediate workout would burn approximately ${exampleCalories} calories for you.`,
      [{ text: 'Great!', style: 'default' }]
    );
  };

  const getBMRPreview = () => {
    if (!age || !height || !weight) return null;
    
    const ageNum = parseInt(age);
    const heightNum = parseFloat(height);
    const weightNum = parseFloat(weight);
    
    if (isNaN(ageNum) || isNaN(heightNum) || isNaN(weightNum)) return null;
    
    // Calculate BMR preview
    let bmr: number;
    if (gender === 'male') {
      bmr = 10 * weightNum + 6.25 * heightNum - 5 * ageNum + 5;
    } else {
      bmr = 10 * weightNum + 6.25 * heightNum - 5 * ageNum - 161;
    }
    
    return Math.round(bmr);
  };

  const bmrPreview = getBMRPreview();

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <User size={24} color="#FF6B35" />
        <Text style={styles.title}>Profile Setup</Text>
        <Text style={styles.subtitle}>For accurate calorie calculations</Text>
      </View>

      {/* Gender Selection */}
      <View style={styles.section}>
        <Text style={styles.label}>Gender</Text>
        <View style={styles.genderContainer}>
          <TouchableOpacity
            style={[styles.genderButton, gender === 'male' && styles.genderButtonActive]}
            onPress={() => setGender('male')}
          >
            <Text style={[styles.genderButtonText, gender === 'male' && styles.genderButtonTextActive]}>
              Male
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.genderButton, gender === 'female' && styles.genderButtonActive]}
            onPress={() => setGender('female')}
          >
            <Text style={[styles.genderButtonText, gender === 'female' && styles.genderButtonTextActive]}>
              Female
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Age Input */}
      <View style={styles.section}>
        <Text style={styles.label}>Age (years)</Text>
        <TextInput
          style={styles.input}
          value={age}
          onChangeText={setAge}
          placeholder="25"
          keyboardType="numeric"
          maxLength={3}
        />
      </View>

      {/* Height Input */}
      <View style={styles.section}>
        <Text style={styles.label}>Height (cm)</Text>
        <TextInput
          style={styles.input}
          value={height}
          onChangeText={setHeight}
          placeholder="175"
          keyboardType="numeric"
          maxLength={3}
        />
      </View>

      {/* Weight Input */}
      <View style={styles.section}>
        <Text style={styles.label}>Weight (kg)</Text>
        <TextInput
          style={styles.input}
          value={weight}
          onChangeText={setWeight}
          placeholder="70"
          keyboardType="numeric"
          maxLength={3}
        />
      </View>

      {/* BMR Preview */}
      {bmrPreview && (
        <View style={styles.previewSection}>
          <View style={styles.previewHeader}>
            <Calculator size={20} color="#8B5CF6" />
            <Text style={styles.previewTitle}>BMR Preview</Text>
          </View>
          <Text style={styles.previewText}>
            Your estimated daily calorie burn at rest: <Text style={styles.previewValue}>{bmrPreview} cal/day</Text>
          </Text>
          <Text style={styles.previewNote}>
            Workouts will burn additional calories based on intensity and duration.
          </Text>
        </View>
      )}

      {/* Save Button */}
      <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
        <Save size={20} color="#fff" />
        <Text style={styles.saveButtonText}>Save Profile</Text>
      </TouchableOpacity>

      {/* Info Section */}
      <View style={styles.infoSection}>
        <Text style={styles.infoTitle}>Why we need this information:</Text>
        <Text style={styles.infoText}>
          • <Text style={styles.infoBold}>Accurate calorie tracking</Text> - Personalized calculations based on your BMR
        </Text>
        <Text style={styles.infoText}>
          • <Text style={styles.infoBold}>Better progress insights</Text> - See your real calorie burn per workout
        </Text>
        <Text style={styles.infoText}>
          • <Text style={styles.infoBold}>Motivation</Text> - Know exactly how much you're burning
        </Text>
      </View>

      <View style={styles.bottomPadding} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  title: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#111827',
    marginTop: 8,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
  },
  section: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  label: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#111827',
    marginBottom: 12,
  },
  genderContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  genderButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    alignItems: 'center',
  },
  genderButtonActive: {
    backgroundColor: '#FF6B35',
    borderColor: '#FF6B35',
  },
  genderButtonText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#6B7280',
  },
  genderButtonTextActive: {
    color: '#fff',
  },
  input: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#111827',
  },
  previewSection: {
    margin: 20,
    padding: 16,
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  previewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  previewTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#8B5CF6',
    marginLeft: 8,
  },
  previewText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#475569',
    marginBottom: 4,
  },
  previewValue: {
    fontFamily: 'Inter-Bold',
    color: '#8B5CF6',
  },
  previewNote: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#64748B',
    fontStyle: 'italic',
  },
  saveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FF6B35',
    marginHorizontal: 20,
    marginVertical: 20,
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
  },
  saveButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#fff',
  },
  infoSection: {
    margin: 20,
    padding: 16,
    backgroundColor: '#F0FDF4',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#BBF7D0',
  },
  infoTitle: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#166534',
    marginBottom: 8,
  },
  infoText: {
    fontSize: 13,
    fontFamily: 'Inter-Regular',
    color: '#166534',
    marginBottom: 4,
  },
  infoBold: {
    fontFamily: 'Inter-SemiBold',
  },
  bottomPadding: {
    height: 20,
  },
}); 