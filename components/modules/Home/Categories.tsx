// src/components/modules/Home/Categories.tsx  

import { Utensils, Castle, Palette, Mountain, Moon, ShoppingBag, Camera, Trees } from 'lucide-react';
import Link from 'next/link';

const categories = [
  { icon: Utensils, label: "Food Tours", count: 45, color: "bg-orange-100 text-orange-600" },
  { icon: Castle, label: "History", count: 32, color: "bg-amber-100 text-amber-600" },
  { icon: Palette, label: "Art & Culture", count: 28, color: "bg-purple-100 text-purple-600" },
  { icon: Mountain, label: "Adventure", count: 36, color: "bg-green-100 text-green-600" },
  { icon: Moon, label: "Nightlife", count: 24, color: "bg-indigo-100 text-indigo-600" },
  { icon: ShoppingBag, label: "Shopping", count: 18, color: "bg-pink-100 text-pink-600" },
  { icon: Camera, label: "Photography", count: 22, color: "bg-blue-100 text-blue-600" },
  { icon: Trees, label: "Nature", count: 39, color: "bg-emerald-100 text-emerald-600" },
];

export default function Categories() {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Browse By Category
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Find experiences that match your interests
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {categories.map((category, index) => (
            <Link
              href={`/explore?category=${category.label.toLowerCase().replace(' & ', '-').replace(' ', '-')}`}
              key={index}
              className="group p-6 rounded-2xl border border-gray-200 hover:border-blue-300 hover:shadow-lg transition-all duration-300 text-center"
            >
              <div className={`w-16 h-16 mx-auto rounded-xl ${category.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                <category.icon className="w-8 h-8" />
              </div>
              <h3 className="font-semibold text-gray-800 mb-1">{category.label}</h3>
              <p className="text-sm text-gray-500">{category.count} experiences</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}