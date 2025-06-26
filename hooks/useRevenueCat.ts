import { useState, useEffect } from 'react';
import { RevenueCatService } from '@/services/revenuecat';
import { PurchaseState, Subscription } from '@/types/payments';

export function useRevenueCat() {
  const [purchaseState, setPurchaseState] = useState<PurchaseState>({
    isLoading: false,
    error: null,
    activeSubscription: null,
    customerInfo: null,
  });

  const [offerings, setOfferings] = useState<any>(null);

  useEffect(() => {
    initializeRevenueCat();
  }, []);

  const initializeRevenueCat = async () => {
    try {
      setPurchaseState(prev => ({ ...prev, isLoading: true }));
      
      const service = RevenueCatService.getInstance();
      await service.configure('your_revenuecat_api_key');
      
      const customerInfo = await service.getCustomerInfo();
      const availableOfferings = await service.getOfferings();
      
      setOfferings(availableOfferings);
      setPurchaseState(prev => ({
        ...prev,
        isLoading: false,
        customerInfo,
        activeSubscription: getActiveSubscription(customerInfo),
      }));
    } catch (error) {
      setPurchaseState(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to initialize payments',
      }));
    }
  };

  const purchaseSubscription = async (subscription: Subscription) => {
    try {
      setPurchaseState(prev => ({ ...prev, isLoading: true, error: null }));
      
      const service = RevenueCatService.getInstance();
      const packageToPurchase = offerings?.current?.[subscription.period];
      
      if (!packageToPurchase) {
        throw new Error('Subscription package not found');
      }

      const { customerInfo } = await service.purchasePackage(packageToPurchase);
      
      setPurchaseState(prev => ({
        ...prev,
        isLoading: false,
        customerInfo,
        activeSubscription: getActiveSubscription(customerInfo),
      }));

      return { success: true, customerInfo };
    } catch (error) {
      setPurchaseState(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Purchase failed',
      }));
      return { success: false, error };
    }
  };

  const restorePurchases = async () => {
    try {
      setPurchaseState(prev => ({ ...prev, isLoading: true, error: null }));
      
      const service = RevenueCatService.getInstance();
      const customerInfo = await service.restorePurchases();
      
      setPurchaseState(prev => ({
        ...prev,
        isLoading: false,
        customerInfo,
        activeSubscription: getActiveSubscription(customerInfo),
      }));

      return { success: true, customerInfo };
    } catch (error) {
      setPurchaseState(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Restore failed',
      }));
      return { success: false, error };
    }
  };

  const getActiveSubscription = (customerInfo: any): string | null => {
    if (!customerInfo?.entitlements?.active) return null;
    
    const activeEntitlements = Object.keys(customerInfo.entitlements.active);
    return activeEntitlements.length > 0 ? activeEntitlements[0] : null;
  };

  const hasActiveSubscription = (): boolean => {
    return purchaseState.activeSubscription !== null;
  };

  const hasPremiumAccess = (): boolean => {
    return purchaseState.customerInfo?.entitlements?.active?.premium?.isActive || false;
  };

  return {
    purchaseState,
    offerings,
    purchaseSubscription,
    restorePurchases,
    hasActiveSubscription,
    hasPremiumAccess,
    isLoading: purchaseState.isLoading,
    error: purchaseState.error,
  };
}