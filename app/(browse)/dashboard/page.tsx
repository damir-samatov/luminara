import { getDashboardData } from "@/actions/dashboard.actions";
import { redirectToSignIn } from "@clerk/nextjs";
import StreamActions from "@/app/(browse)/dashboard/_components/StreamActions";
import { StreamWrapper } from "@/components/StreamWrapper";

const DashboardPage = async () => {
  const res = await getDashboardData();

  if (!res.success) return redirectToSignIn();

  return (
    <div>
      <h1>
        <span>Streamer Dashboard</span>
      </h1>
      <StreamWrapper hostUserId={res.data.self.id} />
      <StreamActions />
      <pre>{JSON.stringify(res.data, null, 4)}</pre>
    </div>
  );
};

export default DashboardPage;
