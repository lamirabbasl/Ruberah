"use client";
import { motion } from "framer-motion";
import { Pencil, Check } from "lucide-react";
import React, { useState, useEffect } from "react";
import { getChildPhotoUrl, getChildWithParentPhotoUrl, uploadChildPhotos } from "@/lib/api/api";

const EditableChild = ({ child, onUpdate }) => {
  const [editing, setEditing] = useState(false);
  const [tempFullName, setTempFullName] = useState(child.full_name);
  const [tempGender, setTempGender] = useState(child.gender);
  const [childPhotoUrl, setChildPhotoUrl] = useState(null);
  const [parentPhotoUrl, setParentPhotoUrl] = useState(null);
  const [uploadingChildPhoto, setUploadingChildPhoto] = useState(false);
  const [uploadingParentPhoto, setUploadingParentPhoto] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    setTempFullName(child.full_name);
    setTempGender(child.gender);
  }, [child]);

  useEffect(() => {
    const fetchPhotos = async () => {
      try {
        const childPhoto = await getChildPhotoUrl(child.id);
        const parentPhoto = await getChildWithParentPhotoUrl(child.id);
        setChildPhotoUrl(childPhoto);
        setParentPhotoUrl(parentPhoto);
      } catch (error) {
        setChildPhotoUrl(null);
        setParentPhotoUrl(null);
      }
    };
    fetchPhotos();
  }, [child.id]);

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

  const handleChildPhotoChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;
    setUploadingChildPhoto(true);
    setError(null);
    try {
      await uploadChildPhotos(child.id, file, null);
      const updatedChildPhoto = await getChildPhotoUrl(child.id);
      setChildPhotoUrl(updatedChildPhoto);
      window.location.reload();
    } catch (err) {
      setError("خطا در آپلود عکس کودک");
    } finally {
      setUploadingChildPhoto(false);
    }
  };

  const handleParentPhotoChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;
    setUploadingParentPhoto(true);
    setError(null);
    try {
      await uploadChildPhotos(child.id, null, file);
      const updatedParentPhoto = await getChildWithParentPhotoUrl(child.id);
      setParentPhotoUrl(updatedParentPhoto);
      window.location.reload();
    } catch (err) {
      setError("خطا در آپلود عکس والدین");
    } finally {
      setUploadingParentPhoto(false);
    }
  };

  return (
    <motion.div
      layout
      dir="rtl"
      className="flex flex-col md:flex-row items-center justify-between gap-4 bg-white rounded-xl shadow-md p-4 w-full max-w-2xl mx-auto"
    >
      <div className="flex gap-4 items-center">
        {childPhotoUrl && (
          <div className="relative">
            <img
              src={childPhotoUrl}
              className="w-16 h-16 rounded-full object-cover border border-gray-300"
            />
            <label
              htmlFor={`childPhotoInput-${child.id}`}
              className="absolute bottom-0 right-0 bg-blue-600 text-white rounded-full p-1 cursor-pointer hover:bg-blue-700"
              title="تغییر عکس کودک"
            >
              {uploadingChildPhoto ? (
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
              id={`childPhotoInput-${child.id}`}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleChildPhotoChange}
              disabled={uploadingChildPhoto}
            />
          </div>
        )}
        {parentPhotoUrl && (
          <div className="relative">
            <img
              src={parentPhotoUrl}
              className="w-16 h-16 rounded-full object-cover border border-gray-300"
            />
            <label
              htmlFor={`parentPhotoInput-${child.id}`}
              className="absolute bottom-0 right-0 bg-blue-600 text-white rounded-full p-1 cursor-pointer hover:bg-blue-700"
              title="تغییر عکس والدین"
            >
              {uploadingParentPhoto ? (
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
              id={`parentPhotoInput-${child.id}`}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleParentPhotoChange}
              disabled={uploadingParentPhoto}
            />
          </div>
        )}
      </div>

      <div className="flex-1 w-full md:w-auto">
        {editing ? (
          <div className="flex flex-col gap-2">
            <input
              type="text"
              value={tempFullName}
              onChange={(e) => setTempFullName(e.target.value)}
              placeholder="نام و نام خانوادگی"
              className="p-2 border border-gray-300 rounded-md text-right w-full"
            />
            <select
              value={tempGender}
              onChange={(e) => setTempGender(e.target.value)}
              className="p-2 border border-gray-300 rounded-md text-right w-full"
            >
              <option value="boy">پسر</option>
              <option value="girl">دختر</option>
            </select>
          </div>
        ) : (
          <div className="flex flex-col text-right gap-1">
            <p className="text-lg font-semibold">{child.full_name}</p>
            <p className="text-gray-600">
              جنسیت: {child.gender === "boy" ? "پسر" : "دختر"}
            </p>
          </div>
        )}
      </div>

      <button
        onClick={editing ? handleSave : handleEditToggle}
        className={`self-start md:self-center mt-2 md:mt-0 px-3 py-1 rounded-md transition-colors ${
          editing
            ? "bg-green-100 text-green-700 hover:bg-green-200"
            : "bg-blue-100 text-blue-700 hover:bg-blue-200"
        }`}
      >
        {editing ? <Check size={20} /> : <Pencil size={18} />}
      </button>
    </motion.div>
  );
};

export default EditableChild;
