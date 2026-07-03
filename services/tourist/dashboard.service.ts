// src/services/tourist/dashboard.service.ts
//local-guide-frontend/my-app/services/tourist/dashboard.service.ts 
"use server"
import { serverFetch } from "@/lib/server-fetch";

export async function getTouristDashboardMetaData() {
  try {
    const response = await serverFetch.get("/tourist/dashboard/stats", {
      next: {
        tags: ["tourist-dashboard"],
        revalidate: 30,
      },
    });


    if (!response.ok) {
      const errorText = await response.text();
      console.error(`API Error (${response.status}):`, errorText);
      throw new Error("Failed to fetch dashboard data from server");
    }


    const result = await response.json();


    return {
      success: true,
      data: result.data,
    };

  } catch (error: any) {
    console.error("Error fetching tourist dashboard data:", error.message);


    return {
      success: false,
      data: {
        totalBookings: 0,
        upcomingTours: 0,
        completedTours: 0,
        totalSpent: 0,
        wishlistCount: 0,
        averageGuideRating: 0,
        recentBookings: []
      },
      message: error.message || "An unexpected error occurred",
    };
  }
}