import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Modal,
} from 'react-native';
import { Calendar, DateData } from 'react-native-calendars';
import { Flame, Clock, Target, Trophy, X, ChevronLeft, ChevronRight } from 'lucide-react-native';
import { useProgressStore, formatTime } from '@/stores';
import { workouts } from '@/data/workouts';

interface WorkoutCalendarProps {
  onDateSelect?: (date: string, workouts: any[]) => void;
}

export const WorkoutCalendar: React.FC<WorkoutCalendarProps> = ({ onDateSelect }) => {
  const { progress } = useProgressStore();
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [showDayDetail, setShowDayDetail] = useState(false);

  // Check if user has any completed workouts
  const hasWorkouts = progress.completedWorkouts.length > 0;

  // Process workout data for calendar
  const calendarData = useMemo(() => {
    const markedDates: any = {};
    const workoutsByDate: { [key: string]: any[] } = {};

    progress.completedWorkouts.forEach((completedWorkout) => {
      const date = new Date(completedWorkout.completedAt).toISOString().split('T')[0];
      
      if (!workoutsByDate[date]) {
        workoutsByDate[date] = [];
      }
      
      // Find the original workout data
      const originalWorkout = workouts.find(w => w.id === completedWorkout.workoutId);
      
      workoutsByDate[date].push({
        ...completedWorkout,
        originalWorkout,
      });
    });

    // Create marked dates for calendar
    Object.keys(workoutsByDate).forEach((date) => {
      const dayWorkouts = workoutsByDate[date];
      const totalWorkouts = dayWorkouts.length;
      const totalCalories = dayWorkouts.reduce((sum, w) => sum + w.caloriesBurned, 0);
      
      // Determine dot color based on workout intensity/type
      let dotColor = '#00D4AA'; // Default green
      if (totalCalories > 300) dotColor = '#FF6B35'; // High intensity - orange
      else if (totalCalories > 200) dotColor = '#FFB800'; // Medium intensity - yellow
      else if (totalWorkouts > 1) dotColor = '#8B5CF6'; // Multiple workouts - purple

      markedDates[date] = {
        marked: true,
        dotColor: dotColor,
        customStyles: {
          container: {
            backgroundColor: totalWorkouts > 1 ? 'rgba(139, 92, 246, 0.1)' : 'transparent',
            borderRadius: 16,
          },
          text: {
            color: '#111827',
            fontWeight: totalWorkouts > 1 ? 'bold' : 'normal',
          },
        },
      };
    });

    return { markedDates, workoutsByDate };
  }, [progress.completedWorkouts]);

  const onDayPress = (day: DateData) => {
    const dayWorkouts = calendarData.workoutsByDate[day.dateString] || [];
    setSelectedDate(day.dateString);
    
    if (dayWorkouts.length > 0) {
      setShowDayDetail(true);
      onDateSelect?.(day.dateString, dayWorkouts);
    }
  };

  const getSelectedDateWorkouts = () => {
    return calendarData.workoutsByDate[selectedDate] || [];
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const getWorkoutTypeColor = (workout: any) => {
    const category = workout.originalWorkout?.category || 'Freestyle';
    switch (category) {
      case 'HIIT': return '#FF6B35';
      case 'Punching Bag': return '#FF4500';
      case 'Defense': return '#00D4AA';
      case 'Combos': return '#FFB800';
      default: return '#8B5CF6';
    }
  };

  if (!hasWorkouts) {
    return (
      <View style={styles.container}>
        <Calendar
          current={new Date().toISOString().split('T')[0]}
          markedDates={{}}
          theme={{
            backgroundColor: '#ffffff',
            calendarBackground: '#ffffff',
            textSectionTitleColor: '#6B7280',
            selectedDayBackgroundColor: '#FF6B35',
            selectedDayTextColor: '#ffffff',
            todayTextColor: '#FF6B35',
            dayTextColor: '#111827',
            textDisabledColor: '#D1D5DB',
            dotColor: '#FF6B35',
            selectedDotColor: '#ffffff',
            arrowColor: '#FF6B35',
            disabledArrowColor: '#D1D5DB',
            monthTextColor: '#111827',
            indicatorColor: '#FF6B35',
            textDayFontFamily: 'Inter-Regular',
            textMonthFontFamily: 'Inter-Bold',
            textDayHeaderFontFamily: 'Inter-SemiBold',
            textDayFontSize: 16,
            textMonthFontSize: 18,
            textDayHeaderFontSize: 13,
          }}
          hideExtraDays={true}
          firstDay={1}
          enableSwipeMonths={true}
        />
        
        {/* Empty State */}
        <View style={styles.emptyState}>
          <Trophy size={48} color="#D1D5DB" />
          <Text style={styles.emptyStateTitle}>No Workouts Yet</Text>
          <Text style={styles.emptyStateText}>
            Complete your first workout to see it appear on the calendar!
          </Text>
        </View>
      </View>
    );
  }

  return (
    <>
      <View style={styles.container}>
        <Calendar
          current={new Date().toISOString().split('T')[0]}
          markedDates={calendarData.markedDates}
          onDayPress={onDayPress}
          theme={{
            backgroundColor: '#ffffff',
            calendarBackground: '#ffffff',
            textSectionTitleColor: '#6B7280',
            selectedDayBackgroundColor: '#FF6B35',
            selectedDayTextColor: '#ffffff',
            todayTextColor: '#FF6B35',
            dayTextColor: '#111827',
            textDisabledColor: '#D1D5DB',
            dotColor: '#FF6B35',
            selectedDotColor: '#ffffff',
            arrowColor: '#FF6B35',
            disabledArrowColor: '#D1D5DB',
            monthTextColor: '#111827',
            indicatorColor: '#FF6B35',
            textDayFontFamily: 'Inter-Regular',
            textMonthFontFamily: 'Inter-Bold',
            textDayHeaderFontFamily: 'Inter-SemiBold',
            textDayFontSize: 16,
            textMonthFontSize: 18,
            textDayHeaderFontSize: 13,
          }}
          markingType="custom"
          hideExtraDays={true}
          firstDay={1} // Monday
          enableSwipeMonths={true}
        />

        {/* Legend */}
        <View style={styles.legend}>
          <Text style={styles.legendTitle}>Workout Intensity</Text>
          <View style={styles.legendItems}>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: '#00D4AA' }]} />
              <Text style={styles.legendText}>Light (1-200 cal)</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: '#FFB800' }]} />
              <Text style={styles.legendText}>Moderate (200-300 cal)</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: '#FF6B35' }]} />
              <Text style={styles.legendText}>High (300+ cal)</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: '#8B5CF6' }]} />
              <Text style={styles.legendText}>Multiple workouts</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Day Detail Modal */}
      <Modal
        visible={showDayDetail}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowDayDetail(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity 
              style={styles.closeButton}
              onPress={() => setShowDayDetail(false)}
            >
              <X size={24} color="#6B7280" />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Workout History</Text>
            <View style={styles.placeholder} />
          </View>

          <View style={styles.modalDateHeader}>
            <Text style={styles.modalDate}>{formatDate(selectedDate)}</Text>
            <Text style={styles.modalWorkoutCount}>
              {getSelectedDateWorkouts().length} workout(s) completed
            </Text>
          </View>

          <ScrollView style={styles.modalContent} showsVerticalScrollIndicator={false}>
            {getSelectedDateWorkouts().map((workout, index) => (
              <View key={index} style={styles.workoutItem}>
                <View style={styles.workoutHeader}>
                  <View style={[
                    styles.workoutTypeIndicator, 
                    { backgroundColor: getWorkoutTypeColor(workout) }
                  ]} />
                  <View style={styles.workoutInfo}>
                    <Text style={styles.workoutTitle}>
                      {workout.originalWorkout?.title || `Workout ${workout.workoutId}`}
                    </Text>
                    <Text style={styles.workoutSubtitle}>
                      {workout.originalWorkout?.level} • {workout.originalWorkout?.category}
                    </Text>
                  </View>
                  <Text style={styles.workoutTime}>
                    {new Date(workout.completedAt).toLocaleTimeString('en-US', {
                      hour: 'numeric',
                      minute: '2-digit',
                      hour12: true,
                    })}
                  </Text>
                </View>

                <View style={styles.workoutStats}>
                  <View style={styles.statItem}>
                    <Clock size={16} color="#6B7280" />
                    <Text style={styles.statText}>{workout.durationMinutes} min</Text>
                  </View>
                  <View style={styles.statItem}>
                    <Flame size={16} color="#FF6B35" />
                    <Text style={styles.statText}>{workout.caloriesBurned} cal</Text>
                  </View>
                  <View style={styles.statItem}>
                    <Target size={16} color="#8B5CF6" />
                    <Text style={styles.statText}>{workout.roundsCompleted} rounds</Text>
                  </View>
                </View>
              </View>
            ))}
          </ScrollView>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 20,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  legend: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  legendTitle: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#111827',
    marginBottom: 8,
  },
  legendItems: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  legendText: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  modalHeader: {
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
  modalTitle: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#111827',
  },
  placeholder: {
    width: 40,
  },
  modalDateHeader: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#F9FAFB',
  },
  modalDate: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: '#111827',
    marginBottom: 4,
  },
  modalWorkoutCount: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
  },
  modalContent: {
    flex: 1,
    paddingHorizontal: 20,
  },
  workoutItem: {
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  workoutHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  workoutTypeIndicator: {
    width: 4,
    height: 40,
    borderRadius: 2,
    marginRight: 12,
  },
  workoutInfo: {
    flex: 1,
  },
  workoutTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#111827',
    marginBottom: 4,
  },
  workoutSubtitle: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
  },
  workoutTime: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#8B5CF6',
  },
  workoutStats: {
    flexDirection: 'row',
    gap: 16,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statText: {
    fontSize: 13,
    fontFamily: 'Inter-Medium',
    color: '#6B7280',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#9CA3AF',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 20,
  },
}); 