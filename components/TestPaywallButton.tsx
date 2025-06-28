import React from 'react';
import { TouchableOpacity, Text, StyleSheet, Alert } from 'react-native';

interface TestPaywallButtonProps {
  onPress: () => void;
}

export const TestPaywallButton: React.FC<TestPaywallButtonProps> = ({ onPress }) => {
  const handlePress = () => {
    console.log('🧪 Test Paywall Button Pressed');
    Alert.alert('Debug', 'About to show paywall');
    onPress();
  };

  return (
    <TouchableOpacity style={styles.button} onPress={handlePress}>
      <Text style={styles.buttonText}>🧪 TEST PAYWALL</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#FF6B35',
    padding: 16,
    borderRadius: 8,
    margin: 16,
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
}); 