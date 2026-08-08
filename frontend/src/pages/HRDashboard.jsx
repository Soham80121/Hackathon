import React, { useState, useEffect } from "react";
import api from "../services/api";
import StatCard from "../components/StatCard";
import PolicyTable from "../components/PolicyTable";
import AnnouncementWidget from "../components/AnnouncementWidget";
import {
  UsersIcon,
  DocumentTextIcon,
  BellAlertIcon,
  CheckBadgeIcon,
} from "@heroicons/react/24/outline";

export default function HRDashboard() {
  const [stats, setStats] = useState({
    pendingLeaves: 0,
    totalEmployees: 0,
    totalPolicies: 0,
    totalNotifications: 0,
  });

  const [pendingLeaves, setPendingLeaves] = useState([]);
  const [alerts, setAlerts] = useState({ highBurnoutUsers: [], highRiskLeaves: [] });
  const [refresh, setRefresh] = useState(0);
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const statsRes = await api.get("/api/dashboard/stats"); 
        const employeesRes = await api.get("/api/employees");
        const policiesRes = await api.get("/api/policies");
        const leavesRes = await api.get("/api/leaves");
        const notificationsRes = await api.get("/api/notifications");
        const alertsRes = await api.get("/api/dashboard/alerts");
        const workloadRes = await api.get("/api/leaves/high-workload-risk");

        const pLeaves = leavesRes.data.filter(l => l.status === "Pending");

        setStats({
          pendingLeaves: pLeaves.length,
          totalEmployees: employeesRes.data.length,
          totalPolicies: policiesRes.data.length,
          totalNotifications: notificationsRes.data.length,
        });

        setPendingLeaves(pLeaves);
        setAlerts({
          highBurnoutUsers: alertsRes.data.highBurnoutUsers,
          highRiskLeaves: workloadRes.data
        });
      } catch (error) {
        console.error("Failed to fetch HR dashboard data", error);
      }
    };
    fetchDashboardData();
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
      <div className="bg-gradient-to-r from-teal-500 to-emerald-600 rounded-3xl p-8 mb-8 text-white shadow-lg">
        <h2 className="text-3xl font-bold mb-2">HR Dashboard</h2>
        <p className="text-teal-100">Welcome back, {user.name}. Here's your overview.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <StatCard title="Pending Leaves" value={stats.pendingLeaves} color="bg-orange-500" icon={<CheckBadgeIcon className="w-7 h-7" />} />
        <StatCard title="Employees" value={stats.totalEmployees} color="bg-blue-500" icon={<UsersIcon className="w-7 h-7" />} />
        <StatCard title="Policies" value={stats.totalPolicies} color="bg-green-500" icon={<DocumentTextIcon className="w-7 h-7" />} />
        <StatCard title="Notifications" value={stats.totalNotifications} color="bg-purple-500" icon={<BellAlertIcon className="w-7 h-7" />} />
      </div>

      {(alerts.highBurnoutUsers.length > 0 || alerts.highRiskLeaves.length > 0) && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {alerts.highBurnoutUsers.length > 0 && (
            <div className="bg-red-50 dark:bg-slate-800/50 border border-red-100 dark:border-red-900/50 p-6 rounded-2xl shadow-sm">
              <h3 className="text-red-800 dark:text-red-400 font-bold text-lg mb-3 flex items-center gap-2">
                ⚠️ High Burnout Alerts
              </h3>
              <ul className="space-y-2">
                {alerts.highBurnoutUsers.map(u => (
                  <li key={u._id} className="text-red-700 dark:text-red-300 text-sm bg-white dark:bg-slate-900 p-3 rounded-xl shadow-sm">
                    <span className="font-semibold">{u.name}</span> ({u.department}) - {u.burnoutReason}
                  </li>
                ))}
              </ul>
            </div>
          )}
          {alerts.highRiskLeaves.length > 0 && (
            <div className="bg-orange-50 dark:bg-slate-800/50 border border-orange-100 dark:border-orange-900/50 p-6 rounded-2xl shadow-sm">
              <h3 className="text-orange-800 dark:text-orange-400 font-bold text-lg mb-3 flex items-center gap-2">
                ⚠️ High Workload Risk Leaves
              </h3>
              <ul className="space-y-2">
                {alerts.highRiskLeaves.map(leave => (
                  <li key={leave._id} className="text-orange-700 dark:text-orange-300 text-sm bg-white dark:bg-slate-900 p-3 rounded-xl shadow-sm">
                    <span className="font-semibold">{leave.userId?.name}</span> - {leave.workloadReason}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        <div className="xl:col-span-2 space-y-8">
          <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-gray-100 dark:border-slate-800 p-8">
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
          <PolicyTable />
        </div>
        <div className="xl:col-span-1">
          <AnnouncementWidget />
        </div>
      </div>
    </div>
  );
}
