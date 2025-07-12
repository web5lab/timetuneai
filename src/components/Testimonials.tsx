import React from 'react';
import { Star, StarHalf } from 'lucide-react';

const Testimonials: React.FC = () => {
  const testimonials = [
    {
      name: "Sarah M.",
      role: "Marketing Manager",
      initials: "SM",
      bgColor: "bg-blue-400",
      text: "TimeTuneAI is a game-changer! I can literally just speak my reminders, and it handles everything. My productivity has soared since I started using it.",
      rating: 5
    },
    {
      name: "John D.",
      role: "Freelance Developer",
      initials: "JD",
      bgColor: "bg-green-400",
      text: "I used to miss deadlines constantly. With TimeTuneAI's intelligent reminders, I'm always on top of my tasks. It's like having a personal assistant!",
      rating: 4.5
    },
    {
      name: "Maria P.",
      role: "Busy Mom",
      initials: "MP",
      bgColor: "bg-orange-400",
      text: "From grocery lists to kids' appointments, TimeTuneAI keeps my chaotic schedule organized. The natural language input is incredibly convenient.",
      rating: 5
    }
  ];

  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<Star key={i} className="w-5 h-5 fill-current" />);
    }

    if (hasHalfStar) {
      stars.push(<StarHalf key="half" className="w-5 h-5 fill-current" />);
    }

    return stars;
  };

  return (
    <section id="testimonials" className="py-20 gradient-peach-to-light-yellow">
      <div className="container mx-auto px-6 text-center">
        <h2 className="text-4xl font-bold text-gray-900 mb-6">What Our Users Say</h2>
        <p className="text-xl text-gray-700 mb-16 max-w-3xl mx-auto">
          Hear from real users who have transformed their daily routines with TimeTuneAI.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="bg-white rounded-2xl shadow-lg p-8 transform hover:scale-[1.02] transition duration-300 border border-yellow-100">
              <div className="flex items-center mb-6">
                <div className={`w-16 h-16 ${testimonial.bgColor} rounded-full flex items-center justify-center text-white font-medium text-sm mr-4 flex-shrink-0`}>
                  {testimonial.initials}
                </div>
                <div className="text-left">
                  <p className="font-semibold text-lg text-gray-900">{testimonial.name}</p>
                  <p className="text-gray-600 text-sm">{testimonial.role}</p>
                </div>
              </div>
              <p className="text-gray-700 italic leading-relaxed">
                "{testimonial.text}"
              </p>
              <div className="flex justify-center mt-6 text-yellow-500">
                {renderStars(testimonial.rating)}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;