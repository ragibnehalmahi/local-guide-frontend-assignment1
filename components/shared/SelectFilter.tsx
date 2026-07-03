"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

interface SelectFilterProps {
  paramName: string;
  placeholder: string;
  defaultValue?: string;
  options: { label: string; value: string }[];
}

const SelectFilter = ({
  paramName,
  placeholder,
  defaultValue = "",
  options,
}: SelectFilterProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  
  const initialValue = searchParams.get(paramName) || defaultValue;
  const [value, setValue] = useState(initialValue);

  useEffect(() => {
    const params = new URLSearchParams(searchParams);
    
    if (value && value !== defaultValue) {
      params.set(paramName, value);
    } else {
      params.delete(paramName);
    }
    
    router.push(`${pathname}?${params.toString()}`);
  }, [value, paramName, pathname, router, searchParams, defaultValue]);

  return (
    <Select value={value} onValueChange={setValue}>
      <SelectTrigger className="w-full max-w-xs">
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value={defaultValue}>{placeholder}</SelectItem>
        {options.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default SelectFilter;