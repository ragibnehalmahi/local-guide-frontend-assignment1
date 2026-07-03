// src/components/modules/Admin/AdminReviews.tsx
"use client";

import { IReview, ReviewStatus } from "@/types/review.interface";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  MoreVertical,
  Search,
  Filter,
  Star,
  User,
  MessageSquare,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Eye,
  Trash2,
  Flag,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { updateReviewStatus, deleteReview } from "@/services/admin/admin.service";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { format } from "date-fns";

interface AdminReviewsProps {
  initialReviews: IReview[];
}

export default function AdminReviews({ initialReviews }: AdminReviewsProps) {
  const router = useRouter();
  const [reviews, setReviews] = useState<IReview[]>(initialReviews);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [ratingFilter, setRatingFilter] = useState<string>("all");
  const [selectedReview, setSelectedReview] = useState<IReview | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showFlagDialog, setShowFlagDialog] = useState(false);
  const [flagReason, setFlagReason] = useState("");
  const [loadingId, setLoadingId] = useState<string | null>(null);

  // Filter reviews
  const filteredReviews = reviews.filter(review => {
    const matchesSearch = 
      review.tourist?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      review.guide?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      review.comment?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || review.status === statusFilter;
    const matchesRating = ratingFilter === "all" || review.rating.toString() === ratingFilter;
    
    return matchesSearch && matchesStatus && matchesRating;
  });

  // Handle status update
  const handleStatusUpdate = async (reviewId: string, status: ReviewStatus) => {
    setLoadingId(reviewId);
    try {
      const result = await updateReviewStatus(reviewId, status);
      if (result.success) {
        setReviews(reviews.map(review => 
          (review._id === reviewId || review.id === reviewId) ? { ...review, status } : review
        ));
        toast.success(`Review ${status === ReviewStatus.APPROVED ? 'approved' : 'rejected'} successfully`);
      } else {
        toast.error(result.message || "Failed to update review status");
      }
    } catch (error) {
      toast.error("An error occurred");
    } finally {
      setLoadingId(null);
    }
  };

  // Handle delete review
  const handleDeleteReview = async () => {
    if (!selectedReview) return;
    
    const reviewId = selectedReview._id || selectedReview.id;
    setLoadingId(reviewId);
    try {
      const result = await deleteReview(reviewId);
      if (result.success) {
        setReviews(reviews.filter(review => (review._id !== reviewId && review.id !== reviewId)));
        toast.success("Review deleted successfully");
      } else {
        toast.error(result.message || "Failed to delete review");
      }
    } catch (error) {
      toast.error("An error occurred");
    } finally {
      setLoadingId(null);
      setShowDeleteDialog(false);
      setSelectedReview(null);
    }
  };

  // Handle flag review
  const handleFlagReview = async () => {
    if (!selectedReview || !flagReason.trim()) return;
    
    const reviewId = selectedReview._id || selectedReview.id;
    setLoadingId(reviewId);
    try {
      const result = await updateReviewStatus(reviewId, ReviewStatus.FLAGGED);
      if (result.success) {
        setReviews(reviews.map(review => 
          (review._id === reviewId || review.id === reviewId) ? { ...review, status: ReviewStatus.FLAGGED } : review
        ));
        toast.success("Review flagged successfully");
      } else {
        toast.error(result.message || "Failed to flag review");
      }
    } catch (error) {
      toast.error("An error occurred");
    } finally {
      setLoadingId(null);
      setShowFlagDialog(false);
      setSelectedReview(null);
      setFlagReason("");
    }
  };

  // Get status badge
  const getStatusBadge = (status: ReviewStatus) => {
    switch (status) {
      case ReviewStatus.APPROVED:
        return (
          <Badge variant="default" className="bg-green-100 text-green-700">
            <CheckCircle className="h-3 w-3 mr-1" />
            Approved
          </Badge>
        );
      case ReviewStatus.PENDING:
        return (
          <Badge variant="outline" className="bg-yellow-100 text-yellow-700">
            <AlertTriangle className="h-3 w-3 mr-1" />
            Pending
          </Badge>
        );
      case ReviewStatus.REJECTED:
        return (
          <Badge variant="destructive" className="bg-red-100 text-red-700">
            <XCircle className="h-3 w-3 mr-1" />
            Rejected
          </Badge>
        );
      case ReviewStatus.FLAGGED:
        return (
          <Badge variant="destructive" className="bg-orange-100 text-orange-700">
            <Flag className="h-3 w-3 mr-1" />
            Flagged
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  // Render stars
  const renderStars = (rating: number) => {
    return (
      <div className="flex">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`h-4 w-4 ${i < rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold">Review Moderation</h1>
          <p className="text-sm text-muted-foreground">
            Moderate and manage all user reviews
          </p>
        </div>
        <div className="text-sm text-muted-foreground">
          Total: {filteredReviews.length} reviews
        </div>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search by tourist, guide, or comment..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              {/* Status Filter */}
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="PENDING">Pending</SelectItem>
                  <SelectItem value="APPROVED">Approved</SelectItem>
                  <SelectItem value="REJECTED">Rejected</SelectItem>
                  <SelectItem value="FLAGGED">Flagged</SelectItem>
                </SelectContent>
              </Select>

              {/* Rating Filter */}
              <Select value={ratingFilter} onValueChange={setRatingFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by rating" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Ratings</SelectItem>
                  <SelectItem value="5">★★★★★</SelectItem>
                  <SelectItem value="4">★★★★☆</SelectItem>
                  <SelectItem value="3">★★★☆☆</SelectItem>
                  <SelectItem value="2">★★☆☆☆</SelectItem>
                  <SelectItem value="1">★☆☆☆☆</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Quick Stats */}
            <div className="flex flex-wrap gap-2">
              <Badge variant="outline" className="gap-1">
                <AlertTriangle className="h-3 w-3" />
                Pending: {reviews.filter(r => r.status === ReviewStatus.PENDING).length}
              </Badge>
              <Badge variant="outline" className="gap-1">
                <CheckCircle className="h-3 w-3" />
                Approved: {reviews.filter(r => r.status === ReviewStatus.APPROVED).length}
              </Badge>
              <Badge variant="outline" className="gap-1">
                <XCircle className="h-3 w-3" />
                Rejected: {reviews.filter(r => r.status === ReviewStatus.REJECTED).length}
              </Badge>
              <Badge variant="outline" className="gap-1">
                <Flag className="h-3 w-3" />
                Flagged: {reviews.filter(r => r.status === ReviewStatus.FLAGGED).length}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Reviews Table */}
      <div className="rounded-lg border overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Review</TableHead>
                <TableHead>Tourist</TableHead>
                <TableHead>Guide</TableHead>
                <TableHead>Rating</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredReviews.map((review) => (
                <TableRow key={review._id || review.id} className="hover:bg-muted/50">
                  <TableCell>
                    <div className="max-w-md">
                      <div className="font-medium line-clamp-2">{review.comment}</div>
                      {review.comment && review.comment.length > 100 && (
                        <div className="text-xs text-muted-foreground mt-1">
                          {review.comment.length} characters
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="h-6 w-6 rounded-full bg-blue-100 flex items-center justify-center">
                        <User className="h-3 w-3 text-blue-600" />
                      </div>
                      <div className="text-sm">{review.tourist?.name || "Tourist"}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="h-6 w-6 rounded-full bg-green-100 flex items-center justify-center">
                        <User className="h-3 w-3 text-green-600" />
                      </div>
                      <div className="text-sm">{review.guide?.name || "Guide"}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    {renderStars(review.rating)}
                    <div className="text-xs text-muted-foreground mt-1">
                      {review.rating}/5
                    </div>
                  </TableCell>
                  <TableCell>
                    {getStatusBadge(review.status)}
                  </TableCell>
                  <TableCell>
                    <div className="text-sm text-muted-foreground">
                      {format(new Date(review.createdAt), "MMM dd, yyyy")}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => {
                          // View review details
                          setSelectedReview(review);
                          // You can create a modal for detailed view
                        }}>
                          <Eye className="mr-2 h-4 w-4" />
                          View Details
                        </DropdownMenuItem>
                        {review.status === ReviewStatus.PENDING && (
                          <>
                            <DropdownMenuItem 
                              onClick={() => handleStatusUpdate(review._id || review.id, ReviewStatus.APPROVED)}
                              disabled={loadingId === (review._id || review.id)}
                            >
                              <CheckCircle className="mr-2 h-4 w-4" />
                              Approve
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              onClick={() => handleStatusUpdate(review._id || review.id, ReviewStatus.REJECTED)}
                              disabled={loadingId === (review._id || review.id)}
                            >
                              <XCircle className="mr-2 h-4 w-4" />
                              Reject
                            </DropdownMenuItem>
                          </>
                        )}
                        {review.status === ReviewStatus.APPROVED && (
                          <DropdownMenuItem 
                            onClick={() => {
                              setSelectedReview(review);
                              setShowFlagDialog(true);
                            }}
                          >
                            <Flag className="mr-2 h-4 w-4" />
                            Flag Review
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuItem 
                          onClick={() => {
                            setSelectedReview(review);
                            setShowDeleteDialog(true);
                          }}
                          className="text-red-600"
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete Review
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {filteredReviews.length === 0 && (
          <div className="text-center py-12">
            <div className="text-muted-foreground mb-4">No reviews found</div>
            <Button variant="outline" onClick={() => {
              setSearchTerm("");
              setStatusFilter("all");
              setRatingFilter("all");
            }}>
              Clear Filters
            </Button>
          </div>
        )}
      </div>

      {/* Delete Review Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Review</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this review? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteReview}
              className="bg-red-600 hover:bg-red-700"
              disabled={loadingId === (selectedReview?._id || selectedReview?.id)}
            >
              {loadingId === (selectedReview?._id || selectedReview?.id) ? "Deleting..." : "Delete Review"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Flag Review Dialog */}
      <AlertDialog open={showFlagDialog} onOpenChange={setShowFlagDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Flag Review</AlertDialogTitle>
            <AlertDialogDescription>
              Please provide a reason for flagging this review by "{selectedReview?.tourist?.name}".
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="py-4">
            <Textarea
              placeholder="Reason for flagging (e.g., inappropriate content, false information...)"
              value={flagReason}
              onChange={(e) => setFlagReason(e.target.value)}
              rows={3}
            />
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleFlagReview}
              className="bg-orange-600 hover:bg-orange-700"
              disabled={loadingId === (selectedReview?._id || selectedReview?.id) || !flagReason.trim()}
            >
              {loadingId === (selectedReview?._id || selectedReview?.id) ? "Flagging..." : "Flag Review"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}