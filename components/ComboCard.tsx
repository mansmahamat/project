import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Target, Clock, TrendingUp } from 'lucide-react-native';
import { Combo } from '@/types/workout';
import { getPunchByNumber } from '@/data/punches';

interface ComboCardProps {
  combo: Combo;
  onPress: () => void;
  size?: 'small' | 'medium' | 'large';
}

export function ComboCard({ combo, onPress, size = 'medium' }: ComboCardProps) {
  const cardStyle = size === 'large' ? styles.cardLarge : 
                   size === 'small' ? styles.cardSmall : styles.cardMedium;

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'Beginner': return '#00D4AA';
      case 'Intermediate': return '#FFB800';
      case 'Advanced': return '#FF6B35';
      default: return '#9CA3AF';
    }
  };

  return (
    <TouchableOpacity style={[styles.card, cardStyle]} onPress={onPress} activeOpacity={0.95}>
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <Text style={styles.title} numberOfLines={1}>{combo.name}</Text>
          <View style={[styles.levelBadge, { backgroundColor: getLevelColor(combo.level) }]}>
            <Text style={styles.levelText}>{combo.level}</Text>
          </View>
        </View>
      </View>
      
      <Text style={styles.description} numberOfLines={2}>
        {combo.description}
      </Text>
      
      <View style={styles.sequenceContainer}>
        <Text style={styles.sequenceTitle}>Punches You'll Practice</Text>
        <View style={styles.punchesContainer}>
          {Array.from(new Set(combo.sequence)).map((punchNumber) => {
            const punch = getPunchByNumber(punchNumber);
            return (
              <View key={punchNumber} style={styles.punchBadge}>
                <Text style={styles.punchNumber}>{punchNumber}</Text>
                <Text style={styles.punchName}>{punch?.name}</Text>
              </View>
            );
          })}
        </View>
      </View>
      
      <View style={styles.stats}>
        <View style={styles.stat}>
          <Target size={14} color="#6B7280" />
          <Text style={styles.statText}>{combo.sequence.length} punches</Text>
        </View>
        <View style={styles.stat}>
          <Clock size={14} color="#6B7280" />
          <Text style={styles.statText}>~{combo.sequence.length * 2}s</Text>
        </View>
      </View>
      
      {combo.tips.length > 0 && (
        <View style={styles.tipsContainer}>
          <Text style={styles.tipText} numberOfLines={1}>
            💡 {combo.tips[0]}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  cardSmall: {
    width: 240,
    marginRight: 16,
  },
  cardMedium: {
    marginBottom: 16,
  },
  cardLarge: {
    marginBottom: 20,
  },
  header: {
    marginBottom: 12,
  },
  titleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    color: '#111827',
    flex: 1,
    marginRight: 8,
  },
  levelBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  levelText: {
    fontSize: 10,
    fontFamily: 'Inter-SemiBold',
    color: '#fff',
  },
  description: {
    fontSize: 13,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    marginBottom: 16,
    lineHeight: 18,
  },
  sequenceContainer: {
    marginBottom: 16,
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  sequenceTitle: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
    color: '#374151',
    textAlign: 'center',
    marginBottom: 8,
  },
  punchesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 6,
  },
  punchBadge: {
    backgroundColor: '#FF4500',
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 12,
    alignItems: 'center',
    minWidth: 50,
  },
  punchNumber: {
    fontSize: 14,
    fontFamily: 'Inter-Bold',
    color: '#fff',
    marginBottom: 1,
  },
  punchName: {
    fontSize: 9,
    fontFamily: 'Inter-SemiBold',
    color: '#fff',
    textAlign: 'center',
  },
  stats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  stat: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 6,
  },
  statText: {
    fontSize: 11,
    fontFamily: 'Inter-Medium',
    color: '#6B7280',
  },
  tipsContainer: {
    backgroundColor: '#FEF3C7',
    borderRadius: 8,
    padding: 8,
    borderWidth: 1,
    borderColor: '#FDE68A',
  },
  tipText: {
    fontSize: 11,
    fontFamily: 'Inter-Regular',
    color: '#92400E',
  },
});