import { useState, useEffect } from 'react';
import { paymentService, PurchaseStatus, SubscriptionPlan } from '../services/paymentService';

export const usePayments = () => {
  const [isInitialized, setIsInitialized] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [subscriptionPlans, setSubscriptionPlans] = useState<SubscriptionPlan[]>([]);
  const [currentSubscription, setCurrentSubscription] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    initializePayments();
    loadSubscriptionData();
    setupEventListeners();

    return () => {
      removeEventListeners();
    };
  }, []);

  const initializePayments = async () => {
    try {
      setIsLoading(true);
      const initialized = await paymentService.initialize();
      setIsInitialized(initialized);
      
      if (initialized) {
        const plans = paymentService.getSubscriptionPlans();
        setSubscriptionPlans(plans);
      }
    } catch (error) {
      console.error('Error initializing payments:', error);
      setError('Failed to initialize payment system');
    } finally {
      setIsLoading(false);
    }
  };

  const loadSubscriptionData = () => {
    const subscription = paymentService.getCurrentSubscription();
    setCurrentSubscription(subscription);
  };

  const setupEventListeners = () => {
    window.addEventListener('subscriptionUpdated', handleSubscriptionUpdate);
    window.addEventListener('purchaseError', handlePurchaseError);
  };

  const removeEventListeners = () => {
    window.removeEventListener('subscriptionUpdated', handleSubscriptionUpdate);
    window.removeEventListener('purchaseError', handlePurchaseError);
  };

  const handleSubscriptionUpdate = (event: CustomEvent) => {
    setCurrentSubscription(event.detail);
    setError(null);
  };

  const handlePurchaseError = (event: CustomEvent) => {
    setError(event.detail.message);
  };

  const purchaseSubscription = async (productId: string): Promise<PurchaseStatus> => {
    try {
      setIsLoading(true);
      setError(null);
      
      const result = await paymentService.purchaseSubscription(productId);
      
      if (!result.success) {
        setError(result.error || 'Purchase failed');
      }
      
      return result;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  };

  const restorePurchases = async (): Promise<boolean> => {
    try {
      setIsLoading(true);
      setError(null);
      
      const restored = await paymentService.restorePurchases();
      
      if (restored) {
        loadSubscriptionData();
      } else {
        setError('No purchases found to restore');
      }
      
      return restored;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to restore purchases';
      setError(errorMessage);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const isSubscriptionActive = (): boolean => {
    return paymentService.isSubscriptionActive();
  };

  const clearError = () => {
    setError(null);
  };

  return {
    isInitialized,
    isLoading,
    subscriptionPlans,
    currentSubscription,
    error,
    purchaseSubscription,
    restorePurchases,
    isSubscriptionActive,
    clearError,
  };
};