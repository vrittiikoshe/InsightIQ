import api from "../api/axios";

/* ---------------- Upload Document ---------------- */

export const uploadDocument = async (file) => {
  const token = localStorage.getItem("access");

  const formData = new FormData();

  formData.append("title", file.name);
  formData.append("file", file);
  formData.append("file_type", "PDF");

  const response = await api.post(
    "/documents/upload/",
    formData,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};

/* ---------------- Get All Documents ---------------- */

export const getDocuments = async () => {
  const response = await api.get("/documents/");
  return response.data;
};

/* ---------------- Get Single Document ---------------- */

export const getDocument = async (id) => {
  const response = await api.get(`/documents/${id}/`);
  return response.data;
};

/* ---------------- Delete Document ---------------- */

export const deleteDocument = async (id) => {
  const response = await api.delete(`/documents/delete/${id}/`);
  return response.data;
};

export const searchDocuments = async (query) => {
  const response = await api.get(`/documents/search/?q=${query}`);
  return response.data;
};