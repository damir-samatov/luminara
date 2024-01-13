import { getDashboardData } from "@/actions/dashboard.actions";
import { redirectToSignIn } from "@clerk/nextjs";

const DashboardPage = async () => {
  const data = await getDashboardData();
  if (!data.success) return redirectToSignIn();
  console.log(data);

  return (
    <div>
      <h1>Dashboard</h1>
      <p>This is the dashboard page</p>
      <pre>
        <code className="code">{JSON.stringify(data, null, 2)}</code>
      </pre>
    </div>
  );
};

export default DashboardPage;
