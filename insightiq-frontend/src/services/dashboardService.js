import api from "../api/axios";

export const getDashboardStats = async () => {
  const response = await api.get("/documents/stats/");
  return response.data;
};

export const getAnalytics = async () => {
  const response = await api.get("/analytics/dashboard/");
  return response.data;
};