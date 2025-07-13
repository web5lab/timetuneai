import React from 'react';
import { CheckCircle, XCircle } from 'lucide-react';

const Pricing: React.FC = () => {
  const plans = [
    {
      name: "Free",
      price: 0,
      description: "Perfect for personal use and getting started.",
      features: [
        { text: "Basic Voice Reminders", included: true },
        { text: "Unlimited Text Reminders", included: true },
        { text: "Standard Notifications", included: true },
        { text: "No Calendar Sync", included: false },
        { text: "Limited AI Context", included: false }
      ],
      buttonText: "Start Free",
      buttonStyle: "bg-yellow-200 text-orange-700 hover:bg-yellow-300",
      popular: false
    },
    {
      name: "Pro",
      price: 9,
      description: "Unleash full productivity with advanced features.",
      features: [
        { text: "Unlimited Voice & Text Reminders", included: true },
        { text: "Advanced AI Context & Learning", included: true },
        { text: "Customizable Alert Types", included: true },
        { text: "Calendar Integration (Google, Outlook)", included: true },
        { text: "Priority Task Management", included: true }
      ],
      buttonText: "Go Pro Now",
      buttonStyle: "bg-gradient-to-br from-yellow-500 to-orange-600 text-white hover:from-yellow-600 hover:to-orange-700",
      popular: true
    },
    {
      name: "Premium",
      price: 19,
      description: "For power users and small teams seeking ultimate control.",
      features: [
        { text: "All Pro Features", included: true },
        { text: "Team Collaboration Tools", included: true },
        { text: "Dedicated Premium Support", included: true },
        { text: "Advanced Analytics & Reporting", included: true },
        { text: "Early Access to New Features", included: true }
      ],
      buttonText: "Get Premium",
      buttonStyle: "bg-orange-600 text-white hover:bg-orange-700",
      popular: false
    }
  ];

  return (
    <section id="pricing" className="py-20 bg-gradient-to-br from-orange-50 via-yellow-50 to-red-50">
      <div className="container mx-auto px-6 text-center">
        <h2 className="text-4xl font-bold text-gray-900 mb-6">Simple & Transparent Pricing</h2>
        <p className="text-xl text-gray-700 mb-16 max-w-3xl mx-auto">
          Choose the plan that's right for you and unlock your full productivity potential.
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-center">
          {plans.map((plan, index) => (
            <div 
              key={index} 
              className={`bg-white rounded-2xl shadow-xl p-8 flex flex-col justify-between h-full transform transition duration-300 border ${
                plan.popular 
                  ? 'scale-[1.05] border-4 border-orange-500 ring-8 ring-orange-300 relative z-10' 
                  : 'hover:scale-[1.02] border-yellow-100'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-orange-500 text-white text-sm font-bold px-4 py-1 rounded-full shadow-lg">
                  Most Popular
                </div>
              )}
              
              <div>
                <h3 className="text-3xl font-bold text-gray-900 mb-4">{plan.name}</h3>
                <p className="text-gray-600 mb-8">{plan.description}</p>
                <div className="text-5xl font-extrabold text-orange-500 mb-8">
                  ${plan.price}<span className="text-xl font-medium text-gray-600">/month</span>
                </div>
                <ul className="text-left text-gray-700 space-y-4 mb-10">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className={`flex items-center ${!feature.included ? 'text-gray-500 opacity-75' : ''}`}>
                      {feature.included ? (
                        <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                      ) : (
                        <XCircle className="w-5 h-5 text-red-400 mr-3" />
                      )}
                      {feature.text}
                    </li>
                  ))}
                </ul>
              </div>
              
              <a href="#" className={`block w-full px-8 py-4 font-semibold rounded-full transition duration-300 shadow-md text-center ${plan.buttonStyle}`}>
                {plan.buttonText}
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Pricing;