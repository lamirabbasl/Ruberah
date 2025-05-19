"use client";
import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import { Pencil, Check } from "lucide-react";
import Image from "next/image";

// ✅ EditableField with green tick
const EditableField = ({ label, value, onChange }) => {
  const [editing, setEditing] = useState(false);
  const [tempValue, setTempValue] = useState(value);

  const handleEditToggle = () => {
    if (!editing) setTempValue(value);
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

// ✅ EditableChildren with only edit (no add/delete)
const EditableChildren = ({ childrenList, onChange }) => {
  const [showForm, setShowForm] = useState(false);
  const [newChild, setNewChild] = useState({
    name: "",
    age: "",
    image: "/user.png",
  });

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setNewChild((prev) => ({ ...prev, image: reader.result }));
    };
    reader.readAsDataURL(file);
  };

  const handleAddChild = () => {
    if (!newChild.name || !newChild.age) return;

    onChange([...childrenList, newChild]);
    setNewChild({ name: "", age: "", image: "/user.png" });
    setShowForm(false);
  };

  return (
    <motion.div
      layout
      className="w-full text-xl text-black p-3 border-b border-gray-200"
      dir="rtl"
    >
      <label className="text-lg text-gray-500">فرزندان</label>
      <div className="mt-3 space-y-2">
        {childrenList.map((child, index) => (
          <div
            key={index}
            className="flex items-center gap-3 bg-gray-100 rounded-md p-2"
          >
            <Image
              width={40}
              height={40}
              src={child.image}
              alt="child"
              className="w-10 h-10 rounded-full object-cover border"
            />
            <div className="text-right">
              <p className="text-lg font-medium">
                {child.name}{" "}
                <span className="text-gray-600 mr-4">سن: {child.age}</span>
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* افزودن فرزند */}
      <div className="mt-4">
        {!showForm ? (
          <button
            onClick={() => setShowForm(true)}
            className="text-green-600 hover:text-green-800 text-sm border px-3 py-1 rounded-md border-green-500"
          >
            افزودن فرزند +
          </button>
        ) : (
          <div className="mt-4 bg-gray-50 border border-gray-300 rounded-lg p-4 space-y-3">
            <div className="flex items-center gap-4">
              <Image
                width={40}
                height={40}
                src={newChild.image}
                alt="new child"
                className="w-10 h-10 rounded-full object-cover border"
              />
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="text-sm text-gray-600"
              />
            </div>
            <input
              type="text"
              placeholder="نام و نام خانوادگی"
              value={newChild.name}
              onChange={(e) =>
                setNewChild((prev) => ({ ...prev, name: e.target.value }))
              }
              className="w-full p-2 text-sm border border-gray-300 rounded-md text-right"
            />
            <input
              type="number"
              placeholder="سن"
              value={newChild.age}
              onChange={(e) =>
                setNewChild((prev) => ({ ...prev, age: e.target.value }))
              }
              className="w-full p-2 text-sm border border-gray-300 rounded-md text-right"
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={handleAddChild}
                className="bg-green-500 text-white px-4 py-1 rounded-md hover:bg-green-600 text-sm"
              >
                ذخیره
              </button>
              <button
                onClick={() => setShowForm(false)}
                className="bg-gray-300 text-gray-700 px-4 py-1 rounded-md hover:bg-gray-400 text-sm"
              >
                انصراف
              </button>
            </div>
          </div>
        )}
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
    { name: "آتوسا آریایی", age: 12, image: "/profile/child1.jpg" },
    { name: "کاوه آریایی", age: 9, image: "/profile/child2.jpg" },
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
          {editingImage ? (
            <Check size={16} className="text-green-600" />
          ) : (
            <Pencil size={16} />
          )}
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
