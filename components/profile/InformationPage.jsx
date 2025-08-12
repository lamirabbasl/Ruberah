"use client";
import { motion } from "framer-motion";
import React, { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { getUserMe, patchUserMeJson, getProfilePhotoUrl, uploadProfilePicture, patchOtherParent } from "@/lib/api/api";
import EditableField from "./EditableField";
import LoadingSpinner from "../common/LoadingSpinner";
import JalaliCalendar from "../common/JalaliCalendar";
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
  const [tempOtherParent, setTempOtherParent] = useState({});
  const [savingOtherParent, setSavingOtherParent] = useState(false);
  const [showDateCalendar, setShowDateCalendar] = useState(false);

  // Fetch user info and other parent info on mount
  useEffect(() => {
    const fetchData = async () => {
      setLoadingUser(true);
      try {
        // Fetch user data
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
            toast.error(err.response?.data?.message || err.message || "خطا در دریافت عکس پروفایل");
          }
        }
      } catch (err) {
        console.error("Error fetching user info:", err);
        const errorMessage = err.response?.data?.message || err.message || "خطا در بارگذاری اطلاعات";
        toast.error(errorMessage);
        setError(errorMessage);
      } finally {
        setLoadingUser(false);
      }
    };

    fetchData();
  }, []);

  // Handle user profile field change and save
  const handleUserFieldChange = async (field, value) => {
    if (!user) return;
    const updatedProfile = {
      ...user.profile,
      [field]: value,
    };
    const updatedUser = {
      username: field === "username" ? value : user.username,
      phone_number: field === "phone_number" ? value : user.phone_number,
      address: field === "address" ? value : user.address,
      is_colleague: user.is_colleague,
      full_name: `${updatedProfile.first_name} ${updatedProfile.last_name}`,
      first_name: updatedProfile.first_name,
      last_name: updatedProfile.last_name,
      how_did_you_know_about_us: field === "how_did_you_know_about_us" ? value : user.how_did_you_know_about_us,
      profile: {
        first_name: updatedProfile.first_name,
        last_name: updatedProfile.last_name,
        date_of_birth: updatedProfile.date_of_birth,
        place_of_birth: updatedProfile.place_of_birth,
        marital_status: updatedProfile.marital_status,
        occupation: updatedProfile.occupation,
        field_of_study: updatedProfile.field_of_study,
        highest_education: updatedProfile.highest_education,
        phone_number: updatedProfile.phone_number,
        national_id: updatedProfile.national_id,
        full_address: updatedProfile.full_address,
        landline_number: updatedProfile.landline_number,
        emergency_contact_number: updatedProfile.emergency_contact_number,
        gender: updatedProfile.gender,
      },
    };
    try {
      const response = await patchUserMeJson(updatedUser);
      toast.success(response.data?.message || "اطلاعات با موفقیت بروزرسانی شد.");
      setUser(response);
    } catch (err) {
      console.error("Error updating user info:", err);
      toast.error(err.response?.data?.message || err.message || "خطا در بروزرسانی اطلاعات");
    }
  };

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
      toast.error(err.response?.data?.message || err.message || "خطا در آپلود عکس پروفایل");
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

  // Definitions for other parent
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

  const renderInput = (key, value, onChange) => {
    const inputType = getType(key);
    if (inputType === "select") {
      return (
        <select
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
          className="mt-1 p-1 text-gray-800 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 text-right w-full"
        >
          <option value="">انتخاب کنید</option>
          {getOptions(key).map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      );
    } else if (inputType === "date") {
      return (
        <div className="relative">
          <input
            type="text"
            readOnly
            value={convertToJalali(value)}
            onClick={() => setShowDateCalendar(true)}
            className="mt-1 p-1 text-gray-800 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 text-right w-full cursor-pointer bg-white"
          />
          {showDateCalendar && (
            <div className="absolute z-50 mt-2 bg-white shadow-lg rounded-lg">
              <JalaliCalendar
                onDateSelect={(date) => {
                  onChange(date);
                  setShowDateCalendar(false);
                }}
              />
            </div>
          )}
        </div>
      );
    } else {
      return (
        <input
          type="text"
          className="mt-1 p-1 text-gray-800 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 text-right w-full"
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
        />
      );
    }
  };

  const handleSaveOtherParent = async (e) => {
    e.preventDefault();
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
    if (requiredFields.some((f) => !tempOtherParent[f] || tempOtherParent[f].trim() === "")) {
      toast.error("لطفا تمام فیلدهای الزامی را پر کنید.");
      return;
    }
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
      // Handle new error format
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
        toast.error(err.response?.data?.message || err.message || "خطا در بروزرسانی اطلاعات والد دیگر");
      }
    } finally {
      setSavingOtherParent(false);
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

      {/* Profile photo (only shown in user tab) */}
      {activeTab === "user" && (
        <motion.div
          className="relative mb-4"
          whileHover={{ scale: 1.05 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <img
            src={profilePhotoUrl}
            alt="User Profile"
            className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-md"
          />
          <label
            htmlFor="profilePhotoInput"
            className="absolute bottom-0 right-0 bg-blue-600 text-white rounded-full p-2 cursor-pointer hover:bg-blue-700 transition-colors duration-200"
            title="تغییر عکس پروفایل"
          >
            {uploading ? (
              <span className="text-xs px-2">در حال آپلود...</span>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            )}
          </label>
          <input
            id="profilePhotoInput"
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleProfilePhotoChange}
            disabled={uploading}
          />
        </motion.div>
      )}

      {/* Editable fields */}
      <div className="w-full space-y-4">
        {activeTab === "user" && user && (
          <>
            <EditableField
              label="نام"
              value={user.profile?.first_name || ""}
              onChange={(val) => handleUserFieldChange("first_name", val)}
              type="text"
            />
            <EditableField
              label="نام خانوادگی"
              value={user.profile?.last_name || ""}
              onChange={(val) => handleUserFieldChange("last_name", val)}
              type="text"
            />
            <EditableField
              label="نام کاربری"
              value={user.username || ""}
              onChange={(val) => handleUserFieldChange("username", val)}
              type="text"
            />
            <EditableField
              label="شماره تماس"
              value={user.profile?.phone_number || ""}
              onChange={(val) => handleUserFieldChange("phone_number", val)}
              type="text"
            />
            <EditableField
              label="کد ملی"
              value={user.profile?.national_id || ""}
              onChange={(val) => handleUserFieldChange("national_id", val)}
              type="text"
            />
            <EditableField
              label="آدرس"
              value={user.profile?.full_address || ""}
              onChange={(val) => handleUserFieldChange("full_address", val)}
              type="text"
            />
            <EditableField
              label="تاریخ تولد"
              value={user.profile?.date_of_birth || ""}
              onChange={(val) => handleUserFieldChange("date_of_birth", val)}
              type="date"
            />
            <EditableField
              label="محل تولد"
              value={user.profile?.place_of_birth || ""}
              onChange={(val) => handleUserFieldChange("place_of_birth", val)}
              type="text"
            />
            <EditableField
              label="وضعیت تأهل"
              value={user.profile?.marital_status || ""}
              onChange={(val) => handleUserFieldChange("marital_status", val)}
              type="select"
              options={[
                { value: "single", label: "مجرد" },
                { value: "married", label: "متأهل" },
                { value: "divorced", label: "طلاق گرفته" },
                { value: "widowed", label: "بیوه" },
              ]}
            />
            <EditableField
              label="شغل"
              value={user.profile?.occupation || ""}
              onChange={(val) => handleUserFieldChange("occupation", val)}
              type="text"
            />
            <EditableField
              label="رشته تحصیلی"
              value={user.profile?.field_of_study || ""}
              onChange={(val) => handleUserFieldChange("field_of_study", val)}
              type="text"
            />
            <EditableField
              label="بالاترین مدرک تحصیلی"
              value={user.profile?.highest_education || ""}
              onChange={(val) => handleUserFieldChange("highest_education", val)}
              type="text"
            />
            <EditableField
              label="شماره ثابت"
              value={user.profile?.landline_number || ""}
              onChange={(val) => handleUserFieldChange("landline_number", val)}
              type="text"
            />
            <EditableField
              label="شماره اضطراری"
              value={user.profile?.emergency_contact_number || ""}
              onChange={(val) => handleUserFieldChange("emergency_contact_number", val)}
              type="text"
            />
            <EditableField
              label="جنسیت"
              value={user.profile?.gender || ""}
              onChange={(val) => handleUserFieldChange("gender", val)}
              type="select"
              options={[
                { value: "father", label: "پدر" },
                { value: "mother", label: "مادر" },
              ]}
            />
            <EditableField
              label="چگونه با ما آشنا شدید؟"
              value={user.how_did_you_know_about_us || ""}
              onChange={(val) => handleUserFieldChange("how_did_you_know_about_us", val)}
              type="text"
            />
          </>
        )}
        {activeTab === "otherParent" && otherParent && (
          <div className="w-full space-y-4">
            {otherParentFields.map((key) => (
              <motion.div
                layout
                key={key}
                className="flex items-center justify-between w-full p-3 border-b border-gray-200"
                dir="rtl"
              >
                <div className="flex flex-col w-full">
                  <label className="text-lg text-gray-500">{getLabel(key)}</label>
                  <motion.p layout className="mt-1 text-gray-800 text-base text-right">
                    {displayValueFunc(key, otherParent[key])}
                  </motion.p>
                </div>
              </motion.div>
            ))}
            <button
              onClick={() => {
                setTempOtherParent({ ...otherParent });
                setEditingOtherParent(true);
              }}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition-colors duration-200"
            >
              ویرایش اطلاعات والد دیگر
            </button>
          </div>
        )}
      </div>
      {editingOtherParent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" dir="rtl">
          <div className="bg-white p-6 rounded-lg max-w-md w-full max-h-[80vh] overflow-y-auto shadow-2xl">
            <h2 className="text-xl font-bold mb-4 text-center">ویرایش اطلاعات والد دیگر</h2>
            <form onSubmit={handleSaveOtherParent} className="space-y-4">
              {otherParentFields.map((key) => (
                <div key={key} className="flex flex-col">
                  <label className="text-lg text-gray-500">{getLabel(key)}</label>
                  {renderInput(key, tempOtherParent[key], (val) =>
                    setTempOtherParent((prev) => ({ ...prev, [key]: val }))
                  )}
                </div>
              ))}
              <div className="flex justify-between mt-6">
                <button
                  type="button"
                  onClick={() => setEditingOtherParent(false)}
                  className="bg-gray-300 text-gray-800 py-2 px-4 rounded hover:bg-gray-400 transition-colors duration-200"
                  disabled={savingOtherParent}
                >
                  لغو
                </button>
                <button
                  type="submit"
                  disabled={savingOtherParent}
                  className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition-colors duration-200"
                >
                  {savingOtherParent ? "در حال ذخیره..." : "ذخیره"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default InformationPage;