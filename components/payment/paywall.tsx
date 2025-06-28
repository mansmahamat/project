import React from 'react';
import { View, StyleSheet, Text, TouchableOpacity, Alert, ScrollView, Dimensions, SafeAreaView } from 'react-native';
import { Calendar, TrendingUp, Target, Flame, Clock, Trophy, Award, Zap, Activity, CalendarDays, Lock, Crown, X } from 'lucide-react-native';
import RevenueCatUI, { type FullScreenPaywallViewOptions } from "react-native-purchases-ui";
import { type CustomerInfo, type PurchasesError, type PurchasesPackage, type PurchasesStoreTransaction } from "react-native-purchases";
import { useSimpleToast } from "@/hooks/useSimpleToast";

const { width } = Dimensions.get('window');

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
    console.error('🚨 Paywall Error:', error, errorInfo);
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

const Paywall = ({ onClose, ...paywallProps }: PaywallProps) => {
  const { showToast } = useSimpleToast();
  const [paywallReady, setPaywallReady] = React.useState(false);

  React.useEffect(() => {
    console.log('🚀 Paywall component mounted');
    
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
      console.log('🧹 Paywall component unmounted');
    };
  }, []);

  const handlePurchaseError = ({ error }: { error: PurchasesError }) => {
    console.error('❌ Purchase error:', error);
    showToast('error', 'Oops. Something went wrong!');
    paywallProps.onPurchaseError?.({ error });
  }

  const handlePurchaseCompleted = ({ customerInfo, storeTransaction }: { customerInfo: CustomerInfo, storeTransaction: PurchasesStoreTransaction }) => {
    console.log('✅ Purchase completed successfully');
    showToast('success', 'Welcome to Premium! 🎉');
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
    console.log('👋 Paywall dismissed');
    onClose();
  }

  const handlePurchaseCancelled = () => {
    console.log('❌ Purchase cancelled');
    paywallProps.onPurchaseCancelled?.();
    onClose();
  }

  console.log('🎨 Rendering Paywall component, ready:', paywallReady);

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
      <SafeAreaView style={styles.safeContainer}>
        <View style={styles.container}>
          {/* Custom Close Button - More Accessible Position */}
          <TouchableOpacity 
            style={styles.customCloseButton}
            onPress={handleDismiss}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <View style={styles.closeButtonBackground}>
              <X size={20} color="#fff" />
            </View>
          </TouchableOpacity>

          {/* RevenueCat Paywall - Full Screen */}
          <RevenueCatUI.Paywall
            onDismiss={handleDismiss}
            onPurchaseCancelled={handlePurchaseCancelled}
            onPurchaseCompleted={handlePurchaseCompleted}
            onRestoreError={handleRestoreError}
            onRestoreCompleted={handleRestoreCompleted}
            onPurchaseError={handlePurchaseError}
            options={{
              displayCloseButton: false, // Disable default close button since we have custom one
              ...paywallProps.options
            }}
            {...paywallProps}
          />
        </View>
      </SafeAreaView>
    </PaywallErrorBoundary>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  // Premium Teaser Styles
  premiumTeaserContainer: {
    position: 'relative',
    backgroundColor: '#F8FAFC',
    margin: 16,
    borderRadius: 16,
    padding: 20,
    borderWidth: 2,
    borderColor: '#FFD700',
    overflow: 'hidden',
  },
  teaserHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  teaserTitle: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#111827',
  },
  premiumBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#FF6B35',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  premiumBadgeText: {
    fontSize: 10,
    fontFamily: 'Inter-Bold',
    color: '#fff',
  },
  fakeStatsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 20,
  },
  fakeStatCard: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  fakeStatValue: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#111827',
    marginTop: 8,
    marginBottom: 4,
  },
  fakeStatLabel: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#6B7280',
    textAlign: 'center',
  },
  chartSection: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  chartTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#111827',
    marginBottom: 12,
  },
  fakeChart: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: 60,
  },
  chartColumn: {
    flex: 1,
    alignItems: 'center',
  },
  chartBar: {
    width: 12,
    backgroundColor: '#FF6B35',
    borderRadius: 6,
    marginBottom: 8,
    minHeight: 8,
  },
  chartLabel: {
    fontSize: 10,
    fontFamily: 'Inter-Medium',
    color: '#6B7280',
  },
  featuresSection: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  featuresTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#111827',
    marginBottom: 12,
  },
  featuresList: {
    gap: 8,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  featureText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#374151',
  },
  ctaSection: {
    alignItems: 'center',
    marginBottom: 16,
  },
  ctaText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#111827',
    textAlign: 'center',
    marginBottom: 4,
  },
  ctaSubtext: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#6B7280',
    textAlign: 'center',
  },
  lockedOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 16,
  },
  // Original styles
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
  safeContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  customCloseButton: {
    position: 'absolute',
    top: 60, // Move it lower from the very top for better accessibility
    right: 20,
    zIndex: 1000, // Ensure it's always on top
    padding: 4, // Reduce outer padding since we have larger background
  },
  closeButtonBackground: {
    backgroundColor: 'rgba(0, 0, 0, 0.7)', // Higher contrast for better visibility
    borderRadius: 20,
    padding: 12, // Larger touch target for easier tapping
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5, // Android shadow
  },
});

export default Paywall; 