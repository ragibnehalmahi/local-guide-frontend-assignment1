"use client";

import { logoutUser } from '@/services/auth/auth.service';
import { Button } from "../ui/button";
import { toast } from "sonner";

const LogoutButton = () => {
  const handleLogout = async () => {
    try {
      // 1. Clear all client-side auth data from localStorage
      if (typeof window !== 'undefined') {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("user");
        localStorage.removeItem("userRole");
      }

      // 2. Call the server action to remove cookies and notify backend
      await logoutUser();
      
      toast.success("Logged out successfully");
      
      // 3. Force a full page reload to the login page to reset all React states/contexts
      window.location.href = "/login?logout=success";

    } catch (error) {
      console.error("Logout failed:", error);
      // Fallback redirect
      window.location.href = "/login";
    }
  };

  return (
    <Button 
      variant={"destructive"} 
      size="sm" 
      onClick={handleLogout}
      className="h-9 px-4 font-medium transition-all active:scale-[0.98]"
    >
      Logout
    </Button>
  );
};

export default LogoutButton;