import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  TextInput,
  Alert,
} from 'react-native';
import { 
  User, 
  Ruler, 
  HandMetal, 
  Trophy, 
  Target,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { useOnboardingStore, useNavigationStore } from '@/stores';
import type { UserProfile } from '@/stores/useOnboardingStore';

interface LocalUserProfile {
  gender: 'male' | 'female' | 'other' | '';
  age: string;
  height: string;
  weight: string;
  stance: 'orthodox' | 'southpaw' | '';
  experience: 'beginner' | 'intermediate' | 'advanced' | '';
  goals: string[];
  fitnessLevel: 'low' | 'moderate' | 'high' | '';
  injuries: string;
}

const STEPS = [
  { id: 1, title: 'Personal Info', icon: User },
  { id: 2, title: 'Physical Stats', icon: Ruler },
  { id: 3, title: 'Boxing Setup', icon: HandMetal },
  { id: 4, title: 'Experience', icon: Trophy },
  { id: 5, title: 'Goals & Fitness', icon: Target },
];

export default function OnboardingScreen() {
  const router = useRouter();
  const completeOnboarding = useOnboardingStore((state) => state.completeOnboarding);
  const setCompletingOnboarding = useNavigationStore((state) => state.setCompletingOnboarding);
  const [currentStep, setCurrentStep] = useState(1);
  const [profile, setProfile] = useState<LocalUserProfile>({
    gender: '',
    age: '',
    height: '',
    weight: '',
    stance: '',
    experience: '',
    goals: [],
    fitnessLevel: '',
    injuries: '',
  });

  const updateProfile = (field: keyof LocalUserProfile, value: any) => {
    setProfile(prev => ({ ...prev, [field]: value }));
  };

  const toggleGoal = (goal: string) => {
    setProfile(prev => ({
      ...prev,
      goals: prev.goals.includes(goal)
        ? prev.goals.filter(g => g !== goal)
        : [...prev.goals, goal]
    }));
  };

  const validateStep = (step: number): boolean => {
    switch (step) {
      case 1:
        return profile.gender !== '' && profile.age !== '';
      case 2:
        return profile.height !== '' && profile.weight !== '';
      case 3:
        return profile.stance !== '';
      case 4:
        return profile.experience !== '';
      case 5:
        return profile.goals.length > 0 && profile.fitnessLevel !== '';
      default:
        return true;
    }
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      if (currentStep < STEPS.length) {
        setCurrentStep(currentStep + 1);
      } else {
        completeOnboardingFlow();
      }
    } else {
      Alert.alert('Incomplete', 'Please fill in all required fields before continuing.');
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const completeOnboardingFlow = async () => {
    try {
      console.log('🚀 STARTING ONBOARDING COMPLETION...');
      
      // Set flag to prevent OnboardingGate interference
      setCompletingOnboarding(true);
      
      // Convert local profile to UserProfile format
      const userProfile: UserProfile = {
        gender: profile.gender as 'male' | 'female' | 'other',
        age: profile.age,
        height: profile.height,
        weight: profile.weight,
        stance: profile.stance as 'orthodox' | 'southpaw',
        experience: profile.experience as 'beginner' | 'intermediate' | 'advanced',
        goals: profile.goals,
        fitnessLevel: profile.fitnessLevel as 'low' | 'moderate' | 'high',
        injuries: profile.injuries,
      };

      console.log('🚀 User profile to save:', userProfile);
      
      // Update the store and wait for it to complete
      completeOnboarding(userProfile);
      console.log('🚀 Store updated, navigating to main app...');
      
      // Navigate immediately - no need for delay
      setCompletingOnboarding(false); // Clear flag
      router.replace('/(tabs)');
      
    } catch (error) {
      console.error('🚀 Onboarding completion failed:', error);
      setCompletingOnboarding(false); // Clear flag on error
      Alert.alert('Error', 'Failed to save profile. Please try again.');
    }
  };

  const renderProgressBar = () => (
    <View style={styles.progressContainer}>
      <View style={styles.progressBar}>
        <View 
          style={[
            styles.progressFill, 
            { width: `${(currentStep / STEPS.length) * 100}%` }
          ]} 
        />
      </View>
      <Text style={styles.progressText}>
        Step {currentStep} of {STEPS.length}
      </Text>
    </View>
  );

  const renderStepIndicator = () => (
    <View style={styles.stepIndicator}>
      {STEPS.map((step) => {
        const IconComponent = step.icon;
        const isActive = currentStep === step.id;
        const isCompleted = currentStep > step.id;
        
        return (
          <View key={step.id} style={styles.stepItem}>
            <View style={[
              styles.stepCircle,
              isActive && styles.stepCircleActive,
              isCompleted && styles.stepCircleCompleted
            ]}>
              <IconComponent 
                size={16} 
                color={isActive || isCompleted ? '#FFFFFF' : '#9CA3AF'} 
              />
            </View>
            <Text style={[
              styles.stepLabel,
              isActive && styles.stepLabelActive
            ]}>
              {step.title}
            </Text>
          </View>
        );
      })}
    </View>
  );

  const renderPersonalInfo = () => (
    <View style={styles.stepContent}>
      <Text style={styles.stepTitle}>Let's get to know you</Text>
      <Text style={styles.stepSubtitle}>
        This helps us personalize your boxing journey
      </Text>

      <View style={styles.fieldGroup}>
        <Text style={styles.fieldLabel}>Gender</Text>
        <View style={styles.optionRow}>
          {[
            { key: 'male', label: 'Male' },
            { key: 'female', label: 'Female' },
            { key: 'other', label: 'Other' }
          ].map((option) => (
            <TouchableOpacity
              key={option.key}
              style={[
                styles.optionButton,
                profile.gender === option.key && styles.optionButtonActive
              ]}
              onPress={() => updateProfile('gender', option.key)}
            >
              <Text style={[
                styles.optionText,
                profile.gender === option.key && styles.optionTextActive
              ]}>
                {option.label}
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
          value={profile.age}
          onChangeText={(text) => updateProfile('age', text)}
          keyboardType="numeric"
        />
      </View>
    </View>
  );

  const renderPhysicalStats = () => (
    <View style={styles.stepContent}>
      <Text style={styles.stepTitle}>Physical Statistics</Text>
      <Text style={styles.stepSubtitle}>
        For accurate calorie calculations and training recommendations
      </Text>

      <View style={styles.fieldGroup}>
        <Text style={styles.fieldLabel}>Height (cm)</Text>
        <TextInput
          style={styles.textInput}
          placeholder="170"
          value={profile.height}
          onChangeText={(text) => updateProfile('height', text)}
          keyboardType="numeric"
        />
      </View>

      <View style={styles.fieldGroup}>
        <Text style={styles.fieldLabel}>Weight (kg)</Text>
        <TextInput
          style={styles.textInput}
          placeholder="70"
          value={profile.weight}
          onChangeText={(text) => updateProfile('weight', text)}
          keyboardType="numeric"
        />
      </View>
    </View>
  );

  const renderBoxingSetup = () => (
    <View style={styles.stepContent}>
      <Text style={styles.stepTitle}>Boxing Stance</Text>
      <Text style={styles.stepSubtitle}>
        Which stance feels more natural to you?
      </Text>

      <View style={styles.stanceContainer}>
        <TouchableOpacity
          style={[
            styles.stanceOption,
            profile.stance === 'orthodox' && styles.stanceOptionActive
          ]}
          onPress={() => updateProfile('stance', 'orthodox')}
        >
          <HandMetal size={32} color={profile.stance === 'orthodox' ? '#FFFFFF' : '#FF6B35'} />
          <Text style={[
            styles.stanceTitle,
            profile.stance === 'orthodox' && styles.stanceTitleActive
          ]}>
            Orthodox
          </Text>
          <Text style={[
            styles.stanceDescription,
            profile.stance === 'orthodox' && styles.stanceDescriptionActive
          ]}>
            Left foot forward{'\n'}Right hand dominant
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.stanceOption,
            profile.stance === 'southpaw' && styles.stanceOptionActive
          ]}
          onPress={() => updateProfile('stance', 'southpaw')}
        >
          <HandMetal size={32} color={profile.stance === 'southpaw' ? '#FFFFFF' : '#FF6B35'} />
          <Text style={[
            styles.stanceTitle,
            profile.stance === 'southpaw' && styles.stanceTitleActive
          ]}>
            Southpaw
          </Text>
          <Text style={[
            styles.stanceDescription,
            profile.stance === 'southpaw' && styles.stanceDescriptionActive
          ]}>
            Right foot forward{'\n'}Left hand dominant
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderExperience = () => (
    <View style={styles.stepContent}>
      <Text style={styles.stepTitle}>Boxing Experience</Text>
      <Text style={styles.stepSubtitle}>
        Help us tailor workouts to your skill level
      </Text>

      <View style={styles.experienceContainer}>
        {[
          {
            key: 'beginner',
            title: 'Beginner',
            description: 'New to boxing or less than 6 months experience',
            color: '#10B981'
          },
          {
            key: 'intermediate',
            title: 'Intermediate',
            description: '6 months to 2 years of boxing experience',
            color: '#F59E0B'
          },
          {
            key: 'advanced',
            title: 'Advanced',
            description: '2+ years of boxing, compete or train regularly',
            color: '#EF4444'
          }
        ].map((level) => (
          <TouchableOpacity
            key={level.key}
            style={[
              styles.experienceOption,
              profile.experience === level.key && styles.experienceOptionActive,
              { borderColor: level.color }
            ]}
            onPress={() => updateProfile('experience', level.key)}
          >
            <View style={[styles.experienceIndicator, { backgroundColor: level.color }]} />
            <View style={styles.experienceText}>
              <Text style={[
                styles.experienceTitle,
                profile.experience === level.key && styles.experienceTitleActive
              ]}>
                {level.title}
              </Text>
              <Text style={styles.experienceDescription}>
                {level.description}
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  const renderGoalsAndFitness = () => (
    <View style={styles.stepContent}>
      <Text style={styles.stepTitle}>Goals & Fitness</Text>
      <Text style={styles.stepSubtitle}>
        What do you want to achieve with boxing?
      </Text>

      <View style={styles.fieldGroup}>
        <Text style={styles.fieldLabel}>Training Goals (select all that apply)</Text>
        <View style={styles.goalsGrid}>
          {[
            'Lose Weight', 'Build Muscle', 'Learn Self-Defense',
            'Improve Fitness', 'Stress Relief', 'Competition Prep'
          ].map((goal) => (
            <TouchableOpacity
              key={goal}
              style={[
                styles.goalChip,
                profile.goals.includes(goal) && styles.goalChipActive
              ]}
              onPress={() => toggleGoal(goal)}
            >
              <Text style={[
                styles.goalText,
                profile.goals.includes(goal) && styles.goalTextActive
              ]}>
                {goal}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.fieldGroup}>
        <Text style={styles.fieldLabel}>Current Fitness Level</Text>
        <View style={styles.optionRow}>
          {[
            { key: 'low', label: 'Low' },
            { key: 'moderate', label: 'Moderate' },
            { key: 'high', label: 'High' }
          ].map((level) => (
            <TouchableOpacity
              key={level.key}
              style={[
                styles.optionButton,
                profile.fitnessLevel === level.key && styles.optionButtonActive
              ]}
              onPress={() => updateProfile('fitnessLevel', level.key)}
            >
              <Text style={[
                styles.optionText,
                profile.fitnessLevel === level.key && styles.optionTextActive
              ]}>
                {level.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.fieldGroup}>
        <Text style={styles.fieldLabel}>Any injuries or concerns? (Optional)</Text>
        <TextInput
          style={[styles.textInput, styles.textArea]}
          placeholder="e.g., Previous wrist injury, back problems..."
          value={profile.injuries}
          onChangeText={(text) => updateProfile('injuries', text)}
          multiline
          numberOfLines={3}
        />
      </View>
    </View>
  );

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1: return renderPersonalInfo();
      case 2: return renderPhysicalStats();
      case 3: return renderBoxingSetup();
      case 4: return renderExperience();
      case 5: return renderGoalsAndFitness();
      default: return null;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {renderProgressBar()}
      {renderStepIndicator()}
      
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {renderCurrentStep()}
      </ScrollView>

      <View style={styles.navigationBar}>
        <TouchableOpacity
          style={[styles.navButton, currentStep === 1 && styles.navButtonDisabled]}
          onPress={prevStep}
          disabled={currentStep === 1}
        >
          <ChevronLeft size={20} color={currentStep === 1 ? '#9CA3AF' : '#6B7280'} />
          <Text style={[styles.navButtonText, currentStep === 1 && styles.navButtonTextDisabled]}>
            Back
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.nextButton}
          onPress={nextStep}
        >
          <Text style={styles.nextButtonText}>
            {currentStep === STEPS.length ? 'Complete Setup' : 'Continue'}
          </Text>
          <ChevronRight size={20} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  progressContainer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  progressBar: {
    height: 4,
    backgroundColor: '#E5E7EB',
    borderRadius: 2,
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#FF6B35',
    borderRadius: 2,
  },
  progressText: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
  },
  stepIndicator: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  stepItem: {
    alignItems: 'center',
    flex: 1,
  },
  stepCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  stepCircleActive: {
    backgroundColor: '#FF6B35',
  },
  stepCircleCompleted: {
    backgroundColor: '#10B981',
  },
  stepLabel: {
    fontSize: 12,
    color: '#9CA3AF',
    textAlign: 'center',
  },
  stepLabelActive: {
    color: '#FF6B35',
    fontWeight: '500',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  stepContent: {
    padding: 20,
    flex: 1,
  },
  stepTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 8,
  },
  stepSubtitle: {
    fontSize: 16,
    color: '#6B7280',
    lineHeight: 24,
    marginBottom: 32,
  },
  fieldGroup: {
    marginBottom: 24,
  },
  fieldLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 12,
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
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
    gap: 12,
  },
  optionButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 12,
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
  stanceContainer: {
    gap: 16,
  },
  stanceOption: {
    padding: 24,
    borderWidth: 2,
    borderColor: '#E5E7EB',
    borderRadius: 16,
    alignItems: 'center',
  },
  stanceOptionActive: {
    backgroundColor: '#FF6B35',
    borderColor: '#FF6B35',
  },
  stanceTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
    marginTop: 16,
    marginBottom: 8,
  },
  stanceTitleActive: {
    color: '#FFFFFF',
  },
  stanceDescription: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 20,
  },
  stanceDescriptionActive: {
    color: '#FFFFFF',
  },
  experienceContainer: {
    gap: 16,
  },
  experienceOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderWidth: 2,
    borderColor: '#E5E7EB',
    borderRadius: 12,
  },
  experienceOptionActive: {
    backgroundColor: '#F9FAFB',
  },
  experienceIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 16,
  },
  experienceText: {
    flex: 1,
  },
  experienceTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  experienceTitleActive: {
    color: '#FF6B35',
  },
  experienceDescription: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
  },
  goalsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  goalChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 20,
    marginBottom: 8,
  },
  goalChipActive: {
    backgroundColor: '#FF6B35',
    borderColor: '#FF6B35',
  },
  goalText: {
    fontSize: 14,
    color: '#6B7280',
  },
  goalTextActive: {
    color: '#FFFFFF',
  },
  navigationBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    backgroundColor: '#FFFFFF',
  },
  navButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  navButtonDisabled: {
    opacity: 0.5,
  },
  navButtonText: {
    fontSize: 16,
    color: '#6B7280',
    marginLeft: 4,
  },
  navButtonTextDisabled: {
    color: '#9CA3AF',
  },
  nextButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FF6B35',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
  },
  nextButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginRight: 8,
  },
}); 