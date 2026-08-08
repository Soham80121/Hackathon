import React, { useState, useEffect } from "react";
import api from "../services/api";
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
  Title,
} from "chart.js";
import { Doughnut, Bar, Line } from "react-chartjs-2";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title
);

export default function Reports() {
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const { data } = await api.get("/api/reports");
        setReportData(data);
      } catch (error) {
        console.error("Failed to fetch reports:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchReports();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64 text-gray-500 dark:text-darktext-muted">
        Loading reports...
      </div>
    );
  }

  if (!reportData) {
    return (
      <div className="flex justify-center items-center h-64 text-red-500">
        Failed to load reports.
      </div>
    );
  }

  const {
    totalEmployees,
    totalLeaves,
    pendingLeaves,
    approvedLeaves,
    rejectedLeaves,
    leavesByType,
    leavesByDepartment,
    monthlyTrends,
  } = reportData;

  // Chart Data preparation
  const typeChartData = {
    labels: Object.keys(leavesByType),
    datasets: [
      {
        data: Object.values(leavesByType),
        backgroundColor: [
          "#3b82f6", // blue-500
          "#ef4444", // red-500
          "#10b981", // emerald-500
          "#f59e0b", // amber-500
          "#8b5cf6", // violet-500
        ],
        borderWidth: 0,
      },
    ],
  };

  const departmentChartData = {
    labels: Object.keys(leavesByDepartment),
    datasets: [
      {
        label: "Leaves per Department",
        data: Object.values(leavesByDepartment),
        backgroundColor: "#6366f1", // indigo-500
        borderRadius: 6,
      },
    ],
  };

  const trendsChartData = {
    labels: Object.keys(monthlyTrends),
    datasets: [
      {
        label: "Leave Applications",
        data: Object.values(monthlyTrends),
        borderColor: "#06b6d4", // cyan-500
        backgroundColor: "rgba(6, 182, 212, 0.1)",
        borderWidth: 3,
        fill: true,
        tension: 0.4, // Smooth curve
      },
    ],
  };

  return (
    <div className="w-full space-y-8">
      <div>
        <h2 className="text-3xl font-bold text-gray-800 dark:text-darktext-primary">Reports</h2>
        <p className="text-gray-500 dark:text-darktext-muted mt-2">
          Comprehensive overview of organization metrics and leave trends.
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-800 flex flex-col items-center justify-center">
          <span className="text-gray-500 dark:text-darktext-muted text-sm font-medium">Total Employees</span>
          <span className="text-3xl font-bold text-blue-600 mt-2">{totalEmployees}</span>
        </div>
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-800 flex flex-col items-center justify-center">
          <span className="text-gray-500 dark:text-darktext-muted text-sm font-medium">Total Leaves</span>
          <span className="text-3xl font-bold text-gray-800 dark:text-darktext-primary mt-2">{totalLeaves}</span>
        </div>
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-800 flex flex-col items-center justify-center">
          <span className="text-gray-500 dark:text-darktext-muted text-sm font-medium">Pending Leaves</span>
          <span className="text-3xl font-bold text-amber-500 mt-2">{pendingLeaves}</span>
        </div>
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-800 flex flex-col items-center justify-center">
          <span className="text-gray-500 dark:text-darktext-muted text-sm font-medium">Approved Leaves</span>
          <span className="text-3xl font-bold text-emerald-500 mt-2">{approvedLeaves}</span>
        </div>
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-800 flex flex-col items-center justify-center">
          <span className="text-gray-500 dark:text-darktext-muted text-sm font-medium">Rejected Leaves</span>
          <span className="text-3xl font-bold text-red-500 mt-2">{rejectedLeaves}</span>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Leave Breakdown by Type */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-800 col-span-1 flex flex-col items-center">
          <h3 className="text-lg font-bold text-gray-800 dark:text-darktext-primary mb-6 w-full text-left">Leave by Type</h3>
          <div className="w-full max-w-[240px] flex-1 flex items-center">
            <Doughnut
              data={typeChartData}
              options={{ maintainAspectRatio: true, plugins: { legend: { position: 'bottom' } } }}
            />
          </div>
        </div>

        {/* Leave Breakdown by Department */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-800 col-span-1 lg:col-span-2">
          <h3 className="text-lg font-bold text-gray-800 dark:text-darktext-primary mb-6">Leave by Department</h3>
          <div className="w-full h-[250px]">
            <Bar
              data={departmentChartData}
              options={{ maintainAspectRatio: false, plugins: { legend: { display: false } } }}
            />
          </div>
        </div>
      </div>

      {/* Monthly Trends */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-800 w-full">
        <h3 className="text-lg font-bold text-gray-800 dark:text-darktext-primary mb-6">Monthly Leave Trends</h3>
        <div className="w-full h-[300px]">
          <Line
            data={trendsChartData}
            options={{ maintainAspectRatio: false, plugins: { legend: { display: false } } }}
          />
        </div>
      </div>
    </div>
  );
}
