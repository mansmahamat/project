export interface Subscription {
  id: string;
  title: string;
  description: string;
  price: string;
  period: 'monthly' | 'yearly';
  features: string[];
  popular?: boolean;
  savings?: string;
}

export interface PurchaseState {
  isLoading: boolean;
  error: string | null;
  activeSubscription: string | null;
  customerInfo: any | null;
}

export interface PaywallProps {
  onClose: () => void;
  onPurchaseSuccess: (subscription: Subscription) => void;
}