import { Link, useNavigate, useLocation } from "react-router-dom";
import { SparklesIcon } from "@heroicons/react/24/solid";
import Button from "./Button";
import { useState } from "react";
import ConfirmModal from "./ConfirmModal";
import toast from "react-hot-toast";

function Navbar() {

  const navigate = useNavigate();


  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));

  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setIsLogoutModalOpen(false);
    toast.success("Logged out successfully");
    navigate("/");
  };
  return (
    <nav className="sticky top-0 z-50 bg-white dark:bg-slate-900/80 backdrop-blur-lg border-b border-gray-200 dark:border-slate-800 shadow-sm">
      <div className="max-w-7xl mx-auto px-8 py-5 flex items-center justify-between">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-3">

          <div className="w-12 h-12 bg-slate-950 rounded-xl flex items-center justify-center p-1 shadow-md shrink-0 border border-gray-200 dark:border-slate-700/50">
            <img src="/logo.png" alt="Kyuka AI Logo" className="w-full h-full object-contain drop-shadow-sm" />
          </div>

          <h1 className="text-2xl font-bold text-slate-800 dark:text-darktext-primary">
            Kyuka AI
          </h1>

        </Link>

        {/* Navigation */}
        <div className="hidden md:flex items-center gap-8 font-medium text-gray-600 dark:text-darktext-muted">

         <button
  onClick={() => {
    if (location.pathname !== "/") {
      navigate("/");
    }

    setTimeout(() => {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }, 100);
  }}
  className="hover:text-blue-600 transition"
>
  Home
</button>

          <a
            href="#features"
            className="hover:text-blue-600 transition-colors duration-300"
          >
            Features
          </a>

          <a
            href="#about"
            className="hover:text-blue-600 transition-colors duration-300"
          >
            About
          </a>

          <a
            href="#contact"
            className="hover:text-blue-600 transition-colors duration-300"
          >
            Contact
          </a>

        </div>

        {/* Login Button */}
 {
  token ? (
    <div className="flex items-center gap-4">

      <span className="font-semibold text-slate-700 dark:text-darktext-secondary">
        Hi, {user?.name}
      </span>

      <Link to="/dashboard">
        <Button text="Dashboard" />
      </Link>

      <button
        onClick={() => setIsLogoutModalOpen(true)}
        className="bg-red-500 hover:bg-red-600 text-white px-5 py-3 rounded-xl transition"
      >
        Logout
      </button>

    </div>
  ) : (
    <Link to="/login">
      <Button text="Login" />
    </Link>
  )
}

      </div>
      
      <ConfirmModal
        isOpen={isLogoutModalOpen}
        title="Logout"
        message="Are you sure you want to log out of Kyuka AI?"
        onConfirm={logout}
        onCancel={() => setIsLogoutModalOpen(false)}
        confirmText="Logout"
      />
    </nav>
  );
}

export default Navbar;
