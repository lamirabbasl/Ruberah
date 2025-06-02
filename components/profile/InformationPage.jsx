"use client";
import { motion } from "framer-motion";
import { Pencil, Check } from "lucide-react";
import React, { useState, useEffect } from "react";

import {
  getUserMe,
  patchUserMe,
  getChildren,
  addChild,
  patchChild,
  getProfilePhotoUrl,
} from "@/lib/api/api";

// EditableField component for user info fields
const EditableField = ({ label, value, onChange }) => {
  const [editing, setEditing] = useState(false);
  const [tempValue, setTempValue] = useState(value);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    setTempValue(value);
    setError(null);
  }, [value]);

  const handleEditToggle = () => {
    if (!editing) setTempValue(value);
    setEditing(!editing);
    setError(null);
  };

  const handleSave = async () => {
    setLoading(true);
    setError(null);
    try {
      await onChange(tempValue);
      setEditing(false);
    } catch (err) {
      setError("خطا در بروزرسانی اطلاعات");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      layout
      className="flex items-center justify-between w-full p-3 border-b border-gray-200"
      dir="rtl"
    >
      <div className="flex flex-col w-full">
        <label className="text-lg text-gray-500">{label}</label>
        {editing ? (
          <>
            <input
              type="text"
              className="mt-1 p-1 text-gray-800 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 text-right"
              value={tempValue || ""}
              onChange={(e) => setTempValue(e.target.value)}
              disabled={loading}
            />
            {error && (
              <p className="text-red-600 text-sm mt-1" dir="rtl">
                {error}
              </p>
            )}
          </>
        ) : (
          <motion.p layout className="mt-1 text-gray-800 text-base text-right">
            {value || "-"}
          </motion.p>
        )}
      </div>
      <button
        onClick={editing ? handleSave : handleEditToggle}
        disabled={loading}
        className={`ml-4 ${
          editing
            ? "text-green-600 hover:text-green-800 mt-8 mr-2"
            : "text-blue-600 hover:text-blue-800 mt-8"
        }`}
      >
        {editing ? <Check size={20} /> : <Pencil size={18} />}
      </button>
    </motion.div>
  );
};

// EditableChild component for each child with edit functionality
const EditableChild = ({ child, onUpdate }) => {
  const [editing, setEditing] = useState(false);
  const [tempFullName, setTempFullName] = useState(child.full_name);
  const [tempGender, setTempGender] = useState(child.gender);

  useEffect(() => {
    setTempFullName(child.full_name);
    setTempGender(child.gender);
  }, [child]);

  const handleEditToggle = () => {
    if (!editing) {
      setTempFullName(child.full_name);
      setTempGender(child.gender);
    }
    setEditing(!editing);
  };

  const handleSave = () => {
    onUpdate({
      id: child.id,
      full_name: tempFullName,
      gender: tempGender,
    });
    setEditing(false);
  };

  return (
    <motion.div
      layout
      className="flex flex-row items-center gap-4 bg-gray-100 rounded-md p-2 w-96"
      dir="rtl"
    >
      <div className="flex flex-col flex-1 text-right">
        {editing ? (
          <>
            <input
              type="text"
              className="mb-1 p-1 border border-gray-300 rounded-md w-full text-right"
              value={tempFullName}
              onChange={(e) => setTempFullName(e.target.value)}
              placeholder="نام و نام خانوادگی"
            />
            <select
              className="mb-1 p-1 border border-gray-300 rounded-md w-full text-right"
              value={tempGender}
              onChange={(e) => setTempGender(e.target.value)}
            >
              <option value="boy">پسر</option>
              <option value="girl">دختر</option>
            </select>
          </>
        ) : (
          <div className="flex justify-between items-center">
            <p className="text-lg font-medium">{child.full_name}</p>
            <p className="text-gray-600">
              جنسیت: {child.gender === "boy" ? "پسر" : "دختر"}
            </p>
          </div>
        )}
      </div>
      <button
        onClick={editing ? handleSave : handleEditToggle}
        className={`ml-4 ${
          editing
            ? "text-green-600 hover:text-green-800 mt-8 mr-2"
            : "text-blue-600 hover:text-blue-800 mt-8"
        }`}
      >
        {editing ? <Check size={20} /> : <Pencil size={18} />}
      </button>
    </motion.div>
  );
};

const InformationPage = () => {
  const [user, setUser] = useState(null);
  const [children, setChildren] = useState([]);
  const [loadingUser, setLoadingUser] = useState(true);
  const [loadingChildren, setLoadingChildren] = useState(true);
  const [error, setError] = useState(null);
  const [profilePhotoFile, setProfilePhotoFile] = useState(null);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [uploadError, setUploadError] = useState(null);
  const [showAddChildForm, setShowAddChildForm] = useState(false);
  const [profilePhotoVersion, setProfilePhotoVersion] = useState(0);

  // Fetch user info and children on mount
  useEffect(() => {
    const fetchUser = async () => {
      setLoadingUser(true);
      try {
        const data = await getUserMe();
        setUser(data);
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

  // Handle profile photo change on file select
  const handleProfilePhotoChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setProfilePhotoFile(file);
    setUploadError(null);
  };

  // Upload and save profile photo
  const saveProfilePhoto = async () => {
    if (!profilePhotoFile) return;
    setUploadingPhoto(true);
    setUploadError(null);
    try {
      const formData = new FormData();
      formData.append("profile_photo", profilePhotoFile);
      const updatedUser = await patchUserMe(formData);
      setUser(updatedUser);
      setProfilePhotoFile(null);
      setProfilePhotoVersion((v) => v + 1);
    } catch (err) {
      setUploadError("خطا در آپلود عکس پروفایل");
    } finally {
      setUploadingPhoto(false);
    }
  };

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
      <div className="relative flex flex-col items-center">
        <img
          key={profilePhotoVersion}
          src={`${getProfilePhotoUrl(user.id)}&v=${profilePhotoVersion}`}
          alt="پروفایل"
          className="w-32 h-32 rounded-full object-cover border-3 border-blue-500 shadow"
        />
        <input
          type="file"
          accept="image/*"
          onChange={handleProfilePhotoChange}
          className="mt-2"
          disabled={uploadingPhoto}
        />
        {profilePhotoFile && (
          <button
            onClick={saveProfilePhoto}
            disabled={uploadingPhoto}
            className="mt-2 bg-green-500 text-white px-4 py-1 rounded-md hover:bg-green-600"
          >
            {uploadingPhoto ? "در حال آپلود..." : "ذخیره عکس"}
          </button>
        )}
        {uploadError && (
          <p className="text-red-600 text-sm mt-1">{uploadError}</p>
        )}
      </div>

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

// AddChildForm component for adding new child
const AddChildForm = ({ onAdd }) => {
  const [fullName, setFullName] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [gender, setGender] = useState("boy");

  const handleAdd = () => {
    if (!fullName || !birthDate) return;
    onAdd({ full_name: fullName, birth_date: birthDate, gender });
    setFullName("");
    setBirthDate("");
    setGender("boy");
  };

  return (
    <div
      className="mt-4 bg-gray-50 border border-gray-300 rounded-lg p-4 space-y-3"
      dir="rtl"
    >
      <input
        type="text"
        placeholder="نام و نام خانوادگی"
        value={fullName}
        onChange={(e) => setFullName(e.target.value)}
        className="w-full p-2 text-sm border border-gray-300 rounded-md text-right"
      />
      <input
        type="date"
        placeholder="تاریخ تولد"
        value={birthDate}
        onChange={(e) => setBirthDate(e.target.value)}
        className="w-full p-2 text-sm border border-gray-300 rounded-md text-right"
      />
      <select
        value={gender}
        onChange={(e) => setGender(e.target.value)}
        className="w-full p-2 text-sm border border-gray-300 rounded-md text-right"
      >
        <option value="boy">پسر</option>
        <option value="girl">دختر</option>
      </select>
      <button
        onClick={handleAdd}
        className="bg-green-500 text-white px-4 py-1 rounded-md hover:bg-green-600"
      >
        افزودن فرزند
      </button>
    </div>
  );
};

export default InformationPage;
