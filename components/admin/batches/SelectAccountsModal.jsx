"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const modalVariants = {
  hidden: { opacity: 0, scale: 0.85 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.3, ease: "easeOut" } },
  exit: { opacity: 0, scale: 0.85, transition: { duration: 0.2 } },
};

const SelectAccountsModal = ({ isOpen, onClose, bankAccounts, selectedAccounts, onSave }) => {
  const [tempSelected, setTempSelected] = useState(selectedAccounts);

  const handleToggleAccount = (accountId) => {
    if (tempSelected.includes(accountId)) {
      setTempSelected(tempSelected.filter((id) => id !== accountId));
    } else {
      setTempSelected([...tempSelected, accountId]);
    }
  };

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
            <h3 className="text-xl font-bold text-gray-900 mb-6 tracking-tight">انتخاب حساب‌های بانکی</h3>
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {bankAccounts.map((account) => (
                <div key={account.id} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={tempSelected.includes(account.id)}
                    onChange={() => handleToggleAccount(account.id)}
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  />
                  <span className="text-sm text-gray-700">{account.display_name}</span>
                </div>
              ))}
            </div>
            <div className="flex justify-end space-x-3 mt-6">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onClose}
                className="px-5 py-2 rounded-lg border border-gray-300 bg-white text-gray-700 hover:bg-gray-100 transition-all duration-200 text-sm font-medium"
              >
                انصراف
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => onSave(tempSelected)}
                className="px-5 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition-all duration-200 text-sm font-medium"
              >
                ذخیره
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SelectAccountsModal;