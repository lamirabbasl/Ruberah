"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PlusCircle, Trash2 } from "lucide-react";

const initialCourses = [
  {
    id: "1",
    code: "CS101",
    name: "مقدمه‌ای بر برنامه‌نویسی",
    instructor: "دکتر احمدی",
    startDate: "2023-10-01",
    capacity: "30",
  },
  {
    id: "2",
    code: "MATH202",
    name: "ریاضیات پیشرفته",
    instructor: "استاد محمدی",
    startDate: "2023-10-02",
    capacity: "25",
  },
];

const AdminCourses = () => {
  const [courses, setCourses] = useState(initialCourses);
  const [newCourse, setNewCourse] = useState({
    name: "",
    instructor: "",
    startDate: "",
    capacity: "",
  });
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [courseToDelete, setCourseToDelete] = useState(null);

  const handleAddCourse = () => {
    if (
      !newCourse.name.trim() ||
      !newCourse.instructor.trim() ||
      !newCourse.startDate.trim() ||
      !newCourse.capacity.trim()
    ) {
      alert("لطفاً همه فیلدها را پر کنید.");
      return;
    }
    const newId = Date.now().toString();
    const courseToAdd = {
      id: newId,
      code: `CRS${newId.slice(-4)}`, // Generate a simple code automatically
      name: newCourse.name,
      instructor: newCourse.instructor,
      startDate: newCourse.startDate,
      capacity: newCourse.capacity,
    };
    setCourses([...courses, courseToAdd]);
    setNewCourse({
      name: "",
      instructor: "",
      startDate: "",
      capacity: "",
    });
    setIsAddModalOpen(false);
  };

  const handleRemoveCourse = (id, name) => {
    setCourseToDelete({ id, name });
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    setCourses(courses.filter((course) => course.id !== courseToDelete.id));
    setIsDeleteModalOpen(false);
    setCourseToDelete(null);
  };

  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.3 } },
  };

  const formVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.4, ease: "easeInOut" },
    },
    exit: { opacity: 0, scale: 0.9, transition: { duration: 0.2 } },
  };

  return (
    <div
      className="p-4 sm:p-6 font-noto w-5/6 max-md:w-screen text-black bg-white min-h-screen"
      dir="rtl"
    >
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 sm:mb-8 space-y-4 sm:space-y-0">
        <h1 className="text-2xl sm:text-3xl font-bold text-black">
          لیست دوره‌ها
        </h1>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-4 py-2 sm:px-6 sm:py-3 rounded-md shadow-md hover:shadow-lg transition-all duration-300 flex items-center gap-2 w-full sm:w-auto"
        >
          <PlusCircle className="w-5 h-5" />
          افزودن دوره
        </button>
      </div>

      <AnimatePresence>
        {isAddModalOpen && (
          <motion.div
            variants={backdropVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            className="fixed inset-0 flex items-center justify-center z-50"
            style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
          >
            <motion.div
              variants={formVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="bg-white rounded-xl p-4 sm:p-6 w-full max-w-[90%] sm:max-w-md shadow-2xl relative border border-gray-300"
              style={{ backdropFilter: "blur(12px)" }}
            >
              <h2 className="text-lg sm:text-2xl font-semibold mb-4 sm:mb-6 text-right text-gray-800">
                افزودن دوره جدید
              </h2>
              <div className="mb-4">
                <label
                  htmlFor="name"
                  className="block text-gray-700 text-sm font-bold mb-2 text-right"
                >
                  دوره:
                </label>
                <input
                  type="text"
                  id="name"
                  value={newCourse.name}
                  onChange={(e) =>
                    setNewCourse({ ...newCourse, name: e.target.value })
                  }
                  placeholder="نام دوره"
                  className="appearance-none border border-gray-300 text-right rounded-md w-full py-2 sm:py-3 px-3 sm:px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 transition-all duration-200"
                />
              </div>
              <div className="mb-4">
                <label
                  htmlFor="instructor"
                  className="block text-gray-700 text-sm font-bold mb-2 text-right"
                >
                  مدرس:
                </label>
                <input
                  type="text"
                  id="instructor"
                  value={newCourse.instructor}
                  onChange={(e) =>
                    setNewCourse({ ...newCourse, instructor: e.target.value })
                  }
                  placeholder="نام مدرس"
                  className="appearance-none border border-gray-300 text-right rounded-md w-full py-2 sm:py-3 px-3 sm:px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 transition-all duration-200"
                />
              </div>
              <div className="mb-4">
                <label
                  htmlFor="startDate"
                  className="block text-gray-700 text-sm font-bold mb-2 text-right"
                >
                  تاریخ شروع (YYYY-MM-DD):
                </label>
                <input
                  type="text"
                  id="startDate"
                  value={newCourse.startDate}
                  onChange={(e) =>
                    setNewCourse({ ...newCourse, startDate: e.target.value })
                  }
                  placeholder="مثال: 2023-10-01"
                  className="appearance-none border border-gray-300 text-right rounded-md w-full py-2 sm:py-3 px-3 sm:px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 transition-all duration-200"
                />
              </div>
              <div className="mb-4">
                <label
                  htmlFor="capacity"
                  className="block text-gray-700 text-sm font-bold mb-2 text-right"
                >
                  ظرفیت:
                </label>
                <input
                  type="number"
                  id="capacity"
                  value={newCourse.capacity}
                  onChange={(e) =>
                    setNewCourse({ ...newCourse, capacity: e.target.value })
                  }
                  placeholder="ظرفیت"
                  className="appearance-none border border-gray-300 text-right rounded-md w-full py-2 sm:py-3 px-3 sm:px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 transition-all duration-200"
                />
              </div>
              <div className="flex flex-col sm:flex-row justify-between space-y-3 sm:space-y-0 sm:space-x-4">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 sm:py-3 px-4 sm:px-6 rounded-md focus:outline-none shadow-md hover:shadow-lg transition-all duration-200 z-10 w-full sm:w-auto"
                >
                  لغو
                </button>
                <button
                  onClick={handleAddCourse}
                  className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 sm:py-3 px-4 sm:px-6 rounded-md shadow-md hover:shadow-lg transition-all duration-200 z-10 w-full sm:w-auto"
                >
                  افزودن
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isDeleteModalOpen && (
          <motion.div
            variants={backdropVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            className="fixed inset-0 flex items-center justify-center z-50"
            style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
          >
            <motion.div
              variants={formVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="bg-white rounded-xl p-4 sm:p-6 w-full max-w-[90%] sm:max-w-md shadow-2xl relative border border-gray-300"
              style={{ backdropFilter: "blur(12px)" }}
            >
              <h2 className="text-lg sm:text-2xl font-semibold mb-4 sm:mb-6 text-right text-gray-800">
                حذف دوره
              </h2>
              <p className="text-gray-700 mb-4 sm:mb-6 text-right">
                آیا مطمئن هستید که می‌خواهید دوره "{courseToDelete?.name}" را
                حذف کنید؟
              </p>
              <div className="flex flex-col sm:flex-row justify-between space-y-3 sm:space-y-0 sm:space-x-4">
                <button
                  onClick={() => setIsDeleteModalOpen(false)}
                  className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 sm:py-3 px-4 sm:px-6 rounded-md focus:outline-none shadow-md hover:shadow-lg transition-all duration-200 z-10 w-full sm:w-auto"
                >
                  لغو
                </button>
                <button
                  onClick={confirmDelete}
                  className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 sm:py-3 px-4 sm:px-6 rounded-md focus:outline-none shadow-md hover:shadow-lg transition-all duration-200 z-10 w-full sm:w-auto"
                >
                  حذف
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        <AnimatePresence>
          {courses.map((course) => (
            <motion.div
              key={course.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="bg-white border border-gray-300 rounded-md shadow-md hover:shadow-lg transition-all duration-200 p-4">
                <div className="flex justify-between items-center mb-2">
                  <h2 className="text-base sm:text-lg font-semibold text-black text-right">
                    {course.name}
                  </h2>
                  <button
                    onClick={() => handleRemoveCourse(course.id, course.name)}
                    className="text-red-500 hover:text-red-600 transition-colors"
                    title="حذف دوره"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
                <div className="text-right space-y-1">
                  <p>کد: {course.code}</p>
                  <p>مدرس: {course.instructor}</p>
                  <p>تاریخ شروع: {course.startDate}</p>
                  <p>ظرفیت: {course.capacity}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default AdminCourses;
