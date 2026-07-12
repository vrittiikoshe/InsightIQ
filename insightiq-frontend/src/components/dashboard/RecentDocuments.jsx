import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FileText, Eye, Trash2 } from "lucide-react";

import {
  getDocuments,
  deleteDocument,
} from "../../services/documentService";

function RecentDocuments() {
  const navigate = useNavigate();

  const [documents, setDocuments] = useState([]);

  const loadDocuments = async () => {
    try {
      const data = await getDocuments();
      setDocuments(data);
    } catch (error) {
      console.error("Error fetching documents:", error);
    }
  };

  useEffect(() => {
    loadDocuments();
  }, []);

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this document?"
    );

    if (!confirmDelete) return;

    try {
      await deleteDocument(id);

      setDocuments((prev) =>
        prev.filter((doc) => doc.id !== id)
      );

      alert("Document deleted successfully.");
    } catch (error) {
      console.error(error);
      alert("Failed to delete document.");
    }
  };

  return (
    <div className="mt-10 bg-white rounded-3xl border border-stone-200 p-8">

      <h2 className="text-2xl font-bold mb-6">
        Recent Documents
      </h2>

      {documents.length === 0 ? (
        <div className="text-center py-10 text-stone-500">
          No documents uploaded yet.
        </div>
      ) : (
        <div className="space-y-4">

          {documents.map((doc) => (
            <div
              key={doc.id}
              className="flex items-center justify-between border border-stone-200 rounded-2xl p-5 hover:bg-stone-50 transition"
            >

              <div className="flex items-center gap-4">

                <div className="h-12 w-12 rounded-xl bg-[#65735B]/10 flex items-center justify-center">
                  <FileText className="text-[#65735B]" />
                </div>

                <div>

                  <h3 className="font-semibold">
                    {doc.title}
                  </h3>

                  <p className="text-sm text-stone-500">
                    {new Date(doc.uploaded_at).toLocaleDateString()}
                  </p>

                </div>

              </div>

              <div className="flex items-center gap-4">

                <span
                  className={`px-4 py-2 rounded-full text-sm font-medium ${
                    doc.status === "COMPLETED"
                      ? "bg-green-100 text-green-700"
                      : doc.status === "PROCESSING"
                      ? "bg-yellow-100 text-yellow-700"
                      : doc.status === "UPLOADED"
                      ? "bg-blue-100 text-blue-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {doc.status.charAt(0) + doc.status.slice(1).toLowerCase()}
                </span>

                <button
                  onClick={() => navigate(`/documents/${doc.id}`)}
                  className="flex items-center gap-2 text-[#65735B] hover:underline"
                >
                  <Eye size={18} />
                  View
                </button>

                <button
                  onClick={() => handleDelete(doc.id)}
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