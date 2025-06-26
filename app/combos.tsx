import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { ArrowLeft, Filter } from 'lucide-react-native';
import { router } from 'expo-router';
import { COMBOS, getCombosByLevel } from '@/data/punches';
import { ComboCard } from '@/components/ComboCard';

export default function CombosScreen() {
  const [selectedLevel, setSelectedLevel] = useState<string>('All');
  
  const levels = ['All', 'Beginner', 'Intermediate', 'Advanced'];
  
  const filteredCombos = selectedLevel === 'All' 
    ? COMBOS 
    : getCombosByLevel(selectedLevel as 'Beginner' | 'Intermediate' | 'Advanced');

  const handleComboPress = (comboId: string) => {
    router.push(`/combo-detail?id=${comboId}`);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <ArrowLeft size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.title}>Boxing Combos</Text>
        <TouchableOpacity style={styles.filterButton}>
          <Filter size={20} color="#FF4500" />
        </TouchableOpacity>
      </View>

      <View style={styles.subtitle}>
        <Text style={styles.subtitleText}>Master the standard boxing combinations</Text>
      </View>

      <View style={styles.filters}>
        <Text style={styles.filterLabel}>Level</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {levels.map((level) => (
            <TouchableOpacity
              key={level}
              style={[
                styles.filterChip,
                selectedLevel === level && styles.filterChipActive
              ]}
              onPress={() => setSelectedLevel(level)}
            >
              <Text style={[
                styles.filterChipText,
                selectedLevel === level && styles.filterChipTextActive
              ]}>
                {level}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <ScrollView style={styles.combosList} showsVerticalScrollIndicator={false}>
        <View style={styles.resultsHeader}>
          <Text style={styles.resultsCount}>
            {filteredCombos.length} combo{filteredCombos.length !== 1 ? 's' : ''} found
          </Text>
        </View>

        {filteredCombos.map((combo) => (
          <ComboCard
            key={combo.id}
            combo={combo}
            onPress={() => handleComboPress(combo.id)}
          />
        ))}

        {filteredCombos.length === 0 && (
          <View style={styles.noResults}>
            <Text style={styles.noResultsText}>
              No combos found for the selected level.
            </Text>
            <Text style={styles.noResultsSubtext}>
              Try selecting a different level to see more combos.
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a1a',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  backButton: {
    width: 40,
    height: 40,
    backgroundColor: '#333',
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: '#fff',
  },
  filterButton: {
    padding: 8,
    backgroundColor: '#2a2a2a',
    borderRadius: 12,
  },
  subtitle: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  subtitleText: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#ccc',
    textAlign: 'center',
  },
  filters: {
    paddingBottom: 20,
  },
  filterLabel: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#fff',
    marginBottom: 8,
    paddingHorizontal: 20,
  },
  filterChip: {
    backgroundColor: '#2a2a2a',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 12,
    marginLeft: 8,
    borderWidth: 1,
    borderColor: '#333',
  },
  filterChipActive: {
    backgroundColor: '#FF4500',
    borderColor: '#FF4500',
  },
  filterChipText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#ccc',
  },
  filterChipTextActive: {
    color: '#fff',
  },
  combosList: {
    flex: 1,
    paddingHorizontal: 20,
  },
  resultsHeader: {
    marginBottom: 16,
  },
  resultsCount: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#666',
  },
  noResults: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  noResultsText: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#fff',
    marginBottom: 8,
  },
  noResultsSubtext: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#666',
    textAlign: 'center',
  },
});