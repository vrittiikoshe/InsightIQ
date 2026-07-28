import DashboardLayout from "../components/dashboard/DashboardLayout";
import Sidebar from "../components/dashboard/Sidebar";
import Topbar from "../components/dashboard/Topbar";
import AnalyticsChart from "../components/dashboard/AnalyticsChart";

import { useEffect, useState } from "react";
import { getAnalytics } from "../services/dashboardService";

function Analytics() {
  const [analytics, setAnalytics] = useState({
    total_documents: 0,
    completed: 0,
    processing: 0,
    failed: 0,
    monthly_uploads: [],
  });

  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = async () => {
    try {
      const data = await getAnalytics();
      setAnalytics(data);
    } catch (error) {
      console.error(error);
    }
  };

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
      <h1 className="text-4xl font-bold">
        Analytics Dashboard
      </h1>

      <p className="text-stone-500 mt-2">
        Insights about your uploaded documents.
      </p>

      <AnalyticsChart stats={analytics} />
    </DashboardLayout>
  );
}

export default Analytics;