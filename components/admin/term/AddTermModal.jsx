import React from "react";
import { motion, AnimatePresence } from "framer-motion";

const modalVariants = {
  hidden: { opacity: 0, scale: 0.85 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.3, ease: "easeOut" } },
  exit: { opacity: 0, scale: 0.85, transition: { duration: 0.2 } },
};

function AddTermModal({
  showAddForm,
  setShowAddForm,
  newTerm,
  setNewTerm,
  handleAddTerm,
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
            <h3 className="text-xl font-bold text-gray-900 mb-6 tracking-tight">افزودن شرایط جدید</h3>
            <div className="space-y-5">
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">عنوان</label>
                <input
                  type="text"
                  value={newTerm.title}
                  onChange={(e) => setNewTerm({ ...newTerm, title: e.target.value })}
                  className="w-full border border-gray-200 rounded-lg px-4 py-3 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-200 text-sm"
                  placeholder="عنوان شرایط"
                />
              </div>
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">توضیحات</label>
                <textarea
                  value={newTerm.body}
                  onChange={(e) => setNewTerm({ ...newTerm, body: e.target.value })}
                  className="w-full border border-gray-200 rounded-lg px-4 py-3 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-200 text-sm"
                  placeholder="توضیحات شرایط"
                  rows="4"
                />
              </div>
              <div>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={newTerm.is_active}
                    onChange={(e) => setNewTerm({ ...newTerm, is_active: e.target.checked })}
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
                onClick={handleAddTerm}
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

export default AddTermModal;