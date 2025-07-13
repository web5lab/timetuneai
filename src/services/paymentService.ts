import { InAppPurchases, PurchaseResult, ProductDetails } from '@capacitor-community/in-app-purchases';
import { Capacitor } from '@capacitor/core';

export interface SubscriptionPlan {
  id: string;
  name: string;
  price: string;
  description: string;
  features: string[];
  productId: string;
  isPopular?: boolean;
}

export interface PurchaseStatus {
  success: boolean;
  productId?: string;
  transactionId?: string;
  error?: string;
}

export class PaymentService {
  private static instance: PaymentService;
  private isInitialized = false;
  private availableProducts: ProductDetails[] = [];

  // Play Store product IDs
  private readonly PRODUCT_IDS = {
    PRO_MONTHLY: 'timetuneai_pro_monthly',
    PRO_YEARLY: 'timetuneai_pro_yearly',
    PREMIUM_MONTHLY: 'timetuneai_premium_monthly',
    PREMIUM_YEARLY: 'timetuneai_premium_yearly',
  };

  static getInstance(): PaymentService {
    if (!PaymentService.instance) {
      PaymentService.instance = new PaymentService();
    }
    return PaymentService.instance;
  }

  async initialize(): Promise<boolean> {
    if (this.isInitialized) return true;

    try {
      // Only initialize on native platforms
      if (!Capacitor.isNativePlatform()) {
        console.log('In-app purchases not available on web platform');
        return false;
      }

      // Initialize the plugin
      await InAppPurchases.initialize();
      
      // Load available products
      await this.loadProducts();
      
      // Set up purchase listeners
      this.setupPurchaseListeners();
      
      this.isInitialized = true;
      console.log('Payment service initialized successfully');
      return true;
    } catch (error) {
      console.error('Error initializing payment service:', error);
      return false;
    }
  }

  private async loadProducts(): Promise<void> {
    try {
      const productIds = Object.values(this.PRODUCT_IDS);
      const result = await InAppPurchases.getProducts({ productIds });
      
      if (result.products) {
        this.availableProducts = result.products;
        console.log('Loaded products:', this.availableProducts);
      }
    } catch (error) {
      console.error('Error loading products:', error);
    }
  }

  private setupPurchaseListeners(): void {
    // Listen for purchase updates
    InAppPurchases.addListener('purchaseUpdated', (purchase) => {
      console.log('Purchase updated:', purchase);
      this.handlePurchaseUpdate(purchase);
    });

    // Listen for purchase errors
    InAppPurchases.addListener('purchaseError', (error) => {
      console.error('Purchase error:', error);
      this.handlePurchaseError(error);
    });
  }

  private handlePurchaseUpdate(purchase: any): void {
    // Handle successful purchase
    if (purchase.state === 'purchased') {
      // Verify purchase with your backend
      this.verifyPurchase(purchase);
      
      // Update user subscription status
      this.updateSubscriptionStatus(purchase.productId);
      
      // Acknowledge the purchase
      this.acknowledgePurchase(purchase);
    }
  }

  private handlePurchaseError(error: any): void {
    // Handle purchase errors
    console.error('Purchase failed:', error);
    
    // Show user-friendly error message
    this.showErrorMessage(error);
  }

  async purchaseSubscription(productId: string): Promise<PurchaseStatus> {
    try {
      if (!this.isInitialized) {
        const initialized = await this.initialize();
        if (!initialized) {
          return { success: false, error: 'Payment system not available' };
        }
      }

      // Check if product is available
      const product = this.availableProducts.find(p => p.productId === productId);
      if (!product) {
        return { success: false, error: 'Product not available' };
      }

      // Initiate purchase
      const result = await InAppPurchases.purchaseProduct({ productId });
      
      if (result.success) {
        return {
          success: true,
          productId: result.productId,
          transactionId: result.transactionId,
        };
      } else {
        return {
          success: false,
          error: result.error || 'Purchase failed',
        };
      }
    } catch (error) {
      console.error('Error purchasing subscription:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  async restorePurchases(): Promise<boolean> {
    try {
      if (!this.isInitialized) {
        const initialized = await this.initialize();
        if (!initialized) return false;
      }

      const result = await InAppPurchases.restorePurchases();
      
      if (result.purchases && result.purchases.length > 0) {
        // Process restored purchases
        for (const purchase of result.purchases) {
          this.updateSubscriptionStatus(purchase.productId);
        }
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Error restoring purchases:', error);
      return false;
    }
  }

  private async verifyPurchase(purchase: any): Promise<void> {
    try {
      // In a real app, you would verify the purchase with your backend server
      // This prevents fraud and ensures the purchase is legitimate
      
      const verificationData = {
        productId: purchase.productId,
        purchaseToken: purchase.purchaseToken,
        transactionId: purchase.transactionId,
        userId: this.getCurrentUserId(), // Get from your auth system
      };

      // Send to your backend for verification
      // const response = await fetch('/api/verify-purchase', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(verificationData),
      // });

      console.log('Purchase verification data:', verificationData);
    } catch (error) {
      console.error('Error verifying purchase:', error);
    }
  }

  private async acknowledgePurchase(purchase: any): Promise<void> {
    try {
      await InAppPurchases.acknowledgePurchase({
        purchaseToken: purchase.purchaseToken,
      });
      console.log('Purchase acknowledged');
    } catch (error) {
      console.error('Error acknowledging purchase:', error);
    }
  }

  private updateSubscriptionStatus(productId: string): void {
    // Update local storage or state management
    const subscriptionData = {
      productId,
      purchaseDate: new Date().toISOString(),
      isActive: true,
    };

    localStorage.setItem('subscription', JSON.stringify(subscriptionData));
    
    // Dispatch event for UI updates
    window.dispatchEvent(new CustomEvent('subscriptionUpdated', {
      detail: subscriptionData,
    }));
  }

  private showErrorMessage(error: any): void {
    // Show user-friendly error message
    let message = 'Purchase failed. Please try again.';
    
    if (error.code === 'USER_CANCELED') {
      message = 'Purchase was cancelled.';
    } else if (error.code === 'PAYMENT_INVALID') {
      message = 'Payment method is invalid.';
    } else if (error.code === 'ITEM_ALREADY_OWNED') {
      message = 'You already own this subscription.';
    }

    // Dispatch event for UI to show error
    window.dispatchEvent(new CustomEvent('purchaseError', {
      detail: { message },
    }));
  }

  private getCurrentUserId(): string {
    // Get user ID from your authentication system
    return localStorage.getItem('userId') || 'anonymous';
  }

  getAvailableProducts(): ProductDetails[] {
    return this.availableProducts;
  }

  getProductById(productId: string): ProductDetails | undefined {
    return this.availableProducts.find(p => p.productId === productId);
  }

  getCurrentSubscription(): any {
    const subscription = localStorage.getItem('subscription');
    return subscription ? JSON.parse(subscription) : null;
  }

  isSubscriptionActive(): boolean {
    const subscription = this.getCurrentSubscription();
    return subscription && subscription.isActive;
  }

  getSubscriptionPlans(): SubscriptionPlan[] {
    return [
      {
        id: 'pro_monthly',
        name: 'Pro',
        price: '$9.99',
        description: 'For power users who want more',
        productId: this.PRODUCT_IDS.PRO_MONTHLY,
        features: [
          'Unlimited reminders',
          'Advanced voice commands',
          'Smart notifications',
          'Calendar sync',
          'Advanced AI features',
        ],
        isPopular: true,
      },
      {
        id: 'pro_yearly',
        name: 'Pro Yearly',
        price: '$99.99',
        description: 'Pro plan with yearly savings',
        productId: this.PRODUCT_IDS.PRO_YEARLY,
        features: [
          'Everything in Pro Monthly',
          'Save 20% with yearly billing',
          'Priority customer support',
        ],
      },
      {
        id: 'premium_monthly',
        name: 'Premium',
        price: '$19.99',
        description: 'Ultimate productivity experience',
        productId: this.PRODUCT_IDS.PREMIUM_MONTHLY,
        features: [
          'Everything in Pro',
          'Team collaboration',
          'Advanced analytics',
          'Custom integrations',
          'White-label options',
          '24/7 priority support',
        ],
      },
      {
        id: 'premium_yearly',
        name: 'Premium Yearly',
        price: '$199.99',
        description: 'Premium plan with yearly savings',
        productId: this.PRODUCT_IDS.PREMIUM_YEARLY,
        features: [
          'Everything in Premium Monthly',
          'Save 20% with yearly billing',
          'Dedicated account manager',
        ],
      },
    ];
  }
}

export const paymentService = PaymentService.getInstance();