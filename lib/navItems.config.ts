
//local-guide-frontend/my-app/lib/navItems.config.ts    
import { getMyBookings } from "@/services/booking/booking.service";
import { IBooking } from "@/types/booking.interface";
import { NavSection } from "@/types/dashboard.interface";
import { getDefaultDashboardRoute } from "./auth-utils";
import { UserRole } from "@/types/auth.interface";
import { User } from "lucide-react";

// ১. Common navigation items সবার জন্য
export const getCommonNavItems = (role: UserRole): NavSection[] => {
    const defaultDashboard = getDefaultDashboardRoute(role);

    return [
        {
            items: [
                {
                    title: "Home",
                    href: "/",
                    icon: "Home",
                    roles: ["tourist", "guide", "admin"],
                },
                {
                    title: "Dashboard",
                    href: defaultDashboard,
                    icon: "LayoutDashboard",
                    roles: ["tourist", "guide", "admin"],
                },
                {
                    title: "My Profile",
                    href: "/my-profile",
                    icon: "User",
                    roles: ["tourist", "guide", "admin"],
                },
            ]
        },
        {
            title: "Settings",
            items: [
                {
                    title: "Change Password",
                    href: "/change-password",
                    icon: "Settings",
                    roles: ["tourist", "guide", "admin"],
                },
            ],
        },
    ];
};

// ২. একটি কমন হেল্পার ফাংশন যা আপকামিং বুকিং কাউন্ট বের করবে (Code Duplication কমাতে)
const getUpcomingBookingsCount = async (status: string): Promise<string | undefined> => {
    try {
        const response = await getMyBookings(`status=${status}`);
        const now = new Date();

        // তারিখ চেক করার সময় ঐচ্ছিক চেইনিং (?.) এবং ডিফল্ট ভ্যালু ব্যবহার করা হয়েছে
        const futureBookings = response?.data?.filter((booking: IBooking) => {
            const tourDate = booking?.date ? new Date(booking.date) : null;
            return tourDate && tourDate > now;
        }) || [];

        return futureBookings.length > 0 ? futureBookings.length.toString() : undefined;
    } catch (error) {
        console.error("Error fetching bookings count:", error);
        return undefined;
    }
};

// ৩. GUIDE Navigation
export const getGuideNavItems = async (): Promise<NavSection[]> => {
    const upcomingCount = await getUpcomingBookingsCount("CONFIRMED");

    return [
        {
            title: "GUIDE IMPORTANT",
            items: [
                {
                    title: "My Tours",
                    href: "/guide/dashboard/listings",
                    icon: "Map",
                    roles: ["guide"],
                },
                {
                    title: "Bookings",
                    href: "/guide/dashboard/bookings",
                    icon: "Calendar",
                    badge: upcomingCount,
                    roles: ["guide"],
                },
                {
                    title: "Reviews",
                    href: "/guide/dashboard/reviews",
                    icon: "Star",
                    roles: ["guide"],
                },
                {
                    title: "Create a Tour",
                    href: "/guide/dashboard/listings/create",
                    icon: "Star",
                    roles: ["guide"],
                },
            ],
        }
    ];
};

// ৪. TOURIST Navigation
// export const getTouristNavItems = async (): Promise<NavSection[]> => {
//     const upcomingCount = await getUpcomingBookingsCount("CONFIRMED");

//     return [
//         {
//             title: "Bookings",
//             items: [
//                 {
//                     title: "My Bookings",
//                     href: "/dashboard/my-booking",
//                     icon: "Calendar",
//                     badge: upcomingCount,
//                     roles: ["tourist"],
//                 },
//                 {
//                     title: "Book a Tour",
//                     href: "/explore-tours",
//                     icon: "Search",
//                     roles: ["tourist"],
//                 },
//             ],
//         },
//         {
//             title: "My Activity",
//             items: [
//                 {
//                     title: "My Reviews",
//                     href: "/dashboard/my-reviews",
//                     icon: "Star",
//                     roles: ["tourist"],
//                 },
//                 {
//                     title: "Favorites",
//                     href: "/dashboard/favorites",
//                     icon: "Heart",
//                     roles: ["tourist"],
//                 },
//             ],
//         },
//     ];
// };
export const getTouristNavItems = async (): Promise<NavSection[]> => {
    // Upcoming বুকিং এর সংখ্যা আনার জন্য (বুকিং ট্যাবে ব্যাজ দেখানোর জন্য)
    const upcomingCount = await getUpcomingBookingsCount("CONFIRMED");


    return [
        // {
        //     title: "Overview",
        //     items: [
        //         {
        //             title: "Dashboard",
        //             href: "/tourist/dashboard",
        //             icon: "LayoutDashboard",
        //             roles: ["tourist"],
        //         },
        //     ],
        // },
        {
            title: "Tourist Important",
            items: [
                // {
                //     title: "My Bookings",
                //     href: "/tourist/dashboard/bookings",
                //     icon: "Calendar",
                //     badge: upcomingCount > 0 ? upcomingCount : undefined,
                //     roles: ["tourist"],
                // },
                {
                    title: "Explore Tours",
                    href: "/tourist/dashboard/listings",
                    icon: "Map",
                    roles: ["tourist"],
                }, {
                    title: "Bookings",
                    href: "/tourist/dashboard/bookings",
                    icon: "Map",
                    roles: ["tourist"],
                },
                {
                    title: "Wishlist",
                    href: "/tourist/dashboard/wishlist",
                    icon: "Heart",
                    roles: ["tourist"],
                },

            ],
        },
        {
            title: "Payments & Reviews",
            items: [
                {
                    title: "My Reviews",
                    href: "/tourist/dashboard/review",
                    icon: "Star",
                    roles: ["tourist"],
                },
                {
                    title: "Transaction History",
                    href: "/tourist/dashboard/payments",
                    icon: "CreditCard",
                    roles: ["tourist"],
                },

            ],
        },
        {
            title: "Account Settings",
            items: [
                {
                    title: "My Profile",
                    href: "/tourist/dashboard/profile",
                    icon: "User",
                    roles: ["tourist"],
                },
                {
                    title: "Settings",
                    href: "/tourist/dashboard/settings",
                    icon: "Settings",
                    roles: ["tourist"],
                },
            ],
        },
    ];
};
// ৫. ADMIN Navigation
export const adminNavItems: NavSection[] = [
    {
        title: "User Management",
        items: [

            {
                title: "Users",
                href: "/admin/dashboard/users-management",
                icon: "Users",
                roles: ["admin"],
            },
        ],
    },
    {
        title: "Tour Management",
        items: [{
            title: "LISTINGS MANAGEMENT",
            href: "/admin/dashboard/listings-management",
            icon: "Globe",
            roles: ["admin"],
        },

        {
            title: "BOOKINGS MANAGEMENT",
            href: "/admin/dashboard/bookings-management",
            icon: "Calendar",
            roles: ["admin"],
        },

        ],
    }
];

// ৬. Main function
export const getNavItemsByRole = async (role: UserRole): Promise<NavSection[]> => {
    const commonNavItems = getCommonNavItems(role);

    switch (role) {
        case "admin":
            return [...commonNavItems, ...adminNavItems];
        case "guide":
            return [...commonNavItems, ...(await getGuideNavItems())];
        case "tourist":
            return [...commonNavItems, ...(await getTouristNavItems())];
        default:
            return [];
    }
};



