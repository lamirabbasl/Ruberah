// import axios from "axios";
// import { getAccessToken, setAccessToken } from "./auth";

// const api = axios.create({
//   baseURL: process.env.NEXT_PUBLIC_API_URL,
//   withCredentials: true, // important for refresh token cookies
// });

// // Add token to headers
// api.interceptors.request.use((config) => {
//   const token = getAccessToken();
//   if (token) {
//     config.headers.Authorization = `Bearer ${token}`;
//   }
//   return config;
// });

// // Refresh token on 401
// api.interceptors.response.use(
//   (res) => res,
//   async (err) => {
//     const originalRequest = err.config;

//     if (err.response?.status === 401 && !originalRequest._retry) {
//       originalRequest._retry = true;

//       try {
//         const res = await axios.post(
//           `${process.env.NEXT_PUBLIC_API_URL}/refreshtoken`,
//           {},
//           { withCredentials: true }
//         );

//         const newAccessToken = res.data.accessToken;
//         setAccessToken(newAccessToken);

//         originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
//         return api(originalRequest);
//       } catch (refreshError) {
//         console.error("Refresh token failed", refreshError);
//         if (typeof window !== "undefined") {
//           window.location.href = "/login";
//         }
//         return Promise.reject(refreshError);
//       }
//     }

//     return Promise.reject(err);
//   }
// );

// export default api;
