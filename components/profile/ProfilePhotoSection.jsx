// components/information/ProfilePhotoSection.jsx
"use client";
import { motion } from "framer-motion";
import React from "react";

const ProfilePhotoSection = ({ profilePhotoUrl, uploading, handleProfilePhotoChange }) => {
  return (
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
  );
};

export default ProfilePhotoSection;