import React, { useState } from 'react';
import { Crown, Check, X, CreditCard, Calendar, Star, Gift, RefreshCw, AlertCircle } from 'lucide-react';
import AppHeader from '../components/AppHeader';
import Sidebar from '../components/Sidebar';
import { usePayments } from '../hooks/usePayments';

const SubscriptionPage: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
  const {
    isInitialized,
    isLoading,
    subscriptionPlans,
    currentSubscription,
    error,
    purchaseSubscription,
    restorePurchases,
    isSubscriptionActive,
    clearError,
  } = usePayments();

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handlePurchase = async (productId: string) => {
    clearError();
    const result = await purchaseSubscription(productId);
    
    if (result.success) {
      // Show success message
      alert('Subscription purchased successfully!');
    }
  };

  const handleRestorePurchases = async () => {
    clearError();
    const restored = await restorePurchases();
    
    if (restored) {
      alert('Purchases restored successfully!');
    }
  };

  // Add free plan to subscription plans
  const allPlans = [
    {
      id: 'free',
      name: 'Free',
      price: '$0',
      description: 'Perfect for getting started',
      productId: '',
      features: [
        'Up to 10 reminders per day',
        'Basic voice commands',
        'Standard notifications',
      ],
      current: !isSubscriptionActive(),
      popular: false,
    },
    ...subscriptionPlans.filter(plan => 
      billingCycle === 'monthly' 
        ? plan.id.includes('monthly') 
        : plan.id.includes('yearly')
    ).map(plan => ({
      ...plan,
      current: currentSubscription?.productId === plan.productId,
      popular: plan.id.includes('pro'),
    })),
  ];

  const currentPlan = allPlans.find(plan => plan.current);

  return (
    <div className="h-full bg-gray-50 dark:bg-slate-900 overflow-hidden flex flex-col transition-colors duration-200">
      <AppHeader onToggleSidebar={toggleSidebar} isSidebarOpen={isSidebarOpen} />
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      
      {/* Error Banner */}
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border-b border-red-200 dark:border-red-800 px-4 lg:px-6 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
              <p className="text-sm font-medium text-red-800 dark:text-red-200">{error}</p>
            </div>
            <button
              onClick={clearError}
              className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-200"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Subscription Header */}
      <div className="bg-gradient-to-r from-orange-500 to-red-500 dark:from-orange-600 dark:to-red-600 text-white shadow-lg">
        <div className="px-4 lg:px-6 py-8">
        
          
          {/* Current Plan Status */}
          <div className="bg-white/10 dark:bg-white/20 backdrop-blur-sm rounded-xl p-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-lg">Current Plan: {currentPlan?.name}</h3>
                <p className="text-orange-100 dark:text-orange-200 text-sm">
                  {currentPlan?.name === 'Free' ? 'Upgrade to unlock more features' : 
                   currentSubscription ? `Active since: ${new Date(currentSubscription.purchaseDate).toLocaleDateString()}` : 
                   'Next billing: January 15, 2024'}
                </p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold">
                  {currentPlan?.price}
                  <span className="text-sm font-normal">
                    {currentPlan?.name !== 'Free' ? `/${billingCycle === 'monthly' ? 'mo' : 'yr'}` : ''}
                  </span>
                </div>
                {currentPlan?.name !== 'Free' && (
                  <button className="text-sm text-orange-100 dark:text-orange-200 hover:text-white underline">
                    Cancel subscription
                  </button>
                )}
              </div>
            </div>
            
            {/* Restore Purchases Button */}
            {isInitialized && (
              <div className="mt-4 pt-4 border-t border-white/20">
                <button
                  onClick={handleRestorePurchases}
                  disabled={isLoading}
                  className="flex items-center space-x-2 text-sm text-orange-100 dark:text-orange-200 hover:text-white transition-colors"
                >
                  <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
                  <span>Restore Purchases</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Subscription Content */}
      <div className="flex-1 overflow-y-auto p-4 lg:p-6">
        <div className="max-w-4xl mx-auto">
          
          {/* Billing Toggle */}
          <div className="text-center mb-8">
            <div className="inline-flex bg-white dark:bg-slate-800 rounded-xl p-1 shadow-sm border border-gray-200 dark:border-gray-700">
              <button
                onClick={() => setBillingCycle('monthly')}
                className={`px-6 py-2 rounded-lg font-medium transition-all ${
                  billingCycle === 'monthly'
                    ? 'bg-orange-500 text-white shadow-sm'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                }`}
              >
                Monthly
              </button>
              <button
                onClick={() => setBillingCycle('yearly')}
                className={`px-6 py-2 rounded-lg font-medium transition-all relative ${
                  billingCycle === 'yearly'
                    ? 'bg-orange-500 text-white shadow-sm'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                }`}
              >
                Yearly
                <span className="absolute -top-2 -right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                  Save 20%
                </span>
              </button>
            </div>
          </div>

          {/* Plans Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            {allPlans.map((plan, index) => (
              <div
                key={index}
                className={`bg-white rounded-xl shadow-sm border p-6 relative ${
                  plan.popular
                    ? 'border-orange-500 ring-2 ring-orange-200 dark:ring-orange-800 scale-105'
                    : plan.current
                    ? 'border-green-500 ring-2 ring-green-200 dark:ring-green-800'
                    : 'border-gray-200 dark:border-gray-700'
                } bg-white dark:bg-slate-800 transition-colors duration-200`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <span className="bg-orange-500 text-white px-4 py-1 rounded-full text-sm font-medium">
                      Most Popular
                    </span>
                  </div>
                )}
                
                {plan.current && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <span className="bg-green-500 text-white px-4 py-1 rounded-full text-sm font-medium">
                      Current Plan
                    </span>
                  </div>
                )}

                <div className="text-center mb-6">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">{plan.name}</h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">{plan.description}</p>
                  <div className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                    {plan.price}
                    <span className="text-sm font-normal text-gray-600 dark:text-gray-400">
                      {plan.name !== 'Free' ? `/${billingCycle === 'monthly' ? 'month' : 'year'}` : ''}
                    </span>
                  </div>
                  {billingCycle === 'yearly' && plan.name !== 'Free' && (
                    <p className="text-sm text-green-600 mt-1">
                      Save 20% per year
                    </p>
                  )}
                </div>

                <ul className="space-y-3 mb-6">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center">
                      <Check className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                      <span className="text-gray-900 dark:text-gray-100">
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => plan.productId && handlePurchase(plan.productId)}
                  disabled={plan.current || isLoading || !isInitialized}
                  className={`w-full py-3 px-4 rounded-lg font-medium transition-all ${
                    plan.current
                      ? 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 cursor-not-allowed'
                      : !isInitialized
                      ? 'bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                      : plan.popular
                      ? 'bg-orange-500 text-white hover:bg-orange-600'
                      : 'bg-gray-900 dark:bg-slate-700 text-white hover:bg-gray-800 dark:hover:bg-slate-600'
                  }`}
                >
                  {isLoading ? 'Processing...' : 
                   plan.current ? 'Current Plan' : 
                   !isInitialized ? 'Loading...' :
                   plan.name === 'Free' ? 'Downgrade' : 'Upgrade'}
                </button>
              </div>
            ))}
          </div>

          {/* Payment Method */}
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-6 transition-colors duration-200">
            <div className="flex items-center space-x-3 mb-6">
              <CreditCard className="w-6 h-6 text-orange-500" />
              <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Payment Method</h2>
            </div>
            <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-slate-700 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-8 bg-blue-600 rounded flex items-center justify-center text-white text-xs font-bold">
                  VISA
                </div>
                <div>
                  <p className="font-medium text-gray-900 dark:text-gray-100">•••• •••• •••• 4242</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Expires 12/25</p>
                </div>
              </div>
              <button className="text-orange-500 hover:text-orange-600 dark:hover:text-orange-400 font-medium">
                Update
              </button>
            </div>
          </div>

          {/* Billing History */}
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 transition-colors duration-200">
            <div className="flex items-center space-x-3 mb-6">
              <Calendar className="w-6 h-6 text-orange-500" />
              <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Billing History</h2>
            </div>
            <div className="space-y-3">
              {[
                { date: 'Dec 15, 2023', amount: '$9.99', status: 'Paid', plan: 'Pro Monthly' },
                { date: 'Nov 15, 2023', amount: '$9.99', status: 'Paid', plan: 'Pro Monthly' },
                { date: 'Oct 15, 2023', amount: '$9.99', status: 'Paid', plan: 'Pro Monthly' },
              ].map((invoice, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-slate-700 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900 dark:text-gray-100">{invoice.plan}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{invoice.date}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-gray-900 dark:text-gray-100">{invoice.amount}</p>
                    <span className="inline-block bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs px-2 py-1 rounded-full">
                      {invoice.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionPage;