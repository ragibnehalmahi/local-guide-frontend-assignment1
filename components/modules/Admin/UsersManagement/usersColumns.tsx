"use client";

import { DateCell } from "@/components/shared/cell/DateCell";  
import { StatusBadgeCell } from "@/components/shared/cell/StatusBadgeCell";  
import { UserInfoCell } from "@/components/shared/cell/UserInfoCell";  
import { Column } from "@/components/shared/ManagementTable";
import { Badge } from "@/components/ui/badge";
import { IUser, UserRole, UserStatus } from "@/types/user.interface";

export const usersColumns: Column<IUser>[] = [
  {
    header: "User",
    accessor: (user) => (
      <UserInfoCell
        name={user.name}
        email={user.email}
        photo={user.profilePicture}
      />
    ),
    sortKey: "name",
  },
  {
    header: "Role",
    accessor: (user) => {
      let variant: "default" | "secondary" | "outline" = "default";
      if (user.role === UserRole.admin) {
        variant = "secondary";
      } else if (user.role === UserRole.guide) {
        variant = "outline";
      }
      return (
        <Badge variant={variant} className="capitalize">
          {user.role}
        </Badge>
      );
    },
  },
  {
    header: "Contact",
    accessor: (user) => (
      <div className="text-sm">{user.phone || "N/A"}</div>
    ),
  },
  {
    header: "Status",
    accessor: (user) => <StatusBadgeCell status={user.status} />,
  },
  {
    header: "Joined",
    accessor: (user) => <DateCell date={user.createdAt} />,
    sortKey: "createdAt",
  },
];