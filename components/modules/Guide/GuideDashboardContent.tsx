"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Calendar,
  MapPin,
  Users,
  DollarSign,
  Star,
  Clock,
  Eye,
  TrendingUp,
  AlertCircle,
  PlusCircle,
} from "lucide-react";
import Link from "next/link";
import { getGuideDashboardMetaData } from "@/services/guide/dashboard.service";
import { getBookingsForGuide } from "@/services/booking/booking.service";
import { getMyListings } from "@/services/listing/listing.service";
import { IBooking } from "@/types/booking.interface";
import { IListing } from "@/types/listing.interface";
import { toast } from "sonner";
import { DashboardSkeleton } from "@/components/shared/DashboardSkeleton";

interface DashboardStats {
  totalListings: number;
  totalBookings: number;
  totalEarnings: number;
  averageRating: number;
  pendingBookings: number;
  upcomingTours: number;
}

export default function GuideDashboardContent() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<DashboardStats>({
    totalListings: 0,
    totalBookings: 0,
    totalEarnings: 0,
    averageRating: 0,
    pendingBookings: 0,
    upcomingTours: 0,
  });
  const [recentBookings, setRecentBookings] = useState<IBooking[]>([]);
  const [recentListings, setRecentListings] = useState<IListing[]>([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [dashboardData, bookingsData, listingsData] = await Promise.all([
        getGuideDashboardMetaData(),
        getBookingsForGuide("?limit=5&sortBy=createdAt&sortOrder=desc"),
        getMyListings("?limit=3&sortBy=createdAt&sortOrder=desc"),
      ]);

      if (dashboardData.success) setStats(dashboardData.data);
      if (bookingsData.success) setRecentBookings(bookingsData.data);
      if (listingsData.success) setRecentListings(listingsData.data);
    } catch (error) {
      toast.error("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      PENDING: "bg-orange-100 text-orange-700 border-orange-200",
      CONFIRMED: "bg-green-100 text-green-700 border-green-200",
      COMPLETED: "bg-blue-100 text-blue-700 border-blue-200",
      CANCELLED: "bg-red-100 text-red-700 border-red-200",
    };
    return colors[status] || "bg-gray-100 text-gray-700";
  };

  if (loading) return <DashboardSkeleton />;

  return (
    <div className="space-y-8">
      {/* 1. Welcome & Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Guide Dashboard</h2>
          <p className="text-muted-foreground">Manage your tours, bookings, and track your performance.</p>
        </div>
        <div className="flex gap-3">
          <Button onClick={fetchDashboardData} variant="outline" size="sm" className="gap-2">
            <TrendingUp className="h-4 w-4" /> Refresh
          </Button>
          <Button size="sm" className="gap-2" asChild>
            <Link href="/guide/dashboard/listings/create">
              <PlusCircle className="h-4 w-4" /> New Tour
            </Link>
          </Button>
        </div>
      </div>

      {/* 2. Stats Cards Grid (Now 5 Columns) */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <StatCard title="Total Listings" value={stats.totalListings} icon={<MapPin className="text-blue-600" />} bgColor="bg-blue-50" link="/guide/dashboard/listings" />
        <StatCard title="Total Bookings" value={stats.totalBookings} icon={<Calendar className="text-purple-600" />} bgColor="bg-purple-50" link="/guide/dashboard/bookings" subtitle={`${stats.upcomingTours} upcoming`} />
        <StatCard title="Total Earnings" value={`$${stats.totalEarnings.toFixed(0)}`} icon={<DollarSign className="text-green-600" />} bgColor="bg-green-50" subtitle="All time income" />
        <StatCard title="Avg Rating" value={stats.averageRating.toFixed(1)} icon={<Star className="text-yellow-600 fill-yellow-600" />} bgColor="bg-yellow-50" link="/guide/dashboard/reviews" />
        <StatCard title="Pending Actions" value={stats.pendingBookings} icon={<Clock className="text-orange-600" />} bgColor="bg-orange-50" highlight={stats.pendingBookings > 0} link="/guide/dashboard/bookings?status=PENDING" />
      </div>

      {/* 3. Main Content: Bookings & Listings */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Recent Bookings (Left side - 2/3 width) */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg">Recent Bookings</CardTitle>
            <Button variant="ghost" size="sm" asChild><Link href="/guide/dashboard/bookings">View All</Link></Button>
          </CardHeader>
          <CardContent>
            {recentBookings.length === 0 ? (
              <EmptyState icon={<Calendar className="h-8 w-8" />} text="No bookings found" />
            ) : (
              <div className="divide-y">
                {recentBookings.map((booking) => (
                  <div key={booking._id} className="py-4 flex items-center justify-between group">
                    <div className="flex items-center gap-4">
                      <div className="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-600">
                        {booking.tourist?.name?.[0] || "T"}
                      </div>
                      <div>
                        <p className="font-semibold text-sm">{booking.tourist?.name || "Guest Tourist"}</p>
                        <p className="text-xs text-muted-foreground">{new Date(booking.date).toLocaleDateString()} • ${booking.totalPrice}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge variant="outline" className={getStatusColor(booking.status)}>{booking.status}</Badge>
                      <Button size="sm" variant="ghost" asChild><Link href={`/guide/dashboard/bookings/${booking._id}`}><Eye className="h-4 w-4" /></Link></Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Listings (Right side - 1/3 width) */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">My Tours</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentListings.length === 0 ? (
              <EmptyState icon={<MapPin className="h-8 w-8" />} text="No tours created" />
            ) : (
              recentListings.map((listing) => (
                <div key={listing.id} className="flex gap-3 p-2 border rounded-lg group hover:border-primary/50 transition-colors">
                  <div className="h-14 w-14 rounded-md overflow-hidden bg-muted flex-shrink-0">
                    {listing.images?.[0] ? (
                      <img src={listing.images[0]} alt="" className="h-full w-full object-cover" />
                    ) : (
                      <MapPin className="h-full w-full p-3 text-muted-foreground" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">{listing.title}</p>
                    <p className="text-xs text-muted-foreground">${listing.price} • {listing.location?.city}</p>
                    <Link href={`/guide/dashboard/listings/edit/${listing.id}`} className="text-[10px] text-primary hover:underline mt-1 block">Edit Details</Link>
                  </div>
                </div>
              ))
            )}
            <Button variant="outline" className="w-full text-xs" asChild>
              <Link href="/guide/dashboard/listings">View All Tours</Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* 4. Pending Action Alert */}
      {stats.pendingBookings > 0 && (
        <div className="bg-orange-50 border border-orange-200 rounded-xl p-4 flex items-center gap-4 animate-in fade-in slide-in-from-bottom-4">
          <div className="h-10 w-10 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
            <AlertCircle className="h-5 w-5 text-orange-600" />
          </div>
          <div className="flex-1">
            <h4 className="font-bold text-orange-900 text-sm">Action Required</h4>
            <p className="text-xs text-orange-700">You have {stats.pendingBookings} new booking requests waiting for your approval.</p>
          </div>
          <Button size="sm" className="bg-orange-600 hover:bg-orange-700 text-white" asChild>
            <Link href="/guide/dashboard/bookings?status=PENDING">Review Now</Link>
          </Button>
        </div>
      )}
    </div>
  );
}

// --- Helper Components ---

function StatCard({ title, value, icon, bgColor, subtitle, link, highlight = false }: any) {
  const Content = (
    <Card className={`transition-all hover:shadow-md ${highlight ? "border-orange-200 shadow-sm ring-1 ring-orange-100" : ""}`}>
      <CardContent className="pt-6">
        <div className="flex items-center justify-between">
          <div className={`h-10 w-10 ${bgColor} rounded-lg flex items-center justify-center`}>{icon}</div>
          {link && <Eye className="h-4 w-4 text-muted-foreground/50" />}
        </div>
        <div className="mt-4">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <h3 className="text-2xl font-bold">{value}</h3>
          {subtitle && <p className="text-[10px] text-muted-foreground mt-1 uppercase tracking-wider">{subtitle}</p>}
        </div>
      </CardContent>
    </Card>
  );

  return link ? <Link href={link}>{Content}</Link> : Content;
}

function EmptyState({ icon, text }: any) {
  return (
    <div className="text-center py-10">
      <div className="flex justify-center text-muted-foreground/30 mb-3">{icon}</div>
      <p className="text-sm text-muted-foreground">{text}</p>
    </div>
  );
}
