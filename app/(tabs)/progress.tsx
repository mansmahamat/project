import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Dimensions,
} from 'react-native';
import Animated from 'react-native-reanimated';
import { Calendar, TrendingUp, Target, Flame, Clock, Trophy, Award, Zap, Activity, CalendarDays } from 'lucide-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserProgress } from '@/types/workout';
import { useProgressStore, formatTime, getStreakEmoji, getAvailableAchievements } from '@/stores';
import { WorkoutCalendar } from '@/components/WorkoutCalendar';
import { GamificationButton } from '@/components/GamificationButton';
import { GamificationDashboard } from '@/components/GamificationDashboard';
import { HapticFeedback } from '@/utils/haptics';
import { useButtonPress, useProgressAnimation } from '@/utils/animations';

const { width } = Dimensions.get('window');

export default function ProgressScreen() {
  const { 
    progress, 
    getWeeklyStats, 
    getMonthlyStats, 
    getTodayStats,
    getRecentWorkouts,
    getWeeklyGoalProgress 
  } = useProgressStore();

  const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month' | 'year'>('week');
  const [viewMode, setViewMode] = useState<'stats' | 'calendar'>('stats');
  const [showGamification, setShowGamification] = useState(false);

  // Get real stats based on selected period
  const weeklyStats = getWeeklyStats();
  const monthlyStats = getMonthlyStats();
  const todayStats = getTodayStats();
  const recentWorkouts = getRecentWorkouts(7);
  const weeklyGoal = getWeeklyGoalProgress();

  // Generate weekly chart data from recent workouts
  const generateWeeklyData = () => {
    const today = new Date();
    const weekData = [];
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      date.setHours(0, 0, 0, 0);
      
      const nextDay = new Date(date);
      nextDay.setDate(nextDay.getDate() + 1);
      
      const dayWorkouts = progress.completedWorkouts.filter(workout => {
        const workoutDate = new Date(workout.completedAt);
        return workoutDate >= date && workoutDate < nextDay;
      });
      
      const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
      
      weekData.push({
        day: dayName,
        workouts: dayWorkouts.length,
        calories: dayWorkouts.reduce((sum, w) => sum + w.caloriesBurned, 0),
      });
    }
    
    return weekData;
  };

  const weeklyData = generateWeeklyData();
  const maxWorkouts = Math.max(...weeklyData.map(d => d.workouts), 1);
  const maxCalories = Math.max(...weeklyData.map(d => d.calories), 1);

  const StatCard = ({ icon, title, value, subtitle, color, trend }: {
    icon: React.ReactNode;
    title: string;
    value: string | number;
    subtitle?: string;
    color: string;
    trend?: string;
  }) => (
    <View style={styles.statCard}>
      <View style={[styles.statIconContainer, { backgroundColor: color }]}>
        {icon}
      </View>
      <View style={styles.statContent}>
        <Text style={styles.statValue}>{value}</Text>
        <Text style={styles.statTitle}>{title}</Text>
        {subtitle && <Text style={styles.statSubtitle}>{subtitle}</Text>}
        {trend && <Text style={styles.statTrend}>{trend}</Text>}
      </View>
    </View>
  );

  // Generate achievement status from real progress and available achievements
  const availableAchievements = getAvailableAchievements();
  const achievements = availableAchievements.slice(0, 4).map(achievement => ({
    ...achievement,
    unlocked: progress.achievements.some(a => a.id === achievement.id),
    color: achievement.rarity === 'common' ? '#9CA3AF' :
           achievement.rarity === 'uncommon' ? '#10B981' :
           achievement.rarity === 'rare' ? '#3B82F6' :
           achievement.rarity === 'epic' ? '#8B5CF6' : '#F59E0B'
  }));

  const unlockedAchievements = achievements.filter(a => a.unlocked);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} bounces={true}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Your Progress</Text>
          <Text style={styles.subtitle}>Track your boxing journey</Text>
        </View>

        {/* Gamification Button */}
        <GamificationButton onPress={() => setShowGamification(true)} />

        {/* View Mode Toggle */}
        <View style={styles.viewModeSelector}>
          <TouchableOpacity
            style={[
              styles.viewModeButton,
              viewMode === 'stats' && styles.viewModeButtonActive
            ]}
            onPress={() => {
              HapticFeedback.selection();
              setViewMode('stats');
            }}
          >
            <TrendingUp size={18} color={viewMode === 'stats' ? '#fff' : '#6B7280'} />
            <Text style={[
              styles.viewModeButtonText,
              viewMode === 'stats' && styles.viewModeButtonTextActive
            ]}>
              Stats
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.viewModeButton,
              viewMode === 'calendar' && styles.viewModeButtonActive
            ]}
            onPress={() => {
              HapticFeedback.selection();
              setViewMode('calendar');
            }}
          >
            <CalendarDays size={18} color={viewMode === 'calendar' ? '#fff' : '#6B7280'} />
            <Text style={[
              styles.viewModeButtonText,
              viewMode === 'calendar' && styles.viewModeButtonTextActive
            ]}>
              Calendar
            </Text>
          </TouchableOpacity>
        </View>

        {/* Period Selector (only show in stats mode) */}
        {viewMode === 'stats' && (
          <View style={styles.periodSelector}>
            {(['week', 'month', 'year'] as const).map((period) => (
              <TouchableOpacity
                key={period}
                style={[
                  styles.periodButton,
                  selectedPeriod === period && styles.periodButtonActive
                ]}
                onPress={() => {
                  HapticFeedback.selection();
                  setSelectedPeriod(period);
                }}
              >
                <Text style={[
                  styles.periodButtonText,
                  selectedPeriod === period && styles.periodButtonTextActive
                ]}>
                  {period.charAt(0).toUpperCase() + period.slice(1)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Conditional Content */}
        {viewMode === 'stats' ? (
          <>
            {/* Main Stats Grid */}
            <View style={styles.statsGrid}>
          <StatCard
            icon={<Target size={20} color="#fff" />}
            title="Workouts"
            value={progress.workoutsCompleted}
            subtitle="completed"
            color="#FF6B35"
            trend={`+${weeklyStats.workouts} this week`}
          />
          <StatCard
            icon={<Clock size={20} color="#fff" />}
            title="Time Trained"
            value={formatTime(progress.totalTimeMinutes)}
            color="#00D4AA"
            trend={`+${formatTime(weeklyStats.time)} this week`}
          />
          <StatCard
            icon={<Flame size={20} color="#fff" />}
            title="Calories"
            value={progress.caloriesBurned}
            subtitle="burned"
            color="#FFB800"
            trend={`+${weeklyStats.calories} this week`}
          />
          <StatCard
            icon={<TrendingUp size={20} color="#fff" />}
            title="Current Streak"
            value={`${progress.currentStreak} ${getStreakEmoji(progress.currentStreak)}`}
            subtitle="days"
            color="#8B5CF6"
            trend="Keep it up!"
          />
        </View>

        {/* Weekly Activity Chart */}
        <View style={styles.chartSection}>
          <Text style={styles.sectionTitle}>Weekly Activity</Text>
          <View style={styles.chartContainer}>
            <View style={styles.chart}>
              {weeklyData.map((data, index) => (
                <View key={index} style={styles.chartColumn}>
                  <View style={styles.chartBars}>
                    <View 
                      style={[
                        styles.chartBar,
                        styles.workoutBar,
                        { height: (data.workouts / maxWorkouts) * 60 }
                      ]} 
                    />
                    <View 
                      style={[
                        styles.chartBar,
                        styles.calorieBar,
                        { height: (data.calories / maxCalories) * 60 }
                      ]} 
                    />
                  </View>
                  <Text style={styles.chartLabel}>{data.day}</Text>
                </View>
              ))}
            </View>
            <View style={styles.chartLegend}>
              <View style={styles.legendItem}>
                <View style={[styles.legendColor, { backgroundColor: '#FF6B35' }]} />
                <Text style={styles.legendText}>Workouts</Text>
              </View>
              <View style={styles.legendItem}>
                <View style={[styles.legendColor, { backgroundColor: '#00D4AA' }]} />
                <Text style={styles.legendText}>Calories</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Personal Records */}
        <View style={styles.recordsSection}>
          <Text style={styles.sectionTitle}>Personal Records</Text>
          <View style={styles.recordsGrid}>
            <View style={styles.recordCard}>
              <Trophy size={24} color="#FFB800" />
              <Text style={styles.recordValue}>{progress.longestStreak}</Text>
              <Text style={styles.recordLabel}>Longest Streak</Text>
            </View>
            <View style={styles.recordCard}>
              <Activity size={24} color="#FF6B35" />
              <Text style={styles.recordValue}>
                {progress.completedWorkouts.length > 0 
                  ? Math.max(...progress.completedWorkouts.map(w => w.durationMinutes))
                  : 0}
              </Text>
              <Text style={styles.recordLabel}>Max Workout (min)</Text>
            </View>
            <View style={styles.recordCard}>
              <Zap size={24} color="#8B5CF6" />
              <Text style={styles.recordValue}>
                {progress.completedWorkouts.length > 0 
                  ? Math.max(...progress.completedWorkouts.map(w => w.caloriesBurned))
                  : 0}
              </Text>
              <Text style={styles.recordLabel}>Max Calories</Text>
            </View>
          </View>
        </View>

        {/* Achievements */}
        <View style={styles.achievementsSection}>
          <View style={styles.sectionHeader}>
            <Award size={20} color="#FFB800" />
            <Text style={styles.sectionTitle}>Achievements</Text>
          </View>
          
          <View style={styles.achievementsGrid}>
            {achievements.map((achievement) => (
              <View 
                key={achievement.id} 
                style={[
                  styles.achievementCard,
                  achievement.unlocked ? styles.achievementUnlocked : styles.achievementLocked
                ]}
              >
                <View style={[
                  styles.achievementIconContainer,
                  { backgroundColor: achievement.unlocked ? achievement.color : '#E5E7EB' }
                ]}>
                  <Text style={styles.achievementIcon}>
                    {achievement.unlocked ? achievement.icon : '🔒'}
                  </Text>
                </View>
                <Text style={[
                  styles.achievementTitle,
                  !achievement.unlocked && styles.achievementTitleLocked
                ]}>
                  {achievement.title}
                </Text>
                <Text style={[
                  styles.achievementDescription,
                  !achievement.unlocked && styles.achievementDescriptionLocked
                ]}>
                  {achievement.description}
                </Text>
                {achievement.unlocked && (
                  <View style={styles.xpBadge}>
                    <Zap size={10} color="#FFB800" />
                    <Text style={styles.xpBadgeText}>+{achievement.xpReward} XP</Text>
                  </View>
                )}
                <View style={[
                  styles.rarityIndicator,
                  { backgroundColor: achievement.color }
                ]}>
                  <Text style={styles.rarityText}>{achievement.rarity?.toUpperCase()}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Monthly Summary */}
        <View style={styles.summarySection}>
          <Text style={styles.sectionTitle}>This Month</Text>
          <View style={styles.summaryCard}>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Total Workouts</Text>
              <Text style={styles.summaryValue}>{monthlyStats.workouts}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Total Time</Text>
              <Text style={styles.summaryValue}>{formatTime(monthlyStats.time)}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Calories Burned</Text>
              <Text style={styles.summaryValue}>{monthlyStats.calories.toLocaleString()}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Average per Workout</Text>
              <Text style={styles.summaryValue}>
                {monthlyStats.workouts > 0 
                  ? Math.round(monthlyStats.calories / monthlyStats.workouts) 
                  : 0} cal
              </Text>
            </View>
          </View>
        </View>

            <View style={styles.bottomPadding} />
          </>
        ) : (
          /* Calendar View */
          <WorkoutCalendar />
        )}

        <View style={styles.bottomPadding} />
      </ScrollView>

      {/* Gamification Dashboard Modal */}
      <GamificationDashboard 
        visible={showGamification} 
        onClose={() => setShowGamification(false)} 
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    backgroundColor: '#fff',
    padding: 20,
    paddingTop: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  title: {
    fontSize: 28,
    fontFamily: 'Inter-Bold',
    color: '#111827',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
  },
  periodSelector: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    marginTop: 8,
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  periodButton: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginHorizontal: 4,
    backgroundColor: '#F9FAFB',
    alignItems: 'center',
  },
  periodButtonActive: {
    backgroundColor: '#FF6B35',
  },
  periodButtonText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#6B7280',
  },
  periodButtonTextActive: {
    color: '#fff',
  },
  viewModeSelector: {
    flexDirection: 'row',
    backgroundColor: '#F3F4F6',
    marginHorizontal: 20,
    marginTop: 8,
    borderRadius: 12,
    padding: 4,
  },
  viewModeButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    gap: 6,
  },
  viewModeButtonActive: {
    backgroundColor: '#FF6B35',
  },
  viewModeButtonText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#6B7280',
  },
  viewModeButtonTextActive: {
    color: '#fff',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 20,
    gap: 12,
    backgroundColor: '#fff',
    marginTop: 8,
  },
  statCard: {
    flex: 1,
    minWidth: '47%',
    backgroundColor: '#FAFAFA',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  statIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  statContent: {
    alignItems: 'flex-start',
  },
  statValue: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: '#111827',
    marginBottom: 4,
  },
  statTitle: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#6B7280',
    marginBottom: 2,
  },
  statSubtitle: {
    fontSize: 10,
    fontFamily: 'Inter-Regular',
    color: '#9CA3AF',
    marginBottom: 4,
  },
  statTrend: {
    fontSize: 10,
    fontFamily: 'Inter-SemiBold',
    color: '#00D4AA',
  },
  chartSection: {
    backgroundColor: '#fff',
    padding: 20,
    marginTop: 8,
  },
  chartContainer: {
    marginTop: 16,
  },
  chart: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: 100,
    marginBottom: 16,
  },
  chartColumn: {
    flex: 1,
    alignItems: 'center',
  },
  chartBars: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    height: 80,
    marginBottom: 8,
    gap: 2,
  },
  chartBar: {
    width: 8,
    borderRadius: 4,
    minHeight: 4,
  },
  workoutBar: {
    backgroundColor: '#FF6B35',
  },
  calorieBar: {
    backgroundColor: '#00D4AA',
  },
  chartLabel: {
    fontSize: 10,
    fontFamily: 'Inter-Medium',
    color: '#6B7280',
  },
  chartLegend: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 20,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  legendColor: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  legendText: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#6B7280',
  },
  recordsSection: {
    backgroundColor: '#fff',
    padding: 20,
    marginTop: 8,
  },
  recordsGrid: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 16,
  },
  recordCard: {
    flex: 1,
    backgroundColor: '#FAFAFA',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  recordValue: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: '#111827',
    marginTop: 8,
    marginBottom: 4,
  },
  recordLabel: {
    fontSize: 11,
    fontFamily: 'Inter-Medium',
    color: '#6B7280',
    textAlign: 'center',
  },
  achievementsSection: {
    backgroundColor: '#fff',
    padding: 20,
    marginTop: 8,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#111827',
    marginLeft: 8,
  },
  achievementsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  achievementCard: {
    flex: 1,
    minWidth: '47%',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
  },
  achievementUnlocked: {
    backgroundColor: '#F0FDF4',
    borderColor: '#BBF7D0',
  },
  achievementLocked: {
    backgroundColor: '#F9FAFB',
    borderColor: '#E5E7EB',
  },
  achievementIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  achievementIcon: {
    fontSize: 24,
  },
  achievementTitle: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#111827',
    textAlign: 'center',
    marginBottom: 4,
  },
  achievementTitleLocked: {
    color: '#9CA3AF',
  },
  achievementDescription: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    textAlign: 'center',
  },
  achievementDescriptionLocked: {
    color: '#D1D5DB',
  },
  xpBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    marginTop: 8,
  },
  xpBadgeText: {
    fontSize: 10,
    fontFamily: 'Inter-Bold',
    color: '#F59E0B',
  },
  rarityIndicator: {
    position: 'absolute',
    top: 8,
    right: 8,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  rarityText: {
    fontSize: 8,
    fontFamily: 'Inter-Bold',
    color: '#fff',
  },
  summarySection: {
    backgroundColor: '#fff',
    padding: 20,
    marginTop: 8,
  },
  summaryCard: {
    backgroundColor: '#FAFAFA',
    borderRadius: 12,
    padding: 16,
    marginTop: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  summaryLabel: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
  },
  summaryValue: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#111827',
  },
  bottomPadding: {
    height: 40,
  },
});