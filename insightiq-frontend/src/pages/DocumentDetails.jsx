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
  Clock,
  CheckCircle,
  AlertCircle,
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

  const [documentData, setDocumentData] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [numPages, setNumPages] = useState(0);
  const [pageNumber, setPageNumber] = useState(1);
  const [scale, setScale] = useState(1.1);


  // ==========================================
  // LOAD DOCUMENT
  // ==========================================

  useEffect(() => {
    loadDocument();
  }, [id]);


  const loadDocument = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getDocument(id);

      console.log("Document:", data);

      setDocumentData(data);

    } catch (error) {
      console.error("Document loading error:", error);

      setError(
        error.response?.data?.detail ||
        "Unable to load document."
      );

    } finally {
      setLoading(false);
    }
  };


  // ==========================================
  // PDF
  // ==========================================

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
    setPageNumber(1);
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


  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F7F7F4] flex items-center justify-center">
        <div className="text-center">

          <div className="w-10 h-10 border-4 border-[#65735B]/20 border-t-[#65735B] rounded-full animate-spin mx-auto" />

          <p className="mt-4 text-stone-500">
            Loading document...
          </p>

        </div>
      </div>
    );
  }


  // ==========================================
  // ERROR
  // ==========================================

  if (error || !documentData) {
    return (
      <div className="min-h-screen bg-[#F7F7F4] flex items-center justify-center px-6">

        <div className="bg-white rounded-3xl border border-stone-200 shadow-sm p-10 text-center max-w-md">

          <AlertCircle
            size={45}
            className="mx-auto text-red-500"
          />

          <h2 className="text-2xl font-bold text-stone-900 mt-5">
            Document not found
          </h2>

          <p className="text-stone-500 mt-2">
            {error || "Unable to load this document."}
          </p>

          <button
            onClick={() => navigate("/documents")}
            className="mt-6 bg-[#65735B] text-white px-6 py-3 rounded-xl hover:bg-[#55624D]"
          >
            Back to Documents
          </button>

        </div>

      </div>
    );
  }


  const isPDF =
    documentData.file_type === "PDF" ||
    documentData.file?.toLowerCase().endsWith(".pdf");


  return (
    <div className="min-h-screen bg-[#F7F7F4] p-6 lg:p-10">

      {/* ==========================================
          HEADER
      ========================================== */}

      <div className="max-w-[1600px] mx-auto">

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">

          <button
            onClick={() => navigate("/documents")}
            className="flex items-center gap-2 text-[#65735B] font-medium hover:underline w-fit"
          >
            <ArrowLeft size={18} />
            Back to Documents
          </button>


          <a
            href={documentData.file}
            target="_blank"
            rel="noopener noreferrer"
            download
            className="flex items-center justify-center gap-2 bg-[#65735B] text-white px-5 py-3 rounded-xl hover:bg-[#55624D] transition w-fit"
          >
            <Download size={18} />
            Download
          </a>

        </div>


        {/* ==========================================
            DOCUMENT TITLE
        ========================================== */}

        <div className="mb-8">

          <h1 className="text-3xl lg:text-4xl font-bold text-stone-900 break-words">
            {documentData.title}
          </h1>

          <div className="flex flex-wrap items-center gap-3 mt-4">

            {/* File Type */}

            <span className="px-3 py-1 rounded-full bg-stone-200 text-stone-700 text-sm font-medium">
              {documentData.file_type || "Document"}
            </span>


            {/* Status */}

            {documentData.status === "COMPLETED" && (
              <span className="flex items-center gap-1 px-3 py-1 rounded-full bg-green-100 text-green-700 text-sm font-medium">
                <CheckCircle size={14} />
                Completed
              </span>
            )}


            {documentData.status === "PROCESSING" && (
              <span className="flex items-center gap-1 px-3 py-1 rounded-full bg-yellow-100 text-yellow-700 text-sm font-medium">
                <Clock size={14} />
                Processing
              </span>
            )}


            {documentData.status === "FAILED" && (
              <span className="flex items-center gap-1 px-3 py-1 rounded-full bg-red-100 text-red-700 text-sm font-medium">
                <AlertCircle size={14} />
                Failed
              </span>
            )}

          </div>

        </div>


        {/* ==========================================
            MAIN GRID
        ========================================== */}

        <div className="grid lg:grid-cols-[minmax(0,1.5fr)_minmax(350px,0.8fr)] gap-8">


          {/* ==========================================
              LEFT PANEL
          ========================================== */}

          <div>

            {isPDF ? (

              <div className="bg-white rounded-3xl border border-stone-200 shadow-sm overflow-hidden">

                {/* Toolbar */}

                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 px-6 py-5 border-b border-stone-200">

                  <h2 className="flex items-center gap-2 text-xl font-bold text-stone-900">

                    <FileText className="text-[#65735B]" />

                    PDF Preview

                  </h2>


                  <div className="flex items-center gap-3">

                    <button
                      onClick={zoomOut}
                      className="p-2 rounded-lg border border-stone-200 hover:bg-stone-100"
                    >
                      <ZoomOut size={18} />
                    </button>


                    <span className="font-semibold text-sm">
                      {Math.round(scale * 100)}%
                    </span>


                    <button
                      onClick={zoomIn}
                      className="p-2 rounded-lg border border-stone-200 hover:bg-stone-100"
                    >
                      <ZoomIn size={18} />
                    </button>

                  </div>

                </div>


                {/* PDF */}

                <div className="bg-stone-100 h-[760px] overflow-auto flex justify-center py-8">

                  <Document
                    file={documentData.file}
                    onLoadSuccess={onDocumentLoadSuccess}
                    loading={
                      <p className="text-stone-500">
                        Loading PDF...
                      </p>
                    }
                    error={
                      <p className="text-red-500">
                        Unable to load PDF preview.
                      </p>
                    }
                  >

                    <Page
                      pageNumber={pageNumber}
                      scale={scale}
                    />

                  </Document>

                </div>


                {/* Footer */}

                <div className="flex justify-between items-center px-6 py-5 border-t border-stone-200">

                  <button
                    disabled={pageNumber === 1}
                    onClick={prevPage}
                    className="flex items-center gap-2 border border-stone-200 rounded-xl px-4 py-2 disabled:opacity-50"
                  >
                    <ChevronLeft size={18} />
                    Previous
                  </button>


                  <span className="font-semibold text-sm">
                    Page {pageNumber} of {numPages}
                  </span>


                  <button
                    disabled={pageNumber === numPages}
                    onClick={nextPage}
                    className="flex items-center gap-2 border border-stone-200 rounded-xl px-4 py-2 disabled:opacity-50"
                  >
                    Next
                    <ChevronRight size={18} />
                  </button>

                </div>

              </div>

            ) : (

              <div className="bg-white rounded-3xl border border-stone-200 shadow-sm p-8">

                <div className="flex items-center gap-4">

                  <div className="w-14 h-14 rounded-2xl bg-[#65735B]/10 flex items-center justify-center">

                    <FileText
                      className="text-[#65735B]"
                      size={28}
                    />

                  </div>

                  <div>

                    <h2 className="text-xl font-bold text-stone-900">
                      {documentData.title}
                    </h2>

                    <p className="text-stone-500 mt-1">
                      {documentData.file_type} document
                    </p>

                  </div>

                </div>


                <div className="mt-8">

                  <h3 className="text-lg font-bold text-stone-900 mb-3">
                    Extracted Text
                  </h3>

                  <div className="bg-stone-50 rounded-2xl p-6 max-h-[600px] overflow-auto">

                    <p className="text-stone-600 leading-7 whitespace-pre-line">
                      {documentData.extracted_text ||
                        "Text extraction is not available yet."}
                    </p>

                  </div>

                </div>

              </div>

            )}

          </div>


          {/* ==========================================
              RIGHT PANEL
          ========================================== */}

          <div className="space-y-6">


            {/* AI SUMMARY */}

            <div className="bg-white rounded-3xl border border-stone-200 shadow-sm p-6">

              <h2 className="text-xl font-bold mb-4 text-stone-900">
                AI Summary
              </h2>

              <p className="text-stone-600 leading-8 whitespace-pre-line">
                {documentData.summary ||
                  "AI summary will appear here after processing."}
              </p>

            </div>


            {/* CATEGORY */}

            <div className="bg-white rounded-3xl border border-stone-200 shadow-sm p-6">

              <h2 className="text-xl font-bold mb-4 text-stone-900">
                Category
              </h2>

              <span className="inline-flex px-4 py-2 rounded-full bg-[#65735B]/10 text-[#65735B] font-medium">
                {documentData.category ||
                  "Uncategorized"}
              </span>

            </div>


            {/* KEYWORDS */}

            <div className="bg-white rounded-3xl border border-stone-200 shadow-sm p-6">

              <h2 className="text-xl font-bold mb-4 text-stone-900">
                Keywords
              </h2>

              <div className="flex flex-wrap gap-2">

                {Array.isArray(documentData.keywords) &&
                documentData.keywords.length > 0 ? (

                  documentData.keywords.map(
                    (keyword, index) => (

                      <span
                        key={`${keyword}-${index}`}
                        className="px-3 py-2 rounded-full bg-stone-100 text-stone-700 text-sm"
                      >
                        {keyword}
                      </span>

                    )
                  )

                ) : (

                  <p className="text-stone-500">
                    No keywords extracted yet.
                  </p>

                )}

              </div>

            </div>


            {/* INSIGHTS */}

            <div className="bg-white rounded-3xl border border-stone-200 shadow-sm p-6">

              <h2 className="text-xl font-bold mb-4 text-stone-900">
                AI Insights
              </h2>

              <p className="text-stone-600 leading-8 whitespace-pre-line">
                {documentData.insights ||
                  "No insights generated yet."}
              </p>

            </div>


            {/* RECOMMENDATIONS */}

            <div className="bg-white rounded-3xl border border-stone-200 shadow-sm p-6">

              <h2 className="text-xl font-bold mb-4 text-stone-900">
                Recommendations
              </h2>

              <p className="text-stone-600 leading-8 whitespace-pre-line">
                {documentData.recommendations ||
                  "No recommendations available yet."}
              </p>

            </div>


            {/* AI CHAT */}

            <div className="bg-white rounded-3xl border border-stone-200 shadow-sm p-6">

              <h2 className="text-xl font-bold mb-5 text-stone-900">
                Chat with this Document
              </h2>

              <ChatBox
                documentId={documentData.id}
              />

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}

export default DocumentDetails;