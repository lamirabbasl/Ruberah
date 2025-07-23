import React from "react";
import { IoClose, IoPencil } from "react-icons/io5";
import { motion } from "framer-motion";
import { UploadCourseImage } from "@/lib/api/api";

const cardVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.95 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.4, ease: "easeOut" } },
};

function CourseCard({
  course,
  confirmDeleteCourse,
  setEditingCourse,
  setShowEditForm,
  fetchCourses,
  searchTerm,
}) {
  return (
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
              if (e.target.nextSibling) {
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
                fetchCourses(searchTerm);
              } catch (err) {
                alert("خطا در بارگذاری تصویر");
              }
            }}
          />
        </label>
      </div>
    </motion.div>
  );
}

export default CourseCard;