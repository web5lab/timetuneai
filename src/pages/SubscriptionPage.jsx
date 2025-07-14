import React, { useState } from 'react';
import { Check, X, CreditCard, Calendar } from 'lucide-react';
import AppHeader from '../components/AppHeader';
import BottomNavigation from '../components/BottomNavigation';

const SubscriptionPage = () => {
  const [billingCycle, setBillingCycle] = useState('monthly');

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
    },
    {
      name: 'Pro',
      price: { monthly: 9.99, yearly: 99.99 },
      description: 'For power users',
      features: [
        { text: 'Unlimited reminders', included: true },
        { text: 'Advanced voice commands', included: true },
        { text: 'Smart notifications', included: true },
        { text: 'Calendar sync', included: true },
        { text: 'Advanced AI features', included: true },
        { text: 'Priority support', included: false },
      ],
      current: true,
    },
  ];

  const currentPlan = plans.find(p => p.current);

  return (
    <div className="h-full bg-white dark:bg-slate-900 flex flex-col text-sm">
      <AppHeader />

      {/* Header */}
      <div className="bg-orange-500 dark:bg-orange-600 text-white px-4 py-3">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="font-medium">Plan: {currentPlan?.name}</h3>
            <p className="text-xs">
              {currentPlan?.name === 'Free'
                ? 'Upgrade to unlock features'
                : 'Next billing: Jan 15, 2024'}
            </p>
          </div>
          <div className="text-right">
            <div className="font-semibold text-base">
              ${currentPlan?.price[billingCycle]}<span className="text-xs">/{billingCycle === 'monthly' ? 'mo' : 'yr'}</span>
            </div>
            {currentPlan?.name !== 'Free' && (
              <button className="text-xs underline mt-1">Cancel</button>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto p-4">
        {/* Billing Toggle */}
        <div className="flex justify-center mb-4">
          <div className="bg-gray-100 dark:bg-slate-800 rounded-md overflow-hidden text-xs font-medium flex">
            <button
              onClick={() => setBillingCycle('monthly')}
              className={`px-4 py-2 ${billingCycle === 'monthly' ? 'bg-orange-500 text-white' : 'text-gray-700 dark:text-gray-300'}`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingCycle('yearly')}
              className={`px-4 py-2 relative ${billingCycle === 'yearly' ? 'bg-orange-500 text-white' : 'text-gray-700 dark:text-gray-300'}`}
            >
              Yearly
              <span className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 bg-green-500 text-white text-[10px] px-1.5 py-0.5 rounded-full">
                Save 20%
              </span>
            </button>
          </div>
        </div>

        {/* Plan Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {plans.map((plan, i) => (
            <div key={i} className="border rounded-lg p-4 bg-white dark:bg-slate-800">
              <h4 className="font-semibold text-base mb-1">{plan.name}</h4>
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">{plan.description}</p>
              <div className="text-xl font-bold mb-3">
                ${plan.price[billingCycle]}
                <span className="text-sm font-normal text-gray-600 dark:text-gray-400">/{billingCycle === 'monthly' ? 'mo' : 'yr'}</span>
              </div>
              <ul className="mb-4 space-y-2 text-sm">
                {plan.features.map((f, idx) => (
                  <li key={idx} className="flex items-center text-gray-700 dark:text-gray-300">
                    {f.included ? <Check className="w-4 h-4 mr-2 text-green-500" /> : <X className="w-4 h-4 mr-2 text-gray-400" />}
                    {f.text}
                  </li>
                ))}
              </ul>
              <button
                className={`w-full py-2 rounded-md text-sm font-medium ${plan.current
                  ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                  : 'bg-orange-500 text-white hover:bg-orange-600'
                }`}
                disabled={plan.current}
              >
                {plan.current ? 'Current Plan' : 'Choose'}
              </button>
            </div>
          ))}
        </div>

        {/* Payment Method */}
        <div className="mt-6">
          <div className="flex items-center space-x-2 mb-2">
            <CreditCard className="w-4 h-4 text-orange-500" />
            <h2 className="font-medium text-sm">Payment Method</h2>
          </div>
          <div className="bg-gray-100 dark:bg-slate-800 p-3 rounded-md flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-6 bg-blue-600 rounded text-white flex items-center justify-center text-xs font-bold">VISA</div>
              <div>
                <p className="text-sm font-medium">•••• 4242</p>
                <p className="text-xs text-gray-500">Expires 12/25</p>
              </div>
            </div>
            <button className="text-xs text-orange-500 hover:underline">Update</button>
          </div>
        </div>

        {/* Billing History */}
        <div className="mt-6">
          <div className="flex items-center space-x-2 mb-2">
            <Calendar className="w-4 h-4 text-orange-500" />
            <h2 className="font-medium text-sm">Billing History</h2>
          </div>
          <div className="space-y-2">
            {[
              { date: 'Dec 15, 2023', amount: '$9.99', status: 'Paid', plan: 'Pro Monthly' },
              { date: 'Nov 15, 2023', amount: '$9.99', status: 'Paid', plan: 'Pro Monthly' },
            ].map((invoice, i) => (
              <div key={i} className="bg-gray-100 dark:bg-slate-800 p-3 rounded-md flex justify-between text-sm">
                <div>
                  <p className="font-medium">{invoice.plan}</p>
                  <p className="text-xs text-gray-500">{invoice.date}</p>
                </div>
                <div className="text-right">
                  <p className="font-medium">{invoice.amount}</p>
                  <span className="text-green-600 text-xs">{invoice.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <BottomNavigation />
    </div>
  );
};

export default SubscriptionPage;
