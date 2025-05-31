import api from "../axiosInstance";

// Add course
export async function addCourse(courseData) {
  try {
    const res = await api.post("courses/manage/courses/", courseData);
    return res.data;
  } catch (error) {
    console.error("Error adding course:", error.message);
    throw error;
  }
}

// Delete course
export async function deleteCourse(courseId) {
  try {
    const res = await api.delete(`courses/manage/courses/${courseId}/`);
    return res.data;
  } catch (error) {
    console.error("Error deleting course:", error.message);
    throw error;
  }
}

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

// Course management
export async function getCourses() {
  try {
    const res = await api.get("courses/courses");
    return res.data;
  } catch (error) {
    console.error("Error fetching courses:", error.message);
    throw error;
  }
}

export async function getSeasons() {
  try {
    const res = await api.get("courses/manage/seasons/");
    return res.data;
  } catch (error) {
    console.error("Error fetching seasons:", error.message);
    throw error;
  }
}

export async function getBatches() {
  try {
    const res = await api.get("courses/manage/batches/");
    return res.data;
  } catch (error) {
    console.error("Error fetching batches:", error.message);
    throw error;
  }
}

export async function addBatch(batchData) {
  try {
    const res = await api.post("courses/manage/batches/", batchData);
    return res.data;
  } catch (error) {
    console.error("Error adding batch:", error.message);
    throw error;
  }
}

export async function deleteBatch(batchId) {
  try {
    const res = await api.delete(`courses/manage/batches/${batchId}/`);
    return res.data;
  } catch (error) {
    console.error("Error deleting batch:", error.message);
    throw error;
  }
}

export async function addSeason(seasonData) {
  try {
    const res = await api.post("courses/manage/seasons/", seasonData);
    return res.data;
  } catch (error) {
    console.error("Error adding season:", error.message);
    throw error;
  }
}

export async function deleteSeason(seasonId) {
  try {
    const res = await api.delete(`courses/manage/seasons/${seasonId}/`);
    return res.data;
  } catch (error) {
    console.error("Error deleting season:", error.message);
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

export async function addQuizQuestion(questionData) {
  try {
    const res = await api.post("intro/questions/manage/", questionData);
    return res.data;
  } catch (error) {
    console.error("Error adding quiz question:", error.message);
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

export async function addSession(data) {
  try {
    const res = await api.post("intro/sessions/manage/", data);
    return res.data;
  } catch (error) {
    console.error("Error adding session:", error.message);
    throw error;
  }
}

export async function deleteSession(id) {
  try {
    const res = await api.delete(`intro/sessions/manage/${id}/`);
    return res.data;
  } catch (error) {
    console.error("Error deleting session:", error.message);
    throw error;
  }
}

export async function addUser(data) {
  try {
    const res = await api.post("users/manage/", data);
    return res.data;
  } catch (error) {
    console.error("Error adding user:", error.message);
    throw error;
  }
}

export async function deleteUser(id) {
  try {
    const res = await api.delete(`users/manage/${id}/`);
    return res.data;
  } catch (error) {
    console.error("Error deleting user:", error.message);
    throw error;
  }
}

// User profile
export async function getUserMe() {
  try {
    const res = await api.get("users/me");
    return res.data;
  } catch (error) {
    console.error("Error fetching user profile:", error.message);
    throw error;
  }
}

export function getUserProfilePhotoUrl(userId) {
  return `http://127.0.0.1:8000/api/users/secure/profile-photo/${userId}`;
}

export async function patchUserMe(formData) {
  try {
    const res = await api.patch("users/me/", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return res.data;
  } catch (error) {
    console.error("Error updating user profile:", error.message);
    throw error;
  }
}

// Children
export async function getChildren() {
  try {
    const res = await api.get("children");
    return res.data;
  } catch (error) {
    console.error("Error fetching children:", error.message);
    throw error;
  }
}

export async function patchChildPhotos(childId, formData) {
  try {
    const res = await api.patch(
      `children/${childId}/upload-photos/`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return res.data;
  } catch (error) {
    console.error("Error uploading child photos:", error.message);
    throw error;
  }
}

export async function createReservation(data) {
  try {
    const res = await api.post("intro/reserve/create/", data);
    return res.data;
  } catch (error) {
    console.error("Error creating reservation:", error.message);
    throw error;
  }
}

// Add intro video
export async function addIntroVideo(formData) {
  try {
    const res = await api.post("intro/videos/manage/", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return res.data;
  } catch (error) {
    console.error("Error adding intro video:", error.message);
    throw error;
  }
}

// Delete intro video
export async function deleteIntroVideo(id) {
  try {
    const res = await api.delete(`intro/videos/manage/${id}/`);
    return res.data;
  } catch (error) {
    console.error("Error deleting intro video:", error.message);
    throw error;
  }
}

export async function getRegistrations() {
  try {
    const res = await api.get("courses/registrations/");
    return res.data;
  } catch (error) {
    console.error("Error fetching registrations:", error.message);
    throw error;
  }
}

export async function getChildById(childId) {
  try {
    const res = await api.get(`children/${childId}`);
    return res.data;
  } catch (error) {
    console.error("Error fetching child:", error.message);
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

export async function getCourseBatches(courseId) {
  try {
    const res = await api.get(`courses/courses/${courseId}/batches/`);
    return res.data;
  } catch (error) {
    console.error("Error fetching course batches:", error.message);
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

export async function deleteQuizQuestion(id) {
  try {
    const res = await api.delete(`intro/questions/manage/${id}/`);
    return res.data;
  } catch (error) {
    console.error("Error deleting quiz question:", error.message);
    throw error;
  }
}

// Users
export async function getUsers() {
  try {
    const res = await api.get("users/manage/");
    return res.data;
  } catch (error) {
    console.error("Error fetching users:", error.message);
    throw error;
  }
}

// Patch user info with JSON body
export async function patchUserMeJson(userData) {
  try {
    const res = await api.patch("users/me/", userData, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return res.data;
  } catch (error) {
    console.error("Error updating user profile with JSON:", error.message);
    throw error;
  }
}

export async function registerChildToBatch(batchId, childId, paymentMethod) {
  try {
    const res = await api.post(`courses/batches/${batchId}/register/`, {
      child: childId,
      payment_method: paymentMethod,
    });
    return res.data;
  } catch (error) {
    console.error("Error registering child to batch:", error.message);
    throw error;
  }
}

export async function addChild(data) {
  try {
    const res = await api.post("children/", data);
    return res.data;
  } catch (error) {
    console.error("Error adding child:", error.message);
    throw error;
  }
}

export async function patchChild(id, data) {
  try {
    const res = await api.patch(`children/${id}/`, data);
    return res.data;
  } catch (error) {
    console.error("Error updating child:", error.message);
    throw error;
  }
}

export function getChildPhotoUrls(childId) {
  return {
    photo_child: `http://127.0.0.1:8000/api/children/${childId}/photo/photo_child`,
    photo_with_parent: `http://127.0.0.1:8000/api/children/${childId}/photo/photo_with_parent`,
  };
}

// Reservations
export async function getReservations() {
  try {
    const res = await api.get("intro/reservations/");
    return res.data;
  } catch (error) {
    console.error("Error fetching reservations:", error.message);
    throw error;
  }
}

export async function toggleReservationActivation(id) {
  try {
    const res = await api.post(`intro/reservations/${id}/toggle-activation/`);
    return res.data;
  } catch (error) {
    console.error("Error toggling reservation activation:", error.message);
    throw error;
  }
}

// Delete resrvelist item
export async function deleteReservation(id) {
  try {
    await api.delete(`intro/reservations/${id}/`);
    return true;
  } catch (error) {
    console.error("Error deleting reservation:", error.message);
    throw error;
  }
}

export async function getBatchById(batchId) {
  try {
    // Since no direct batch by id API, fetch all batches for all courses and find batch
    // But here we assume an API exists for batch by id for simplicity
    const res = await api.get(`courses/batches/${batchId}`);
    return res.data;
  } catch (error) {
    console.error("Error fetching batch:", error.message);
    throw error;
  }
}

export async function uploadInstallmentPayment(installmentId) {
  try {
    // For now, simulate API call without file upload
    const res = await api.post(`courses/installments/${installmentId}/pay/`);
    return res.data;
  } catch (error) {
    console.error("Error uploading installment payment:", error.message);
    throw error;
  }
}
