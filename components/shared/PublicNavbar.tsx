// src/components/shared/PublicNavbar.tsx 

import { getCookie } from "@/services/auth/tokenHandlers";
import { Menu } from "lucide-react";
import Link from "next/link";
import { Button } from "../ui/button";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "../ui/sheet";
import LogoutButton from "./LogoutButton";

// Assuming you have a function to get user role from token or cookie
// You can implement this based on your JWT decoding logic
const getUserRole = async (): Promise<string | null> => {
  const accessToken = await getCookie("accessToken");
  if (!accessToken) return null;
  // Decode the token to get role (e.g., using jwt-decode library)
  // For simplicity, assuming role is stored in a cookie or decoded here
  // Replace with actual decoding logic
  // Example: const decoded = jwtDecode(accessToken); return decoded.role;
  // Here, I'll mock it; in real code, implement properly
  return await getCookie("userRole"); // Assuming you store role in a separate cookie
};

const Navbar = async () => {
  const accessToken = await getCookie("accessToken");
  const userRole = await getUserRole();

  const isLoggedIn = !!accessToken;

  // Define nav items based on role
  let navItems: { href: string; label: string }[] = [];
  // Fixed: Made 'label' optional since it's not needed when 'component' is provided
  let authItems: { href?: string; label?: string; component?: React.ReactNode }[] = [];

  if (!isLoggedIn) {
    navItems = [
      { href: "/explore", label: "Explore Tours" },
      { href: "/become-guide", label: "Become a Guide" },
    ];
    authItems = [
      { href: "/login", label: "Login" },
      { href: "/register", label: "Register" },
    ];
  } else if (userRole === "tourist") {
    navItems = [
      { href: "/explore", label: "Explore Tours" },
      { href: "/my-bookings", label: "My Bookings" },
      { href: "/profile", label: "Profile" },
    ];
    authItems = [{ component: <LogoutButton /> }];
  } else if (userRole === "guide") {
    navItems = [
      { href: "/explore", label: "Explore Tours" },
      { href: "/dashboard", label: "Dashboard" },
      { href: "/profile", label: "Profile" },
    ];
    authItems = [{ component: <LogoutButton /> }];
  } else if (userRole === "admin") {
    navItems = [
      { href: "/admin-dashboard", label: "Admin Dashboard" },
      { href: "/manage-users", label: "Manage Users" },
      { href: "/manage-listings", label: "Manage Listings" },
      { href: "/profile", label: "Profile" },
    ];
    authItems = [{ component: <LogoutButton /> }];
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur dark:bg-background/95">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center space-x-2">
          <span className="text-xl font-bold text-primary">Local Guide Platform</span>
        </Link>

        <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
          {navItems.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="text-foreground hover:text-primary transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden md:flex items-center space-x-2">
          {authItems.map((item, index) =>
            item.component ? (
              <div key={index}>{item.component}</div>
            ) : (
              <Link key={item.label} href={item.href!}>
                <Button>{item.label}</Button>
              </Link>
            )
          )}
        </div>

        {/* Mobile Menu */}
        <div className="md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline">
                <Menu />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px] p-4">
              <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
              <nav className="flex flex-col space-y-4 mt-8">
                {navItems.map((link) => (
                  <Link
                    key={link.label}
                    href={link.href}
                    className="text-lg font-medium"
                  >
                    {link.label}
                  </Link>
                ))}
                <div className="border-t pt-4 flex flex-col space-y-4">
                  {authItems.map((item, index) =>
                    item.component ? (
                      <div key={index} className="flex justify-center">
                        {item.component}
                      </div>
                    ) : (
                      <Link key={item.label} href={item.href!} className="text-lg font-medium">
                        <Button className="w-full">{item.label}</Button>
                      </Link>
                    )
                  )}
                </div>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};

export default Navbar;