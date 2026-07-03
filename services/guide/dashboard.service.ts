// services/guide/dashboard.service.ts  

"use server"
import { serverFetch } from "@/lib/server-fetch";

export async function getGuideDashboardMetaData() {
  try {

    const response = await serverFetch.get("/meta", {
      cache: "no-store",
    });


    if (!response.ok) {

      const errorText = await response.text();
      console.error(`API Error (${response.status}):`, errorText);
      throw new Error("Failed to fetch guide dashboard data from server");
    }


    const result = await response.json();


    return {
      success: true,
      data: result.data,
    };

  } catch (error: any) {
    console.error("Error fetching guide dashboard data:", error.message);


    return {
      success: false,
      data: {
        totalListings: 0,
        totalBookings: 0,
        totalEarnings: 0,
        averageRating: 0,
        pendingBookings: 0,
        upcomingTours: 0,
        recentBookings: []
      },
      message: error.message || "An unexpected error occurred",
    };
  }
}







