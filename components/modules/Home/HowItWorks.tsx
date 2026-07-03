// src/components/modules/Home/HowItWorks.tsx     

import { Search, Calendar, Users, Star } from 'lucide-react';

const steps = [
  {
    icon: Search,
    title: "Find a Guide",
    description: "Browse local guides based on your destination, interests, and budget"
  },
  {
    icon: Calendar,
    title: "Book a Tour",
    description: "Select your preferred date and time, then confirm the booking"
  },
  {
    icon: Users,
    title: "Meet & Explore",
    description: "Meet your guide and enjoy an authentic local experience"
  },
  {
    icon: Star,
    title: "Share Experience",
    description: "Rate your guide and share your experience with others"
  }
];

export default function HowItWorks() {
  return (
    <section className="py-16 bg-gradient-to-b from-white to-blue-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            How It Works
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Get started in just 4 simple steps
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="text-center">
              <div className="relative mb-6">
                <div className="w-20 h-20 mx-auto rounded-2xl bg-blue-100 flex items-center justify-center group hover:bg-blue-600 transition-colors duration-300">
                  <step.icon className="w-10 h-10 text-blue-600 group-hover:text-white transition-colors duration-300" />
                </div>
                <div className="absolute -top-3 -right-3 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
                  {index + 1}
                </div>
              </div>
              <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
              <p className="text-gray-600">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}