"use client";
import { motion } from "framer-motion";
import { Pencil, Check } from "lucide-react";
import React, { useState, useEffect } from "react";

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

export default EditableField;
