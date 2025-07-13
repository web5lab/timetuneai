import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

const FAQ: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqs = [
    {
      question: "How does TimeTuneAI understand natural language?",
      answer: "TimeTuneAI leverages advanced AI and Machine Learning models trained on vast datasets of spoken and written language. This allows it to accurately interpret your requests, extract key information like dates, times, and tasks, and set reminders precisely as you intend."
    },
    {
      question: "Is TimeTuneAI available on iOS?",
      answer: "Currently, TimeTuneAI is exclusively available on Android. We are continuously evaluating user demand and may consider developing an iOS version in the future. Stay tuned for updates!"
    },
    {
      question: "How does the AI handle recurring reminders?",
      answer: "Simply tell TimeTuneAI the recurrence pattern. For example, \"Remind me every Monday at 9 AM to check emails\" or \"Remind me daily at noon to take my medication.\" The AI will set up the recurring reminder automatically."
    },
    {
      question: "Is my data private and secure with TimeTuneAI?",
      answer: "Yes, absolutely. We prioritize your privacy and data security. All your data is encrypted both in transit and at rest. We do not share your personal data with third parties. You can review our full privacy policy within the app."
    }
  ];

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" className="py-20 bg-gradient-to-br from-orange-50 via-yellow-50 to-red-50">
      <div className="container mx-auto px-6 text-center">
        <h2 className="text-4xl font-bold text-gray-900 mb-6">Frequently Asked Questions</h2>
        <p className="text-xl text-gray-700 mb-16 max-w-3xl mx-auto">
          Find quick answers to the most common questions about TimeTuneAI.
        </p>

        <div className="max-w-3xl mx-auto space-y-6">
          {faqs.map((faq, index) => (
            <div key={index} className="bg-white rounded-xl shadow-md border border-yellow-100 overflow-hidden transform hover:scale-[1.005] transition duration-200">
              <button 
                onClick={() => toggleFAQ(index)}
                className="flex justify-between items-center w-full text-left p-6 font-semibold text-lg text-gray-900 hover:bg-yellow-100 focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                <span>{faq.question}</span>
                <ChevronDown 
                  className={`w-6 h-6 transform transition-transform duration-300 ${
                    openIndex === index ? 'rotate-180' : ''
                  }`} 
                />
              </button>
              {openIndex === index && (
                <div className="px-6 pb-6 text-gray-700 leading-relaxed border-t border-yellow-200">
                  <p className="pt-4">{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQ;