import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Play, Target, Shield, Move } from 'lucide-react-native';
import { TechniqueReference } from '@/data/techniques';

interface TechniqueCardProps {
  technique: TechniqueReference;
  onPress: () => void;
  size?: 'small' | 'medium' | 'large';
}

export function TechniqueCard({ technique, onPress, size = 'medium' }: TechniqueCardProps) {
  const cardStyle = size === 'large' ? styles.cardLarge : 
                   size === 'small' ? styles.cardSmall : styles.cardMedium;

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Punch': return <Target size={20} color="#FF6B35" />;
      case 'Defense': return <Shield size={20} color="#00D4AA" />;
      case 'Footwork': return <Move size={20} color="#8B5CF6" />;
      default: return <Target size={20} color="#6B7280" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Punch': return '#FF6B35';
      case 'Defense': return '#00D4AA';
      case 'Footwork': return '#8B5CF6';
      default: return '#6B7280';
    }
  };

  return (
    <TouchableOpacity style={[styles.card, cardStyle]} onPress={onPress}>
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <Text style={styles.title} numberOfLines={1}>{technique.name}</Text>
          <View style={[styles.categoryBadge, { backgroundColor: `${getCategoryColor(technique.category)}20` }]}>
            {getCategoryIcon(technique.category)}
            <Text style={[styles.categoryText, { color: getCategoryColor(technique.category) }]}>
              {technique.category}
            </Text>
          </View>
        </View>
      </View>
      
      <Text style={styles.description} numberOfLines={3}>
        {technique.description}
      </Text>
      
      <View style={styles.footer}>
        <View style={styles.videoIndicator}>
          <Play size={16} color="#FF6B35" />
          <Text style={styles.videoText}>Video Demo</Text>
        </View>
        <Text style={styles.instructionCount}>
          {technique.instructions.length} steps
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  cardSmall: {
    width: 200,
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
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#111827',
    flex: 1,
    marginRight: 8,
  },
  categoryBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  categoryText: {
    fontSize: 11,
    fontFamily: 'Inter-Medium',
  },
  description: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    marginBottom: 16,
    lineHeight: 20,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  videoIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  videoText: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#FF6B35',
  },
  instructionCount: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#6B7280',
  },
});