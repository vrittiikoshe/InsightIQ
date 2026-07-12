import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, FileText } from "lucide-react";

import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";

import { getDocument } from "../services/documentService";

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url
).toString();

function DocumentDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [document, setDocument] = useState(null);
  const [numPages, setNumPages] = useState(0);

  useEffect(() => {
    loadDocument();
  }, [id]);

  const loadDocument = async () => {
    try {
      const data = await getDocument(id);
      setDocument(data);
    } catch (error) {
      console.error("Error loading document:", error);
    }
  };

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
  };

  if (!document) {
    return (
      <div className="flex items-center justify-center min-h-screen text-xl">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-100 p-8">

      <button
        onClick={() => navigate("/dashboard")}
        className="flex items-center gap-2 mb-8 text-[#65735B] hover:underline"
      >
        <ArrowLeft size={18} />
        Back to Dashboard
      </button>

      <h1 className="text-4xl font-bold mb-8">
        {document.title}
      </h1>

      <div className="grid lg:grid-cols-2 gap-8">

      {/* LEFT */}

      <div className="bg-white rounded-3xl shadow p-6">

        <div className="flex items-center gap-3 mb-5">
          <FileText className="text-[#65735B]" />
          <h2 className="text-2xl font-bold">
            PDF Preview
          </h2>
        </div>

        <div className="border rounded-xl overflow-auto h-[750px] flex justify-center bg-stone-100">

          <Document
            file={document.file}
            onLoadSuccess={onDocumentLoadSuccess}
            loading="Loading PDF..."
            error="Unable to load PDF preview."
          >
            {Array.from({ length: numPages }, (_, index) => (
              <Page
                key={index}
                pageNumber={index + 1}
                width={550}
              />
            ))}
          </Document>

        </div>

        <div className="mt-5">
          <a
            href={document.file}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-[#65735B] hover:bg-[#55624D] text-white px-5 py-2 rounded-xl inline-block"
          >
            Open Original PDF
          </a>
        </div>

      </div>

      {/* RIGHT */}

      <div className="space-y-6">

        <div className="bg-white rounded-3xl shadow p-6">
          <h2 className="text-xl font-bold mb-3">
            AI Summary
          </h2>

          <p className="text-stone-600 leading-7">
            {document.summary || "No summary available."}
          </p>
        </div>

        <div className="bg-white rounded-3xl shadow p-6">
          <h2 className="text-xl font-bold mb-3">
            Category
          </h2>

          <span className="px-4 py-2 rounded-full bg-[#65735B]/10 text-[#65735B]">
            {document.category || "Unknown"}
          </span>
        </div>

        <div className="bg-white rounded-3xl shadow p-6">

          <h2 className="text-xl font-bold mb-3">
            Keywords
          </h2>

          <div className="flex flex-wrap gap-2">

            {document.keywords?.length ? (
              document.keywords.map((keyword) => (
                <span
                  key={keyword}
                  className="px-3 py-2 rounded-full bg-stone-100"
                >
                  {keyword}
                </span>
              ))
            ) : (
              <p>No keywords available.</p>
            )}

          </div>

        </div>

        <div className="bg-white rounded-3xl shadow p-6">

          <h2 className="text-xl font-bold mb-3">
            Insights
          </h2>

          <p className="text-stone-600 leading-7">
            {document.insights || "No insights available."}
          </p>

        </div>

        <div className="bg-white rounded-3xl shadow p-6">

          <h2 className="text-xl font-bold mb-3">
            Recommendations
          </h2>

          <p className="text-stone-600 leading-7">
            {document.recommendations || "No recommendations available."}
          </p>

        </div>

      </div>

    </div>

  </div>
);
}

export default DocumentDetails;