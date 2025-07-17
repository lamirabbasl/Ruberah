"use client";
import { motion } from "framer-motion";
import React, { useState, useEffect } from "react";

import {
  getUserMe,
  patchUserMeJson,
  getChildren,
  addChild,
  patchChild,
  getProfilePhotoUrl,
  uploadProfilePicture,
} from "@/lib/api/api";

import EditableField from "./EditableField";
import EditableChild from "./EditableChild";
import AddChildForm from "./AddChildForm";
import LoadingSpinner from "../common/LoadingSpinner";

const InformationPage = () => {
  const [user, setUser] = useState(null);
  const [profilePhotoUrl, setProfilePhotoUrl] = useState(null);
  const [children, setChildren] = useState([]);
  const [loadingUser, setLoadingUser] = useState(true);
  const [loadingChildren, setLoadingChildren] = useState(true);
  const [error, setError] = useState(null);
  const [showAddChildForm, setShowAddChildForm] = useState(false);
  const [uploading, setUploading] = useState(false);

  // Fetch user info and children on mount
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
            // Don't block rendering, just don't set photo
            setProfilePhotoUrl(null);
            console.warn("No profile photo found or error loading it", err);
          }}
      } catch (err) {
        setError("خطا در دریافت اطلاعات کاربر");
      } finally {
        setLoadingUser(false);
      }
    };

    const fetchChildren = async () => {
      setLoadingChildren(true);
      try {
        const data = await getChildren();
        setChildren(data);
      } catch (err) {
        setError("خطا در دریافت اطلاعات فرزندان");
      } finally {
        setLoadingChildren(false);
      }
    };

    fetchUser();
    fetchChildren();
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

  // Add new child
  const handleAddChild = async (newChild) => {
    try {
      const addedChild = await addChild({
        full_name: newChild.full_name,
        birth_date: newChild.birth_date,
        gender: newChild.gender,
      });
      setChildren([...children, addedChild]);
    } catch (err) {
      setError("خطا در افزودن فرزند");
    }
  };

  // Update existing child
  const handleUpdateChild = async (updatedChild) => {
    try {
      const patchedChild = await patchChild(updatedChild.id, {
        full_name: updatedChild.full_name,
        gender: updatedChild.gender,
      });
      setChildren(
        children.map((child) =>
          child.id === patchedChild.id ? patchedChild : child
        )
      );
    } catch (err) {
      setError("خطا در بروزرسانی فرزند");
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
      // Refresh profile photo URL after upload
      const updatedPhotoUrl = await getProfilePhotoUrl(user.id);
      setProfilePhotoUrl(updatedPhotoUrl);
      window.location.reload();
    } catch (err) {
      setError("خطا در آپلود عکس پروفایل");
    } finally {
      setUploading(false);
    }
  };

  if (loadingUser || loadingChildren) {
    return <div className="w-screen"><LoadingSpinner/></div>;
  }

  if (error) {
    return <p className="text-center mt-10 text-red-600">{error}</p>;
  }

  return (
    <motion.div
      layout
      dir="rtl"
      className="flex flex-col font-mitra items-center p-6 max-w-xl max-md:w-screen mx-auto bg-gray-100 shadow-2xl rounded-2xl mt-4 space-y-6"
    >
      {/* Profile photo */}
      
        <div className="relative mb-4">
          <img
            src={profilePhotoUrl}
            alt="User Profile"
            className="w-24 h-24 rounded-full object-cover"
          />
          <label
            htmlFor="profilePhotoInput"
            className="absolute bottom-0 right-0 bg-blue-600 text-white rounded-full p-1 cursor-pointer hover:bg-blue-700"
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
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5 13l4 4L19 7"
                />
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
        </div>
      

      {/* Editable user info fields */}
      <div className="w-full space-y-2">
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

      {/* Children section */}
      <div
        className="w-full text-xl text-black p-3 border-b border-gray-200"
        dir="rtl"
      >
        <label className="text-lg text-gray-500">فرزندان</label>
        <div className="mt-3 space-y-2">
          {children.map((child) => (
            <EditableChild
              key={child.id}
              child={child}
              onUpdate={handleUpdateChild}
            />
          ))}
        </div>
        <div className="mt-4">
          {!showAddChildForm && (
            <button
              onClick={() => setShowAddChildForm(true)}
              className="bg-blue-500 text-white px-4 py-1 rounded-md hover:bg-blue-600"
            >
              افزودن فرزند
            </button>
          )}
          {showAddChildForm && (
            <div className="bg-white p-4 rounded-lg shadow-md mt-2">
              <AddChildForm
                onAdd={(child) => {
                  handleAddChild(child);
                  setShowAddChildForm(false);
                }}
              />
              <button
                onClick={() => setShowAddChildForm(false)}
                className="mt-2 text-red-600 hover:underline"
              >
                انصراف
              </button>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default InformationPage;
