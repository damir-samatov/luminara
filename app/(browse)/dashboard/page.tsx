import { getDashboardData } from "@/actions/dashboard.actions";
// import StreamActions from "@/app/(browse)/dashboard/_components/StreamActions";
// import { StreamWrapper } from "@/components/StreamWrapper";
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
      {/*<StreamWrapper hostUserId={res.data.self.id} />*/}
      {/*<StreamActions />*/}
      {/*<pre>{JSON.stringify(res.data, null, 4)}</pre>*/}
    </div>
  );
};

export default DashboardPage;
