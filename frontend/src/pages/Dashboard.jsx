import Sidebar from "../components/Sidebar";
import DashboardNavbar from "../components/DashboardNavbar";
import UploadPolicy from "../components/UploadPolicy";
import StatCard from "../components/StatCard";
import PolicyTable from "../components/PolicyTable";
import AnalyticsChart from "../components/AnalyticsChart";
import AIAssistantCard from "../components/AIAssistantCard";

import {
  DocumentTextIcon,
  UsersIcon,
  ChatBubbleLeftRightIcon,
  ClockIcon,
} from "@heroicons/react/24/outline";

export default function Dashboard() {
  return (
    <div className="flex h-screen bg-slate-100 overflow-hidden">

      <Sidebar />

      <div className="flex-1 flex flex-col overflow-y-auto">

        <DashboardNavbar />

        <main className="p-8">

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">

            <StatCard
              title="Policies"
              value="12"
              color="bg-blue-500"
              icon={<DocumentTextIcon className="w-7 h-7" />}
            />

            <StatCard
              title="Employees"
              value="156"
              color="bg-green-500"
              icon={<UsersIcon className="w-7 h-7" />}
            />

            <StatCard
              title="AI Queries"
              value="48"
              color="bg-purple-500"
              icon={<ChatBubbleLeftRightIcon className="w-7 h-7" />}
            />

            <StatCard
              title="Pending Leaves"
              value="7"
              color="bg-orange-500"
              icon={<ClockIcon className="w-7 h-7" />}
            />

          </div>

          <UploadPolicy />
          <PolicyTable />
<div className="grid grid-cols-1">

  <AnalyticsChart />

  

</div>

<AIAssistantCard />
        </main>

      </div>

    </div>
  );
}