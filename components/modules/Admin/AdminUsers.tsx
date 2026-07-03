// src/components/modules/Admin/AdminUsers.tsx
"use client";

import { IUser, UserStatus } from "@/types/user.interface";
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
  Mail,
  Shield,
  Ban,
  CheckCircle,
  XCircle,
  Trash2,
  Eye,
  AlertTriangle,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { updateUserStatus, deleteUser, updateUserRole } from "@/services/admin/admin.service";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { UserRole } from "@/types/user.interface";

interface AdminUsersProps {
  initialUsers: IUser[];
}

export default function AdminUsers({ initialUsers }: AdminUsersProps) {
  const router = useRouter();
  const [users, setUsers] = useState<IUser[]>(initialUsers);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [selectedUser, setSelectedUser] = useState<IUser | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showBlockDialog, setShowBlockDialog] = useState(false);
  const [showUnblockDialog, setShowUnblockDialog] = useState(false);
  const [loadingId, setLoadingId] = useState<string | null>(null);

  // Filter users
  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || user.status === statusFilter;
    const matchesRole = roleFilter === "all" || user.role === roleFilter;
    
    return matchesSearch && matchesStatus && matchesRole;
  });

  // Handle status update
  const handleStatusUpdate = async (userId: string, status: UserStatus) => {
    setLoadingId(userId);
    try {
      const result = await updateUserStatus(userId, status);
      if (result.success) {
        setUsers(users.map(user => 
          user.id === userId ? { ...user, status } : user
        ));
        toast.success(`User ${status === UserStatus.ACTIVE ? 'activated' : 'blocked'} successfully`);
      } else {
        toast.error(result.message || "Failed to update user status");
      }
    } catch (error) {
      toast.error("An error occurred");
    } finally {
      setLoadingId(null);
    }
  };

  // Handle role update
  const handleRoleUpdate = async (userId: string, role: UserRole) => {
    setLoadingId(userId);
    try {
      const result = await updateUserRole(userId, role);
      if (result.success) {
        setUsers(users.map(user => 
          user.id === userId ? { ...user, role } : user
        ));
        toast.success("User role updated successfully");
      } else {
        toast.error(result.message || "Failed to update user role");
      }
    } catch (error) {
      toast.error("An error occurred");
    } finally {
      setLoadingId(null);
    }
  };

  // Handle delete user
  const handleDeleteUser = async () => {
    if (!selectedUser) return;
    
    setLoadingId(selectedUser.id);
    try {
      const result = await deleteUser(selectedUser.id);
      if (result.success) {
        setUsers(users.filter(user => user.id !== selectedUser.id));
        toast.success("User deleted successfully");
      } else {
        toast.error(result.message || "Failed to delete user");
      }
    } catch (error) {
      toast.error("An error occurred");
    } finally {
      setLoadingId(null);
      setShowDeleteDialog(false);
      setSelectedUser(null);
    }
  };

  // Get status badge
  const getStatusBadge = (status: UserStatus) => {
    switch (status) {
      case UserStatus.ACTIVE:
        return (
          <Badge variant="default" className="bg-green-100 text-green-700">
            <CheckCircle className="h-3 w-3 mr-1" />
            Active
          </Badge>
        );
      case UserStatus.BLOCKED:
        return (
          <Badge variant="destructive" className="bg-red-100 text-red-700">
            <Ban className="h-3 w-3 mr-1" />
            Blocked
          </Badge>
        );
      // case UserStatus.PENDING:
      //   return (
      //     <Badge variant="outline" className="bg-yellow-100 text-yellow-700">
      //       <AlertTriangle className="h-3 w-3 mr-1" />
      //       Pending
      //     </Badge>
      //   );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  // Get role badge
  const getRoleBadge = (role: UserRole) => {
    switch (role) {
      case UserRole.admin:
        return (
          <Badge variant="default" className="bg-purple-100 text-purple-700">
            <Shield className="h-3 w-3 mr-1" />
            Admin
          </Badge>
        );
      case UserRole.guide:
        return (
          <Badge variant="secondary" className="bg-blue-100 text-blue-700">
            <User className="h-3 w-3 mr-1" />
            Guide
          </Badge>
        );
      case UserRole.tourist:
        return (
          <Badge variant="outline" className="bg-gray-100 text-gray-700">
            <User className="h-3 w-3 mr-1" />
            Tourist
          </Badge>
        );
      default:
        return <Badge variant="outline">{role}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold">User Management</h1>
          <p className="text-sm text-muted-foreground">
            Manage all users, guides, and administrators
          </p>
        </div>
        <div className="text-sm text-muted-foreground">
          Total: {filteredUsers.length} users
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
                  placeholder="Search by name or email..."
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
                  <SelectItem value="ACTIVE">Active</SelectItem>
                  <SelectItem value="BLOCKED">Blocked</SelectItem>
                  <SelectItem value="PENDING">Pending</SelectItem>
                </SelectContent>
              </Select>

              {/* Role Filter */}
              <Select value={roleFilter} onValueChange={setRoleFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Roles</SelectItem>
                  <SelectItem value="ADMIN">Admin</SelectItem>
                  <SelectItem value="GUIDE">Guide</SelectItem>
                  <SelectItem value="TOURIST">Tourist</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Quick Stats */}
            <div className="flex flex-wrap gap-2">
              <Badge variant="outline" className="gap-1">
                <CheckCircle className="h-3 w-3" />
                Active: {users.filter(u => u.status === UserStatus.ACTIVE).length}
              </Badge>
              <Badge variant="outline" className="gap-1">
                <Ban className="h-3 w-3" />
                Blocked: {users.filter(u => u.status === UserStatus.BLOCKED).length}
              </Badge>
              <Badge variant="outline" className="gap-1">
                <Shield className="h-3 w-3" />
                Admins: {users.filter(u => u.role === UserRole.admin).length}
              </Badge>
              <Badge variant="outline" className="gap-1">
                <User className="h-3 w-3" />
                Guides: {users.filter(u => u.role === UserRole.guide).length}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Users Table */}
      <div className="rounded-lg border overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Joined</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map((user) => (
                <TableRow key={user.id} className="hover:bg-muted/50">
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                        <User className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <div className="font-medium">{user.name}</div>
                        <div className="text-xs text-muted-foreground">
                          ID: {user.id.slice(-8)}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Mail className="h-3 w-3 text-muted-foreground" />
                      {user.email}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {getRoleBadge(user.role)}
                      <Select
                        value={user.role}
                        onValueChange={(value) => handleRoleUpdate(user.id, value as UserRole)}
                        disabled={loadingId === user.id}
                      >
                        <SelectTrigger className="w-28 h-8">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="TOURIST">Tourist</SelectItem>
                          <SelectItem value="GUIDE">Guide</SelectItem>
                          <SelectItem value="ADMIN">Admin</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {getStatusBadge(user.status)}
                      {user.status === UserStatus.ACTIVE ? (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setSelectedUser(user);
                            setShowBlockDialog(true);
                          }}
                          disabled={loadingId === user.id}
                          className="h-8"
                        >
                          <Ban className="h-3 w-3 mr-1" />
                          Block
                        </Button>
                      ) : (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleStatusUpdate(user.id, UserStatus.ACTIVE)}
                          disabled={loadingId === user.id}
                          className="h-8"
                        >
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Activate
                        </Button>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm text-muted-foreground">
                      {new Date(user.createdAt).toLocaleDateString()}
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
                        <DropdownMenuItem onClick={() => router.push(`/admin/dashboard/users/${user.id}`)}>
                          <Eye className="mr-2 h-4 w-4" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => {
                            setSelectedUser(user);
                            setShowDeleteDialog(true);
                          }}
                          className="text-red-600"
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete User
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {filteredUsers.length === 0 && (
          <div className="text-center py-12">
            <div className="text-muted-foreground mb-4">No users found</div>
            <Button variant="outline" onClick={() => {
              setSearchTerm("");
              setStatusFilter("all");
              setRoleFilter("all");
            }}>
              Clear Filters
            </Button>
          </div>
        )}
      </div>

      {/* Delete User Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete User</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete user "{selectedUser?.name}"? This action cannot be undone.
              All associated data (listings, bookings, reviews) will also be removed.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteUser}
              className="bg-red-600 hover:bg-red-700"
              disabled={loadingId === selectedUser?.id}
            >
              {loadingId === selectedUser?.id ? "Deleting..." : "Delete User"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Block User Dialog */}
      <AlertDialog open={showBlockDialog} onOpenChange={setShowBlockDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Block User</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to block user "{selectedUser?.name}"? 
              Blocked users cannot login or access the platform.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (selectedUser) {
                  handleStatusUpdate(selectedUser.id, UserStatus.BLOCKED);
                  setShowBlockDialog(false);
                  setSelectedUser(null);
                }
              }}
              className="bg-red-600 hover:bg-red-700"
              disabled={loadingId === selectedUser?.id}
            >
              {loadingId === selectedUser?.id ? "Blocking..." : "Block User"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}