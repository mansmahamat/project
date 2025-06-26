import React, { useState, useEffect, useMemo } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { Filter, Search, SlidersHorizontal, Plus } from 'lucide-react-native';
import { WorkoutCard } from '@/components/WorkoutCard';
import { workouts, getWorkoutsByCategory, getWorkoutsByLevel } from '@/data/workouts';
import { useCustomWorkoutStore } from '@/stores';
import { router, useLocalSearchParams } from 'expo-router';

export default function WorkoutsScreen() {
  const { category: initialCategory } = useLocalSearchParams();
  const customWorkouts = useCustomWorkoutStore((state) => state.customWorkouts);
  const [selectedLevel, setSelectedLevel] = useState<string>('All');
  const [selectedCategory, setSelectedCategory] = useState<string>(
    typeof initialCategory === 'string' ? initialCategory : 'All'
  );
  
  // Convert custom workouts to regular workout format for display (memoized to prevent infinite loops)
  const convertedCustomWorkouts = useMemo(() => {
    return customWorkouts.map(customWorkout => ({
      ...customWorkout,
      exercises: customWorkout.exercises.map(exercise => ({
        id: exercise.id,
        name: exercise.name,
        description: exercise.description,
        duration: exercise.duration,
        instructions: exercise.selectedMoves.map(move => move.description),
        punchSequence: exercise.selectedMoves.flatMap(move => move.punchSequence || [])
      }))
    }));
  }, [customWorkouts]);
  
  // Combine custom workouts with regular workouts (memoized to prevent infinite loops)
  const allWorkouts = useMemo(() => {
    return [...workouts, ...convertedCustomWorkouts];
  }, [convertedCustomWorkouts]);
  
  const [filteredWorkouts, setFilteredWorkouts] = useState(() => allWorkouts);

  const levels = ['All', 'Beginner', 'Intermediate', 'Advanced'];
  const categories = ['All', 'HIIT', 'Freestyle', 'Defense', 'Footwork', 'Combos', 'Punching Bag', 'Custom'];

  useEffect(() => {
    let filtered = allWorkouts;

    if (selectedCategory !== 'All') {
      if (selectedCategory === 'Custom') {
        // Filter for custom workouts
        filtered = filtered.filter(workout => 
          customWorkouts.some(custom => custom.id === workout.id)
        );
      } else {
        filtered = filtered.filter(workout => workout.category === selectedCategory);
      }
    }

    if (selectedLevel !== 'All') {
      filtered = filtered.filter(workout => workout.level === selectedLevel);
    }

    setFilteredWorkouts(filtered);
  }, [selectedLevel, selectedCategory, allWorkouts]);

  const handleWorkoutPress = (workoutId: string) => {
    router.push(`/workout-detail?id=${workoutId}`);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Train</Text>
          <Text style={styles.subtitle}>Choose your workout</Text>
        </View>
        <View style={styles.headerButtons}>
          <TouchableOpacity 
            style={styles.createButton}
            onPress={() => router.push('/custom-workout')}
          >
            <Plus size={20} color="#FFFFFF" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.filterButton}>
            <SlidersHorizontal size={20} color="#FF6B35" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Search size={20} color="#9CA3AF" />
          <Text style={styles.searchPlaceholder}>Search workouts...</Text>
        </View>
      </View>

      {/* Filters */}
      <View style={styles.filtersContainer}>
        <View style={styles.filterSection}>
          <Text style={styles.filterLabel}>Level</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterScroll}>
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

        <View style={styles.filterSection}>
          <Text style={styles.filterLabel}>Category</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterScroll}>
            {categories.map((category) => (
              <TouchableOpacity
                key={category}
                style={[
                  styles.filterChip,
                  selectedCategory === category && styles.filterChipActive
                ]}
                onPress={() => setSelectedCategory(category)}
              >
                <Text style={[
                  styles.filterChipText,
                  selectedCategory === category && styles.filterChipTextActive
                ]}>
                  {category}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </View>

      {/* Results */}
      <ScrollView style={styles.workoutsList} showsVerticalScrollIndicator={false} bounces={true}>
        <View style={styles.resultsHeader}>
          <Text style={styles.resultsCount}>
            {filteredWorkouts.length} workout{filteredWorkouts.length !== 1 ? 's' : ''} found
          </Text>
          <View style={styles.sortButton}>
            <Filter size={16} color="#6B7280" />
            <Text style={styles.sortText}>Sort</Text>
          </View>
        </View>

        {filteredWorkouts.map((workout) => (
          <WorkoutCard
            key={workout.id}
            workout={workout}
            onPress={() => handleWorkoutPress(workout.id)}
          />
        ))}

        {filteredWorkouts.length === 0 && (
          <View style={styles.noResults}>
            <Text style={styles.noResultsText}>
              No workouts found with the selected filters.
            </Text>
            <Text style={styles.noResultsSubtext}>
              Try adjusting your filters to see more results.
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
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingVertical: 20,
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
  headerButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  createButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FF6B35',
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchContainer: {
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingVertical: 16,
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
  searchPlaceholder: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#9CA3AF',
    marginLeft: 12,
  },
  filtersContainer: {
    backgroundColor: '#fff',
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  filterSection: {
    marginBottom: 16,
  },
  filterLabel: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#111827',
    marginBottom: 8,
    paddingHorizontal: 20,
  },
  filterScroll: {
    paddingLeft: 20,
  },
  filterChip: {
    backgroundColor: '#F9FAFB',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
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
  workoutsList: {
    flex: 1,
    backgroundColor: '#fff',
    marginTop: 8,
  },
  resultsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  resultsCount: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#6B7280',
  },
  sortButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  sortText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#6B7280',
  },
  noResults: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    paddingHorizontal: 20,
  },
  noResultsText: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#111827',
    marginBottom: 8,
    textAlign: 'center',
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