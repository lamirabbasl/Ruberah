"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import JalaliCalendar from "@/components/common/JalaliCalendar";
import { convertToJalali } from "@/lib/utils/convertDate";

const ProfileModal = ({ show, onClose, profile, setProfile, handleSignup }) => {
  const [showCalendar, setShowCalendar] = useState(false);

  if (!show) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  const handleDateSelect = (date) => {
    setProfile((prev) => ({ ...prev, date_of_birth: date }));
    setShowCalendar(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleSignup(e);
    onClose();
  };

  const modalVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.3 } },
  };

  return (
    <div className="fixed max-md:pt-150 inset-0 overflow-y-auto pt-40 bg-black bg-opacity-50 flex items-center justify-center z-50 font-sans">
      <motion.div
        variants={modalVariants}
        initial="hidden"
        animate="visible"
        className="bg-white rounded-xl p-6 w-full max-w-lg shadow-2xl border border-gray-300"
        dir="rtl"
      >
        <h2 className="text-xl mb-4 text-right text-gray-800">
          اطلاعات پروفایل
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="mb-4">
            <label
              htmlFor="first_name"
              className="block text-gray-700 text-sm mb-2 text-right"
            >
              نام:
            </label>
            <input
              type="text"
              id="first_name"
              name="first_name"
              value={profile.first_name || ""}
              onChange={handleChange}
              placeholder="نام"
              className="appearance-none border border-gray-300 text-right rounded-md w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50"
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="last_name"
              className="block text-gray-700 text-sm mb-2 text-right"
            >
              نام خانوادگی:
            </label>
            <input
              type="text"
              id="last_name"
              name="last_name"
              value={profile.last_name || ""}
              onChange={handleChange}
              placeholder="نام خانوادگی"
              className="appearance-none border border-gray-300 text-right rounded-md w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50"
            />
          </div>
          <div className="mb-4 relative">
            <label
              htmlFor="date_of_birth"
              className="block text-gray-700 text-sm mb-2 text-right"
            >
              تاریخ تولد:
            </label>
            <input
              type="text"
              id="date_of_birth"
              readOnly
              value={convertToJalali(profile.date_of_birth || "")}
              onClick={() => setShowCalendar(!showCalendar)}
              placeholder="انتخاب تاریخ تولد"
              className="appearance-none border border-gray-300 text-right rounded-md w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 cursor-pointer"
            />
            {showCalendar && (
              <div className="absolute w-84  z-50 mt-2 bg-white shadow-lg rounded-lg">
                <JalaliCalendar
                  onDateSelect={handleDateSelect}
                />
              </div>
            )}
          </div>
          <div className="mb-4">
            <label
              htmlFor="place_of_birth"
              className="block text-gray-700 text-sm mb-2 text-right"
            >
              محل تولد:
            </label>
            <input
              type="text"
              id="place_of_birth"
              name="place_of_birth"
              value={profile.place_of_birth || ""}
              onChange={handleChange}
              placeholder="محل تولد"
              className="appearance-none border border-gray-300 text-right rounded-md w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50"
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="marital_status"
              className="block text-gray-700 text-sm mb-2 text-right"
            >
              وضعیت تاهل:
            </label>
            <select
              id="marital_status"
              name="marital_status"
              value={profile.marital_status || ""}
              onChange={handleChange}
              className="appearance-none border border-gray-300 text-right rounded-md w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50"
            >
              <option value="">انتخاب کنید</option>
              <option value="married">متاهل</option>
              <option value="single">مجرد</option>
            </select>
          </div>
          <div className="mb-4">
            <label
              htmlFor="occupation"
              className="block text-gray-700 text-sm mb-2 text-right"
            >
              شغل:
            </label>
            <input
              type="text"
              id="occupation"
              name="occupation"
              value={profile.occupation || ""}
              onChange={handleChange}
              placeholder="شغل"
              className="appearance-none border border-gray-300 text-right rounded-md w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50"
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="field_of_study"
              className="block text-gray-700 text-sm mb-2 text-right"
            >
              رشته تحصیلی:
            </label>
            <input
              type="text"
              id="field_of_study"
              name="field_of_study"
              value={profile.field_of_study || ""}
              onChange={handleChange}
              placeholder="رشته تحصیلی"
              className="appearance-none border border-gray-300 text-right rounded-md w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50"
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="highest_education"
              className="block text-gray-700 text-sm mb-2 text-right"
            >
              بالاترین مدرک تحصیلی:
            </label>
            <input
              type="text"
              id="highest_education"
              name="highest_education"
              value={profile.highest_education || ""}
              onChange={handleChange}
              placeholder="بالاترین مدرک تحصیلی"
              className="appearance-none border border-gray-300 text-right rounded-md w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50"
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="profile_phone_number"
              className="block text-gray-700 text-sm mb-2 text-right"
            >
              شماره تلفن:
            </label>
            <input
              type="tel"
              id="profile_phone_number"
              name="phone_number"
              value={profile.phone_number || ""}
              onChange={handleChange}
              placeholder="شماره تلفن"
              className="appearance-none border border-gray-300 text-right rounded-md w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50"
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="national_id"
              className="block text-gray-700 text-sm mb-2 text-right"
            >
              کد ملی:
            </label>
            <input
              type="text"
              id="national_id"
              name="national_id"
              value={profile.national_id || ""}
              onChange={handleChange}
              placeholder="کد ملی"
              className="appearance-none border border-gray-300 text-right rounded-md w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50"
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="full_address"
              className="block text-gray-700 text-sm mb-2 text-right"
            >
              آدرس کامل:
            </label>
            <input
              type="text"
              id="full_address"
              name="full_address"
              value={profile.full_address || ""}
              onChange={handleChange}
              placeholder="آدرس کامل"
              className="appearance-none border border-gray-300 text-right rounded-md w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50"
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="landline_number"
              className="block text-gray-700 text-sm mb-2 text-right"
            >
              شماره تلفن ثابت:
            </label>
            <input
              type="tel"
              id="landline_number"
              name="landline_number"
              value={profile.landline_number || ""}
              onChange={handleChange}
              placeholder="شماره تلفن ثابت (اختیاری)"
              className="appearance-none border border-gray-300 text-right rounded-md w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50"
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="emergency_contact_number"
              className="block text-gray-700 text-sm mb-2 text-right"
            >
              شماره تماس اضطراری:
            </label>
            <input
              type="tel"
              id="emergency_contact_number"
              name="emergency_contact_number"
              value={profile.emergency_contact_number || ""}
              onChange={handleChange}
              placeholder="شماره تماس اضطراری"
              className="appearance-none border border-gray-300 text-right rounded-md w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50"
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="gender"
              className="block text-gray-700 text-sm mb-2 text-right"
            >
              جنسیت:
            </label>
            <select
              id="gender"
              name="gender"
              value={profile.gender || ""}
              onChange={handleChange}
              className="appearance-none border border-gray-300 text-right rounded-md w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50"
            >
              <option value="">انتخاب کنید</option>
              <option value="male">مرد</option>
              <option value="female">زن</option>
              <option value="father">پدر</option>
              <option value="other">سایر</option>
            </select>
          </div>
        </div>
        <div className="flex justify-end gap-4 mt-6">
          <button
            onClick={onClose}
            className="bg-gray-500 hover:bg-gray-600 text-white font-semibold py-2 px-4 rounded-md shadow-md hover:shadow-lg transition-all duration-200"
          >
            لغو
          </button>
          <button
            onClick={handleSubmit}
            className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-md shadow-md hover:shadow-lg transition-all duration-200"
          >
            ثبت‌نام
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default ProfileModal;