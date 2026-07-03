import { Badge } from "@/components/ui/badge";
import { UserStatus } from "@/types/user.interface";

interface StatusBadgeCellProps {
  status?: UserStatus;
  isDeleted?: boolean;
}

export const StatusBadgeCell = ({ status, isDeleted }: StatusBadgeCellProps) => {
  const getStatusConfig = () => {
    if (isDeleted) {
      return { label: "Deleted", variant: "destructive" as const };
    }

    switch (status) {
      case UserStatus.ACTIVE:
        return { label: "Active", variant: "default" as const };
      case UserStatus.INACTIVE:
        return { label: "Inactive", variant: "secondary" as const };
      case UserStatus.BLOCKED:
        return { label: "Blocked", variant: "destructive" as const };
      case UserStatus.DELETED:
        return { label: "Deleted", variant: "destructive" as const };
      default:
        return { label: "Unknown", variant: "outline" as const };
    }
  };

  const { label, variant } = getStatusConfig();

  return <Badge variant={variant}>{label}</Badge>;
};