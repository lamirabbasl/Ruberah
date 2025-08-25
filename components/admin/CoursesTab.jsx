"use client";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { getAdminCourses, addCourse, editCourse, deleteCourse, searchCourses } from "@/lib/api/api";
import SearchBar from "@/components/admin/courses/SearchBar";
import AddCourseModal from "@/components/admin/courses/AddCourseModal";
import EditCourseModal from "@/components/admin/courses/EditCourseModal";
import DeleteConfirmModal from "@/components/admin/courses/DeleteConfirmModal";
import CourseList from "@/components/admin/courses/CourseList";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const CoursesTab = () => {
  const [courses, setCourses] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [newCourse, setNewCourse] = useState({ name: "", description: "" });
  const [editingCourse, setEditingCourse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [courseToDelete, setCourseToDelete] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchCourses = async (searchQuery = "") => {
    setLoading(true);
    try {
      const data = searchQuery ? await searchCourses(searchQuery) : await getAdminCourses();
      setCourses(data);
    } catch (err) {
      const errorMessage = err.response?.data?.message ||  "خطا در دریافت دوره‌ها";
      toast.error(errorMessage);
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
      toast.error("نام دوره نمی‌تواند خالی باشد");
      return;
    }
    try {
      await addCourse(newCourse);
      setNewCourse({ name: "", description: "" });
      setShowAddForm(false);
      fetchCourses(searchTerm);
      toast.success("دوره با موفقیت اضافه شد.");
    } catch (err) {
      const errorMessage = err.response?.data?.message || "خطا در افزودن دوره";
      toast.error(errorMessage);
    }
  };

  const handleEditCourse = async () => {
    if (!editingCourse.name.trim()) {
      toast.error("نام دوره نمی‌تواند خالی باشد");
      return;
    }
    try {
      await editCourse(editingCourse.id, {
        name: editingCourse.name,
        description: editingCourse.description,
      });
      setShowEditForm(false);
      setEditingCourse(null);
      fetchCourses(searchTerm);
      toast.success("ویرایش با موفقیت انجام شد.");
    } catch (err) {
      const errorMessage = err.response?.data?.message || "خطا در ویرایش دوره";
      toast.error(errorMessage);
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
      toast.success("دوره با موفقیت حذف شد.");
    } catch (err) {
      const errorMessage = err.response?.data?.message || "خطا در حذف دوره";
      toast.error(errorMessage);
    }
  };

  return (
    <div className="p-6 bg-gradient-to-b from-gray-50 to-gray-100 min-h-screen font-mitra">
      <ToastContainer
        position="bottom-right"
        autoClose={3000}
        hideProgressBar={false}
        closeOnClick
        pauseOnHover
        draggable
        theme="light"
        rtl={true}
      />
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
        handleAddCourse={handleAddCourse}
      />
      <EditCourseModal
        showEditForm={showEditForm}
        setShowEditForm={setShowEditForm}
        editingCourse={editingCourse}
        setEditingCourse={setEditingCourse}
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
