import React, { useState, useEffect } from "react";
import api from "../services/api";

export default function AnnouncementManager() {
  const [announcements, setAnnouncements] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    message: "",
    priority: "Normal",
    expiresAt: "",
  });

  const fetchAnnouncements = async () => {
    try {
      const { data } = await api.get("/api/announcements");
      setAnnouncements(data);
    } catch (error) {
      console.error("Failed to fetch announcements", error);
    }
  };

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post("/api/announcements", {
        ...formData,
        expiresAt: formData.expiresAt || null,
      });
      setIsModalOpen(false);
      setFormData({ title: "", message: "", priority: "Normal", expiresAt: "" });
      fetchAnnouncements();
    } catch (error) {
      console.error("Failed to create announcement", error);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this announcement?")) return;
    try {
      await api.delete(`/api/announcements/${id}`);
      fetchAnnouncements();
    } catch (error) {
      console.error("Failed to delete announcement", error);
    }
  };

  const handleToggleStatus = async (id, currentStatus) => {
    try {
      await api.put(`/api/announcements/${id}`, { isActive: !currentStatus });
      fetchAnnouncements();
    } catch (error) {
      console.error("Failed to update status", error);
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-gray-100 dark:border-slate-800 p-8 mb-8">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-2xl font-bold text-gray-800 dark:text-darktext-primary">Announcement Management</h3>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-xl transition font-medium"
        >
          + Create Announcement
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left min-w-[800px]">
          <thead className="bg-gray-50 dark:bg-slate-900/50 border-b border-gray-100 dark:border-slate-800">
            <tr>
              <th className="p-4 font-semibold text-gray-600 dark:text-darktext-muted">Title</th>
              <th className="p-4 font-semibold text-gray-600 dark:text-darktext-muted">Priority</th>
              <th className="p-4 font-semibold text-gray-600 dark:text-darktext-muted">Created By</th>
              <th className="p-4 font-semibold text-gray-600 dark:text-darktext-muted">Dates</th>
              <th className="p-4 font-semibold text-gray-600 dark:text-darktext-muted">Status</th>
              <th className="p-4 font-semibold text-gray-600 dark:text-darktext-muted text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {announcements.length === 0 ? (
              <tr>
                <td colSpan="6" className="p-8 text-center text-gray-500 dark:text-darktext-muted italic">No announcements found.</td>
              </tr>
            ) : (
              announcements.map((ann) => (
                <tr key={ann._id} className="hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors">
                  <td className="p-4 font-medium text-gray-800 dark:text-darktext-primary">{ann.title}</td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      ann.priority === 'Urgent' ? 'bg-red-100 text-red-700' :
                      ann.priority === 'Important' ? 'bg-orange-100 text-orange-700' : 'bg-blue-100 text-blue-700'
                    }`}>
                      {ann.priority}
                    </span>
                  </td>
                  <td className="p-4 text-sm text-gray-600 dark:text-darktext-muted">{ann.createdByName}</td>
                  <td className="p-4 text-sm text-gray-600 dark:text-darktext-muted">
                    <div>Created: {new Date(ann.createdAt).toLocaleDateString()}</div>
                    {ann.expiresAt && <div className="text-gray-400">Expires: {new Date(ann.expiresAt).toLocaleDateString()}</div>}
                  </td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${ann.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-darktext-muted'}`}>
                      {ann.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="p-4 text-right space-x-3">
                    <button
                      onClick={() => handleToggleStatus(ann._id, ann.isActive)}
                      className="text-sm font-medium text-indigo-600 hover:text-indigo-800"
                    >
                      {ann.isActive ? 'Deactivate' : 'Activate'}
                    </button>
                    <button
                      onClick={() => handleDelete(ann._id)}
                      className="text-sm font-medium text-red-600 hover:text-red-800"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl w-full max-w-md p-6">
            <h3 className="text-2xl font-bold mb-4 text-gray-800 dark:text-darktext-primary">New Announcement</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Title</label>
                <input
                  type="text"
                  required
                  className="w-full p-3 border rounded-xl"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Message</label>
                <textarea
                  required
                  className="w-full p-3 border rounded-xl h-24"
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                ></textarea>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Priority</label>
                  <select
                    className="w-full p-3 border rounded-xl"
                    value={formData.priority}
                    onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                  >
                    <option value="Normal">Normal</option>
                    <option value="Important">Important</option>
                    <option value="Urgent">Urgent</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Expiry Date (Optional)</label>
                  <input
                    type="date"
                    className="w-full p-3 border rounded-xl"
                    value={formData.expiresAt}
                    onChange={(e) => setFormData({ ...formData, expiresAt: e.target.value })}
                  />
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2 text-gray-600 dark:text-darktext-muted hover:bg-gray-100 dark:bg-slate-800 rounded-xl font-medium transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 font-medium transition"
                >
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
