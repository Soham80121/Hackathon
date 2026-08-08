import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
} from "chart.js";

import { Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend
);

export default function AnalyticsChart({ weeklyQueries = [] }) {
  // If we have dynamic data, use it; otherwise fallback to defaults
  const hasData = weeklyQueries && weeklyQueries.length > 0;
  const labels = hasData ? weeklyQueries.map(q => q.day) : ["Mon","Tue","Wed","Thu","Fri","Sat"];
  const queriesData = hasData ? weeklyQueries.map(q => q.queries) : [8,12,18,10,20,24];

  const data = {
    labels: labels,

    datasets: [

      {
        label: "AI Queries",

        data: queriesData,

        borderColor: "#2563eb",

        backgroundColor: "#2563eb",

        tension: 0.4,
      },

    ],
  };

  return (

    <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-lg p-6">

      <h2 className="text-xl font-bold mb-6">

        Weekly AI Queries

      </h2>

      <div className="relative h-64 sm:h-80 w-full">
        <Line data={data} options={{ responsive: true, maintainAspectRatio: false }} />
      </div>

    </div>

  );

}
