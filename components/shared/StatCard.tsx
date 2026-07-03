"use client";

import * as Icons from "lucide-react";
import { cn } from "@/lib/utils";

interface StatsCardProps {
  title: string;
  value: string;
  iconName: keyof typeof Icons;
  description?: string;
  iconClassName?: string;
}

export const StatsCard = ({ title, value, iconName, description, iconClassName }: StatsCardProps) => {
  const Icon = Icons[iconName] as any;

  return (
    <div className="bg-white p-6 rounded-xl border shadow-sm flex items-center justify-between">
      <div className="space-y-1">
        <p className="text-sm font-medium text-muted-foreground">{title}</p>
        <p className="text-2xl font-bold">{value}</p>
        {description && <p className="text-xs text-muted-foreground">{description}</p>}
      </div>
      <div className={cn("p-3 rounded-lg", iconClassName)}>
        <Icon size={24} />
      </div>
    </div>
  );
};