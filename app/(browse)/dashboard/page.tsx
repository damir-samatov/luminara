import { getDashboardData } from "@/actions/dashboard.actions";
import { redirectToSignIn } from "@clerk/nextjs";
import StreamActions from "@/app/(browse)/dashboard/_components/StreamActions";
import { StreamPlayer } from "@/app/(browse)/users/[slug]/_components/StreamPlayer";

const DashboardPage = async () => {
  const res = await getDashboardData();

  if (!res.success) return redirectToSignIn();

  return (
    <>
      <h1>
        <span className="uppercase">{res.data.self.username}&apos;s</span>
        <span> Dashboard</span>
      </h1>
      <StreamActions />
      <pre>
        <code className="code">{JSON.stringify(res.data, null, 4)}</code>
      </pre>
      <StreamPlayer user={res.data.self} stream={res.data.stream} />
    </>
  );
};

export default DashboardPage;
