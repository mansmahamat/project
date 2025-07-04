import React from 'react';
import { View, StyleSheet, Text, TouchableOpacity, Alert } from 'react-native';
import RevenueCatUI, { type FullScreenPaywallViewOptions } from "react-native-purchases-ui";
import { type CustomerInfo, type PurchasesError, type PurchasesPackage, type PurchasesStoreTransaction } from "react-native-purchases";
import { useSimpleToast } from "@/hooks/useSimpleToast";

interface PaywallProps {
  onClose: () => void;
  options?: FullScreenPaywallViewOptions;
  onPurchaseStarted?: ({ packageBeingPurchased }: { packageBeingPurchased: PurchasesPackage }) => void;
  onPurchaseCompleted?: ({
    customerInfo,
    storeTransaction
  }: { customerInfo: CustomerInfo, storeTransaction: PurchasesStoreTransaction }) => void;
  onPurchaseError?: ({ error }: { error: PurchasesError }) => void;
  onPurchaseCancelled?: () => void;
  onRestoreStarted?: () => void;
  onRestoreCompleted?: ({ customerInfo }: { customerInfo: CustomerInfo }) => void;
  onRestoreError?: ({ error }: { error: PurchasesError }) => void;
}

// Error boundary component
class PaywallErrorBoundary extends React.Component<
  { children: React.ReactNode; onError: () => void },
  { hasError: boolean; error?: Error }
> {
  constructor(props: { children: React.ReactNode; onError: () => void }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: any) {
    console.error('🚨 PaywallModal Error:', error, errorInfo);
    Alert.alert('Paywall Error', `Failed to load paywall: ${error.message}`);
  }

  render() {
    if (this.state.hasError) {
      return (
        <View style={styles.errorContainer}>
          <Text style={styles.errorTitle}>Paywall Failed to Load</Text>
          <Text style={styles.errorText}>
            {this.state.error?.message || 'Unknown error occurred'}
          </Text>
          <TouchableOpacity style={styles.errorButton} onPress={this.props.onError}>
            <Text style={styles.errorButtonText}>Close</Text>
          </TouchableOpacity>
        </View>
      );
    }

    return this.props.children;
  }
}

const PaywallModal = ({ onClose, ...paywallProps }: PaywallProps) => {
  const { showToast } = useSimpleToast();
  const [paywallReady, setPaywallReady] = React.useState(false);

  React.useEffect(() => {
    console.log('🚀 PaywallModal component mounted');
    
    // Test RevenueCat UI availability
    try {
      console.log('🔍 RevenueCatUI available:', !!RevenueCatUI);
      console.log('🔍 RevenueCatUI.Paywall available:', !!RevenueCatUI.Paywall);
      setPaywallReady(true);
    } catch (error) {
      console.error('❌ RevenueCat UI not available:', error);
      Alert.alert('Error', 'RevenueCat UI is not available. Make sure you\'re using a development build.');
    }

    return () => {
      console.log('🧹 PaywallModal component unmounted');
    };
  }, []);

  const handlePurchaseError = ({ error }: { error: PurchasesError }) => {
    console.error('❌ Purchase error:', error);
    showToast('error', 'Oops. Something went wrong!');
    paywallProps.onPurchaseError?.({ error });
  }

  const handlePurchaseCompleted = ({ customerInfo, storeTransaction }: { customerInfo: CustomerInfo, storeTransaction: PurchasesStoreTransaction }) => {
    console.log('✅ Purchase completed successfully');
    showToast('success', 'Welcome to VibeBoxing Premium! 🥊');
    paywallProps.onPurchaseCompleted?.({ customerInfo, storeTransaction });
    onClose();
  }

  const handleRestoreCompleted = ({ customerInfo }: { customerInfo: CustomerInfo }) => {
    console.log('✅ Purchases restored successfully');
    showToast('success', 'Purchases restored successfully!');
    paywallProps.onRestoreCompleted?.({ customerInfo });
    onClose();
  }

  const handleRestoreError = ({ error }: { error: PurchasesError }) => {
    console.error('❌ Restore error:', error);
    showToast('error', 'Failed to restore purchases');
    paywallProps.onRestoreError?.({ error });
  }

  const handleDismiss = () => {
    console.log('👋 PaywallModal dismissed');
    onClose();
  }

  const handlePurchaseCancelled = () => {
    console.log('❌ Purchase cancelled');
    paywallProps.onPurchaseCancelled?.();
    onClose();
  }

  console.log('🎨 Rendering PaywallModal component, ready:', paywallReady);

  if (!paywallReady) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading Paywall...</Text>
        <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
          <Text style={styles.cancelButtonText}>Cancel</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <PaywallErrorBoundary onError={onClose}>
      <View style={styles.container}>
        {/* Debug overlay */}
        <View style={styles.debugOverlay}>
          <Text style={styles.debugText}>🚀 PaywallModal Loaded Successfully</Text>
        </View>
        
        <RevenueCatUI.Paywall
          onDismiss={handleDismiss}
          onPurchaseCancelled={handlePurchaseCancelled}
          onPurchaseCompleted={handlePurchaseCompleted}
          onRestoreError={handleRestoreError}
          onRestoreCompleted={handleRestoreCompleted}
          onPurchaseError={handlePurchaseError}
          options={{
            displayCloseButton: true,
            ...paywallProps.options
          }}
          {...paywallProps}
        />
      </View>
    </PaywallErrorBoundary>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 20,
  },
  errorTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#EF4444',
    marginBottom: 16,
    textAlign: 'center',
  },
  errorText: {
    fontSize: 16,
    color: '#6B7280',
    marginBottom: 24,
    textAlign: 'center',
    lineHeight: 24,
  },
  errorButton: {
    backgroundColor: '#EF4444',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  errorButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  loadingText: {
    fontSize: 18,
    color: '#6B7280',
    marginBottom: 20,
  },
  cancelButton: {
    backgroundColor: '#6B7280',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  cancelButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  debugOverlay: {
    position: 'absolute',
    top: 50,
    left: 20,
    right: 20,
    backgroundColor: 'rgba(34, 197, 94, 0.9)',
    padding: 12,
    borderRadius: 8,
    zIndex: 999,
  },
  debugText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
});

export default PaywallModal;
