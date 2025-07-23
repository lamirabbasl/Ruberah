"use client";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { getAdminCourses, addCourse, editCourse, deleteCourse, searchCourses } from "@/lib/api/api";
import SearchBar from "@/components/admin/courses/SearchBar";
import AddCourseModal from "@/components/admin/courses/AddCourseModal";
import EditCourseModal from "@/components/admin/courses/EditCourseModal";
import DeleteConfirmModal from "@/components/admin/courses/DeleteConfirmModal";
import CourseList from "@/components/admin/courses/CourseList";

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
  const [searchTerm, setSearchTerm] = useState("");

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
    const delayDebounceFn = setTimeout(() => {
      fetchCourses(searchTerm);
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm]);

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
      fetchCourses(searchTerm);
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
      fetchCourses(searchTerm);
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
      fetchCourses(searchTerm);
    } catch (err) {
      setError("خطا در حذف دوره");
    }
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
      <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
      <AddCourseModal
        showAddForm={showAddForm}
        setShowAddForm={setShowAddForm}
        newCourse={newCourse}
        setNewCourse={setNewCourse}
        error={error}
        setError={setError}
        handleAddCourse={handleAddCourse}
      />
      <EditCourseModal
        showEditForm={showEditForm}
        setShowEditForm={setShowEditForm}
        editingCourse={editingCourse}
        setEditingCourse={setEditingCourse}
        error={error}
        setError={setError}
        handleEditCourse={handleEditCourse}
      />
      <DeleteConfirmModal
        showDeleteConfirm={showDeleteConfirm}
        courseToDelete={courseToDelete}
        cancelDelete={() => {
          setShowDeleteConfirm(false);
          setCourseToDelete(null);
        }}
        handleDeleteCourse={handleDeleteCourse}
      />
      <CourseList
        courses={courses}
        loading={loading}
        error={error}
        searchTerm={searchTerm}
        confirmDeleteCourse={confirmDeleteCourse}
        setEditingCourse={setEditingCourse}
        setShowEditForm={setShowEditForm}
        fetchCourses={fetchCourses}
      />
    </div>
  );
};

export default CoursesTab;