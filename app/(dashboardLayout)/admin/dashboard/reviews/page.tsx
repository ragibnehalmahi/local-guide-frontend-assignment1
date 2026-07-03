// src/app/(dashboardLayout)/(adminDashboardLayout)/dashboard/reviews/page.tsx
import AdminReviews from "@/components/modules/Admin/AdminReviews";
import { getAllReviews } from "@/services/admin/admin.service";
import { IReview } from "@/types/review.interface";

export default async function AdminReviewsPage() {
  const response = await getAllReviews();
  const reviews: IReview[] = response?.data || [];

  return (
    <div className="space-y-6">
      <AdminReviews initialReviews={reviews} />
    </div>
  );
}