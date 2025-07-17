"use client";

import React, { useState, useEffect } from "react";
import { FaTrash, FaPlus } from "react-icons/fa";
import { AnimatePresence, motion } from "framer-motion";
import {
  getReservations,
  toggleReservationActivation,
  createReservation,
  deleteReservation,
  getSessions,
} from "@/lib/api/api";

const ReserveList = () => {
  const [reservations, setReservations] = useState([]);
  const [groupedReservations, setGroupedReservations] = useState({});
  const [expandedDates, setExpandedDates] = useState({});
  const [showAddForm, setShowAddForm] = useState(false);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [sessions, setSessions] = useState([]);
  const [newReservation, setNewReservation] = useState({
    name: "",
    email: "",
    phone: "",
    session: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchReservations();
    fetchSessions();
  }, []);

  useEffect(() => {
    const filteredReservations = reservations.filter((reservation) => {
      const term = searchTerm.toLowerCase();
      return (
        reservation.registration_code.toLowerCase().includes(term) ||
        reservation.name.toLowerCase().includes(term)
      );
    });

    const grouped = filteredReservations.reduce((acc, reservation) => {
      const date = new Date(reservation.reserved_at).toLocaleDateString("fa-IR");
      if (!acc[date]) {
        acc[date] = [];
      }
      acc[date].push(reservation);
      return acc;
    }, {});
    setGroupedReservations(grouped);

    // Initialize all dates as collapsed by default
    const initialExpanded = {};
    Object.keys(grouped).forEach((date) => {
      initialExpanded[date] = false;
    });
    setExpandedDates(initialExpanded);
  }, [reservations, searchTerm]);

  const fetchReservations = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getReservations();
      data.sort((a, b) => new Date(a.reserved_at) - new Date(b.reserved_at));
      setReservations(data);
    } catch (err) {
      setError(err.message || "خطا در دریافت رزروها");
    } finally {
      setLoading(false);
    }
  };

  const fetchSessions = async () => {
    try {
      const data = await getSessions();
      setSessions(data);
    } catch (err) {
      setError(err.message || "خطا در دریافت جلسات");
    }
  };

  const handleToggleActivation = async (id) => {
    setLoading(true);
    setError(null);
    try {
      await toggleReservationActivation(id);
      await fetchReservations();
    } catch (err) {
      setError(err.message || "خطا در تغییر وضعیت فعال‌سازی");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (itemToDelete) {
      setLoading(true);
      setError(null);
      try {
        await deleteReservation(itemToDelete);
        setReservations(reservations.filter((item) => item.id !== itemToDelete));
        await fetchReservations();
        window.location.reload(); // Refresh the page
      } catch (err) {
        window.location.reload(); // Refresh the page
        setError(err.message || "خطا در حذف رزرو");
      } finally {
        setShowConfirmDelete(false);
        setItemToDelete(null);
        setLoading(false);
      }
    }
  };

  const openConfirmDelete = (id) => {
    setItemToDelete(id);
    setShowConfirmDelete(true);
  };

  const closeConfirmDelete = () => {
    setShowConfirmDelete(false);
    setItemToDelete(null);
  };

  const handleInputChange = (field, value) => {
    setNewReservation((prev) => ({ ...prev, [field]: value }));
  };

  const handleAddReservation = async () => {
    if (
      !newReservation.name.trim() ||
      !newReservation.email.trim() ||
      !newReservation.phone.trim() ||
      !newReservation.session
    ) {
      setError("لطفاً تمام فیلدها را پر کنید.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      await createReservation({
        ...newReservation,
        watched_video: true,
        answered_correctly: true,
      });
      setNewReservation({ name: "", email: "", phone: "", session: "" });
      setShowAddForm(false);
      await fetchReservations();
    } catch (err) {
      setError(err.message || "خطا در افزودن رزرو");
    } finally {
      setLoading(false);
    }
  };

  const modalVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.3 } },
    exit: { opacity: 0, scale: 0.8, transition: { duration: 0.2 } },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
  };

  return (
    <div className="text-right font-mitra p-6 bg-gray-50 min-h-screen" dir="rtl">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-8 space-y-4 sm:space-y-0">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">رزروها</h1>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowAddForm(true)}
          className="bg-indigo-600 text-white px-5 py-2.5 rounded-lg shadow-md hover:bg-indigo-700 transition-colors flex items-center gap-2 w-full sm:w-auto"
        >
          <FaPlus className="w-4 h-4" />
          افزودن رزرو
        </motion.button>
      </div>
      <div className="mb-6">
        <input
          type="text"
          placeholder="جستجو بر اساس کد یا نام"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full max-w-md border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition text-right"
        />
      </div>

      <AnimatePresence>
        {showAddForm && (
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
              className="bg-white rounded-xl p-6 sm:p-8 w-full max-w-md shadow-2xl relative"
            >
              <button
                onClick={() => setShowAddForm(false)}
                className="absolute top-4 left-4 text-gray-500 hover:text-gray-700 transition"
                aria-label="بستن فرم افزودن رزرو"
              >
                <FaTrash size={20} />
              </button>
              <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-6 text-right">
                افزودن رزرو جدید
              </h2>
              <div className="mb-5">
                <label className="block mb-2 text-sm font-medium text-gray-700 text-right">
                  نام و نام خانوادگی
                </label>
                <input
                  type="text"
                  value={newReservation.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition text-right"
                />
              </div>
              <div className="mb-5">
                <label className="block mb-2 text-sm font-medium text-gray-700 text-right">
                  ایمیل
                </label>
                <input
                  type="email"
                  value={newReservation.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition text-right"
                />
              </div>
              <div className="mb-5">
                <label className="block mb-2 text-sm font-medium text-gray-700 text-right">
                  تلفن
                </label>
                <input
                  type="text"
                  value={newReservation.phone}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition text-right"
                />
              </div>
              <div className="mb-5">
                <label className="block mb-2 text-sm font-medium text-gray-700 text-right">
                  جلسه
                </label>
                <select
                  value={newReservation.session}
                  onChange={(e) => handleInputChange("session", e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition text-right"
                >
                  <option value="">انتخاب جلسه</option>
                  {sessions.map((session) => (
                    <option key={session.id} value={session.id}>
                      {session.title} - {new Date(session.date_time).toLocaleString("fa-IR")}
                    </option>
                  ))}
                </select>
              </div>
              {error && <p className="text-red-500 text-sm mb-4 text-right">{error}</p>}
              <div className="flex justify-end space-x-3">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowAddForm(false)}
                  className="px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-100 transition"
                >
                  لغو
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleAddReservation}
                  className="px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition"
                >
                  افزودن
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
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
                آیا مطمئن هستید که می‌خواهید این رزرو را حذف کنید؟
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
                  onClick={handleDelete}
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

      {Object.keys(groupedReservations).length === 0 ? (
        <p className="text-center text-gray-600">هیچ رزروی ثبت نشده است</p>
      ) : (
        <div className="space-y-6">
          {Object.entries(groupedReservations).map(([date, reservationsForDate]) => (
            <motion.div
              key={date}
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              className="mb-6"
            >
             <motion.div
      className="flex items-center justify-between mb-3 bg-gray-100 rounded-lg px-4 py-3 cursor-pointer"
      whileHover={{ scale: 1.02 }}
      onClick={() =>
        setExpandedDates((prev) => ({
          ...prev,
          [date]: !prev[date],
        }))
      }
    >
      <h3 className="text-lg font-semibold text-gray-800">{date}</h3>
      <span
        className="text-indigo-600"
        aria-label={expandedDates[date] ? "جمع کردن" : "باز کردن"}
      >
        {expandedDates[date] ? "▲" : "▼"}
      </span>
    </motion.div>
              <AnimatePresence>
                {expandedDates[date] && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-x-auto border border-gray-200 rounded-xl shadow-md"
                  >
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th
                            scope="col"
                            className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            فعال‌سازی کد
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            کد
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            نام و نام خانوادگی
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            ایمیل
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
                            حذف
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {reservationsForDate.map((item) => (
                          <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                            <td className="px-6 py-4 whitespace-nowrap text-right">
                              <input
                                type="checkbox"
                                checked={item.code_activated}
                                onChange={() => handleToggleActivation(item.id)}
                                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                              />
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-700">
                              {item.registration_code}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-700">
                              {item.name}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-700">
                              {item.email}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-700">
                              {new Date(item.reserved_at).toLocaleString("fa-IR")}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right">
                              <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => openConfirmDelete(item.id)}
                                className="text-red-500 hover:text-red-700 focus:outline-none"
                                aria-label={`حذف رزرو ${item.registration_code}`}
                              >
                                <FaTrash size={16} />
                              </motion.button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ReserveList;