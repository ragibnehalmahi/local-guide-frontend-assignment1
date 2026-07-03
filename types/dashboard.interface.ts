//app/types/dashboard.interface.ts  

import { UserRole } from "./auth.interface";



export interface NavItem {
    title: string;
    href: string;
    icon: string; // ✅ Changed from LucideIcon to string
    badge?: string | number;
    description?: string;
    roles: UserRole[];
}

export interface NavSection {
    title?: string;
    items: NavItem[];
}