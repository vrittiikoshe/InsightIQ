import DashboardLayout from "../components/dashboard/DashboardLayout";
import Sidebar from "../components/dashboard/Sidebar";
import Topbar from "../components/dashboard/Topbar";

function Dashboard() {
  return (
    <DashboardLayout
      sidebar={<Sidebar />}
      topbar={<Topbar />}
    >
      <h1 className="text-4xl font-bold">
        Welcome to InsightIQ
      </h1>

      <p className="mt-3 text-stone-500">
        Ready to analyze your documents today?
      </p>
    </DashboardLayout>
  );
}

export default Dashboard;