import DashboardLayout from "../components/dashboard/DashboardLayout";
import Sidebar from "../components/dashboard/Sidebar";
import Topbar from "../components/dashboard/Topbar";
import StatCard from "../components/dashboard/StatCard";
import UploadCard from "../components/dashboard/UploadCard";
import RecentDocuments from "../components/dashboard/RecentDocuments";
import AnalyticsChart from "../components/dashboard/AnalyticsChart";

import { useEffect, useState } from "react";
import { getDashboardStats } from "../services/dashboardService";

import {
  FileText,
  BarChart3,
  Loader,
} from "lucide-react";


function Dashboard() {

  const hour = new Date().getHours();

  const [searchQuery, setSearchQuery] = useState("");

  // Used to refresh RecentDocuments
  const [documentsRefresh, setDocumentsRefresh] = useState(0);

  const [stats, setStats] = useState({
    total_documents: 0,
    completed: 0,
    processing: 0,
    failed: 0,
    ai_chats: 0,
    monthly_uploads: [],
  });


  // ==========================================
  // LOAD DASHBOARD STATS
  // ==========================================

  useEffect(() => {
    loadStats();
  }, []);


  const loadStats = async () => {

    try {

      const data = await getDashboardStats();

      setStats(data);

    } catch (error) {

      console.error(
        "Dashboard Stats Error:",
        error
      );

    }
  };


  // ==========================================
  // UPLOAD SUCCESS
  // ==========================================

  const handleUploadSuccess = () => {

    // Refresh dashboard cards + chart
    loadStats();

    // Refresh Recent Documents
    setDocumentsRefresh(
      (prev) => prev + 1
    );
  };


  // ==========================================
  // GREETING
  // ==========================================

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


  // ==========================================
  // UI
  // ==========================================

  return (

    <DashboardLayout

      sidebar={
        <Sidebar />
      }

      topbar={
        <Topbar
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
        />
      }

    >

      <div className="transition-colors">

        {/* ======================================
            GREETING
        ====================================== */}

        <h1
          className="
            text-5xl
            font-bold
            text-stone-900
            dark:text-white
          "
        >
          {greeting}, 👋
        </h1>


        <p
          className="
            mt-3
            text-stone-500
            dark:text-stone-400
          "
        >
          Ready to analyze your documents today?
        </p>


        {/* ======================================
            STAT CARDS
        ====================================== */}

        <div
          className="
            grid
            grid-cols-1
            md:grid-cols-2
            xl:grid-cols-3
            gap-6
            mt-10
          "
        >

          <StatCard
            title="Documents"
            value={stats.total_documents}
            subtitle="Uploaded documents"
            icon={
              <FileText
                className="text-[#65735B]"
              />
            }
          />
          <StatCard
            title="Insights"
            value={stats.completed}
            subtitle="Completed analyses"
            icon={
              <BarChart3
                className="text-[#65735B]"
              />
            }
          />


          <StatCard
            title="Processing"
            value={stats.processing}
            subtitle="Currently processing"
            icon={
              <Loader
                className="text-[#65735B]"
              />
            }
          />

        </div>


        {/* ======================================
            UPLOAD
        ====================================== */}

        <div className="mt-8">

          <UploadCard
            onUploadSuccess={
              handleUploadSuccess
            }
          />

        </div>


        {/* ======================================
            ANALYTICS
        ====================================== */}

        <div className="mt-8">

          <AnalyticsChart
            stats={stats}
          />

        </div>


        {/* ======================================
            RECENT DOCUMENTS
        ====================================== */}

        <div className="mt-8">

          <RecentDocuments
            searchQuery={searchQuery}
            refreshTrigger={documentsRefresh}
          />

        </div>

      </div>

    </DashboardLayout>

  );
}


export default Dashboard;