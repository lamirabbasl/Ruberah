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
  const [expandedDates, setExpandedDates] = useState({}); // Track expanded/collapsed dates
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
      const date = new Date(reservation.reserved_at).toLocaleDateString(
        "fa-IR"
      );
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
      setError(err.message || "Error fetching reservations");
    } finally {
      setLoading(false);
    }
  };

  const fetchSessions = async () => {
    try {
      const data = await getSessions();
      setSessions(data);
    } catch (err) {
      setError(err.message || "Error fetching sessions");
    }
  };

  const handleToggleActivation = async (id) => {
    setLoading(true);
    setError(null);
    try {
      await toggleReservationActivation(id);
      await fetchReservations();
    } catch (err) {
      setError(err.message || "Error toggling activation");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (itemToDelete) {
      setLoading(true);
      setError(null);
      try {
        await deleteReservation(itemToDelete); // Call the API to delete the reservation
        // Remove item locally
        setReservations(
          reservations.filter((item) => item.id !== itemToDelete)
        );
      } catch (err) {
        setError(err.message || "Error deleting reservation");
      } finally {
        // Refresh reservations list to sync frontend with backend state
        await fetchReservations();
        setShowConfirmDelete(false); // Close the confirmation dialog regardless of success or error
        setItemToDelete(null); // Reset the item to delete
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
      alert("لطفاً تمام فیلدها را پر کنید.");
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
      setError(err.message || "Error adding reservation");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="text-right font-noto p-4 sm:p-6 bg-white min-h-screen"
      dir="rtl"
    >
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 sm:mb-8 space-y-4 sm:space-y-0">
        <h1 className="text-2xl sm:text-3xl font-bold text-black">رزروها</h1>
      </div>
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 sm:mb-8 space-y-4 sm:space-y-0">
        <input
          type="text"
          placeholder="جستجو بر اساس کد یا نام"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border rounded px-3 py-2 w-full text-right"
        />
        <button
          onClick={() => setShowAddForm(true)}
          className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded flex items-center gap-2 w-full sm:w-auto"
        >
          <FaPlus className="w-5 h-5" />
          افزودن رزرو
        </button>
      </div>

      {/* Confirmation Dialog for Deletion */}
      <AnimatePresence>
        {showConfirmDelete && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50 p-4"
          >
            <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-2xl relative border border-gray-300">
              <h2 className="text-lg font-semibold mb-4 text-right text-gray-800">
                آیا مطمئن هستید که می‌خواهید این رزرو را حذف کنید؟
              </h2>
              <div className="flex justify-between mt-4">
                <button
                  onClick={closeConfirmDelete}
                  className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-md"
                >
                  لغو
                </button>
                <button
                  onClick={handleDelete}
                  className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-md"
                >
                  حذف
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showAddForm && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50 p-4"
          >
            <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-2xl relative border border-gray-300">
              <h2 className="text-lg sm:text-2xl font-semibold mb-4 sm:mb-6 text-right text-gray-800">
                افزودن رزرو جدید
              </h2>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2 text-right">
                  نام و نام خانوادگی:
                </label>
                <input
                  type="text"
                  value={newReservation.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  className="appearance-none border border-gray-300 text-right rounded-md w-full py-2 sm:py-3 px-3 sm:px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-green-500 bg-gray-50 transition-all duration-200"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2 text-right">
                  ایمیل:
                </label>
                <input
                  type="email"
                  value={newReservation.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  className="appearance-none border border-gray-300 text-right rounded-md w-full py-2 sm:py-3 px-3 sm:px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-green-500 bg-gray-50 transition-all duration-200"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2 text-right">
                  تلفن:
                </label>
                <input
                  type="text"
                  value={newReservation.phone}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                  className="appearance-none border border-gray-300 text-right rounded-md w-full py-2 sm:py-3 px-3 sm:px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-green-500 bg-gray-50 transition-all duration-200"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2 text-right">
                  جلسه:
                </label>
                <select
                  value={newReservation.session}
                  onChange={(e) => handleInputChange("session", e.target.value)}
                  className="appearance-none border border-gray-300 text-right rounded-md w-full py-2 sm:py-3 px-3 sm:px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-green-500 bg-gray-50 transition-all duration-200"
                >
                  <option value="">انتخاب جلسه</option>
                  {sessions.map((session) => (
                    <option key={session.id} value={session.id}>
                      {session.title} -{" "}
                      {new Date(session.date_time).toLocaleString("fa-IR")}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex flex-col sm:flex-row justify-between space-y-3 sm:space-y-0 sm:space-x-4 mt-4">
                <button
                  onClick={() => setShowAddForm(false)}
                  className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 sm:py-3 px-4 sm:px-6 rounded-md focus:outline-none shadow-md hover:shadow-lg transition-all duration-200 z-10 w-full sm:w-auto"
                >
                  لغو
                </button>
                <button
                  onClick={handleAddReservation}
                  className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 sm:py-3 px-4 sm:px-6 rounded-md shadow-md hover:shadow-lg transition-all duration-200 z-10 w-full sm:w-auto"
                >
                  افزودن
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {loading && <p>در حال بارگذاری...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {Object.keys(groupedReservations).length === 0 ? (
        <p className="text-gray-600">هیچ رزروی ثبت نشده است</p>
      ) : (
        Object.entries(groupedReservations).map(
          ([date, reservationsForDate]) => (
            <div key={date} className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-semibold">{date}</h3>
                <button
                  onClick={() =>
                    setExpandedDates((prev) => ({
                      ...prev,
                      [date]: !prev[date],
                    }))
                  }
                  className="text-blue-600 hover:text-blue-800 focus:outline-none"
                  aria-label={expandedDates[date] ? "Collapse" : "Expand"}
                >
                  {expandedDates[date] ? "▲" : "▼"}
                </button>
              </div>
              {expandedDates[date] && (
                <div className="overflow-x-auto">
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
                        <th scope="col" className="relative px-6 py-3">
                          <span className="sr-only">حذف</span>
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {reservationsForDate.map((item) => (
                        <tr key={item.id}>
                          <td className="px-6 py-4 whitespace-nowrap text-right">
                            <input
                              type="checkbox"
                              checked={item.code_activated}
                              onChange={() => handleToggleActivation(item.id)}
                              className="form-checkbox h-5 w-5 text-blue-600"
                            />
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right">
                            {item.registration_code}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right">
                            {item.name}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right">
                            {item.email}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right">
                            {new Date(item.reserved_at).toLocaleString("fa-IR")}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-left">
                            <button
                              onClick={() => openConfirmDelete(item.id)}
                              className="text-red-500 hover:text-red-700 focus:outline-none"
                            >
                              <FaTrash />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )
        )
      )}
    </div>
  );
};

export default ReserveList;
