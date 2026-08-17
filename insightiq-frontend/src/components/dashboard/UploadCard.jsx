import { useRef, useState } from "react";
import { UploadCloud } from "lucide-react";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";

import { uploadDocument } from "../../services/documentService";

function UploadCard({ onUploadSuccess }) {
  const inputRef = useRef(null);

  const [loading, setLoading] = useState(false);

  const handleUpload = async (file) => {
    if (!file) return;

    // ==========================================
    // FILE TYPE VALIDATION
    // ==========================================

    const allowedTypes = [
      "application/pdf",

      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",

      "text/plain",
    ];

    if (!allowedTypes.includes(file.type)) {
      toast.error(
        "Only PDF, DOCX and TXT files are allowed.",
        {
          icon: "❌",
        }
      );

      if (inputRef.current) {
        inputRef.current.value = "";
      }

      return;
    }

    // ==========================================
    // UPLOAD
    // ==========================================

    try {
      setLoading(true);

      const response = await uploadDocument(file);

      console.log(
        "Upload Success:",
        response
      );

      toast.success(
        "Document uploaded successfully!",
        {
          icon: "📄",
        }
      );

      // Clear input
      if (inputRef.current) {
        inputRef.current.value = "";
      }

      // Tell Dashboard that upload succeeded
      if (onUploadSuccess) {
        onUploadSuccess(response);
      }

    } catch (error) {

      console.error(
        "Upload Error:",
        error
      );

      let message =
        "Failed to upload document.";

      if (error.response?.data) {

        const data =
          error.response.data;

        if (typeof data === "string") {
          message = data;
        } else if (data.detail) {
          message = data.detail;
        } else if (data.file) {
          message = Array.isArray(data.file)
            ? data.file.join(", ")
            : data.file;
        } else {
          message = JSON.stringify(data);
        }
      }

      toast.error(message, {
        icon: "❌",
      });

    } finally {

      setLoading(false);

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
        p-10
        shadow-sm
        transition-all
      "
    >

      {/* Hidden File Input */}

      <input
        ref={inputRef}
        hidden
        type="file"
        accept=".pdf,.docx,.txt"
        onChange={(e) =>
          handleUpload(
            e.target.files?.[0]
          )
        }
      />

      {/* Upload Area */}

      <div
        className="
          flex
          flex-col
          items-center
          justify-center
          rounded-2xl
          border-2
          border-dashed
          border-stone-300
          dark:border-slate-600
          py-16
          transition
        "
      >

        {/* Icon */}

        <div
          className="
            h-20
            w-20
            rounded-full
            bg-[#65735B]/10
            dark:bg-[#65735B]/20
            flex
            items-center
            justify-center
          "
        >
          <UploadCloud
            size={38}
            className="text-[#65735B]"
          />
        </div>


        {/* Heading */}

        <h2
          className="
            mt-6
            text-3xl
            font-bold
            text-stone-900
            dark:text-white
          "
        >
          Upload Your Document
        </h2>


        {/* Description */}

        <p
          className="
            mt-3
            text-center
            text-stone-500
            dark:text-slate-400
          "
        >
          Upload PDF, DOCX or TXT files
        </p>


        {/* Supported Formats */}

        <p
          className="
            mt-2
            text-xs
            text-stone-400
            dark:text-slate-500
          "
        >
          Supported formats: PDF • DOCX • TXT
        </p>


        {/* Button */}

        <Button
          type="button"
          disabled={loading}
          onClick={() =>
            inputRef.current?.click()
          }
          className="
            mt-8
            bg-[#65735B]
            hover:bg-[#55624D]
            disabled:opacity-70
          "
        >
          {loading
            ? "Uploading..."
            : "Browse Files"}
        </Button>

      </div>

    </div>
  );
}

export default UploadCard; 