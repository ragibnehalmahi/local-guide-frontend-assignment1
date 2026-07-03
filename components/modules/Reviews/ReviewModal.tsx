// components/modules/Reviews/ReviewModal.tsx
"use client";

import { useState } from "react";
import { Star, Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { createReview } from "@/services/reviews/review.service";

interface ReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  bookingId: string;
  guideName?: string;
  onSuccess?: () => void;
}

export default function ReviewModal({
  isOpen,
  onClose,
  bookingId,
  guideName,
  onSuccess,
}: ReviewModalProps) {
  const [rating, setRating] = useState(5);
  const [hover, setHover] = useState(0);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (comment.length < 5) {
      toast.error("Review comment must be at least 5 characters long.");
      return;
    }

    setLoading(true);
    try {
      const result = await createReview({
        bookingId,
        rating,
        comment,
      });

      if (result.success) {
        toast.success("Thank you! Your review has been submitted.");
        setSubmitted(true);
        if (onSuccess) onSuccess();
        onClose();
      } else {
        // 🚨 যদি ব্যাকএন্ড 400 “already submitted” মেসেজ দেয়
        if (result.message?.toLowerCase().includes("already submitted")) {
          toast.error("You have already reviewed this booking.");
          setSubmitted(true);
          if (onSuccess) onSuccess(); // parent-এ জানান
          onClose();
        } else {
          toast.error(result.message || "Failed to submit review.");
        }
      }
    } catch (error: any) {
      console.error("Review Submission Error:", error);
      // নেটওয়ার্ক বা অন্য কোনো এরর
      toast.error(error.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Write a Review</DialogTitle>
          <DialogDescription>
            How was your experience {guideName ? `with ${guideName}` : "on this tour"}? Your feedback helps the community.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 pt-4">
          <div className="flex flex-col items-center justify-center space-y-3">
            <Label className="text-sm font-medium text-slate-500 uppercase tracking-wider">
              Tap to rate
            </Label>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  className="transition-transform active:scale-90 hover:scale-110"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHover(star)}
                  onMouseLeave={() => setHover(0)}
                >
                  <Star
                    className={`w-10 h-10 transition-colors ${star <= (hover || rating)
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-slate-200 fill-slate-50"
                      }`}
                  />
                </button>
              ))}
            </div>
            <p className="text-sm font-bold text-slate-700">
              {rating === 1 && "Poor"}
              {rating === 2 && "Fair"}
              {rating === 3 && "Good"}
              {rating === 4 && "Very Good"}
              {rating === 5 && "Excellent!"}
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="comment">Your Experience</Label>
            <Textarea
              id="comment"
              placeholder="Tell us about the guide, the itinerary, and the hidden gems you discovered..."
              className="min-h-[120px] resize-none"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              required
              disabled={submitted}
            />
          </div>

          <DialogFooter className="pt-4 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={loading || submitted}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading || submitted}
              className="bg-blue-600 hover:bg-blue-700 font-semibold px-8"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Submitting...
                </>
              ) : submitted ? (
                "Already Reviewed"
              ) : (
                "Submit Review"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}