import React from "react";
import { FaTrash } from "react-icons/fa";
import { AnimatePresence, motion } from "framer-motion";

const modalVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.3 } },
  exit: { opacity: 0, scale: 0.8, transition: { duration: 0.2 } },
};

function AddReservationModal({
  showAddForm,
  setShowAddForm,
  newReservation,
  setNewReservation,
  sessions,
  error,
  setError,
  handleAddReservation,
}) {
  const handleInputChange = (field, value) => {
    setNewReservation((prev) => ({ ...prev, [field]: value }));
  };

  return (
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
              onClick={() => {
                setShowAddForm(false);
                setError(null);
              }}
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
                onClick={() => {
                  setShowAddForm(false);
                  setError(null);
                }}
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
  );
}

export default AddReservationModal;