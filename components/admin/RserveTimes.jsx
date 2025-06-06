"use client";

import React, { useState, useEffect } from "react";
import { FaTrash, FaPlus } from "react-icons/fa";
import { AnimatePresence, motion } from "framer-motion";
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
      setError(err.message || "خطا در دریافت جلسات");
    } finally {
      setLoading(false);
    }
  };

  const handleAddItem = () => {
    setShowAddForm(true);
  };

  const handleSaveNewItem = async (newItem) => {
    setLoading(true);
    setError(null);
    try {
      await addSession(newItem);
      setShowAddForm(false);
      await fetchSessions();
    } catch (err) {
      setError(err.message || "خطا در افزودن جلسه");
    } finally {
      setLoading(false);
    }
  };

  const handleCancelAdd = () => {
    setShowAddForm(false);
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
      setShowConfirmDelete(false);
      setSessionToDelete(null);
      await fetchSessions();
    } catch (err) {
      setError(err.message || "خطا در حذف جلسه");
    } finally {
      setLoading(false);
    }
  };

  const modalVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.3 } },
    exit: { opacity: 0, scale: 0.8, transition: { duration: 0.2 } },
  };

  const rowVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen font-sans text-right" dir="rtl">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-8 space-y-4 sm:space-y-0">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">جلسات رزرو</h1>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleAddItem}
          className="bg-indigo-600 text-white px-5 py-2.5 rounded-lg shadow-md hover:bg-indigo-700 transition-colors flex items-center gap-2 w-full sm:w-auto"
        >
          <FaPlus className="w-4 h-4" />
          افزودن جلسه
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
            className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4"
          >
            <motion.div
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="bg-white rounded-xl p-6 sm:p-8 w-full max-w-sm relative"
            >
              <button
                onClick={closeConfirmDelete}
                className="absolute top-4 left-4 text-gray-500 hover:text-gray-700 transition"
                aria-label="بستن تایید حذف"
              >
                <FaTrash size={20} />
              </button>
              <p className="mb-6 text-red-600 font-semibold text-center text-right">
                آیا مطمئن هستید که می‌خواهید این جلسه را حذف کنید؟
              </p>
              {error && <p className="text-red-500 text-sm mb-4 text-right">{error}</p>}
              <div className="flex justify-end space-x-3">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={closeConfirmDelete}
                  className="px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-100 transition"
                >
                  لغو
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleRemoveItem}
                  className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition"
                >
                  حذف
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {loading && <p className="text-center text-gray-600">در حال بارگذاری...</p>}
      {error && <p className="text-center text-red-500">{error}</p>}

      {sessions.length === 0 ? (
        <p className="text-center text-gray-600">هیچ جلسه‌ای وجود ندارد</p>
      ) : (
        <motion.div
          initial="hidden"
          animate="visible"
          variants={rowVariants}
          className="overflow-x-auto border border-gray-200 rounded-xl shadow-md"
        >
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  عنوان
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  زمان معارفه
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  آدرس
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  ظرفیت
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  حذف
                </th>
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
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-700">
                      {session.title}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-700">
                      {new Date(session.date_time).toLocaleString("fa-IR")}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-700">
                      {session.address}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-700">
                      {session.capacity}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => openConfirmDelete(session.id)}
                        className="text-red-500 hover:text-red-700 focus:outline-none"
                        aria-label={`حذف جلسه ${session.title}`}
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