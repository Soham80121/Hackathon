import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import AuthLayout from "../layouts/AuthLayout";
import toast from "react-hot-toast";
import api from "../services/api";

function ChangePassword() {
  const { register, handleSubmit, watch } = useForm();
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    if (data.newPassword !== data.confirmPassword) {
      toast.error("New passwords do not match!");
      return;
    }

    try {
      await api.put("/api/settings/password", {
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      });

      // Update local storage user
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      user.status = "Active";
      user.mustChangePassword = false;
      user.firstLogin = false;
      localStorage.setItem("user", JSON.stringify(user));

      toast.success("Password changed successfully!");
      navigate("/dashboard");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to change password");
    }
  };

  return (
    <AuthLayout 
      title="Change Password Required" 
      subtitle="Please update your temporary password to continue."
    >
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-6"
      >
        <input
          {...register("currentPassword")}
          type="password"
          placeholder="Current (Temporary) Password"
          className="w-full px-4 py-3 border border-gray-300 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
          required
        />
        <input
          {...register("newPassword")}
          type="password"
          placeholder="New Password"
          className="w-full px-4 py-3 border border-gray-300 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
          required
        />
        <input
          {...register("confirmPassword")}
          type="password"
          placeholder="Confirm New Password"
          className="w-full px-4 py-3 border border-gray-300 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
          required
        />
        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-semibold transition"
        >
          Update Password
        </button>
      </form>
    </AuthLayout>
  );
}

export default ChangePassword;
