"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaTimes } from "react-icons/fa";

const AddTimeForm = ({ onSave, onCancel }) => {
  const [title, setTitle] = useState("");
  const [dateTime, setDateTime] = useState("");
  const [capacity, setCapacity] = useState("");
  const [address, setAddress] = useState("");
  const [error, setError] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim() || !dateTime || !capacity || !address.trim()) {
      setError("لطفاً تمام فیلدها را پر کنید.");
      return;
    }
    setError(null);
    onSave({
      title,
      date_time: dateTime,
      capacity: parseInt(capacity, 10),
      address,
    });
    // Reset form fields after successful submission
    setTitle("");
    setDateTime("");
    setCapacity("");
    setAddress("");
  };

  const modalVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.3 } },
    exit: { opacity: 0, scale: 0.8, transition: { duration: 0.2 } },
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4"
      >
        <motion.form
          onSubmit={handleSubmit}
          variants={modalVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="bg-white rounded-xl p-6 sm:p-8 w-full max-w-md shadow-2xl relative text-right"
          dir="rtl"
        >
          <button
            type="button"
            onClick={onCancel}
            className="absolute top-4 left-4 text-gray-500 hover:text-gray-700 transition"
            aria-label="بستن فرم افزودن جلسه"
          >
            <FaTimes size={20} />
          </button>
          <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-6 text-right">
            افزودن جلسه جدید
          </h2>
          <div className="mb-5">
            <label className="block mb-2 text-sm font-medium text-gray-700 text-right">
              عنوان
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition text-right"
              required
            />
          </div>
          <div className="mb-5">
            <label className="block mb-2 text-sm font-medium text-gray-700 text-right">
              زمان معارفه
            </label>
            <input
              type="datetime-local"
              value={dateTime}
              onChange={(e) => setDateTime(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition text-right"
              required
            />
          </div>
          <div className="mb-5">
            <label className="block mb-2 text-sm font-medium text-gray-700 text-right">
              ظرفیت
            </label>
            <input
              type="number"
              min="1"
              value={capacity}
              onChange={(e) => setCapacity(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition text-right"
              required
            />
          </div>
          <div className="mb-5">
            <label className="block mb-2 text-sm font-medium text-gray-700 text-right">
              آدرس
            </label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition text-right"
              required
            />
          </div>
          {error && <p className="text-red-500 text-sm mb-4 text-right">{error}</p>}
          <div className="flex justify-end space-x-3">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="button"
              onClick={onCancel}
              className="px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-100 transition"
            >
              لغو
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="submit"
              className="px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition"
            >
              افزودن
            </motion.button>
          </div>
        </motion.form>
      </motion.div>
    </AnimatePresence>
  );
};

export default AddTimeForm;