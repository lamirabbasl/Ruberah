"use client";
import { motion } from "framer-motion";
import { Pencil, Check } from "lucide-react";
import React, { useState, useEffect } from "react";
import JalaliCalendar from "../common/JalaliCalendar";
import { convertToJalali } from "@/lib/utils/convertDate";

const EditableField = ({ label, value, onChange, type = "text", options = [] }) => {
  const [editing, setEditing] = useState(false);
  const [tempValue, setTempValue] = useState(value);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showCalendar, setShowCalendar] = useState(false);

  // Translation maps for gender and marital_status
  const translations = {
    gender: {
      father: "پدر",
      mother: "مادر",
    },
    marital_status: {
      single: "مجرد",
      married: "متأهل",
    },
  };

  useEffect(() => {
    setTempValue(value);
    setError(null);
  }, [value]);

  const handleEditToggle = () => {
    if (!editing) setTempValue(value);
    setEditing(!editing);
    setError(null);
    if (type === "date") setShowCalendar(!editing);
  };

  const handleSave = async () => {
    setLoading(true);
    setError(null);
    try {
      await onChange(tempValue);
      setEditing(false);
      setShowCalendar(false);
    } catch (err) {
      setError("خطا در بروزرسانی اطلاعات");
    } finally {
      setLoading(false);
    }
  };

  const handleDateSelect = async (date) => {
    setTempValue(date);
    setShowCalendar(false);
    setLoading(true);
    setError(null);
    try {
      await onChange(date);
      setEditing(false);
    } catch (err) {
      setError("خطا در بروزرسانی اطلاعات");
    } finally {
      setLoading(false);
    }
  };

  const renderInput = () => {
    if (type === "select") {
      return (
        <select
          value={tempValue || ""}
          onChange={(e) => setTempValue(e.target.value)}
          className="mt-1 p-1 text-gray-800 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 text-right w-full"
          disabled={loading}
        >
          <option value="">انتخاب کنید</option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      );
    } else if (type === "date") {
      return (
        <div className="relative">
          <input
            type="text"
            readOnly
            value={convertToJalali(tempValue)}
            onClick={() => setShowCalendar(true)}
            className="mt-1 p-1 text-gray-800 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 text-right w-full cursor-pointer bg-white"
            disabled={loading}
          />
          {showCalendar && (
            <div className="absolute z-50 mt-2 bg-white shadow-lg rounded-lg">
              <JalaliCalendar
                onDateSelect={handleDateSelect}
              />
            </div>
          )}
        </div>
      );
    } else {
      return (
        <input
          type="text"
          className="mt-1 p-1 text-gray-800 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 text-right w-full"
          value={tempValue || ""}
          onChange={(e) => setTempValue(e.target.value)}
          disabled={loading}
        />
      );
    }
  };

  const displayValue = () => {
    if (type === "date") {
      return convertToJalali(value) || "-";
    } else if (label === "جنسیت" && translations.gender[value]) {
      return translations.gender[value] || "-";
    } else if (label === "وضعیت تأهل" && translations.marital_status[value]) {
      return translations.marital_status[value] || "-";
    } else {
      return value || "-";
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
            {renderInput()}
            {error && (
              <p className="text-red-600 text-sm mt-1" dir="rtl">
                {error}
              </p>
            )}
          </>
        ) : (
          <motion.p layout className="mt-1 text-gray-800 text-base text-right">
            {displayValue()}
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