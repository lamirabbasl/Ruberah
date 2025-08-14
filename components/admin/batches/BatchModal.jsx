"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";

const BatchModal = ({ isOpen, onClose, children }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-75 max-md:pt-80 pt-10 flex justify-center items-center z-50 overflow-auto"
          onClick={onClose}
        >
          <div onClick={(e) => e.stopPropagation()}>
            {children}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default BatchModal;