import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Filler,
} from "chart.js";

import {
  Doughnut,
  Bar,
  Line,
} from "react-chartjs-2";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Filler
);

function AnalyticsChart({ stats }) {
  const doughnutData = {
    labels: ["Completed", "Processing", "Failed"],
    datasets: [
      {
        data: [
          stats.completed,
          stats.processing,
          stats.failed,
        ],
        backgroundColor: [
          "#22C55E",
          "#F59E0B",
          "#EF4444",
        ],
        borderColor: [
          "#16A34A",
          "#D97706",
          "#DC2626",
        ],
        borderWidth: 2,
      },
    ],
  };

  const barData = {
    labels: ["Completed", "Processing", "Failed"],
    datasets: [
      {
        label: "Documents",
        data: [
          stats.completed,
          stats.processing,
          stats.failed,
        ],
        backgroundColor: [
          "#22C55E",
          "#F59E0B",
          "#EF4444",
        ],
        borderRadius: 8,
      },
    ],
  };

  const lineData = {
    labels:
      stats.monthly_uploads?.map((item) => item.month) || [],
    datasets: [
      {
        label: "Monthly Uploads",
        data:
          stats.monthly_uploads?.map((item) => item.count) || [],
        borderColor: "#65735B",
        backgroundColor: "rgba(101,115,91,0.15)",
        fill: true,
        tension: 0.4,
        pointBackgroundColor: "#65735B",
        pointRadius: 5,
      },
    ],
  };

  const doughnutOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "bottom",
      },
    },
    cutout: "70%",
  };

  const commonOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
    },
  };

  return (
    <div className="mt-10 rounded-3xl border border-stone-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-8 shadow-sm">

      <h2 className="text-3xl font-bold mb-8 text-stone-900 dark:text-white">
        Analytics Overview
      </h2>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-10">

        <SummaryCard
          title="Documents"
          value={stats.total_documents}
          color="bg-blue-50 dark:bg-blue-900/20"
        />

        <SummaryCard
          title="Completed"
          value={stats.completed}
          color="bg-green-50 dark:bg-green-900/20"
        />

        <SummaryCard
          title="Processing"
          value={stats.processing}
          color="bg-yellow-50 dark:bg-yellow-900/20"
        />

        <SummaryCard
          title="Failed"
          value={stats.failed}
          color="bg-red-50 dark:bg-red-900/20"
        />

      </div>

      <div className="grid lg:grid-cols-2 gap-8">

        <div className="rounded-2xl bg-stone-50 dark:bg-slate-800 p-6">

          <h3 className="font-semibold text-lg mb-5 text-stone-900 dark:text-white">
            Status Distribution
          </h3>

          <Doughnut
            data={doughnutData}
            options={doughnutOptions}
          />

        </div>

        <div className="rounded-2xl bg-stone-50 dark:bg-slate-800 p-6">

          <h3 className="font-semibold text-lg mb-5 text-stone-900 dark:text-white">
            Status Comparison
          </h3>

          <Bar
            data={barData}
            options={commonOptions}
          />

        </div>

        <div className="lg:col-span-2 rounded-2xl bg-stone-50 dark:bg-slate-800 p-6">

          <h3 className="font-semibold text-lg mb-5 text-stone-900 dark:text-white">
            Monthly Upload Trend
          </h3>

          <Line
            data={lineData}
            options={commonOptions}
          />

        </div>

      </div>

    </div>
  );
}

function SummaryCard({ title, value, color }) {
  return (
    <div className={`${color} rounded-2xl p-6`}>

      <p className="text-sm text-stone-500 dark:text-slate-400">
        {title}
      </p>

      <h2 className="mt-2 text-3xl font-bold text-stone-900 dark:text-white">
        {value}
      </h2>

    </div>
  );
}

export default AnalyticsChart; 