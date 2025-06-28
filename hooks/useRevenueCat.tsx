import React, { createContext, type PropsWithChildren, useEffect, useState, useContext } from 'react';
import Purchases, { type CustomerInfo, type PurchasesPackage } from 'react-native-purchases';
import { Platform } from 'react-native';

const APIKeys = {
    apple: process.env.EXPO_PUBLIC_REVENUE_CAT_API_KEY_APPLE || 'appl_EdRMbJTMUeqNxqQSdqXmETMsdhj', // Replace with your actual iOS key
    android: process.env.EXPO_PUBLIC_REVENUE_CAT_API_KEY_GOOGLE || 'test_key_android' // Replace with your actual Android key
}

interface RevenueCatContextProps {
    purchasePackage: (pack: PurchasesPackage) => Promise<void>;
    restorePermission: () => Promise<CustomerInfo>;
    packages: PurchasesPackage[];
    customerInfo?: CustomerInfo;
    identifyUser: (userId: string) => Promise<CustomerInfo>;
    logout: () => Promise<void>;
    isSubscriptionActive: boolean;
    isPremium: boolean;
}

export const RevenueCatContext = createContext<Partial<RevenueCatContextProps>>({})

export const RevenueCatProvider = ({ children }: PropsWithChildren) => {
    const [packages, setPackages] = useState<PurchasesPackage[]>([]);
    const [customerInfo, setCustomerInfo] = useState<CustomerInfo>();

      useEffect(() => {
    void (async () => {
      const apiKey = Platform.OS === 'ios' ? APIKeys.apple : APIKeys.android;
      
      console.log('🔐 RevenueCat Setup:', {
        platform: Platform.OS,
        hasApiKey: !!apiKey,
        apiKey: apiKey ? `${apiKey.substring(0, 8)}...` : 'MISSING'
      });
      
      if (!apiKey || apiKey.startsWith('test_key_')) {
        console.warn(`⚠️ RevenueCat API key missing or using test key for ${Platform.OS}`);
        console.warn('💡 Add your real API keys to .env file or replace test keys in useRevenueCat.tsx');
        // Continue with test key for development
      }
      
      try {
        Purchases.configure({apiKey});
        Purchases.addCustomerInfoUpdateListener(setCustomerInfo);
        await loadCurrentOffering();
        console.log('✅ RevenueCat configured successfully');
      } catch (error) {
        console.error('❌ RevenueCat configuration failed:', error);
      }
    })()
  }, []);

    const loadCurrentOffering = async () => {
        const offerings = await Purchases.getOfferings();

        const currentOffering = offerings.current;
        if (currentOffering) {
            setPackages(currentOffering.availablePackages)
        }
    }

    const purchasePackage = async (selectedPackage: PurchasesPackage) => {
        try {
            await Purchases.purchasePackage(selectedPackage);
        } catch(e) {
            console.error(`Failed to purchase package ${selectedPackage.identifier}`, e)
            throw e;
        }
    }

    const identifyUser = async (userId: string) => {
        try {
            const { customerInfo } = await Purchases.logIn(userId);
            setCustomerInfo(customerInfo);
            return customerInfo;
        } catch (e) {
            console.error('Failed to identify user with RevenueCat', e);
            throw e;
        }
    }

    const logout = async () => {
        try {
            await Purchases.logOut();
            setCustomerInfo(undefined);
        } catch (e) {
            console.error('Failed to logout from RevenueCat', e);
            throw e;
        }
    }

    // Check if user has active subscription
    const isSubscriptionActive = customerInfo?.entitlements.active ? Object.keys(customerInfo.entitlements.active).length > 0 : false;
    const isPremium = isSubscriptionActive;

    return (
        <RevenueCatContext.Provider
            value={{
                purchasePackage,
                restorePermission: () => Purchases.restorePurchases(),
                packages,
                customerInfo,
                identifyUser,
                logout,
                isSubscriptionActive,
                isPremium
            }}
        >
            {children}
        </RevenueCatContext.Provider>
    )
}

// Custom hook to use RevenueCat context
export const useRevenueCat = () => {
    const context = useContext(RevenueCatContext);
    if (!context) {
        throw new Error('useRevenueCat must be used within a RevenueCatProvider');
    }
    return context;
}; 