import React from "react";
import { FaTrash } from "react-icons/fa";
import { AnimatePresence, motion } from "framer-motion";

const modalVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.3 } },
  exit: { opacity: 0, scale: 0.8, transition: { duration: 0.2 } },
};

function ConfirmDeleteModal({ showConfirmDelete, closeConfirmDelete, handleDelete, error }) {
  return (
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
  );
}

export default ConfirmDeleteModal;