"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { createReservation } from "@/lib/api/api";

export default function SessionSignup() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [sessionId, setSessionId] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
  });

  useEffect(() => {
    // Get selected session from localStorage
    const selectedSession = localStorage.getItem("selectedSession");
    if (selectedSession) {
      const session = JSON.parse(selectedSession);
      setSessionId(Number(session.id)); // Ensure it's a number
    } else {
      // If no session is selected, redirect back to sessions page
      toast.error("هیچ جلسه‌ای انتخاب نشده است.");
      router.push("/enroll/sessions");
    }
  }, [router]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Structure data exactly as required by the API
      const reservationData = {
        watched_video: true,
        answered_correctly: true,
        session: sessionId,
        name: formData.name,
        phone: formData.phone
      };

      // Submit to API
      const response = await createReservation(reservationData);

      // Check for already reserved message
      if (response.message === "You have already reserved a seat for this session.") {
        toast.error("شما قبلاً برای این جلسه ثبت نام کرده‌اید.");
        return;
      }

      // Show success toast
      const successMessage = response.data?.message || "رزرو با موفقیت ثبت شد.";
      toast.success(successMessage);

      // Store form data and reservation code in localStorage
      localStorage.setItem("formData", JSON.stringify(formData));
      localStorage.setItem("reservationCode", response.code);

      // Navigate to detail page
      router.push("/enroll/session-detail");
    } catch (err) {
      console.error("Error creating reservation:", err);
      const errorMessage = err.response?.data?.message || err.message || "خطا در ثبت نام";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      dir="rtl"
      className="min-h-screen bg-gradient-to-b from-primary to-gray-600 text-black font-mitra pt-30 p-6"
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
        className="text-xl sm:text-3xl font-bold text-center text-white mb-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        ثبت نام اولیه
      </motion.h1>

      <form
        onSubmit={handleSubmit}
        className="max-w-xl mx-auto bg-white rounded-2xl p-6 sm:p-8 shadow-2xl space-y-4"
      >
        <div>
          <label className="block text-lg font-bold text-gray-700 mb-1">
            نام و نام خانوادگی
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-lg font-bold text-gray-700 mb-1">
            شماره تماس
          </label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            pattern="^09\d{9}$"
            placeholder="09123456789"
          />
        </div>

        <div className="pt-4">
          <button
            type="submit"
            disabled={loading}
            className={`w-full ${
              loading ? "bg-gray-500" : "bg-blue-700 hover:bg-blue-800"
            } text-white py-2 rounded-lg transition flex items-center justify-center`}
          >
            {loading ? (
              <>
                <span className="ml-2">در حال ثبت...</span>
                <div className="animate-spin rounded-full h-5 w-5 border-2 border-white"></div>
              </>
            ) : (
              "ثبت اطلاعات"
            )}
          </button>
        </div>
      </form>
    </div>
  );
}