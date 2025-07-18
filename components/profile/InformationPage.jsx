"use client";
import { motion } from "framer-motion";
import React, { useState, useEffect } from "react";
import { getUserMe, patchUserMeJson, getProfilePhotoUrl, uploadProfilePicture } from "@/lib/api/api";
import EditableField from "./EditableField";
import LoadingSpinner from "../common/LoadingSpinner";

const InformationPage = () => {
  const [user, setUser] = useState(null);
  const [profilePhotoUrl, setProfilePhotoUrl] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);
  const [error, setError] = useState(null);
  const [uploading, setUploading] = useState(false);

  // Fetch user info on mount
  useEffect(() => {
    const fetchUser = async () => {
      setLoadingUser(true);
      try {
        const data = await getUserMe();
        setUser(data);
        if (data && data.id) {
          try {
            const photoUrl = await getProfilePhotoUrl(data.id);
            setProfilePhotoUrl(photoUrl);
          } catch (err) {
            setProfilePhotoUrl(null);
            console.warn("No profile photo found or error loading it", err);
          }
        }
      } catch (err) {
        setError("خطا در دریافت اطلاعات کاربر");
      } finally {
        setLoadingUser(false);
      }
    };

    fetchUser();
  }, []);

  // Handle user info field change and save
  const handleUserFieldChange = async (field, value) => {
    if (!user) return;
    const updatedUser = {
      id: user.id,
      username: field === "username" ? value : user.username,
      first_name: field === "first_name" ? value : user.first_name,
      last_name: field === "last_name" ? value : user.last_name,
      phone_number: field === "phone_number" ? value : user.phone_number,
      address: field === "address" ? value : user.address,
      national_id: field === "national_id" ? value : user.national_id,
      is_colleague: user.is_colleague,
      groups: user.groups,
    };
    try {
      const patchedUser = await patchUserMeJson(updatedUser);
      setUser(patchedUser);
    } catch (err) {
      setError("خطا در بروزرسانی اطلاعات کاربر");
    }
  };

  // Handle profile photo upload
  const handleProfilePhotoChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;
    setUploading(true);
    setError(null);
    try {
      await uploadProfilePicture(file);
      const updatedPhotoUrl = await getProfilePhotoUrl(user.id);
      setProfilePhotoUrl(updatedPhotoUrl);
      window.location.reload();
    } catch (err) {
      setError("خطا در آپلود عکس پروفایل");
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

  return (
    <motion.div
      layout
      dir="rtl"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col font-mitra items-center p-6 max-w-xl max-md:w-screen mx-auto bg-gradient-to-br from-white to-gray-100 shadow-2xl rounded-2xl mt-4 space-y-6"
    >
      {/* Profile photo */}
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

      {/* Editable user info fields */}
      <div className="w-full space-y-4">
        <EditableField
          label="نام"
          value={user?.first_name || ""}
          onChange={(val) => handleUserFieldChange("first_name", val)}
        />
        <EditableField
          label="نام خانوادگی"
          value={user?.last_name || ""}
          onChange={(val) => handleUserFieldChange("last_name", val)}
        />
        <EditableField
          label="نام کاربری"
          value={user?.username || ""}
          onChange={(val) => handleUserFieldChange("username", val)}
        />
        <EditableField
          label="شماره تماس"
          value={user?.phone_number || ""}
          onChange={(val) => handleUserFieldChange("phone_number", val)}
        />
        <EditableField
          label="کد ملی"
          value={user?.national_id || ""}
          onChange={(val) => handleUserFieldChange("national_id", val)}
        />
        <EditableField
          label="آدرس"
          value={user?.address || ""}
          onChange={(val) => handleUserFieldChange("address", val)}
        />
      </div>
    </motion.div>
  );
};

export default InformationPage;