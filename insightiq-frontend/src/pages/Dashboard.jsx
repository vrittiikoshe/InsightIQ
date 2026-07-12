import DashboardLayout from "../components/dashboard/DashboardLayout";
import Sidebar from "../components/dashboard/Sidebar";
import Topbar from "../components/dashboard/Topbar";
import StatCard from "../components/dashboard/StatCard";
import UploadCard from "../components/dashboard/UploadCard";
import RecentDocuments from "../components/dashboard/RecentDocuments";

import {
  FileText,
  MessageSquare,
  BarChart3,
  Loader,
} from "lucide-react";

function Dashboard() {

  const hour = new Date().getHours();

  let greeting = "";

  if (hour < 12) {
    greeting = "Good Morning";
  } else if (hour < 17) {
    greeting = "Good Afternoon";
  } else if (hour < 21) {
    greeting = "Good Evening";
  } else {
    greeting = "Good Night";
  }

  return (
    <DashboardLayout
      sidebar={<Sidebar />}
      topbar={<Topbar />}
    >

      <h1 className="text-5xl font-bold">
        {greeting}, 👋
      </h1>

      <p className="mt-3 text-stone-500">
        Ready to analyze your documents today?
      </p>

      <div className="grid grid-cols-4 gap-6 mt-10">

        <StatCard
          title="Documents"
          value="25"
          subtitle="+5 this week"
          icon={<FileText className="text-[#65735B]" />}
        />

        <StatCard
          title="AI Chats"
          value="142"
          subtitle="+18 today"
          icon={<MessageSquare className="text-[#65735B]" />}
        />

        <StatCard
          title="Insights"
          value="94%"
          subtitle="Excellent"
          icon={<BarChart3 className="text-[#65735B]" />}
        />

        <StatCard
          title="Processing"
          value="3"
          subtitle="Running..."
          icon={<Loader className="text-[#65735B]" />}
        />

      </div>

      <UploadCard />
      <RecentDocuments />

    </DashboardLayout>
  );
}

export default Dashboard;