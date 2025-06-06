"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { createReservation } from "@/lib/api/api";

export default function SessionSignup() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [sessionId, setSessionId] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
  });

  useEffect(() => {
    // Get selected session from localStorage
    const selectedSession = localStorage.getItem("selectedSession");
    if (selectedSession) {
      const session = JSON.parse(selectedSession);
      setSessionId(Number(session.id)); // Ensure it's a number
    } else {
      // If no session is selected, redirect back to sessions page
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
    setError(null);

    try {
      // Structure data exactly as required by the API
      const reservationData = {
        watched_video: true,
        answered_correctly: true,
        session: sessionId,
        name: formData.name,
        email: formData.email,
        phone: formData.phone
      };

      // Submit to API
      const response = await createReservation(reservationData);

      // Check for already reserved message
      if (response.message === "You have already reserved a seat for this session.") {
        setError("شما قبلاً برای این جلسه ثبت نام کرده‌اید.");
        return;
      }

      // Store form data and reservation code in localStorage
      localStorage.setItem("formData", JSON.stringify(formData));
      localStorage.setItem("reservationCode", response.code);

      // Navigate to detail page
      router.push("/enroll/session-detail");
    } catch (err) {
      if (err.response?.status === 400) {
        setError("لطفاً تمامی اطلاعات را به درستی وارد کنید.");
      } else {
        setError(err.message || "خطا در ثبت رزرو. لطفا دوباره تلاش کنید.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      dir="rtl"
      className="min-h-screen bg-gradient-to-b from-primary to-gray-600 text-black font-mitra pt-30 p-6"
    >
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

        <div>
          <label className="block text-lg font-bold text-gray-700 mb-1">
            ایمیل
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {error && (
          <div className="text-red-500 text-center font-bold">{error}</div>
        )}

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
