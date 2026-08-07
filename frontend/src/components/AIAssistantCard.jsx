import { SparklesIcon } from "@heroicons/react/24/solid";
import { ArrowRightIcon } from "@heroicons/react/24/outline";
import { useNavigate } from "react-router-dom";

export default function AIAssistantCard() {

  const navigate = useNavigate();

  return (

    <div className="bg-white rounded-3xl shadow-lg p-8 mt-8">

      <div className="flex items-center gap-4">

        <div className="bg-blue-100 p-3 rounded-2xl">

          <SparklesIcon className="w-8 h-8 text-blue-600" />

        </div>

        <div>

          <h2 className="text-3xl font-bold text-slate-800">
            AI Policy Assistant
          </h2>

          <p className="text-gray-500 mt-1">
            Ask questions about company HR policies instantly.
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

        <h3 className="font-semibold text-slate-700 mb-3">
          Recent Questions
        </h3>

        <div className="space-y-3">

          <div className="bg-slate-100 rounded-xl px-4 py-3">
            How many sick leaves are allowed?
          </div>

          <div className="bg-slate-100 rounded-xl px-4 py-3">
            Can interns work remotely?
          </div>

          <div className="bg-slate-100 rounded-xl px-4 py-3">
            What is the notice period?
          </div>

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