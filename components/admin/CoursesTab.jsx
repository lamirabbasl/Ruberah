"use client";
import React, { useState, useEffect } from "react";
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

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">دوره‌ها</h2>
        <button
          onClick={() => setShowAddForm(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          افزودن دوره
        </button>
      </div>
      {showAddForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded shadow-lg w-96 relative">
            <button
              onClick={() => setShowAddForm(false)}
              className="absolute top-2 left-2 text-gray-600 hover:text-gray-900"
              aria-label="بستن فرم افزودن دوره"
            >
              ✕
            </button>
            <div className="mb-4">
              <label className="block mb-1">نام دوره</label>
              <input
                type="text"
                value={newCourse.name}
                onChange={(e) =>
                  setNewCourse({ ...newCourse, name: e.target.value })
                }
                className="w-full border rounded px-3 py-2"
              />
            </div>
            <div className="mb-4">
              <label className="block mb-1">توضیحات</label>
              <textarea
                value={newCourse.description}
                onChange={(e) =>
                  setNewCourse({ ...newCourse, description: e.target.value })
                }
                className="w-full border rounded px-3 py-2"
              />
            </div>
            {error && <p className="text-red-600 mb-2">{error}</p>}
            <button
              onClick={handleAddCourse}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
            >
              ذخیره
            </button>
          </div>
        </div>
      )}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded shadow-lg w-80 relative">
            <button
              onClick={cancelDelete}
              className="absolute top-2 left-2 text-gray-600 hover:text-gray-900"
              aria-label="بستن تایید حذف"
            >
              <IoClose size={24} />
            </button>
            <p className="mb-4 text-red-600 font-semibold">
              آیا از حذف دوره "{courseToDelete?.name}" مطمئن هستید؟
            </p>
            <div className="flex justify-end space-x-2">
              <button
                onClick={cancelDelete}
                className="px-4 py-2 rounded border border-gray-300 hover:bg-gray-100 transition"
              >
                لغو
              </button>
              <button
                onClick={handleDeleteCourse}
                className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700 transition"
              >
                حذف
              </button>
            </div>
          </div>
        </div>
      )}
      {loading ? (
        <p>در حال بارگذاری...</p>
      ) : error ? (
        <p className="text-red-600">{error}</p>
      ) : courses.length === 0 ? (
        <p>هیچ دوره‌ای یافت نشد.</p>
      ) : (
        <div className="grid grid-cols-3 gap-4">
          {courses.map((course) => (
            <div
              key={course.id}
              className="relative border rounded p-4 shadow hover:shadow-lg transition bg-white"
            >
              <button
                onClick={() => confirmDeleteCourse(course)}
                className="absolute top-2 left-2 text-red-600 hover:text-red-900"
                aria-label={`حذف دوره ${course.name}`}
              >
                <IoClose size={20} />
              </button>
              <h3 className="text-lg font-semibold">{course.name}</h3>
              <p className="text-gray-700 mt-1">{course.description}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CoursesTab;
