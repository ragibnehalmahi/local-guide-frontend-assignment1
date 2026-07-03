// src/components/modules/Home/Testimonials.tsx     

import { Star, Quote } from 'lucide-react';

const testimonials = [
  {
    name: "Alex Johnson",
    location: "From USA",
    text: "My guide Rahim showed me parts of Old Dhaka I would never have found on my own. The street food tour was incredible!",
    rating: 5,
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop"
  },
  {
    name: "Sarah Chen",
    location: "From Singapore",
    text: "Fatima's Sylhet tea garden tour was magical. She shared stories about her family's tea business going back generations.",
    rating: 5,
    image: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&auto=format&fit=crop"
  },
  {
    name: "James Wilson",
    location: "From UK",
    text: "Karim made Chittagong come alive. The ship-breaking yard tour was eye-opening and something you won't find in guidebooks.",
    rating: 5,
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop"
  },
];

export default function Testimonials() {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Traveler Stories
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            See what our travelers say about their experiences
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="relative bg-gradient-to-br from-white to-blue-50 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300"
            >
              <Quote className="absolute top-4 right-4 w-12 h-12 text-blue-100" />

              <div className="flex items-center gap-3 mb-6">
                <div className="w-14 h-14 rounded-full overflow-hidden border-4 border-white shadow">
                  <img
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h4 className="font-bold">{testimonial.name}</h4>
                  <p className="text-sm text-gray-600">{testimonial.location}</p>
                </div>
              </div>

              <div className="flex mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                ))}
              </div>

              <p className="text-gray-700 italic">"{testimonial.text}"</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}