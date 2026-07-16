import api from "../api/axios";

export const getDashboardStats = async () => {
  const response = await api.get("/documents/stats/");
  return response.data;
};