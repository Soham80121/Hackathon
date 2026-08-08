import React, { useState, useEffect } from "react";
import api from "../services/api";
import UploadPolicy from "../components/UploadPolicy";
import StatCard from "../components/StatCard";
import PolicyTable from "../components/PolicyTable";
import AnalyticsChart from "../components/AnalyticsChart";
import AIAssistantCard from "../components/AIAssistantCard";
import AnnouncementManager from "../components/AnnouncementManager";

import {
  DocumentTextIcon,
  UsersIcon,
  ChatBubbleLeftRightIcon,
  ClockIcon,
} from "@heroicons/react/24/outline";

export default function AdminDashboard() {
  const [refresh, setRefresh] = useState(0);
  const [stats, setStats] = useState({
    totalPolicies: 0,
    totalEmployees: 0,
    totalAiQueries: 0,
    pendingLeaveRequests: 0,
  });
  const [weeklyQueries, setWeeklyQueries] = useState([]);
  const [alerts, setAlerts] = useState({ highBurnoutUsers: [], highRiskLeaves: [] });
  const [pendingLeaves, setPendingLeaves] = useState([]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await api.get("/api/dashboard/stats");
        setStats(response.data);
      } catch (error) {
        console.error("Failed to fetch dashboard stats", error);
      }
    };
    const fetchWeeklyQueries = async () => {
      try {
        const response = await api.get("/api/dashboard/weekly-ai-queries");
        setWeeklyQueries(response.data);
      } catch (error) {
        console.error("Failed to fetch weekly queries", error);
      }
    };
    const fetchLeaves = async () => {
      try {
        const response = await api.get("/api/leaves");
        const pLeaves = response.data.filter(l => l.status === "Pending");
        setPendingLeaves(pLeaves);
      } catch (error) {
        console.error("Failed to fetch leaves", error);
      }
    };
    const fetchAlerts = async () => {
      try {
        const response = await api.get("/api/dashboard/alerts");
        const workloadResponse = await api.get("/api/leaves/high-workload-risk");
        setAlerts({
          highBurnoutUsers: response.data.highBurnoutUsers,
          highRiskLeaves: workloadResponse.data
        });
      } catch (error) {
        console.error("Failed to fetch alerts", error);
      }
    };
    fetchStats();
    fetchWeeklyQueries();
    fetchLeaves();
    fetchAlerts();
  }, [refresh]);

  const getConfidenceLabel = (val) => {
    if (val >= 90) return "Very High Confidence";
    if (val >= 75) return "High Confidence";
    if (val >= 50) return "Moderate Confidence";
    return "Low Confidence";
  };

  const handleLeaveAction = async (leaveId, status) => {
    try {
      await api.put(`/api/leaves/${leaveId}/status`, { status });
      setRefresh(r => r + 1);
    } catch (error) {
      console.error("Failed to update leave status", error);
    }
  };

  return (
    <div className="w-full">
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Policies"
          value={stats.totalPolicies}
          color="bg-blue-500"
          icon={<DocumentTextIcon className="w-7 h-7" />}
        />
        <StatCard
          title="Employees"
          value={stats.totalEmployees}
          color="bg-green-500"
          icon={<UsersIcon className="w-7 h-7" />}
        />
        <StatCard
          title="AI Queries"
          value={stats.totalAiQueries}
          color="bg-purple-500"
          icon={<ChatBubbleLeftRightIcon className="w-7 h-7" />}
        />
        <StatCard
          title="Pending Leaves"
          value={stats.pendingLeaveRequests}
          color="bg-orange-500"
          icon={<ClockIcon className="w-7 h-7" />}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-red-50 dark:bg-slate-800/50 border border-red-100 dark:border-red-900/50 p-6 rounded-2xl shadow-sm">
          <h3 className="text-red-800 dark:text-red-400 font-bold text-lg mb-3 flex items-center gap-2">
            ⚠️ High Burnout Alerts
          </h3>
          {alerts.highBurnoutUsers.length > 0 ? (
            <ul className="space-y-2">
              {alerts.highBurnoutUsers.map(user => (
                <li key={user._id} className="text-red-700 dark:text-red-300 text-sm bg-white dark:bg-slate-900 p-3 rounded-xl shadow-sm">
                  <span className="font-semibold">{user.name}</span> ({user.department}) - {user.burnoutReason}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-red-600 dark:text-red-400 italic">No high burnout alerts at this time.</p>
          )}
        </div>

        <div className="bg-orange-50 dark:bg-slate-800/50 border border-orange-100 dark:border-orange-900/50 p-6 rounded-2xl shadow-sm">
          <h3 className="text-orange-800 dark:text-orange-400 font-bold text-lg mb-3 flex items-center gap-2">
            ⚠️ High Workload Risk Leaves
          </h3>
          {alerts.highRiskLeaves.length > 0 ? (
            <ul className="space-y-2">
              {alerts.highRiskLeaves.map(leave => (
                <li key={leave._id} className="text-orange-700 dark:text-orange-300 text-sm bg-white dark:bg-slate-900 p-3 rounded-xl shadow-sm">
                  <span className="font-semibold">{leave.userId?.name}</span> - {leave.workloadReason}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-orange-600 dark:text-orange-400 italic">No high workload risk leaves at this time.</p>
          )}
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-gray-100 dark:border-slate-800 p-8 mb-8">
        <h3 className="text-2xl font-bold text-gray-800 dark:text-darktext-primary mb-6">Pending Leave Requests</h3>
        {pendingLeaves.length === 0 ? (
          <p className="text-gray-500 dark:text-darktext-muted">No pending leave requests.</p>
        ) : (
          <div className="space-y-4">
            {pendingLeaves.map(leave => (
              <div key={leave._id} className="p-4 border rounded-xl flex flex-col md:flex-row justify-between gap-4">
                <div>
                  <p className="font-bold">{leave.userId?.name} <span className="text-sm font-normal text-gray-500 dark:text-darktext-muted">({leave.userId?.department})</span></p>
                  <p className="text-sm text-gray-600 dark:text-darktext-muted"><strong>Type:</strong> {leave.leaveType}</p>
                  <p className="text-sm text-gray-600 dark:text-darktext-muted"><strong>Dates:</strong> {new Date(leave.startDate).toLocaleDateString()} to {new Date(leave.endDate).toLocaleDateString()}</p>
                  <p className="text-sm text-gray-600 dark:text-darktext-muted mt-2"><strong>Reason:</strong> {leave.reason}</p>
                </div>
                <div className="bg-gray-50 dark:bg-slate-900/50 p-4 rounded-lg flex-1">
                  <p className="text-sm font-bold text-indigo-700">AI Recommendation: {leave.aiRecommendation}</p>
                  <p className="text-sm text-gray-600 dark:text-darktext-muted mt-1">{leave.aiReason}</p>
                  <p className="text-sm text-gray-600 dark:text-darktext-muted mt-1">
                    {leave.aiConfidence === null || typeof leave.aiConfidence === 'undefined'
                      ? "AI Confidence: Not available"
                      : `AI Confidence: ${leave.aiConfidence}% — ${getConfidenceLabel(leave.aiConfidence)}`}
                  </p>
                </div>
                <div className="flex flex-col gap-2 justify-center">
                  <button onClick={() => handleLeaveAction(leave._id, "Approved")} className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm transition">Approve</button>
                  <button onClick={() => handleLeaveAction(leave._id, "Rejected")} className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm transition">Reject</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <AnnouncementManager />

      <UploadPolicy onUploadSuccess={() => setRefresh(r => r + 1)} />
      <PolicyTable refreshTrigger={refresh} />

      <div className="grid grid-cols-1 mt-8">
        <AnalyticsChart weeklyQueries={weeklyQueries} />
      </div>

      <AIAssistantCard />
    </div>
  );
}
