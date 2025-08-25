"use client";
import { motion } from "framer-motion";
import React, { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { getUserMe, patchUserMeJson, getProfilePhotoUrl, uploadProfilePicture, patchOtherParent } from "@/lib/api/api";
import LoadingSpinner from "../common/LoadingSpinner";
import ProfilePhotoSection from "./ProfilePhotoSection";
import ProfileDisplay from "./ProfileDisplay";
import EditModal from "./EditModal";
import Notification from "./Notification";
import { convertToJalali } from "@/lib/utils/convertDate";

const InformationPage = () => {
  const [user, setUser] = useState(null);
  const [otherParent, setOtherParent] = useState(null);
  const [profilePhotoUrl, setProfilePhotoUrl] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);
  const [error, setError] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [activeTab, setActiveTab] = useState("user");
  const [editingOtherParent, setEditingOtherParent] = useState(false);
  const [editingUser, setEditingUser] = useState(false);
  const [tempOtherParent, setTempOtherParent] = useState({});
  const [tempUser, setTempUser] = useState({});
  const [savingOtherParent, setSavingOtherParent] = useState(false);
  const [savingUser, setSavingUser] = useState(false);
  const [showNotification, setShowNotification] = useState(false);

  // Fetch user info and other parent info on mount
  useEffect(() => {
    const fetchData = async () => {
      setLoadingUser(true);
      try {
        const userData = await getUserMe();
        setUser(userData);
        setOtherParent(userData?.other_parent_profile || {
          first_name: "",
          last_name: "",
          date_of_birth: "",
          place_of_birth: "",
          marital_status: "",
          occupation: "",
          field_of_study: "",
          highest_education: "",
          phone_number: "",
          national_id: "",
          full_address: "",
          landline_number: "",
          emergency_contact_number: "",
          gender: ""
        });
        if (userData && userData.id) {
          try {
            const photoUrl = await getProfilePhotoUrl(userData.id);
            setProfilePhotoUrl(photoUrl);
          } catch (err) {
            console.error("Error fetching profile photo:", err);
            toast.error(err.response?.data?.message);
          }
        }
      } catch (err) {
        console.error("Error fetching user info:", err);
        const errorMessage = err.response?.data?.message ||  "خطا در بارگذاری اطلاعات";
        toast.error(errorMessage);
        setError(errorMessage);
      } finally {
        setLoadingUser(false);
      }
    };

    fetchData();
  }, []);

  // Handle profile photo upload
  const handleProfilePhotoChange = async (event) => {
    const file = event.target.files[0];
    if (!file) {
      toast.error("لطفا یک فایل تصویر انتخاب کنید");
      return;
    }
    setUploading(true);
    setError(null);
    try {
      const response = await uploadProfilePicture(file);
      toast.success(response.data?.message || "عکس پروفایل با موفقیت بروزرسانی شد.");
      const updatedPhotoUrl = await getProfilePhotoUrl(user.id);
      setProfilePhotoUrl(updatedPhotoUrl);
    } catch (err) {
      console.error("Error uploading profile photo:", err);
      toast.error(err.response?.data?.message ||  "خطا در آپلود عکس پروفایل");
    } finally {
      setUploading(false);
    }
  };

  if (loadingUser) {
    return <div className="w-screen"><LoadingSpinner /></div>;
  }

  if (error) {
    return <p className="text-center mt-10 text-red-600">{error}</p>;
  }

  // Definitions for fields
  const userFields = [
    "first_name",
    "last_name",
    "username",
    "phone_number",
    "national_id",
    "full_address",
    "date_of_birth",
    "place_of_birth",
    "marital_status",
    "occupation",
    "field_of_study",
    "highest_education",
    "landline_number",
    "emergency_contact_number",
    "gender",
    "how_did_you_know_about_us",
  ];

  const editUserFields = [
    "first_name",
    "last_name",
    "national_id",
    "full_address",
    "date_of_birth",
    "place_of_birth",
    "marital_status",
    "occupation",
    "field_of_study",
    "highest_education",
    "landline_number",
    "emergency_contact_number",
    "gender",
    "how_did_you_know_about_us",
  ];

  const otherParentFields = [
    "first_name",
    "last_name",
    "phone_number",
    "national_id",
    "full_address",
    "date_of_birth",
    "place_of_birth",
    "marital_status",
    "occupation",
    "field_of_study",
    "highest_education",
    "landline_number",
    "emergency_contact_number",
    "gender",
  ];

  const requiredFields = [
    "first_name",
    "last_name",
    "date_of_birth",
    "place_of_birth",
    "marital_status",
    "phone_number",
    "national_id",
    "full_address",
    "emergency_contact_number",
    "gender",
  ];

  const translations = {
    gender: {
      father: "پدر",
      mother: "مادر",
    },
    marital_status: {
      single: "مجرد",
      married: "متأهل",
      divorced: "طلاق گرفته",
      widowed: "بیوه",
    },
  };

  const getLabel = (key) => {
    switch (key) {
      case "first_name":
        return "نام";
      case "last_name":
        return "نام خانوادگی";
      case "username":
        return "نام کاربری";
      case "phone_number":
        return "شماره تماس";
      case "national_id":
        return "کد ملی";
      case "full_address":
        return "آدرس";
      case "date_of_birth":
        return "تاریخ تولد";
      case "place_of_birth":
        return "محل تولد";
      case "marital_status":
        return "وضعیت تأهل";
      case "occupation":
        return "شغل";
      case "field_of_study":
        return "رشته تحصیلی";
      case "highest_education":
        return "بالاترین مدرک تحصیلی";
      case "landline_number":
        return "شماره ثابت";
      case "emergency_contact_number":
        return "شماره اضطراری";
      case "gender":
        return "جنسیت";
      case "how_did_you_know_about_us":
        return "چگونه با ما آشنا شدید؟";
      default:
        return key;
    }
  };

  const getType = (key) => {
    if (key === "date_of_birth") return "date";
    if (key === "marital_status" || key === "gender") return "select";
    return "text";
  };

  const getOptions = (key) => {
    if (key === "marital_status") {
      return [
        { value: "single", label: "مجرد" },
        { value: "married", label: "متأهل" },
        { value: "divorced", label: "طلاق گرفته" },
        { value: "widowed", label: "بیوه" },
      ];
    }
    if (key === "gender") {
      return [
        { value: "father", label: "پدر" },
        { value: "mother", label: "مادر" },
      ];
    }
    return [];
  };

  const displayValueFunc = (key, val) => {
    if (getType(key) === "date") {
      return convertToJalali(val) || "-";
    } else if (key === "gender" && translations.gender[val]) {
      return translations.gender[val] || "-";
    } else if (key === "marital_status" && translations.marital_status[val]) {
      return translations.marital_status[val] || "-";
    } else {
      return val || "-";
    }
  };

  const userData = user ? {
    ...user.profile,
    username: user.username,
    phone_number: user.phone_number, // Use top-level phone_number
    full_address: user.address,
    how_did_you_know_about_us: user.how_did_you_know_about_us,
  } : {};

  const handleSaveOtherParent = async (e) => {
    e.preventDefault();
    if (requiredFields.some((f) => !tempOtherParent[f] || tempOtherParent[f].trim() === "")) {
      setShowNotification(true);
      toast.error("لطفا تمام فیلدهای الزامی را پر کنید.");
      setTimeout(() => setShowNotification(false), 3000);
      return;
    }
    setShowNotification(false);
    setSavingOtherParent(true);
    try {
      const response = await patchOtherParent(tempOtherParent);
      toast.success(response.data?.message || "اطلاعات والد دیگر با موفقیت بروزرسانی شد.");
      setUser((prev) => ({
        ...prev,
        other_parent_profile: response,
      }));
      setOtherParent(response);
      setEditingOtherParent(false);
    } catch (err) {
      console.error("Error updating other parent info:", err);
      if (err.response?.data && typeof err.response.data === 'object') {
        Object.keys(err.response.data).forEach((key) => {
          const messages = err.response.data[key];
          if (Array.isArray(messages)) {
            messages.forEach((message) => toast.error(`${getLabel(key)}: ${message}`));
          } else {
            toast.error(`${getLabel(key)}: ${messages}`);
          }
        });
      } else {
        toast.error(err.response?.data?.message ||  "خطا در بروزرسانی اطلاعات والد دیگر");
      }
    } finally {
      setSavingOtherParent(false);
    }
  };

  const handleSaveUser = async (e) => {
    e.preventDefault();
    const userRequiredFields = [
      "first_name",
      "last_name",
      "username",
      "date_of_birth",
      "place_of_birth",
      "marital_status",
      "phone_number",
      "national_id",
      "full_address",
      "emergency_contact_number",
      "gender",
    ];
    if (userRequiredFields.some((f) => !tempUser[f] || tempUser[f].trim() === "")) {
      setShowNotification(true);
      toast.error("لطفا تمام فیلدهای الزامی را پر کنید.");
      setTimeout(() => setShowNotification(false), 3000);
      return;
    }
    setShowNotification(false);
    setSavingUser(true);
    try {
      const updatedProfile = {
        first_name: tempUser.first_name,
        last_name: tempUser.last_name,
        date_of_birth: tempUser.date_of_birth,
        place_of_birth: tempUser.place_of_birth,
        marital_status: tempUser.marital_status,
        occupation: tempUser.occupation,
        field_of_study: tempUser.field_of_study,
        highest_education: tempUser.highest_education,
        national_id: tempUser.national_id,
        full_address: tempUser.full_address,
        landline_number: tempUser.landline_number,
        emergency_contact_number: tempUser.emergency_contact_number,
        gender: tempUser.gender,
      };
      const updatedUser = {

        address: tempUser.full_address,
        is_colleague: user.is_colleague,
        full_name: `${tempUser.first_name} ${tempUser.last_name}`,
        first_name: tempUser.first_name,
        last_name: tempUser.last_name,
        how_did_you_know_about_us: tempUser.how_did_you_know_about_us,
        profile: updatedProfile,
      };
      const response = await patchUserMeJson(updatedUser);
      toast.success(response.data?.message || "اطلاعات با موفقیت بروزرسانی شد.");
      setUser(response);
      setEditingUser(false);
    } catch (err) {
      console.error("Error updating user info:", err);
      if (err.response?.data && typeof err.response.data === 'object') {
        Object.keys(err.response.data).forEach((key) => {
          if (key === 'profile') {
            const profileErrors = err.response.data[key];
            if (typeof profileErrors === 'object' && profileErrors !== null) {
              Object.keys(profileErrors).forEach((subKey) => {
                const messages = profileErrors[subKey];
                if (Array.isArray(messages)) {
                  messages.forEach((message) => toast.error(`${getLabel(subKey)}: ${message}`));
                } else {
                  toast.error(`${getLabel(subKey)}: ${messages}`);
                }
              });
            }
          } else {
            const messages = err.response.data[key];
            if (Array.isArray(messages)) {
              messages.forEach((message) => toast.error(`${getLabel(key)}: ${message}`));
            } else {
              toast.error(`${getLabel(key)}: ${messages}`);
            }
          }
        });
      } else {
        toast.error(err.response?.data?.message ||  "خطا در بروزرسانی اطلاعات");
      }
    } finally {
      setSavingUser(false);
    }
  };

  return (
    <motion.div
      layout
      dir="rtl"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col font-mitra items-center p-6 max-w-xl max-md:w-screen mx-auto bg-gradient-to-br from-white to-gray-100 shadow-2xl rounded-2xl mt-4 space-y-6"
    >
      <ToastContainer
        position="bottom-right"
        autoClose={3000}
        hideProgressBar={false}
        closeOnClick
        pauseOnHover
        draggable
        theme="light"
        rtl={true}
      />
      {showNotification && (
        <Notification
          message="لطفا تمام فیلدهای الزامی را پر کنید."
        />
      )}
      {/* Tabs */}
      <div className="flex w-full border-b border-gray-200">
        <button
          className={`flex-1 py-2 text-center ${
            activeTab === "user" ? "border-b-2 border-blue-600 text-blue-600" : "text-gray-500"
          }`}
          onClick={() => setActiveTab("user")}
        >
          اطلاعات شخصی
        </button>
        <button
          className={`flex-1 py-2 text-center ${
            activeTab === "otherParent" ? "border-b-2 border-blue-600 text-blue-600" : "text-gray-500"
          }`}
          onClick={() => setActiveTab("otherParent")}
        >
          اطلاعات والد دیگر
        </button>
      </div>

      {activeTab === "user" && user && (
        <>
          <ProfilePhotoSection
            profilePhotoUrl={profilePhotoUrl}
            uploading={uploading}
            handleProfilePhotoChange={handleProfilePhotoChange}
          />
          <ProfileDisplay
            fields={userFields}
            data={userData}
            getLabel={getLabel}
            displayValueFunc={displayValueFunc}
          />
          <button
            onClick={() => {
              setTempUser(userData);
              setEditingUser(true);
            }}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition-colors duration-200"
          >
            ویرایش اطلاعات شخصی
          </button>
        </>
      )}
      {activeTab === "otherParent" && otherParent && (
        <>
          <ProfileDisplay
            fields={otherParentFields}
            data={otherParent}
            getLabel={getLabel}
            displayValueFunc={displayValueFunc}
          />
          <button
            onClick={() => {
              setTempOtherParent({ ...otherParent });
              setEditingOtherParent(true);
            }}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition-colors duration-200"
          >
            ویرایش اطلاعات والد دیگر
          </button>
        </>
      )}
      <EditModal
        isOpen={editingUser}
        onClose={() => setEditingUser(false)}
        title="ویرایش اطلاعات شخصی"
        fields={editUserFields}
        tempData={tempUser}
        setTempData={setTempUser}
        onSave={handleSaveUser}
        saving={savingUser}
        getLabel={getLabel}
        getType={getType}
        getOptions={getOptions}
      />
      <EditModal
        isOpen={editingOtherParent}
        onClose={() => setEditingOtherParent(false)}
        title="ویرایش اطلاعات والد دیگر"
        fields={otherParentFields}
        tempData={tempOtherParent}
        setTempData={setTempOtherParent}
        onSave={handleSaveOtherParent}
        saving={savingOtherParent}
        getLabel={getLabel}
        getType={getType}
        getOptions={getOptions}
      />
    </motion.div>
  );
};

export default InformationPage;