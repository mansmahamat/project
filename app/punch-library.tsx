import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { ArrowLeft, Target, Shield, Move, Filter, GraduationCap, Play } from 'lucide-react-native';
import { router } from 'expo-router';
import { TECHNIQUE_REFERENCES, getTechniquesByCategory } from '@/data/techniques';
import { TechniqueCard } from '@/components/TechniqueCard';

export default function PunchLibraryScreen() {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  
  const categories = [
    { key: 'All', label: 'All Techniques', icon: <GraduationCap size={16} color="#FF6B35" /> },
    { key: 'Punch', label: 'Punches', icon: <Target size={16} color="#FF6B35" /> },
    { key: 'Defense', label: 'Defense', icon: <Shield size={16} color="#00D4AA" /> },
    { key: 'Footwork', label: 'Footwork', icon: <Move size={16} color="#8B5CF6" /> },
  ];
  
  const filteredTechniques = selectedCategory === 'All' 
    ? TECHNIQUE_REFERENCES 
    : getTechniquesByCategory(selectedCategory as 'Punch' | 'Defense' | 'Footwork');

  const handleTechniquePress = (techniqueId: number) => {
    router.push(`/technique-detail?id=${techniqueId}`);
  };

  const getCategoryStats = () => {
    const punchCount = getTechniquesByCategory('Punch').length;
    const defenseCount = getTechniquesByCategory('Defense').length;
    const footworkCount = getTechniquesByCategory('Footwork').length;
    
    return { punchCount, defenseCount, footworkCount };
  };

  const { punchCount, defenseCount, footworkCount } = getCategoryStats();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <ArrowLeft size={24} color="#111827" />
        </TouchableOpacity>
        <Text style={styles.title}>Boxing Tutorials</Text>
        <TouchableOpacity style={styles.filterButton}>
          <Filter size={20} color="#FF6B35" />
        </TouchableOpacity>
      </View>

      <View style={styles.heroSection}>
        <View style={styles.heroContent}>
          <GraduationCap size={48} color="#FF6B35" />
          <Text style={styles.heroTitle}>Master Boxing Fundamentals</Text>
          <Text style={styles.heroSubtitle}>
            Learn proper technique with step-by-step instructions and video demonstrations
          </Text>
        </View>
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Target size={24} color="#FF6B35" />
          <Text style={styles.statNumber}>{punchCount}</Text>
          <Text style={styles.statLabel}>Punches</Text>
        </View>
        <View style={styles.statCard}>
          <Shield size={24} color="#00D4AA" />
          <Text style={styles.statNumber}>{defenseCount}</Text>
          <Text style={styles.statLabel}>Defense</Text>
        </View>
        <View style={styles.statCard}>
          <Move size={24} color="#8B5CF6" />
          <Text style={styles.statNumber}>{footworkCount}</Text>
          <Text style={styles.statLabel}>Footwork</Text>
        </View>
      </View>

      <View style={styles.filters}>
        <Text style={styles.filterLabel}>Category</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {categories.map((category) => (
            <TouchableOpacity
              key={category.key}
              style={[
                styles.filterChip,
                selectedCategory === category.key && styles.filterChipActive
              ]}
              onPress={() => setSelectedCategory(category.key)}
            >
              {category.icon}
              <Text style={[
                styles.filterChipText,
                selectedCategory === category.key && styles.filterChipTextActive
              ]}>
                {category.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <ScrollView style={styles.techniquesList} showsVerticalScrollIndicator={false}>
        <View style={styles.resultsHeader}>
          <Text style={styles.resultsCount}>
            {filteredTechniques.length} technique{filteredTechniques.length !== 1 ? 's' : ''} available
          </Text>
          <View style={styles.videoIndicator}>
            <Play size={16} color="#FF6B35" />
            <Text style={styles.videoText}>All include video demos</Text>
          </View>
        </View>

        {filteredTechniques.map((technique) => (
          <TechniqueCard
            key={technique.id}
            technique={technique}
            onPress={() => handleTechniquePress(technique.id)}
          />
        ))}

        {filteredTechniques.length === 0 && (
          <View style={styles.noResults}>
            <Text style={styles.noResultsText}>
              No techniques found for the selected category.
            </Text>
            <Text style={styles.noResultsSubtext}>
              Try selecting a different category to see more techniques.
            </Text>
          </View>
        )}

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
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  backButton: {
    width: 40,
    height: 40,
    backgroundColor: '#F3F4F6',
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: '#111827',
  },
  filterButton: {
    padding: 8,
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
  },
  heroSection: {
    paddingHorizontal: 20,
    paddingVertical: 24,
    backgroundColor: '#F8FAFC',
    marginHorizontal: 20,
    marginBottom: 24,
    marginTop: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  heroContent: {
    alignItems: 'center',
  },
  heroTitle: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#111827',
    marginTop: 12,
    marginBottom: 8,
    textAlign: 'center',
  },
  heroSubtitle: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 22,
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 24,
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#FAFAFA',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  statNumber: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#111827',
    marginTop: 8,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#6B7280',
  },
  filters: {
    paddingBottom: 20,
  },
  filterLabel: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#111827',
    marginBottom: 8,
    paddingHorizontal: 20,
  },
  filterChip: {
    backgroundColor: '#F9FAFB',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 12,
    marginLeft: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  filterChipActive: {
    backgroundColor: '#FF6B35',
    borderColor: '#FF6B35',
  },
  filterChipText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#6B7280',
  },
  filterChipTextActive: {
    color: '#fff',
  },
  techniquesList: {
    flex: 1,
    paddingHorizontal: 20,
  },
  resultsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  resultsCount: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#6B7280',
  },
  videoIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  videoText: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#FF6B35',
  },
  noResults: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  noResultsText: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#111827',
    marginBottom: 8,
  },
  noResultsSubtext: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    textAlign: 'center',
  },
  bottomPadding: {
    height: 40,
  },
});