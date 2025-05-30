"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const AddTimeForm = ({ onSave, onCancel }) => {
  const [title, setTitle] = useState("");
  const [dateTime, setDateTime] = useState("");
  const [capacity, setCapacity] = useState("");
  const [address, setAddress] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim() || !dateTime || !capacity || !address.trim()) {
      alert("لطفاً تمام فیلدها را پر کنید.");
      return;
    }
    onSave({
      title,
      date_time: dateTime,
      capacity: parseInt(capacity, 10),
      address,
    });
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50 p-4"
      >
        <motion.form
          onSubmit={handleSubmit}
          className="bg-white rounded-xl p-6 w-full max-w-md shadow-2xl relative border border-gray-300 text-right"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -20, opacity: 0 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
        >
          <h2 className="text-lg font-semibold mb-4">افزودن جلسه جدید</h2>
          <div className="mb-4">
            <label className="block mb-1 font-semibold">عنوان:</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full border border-gray-300 rounded-md p-2"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block mb-1 font-semibold">زمان معارفه:</label>
            <input
              type="datetime-local"
              value={dateTime}
              onChange={(e) => setDateTime(e.target.value)}
              className="w-full border border-gray-300 rounded-md p-2"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block mb-1 font-semibold">ظرفیت:</label>
            <input
              type="number"
              min="1"
              value={capacity}
              onChange={(e) => setCapacity(e.target.value)}
              className="w-full border border-gray-300 rounded-md p-2"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block mb-1 font-semibold">آدرس:</label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full border border-gray-300 rounded-md p-2"
              required
            />
          </div>
          <div className="flex justify-between">
            <button
              type="button"
              onClick={onCancel}
              className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-md"
            >
              لغو
            </button>
            <button
              type="submit"
              className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-md"
            >
              افزودن
            </button>
          </div>
        </motion.form>
      </motion.div>
    </AnimatePresence>
  );
};

export default AddTimeForm;
