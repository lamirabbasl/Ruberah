import React from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { motion } from "framer-motion";

function Pagination({ currentPage, isLastPage, loading, handlePreviousPage, handleNextPage }) {
  return (
    <div className="flex justify-between items-center px-6 py-4 bg-gray-50 border-t border-gray-200">
      <motion.button
        onClick={handlePreviousPage}
        disabled={currentPage === 1 || loading}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
          currentPage === 1 || loading
            ? "bg-gray-300 text-gray-600 cursor-not-allowed"
            : "bg-indigo-600 text-white hover:bg-indigo-700"
        }`}
      >
        <FaChevronRight className="w-4 h-4" />
        قبلی
      </motion.button>
      <span className="text-sm font-medium text-gray-700">صفحه {currentPage}</span>
      <motion.button
        onClick={handleNextPage}
        disabled={isLastPage || loading}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
          isLastPage || loading
            ? "bg-gray-300 text-gray-600 cursor-not-allowed"
            : "bg-indigo-600 text-white hover:bg-indigo-700"
        }`}
      >
        بعدی
        <FaChevronLeft className="w-4 h-4" />
      </motion.button>
    </div>
  );
}

export default Pagination;