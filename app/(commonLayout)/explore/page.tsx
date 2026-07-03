//local-guide-frontend-assignment\local-guide-frontend\my-app\app\(commonLayout)\explore\page.tsx 
"use client";

import { useState, useEffect, Suspense } from "react";
import axios from "axios";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import Image from "next/image";
import { Loader2, MapPin, Search } from "lucide-react";


function ExploreContent() {
  const [listings, setListings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const searchParams = useSearchParams();

  // Filters
  const [searchTerm, setSearchTerm] = useState(searchParams.get("searchTerm") || "");
  const [category, setCategory] = useState(searchParams.get("category") || "");
  const [maxPrice, setMaxPrice] = useState<number>(Number(searchParams.get("maxPrice")) || 1000);

  const fetchListings = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (searchTerm) params.append("searchTerm", searchTerm);
      if (category && category !== "all") params.append("category", category);
      if (maxPrice) params.append("maxPrice", maxPrice.toString());

      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/listings?${params.toString()}`);
      setListings(res.data.data.result || []);
    } catch (error) {
      console.error("Error fetching listings:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchListings();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (searchTerm) params.append("searchTerm", searchTerm);
    if (category && category !== "all") params.append("category", category);
    if (maxPrice) params.append("maxPrice", maxPrice.toString());
    router.push(`/explore?${params.toString()}`);
  };

  return (
    <div className="container mx-auto py-10 px-4 md:px-6 mt-16">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar Filters */}
        <div className="w-full md:w-1/4 space-y-6">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-100 sticky top-24">
            <h2 className="text-xl font-semibold mb-6">Filters</h2>

            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Location or Keywords</label>
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                  <Input
                    placeholder="E.g., Paris, Food..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-9"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Category</label>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Categories" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    <SelectItem value="History">History</SelectItem>
                    <SelectItem value="Food">Food</SelectItem>
                    <SelectItem value="Adventure">Adventure</SelectItem>
                    <SelectItem value="Art">Art</SelectItem>
                    <SelectItem value="Nightlife">Nightlife</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium flex justify-between">
                  <span>Max Price ($)</span>
                  <span>${maxPrice}</span>
                </label>
                <Slider
                  value={[maxPrice]}
                  onValueChange={(v) => setMaxPrice(v[0])}
                  max={2000}
                  step={10}
                  className="py-4"
                />
              </div>

              <Button onClick={handleSearch} className="w-full mt-6 bg-blue-600 hover:bg-blue-700">
                Apply Filters
              </Button>
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="w-full md:w-3/4">
          <h1 className="text-3xl font-bold mb-6">Explore the best tours</h1>

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            </div>
          ) : listings.length === 0 ? (
            <div className="text-center py-16 bg-slate-50 rounded-lg border border-dashed border-slate-200">
              <h3 className="text-lg font-medium text-slate-900 mb-2">No tours found</h3>
              <p className="text-slate-500">Try adjusting your filters to find more results.</p>
              <Button onClick={() => { setSearchTerm(''); setCategory('all'); setMaxPrice(1000); handleSearch(); }} variant="outline" className="mt-4">
                Clear Filters
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {listings.map((tour) => (
                <Card key={tour._id} className="overflow-hidden hover:shadow-md transition-all group border-slate-200">
                  <div className="relative h-48 bg-slate-100 overflow-hidden">
                    {tour.images && tour.images.length > 0 ? (
                      <Image
                        src={tour.images[0]}
                        alt={tour.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                        unoptimized
                      />
                    ) : (
                      <div className="w-full h-full bg-slate-200 flex items-center justify-center">
                        <span className="text-slate-400">No Image</span>
                      </div>
                    )}
                    <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded text-xs font-semibold text-slate-800 shadow-sm">
                      ${tour.price}
                    </div>
                  </div>
                  <CardHeader className="p-4 pb-0">
                    <div className="flex justify-between items-start mb-1">
                      <span className="text-xs text-blue-600 font-medium tracking-wider uppercase">{tour.category}</span>
                      <span className="flex items-center text-xs text-slate-500">
                        ⭐ {tour.rating || "New"}
                      </span>
                    </div>
                    <CardTitle className="line-clamp-1 text-lg">{tour.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 pt-2">
                    <div className="flex items-center text-sm text-slate-500 mb-2">
                      <MapPin className="h-3 w-3 mr-1" />
                      <span className="line-clamp-1">{tour.meetingPoint || tour.location?.city || 'Location unspecified'}</span>
                    </div>
                    <p className="line-clamp-2 text-sm text-slate-600 mt-2">
                      {tour.description}
                    </p>
                  </CardContent>
                  <CardFooter className="p-4 pt-0 border-t border-slate-50 mt-auto">
                    <Link href={`/tours/${tour._id}`} className="w-full">
                      <Button className="w-full mt-3 bg-slate-900 hover:bg-blue-600 transition-colors">
                        View Details
                      </Button>
                    </Link>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}


export default function ExplorePage() {
  return (
    <Suspense fallback={
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    }>
      <ExploreContent />
    </Suspense>
  );
}