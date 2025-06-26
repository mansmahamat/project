import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Switch,
  SafeAreaView,
} from 'react-native';
import { Volume2, Bell, Globe, Ruler, CircleHelp as HelpCircle, Star, Shield, ChevronRight, Calculator } from 'lucide-react-native';
import UserProfileSection from '@/components/UserProfileSection';
import { ProfileSetup } from '@/components/ProfileSetup';

export default function SettingsScreen() {
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [isMetric, setIsMetric] = useState(true);
  const [showProfileSetup, setShowProfileSetup] = useState(false);

  const SettingItem = ({ 
    icon, 
    title, 
    subtitle, 
    rightElement, 
    onPress 
  }: {
    icon: React.ReactNode;
    title: string;
    subtitle?: string;
    rightElement?: React.ReactNode;
    onPress?: () => void;
  }) => (
    <TouchableOpacity style={styles.settingItem} onPress={onPress}>
      <View style={styles.settingLeft}>
        <View style={styles.settingIcon}>{icon}</View>
        <View style={styles.settingContent}>
          <Text style={styles.settingTitle}>{title}</Text>
          {subtitle && <Text style={styles.settingSubtitle}>{subtitle}</Text>}
        </View>
      </View>
      <View style={styles.settingRight}>
        {rightElement}
      </View>
    </TouchableOpacity>
  );

  if (showProfileSetup) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.profileSetupHeader}>
          <TouchableOpacity 
            style={styles.backButton} 
            onPress={() => setShowProfileSetup(false)}
          >
            <ChevronRight size={24} color="#666" style={{ transform: [{ rotate: '180deg' }] }} />
          </TouchableOpacity>
          <Text style={styles.profileSetupTitle}>Profile Setup</Text>
        </View>
        <ProfileSetup />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>Settings</Text>
          <Text style={styles.subtitle}>Customize your boxing experience</Text>
        </View>

        <View style={styles.profileContainer}>
          <UserProfileSection />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Audio & Sound</Text>
          <SettingItem
            icon={<Volume2 size={20} color="#FF4500" />}
            title="Audio Coaching"
            subtitle="Enable voice guidance during workouts"
            rightElement={
              <Switch
                value={audioEnabled}
                onValueChange={setAudioEnabled}
                trackColor={{ false: '#e5e7eb', true: '#FF4500' }}
                thumbColor={audioEnabled ? '#fff' : '#f3f4f6'}
              />
            }
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Notifications</Text>
          <SettingItem
            icon={<Bell size={20} color="#FF4500" />}
            title="Workout Reminders"
            subtitle="Get reminded to stay consistent"
            rightElement={
              <Switch
                value={notificationsEnabled}
                onValueChange={setNotificationsEnabled}
                trackColor={{ false: '#e5e7eb', true: '#FF4500' }}
                thumbColor={notificationsEnabled ? '#fff' : '#f3f4f6'}
              />
            }
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Calorie Calculations</Text>
          <SettingItem
            icon={<Calculator size={20} color="#FF4500" />}
            title="Personal Profile"
            subtitle="Set your details for accurate calorie tracking"
            rightElement={<ChevronRight size={20} color="#666" />}
            onPress={() => setShowProfileSetup(true)}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Preferences</Text>
          <SettingItem
            icon={<Globe size={20} color="#FF4500" />}
            title="Language"
            subtitle="English"
            rightElement={<ChevronRight size={20} color="#666" />}
            onPress={() => {}}
          />
          <SettingItem
            icon={<Ruler size={20} color="#FF4500" />}
            title="Units"
            subtitle={isMetric ? "Metric (kg, cm)" : "Imperial (lbs, ft)"}
            rightElement={
              <Switch
                value={isMetric}
                onValueChange={setIsMetric}
                trackColor={{ false: '#e5e7eb', true: '#FF4500' }}
                thumbColor={isMetric ? '#fff' : '#f3f4f6'}
              />
            }
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Support</Text>
          <SettingItem
            icon={<HelpCircle size={20} color="#FF4500" />}
            title="Help & FAQ"
            subtitle="Get answers to common questions"
            rightElement={<ChevronRight size={20} color="#666" />}
            onPress={() => {}}
          />
          <SettingItem
            icon={<Star size={20} color="#FF4500" />}
            title="Rate the App"
            subtitle="Share your feedback"
            rightElement={<ChevronRight size={20} color="#666" />}
            onPress={() => {}}
          />
          <SettingItem
            icon={<Shield size={20} color="#FF4500" />}
            title="Privacy Policy"
            subtitle="Learn how we protect your data"
            rightElement={<ChevronRight size={20} color="#666" />}
            onPress={() => {}}
          />
        </View>

        <View style={styles.aboutSection}>
          <Text style={styles.aboutTitle}>Virtual Boxing Coach</Text>
          <Text style={styles.aboutVersion}>Version 1.0.0</Text>
          <Text style={styles.aboutDescription}>
            Your personal boxing trainer in your pocket. Train anywhere, anytime.
          </Text>
        </View>

        <View style={styles.dangerSection}>
          <TouchableOpacity style={styles.dangerButton}>
            <Text style={styles.dangerButtonText}>Clear All Data</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    padding: 20,
    paddingTop: 10,
  },
  profileContainer: {
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  title: {
    fontSize: 32,
    fontFamily: 'Inter-Bold',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#666',
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#1a1a1a',
    marginBottom: 16,
    paddingHorizontal: 20,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#f8f9fa',
    marginHorizontal: 20,
    marginBottom: 1,
    borderRadius: 12,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingIcon: {
    width: 40,
    height: 40,
    backgroundColor: 'rgba(255, 69, 0, 0.1)',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  settingContent: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#1a1a1a',
    marginBottom: 2,
  },
  settingSubtitle: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#666',
  },
  settingRight: {
    marginLeft: 16,
  },
  aboutSection: {
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 32,
  },
  aboutTitle: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#FF4500',
    marginBottom: 8,
  },
  aboutVersion: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#666',
    marginBottom: 16,
  },
  aboutDescription: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#666',
    textAlign: 'center',
    lineHeight: 20,
  },
  dangerSection: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  dangerButton: {
    backgroundColor: '#FF4444',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  dangerButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#fff',
  },
  profileSetupHeader: {
    flexDirection: 'row',
    alignItems: 'center',
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
    marginRight: 16,
  },
  profileSetupTitle: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: '#111827',
  },
});