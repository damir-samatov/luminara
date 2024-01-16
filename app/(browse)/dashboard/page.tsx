import { getDashboardData } from "@/actions/dashboard.actions";
import { redirectToSignIn } from "@clerk/nextjs";
import StreamActions from "@/app/(browse)/dashboard/_components/StreamActions";
import { StreamPlayer } from "@/components/StreamPlayer";

const DashboardPage = async () => {
  const res = await getDashboardData();

  if (!res.success) return redirectToSignIn();

  return (
    <div>
      <h1>
        <span>Streamer Dashboard</span>
      </h1>
      <StreamPlayer user={res.data.self} stream={res.data.stream} />
      <StreamActions />
      <pre>{JSON.stringify(res.data, null, 4)}</pre>
    </div>
  );
};

export default DashboardPage;
