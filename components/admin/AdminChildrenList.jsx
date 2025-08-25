"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { getAdminChildren, getAdminChildrenImage, getAdminChildrenwithParentImage, getAdminChildrenById } from "@/lib/api/api";
import { convertToJalali } from "@/lib/utils/convertDate";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AdminChildrenList = () => {
  const [children, setChildren] = useState([]);
  const [isLastPage, setIsLastPage] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [childImages, setChildImages] = useState({});
  const [parentImages, setParentImages] = useState({});
  const [selectedChild, setSelectedChild] = useState(null);

  const fetchChildren = async (page = 1, search = "") => {
    try {
      setLoading(true);
      const data = await getAdminChildren(page, search);
      setChildren(data.results);
      setIsLastPage(data.is_last_page);

      const childImagePromises = data.results.map(child =>
        getAdminChildrenImage(child.id).catch(() => null)
      );
      const parentImagePromises = data.results.map(child =>
        getAdminChildrenwithParentImage(child.id).catch(() => null)
      );

      const childImageResults = await Promise.all(childImagePromises);
      const parentImageResults = await Promise.all(parentImagePromises);

      const childImageMap = {};
      const parentImageMap = {};
      data.results.forEach((child, index) => {
        childImageMap[child.id] = childImageResults[index];
        parentImageMap[child.id] = parentImageResults[index];
      });

      setChildImages(childImageMap);
      setParentImages(parentImageMap);
      setLoading(false);
    } catch (err) {
      setError("خطا در بارگذاری داده‌ها");
      setLoading(false);
    }
  };

  const fetchChildDetails = async (id) => {
    try {
      const data = await getAdminChildrenById(id);
      setSelectedChild(data);
    } catch (err) {
      console.error("Error fetching child details:", err);
      toast.error("خطا در دریافت جزئیات");
    }
  };

  useEffect(() => {
    fetchChildren(currentPage, searchTerm);
  }, [currentPage, searchTerm]);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handlePageChange = (newPage) => {
    if (newPage > 0 && !(newPage > currentPage && isLastPage)) {
      setCurrentPage(newPage);
    }
  };

  const modalVariants = {
    hidden: { opacity: 0, scale: 0.9, y: 50 },
    visible: { opacity: 1, scale: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 25 } },
    exit: { opacity: 0, scale: 0.9, y: 50, transition: { duration: 0.2 } },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.95 },
    visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.4, ease: "easeOut" } },
  };

  return (
    <div className="p-4 sm:p-6 bg-gradient-to-b from-gray-50 to-gray-100 min-h-screen font-mitra dir-rtl text-right">
      <div className="flex justify-between items-center mb-6 sm:mb-8">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 text-right w-full tracking-tight">مدیریت کودکان</h2>
      </div>

      <div className="mb-6">
        <input
          type="text"
          placeholder="جستجو بر اساس نام کودک"
          value={searchTerm}
          onChange={handleSearch}
          className="w-full max-w-md border border-gray-200 rounded-lg px-4 py-3 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-200 text-sm text-right"
        />
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="w-12 h-12 border-4 border-t-indigo-600 border-gray-200 rounded-full"
          ></motion.div>
        </div>
      ) : error ? (
        <p className="text-center text-red-600 font-medium bg-red-50 p-4 rounded-lg">{error}</p>
      ) : children.length === 0 ? (
        <p className="text-center text-gray-600 font-medium bg-white p-4 rounded-lg shadow">هیچ کودکی یافت نشد.</p>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4 sm:gap-6">
            <AnimatePresence>
              {children.map((child) => (
                <motion.div
                  key={child.id}
                  variants={cardVariants}
                  initial="hidden"
                  animate="visible"
                  exit="hidden"
                  className="flex flex-col sm:flex-row items-center py-3 bg-white rounded-lg px-4 shadow-lg relative cursor-pointer hover:shadow-xl transition-shadow duration-300"
                  onClick={() => fetchChildDetails(child.id)}
                >
                  <div className="flex-shrink-0 mb-4 sm:mb-0 sm:mr-4 w-full sm:w-auto">
                    <div className="flex justify-end gap-4 sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2 sm:space-x-reverse">
                      {childImages[child.id] ? (
                        <img
                          src={childImages[child.id]}
                          alt={`عکس کودک ${child.full_name}`}
                          className="w-24 h-24 rounded-md object-cover border-2 border-indigo-100"
                        />
                      ) : (
                        <div className="w-24 h-24 rounded-md bg-gray-200 flex items-center justify-center text-gray-500 mx-auto sm:mx-0">
                          بدون عکس
                        </div>
                      )}
                      {parentImages[child.id] ? (
                        <img
                          src={parentImages[child.id]}
                          alt={`عکس کودک ${child.full_name} با والدین`}
                          className="w-24 h-24 rounded-md object-cover border-2 border-indigo-100"
                        />
                      ) : (
                        <div className="w-24 h-24 rounded-md bg-gray-200 flex items-center justify-center text-gray-500 mx-auto sm:mx-0">
                          بدون عکس
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="space-y-1 w-full text-right">
                    <p className="font-semibold text-gray-800 text-md">{child.first_name} {child.last_name}</p>
                    <div className="text-sm text-gray-600 space-y-1">
                      <p className="flex items-center justify-end">
                        <span>{convertToJalali(child.birth_date)}</span>
                        <span className="inline-block w-24 font-medium ml-2">تاریخ تولد</span>
                      </p>
                      <p className="flex items-center justify-end">
                        <span>{child.gender === "boy" ? "پسر" : "دختر"}</span>
                        <span className="inline-block w-24 font-medium ml-2">جنسیت</span>
                      </p>
                      <p className="flex items-center justify-end">
                        <span>{new Date(child.created_at).toLocaleDateString("fa-IR")}</span>
                        <span className="inline-block w-24 font-medium ml-2">ایجاد شده در</span>
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          <div className="flex justify-center mt-6 sm:mt-8 space-x-3 space-x-reverse">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={isLastPage}
              className={`px-3 sm:px-4 py-2 rounded-lg text-sm font-medium ${
                isLastPage
                  ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                  : "bg-indigo-600 text-white hover:bg-indigo-700"
              } transition-all duration-200`}
            >
              صفحه بعدی
            </motion.button>
            <span className="px-3 sm:px-4 py-2 text-gray-700 font-medium">صفحه {currentPage}</span>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className={`px-3 sm:px-4 py-2 rounded-lg text-sm font-medium ${
                currentPage === 1
                  ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                  : "bg-indigo-600 text-white hover:bg-indigo-700"
              } transition-all duration-200`}
            >
              صفحه قبلی
            </motion.button>
          </div>
        </>
      )}

      {/* Child Details Modal */}
      <AnimatePresence>
        {selectedChild && (
          <motion.div
            initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
            animate={{ opacity: 1, backdropFilter: "blur(8px)" }}
            exit={{ opacity: 0, backdropFilter: "blur(0px)" }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-lg flex items-center justify-center z-50"
            onClick={() => setSelectedChild(null)}
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
              <h2 className="text-2xl font-bold text-gray-900 mb-6 text-right tracking-tight">
               {selectedChild.first_name} {selectedChild.last_name}
              </h2>
              <div className="flex flex-col items-center mb-6">
                <div className="flex gap-4">
                  {childImages[selectedChild.id] ? (
                    <img
                      src={childImages[selectedChild.id]}
                      alt={`عکس کودک ${selectedChild.full_name}`}
                      className="w-32 h-32 rounded-full object-cover border-4 border-indigo-100 shadow-sm"
                    />
                  ) : (
                    <div className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 shadow-sm">
                      بدون عکس
                    </div>
                  )}
                  {parentImages[selectedChild.id] ? (
                    <img
                      src={parentImages[selectedChild.id]}
                      alt={`عکس کودک ${selectedChild.full_name} با والدین`}
                      className="w-32 h-32 rounded-full object-cover border-4 border-indigo-100 shadow-sm"
                    />
                  ) : (
                    <div className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 shadow-sm">
                      بدون عکس
                    </div>
                  )}
                </div>

              </div>
              <div className="space-y-4 text-right text-gray-700 text-sm">
                <div className="grid grid-cols-1 gap-3">
                  <p className="flex items-center gap-2">
                    <span className=" text-gray-900">نام کامل:</span> 
                    <span className="text-gray-600">{selectedChild.full_name || "-"}</span>
                  </p>
                  <p className="flex items-center gap-2">
                    <span className=" text-gray-900">تاریخ تولد:</span> 
                    <span className="text-gray-600">{convertToJalali(selectedChild.birth_date) || "-"}</span>
                  </p>
                  <p className="flex items-center gap-2">
                    <span className=" text-gray-900">محل تولد:</span> 
                    <span className="text-gray-600">{selectedChild.place_of_birth || "-"}</span>
                  </p>
                  <p className="flex items-center gap-2">
                    <span className=" text-gray-900">جنسیت:</span> 
                    <span className="text-gray-600">{selectedChild.gender === "boy" ? "پسر" : "دختر"}</span>
                  </p>
                  <p className="flex items-center gap-2">
                    <span className=" text-gray-900">کد ملی:</span> 
                    <span className="text-gray-600">{selectedChild.national_id || "-"}</span>
                  </p>
                  <p className="flex items-center gap-2">
                    <span className=" text-gray-900">تعداد خواهر/برادر:</span> 
                    <span className="text-gray-600">{selectedChild.siblings_count || "-"}</span>
                  </p>
                  <p className="flex items-center gap-2">
                    <span className=" text-gray-900">ترتیب تولد:</span> 
                    <span className="text-gray-600">{selectedChild.birth_order || "-"}</span>
                  </p>
                  <p className="flex items-center gap-2">
                    <span className=" text-gray-900">گروه خونی:</span> 
                    <span className="text-gray-600">{selectedChild.blood_type || "-"}</span>
                  </p>
                  <p className="flex items-center gap-2">
                    <span className=" text-gray-900">دوره‌های ثبت‌نامی خارج:</span> 
                    <span className="text-gray-600">{selectedChild.courses_signed_up_outside || "-"}</span>
                  </p>
                  <p className="flex items-center gap-2">
                    <span className=" text-gray-900">ایجاد شده در:</span> 
                    <span className="text-gray-600">{new Date(selectedChild.created_at).toLocaleDateString("fa-IR") || "-"}</span>
                  </p>
                </div>
                <h3 className=" text-lg text-gray-900 mt-6 border-b border-gray-200 pb-2">اطلاعات پزشکی</h3>
                <div className="grid grid-cols-1 gap-3">
                  <p className="flex items-center gap-2">
                    <span className=" text-gray-900">چالش‌ها:</span> 
                    <span className="text-gray-600">{selectedChild.medical_info?.challenges || "-"}</span>
                  </p>
                  <p className="flex items-center gap-2">
                    <span className=" text-gray-900">آلرژی‌ها:</span> 
                    <span className="text-gray-600">{selectedChild.medical_info?.allergies || "-"}</span>
                  </p>
                  <p className="flex items-center gap-2">
                    <span className=" text-gray-900">بیماری یا داروها:</span> 
                    <span className="text-gray-600">{selectedChild.medical_info?.illness_or_medications || "-"}</span>
                  </p>
                  <p className="flex items-center gap-2">
                    <span className=" text-gray-900">تاریخچه بستری:</span> 
                    <span className="text-gray-600">{selectedChild.medical_info?.hospitalization_history || "-"}</span>
                  </p>
                </div>
              </div>
              <div className="flex justify-end mt-8">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSelectedChild(null)}
                  className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors duration-200 font-medium shadow-sm"
                >
                  بستن
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminChildrenList;