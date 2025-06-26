import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { ArrowLeft, Play, Target, Clock, Lightbulb } from 'lucide-react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { getComboById, getPunchByNumber } from '@/data/punches';
import { PunchSequenceDisplay } from '@/components/PunchSequenceDisplay';
import { Combo } from '@/types/workout';

export default function ComboDetailScreen() {
  const { id } = useLocalSearchParams();
  const [combo, setCombo] = useState<Combo | null>(null);

  useEffect(() => {
    if (id) {
      const foundCombo = getComboById(id as string);
      setCombo(foundCombo || null);
    }
  }, [id]);

  if (!combo) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.center}>
          <Text style={styles.errorText}>Combo not found</Text>
        </View>
      </SafeAreaView>
    );
  }

  const handlePracticeCombo = () => {
    // Map combos to new 3-minute timed workouts
    let timedWorkoutId = '';
    
    if (combo.id === 'jab-cross' || combo.name.toLowerCase().includes('jab-cross') || 
        (combo.sequence.length === 2 && combo.sequence[0] === 1 && combo.sequence[1] === 2)) {
      timedWorkoutId = 'jab-cross-focus';
    } else if (combo.id === 'jab-jab-cross' || combo.name.toLowerCase().includes('jab-jab-cross') ||
               (combo.sequence.length === 3 && combo.sequence[0] === 1 && combo.sequence[1] === 1 && combo.sequence[2] === 2)) {
      timedWorkoutId = 'jab-jab-cross-focus';
    } else if (combo.id === 'jab-cross-hook' || combo.name.toLowerCase().includes('1-2-3') ||
               (combo.sequence.length === 3 && combo.sequence[0] === 1 && combo.sequence[1] === 2 && combo.sequence[2] === 3)) {
      timedWorkoutId = 'jab-cross-hook-focus';
    } else {
      // Default to jab-cross if no specific match
      timedWorkoutId = 'jab-cross-focus';
    }
    
    // Use the new 3-minute timed workout system
    router.push(`/timed-workout-player?id=${timedWorkoutId}`);
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'Beginner': return '#4CAF50';
      case 'Intermediate': return '#FF9800';
      case 'Advanced': return '#F44336';
      default: return '#666';
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <ArrowLeft size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Combo Details</Text>
          <View style={{ width: 40 }} />
        </View>

        <View style={styles.content}>
          <View style={styles.titleSection}>
            <Text style={styles.title}>{combo.name}</Text>
            <Text style={[styles.level, { color: getLevelColor(combo.level) }]}>
              {combo.level}
            </Text>
          </View>

          <Text style={styles.description}>{combo.description}</Text>

          <View style={styles.sequenceSection}>
            <Text style={styles.sectionTitle}>Punches You'll Practice</Text>
            <View style={styles.expectationContainer}>
              {Array.from(new Set(combo.sequence)).map((punchNumber, index) => {
                const punch = getPunchByNumber(punchNumber);
                return (
                  <View key={punchNumber} style={styles.expectationBadge}>
                    <Text style={styles.expectationNumber}>{punchNumber}</Text>
                    <Text style={styles.expectationText}>{punch?.name}</Text>
                  </View>
                );
              })}
            </View>
            <Text style={styles.sequenceDescription}>
              You'll practice these punches in various combinations throughout the 3-minute rounds
            </Text>
          </View>

          <View style={styles.stats}>
            <View style={styles.stat}>
              <Target size={20} color="#FF4500" />
              <Text style={styles.statValue}>{combo.sequence.length}</Text>
              <Text style={styles.statLabel}>punches</Text>
            </View>
            <View style={styles.stat}>
              <Clock size={20} color="#FF4500" />
              <Text style={styles.statValue}>{combo.sequence.length * 2}</Text>
              <Text style={styles.statLabel}>seconds</Text>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Punch Breakdown</Text>
            {combo.sequence.map((punchNumber, index) => {
              const punch = getPunchByNumber(punchNumber);
              return (
                <View key={index} style={styles.punchBreakdown}>
                  <View style={styles.punchHeader}>
                    <View style={styles.punchNumberCircle}>
                      <Text style={styles.punchNumberText}>{punchNumber}</Text>
                    </View>
                    <View style={styles.punchInfo}>
                      <Text style={styles.punchName}>{punch?.name}</Text>
                      <Text style={styles.punchDescription}>{punch?.description}</Text>
                    </View>
                    <View style={styles.punchMeta}>
                      <Text style={styles.punchHand}>{punch?.hand} hand</Text>
                    </View>
                  </View>
                </View>
              );
            })}
          </View>

          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Lightbulb size={20} color="#FFD700" />
              <Text style={styles.sectionTitle}>Training Tips</Text>
            </View>
            {combo.tips.map((tip, index) => (
              <View key={index} style={styles.tipCard}>
                <Text style={styles.tipText}>• {tip}</Text>
              </View>
            ))}
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>How to Practice</Text>
            <View style={styles.practiceSteps}>
              <View style={styles.practiceStep}>
                <Text style={styles.stepNumber}>1</Text>
                <Text style={styles.stepText}>Start in proper boxing stance</Text>
              </View>
              <View style={styles.practiceStep}>
                <Text style={styles.stepNumber}>2</Text>
                <Text style={styles.stepText}>Practice each punch slowly first</Text>
              </View>
              <View style={styles.practiceStep}>
                <Text style={styles.stepNumber}>3</Text>
                <Text style={styles.stepText}>Gradually increase speed while maintaining form</Text>
              </View>
              <View style={styles.practiceStep}>
                <Text style={styles.stepNumber}>4</Text>
                <Text style={styles.stepText}>Focus on smooth transitions between punches</Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.practiceButton} onPress={handlePracticeCombo}>
          <Play size={24} color="#fff" />
          <Text style={styles.practiceButtonText}>🥊 3-Minute Boxing Rounds</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a1a',
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorText: {
    fontSize: 18,
    fontFamily: 'Inter-Regular',
    color: '#666',
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
  headerTitle: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: '#fff',
  },
  content: {
    padding: 20,
  },
  titleSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 28,
    fontFamily: 'Inter-Bold',
    color: '#fff',
    flex: 1,
    marginRight: 16,
  },
  level: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
  },
  description: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#ccc',
    lineHeight: 24,
    marginBottom: 32,
  },
  sequenceSection: {
    marginBottom: 32,
  },
  expectationContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  expectationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 4,
  },
  expectationBadge: {
    backgroundColor: '#FF4500',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 20,
    marginHorizontal: 6,
    marginVertical: 4,
    alignItems: 'center',
    minWidth: 80,
  },
  expectationNumber: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#fff',
    marginBottom: 2,
  },
  expectationText: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
    color: '#fff',
    textAlign: 'center',
  },
  sequenceArrow: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#FF4500',
    marginHorizontal: 8,
  },
  sequenceDescription: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#999',
    textAlign: 'center',
    fontStyle: 'italic',
  },
  stats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#2a2a2a',
    borderRadius: 16,
    padding: 20,
    marginBottom: 32,
  },
  stat: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#fff',
    marginVertical: 4,
  },
  statLabel: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#666',
  },
  section: {
    marginBottom: 32,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: 'Inter-SemiBold',
    color: '#fff',
    marginLeft: 8,
  },
  punchBreakdown: {
    backgroundColor: '#2a2a2a',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  punchHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  punchNumberCircle: {
    width: 32,
    height: 32,
    backgroundColor: '#FF4500',
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  punchNumberText: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    color: '#fff',
  },
  punchInfo: {
    flex: 1,
  },
  punchName: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#fff',
    marginBottom: 2,
  },
  punchDescription: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#ccc',
  },
  punchMeta: {
    alignItems: 'flex-end',
  },
  punchHand: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#FF4500',
    textTransform: 'capitalize',
  },
  tipCard: {
    backgroundColor: 'rgba(255, 69, 0, 0.1)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#FF4500',
  },
  tipText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#fff',
    lineHeight: 20,
  },
  practiceSteps: {
    gap: 16,
  },
  practiceStep: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2a2a2a',
    borderRadius: 12,
    padding: 16,
  },
  stepNumber: {
    width: 32,
    height: 32,
    backgroundColor: '#FF4500',
    borderRadius: 16,
    textAlign: 'center',
    lineHeight: 32,
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    color: '#fff',
    marginRight: 16,
  },
  stepText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#fff',
    flex: 1,
  },
  footer: {
    padding: 20,
  },
  practiceButton: {
    backgroundColor: '#FF4500',
    borderRadius: 16,
    padding: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  practiceButtonText: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#fff',
  },
});