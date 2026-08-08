import React, { useState, useEffect } from "react";
import api from "../services/api";
import StatCard from "../components/StatCard";
import PolicyTable from "../components/PolicyTable";
import AIAssistantCard from "../components/AIAssistantCard";
import AnnouncementWidget from "../components/AnnouncementWidget";

import {
  DocumentTextIcon,
  ChatBubbleLeftRightIcon,
  MegaphoneIcon,
} from "@heroicons/react/24/outline";

export default function EmployeeDashboard() {
  const [stats, setStats] = useState({
    totalPolicies: 0,
    totalAiQueries: 0,
  });
  const [announcementCount, setAnnouncementCount] = useState(0);

  const user = JSON.parse(localStorage.getItem("user") || "{}");

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await api.get("/api/dashboard/employee-stats");
        setStats(response.data);
      } catch (error) {
        console.error("Failed to fetch employee dashboard stats", error);
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="w-full">
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-3xl p-8 mb-8 text-white shadow-lg">
        <h2 className="text-3xl font-bold mb-2">Welcome back, {user.name}!</h2>
        <p className="text-blue-100">Here's what's happening at Kyuka AI today.</p>
      </div>

      {(stats.burnoutScore === "High" || stats.burnoutScore === "Medium") && (
        <div className={`mb-8 p-6 rounded-2xl shadow-sm border ${stats.burnoutScore === 'High' ? 'bg-red-50 border-red-100' : 'bg-orange-50 border-orange-100'}`}>
          <h3 className={`font-bold text-lg mb-2 flex items-center gap-2 ${stats.burnoutScore === 'High' ? 'text-red-800' : 'text-orange-800'}`}>
            ⚠️ Wellbeing Alert
          </h3>
          <p className={`text-sm ${stats.burnoutScore === 'High' ? 'text-red-700' : 'text-orange-700'}`}>
            Our AI has noticed signs of {stats.burnoutScore.toLowerCase()} burnout: {stats.burnoutReason}. Please make sure you are taking care of yourself and consider discussing workload or time off with HR.
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatCard
          title="Company Policies"
          value={stats.totalPolicies}
          color="bg-blue-500"
          icon={<DocumentTextIcon className="w-7 h-7" />}
        />
        <StatCard
          title="My AI Queries"
          value={stats.totalAiQueries}
          color="bg-purple-500"
          icon={<ChatBubbleLeftRightIcon className="w-7 h-7" />}
        />
        <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-gray-100 dark:border-slate-800 p-6 flex items-center justify-between">
          <div>
            <p className="text-gray-500 dark:text-darktext-muted font-medium mb-1">Announcements</p>
            <h3 className="text-3xl font-bold text-gray-800 dark:text-darktext-primary">{announcementCount}</h3>
          </div>
          <div className="w-14 h-14 rounded-full bg-orange-50 flex items-center justify-center text-orange-500">
            <MegaphoneIcon className="w-7 h-7" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        <div className="xl:col-span-2 space-y-8">
          <PolicyTable />
        </div>
        <div className="xl:col-span-1">
          <AnnouncementWidget onCountUpdate={setAnnouncementCount} />
          <AIAssistantCard />
        </div>
      </div>
    </div>
  );
}
