import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  FileText,
  Download,
  ZoomIn,
  ZoomOut,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

import { Document, Page, pdfjs } from "react-pdf";

import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";

import { getDocument } from "../services/documentService";
import ChatBox from "../components/chat/ChatBox";

pdfjs.GlobalWorkerOptions.workerSrc =
  `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;


function DocumentDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [document, setDocument] = useState(null);

  const [numPages, setNumPages] = useState(0);

  const [pageNumber, setPageNumber] = useState(1);

  const [scale, setScale] = useState(1.1);

  useEffect(() => {
    loadDocument();
  }, [id]);

  const loadDocument = async () => {
    try {
      const data = await getDocument(id);

      console.log(data.file);

      setDocument(data);
    } catch (error) {
      console.error(error);
    }
  };

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
  };

  const nextPage = () => {
    if (pageNumber < numPages) {
      setPageNumber((prev) => prev + 1);
    }
  };

  const prevPage = () => {
    if (pageNumber > 1) {
      setPageNumber((prev) => prev - 1);
    }
  };

  const zoomIn = () => {
    setScale((prev) => Math.min(prev + 0.2, 3));
  };

  const zoomOut = () => {
    setScale((prev) => Math.max(prev - 0.2, 0.6));
  };

  if (!document) {
    return (
      <div className="min-h-screen flex items-center justify-center text-xl">
        Loading document...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F7F7F4] p-8">

  {/* Header */}

  <div className="flex items-center justify-between mb-8">

    <button
      onClick={() => navigate("/documents")}
      className="flex items-center gap-2 text-[#65735B] font-medium hover:underline"
    >
      <ArrowLeft size={18} />
      Back to Documents
    </button>

    <a
      href={document.file}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-2 bg-[#65735B] text-white px-5 py-3 rounded-xl hover:bg-[#55624D] transition"
    >
      <Download size={18} />
      Download PDF
    </a>

  </div>

  <h1 className="text-4xl font-bold mb-8">
    {document.title}
  </h1>

  <div className="grid lg:grid-cols-[1.3fr_0.7fr] gap-8">

    {/* ================= LEFT PANEL ================= */}

    <div className="bg-white rounded-3xl border border-stone-200 shadow-sm">

      {/* Toolbar */}

      <div className="flex justify-between items-center px-6 py-5 border-b">

        <h2 className="flex items-center gap-2 text-2xl font-bold">

          <FileText className="text-[#65735B]" />

          PDF Preview

        </h2>

        <div className="flex items-center gap-3">

          <button
            onClick={zoomOut}
            className="p-2 rounded-lg border hover:bg-stone-100"
          >
            <ZoomOut size={18} />
          </button>

          <span className="font-semibold">
            {Math.round(scale * 100)}%
          </span>

          <button
            onClick={zoomIn}
            className="p-2 rounded-lg border hover:bg-stone-100"
          >
            <ZoomIn size={18} />
          </button>

        </div>

      </div>

      {/* PDF */}

      <div className="bg-stone-100 h-[760px] overflow-auto flex justify-center py-8">

        <Document
          file={document.file}
          onLoadSuccess={onDocumentLoadSuccess}
          loading="Loading PDF..."
          error="Unable to load PDF preview."
        >
          <Page
            pageNumber={pageNumber}
            scale={scale}
          />
        </Document>

      </div>

      {/* Footer */}

      <div className="flex justify-between items-center px-6 py-5 border-t">

        <button
          disabled={pageNumber === 1}
          onClick={prevPage}
          className="flex items-center gap-2 border rounded-xl px-4 py-2 disabled:opacity-50"
        >
          <ChevronLeft size={18} />
          Previous
        </button>

        <span className="font-semibold">
          Page {pageNumber} of {numPages}
        </span>

        <button
          disabled={pageNumber === numPages}
          onClick={nextPage}
          className="flex items-center gap-2 border rounded-xl px-4 py-2 disabled:opacity-50"
        >
          Next
          <ChevronRight size={18} />
        </button>

      </div>

    </div>

    {/* ================= RIGHT PANEL ================= */}

    <div className="space-y-6 sticky top-8 h-fit">

          {/* AI Summary */}

      <div className="bg-white rounded-3xl border border-stone-200 shadow-sm p-6">

        <h2 className="text-xl font-bold mb-4">
          AI Summary
        </h2>

        <p className="text-stone-600 leading-8 whitespace-pre-line">
          {document.summary || "No AI summary available."}
        </p>

      </div>

      {/* Category */}

      <div className="bg-white rounded-3xl border border-stone-200 shadow-sm p-6">

        <h2 className="text-xl font-bold mb-4">
          Category
        </h2>

        <span className="inline-flex px-4 py-2 rounded-full bg-[#65735B]/10 text-[#65735B] font-medium">
          {document.category || "Uncategorized"}
        </span>

      </div>

      {/* Keywords */}

      <div className="bg-white rounded-3xl border border-stone-200 shadow-sm p-6">

        <h2 className="text-xl font-bold mb-4">
          Keywords
        </h2>

        <div className="flex flex-wrap gap-2">

          {document.keywords?.length ? (
            document.keywords.map((keyword) => (
              <span
                key={keyword}
                className="px-3 py-2 rounded-full bg-stone-100 text-sm"
              >
                {keyword}
              </span>
            ))
          ) : (
            <p className="text-stone-500">
              No keywords extracted.
            </p>
          )}

        </div>

      </div>

      {/* Insights */}

      <div className="bg-white rounded-3xl border border-stone-200 shadow-sm p-6">

        <h2 className="text-xl font-bold mb-4">
          AI Insights
        </h2>

        <p className="text-stone-600 leading-8 whitespace-pre-line">
          {document.insights || "No insights generated."}
        </p>

      </div>

      {/* Recommendations */}

      <div className="bg-white rounded-3xl border border-stone-200 shadow-sm p-6">

        <h2 className="text-xl font-bold mb-4">
          Recommendations
        </h2>

        <p className="text-stone-600 leading-8 whitespace-pre-line">
          {document.recommendations ||
            "No recommendations available."}
        </p>

      </div>

      {/* AI Chat */}

      <div className="bg-white rounded-3xl border border-stone-200 shadow-sm p-6">

        <h2 className="text-xl font-bold mb-5">
          Chat with this Document
        </h2>

        <ChatBox documentId={document.id} />

      </div>

    </div>

  </div>

</div>

  );
}

export default DocumentDetails;