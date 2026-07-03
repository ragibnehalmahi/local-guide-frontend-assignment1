//app/components/modules/Admin/UserManagement.tsx

"use client";

import { useState, useEffect } from "react";
import {
  Search,
  User,
  Mail,
  Shield,
  CheckCircle,
  XCircle,
  MoreVertical,
  ExternalLink,
  Trash2,
  AlertTriangle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
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
import { toast } from "sonner";
import {
  getAllUsers,
  updateUserStatus,
  updateUserRole,
  deleteUser
} from "@/services/admin/admin.service";
import { UserRole } from "@/types/auth.interface";

interface UserData {
  _id: string;
  name: string;
  email: string;
  role: UserRole;
  status: "ACTIVE" | "INACTIVE" | "BLOCKED" | "DELETED";
  createdAt: string;
}

export default function UserManagement() {
  const [users, setUsers] = useState<UserData[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [userToDelete, setUserToDelete] = useState<UserData | null>(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const result = await getAllUsers();
      if (result.success) {
        setUsers(result.data || []);
      } else {
        toast.error(result.message || "Failed to load users");
      }
    } catch (error) {
      console.error("Failed to fetch users:", error);
      toast.error("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (userId: string, newStatus: string) => {
    try {
      setActionLoading(userId);
      const result = await updateUserStatus(userId, newStatus);
      if (result.success) {
        toast.success(`User status updated to ${newStatus}`);
        setUsers(users.map(u => u._id === userId ? { ...u, status: newStatus as any } : u));
      } else {
        toast.error(result.message || "Failed to update status");
      }
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setActionLoading(null);
    }
  };

  const handleRoleUpdate = async (userId: string, newRole: UserRole) => {
    try {
      setActionLoading(userId);
      const result = await updateUserRole(userId, newRole);
      if (result.success) {
        toast.success(`User role updated to ${newRole}`);
        setUsers(users.map(u => u._id === userId ? { ...u, role: newRole } : u));
      } else {
        toast.error(result.message || "Failed to update role");
      }
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setActionLoading(null);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!userToDelete) return;

    try {
      setActionLoading(userToDelete._id);
      const result = await deleteUser(userToDelete._id);
      if (result.success) {
        toast.success("User deleted successfully from the platform");
        setUsers(users.filter(u => u._id !== userToDelete._id));
      } else {
        toast.error(result.message || "Failed to delete user");
      }
    } catch (error) {
      toast.error("A critical error occurred while deleting user");
    } finally {
      setActionLoading(null);
      setUserToDelete(null);
    }
  };

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin': return "bg-purple-100/50 text-purple-700 border-purple-200/50";
      case 'guide': return "bg-blue-100/50 text-blue-700 border-blue-200/50";
      case 'tourist': return "bg-emerald-100/50 text-emerald-700 border-emerald-200/50";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "ACTIVE": return "bg-emerald-500 text-white border-transparent shadow-sm shadow-emerald-500/20";
      case "INACTIVE": return "bg-amber-100 text-amber-700 border-amber-200";
      case "BLOCKED": return "bg-red-100 text-red-700 border-red-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center h-64 space-y-4">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        <p className="text-muted-foreground animate-pulse text-sm font-medium tracking-tight">Accessing encrypted user vault...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Search & Overview */}
      <div className="flex flex-col md:flex-row gap-6 items-center justify-between bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
        <div className="relative w-full md:max-w-xl">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <Input
            placeholder="Search by identity, email or credentials..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-12 h-12 bg-gray-50/50 border-gray-100 rounded-xl focus:bg-white transition-all shadow-none placeholder:text-gray-400"
          />
        </div>
        <div className="flex items-center gap-3">
          <Badge className="px-4 py-2 text-xs font-black uppercase tracking-widest bg-gray-900 text-white rounded-lg">
            {filteredUsers.length} TOTAL RECORDS
          </Badge>
        </div>
      </div>

      {/* Users Grid */}
      {filteredUsers.length === 0 ? (
        <Card className="border-dashed border-2 rounded-3xl flex flex-col items-center justify-center py-24 bg-gray-50/50">
          <div className="bg-white p-6 rounded-2xl mb-6 shadow-sm border border-gray-100">
            <User className="h-10 w-10 text-gray-300" />
          </div>
          <h3 className="text-2xl font-black tracking-tight text-gray-900">No matching identifiers</h3>
          <p className="text-gray-500 max-w-sm text-center mt-3 text-sm leading-relaxed font-medium">
            We couldn't find any user profiles matching your current search parameters.
          </p>
          <Button variant="outline" className="mt-8 rounded-xl font-bold text-xs uppercase tracking-widest px-8" onClick={() => setSearchTerm("")}>
            Reset Filter
          </Button>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredUsers.map((user) => (
            <Card key={user._id} className="group hover:shadow-2xl transition-all duration-500 border border-gray-100 rounded-3xl overflow-hidden bg-white">
              <CardContent className="p-0">
                <div className="p-8 space-y-6">
                  {/* User Header */}
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-4">
                      <div className="h-14 w-14 rounded-2xl bg-gray-900 flex items-center justify-center border-gray-800 transition-transform group-hover:scale-105 duration-300 shadow-xl shadow-gray-200">
                        <User className="h-7 w-7 text-white" />
                      </div>
                      <div className="min-w-0">
                        <h3 className="font-black text-xl truncate tracking-tight text-gray-900">{user.name}</h3>
                        <p className="text-xs font-bold text-gray-400 flex items-center mt-1 truncate uppercase tracking-tight">
                          <Mail className="h-3 w-3 mr-1.5 opacity-50" /> {user.email}
                        </p>
                      </div>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-10 w-10 rounded-xl hover:bg-gray-100">
                          <MoreVertical className="h-5 w-5 text-gray-400" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-56 rounded-2xl shadow-2xl border-gray-100 p-2">
                        <DropdownMenuLabel className="text-[10px] uppercase font-black tracking-widest text-muted-foreground mb-1">Administrative</DropdownMenuLabel>
                        <DropdownMenuItem className="rounded-xl font-bold text-xs gap-2 py-3 cursor-pointer" onClick={() => window.open(`/profile/${user._id}`, '_blank')}>
                          <ExternalLink className="h-4 w-4" /> View Public Profile
                        </DropdownMenuItem>
                        <DropdownMenuSeparator className="my-2" />
                        <DropdownMenuItem
                          className="rounded-xl font-bold text-xs gap-2 py-3 text-red-600 hover:text-red-700 hover:bg-red-50 cursor-pointer"
                          onClick={() => setUserToDelete(user)}
                        >
                          <Trash2 className="h-4 w-4" /> Terminate Account
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  {/* Status & Role Section */}
                  <div className="grid grid-cols-2 gap-3 p-2">
                    <div className="flex flex-col gap-1.5 p-3 rounded-2xl bg-gray-50 border border-gray-100/50">
                      <span className="text-[10px] uppercase font-black tracking-widest text-gray-400">Vault Access</span>
                      <Badge variant="outline" className={`${getRoleColor(user.role)} font-black text-[10px] border-none shadow-none uppercase h-5`}>
                        {user.role}
                      </Badge>
                    </div>
                    <div className="flex flex-col gap-1.5 p-3 rounded-2xl bg-gray-50 border border-gray-100/50">
                      <span className="text-[10px] uppercase font-black tracking-widest text-gray-400">Live Status</span>
                      <Badge variant="outline" className={`${getStatusColor(user.status)} font-black text-[10px] border-none shadow-none uppercase h-5`}>
                        {user.status}
                      </Badge>
                    </div>
                  </div>

                  {/* Management Controls */}
                  <div className="space-y-4 pt-2">
                    <div className="space-y-2">
                      <label className="text-[10px] uppercase font-black text-gray-400 tracking-widest ml-1 flex items-center gap-1.5">
                        <Shield className="h-3 w-3" /> Privileges Modification
                      </label>
                      <Select
                        disabled={actionLoading === user._id}
                        onValueChange={(value) => handleRoleUpdate(user._id, value as UserRole)}
                        defaultValue={user.role}
                      >
                        <SelectTrigger className="w-full h-12 bg-white border-gray-100 rounded-xl font-bold text-xs shadow-sm hover:border-primary/30 transition-all">
                          <SelectValue placeholder="Override Role" />
                        </SelectTrigger>
                        <SelectContent className="rounded-xl border-gray-100">
                          <SelectItem value="tourist" className="font-bold text-xs rounded-lg">PROVISION TOURIST</SelectItem>
                          <SelectItem value="guide" className="font-bold text-xs rounded-lg">ELEVATE TO GUIDE</SelectItem>
                          <SelectItem value="admin" className="font-bold text-xs rounded-lg">PLATFORM ADMINISTRATOR</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="flex gap-3">
                      {user.status === "ACTIVE" ? (
                        <Button
                          size="sm"
                          variant="outline"
                          disabled={actionLoading === user._id}
                          className="flex-1 rounded-xl border-red-100 text-red-600 bg-red-50/30 hover:bg-red-50 hover:border-red-200 font-black text-[10px] uppercase tracking-widest h-12 shadow-sm shadow-red-500/5"
                          onClick={() => handleStatusUpdate(user._id, "INACTIVE")}
                        >
                          <XCircle className="h-4 w-4 mr-2" /> Suspend
                        </Button>
                      ) : (
                        <Button
                          size="sm"
                          variant="outline"
                          disabled={actionLoading === user._id}
                          className="flex-1 rounded-xl border-emerald-100 text-emerald-600 bg-emerald-50/30 hover:bg-emerald-50 hover:border-emerald-200 font-black text-[10px] uppercase tracking-widest h-12 shadow-sm shadow-emerald-500/5"
                          onClick={() => handleStatusUpdate(user._id, "ACTIVE")}
                        >
                          <CheckCircle className="h-4 w-4 mr-2" /> Reactivate
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!userToDelete} onOpenChange={(open) => !open && setUserToDelete(null)}>
        <AlertDialogContent className="rounded-3xl border-none shadow-2xl p-0 overflow-hidden max-w-md">
          <div className="bg-red-600 p-8 flex flex-col items-center text-white">
            <div className="h-16 w-16 rounded-full bg-white/20 flex items-center justify-center mb-4">
              <AlertTriangle className="h-8 w-8 text-white" />
            </div>
            <AlertDialogTitle className="text-2xl font-black uppercase tracking-tight text-center">Terminate Account</AlertDialogTitle>
            <AlertDialogDescription className="text-white/80 font-medium text-center mt-2 max-w-xs leading-relaxed">
              This will permanently delete <span className="font-black text-white">{userToDelete?.name}</span>'s profile and all associated data.
            </AlertDialogDescription>
          </div>

          <AlertDialogFooter className="p-8 gap-4 flex-col sm:flex-row-reverse sm:justify-start">
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              className="bg-red-600 hover:bg-red-700 text-white rounded-xl font-black text-xs uppercase tracking-widest h-12 px-8 flex-1"
            >
              Confirm Termination
            </AlertDialogAction>
            <AlertDialogCancel className="bg-gray-100 hover:bg-gray-200 border-none rounded-xl font-black text-xs uppercase tracking-widest h-12 px-8 flex-1">
              Cancel
            </AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}