"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";

const ResponseModal = ({ isOpen, onClose, responseData, errorResponse }) => {
  if (!isOpen) return null;

  const renderResponse = () => {
    // Handle error response (e.g., 400 status code)
    if (errorResponse) {
      if (errorResponse.message && errorResponse.count !== undefined && errorResponse.preview) {
        // 400 response with pending receipts
        return (
          <div className="p-4 bg-yellow-50 rounded-lg">
            <h3 className="text-lg font-semibold text-yellow-800 mb-3">هشدار :</h3>
            <p className="text-sm text-yellow-700 mb-2">
              {errorResponse.message}
              <span className="font-medium"> : پیام</span>
            </p>
            <p className="text-sm text-yellow-700 mb-2">
              {errorResponse.count}
              <span className="font-medium"> : تعداد ثبت‌نام‌های در حال انتظار</span>
            </p>
            {errorResponse.preview.length > 0 ? (
              <div className="mt-4">
                <h4 className="font-medium text-yellow-800 mb-3">پیش‌نمایش :</h4>
                <div className="space-y-3 max-h-64 overflow-y-auto pr-2">
                  {errorResponse.preview.map((item) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.2 }}
                      className="bg-white p-3 rounded-lg shadow-sm border border-yellow-200"
                    >
                      <div className="grid grid-cols-1 gap-2 text-sm text-yellow-700">
                        <div>
                          {item.parent__username}
                          <span className="font-medium"> : نام کاربری والد</span>
                        </div>
                        <div>
                          {item.parent__phone_number || "نامشخص"}
                          <span className="font-medium"> : تلفن</span>
                        </div>
                        <div>
                          {item.child__full_name}
                          <span className="font-medium"> : نام کودک</span>
                        </div>
                        <div>
                        <span className="font-medium">روش پرداخت : </span>
                          {item.payment_method === "installment" ? "اقساط" : item.payment_method === "receipt" ? "رسید" : item.payment_method}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            ) : (
              <p className="mt-3 text-sm text-yellow-700">
                بدون جزئیات ثبت‌نام
                <span className="font-medium"> : پیش‌نمایش</span>
              </p>
            )}
          </div>
        );
      }
      // Generic error response
      return (
        <div className="p-4 bg-red-50 rounded-lg">
          <h3 className="text-lg font-semibold text-red-800 mb-3">خطا :</h3>
          <p className="text-sm text-red-700">
            {errorResponse.message || "خطا در درخواست"}
            <span className="font-medium"> : پیام</span>
          </p>
        </div>
      );
    }

    // Handle success or dry-run response
    if (!responseData) return null;

    if (responseData.dry_run) {
      // Dry run response (200 status)
      return (
        <div className="p-4 bg-gray-50 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-800 mb-3">پیش‌نمایش</h3>
          <p className="text-sm text-gray-700 mb-2">
            {responseData.auto_targets_count || 0}
            <span className="font-medium"> : تعداد شماره ها</span>
          </p>
          <p className="text-sm text-gray-700 mb-2">
            {responseData.extra_phones_count || 0}
            <span className="font-medium"> : تعداد شماره های اضافی</span>
          </p>
          <p className="text-sm text-gray-700 mb-2">
            {responseData.merged_unique_phones || 0}
            <span className="font-medium"> : تعداد شماره های منحصر به فرد</span>
          </p>
          {responseData.registrations_preview && responseData.registrations_preview.length > 0 ? (
            <div className="mt-4">
              <h4 className="font-medium text-gray-800 mb-3">پیش‌نمایش ثبت‌نام :</h4>
              <div className="space-y-3 max-h-64 overflow-y-auto pr-2">
                {responseData.registrations_preview.map((reg) => (
                  <motion.div
                    key={reg.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.2 }}
                    className="bg-white p-3 rounded-lg shadow-sm border border-gray-200"
                  >
                    <div className="grid grid-cols-1 gap-2 text-sm text-gray-600">
                      <div>
                        {reg.parent__username}
                        <span className="font-medium"> : نام کاربری والد</span>
                      </div>
                      <div>
                        {reg.parent__phone_number || "نامشخص"}
                        <span className="font-medium"> : تلفن</span>
                      </div>
                      <div>
                        {reg.child__full_name}
                        <span className="font-medium"> : نام کودک</span>
                      </div>
                      <div>
                      <span className="font-medium">روش پرداخت : </span>
                        {reg.payment_method === "installment" ? "اقساط" : reg.payment_method === "receipt" ? "رسید" : reg.payment_method}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          ) : (
            <p className="mt-3 text-sm text-gray-700">
              بدون پیش‌نمایش ثبت‌نام
              <span className="font-medium"> : پیش‌نمایش</span>
            </p>
          )}
        </div>
      );
    }

    if (responseData.message === "موردی یافت نشد") {
      // No cases found response (200 status)
      return (
        <div className="p-4 bg-red-50 rounded-lg">
          <h3 className="text-lg font-semibold text-red-800 mb-3">نتیجه :</h3>
          <p className="text-sm text-red-700">
            {responseData.message}
            <span className="font-medium"> : پیام</span>
          </p>
        </div>
      );
    }

    // Success response for non-dry-run (200 status)
    if (!responseData.dry_run && responseData.total_recipients !== undefined) {
      return (
        <div className="p-4 bg-gray-50 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-800 mb-3">موفقیت :</h3>
          <p className="text-sm text-gray-700 mb-2">
            پیام‌ها با موفقیت ارسال شد
            <span className="font-medium"> : پیام</span>
          </p>
          <p className="text-sm text-gray-700 mb-2">
            {responseData.batch}
            <span className="font-medium"> : شناسه دوره</span>
          </p>
          <p className="text-sm text-gray-700 mb-2">
            {responseData.total_recipients}
            <span className="font-medium"> : تعداد کل گیرندگان</span>
          </p>
          <p className="text-sm text-gray-700 mb-2">
            {responseData.sent_success}
            <span className="font-medium"> : پیام‌های ارسال شده موفق</span>
          </p>
          <p className="text-sm text-gray-700 mb-2">
            {responseData.sent_failed}
            <span className="font-medium"> : پیام‌های ناموفق</span>
          </p>
          {responseData.success_numbers && responseData.success_numbers.length > 0 ? (
            <div className="mt-4">
              <h4 className="font-medium text-gray-800 mb-3">شماره‌های موفق :</h4>
              <div className="space-y-3 max-h-64 overflow-y-auto pr-2">
                {responseData.success_numbers.map((number, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.2 }}
                    className="bg-white p-3 rounded-lg shadow-sm border border-gray-200"
                  >
                    <div className="text-sm text-gray-600">
                      {number}
                      <span className="font-medium"> : شماره</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          ) : (
            <p className="mt-3 text-sm text-gray-700">
              بدون شماره‌های موفق
              <span className="font-medium"> : شماره‌های موفق</span>
            </p>
          )}
          {responseData.failed_numbers && responseData.failed_numbers.length > 0 ? (
            <div className="mt-4">
              <h4 className="font-medium text-gray-800 mb-3">شماره‌های ناموفق :</h4>
              <div className="space-y-3 max-h-64 overflow-y-auto pr-2">
                {responseData.failed_numbers.map((number, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.2 }}
                    className="bg-white p-3 rounded-lg shadow-sm border border-gray-200"
                  >
                    <div className="text-sm text-gray-600">
                      {number}
                      <span className="font-medium"> : شماره</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          ) : (
            <p className="mt-3 text-sm text-gray-700">
              بدون شماره‌های ناموفق
              <span className="font-medium"> : شماره‌های ناموفق</span>
            </p>
          )}
        </div>
      );
    }

    // Fallback for unexpected success response
    return (
      <div className="p-4 bg-gray-50 rounded-lg">
        <h3 className="text-lg font-semibold text-gray-800 mb-3">موفقیت :</h3>
        <p className="text-sm text-gray-700">
          پیام‌ها با موفقیت ارسال شد
          <span className="font-medium"> : پیام</span>
        </p>
      </div>
    );
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-60 flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm dir-rtl font-sans"
        >
          <motion.div
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-8 m-4"
          >
            <h2 className="text-2xl font-bold text-gray-800 mb-6">نتیجه درخواست</h2>
            {renderResponse()}
            <div className="flex justify-end mt-6">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onClose}
                className="px-6 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors font-medium"
              >
                بستن
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ResponseModal;