import Sidebar from "../components/Sidebar";
import DashboardNavbar from "../components/DashboardNavbar";

export default function Settings() {
  return (
    <div className="flex h-screen bg-slate-100">

      <Sidebar />

      <div className="flex-1 overflow-y-auto">

        <DashboardNavbar />

        <main className="p-8">

          <div className="bg-white rounded-3xl shadow-lg p-8">

            <h2 className="text-3xl font-bold">
              Settings
            </h2>

            <p className="mt-3 text-gray-500">
              Configure application preferences.
            </p>

          </div>

        </main>

      </div>

    </div>
  );
}