"use client";

import React, { useState, useEffect } from "react";
import { FaTrash, FaPlus } from "react-icons/fa";
import { AnimatePresence, motion } from "framer-motion";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import AddTimeForm from "./AddTimeForm";
import { getSessions, addSession, deleteSession } from "@/lib/api/api";

const ReserveTimes = () => {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [sessionToDelete, setSessionToDelete] = useState(null);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);

  useEffect(() => {
    fetchSessions();
  }, []);

  const fetchSessions = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getSessions();
      setSessions(data);
    } catch (err) {
      const message = err.response?.data?.message || "خطا در دریافت جلسات";
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const handleAddItem = () => setShowAddForm(true);
  const handleCancelAdd = () => setShowAddForm(false);

  const handleSaveNewItem = async (newItem) => {
    setLoading(true);
    setError(null);
    try {
      await addSession(newItem);
      toast.success("جلسه با موفقیت افزوده شد.");
      setShowAddForm(false);
      await fetchSessions();
    } catch (err) {
      const message = err.response?.data?.message || "خطا در افزودن جلسه";
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const openConfirmDelete = (id) => {
    setSessionToDelete(id);
    setShowConfirmDelete(true);
  };

  const closeConfirmDelete = () => {
    setSessionToDelete(null);
    setShowConfirmDelete(false);
  };

  const handleRemoveItem = async () => {
    if (!sessionToDelete) return;
    setLoading(true);
    setError(null);
    try {
      await deleteSession(sessionToDelete);
      toast.success("جلسه با موفقیت حذف شد.");
      setShowConfirmDelete(false);
      setSessionToDelete(null);
      await fetchSessions();
    } catch (err) {
      const message = err.response?.data?.message ||  "خطا در حذف جلسه";
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const modalVariants = {
    hidden: { opacity: 0, scale: 0.85 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.3, ease: "easeOut" } },
    exit: { opacity: 0, scale: 0.85, transition: { duration: 0.2 } },
  };

  const rowVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.95 },
    visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.4, ease: "easeOut" } },
  };

  return (
    <div className="p-6 bg-gradient-to-b from-gray-50 to-gray-100 min-h-screen font-mitra text-right" dir="rtl">
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

      <div className="flex flex-col sm:flex-row justify-between items-center mb-8 space-y-4 sm:space-y-0">
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">مدیریت جلسات رزرو</h1>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleAddItem}
          className="bg-indigo-600 text-white px-6 py-3 rounded-lg shadow-md hover:bg-indigo-700 transition-all duration-200 text-sm font-medium flex items-center gap-2 w-full sm:w-auto"
        >
          <FaPlus className="w-4 h-4" />
          افزودن جلسه جدید
        </motion.button>
      </div>

      <AnimatePresence>
        {showAddForm && (
          <AddTimeForm
            onSave={handleSaveNewItem}
            onCancel={handleCancelAdd}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showConfirmDelete && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
          >
            <motion.div
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="bg-white rounded-2xl p-8 w-full max-w-md relative"
            >
              <p className="mb-6 text-red-600 font-semibold text-center text-lg text-right">
                آیا مطمئن هستید که می‌خواهید این جلسه را حذف کنید؟
              </p>
              <div className="flex justify-end space-x-3">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={closeConfirmDelete}
                  className="px-5 py-2 rounded-lg border border-gray-300 bg-white text-gray-700 hover:bg-gray-100 transition-all duration-200 text-sm font-medium"
                >
                  لغو
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap uncertainties={{ scale: 0.95 }}
                  onClick={handleRemoveItem}
                  className="px-5 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition-all duration-200 text-sm font-medium"
                >
                  حذف
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {loading && (
        <div className="flex justify-center items-center h-64">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="w-12 h-12 border-4 border-t-indigo-600 border-gray-200 rounded-full"
          ></motion.div>
        </div>
      )}

      {sessions.length === 0 && !loading ? (
        <p className="text-center text-gray-600 font-medium bg-white p-4 rounded-lg shadow">هیچ جلسه‌ای وجود ندارد</p>
      ) : (
        <motion.div
          initial="hidden"
          animate="visible"
          variants={rowVariants}
          className="overflow-x-auto bg-white border border-gray-200 rounded-2xl shadow-lg"
        >
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-right text-sm font-semibold text-gray-700 uppercase tracking-wider">عنوان</th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-gray-700 uppercase tracking-wider">زمان معارفه</th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-gray-700 uppercase tracking-wider">آدرس</th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-gray-700 uppercase tracking-wider">ظرفیت</th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-gray-700 uppercase tracking-wider">عملیات</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              <AnimatePresence>
                {sessions.map((session) => (
                  <motion.tr
                    key={session.id}
                    variants={rowVariants}
                    initial="hidden"
                    animate="visible"
                    exit="hidden"
                    className="hover:bg-gray-50 transition-all duration-200"
                  >
                    <td className="px-6 py-4 text-right text-sm inferno font-medium text-gray-900">{session.title}</td>
                    <td className="px-6 py-4 text-right text-sm text-gray-600">
                      {new Date(session.date_time).toLocaleString("fa-IR", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                        timeZone: "UTC"
                      })}
                    </td>
                    <td className="px-6 py-4 text-right text-sm text-gray-600">{session.address}</td>
                    <td className="px-6 py-4 text-right text-sm text-gray-600">{session.capacity}</td>
                    <td className="px-6 py-4 text-right">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => openConfirmDelete(session.id)}
                        className="text-red-500 hover:text-red-700 transition-all duration-200 p-2 rounded-full bg-red-50 hover:bg-red-100"
                      >
                        <FaTrash size={16} />
                      </motion.button>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
        </motion.div>
      )}
    </div>
  );
};

export default ReserveTimes;