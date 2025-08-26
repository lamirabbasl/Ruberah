"use client";
import { motion, AnimatePresence } from "framer-motion";
import React, { useState } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import JalaliCalendar from "../common/JalaliCalendar";
import { convertToJalali } from "@/lib/utils/convertDate";

const AddChildForm = ({ onAdd, onClose }) => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [gender, setGender] = useState("boy");
  const [placeOfBirth, setPlaceOfBirth] = useState("");
  const [bloodType, setBloodType] = useState("");
  const [nationalId, setNationalId] = useState("");
  const [siblingsCount, setSiblingsCount] = useState("");
  const [birthOrder, setBirthOrder] = useState("");
  const [courses, setCourses] = useState("خیر");
  const [challenges, setChallenges] = useState("خیر");
  const [allergies, setAllergies] = useState("خیر");
  const [illness, setIllness] = useState("خیر");
  const [hospitalization, setHospitalization] = useState("خیر");
  const [showCalendar, setShowCalendar] = useState(false);
  const [error, setError] = useState(null);

  const bloodTypes = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

  const handleAdd = () => {
    if (!firstName || !lastName || !birthDate || !placeOfBirth || !bloodType || !nationalId || !siblingsCount || !birthOrder || !courses) {
      const errorMessage = "لطفا تمام فیلدهای ضروری را پر کنید";
      toast.error(errorMessage);
      setError(errorMessage);
      return;
    }
    if (siblingsCount <= 0) {
      const errorMessage = "تعداد فرزندان باید بیشتر از صفر باشد";
      toast.error(errorMessage);
      setError(errorMessage);
      return;
    }
    if (birthOrder <= 0) {
      const errorMessage = "ترتیب تولد باید بیشتر از صفر باشد";
      toast.error(errorMessage);
      setError(errorMessage);
      return;
    }
    if (birthOrder > siblingsCount) {
      const errorMessage = "ترتیب تولد نمی‌تواند بیشتر از تعداد فرزندان باشد";
      toast.error(errorMessage);
      setError(errorMessage);
      return;
    }
    setError(null);
    const newChild = {
      first_name: firstName,
      last_name: lastName,
      birth_date: birthDate,
      place_of_birth: placeOfBirth,
      gender: gender,
      national_id: nationalId,
      siblings_count: siblingsCount,
      birth_order: birthOrder,
      blood_type: bloodType,
      courses_signed_up_outside: courses,
      medical_info: {
        challenges: challenges,
        allergies: allergies,
        illness_or_medications: illness,
        hospitalization_history: hospitalization,
      },
    };
    onAdd(newChild);
    onClose();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 backdrop-blur-3xl flex items-center justify-center z-50"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        className="bg-white rounded-lg p-6 max-w-lg w-full mx-4 shadow-xl max-h-[80vh] overflow-y-auto"
        dir="rtl"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-xl font-bold text-gray-900 mb-4 text-right">
          افزودن فرزند جدید
        </h2>
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="block text-lg font-medium text-gray-700">نام</label>
            <input
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="w-full p-3 text-sm border border-gray-300 rounded-lg text-right focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white shadow-sm"
            />
          </div>
          <div className="space-y-2">
            <label className="block text-lg font-medium text-gray-700">نام خانوادگی</label>
            <input
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="w-full p-3 text-sm border border-gray-300 rounded-lg text-right focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white shadow-sm"
            />
          </div>
          <div className="space-y-2 relative">
            <label className="block text-lg font-medium text-gray-700">تاریخ تولد</label>
            <input
              type="text"
              readOnly
              value={convertToJalali(birthDate)}
              onClick={() => setShowCalendar(true)}
              className="w-full p-3 text-sm border border-gray-300 rounded-lg text-right cursor-pointer bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm"
            />
            {showCalendar && (
              <div className="absolute z-99 bg-white bottom-0 shadow-lg rounded-lg">
                <JalaliCalendar
                  onDateSelect={(date) => {
                    setBirthDate(date);
                    setShowCalendar(false);
                  }}
                />
              </div>
            )}
          </div>
          <div className="space-y-2">
            <label className="block text-lg font-medium text-gray-700">جنسیت</label>
            <select
              value={gender}
              onChange={(e) => setGender(e.target.value)}
              className="w-full p-3 text-sm border border-gray-300 rounded-lg text-right focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white shadow-sm"
            >
              <option value="boy">پسر</option>
              <option value="girl">دختر</option>
            </select>
          </div>
          <div className="space-y-2">
            <label className="block text-lg font-medium text-gray-700">محل تولد</label>
            <input
              type="text"
              value={placeOfBirth}
              onChange={(e) => setPlaceOfBirth(e.target.value)}
              className="w-full p-3 text-sm border border-gray-300 rounded-lg text-right focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white shadow-sm"
            />
          </div>
          <div className="space-y-2">
            <label className="block text-lg font-medium text-gray-700">گروه خونی</label>
            <select
              value={bloodType}
              onChange={(e) => setBloodType(e.target.value)}
              className="w-full p-3 text-sm border border-gray-300 rounded-lg text-right focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white shadow-sm"
            >
              <option value="">انتخاب کنید</option>
              {bloodTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-2">
            <label className="block text-lg font-medium text-gray-700">کد ملی</label>
            <input
              type="text"
              value={nationalId}
              onChange={(e) => setNationalId(e.target.value)}
              className="w-full p-3 text-sm border border-gray-300 rounded-lg text-right focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white shadow-sm"
            />
          </div>
          <div className="space-y-2">
            <label className="block text-lg font-medium text-gray-700">تعداد فرزندان خانواده </label>
            <input
              type="number"
              value={siblingsCount}
              onChange={(e) => setSiblingsCount(e.target.value)}
              className="w-full p-3 text-sm border border-gray-300 rounded-lg text-right focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white shadow-sm"
            />
          </div>
          <div className="space-y-2">
            <label className="block text-lg font-medium text-gray-700">کودک شما فرزند چندم خانواده است؟</label>
            <input
              type="number"
              value={birthOrder}
              onChange={(e) => setBirthOrder(e.target.value)}
              className="w-full p-3 text-sm border border-gray-300 rounded-lg text-right focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white shadow-sm"
            />
          </div>
          <div className="space-y-2">
            <label className="block text-lg font-medium text-gray-700">اگر پیش از این و با همزمان با این دوره, کودک شما در دوره های دیگری شرکت کرده است جزئیات آن را وارد کنید</label>
            <input
              type="text"
              value={courses}
              onChange={(e) => setCourses(e.target.value)}
              className="w-full p-3 text-sm border border-gray-300 rounded-lg text-right focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white shadow-sm"
            />
          </div>
          <div className="text-gray-900 border-t-2 border-gray-200 pt-4 text-xl font-bold mt-4">اطلاعات پزشکی</div>
          <div className="space-y-2">
            <label className="block text-lg font-medium text-gray-700">آیا در ارتباط با کودک خود چالشی دارید و یا موردی که لازم است ما نسبت به آن آگاه باشیم؟</label>
            <input
              type="text"
              value={challenges}
              onChange={(e) => setChallenges(e.target.value)}
              className="w-full p-3 text-sm border border-gray-300 rounded-lg text-right focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white shadow-sm"
            />
          </div>
          <div className="space-y-2">
            <label className="block text-lg font-medium text-gray-700">کودک شما به مواد غذایی و یا داروی خاصی  حساسیت دارد؟ (اگر بله موارد را با جزئیات بنویسید)</label>
            <input
              type="text"
              value={allergies}
              onChange={(e) => setAllergies(e.target.value)}
              className="w-full p-3 text-sm border border-gray-300 rounded-lg text-right focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white shadow-sm"
            />
          </div>
          <div className="space-y-2">
            <label className="block text-lg font-medium text-gray-700">آیا کودک شما بیماری خاص و یا داروی خاصی استفاده می کند؟ (اگر بله موارد را با جزئیات بنویسید)</label>
            <input
              type="text"
              value={illness}
              onChange={(e) => setIllness(e.target.value)}
              className="w-full p-3 text-sm border border-gray-300 rounded-lg text-right focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white shadow-sm"
            />
          </div>
          <div className="space-y-2">
            <label className="block text-lg font-medium text-gray-700">آیا کودک شما بستری در بیمارستان و یا تحت عمل جراحی قرار گرفته؟ (اگر بله موارد را با جزئیات بنویسید)</label>
            <input
              type="text"
              value={hospitalization}
              onChange={(e) => setHospitalization(e.target.value)}
              className="w-full p-3 text-sm border border-gray-300 rounded-lg text-right focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white shadow-sm"
            />
          </div>
        </div>
        <div className="flex justify-end gap-4 mt-6">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors duration-200 font-medium"
          >
            انصراف
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleAdd}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200 font-medium"
          >
            افزودن
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default AddChildForm;