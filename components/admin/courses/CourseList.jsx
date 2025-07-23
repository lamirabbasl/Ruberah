import React from "react";
import { motion } from "framer-motion";
import CourseCard from "./CourseCard";

function CourseList({
  courses,
  loading,
  error,
  searchTerm,
  confirmDeleteCourse,
  setEditingCourse,
  setShowEditForm,
  fetchCourses,
}) {
  return (
    <>
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
        <p className="text-center text-gray-600 font-medium bg-white p-4 rounded-lg shadow">
          هیچ دوره‌ای یافت نشد.
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => (
            <CourseCard
              key={course.id}
              course={course}
              confirmDeleteCourse={confirmDeleteCourse}
              setEditingCourse={setEditingCourse}
              setShowEditForm={setShowEditForm}
              fetchCourses={fetchCourses}
              searchTerm={searchTerm}
            />
          ))}
        </div>
      )}
    </>
  );
}

export default CourseList;