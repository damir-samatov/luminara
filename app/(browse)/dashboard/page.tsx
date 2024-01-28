import { getDashboardData } from "@/actions/dashboard.actions";
// import StreamActions from "@/app/(browse)/dashboard/_components/StreamActions";
// import { StreamWrapper } from "@/components/StreamWrapper";
import { notFound } from "next/navigation";
import { MyProfile } from "@/app/(browse)/dashboard/_components/MyProfile";

const DashboardPage = async () => {
  const res = await getDashboardData();

  if (!res.success) return notFound();

  return (
    <div>
      <h1>My Profile</h1>
      <MyProfile />
      {/*<StreamWrapper hostUserId={res.data.self.id} />*/}
      {/*<StreamActions />*/}
      {/*<pre>{JSON.stringify(res.data, null, 4)}</pre>*/}
    </div>
  );
};

export default DashboardPage;
