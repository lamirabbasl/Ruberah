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
} from "@/lib/api/api";
 
import EditableField from "./EditableField";
import EditableChild from "./EditableChild";
import AddChildForm from "./AddChildForm";

const InformationPage = () => {
  const [user, setUser] = useState(null);
  const [profilePhotoUrl, setProfilePhotoUrl] = useState(null);
  const [children, setChildren] = useState([]);
  const [loadingUser, setLoadingUser] = useState(true);
  const [loadingChildren, setLoadingChildren] = useState(true);
  const [error, setError] = useState(null);
  const [showAddChildForm, setShowAddChildForm] = useState(false);

  // Fetch user info and children on mount
  useEffect(() => {
    const fetchUser = async () => {
      setLoadingUser(true);
      try {
        const data = await getUserMe();
        setUser(data);
        if (data && data.id) {
          const photoUrl = await getProfilePhotoUrl(data.id);
          setProfilePhotoUrl(photoUrl);
        }
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

  if (loadingUser || loadingChildren) {
    return <p className="text-center mt-10">در حال بارگذاری...</p>;
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
      {profilePhotoUrl && (
        <img
          src={profilePhotoUrl}
          alt="User Profile"
          className="w-24 h-24 rounded-full object-cover mb-4"
        />
      )}

      {/* Editable user info fields */} 
      <div className="w-full space-y-2">
        <EditableField
          label="نام و نام خانوادگی"
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
