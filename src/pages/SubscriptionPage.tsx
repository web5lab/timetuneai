import React, { useState } from 'react';
import { Crown, Check, X, CreditCard, Calendar, Star, Gift } from 'lucide-react';
import AppHeader from '../components/AppHeader';
import BottomNavigation from '../components/BottomNavigation';

const SubscriptionPage: React.FC = () => {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');

  const plans = [
    {
      name: 'Free',
      price: { monthly: 0, yearly: 0 },
      description: 'Perfect for getting started',
      features: [
        { text: 'Up to 10 reminders per day', included: true },
        { text: 'Basic voice commands', included: true },
        { text: 'Standard notifications', included: true },
        { text: 'Calendar sync', included: false },
        { text: 'Advanced AI features', included: false },
        { text: 'Priority support', included: false },
      ],
      current: false,
      popular: false,
    },
    {
      name: 'Pro',
      price: { monthly: 9.99, yearly: 99.99 },
      description: 'For power users who want more',
      features: [
        { text: 'Unlimited reminders', included: true },
        { text: 'Advanced voice commands', included: true },
        { text: 'Smart notifications', included: true },
        { text: 'Calendar sync', included: true },
        { text: 'Advanced AI features', included: true },
        { text: 'Priority support', included: false },
      ],
      current: true,
      popular: true,
    },
    {
      name: 'Premium',
      price: { monthly: 19.99, yearly: 199.99 },
      description: 'Ultimate productivity experience',
      features: [
        { text: 'Everything in Pro', included: true },
        { text: 'Team collaboration', included: true },
        { text: 'Advanced analytics', included: true },
        { text: 'Custom integrations', included: true },
        { text: 'White-label options', included: true },
        { text: '24/7 priority support', included: true },
      ],
      current: false,
      popular: false,
    },
  ];

  const currentPlan = plans.find(plan => plan.current);

  return (
    <div className="h-full bg-gray-50 dark:bg-slate-900 overflow-hidden flex flex-col transition-colors duration-200">
      <AppHeader />
      
      {/* Subscription Header */}
      <div className="bg-gradient-to-r from-orange-500 to-red-500 dark:from-orange-600 dark:to-red-600 text-white shadow-lg">
        <div className="px-4 lg:px-6 py-8">
        
          
          {/* Current Plan Status */}
          <div className="bg-white/10 dark:bg-white/20 backdrop-blur-sm rounded-xl p-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-lg">Current Plan: {currentPlan?.name}</h3>
                <p className="text-orange-100 dark:text-orange-200 text-sm">
                  {currentPlan?.name === 'Free' ? 'Upgrade to unlock more features' : 'Next billing: January 15, 2024'}
                </p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold">
                  ${currentPlan?.price[billingCycle]}
                  <span className="text-sm font-normal">/{billingCycle === 'monthly' ? 'mo' : 'yr'}</span>
                </div>
                {currentPlan?.name !== 'Free' && (
                  <button className="text-sm text-orange-100 dark:text-orange-200 hover:text-white underline">
                    Cancel subscription
                  </button>
                )}
              </div>
            </div>
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
            {plans.map((plan, index) => (
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
                    ${plan.price[billingCycle]}
                    <span className="text-sm font-normal text-gray-600 dark:text-gray-400">
                      /{billingCycle === 'monthly' ? 'month' : 'year'}
                    </span>
                  </div>
                  {billingCycle === 'yearly' && plan.price.yearly > 0 && (
                    <p className="text-sm text-green-600 mt-1">
                      Save ${(plan.price.monthly * 12 - plan.price.yearly).toFixed(2)} per year
                    </p>
                  )}
                </div>

                <ul className="space-y-3 mb-6">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center">
                      {feature.included ? (
                        <Check className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                      ) : (
                        <X className="w-5 h-5 text-gray-400 mr-3 flex-shrink-0" />
                      )}
                      <span className={feature.included ? 'text-gray-900' : 'text-gray-500'}>
                        {feature.text}
                      </span>
                      <span className={feature.included ? 'text-gray-900 dark:text-gray-100' : 'text-gray-500 dark:text-gray-600'}>
                        {feature.text}
                      </span>
                    </li>
                  ))}
                </ul>

                <button
                  className={`w-full py-3 px-4 rounded-lg font-medium transition-all ${
                    plan.current
                      ? 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 cursor-not-allowed'
                      : plan.popular
                      ? 'bg-orange-500 text-white hover:bg-orange-600'
                      : 'bg-gray-900 dark:bg-slate-700 text-white hover:bg-gray-800 dark:hover:bg-slate-600'
                  }`}
                  disabled={plan.current}
                >
                  {plan.current ? 'Current Plan' : plan.name === 'Free' ? 'Downgrade' : 'Upgrade'}
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
      <BottomNavigation />
    </div>
  );
};

export default SubscriptionPage;