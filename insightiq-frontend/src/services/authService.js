import api from "../api/axios";



export const loginUser = async (username, password) => {
  const response = await api.post(
    "/accounts/login/",
    {
      username,
      password,
    }
  );

  return response.data;
};



export const registerUser = async (userData) => {
  const response = await api.post(
    "/accounts/register/",
    userData
  );

  return response.data;
};




export const googleLogin = async (token) => {
  const response = await api.post(
    "/accounts/google-login/",
    {
      token,
    }
  );

  return response.data;
};



export const getProfile = async () => {
  const response = await api.get(
    "/accounts/profile/"
  );

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



export const changePassword = async (
  oldPassword,
  newPassword
) => {
  const response = await api.post(
    "/accounts/change-password/",
    {
      old_password: oldPassword,
      new_password: newPassword,
    }
  );

  return response.data;
};



export const forgotPassword = async (email) => {
  const response = await api.post(
    "/accounts/forgot-password/",
    {
      email,
    }
  );

  return response.data;
};



export const resetPassword = async (
  uid,
  token,
  newPassword
) => {
  const response = await api.post(
    "/accounts/reset-password/",
    {
      uid,
      token,
      new_password: newPassword,
    }
  );

  return response.data;
};