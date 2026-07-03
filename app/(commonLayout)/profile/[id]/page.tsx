//local-guide-frontend/my-app/app/(commonLayout)/profile/[id]/page.tsx
"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  Loader2,
  MapPin,
  Star,
  Globe,
  Clock,
  Users,
  Award,
  Mail,
  Calendar,
  MessageSquare,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";

interface UserProfile {
  _id: string;
  name: string;
  email: string;
  role: string;
  profilePicture?: string;
  bio?: string;
  languages?: string[];
  expertise?: string[];
  dailyRate?: number;
  rating?: number;
  totalReviews?: number;
  yearsOfExperience?: number;
  travelPreferences?: string[];
  location?: {
    city?: string;
    country?: string;
  };
  createdAt?: string;
}

interface Review {
  _id: string;
  rating: number;
  comment: string;
  tourist: { _id: string; name: string; profilePicture?: string };
  createdAt: string;
}

interface Listing {
  _id: string;
  title: string;
  description: string;
  price: number;
  category: string;
  images: string[];
  location?: { city?: string; country?: string };
  durationHours?: number;
  maxGroupSize?: number;
  rating?: number;
}

export default function PublicProfilePage() {
  const params = useParams();
  const { id } = params;

  const [user, setUser] = useState<UserProfile | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        // Fetch user profile
        const userRes = await axios.get(`${API_BASE_URL}/users/${id}`);
        const userData = userRes.data.data;
        setUser(userData);

        // If user is a guide, fetch their listings and reviews
        if (userData?.role === "guide") {
          const [listingsRes, reviewsRes] = await Promise.all([
            axios.get(`${API_BASE_URL}/listing?guide=${id}`).catch(() => ({ data: { data: [] } })),
            axios.get(`${API_BASE_URL}/review/${id}`).catch(() => ({ data: { data: [] } })),
          ]);

          setListings(
            Array.isArray(listingsRes.data?.data?.result)
              ? listingsRes.data.data.result
              : Array.isArray(listingsRes.data?.data)
                ? listingsRes.data.data
                : []
          );
          setReviews(Array.isArray(reviewsRes.data?.data) ? reviewsRes.data.data : []);
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchProfileData();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[70vh]">
        <Loader2 className="h-10 w-10 animate-spin text-blue-600" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="container mx-auto py-20 text-center">
        <h2 className="text-2xl font-semibold">User not found</h2>
        <p className="text-slate-500 mt-2">The profile you&apos;re looking for doesn&apos;t exist.</p>
      </div>
    );
  }

  const isGuide = user.role === "guide";
  const memberSince = user.createdAt
    ? new Date(user.createdAt).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
    })
    : "Unknown";

  // Calculate rating distribution
  const ratingDistribution = [5, 4, 3, 2, 1].map((star) => ({
    star,
    count: reviews.filter((r) => Math.round(r.rating) === star).length,
    percentage: reviews.length > 0
      ? (reviews.filter((r) => Math.round(r.rating) === star).length / reviews.length) * 100
      : 0,
  }));

  return (
    <div className="container mx-auto py-10 px-4 md:px-6 mt-16 max-w-6xl">
      {/* Profile Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl p-8 md:p-12 text-white mb-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10" />
        <div className="relative z-10 flex flex-col md:flex-row items-center gap-6">
          <Avatar className="h-28 w-28 border-4 border-white/30 shadow-xl">
            <AvatarImage src={user.profilePicture} alt={user.name} />
            <AvatarFallback className="text-3xl bg-white/20 text-white">
              {user.name?.charAt(0)?.toUpperCase()}
            </AvatarFallback>
          </Avatar>

          <div className="text-center md:text-left flex-1">
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mb-2">
              <h1 className="text-3xl font-bold">{user.name}</h1>
              <Badge className="bg-white/20 text-white border-white/30 hover:bg-white/30">
                {isGuide ? "Local Guide" : "Traveler"}
              </Badge>
            </div>

            {user.bio && (
              <p className="text-white/80 max-w-xl mt-2 leading-relaxed">{user.bio}</p>
            )}

            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 mt-4 text-sm text-white/70">
              {user.location?.city && (
                <span className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  {user.location.city}
                  {user.location.country ? `, ${user.location.country}` : ""}
                </span>
              )}
              <span className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                Member since {memberSince}
              </span>
              {isGuide && user.rating !== undefined && user.rating > 0 && (
                <span className="flex items-center gap-1">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  {user.rating.toFixed(1)} ({user.totalReviews || 0} reviews)
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick Stats (Guide) */}
          {isGuide && (
            <Card className="border-slate-200">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Guide Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2 text-sm text-slate-600">
                    <Award className="w-4 h-4 text-blue-600" />
                    Tours Offered
                  </span>
                  <span className="font-semibold">{listings.length}</span>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2 text-sm text-slate-600">
                    <Star className="w-4 h-4 text-yellow-500" />
                    Rating
                  </span>
                  <span className="font-semibold">
                    {user.rating ? user.rating.toFixed(1) : "New"} / 5
                  </span>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2 text-sm text-slate-600">
                    <MessageSquare className="w-4 h-4 text-green-600" />
                    Reviews
                  </span>
                  <span className="font-semibold">{user.totalReviews || 0}</span>
                </div>
                {user.yearsOfExperience !== undefined && user.yearsOfExperience > 0 && (
                  <>
                    <Separator />
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-2 text-sm text-slate-600">
                        <Clock className="w-4 h-4 text-purple-600" />
                        Experience
                      </span>
                      <span className="font-semibold">{user.yearsOfExperience} years</span>
                    </div>
                  </>
                )}
                {user.dailyRate !== undefined && user.dailyRate > 0 && (
                  <>
                    <Separator />
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-600">Daily Rate</span>
                      <span className="font-semibold text-blue-600">${user.dailyRate}/day</span>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          )}

          {/* Languages */}
          {user.languages && user.languages.length > 0 && (
            <Card className="border-slate-200">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Globe className="w-5 h-5 text-blue-600" />
                  Languages
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {user.languages.map((lang) => (
                    <Badge key={lang} variant="secondary" className="px-3 py-1">
                      {lang}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Expertise (Guide) */}
          {isGuide && user.expertise && user.expertise.length > 0 && (
            <Card className="border-slate-200">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Award className="w-5 h-5 text-blue-600" />
                  Expertise
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {user.expertise.map((exp) => (
                    <Badge key={exp} className="bg-blue-50 text-blue-700 hover:bg-blue-100 border-none px-3 py-1">
                      {exp}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Travel Preferences (Tourist) */}
          {!isGuide && user.travelPreferences && user.travelPreferences.length > 0 && (
            <Card className="border-slate-200">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Travel Preferences</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {user.travelPreferences.map((pref) => (
                    <Badge key={pref} variant="secondary" className="px-3 py-1">
                      {pref}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Contact */}
          <Card className="border-slate-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Contact</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2 text-sm text-slate-600">
                <Mail className="w-4 h-4" />
                <span>{user.email}</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-2">
          {isGuide ? (
            <Tabs defaultValue="listings" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="listings">
                  Active Listings ({listings.length})
                </TabsTrigger>
                <TabsTrigger value="reviews">
                  Reviews ({reviews.length})
                </TabsTrigger>
              </TabsList>

              {/* Listings Tab */}
              <TabsContent value="listings">
                {listings.length === 0 ? (
                  <div className="text-center py-16 bg-slate-50 rounded-lg border border-dashed border-slate-200">
                    <h3 className="text-lg font-medium text-slate-900 mb-2">No active listings</h3>
                    <p className="text-slate-500">This guide hasn&apos;t created any tours yet.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {listings.map((listing) => (
                      <Card key={listing._id} className="overflow-hidden hover:shadow-md transition-all group border-slate-200">
                        <div className="relative h-44 bg-slate-100 overflow-hidden">
                          {listing.images && listing.images.length > 0 ? (
                            <Image
                              src={listing.images[0]}
                              alt={listing.title}
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
                            ${listing.price}
                          </div>
                        </div>
                        <CardHeader className="p-4 pb-0">
                          <div className="flex justify-between items-start mb-1">
                            <Badge variant="secondary" className="text-xs">
                              {listing.category}
                            </Badge>
                            {listing.durationHours && (
                              <span className="flex items-center text-xs text-slate-500">
                                <Clock className="w-3 h-3 mr-1" />
                                {listing.durationHours}h
                              </span>
                            )}
                          </div>
                          <CardTitle className="line-clamp-1 text-lg">{listing.title}</CardTitle>
                        </CardHeader>
                        <CardContent className="p-4 pt-2">
                          <p className="line-clamp-2 text-sm text-slate-600">{listing.description}</p>
                          {listing.location?.city && (
                            <div className="flex items-center text-sm text-slate-500 mt-2">
                              <MapPin className="h-3 w-3 mr-1" />
                              <span>
                                {listing.location.city}
                                {listing.location.country ? `, ${listing.location.country}` : ""}
                              </span>
                            </div>
                          )}
                        </CardContent>
                        <CardFooter className="p-4 pt-0">
                          <Link href={`/tours/${listing._id}`} className="w-full">
                            <Button className="w-full bg-slate-900 hover:bg-blue-600 transition-colors">
                              View Details
                            </Button>
                          </Link>
                        </CardFooter>
                      </Card>
                    ))}
                  </div>
                )}
              </TabsContent>

              {/* Reviews Tab */}
              <TabsContent value="reviews">
                {reviews.length > 0 && (
                  <Card className="mb-6 border-slate-200">
                    <CardContent className="p-6">
                      <div className="flex flex-col md:flex-row items-start gap-8">
                        <div className="text-center">
                          <div className="text-5xl font-bold text-slate-900">
                            {user.rating?.toFixed(1) || "0.0"}
                          </div>
                          <div className="flex items-center justify-center mt-2">
                            {[1, 2, 3, 4, 5].map((s) => (
                              <Star
                                key={s}
                                className={`w-5 h-5 ${s <= Math.round(user.rating || 0)
                                    ? "fill-yellow-400 text-yellow-400"
                                    : "text-slate-200"
                                  }`}
                              />
                            ))}
                          </div>
                          <p className="text-sm text-slate-500 mt-1">
                            {reviews.length} review{reviews.length !== 1 ? "s" : ""}
                          </p>
                        </div>
                        <div className="flex-1 space-y-2 w-full">
                          {ratingDistribution.map(({ star, count, percentage }) => (
                            <div key={star} className="flex items-center gap-3">
                              <span className="text-sm text-slate-600 w-6">{star}★</span>
                              <Progress value={percentage} className="flex-1 h-2" />
                              <span className="text-sm text-slate-500 w-8">{count}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {reviews.length === 0 ? (
                  <div className="text-center py-16 bg-slate-50 rounded-lg border border-dashed border-slate-200">
                    <h3 className="text-lg font-medium text-slate-900 mb-2">No reviews yet</h3>
                    <p className="text-slate-500">This guide hasn&apos;t received any reviews yet.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {reviews.map((review) => (
                      <Card key={review._id} className="border-slate-200">
                        <CardContent className="p-5">
                          <div className="flex items-start gap-4">
                            <Avatar className="h-10 w-10">
                              <AvatarImage src={review.tourist?.profilePicture} />
                              <AvatarFallback className="bg-blue-100 text-blue-700 text-sm">
                                {review.tourist?.name?.charAt(0)?.toUpperCase() || "?"}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                              <div className="flex items-center justify-between">
                                <h4 className="font-semibold text-slate-900">
                                  {review.tourist?.name || "Anonymous"}
                                </h4>
                                <span className="text-xs text-slate-400">
                                  {new Date(review.createdAt).toLocaleDateString("en-US", {
                                    year: "numeric",
                                    month: "short",
                                    day: "numeric",
                                  })}
                                </span>
                              </div>
                              <div className="flex items-center mt-1 mb-2">
                                {[1, 2, 3, 4, 5].map((s) => (
                                  <Star
                                    key={s}
                                    className={`w-4 h-4 ${s <= review.rating
                                        ? "fill-yellow-400 text-yellow-400"
                                        : "text-slate-200"
                                      }`}
                                  />
                                ))}
                              </div>
                              <p className="text-slate-600 text-sm leading-relaxed">
                                {review.comment}
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </TabsContent>
            </Tabs>
          ) : (
            /* Tourist Profile - Basic Info */
            <Card className="border-slate-200">
              <CardHeader>
                <CardTitle>About {user.name}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {user.bio ? (
                  <p className="text-slate-600 leading-relaxed">{user.bio}</p>
                ) : (
                  <p className="text-slate-400 italic">This traveler hasn&apos;t added a bio yet.</p>
                )}

                <Separator />

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-sm font-medium text-slate-500 mb-1">Role</h4>
                    <p className="font-medium capitalize">{user.role}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-slate-500 mb-1">Member Since</h4>
                    <p className="font-medium">{memberSince}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
