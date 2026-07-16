import DashboardLayout from "../components/dashboard/DashboardLayout";
import Sidebar from "../components/dashboard/Sidebar";
import Topbar from "../components/dashboard/Topbar";
import StatCard from "../components/dashboard/StatCard";
import UploadCard from "../components/dashboard/UploadCard";
import RecentDocuments from "../components/dashboard/RecentDocuments";
import { useEffect, useState } from "react";
import { getDashboardStats } from "../services/dashboardService";
import AnalyticsChart from "../components/dashboard/AnalyticsChart";

import {
  FileText,
  MessageSquare,
  BarChart3,
  Loader,
} from "lucide-react";

function Dashboard() {

  const hour = new Date().getHours();

  let greeting = "";
  const [searchQuery, setSearchQuery] = useState("");

  const [stats, setStats] = useState({
  total_documents: 0,
  completed: 0,
  processing: 0,
  failed: 0,
  ai_chats: 0,
});

useEffect(() => {
  loadStats();
}, []);

const loadStats = async () => {
  try {
    const data = await getDashboardStats();
    setStats(data);
  } catch (error) {
    console.error("Error loading dashboard stats:", error);
  }
};

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
      topbar={
        <Topbar
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
        />
    }
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
          value={stats.total_documents}
          subtitle="Uploaded documents"
          icon={<FileText className="text-[#65735B]" />}
        />

        <StatCard
          title="AI Chats"
          value={stats.ai_chats}
          subtitle="Questions asked"
          icon={<MessageSquare className="text-[#65735B]" />}
        />

        <StatCard
          title="Insights"
          value={stats.completed}
          subtitle="Completed analyses"
          icon={<BarChart3 className="text-[#65735B]" />}
        />

        <StatCard
          title="Processing"
          value={stats.processing}
          subtitle="Currently processing"
          icon={<Loader className="text-[#65735B]" />}
        />

      </div>

      <UploadCard />
      <AnalyticsChart stats={stats} />
      <RecentDocuments searchQuery={searchQuery} />

    </DashboardLayout>
  );
}

export default Dashboard;