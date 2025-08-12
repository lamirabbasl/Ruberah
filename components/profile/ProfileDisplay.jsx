// components/information/ProfileDisplay.jsx
"use client";
import { motion } from "framer-motion";
import React from "react";

const ProfileDisplay = ({ fields, data, getLabel, displayValueFunc }) => {
  return (
    <div className="w-full space-y-4">
      {fields.map((key) => (
        <motion.div
          layout
          key={key}
          className="flex items-center justify-between w-full p-3 border-b border-gray-200"
          dir="rtl"
        >
          <div className="flex flex-col w-full">
            <label className="text-lg text-gray-500">{getLabel(key)}</label>
            <motion.p layout className="mt-1 text-gray-800 text-base text-right">
              {displayValueFunc(key, data[key])}
            </motion.p>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default ProfileDisplay;