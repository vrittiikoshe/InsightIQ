import { useRef, useState } from "react";
import { UploadCloud } from "lucide-react";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";

import { uploadDocument } from "../../services/documentService";

function UploadCard() {
  const inputRef = useRef(null);
  const [loading, setLoading] = useState(false);

  const handleUpload = async (file) => {
    if (!file) return;

    try {
      setLoading(true);

      const response = await uploadDocument(file);

      console.log("Upload Success:", response);

      toast.success("Document uploaded successfully!", {
        icon: "📄",
      });

      if (inputRef.current) {
        inputRef.current.value = "";
      }

      setTimeout(() => {
        window.location.reload();
      }, 1200);

    } catch (error) {
      console.error(error);

      toast.error(
        error.response?.data
          ? JSON.stringify(error.response.data)
          : "Upload failed!",
        {
          icon: "❌",
        }
      );
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
      <input
        ref={inputRef}
        hidden
        type="file"
        accept=".pdf"
        onChange={(e) => handleUpload(e.target.files[0])}
      />

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

        <h2 className="mt-6 text-3xl font-bold text-stone-900 dark:text-white">
          Upload Your Document
        </h2>

        <p className="mt-3 text-center text-stone-500 dark:text-slate-400">
          Drag & Drop or Browse PDF
        </p>

        <Button
          type="button"
          disabled={loading}
          onClick={() => inputRef.current.click()}
          className="
            mt-8
            bg-[#65735B]
            hover:bg-[#55624D]
            disabled:opacity-70
          "
        >
          {loading ? "Uploading..." : "Browse Files"}
        </Button>
      </div>
    </div>
  );
}

export default UploadCard; 