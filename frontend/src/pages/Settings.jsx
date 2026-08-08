import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import api from "../services/api";

export default function Settings() {
  const [profile, setProfile] = useState({ name: "", email: "", role: "" });
  const [password, setPassword] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [companyName, setCompanyName] = useState("Acme Corp");
  const [emailNotifications, setEmailNotifications] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await api.get("/api/auth/profile");
        setProfile({
          name: response.data.name,
          email: response.data.email,
          role: response.data.role,
        });
        if (response.data.companyName) setCompanyName(response.data.companyName);
        if (response.data.emailNotifications !== undefined) setEmailNotifications(response.data.emailNotifications);
      } catch (error) {
        toast.error("Failed to load profile");
      }
    };
    fetchProfile();
  }, []);

  const handleSave = async () => {
    try {
      await api.put("/api/settings/profile", {
        name: profile.name,
        email: profile.email,
        companyName,
        emailNotifications,
      });
      if (password) {
        await api.put("/api/settings/password", {
          currentPassword,
          newPassword: password,
        });
        setPassword("");
        setCurrentPassword("");
      }
      toast.success("Settings saved successfully");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to save settings");
    }
  };

  return (
    <div className="w-full">
          <div className="max-w-4xl mx-auto space-y-6">
            
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h2 className="text-3xl font-bold text-slate-800 dark:text-darktext-primary">Settings</h2>
                <p className="mt-2 text-gray-500 dark:text-darktext-muted">Manage your account and preferences.</p>
              </div>
              <button 
                onClick={handleSave}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-xl font-medium transition whitespace-nowrap"
              >
                Save Changes
              </button>
            </div>

            {/* Profile Section */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-sm p-6 sm:p-8">
              <h3 className="text-xl font-bold text-slate-800 dark:text-darktext-primary mb-6">Profile</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-darktext-secondary mb-2">Name</label>
                  <input 
                    type="text" 
                    value={profile.name}
                    onChange={(e) => setProfile({...profile, name: e.target.value})}
                    className="w-full border border-gray-300 dark:border-slate-700 rounded-xl px-4 py-2.5 focus:outline-none dark:text-darktext-primary focus:ring-2 focus:ring-blue-500 transition"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-darktext-secondary mb-2">Email</label>
                  <input 
                    type="email" 
                    value={profile.email}
                    onChange={(e) => setProfile({...profile, email: e.target.value})}
                    className="w-full border border-gray-300 dark:border-slate-700 rounded-xl px-4 py-2.5 focus:outline-none dark:text-darktext-primary focus:ring-2 focus:ring-blue-500 transition"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-darktext-secondary mb-2">Role</label>
                  <input 
                    type="text" 
                    value={profile.role}
                    onChange={(e) => setProfile({...profile, role: e.target.value})}
                    className="w-full border border-gray-300 dark:border-slate-700 rounded-xl px-4 py-2.5 bg-gray-50 dark:bg-slate-900/50 focus:outline-none cursor-not-allowed text-gray-500 dark:text-darktext-muted"
                    disabled
                  />
                </div>
              </div>
            </div>

            {/* Security Section */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-sm p-6 sm:p-8">
              <h3 className="text-xl font-bold text-slate-800 dark:text-darktext-primary mb-6">Security</h3>
              <div className="max-w-md space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-darktext-secondary mb-2">Current Password</label>
                  <input 
                    type="password" 
                    placeholder="Enter current password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="w-full border border-gray-300 dark:border-slate-700 rounded-xl px-4 py-2.5 focus:outline-none dark:text-darktext-primary focus:ring-2 focus:ring-blue-500 transition"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-darktext-secondary mb-2">New Password</label>
                  <input 
                    type="password" 
                    placeholder="Enter new password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full border border-gray-300 dark:border-slate-700 rounded-xl px-4 py-2.5 focus:outline-none dark:text-darktext-primary focus:ring-2 focus:ring-blue-500 transition"
                  />
                </div>
              </div>
            </div>

            {/* Organization Section */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-sm p-6 sm:p-8">
              <h3 className="text-xl font-bold text-slate-800 dark:text-darktext-primary mb-6">Organization</h3>
              <div className="max-w-md">
                <label className="block text-sm font-medium text-slate-700 dark:text-darktext-secondary mb-2">Company Name</label>
                <input 
                  type="text" 
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  className="w-full border border-gray-300 dark:border-slate-700 rounded-xl px-4 py-2.5 focus:outline-none dark:text-darktext-primary focus:ring-2 focus:ring-blue-500 transition"
                />
              </div>
            </div>

            {/* Notifications Section */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-sm p-6 sm:p-8">
              <h3 className="text-xl font-bold text-slate-800 dark:text-darktext-primary mb-6">Notifications</h3>
              <div className="flex items-center justify-between py-2">
                <div>
                  <p className="font-medium text-slate-800 dark:text-darktext-primary">Email Notifications</p>
                  <p className="text-sm text-gray-500 dark:text-darktext-muted mt-1">Receive updates about policies and employees.</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    className="sr-only peer" 
                    checked={emailNotifications}
                    onChange={() => setEmailNotifications(!emailNotifications)}
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none dark:text-darktext-primary peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white dark:bg-slate-900 after:border-gray-300 dark:border-slate-700 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
            </div>

          </div>
    </div>
  );
}
