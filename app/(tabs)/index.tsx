import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  Image,
} from 'react-native';
import { Search, TrendingUp, Star, Plus, Target, BookOpen, GraduationCap, Activity, Zap, Trophy, Calendar, Play, ChevronRight, Video, Shield, Move, Clock, User, X } from 'lucide-react-native';
import { WorkoutCard } from '@/components/WorkoutCard';
import { ComboCard } from '@/components/ComboCard';
import { TechniqueCard } from '@/components/TechniqueCard';
import { workouts, getFeaturedWorkouts, getPopularWorkouts, getTotalDuration, getTotalInstructions } from '@/data/workouts';
import { COMBOS, getCombosByLevel } from '@/data/punches';
import { TECHNIQUE_REFERENCES, getTechniquesByCategory } from '@/data/techniques';
import { useCustomWorkoutStore } from '@/stores/useCustomWorkoutStore';
import { useProgressStore } from '@/stores';
import { router } from 'expo-router';

export default function HomeScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [quickStartVisible, setQuickStartVisible] = useState(true);
  
  const featuredWorkouts = getFeaturedWorkouts();
  const popularWorkouts = getPopularWorkouts();
  const beginnerCombos = getCombosByLevel('Beginner').slice(0, 3);
  const featuredTechniques = TECHNIQUE_REFERENCES.slice(0, 4);
  
  // Get custom workouts
  const { customWorkouts } = useCustomWorkoutStore();
  const recentCustomWorkouts = customWorkouts.slice(0, 3); // Show most recent 3
  
  // Get REAL progress data from store
  const { progress, getWeeklyStats } = useProgressStore();
  const weeklyStats = getWeeklyStats();

  const handleWorkoutPress = (workoutId: string) => {
    router.push(`/workout-detail?id=${workoutId}`);
  };

  const handleComboPress = (comboId: string) => {
    // For featured combos, go directly to 3-minute timed workouts
    if (comboId === 'jab-cross') {
      router.push('/timed-workout-player?id=jab-cross-focus');
    } else if (comboId === 'jab-jab-cross') {
      router.push('/timed-workout-player?id=jab-jab-cross-focus');
    } else if (comboId === 'jab-cross-hook') {
      router.push('/timed-workout-player?id=jab-cross-hook-focus');
    } else {
      // For other combos, go to detail page first
      router.push(`/combo-detail?id=${comboId}`);
    }
  };

  const handleTechniquePress = (techniqueId: number) => {
    router.push(`/technique-detail?id=${techniqueId}`);
  };

  const handleCreateCustomWorkout = () => {
    router.push('/custom-workout');
  };

  const handleCustomWorkoutPress = (workoutId: string) => {
    router.push(`/workout-detail?id=${workoutId}`);
  };

  const handleTutorials = () => {
    router.push('/punch-library');
  };

  const handleViewAllCombos = () => {
    router.push('/combos');
  };

  const handleQuickStart = () => {
    router.push('/quick-start');
  };

  const filteredWorkouts = workouts.filter(workout =>
    workout.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    workout.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Tutorial category stats
  const tutorialStats = {
    punches: getTechniquesByCategory('Punch').length,
    defense: getTechniquesByCategory('Defense').length,
    footwork: getTechniquesByCategory('Footwork').length,
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} bounces={true}>
        {/* Hero Header */}
        {/* <View style={styles.heroHeader}>
          <View style={styles.headerContent}>
            <View style={styles.userSection}>
              <View style={styles.avatarContainer}>
                <Image 
                  source={{ uri: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg' }}
                  style={styles.avatar}
                />
                <View style={styles.statusIndicator} />
              </View>
              <View style={styles.userInfo}>
                <Text style={styles.greeting}>Good morning</Text>
                <Text style={styles.userName}>Fighter</Text>
              </View>
            </View>
            <TouchableOpacity style={styles.notificationButton}>
              <Activity size={24} color="#FF6B35" />
            </TouchableOpacity>
          </View>
        </View> */}

        {/* Premium Quick-Start Boxing Card */}
        {quickStartVisible && (
          <View style={styles.miniQuickStartCard}>
            <TouchableOpacity
              style={styles.miniCloseButton}
              onPress={() => setQuickStartVisible(false)}
            >
              <X size={16} color="#6B7280" />
            </TouchableOpacity>

            <TouchableOpacity style={styles.miniCardContent} onPress={handleQuickStart}>
              {/* Left Section: Icon & Title */}
              <View style={styles.miniLeftSection}>
                <View style={styles.miniIconContainer}>
                  <GraduationCap size={20} color="#FF6B35" />
                </View>
                <View style={styles.miniTitleContainer}>
                  <Text style={styles.miniTitle}>Quick-Start Boxing</Text>
                  <Text style={styles.miniSubtitle}>Learn fundamentals fast</Text>
                </View>
              </View>

              {/* Right Section: Stats & Arrow */}
              <View style={styles.miniRightSection}>
                <View style={styles.miniStats}>
                  <Text style={styles.miniStatNumber}>{getTotalDuration()}min</Text>
                  <Text style={styles.miniStatLabel}>{getTotalInstructions()} techniques</Text>
                </View>
                <ChevronRight size={18} color="#6B7280" />
              </View>
            </TouchableOpacity>
          </View>
        )}

      
      

        {/* Weekly Stats Dashboard */}
        <View style={styles.statsSection}>
          <Text style={styles.sectionTitle}>This Week</Text>
          <View style={styles.statsGrid}>
            <View style={styles.statCard}>
              <View style={styles.statIconContainer}>
                <Target size={20} color="#FF6B35" />
              </View>
              <Text style={styles.statValue}>{weeklyStats.workouts}</Text>
              <Text style={styles.statLabel}>Workouts</Text>
              <Text style={styles.statChange}>this week</Text>
            </View>
            
            <View style={styles.statCard}>
              <View style={styles.statIconContainer}>
                <Zap size={20} color="#00D4AA" />
              </View>
              <Text style={styles.statValue}>{weeklyStats.time}</Text>
              <Text style={styles.statLabel}>Minutes</Text>
              <Text style={styles.statChange}>this week</Text>
            </View>
            
            <View style={styles.statCard}>
              <View style={styles.statIconContainer}>
                <Trophy size={20} color="#FFB800" />
              </View>
              <Text style={styles.statValue}>{weeklyStats.calories}</Text>
              <Text style={styles.statLabel}>Calories</Text>
              <Text style={styles.statChange}>this week</Text>
            </View>
            
            <View style={styles.statCard}>
              <View style={styles.statIconContainer}>
                <Calendar size={20} color="#8B5CF6" />
              </View>
              <Text style={styles.statValue}>{progress.currentStreak}</Text>
              <Text style={styles.statLabel}>Day Streak</Text>
              <Text style={styles.statChange}>Keep it up!</Text>
            </View>
          </View>
        </View>

        {/* Search */}
        <View style={styles.searchContainer}>
          <View style={styles.searchBar}>
            <Search size={20} color="#9CA3AF" />
            <TextInput
              style={styles.searchInput}
              placeholder="Search workouts, techniques..."
              placeholderTextColor="#9CA3AF"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>
        </View>

        {searchQuery ? (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Search Results</Text>
            {filteredWorkouts.map((workout) => (
              <WorkoutCard
                key={workout.id}
                workout={workout}
                onPress={() => handleWorkoutPress(workout.id)}
              />
            ))}
            {filteredWorkouts.length === 0 && (
              <Text style={styles.noResults}>No workouts found matching your search.</Text>
            )}
          </View>
        ) : (
          <>
            
            {/* My Custom Workouts */}
            {recentCustomWorkouts.length > 0 && (
              <View style={styles.section}>
                <View style={styles.sectionHeader}>
                  <View style={styles.sectionTitleRow}>
                    <User size={20} color="#8B5CF6" />
                    <Text style={styles.sectionTitle}>My Custom Workouts</Text>
                  </View>
                  <TouchableOpacity onPress={() => router.push('/workouts?filter=Custom')}>
                    <Text style={styles.viewAllText}>View All</Text>
                  </TouchableOpacity>
                </View>
                <Text style={styles.sectionSubtitle}>Your created workouts</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalScroll}>
                  {recentCustomWorkouts.map((workout) => (
                    <View key={workout.id} style={styles.customWorkoutCard}>
                      <TouchableOpacity 
                        style={styles.customWorkoutContent}
                        onPress={() => handleCustomWorkoutPress(workout.id)}
                      >
                        <View style={styles.customWorkoutHeader}>
                          <View style={styles.customWorkoutIconContainer}>
                            <User size={24} color="#8B5CF6" />
                          </View>
                          <View style={styles.customWorkoutBadge}>
                            <Text style={styles.customWorkoutBadgeText}>CUSTOM</Text>
                          </View>
                        </View>
                        
                        <Text style={styles.customWorkoutTitle}>{workout.title}</Text>
                        <Text style={styles.customWorkoutDescription} numberOfLines={2}>
                          {workout.description}
                        </Text>
                        
                        <View style={styles.customWorkoutStats}>
                          <View style={styles.customWorkoutStat}>
                            <Clock size={14} color="#6B7280" />
                            <Text style={styles.customWorkoutStatText}>{workout.duration}min</Text>
                          </View>
                          <View style={styles.customWorkoutStat}>
                            <Target size={14} color="#6B7280" />
                            <Text style={styles.customWorkoutStatText}>{workout.rounds} rounds</Text>
                          </View>
                        </View>
                        
                        <View style={styles.customWorkoutLevel}>
                          <Text style={[styles.customWorkoutLevelText, 
                            workout.level === 'Beginner' && styles.levelBeginner,
                            workout.level === 'Intermediate' && styles.levelIntermediate,
                            workout.level === 'Advanced' && styles.levelAdvanced
                          ]}>
                            {workout.level}
                          </Text>
                        </View>
                      </TouchableOpacity>
                    </View>
                  ))}
                </ScrollView>
              </View>
            )}

            {/* Featured Techniques Preview */}
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <View style={styles.sectionTitleRow}>
                  <Video size={20} color="#FF6B35" />
                  <Text style={styles.sectionTitle}>Featured Techniques</Text>
                </View>
                <TouchableOpacity onPress={handleTutorials}>
                  <Text style={styles.viewAllText}>View All</Text>
                </TouchableOpacity>
              </View>
              <Text style={styles.sectionSubtitle}>All include video demos</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalScroll}>
                {featuredTechniques.map((technique) => (
                  <TechniqueCard
                    key={technique.id}
                    technique={technique}
                    onPress={() => handleTechniquePress(technique.id)}
                    size="small"
                  />
                ))}
              </ScrollView>
            </View>

            {/* Quick Actions */}
            <View style={styles.quickActionsSection}>
              <Text style={styles.sectionTitle}>Quick Start</Text>
              <View style={styles.quickActionsGrid}>
                <TouchableOpacity
                  style={styles.quickActionCard}
                  onPress={handleCreateCustomWorkout}
                >
                  <View style={[styles.quickActionIcon, { backgroundColor: '#FF6B35' }]}>
                    <Plus size={24} color="#fff" />
                  </View>
                  <Text style={styles.quickActionTitle}>Custom Workout</Text>
                  <Text style={styles.quickActionSubtitle}>Build your own</Text>
                </TouchableOpacity>
                
              
                
                <TouchableOpacity
                  style={[styles.quickActionCard, styles.newFeatureCard]}
                  onPress={() => router.push('/timed-workout-player?id=jab-cross-focus')}
                >
                  <View style={[styles.quickActionIcon, { backgroundColor: '#FF4500' }]}>
                    <Clock size={24} color="#fff" />
                  </View>
                  <Text style={[styles.quickActionTitle, styles.newFeatureTitle]}>🥊 3-MIN ROUNDS</Text>
                  <Text style={styles.quickActionSubtitle}>Real boxing coach</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Featured Combos */}
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <View style={styles.sectionTitleRow}>
                  <Target size={20} color="#FF6B35" />
                  <Text style={styles.sectionTitle}>Boxing Combos</Text>
                </View>
                <TouchableOpacity onPress={handleViewAllCombos}>
                  <Text style={styles.viewAllText}>View All</Text>
                </TouchableOpacity>
              </View>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalScroll}>
                {beginnerCombos.map((combo) => (
                  <ComboCard
                    key={combo.id}
                    combo={combo}
                    onPress={() => handleComboPress(combo.id)}
                    size="small"
                  />
                ))}
              </ScrollView>
            </View>

            {/* Featured Workouts */}
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <View style={styles.sectionTitleRow}>
                  <Star size={20} color="#FFB800" />
                  <Text style={styles.sectionTitle}>Featured Workouts</Text>
                </View>
              </View>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalScroll}>
                {featuredWorkouts.map((workout) => (
                  <WorkoutCard
                    key={workout.id}
                    workout={workout}
                    onPress={() => handleWorkoutPress(workout.id)}
                    size="small"
                  />
                ))}
              </ScrollView>
            </View>

            {/* Popular This Week */}
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <View style={styles.sectionTitleRow}>
                  <TrendingUp size={20} color="#8B5CF6" />
                  <Text style={styles.sectionTitle}>Trending</Text>
                </View>
              </View>
              {popularWorkouts.map((workout) => (
                <WorkoutCard
                  key={workout.id}
                  workout={workout}
                  onPress={() => handleWorkoutPress(workout.id)}
                />
              ))}
            </View>

            {/* All Workouts Preview */}
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>All Workouts</Text>
                <TouchableOpacity onPress={() => router.push('/workouts')}>
                  <Text style={styles.viewAllText}>View All</Text>
                </TouchableOpacity>
              </View>
              {workouts.slice(0, 2).map((workout) => (
                <WorkoutCard
                  key={workout.id}
                  workout={workout}
                  onPress={() => handleWorkoutPress(workout.id)}
                />
              ))}
            </View>
          </>
        )}

        {/* Bottom padding */}
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
  heroHeader: {
    backgroundColor: '#fff',
    paddingTop: 20,
    paddingBottom: 24,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  userSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 12,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#E5E7EB',
  },
  statusIndicator: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#00D4AA',
    borderWidth: 2,
    borderColor: '#fff',
  },
  userInfo: {
    flex: 1,
  },
  greeting: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    marginBottom: 2,
  },
  userName: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: '#111827',
  },
  notificationButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  quickStartHeroSection: {
    marginHorizontal: 20,
    marginTop: 8,
    borderRadius: 24,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 24,
    elevation: 12,
  },
  quickStartGradientOverlay: {
    backgroundColor: '#FEF3C7',
    borderWidth: 1,
    borderColor: '#FDE68A',
    position: 'relative',
  },
  quickStartCloseButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    zIndex: 10,
  },
  quickStartHeroContent: {
    padding: 32,
    alignItems: 'center',
  },
  quickStartIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255, 107, 53, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    borderWidth: 2,
    borderColor: 'rgba(255, 107, 53, 0.2)',
  },
  quickStartHeroTitle: {
    fontSize: 28,
    fontFamily: 'Inter-Bold',
    color: '#92400E',
    textAlign: 'center',
    marginBottom: 12,
    lineHeight: 34,
  },
  quickStartHeroSubtitle: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#A16207',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 32,
    paddingHorizontal: 20,
  },
  quickStartStatsGrid: {
    flexDirection: 'row',
    gap: 20,
    marginBottom: 32,
  },
  quickStartStatCard: {
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    minWidth: 80,
    borderWidth: 1,
    borderColor: '#FDE68A',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  quickStartStatNumber: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#111827',
    marginTop: 8,
    marginBottom: 4,
  },
  quickStartStatLabel: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#6B7280',
  },
  quickStartCTA: {
    backgroundColor: '#FF6B35',
    borderRadius: 20,
    paddingVertical: 18,
    paddingHorizontal: 32,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    shadowColor: '#FF6B35',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
    minWidth: 200,
  },
  quickStartCTAText: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#fff',
  },
  statsSection: {
    backgroundColor: '#fff',
    padding: 20,
    marginTop: 8,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginTop: 16,
  },
  statCard: {
    flex: 1,
    minWidth: '47%',
    backgroundColor: '#FAFAFA',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  statIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  statValue: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#111827',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#6B7280',
    marginBottom: 4,
  },
  statChange: {
    fontSize: 10,
    fontFamily: 'Inter-Regular',
    color: '#00D4AA',
  },
  searchContainer: {
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingVertical: 16,
    marginTop: 8,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#111827',
    marginLeft: 12,
  },
  tutorialHeroSection: {
    marginHorizontal: 20,
    marginTop: 8,
    borderRadius: 24,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 24,
    elevation: 12,
  },
  tutorialGradientOverlay: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    position: 'relative',
  },
  tutorialHeroContent: {
    padding: 32,
    alignItems: 'center',
  },
  tutorialIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255, 107, 53, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    borderWidth: 2,
    borderColor: 'rgba(255, 107, 53, 0.2)',
  },
  tutorialHeroTitle: {
    fontSize: 28,
    fontFamily: 'Inter-Bold',
    color: '#1F2937',
    textAlign: 'center',
    marginBottom: 12,
    lineHeight: 34,
  },
  tutorialHeroSubtitle: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 32,
    paddingHorizontal: 20,
  },
  tutorialStatsGrid: {
    flexDirection: 'row',
    gap: 20,
    marginBottom: 32,
  },
  tutorialStatCard: {
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    minWidth: 80,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  tutorialStatNumber: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#111827',
    marginTop: 8,
    marginBottom: 4,
  },
  tutorialStatLabel: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#6B7280',
  },
  tutorialCTA: {
    backgroundColor: '#FF6B35',
    borderRadius: 20,
    paddingVertical: 18,
    paddingHorizontal: 32,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    shadowColor: '#FF6B35',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
    minWidth: 200,
  },
  tutorialCTAText: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#fff',
  },
  quickActionsSection: {
    backgroundColor: '#fff',
    padding: 20,
    marginTop: 8,
  },
  quickActionsGrid: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 16,
  },
  quickActionCard: {
    flex: 1,
    backgroundColor: '#FAFAFA',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  quickActionIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  quickActionTitle: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#111827',
    textAlign: 'center',
    marginBottom: 4,
  },
  newFeatureCard: {
    borderWidth: 2,
    borderColor: '#FF4500',
    backgroundColor: 'rgba(255, 69, 0, 0.05)',
  },
  newFeatureTitle: {
    color: '#FF4500',
    fontWeight: '700',
  },
  quickActionSubtitle: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    textAlign: 'center',
  },
  section: {
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
  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#111827',
    marginLeft: 8,
  },
  sectionSubtitle: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    marginBottom: 16,
    marginLeft: 28,
  },
  viewAllText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#FF6B35',
  },
  horizontalScroll: {
    marginHorizontal: -20,
    paddingHorizontal: 20,
  },
  noResults: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    textAlign: 'center',
    marginTop: 20,
    fontStyle: 'italic',
  },
  bottomPadding: {
    height: 40,
  },
  customWorkoutCard: {
    width: 280,
    marginRight: 16,
    backgroundColor: '#fff',
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#8B5CF6',
    shadowColor: '#8B5CF6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    overflow: 'hidden',
  },
  customWorkoutContent: {
    padding: 20,
  },
  customWorkoutHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  customWorkoutIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(139, 92, 246, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'rgba(139, 92, 246, 0.2)',
  },
  customWorkoutBadge: {
    backgroundColor: '#8B5CF6',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  customWorkoutBadgeText: {
    fontSize: 10,
    fontFamily: 'Inter-Bold',
    color: '#fff',
    letterSpacing: 0.5,
  },
  customWorkoutTitle: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#111827',
    marginBottom: 8,
  },
  customWorkoutDescription: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    lineHeight: 20,
    marginBottom: 16,
  },
  customWorkoutStats: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 16,
  },
  customWorkoutStat: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  customWorkoutStatText: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#6B7280',
  },
  customWorkoutLevel: {
    alignSelf: 'flex-start',
  },
  customWorkoutLevelText: {
    fontSize: 12,
    fontFamily: 'Inter-Bold',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    overflow: 'hidden',
  },
  levelBeginner: {
    backgroundColor: 'rgba(34, 197, 94, 0.1)',
    color: '#16A34A',
  },
  levelIntermediate: {
    backgroundColor: 'rgba(251, 146, 60, 0.1)',
    color: '#EA580C',
  },
  levelAdvanced: {
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    color: '#DC2626',
  },
  // Premium Quick-Start Card Styles
  premiumQuickStartCard: {
    marginHorizontal: 20,
    marginTop: 8,
    borderRadius: 24,
    overflow: 'hidden',
    shadowColor: '#FF6B35',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.25,
    shadowRadius: 24,
    elevation: 16,
  },
  premiumCardBackground: {
    backgroundColor: '#FF6B35',
    position: 'relative',
    padding: 28,
  },
  premiumCloseButton: {
    position: 'absolute',
    top: 20,
    right: 20,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  premiumBadge: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  premiumBadgeText: {
    fontSize: 11,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
    letterSpacing: 1,
  },
  premiumContent: {
    flex: 1,
  },
  premiumHeaderSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  premiumIconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  premiumTitleContainer: {
    flex: 1,
  },
  premiumTitle: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
    marginBottom: 4,
    lineHeight: 28,
  },
  premiumSubtitle: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: 'rgba(255, 255, 255, 0.8)',
    lineHeight: 20,
  },
  premiumDescription: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: 'rgba(255, 255, 255, 0.9)',
    lineHeight: 24,
    marginBottom: 28,
  },
  premiumStatsContainer: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 16,
    padding: 20,
    marginBottom: 28,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  premiumStatItem: {
    flex: 1,
    alignItems: 'center',
  },
  premiumStatIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  premiumStatNumber: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  premiumStatLabel: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
  },
  premiumStatDivider: {
    width: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    marginHorizontal: 16,
  },
  premiumCTAButton: {
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    borderRadius: 16,
    paddingVertical: 18,
    paddingHorizontal: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  premiumCTAContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  premiumCTAText: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
  },
  premiumFooter: {
    alignItems: 'center',
  },
  premiumFooterText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
    lineHeight: 20,
  },
  // Mini Quick-Start Card Styles
  miniQuickStartCard: {
    marginHorizontal: 20,
    marginTop: 8,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
    position: 'relative',
  },
  miniCloseButton: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#F9FAFB',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  miniCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    paddingRight: 48, // Space for close button
  },
  miniLeftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  miniIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 107, 53, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 107, 53, 0.2)',
  },
  miniTitleContainer: {
    flex: 1,
  },
  miniTitle: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    color: '#111827',
    marginBottom: 2,
  },
  miniSubtitle: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
  },
  miniRightSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  miniStats: {
    alignItems: 'flex-end',
  },
  miniStatNumber: {
    fontSize: 14,
    fontFamily: 'Inter-Bold',
    color: '#111827',
    marginBottom: 2,
  },
  miniStatLabel: {
    fontSize: 11,
    fontFamily: 'Inter-Medium',
    color: '#6B7280',
  },
});