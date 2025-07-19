"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { IoClose, IoPencil } from "react-icons/io5";
import { getAdminCourses, addCourse, editCourse, deleteCourse, UploadCourseImage, searchCourses } from "@/lib/api/api";

const CoursesTab = () => {
  const [courses, setCourses] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [newCourse, setNewCourse] = useState({ name: "", description: "" });
  const [editingCourse, setEditingCourse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [courseToDelete, setCourseToDelete] = useState(null);
  const [searchTerm, setSearchTerm] = useState(""); // New state for search term

  const fetchCourses = async (searchQuery = "") => {
    setLoading(true);
    setError(null);
    try {
      const data = searchQuery ? await searchCourses(searchQuery) : await getAdminCourses();
      setCourses(data);
    } catch (err) {
      setError("خطا در دریافت دوره‌ها");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Debounce search term
    const delayDebounceFn = setTimeout(() => {
      fetchCourses(searchTerm);
    }, 500); // 500ms delay

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm]); // Re-run when searchTerm changes

  const handleAddCourse = async () => {
    if (!newCourse.name.trim()) {
      setError("نام دوره نمی‌تواند خالی باشد");
      return;
    }
    setError(null);
    try {
      await addCourse(newCourse);
      setNewCourse({ name: "", description: "" });
      setShowAddForm(false);
      fetchCourses(searchTerm); // Refresh list with current search term
    } catch (err) {
      setError("خطا در افزودن دوره");
    }
  };

  const handleEditCourse = async () => {
    if (!editingCourse.name.trim()) {
      setError("نام دوره نمی‌تواند خالی باشد");
      return;
    }
    setError(null);
    try {
      await editCourse(editingCourse.id, {
        name: editingCourse.name,
        description: editingCourse.description,
      });
      setShowEditForm(false);
      setEditingCourse(null);
      fetchCourses(searchTerm); // Refresh list with current search term
    } catch (err) {
      setError("خطا در ویرایش دوره");
    }
  };

  const confirmDeleteCourse = (course) => {
    setCourseToDelete(course);
    setShowDeleteConfirm(true);
  };

  const handleDeleteCourse = async () => {
    if (!courseToDelete) return;
    try {
      await deleteCourse(courseToDelete.id);
      setShowDeleteConfirm(false);
      setCourseToDelete(null);
      fetchCourses(searchTerm); // Refresh list with current search term
    } catch (err) {
      setError("خطا در حذف دوره");
    }
  };

  const cancelDelete = () => {
    setShowDeleteConfirm(false);
    setCourseToDelete(null);
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
    <div className="p-6 bg-gradient-to-b from-gray-50 to-gray-100 min-h-screen font-mitra">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 tracking-tight">مدیریت دوره‌ها</h2>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowAddForm(true)}
          className="bg-indigo-600 text-white px-6 py-3 rounded-lg shadow-md hover:bg-indigo-700 transition-all duration-200 text-sm font-medium"
        >
          افزودن دوره جدید
        </motion.button>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <label htmlFor="search" className="sr-only">جستجو دوره‌ها</label>
        <input
          type="text"
          id="search"
          placeholder="جستجو بر اساس نام دوره..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-4 py-3 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-200 text-sm"
        />
      </div>

      <AnimatePresence>
        {showAddForm && (
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
              className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md relative"
            >
              <h3 className="text-xl font-bold text-gray-900 mb-6 tracking-tight">افزودن دوره جدید</h3>
              <div className="space-y-5">
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-700">نام دوره</label>
                  <input
                    type="text"
                    value={newCourse.name}
                    onChange={(e) => setNewCourse({ ...newCourse, name: e.target.value })}
                    className="w-full border border-gray-200 rounded-lg px-4 py-3 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-200 text-sm"
                  />
                </div>
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-700">توضیحات</label>
                  <textarea
                    value={newCourse.description}
                    onChange={(e) => setNewCourse({ ...newCourse, description: e.target.value })}
                    className="w-full border border-gray-200 rounded-lg px-4 py-3 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-200 text-sm"
                    rows="4"
                  />
                </div>
              </div>
              {error && (
                <p className="text-red-600 text-sm bg-red-50 p-3 rounded-lg mt-4">{error}</p>
              )}
              <div className="flex justify-end space-x-3 mt-6">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowAddForm(false)}
                  className="px-5 py-2 rounded-lg border border-gray-300 bg-white text-gray-700 hover:bg-gray-100 transition-all duration-200 text-sm font-medium"
                >
                  انصراف
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleAddCourse}
                  className="px-5 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition-all duration-200 text-sm font-medium"
                >
                  ذخیره
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showEditForm && (
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
              className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md relative"
            >
              <h3 className="text-xl font-bold text-gray-900 mb-6 tracking-tight">ویرایش دوره</h3>
              <div className="space-y-5">
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-700">نام دوره</label>
                  <input
                    type="text"
                    value={editingCourse?.name || ""}
                    onChange={(e) => setEditingCourse({ ...editingCourse, name: e.target.value })}
                    className="w-full border border-gray-200 rounded-lg px-4 py-3 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-200 text-sm"
                  />
                </div>
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-700">توضیحات</label>
                  <textarea
                    value={editingCourse?.description || ""}
                    onChange={(e) => setEditingCourse({ ...editingCourse, description: e.target.value })}
                    className="w-full border border-gray-200 rounded-lg px-4 py-3 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-200 text-sm"
                    rows="4"
                  />
                </div>
              </div>
              {error && (
                <p className="text-red-600 text-sm bg-red-50 p-3 rounded-lg mt-4">{error}</p>
              )}
              <div className="flex justify-end space-x-3 mt-6">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowEditForm(false)}
                  className="px-5 py-2 rounded-lg border border-gray-300 bg-white text-gray-700 hover:bg-gray-100 transition-all duration-200 text-sm font-medium"
                >
                  انصراف
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleEditCourse}
                  className="px-5 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition-all duration-200 text-sm font-medium"
                >
                  ذخیره
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

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
              className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md relative"
            >
              <p className="mb-6 text-red-600 font-semibold text-center text-lg">
                آیا از حذف دوره "{courseToDelete?.name}" مطمئن هستید؟
              </p>
              <div className="flex justify-end space-x-3">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={cancelDelete}
                  className="px-5 py-2 rounded-lg border border-gray-300 bg-white text-gray-700 hover:bg-gray-100 transition-all duration-200 text-sm font-medium"
                >
                  لغو
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleDeleteCourse}
                  className="px-5 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition-all duration-200 text-sm font-medium"
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
      ) : courses.length === 0 ? (
        <p className="text-center text-gray-600 font-medium bg-white p-4 rounded-lg shadow">هیچ دوره‌ای یافت نشد.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {courses.map((course) => (
              <motion.div
                key={course.id}
                variants={cardVariants}
                initial="hidden"
                animate="visible"
                exit="hidden"
                className="relative bg-white border border-gray-200 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden"
                whileHover={{ scale: 1.02, boxShadow: "0 10px 20px rgba(0,0,0,0.1)" }}
              >
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => confirmDeleteCourse(course)}
                  className="absolute top-3 left-3 p-2 rounded-full bg-white/80 backdrop-blur-sm text-red-500 hover:bg-gray-200 hover:text-red-700 transition-all duration-200 z-10"
                  aria-label={`حذف دوره ${course.name}`}
                >
                  <IoClose size={20} />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => {
                    setEditingCourse({ id: course.id, name: course.name, description: course.description });
                    setShowEditForm(true);
                  }}
                  className="absolute top-3 right-3 p-2 rounded-full bg-white/80 backdrop-blur-sm text-indigo-500 hover:bg-gray-200 hover:text-indigo-700 transition-all duration-200 z-10"
                  aria-label={`ویرایش دوره ${course.name}`}
                >
                  <IoPencil size={20} />
                </motion.button>
                <div className="w-full h-48 bg-gray-1006">
                  {course.image ? (
                    <img
                      src={course.image}
                      alt={course.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.style.display = "none";
                        if (e.target.nextSibling) { // Check if nextSibling exists
                          e.target.nextSibling.style.display = "flex";
                        }
                      }}
                    />
                  ) : null}
                  <div
                    className={`w-full h-full flex items-center justify-center ${course.image ? "hidden" : ""}`}
                    style={{ display: course.image ? "none" : "flex" }}
                  >
                    <div className="text-center">
                      <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-2">
                        <svg
                          className="w-8 h-8 text-gray-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                          />
                        </svg>
                      </div>
                      <span className="text-gray-400 text-sm">بدون تصویر</span>
                    </div>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2 tracking-tight">{course.name}</h3>
                  <p className="text-sm text-gray-600 mb-4">{course.description || "بدون توضیحات"}</p>
                  <label className="inline-block bg-indigo-600 text-white text-sm font-medium px-4 py-2 rounded-lg cursor-pointer hover:bg-indigo-700 transition">
                    بارگذاری تصویر
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={async (e) => {
                        const file = e.target.files[0];
                        if (!file) return;
                        try {
                          await UploadCourseImage(course.id, file);
                          fetchCourses(searchTerm); // Refresh list with current search term
                        } catch (err) {
                          alert("خطا در بارگذاری تصویر");
                        }
                      }}
                    />
                  </label>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
};

export default CoursesTab;