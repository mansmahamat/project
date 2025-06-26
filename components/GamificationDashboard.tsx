import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Modal,
  Dimensions,
} from 'react-native';
import { 
  Trophy, 
  Star, 
  Target, 
  Flame, 
  Calendar, 
  Award, 
  Zap, 
  Crown,
  Lock,
  CheckCircle2,
  X,
  TrendingUp,
  Clock,
  Medal,
} from 'lucide-react-native';
import { useProgressStore, BOXING_RANKS, getAvailableAchievements } from '@/stores';
import { AchievementRarity, AchievementCategory, BoxingRank } from '@/types/workout';

const { width } = Dimensions.get('window');

interface GamificationDashboardProps {
  visible: boolean;
  onClose: () => void;
}

export const GamificationDashboard: React.FC<GamificationDashboardProps> = ({ visible, onClose }) => {
  const { 
    progress, 
    getCurrentRank, 
    generateDailyChallenges,
    completeDailyChallenge
  } = useProgressStore();

  const [activeTab, setActiveTab] = useState<'overview' | 'achievements' | 'challenges' | 'rank'>('overview');

  const currentRank = getCurrentRank();
  const nextRank = BOXING_RANKS.find(rank => rank.xpRequired > progress.totalXP);
  const allAchievements = getAvailableAchievements();
  
  // Calculate progress to next rank
  const currentRankXP = currentRank.xpRequired;
  const nextRankXP = nextRank?.xpRequired || currentRank.xpRequired;
  const progressToNext = nextRank ? 
    Math.floor(((progress.totalXP - currentRankXP) / (nextRankXP - currentRankXP)) * 100) : 100;

  // Group achievements by category
  const achievementsByCategory = {
    starter: allAchievements.filter((a: any) => a.category === 'starter'),
    consistency: allAchievements.filter((a: any) => a.category === 'consistency'),
    performance: allAchievements.filter((a: any) => a.category === 'performance'),
    exploration: allAchievements.filter((a: any) => a.category === 'exploration'),
    mastery: allAchievements.filter((a: any) => a.category === 'mastery'),
    legendary: allAchievements.filter((a: any) => a.category === 'legendary'),
  };

  const unlockedCount = progress.achievements.length;
  const totalCount = allAchievements.length;

  const getRarityColor = (rarity: AchievementRarity) => {
    switch (rarity) {
      case 'common': return '#9CA3AF';
      case 'uncommon': return '#10B981';
      case 'rare': return '#3B82F6';
      case 'epic': return '#8B5CF6';
      case 'legendary': return '#F59E0B';
      default: return '#9CA3AF';
    }
  };

  const getCategoryIcon = (category: AchievementCategory) => {
    switch (category) {
      case 'starter': return Star;
      case 'consistency': return Flame;
      case 'performance': return Trophy;
      case 'exploration': return Target;
      case 'mastery': return Crown;
      case 'legendary': return Medal;
      default: return Star;
    }
  };

  const isAchievementUnlocked = (achievementId: string) => {
    return progress.achievements.some(a => a.id === achievementId);
  };

  const renderOverview = () => (
    <ScrollView style={styles.tabContent} showsVerticalScrollIndicator={false}>
      {/* Rank & XP Section */}
      <View style={styles.rankCard}>
        <View style={styles.rankHeader}>
          <View style={styles.rankIconContainer}>
            <Text style={styles.rankIcon}>{currentRank.icon}</Text>
          </View>
          <View style={styles.rankInfo}>
            <Text style={styles.rankName}>{currentRank.name}</Text>
            <Text style={styles.rankTitle}>{currentRank.title}</Text>
          </View>
          <View style={styles.xpInfo}>
            <Text style={styles.xpValue}>{progress.totalXP.toLocaleString()}</Text>
            <Text style={styles.xpLabel}>XP</Text>
          </View>
        </View>
        
        {nextRank && (
          <>
            <View style={styles.progressContainer}>
              <View style={[styles.progressBar, { width: `${progressToNext}%` }]} />
            </View>
            <Text style={styles.progressText}>
              {nextRankXP - progress.totalXP} XP to {nextRank.name}
            </Text>
          </>
        )}
      </View>

      {/* Quick Stats */}
      <View style={styles.statsGrid}>
        <View style={styles.statCard}>
          <Trophy size={24} color="#FF6B35" />
          <Text style={styles.statValue}>{unlockedCount}</Text>
          <Text style={styles.statLabel}>Achievements</Text>
        </View>
        <View style={styles.statCard}>
          <TrendingUp size={24} color="#00D4AA" />
          <Text style={styles.statValue}>{currentRank.level}</Text>
          <Text style={styles.statLabel}>Fighter Level</Text>
        </View>
        <View style={styles.statCard}>
          <Flame size={24} color="#FFB800" />
          <Text style={styles.statValue}>{progress.currentStreak}</Text>
          <Text style={styles.statLabel}>Day Streak</Text>
        </View>
      </View>

      {/* Daily Challenges */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Daily Challenges</Text>
        {progress.dailyChallenges.length === 0 ? (
          <TouchableOpacity 
            style={styles.generateButton}
            onPress={generateDailyChallenges}
          >
            <Calendar size={20} color="#fff" />
            <Text style={styles.generateButtonText}>Generate Today's Challenges</Text>
          </TouchableOpacity>
        ) : (
          progress.dailyChallenges.map((challenge) => (
            <View key={challenge.id} style={styles.challengeCard}>
              <View style={styles.challengeHeader}>
                <Text style={styles.challengeTitle}>{challenge.title}</Text>
                <View style={styles.xpReward}>
                  <Zap size={12} color="#FFB800" />
                  <Text style={styles.xpRewardText}>{challenge.xpReward}</Text>
                </View>
              </View>
              <Text style={styles.challengeDescription}>{challenge.description}</Text>
              <View style={styles.challengeProgress}>
                <View style={styles.challengeProgressBar}>
                  <View 
                    style={[
                      styles.challengeProgressFill, 
                      { width: `${Math.min((challenge.progress / challenge.target) * 100, 100)}%` }
                    ]} 
                  />
                </View>
                <Text style={styles.challengeProgressText}>
                  {challenge.progress}/{challenge.target}
                </Text>
                {challenge.completed && (
                  <CheckCircle2 size={16} color="#10B981" />
                )}
              </View>
            </View>
          ))
        )}
      </View>

      {/* Recent Achievements */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Recent Achievements</Text>
        {progress.achievements.slice(0, 3).map((achievement: any) => {
          const extendedAchievement = allAchievements.find((a: any) => a.id === achievement.id);
          return (
            <View key={achievement.id} style={styles.achievementCard}>
              <View style={styles.achievementHeader}>
                <View style={styles.achievementIconContainer}>
                  <Text style={styles.achievementIcon}>{achievement.icon}</Text>
                </View>
                <View style={styles.achievementInfo}>
                  <Text style={styles.achievementTitle}>{achievement.title}</Text>
                  <Text style={styles.achievementDescription}>{achievement.description}</Text>
                </View>
                <View style={[
                  styles.rarityBadge, 
                  { backgroundColor: getRarityColor(extendedAchievement?.rarity || 'common') }
                ]}>
                  <Text style={styles.rarityText}>
                    {extendedAchievement?.rarity?.toUpperCase() || 'COMMON'}
                  </Text>
                </View>
              </View>
            </View>
          );
        })}
      </View>
    </ScrollView>
  );

  const renderAchievements = () => (
    <ScrollView style={styles.tabContent} showsVerticalScrollIndicator={false}>
      <View style={styles.achievementStats}>
        <Text style={styles.achievementStatsText}>
          {unlockedCount} of {totalCount} Achievements Unlocked
        </Text>
        <View style={styles.achievementProgressContainer}>
          <View style={[
            styles.achievementProgressBar,
            { width: `${(unlockedCount / totalCount) * 100}%` }
          ]} />
        </View>
      </View>

      {Object.entries(achievementsByCategory).map(([category, achievements]) => {
        const CategoryIcon = getCategoryIcon(category as AchievementCategory);
        const unlockedInCategory = achievements.filter((a: any) => isAchievementUnlocked(a.id)).length;
        
        return (
          <View key={category} style={styles.categorySection}>
            <View style={styles.categoryHeader}>
              <CategoryIcon size={20} color="#FF6B35" />
              <Text style={styles.categoryTitle}>
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </Text>
              <Text style={styles.categoryProgress}>
                {unlockedInCategory}/{achievements.length}
              </Text>
            </View>
            
            <View style={styles.achievementGrid}>
              {achievements.map((achievement: any) => {
                const unlocked = isAchievementUnlocked(achievement.id);
                const isSecret = achievement.secret && !unlocked;
                
                return (
                  <View 
                    key={achievement.id} 
                    style={[
                      styles.achievementGridItem,
                      unlocked && styles.achievementUnlocked,
                      !unlocked && styles.achievementLocked,
                    ]}
                  >
                    <View style={styles.achievementGridIcon}>
                      {isSecret ? (
                        <Lock size={24} color="#9CA3AF" />
                      ) : (
                        <Text style={styles.achievementGridEmoji}>
                          {unlocked ? achievement.icon : '🔒'}
                        </Text>
                      )}
                    </View>
                    <Text style={[
                      styles.achievementGridTitle,
                      !unlocked && styles.lockedText
                    ]}>
                      {isSecret ? 'Secret Achievement' : achievement.title}
                    </Text>
                    <Text style={[
                      styles.achievementGridDesc,
                      !unlocked && styles.lockedText
                    ]}>
                      {isSecret ? 'Complete to unlock' : achievement.description}
                    </Text>
                    <View style={[
                      styles.rarityBadgeSmall,
                      { backgroundColor: getRarityColor(achievement.rarity) }
                    ]}>
                      <Text style={styles.rarityTextSmall}>
                        {achievement.rarity.toUpperCase()}
                      </Text>
                    </View>
                    <View style={styles.xpBadge}>
                      <Zap size={10} color="#FFB800" />
                      <Text style={styles.xpBadgeText}>{achievement.xpReward}</Text>
                    </View>
                  </View>
                );
              })}
            </View>
          </View>
        );
      })}
    </ScrollView>
  );

  const renderRankSystem = () => (
    <ScrollView style={styles.tabContent} showsVerticalScrollIndicator={false}>
      <View style={styles.currentRankDisplay}>
        <Text style={styles.currentRankTitle}>Current Rank</Text>
        <View style={styles.currentRankCard}>
          <Text style={styles.currentRankIcon}>{currentRank.icon}</Text>
          <Text style={styles.currentRankName}>{currentRank.name}</Text>
          <Text style={styles.currentRankSubtitle}>{currentRank.title}</Text>
        </View>
      </View>

      <View style={styles.rankList}>
        <Text style={styles.sectionTitle}>All Boxing Ranks</Text>
        {BOXING_RANKS.map((rank, index) => {
          const isCurrentRank = rank.id === currentRank.id;
          const isUnlocked = progress.totalXP >= rank.xpRequired;
          
          return (
            <View 
              key={rank.id} 
              style={[
                styles.rankListItem,
                isCurrentRank && styles.currentRankItem,
                !isUnlocked && styles.lockedRankItem,
              ]}
            >
              <View style={styles.rankListIcon}>
                <Text style={[
                  styles.rankListEmoji,
                  !isUnlocked && styles.lockedEmoji
                ]}>
                  {isUnlocked ? rank.icon : '🔒'}
                </Text>
              </View>
              <View style={styles.rankListInfo}>
                <Text style={[
                  styles.rankListName,
                  isCurrentRank && styles.currentRankText,
                  !isUnlocked && styles.lockedText
                ]}>
                  {rank.name}
                </Text>
                <Text style={[
                  styles.rankListTitle,
                  !isUnlocked && styles.lockedText
                ]}>
                  {rank.title}
                </Text>
              </View>
              <View style={styles.rankListXP}>
                <Text style={[
                  styles.rankListXPText,
                  isCurrentRank && styles.currentRankText,
                  !isUnlocked && styles.lockedText
                ]}>
                  {rank.xpRequired.toLocaleString()} XP
                </Text>
                {isCurrentRank && (
                  <Text style={styles.currentBadge}>CURRENT</Text>
                )}
              </View>
            </View>
          );
        })}
      </View>
    </ScrollView>
  );

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <X size={24} color="#6B7280" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Fighter Profile</Text>
          <View style={styles.headerRight}>
            <Text style={styles.headerXP}>{progress.totalXP.toLocaleString()} XP</Text>
          </View>
        </View>

        {/* Tab Navigation */}
        <View style={styles.tabBar}>
          {[
            { id: 'overview', label: 'Overview', icon: TrendingUp },
            { id: 'achievements', label: 'Achievements', icon: Trophy },
            { id: 'challenges', label: 'Challenges', icon: Target },
            { id: 'rank', label: 'Ranks', icon: Crown },
          ].map(({ id, label, icon: Icon }) => (
            <TouchableOpacity
              key={id}
              style={[styles.tabButton, activeTab === id && styles.activeTab]}
              onPress={() => setActiveTab(id as any)}
            >
              <Icon size={16} color={activeTab === id ? '#FF6B35' : '#6B7280'} />
              <Text style={[
                styles.tabLabel,
                activeTab === id && styles.activeTabLabel
              ]}>
                {label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Tab Content */}
        {activeTab === 'overview' && renderOverview()}
        {activeTab === 'achievements' && renderAchievements()}
        {activeTab === 'challenges' && (
          <View style={styles.tabContent}>
            <Text style={styles.comingSoon}>Daily Challenges Coming Soon!</Text>
          </View>
        )}
        {activeTab === 'rank' && renderRankSystem()}
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
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
  closeButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#111827',
  },
  headerRight: {
    alignItems: 'flex-end',
  },
  headerXP: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    color: '#FF6B35',
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: '#F9FAFB',
    paddingHorizontal: 20,
    paddingVertical: 8,
  },
  tabButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    gap: 4,
  },
  activeTab: {
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  tabLabel: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
    color: '#6B7280',
  },
  activeTabLabel: {
    color: '#FF6B35',
  },
  tabContent: {
    flex: 1,
    padding: 20,
  },
  rankCard: {
    backgroundColor: '#F9FAFB',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
  },
  rankHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  rankIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  rankIcon: {
    fontSize: 28,
  },
  rankInfo: {
    flex: 1,
  },
  rankName: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#111827',
  },
  rankTitle: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
  },
  xpInfo: {
    alignItems: 'flex-end',
  },
  xpValue: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: '#FF6B35',
  },
  xpLabel: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
  },
  progressContainer: {
    height: 8,
    backgroundColor: '#E5E7EB',
    borderRadius: 4,
    marginBottom: 8,
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#FF6B35',
    borderRadius: 4,
  },
  progressText: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#6B7280',
    textAlign: 'center',
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#111827',
    marginTop: 8,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    color: '#111827',
    marginBottom: 12,
  },
  generateButton: {
    backgroundColor: '#FF6B35',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  generateButtonText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#fff',
  },
  challengeCard: {
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  challengeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  challengeTitle: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#111827',
  },
  xpReward: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  xpRewardText: {
    fontSize: 12,
    fontFamily: 'Inter-Bold',
    color: '#F59E0B',
  },
  challengeDescription: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    marginBottom: 12,
  },
  challengeProgress: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  challengeProgressBar: {
    flex: 1,
    height: 6,
    backgroundColor: '#E5E7EB',
    borderRadius: 3,
  },
  challengeProgressFill: {
    height: '100%',
    backgroundColor: '#10B981',
    borderRadius: 3,
  },
  challengeProgressText: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#6B7280',
  },
  achievementCard: {
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  achievementHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  achievementIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  achievementIcon: {
    fontSize: 24,
  },
  achievementInfo: {
    flex: 1,
  },
  achievementTitle: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#111827',
    marginBottom: 4,
  },
  achievementDescription: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
  },
  rarityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  rarityText: {
    fontSize: 10,
    fontFamily: 'Inter-Bold',
    color: '#fff',
  },
  achievementStats: {
    marginBottom: 20,
  },
  achievementStatsText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#111827',
    textAlign: 'center',
    marginBottom: 8,
  },
  achievementProgressContainer: {
    height: 8,
    backgroundColor: '#E5E7EB',
    borderRadius: 4,
  },
  achievementProgressBar: {
    height: '100%',
    backgroundColor: '#FF6B35',
    borderRadius: 4,
  },
  categorySection: {
    marginBottom: 24,
  },
  categoryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 8,
  },
  categoryTitle: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    color: '#111827',
    flex: 1,
  },
  categoryProgress: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#FF6B35',
  },
  achievementGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  achievementGridItem: {
    width: (width - 56) / 2,
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    position: 'relative',
  },
  achievementUnlocked: {
    backgroundColor: '#F0FDF4',
    borderWidth: 1,
    borderColor: '#BBF7D0',
  },
  achievementLocked: {
    opacity: 0.6,
  },
  achievementGridIcon: {
    marginBottom: 8,
  },
  achievementGridEmoji: {
    fontSize: 32,
  },
  achievementGridTitle: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
    color: '#111827',
    textAlign: 'center',
    marginBottom: 4,
  },
  achievementGridDesc: {
    fontSize: 10,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 8,
  },
  lockedText: {
    color: '#9CA3AF',
  },
  rarityBadgeSmall: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    marginBottom: 4,
  },
  rarityTextSmall: {
    fontSize: 8,
    fontFamily: 'Inter-Bold',
    color: '#fff',
  },
  xpBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  xpBadgeText: {
    fontSize: 10,
    fontFamily: 'Inter-Bold',
    color: '#F59E0B',
  },
  currentRankDisplay: {
    alignItems: 'center',
    marginBottom: 24,
  },
  currentRankTitle: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    color: '#111827',
    marginBottom: 16,
  },
  currentRankCard: {
    backgroundColor: '#F9FAFB',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FF6B35',
  },
  currentRankIcon: {
    fontSize: 48,
    marginBottom: 8,
  },
  currentRankName: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#111827',
    marginBottom: 4,
  },
  currentRankSubtitle: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
  },
  rankList: {
    marginBottom: 20,
  },
  rankListItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
  },
  currentRankItem: {
    backgroundColor: '#FEF3C7',
    borderWidth: 1,
    borderColor: '#F59E0B',
  },
  lockedRankItem: {
    opacity: 0.6,
  },
  rankListIcon: {
    marginRight: 16,
  },
  rankListEmoji: {
    fontSize: 24,
  },
  lockedEmoji: {
    opacity: 0.5,
  },
  rankListInfo: {
    flex: 1,
  },
  rankListName: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#111827',
    marginBottom: 2,
  },
  rankListTitle: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
  },
  currentRankText: {
    color: '#F59E0B',
  },
  rankListXP: {
    alignItems: 'flex-end',
  },
  rankListXPText: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
    color: '#6B7280',
  },
  currentBadge: {
    fontSize: 8,
    fontFamily: 'Inter-Bold',
    color: '#F59E0B',
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    marginTop: 2,
  },
  comingSoon: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    textAlign: 'center',
    marginTop: 50,
  },
}); 