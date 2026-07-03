"use client";

// import AISearchDialog from "@/components/shared/AISSearchDialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { NavSection } from "@/types/dashboard.interface";
import { UserInfo } from "@/types/user.interface";
import { Menu, Search } from "lucide-react";
import { useEffect, useState } from "react";
import DashboardMobileSidebar from "./DashboardMobileSidebar";
// import NotificationDropdown from "./NotificationDropdown";
import UserDropdown from  "./UserDropdown";

interface NavbarContentProps {
  userInfo: UserInfo;
  navItems?: NavSection[];
  dashboardHome?: string;
}

const DashboardNavbarContent = ({
  userInfo,
  navItems,
  dashboardHome,
}: NavbarContentProps) => {
  const [sheetOpen, setSheetOpen] = useState(false);
  const [isSmallScreen, setIsSmallScreen] = useState(false);
  const [query, setQuery] = useState("");
  const [aiSearchOpen, setAiSearchOpen] = useState(false);

  useEffect(() => {
    const detectScreenSize = () => setIsSmallScreen(window.innerWidth < 768);
    detectScreenSize();
    window.addEventListener("resize", detectScreenSize);
    return () => window.removeEventListener("resize", detectScreenSize);
  }, []);

  const triggerSearch = () => {
    if (query.trim()) setAiSearchOpen(true);
  };

  const handleEnter = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && query.trim()) triggerSearch();
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-16 items-center gap-6 px-4 md:px-8">
        {/* Mobile Menu */}
        <Sheet open={isSmallScreen && sheetOpen} onOpenChange={setSheetOpen}>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="ghost" size="icon">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-72 p-0">
            <DashboardMobileSidebar
              userInfo={userInfo}
              navSections={navItems || []}
              homeRoute={dashboardHome || "/"}
            />
          </SheetContent>
        </Sheet>

        {/* Search Area */}
        <div className="flex flex-1 items-center justify-end gap-3">
          <div className="relative hidden w-full max-w-md sm:block">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground cursor-pointer"
              onClick={triggerSearch}
            />
            <Input
              placeholder="Search doctors by symptoms..."
              className="pl-10 pr-4"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleEnter}
            />
          </div>

          {/* <AISearchDialog
            initialSymptoms={query}
            externalOpen={aiSearchOpen}
            onOpenChange={(open) => {
              setAiSearchOpen(open);
              if (!open) setQuery("");
            }}
            onSearchComplete={() => setQuery("")}
          /> */}
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-3">
          {/* <NotificationDropdown /> */}
          <UserDropdown userInfo={userInfo} />
        </div>
      </div>
    </header>
  );
};

export default DashboardNavbarContent;