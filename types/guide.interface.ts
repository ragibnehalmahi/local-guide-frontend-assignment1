// types/guide.interface.ts
export interface IGuideDashboardMeta {
  totalListings: number;
  totalBookings: number;
  totalEarnings: number;
  averageRating: number;
  pendingBookings: number;
  upcomingTours: number;
  recentReviews?: any[];
  recentBookings?: any[];
}
export interface IGuide {
  id: string;
  name: string;
  status: 'active' | 'blocked' | 'pending';
  listingCount?: number;
  totalEarnings?: number;
  rating?: number;
  createdAt: string;
  isVerified?: boolean;
  hasDocuments?: boolean;
  
}