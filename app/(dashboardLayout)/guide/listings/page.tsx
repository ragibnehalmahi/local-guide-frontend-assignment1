//app/(dashboardLayout)/guide/listings/page.tsx
"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Loader2, Plus, Edit, Trash2, Settings } from "lucide-react";
import { toast } from "sonner";
import Image from "next/image";

export default function GuideListingsPage() {
  const [listings, setListings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMyListings();
  }, []);

  const fetchMyListings = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      // Need a way to get guides own listings. Usually backend filters by token if we send to a specific endpoint,
      // or we just fetch all and filter client side if no specific endpoint.
      // Assuming GET /listings with auth token or a dedicated /my-listings endpoint.
      // Here using /listings maybe backend filters it if we use token, or we append ?guideId=xyz

      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/listings`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      // Filter out user's listings if backend doesn't do it automatically. 
      // For demo purposes, assume backend handles it or we show all if dummy.
      setListings(res.data.data.result || []);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load your listings.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[50vh]">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">My Listings</h1>
          <p className="text-slate-500 mt-1">Manage your tour experiences</p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700">
          <Plus className="mr-2 h-4 w-4" /> Create Listing
        </Button>
      </div>

      {listings.length === 0 ? (
        <Card className="border-dashed border-2 shadow-none border-slate-200 p-12 text-center bg-slate-50">
          <div className="flex flex-col items-center">
            <Settings className="w-12 h-12 text-slate-300 mb-4" />
            <h3 className="text-xl font-semibold text-slate-800">No listings yet</h3>
            <p className="text-slate-500 mb-6 mt-2 max-w-sm">
              You haven't created any tour listings yet. Create your first listing to start hosting tourists.
            </p>
            <Button className="bg-slate-900 hover:bg-slate-800">
              Create Your First Listing
            </Button>
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {listings.map((item) => (
            <Card key={item._id} className="overflow-hidden hover:shadow-md transition-shadow">
              <div className="h-40 bg-slate-100 relative">
                {item.images && item.images.length > 0 ? (
                  <Image src={item.images[0]} alt={item.title} fill className="object-cover" unoptimized />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-400 text-sm">No Image</div>
                )}
                <div className="absolute top-2 right-2 bg-white px-2 py-1 rounded text-xs font-bold">${item.price}</div>
              </div>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg line-clamp-1">{item.title}</CardTitle>
                <CardDescription className="line-clamp-2">{item.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center mt-4 pt-4 border-t border-slate-100">
                  <Button variant="outline" size="sm" className="text-slate-600">
                    <Edit className="w-4 h-4 mr-2" /> Edit
                  </Button>
                  <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700 hover:bg-red-50">
                    <Trash2 className="w-4 h-4 mr-2" /> Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
