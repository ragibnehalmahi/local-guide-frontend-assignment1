
//local-guide-frontend/my-app/types/tourist.interface.ts  
export interface ITouristDashboardMeta {
  totalBookings: number;
  totalSpent: number;
  upcomingTours: number;
  completedTours: number;
  wishlistCount: number;
  recentBookings: any[];
}
export interface ITourist {
  id: string;
  status: 'active' | 'blocked';
  createdAt: string;

}