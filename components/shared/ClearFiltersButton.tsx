"use client";

import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";

const ClearFiltersButton = () => {
  const router = useRouter();
  const pathname = usePathname();

  const handleClearFilters = () => {
    router.push(pathname);
  };

  return (
    <Button
      variant="outline"
      onClick={handleClearFilters}
      className="gap-2"
    >
      <X className="h-4 w-4" />
      Clear Filters
    </Button>
  );
};

export default ClearFiltersButton;