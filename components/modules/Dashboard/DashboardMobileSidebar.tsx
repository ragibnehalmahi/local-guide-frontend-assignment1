"use client";

import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { SheetTitle } from "@/components/ui/sheet";
import { getIconComponent } from "@/lib/icon-mapper";
import { cn } from "@/lib/utils";
import { NavSection } from "@/types/dashboard.interface";
import { UserInfo } from "@/types/user.interface";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface MobileSidebarProps {
  userInfo: UserInfo;
  navSections: NavSection[];
  homeRoute: string;
}

const DashboardMobileSidebar = ({
  userInfo,
  navSections,
  homeRoute,
}: MobileSidebarProps) => {
  const currentPath = usePathname();

  return (
    <div className="flex h-full flex-col">
      {/* Brand Header */}
      <div className="flex h-16 items-center justify-start border-b px-6">
        <Link href={homeRoute}>
          <h1 className="text-xl font-bold text-primary">Local Guide Platform</h1>
        </Link>
      </div>

      <SheetTitle className="sr-only">Mobile Navigation</SheetTitle>

      {/* Menu Items */}
      <ScrollArea className="flex-1 px-4 py-5">
        <nav className="grid gap-8">
          {navSections.map((group, groupIndex) => (
            <div key={groupIndex}>
              {group.title && (
                <p className="mb-3 px-2 text-xs font-medium uppercase text-muted-foreground tracking-wide">
                  {group.title}
                </p>
              )}

              <ul className="grid gap-1">
                {group.items.map((linkItem) => {
                  const isCurrent = currentPath === linkItem.href;
                  const IconComponent = getIconComponent(linkItem.icon);

                  return (
                    <li key={linkItem.href}>
                      <Link
                        href={linkItem.href}
                        className={cn(
                          "flex items-center gap-4 rounded-md px-3 py-2.5 text-sm font-medium transition-colors",
                          isCurrent
                            ? "bg-primary text-primary-foreground"
                            : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                        )}
                      >
                        <IconComponent className="h-4 w-4 shrink-0" />
                        <span className="flex-1 truncate">{linkItem.title}</span>
                        {linkItem.badge && (
                          <Badge variant={isCurrent ? "secondary" : "default"}>
                            {linkItem.badge}
                          </Badge>
                        )}
                      </Link>
                    </li>
                  );
                })}
              </ul>

              {groupIndex < navSections.length - 1 && <Separator className="my-6" />}
            </div>
          ))}
        </nav>
      </ScrollArea>

      {/* User Section */}
      <div className="border-t p-4">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10">
            <span className="text-sm font-bold text-primary">
              {userInfo.name.charAt(0).toUpperCase()}
            </span>
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium">{userInfo.name}</p>
            <p className="text-xs capitalize text-muted-foreground">
              {userInfo.role.toLowerCase()}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardMobileSidebar;