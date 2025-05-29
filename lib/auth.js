// Token management functions

export function getAccessToken() {
  if (typeof window !== "undefined") {
    return localStorage.getItem("auth_token");
  }
  return null;
}

export function setAccessToken(token) {
  if (typeof window !== "undefined") {
    localStorage.setItem("auth_token", token);
  }
}

export function removeAccessToken() {
  if (typeof window !== "undefined") {
    localStorage.removeItem("auth_token");
  }
}

export function isAuthenticated() {
  return !!getAccessToken();
}
