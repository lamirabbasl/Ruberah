"use client";

import React from "react";
import { motion } from "framer-motion";
import { modalVariants } from "./BatchAnimations";

const DeleteConfirmModal = ({ isOpen, onClose, onConfirm, batchTitle }) => {
  if (!isOpen) return null;

  return (
    <motion.div
      variants={modalVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md relative"
    >
      <p className="mb-6 text-red-600 font-semibold text-center text-lg">
        آیا از حذف دوره "{batchTitle}" مطمئن هستید؟
      </p>
      <div className="flex justify-end space-x-3">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onClose}
          className="px-5 py-2 rounded-lg border border-gray-300 bg-white text-gray-700 hover:bg-gray-100 transition-all duration-200 text-sm font-medium"
        >
          لغو
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onConfirm}
          className="px-5 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition-all duration-200 text-sm font-medium"
        >
          حذف
        </motion.button>
      </div>
    </motion.div>
  );
};

export default DeleteConfirmModal;
