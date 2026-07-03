import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getInitials } from "@/lib/formatters";  

interface UserInfoCellProps {
  name: string;
  email: string;
  photo?: string;
}

export const UserInfoCell = ({ name, email, photo }: UserInfoCellProps) => {
  return (
    <div className="flex items-center gap-3">
      <Avatar className="h-10 w-10">
        <AvatarImage src={photo} alt={name} />
        <AvatarFallback>{getInitials(name)}</AvatarFallback>
      </Avatar>
      <div>
        <div className="font-medium">{name}</div>
        <div className="text-sm text-gray-500">{email}</div>
      </div>
    </div>
  );
};