// Token management utilities

export const getToken = () => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("auth_token");
    // Ensure token has Bearer prefix
    if (token) {
      return token.startsWith("Bearer ") ? token : `Bearer ${token}`;
    }
  }
  return null;
};

export const setToken = (token) => {
  if (typeof window !== "undefined") {
    // Ensure token has Bearer prefix when storing
    const tokenWithBearer = token.startsWith("Bearer ")
      ? token
      : `Bearer ${token}`;
    localStorage.setItem("auth_token", tokenWithBearer);
    // Also set as cookie for SSR
    document.cookie = `auth_token=${tokenWithBearer}; path=/`;
  }
};

export const removeToken = () => {
  if (typeof window !== "undefined") {
    localStorage.removeItem("auth_token");
    // Also remove cookie
    document.cookie =
      "auth_token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT";
  }
};
