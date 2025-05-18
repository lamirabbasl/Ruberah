"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

const sessions = [
  {
    id: 1,
    date: "1403/03/01",
    location: "کلاس 101",
    startTime: "10:00",
    endTime: "12:00",
    capacity: 0,
  },
  {
    id: 2,
    date: "1403/03/02",
    location: "کلاس 102",
    startTime: "14:00",
    endTime: "16:00",
    capacity: 5,
  },
  {
    id: 3,
    date: "1403/03/03",
    location: "کلاس 103",
    startTime: "16:30",
    endTime: "18:00",
    capacity: 0,
  },
  {
    id: 4,
    date: "1403/03/04",
    location: "کلاس 104",
    startTime: "08:00",
    endTime: "10:00",
    capacity: 7,
  },
  {
    id: 5,
    date: "1403/03/05",
    location: "کلاس 105",
    startTime: "18:00",
    endTime: "20:00",
    capacity: 1,
  },
];

export default function SessionsPage() {
  const [selectedId, setSelectedId] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const router = useRouter();

  const handleSelect = (session) => {
    if (session.capacity === 0) {
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
    router.push("/enroll/session-signup");
  };

  return (
    <div
      dir="rtl"
      className="min-h-screen p-6 font-mitra bg-gradient-to-b from-primary to-gray-600 pt-24"
    >
      <motion.h1
        className="text-2xl sm:text-4xl font-bold text-center mb-4 text-white"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        لیست معارفه ها
      </motion.h1>

      {/* Header - Only for larger screens */}
      <div className="max-w-3xl mx-auto hidden sm:grid sm:grid-cols-5 gap-4 text-white text-sm font-bold p-3 mb-3 border-b-2 border-gray-100">
        <div>🗓 زمان</div>
        <div>📍 مکان</div>
        <div>🕒 شروع</div>
        <div>🕒 پایان</div>
        <div>👥 ظرفیت</div>
      </div>

      {/* Sessions List */}
      <div className="max-w-3xl mx-auto space-y-2 sm:space-y-4">
        {sessions.map((s) => {
          const isFull = s.capacity === 0;
          const isSelected = selectedId === s.id;

          return (
            <motion.div
              key={s.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: s.id * 0.05 }}
              className={`rounded-xl p-3 sm:p-5 transition-all border-3 duration-300 shadow-sm bg-white ${
                isFull ? "cursor-not-allowed" : "cursor-pointer"
              } ${
                isSelected && !isFull
                  ? "border-3 border-secondery"
                  : "border border-transparent"
              }`}
              onClick={() => handleSelect(s)}
            >
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 sm:gap-4 text-xs sm:text-lg text-black">
                {/* زمان */}
                <div className="flex items-center sm:block gap-1">
                  <span className="text-gray-500 sm:hidden">🗓 زمان:</span>
                  <span>{s.date}</span>
                </div>
                {/* مکان */}
                <div className="flex items-center sm:block gap-1">
                  <span className="text-gray-500 sm:hidden">📍 مکان:</span>
                  <span>{s.location}</span>
                </div>
                {/* شروع */}
                <div className="flex items-center sm:block gap-1">
                  <span className="text-gray-500 sm:hidden">🕒 شروع:</span>
                  <span>{s.startTime}</span>
                </div>
                {/* پایان */}
                <div className="flex items-center sm:block gap-1">
                  <span className="text-gray-500 sm:hidden">🕒 پایان:</span>
                  <span>{s.endTime}</span>
                </div>
                {/* ظرفیت */}
                <div className="flex items-center sm:block gap-1">
                  <span className="text-gray-500 sm:hidden">👥 ظرفیت:</span>
                  <span className={isFull ? "text-red-500" : ""}>
                    {isFull ? "ظرفیت تکمیل" : s.capacity}
                  </span>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Bottom Button */}
      <AnimatePresence>
        {selectedId && !showConfirm && (
          <motion.div
            className="fixed bottom-5 left-0 right-0 flex justify-center"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 40 }}
          >
            <button
              onClick={handleProceed}
              className="bg-blue-700 text-white px-6 py-2 rounded-full shadow-lg hover:bg-blue-800 transition text-xl"
            >
              ثبت جلسه انتخابی
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Confirmation Dialog */}
      <AnimatePresence>
        {showConfirm && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white rounded-xl p-4 sm:p-6 w-screen sm:w-80 text-center shadow-lg"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
            >
              <h2 className="text-xl sm:text-xl font-bold mb-2 sm:mb-4 text-black">
                آیا مطمئن هستید که این جلسه را انتخاب می‌کنید؟ درصورت تایید شما
                موظفید در جلسه حضور پیدا کنید
              </h2>
              <div className="flex justify-center gap-2 sm:gap-4">
                <button
                  onClick={confirmAndRedirect}
                  className="bg-green-600 text-white px-3 py-1 sm:px-5 sm:py-2 rounded-lg hover:bg-green-700 transition text-xl "
                >
                  بله، مطمئنم
                </button>
                <button
                  onClick={closeConfirm}
                  className="bg-red-400 text-white px-3 py-1 sm:px-5 sm:py-2 rounded-lg hover:bg-red-500 transition text-xl"
                >
                  خیر
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
