// export const setToken = (token) => {
//     if (typeof window !== 'undefined') {
//       localStorage.setItem('auth_token', token); // Fallback for client-side
//     }
//   };

//   export const getToken = () => {
//     if (typeof window !== 'undefined') {
//       return localStorage.getItem('auth_token');
//     }
//     return null;
//   };

//   export const removeToken = () => {
//     if (typeof window !== 'undefined') {
//       localStorage.removeItem('auth_token');
//     }
//   };

//   export const isTokenValid = async (token) => {
//     try {
//       const response = await fetch('/api/auth/verify', {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       return response.ok;
//     } catch {
//       return false;
//     }
//   };
