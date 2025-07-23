import React from "react";
import { FaPlus, FaFileExport } from "react-icons/fa";
import { motion } from "framer-motion";

function ActionButtons({ handleAddUser, handleExportExcel, exporting }) {
  return (
    <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={handleAddUser}
        className="bg-indigo-600 text-white px-6 py-3 rounded-lg shadow-md hover:bg-indigo-700 transition-all duration-200 text-sm font-medium flex items-center gap-2 w-full sm:w-auto"
      >
        <FaPlus className="w-4 h-4" />
        افزودن کاربر جدید
      </motion.button>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={handleExportExcel}
        disabled={exporting}
        className={`px-6 py-3 rounded-lg shadow-md flex items-center gap-2 w-full sm:w-auto text-white ${
          exporting ? "bg-gray-400 cursor-not-allowed" : "bg-indigo-600 hover:bg-indigo-700"
        } transition-all duration-200 text-sm font-medium`}
      >
        <FaFileExport className="w-4 h-4" />
        {exporting ? "در حال دانلود..." : "خروجی اکسل"}
      </motion.button>
    </div>
  );
}

export default ActionButtons;