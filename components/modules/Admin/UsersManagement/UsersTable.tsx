"use client";

import DeleteConfirmationDialog from "@/components/shared/DeleteConfirmationDialog";  
import { ManagementTable } from "@/components/shared/ManagementTable";  
import { updateUserStatus } from "@/services/admin/admin.service";  
import { IUser, UserStatus } from "@/types/user.interface";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import { usersColumns } from "./usersColumns";

interface UsersTableProps {
  users: IUser[];
}

const UsersTable = ({ users }: UsersTableProps) => {
  const router = useRouter();
  const [, startTransition] = useTransition();
  const [deletingUser, setDeletingUser] = useState<IUser | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleRefresh = () => {
    startTransition(() => {
      router.refresh();
    });
  };

  const handleDelete = (user: IUser) => {
    setDeletingUser(user);
  };

  const confirmDelete = async () => {
    if (!deletingUser) return;

    setIsDeleting(true);
    const result = await updateUserStatus(deletingUser.id!, UserStatus.DELETED);
    setIsDeleting(false);

    if (result.success) {
      toast.success(result.message || "User deleted successfully");
      setDeletingUser(null);
      handleRefresh();
    } else {
      toast.error(result.message || "Failed to delete user");
    }
  };

  return (
    <>
      <ManagementTable
        data={users}
        columns={usersColumns}
        onDelete={handleDelete}
        getRowKey={(user) => user.id!}
        emptyMessage="No users found"
      />

      <DeleteConfirmationDialog
        open={!!deletingUser}
        onOpenChange={(open) => !open && setDeletingUser(null)}
        onConfirm={confirmDelete}
        title="Delete User"
        description={`Are you sure you want to delete ${deletingUser?.name}? This action cannot be undone.`}
        isDeleting={isDeleting}
      />
    </>
  );
};

export default UsersTable;