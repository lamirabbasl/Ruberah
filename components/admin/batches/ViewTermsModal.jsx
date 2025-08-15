"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";

const modalVariants = {
  hidden: { opacity: 0, scale: 0.85 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.3, ease: "easeOut" } },
  exit: { opacity: 0, scale: 0.85, transition: { duration: 0.2 } },
};

const ViewTermsModal = ({ isOpen, onClose, terms }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50"
          onClick={onClose}
        >
          <motion.div
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md relative"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-xl font-bold text-gray-900 mb-6 tracking-tight">شرایط</h3>
            <div className="space-y-4 max-h-64 overflow-y-auto">
              {terms.length === 0 ? (
                <p className="text-sm text-gray-600">هیچ شرطی انتخاب نشده است.</p>
              ) : (
                terms.map((term) => (
                  <div key={term.id} className="border-b border-gray-200 pb-4">
                    <p className="text-sm font-medium text-gray-900">عنوان: {term.title}</p>
                    <p className="text-sm text-gray-600">متن: {term.body || "-"}</p>
                    <p className="text-sm text-gray-600">
                      وضعیت: 
                      <span className={`ml-2 px-2 py-1 rounded-full text-xs ${term.is_active ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                        {term.is_active ? "فعال" : "غیرفعال"}
                      </span>
                    </p>
                  </div>
                ))
              )}
            </div>
            <div className="flex justify-end mt-6">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onClose}
                className="px-5 py-2 rounded-lg border border-gray-300 bg-white text-gray-700 hover:bg-gray-100 transition-all duration-200 text-sm font-medium"
              >
                بستن
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ViewTermsModal;