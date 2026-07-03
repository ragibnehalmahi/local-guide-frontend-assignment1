import { 
  LayoutDashboard, 
  User, 
  Settings, 
  Calendar, 
  Map, 
  Star, 
  Heart, 
  Search, 
  Home, 
  Shield, 
  UserCheck, 
  Users, 
  Globe, 
  LogOut,
  Bell,
  Menu
} from "lucide-react";
import { LucideIcon } from "lucide-react";

/**
 * আইকন ম্যাপিং অবজেক্ট। 
 * এখানে কী (Key) হিসেবে স্ট্রিং এবং ভ্যালু হিসেবে Lucide কম্পোনেন্ট রাখা হয়েছে।
 */
const iconRegistry: Record<string, LucideIcon> = {
  LayoutDashboard,
  User,
  Settings,
  Calendar,
  Map,
  Star,
  Heart,
  Search,
  Home,
  Shield,
  UserCheck,
  Users,
  Globe,
  LogOut,
  Bell,
  Menu,
};

/**
 * একটি স্ট্রিং আইকন নাম ইনপুট নিয়ে সংশ্লিষ্ট LucideIcon রিটার্ন করে।
 * যদি আইকনটি না পাওয়া যায়, তবে ডিফল্ট হিসেবে 'Home' আইকন দেখাবে।
 */
export const getIcon = (iconName: string): LucideIcon => {
  const IconComponent = iconRegistry[iconName];
  
  if (!IconComponent) {
    console.warn(`Icon "${iconName}" not found in registry. Falling back to default.`);
    return Home; // ডিফল্ট আইকন
  }

  return IconComponent;
};