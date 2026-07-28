import api from "../api/axios";

export const loginUser = async (username, password) => {
  const response = await api.post("/accounts/login/", {
    username,
    password,
  });

  return response.data;
};

export const googleLogin = async (token) => {
  const response = await api.post("/accounts/google-login/", {
    token,
  });

  return response.data;
};

export const getProfile = async () => {
  const response = await api.get("/accounts/profile/");
  return response.data;
};

export const logoutUser = () => {
  localStorage.removeItem("access");
  localStorage.removeItem("refresh");
};

export const updateProfile = async (formData) => {
  const response = await api.put(
    "/accounts/profile/",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return response.data;
};