// src/components/modules/Admin/AdminBookings.tsx
"use client";

import { IBooking, BookingStatus, PaymentStatus } from "@/types/booking.interface";
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
  User,
  Calendar,
  DollarSign,
  CreditCard,
  Eye,
  XCircle,
  CheckCircle,
  AlertTriangle,
  Clock,
  RefreshCw,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { adminCancelBooking, adminRefundBooking, updateBookingStatus } from "@/services/admin/admin.service";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { format } from "date-fns";

interface AdminBookingsProps {
  bookings: IBooking[];
}

export default function AdminBookings({ bookings }: AdminBookingsProps) {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [paymentFilter, setPaymentFilter] = useState<string>("all");
  const [selectedBooking, setSelectedBooking] = useState<IBooking | null>(null);
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [showRefundDialog, setShowRefundDialog] = useState(false);
  const [loadingId, setLoadingId] = useState<string | null>(null);

  // Filter bookings
  const filteredBookings = bookings.filter((booking: IBooking) => {
    const matchesSearch = 
      booking.tourist?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.guide?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.tourTitle.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || booking.status === statusFilter;
    const matchesPayment = paymentFilter === "all" || booking.paymentStatus === paymentFilter;
    
    return matchesSearch && matchesStatus && matchesPayment;
  });

  // Handle cancel booking
  const handleCancelBooking = async () => {
    if (!selectedBooking) return;
    
    setLoadingId(selectedBooking._id);
    try {
      const result = await adminCancelBooking(selectedBooking._id);
      if (result.success) {
        toast.success("Booking cancelled successfully");
        router.refresh();
      } else {
        toast.error(result.message || "Failed to cancel booking");
      }
    } catch (error) {
      toast.error("An error occurred");
    } finally {
      setLoadingId(null);
      setShowCancelDialog(false);
      setSelectedBooking(null);
    }
  };

  // Handle refund booking
  const handleRefundBooking = async () => {
    if (!selectedBooking) return;
    
    setLoadingId(selectedBooking._id);
    try {
      const result = await adminRefundBooking(selectedBooking._id);
      if (result.success) {
        toast.success("Refund processed successfully");
        router.refresh();
      } else {
        toast.error(result.message || "Failed to process refund");
      }
    } catch (error) {
      toast.error("An error occurred");
    } finally {
      setLoadingId(null);
      setShowRefundDialog(false);
      setSelectedBooking(null);
    }
  };

  // Handle status update
  const handleStatusUpdate = async (bookingId: string, status: BookingStatus) => {
    setLoadingId(bookingId);
    try {
      const result = await updateBookingStatus(bookingId, status);
      if (result.success) {
        toast.success(`Booking ${status.toLowerCase()} successfully`);
        router.refresh();
      } else {
        toast.error(result.message || "Failed to update booking status");
      }
    } catch (error) {
      toast.error("An error occurred");
    } finally {
      setLoadingId(null);
    }
  };

  // Get status badge
  const getStatusBadge = (status: BookingStatus) => {
    switch (status) {
      case BookingStatus.CONFIRMED:
        return (
          <Badge variant="default" className="bg-green-100 text-green-700">
            <CheckCircle className="h-3 w-3 mr-1" />
            Confirmed
          </Badge>
        );
      case BookingStatus.PENDING:
        return (
          <Badge variant="outline" className="bg-yellow-100 text-yellow-700">
            <Clock className="h-3 w-3 mr-1" />
            Pending
          </Badge>
        );
      case BookingStatus.COMPLETED:
        return (
          <Badge variant="secondary" className="bg-purple-100 text-purple-700">
            <CheckCircle className="h-3 w-3 mr-1" />
            Completed
          </Badge>
        );
      case BookingStatus.CANCELLED:
        return (
          <Badge variant="destructive" className="bg-red-100 text-red-700">
            <XCircle className="h-3 w-3 mr-1" />
            Cancelled
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  // Get payment badge
  const getPaymentBadge = (status: PaymentStatus) => {
    switch (status) {
      case PaymentStatus.PAID:
        return (
          <Badge variant="default" className="bg-green-100 text-green-700">
            <CreditCard className="h-3 w-3 mr-1" />
            Paid
          </Badge>
        );
      case PaymentStatus.PENDING:
        return (
          <Badge variant="outline" className="bg-yellow-100 text-yellow-700">
            <Clock className="h-3 w-3 mr-1" />
            Pending
          </Badge>
        );
      case PaymentStatus.FAILED:
        return (
          <Badge variant="destructive" className="bg-red-100 text-red-700">
            <XCircle className="h-3 w-3 mr-1" />
            Failed
          </Badge>
        );
      // case PaymentStatus.REFUNDED:
      //   return (
      //     <Badge variant="secondary" className="bg-blue-100 text-blue-700">
      //       <RefreshCw className="h-3 w-3 mr-1" />
      //       Refunded
      //     </Badge>
      //   );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold">Booking Management</h1>
          <p className="text-sm text-muted-foreground">
            Manage all bookings, cancellations, and refunds
          </p>
        </div>
        <div className="text-sm text-muted-foreground">
          Total: {filteredBookings.length} bookings
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
                  placeholder="Search by tourist, guide, or tour..."
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
                  <SelectItem value="CONFIRMED">Confirmed</SelectItem>
                  <SelectItem value="COMPLETED">Completed</SelectItem>
                  <SelectItem value="CANCELLED">Cancelled</SelectItem>
                  <SelectItem value="DECLINED">Declined</SelectItem>
                </SelectContent>
              </Select>

              {/* Payment Filter */}
              <Select value={paymentFilter} onValueChange={setPaymentFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by payment" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Payments</SelectItem>
                  <SelectItem value="PENDING">Pending</SelectItem>
                  <SelectItem value="PAID">Paid</SelectItem>
                  <SelectItem value="FAILED">Failed</SelectItem>
                  {/* <SelectItem value="REFUNDED">Refunded</SelectItem> */}
                </SelectContent>
              </Select>
            </div>

            {/* Quick Stats */}
            <div className="flex flex-wrap gap-2">
  <Badge variant="outline" className="gap-1">
    <Clock className="h-3 w-3" />
    {/* b: IBooking লিখে টাইপ দিন */}
    Pending: {bookings.filter((b: IBooking) => b.status === BookingStatus.PENDING).length}
  </Badge>

  <Badge variant="outline" className="gap-1">
    <CheckCircle className="h-3 w-3" />
    Confirmed: {bookings.filter((b: IBooking) => b.status === BookingStatus.CONFIRMED).length}
  </Badge>

  <Badge variant="outline" className="gap-1">
    <CheckCircle className="h-3 w-3" />
    Completed: {bookings.filter((b: IBooking) => b.status === BookingStatus.COMPLETED).length}
  </Badge>

  <Badge variant="outline" className="gap-1">
    <XCircle className="h-3 w-3" />
    Cancelled: {bookings.filter((b: IBooking) => b.status === BookingStatus.CANCELLED).length}
  </Badge>

  <Badge variant="outline" className="gap-1">
    <DollarSign className="h-3 w-3" />
    {/* sum: number এবং b: IBooking লিখে টাইপ দিন */}
    Revenue: ${bookings
      .filter((b: IBooking) => b.paymentStatus === PaymentStatus.PAID)
      .reduce((sum: number, b: IBooking) => sum + b.totalPrice, 0)
      .toFixed(2)}
  </Badge>
</div>
          </div>
        </CardContent>
      </Card>

      {/* Bookings Table */}
      <div className="rounded-lg border overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Booking ID</TableHead>
                <TableHead>Tourist</TableHead>
                <TableHead>Guide</TableHead>
                <TableHead>Tour</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Payment</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredBookings.map((booking: IBooking) => (
                <TableRow key={booking._id} className="hover:bg-muted/50">
                  <TableCell>
                    <div className="font-mono text-xs">{booking._id.slice(-8)}</div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="h-6 w-6 rounded-full bg-blue-100 flex items-center justify-center">
                        <User className="h-3 w-3 text-blue-600" />
                      </div>
                      <div className="text-sm">{booking.tourist?.name || "Tourist"}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="h-6 w-6 rounded-full bg-green-100 flex items-center justify-center">
                        <User className="h-3 w-3 text-green-600" />
                      </div>
                      <div className="text-sm">{booking.guide?.name || "Guide"}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm font-medium">{booking.tourTitle}</div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Calendar className="h-3 w-3" />
                      {format(new Date(booking.date), "MMM dd")}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1 font-bold">
                      <DollarSign className="h-4 w-4 text-emerald-600" />
                      {booking.totalPrice.toFixed(2)}
                    </div>
                  </TableCell>
                  <TableCell>
                    {getStatusBadge(booking.status)}
                  </TableCell>
                  <TableCell>
                    {getPaymentBadge(booking.paymentStatus)}
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => router.push(`/admin/dashboard/bookings/${booking._id}`)}>
                          <Eye className="mr-2 h-4 w-4" />
                          View Details
                        </DropdownMenuItem>
                        {(booking.status === BookingStatus.PENDING || booking.status === BookingStatus.CONFIRMED) && (
                          <DropdownMenuItem 
                            onClick={() => {
                              setSelectedBooking(booking);
                              setShowCancelDialog(true);
                            }}
                          >
                            <XCircle className="mr-2 h-4 w-4" />
                            Cancel Booking
                          </DropdownMenuItem>
                        )}
                        {booking.paymentStatus === PaymentStatus.PAID && booking.status !== BookingStatus.CANCELLED && (
                          <DropdownMenuItem 
                            onClick={() => {
                              setSelectedBooking(booking);
                              setShowRefundDialog(true);
                            }}
                          >
                            <RefreshCw className="mr-2 h-4 w-4" />
                            Process Refund
                          </DropdownMenuItem>
                        )}
                        {booking.status === BookingStatus.PENDING && (
                          <DropdownMenuItem 
                            onClick={() => handleStatusUpdate(booking._id, BookingStatus.CONFIRMED)}
                          >
                            <CheckCircle className="mr-2 h-4 w-4" />
                            Confirm Booking
                          </DropdownMenuItem>
                        )}
                        {booking.status === BookingStatus.CONFIRMED && (
                          <DropdownMenuItem 
                            onClick={() => handleStatusUpdate(booking._id, BookingStatus.COMPLETED)}
                          >
                            <CheckCircle className="mr-2 h-4 w-4" />
                            Mark as Completed
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {filteredBookings.length === 0 && (
          <div className="text-center py-12">
            <div className="text-muted-foreground mb-4">No bookings found</div>
            <Button variant="outline" onClick={() => {
              setSearchTerm("");
              setStatusFilter("all");
              setPaymentFilter("all");
            }}>
              Clear Filters
            </Button>
          </div>
        )}
      </div>

      {/* Cancel Booking Dialog */}
      <AlertDialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Cancel Booking</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to cancel booking #{selectedBooking?._id.slice(-8)}? 
              {selectedBooking?.paymentStatus === PaymentStatus.PAID && 
                " This will automatically trigger a refund to the tourist."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleCancelBooking}
              className="bg-red-600 hover:bg-red-700"
              disabled={loadingId === selectedBooking?._id}
            >
              {loadingId === selectedBooking?._id ? "Cancelling..." : "Cancel Booking"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Refund Booking Dialog */}
      <AlertDialog open={showRefundDialog} onOpenChange={setShowRefundDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Process Refund</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to refund ${selectedBooking?.totalPrice.toFixed(2)} 
              for booking #{selectedBooking?._id.slice(-8)}? 
              The tourist will receive the refund within 5-7 business days.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleRefundBooking}
              className="bg-red-600 hover:bg-red-700"
              disabled={loadingId === selectedBooking?._id}
            >
              {loadingId === selectedBooking?._id ? "Processing..." : "Process Refund"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}