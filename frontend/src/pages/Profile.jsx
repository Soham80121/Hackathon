import React, { useState, useEffect } from "react";
import api from "../services/api";
import toast from "react-hot-toast";

export default function Profile() {
  const [user, setUser] = useState({
    name: "",
    email: "",
    phoneNumber: "",
    profilePicture: "",
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await api.get("/api/auth/profile");
        setUser({
          name: response.data.name || "",
          email: response.data.email || "",
          phoneNumber: response.data.phoneNumber || "",
          profilePicture: response.data.profilePicture || "",
        });
      } catch (error) {
        toast.error("Failed to load profile data");
      }
    };
    fetchProfile();
  }, []);

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await api.put("/api/settings/profile", {
        name: user.name,
        email: user.email,
        phoneNumber: user.phoneNumber,
        profilePicture: user.profilePicture
      });
      toast.success("Profile updated successfully!");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update profile");
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <h2 className="text-3xl font-bold text-slate-800 dark:text-darktext-primary mb-8">My Profile</h2>

      <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-lg p-8">
        <form onSubmit={handleUpdate} className="space-y-6">
          
          <div className="flex items-center gap-6 mb-8">
            <div className="w-24 h-24 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-3xl font-bold overflow-hidden border-4 border-white shadow-md">
              {user.profilePicture ? (
                <img src={user.profilePicture} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                user.name ? user.name.charAt(0).toUpperCase() : "U"
              )}
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-800 dark:text-darktext-primary">{user.name || "Employee"}</h3>
              <p className="text-gray-500 dark:text-darktext-muted">{user.email}</p>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-darktext-secondary mb-2">
              Full Name
            </label>
            <input
              type="text"
              name="name"
              value={user.name}
              onChange={handleChange}
              className="w-full border border-gray-300 dark:border-slate-700 rounded-xl px-4 py-3 focus:outline-none dark:text-darktext-primary focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-darktext-secondary mb-2">
              Email Address
            </label>
            <input
              type="email"
              name="email"
              value={user.email}
              onChange={handleChange}
              className="w-full border border-gray-300 dark:border-slate-700 rounded-xl px-4 py-3 focus:outline-none dark:text-darktext-primary focus:ring-2 focus:ring-blue-500"
              required
              disabled // usually email is not changeable, but left enabled if required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-darktext-secondary mb-2">
              Phone Number
            </label>
            <input
              type="text"
              name="phoneNumber"
              value={user.phoneNumber}
              onChange={handleChange}
              className="w-full border border-gray-300 dark:border-slate-700 rounded-xl px-4 py-3 focus:outline-none dark:text-darktext-primary focus:ring-2 focus:ring-blue-500"
              placeholder="+1 (555) 000-0000"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-darktext-secondary mb-2">
              Profile Picture URL
            </label>
            <input
              type="text"
              name="profilePicture"
              value={user.profilePicture}
              onChange={handleChange}
              className="w-full border border-gray-300 dark:border-slate-700 rounded-xl px-4 py-3 focus:outline-none dark:text-darktext-primary focus:ring-2 focus:ring-blue-500"
              placeholder="https://example.com/image.jpg"
            />
          </div>

          <div className="pt-4 border-t border-gray-100 dark:border-slate-800 flex justify-end">
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-medium transition"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
