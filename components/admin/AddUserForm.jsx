"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const AddUserForm = ({ onSave, onCancel }) => {
  const [username, setUsername] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const [address, setAddress] = useState("");
  const [nationalId, setNationalId] = useState("");
  const [isColleague, setIsColleague] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (
      !username.trim() ||
      !password ||
      !role.trim()
    ) {
      alert("لطفاً تمام فیلدهای ضروری را پر کنید.");
      return;
    }
    onSave({
      username,
      phone_number: phoneNumber,
      password,
      role,
      is_colleague: isColleague,
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
          <h2 className="text-lg font-semibold mb-4">افزودن کاربر جدید</h2>
          <div className="mb-4">
            <label className="block mb-1 font-semibold">نام کاربری:</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full border border-gray-300 rounded-md p-2"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block mb-1 font-semibold">شماره تلفن:</label>
            <input
              type="text"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              className="w-full border border-gray-300 rounded-md p-2"
            />
          </div>
          <div className="mb-4">
            <label className="block mb-1 font-semibold">رمز عبور:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-gray-300 rounded-md p-2"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block mb-1 font-semibold">نقش:</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full border border-gray-300 rounded-md p-2"
              required
            >
              <option value="">انتخاب نقش</option>
              <option value="admin">ادمین</option>
              <option value="user">کاربر</option>
            </select>
          </div>
          <div className="mb-4 flex items-center justify-between">
            <label className="font-semibold">همکار:</label>
            <input
              type="checkbox"
              checked={isColleague}
              onChange={(e) => setIsColleague(e.target.checked)}
              className="h-5 w-5"
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

export default AddUserForm;
