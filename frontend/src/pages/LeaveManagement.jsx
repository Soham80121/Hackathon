import React, { useState, useEffect } from "react";
import api from "../services/api";
import toast from "react-hot-toast";

const getConfidenceLabel = (val) => {
  if (val >= 90) return "Very High Confidence";
  if (val >= 75) return "High Confidence";
  if (val >= 50) return "Moderate Confidence";
  return "Low Confidence";
};

const LeaveTable = ({ leaves, user, type, onAction }) => {
  const showActionsAndAI = type === "team" && (user.role === "hr" || user.role === "admin");
  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-800 overflow-x-auto">
      <table className="w-full text-left min-w-[800px]">
        <thead className="bg-gray-50 dark:bg-slate-900/50 border-b border-gray-100 dark:border-slate-800">
          <tr>
            {showActionsAndAI && (
              <th className="p-4 font-semibold text-gray-600 dark:text-darktext-muted">Employee</th>
            )}
            <th className="p-4 font-semibold text-gray-600 dark:text-darktext-muted">Leave Type</th>
            <th className="p-4 font-semibold text-gray-600 dark:text-darktext-muted whitespace-nowrap">Dates</th>
            <th className="p-4 font-semibold text-gray-600 dark:text-darktext-muted whitespace-nowrap">Status</th>
            {showActionsAndAI && (
              <th className="p-4 font-semibold text-gray-600 dark:text-darktext-muted whitespace-nowrap">AI Rec</th>
            )}
            {showActionsAndAI && (
              <th className="p-4 font-semibold text-gray-600 dark:text-darktext-muted whitespace-nowrap">Actions</th>
            )}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50">
          {leaves.map((leave) => {
            // HR can't approve HR/Admin leaves. Disable buttons if needed.
            const applicantRole = leave.applicantRole || leave.userId?.role;
            const canApprove = user.role === "admin" || (user.role === "hr" && applicantRole === "employee");
            
            return (
            <tr key={leave._id} className="hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors">
              {showActionsAndAI && (
                <td className="p-4 text-gray-800 dark:text-darktext-primary">
                  {leave.userId?.name} <br />
                  <span className="text-xs text-gray-500 dark:text-darktext-muted">{leave.userId?.department}</span>
                </td>
              )}
              <td className="p-4 text-gray-800 dark:text-darktext-primary font-medium">{leave.leaveType}</td>
              <td className="p-4 text-gray-600 dark:text-darktext-muted">
                {new Date(leave.startDate).toLocaleDateString()} -{" "}
                {new Date(leave.endDate).toLocaleDateString()}
              </td>
              <td className="p-4 whitespace-nowrap">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap inline-block ${
                    leave.status === "Approved"
                      ? "bg-green-100 text-green-700"
                      : leave.status === "Rejected"
                      ? "bg-red-100 text-red-700"
                      : "bg-orange-100 text-orange-700"
                  }`}
                >
                  {leave.status}
                </span>
                {leave.status !== "Pending" && (leave.adminReviewedByName || leave.hrReviewedByName) && (
                  <div className="text-xs text-gray-500 dark:text-darktext-muted mt-1.5">
                    by <span className="font-medium">{leave.adminReviewedByName || leave.hrReviewedByName}</span>
                  </div>
                )}
              </td>
              {showActionsAndAI && (
                <td className="p-4 whitespace-nowrap">
                  <div>
                    <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap inline-block ${
                      leave.aiRecommendation === "Approve"
                        ? "bg-green-100 text-green-700"
                        : leave.aiRecommendation === "Reject"
                        ? "bg-red-100 text-red-700"
                        : "bg-blue-100 text-blue-700"
                    }`}
                    title={leave.aiReason}
                  >
                    {leave.aiRecommendation}
                  </span>
                    <div className="mt-1 text-xs text-gray-600 dark:text-darktext-muted">
                      {leave.aiConfidence === null || typeof leave.aiConfidence === 'undefined'
                        ? "AI Confidence: Not available"
                        : `AI Confidence: ${leave.aiConfidence}% — ${getConfidenceLabel(leave.aiConfidence)}`}
                    </div>
                  </div>
                </td>
              )}
              {showActionsAndAI && (
                <td className="p-4 flex gap-2 whitespace-nowrap">
                  {leave.status === "Pending" ? (
                    canApprove ? (
                    <>
                      <button
                        onClick={() => onAction(leave._id, "Approved")}
                        className="text-green-600 hover:text-green-800 font-medium"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => onAction(leave._id, "Rejected")}
                        className="text-red-600 hover:text-red-800 font-medium"
                      >
                        Reject
                      </button>
                    </>
                    ) : (
                      <span className="text-red-400 italic text-sm">Needs Admin</span>
                    )
                  ) : (
                    <span className="text-gray-400 italic text-sm">No action</span>
                  )}
                </td>
              )}
            </tr>
          )})}
          {leaves.length === 0 && (
            <tr>
              <td colSpan="6" className="p-8 text-center text-gray-500 dark:text-darktext-muted">
                No leave requests found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default function LeaveManagement({ viewType }) {
  const [leaves, setLeaves] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    leaveType: "Sick Leave",
    startDate: "",
    endDate: "",
    reason: "",
  });

  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const getConfidenceLabel = (val) => {
    if (val >= 90) return "Very High Confidence";
    if (val >= 75) return "High Confidence";
    if (val >= 50) return "Moderate Confidence";
    return "Low Confidence";
  };

  const fetchLeaves = async () => {
    try {
      const { data } = await api.get("/api/leaves");
      setLeaves(data);
    } catch (error) {
      console.error(error);
      const msg = error.response?.data?.message || "Failed to fetch leaves";
      toast.error(msg);
    }
  };

  useEffect(() => {
    fetchLeaves();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;
    setIsSubmitting(true);
    try {
      await api.post("/api/leaves", formData);
      toast.success("Leave request submitted successfully.");
      setIsModalOpen(false);
      fetchLeaves();
    } catch (error) {
      if (error.response?.status === 409) {
        toast.error("This leave request has already been submitted.");
      } else {
        toast.error("Unable to submit leave request. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAction = async (id, status) => {
    try {
      await api.put(`/api/leaves/${id}/status`, { status });
      toast.success(`Leave ${status}`);
      fetchLeaves();
    } catch (error) {
      toast.error("Failed to update status");
    }
  };

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-3xl font-bold text-gray-800 dark:text-darktext-primary">
            {viewType === 'my' ? 'My Leave' : 'Leave Approvals'}
          </h2>
          <p className="text-gray-500 dark:text-darktext-muted mt-2">
            {viewType === 'my' ? 'Manage your leave requests.' : 'Review and approve team leave requests.'}
          </p>
        </div>
        {viewType === 'my' && user.role !== 'admin' && (
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl transition font-medium"
          >
            Apply for Leave
          </button>
        )}
      </div>

      {viewType === 'my' && (
        <LeaveTable leaves={leaves.filter(l => (l.userId?._id || l.userId) === (user._id || user.id))} user={user} type="my" onAction={handleAction} />
      )}

      {viewType === 'approvals' && (
        <LeaveTable leaves={leaves.filter(l => (l.userId?._id || l.userId) !== (user._id || user.id))} user={user} type="team" onAction={handleAction} />
      )}

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl w-full max-w-md p-6">
            <h3 className="text-2xl font-bold mb-4">Apply for Leave</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Leave Type</label>
                <select
                  required
                  value={formData.leaveType}
                  onChange={(e) => setFormData({ ...formData, leaveType: e.target.value })}
                  className="w-full p-3 border rounded-xl"
                >
                  <option value="Casual Leave">Casual Leave</option>
                  <option value="Sick Leave">Sick Leave</option>
                  <option value="Earned Leave">Earned Leave</option>
                  <option value="Maternity Leave">Maternity Leave</option>
                  <option value="Paternity Leave">Paternity Leave</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Start Date</label>
                  <input
                    type="date"
                    required
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                    className="w-full p-3 border rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">End Date</label>
                  <input
                    type="date"
                    required
                    value={formData.endDate}
                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                    className="w-full p-3 border rounded-xl"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Reason</label>
                <textarea
                  required
                  value={formData.reason}
                  onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                  className="w-full p-3 border rounded-xl h-24"
                  placeholder="Explain why you are taking leave..."
                ></textarea>
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2 text-gray-600 dark:text-darktext-muted hover:bg-gray-100 dark:bg-slate-800 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`px-5 py-2 text-white rounded-xl font-medium transition ${
                    isSubmitting ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
                  }`}
                >
                  {isSubmitting ? "Submitting..." : "Submit"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
