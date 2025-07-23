import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import JalaliCalendar from "@/components/common/JalaliCalendar";
import { convertToJalali } from "@/lib/utils/convertDate";

const modalVariants = {
  hidden: { opacity: 0, scale: 0.85 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.3, ease: "easeOut" } },
  exit: { opacity: 0, scale: 0.85, transition: { duration: 0.2 } },
};

function EditSeasonModal({
  showEditForm,
  setShowEditForm,
  editingSeason,
  setEditingSeason,
  error,
  setError,
  handleEditSeason,
}) {
  const [showEditStartCalendar, setShowEditStartCalendar] = useState(false);
  const [showEditEndCalendar, setShowEditEndCalendar] = useState(false);

  return (
    <AnimatePresence>
      {showEditForm && (
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
            <h3 className="text-xl font-bold text-gray-900 mb-6 tracking-tight">ویرایش فصل</h3>
            <div className="space-y-5">
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">نام فصل</label>
                <input
                  type="text"
                  value={editingSeason?.name || ""}
                  onChange={(e) => setEditingSeason({ ...editingSeason, name: e.target.value })}
                  className="w-full border border-gray-200 rounded-lg px-4 py-3 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-200 text-sm"
                />
              </div>
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">تاریخ شروع</label>
                <input
                  type="text"
                  readOnly
                  value={convertToJalali(editingSeason?.start_date)}
                  onClick={() => {
                    setShowEditStartCalendar(true);
                    setShowEditEndCalendar(false);
                  }}
                  className="w-full border border-gray-200 rounded-lg px-4 py-3 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-200 text-sm cursor-pointer"
                  placeholder="انتخاب تاریخ شروع"
                />
                {showEditStartCalendar && (
                  <div className="absolute z-50 mb-3 bottom-0 bg-white shadow-lg rounded-lg">
                    <JalaliCalendar
                      onDateSelect={(date) => {
                        setEditingSeason({ ...editingSeason, start_date: date });
                        setShowEditStartCalendar(false);
                      }}
                    />
                  </div>
                )}
              </div>
              <div className="mt-4">
                <label className="block mb-2 text-sm font-medium text-gray-700">تاریخ پایان</label>
                <input
                  type="text"
                  readOnly
                  value={convertToJalali(editingSeason?.end_date)}
                  onClick={() => {
                    setShowEditEndCalendar(true);
                    setShowEditStartCalendar(false);
                  }}
                  className="w-full border border-gray-200 rounded-lg px-4 py-3 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-200 text-sm cursor-pointer"
                  placeholder="انتخاب تاریخ پایان"
                />
                {showEditEndCalendar && (
                  <div className="absolute z-50 bottom-0 mb-2 bg-white shadow-lg rounded-lg">
                    <JalaliCalendar
                      onDateSelect={(date) => {
                        setEditingSeason({ ...editingSeason, end_date: date });
                        setShowEditEndCalendar(false);
                      }}
                    />
                  </div>
                )}
              </div>
            </div>
            {error && (
              <p className="text-red-600 text-sm bg-red-50 p-3 rounded-lg mt-4">{error}</p>
            )}
            <div className="flex justify-end space-x-3 mt-6">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  setShowEditForm(false);
                  setError(null);
                }}
                className="px-5 py-2 rounded-lg border border-gray-300 bg-white text-gray-700 hover:bg-gray-100 transition-all duration-200 text-sm font-medium"
              >
                انصراف
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleEditSeason}
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

export default EditSeasonModal;