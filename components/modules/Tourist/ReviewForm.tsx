// src/components/modules/Tourist/ReviewForm.tsx
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Star } from "lucide-react";
import { createReview } from "@/services/reviews/review.service";
import { toast } from "sonner";

interface ReviewFormProps {
  bookingId: string;
  guideId: string;
  onSuccess?: () => void;
  onCancel?: () => void;
}

const ReviewForm = ({ bookingId, guideId, onSuccess, onCancel }: ReviewFormProps) => {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!comment.trim()) {
      toast.error("Please write a review comment");
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await createReview({
        bookingId,
        // guideId,
        rating,
        comment: comment.trim()
      });

      if (result.success) {
        toast.success("Thank you for your review!");
        if (onSuccess) {
          onSuccess();
        }
      } else {
        toast.error(result.message || "Failed to submit review");
      }
    } catch (error: any) {
      console.error("Error submitting review:", error);
      toast.error(error.message || "An error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Write a Review</CardTitle>
        <p className="text-sm text-muted-foreground">
          Share your experience with this guide
        </p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Rating */}
          <div className="space-y-2">
            <p className="text-sm font-medium">Your Rating</p>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  className="focus:outline-none"
                >
                  <Star
                    className={`h-8 w-8 ${
                      star <= rating
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-gray-300"
                    }`}
                  />
                </button>
              ))}
            </div>
            <p className="text-xs text-muted-foreground">
              {rating === 5 ? "Excellent" : 
               rating === 4 ? "Good" : 
               rating === 3 ? "Average" : 
               rating === 2 ? "Poor" : "Very Poor"}
            </p>
          </div>

          {/* Comment */}
          <div className="space-y-2">
            <p className="text-sm font-medium">Your Review *</p>
            <Textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="What did you like about the tour? What could be improved?"
              rows={4}
              className="resize-none"
              required
            />
            <p className="text-xs text-muted-foreground">
              Your review will help other tourists make better decisions
            </p>
          </div>

          {/* Submit Buttons */}
          <div className="flex gap-3 pt-2">
            {onCancel && (
              <Button
                type="button"
                variant="outline"
                onClick={onCancel}
                disabled={isSubmitting}
                className="flex-1"
              >
                Cancel
              </Button>
            )}
            <Button
              type="submit"
              disabled={isSubmitting}
              className="flex-1"
            >
              {isSubmitting ? "Submitting..." : "Submit Review"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default ReviewForm;