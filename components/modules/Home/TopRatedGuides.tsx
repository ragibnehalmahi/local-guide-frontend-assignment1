// src/components/modules/Home/TopRatedGuides.tsx       

import { Star, MapPin, Globe } from 'lucide-react';
import Link from 'next/link';

const guides = [
  { name: "Rahim Ahmed", location: "Dhaka", rating: 4.9, reviews: 127, expertise: ["Food", "History"], image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop" },
  { name: "Fatima Begum", location: "Sylhet", rating: 4.8, reviews: 94, expertise: ["Nature", "Tea"], image: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&auto=format&fit=crop" },
  { name: "Karim Chowdhury", location: "Chittagong", rating: 5.0, reviews: 156, expertise: ["Adventure", "Photography"], image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop" },
  { name: "Nusrat Jahan", location: "Cox's Bazar", rating: 4.7, reviews: 83, expertise: ["Beach", "Culture"], image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop" },
];

export default function TopRatedGuides() {
  return (
    <section className="py-16 bg-gradient-to-b from-blue-50 to-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Top Rated Local Guides
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Connect with passionate locals who know their cities best
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {guides.map((guide, index) => (
            <Link
              href={`/guide/${index + 1}`}
              key={index}
              className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden"
            >
              <div className="p-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-16 h-16 rounded-full overflow-hidden border-4 border-white shadow">
                    <img
                      src={guide.image}
                      alt={guide.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">{guide.name}</h3>
                    <div className="flex items-center gap-1 text-gray-600">
                      <MapPin className="w-4 h-4" />
                      <span className="text-sm">{guide.location}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 mb-3">
                  <div className="flex items-center">
                    <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                    <span className="ml-1 font-semibold">{guide.rating}</span>
                  </div>
                  <span className="text-gray-500 text-sm">({guide.reviews} reviews)</span>
                </div>

                <div className="flex flex-wrap gap-2">
                  {guide.expertise.map((exp, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm"
                    >
                      {exp}
                    </span>
                  ))}
                </div>
              </div>

              <div className="px-6 py-4 bg-gray-50 border-t border-gray-100">
                <button className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors duration-300">
                  View Profile
                </button>
              </div>
            </Link>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link
            href="/guides"
            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 font-semibold"
          >
            <Globe className="w-5 h-5" />
            Browse All Guides
          </Link>
        </div>
      </div>
    </section>
  );
}