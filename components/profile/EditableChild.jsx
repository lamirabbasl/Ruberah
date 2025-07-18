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
    const fetchPhotos1 = async () => {
      try {
        const childPhoto = await getChildPhotoUrl(child.id);
        setChildPhotoUrl(childPhoto);
      } catch (error) {
        setChildPhotoUrl(null);
      }
    };
    const fetchPhotos2 = async () => {
      try {
        const parentPhoto = await getChildWithParentPhotoUrl(child.id);
        setParentPhotoUrl(parentPhoto);
      } catch (error) {
        setParentPhotoUrl(null);
      }
    };
    fetchPhotos1();
    fetchPhotos2();
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
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 200 }}
      className="flex items-center gap-6 pb-8 bg-white rounded-2xl shadow-lg p-6 w-full max-w-4xl mx-auto border border-gray-100 hover:shadow-xl transition-shadow duration-300"
    >
      <div className="flex gap-6 items-center">
        <motion.div
          className="relative flex flex-col items-center"
          whileHover={{ scale: 1.05 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <img
            src={childPhotoUrl || "/placeholder-child.jpg"}
            className="w-20 h-20 rounded-lg object-cover border-2 border-gray-200 shadow-sm"
            alt="عکس فرزند"
          />
          <label
            htmlFor={`childPhotoInput-${child.id}`}
            className="absolute bottom-0 right-0 bg-blue-600 text-white rounded-full p-2 cursor-pointer hover:bg-blue-700 transition-colors duration-200 shadow-md"
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
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
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
          <p className="absolute text-lg text-gray-600 bottom-[-30px]">عکس فرزند</p>
        </motion.div>

        <motion.div
          className="relative flex flex-col items-center"
          whileHover={{ scale: 1.05 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <img
            src={parentPhotoUrl || "/placeholder-parent.jpg"}
            className="w-20 h-20 rounded-lg object-cover border-2 border-gray-200 shadow-sm"
            alt="عکس با والدین"
          />
          <label
            htmlFor={`parentPhotoInput-${child.id}`}
            className="absolute bottom-0 right-0 bg-blue-600 text-white rounded-full p-2 cursor-pointer hover:bg-blue-700 transition-colors duration-200 shadow-md"
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
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
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
          <p className="absolute text-lg text-gray-600 bottom-[-30px]">عکس با والدین</p>
        </motion.div>
      </div>

      <div className="flex-1 w-full min-w-0">
        {editing ? (
          <div className="flex flex-col gap-3">
            <input
              type="text"
              value={tempFullName}
              onChange={(e) => setTempFullName(e.target.value)}
              placeholder="نام و نام خانوادگی"
              className="p-3 border border-gray-200 rounded-lg text-right w-full focus:outline-none focus:ring-2 focus:ring-blue-300 transition-all duration-200 bg-gray-50 text-sm"
            />
            <select
              value={tempGender}
              onChange={(e) => setTempGender(e.target.value)}
              className="p-3 border border-gray-200 rounded-lg text-right w-full focus:outline-none focus:ring-2 focus:ring-blue-300 transition-all duration-200 bg-gray-50 text-sm"
            >
              <option value="boy">پسر</option>
              <option value="girl">دختر</option>
            </select>
          </div>
        ) : (
          <div className="flex flex-col text-right gap-2">
            <p className="text-lg font-bold text-gray-800 truncate">{child.full_name}</p>
            <p className="text-gray-500 text-sm">
              جنسیت: {child.gender === "boy" ? "پسر" : "دختر"}
            </p>
          </div>
        )}
        {error && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-red-600 text-center text-sm mt-2"
          >
            {error}
          </motion.p>
        )}
      </div>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={editing ? handleSave : handleEditToggle}
        className={`mt-6 sm:mt-0 px-4 py-2 rounded-lg transition-colors duration-200 shadow-md text-sm ${
          editing
            ? "bg-green-500 text-white hover:bg-green-600"
            : "bg-blue-500 text-white hover:bg-blue-600"
        }`}
      >
        {editing ? <Check size={20} /> : <Pencil size={20} />}
      </motion.button>
    </motion.div>
  );
};

export default EditableChild;