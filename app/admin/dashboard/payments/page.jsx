"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import {
  getBatches,
  getCourses,
  getSeasons,
  searchBatches,
  getRegistrationSummary,
  getRegistrationExport,
} from "@/lib/api/api";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import BatchSearch from "../../../../components/admin/batches/BatchSearch";
import BatchListRegistration from "@/components/admin/BatchListRegistration";

const RegistrationsBatchesTab = () => {
  const [batches, setBatches] = useState([]);
  const [courses, setCourses] = useState([]);
  const [seasons, setSeasons] = useState([]);
  const [registrationSummary, setRegistrationSummary] = useState([]);
  const [loading, setLoading] = useState(false);
  const [exporting, setExporting] = useState(false); // New state for export loading
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchBatches = useCallback(async (term = "") => {
    setLoading(true);
    setError(null);
    try {
      const data = term ? await searchBatches(term) : await getBatches();
      setBatches(data);
    } catch (err) {
      console.error("Error fetching batches:", err);
      setError("خطا در دریافت دوره‌ها. لطفا دوباره تلاش کنید.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBatches(searchTerm);
  }, [searchTerm, fetchBatches]);

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const [courseData, seasonData, summaryData] = await Promise.all([
          getCourses(),
          getSeasons(),
          getRegistrationSummary(),
        ]);
        setCourses(courseData);
        setSeasons(seasonData);
        setRegistrationSummary(summaryData);
      } catch (err) {
        console.error("Error fetching initial data:", err);
        setError("خطا در دریافت اطلاعات اولیه");
      }
    };

    fetchInitialData();
  }, []);

  // New function to handle Excel export
  const handleExportExcel = async () => {
    setExporting(true);
    setError(null);
    try {
      const response = await getRegistrationExport();
      if (!(response instanceof Blob)) {
        throw new Error("دریافت پاسخ نامعتبر از سرور");
      }
      const blob = new Blob([response], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "batches_export.xlsx";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
      toast.success("فایل اکسل با موفقیت دریافت شد.");
    } catch (err) {
      const errorMessage = err.response?.data?.message || "خطا در دریافت اکسل";
      toast.error(errorMessage);
      setError(errorMessage);
    } finally {
      setExporting(false);
    }
  };

  return (
    <div
      className="p-6 bg-gradient-to-b text-black text-right w-5/6 max-md:w-screen from-gray-50 to-gray-100 min-h-screen font-mitra"
      dir="rtl"
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
      <div className="flex flex-col sm:flex-row justify-between items-center mb-8 space-y-4 sm:space-y-0">
        <h1 className="text-4xl font-bold text-gray-900 tracking-tight">پرداخت ها</h1>
        <button
          onClick={handleExportExcel}
          disabled={exporting}
          className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
            exporting
              ? "bg-gray-400 text-white cursor-not-allowed"
              : "bg-indigo-600 text-white hover:bg-indigo-700"
          }`}
        >
          {exporting ? "در حال دریافت..." : "دریافت اکسل"}
        </button>
      </div>

      <BatchSearch searchTerm={searchTerm} onSearchChange={setSearchTerm} />

      {error && (
        <p className="text-center text-red-600 font-medium bg-red-50 p-4 rounded-lg mb-4">
          {error}
        </p>
      )}

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="w-12 h-12 border-4 border-t-indigo-600 border-gray-200 rounded-full"
          ></motion.div>
        </div>
      ) : (
        <BatchListRegistration
          batches={batches}
          courses={courses}
          seasons={seasons}
          searchTerm={searchTerm}
          registrationSummary={registrationSummary}
        />
      )}
    </div>
  );
};

export default RegistrationsBatchesTab;