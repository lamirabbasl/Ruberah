"use client";

import React, { useState } from "react";
import { removeMissingReceipt } from "@/lib/api/api";
import { toast } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";

const RemoveMissingReceiptModal = ({ isOpen, onClose, batchId }) => {
  const [formData, setFormData] = useState({
    batch: batchId,
    dry_run: true,
  });
  const [responseData, setResponseData] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await removeMissingReceipt(formData);
      setResponseData(response);
      if (!formData.dry_run && response.message && !response.preview) {
        toast.success("ثبت‌نام‌های بدون رسید با موفقیت حذف شدند");
      }
    } catch (error) {
      console.error("Error removing missing receipts:", error);
      const errorResponse = error.response?.data;
      if (
        errorResponse &&
        errorResponse.message &&
        (errorResponse.preview || errorResponse.count || errorResponse.deletable_count)
      ) {
        setResponseData(errorResponse);
      } else {
        toast.error(errorResponse?.message || "خطا در ارسال درخواست");
      }
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-50 dir-rtl font-sans"
        >
          <motion.div
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            transition={{ duration: 0.3 }}
            className="bg-white p-6 rounded-2xl shadow-2xl max-w-lg w-full mx-4"
          >
            <h2 className="text-2xl font-bold mb-6 text-gray-800">
              حذف ثبت‌نام‌های بدون رسید
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="flex items-center justify-between bg-gray-50 p-4 rounded-lg">
                <label className="text-gray-700 font-medium">حالت تست</label>
                <input
                  type="checkbox"
                  name="dry_run"
                  checked={formData.dry_run}
                  onChange={handleInputChange}
                  className="w-5 h-5 accent-indigo-600"
                />
              </div>
              <div className="flex justify-end gap-4">
                <motion.button
                  type="button"
                  onClick={onClose}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition font-medium"
                >
                  لغو
                </motion.button>
                <motion.button
                  type="submit"
                  disabled={loading}
                  whileHover={{ scale: loading ? 1 : 1.05 }}
                  whileTap={{ scale: loading ? 1 : 0.95 }}
                  className={`px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition font-medium ${
                    loading ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                >
                  {loading ? "در حال پردازش..." : "ارسال"}
                </motion.button>
              </div>
            </form>

            {responseData && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="mt-6 p-4 bg-gray-50 rounded-lg"
              >
                <h3 className="text-lg font-semibold mb-4 text-gray-800">نتیجه:</h3>
                {responseData.message && (
                  <p className="text-gray-700 mb-2">{responseData.message}</p>
                )}
                {responseData.count && (
                  <p className="text-gray-700 mb-2">
                    تعداد ثبت‌نام‌های قابل حذف: {responseData.count}
                  </p>
                )}
                {responseData.deletable_count && (
                  <p className="text-gray-700 mb-2">
                    تعداد ثبت‌نام‌های قابل حذف: {responseData.deletable_count}
                  </p>
                )}
                {(responseData.preview || responseData.deletable_preview) && (
                  <div className="mt-4">
                    <h4 className="font-medium text-gray-800 mb-3">پیش‌نمایش:</h4>
                    <div className="space-y-3 max-h-64 overflow-y-auto pr-2">
                      {(responseData.preview || responseData.deletable_preview || []).map(
                        (item) => (
                          <motion.div
                            key={item.id}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.2 }}
                            className="bg-white p-3 rounded-lg shadow-sm border border-gray-200"
                          >
                            <div className="grid grid-cols-1 gap-2 text-sm text-gray-600">
                              <div>
                                {item.parent__username}
                                <span className="font-medium"> : کاربر</span>
                              </div>
                              <div>
                                {item.parent__phone_number}
                                <span className="font-medium"> : شماره</span>
                              </div>
                              <div>
                                {item.child__full_name}
                                <span className="font-medium"> : نام کودک</span>
                              </div>
                              <div>
                              <span className="font-medium"> روش پرداخت : </span>
                                {item.payment_method === "installment" ? "اقساط" : item.payment_method === "receipt" ? "رسید" : item.payment_method}
                              </div>
                              <div>
                              <span className="font-medium">وضعیت تایید : </span>
                                {item.approval_status === "pending"
                                  ? "در انتظار"
                                  : item.approval_status === "approved"
                                  ? "تایید شده"
                                  : item.approval_status === "rejected"
                                  ? "رد شده"
                                  : item.approval_status}
                              </div>
                            </div>
                          </motion.div>
                        )
                      )}
                    </div>
                  </div>
                )}
              </motion.div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default RemoveMissingReceiptModal;