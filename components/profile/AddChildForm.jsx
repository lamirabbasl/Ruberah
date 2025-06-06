"use client";
import React, { useState } from "react";
import JalaliCalendar from "../common/JalaliCalendar"; // Import JalaliCalendar

const AddChildForm = ({ onAdd }) => {
  const [fullName, setFullName] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [gender, setGender] = useState("boy");
  const [showCalendar, setShowCalendar] = useState(false); // State to control calendar visibility

  const handleAdd = () => {
    if (!fullName || !birthDate) return;
    onAdd({ full_name: fullName, birth_date: birthDate, gender });
    setFullName("");
    setBirthDate("");
    setGender("boy");
  };

  return (
    <div
      className="mt-4 relative bg-gray-50 border border-gray-300 rounded-lg p-4 space-y-3"
      dir="rtl"
    >
      <input
        type="text"
        placeholder="نام و نام خانوادگی"
        value={fullName}
        onChange={(e) => setFullName(e.target.value)}
        className="w-full p-2 text-sm border border-gray-300 rounded-md text-right"
      />
      <div className="">
        <input
          type="text"
          readOnly
          placeholder="تاریخ تولد"
          value={birthDate}
          onClick={() => setShowCalendar(true)}
          className="w-full p-2 text-sm border border-gray-300 rounded-md text-right cursor-pointer bg-white"
        />
        {showCalendar && (
          <div className="absolute z-50 bg-white bottom-0 shadow-lg rounded-lg">
            <JalaliCalendar
              onDateSelect={(date) => {
                setBirthDate(date);
                setShowCalendar(false);
              }}
            />
          </div>
        )}
      </div>
      <select
        value={gender}
        onChange={(e) => setGender(e.target.value)}
        className="w-full p-2 text-sm border border-gray-300 rounded-md text-right"
      >
        <option value="boy">پسر</option>
        <option value="girl">دختر</option>
      </select>
      <button
        onClick={handleAdd}
        className="bg-green-500 text-white px-4 py-1 rounded-md hover:bg-green-600"
      >
        افزودن فرزند
      </button>
    </div>
  );
};

export default AddChildForm;
