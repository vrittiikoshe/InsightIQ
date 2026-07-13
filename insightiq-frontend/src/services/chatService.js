import api from "../api/axios";

export const chatWithDocument = async (documentId, question) => {
  const response = await api.post("/rag/chat/", {
    document_id: documentId,
    question: question,
  });

  return response.data;
};