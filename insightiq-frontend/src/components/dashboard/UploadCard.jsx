import { useRef, useState } from "react";
import { UploadCloud } from "lucide-react";
import { Button } from "@/components/ui/button";

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

      alert("Document uploaded successfully 🚀");
    } catch (error) {
      console.error("Upload Error:", error);

      console.log("Status:", error.response?.status);
      console.log("Data:", error.response?.data);

      alert(
        error.response?.data
          ? JSON.stringify(error.response.data)
          : error.message
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-10 bg-white rounded-3xl border border-stone-200 p-10">
      <input
        ref={inputRef}
        hidden
        type="file"
        accept=".pdf"
        onChange={(e) => handleUpload(e.target.files[0])}
      />

      <div className="flex flex-col items-center justify-center border-2 border-dashed border-stone-300 rounded-2xl py-16">
        <div className="h-20 w-20 rounded-full bg-[#65735B]/10 flex items-center justify-center">
          <UploadCloud
            size={38}
            className="text-[#65735B]"
          />
        </div>

        <h2 className="text-3xl font-bold mt-6">
          Upload Your Document
        </h2>

        <p className="text-stone-500 mt-3 text-center">
          Drag & Drop or Browse PDF
        </p>

        <Button
          type="button"
          className="mt-8 bg-[#65735B] hover:bg-[#55624D]"
          onClick={() => inputRef.current.click()}
        >
          {loading ? "Uploading..." : "Browse Files"}
        </Button>
      </div>
    </div>
  );
}

export default UploadCard;