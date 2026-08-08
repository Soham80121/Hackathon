import { useState, useEffect } from "react";
import { XMarkIcon } from "@heroicons/react/24/outline";

export default function EmployeeModal({ isOpen, onClose, onSave, initialData }) {
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    department: "",
    designation: "",
    joiningDate: "",
    status: "Active",
    role: "employee",
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        ...initialData,
        joiningDate: initialData.joiningDate ? new Date(initialData.joiningDate).toISOString().split('T')[0] : "",
        role: initialData.role || "employee"
      });
    } else {
      setFormData({
        name: "",
        email: "",
        department: "",
        designation: "",
        joiningDate: "",
        status: "Active",
        role: "employee",
      });
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
      <div className="bg-white dark:bg-slate-900 rounded-3xl w-full max-w-lg shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="flex justify-between items-center p-6 sm:p-8 border-b border-slate-100 dark:border-slate-800">
          <h3 className="text-2xl font-bold text-slate-800 dark:text-darktext-primary">
            {initialData ? "Edit Employee" : "Add Employee"}
          </h3>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 dark:text-darktext-muted transition"
          >
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-darktext-secondary mb-1">Name</label>
            <input required type="text" name="name" value={formData.name} onChange={handleChange} className="w-full border border-gray-300 dark:border-slate-700 rounded-xl px-4 py-2 focus:outline-none dark:text-darktext-primary focus:ring-2 focus:ring-blue-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-darktext-secondary mb-1">Email</label>
            <input required type="email" name="email" value={formData.email} onChange={handleChange} className="w-full border border-gray-300 dark:border-slate-700 rounded-xl px-4 py-2 focus:outline-none dark:text-darktext-primary focus:ring-2 focus:ring-blue-500" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-darktext-secondary mb-1">Department</label>
              <input required type="text" name="department" value={formData.department} onChange={handleChange} className="w-full border border-gray-300 dark:border-slate-700 rounded-xl px-4 py-2 focus:outline-none dark:text-darktext-primary focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-darktext-secondary mb-1">Designation</label>
              <input required type="text" name="designation" value={formData.designation} onChange={handleChange} className="w-full border border-gray-300 dark:border-slate-700 rounded-xl px-4 py-2 focus:outline-none dark:text-darktext-primary focus:ring-2 focus:ring-blue-500" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-darktext-secondary mb-1">Joining Date</label>
              <input required type="date" name="joiningDate" value={formData.joiningDate} onChange={handleChange} className="w-full border border-gray-300 dark:border-slate-700 rounded-xl px-4 py-2 focus:outline-none dark:text-darktext-primary focus:ring-2 focus:ring-blue-500" />
            </div>
            {initialData && (
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-darktext-secondary mb-1">Status</label>
                <select required name="status" value={formData.status} onChange={handleChange} className="w-full border border-gray-300 dark:border-slate-700 rounded-xl px-4 py-2 focus:outline-none dark:text-darktext-primary focus:ring-2 focus:ring-blue-500">
                  <option value="Active">Active</option>
                  <option value="Pending">Pending</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-darktext-secondary mb-1">Role</label>
            <select required name="role" value={formData.role} onChange={handleChange} className="w-full border border-gray-300 dark:border-slate-700 rounded-xl px-4 py-2 focus:outline-none dark:text-darktext-primary focus:ring-2 focus:ring-blue-500">
              {user.role === 'admin' ? (
                <>
                  <option value="hr">HR</option>
                  <option value="employee">Employee</option>
                </>
              ) : (
                <option value="employee">Employee</option>
              )}
            </select>
          </div>
          <div className="mt-8 flex justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
            <button type="button" onClick={onClose} className="px-5 py-2.5 rounded-xl font-medium text-slate-600 dark:text-darktext-muted hover:bg-slate-50 dark:bg-slate-900/50 transition">Cancel</button>
            <button type="submit" className="px-5 py-2.5 rounded-xl font-medium text-white bg-blue-600 hover:bg-blue-700 shadow-md transition">Save</button>
          </div>
        </form>
      </div>
    </div>
  );
}
