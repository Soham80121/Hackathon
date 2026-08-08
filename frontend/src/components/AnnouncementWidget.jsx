import React, { useState, useEffect } from "react";
import api from "../services/api";

export default function AnnouncementWidget({ onCountUpdate }) {
  const [announcements, setAnnouncements] = useState([]);

  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        const response = await api.get("/api/announcements");
        setAnnouncements(response.data);
        if (onCountUpdate) {
          onCountUpdate(response.data.length);
        }
      } catch (error) {
        console.error("Failed to fetch announcements", error);
      }
    };
    fetchAnnouncements();
  }, [onCountUpdate]);

  const getTimeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = Math.floor((now - date) / 1000); // in seconds
    if (diff < 60) return "Just now";
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return `${Math.floor(diff / 86400)}d ago`;
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "Urgent": return "text-red-600 bg-red-100";
      case "Important": return "text-orange-600 bg-orange-100";
      default: return "text-blue-600 bg-blue-100";
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-gray-100 dark:border-slate-800 p-6 mb-8">
      <h3 className="text-xl font-bold text-gray-800 dark:text-darktext-primary mb-4">Latest Announcements</h3>
      <div className="space-y-4">
        {announcements.length === 0 ? (
          <p className="text-sm text-gray-500 dark:text-darktext-muted italic">No active announcements.</p>
        ) : (
          announcements.map((ann) => (
            <div key={ann._id} className="p-4 bg-gray-50 dark:bg-slate-900/50 rounded-2xl relative">
              <span className={`absolute top-4 right-4 text-[10px] font-bold px-2 py-1 rounded-full ${getPriorityColor(ann.priority)}`}>
                {ann.priority}
              </span>
              <p className="font-semibold text-gray-800 dark:text-darktext-primary pr-16">{ann.title}</p>
              <p className="text-sm text-gray-500 dark:text-darktext-muted mt-1">{ann.message}</p>
              <p className="text-xs text-gray-400 mt-2">{getTimeAgo(ann.createdAt)}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
