"use client";

import React from "react";
import { motion } from "framer-motion";

const BatchHeader = ({ onAddClick }) => {
  return (
    <div className="flex justify-between items-center mb-8">
      <h2 className="text-3xl font-bold text-gray-900 tracking-tight">دوره‌های آموزشی</h2>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onAddClick}
        className="bg-indigo-600 text-white px-6 py-3 rounded-lg shadow-md hover:bg-indigo-700 transition-all duration-200 text-sm font-medium"
      >
        افزودن دوره جدید
      </motion.button>
    </div>
  );
};

export default BatchHeader;
