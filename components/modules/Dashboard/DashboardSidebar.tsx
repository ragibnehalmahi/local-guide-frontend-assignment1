import { getDefaultDashboardRoute } from "@/lib/auth-utils";
import { getNavItemsByRole } from "@/lib/navItems.config";
import { getUserInfo } from "@/services/user/user.service";  
import { UserInfo } from "@/types/user.interface";
import DashboardSidebarContent from "./DashboardSidebarContent";

const DashboardSidebar = async () => {
  const currentUser = (await getUserInfo()) as UserInfo;
  const sidebarSections = await getNavItemsByRole(currentUser.role);
  const homePath = getDefaultDashboardRoute(currentUser.role);

  return (
    <DashboardSidebarContent
      userInfo={currentUser}
      navSections={sidebarSections}
      homeRoute={homePath}
    />
  );
};

export default DashboardSidebar;