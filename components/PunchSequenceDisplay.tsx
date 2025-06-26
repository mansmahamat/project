import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { getPunchByNumber, formatPunchNumbers } from '@/data/punches';

interface PunchSequenceDisplayProps {
  sequence: number[];
  size?: 'small' | 'medium' | 'large';
  showNumbers?: boolean;
  currentPunch?: number; // Index of currently active punch
}

export function PunchSequenceDisplay({ 
  sequence, 
  size = 'medium', 
  showNumbers = true,
  currentPunch 
}: PunchSequenceDisplayProps) {
  const containerStyle = size === 'large' ? styles.containerLarge : 
                        size === 'small' ? styles.containerSmall : styles.containerMedium;
  
  const punchStyle = size === 'large' ? styles.punchLarge : 
                    size === 'small' ? styles.punchSmall : styles.punchMedium;

  return (
    <View style={styles.container}>
      {showNumbers && (
        <Text style={styles.numbersText}>{formatPunchNumbers(sequence)}</Text>
      )}
      <View style={[styles.sequenceContainer, containerStyle]}>
        {sequence.map((punchNumber, index) => {
          const punch = getPunchByNumber(punchNumber);
          const isActive = currentPunch === index;
          const isCompleted = currentPunch !== undefined && index < currentPunch;
          
          return (
            <View key={index} style={styles.punchContainer}>
              <View style={[
                styles.punchCircle,
                punchStyle,
                isActive && styles.punchActive,
                isCompleted && styles.punchCompleted
              ]}>
                <Text style={[
                  styles.punchNumber,
                  isActive && styles.punchNumberActive,
                  isCompleted && styles.punchNumberCompleted
                ]}>
                  {punchNumber}
                </Text>
              </View>
              <Text style={[
                styles.punchName,
                isActive && styles.punchNameActive,
                isCompleted && styles.punchNameCompleted
              ]}>
                {punch?.name || `Punch ${punchNumber}`}
              </Text>
              {index < sequence.length - 1 && (
                <View style={styles.arrow}>
                  <Text style={styles.arrowText}>→</Text>
                </View>
              )}
            </View>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  numbersText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#FF4500',
    marginBottom: 8,
  },
  sequenceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  containerSmall: {
    gap: 8,
  },
  containerMedium: {
    gap: 12,
  },
  containerLarge: {
    gap: 16,
  },
  punchContainer: {
    alignItems: 'center',
    flexDirection: 'row',
  },
  punchCircle: {
    backgroundColor: '#2a2a2a',
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#333',
  },
  punchSmall: {
    width: 32,
    height: 32,
  },
  punchMedium: {
    width: 40,
    height: 40,
  },
  punchLarge: {
    width: 48,
    height: 48,
  },
  punchActive: {
    backgroundColor: '#FF4500',
    borderColor: '#FF4500',
  },
  punchCompleted: {
    backgroundColor: '#4CAF50',
    borderColor: '#4CAF50',
  },
  punchNumber: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    color: '#fff',
  },
  punchNumberActive: {
    color: '#fff',
  },
  punchNumberCompleted: {
    color: '#fff',
  },
  punchName: {
    fontSize: 10,
    fontFamily: 'Inter-Medium',
    color: '#ccc',
    textAlign: 'center',
    marginTop: 4,
    maxWidth: 60,
  },
  punchNameActive: {
    color: '#FF4500',
  },
  punchNameCompleted: {
    color: '#4CAF50',
  },
  arrow: {
    marginHorizontal: 8,
  },
  arrowText: {
    fontSize: 16,
    color: '#666',
    fontFamily: 'Inter-Bold',
  },
});