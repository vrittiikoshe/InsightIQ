import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FileText, Eye, Trash2 } from "lucide-react";
import toast from "react-hot-toast";

import {
  getDocuments,
  deleteDocument,
  searchDocuments,
} from "../../services/documentService";

function RecentDocuments({ searchQuery }) {
  const navigate = useNavigate();

  const [documents, setDocuments] = useState([]);

  const loadDocuments = async () => {
    try {
      const data = await getDocuments();
      setDocuments(data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (searchQuery.trim() === "") {
      loadDocuments();
    } else {
      handleSearch();
    }
  }, [searchQuery]);

  const handleSearch = async () => {
    try {
      const data = await searchDocuments(searchQuery);
      setDocuments(data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async (id) => {
    if (
      !window.confirm(
        "Are you sure you want to delete this document?"
      )
    )
      return;

    try {
      await deleteDocument(id);

      setDocuments((prev) =>
        prev.filter((doc) => doc.id !== id)
      );

      toast.success("Document deleted successfully!");
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete document.");
    }
  };

  return (
    <div
      className="
        mt-10
        rounded-3xl
        border
        border-stone-200
        dark:border-slate-700
        bg-white
        dark:bg-slate-900
        p-8
        shadow-sm
      "
    >
      <h2 className="mb-6 text-2xl font-bold text-stone-900 dark:text-white">
        Recent Documents
      </h2>

      {documents.length === 0 ? (
        <div className="py-10 text-center text-stone-500 dark:text-slate-400">
          No documents uploaded yet.
        </div>
      ) : (
        <div className="space-y-4">

          {documents.map((doc) => (
            <div
              key={doc.id}
              className="
                flex
                items-center
                justify-between
                rounded-2xl
                border
                border-stone-200
                dark:border-slate-700
                p-5
                hover:bg-stone-50
                dark:hover:bg-slate-800
                transition
              "
            >
              <div className="flex items-center gap-4">

                <div
                  className="
                    h-12
                    w-12
                    rounded-xl
                    bg-[#65735B]/10
                    dark:bg-[#65735B]/20
                    flex
                    items-center
                    justify-center
                  "
                >
                  <FileText className="text-[#65735B]" />
                </div>

                <div>

                  <h3 className="font-semibold text-stone-900 dark:text-white">
                    {doc.title}
                  </h3>

                  <p className="text-sm text-stone-500 dark:text-slate-400">
                    {new Date(doc.uploaded_at).toLocaleDateString()}
                  </p>

                </div>

              </div>

              <div className="flex items-center gap-4">

                <span
                  className={`px-4 py-2 rounded-full text-sm font-medium ${
                    doc.status === "COMPLETED"
                      ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                      : doc.status === "PROCESSING"
                      ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400"
                      : doc.status === "UPLOADED"
                      ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
                      : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                  }`}
                >
                  {doc.status.charAt(0) +
                    doc.status.slice(1).toLowerCase()}
                </span>

                <button
                  onClick={() =>
                    navigate(`/documents/${doc.id}`)
                  }
                  className="flex items-center gap-2 text-[#65735B] hover:underline"
                >
                  <Eye size={18} />
                  View
                </button>

                <button
                  onClick={() =>
                    handleDelete(doc.id)
                  }
                  className="flex items-center gap-2 text-red-600 hover:underline"
                >
                  <Trash2 size={18} />
                  Delete
                </button>

              </div>

            </div>
          ))}

        </div>
      )}
    </div>
  );
}

export default RecentDocuments;