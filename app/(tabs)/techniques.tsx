import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  StyleSheet,
  SafeAreaView,
  TextInput,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Play, Search, ChevronRight, GraduationCap, Target, Video } from 'lucide-react-native';
import { 
  getAllTechniques, 
  getBasicPunches, 
  getAdvancedTechniques, 
  getDefenseTechniques, 
  getMovementTechniques,
  TechniqueReference 
} from '@/data/techniques';

export default function TechniquesScreen() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'All' | 'Basic' | 'Advanced' | 'Defense' | 'Movement'>('All');

  const getFilteredTechniques = (): TechniqueReference[] => {
    let techniques: TechniqueReference[] = [];
    
    switch (selectedCategory) {
      case 'Basic':
        techniques = getBasicPunches();
        break;
      case 'Advanced':
        techniques = getAdvancedTechniques();
        break;
      case 'Defense':
        techniques = getDefenseTechniques();
        break;
      case 'Movement':
        techniques = getMovementTechniques();
        break;
      default:
        techniques = getAllTechniques();
    }

    if (searchQuery) {
      techniques = techniques.filter(technique =>
        technique.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        technique.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    return techniques;
  };

  const navigateToTechniqueDetail = (technique: TechniqueReference) => {
    router.push({
      pathname: '/technique-detail',
      params: { techniqueId: technique.id.toString() }
    });
  };

  const handleQuickStart = () => {
    router.push('/quick-start');
  };

  const categories = ['All', 'Basic', 'Advanced', 'Defense', 'Movement'];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Techniques Catalog</Text>
          <Text style={styles.subtitle}>
            Master boxing fundamentals with detailed instructions and tutorial videos.
          </Text>
        </View>

        {/* Quick Start Learning Section */}
        <View style={styles.quickStartSection}>
          <View style={styles.quickStartContent}>
            <View style={styles.quickStartIconContainer}>
              <GraduationCap size={32} color="#FF6B35" />
            </View>
            <View style={styles.quickStartTextContainer}>
              <Text style={styles.quickStartTitle}>Quick-Start Boxing Program</Text>
              <Text style={styles.quickStartSubtitle}>
                Learn all boxing fundamentals in 30-45 minutes with guided instruction
              </Text>
            </View>
          </View>
          
          <View style={styles.quickStartStats}>
            <View style={styles.quickStartStat}>
              <Target size={16} color="#FF6B35" />
              <Text style={styles.quickStartStatText}>13 Techniques</Text>
            </View>
            <View style={styles.quickStartStat}>
              <Video size={16} color="#FF6B35" />
              <Text style={styles.quickStartStatText}>8 Video Demos</Text>
            </View>
          </View>
          
          <TouchableOpacity style={styles.quickStartButton} onPress={handleQuickStart}>
            <Play size={16} color="#fff" />
            <Text style={styles.quickStartButtonText}>Start Learning</Text>
            <ChevronRight size={16} color="#fff" />
          </TouchableOpacity>
        </View>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <Search size={20} color="#9CA3AF" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search techniques..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor="#9CA3AF"
          />
        </View>

        {/* Category Filter */}
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          style={styles.categoryScrollView}
          contentContainerStyle={styles.categoryContainer}
        >
          {categories.map((category) => (
            <TouchableOpacity
              key={category}
              style={[
                styles.categoryButton,
                selectedCategory === category && styles.categoryButtonActive
              ]}
              onPress={() => setSelectedCategory(category as any)}
            >
              <Text style={[
                styles.categoryText,
                selectedCategory === category && styles.categoryTextActive
              ]}>
                {category}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Section Header */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>
            {selectedCategory === 'All' ? 'All Techniques' : `${selectedCategory} Techniques`}
          </Text>
          <Text style={styles.sectionSubtitle}>
            {selectedCategory === 'Basic' && 'Master the fundamental 6 punches'}
            {selectedCategory === 'Advanced' && 'Improve your boxing by integrating some more complex attacks and movements'}
            {selectedCategory === 'Defense' && 'Learn defensive techniques and counters'}
            {selectedCategory === 'Movement' && 'Always stay in movement when training with the app. Remaining active and stable is trickier than you\'d think.'}
            {selectedCategory === 'All' && 'Complete library of boxing techniques'}
          </Text>
        </View>

        {/* Techniques List */}
        <View style={styles.techniquesList}>
          {getFilteredTechniques().map((technique, index) => (
            <TouchableOpacity
              key={technique.id}
              style={styles.techniqueCard}
              onPress={() => navigateToTechniqueDetail(technique)}
            >
              <View style={styles.techniqueContent}>
                {/* Video Thumbnail */}
                <View style={styles.videoContainer}>
                  <Image
                    source={{ uri: 'https://images.pexels.com/photos/7991579/pexels-photo-7991579.jpeg' }}
                    style={styles.videoThumbnail}
                  />
                  <View style={styles.playButtonOverlay}>
                    <Play size={24} color="#FFFFFF" fill="#FFFFFF" />
                  </View>
                </View>

                {/* Technique Info */}
                <View style={styles.techniqueInfo}>
                  <View style={styles.techniqueHeader}>
                    {/* Technique Number Circle */}
                    {technique.id <= 6 && (
                      <View style={styles.numberCircle}>
                        <Text style={styles.numberText}>{technique.id}</Text>
                      </View>
                    )}
                    <View style={styles.techniqueTextContainer}>
                      <Text style={styles.techniqueName}>{technique.name}</Text>
                      <Text style={styles.techniqueDescription}>{technique.description}</Text>
                    </View>
                  </View>
                </View>

                {/* Arrow */}
                <ChevronRight size={20} color="#9CA3AF" style={styles.arrow} />
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Bottom Note */}
        <View style={styles.bottomNote}>
          <Text style={styles.noteText}>
            Using the numbering system, if the app says '1-4', you need to throw a jab and a right hook
          </Text>
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
  scrollView: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
    lineHeight: 24,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    marginHorizontal: 20,
    marginBottom: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#1F2937',
  },
  categoryScrollView: {
    marginBottom: 24,
  },
  categoryContainer: {
    paddingHorizontal: 20,
    gap: 12,
  },
  categoryButton: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  categoryButtonActive: {
    backgroundColor: '#FF6B35',
    borderColor: '#FF6B35',
  },
  categoryText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6B7280',
  },
  categoryTextActive: {
    color: '#FFFFFF',
  },
  sectionHeader: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 8,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
  },
  techniquesList: {
    paddingHorizontal: 20,
    gap: 16,
  },
  techniqueCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    overflow: 'hidden',
  },
  techniqueContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  videoContainer: {
    position: 'relative',
    marginRight: 16,
  },
  videoThumbnail: {
    width: 80,
    height: 60,
    borderRadius: 8,
    backgroundColor: '#F3F4F6',
  },
  playButtonOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.4)',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  techniqueInfo: {
    flex: 1,
  },
  techniqueHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  numberCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#FF6B35',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  numberText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  techniqueTextContainer: {
    flex: 1,
  },
  techniqueName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  techniqueDescription: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
  },
  arrow: {
    marginLeft: 12,
  },
  bottomNote: {
    paddingHorizontal: 20,
    paddingVertical: 24,
    backgroundColor: '#F9FAFB',
    marginTop: 32,
  },
  noteText: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 20,
  },
  quickStartSection: {
    marginHorizontal: 20,
    marginBottom: 20,
    backgroundColor: '#FEF3C7',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#FDE68A',
  },
  quickStartContent: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  quickStartIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255, 107, 53, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
    borderWidth: 2,
    borderColor: 'rgba(255, 107, 53, 0.2)',
  },
  quickStartTextContainer: {
    flex: 1,
  },
  quickStartTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#92400E',
    marginBottom: 4,
  },
  quickStartSubtitle: {
    fontSize: 14,
    color: '#A16207',
    lineHeight: 20,
  },
  quickStartStats: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 16,
  },
  quickStartStat: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  quickStartStatText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#92400E',
  },
  quickStartButton: {
    backgroundColor: '#FF6B35',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    shadowColor: '#FF6B35',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  quickStartButtonText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#fff',
  },
}); 