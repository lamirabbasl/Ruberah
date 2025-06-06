"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { IoClose } from "react-icons/io5";
import { getCourses, addCourse, deleteCourse } from "@/lib/api/api";

const CoursesTab = () => {
  const [courses, setCourses] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newCourse, setNewCourse] = useState({ name: "", description: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [courseToDelete, setCourseToDelete] = useState(null);

  const fetchCourses = async () => {
    setLoading(true);
    try {
      const data = await getCourses();
      setCourses(data);
    } catch (err) {
      setError("خطا در دریافت دوره‌ها");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

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
      fetchCourses();
    } catch (err) {
      setError("خطا در افزودن دوره");
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
      fetchCourses();
    } catch (err) {
      setError("خطا در حذف دوره");
    }
  };

  const cancelDelete = () => {
    setShowDeleteConfirm(false);
    setCourseToDelete(null);
  };

  const modalVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.3 } },
    exit: { opacity: 0, scale: 0.8, transition: { duration: 0.2 } },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen font-sans">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-bold text-gray-800">دوره‌ها</h2>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowAddForm(true)}
          className="bg-indigo-600 text-white px-5 py-2.5 rounded-lg shadow-md hover:bg-indigo-700 transition-colors"
        >
          افزودن دوره
        </motion.button>
      </div>

      <AnimatePresence>
        {showAddForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50"
          >
            <motion.div
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-md relative"
            >
              <button
                onClick={() => setShowAddForm(false)}
                className="absolute top-4 left-4 text-gray-500 hover:text-gray-700 transition"
                aria-label="بستن فرم افزودن دوره"
              >
                <IoClose size={24} />
              </button>
              <h3 className="text-lg font-semibold text-gray-800 mb-6">افزودن دوره جدید</h3>
              <div className="mb-5">
                <label className="block mb-2 text-sm font-medium text-gray-700">نام دوره</label>
                <input
                  type="text"
                  value={newCourse.name}
                  onChange={(e) => setNewCourse({ ...newCourse, name: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                />
              </div>
              <div className="mb-5">
                <label className="block mb-2 text-sm font-medium text-gray-700">توضیحات</label>
                <textarea
                  value={newCourse.description}
                  onChange={(e) => setNewCourse({ ...newCourse, description: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                  rows="4"
                />
              </div>
              {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleAddCourse}
                className="w-full bg-indigo-600 text-white px-4 py-2.5 rounded-lg hover:bg-indigo-700 transition-colors"
              >
                ذخیره
              </motion.button>
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
            className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50"
          >
            <motion.div
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-sm relative"
            >
              <button
                onClick={cancelDelete}
                className="absolute top-4 left-4 text-gray-500 hover:text-gray-700 transition"
                aria-label="بستن تایید حذف"
              >
                <IoClose size={24} />
              </button>
              <p className="mb-6 text-red-600 font-semibold text-center">
                آیا از حذف دوره "{courseToDelete?.name}" مطمئن هستید؟
              </p>
              <div className="flex justify-end space-x-3">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={cancelDelete}
                  className="px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-100 transition"
                >
                  لغو
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleDeleteCourse}
                  className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition"
                >
                  حذف
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {loading ? (
        <p className="text-center text-gray-600">در حال بارگذاری...</p>
      ) : error ? (
        <p className="text-center text-red-500">{error}</p>
      ) : courses.length === 0 ? (
        <p className="text-center text-gray-600">هیچ دوره‌ای یافت نشد.</p>
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
                className="relative bg-white border border-gray-200 rounded-xl p-5 shadow-md hover:shadow-xl transition-shadow"
              >
                <button
                  onClick={() => confirmDeleteCourse(course)}
                  className="absolute top-3 left-3 text-red-500 hover:text-red-700 transition"
                  aria-label={`حذف دوره ${course.name}`}
                >
                  <IoClose size={20} />
                </button>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">{course.name}</h3>
                <p className="text-gray-600 text-sm">{course.description}</p>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
};

export default CoursesTab;