import { useState } from "react";
import api from "../services/api";
import toast from "react-hot-toast";
import {
  CloudArrowUpIcon,
  DocumentTextIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";

export default function UploadPolicy({ onUploadSuccess }) {
  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    if (file.type !== "application/pdf") {
      alert("Please select a PDF file only.");
      return;
    }

    setSelectedFile(file);
  };

  const removeFile = () => {
    setSelectedFile(null);
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      toast.error("Please choose a PDF first.");
      return;
    }

    const formData = new FormData();
    formData.append("policyFile", selectedFile);
    
    // We expect the title to be passed or derived. Using file name for now.
    formData.append("title", selectedFile.name.replace(".pdf", ""));

    try {
      await api.post("/api/policies/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.success(`${selectedFile.name} uploaded successfully.`);
      setSelectedFile(null);
      if (onUploadSuccess) onUploadSuccess();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to upload policy");
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-lg p-8 mt-8">

      <h2 className="text-2xl font-bold text-slate-800 dark:text-darktext-primary">
        Upload HR Policy
      </h2>

      <p className="text-gray-500 dark:text-darktext-muted mt-2">
        Upload company policy documents in PDF format.
      </p>

      <div className="mt-8 border-2 border-dashed border-blue-400 rounded-3xl p-12 text-center hover:border-blue-600 transition">

        <CloudArrowUpIcon className="w-20 h-20 mx-auto text-blue-500" />

        <h3 className="mt-5 text-3xl font-bold text-slate-800 dark:text-darktext-primary">
          Drag & Drop PDF here
        </h3>

        <p className="text-gray-500 dark:text-darktext-muted mt-3 text-lg">
          or choose a PDF from your computer
        </p>

        {/* Buttons */}

        <div className="mt-10 flex justify-center items-center gap-8">

          <label>

            <input
              type="file"
              accept=".pdf"
              className="hidden"
              onChange={handleFileChange}
            />

            <span className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl cursor-pointer transition font-semibold shadow-md">
              Choose PDF
            </span>

          </label>

          <button
            onClick={handleUpload}
            className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-xl font-semibold transition shadow-md"
          >
            Upload Policy
          </button>

        </div>

        {/* Selected File */}

        {selectedFile && (

          <div className="mt-10 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 flex justify-between items-center">

            <div className="flex items-center gap-4">

              <div className="bg-red-100 p-3 rounded-xl">

                <DocumentTextIcon className="w-8 h-8 text-red-600" />

              </div>

              <div className="text-left">

                <h4 className="font-semibold text-slate-800 dark:text-darktext-primary">
                  {selectedFile.name}
                </h4>

                <p className="text-gray-500 dark:text-darktext-muted text-sm">
                  {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                </p>

              </div>

            </div>

            <button
              onClick={removeFile}
              className="text-red-500 hover:text-red-700 transition"
            >
              <XMarkIcon className="w-7 h-7" />
            </button>

          </div>

        )}

      </div>

    </div>
  );
}
