"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { getSessions } from "@/lib/api/api";

export default function SessionsPage() {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedId, setSelectedId] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const router = useRouter();

  useEffect(() => {
    async function fetchSessions() {
      try {
        const data = await getSessions();
        setSessions(data);
        setLoading(false);
      } catch (err) {
        setError("خطا در دریافت جلسات");
        setLoading(false);
      }
    }

    fetchSessions();
  }, []);

  const formatDateTime = (dateTimeStr) => {
    const date = new Date(dateTimeStr);
    return {
      date: date.toLocaleDateString("fa-IR", { year: "numeric", month: "long", day: "numeric" }),
      time: date.toLocaleTimeString("fa-IR", { hour: "2-digit", minute: "2-digit" }),
    };
  };

  const handleSelect = (session) => {
    if (session.available_slots === 0) {
      return;
    }
    setSelectedId(session.id);
  };

  const handleProceed = () => {
    setShowConfirm(true);
  };

  const closeConfirm = () => {
    setShowConfirm(false);
  };

  const confirmAndRedirect = () => {
    const selectedSession = sessions.find((s) => s.id === selectedId);
    localStorage.setItem("selectedSession", JSON.stringify(selectedSession));
    router.push("/enroll/session-signup");
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.95 },
    visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.4, ease: "easeOut" } },
  };

  const modalVariants = {
    hidden: { opacity: 0, scale: 0.85 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.3, ease: "easeOut" } },
    exit: { opacity: 0, scale: 0.85, transition: { duration: 0.2 } },
  };

  const buttonVariants = {
    hover: { scale: 1.05, transition: { duration: 0.2 } },
    tap: { scale: 0.95 },
  };

  if (loading) {
    return (
      <div dir="rtl" className="min-h-screen flex items-center justify-center font-sans bg-gradient-to-b from-gray-900 to-gray-800 pt-48">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-12 h-12 border-4 border-t-indigo-500 border-gray-600 rounded-full"
        ></motion.div>
      </div>
    );
  }

  if (error) {
    return (
      <div dir="rtl" className="min-h-screen flex items-center justify-center font-sans bg-gradient-to-b from-gray-900 to-gray-800 pt-48">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-red-950 text-red-400 p-6 rounded-2xl shadow-lg max-w-md w-full text-center"
        >
          <p className="text-lg font-medium">{error}</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div dir="rtl" className="min-h-screen p-6 font-mitra bg-gradient-to-b from-primary to-gray-600 pt-30 ">
      <motion.h1
        className="text-4xl text-center mb-8 text-white tracking-tight"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        انتخاب جلسه معارفه
      </motion.h1>

      <div className="max-w-4xl mx-auto hidden sm:grid sm:grid-cols-5 gap-4  text-sm font-semibold p-4 mb-4 bg-gray-200 text-black border border-gray-700 rounded-2xl shadow-sm">
        <div>🗓 تاریخ</div>
        <div>⏰ زمان</div>
        <div>📍 مکان</div>
        <div>👥 ظرفیت کل</div>
        <div>✅ ظرفیت باقیمانده</div>
      </div>

      <div className="max-w-4xl mx-auto space-y-4">
        <AnimatePresence>
          {sessions.map((s) => {
            const isFull = s.available_slots === 0;
            const isSelected = selectedId === s.id;
            const { date, time } = formatDateTime(s.date_time);

            return (
              <motion.div
                key={s.id}
                variants={cardVariants}
                initial="hidden"
                animate="visible"
                className={`rounded-2xl p-4 sm:p-6 transition-all  duration-300 bg-gray-200 border-4 shadow-lg ${
                  isFull
                    ? "cursor-not-allowed opacity-60"
                    : "cursor-pointer hover:shadow-xl hover:bg-gray-300"
                } ${
                  isSelected && !isFull
                    ? "border-secondery"
                    : "border-gray-300"
                }`}
                onClick={() => handleSelect(s)}
                whileHover={!isFull ? { scale: 1.02 } : {}}
              >
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 sm:gap-4 text-lg sm:text-xl text-black">
                  <div className="flex items-center sm:block gap-1">
                    <span className="text-gray-500 sm:hidden">🗓 تاریخ:</span>
                    <span>{date}</span>
                  </div>
                  <div className="flex items-center sm:block gap-1">
                    <span className="text-gray-500 sm:hidden">⏰ زمان:</span>
                    <span>{time}</span>
                  </div>
                  <div className="flex items-center sm:block gap-1">
                    <span className="text-gray-500 sm:hidden">📍 مکان:</span>
                    <span className="truncate">{s.address}</span>
                  </div>
                  <div className="flex items-center sm:block gap-1">
                    <span className="text-gray-500 sm:hidden">👥 ظرفیت کل:</span>
                    <span >{s.capacity}</span>
                  </div>
                  <div className="flex items-center sm:block gap-1">
                    <span className="text-gray-500 sm:hidden">✅ ظرفیت باقیمانده:</span>
                    <span className={isFull ? "text-red-400" : "text-green-400 bg-gray-800 rounded-full px-2 py-1"}>
                      {isFull ? "ظرفیت تکمیل" : s.available_slots}
                    </span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {selectedId && !showConfirm && (
          <motion.div
            className="fixed bottom-6 left-0 right-0 flex justify-center"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 40 }}
            transition={{ duration: 0.3 }}
          >
            <motion.button
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
              onClick={handleProceed}
              className="bg-indigo-600 text-white px-8 py-3 rounded-lg shadow-md hover:bg-indigo-700 transition-all duration-200 text-2xl font-medium"
            >
              ثبت جلسه انتخابی
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showConfirm && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="bg-gray-950 border border-gray-700 rounded-2xl p-6 sm:p-8 w-full max-w-md text-center shadow-2xl text-white"
            >
              <h2 className="text-lg sm:text-2xl  mb-4 tracking-tight">
                آیا مطمئن هستید که این جلسه را انتخاب می‌کنید؟
              </h2>
              <p className="text-lg text-gray-300 mb-6">
                در صورت تایید، شما موظفید در جلسه حضور پیدا کنید.
              </p>
              <div className="flex justify-center gap-3">
                <motion.button
                  variants={buttonVariants}
                  whileHover="hover"
                  whileTap="tap"
                  onClick={confirmAndRedirect}
                  className="bg-green-600 text-white px-4 text-xl py-1 rounded-lg shadow-md hover:bg-green-700 transition-all duration-200 text-sm "
                >
                  بله، مطمئنم
                </motion.button>
                <motion.button
                  variants={buttonVariants}
                  whileHover="hover"
                  whileTap="tap"
                  onClick={closeConfirm}
                  className="bg-red-600 text-white px-4 py-1 text-xl rounded-lg shadow-md hover:bg-red-700 transition-all duration-200 text-sm "
                >
                  خیر
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}