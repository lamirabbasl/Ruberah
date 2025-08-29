import axios from "axios";

const api = axios.create({
  baseURL: "/api/proxy",
  withCredentials: true, // Ensure cookies are sent with requests
});

// Response interceptor for logging and error handling
api.interceptors.response.use(
  (response) => {
    console.log("API response:", response.status, response.config.url);
    return response;
  },
  (error) => {
    console.error("API Error:", {
      status: error.response?.status,
      message: error.message,
      url: error.config?.url,
    });
    return Promise.reject(error);
  }
);

export const requestValidPhone = async (data) => {
  const response = await api.post("/users/valid_phone/", data);
  return response.data;
};

export const requestResetPasswordCode = async (data) => {
  const response = await api.post("/users/request_reset_password_code/", data);
  return response.data;
};

export const verifyPhoneValidationCode = async (phone, code, purpose) => {
  const response = await api.post("/users/verify_phone_validation_code/", {
    phone_number: phone,
    code,
    purpose,
  });
  return response.data;
};

export const resetPassword = async (data) => {
  const response = await api.post("/users/reset_password/", data);
  return response.data;
};

export const requestPhoneValidationCode = async (data) => {
  const response = await api.post("/users/request_phone_validation_code/", data);
  return response.data;
};

export const registerUser = async (data) => {
  const response = await api.post("/users/register/", data);
  return response.data;
};

export const getUserMe = async () => {
  const response = await api.get("/users/me/");
  return response.data;
};

export default api;