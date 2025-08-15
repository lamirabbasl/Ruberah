import api from "../axiosInstance";
import { getToken } from "../utils/token"; // adjust the path as needed

// Confirm payment for non-installment registration
export async function confirmPaymentNonInstallment(registrationId) {
  try {
    const res = await api.patch(`courses/manage/registrations/${registrationId}/update-status/`, {
      approval_status: "approved",
      payment_status: "paid",
    });
    return res.data;
  } catch (error) {
    console.error("Error confirming payment:", error.message);
    throw error;
  }
}

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

export async function editCourse(courseId , formData) {
  try {
    const res = await api.patch(`courses/manage/courses/${courseId}/`, formData);
    return res.data;
  } catch (error) {
    console.error("Error adding course:", error.message);
    throw error;
  }
}

export async function getAdminChildren(page = 1, search = "") {
  try {
    const url = search 
      ? `children/manage/childs/?page=${page}&full_name=${encodeURIComponent(search)}`
      : `children/manage/childs/?page=${page}`;
    const res = await api.get(url);
    return res.data;
  } catch (error) {
    console.error("Error fetching children:", error.message);
    throw error;
  }
}

export async function getAdminChildrenById(id) {
  try {
    const res = await api.get(`children/manage/child/${id}`);
    return res.data;
  } catch (error) {
    console.error("Error searching child:", error.message);
    throw error;
  }
}



export async function searchCourses(name) {
  try {
    const res = await api.get(`courses/manage/courses/?name=${name}`);
    return res.data;
  } catch (error) {
    console.error("Error searching courses:", error.message);
    throw error;
  }
}

async function fetchImageBlob(url) {
  try {
    const res = await api.get(url, { responseType: "blob" });
    return URL.createObjectURL(res.data);
  } catch (error) {
    console.error("Error fetching image:", error.message);
    throw error;
  }
}

export async function getProfilePhotoUrl(userId) {
  return fetchImageBlob(`users/secure/profile-photo/${userId}/`);
}

export async function getChildWithParentPhotoUrl(childId) {
  return fetchImageBlob(`children/${childId}/photo/photo_with_parent`);
}

export async function getChildPhotoUrl(childId) {
  return fetchImageBlob(`children/${childId}/photo/photo_child`);
}

export async function getInstallmentReceiptImage(installmentId) {
  return fetchImageBlob(`courses/installments/${installmentId}/receipt-image/`);
}

export async function getReceiptImage(receiptId) {
  return fetchImageBlob(`courses/registrations/${receiptId}/receipt-image/`);
}

export async function getInstallmentReceiptImageAdmin(installmentId) {
  return fetchImageBlob(`courses/manage/installments/${installmentId}/receipt-image/`);
}

export async function getAdminChildrenImage(childId) {
  return fetchImageBlob(`children/manage/photo/child/${childId}/photo_child/`);
}

export async function getAdminChildrenwithParentImage(childId) {
  return fetchImageBlob(`children/manage/photo/child/${childId}/photo_with_parent/`);
}


export async function getReceiptImageAdmin(installmentId) {
  return fetchImageBlob(`courses/manage/registrations/${installmentId}/receipt-image/`);
}

export async function approveInstallmentPayment(installmentId) {
  try {
    const res = await api.post(`courses/manage/installments/${installmentId}/approve/`);
    return res.data;
  } catch (error) {
    console.error("Error approving installment payment:", error.message);
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

// Bank Accounts management

export async function getBankAccounts() {
  try {
    const res = await api.get("courses/manager/payment-accounts");
    return res.data;
  } catch (error) {
    console.error("Error fetching accounts:", error.message);
    throw error;
  }
}


export async function addBankAccounts(bankData) {
  try {
    const res = await api.post("courses/manager/payment-accounts/", bankData);
    return res.data;
  } catch (error) {
    console.error("Error adding account:", error.message);
    throw error;
  }
}

export async function editBankAccount(bankId , bankData) {
  try {
    const res = await api.patch(`courses/manager/payment-accounts/${bankId}/`, bankData);
    return res.data;
  } catch (error) {
    console.error("Error adding account:", error.message);
    throw error;
  }
}

export async function deleteBankAccount(bankId) {
  try {
    const res = await api.delete(`courses/manager/payment-accounts/${bankId}/`);
    return res.data;
  } catch (error) {
    console.error("Error deleting account:", error.message);
    throw error;
  }
}


export async function searchBankAccount(search) {
  try {
    const params = new URLSearchParams({ seach: search });
    const res = await api.get(`courses/manage/seasons/?${params.toString()}`);
    return res.data;
  } catch (error) {
    console.error("Error searching seasons:", error.message);
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

export const searchBatches = async (title) => {
  const response = await api.get(`courses/manage/batches/?title=${title}`);
  return response.data;
}

export async function searchSeasons(name) {
  try {
    const params = new URLSearchParams({ name: name });
    const res = await api.get(`courses/manage/seasons/?${params.toString()}`);
    return res.data;
  } catch (error) {
    console.error("Error searching seasons:", error.message);
    throw error;
  }
}

export async function getAdminCourses() {
  try {
    const res = await api.get("courses/manage/courses");
    return res.data;
  } catch (error) {
    console.error("Error fetching courses:", error.message);
    throw error;
  }
}

export async function getSeasons() {
  try {
    const res = await api.get("courses/seasons/");
    return res.data;
  } catch (error) {
    console.error("Error fetching seasons:", error.message);
    throw error;
  }
}

export async function getBatches(search = "", season = "") {
  try {
    let url = "courses/manage/batches/";
    const params = new URLSearchParams();
    if (search) {
      params.append("search", search);
    }
    if (season) {
      params.append("season", season);
    }
    if (params.toString()) {
      url += `?${params.toString()}`;
    }
    const res = await api.get(url);
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

export async function editBatch(batchId , batchData) {
  try {
    const res = await api.patch(`courses/manage/batches/${batchId}/`, batchData);
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
export async function editSeason(seasonId , seasonData) {
  try {
    const res = await api.patch(`courses/manage/seasons/${seasonId}/`, seasonData);
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
export async function getOtherParent() {
  try { 
    const res = await api.get("users/profile/other-parent/");
    return res.data;
  } catch (error) {
    console.error("Error fetching user profile:", error.message);
    throw error;
  }
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

export async function getChildrenById(id) {
  try {
    const res = await api.get(`children/${id}`);
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
    const res = await api.post("intro/videos/manage/", formData);
    return res.data;
  } catch (error) {
    console.error("Error adding intro video:", error.message);
    throw error;
  }
}

export async function requestResetPasswordCode(phone) {
  try {
    const res = await api.post("sms/request-code/", phone);
    return res.data;
  } catch (error) {
    console.error("Error adding intro video:", error.message);
    throw error;
  }
}

export async function requestValidPhone(phone) {
  try {
    const res = await api.post("users/request-password-reset/", {
      phone_number : phone
    });
    return res.data;
  } catch (error) {
    console.error("Error adding intro video:", error.message);
    throw error;
  }
}


export async function resetPassword(data) {
  try {
    const res = await api.post("users/reset-password/", data);
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

export async function getRegistrationsAdmin(page = 1, search = '', batch = null) {
  try {
    const searchQueryParam = search ? `&search=${search}` : '';
    const batchParam = batch ? `&batch=${batch}` : '';
    const res = await api.get(`courses/manage/registrations/?page=${page}${searchQueryParam}${batchParam}`);
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

export async function getChildByIdAdmin(childId) {
  try {
    const res = await api.get(`children/manage/child/${childId}`);
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

export async function getUsers(page = 1, searchTerm = "") {
  try {
    const params = { page };
    if (searchTerm) {
      params.search = searchTerm;
    }
    const res = await api.get("users/manage/", { params });
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

export async function patchOtherParent(otherParentData) {
  try {
    const res = await api.post("users/profile/other-parent/", otherParentData, {
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

export async function deleteChild(id) {
  try {
    const res = await api.delete(`children/${id}/`);
    return res.data;
  } catch (error) {
    console.error("Error updating child:", error.message);
    throw error;
  }
}

// Reservations
export async function getReservations(page = 1) {
  try {
    const res = await api.get(`intro/reservations/?page=${page}`);
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

export async function uploadInstallmentPayment(installmentId, file) {
  try {
    const formData = new FormData();
    formData.set("receipt_image", file);

    const res = await api.patchForm(`courses/installments/${installmentId}/upload-receipt/`, formData);

    return res.data;
  } catch (error) {
    console.error("Error uploading installment payment:", error?.response?.data || error.message);
    throw error;
  }
}

export async function UploadCourseImage(coruseId, file) {
  try {
    const formData = new FormData();
    formData.set("image", file);

    const res = await api.patchForm(`courses/manage/${coruseId}/upload-course-image/`, formData);

    return res.data;
  } catch (error) {
    console.error("Error uploading installment payment:", error?.response?.data || error.message);
    throw error;
  }
}

export async function uploadChildPhotos(childId, child, parent) {
  try {
    const formData = new FormData();
    if (child) {
      formData.append("photo_child", child);
    }
    if (parent) {
      formData.append("photo_with_parent", parent);
    }

    const res = await api.patchForm(`children/${childId}/upload-photos/`, formData);

    return res.data;
  } catch (error) {
    console.error("Error uploading child photos:", error?.response?.data || error.message);
    throw error;
  }
}

export async function uploadProfilePicture(file) {
  try {
    const formData = new FormData();
    formData.set("profile_photo", file);

    const res = await api.patchForm(`users/me/`, formData);

    return res.data;
  } catch (error) {
    console.error("Error uploading installment payment:", error?.response?.data || error.message);
    throw error;
  }
}


export async function UploadReceiptPicture(receiptId, file) {
  try {
    const formData = new FormData();
    formData.set("receipt_image", file);

    const res = await api.patchForm(`courses/registrations/${receiptId}/upload-receipt/`, formData);

    return res.data;
  } catch (error) {
    console.error("Error uploading installment payment:", error?.response?.data || error.message);
    throw error;
  }
}

export async function getFirstPageManager() {
  try {
    const res = await api.get("generalinfo/manage/general-info/");
    return res.data;
  } catch (error) {
    console.error("Error fetching installment templates:", error.message);
    throw error;
  }
} 

export async function getIntroText() {
  try {
    const res = await api.get("intro/intro-texts/");
    return res.data;
  } catch (error) {
    console.error("Error fetching installment templates:", error.message);
    throw error;
  }
} 

export async function getRegistrationSummary() {
  try {
    const res = await api.get("courses/manage/registrations/summary/");
    return res.data;
  } catch (error) {
    console.error("Error fetching registration summary:", error.message);
    throw error;
  }
} 

export async function getFirstPage() {
  try {
    const res = await api.get("generalinfo/general-info/");
    return res.data;
  } catch (error) {
    console.error("Error fetching installment templates:", error.message);
    throw error;
  }
} 

export async function editFirstPage(formData) {
  try {
    const res = await api.patch(`/generalinfo/manage/general-info/`, formData );
    return res.data;
  } catch (error) {
    console.error("Error confirming payment:", error.message);
    throw error;
  }
}

export async function createIntroText(formData) {
  try {
    const res = await api.post(`intro/intro-texts/create/`, formData );
    return res.data;
  } catch (error) {
    console.error("Error:", error.message);
    throw error;
  }
}

export async function editIntroText(introTextId ,formData) {
  try {
    const res = await api.patch(`intro/intro-texts/${introTextId}/`, formData );
    return res.data;
  } catch (error) {
    console.error("Error:", error.message);
    throw error;
  }
}

export async function getInstallmentTemplates() {
  try {
    const res = await api.get("courses/manage/installment-templates/");
    return res.data;
  } catch (error) {
    console.error("Error fetching installment templates:", error.message);
    throw error;
  }
}

export async function getRegistrationInstallments(batchId) {
  try {
    const res = await api.get(`courses/registrations/${batchId}/installments/`);
    return res.data;
  } catch (error) {
    console.error("Error fetching registration installments:", error.message);
    throw error;
  }
}


export async function getUsersExport() {
  try {
    const res = await api.get(`courses/manage/export/registrations/summary/`, { 
        responseType: "blob",     
    });
    return res.data;
  } catch (error) {
    console.error("Error fetching registration installments:", error.message);
    throw error;
  }
}

export async function addInstallmentTemplates(data) {
  try {
    const res = await api.post("courses/manage/installment-templates/create/", data);
    return res.data;
  } catch (error) {
    console.error("Error adding installment templates:", error.message);
    throw error;
  }
}

export async function deleteInstallmentTemplate(installmentId) {
  try {
    const res = await api.delete(`courses/manage/installment-templates/${installmentId}/`);
    return res.data;
  } catch (error) {
    console.error("Error deleting installment template:", error.message);
    throw error;
  }
}

export async function getRegistrationDetailsById(registrationId) {
  try {
    const res = await api.get(`courses/manage/registrations/${registrationId}/`);
    return res.data;
  } catch (error) {
    console.error("Error fetching registration details:", error.message);
    throw error;
  }
}

export async function getInstallmentDetailsById(installmentId) {
  try {
    const res = await api.get(`courses/manage/installments/${installmentId}/`);
    return res.data;
  } catch (error) {
    console.error("Error fetching installment details:", error.message);
    throw error;
  }
}

export async function getInstallmentDetailsRegistrationId(regId) {
  try {
    const res = await api.get(`courses/manage/registrations/${regId}/installments/`);
    return res.data;
  } catch (error) {
    console.error("Error fetching installment details:", error.message);
    throw error;
  }
}


// New API functions for phone validation and registration
export async function requestPhoneValidationCode(phone_number) {
  try {
    const res = await api.post("sms/request-code/", {
      phone_number,
      purpose: "signup",
    });
    return res.data;
  } catch (error) {
    console.error("Error requesting phone validation code:", error.message);
    throw error;
  }
}

export async function verifyPhoneValidationCode(phone_number, code , purpose) {
  try {
    const res = await api.post("sms/verify-code/", {
      phone_number,
      code,
      purpose,
    });
    return res.data;
  } catch (error) {
    console.error("Error verifying phone validation code:", error.message);
    throw error;
  }
}

export async function registerUser({
  username,
  phone_number,
  password,
  registration_code,
}) {
  try {
    const res = await api.post("users/register/", {
      username,
      phone_number,
      password,
      registration_code
    });
    return res.data;
  } catch (error) {
    console.error("Error registering user:", error.message);
    throw error;
  }
}