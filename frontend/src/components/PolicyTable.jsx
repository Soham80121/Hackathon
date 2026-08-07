import {
  EyeIcon,
  TrashIcon,
  DocumentTextIcon,
} from "@heroicons/react/24/outline";

export default function PolicyTable() {

  const policies = [

    {
      id: 1,
      title: "Leave Policy.pdf",
      date: "Today",
      status: "Active",
    },

    {
      id: 2,
      title: "Work From Home.pdf",
      date: "Yesterday",
      status: "Active",
    },

    {
      id: 3,
      title: "Intern Policy.pdf",
      date: "02 Aug 2026",
      status: "Archived",
    },

  ];

  return (

    <div className="bg-white rounded-3xl shadow-lg mt-8 p-8">

      <div className="flex justify-between items-center mb-6">

        <h2 className="text-2xl font-bold text-slate-800">

          Uploaded Policies

        </h2>

        <button className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-xl transition">

          View All

        </button>

      </div>

      <div className="overflow-x-auto">

        <table className="w-full">

          <thead>

            <tr className="border-b">

              <th className="text-left py-4">Policy</th>

              <th className="text-left py-4">Uploaded</th>

              <th className="text-left py-4">Status</th>

              <th className="text-center py-4">Actions</th>

            </tr>

          </thead>

          <tbody>

            {policies.map((policy) => (

              <tr
                key={policy.id}
                className="border-b hover:bg-slate-50 transition"
              >

                <td className="py-5">

                  <div className="flex items-center gap-4">

                    <div className="bg-red-100 p-3 rounded-xl">

                      <DocumentTextIcon className="w-6 h-6 text-red-500" />

                    </div>

                    <div>

                      <p className="font-semibold">

                        {policy.title}

                      </p>

                    </div>

                  </div>

                </td>

                <td>

                  {policy.date}

                </td>

                <td>

                  <span
                    className={`px-3 py-1 rounded-full text-sm font-semibold ${
                      policy.status === "Active"
                        ? "bg-green-100 text-green-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >

                    {policy.status}

                  </span>

                </td>

                <td>

                  <div className="flex justify-center gap-4">

                    <button className="text-blue-600 hover:text-blue-800">

                      <EyeIcon className="w-6 h-6" />

                    </button>

                    <button className="text-red-600 hover:text-red-800">

                      <TrashIcon className="w-6 h-6" />

                    </button>

                  </div>

                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

    </div>

  );

}