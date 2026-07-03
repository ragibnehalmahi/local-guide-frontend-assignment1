//src/components/modules/Home/Hero.tsx  

"use client";

import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Hero() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/explore?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <section className="relative bg-gradient-to-br from-blue-50 to-cyan-50 py-20 md:py-32">
      <div className="container mx-auto px-4 text-center">
        <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
          Discover Authentic Experiences with{" "}
          <span className="text-blue-600">Local Guides</span>
        </h1>

        <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto">
          Connect with passionate locals who will show you the hidden gems,
          culture, and stories of their city. Travel like a local, not a tourist.
        </p>

        <form onSubmit={handleSearch} className="max-w-2xl mx-auto">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Where do you want to go? (e.g., Rome, Tokyo, Paris)"
                className="w-full pl-12 pr-4 py-4 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <Button type="submit" size="lg" className="px-8">
              Search Guides
            </Button>
          </div>
        </form>

        <div className="mt-12 flex flex-wrap justify-center gap-4 text-sm text-gray-600">
          <span className="px-4 py-2 bg-white rounded-full shadow-sm">
            🍕 Food Tours
          </span>
          <span className="px-4 py-2 bg-white rounded-full shadow-sm">
            🏛️ Historical Walks
          </span>
          <span className="px-4 py-2 bg-white rounded-full shadow-sm">
            🎨 Art & Culture
          </span>
          <span className="px-4 py-2 bg-white rounded-full shadow-sm">
            🏞️ Nature Adventures
          </span>
          <span className="px-4 py-2 bg-white rounded-full shadow-sm">
            🛍️ Shopping Guides
          </span>
          <span className="px-4 py-2 bg-white rounded-full shadow-sm">
            📸 Photography Tours
          </span>
        </div>
      </div>
    </section>
  );
}