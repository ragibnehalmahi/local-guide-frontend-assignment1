// src/app/(dashboardLayout)/(touristDashboardLayout)/dashboard/layout.tsx
import React from "react";
 

const TouristDashboardLayout = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <div className="flex min-h-screen bg-gray-50">
      
      <main className="flex-1 p-6 overflow-y-auto">
        <div className="max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
};

export default TouristDashboardLayout;

 