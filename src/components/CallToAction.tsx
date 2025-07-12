import React from 'react';
import { AppWindow } from 'lucide-react';

const CallToAction: React.FC = () => {
  return (
    <section className="py-20 bg-gradient-to-br from-amber-400 to-orange-500 text-white text-center">
      <div className="container mx-auto px-6">
        <h2 className="text-4xl font-bold mb-6">Ready to Reimagine Your Productivity?</h2>
        <p className="text-xl mb-10 max-w-2xl mx-auto">
          Join thousands who are simplifying their lives with TimeTuneAI. Download now and experience the future of personal organization.
        </p>
        <a href="#" className="px-10 py-5 bg-white text-orange-700 font-semibold rounded-full shadow-lg hover:bg-gray-100 transition duration-300 inline-flex items-center">
          <AppWindow className="w-6 h-6 mr-3" /> Get TimeTuneAI for Android
        </a>
      </div>
    </section>
  );
};

export default CallToAction;