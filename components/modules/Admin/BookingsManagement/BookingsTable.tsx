//app/components/modules/Admin/BookingsManagement/BookingsTable.tsx   

"use client";

import { ManagementTable } from "@/components/shared/ManagementTable";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator
} from "@/components/ui/dropdown-menu";
import {
  User,
  Calendar,
  MapPin,
  DollarSign,
  Users,
  MoreVertical,
  CheckCircle,
  XCircle,
  RefreshCcw,
  Ban,
  Wallet
} from "lucide-react";
import { formatDate } from "@/lib/formatters";
import { toast } from "sonner";
import {
  updateBookingStatus,
  updatePaymentStatus,
  adminCancelBooking,
  adminRefundBooking
} from "@/services/admin/admin.service";

interface Booking {
  _id: string;
  tourist: {
    _id: string;
    name: string;
    email: string;
    profilePicture?: string;
  };
  guide: {
    _id: string;
    name: string;
    email: string;
  };
  listing: {
    _id: string;
    title: string;
    location: string;
  };
  startDate: string;
  endDate: string;
  numberOfPeople: number;
  totalAmount: number;
  status: string;
  paymentStatus: string;
  specialRequests?: string;
  createdAt: string;
}

interface BookingsTableProps {
  bookings: Booking[];
}

export default function BookingsTable({ bookings }: BookingsTableProps) {
  const router = useRouter();
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [viewOpen, setViewOpen] = useState(false);
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const handleStatusUpdate = async (bookingId: string, status: string) => {
    setLoadingId(bookingId);
    try {
      const result = await updateBookingStatus(bookingId, status);
      if (result.success) {
        toast.success(`Booking status updated to ${status}`);
        router.refresh();
      } else {
        toast.error(result.message || "Failed to update status");
      }
    } catch (error) {
      toast.error("An error occurred");
    } finally {
      setLoadingId(null);
    }
  };

  const handlePaymentUpdate = async (bookingId: string, paymentStatus: string) => {
    setLoadingId(bookingId);
    try {
      const result = await updatePaymentStatus(bookingId, paymentStatus);
      if (result.success) {
        toast.success(`Payment status updated to ${paymentStatus}`);
        router.refresh();
      } else {
        toast.error(result.message || "Failed to update payment status");
      }
    } catch (error) {
      toast.error("An error occurred");
    } finally {
      setLoadingId(null);
    }
  };

  const handleCancelBooking = async (bookingId: string) => {
    if (!confirm("Are you sure you want to cancel this booking?")) return;
    setLoadingId(bookingId);
    try {
      const result = await adminCancelBooking(bookingId);
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
    }
  };

  const handleRefundBooking = async (bookingId: string) => {
    if (!confirm("Are you sure you want to process a refund for this booking?")) return;
    setLoadingId(bookingId);
    try {
      const result = await adminRefundBooking(bookingId);
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
    }
  };

  const columns = [
    {
      header: "Booking ID",
      accessor: (booking: Booking) => (
        <div>
          <p className="font-mono text-[10px] font-bold text-muted-foreground uppercase tracking-wider">#{booking._id.slice(-8)}</p>
          <p className="text-[10px] text-gray-400 mt-0.5">{formatDate(booking.createdAt)}</p>
        </div>
      ),
    },
    {
      header: "Tourist",
      accessor: (booking: Booking) => (
        <div className="flex items-center gap-2.5">
          <div className="h-8 w-8 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center overflow-hidden">
            {booking.tourist.profilePicture ? (
              <img
                src={booking.tourist.profilePicture}
                alt={booking.tourist.name}
                className="h-full w-full object-cover"
              />
            ) : (
              <User className="h-3.5 w-3.5 text-emerald-600" />
            )}
          </div>
          <div>
            <p className="font-semibold text-xs text-gray-900">{booking.tourist.name}</p>
            <p className="text-[10px] text-gray-400 truncate max-w-[120px]">{booking.tourist.email}</p>
          </div>
        </div>
      ),
    },
    {
      header: "Guide",
      accessor: (booking: Booking) => (
        <div className="flex items-center gap-2.5">
          <div className="h-8 w-8 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center">
            <User className="h-3.5 w-3.5 text-blue-600" />
          </div>
          <div>
            <p className="font-semibold text-xs text-gray-900">{booking.guide.name}</p>
            <p className="text-[10px] text-gray-400 truncate max-w-[120px]">{booking.guide.email}</p>
          </div>
        </div>
      ),
    },
    {
      header: "Tour Detail",
      accessor: (booking: Booking) => (
        <div className="max-w-[180px]">
          <p className="font-semibold text-xs text-gray-900 line-clamp-1">{booking.listing.title}</p>
          <p className="text-[10px] text-gray-400 flex items-center gap-1 mt-0.5">
            <MapPin className="h-2.5 w-2.5" />
            <span className="truncate">{booking.listing.location}</span>
          </p>
        </div>
      ),
    },
    {
      header: "Schedule",
      accessor: (booking: Booking) => (
        <div>
          <p className="font-semibold text-xs text-gray-900">{formatDate(booking.startDate)}</p>
          <p className="text-[10px] text-gray-400 mt-0.5">
            {new Date(booking.startDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </p>
        </div>
      ),
    },
    {
      header: "Financials",
      accessor: (booking: Booking) => (
        <div>
          <p className="font-bold text-xs text-emerald-600">${booking.totalAmount}</p>
          <div className="flex items-center gap-1 mt-0.5">
            <Users className="h-2.5 w-2.5 text-gray-400" />
            <span className="text-[10px] text-gray-400">{booking.numberOfPeople} Guests</span>
          </div>
        </div>
      ),
    },
    {
      header: "Status",
      accessor: (booking: Booking) => {
        const isCompleted = booking.status.toUpperCase() === 'COMPLETED';
        const isPaid = booking.paymentStatus.toUpperCase() === 'PAID';

        return (
          <div className="flex flex-col gap-1.5">
            <Badge
              variant="outline"
              className={`text-[10px] uppercase font-bold py-0 h-5 border-none shadow-none ${isCompleted ? 'bg-emerald-100 text-emerald-700' :
                  booking.status.toUpperCase() === 'CONFIRMED' ? 'bg-blue-100 text-blue-700' :
                    booking.status.toUpperCase() === 'PENDING' ? 'bg-amber-100 text-amber-700' :
                      'bg-red-100 text-red-700'
                }`}
            >
              {isCompleted ? 'Completed' : 'Uncompleted'}
            </Badge>
            <Badge
              variant="outline"
              className={`text-[10px] font-medium h-4 border-none shadow-none ${isPaid ? 'text-emerald-600' :
                  'text-red-600'
                }`}
            >
              ● {isPaid ? 'Paid' : 'Unpaid'}
            </Badge>
          </div>
        );
      },
    },
    {
      header: "Actions",
      accessor: (booking: Booking) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-gray-900">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>Booking Management</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => handleViewDetails(booking)}>
              <Calendar className="mr-2 h-4 w-4" /> View Full Info
            </DropdownMenuItem>

            <DropdownMenuSeparator />
            <DropdownMenuLabel className="text-[10px] text-muted-foreground uppercase tracking-widest mt-1">Actions</DropdownMenuLabel>

            <DropdownMenuItem
              onClick={() => handleStatusUpdate(booking._id, "COMPLETED")}
              disabled={booking.status === "COMPLETED" || loadingId === booking._id}
            >
              <CheckCircle className="mr-2 h-4 w-4 text-emerald-600" /> Mark as Completed
            </DropdownMenuItem>

            <DropdownMenuItem
              onClick={() => handleStatusUpdate(booking._id, "CONFIRMED")}
              disabled={booking.status === "CONFIRMED" || loadingId === booking._id}
            >
              <RefreshCcw className="mr-2 h-4 w-4 text-blue-600" /> Confirm Booking
            </DropdownMenuItem>

            <DropdownMenuItem
              onClick={() => handlePaymentUpdate(booking._id, "PAID")}
              disabled={booking.paymentStatus === "PAID" || loadingId === booking._id}
            >
              <Wallet className="mr-2 h-4 w-4 text-emerald-600" /> Mark as Paid
            </DropdownMenuItem>

            <DropdownMenuSeparator />

            <DropdownMenuItem
              onClick={() => handleCancelBooking(booking._id)}
              disabled={booking.status === "CANCELLED" || loadingId === booking._id}
              className="text-red-600"
            >
              <Ban className="mr-2 h-4 w-4" /> Cancel Booking
            </DropdownMenuItem>

            <DropdownMenuItem
              onClick={() => handleRefundBooking(booking._id)}
              disabled={booking.paymentStatus === "REFUNDED" || loadingId === booking._id}
              className="text-orange-600"
            >
              <Wallet className="mr-2 h-4 w-4" /> Process Refund
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    }
  ];

  const handleViewDetails = (booking: Booking) => {
    setSelectedBooking(booking);
    setViewOpen(true);
  };

  return (
    <>
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <ManagementTable
          data={bookings}
          columns={columns}
          onView={handleViewDetails}
          getRowKey={(booking) => booking._id}
          searchable={true}
          searchPlaceholder="Search by IDs, tourist names or guide names..."
          searchFields={["tourist.name", "guide.name", "listing.title", "_id"]}
          emptyMessage="No platform bookings match your search criteria."
        />
      </div>

      <Dialog open={viewOpen} onOpenChange={setViewOpen}>
        <DialogContent className="max-w-2xl gap-0 p-0 overflow-hidden border-none shadow-2xl">
          {selectedBooking && (
            <div className="flex flex-col">
              {/* Top Banner */}
              <div className="bg-gradient-to-r from-gray-900 to-gray-800 p-8 text-white">
                <div className="flex justify-between items-start">
                  <div>
                    <Badge variant="outline" className="text-[10px] border-white/20 text-white/70 mb-2 uppercase tracking-widest font-bold">
                      Booking Reference
                    </Badge>
                    <h3 className="text-3xl font-black tracking-tight">#{selectedBooking._id.slice(-8)}</h3>
                    <p className="text-white/50 text-sm mt-1">Platform record initialized on {formatDate(selectedBooking.createdAt)}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-emerald-400 text-3xl font-black">${selectedBooking.totalAmount}</p>
                    <Badge className={`mt-2 ${selectedBooking.paymentStatus === 'paid' ? 'bg-emerald-500/20 text-emerald-400 border-none' : 'bg-amber-500/20 text-amber-400 border-none'}`}>
                      {selectedBooking.paymentStatus.toUpperCase()}
                    </Badge>
                  </div>
                </div>
              </div>

              <div className="p-8 space-y-8 bg-white max-h-[70vh] overflow-y-auto">
                {/* Visual Status Steps */}
                <div className="flex items-center justify-between px-4 pb-4">
                  {['pending', 'confirmed', 'completed'].map((step, idx) => {
                    const isActive = selectedBooking.status === step;
                    const isPast = ['pending', 'confirmed', 'completed'].indexOf(selectedBooking.status) >= idx;
                    return (
                      <div key={step} className="flex flex-col items-center gap-2">
                        <div className={`h-10 w-10 rounded-full flex items-center justify-center border-2 transition-all ${isActive ? 'border-primary bg-primary text-white scale-110 shadow-lg shadow-primary/20' :
                            isPast ? 'border-primary text-primary bg-primary/5' : 'border-gray-100 text-gray-300'
                          }`}>
                          {isPast && !isActive ? <CheckCircle className="h-5 w-5" /> : <span className="font-bold text-xs">{idx + 1}</span>}
                        </div>
                        <span className={`text-[10px] uppercase font-black tracking-widest ${isActive ? 'text-gray-900' : 'text-gray-400'}`}>
                          {step}
                        </span>
                      </div>
                    )
                  })}
                </div>

                <div className="grid grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <h4 className="text-[10px] uppercase font-black tracking-widest text-gray-400 border-b pb-2">Tourist Insight</h4>
                    <div className="flex items-center gap-4">
                      <div className="h-14 w-14 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center overflow-hidden">
                        {selectedBooking.tourist.profilePicture ? (
                          <img src={selectedBooking.tourist.profilePicture} alt="" className="h-full w-full object-cover" />
                        ) : (
                          <User className="h-7 w-7 text-emerald-600" />
                        )}
                      </div>
                      <div>
                        <p className="font-bold text-gray-900">{selectedBooking.tourist.name}</p>
                        <p className="text-xs text-gray-500 font-medium">{selectedBooking.tourist.email}</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="text-[10px] uppercase font-black tracking-widest text-gray-400 border-b pb-2">Guide Insight</h4>
                    <div className="flex items-center gap-4">
                      <div className="h-14 w-14 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center">
                        <User className="h-7 w-7 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-bold text-gray-900">{selectedBooking.guide.name}</p>
                        <p className="text-xs text-gray-500 font-medium">{selectedBooking.guide.email}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4 p-6 rounded-2xl bg-gray-50 border border-gray-100">
                  <h4 className="text-[10px] uppercase font-black tracking-widest text-gray-400">Booking Summary</h4>
                  <div className="grid grid-cols-2 gap-6">
                    <div className="flex items-start gap-3">
                      <MapPin className="h-5 w-5 text-gray-400 mt-1" />
                      <div>
                        <p className="text-xs font-bold text-gray-900">{selectedBooking.listing.title}</p>
                        <p className="text-[10px] text-gray-500 font-medium">{selectedBooking.listing.location}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Calendar className="h-5 w-5 text-gray-400 mt-1" />
                      <div>
                        <p className="text-xs font-bold text-gray-900">{formatDate(selectedBooking.startDate)}</p>
                        <p className="text-[10px] text-gray-500 font-medium">Starts at {new Date(selectedBooking.startDate).toLocaleTimeString()}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Users className="h-5 w-5 text-gray-400 mt-1" />
                      <div>
                        <p className="text-xs font-bold text-gray-900">{selectedBooking.numberOfPeople} Guests</p>
                        <p className="text-[10px] text-gray-500 font-medium">Group Size</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Wallet className="h-5 w-5 text-gray-400 mt-1" />
                      <div>
                        <p className="text-xs font-bold text-gray-900">${selectedBooking.totalAmount}</p>
                        <p className="text-[10px] text-gray-500 font-medium">Total Transaction</p>
                      </div>
                    </div>
                  </div>
                </div>

                {selectedBooking.specialRequests && (
                  <div className="p-5 rounded-2xl bg-amber-50/50 border border-amber-100">
                    <h4 className="text-[10px] uppercase font-black tracking-widest text-amber-600 mb-2">Special Coordination Requests</h4>
                    <p className="text-xs text-amber-900 leading-relaxed font-medium">{selectedBooking.specialRequests}</p>
                  </div>
                )}
              </div>

              <DialogFooter className="p-6 bg-gray-50 border-t flex items-center justify-between">
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Administrative Control Center</p>
                <div className="flex gap-2">
                  <Button variant="outline" onClick={() => setViewOpen(false)} className="rounded-xl font-bold text-xs h-10">Close</Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button className="rounded-xl font-bold text-xs h-10 px-6 gap-2"> Manage Record <RefreshCcw className="h-3 w-3" /> </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56 rounded-xl shadow-2xl">
                      <DropdownMenuItem onClick={() => handleStatusUpdate(selectedBooking._id, "completed")}>Mark as Completed</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleCancelBooking(selectedBooking._id)} className="text-red-600">Cancel Booking</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
