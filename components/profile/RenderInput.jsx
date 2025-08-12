// components/information/RenderInput.jsx
"use client";
import React, { useState } from "react";
import JalaliCalendar from "../common/JalaliCalendar";
import { convertToJalali } from "@/lib/utils/convertDate";

const RenderInput = ({ type, value, onChange, options = [], disabled = false }) => {
  const [showCalendar, setShowCalendar] = useState(false);

  if (type === "select") {
    return (
      <select
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1 p-1 text-gray-800 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 text-right w-full"
        disabled={disabled}
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
          value={convertToJalali(value)}
          onClick={() => setShowCalendar(true)}
          className="mt-1 p-1 text-gray-800 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 text-right w-full cursor-pointer bg-white"
          disabled={disabled}
        />
        {showCalendar && (
          <div className="absolute z-50 mt-2 bg-white shadow-lg rounded-lg">
            <JalaliCalendar
              onDateSelect={(date) => {
                onChange(date);
                setShowCalendar(false);
              }}
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
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
      />
    );
  }
};

export default RenderInput;