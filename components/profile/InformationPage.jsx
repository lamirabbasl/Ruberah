"use client";
import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import { Pencil, Save, Trash2, Plus } from "lucide-react";
import Image from "next/image";

const EditableField = ({ label, value, onChange }) => {
  const [editing, setEditing] = useState(false);
  const [tempValue, setTempValue] = useState(value);

  // Sync tempValue when edit mode is activated
  const handleEditToggle = () => {
    if (!editing) setTempValue(value); // reset to latest value
    setEditing(!editing);
  };

  const handleSave = () => {
    onChange(tempValue);
    setEditing(false);
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
          <input
            type="text"
            className="mt-1 p-1 text-gray-800 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 text-right"
            value={tempValue}
            onChange={(e) => setTempValue(e.target.value)}
          />
        ) : (
          <motion.p layout className="mt-1 text-gray-800 text-base text-right">
            {value}
          </motion.p>
        )}
      </div>
      <button
        onClick={editing ? handleSave : handleEditToggle}
        className="ml-4 text-blue-600 hover:text-blue-800"
      >
        {editing ? <Save size={18} /> : <Pencil size={18} />}
      </button>
    </motion.div>
  );
};

const EditableChildren = ({ childrenList, onChange }) => {
  const [newChild, setNewChild] = useState("");

  const handleAddChild = () => {
    if (newChild.trim() !== "") {
      onChange([...childrenList, newChild.trim()]);
      setNewChild("");
    }
  };

  const handleEditChild = (index, newName) => {
    const updated = [...childrenList];
    updated[index] = newName;
    onChange(updated);
  };

  const handleDeleteChild = (index) => {
    const updated = childrenList.filter((_, i) => i !== index);
    onChange(updated);
  };

  return (
    <motion.div
      layout
      className="w-full text-xl text-black p-3 border-b border-gray-200"
      dir="rtl"
    >
      <label className="text-lg text-gray-500">فرزندان</label>
      <div className="mt-2 space-y-2">
        {childrenList.map((child, index) => (
          <div
            key={index}
            className="flex items-center justify-between bg-gray-100 rounded-md p-2"
          >
            <input
              type="text"
              value={child}
              onChange={(e) => handleEditChild(index, e.target.value)}
              className="flex-1 bg-transparent outline-none text-right"
            />
            <button
              onClick={() => handleDeleteChild(index)}
              className="text-red-500 hover:text-red-700 ml-2"
              title="حذف"
            >
              <Trash2 size={16} />
            </button>
          </div>
        ))}
      </div>
      <div className="flex items-center mt-3">
        <input
          type="text"
          placeholder="نام فرزند جدید"
          value={newChild}
          onChange={(e) => setNewChild(e.target.value)}
          className="flex-1 p-1 text-right border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <button
          onClick={handleAddChild}
          className="ml-2 text-green-600 mr-2 hover:text-green-800"
          title="افزودن"
        >
          <Plus size={18} />
        </button>
      </div>
    </motion.div>
  );
};

function InformationPage() {
  const params = useParams();
  const userId = params?.id || "بدون‌نام";

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("۰۹۱۲۱۲۳۴۵۶۷");
  const [email, setEmail] = useState("ali@example.com");
  const [address, setAddress] = useState("تهران، خیابان آزادی");
  const [childrenList, setChildrenList] = useState([
    "آتوسا آریایی",
    "کاوه آریایی",
  ]);
  const [image, setImage] = useState("/profile/abbas.jpg");
  const [editingImage, setEditingImage] = useState(false);

  useEffect(() => {
    if (userId) setName(userId);
  }, [userId]);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setImage(reader.result);
    };
    reader.readAsDataURL(file);
  };

  return (
    <motion.div
      layout
      dir="rtl"
      className="flex flex-col font-mitra items-center p-6 max-w-xl max-md:w-screen mx-auto bg-gray-100 shadow-2xl rounded-2xl mt-4 space-y-6"
    >
      {/* تصویر پروفایل */}
      <div className="relative flex flex-col items-center">
        <Image
          width={200}
          height={200}
          src={image}
          alt="پروفایل"
          className="w-32 h-32 rounded-full object-cover border-3 border-blue-500 shadow"
        />
        <button
          onClick={() => setEditingImage(!editingImage)}
          className="absolute left-0 bottom-0 text-blue-500 bg-white p-1 rounded-full shadow-md hover:bg-gray-100"
        >
          {editingImage ? <Save size={16} /> : <Pencil size={16} />}
        </button>
        {editingImage && (
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="mt-2 w-full text-sm text-gray-700"
          />
        )}
      </div>

      {/* فیلدهای قابل ویرایش */}
      <div className="w-full space-y-2">
        <EditableField
          label="نام و نام خانوادگی"
          value={name}
          onChange={setName}
        />
        <EditableField label="شماره تماس" value={phone} onChange={setPhone} />
        <EditableField label="ایمیل" value={email} onChange={setEmail} />
        <EditableChildren
          childrenList={childrenList}
          onChange={setChildrenList}
        />
        <EditableField label="آدرس" value={address} onChange={setAddress} />
      </div>
    </motion.div>
  );
}

export default InformationPage;
