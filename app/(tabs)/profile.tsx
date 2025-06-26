import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Image,
} from 'react-native';
import { Settings, Share2, CreditCard as Edit3, Trophy, Target, Calendar, BookOpen, ChevronRight, MapPin, Clock } from 'lucide-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserProgress } from '@/types/workout';
import { router } from 'expo-router';

export default function ProfileScreen() {
  const [userProgress, setUserProgress] = useState<UserProgress>({
    id: 'user1',
    workoutsCompleted: 0,
    totalTimeMinutes: 0,
    caloriesBurned: 0,
    currentStreak: 0,
    longestStreak: 0,
    achievements: [],
    favoriteWorkouts: [],
    completedWorkouts: [],
  });

  useEffect(() => {
    loadUserProgress();
  }, []);

  const loadUserProgress = async () => {
    try {
      const stored = await AsyncStorage.getItem('userProgress');
      if (stored) {
        setUserProgress(JSON.parse(stored));
      }
    } catch (error) {
      console.error('Error loading user progress:', error);
    }
  };

  const handlePunchLibrary = () => {
    router.push('/punch-library');
  };

  const handleSettings = () => {
    router.push('/settings');
  };

  // Mock user data for Strava-like profile
  const userData = {
    name: 'Alex Fighter',
    location: 'San Francisco, CA',
    joinDate: 'January 2024',
    followers: 127,
    following: 89,
    profileImage: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg',
  };

  const recentActivities = [
    {
      id: '1',
      type: 'Boxing HIIT',
      date: '2 hours ago',
      duration: '25 min',
      calories: 320,
      image: 'https://images.pexels.com/photos/7991579/pexels-photo-7991579.jpeg',
    },
    {
      id: '2',
      type: 'Combo Practice',
      date: 'Yesterday',
      duration: '15 min',
      calories: 180,
      image: 'https://images.pexels.com/photos/7991622/pexels-photo-7991622.jpeg',
    },
    {
      id: '3',
      type: 'Defense Training',
      date: '2 days ago',
      duration: '30 min',
      calories: 280,
      image: 'https://images.pexels.com/photos/7991621/pexels-photo-7991621.jpeg',
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} bounces={true}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.settingsButton} onPress={handleSettings}>
            <Settings size={24} color="#6B7280" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Profile</Text>
          <TouchableOpacity style={styles.shareButton}>
            <Share2 size={24} color="#6B7280" />
          </TouchableOpacity>
        </View>

        {/* Profile Info */}
        <View style={styles.profileSection}>
          <View style={styles.profileHeader}>
            <View style={styles.avatarContainer}>
              <Image source={{ uri: userData.profileImage }} style={styles.avatar} />
              <TouchableOpacity style={styles.editAvatarButton}>
                <Edit3 size={16} color="#fff" />
              </TouchableOpacity>
            </View>
            <View style={styles.profileInfo}>
              <Text style={styles.userName}>{userData.name}</Text>
              <View style={styles.locationRow}>
                <MapPin size={14} color="#6B7280" />
                <Text style={styles.location}>{userData.location}</Text>
              </View>
              <View style={styles.joinDateRow}>
                <Calendar size={14} color="#6B7280" />
                <Text style={styles.joinDate}>Joined {userData.joinDate}</Text>
              </View>
            </View>
          </View>

          {/* Social Stats */}
          <View style={styles.socialStats}>
            <View style={styles.socialStat}>
              <Text style={styles.socialStatValue}>{userData.followers}</Text>
              <Text style={styles.socialStatLabel}>Followers</Text>
            </View>
            <View style={styles.socialStatDivider} />
            <View style={styles.socialStat}>
              <Text style={styles.socialStatValue}>{userData.following}</Text>
              <Text style={styles.socialStatLabel}>Following</Text>
            </View>
          </View>
        </View>

        {/* Stats Overview */}
        <View style={styles.statsOverview}>
          <Text style={styles.sectionTitle}>Your Stats</Text>
          <View style={styles.statsGrid}>
            <View style={styles.overviewStatCard}>
              <Target size={24} color="#FF6B35" />
              <Text style={styles.overviewStatValue}>{userProgress.workoutsCompleted}</Text>
              <Text style={styles.overviewStatLabel}>Total Workouts</Text>
            </View>
            <View style={styles.overviewStatCard}>
              <Clock size={24} color="#00D4AA" />
              <Text style={styles.overviewStatValue}>{Math.floor(userProgress.totalTimeMinutes / 60)}h</Text>
              <Text style={styles.overviewStatLabel}>Time Trained</Text>
            </View>
            <View style={styles.overviewStatCard}>
              <Trophy size={24} color="#FFB800" />
              <Text style={styles.overviewStatValue}>{userProgress.longestStreak}</Text>
              <Text style={styles.overviewStatLabel}>Best Streak</Text>
            </View>
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.quickActionsSection}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <TouchableOpacity style={styles.actionItem} onPress={handlePunchLibrary}>
            <View style={styles.actionLeft}>
              <View style={[styles.actionIcon, { backgroundColor: '#FF6B35' }]}>
                <BookOpen size={20} color="#fff" />
              </View>
              <View style={styles.actionContent}>
                <Text style={styles.actionTitle}>Technique Library</Text>
                <Text style={styles.actionSubtitle}>Learn boxing fundamentals</Text>
              </View>
            </View>
            <ChevronRight size={20} color="#9CA3AF" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionItem}>
            <View style={styles.actionLeft}>
              <View style={[styles.actionIcon, { backgroundColor: '#00D4AA' }]}>
                <Target size={20} color="#fff" />
              </View>
              <View style={styles.actionContent}>
                <Text style={styles.actionTitle}>Set Goals</Text>
                <Text style={styles.actionSubtitle}>Track your progress</Text>
              </View>
            </View>
            <ChevronRight size={20} color="#9CA3AF" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionItem}>
            <View style={styles.actionLeft}>
              <View style={[styles.actionIcon, { backgroundColor: '#8B5CF6' }]}>
                <Trophy size={20} color="#fff" />
              </View>
              <View style={styles.actionContent}>
                <Text style={styles.actionTitle}>Achievements</Text>
                <Text style={styles.actionSubtitle}>View your badges</Text>
              </View>
            </View>
            <ChevronRight size={20} color="#9CA3AF" />
          </TouchableOpacity>
        </View>

        {/* Recent Activities */}
        <View style={styles.activitiesSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Activities</Text>
            <TouchableOpacity>
              <Text style={styles.viewAllText}>View All</Text>
            </TouchableOpacity>
          </View>
          
          {recentActivities.map((activity) => (
            <View key={activity.id} style={styles.activityCard}>
              <Image source={{ uri: activity.image }} style={styles.activityImage} />
              <View style={styles.activityContent}>
                <Text style={styles.activityType}>{activity.type}</Text>
                <Text style={styles.activityDate}>{activity.date}</Text>
                <View style={styles.activityStats}>
                  <View style={styles.activityStat}>
                    <Clock size={14} color="#6B7280" />
                    <Text style={styles.activityStatText}>{activity.duration}</Text>
                  </View>
                  <View style={styles.activityStat}>
                    <Target size={14} color="#6B7280" />
                    <Text style={styles.activityStatText}>{activity.calories} cal</Text>
                  </View>
                </View>
              </View>
              <ChevronRight size={20} color="#9CA3AF" />
            </View>
          ))}
        </View>

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
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  settingsButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: '#111827',
  },
  shareButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileSection: {
    backgroundColor: '#fff',
    padding: 20,
    marginTop: 8,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 16,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#E5E7EB',
  },
  editAvatarButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#FF6B35',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#fff',
  },
  profileInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#111827',
    marginBottom: 8,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  location: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    marginLeft: 6,
  },
  joinDateRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  joinDate: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    marginLeft: 6,
  },
  socialStats: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    paddingVertical: 16,
  },
  socialStat: {
    alignItems: 'center',
    flex: 1,
  },
  socialStatValue: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: '#111827',
    marginBottom: 4,
  },
  socialStatLabel: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#6B7280',
  },
  socialStatDivider: {
    width: 1,
    height: 32,
    backgroundColor: '#E5E7EB',
  },
  statsOverview: {
    backgroundColor: '#fff',
    padding: 20,
    marginTop: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#111827',
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  overviewStatCard: {
    flex: 1,
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  overviewStatValue: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: '#111827',
    marginTop: 8,
    marginBottom: 4,
  },
  overviewStatLabel: {
    fontSize: 11,
    fontFamily: 'Inter-Medium',
    color: '#6B7280',
    textAlign: 'center',
  },
  quickActionsSection: {
    backgroundColor: '#fff',
    padding: 20,
    marginTop: 8,
  },
  actionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  actionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  actionIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  actionContent: {
    flex: 1,
  },
  actionTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#111827',
    marginBottom: 2,
  },
  actionSubtitle: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
  },
  activitiesSection: {
    backgroundColor: '#fff',
    padding: 20,
    marginTop: 8,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  viewAllText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#FF6B35',
  },
  activityCard: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  activityImage: {
    width: 56,
    height: 56,
    borderRadius: 8,
    backgroundColor: '#E5E7EB',
    marginRight: 16,
  },
  activityContent: {
    flex: 1,
  },
  activityType: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#111827',
    marginBottom: 4,
  },
  activityDate: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    marginBottom: 8,
  },
  activityStats: {
    flexDirection: 'row',
    gap: 16,
  },
  activityStat: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  activityStatText: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#6B7280',
  },
  bottomPadding: {
    height: 40,
  },
});