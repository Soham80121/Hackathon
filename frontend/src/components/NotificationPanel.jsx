import { useState, useEffect, useRef } from "react";
import { BellIcon, CheckIcon, TrashIcon } from "@heroicons/react/24/outline";
import api from "../services/api";

export default function NotificationPanel() {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [expandedId, setExpandedId] = useState(null);
  const panelRef = useRef(null);

  const handleNotificationClick = (id) => {
    setExpandedId(expandedId === id ? null : id);
    const notif = notifications.find(n => n._id === id);
    if (notif && !notif.isRead) {
      markAsRead(id);
    }
  };

  const fetchNotifications = async () => {
    try {
      const res = await api.get("/api/notifications");
      setNotifications(res.data);
    } catch (err) {
      console.error("Failed to fetch notifications", err);
    }
  };

  useEffect(() => {
    fetchNotifications();
    // Fetch every 30 seconds for a "real-time" feel without WebSockets
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (panelRef.current && !panelRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const markAsRead = async (id) => {
    try {
      await api.put(`/api/notifications/${id}/read`);
      setNotifications(notifications.map(n => n._id === id ? { ...n, isRead: true } : n));
    } catch (err) {
      console.error(err);
    }
  };

  const markAllAsRead = async () => {
    try {
      await api.put("/api/notifications/read-all");
      setNotifications(notifications.map(n => ({ ...n, isRead: true })));
    } catch (err) {
      console.error(err);
    }
  };

  const deleteNotification = async (id) => {
    try {
      await api.delete(`/api/notifications/${id}`);
      setNotifications(notifications.filter(n => n._id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const clearAll = async () => {
    try {
      await api.delete("/api/notifications");
      setNotifications([]);
    } catch (err) {
      console.error(err);
    }
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const getTimeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = Math.floor((now - date) / 1000); // in seconds

    if (diff < 60) return "Just now";
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return `${Math.floor(diff / 86400)}d ago`;
  };

  const getIconColor = (type) => {
    switch (type) {
      case "success": return "bg-green-100 text-green-600";
      case "error": return "bg-red-100 text-red-600";
      case "warning": return "bg-yellow-100 text-yellow-600";
      default: return "bg-blue-100 text-blue-600";
    }
  };

  return (
    <div className="relative" ref={panelRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-xl hover:bg-gray-100 dark:bg-slate-800 transition"
      >
        <BellIcon className="w-7 h-7 text-gray-700 dark:text-darktext-secondary" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 rounded-full text-white text-[10px] font-bold flex items-center justify-center">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-gray-100 dark:border-slate-800 z-50 overflow-hidden">
          <div className="p-4 border-b border-gray-100 dark:border-slate-800 flex justify-between items-center bg-gray-50 dark:bg-slate-800">
            <h3 className="font-bold text-gray-800 dark:text-darktext-primary">Notifications</h3>
            {notifications.length > 0 && (
              <div className="flex gap-3 text-sm">
                <button 
                  onClick={markAllAsRead} 
                  className="text-blue-600 hover:text-blue-800 font-medium transition"
                >
                  Mark all read
                </button>
                <button 
                  onClick={clearAll} 
                  className="text-gray-500 dark:text-darktext-muted hover:text-red-600 font-medium transition"
                >
                  Clear all
                </button>
              </div>
            )}
          </div>

          <div className="max-h-[400px] overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-8 text-center text-gray-500 dark:text-darktext-muted">
                <BellIcon className="w-12 h-12 mx-auto text-gray-300 mb-2" />
                <p>No notifications yet</p>
              </div>
            ) : (
              notifications.map((notification) => (
                <div 
                  key={notification._id} 
                  onClick={() => handleNotificationClick(notification._id)}
                  className={`p-4 border-b border-gray-50 dark:border-slate-800 hover:bg-gray-50 dark:hover:bg-slate-800 transition group flex gap-3 cursor-pointer ${!notification.isRead ? 'bg-blue-50/30 dark:bg-blue-900/30' : ''}`}
                >
                  <div className={`mt-1 flex-shrink-0 w-2 h-2 rounded-full ${!notification.isRead ? 'bg-blue-500' : 'bg-transparent'}`}></div>
                  
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm ${!notification.isRead ? 'font-semibold text-gray-800 dark:text-darktext-primary' : 'text-gray-600 dark:text-darktext-secondary'}`}>
                      {notification.title}
                    </p>
                    <p className={`text-sm text-gray-500 dark:text-darktext-muted mt-0.5 ${expandedId === notification._id ? 'break-words' : 'truncate'}`}>
                      {notification.message}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      {getTimeAgo(notification.createdAt)}
                    </p>
                  </div>

                  <div className="flex-shrink-0 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition">
                    {!notification.isRead && (
                      <button 
                        onClick={(e) => { e.stopPropagation(); markAsRead(notification._id); }}
                        className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                        title="Mark as read"
                      >
                        <CheckIcon className="w-4 h-4" />
                      </button>
                    )}
                    <button 
                      onClick={(e) => { e.stopPropagation(); deleteNotification(notification._id); }}
                      className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition"
                      title="Delete"
                    >
                      <TrashIcon className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
