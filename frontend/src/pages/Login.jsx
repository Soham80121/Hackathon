import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import AuthLayout from "../layouts/AuthLayout";
import toast from "react-hot-toast";
import api from "../services/api";

function Login() {
  const { register, handleSubmit } = useForm();
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    try {
      const res = await api.post("/api/auth/login", data);

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      toast.success("Login Successful!");

      if (res.data.user.status === "Pending" || res.data.user.mustChangePassword) {
        navigate("/change-password");
      } else {
        navigate("/dashboard");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Login Failed");
    }
  };

  return (
    <AuthLayout 
      title="Welcome Back" 
      subtitle="Login to your Kyuka AI account"
    >
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-6"
      >
        <input
          {...register("email")}
          type="email"
          placeholder="Email"
          className="w-full px-4 py-3 border border-gray-300 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
        />
        <input
          {...register("password")}
          type="password"
          placeholder="Password"
          className="w-full px-4 py-3 border border-gray-300 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
        />
        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-semibold transition"
        >
          Login
        </button>
      </form>
    </AuthLayout>
  );
}

export default Login;
