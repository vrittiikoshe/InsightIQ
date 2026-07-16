import api from "../api/axios";

export const getProfile = async () => {
  const response = await api.get("/accounts/profile/");
  return response.data;
};