//components/modules/Guide/GuideReviews.tsx

"use client";

import { Star } from "lucide-react";

export default function GuideReviews({ reviews }: { reviews: any[] }) {
  return (
    <div className="space-y-4">
      {reviews.map((review) => {

        const touristName = review.tourist?.name || "Guest User";
        const tourTitle = review.booking?.tourTitle || review.tourTitle || "Tour Experience";

        return (
          <div key={review._id} className="bg-white border rounded-xl p-6 space-y-3">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">

                <div className="h-10 w-10 bg-indigo-100 rounded-full flex items-center justify-center font-bold text-indigo-600">
                  {touristName[0].toUpperCase()}
                </div>
                <div>
                  <p className="font-bold text-sm">{touristName}</p>
                  <p className="text-xs text-slate-400">Review for: {tourTitle}</p>
                </div>
              </div>
              <div className="flex gap-0.5 text-yellow-400">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={14}
                    fill={i < review.rating ? "currentColor" : "none"}
                    strokeWidth={i < review.rating ? 0 : 2}
                  />
                ))}
              </div>
            </div>
            <p className="text-slate-600 text-sm leading-relaxed bg-slate-50 p-4 rounded-lg italic">
              "{review.comment}"
            </p>
          </div>
        );
      })}

      {reviews.length === 0 && (
        <div className="text-center py-10 text-slate-400 border border-dashed rounded-xl">
          No reviews yet.
        </div>
      )}
    </div>
  );
}