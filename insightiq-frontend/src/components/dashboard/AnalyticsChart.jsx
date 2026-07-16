import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";

import { Doughnut } from "react-chartjs-2";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend
);

function AnalyticsChart({ stats }) {
  const data = {
    labels: [
      "Completed",
      "Processing",
      "Failed",
    ],

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

  const options = {
    responsive: true,

    plugins: {
      legend: {
        position: "bottom",

        labels: {
          padding: 20,
          font: {
            size: 14,
            weight: "bold",
          },
        },
      },
    },

    cutout: "70%",
  };

  return (
    <div className="mt-10 bg-white rounded-3xl border border-stone-200 p-8">

      <h2 className="text-2xl font-bold mb-8">
        Document Analytics
      </h2>

      <div className="flex justify-center">

        <div className="w-[340px] h-[340px]">

          <Doughnut
            data={data}
            options={options}
          />

        </div>

      </div>

    </div>
  );
}

export default AnalyticsChart;