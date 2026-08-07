import { useState } from "react";
import {
  CloudArrowUpIcon,
  DocumentTextIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";

export default function UploadPolicy() {
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

  const handleUpload = () => {
    if (!selectedFile) {
      alert("Please choose a PDF first.");
      return;
    }

    // Backend integration on Day 7
    alert(`${selectedFile.name} is ready for upload.`);
  };

  return (
    <div className="bg-white rounded-3xl shadow-lg p-8 mt-8">

      <h2 className="text-2xl font-bold text-slate-800">
        Upload HR Policy
      </h2>

      <p className="text-gray-500 mt-2">
        Upload company policy documents in PDF format.
      </p>

      <div className="mt-8 border-2 border-dashed border-blue-400 rounded-3xl p-12 text-center hover:border-blue-600 transition">

        <CloudArrowUpIcon className="w-20 h-20 mx-auto text-blue-500" />

        <h3 className="mt-5 text-3xl font-bold text-slate-800">
          Drag & Drop PDF here
        </h3>

        <p className="text-gray-500 mt-3 text-lg">
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

          <div className="mt-10 bg-slate-50 border border-slate-200 rounded-2xl p-5 flex justify-between items-center">

            <div className="flex items-center gap-4">

              <div className="bg-red-100 p-3 rounded-xl">

                <DocumentTextIcon className="w-8 h-8 text-red-600" />

              </div>

              <div className="text-left">

                <h4 className="font-semibold text-slate-800">
                  {selectedFile.name}
                </h4>

                <p className="text-gray-500 text-sm">
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