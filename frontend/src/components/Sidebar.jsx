import {
  HomeIcon,
  DocumentTextIcon,
  UsersIcon,
  ChatBubbleLeftRightIcon,
  Cog6ToothIcon,
  ArrowLeftOnRectangleIcon,
} from "@heroicons/react/24/outline";

import { SparklesIcon } from "@heroicons/react/24/solid";
import { Link, useNavigate } from "react-router-dom";

export default function Sidebar() {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  return (
    <aside className="w-72 min-h-screen bg-slate-900 text-white flex flex-col shadow-2xl sticky top-0">

      {/* Logo */}

      <div className="flex items-center gap-3 px-8 py-8 border-b border-slate-700">

        <div className="bg-blue-600 rounded-xl p-2">

          <SparklesIcon className="w-7 h-7" />

        </div>

        <div>

          <h1 className="text-2xl font-bold">
            HRFlow AI
          </h1>

          <p className="text-sm text-slate-400">
            Admin Dashboard
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

        <Link
          to="/policies"
          className="flex items-center gap-4 px-8 py-4 hover:bg-slate-800 transition"
        >
          <DocumentTextIcon className="w-6 h-6" />
          Policies
        </Link>

        <Link
          to="/employees"
          className="flex items-center gap-4 px-8 py-4 hover:bg-slate-800 transition"
        >
          <UsersIcon className="w-6 h-6" />
          Employees
        </Link>

        <Link
          to="/assistant"
          className="flex items-center gap-4 px-8 py-4 hover:bg-slate-800 transition"
        >
          <ChatBubbleLeftRightIcon className="w-6 h-6" />
          AI Assistant
        </Link>

        <Link
          to="/settings"
          className="flex items-center gap-4 px-8 py-4 hover:bg-slate-800 transition"
        >
          <Cog6ToothIcon className="w-6 h-6" />
          Settings
        </Link>

      </nav>

      {/* Logout */}

      <div className="mt-auto border-t border-slate-700 p-6">

        <button
          onClick={logout}
          className="flex items-center gap-3 text-red-400 hover:text-red-300 transition"
        >
          <ArrowLeftOnRectangleIcon className="w-6 h-6" />
          Logout
        </button>

      </div>

    </aside>
  );
}