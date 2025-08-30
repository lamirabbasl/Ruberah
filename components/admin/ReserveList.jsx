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
  getSessionsById,
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
  const [loadingGroups, setLoadingGroups] = useState({}); // Map of date to loading state
  const [exporting, setExporting] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchType, setSearchType] = useState("name");
  const [sessionDate, setSessionDate] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isLastPage, setIsLastPage] = useState(false);

  useEffect(() => {
    fetchReservations(currentPage, searchTerm, searchType, sessionDate);
    fetchSessions();
  }, [currentPage, searchTerm, searchType, sessionDate]);

  useEffect(() => {
    const grouped = reservations.reduce((acc, reservation) => {
      const session = sessions.find((s) => s.id === reservation.session);
      const date = session
        ? new Date(session.date_time).toLocaleDateString("fa-IR")
        : "Unknown Date";
      if (!acc[date]) {
        acc[date] = [];
      }
      acc[date].push(reservation);
      return acc;
    }, {});
    setGroupedReservations(grouped);

    setExpandedDates((prev) => {
      const updatedExpanded = { ...prev };
      Object.keys(grouped).forEach((date) => {
        if (!(date in updatedExpanded)) {
          updatedExpanded[date] = false;
        }
      });
      Object.keys(updatedExpanded).forEach((date) => {
        if (!(date in grouped)) {
          delete updatedExpanded[date];
        }
      });
      return updatedExpanded;
    });
  }, [reservations, sessions]);

  const fetchReservations = async (page = 1, searchTerm = "", searchType = "name", sessionDate = "") => {
    setLoadingGroups((prev) => {
      const newLoading = {};
      Object.keys(groupedReservations).forEach((date) => {
        newLoading[date] = true; // Set all groups to loading during fetch
      });
      return newLoading;
    });
    try {
      const query = new URLSearchParams({ page });
      if (searchTerm) {
        query.append(searchType, searchTerm);
      }
      if (sessionDate) {
        query.append("session_date", sessionDate);
      }
      const response = await getReservations(page, query.toString());
      const data = response.results || [];
      const reservationsWithSession = await Promise.all(
        data.map(async (reservation) => {
          try {
            const session = await getSessionsById(reservation.session);
            return { ...reservation, sessionData: session };
          } catch (err) {
            console.error(`Error fetching session ${reservation.session}:`, err);
            return { ...reservation, sessionData: null };
          }
        })
      );
      reservationsWithSession.sort((a, b) => {
        const dateA = a.sessionData ? new Date(a.sessionData.date_time) : new Date(0);
        const dateB = b.sessionData ? new Date(b.sessionData.date_time) : new Date(0);
        return dateA - dateB;
      });
      setReservations(reservationsWithSession);
      setIsLastPage(response.is_last_page);
    } catch (err) {
      toast.error(err.response?.data?.message || "خطا در دریافت رزروها");
    } finally {
      setLoadingGroups({});
    }
  };

  const fetchSessions = async () => {
    try {
      const data = await getSessions();
      setSessions(data);
    } catch (err) {
      toast.error(err.response?.data?.message || "خطا در دریافت جلسات");
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
      const errorMessage = err.response?.data?.message || "خطا در دریافت به اکسل";
      toast.error(errorMessage);
    } finally {
      setExporting(false);
    }
  };

  const handleToggleActivation = async (id, date) => {
    setLoadingGroups((prev) => ({ ...prev, [date]: true }));
    try {
      await toggleReservationActivation(id);
      toast.success("وضعیت رزرو با موفقیت تغییر کرد.");
      await fetchReservations(currentPage, searchTerm, searchType, sessionDate);
    } catch (err) {
      toast.error(err.response?.data?.message || "خطا در تغییر وضعیت فعال‌سازی");
      setLoadingGroups((prev) => ({ ...prev, [date]: false }));
    }
  };

  const handleDelete = async () => {
    if (itemToDelete) {
      const reservation = reservations.find((r) => r.id === itemToDelete);
      const session = sessions.find((s) => s.id === reservation.session);
      const date = session
        ? new Date(session.date_time).toLocaleDateString("fa-IR")
        : "Unknown Date";
      setLoadingGroups((prev) => ({ ...prev, [date]: true }));
      try {
        await deleteReservation(itemToDelete);
        toast.success("رزرو با موفقیت حذف شد.");
        setReservations((prev) => prev.filter((item) => item.id !== itemToDelete));
        await fetchReservations(currentPage, searchTerm, searchType, sessionDate);
      } catch (err) {
        toast.error(err.response?.data?.message || "خطا در حذف رزرو");
        setLoadingGroups((prev) => ({ ...prev, [date]: false }));
      } finally {
        setShowConfirmDelete(false);
        setItemToDelete(null);
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

    const session = sessions.find((s) => s.id === newReservation.session);
    const date = session
      ? new Date(session.date_time).toLocaleDateString("fa-IR")
      : "Unknown Date";
    setLoadingGroups((prev) => ({ ...prev, [date]: true }));
    try {
      await createReservation({
        ...newReservation,
        watched_video: true,
        answered_correctly: true,
      });
      toast.success("رزرو با موفقیت انجام شد.");
      setNewReservation({ name: "", email: "", phone: "", session: "" });
      setShowAddForm(false);
      await fetchReservations(currentPage, searchTerm, searchType, sessionDate);
    } catch (err) {
      toast.error(err.response?.data?.message || "خطا در افزودن رزرو");
      setLoadingGroups((prev) => ({ ...prev, [date]: false }));
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

      <SearchBar
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        searchType={searchType}
        setSearchType={setSearchType}
        sessionDate={sessionDate}
        setSessionDate={setSessionDate}
      />

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

      {Object.keys(groupedReservations).length === 0 && Object.keys(loadingGroups).length === 0 ? (
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
              handleToggleActivation={(id) => handleToggleActivation(id, date)}
              openConfirmDelete={openConfirmDelete}
              loading={loadingGroups[date] || false}
            />
          ))}
        </div>
      )}
      
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