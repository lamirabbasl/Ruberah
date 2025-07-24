"use client";
import { motion, AnimatePresence } from "framer-motion";
import React, { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { getChildren, addChild, patchChild } from "@/lib/api/api";
import EditableChild from "./EditableChild";
import AddChildForm from "./AddChildForm";
import LoadingSpinner from "../common/LoadingSpinner";

const ChildrenPage = () => {
  const [children, setChildren] = useState([]);
  const [loadingChildren, setLoadingChildren] = useState(true);
  const [error, setError] = useState(null);
  const [showAddChildForm, setShowAddChildForm] = useState(false);

  // Fetch children on mount
  useEffect(() => {
    const fetchChildren = async () => {
      setLoadingChildren(true);
      try {
        const data = await getChildren();
        setChildren(data);
      } catch (err) {
        console.error("Error fetching children:", err);
        const errorMessage = err.response?.data?.message || err.message || "خطا در ثبت نام";
        toast.error(errorMessage);
        setError(errorMessage);
      } finally {
        setLoadingChildren(false);
      }
    };

    fetchChildren();
  }, []);

  // Add new child
  const handleAddChild = async (newChild) => {
    try {
      const response = await addChild({
        full_name: newChild.full_name,
        birth_date: newChild.birth_date,
        gender: newChild.gender,
      });
      const successMessage = response.data?.message || "فرزند با موفقیت اضافه شد.";
      toast.success(successMessage);
      setChildren([...children, response]);
      setShowAddChildForm(false);
    } catch (err) {
      console.error("Error adding child:", err);
      const errorMessage = err.response?.data?.message || err.message || "خطا در ثبت نام";
      toast.error(errorMessage);
      setError(errorMessage);
    }
  };

  // Update existing child
  const handleUpdateChild = async (updatedChild) => {
    try {
      const response = await patchChild(updatedChild.id, {
        full_name: updatedChild.full_name,
        gender: updatedChild.gender,
        birth_date: updatedChild.birth_date,
      });
      const successMessage = response.data?.message || "اطلاعات با موفقیت بروزرسانی شد.";
      toast.success(successMessage);
      setChildren(
        children.map((child) =>
          child.id === response.id ? response : child
        )
      );
    } catch (err) {
      console.error("Error updating child:", err);
      const errorMessage = err.response?.data?.message || err.message || "خطا در ثبت نام";
      toast.error(errorMessage);
      setError(errorMessage);
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
      className="flex flex-col text-black font-mitra items-center p-6 max-w-2xl max-md:w-screen mx-auto bg-gradient-to-br from-white to-gray-50 shadow-2xl rounded-2xl mt-4 space-y-6"
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
        className="text-3xl font-bold text-gray-800"
      >
        مدیریت فرزندان
      </motion.h1>

      <div className="w-full space-y-4">
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
                <EditableChild child={child} onUpdate={handleUpdateChild} />
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
            className="bg-blue-600 text-white px-6 py-2 rounded-full hover:bg-blue-700 transition-colors duration-200 shadow-md"
          >
            افزودن فرزند جدید
          </motion.button>
        ) : (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="bg-white p-6 rounded-lg shadow-md"
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
    </motion.div>
  );
};

export default ChildrenPage;