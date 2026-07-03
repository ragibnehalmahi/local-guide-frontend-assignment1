// src/app/(dashboardLayout)/(guideDashboardLayout)/dashboard/reviews/page.tsx
import GuideReviews from "@/components/modules/Guide/GuideReviews";  
import { getReviewsForGuide } from "@/services/reviews/review.service";  
import { getMyProfile } from "@/services/user/user.service";  

export default async function GuideReviewsPage() {
  // Get guide's own profile to get guideId
  const profileResponse = await getMyProfile();
  const guideId = profileResponse.data?._id;
  
  let reviews = [];

  if (guideId) {
    const reviewsResponse = await getReviewsForGuide(guideId);
    reviews = reviewsResponse?.data || [];
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">My Reviews</h1>
        <p className="text-muted-foreground mt-2">
          Feedback from tourists who experienced your tours
        </p>
      </div>

      <GuideReviews reviews={reviews} />
    </div>
  );
}