import React from 'react';
import { MessageSquare, Brain, BellRing, CalendarCheck, Layers, Settings } from 'lucide-react';

const Features: React.FC = () => {
  const features = [
    {
      icon: MessageSquare,
      title: "Voice & Chat Commands",
      description: "Simply speak or type your reminder. TimeTuneAI understands natural language, making setup incredibly fast. \"Remind me to call John at 3 PM tomorrow.\" Done.",
      color: "bg-orange-400 group-hover:bg-orange-500"
    },
    {
      icon: Brain,
      title: "Intelligent Context",
      description: "Our AI learns your habits and preferences. It can suggest optimal times, categorize reminders, and even adapt to your schedule changes.",
      color: "bg-green-500 group-hover:bg-green-600"
    },
    {
      icon: BellRing,
      title: "Customizable Alerts",
      description: "Choose how you get notified: subtle pings, persistent alarms, or even follow-up reminders. Tailor alerts to fit your workflow.",
      color: "bg-blue-500 group-hover:bg-blue-600"
    },
    {
      icon: CalendarCheck,
      title: "Seamless Integration",
      description: "Syncs with your existing calendars (Google Calendar, Outlook) to ensure all your appointments and tasks are in one place.",
      color: "bg-red-500 group-hover:bg-red-600"
    },
    {
      icon: Layers,
      title: "Task Management",
      description: "Beyond reminders, create and manage detailed task lists, set priorities, and track your progress all within the app.",
      color: "bg-teal-500 group-hover:bg-teal-600"
    },
    {
      icon: Settings,
      title: "Intuitive User Interface",
      description: "A clean, intuitive design ensures a smooth user experience. Focus on your tasks, not on learning a complex app.",
      color: "bg-amber-500 group-hover:bg-amber-600"
    }
  ];

  return (
    <section id="features" className="py-20 gradient-peach-to-light-yellow">
      <div className="container mx-auto px-6 text-center">
        <h2 className="text-4xl font-bold text-gray-900 mb-6">Key Features of TimeTuneAI</h2>
        <p className="text-xl text-gray-700 mb-16 max-w-3xl mx-auto">
          Experience a new level of productivity with intelligent, intuitive reminder management.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {features.map((feature, index) => {
            const IconComponent = feature.icon;
            return (
              <div key={index} className="bg-white rounded-2xl shadow-xl p-8 transform hover:scale-105 transition duration-300 border border-yellow-100 group">
                <div className={`${feature.color} p-4 rounded-full inline-flex mb-6 transition duration-300`}>
                  <IconComponent className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-semibold text-gray-900 mb-4">{feature.title}</h3>
                <p className="text-gray-700 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Features;