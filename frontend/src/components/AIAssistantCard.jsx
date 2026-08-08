import { SparklesIcon } from "@heroicons/react/24/solid";
import { ArrowRightIcon } from "@heroicons/react/24/outline";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import api from "../services/api";

export default function AIAssistantCard() {

  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const [recentQueries, setRecentQueries] = useState([]);

  useEffect(() => {
    const fetchRecent = async () => {
      try {
        const res = await api.get("/api/assistant/recent");
        setRecentQueries(res.data);
      } catch (err) {
        console.error("Failed to fetch recent queries");
      }
    };
    fetchRecent();
  }, []);

  return (

    <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-lg p-8 mt-8">

      <div className="flex items-center gap-4">

        <div className="bg-blue-100 p-3 rounded-2xl">

          <SparklesIcon className="w-8 h-8 text-blue-600" />

        </div>

        <div>

          <h2 className="text-3xl font-bold text-slate-800 dark:text-darktext-primary">
            {user.role === "admin" ? "Admin Copilot" : user.role === "hr" ? "HR Copilot" : "AI Policy Assistant"}
          </h2>

          <p className="text-gray-500 dark:text-darktext-muted mt-1">
            {user.role === "admin" || user.role === "hr" 
              ? "Ask questions about workforce data and generate reports." 
              : "Ask questions about company HR policies instantly."}
          </p>

        </div>

      </div>

      <div className="mt-8">

        <input
          type="text"
          placeholder="Ask something..."
          className="w-full border rounded-xl px-5 py-4 outline-none focus:ring-2 focus:ring-blue-500"
          readOnly
        />

      </div>

      <div className="mt-6">

        <h3 className="font-semibold text-slate-700 dark:text-darktext-secondary mb-3">
          Recent Questions
        </h3>

        <div className="space-y-3">
          {recentQueries.length > 0 ? (
            recentQueries.map((q) => (
              <div 
                key={q._id} 
                onClick={() => navigate("/assistant", { state: { initialQuery: q.question } })}
                className="bg-slate-100 dark:bg-slate-800 rounded-xl px-4 py-3 cursor-pointer hover:bg-slate-200 transition"
              >
                {q.question}
              </div>
            ))
          ) : (
            <div className="text-gray-500 dark:text-darktext-muted italic text-sm">No recent queries.</div>
          )}
        </div>

      </div>

      <button
        onClick={() => navigate("/assistant")}
        className="mt-8 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl flex items-center gap-2 transition"
      >
        Open AI Assistant
        <ArrowRightIcon className="w-5 h-5" />
      </button>

    </div>

  );

}
