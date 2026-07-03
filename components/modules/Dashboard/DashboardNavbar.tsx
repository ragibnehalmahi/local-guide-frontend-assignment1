import { getDefaultDashboardRoute } from "@/lib/auth-utils";
import { getNavItemsByRole } from "@/lib/navItems.config";
import { getUserInfo } from "@/services/user/user.service";  
import { UserInfo } from "@/types/user.interface";
import DashboardNavbarContent from "./DashboardNavbarContent";

const DashboardNavbar = async () => {
  const userData = (await getUserInfo()) as UserInfo;
  const navigationSections = await getNavItemsByRole(userData.role);
  const defaultHomeRoute = getDefaultDashboardRoute(userData.role);

  return (
    <DashboardNavbarContent
      userInfo={userData}
      navItems={navigationSections}
      dashboardHome={defaultHomeRoute}
    />
  );
};

export default DashboardNavbar;