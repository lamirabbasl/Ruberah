import React from "react";
import { motion, AnimatePresence } from "framer-motion";

const modalVariants = {
  hidden: { opacity: 0, scale: 0.85 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.3, ease: "easeOut" } },
  exit: { opacity: 0, scale: 0.85, transition: { duration: 0.2 } },
};

function AddBankAccountModal({
  showAddForm,
  setShowAddForm,
  newBankAccount,
  setNewBankAccount,
  handleAddBankAccount,
}) {
  return (
    <AnimatePresence>
      {showAddForm && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50"
        >
          <motion.div
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md relative"
          >
            <h3 className="text-xl font-bold text-gray-900 mb-6 tracking-tight">افزودن حساب بانکی جدید</h3>
            <div className="space-y-5">
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">نام نمایشی</label>
                <input
                  type="text"
                  value={newBankAccount.display_name}
                  onChange={(e) => setNewBankAccount({ ...newBankAccount, display_name: e.target.value })}
                  className="w-full border border-gray-200 rounded-lg px-4 py-3 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-200 text-sm"
                  placeholder="نام نمایشی حساب"
                />
              </div>
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">نام بانک</label>
                <input
                  type="text"
                  value={newBankAccount.bank_name}
                  onChange={(e) => setNewBankAccount({ ...newBankAccount, bank_name: e.target.value })}
                  className="w-full border border-gray-200 rounded-lg px-4 py-3 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-200 text-sm"
                  placeholder="نام بانک"
                />
              </div>
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">شماره شبا</label>
                <input
                  type="text"
                  value={newBankAccount.iban}
                  onChange={(e) => setNewBankAccount({ ...newBankAccount, iban: e.target.value })}
                  className="w-full border border-gray-200 rounded-lg px-4 py-3 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-200 text-sm"
                  placeholder="شماره شبا (IR...)"
                />
              </div>
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">شماره حساب</label>
                <input
                  type="text"
                  value={newBankAccount.account_number}
                  onChange={(e) => setNewBankAccount({ ...newBankAccount, account_number: e.target.value })}
                  className="w-full border border-gray-200 rounded-lg px-4 py-3 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-200 text-sm"
                  placeholder="شماره حساب"
                />
              </div>
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">شماره کارت</label>
                <input
                  type="text"
                  value={newBankAccount.card_number}
                  onChange={(e) => setNewBankAccount({ ...newBankAccount, card_number: e.target.value })}
                  className="w-full border border-gray-200 rounded-lg px-4 py-3 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-200 text-sm"
                  placeholder="شماره کارت"
                />
              </div>
              <div>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={newBankAccount.is_active}
                    onChange={(e) => setNewBankAccount({ ...newBankAccount, is_active: e.target.checked })}
                    className="mr-2"
                  />
                  <span className="text-sm font-medium text-gray-700">فعال</span>
                </label>
              </div>
            </div>
            <div className="flex justify-end space-x-3 mt-6">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowAddForm(false)}
                className="px-5 py-2 rounded-lg border border-gray-300 bg-white text-gray-700 hover:bg-gray-100 transition-all duration-200 text-sm font-medium"
              >
                انصراف
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleAddBankAccount}
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
}

export default AddBankAccountModal;