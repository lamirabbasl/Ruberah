"use client";

import React, { useState, useEffect } from "react";
import { FaEye } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { getUsersById, getProfilePhotoUrl, getAnotherParentById } from "@/lib/api/api";
import { toast } from "react-toastify";
import { convertToJalali } from "@/lib/utils/convertDate";

const rowVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.95 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.4, ease: "easeOut" } },
};

const modalVariants = {
  hidden: { opacity: 0, scale: 0.9, y: 50 },
  visible: { opacity: 1, scale: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 25 } },
  exit: { opacity: 0, scale: 0.9, y: 50, transition: { duration: 0.2 } },
};

function UsersTable({ users }) {
  const [selectedUser, setSelectedUser] = useState(null);
  const [otherParent, setOtherParent] = useState(null);
  const [showUserModal, setShowUserModal] = useState(false);
  const [showOtherParentModal, setShowOtherParentModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [profilePhoto, setProfilePhoto] = useState(null);

  const fetchUserDetails = async (id) => {
    setLoading(true);
    setError(null);
    setProfilePhoto(null);
    try {
      const data = await getUsersById(id);
      setSelectedUser(data);
      try {
        const photoUrl = await getProfilePhotoUrl(id);
        setProfilePhoto(photoUrl);
      } catch (photoErr) {
        console.warn("Failed to fetch profile photo:", photoErr.message);
      }
      setShowUserModal(true);
    } catch (err) {
      const errorMessage = err.message || "خطا در دریافت اطلاعات کاربر";
      toast.error(errorMessage);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleShowOtherParent = async () => {
    if (selectedUser?.other_parent_profile?.id) {
      setLoading(true);
      setError(null);
      try {
        const otherParentData = await getAnotherParentById(selectedUser.id);
        setOtherParent(otherParentData);
        setShowOtherParentModal(true);
      } catch (err) {
        const errorMessage = err.message || "خطا در دریافت اطلاعات والد دیگر";
        toast.error(errorMessage);
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    } else {
      toast.error("اطلاعات والد دیگر در دسترس نیست");
    }
  };

  const closeModals = () => {
    setShowUserModal(false);
    setShowOtherParentModal(false);
    setSelectedUser(null);
    setOtherParent(null);
    setProfilePhoto(null);
    setError(null);
  };

  return (
    <>
      <motion.div
        initial="hidden"
        animate="visible"
        variants={rowVariants}
        className="overflow-x-auto bg-white border border-gray-200 rounded-2xl shadow-lg"
      >
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-4 text-right text-sm font-semibold text-gray-700 uppercase tracking-wider">
                نام کاربری
              </th>
              <th className="px-6 py-4 text-right text-sm font-semibold text-gray-700 uppercase tracking-wider">
                نام کامل
              </th>
              <th className="px-6 py-4 text-right text-sm font-semibold text-gray-700 uppercase tracking-wider">
                شماره تلفن
              </th>
              <th className="px-6 py-4 text-right text-sm font-semibold text-gray-700 uppercase tracking-wider">
                کد ملی
              </th>
              <th className="px-6 py-4 text-right text-sm font-semibold text-gray-700 uppercase tracking-wider">
                همکار
              </th>
              <th className="px-6 py-4 text-right text-sm font-semibold text-gray-700 uppercase tracking-wider">
                اطلاعات
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            <AnimatePresence>
              {users.map((user) => (
                <motion.tr
                  key={user.id}
                  variants={rowVariants}
                  initial="hidden"
                  animate="visible"
                  exit="hidden"
                  className="hover:bg-gray-50 transition-all duration-200"
                >
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium text-gray-900">
                    {user.username}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-600">
                    {user.full_name || "-"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-600">
                    {user.phone_number || "-"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-600">
                    {user.national_id || "-"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-600">
                    {user.is_colleague ? "بله" : "خیر"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => fetchUserDetails(user.id)}
                      className="text-blue-500 hover:text-blue-700 transition-all duration-200 p-2 rounded-full bg-blue-50 hover:bg-blue-100"
                      aria-label={`مشاهده جزئیات کاربر ${user.username}`}
                    >
                      <FaEye size={16} />
                    </motion.button>
                  </td>
                </motion.tr>
              ))}
            </AnimatePresence>
          </tbody>
        </table>
      </motion.div>

      {/* User Details Modal */}
      <AnimatePresence>
        {showUserModal && selectedUser && (
          <motion.div
            initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
            animate={{ opacity: 1, backdropFilter: "blur(8px)" }}
            exit={{ opacity: 0, backdropFilter: "blur(0px)" }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-lg flex items-center justify-center z-50"
            onClick={closeModals}
          >
            <motion.div
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="bg-white/95 backdrop-blur-md rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl border border-gray-100/50 max-h-[80vh] overflow-y-auto"
              dir="rtl"
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-6 text-right tracking-tight">جزئیات کاربر</h2>
              {loading && (
                <div className="flex justify-center items-center h-32">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="w-12 h-12 border-4 border-t-indigo-600 border-gray-200 rounded-full"
                  ></motion.div>
                </div>
              )}
              {error && <p className="text-center text-red-600 mb-4">{error}</p>}
              {!loading && !error && (
                <div className="space-y-4">
                  {profilePhoto && (
                    <motion.img
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3 }}
                      src={profilePhoto}
                      alt="عکس پروفایل"
                      className="w-28 h-28 rounded-full object-cover mx-auto mb-4 border-4 border-indigo-100 shadow-sm"
                    />
                  )}
                  <div className="grid grid-cols-1 gap-3 text-right text-gray-700 text-sm">
                    <p className="flex items-center gap-2">
                      <span className="font-semibold text-gray-900">نام کاربری:</span>
                      <span className="text-gray-600">{selectedUser.username}</span>
                    </p>
                    <p className="flex items-center gap-2">
                      <span className="font-semibold text-gray-900">نام کامل:</span>
                      <span className="text-gray-600">{selectedUser.full_name || "-"}</span>
                    </p>
                    <p className="flex items-center gap-2">
                      <span className="font-semibold text-gray-900">شماره تلفن:</span>
                      <span className="text-gray-600">{selectedUser.phone_number || "-"}</span>
                    </p>
                    <p className="flex items-center gap-2">
                      <span className="font-semibold text-gray-900">آدرس:</span>
                      <span className="text-gray-600">{selectedUser.address || "-"}</span>
                    </p>
                    <p className="flex items-center gap-2">
                      <span className="font-semibold text-gray-900">کد ملی:</span>
                      <span className="text-gray-600">{selectedUser.profile?.national_id || "-"}</span>
                    </p>
                    <p className="flex items-center gap-2">
                      <span className="font-semibold text-gray-900">نقش‌ها:</span>
                      <span className="text-gray-600">{selectedUser.groups?.join(", ") || "-"}</span>
                    </p>
                    <p className="flex items-center gap-2">
                      <span className="font-semibold text-gray-900">همکار:</span>
                      <span className="text-gray-600">{selectedUser.is_colleague ? "بله" : "خیر"}</span>
                    </p>
                    <p className="flex items-center gap-2">
                      <span className="font-semibold text-gray-900">چگونه با ما آشنا شدید:</span>
                      <span className="text-gray-600">{selectedUser.how_did_you_know_about_us || "-"}</span>
                    </p>
                    <h3 className="font-bold text-lg text-gray-900 mt-6 border-b border-gray-200 pb-2">اطلاعات پروفایل</h3>
                    <p className="flex items-center gap-2">
                      <span className="font-semibold text-gray-900">نام:</span>
                      <span className="text-gray-600">{selectedUser.profile?.first_name || "-"}</span>
                    </p>
                    <p className="flex items-center gap-2">
                      <span className="font-semibold text-gray-900">نام خانوادگی:</span>
                      <span className="text-gray-600">{selectedUser.profile?.last_name || "-"}</span>
                    </p>
                    <p className="flex items-center gap-2">
                      <span className="font-semibold text-gray-900">تاریخ تولد:</span>
                      <span className="text-gray-600">{convertToJalali(selectedUser.profile?.date_of_birth) || "-"}</span>
                    </p>
                    <p className="flex items-center gap-2">
                      <span className="font-semibold text-gray-900">محل تولد:</span>
                      <span className="text-gray-600">{selectedUser.profile?.place_of_birth || "-"}</span>
                    </p>
                    <p className="flex items-center gap-2">
                      <span className="font-semibold text-gray-900">وضعیت تأهل:</span>
                      <span className="text-gray-600">{selectedUser.profile?.marital_status || "-"}</span>
                    </p>
                    <p className="flex items-center gap-2">
                      <span className="font-semibold text-gray-900">شغل:</span>
                      <span className="text-gray-600">{selectedUser.profile?.occupation || "-"}</span>
                    </p>
                    <p className="flex items-center gap-2">
                      <span className="font-semibold text-gray-900">رشته تحصیلی:</span>
                      <span className="text-gray-600">{selectedUser.profile?.field_of_study || "-"}</span>
                    </p>
                    <p className="flex items-center gap-2">
                      <span className="font-semibold text-gray-900">بالاترین مدرک تحصیلی:</span>
                      <span className="text-gray-600">{selectedUser.profile?.highest_education || "-"}</span>
                    </p>
                    <p className="flex items-center gap-2">
                      <span className="font-semibold text-gray-900">آدرس کامل:</span>
                      <span className="text-gray-600">{selectedUser.profile?.full_address || "-"}</span>
                    </p>
                    <p className="flex items-center gap-2">
                      <span className="font-semibold text-gray-900">شماره تلفن ثابت:</span>
                      <span className="text-gray-600">{selectedUser.profile?.landline_number || "-"}</span>
                    </p>
                    <p className="flex items-center gap-2">
                      <span className="font-semibold text-gray-900">شماره تماس اضطراری:</span>
                      <span className="text-gray-600">{selectedUser.profile?.emergency_contact_number || "-"}</span>
                    </p>
                    <p className="flex items-center gap-2">
                      <span className="font-semibold text-gray-900">جنسیت:</span>
                      <span className="text-gray-600">{selectedUser.profile?.gender || "-"}</span>
                    </p>
                  </div>
                </div>
              )}
              <div className="flex justify-between mt-10 space-x-0">
                {selectedUser?.other_parent_profile && (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleShowOtherParent}
                    className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-all duration-200 font-medium shadow-sm"
                  >
                    نمایش اطلاعات والد دیگر
                  </motion.button>
                )}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={closeModals}
                  className="bg-gray-300 text-gray-800 px-6 py-2 rounded-lg hover:bg-gray-400 transition-all duration-200 font-medium shadow-sm"
                >
                  بستن
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Other Parent Modal */}
      <AnimatePresence>
        {showOtherParentModal && otherParent && (
          <motion.div
            initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
            animate={{ opacity: 1, backdropFilter: "blur(8px)" }}
            exit={{ opacity: 0, backdropFilter: "blur(0px)" }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-lg flex items-center justify-center z-50"
            onClick={closeModals}
          >
            <motion.div
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="bg-white/95 backdrop-blur-md rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl border border-gray-100/50 max-h-[80vh] overflow-y-auto"
              dir="rtl"
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-6 text-right tracking-tight">اطلاعات والد دیگر</h2>
              {loading && (
                <div className="flex justify-center items-center h-32">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="w-12 h-12 border-4 border-t-indigo-600 border-gray-200 rounded-full"
                  ></motion.div>
                </div>
              )}
              {error && <p className="text-center text-red-600 mb-4">{error}</p>}
              {!loading && !error && (
                <div className="space-y-4 text-right text-gray-700 text-sm">
                  <div className="grid grid-cols-1 gap-3">
                    <p className="flex items-center gap-2">
                      <span className="font-semibold text-gray-900">نام:</span>
                      <span className="text-gray-600">{otherParent.first_name || "-"}</span>
                    </p>
                    <p className="flex items-center gap-2">
                      <span className="font-semibold text-gray-900">نام خانوادگی:</span>
                      <span className="text-gray-600">{otherParent.last_name || "-"}</span>
                    </p>
                    <p className="flex items-center gap-2">
                      <span className="font-semibold text-gray-900">تاریخ تولد:</span>
                      <span className="text-gray-600">{convertToJalali(otherParent.date_of_birth) || "-"}</span>
                    </p>
                    <p className="flex items-center gap-2">
                      <span className="font-semibold text-gray-900">محل تولد:</span>
                      <span className="text-gray-600">{otherParent.place_of_birth || "-"}</span>
                    </p>
                    <p className="flex items-center gap-2">
                      <span className="font-semibold text-gray-900">وضعیت تأهل:</span>
                      <span className="text-gray-600">{otherParent.marital_status || "-"}</span>
                    </p>
                    <p className="flex items-center gap-2">
                      <span className="font-semibold text-gray-900">شغل:</span>
                      <span className="text-gray-600">{otherParent.occupation || "-"}</span>
                    </p>
                    <p className="flex items-center gap-2">
                      <span className="font-semibold text-gray-900">رشته تحصیلی:</span>
                      <span className="text-gray-600">{otherParent.field_of_study || "-"}</span>
                    </p>
                    <p className="flex items-center gap-2">
                      <span className="font-semibold text-gray-900">بالاترین مدرک تحصیلی:</span>
                      <span className="text-gray-600">{otherParent.highest_education || "-"}</span>
                    </p>
                    <p className="flex items-center gap-2">
                      <span className="font-semibold text-gray-900">شماره تلفن:</span>
                      <span className="text-gray-600">{otherParent.phone_number || "-"}</span>
                    </p>
                    <p className="flex items-center gap-2">
                      <span className="font-semibold text-gray-900">کد ملی:</span>
                      <span className="text-gray-600">{otherParent.national_id || "-"}</span>
                    </p>
                    <p className="flex items-center gap-2">
                      <span className="font-semibold text-gray-900">آدرس کامل:</span>
                      <span className="text-gray-600">{otherParent.full_address || "-"}</span>
                    </p>
                    <p className="flex items-center gap-2">
                      <span className="font-semibold text-gray-900">شماره تلفن ثابت:</span>
                      <span className="text-gray-600">{otherParent.landline_number || "-"}</span>
                    </p>
                    <p className="flex items-center gap-2">
                      <span className="font-semibold text-gray-900">شماره تماس اضطراری:</span>
                      <span className="text-gray-600">{otherParent.emergency_contact_number || "-"}</span>
                    </p>
                    <p className="flex items-center gap-2">
                      <span className="font-semibold text-gray-900">جنسیت:</span>
                      <span className="text-gray-600">{otherParent.gender || "-"}</span>
                    </p>
                  </div>
                </div>
              )}
              <div className="flex justify-end mt-8">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={closeModals}
                  className="bg-gray-300 text-gray-800 px-6 py-2 rounded-lg hover:bg-gray-400 transition-all duration-200 font-medium shadow-sm"
                >
                  بستن
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export default UsersTable;