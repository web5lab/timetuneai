import React from 'react';
import { Mic, CheckCircle, Bell } from 'lucide-react';

const HowItWorks: React.FC = () => {
  const steps = [
    {
      number: 1,
      title: "Speak or Type",
      description: "Open TimeTuneAI and simply say or type your reminder. \"Remind me about the presentation at 10 AM tomorrow.\"",
      content: (
        <div className="flex flex-col items-center p-4">
          <Mic className="w-12 h-12 mb-3 text-orange-500" />
          <p className="text-base text-gray-700 font-medium">"Remind me: presentation tomorrow 10 AM"</p>
          <div className="mt-4 w-3/4 h-2 bg-orange-300 rounded-full animate-pulse"></div>
        </div>
      )
    },
    {
      number: 2,
      title: "AI Processes & Confirms",
      description: "Our AI instantly processes your request, understands the context, and confirms the reminder details with you.",
      content: (
        <div className="relative">
          <div className="absolute top-4 right-4 text-green-600 text-lg font-bold">AI Confirmed!</div>
          <div className="flex items-center bg-orange-500 text-white rounded-lg px-4 py-2 mb-3 shadow-md">
            <CheckCircle className="w-5 h-5 mr-2" />
            <span className="font-medium">Reminder for "Presentation"</span>
          </div>
          <p className="text-gray-800 text-base font-semibold">Scheduled for: <span className="text-orange-600">Tomorrow, 10:00 AM</span></p>
          <p className="text-gray-600 text-sm mt-2">Will you be needing any pre-reminders?</p>
          <div className="mt-4 flex gap-2">
            <span className="bg-yellow-200 text-yellow-800 text-xs px-3 py-1 rounded-full">Yes</span>
            <span className="bg-yellow-200 text-yellow-800 text-xs px-3 py-1 rounded-full">No</span>
          </div>
        </div>
      )
    },
    {
      number: 3,
      title: "Get Notified",
      description: "Receive timely notifications exactly when you need them, keeping you productive and stress-free.",
      content: (
        <div className="relative">
          <div className="absolute top-4 left-4 text-xs font-semibold text-gray-600">Now</div>
          <div className="relative w-4/5 p-3 bg-white rounded-lg shadow-md mb-3 flex items-center justify-between animate-fade-in-up">
            <div className="flex items-center">
              <Bell className="w-5 h-5 text-orange-500 mr-2" />
              <span className="font-medium text-gray-900">Presentation Reminder!</span>
            </div>
            <span className="text-xs text-gray-600">10:00 AM</span>
          </div>
          <div className="relative w-4/5 p-3 bg-white rounded-lg shadow-md flex items-center justify-between animate-fade-in-up delay-200">
            <div className="flex items-center">
              <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
              <span className="font-medium text-gray-900">Call John - Completed</span>
            </div>
            <span className="text-xs text-gray-600">3:00 PM</span>
          </div>
          <div className="mt-4 text-xs text-gray-500">Stay on top of everything!</div>
        </div>
      )
    }
  ];

  return (
    <section id="how-it-works" className="py-20 gradient-light-yellow-to-peach">
      <div className="container mx-auto px-6 text-center">
        <h2 className="text-4xl font-bold text-gray-900 mb-6">How TimeTuneAI Transforms Your Day</h2>
        <p className="text-xl text-gray-700 mb-16 max-w-3xl mx-auto">
          Getting started with intelligent reminders is simple, fast, and remarkably intuitive.
        </p>

        <div className="relative grid grid-cols-1 lg:grid-cols-3 gap-12 items-stretch pt-12 pb-6">
          {/* Lines connecting steps */}
          <div className="hidden lg:block absolute top-0 bottom-0 left-1/2 transform -translate-x-1/2 -ml-6 border-l-2 border-dashed border-orange-300" style={{height: 'calc(100% - 6rem)'}}></div>
          <div className="hidden lg:block absolute top-0 bottom-0 left-1/2 transform -translate-x-1/2 ml-6 border-l-2 border-dashed border-orange-300" style={{height: 'calc(100% - 6rem)'}}></div>

          {steps.map((step, index) => (
            <div key={index} className="flex flex-col items-center text-center p-8 bg-white rounded-2xl shadow-xl transition duration-300 hover:shadow-2xl hover:scale-[1.02] border-2 border-yellow-100 relative pt-16">
              <div className="absolute -top-8 flex items-center justify-center w-20 h-20 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-full text-white text-3xl font-bold shadow-lg ring-4 ring-orange-200">
                {step.number}
              </div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">{step.title}</h3>
              <p className="text-gray-700 leading-relaxed mb-6">
                {step.description}
              </p>
              <div className="w-full h-48 bg-yellow-100 rounded-xl flex flex-col justify-center items-center text-gray-500 text-sm font-medium border border-yellow-200 shadow-inner p-4 relative overflow-hidden">
                {step.content}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;