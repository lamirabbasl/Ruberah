import React from "react";
import { motion } from "framer-motion";

const PaginationControls = ({ currentPage, isLastPage, handlePageChange }) => {
  return (
    <div className="flex justify-center mt-6 sm:mt-8 space-x-3 space-x-reverse">
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={`px-3 sm:px-4 py-2 rounded-lg text-sm font-medium ${
          currentPage === 1
            ? "bg-gray-200 text-gray-500 cursor-not-allowed"
            : "bg-indigo-600 text-white hover:bg-indigo-700"
        } transition-all duration-200`}
      >
        صفحه قبلی
      </motion.button>
      <span className="px-3 sm:px-4 py-2 text-gray-700 font-medium">صفحه {currentPage}</span>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={isLastPage}
        className={`px-3 sm:px-4 py-2 rounded-lg text-sm font-medium ${
          isLastPage
            ? "bg-gray-200 text-gray-500 cursor-not-allowed"
            : "bg-indigo-600 text-white hover:bg-indigo-700"
        } transition-all duration-200`}
      >
        صفحه بعدی
      </motion.button>
    </div>
  );
};

export default PaginationControls;