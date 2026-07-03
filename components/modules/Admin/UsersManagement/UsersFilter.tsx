"use client";

import ClearFiltersButton from "@/components/shared/ClearFiltersButton";  
import RefreshButton from "@/components/shared/RefreshButton";  
import SearchFilter from "@/components/shared/SearchFilter";  
import SelectFilter from "@/components/shared/SelectFilter";  

const UsersFilter = () => {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-3">
        <SearchFilter paramName="searchTerm" placeholder="Search users..." />
        <RefreshButton />
      </div>

      <div className="flex items-center gap-3">
        <SelectFilter
          paramName="role"
          placeholder="Role"
          defaultValue="All Roles"
          options={[
            { label: "Tourist", value: "tourist" },
            { label: "Guide", value: "guide" },
            { label: "Admin", value: "admin" },
          ]}
        />

        <SelectFilter
          paramName="status"
          placeholder="Status"
          defaultValue="All Statuses"
          options={[
            { label: "Active", value: "ACTIVE" },
            { label: "Inactive", value: "INACTIVE" },
            { label: "Blocked", value: "BLOCKED" },
            { label: "Deleted", value: "DELETED" },
          ]}
        />

        <ClearFiltersButton />
      </div>
    </div>
  );
};

export default UsersFilter;