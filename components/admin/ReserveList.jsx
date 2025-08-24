"use client";

import React, { useState, useEffect } from "react";
import { FaPlus } from "react-icons/fa";
import { motion } from "framer-motion";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import {
  getReservations,
  toggleReservationActivation,
  createReservation,
  deleteReservation,
  getSessions,
  getReservesExport,
} from "@/lib/api/api";

import SearchBar from "@/components/admin/reserveList/SearchBar";
import AddReservationModal from "@/components/admin/reserveList/AddReservationModal";
import ConfirmDeleteModal from "@/components/admin/reserveList/ConfirmDeleteModal";
import ReservationGroup from "@/components/admin/reserveList/ReservationGroup";

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
  const [exporting, setExporting] = useState(false); // Track export loading state
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isLastPage, setIsLastPage] = useState(false);

  useEffect(() => {
    fetchReservations(currentPage);
    fetchSessions();
  }, [currentPage]);

  useEffect(() => {
    const filteredReservations = reservations.filter((reservation) => {
      const term = searchTerm.toLowerCase();
      return (
        reservation.registration_code.toLowerCase().includes(term) ||
        reservation.name.toLowerCase().includes(term) ||
        reservation.phone.toLowerCase().includes(term)
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

    const initialExpanded = {};
    Object.keys(grouped).forEach((date) => {
      initialExpanded[date] = false;
    });
    setExpandedDates(initialExpanded);
  }, [reservations, searchTerm]);

  const fetchReservations = async (page = 1) => {
    setLoading(true);
    try {
      const response = await getReservations(page);
      const data = response.results || [];
      data.sort((a, b) => new Date(a.reserved_at) - new Date(b.reserved_at));
      setReservations(data);
      setIsLastPage(response.is_last_page);
    } catch (err) {
      toast.error(err.response?.data?.message || err.message || "خطا در دریافت رزروها");
    } finally {
      setLoading(false);
    }
  };

  const fetchSessions = async () => {
    try {
      const data = await getSessions();
      setSessions(data);
    } catch (err) {
      toast.error(err.response?.data?.message || err.message || "خطا در دریافت جلسات");
    }
  };

  const handleExportExcel = async () => {
    setExporting(true);
    try {
      const response = await getReservesExport();
      if (!(response instanceof Blob)) {
        throw new Error("دریافت پاسخ نامعتبر از سرور");
      }
      const blob = new Blob([response], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "reservations_export.xlsx";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
      toast.success("فایل اکسل با موفقیت دریافت شد.");
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || "خطا در دریافت به اکسل";
      toast.error(errorMessage);
    } finally {
      setExporting(false);
    }
  };

  const handleToggleActivation = async (id) => {
    setLoading(true);
    try {
      await toggleReservationActivation(id);
      toast.success("وضعیت رزرو با موفقیت تغییر کرد.");
      await fetchReservations(currentPage);
    } catch (err) {
      toast.error(err.response?.data?.message || err.message || "خطا در تغییر وضعیت فعال‌سازی");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (itemToDelete) {
      setLoading(true);
      try {
        await deleteReservation(itemToDelete);
        toast.success("رزرو با موفقیت حذف شد.");
        setReservations((prev) => prev.filter((item) => item.id !== itemToDelete));
        await fetchReservations(currentPage);
      } catch (err) {
        toast.error(err.response?.data?.message || err.message || "خطا در حذف رزرو");
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

  const handleAddReservation = async () => {
    if (
      !newReservation.name.trim() ||
      !newReservation.email.trim() ||
      !newReservation.phone.trim() ||
      !newReservation.session
    ) {
      toast.error("لطفاً تمام فیلدها را پر کنید.");
      return;
    }

    setLoading(true);
    try {
      await createReservation({
        ...newReservation,
        watched_video: true,
        answered_correctly: true,
      });
      toast.success("رزرو با موفقیت انجام شد.");
      setNewReservation({ name: "", email: "", phone: "", session: "" });
      setShowAddForm(false);
      await fetchReservations(currentPage);
    } catch (err) {
      toast.error(err.response?.data?.message || err.message || "خطا در افزودن رزرو");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="text-right font-mitra p-6 bg-gray-50 min-h-screen" dir="rtl">
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
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">رزروها</h1>
        <div className="flex gap-4 w-full sm:w-auto">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowAddForm(true)}
            className="bg-indigo-600 text-white px-5 py-2.5 rounded-lg shadow-md hover:bg-indigo-700 transition-colors flex items-center gap-2 flex-1 sm:flex-none"
          >
            <FaPlus className="w-4 h-4" />
            افزودن رزرو
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleExportExcel}
            disabled={exporting}
            className={`bg-green-600 text-white px-5 py-2.5 rounded-lg shadow-md hover:bg-green-700 transition-colors flex items-center gap-2 flex-1 sm:flex-none ${exporting ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {exporting ? "در حال دریافت" : "خروجی اکسل"}
          </motion.button>
        </div>
      </div>

      <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />

      <AddReservationModal
        showAddForm={showAddForm}
        setShowAddForm={setShowAddForm}
        newReservation={newReservation}
        setNewReservation={setNewReservation}
        sessions={sessions}
        handleAddReservation={handleAddReservation}
      />

      <ConfirmDeleteModal
        showConfirmDelete={showConfirmDelete}
        closeConfirmDelete={() => {
          setShowConfirmDelete(false);
          setItemToDelete(null);
        }}
        handleDelete={handleDelete}
      />

      {loading && <p className="text-center text-gray-600">در حال بارگذاری...</p>}

      {Object.keys(groupedReservations).length === 0 ? (
        <p className="text-center text-gray-600">هیچ رزروی ثبت نشده است</p>
      ) : (
        <div className="space-y-6">
          {Object.entries(groupedReservations).map(([date, reservationsForDate]) => (
            <ReservationGroup
              key={date}
              date={date}
              reservationsForDate={reservationsForDate}
              expanded={expandedDates[date]}
              setExpandedDates={setExpandedDates}
              handleToggleActivation={handleToggleActivation}
              openConfirmDelete={openConfirmDelete}
            />
          ))}
        </div>
      )}

      {/* Pagination Controls */}
      <div className="flex justify-center items-center gap-4 mt-8">
        <button
          disabled={currentPage === 1}
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
        >
          قبلی
        </button>
        <span>صفحه {currentPage}</span>
        <button
          disabled={isLastPage}
          onClick={() => setCurrentPage((prev) => prev + 1)}
          className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
        >
          بعدی
        </button>
      </div>
    </div>
  );
};

export default ReserveList;