"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { IoClose } from "react-icons/io5";
import { getAdminChildren, getAdminChildrenImage, getAdminChildrenwithParentImage } from "@/lib/api/api";

const AdminChildrenList = () => {
  const [children, setChildren] = useState([]);
  const [isLastPage, setIsLastPage] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [childToDelete, setChildToDelete] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteError, setDeleteError] = useState(null);
  const [childImages, setChildImages] = useState({});
  const [parentImages, setParentImages] = useState({});

  const fetchChildren = async (page = 1) => {
    try {
      setLoading(true);
      const data = await getAdminChildren(page);
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

  useEffect(() => {
    fetchChildren(currentPage);
  }, [currentPage]);

  const handleDeleteChild = async () => {
    if (!childToDelete) return;
    try {
      setLoading(true);
      await deleteChild(childToDelete.id);
      setShowDeleteConfirm(false);
      setChildToDelete(null);
      setDeleteError(null);
      await fetchChildren(currentPage);
    } catch (err) {
      setDeleteError("خطا در حذف کودک");
      setLoading(false);
    }
  };

  const confirmDeleteChild = (child) => {
    setChildToDelete(child);
    setShowDeleteConfirm(true);
    setDeleteError(null);
  };

  const cancelDelete = () => {
    setShowDeleteConfirm(false);
    setChildToDelete(null);
    setDeleteError(null);
  };

  const filteredChildren = children.filter((child) =>
    child.full_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handlePageChange = (newPage) => {
    if (newPage > 0 && !(newPage > currentPage && isLastPage)) {
      setCurrentPage(newPage);
    }
  };

  const modalVariants = {
    hidden: { opacity: 0, scale: 0.85 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.3, ease: "easeOut" } },
    exit: { opacity: 0, scale: 0.85, transition: { duration: 0.2 } },
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
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full max-w-md border border-gray-200 rounded-lg px-4 py-3 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-200 text-sm text-right"
        />
      </div>

      <AnimatePresence>
        {showDeleteConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50"
          >
            <motion.div
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="bg-white p-6 sm:p-8 rounded-2xl shadow-2xl w-full max-w-md relative text-right"
            >
              <p className="mb-6 text-red-600 font-semibold text-center text-base sm:text-lg">
                آیا از حذف کودک "{childToDelete?.full_name}" مطمئن هستید؟
              </p>
              {deleteError && (
                <p className="mb-4 text-red-500 text-sm bg-red-50 p-3 rounded-lg">{deleteError}</p>
              )}
              <div className="flex justify-end space-x-3 space-x-reverse">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={cancelDelete}
                  className="px-4 sm:px-5 py-2 rounded-lg border border-gray-300 bg-white text-gray-700 hover:bg-gray-100 transition-all duration-200 text-sm font-medium"
                >
                  لغو
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleDeleteChild}
                  className="px-4 sm:px-5 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition-all duration-200 text-sm font-medium"
                >
                  حذف
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

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
      ) : filteredChildren.length === 0 ? (
        <p className="text-center text-gray-600 font-medium bg-white p-4 rounded-lg shadow">هیچ کودکی یافت نشد.</p>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4 sm:gap-6">
            <AnimatePresence>
              {filteredChildren.map((child) => (
                <motion.div
                  key={child.id}
                  variants={cardVariants}
                  initial="hidden"
                  animate="visible"
                  exit="hidden"
                  className="flex flex-col sm:flex-row items-center py-3 bg-white rounded-lg px-4 shadow-lg relative"
                >
                  <div className="flex-shrink-0 mb-4 sm:mb-0 sm:mr-4 w-full sm:w-auto">
                    <div className="flex justify-end gap-4 sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2 sm:space-x-reverse">
                      {childImages[child.id] ? (
                        <img
                          src={childImages[child.id]}
                          alt={`عکس کودک ${child.full_name}`}
                          className="w-24 h-24 rounded-md object-cover border-2 border-indigo-100 "
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
                          className="w-24 h-24 rounded-md object-cover border-2 border-indigo-100 "
                        />
                      ) : (
                        <div className="w-24 h-24 rounded-md bg-gray-200 flex items-center justify-center text-gray-500 mx-auto sm:mx-0">
                          بدون عکس
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="space-y-1 w-full text-right">
                    <p className="font-semibold text-gray-800 text-sm">{child.full_name}</p>
                    <div className="text-sm text-gray-600 space-y-1">
                      <p className="flex items-center justify-end">
                        <span>{child.birth_date}</span>
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
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => confirmDeleteChild(child)}
                    className="text-red-500 hover:text-red-700 absolute left-[-1px] top-[-1px] transition-all duration-200 top-3 left-3"
                    aria-label={`حذف کودک ${child.full_name}`}
                  >
                    <IoClose size={20} />
                  </motion.button>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          <div className="flex justify-center mt-6 sm:mt-8 space-x-3 space-x-reverse">
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
            <span className="px-3 sm:px-4 py-2 text-gray-700 font-medium">صفحه {currentPage}</span>
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
          </div>
        </>
      )}
    </div>
  );
};

export default AdminChildrenList;