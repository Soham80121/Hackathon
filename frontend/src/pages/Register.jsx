import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import AuthLayout from "../layouts/AuthLayout";
import api from "../services/api";

function Register() {
  const { register, handleSubmit } = useForm();

  const navigate = useNavigate();

  const onSubmit = async (data) => {
    try {
      await api.post("/api/auth/register", data);

      toast.success("Registration Successful!");

      navigate("/login");
    } catch (err) {
      toast.error(err.response?.data?.message || "Registration Failed");
    }
  };

  return (
    <AuthLayout 
      title="Create Account" 
      subtitle="Join Kyuka AI to manage your workforce"
    >
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-6"
      >
        <input
          {...register("name")}
          type="text"
          placeholder="Full Name"
          className="w-full px-4 py-3 border border-gray-300 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
        />
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
          Sign Up
        </button>
      </form>

      <p className="text-center mt-8 text-gray-500 dark:text-darktext-muted">
        Already have an account?{" "}
        <Link
          to="/login"
          className="text-blue-600 font-semibold hover:underline"
        >
          Login
        </Link>
      </p>
    </AuthLayout>
  );
}

export default Register;
