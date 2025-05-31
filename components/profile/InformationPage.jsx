"use client";
import { motion } from "framer-motion";
import { Pencil, Check } from "lucide-react";
import Image from "next/image";
import {
  getUserMe,
  patchUserMe,
  patchUserMeJson,
  getChildren,
  addChild,
  patchChild,
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
import React, { useState, useEffect } from "react";
import { getChildPhotoUrls, patchChildPhotos } from "@/lib/api/api";

const EditableChild = ({ child, onUpdate }) => {
  const [editing, setEditing] = useState(false);
  const [tempFullName, setTempFullName] = useState(child.full_name);
  const [tempGender, setTempGender] = useState(child.gender);
  const [photoChildUrl, setPhotoChildUrl] = useState("");
  const [photoWithParentUrl, setPhotoWithParentUrl] = useState("");
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState(null);

  useEffect(() => {
    setTempFullName(child.full_name);
    setTempGender(child.gender);

    // Fetch child photos with credentials and convert to blob URLs for display
    const fetchPhoto = async (url, setPhotoUrl) => {
      try {
        const response = await fetch(url, { credentials: "include" });
        if (!response.ok) throw new Error("Failed to fetch photo");
        const blob = await response.blob();
        const objectUrl = URL.createObjectURL(blob);
        setPhotoUrl(objectUrl);
      } catch (error) {
        setPhotoUrl(""); // Clear photo on error
      }
    };

    const photoChildApiUrl = `/api/proxy/children/${child.id}/photo/photo_child`;
    const photoWithParentApiUrl = `/api/proxy/children/${child.id}/photo/photo_with_parent`;

    fetchPhoto(photoChildApiUrl, setPhotoChildUrl);
    fetchPhoto(photoWithParentApiUrl, setPhotoWithParentUrl);
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

  const handlePhotoChange = async (e, photoType) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    setUploadError(null);
    try {
      const formData = new FormData();
      if (photoType === "photo_child") {
        formData.append("photo_child", file);
      } else if (photoType === "photo_with_parent") {
        formData.append("photo_with_parent", file);
      }
      await patchChildPhotos(child.id, formData);
      // Update photo URLs to force reload
      const urls = getChildPhotoUrls(child.id);
      setPhotoChildUrl(urls.photo_child + "?t=" + Date.now());
      setPhotoWithParentUrl(urls.photo_with_parent + "?t=" + Date.now());
    } catch (error) {
      setUploadError("خطا در آپلود عکس");
    } finally {
      setUploading(false);
    }
  };

  return (
    <motion.div
      layout
      className="flex flex-row items-center gap-4 bg-gray-100 rounded-md p-2 w-96"
      dir="rtl"
    >
      <div className="flex flex-row gap-4 order-last items-center">
        <div className="flex flex-col items-center">
          <img
            src={photoChildUrl}
            alt="عکس فرزند"
            className="w-12 h-12 object-cover rounded-md"
          />
          <label
            htmlFor={`photo_child_input_${child.id}`}
            className="mt-1 cursor-pointer text-sm text-blue-600 hover:underline"
          >
            انتخاب تصویر
          </label>
          <input
            id={`photo_child_input_${child.id}`}
            type="file"
            accept="image/*"
            disabled={uploading}
            onChange={(e) => handlePhotoChange(e, "photo_child")}
            className="hidden"
          />
        </div>
        <div className="flex flex-col items-center">
          <img
            src={photoWithParentUrl}
            alt="عکس با والدین"
            className="w-12 h-12 object-cover rounded-md"
          />
          <label
            htmlFor={`photo_with_parent_input_${child.id}`}
            className="mt-1 cursor-pointer text-sm text-blue-600 hover:underline"
          >
            انتخاب تصویر
          </label>
          <input
            id={`photo_with_parent_input_${child.id}`}
            type="file"
            accept="image/*"
            disabled={uploading}
            onChange={(e) => handlePhotoChange(e, "photo_with_parent")}
            className="hidden"
          />
        </div>
      </div>
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
  const [profilePhotoUrl, setProfilePhotoUrl] = useState("/user.png");
  const [showAddChildForm, setShowAddChildForm] = useState(false);

  // Fetch user info and children on mount
  useEffect(() => {
    const fetchUser = async () => {
      setLoadingUser(true);
      try {
        const data = await getUserMe();
        setUser(data);
        if (data.profile_photo) {
          setProfilePhotoUrl(
            `/api/proxy/users/secure/profile-photo/${data.id}`
          );
        } else {
          setProfilePhotoUrl("/user.png");
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

  // Handle profile photo change
  const handleProfilePhotoChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setProfilePhotoFile(file);
    setProfilePhotoUrl(URL.createObjectURL(file));
  };

  // Save profile photo to server
  const saveProfilePhoto = async () => {
    if (!profilePhotoFile) return;
    const formData = new FormData();
    formData.append("profile_photo", profilePhotoFile);
    try {
      const updatedUser = await patchUserMe(formData);
      setUser(updatedUser);
      if (updatedUser.profile_photo) {
        setProfilePhotoUrl(
          `/api/proxy/users/secure/profile-photo/${updatedUser.id}/`
        );
      } else {
        setProfilePhotoUrl("/user.png");
      }
      setProfilePhotoFile(null);
    } catch (err) {
      setError("خطا در آپلود عکس پروفایل");
    }
  };

  // Handle user info field change and save
  const handleUserFieldChange = async (field, value) => {
    if (!user) return;
    // Build full user object with updated field
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
      // Patch user info with JSON body
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
        <Image
          width={200}
          height={200}
          src={profilePhotoUrl}
          alt="پروفایل"
          className="w-32 h-32 rounded-full object-cover border-3 border-blue-500 shadow"
          priority
        />
        <input
          type="file"
          accept="image/*"
          onChange={handleProfilePhotoChange}
          className="mt-2"
        />
        {profilePhotoFile && (
          <button
            onClick={saveProfilePhoto}
            className="mt-2 bg-green-500 text-white px-4 py-1 rounded-md hover:bg-green-600"
          >
            ذخیره عکس
          </button>
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
