import Sidebar from "../components/Sidebar";
import DashboardNavbar from "../components/DashboardNavbar";

export default function AIAssistant() {
  return (
    <div className="flex h-screen bg-slate-100">

      <Sidebar />

      <div className="flex-1 overflow-y-auto">

        <DashboardNavbar />

        <main className="p-8">

          <div className="bg-white rounded-3xl shadow-lg p-8">

            <h2 className="text-3xl font-bold">
              AI Policy Assistant
            </h2>

            <p className="text-gray-500 mt-3">
              Ask questions about company policies.
            </p>

            <div className="mt-8 flex gap-4">

              <input
                placeholder="Ask something..."
                className="flex-1 border rounded-xl px-5 py-4"
              />

              <button className="bg-blue-600 hover:bg-blue-700 text-white px-8 rounded-xl">

                Ask AI

              </button>

            </div>

          </div>

        </main>

      </div>

    </div>
  );
}