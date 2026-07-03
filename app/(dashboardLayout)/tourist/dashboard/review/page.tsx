// app/tourist/dashboard/reviews/page.tsx
import { getTouristReviews, getCompletedBookingsForReview } from  "@/services/reviews/review.service";
import TouristReviews from "@/components/modules/Tourist/TouristReviews";

export default async function ReviewsPage() {
  // Get tourist's past reviews
  const reviewsResponse = await getTouristReviews();
  const reviews = reviewsResponse.data || [];

  // Get completed bookings without reviews
  const bookingsResponse = await getCompletedBookingsForReview();
  const completedBookings = bookingsResponse.data || [];

  return (
    <div className="container mx-auto px-4 py-8">
      <TouristReviews 
        reviews={reviews}
        completedBookings={completedBookings}
      />
    </div>
  );
}


 