import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import DashboardNavbar from "../components/DashboardNavbar";

export default function DashboardLayout() {
  return (
    <div className="flex h-screen bg-slate-100 dark:bg-slate-800 overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <DashboardNavbar />
        <main className="flex-1 overflow-y-auto p-6 sm:p-8 flex flex-col">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
