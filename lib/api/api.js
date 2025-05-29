import api from "../axiosInstance";

// Authentication
export async function login(username, password) {
  try {
    const res = await api.post("users/token/", { username, password });

    if (!res.data.access) {
      throw new Error("Invalid response from server - no access token");
    }

    // Store refresh token
    if (res.data.refresh) {
      localStorage.setItem("refresh_token", res.data.refresh);
    }

    return res.data;
  } catch (error) {
    console.error("Login error:", error.message);
    throw error;
  }
}

// Token management
export async function verifyToken(token) {
  try {
    const res = await api.post("users/token/verify/", { token });
    return res.data;
  } catch (error) {
    console.error("Token verification error:", error.message);
    throw error;
  }
}

export async function refreshToken(refresh) {
  try {
    const res = await api.post("users/token/refresh/", { refresh });
    return res.data;
  } catch (error) {
    console.error("Token refresh error:", error.message);
    throw error;
  }
}

// User management
export async function getUserProfile() {
  try {
    const res = await api.get("users/me/");
    return res.data;
  } catch (error) {
    console.error("Error fetching user profile:", error.message);
    throw error;
  }
}

// Course management
export async function getCourses() {
  try {
    const res = await api.get("courses/");
    return res.data;
  } catch (error) {
    console.error("Error fetching courses:", error.message);
    throw error;
  }
}

export async function getCourseById(id) {
  try {
    const res = await api.get(`courses/${id}/`);
    return res.data;
  } catch (error) {
    console.error("Error fetching course:", error.message);
    throw error;
  }
}

export async function enrollCourse(id) {
  try {
    const res = await api.post(`courses/${id}/enroll/`);
    return res.data;
  } catch (error) {
    console.error("Error enrolling in course:", error.message);
    throw error;
  }
}

// Intro videos
export async function getIntroVideos() {
  try {
    const res = await api.get("intro/video/");
    return res.data;
  } catch (error) {
    console.error("Error fetching intro videos:", error.message);
    throw error;
  }
}

// Quiz
export async function getQuizQuestions() {
  try {
    const res = await api.get("intro/questions/");
    return res.data;
  } catch (error) {
    console.error("Error fetching quiz questions:", error.message);
    throw error;
  }
}

export async function validateQuizAnswers(answers) {
  try {
    const res = await api.post("intro/validate-answers/", { answers });
    return res.data;
  } catch (error) {
    console.error("Error validating answers:", error.message);
    throw error;
  }
}

// Sessions
export async function getSessions() {
  try {
    const res = await api.get("intro/sessions/");
    return res.data;
  } catch (error) {
    console.error("Error fetching sessions:", error.message);
    throw error;
  }
}

// Reservations
export async function createReservation(data) {
  try {
    const res = await api.post("intro/reserve/create/", data);
    return res.data;
  } catch (error) {
    console.error("Error creating reservation:", error.message);
    throw error;
  }
}
