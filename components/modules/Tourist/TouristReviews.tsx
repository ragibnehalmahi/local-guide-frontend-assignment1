// components/modules/Tourist/TouristReviews.tsx
"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Star, Calendar, User, MessageSquare, Clock, CheckCircle, Plus } from "lucide-react";
import { IReview, ICompletedBooking } from "@/types/review.interface";
import { createReview } from "@/services/reviews/review.service";
import { toast } from "sonner";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface TouristReviewsProps {
  reviews: IReview[];
  completedBookings: ICompletedBooking[];
}

export default function TouristReviews({ reviews, completedBookings }: TouristReviewsProps) {
  const [selectedBookingId, setSelectedBookingId] = useState<string | null>(null);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState<'pending' | 'past'>('pending');

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Star rating component
  const StarRating = ({
    value,
    onChange,
    readonly = false
  }: {
    value: number;
    onChange?: (rating: number) => void;
    readonly?: boolean;
  }) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => !readonly && onChange && onChange(star)}
            className={`text-2xl ${star <= value ? 'text-yellow-500' : 'text-gray-300'} ${!readonly ? 'cursor-pointer hover:scale-110 transition' : ''}`}
            disabled={readonly || !onChange}
          >
            ★
          </button>
        ))}
      </div>
    );
  };

  // Handle review submission
  const handleSubmitReview = async () => {
    if (!selectedBookingId) return;

    if (!comment.trim()) {
      toast.error("Please write a review comment");
      return;
    }

    if (rating < 1 || rating > 5) {
      toast.error("Please select a rating between 1-5");
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await createReview({
        bookingId: selectedBookingId,
        rating,
        comment
      });

      if (result.success) {
        toast.success("Review submitted successfully!");
        // Reset form
        setComment("");
        setRating(5);
        setSelectedBookingId(null);
        // Refresh page
        window.location.reload();
      } else {
        toast.error(result.message || "Failed to submit review");
      }
    } catch (error: any) {
      toast.error(error.message || "An error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">My Reviews</h1>
        <p className="text-muted-foreground mt-2">
          Review your completed tours and view past reviews
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Pending Reviews
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completedBookings.length}</div>
            <p className="text-xs text-muted-foreground">
              Tours waiting for your review
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Past Reviews
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{reviews.length}</div>
            <p className="text-xs text-muted-foreground">
              Reviews you've submitted
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Average Rating
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold flex items-center gap-2">
              {reviews.length > 0
                ? (reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length).toFixed(1)
                : "0.0"
              }
              <Star className="h-5 w-5 text-yellow-500" />
            </div>
            <p className="text-xs text-muted-foreground">
              Your average rating
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <div className="flex border-b">
        <button
          onClick={() => setActiveTab('pending')}
          className={`px-4 py-2 font-medium ${activeTab === 'pending' ? 'border-b-2 border-primary text-primary' : 'text-muted-foreground'}`}
        >
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            Pending Reviews
            {completedBookings.length > 0 && (
              <Badge variant="secondary" className="ml-2">
                {completedBookings.length}
              </Badge>
            )}
          </div>
        </button>
        <button
          onClick={() => setActiveTab('past')}
          className={`px-4 py-2 font-medium ${activeTab === 'past' ? 'border-b-2 border-primary text-primary' : 'text-muted-foreground'}`}
        >
          <div className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4" />
            Past Reviews
            {reviews.length > 0 && (
              <Badge variant="secondary" className="ml-2">
                {reviews.length}
              </Badge>
            )}
          </div>
        </button>
      </div>

      {/* Pending Reviews Tab */}
      {activeTab === 'pending' && (
        <div className="space-y-4">
          {completedBookings.length === 0 ? (
            <Card>
              <CardContent className="py-10 text-center">
                <CheckCircle className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold">No Pending Reviews</h3>
                <p className="text-muted-foreground">
                  You don't have any completed tours to review yet.
                </p>
              </CardContent>
            </Card>
          ) : (
            completedBookings.map((booking) => (
              <Card key={booking._id} className="overflow-hidden">
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row md:items-start gap-4">
                    {/* Booking Info */}
                    <div className="flex-1 space-y-3">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-semibold text-lg">{booking.listing?.title || "Tour"}</h3>
                          <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              {formatDate(booking.bookingDate)}
                            </span>
                            <span className="flex items-center gap-1">
                              <User className="h-3 w-3" />
                              Guide: {booking.guide?.name}
                            </span>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold">${booking.totalPrice}</div>
                          <Badge variant="outline" className="mt-1">
                            Completed
                          </Badge>
                        </div>
                      </div>

                      {/* Guide Info */}
                      <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                        <Avatar>
                          <AvatarImage src={booking.guide?.avatar} />
                          <AvatarFallback>
                            {booking.guide?.name?.charAt(0) || "G"}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h4 className="font-medium">{booking.guide?.name}</h4>
                          <p className="text-sm text-muted-foreground">Your tour guide</p>
                        </div>
                      </div>
                    </div>

                    {/* Review Form */}
                    <div className="md:w-1/3 space-y-4">
                      {selectedBookingId === booking._id ? (
                        <div className="space-y-4 border rounded-lg p-4">
                          <div>
                            <Label className="block mb-2">Your Rating</Label>
                            <StarRating value={rating} onChange={setRating} />
                          </div>
                          <div>
                            <Label className="block mb-2">Your Review</Label>
                            <Textarea
                              value={comment}
                              onChange={(e) => setComment(e.target.value)}
                              placeholder="Share your experience about this tour..."
                              rows={4}
                            />
                          </div>
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              onClick={() => {
                                setSelectedBookingId(null);
                                setComment("");
                                setRating(5);
                              }}
                              disabled={isSubmitting}
                              className="flex-1"
                            >
                              Cancel
                            </Button>
                            <Button
                              onClick={handleSubmitReview}
                              disabled={isSubmitting || !comment.trim()}
                              className="flex-1"
                            >
                              {isSubmitting ? "Submitting..." : "Submit Review"}
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <Button
                          onClick={() => setSelectedBookingId(booking._id)}
                          className="w-full"
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          Write a Review
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      )}

      {/* Past Reviews Tab */}
      {activeTab === 'past' && (
        <div className="space-y-4">
          {reviews.length === 0 ? (
            <Card>
              <CardContent className="py-10 text-center">
                <MessageSquare className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold">No Reviews Yet</h3>
                <p className="text-muted-foreground">
                  You haven't submitted any reviews yet.
                </p>
              </CardContent>
            </Card>
          ) : (
            reviews.map((review) => (
              <Card key={review._id}>
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-semibold text-lg">{review.booking?.listingTitle}</h3>
                          <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              {formatDate(review.booking?.bookingDate)}
                            </span>
                            <span className="flex items-center gap-1">
                              <User className="h-3 w-3" />
                              Guide: {review.guide?.name}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <StarRating value={review.rating} readonly />
                          <span className="font-semibold text-lg">{review.rating}.0</span>
                        </div>
                      </div>

                      <Separator className="my-4" />

                      <p className="text-gray-700">{review.comment}</p>

                      <div className="flex items-center gap-3 mt-4">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={review.guide?.avatar} />
                          <AvatarFallback>
                            {review.guide?.name?.charAt(0) || "G"}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-sm font-medium">{review.guide?.name}</p>
                          <p className="text-xs text-muted-foreground">Tour Guide</p>
                        </div>
                      </div>

                      <div className="mt-4 text-sm text-muted-foreground">
                        Reviewed on {formatDate(review.createdAt)}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      )}
    </div>
  );
}

