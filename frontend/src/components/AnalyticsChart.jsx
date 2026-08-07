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

export default function AnalyticsChart() {

  const data = {
    labels: ["Mon","Tue","Wed","Thu","Fri","Sat"],

    datasets: [

      {
        label: "AI Queries",

        data: [8,12,18,10,20,24],

        borderColor: "#2563eb",

        backgroundColor: "#2563eb",

        tension: 0.4,
      },

    ],
  };

  return (

    <div className="bg-white rounded-3xl shadow-lg p-6">

      <h2 className="text-xl font-bold mb-6">

        Weekly AI Queries

      </h2>

      <Line data={data} />

    </div>

  );

}