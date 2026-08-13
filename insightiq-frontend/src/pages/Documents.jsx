import { useState } from "react";
import toast from "react-hot-toast";

import DashboardLayout from "../components/dashboard/DashboardLayout";
import Sidebar from "../components/dashboard/Sidebar";
import Topbar from "../components/dashboard/Topbar";
import RecentDocuments from "../components/dashboard/RecentDocuments";

import api from "../api/axios";

function Documents() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  const handleFileChange = (e) => {
    const file = e.target.files[0];

    if (!file) {
      return;
    }

    const allowedTypes = [
      "application/pdf",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "text/plain",
    ];

    if (!allowedTypes.includes(file.type)) {
      toast.error("Only PDF, DOCX and TXT files are allowed.");
      e.target.value = "";
      return;
    }

    setSelectedFile(file);
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      toast.error("Please select a document first.");
      return;
    }

    try {
      setUploading(true);

      const formData = new FormData();

      formData.append("file", selectedFile);

      await api.post(
        "/documents/upload/",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      toast.success("Document uploaded successfully!");

      setSelectedFile(null);

      // Reset file input
      const fileInput =
        document.getElementById("document-upload");

      if (fileInput) {
        fileInput.value = "";
      }

      // Refresh page so RecentDocuments gets latest data
      window.location.reload();

    } catch (error) {
      console.error("Upload Error:", error);

      toast.error(
        error.response?.data?.error ||
        error.response?.data?.detail ||
        "Failed to upload document."
      );

    } finally {
      setUploading(false);
    }
  };

  return (
    <DashboardLayout
      sidebar={<Sidebar />}
      topbar={
        <Topbar
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
        />
      }
    >

      {/* Page Heading */}

      <h1 className="text-4xl font-bold text-stone-900 dark:text-white">
        Documents
      </h1>

      <p className="mt-3 text-stone-500 dark:text-slate-400">
        View and manage all your uploaded documents.
      </p>


      {/* Upload Section */}

      <div className="mt-8 rounded-3xl border border-stone-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-8 shadow-sm">

        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">

          <div>

            <h2 className="text-xl font-semibold text-stone-900 dark:text-white">
              Upload Document
            </h2>

            <p className="mt-1 text-sm text-stone-500 dark:text-slate-400">
              Upload PDF, DOCX or TXT files for AI analysis.
            </p>

          </div>


          {/* File Input */}

          <div className="flex flex-col sm:flex-row gap-3">

            <label
              htmlFor="document-upload"
              className="cursor-pointer rounded-xl border border-stone-300 dark:border-slate-700 bg-stone-50 dark:bg-slate-800 px-5 py-3 text-sm font-medium text-stone-700 dark:text-slate-200 hover:bg-stone-100 dark:hover:bg-slate-700 transition"
            >
              Choose File
            </label>

            <input
              id="document-upload"
              type="file"
              accept=".pdf,.docx,.txt"
              onChange={handleFileChange}
              className="hidden"
            />

            <button
              onClick={handleUpload}
              disabled={!selectedFile || uploading}
              className="rounded-xl bg-[#65735B] px-6 py-3 text-sm font-medium text-white hover:bg-[#55624D] transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {uploading
                ? "Uploading..."
                : "Upload"}
            </button>

          </div>

        </div>


        {/* Selected File */}

        {selectedFile && (
          <div className="mt-6 rounded-2xl bg-stone-50 dark:bg-slate-800 border border-stone-200 dark:border-slate-700 p-4">

            <p className="text-sm text-stone-500 dark:text-slate-400">
              Selected file
            </p>

            <p className="mt-1 font-medium text-stone-900 dark:text-white">
              {selectedFile.name}
            </p>

            <p className="mt-1 text-xs text-stone-400">
              {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
            </p>

          </div>
        )}

      </div>


      {/* Recent Documents */}

      <RecentDocuments
        searchQuery={searchQuery}
      />

    </DashboardLayout>
  );
}

export default Documents;