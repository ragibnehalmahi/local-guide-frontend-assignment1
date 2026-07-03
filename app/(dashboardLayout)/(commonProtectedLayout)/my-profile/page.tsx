
//app/(dashboardLayout)/(commonProtectedLayout)/my-profile/page.tsx

import { getUserInfo } from "@/services/user/user.service";
import MyProfile from "@/components/modules/MyProfile/MyProfile";

const MyProfilePage = async () => {
  const userData = await getUserInfo();

  return <MyProfile userInfo={userData} />;
};

export default MyProfilePage;