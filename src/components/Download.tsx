import React from 'react';

const Download: React.FC = () => {
  return (
    <section className="py-20 bg-gradient-to-br from-yellow-600 to-orange-700 text-white text-center">
      <div className="container mx-auto px-6">
        <h2 className="text-4xl font-bold mb-6">Download TimeTuneAI Today!</h2>
        <p className="text-xl mb-10 max-w-2xl mx-auto">
          Get the app on the Google Play Store and start organizing your life effortlessly.
        </p>
        <div className="flex flex-col sm:flex-row justify-center items-center gap-6">
          <a 
            href="https://play.google.com/store/apps/details?id=com.yourcompany.timetuneai" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="px-8 py-4 bg-white text-orange-700 font-semibold rounded-full shadow-lg hover:bg-gray-100 transition duration-300 inline-flex items-center text-lg"
          >
            <img 
              src="https://images.pexels.com/photos/267350/pexels-photo-267350.jpeg?auto=compress&cs=tinysrgb&w=150&h=50" 
              alt="Google Play Store" 
              className="w-32 mr-3 rounded"
            />
            <span className="sr-only">Download on Google Play</span>
          </a>
        </div>
      </div>
    </section>
  );
};

export default Download;