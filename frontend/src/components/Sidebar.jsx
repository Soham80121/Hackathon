import {
  HomeIcon,
  DocumentTextIcon,
  UsersIcon,
  ChatBubbleLeftRightIcon,
  Cog6ToothIcon,
  ArrowLeftOnRectangleIcon,
  BellAlertIcon,
} from "@heroicons/react/24/outline";

import { SparklesIcon } from "@heroicons/react/24/solid";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import ConfirmModal from "./ConfirmModal";
import { useSidebar } from "../context/SidebarContext";
import toast from "react-hot-toast";

export default function Sidebar() {
  const navigate = useNavigate();
  const { isOpen, setIsOpen } = useSidebar();
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setIsLogoutModalOpen(false);
    toast.success("Logged out successfully");
    navigate("/");
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      <aside className={`
        fixed inset-y-0 left-0 z-50 w-72 bg-slate-900 text-white flex flex-col shadow-2xl transition-transform duration-300
        md:relative md:translate-x-0
        ${isOpen ? "translate-x-0" : "-translate-x-full"}
      `}>

        {/* Logo */}

      <div className="flex items-center gap-3 px-8 py-8 border-b border-slate-700">

        <div className="w-14 h-14 bg-slate-950 rounded-2xl flex items-center justify-center p-1.5 shadow-lg shrink-0 border border-slate-700/50">
          <img src="/logo.png" alt="Kyuka AI Logo" className="w-full h-full object-contain drop-shadow-sm" />
        </div>

        <div>

          <h1 className="text-2xl font-bold">
            Kyuka AI
          </h1>

          <p className="text-sm text-slate-400">
            {user.role === 'admin' ? "Admin Dashboard" : user.role === 'hr' ? "HR Dashboard" : "Employee Portal"}
          </p>

        </div>

      </div>

      {/* Menu */}

      <nav className="flex-1 mt-8">

        <Link
          to="/dashboard"
          className="flex items-center gap-4 px-8 py-4 hover:bg-slate-800 transition"
        >
          <HomeIcon className="w-6 h-6" />
          Dashboard
        </Link>

        {user.role === 'admin' && (
          <>
            <Link to="/employees" className="flex items-center gap-4 px-8 py-4 hover:bg-slate-800 transition">
              <UsersIcon className="w-6 h-6" />
              Employees
            </Link>
            
            <Link to="/policies" className="flex items-center gap-4 px-8 py-4 hover:bg-slate-800 transition">
              <DocumentTextIcon className="w-6 h-6" />
              Policies
            </Link>

            <Link to="/admin/leave-approvals" className="flex items-center gap-4 px-8 py-4 hover:bg-slate-800 transition">
              <DocumentTextIcon className="w-6 h-6" />
              Leave Approvals
            </Link>

            <Link to="/assistant" className="flex items-center gap-4 px-8 py-4 hover:bg-slate-800 transition">
              <ChatBubbleLeftRightIcon className="w-6 h-6" />
              AI Assistant
            </Link>

            <Link to="/reports" className="flex items-center gap-4 px-8 py-4 hover:bg-slate-800 transition">
              <DocumentTextIcon className="w-6 h-6" />
              Reports
            </Link>
            

            <Link to="/settings" className="flex items-center gap-4 px-8 py-4 hover:bg-slate-800 transition">
              <Cog6ToothIcon className="w-6 h-6" />
              Settings
            </Link>
          </>
        )}

        {user.role === 'hr' && (
          <>
            <Link to="/employees" className="flex items-center gap-4 px-8 py-4 hover:bg-slate-800 transition">
              <UsersIcon className="w-6 h-6" />
              Employees
            </Link>
            
            <Link to="/policies" className="flex items-center gap-4 px-8 py-4 hover:bg-slate-800 transition">
              <DocumentTextIcon className="w-6 h-6" />
              Policies
            </Link>

            <Link to="/hr/my-leave" className="flex items-center gap-4 px-8 py-4 hover:bg-slate-800 transition">
              <DocumentTextIcon className="w-6 h-6" />
              My Leave
            </Link>

            <Link to="/hr/leave-approvals" className="flex items-center gap-4 px-8 py-4 hover:bg-slate-800 transition">
              <DocumentTextIcon className="w-6 h-6" />
              Leave Approvals
            </Link>

            <Link to="/assistant" className="flex items-center gap-4 px-8 py-4 hover:bg-slate-800 transition">
              <ChatBubbleLeftRightIcon className="w-6 h-6" />
              AI Assistant
            </Link>


            <Link to="/settings" className="flex items-center gap-4 px-8 py-4 hover:bg-slate-800 transition">
              <Cog6ToothIcon className="w-6 h-6" />
              Settings
            </Link>
          </>
        )}

        {user.role === 'employee' && (
          <>
            <Link to="/employee/my-leave" className="flex items-center gap-4 px-8 py-4 hover:bg-slate-800 transition">
              <DocumentTextIcon className="w-6 h-6" />
              My Leave
            </Link>

            <Link to="/policies" className="flex items-center gap-4 px-8 py-4 hover:bg-slate-800 transition">
              <DocumentTextIcon className="w-6 h-6" />
              Policies
            </Link>
            
            <Link to="/assistant" className="flex items-center gap-4 px-8 py-4 hover:bg-slate-800 transition">
              <ChatBubbleLeftRightIcon className="w-6 h-6" />
              AI Assistant
            </Link>


            <Link to="/settings" className="flex items-center gap-4 px-8 py-4 hover:bg-slate-800 transition">
              <Cog6ToothIcon className="w-6 h-6" />
              Settings
            </Link>
          </>
        )}

      </nav>

      {/* Logout */}

      <div className="mt-auto border-t border-slate-700 p-6">

        <button
          onClick={() => setIsLogoutModalOpen(true)}
          className="flex items-center gap-3 text-red-400 hover:text-red-300 transition"
        >
          <ArrowLeftOnRectangleIcon className="w-6 h-6" />
          Logout
        </button>

      </div>

        <ConfirmModal
          isOpen={isLogoutModalOpen}
          title="Logout"
          message="Are you sure you want to log out of Kyuka AI?"
          onConfirm={logout}
          onCancel={() => setIsLogoutModalOpen(false)}
          confirmText="Logout"
        />

      </aside>
    </>
  );
}
