import {
  EyeIcon,
  TrashIcon,
  DocumentTextIcon,
} from "@heroicons/react/24/outline";
import { useState, useEffect } from "react";
import ConfirmModal from "./ConfirmModal";
import toast from "react-hot-toast";
import SearchBar from "./SearchBar";
import api from "../services/api";
import { useNavigate } from "react-router-dom";

export default function PolicyTable({ refreshTrigger }) {
  const [policies, setPolicies] = useState([]);
  const [policyToDelete, setPolicyToDelete] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const navigate = useNavigate();

  const fetchPolicies = async () => {
    try {
      const response = await api.get("/api/policies");
      setPolicies(response.data);
    } catch (error) {
      toast.error("Failed to fetch policies");
    }
  };

  useEffect(() => {
    fetchPolicies();
  }, [refreshTrigger]);

  const handleDelete = async () => {
    if (policyToDelete) {
      try {
        await api.delete(`/api/policies/${policyToDelete._id}`);
        toast.success("Policy deleted successfully");
        setPolicyToDelete(null);
        fetchPolicies(); // refresh table
      } catch (error) {
        toast.error("Failed to delete policy");
      }
    }
  };

  return (

    <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-lg mt-8 p-8">

      <div className="flex justify-between items-center mb-6">

        <h2 className="text-2xl font-bold text-slate-800 dark:text-darktext-primary">

          Uploaded Policies

        </h2>

        <button onClick={() => navigate('/policies')} className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-xl transition">
          View All
        </button>

      </div>

      <SearchBar 
        placeholder="Search Policy..." 
        className="mb-6" 
        onChange={(e) => setSearchQuery(e.target.value)} 
      />

      <div className="overflow-x-auto">

        <table className="w-full">

          <thead>

            <tr className="border-b dark:border-slate-800 text-slate-700 dark:text-darktext-primary">

              <th className="text-left py-4">Policy</th>

              <th className="text-left py-4">Uploaded</th>

              <th className="text-left py-4">Status</th>

              <th className="text-center py-4">Actions</th>

            </tr>

          </thead>

          <tbody>

            {policies.filter(policy => 
              policy.title.toLowerCase().includes(searchQuery.toLowerCase())
            ).map((policy) => (

              <tr
                key={policy._id}
                className="border-b dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 transition"
              >

                <td className="py-5">

                  <div className="flex items-center gap-4">

                    <div className="bg-red-100 p-3 rounded-xl">

                      <DocumentTextIcon className="w-6 h-6 text-red-500" />

                    </div>

                    <div>

                      <p className="font-semibold text-slate-800 dark:text-darktext-primary">

                        {policy.title}

                      </p>

                    </div>

                  </div>

                </td>

                <td className="text-slate-600 dark:text-darktext-secondary">

                  {new Date(policy.uploadedAt).toLocaleDateString()}

                </td>

                <td>

                  <span
                    className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-semibold"
                  >

                    Active

                  </span>

                </td>

                <td>

                  <div className="flex justify-center gap-4">

                    <a 
                      href={`http://localhost:5000/${policy.filePath}`} 
                      target="_blank" 
                      rel="noreferrer" 
                      className="text-blue-600 hover:text-blue-800"
                    >
                      <EyeIcon className="w-6 h-6" />
                    </a>

                    {user.role === "admin" && (
                      <button onClick={() => setPolicyToDelete(policy)} className="text-red-600 hover:text-red-800">
                        <TrashIcon className="w-6 h-6" />
                      </button>
                    )}

                  </div>

                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

      <ConfirmModal
        isOpen={!!policyToDelete}
        title="Delete Policy"
        message={`Are you sure you want to delete "${policyToDelete?.title}"?`}
        onConfirm={handleDelete}
        onCancel={() => setPolicyToDelete(null)}
        confirmText="Delete"
      />

    </div>

  );

}
