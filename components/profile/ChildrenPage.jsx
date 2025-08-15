"use client";
import { motion, AnimatePresence } from "framer-motion";
import React, { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { getChildren, addChild, patchChild, deleteChild, getChildById } from "@/lib/api/api";
import EditableChild from "./EditableChild";
import AddChildForm from "./AddChildForm";
import LoadingSpinner from "../common/LoadingSpinner";
import { convertToJalali } from "@/lib/utils/convertDate";

const ChildrenPage = () => {
  const [children, setChildren] = useState([]);
  const [loadingChildren, setLoadingChildren] = useState(true);
  const [error, setError] = useState(null);
  const [showAddChildForm, setShowAddChildForm] = useState(false);
  const [selectedChild, setSelectedChild] = useState(null);

  // Fetch children on mount
  useEffect(() => {
    const fetchChildren = async () => {
      setLoadingChildren(true);
      try {
        const data = await getChildren();
        setChildren(data);
      } catch (err) {
        console.error("Error fetching children:", err);
        const errorMessage = err.response?.data?.message || err.message || "خطا در دریافت اطلاعات";
        toast.error(errorMessage);
        setError(errorMessage);
      } finally {
        setLoadingChildren(false);
      }
    };

    fetchChildren();
  }, []);

  // Fetch child details
  const fetchChildDetails = async (id) => {
    try {
      const data = await getChildById(id);
      setSelectedChild(data);
    } catch (err) {
      console.error("Error fetching child details:", err);
      const errorMessage = err.response?.data?.message || err.message || "خطا در دریافت جزئیات";
      toast.error(errorMessage);
    }
  };

  // Add new child
  const handleAddChild = async (newChild) => {
    try {
      const response = await addChild(newChild);
      const successMessage = response.data?.message || "فرزند با موفقیت اضافه شد.";
      toast.success(successMessage);
      setChildren([...children, response]);
      setShowAddChildForm(false);
    } catch (err) {
      console.error("Error adding child:", err);
      const errorMessage = err.response?.data?.message || err.message || "خطا در افزودن فرزند";
      toast.error(errorMessage);
      setError(errorMessage);
    }
  };

  // Update existing child
  const handleUpdateChild = async (updatedChild) => {
    try {
      const response = await patchChild(updatedChild.id, updatedChild);
      const successMessage = response.data?.message || "اطلاعات با موفقیت بروزرسانی شد.";
      toast.success(successMessage);
      setChildren(
        children.map((child) =>
          child.id === response.id ? response : child
        )
      );
    } catch (err) {
      console.error("Error updating child:", err);
      const errorMessage = err.response?.data?.message || err.message || "خطا در بروزرسانی اطلاعات";
      toast.error(errorMessage);
      setError(errorMessage);
    }
  };

  // Delete child
  const handleDeleteChild = async (id) => {
    try {
      const response = await deleteChild(id);
      const successMessage = response.data?.message || "فرزند با موفقیت حذف شد.";
      toast.success(successMessage);
      setChildren(children.filter((child) => child.id !== id));
    } catch (err) {
      console.error("Error deleting child:", err);
      const errorMessage = err.response?.data?.message;
      toast.error(errorMessage);
      setError(errorMessage);
      window.location.reload();
    }
  };

  if (loadingChildren) {
    return <div className="w-screen"><LoadingSpinner /></div>;
  }

  if (error) {
    return <p className="text-center mt-10 text-red-600">{error}</p>;
  }

  return (
    <motion.div
      layout
      dir="rtl"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col text-black font-mitra items-center p-6 max-w-4xl max-md:w-screen mx-auto bg-white shadow-xl rounded-2xl mt-4 space-y-6"
    >
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
      <motion.h1
        initial={{ y: -20 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 200 }}
        className="text-3xl font-bold text-gray-900"
      >
        مدیریت فرزندان
      </motion.h1>

      <div className="w-full space-y-6">
        <AnimatePresence>
          {children.length === 0 ? (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center text-gray-500"
            >
              هیچ فرزندی ثبت نشده است
            </motion.p>
          ) : (
            children.map((child) => (
              <motion.div
                key={child.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ type: "spring", stiffness: 200 }}
              >
                <EditableChild 
                  child={child} 
                  onUpdate={handleUpdateChild} 
                  onDelete={handleDeleteChild} 
                  onView={fetchChildDetails}
                />
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>

      <motion.div
        className="w-full"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        {!showAddChildForm ? (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowAddChildForm(true)}
            className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors duration-200 shadow-md font-medium"
          >
            افزودن فرزند جدید
          </motion.button>
        ) : (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="bg-white p-6 rounded-lg shadow-md border border-gray-200"
          >
            <AddChildForm
              onAdd={handleAddChild}
            />
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowAddChildForm(false)}
              className="mt-4 text-red-600 hover:text-red-700 transition-colors duration-200"
            >
              انصراف
            </motion.button>
          </motion.div>
        )}
      </motion.div>

      {/* Details Modal */}
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
              initial={{ scale: 0.9, opacity: 0, y: 50 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 50 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className="bg-white/95 backdrop-blur-md rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl border border-gray-100/50 max-h-[80vh] overflow-y-auto"
              dir="rtl"
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-6 text-right tracking-tight">
                {selectedChild.first_name} {selectedChild.last_name}
              </h2>
              <div className="space-y-4 text-right text-gray-700 text-sm">
                <div className="grid grid-cols-1 gap-3">
                  <p className="flex items-center gap-2">
                    <span className="font-semibold text-gray-900">نام کامل:</span> 
                    <span className="text-gray-600">{selectedChild.full_name || "-"}</span>
                  </p>
                  <p className="flex items-center gap-2">
                    <span className="font-semibold text-gray-900">تاریخ تولد:</span> 
                    <span className="text-gray-600">{convertToJalali(selectedChild.birth_date) || "-"}</span>
                  </p>
                  <p className="flex items-center gap-2">
                    <span className="font-semibold text-gray-900">محل تولد:</span> 
                    <span className="text-gray-600">{selectedChild.place_of_birth || "-"}</span>
                  </p>
                  <p className="flex items-center gap-2">
                    <span className="font-semibold text-gray-900">جنسیت:</span> 
                    <span className="text-gray-600">{selectedChild.gender === "boy" ? "پسر" : "دختر"}</span>
                  </p>
                  <p className="flex items-center gap-2">
                    <span className="font-semibold text-gray-900">کد ملی:</span> 
                    <span className="text-gray-600">{selectedChild.national_id || "-"}</span>
                  </p>
                  <p className="flex items-center gap-2">
                    <span className="font-semibold text-gray-900">تعداد خواهر/برادر:</span> 
                    <span className="text-gray-600">{selectedChild.siblings_count || "-"}</span>
                  </p>
                  <p className="flex items-center gap-2">
                    <span className="font-semibold text-gray-900">ترتیب تولد:</span> 
                    <span className="text-gray-600">{selectedChild.birth_order || "-"}</span>
                  </p>
                  <p className="flex items-center gap-2">
                    <span className="font-semibold text-gray-900">گروه خونی:</span> 
                    <span className="text-gray-600">{selectedChild.blood_type || "-"}</span>
                  </p>
                  <p className="flex items-center gap-2">
                    <span className="font-semibold text-gray-900">دوره‌های ثبت‌نامی خارج:</span> 
                    <span className="text-gray-600">{selectedChild.courses_signed_up_outside || "-"}</span>
                  </p>
                  <p className="flex items-center gap-2">
                    <span className="font-semibold text-gray-900">ایجاد شده در:</span> 
                    <span className="text-gray-600">{selectedChild.created_at || "-"}</span>
                  </p>
                </div>
                <h3 className="font-bold text-lg text-gray-900 mt-6 border-b border-gray-200 pb-2">اطلاعات پزشکی</h3>
                <div className="grid grid-cols-1 gap-3">
                  <p className="flex items-center gap-2">
                    <span className="font-semibold text-gray-900">چالش‌ها:</span> 
                    <span className="text-gray-600">{selectedChild.medical_info?.challenges || "-"}</span>
                  </p>
                  <p className="flex items-center gap-2">
                    <span className="font-semibold text-gray-900">آلرژی‌ها:</span> 
                    <span className="text-gray-600">{selectedChild.medical_info?.allergies || "-"}</span>
                  </p>
                  <p className="flex items-center gap-2">
                    <span className="font-semibold text-gray-900">بیماری یا داروها:</span> 
                    <span className="text-gray-600">{selectedChild.medical_info?.illness_or_medications || "-"}</span>
                  </p>
                  <p className="flex items-center gap-2">
                    <span className="font-semibold text-gray-900">تاریخچه بستری:</span> 
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
    </motion.div>
  );
};

export default ChildrenPage;