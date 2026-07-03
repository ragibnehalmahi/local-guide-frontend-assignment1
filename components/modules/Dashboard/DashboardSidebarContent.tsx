"use client";

import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { getIconComponent } from "@/lib/icon-mapper";
import { cn } from "@/lib/utils";
import { NavSection } from "@/types/dashboard.interface";
import { UserInfo } from "@/types/user.interface";
import { ScrollArea } from "@/components/ui/scroll-area";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface SidebarContentProps {
  userInfo: UserInfo;
  navSections: NavSection[];
  homeRoute: string;
}

const DashboardSidebarContent = ({
  userInfo,
  navSections,
  homeRoute,
}: SidebarContentProps) => {
  const currentPath = usePathname();

  return (
    <aside className="hidden md:flex h-full w-72 flex-col border-r bg-card">
      {/* Header */}
      <div className="flex h-16 items-center border-b px-6">
        <Link href={homeRoute}>
          <h1 className="text-xl font-bold text-primary">Local Guide Platform</h1>
        </Link>
      </div>

      {/* Navigation */}
      <ScrollArea className="flex-1 px-4 py-6">
        <nav className="grid gap-10">
          {navSections.map((section, idx) => (
            <section key={idx}>
              {section.title && (
                <h2 className="mb-4 px-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  {section.title}
                </h2>
              )}

              <ul className="grid gap-1">
                {section.items.map((navLink) => {
                  const active = currentPath === navLink.href;
                  const NavIcon = getIconComponent(navLink.icon);

                  return (
                    <li key={navLink.href}>
                      <Link
                        href={navLink.href}
                        className={cn(
                          "flex items-center gap-4 rounded-md px-3 py-2.5 text-sm font-medium transition-colors",
                          active
                            ? "bg-primary text-primary-foreground"
                            : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                        )}
                      >
                        <NavIcon className="h-4 w-4 shrink-0" />
                        <span className="flex-1">{navLink.title}</span>
                        {navLink.badge && (
                          <Badge variant={active ? "secondary" : "default"} className="ml-auto">
                            {navLink.badge}
                          </Badge>
                        )}
                      </Link>
                    </li>
                  );
                })}
              </ul>

              {idx < navSections.length - 1 && <Separator className="my-8" />}
            </section>
          ))}
        </nav>
      </ScrollArea>

      {/* User Footer */}
      <div className="border-t p-4">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10">
            <span className="text-sm font-bold text-primary">
              {userInfo.name.charAt(0).toUpperCase()}
            </span>
          </div>
          <div className="flex-1 overflow-hidden">
            <p className="truncate text-sm font-medium">{userInfo.name}</p>
            <p className="text-xs capitalize text-muted-foreground">
              {userInfo.role.toLowerCase()}
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default DashboardSidebarContent;