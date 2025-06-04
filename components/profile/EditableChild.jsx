"use client";
import { motion } from "framer-motion";
import { Pencil, Check } from "lucide-react";
import React, { useState, useEffect } from "react";

const EditableChild = ({ child, onUpdate }) => {
  const [editing, setEditing] = useState(false);
  const [tempFullName, setTempFullName] = useState(child.full_name);
  const [tempGender, setTempGender] = useState(child.gender);

  useEffect(() => {
    setTempFullName(child.full_name);
    setTempGender(child.gender);
  }, [child]);

  const handleEditToggle = () => {
    if (!editing) {
      setTempFullName(child.full_name);
      setTempGender(child.gender);
    }
    setEditing(!editing);
  };

  const handleSave = () => {
    onUpdate({
      id: child.id,
      full_name: tempFullName,
      gender: tempGender,
    });
    setEditing(false);
  };

  return (
    <motion.div
      layout
      className="flex flex-row items-center gap-4 bg-gray-100 rounded-md p-2 w-96"
      dir="rtl"
    >
      <div className="flex flex-col flex-1 text-right">
        {editing ? (
          <>
            <input
              type="text"
              className="mb-1 p-1 border border-gray-300 rounded-md w-full text-right"
              value={tempFullName}
              onChange={(e) => setTempFullName(e.target.value)}
              placeholder="نام و نام خانوادگی"
            />
            <select
              className="mb-1 p-1 border border-gray-300 rounded-md w-full text-right"
              value={tempGender}
              onChange={(e) => setTempGender(e.target.value)}
            >
              <option value="boy">پسر</option>
              <option value="girl">دختر</option>
            </select>
          </>
        ) : (
          <div className="flex justify-between items-center">
            <p className="text-lg font-medium">{child.full_name}</p>
            <p className="text-gray-600">
              جنسیت: {child.gender === "boy" ? "پسر" : "دختر"}
            </p>
          </div>
        )}
      </div>
      <button
        onClick={editing ? handleSave : handleEditToggle}
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

export default EditableChild;
