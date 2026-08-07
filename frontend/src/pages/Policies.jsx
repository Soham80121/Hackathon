import Sidebar from "../components/Sidebar";
import DashboardNavbar from "../components/DashboardNavbar";
import UploadPolicy from "../components/UploadPolicy";
import PolicyTable from "../components/PolicyTable";

export default function Policies() {
  return (
    <div className="flex h-screen bg-slate-100">

      <Sidebar />

      <div className="flex-1 overflow-y-auto">

        <DashboardNavbar />

        <main className="p-8">

          <UploadPolicy />

          <PolicyTable />

        </main>

      </div>

    </div>
  );
}