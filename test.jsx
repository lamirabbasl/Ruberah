"use client";
import { motion } from "framer-motion";
import { Pencil, Check } from "lucide-react";
import React, { useState, useEffect } from "react";
import { getChildPhotoUrl, getChildWithParentPhotoUrl } from "@/lib/api/api";

const EditableChild = ({ child, onUpdate }) => {
  const [editing, setEditing] = useState(false);
  const [tempFullName, setTempFullName] = useState(child.full_name);
  const [tempGender, setTempGender] = useState(child.gender);
  const [childPhotoUrl, setChildPhotoUrl] = useState(null);
  const [parentPhotoUrl, setParentPhotoUrl] = useState(null);

  useEffect(() => {
    setTempFullName(child.full_name);
    setTempGender(child.gender);
  }, [child]);

  useEffect(() => {
    const fetchPhotos = async () => {
      try {
        const childPhoto = await getChildPhotoUrl(child.id);
        const parentPhoto = await getChildWithParentPhotoUrl(child.id);
        setChildPhotoUrl(childPhoto);
        setParentPhotoUrl(parentPhoto);
      } catch (error) {
        setChildPhotoUrl(null);
        setParentPhotoUrl(null);
      }
    };
    fetchPhotos();
  }, [child.id]);

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
      dir="rtl"
      className="flex flex-col md:flex-row items-center justify-between gap-4 bg-white rounded-xl shadow-md p-4 w-full max-w-2xl mx-auto"
    >
      <div className="flex gap-4 items-center">
        {childPhotoUrl && (
          <img
            src={childPhotoUrl}
            className="w-16 h-16 rounded-full object-cover border border-gray-300"
          />
        )}
        {parentPhotoUrl && (
          <img
            src={parentPhotoUrl}
            className="w-16 h-16 rounded-full object-cover border border-gray-300"
          />
        )}
      </div>

      <div className="flex-1 w-full md:w-auto">
        {editing ? (
          <div className="flex flex-col gap-2">
            <input
              type="text"
              value={tempFullName}
              onChange={(e) => setTempFullName(e.target.value)}
              placeholder="نام و نام خانوادگی"
              className="p-2 border border-gray-300 rounded-md text-right w-full"
            />
            <select
              value={tempGender}
              onChange={(e) => setTempGender(e.target.value)}
              className="p-2 border border-gray-300 rounded-md text-right w-full"
            >
              <option value="boy">پسر</option>
              <option value="girl">دختر</option>
            </select>
          </div>
        ) : (
          <div className="flex flex-col text-right gap-1">
            <p className="text-lg font-semibold">{child.full_name}</p>
            <p className="text-gray-600">
              جنسیت: {child.gender === "boy" ? "پسر" : "دختر"}
            </p>
          </div>
        )}
      </div>

      <button
        onClick={editing ? handleSave : handleEditToggle}
        className={`self-start md:self-center mt-2 md:mt-0 px-3 py-1 rounded-md transition-colors ${
          editing
            ? "bg-green-100 text-green-700 hover:bg-green-200"
            : "bg-blue-100 text-blue-700 hover:bg-blue-200"
        }`}
      >
        {editing ? <Check size={20} /> : <Pencil size={18} />}
      </button>
    </motion.div>
  );
};

export default EditableChild;
