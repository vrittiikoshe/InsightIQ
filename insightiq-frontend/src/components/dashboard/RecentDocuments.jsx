import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  FileText,
  Eye,
  Trash2,
  Loader2,
  Search,
} from "lucide-react";

import toast from "react-hot-toast";

import {
  getDocuments,
  deleteDocument,
  searchDocuments,
} from "../../services/documentService";


function RecentDocuments({
  searchQuery = "",
  refreshTrigger = 0,
}) {

  const navigate = useNavigate();

  const [documents, setDocuments] = useState([]);

  const [loading, setLoading] = useState(true);

  const [deletingId, setDeletingId] =
    useState(null);


  // ==========================================
  // LOAD DOCUMENTS
  // ==========================================

  const loadDocuments = async () => {

    try {

      setLoading(true);

      const data = await getDocuments();

      setDocuments(
        Array.isArray(data)
          ? data
          : []
      );

    } catch (error) {

      console.error(
        "Load Documents Error:",
        error
      );

      toast.error(
        error.response?.data?.detail ||
        "Failed to load documents."
      );

    } finally {

      setLoading(false);

    }
  };


  // ==========================================
  // SEARCH DOCUMENTS
  // ==========================================

  const handleSearch = async () => {

    try {

      setLoading(true);

      const data =
        await searchDocuments(
          searchQuery.trim()
        );

      setDocuments(
        Array.isArray(data)
          ? data
          : []
      );

    } catch (error) {

      console.error(
        "Search Documents Error:",
        error
      );

      toast.error(
        "Failed to search documents."
      );

    } finally {

      setLoading(false);

    }
  };


  // ==========================================
  // LOAD / SEARCH / REFRESH
  // ==========================================

  useEffect(() => {

    if (
      searchQuery.trim() === ""
    ) {

      loadDocuments();

    } else {

      handleSearch();

    }

  }, [
    searchQuery,
    refreshTrigger,
  ]);


  // ==========================================
  // DELETE
  // ==========================================

  const handleDelete = async (id) => {

    const confirmed =
      window.confirm(
        "Are you sure you want to delete this document?"
      );

    if (!confirmed) {
      return;
    }


    try {

      setDeletingId(id);

      await deleteDocument(id);


      // Remove from UI immediately

      setDocuments(
        (prev) =>
          prev.filter(
            (doc) =>
              doc.id !== id
          )
      );


      toast.success(
        "Document deleted successfully!"
      );

    } catch (error) {

      console.error(
        "Delete Document Error:",
        error
      );

      toast.error(
        error.response?.data?.detail ||
        "Failed to delete document."
      );

    } finally {

      setDeletingId(null);

    }
  };


  // ==========================================
  // STATUS STYLE
  // ==========================================

  const getStatusStyle = (
    status
  ) => {

    switch (status) {

      case "COMPLETED":

        return `
          bg-green-100
          text-green-700
          dark:bg-green-900/30
          dark:text-green-400
        `;


      case "PROCESSING":

        return `
          bg-yellow-100
          text-yellow-700
          dark:bg-yellow-900/30
          dark:text-yellow-400
        `;


      case "UPLOADED":

        return `
          bg-blue-100
          text-blue-700
          dark:bg-blue-900/30
          dark:text-blue-400
        `;


      case "FAILED":

        return `
          bg-red-100
          text-red-700
          dark:bg-red-900/30
          dark:text-red-400
        `;


      default:

        return `
          bg-stone-100
          text-stone-600
          dark:bg-slate-800
          dark:text-slate-400
        `;
    }
  };


  // ==========================================
  // STATUS TEXT
  // ==========================================

  const getStatusText = (
    status
  ) => {

    if (!status) {
      return "Unknown";
    }

    return (
      status.charAt(0) +
      status.slice(1).toLowerCase()
    );
  };


  // ==========================================
  // UI
  // ==========================================

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

      {/* HEADER */}

      <div
        className="
          flex
          items-center
          justify-between
          mb-6
        "
      >

        <div>

          <h2
            className="
              text-2xl
              font-bold
              text-stone-900
              dark:text-white
            "
          >
            Recent Documents
          </h2>


          {searchQuery.trim() !== "" && (

            <p
              className="
                mt-1
                text-sm
                text-stone-500
                dark:text-slate-400
              "
            >
              Search results for "{searchQuery}"
            </p>

          )}

        </div>


        <FileText
          size={24}
          className="text-[#65735B]"
        />

      </div>


      {/* ======================================
          LOADING
      ====================================== */}

      {loading ? (

        <div
          className="
            py-14
            flex
            flex-col
            items-center
            justify-center
          "
        >

          <Loader2
            size={32}
            className="
              text-[#65735B]
              animate-spin
            "
          />

          <p
            className="
              mt-3
              text-stone-500
              dark:text-slate-400
            "
          >
            Loading documents...
          </p>

        </div>


      ) : documents.length === 0 ? (

        /* ====================================
           EMPTY STATE
        ==================================== */

        <div
          className="
            py-14
            text-center
          "
        >

          {searchQuery.trim() !== "" ? (

            <>

              <Search
                size={40}
                className="
                  mx-auto
                  text-stone-300
                "
              />

              <h3
                className="
                  mt-4
                  font-semibold
                  text-stone-700
                  dark:text-slate-300
                "
              >
                No documents found
              </h3>

              <p
                className="
                  mt-1
                  text-sm
                  text-stone-500
                  dark:text-slate-400
                "
              >
                Try searching with a different keyword.
              </p>

            </>

          ) : (

            <>

              <FileText
                size={40}
                className="
                  mx-auto
                  text-stone-300
                "
              />

              <h3
                className="
                  mt-4
                  font-semibold
                  text-stone-700
                  dark:text-slate-300
                "
              >
                No documents uploaded yet
              </h3>

              <p
                className="
                  mt-1
                  text-sm
                  text-stone-500
                  dark:text-slate-400
                "
              >
                Upload your first document to get started.
              </p>

            </>

          )}

        </div>


      ) : (

        /* ====================================
           DOCUMENT LIST
        ==================================== */

        <div className="space-y-4">

          {documents.map(
            (doc) => (

              <div
                key={doc.id}
                className="
                  flex
                  flex-col
                  lg:flex-row
                  lg:items-center
                  lg:justify-between
                  gap-5
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

                {/* DOCUMENT INFO */}

                <div
                  className="
                    flex
                    items-center
                    gap-4
                    min-w-0
                  "
                >

                  <div
                    className="
                      h-12
                      w-12
                      min-w-12
                      rounded-xl
                      bg-[#65735B]/10
                      dark:bg-[#65735B]/20
                      flex
                      items-center
                      justify-center
                    "
                  >

                    <FileText
                      className="text-[#65735B]"
                      size={22}
                    />

                  </div>


                  <div className="min-w-0">

                    <h3
                      className="
                        font-semibold
                        text-stone-900
                        dark:text-white
                        truncate
                      "
                    >
                      {doc.title}
                    </h3>


                    <div
                      className="
                        flex
                        flex-wrap
                        items-center
                        gap-2
                        mt-1
                      "
                    >

                      <p
                        className="
                          text-sm
                          text-stone-500
                          dark:text-slate-400
                        "
                      >
                        {doc.file_type ||
                          "Document"}
                      </p>


                      <span className="text-stone-300">
                        •
                      </span>


                      <p
                        className="
                          text-sm
                          text-stone-500
                          dark:text-slate-400
                        "
                      >
                        {doc.uploaded_at
                          ? new Date(
                              doc.uploaded_at
                            ).toLocaleDateString()
                          : "Unknown date"}
                      </p>

                    </div>

                  </div>

                </div>


                {/* ACTIONS */}

                <div
                  className="
                    flex
                    flex-wrap
                    items-center
                    gap-3
                  "
                >

                  {/* STATUS */}

                  <span
                    className={`
                      px-4
                      py-2
                      rounded-full
                      text-sm
                      font-medium
                      ${getStatusStyle(
                        doc.status
                      )}
                    `}
                  >
                    {getStatusText(
                      doc.status
                    )}
                  </span>


                  {/* VIEW */}

                  <button
                    onClick={() =>
                      navigate(
                        `/documents/${doc.id}`
                      )
                    }
                    className="
                      flex
                      items-center
                      gap-2
                      text-[#65735B]
                      hover:underline
                      px-2
                      py-2
                    "
                  >

                    <Eye size={18} />

                    View

                  </button>


                  {/* DELETE */}

                  <button
                    onClick={() =>
                      handleDelete(
                        doc.id
                      )
                    }
                    disabled={
                      deletingId === doc.id
                    }
                    className="
                      flex
                      items-center
                      gap-2
                      text-red-600
                      hover:underline
                      px-2
                      py-2
                      disabled:opacity-50
                      disabled:cursor-not-allowed
                    "
                  >

                    {deletingId === doc.id ? (

                      <Loader2
                        size={18}
                        className="
                          animate-spin
                        "
                      />

                    ) : (

                      <Trash2
                        size={18}
                      />

                    )}


                    {deletingId === doc.id
                      ? "Deleting..."
                      : "Delete"}

                  </button>

                </div>

              </div>

            )
          )}

        </div>

      )}

    </div>

  );
}


export default RecentDocuments;