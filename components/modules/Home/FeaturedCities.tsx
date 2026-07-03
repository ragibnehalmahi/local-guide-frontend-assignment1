// src/components/modules/Home/FeaturedCities.tsx     

import { MapPin } from 'lucide-react';
import Link from 'next/link';

const cities = [
  { name: 'Dhaka', tours: 45, image: 'https://images.unsplash.com/photo-1558005530-a7958896ec60?w=800&auto=format&fit=crop' },
  { name: 'Cox\'s Bazar', tours: 32, image: 'https://images.unsplash.com/photo-1592478411213-6153e4eb2f5d?w-800&auto=format&fit=crop' },
  { name: 'Sylhet', tours: 28, image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&auto=format&fit=crop' },
  { name: 'Chittagong', tours: 36, image: 'https://images.unsplash.com/photo-1548013146-72479768bada?w=800&auto=format&fit=crop' },
  { name: 'Khulna', tours: 24, image: 'https://images.unsplash.com/photo-1528164344705-47542687000d?w=800&auto=format&fit=crop' },
  { name: 'Rajshahi', tours: 18, image: 'https://images.unsplash.com/photo-1583417319070-4a69db38a482?w=800&auto=format&fit=crop' },
];

export default function FeaturedCities() {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Explore Popular Destinations
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Discover amazing experiences in Bangladesh's most vibrant cities
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {cities.map((city, index) => (
            <Link
              href={`/explore?city=${city.name.toLowerCase()}`}
              key={index}
              className="group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300"
            >
              <div className="relative h-64">
                <div
                  className="absolute inset-0 bg-cover bg-center group-hover:scale-105 transition-transform duration-500"
                  style={{ backgroundImage: `url(${city.image})` }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                <div className="absolute bottom-4 left-4 text-white">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-5 h-5" />
                    <h3 className="text-2xl font-bold">{city.name}</h3>
                  </div>
                  <p className="text-white/90">{city.tours}+ Tours Available</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}