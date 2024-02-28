import { getDashboardData } from "@/actions/dashboard.actions";
import { notFound } from "next/navigation";
import { MyProfile } from "@/app/(browse)/dashboard/_components/MyProfile";
import { AwsStreamPlayer } from "@/components/AwsStreamPlayer";

const DashboardPage = async () => {
  const res = await getDashboardData();

  if (!res.success) return notFound();

  return (
    <div>
      <AwsStreamPlayer />
      <MyProfile />
    </div>
  );
};

export default DashboardPage;
