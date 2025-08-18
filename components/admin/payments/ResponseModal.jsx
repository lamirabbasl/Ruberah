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
            <h3 className="text-xl font-semibold text-yellow-800 mb-3">هشدار:</h3>
            <p className="text-base text-yellow-700">{errorResponse.message}</p>
            <p className="mt-3 text-base text-yellow-700">تعداد ثبت‌نام‌های در حال انتظار: {errorResponse.count}</p>
            {errorResponse.preview.length > 0 ? (
              <ul className="list-disc pr-6 mt-3 text-base text-yellow-700">
                {errorResponse.preview.map((item) => (
                  <li key={item.id} className="mb-1">
                    ID: {item.id}, نام کاربری والد: {item.parent__username}, 
                    تلفن: {item.parent__phone_number}, نام کودک: {item.child__full_name}, 
                    روش پرداخت: {item.payment_method}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-3 text-base text-yellow-700">بدون جزئیات ثبت‌نام</p>
            )}
          </div>
        );
      }
      // Generic error response
      return (
        <div className="p-4 bg-red-50 rounded-lg">
          <h3 className="text-xl font-semibold text-red-800 mb-3">خطا:</h3>
          <p className="text-base text-red-700">{errorResponse.message || "خطا در درخواست"}</p>
        </div>
      );
    }

    // Handle success or dry-run response
    if (!responseData) return null;

    if (responseData.dry_run) {
      // Dry run response (200 status)
      return (
        <div className="p-4 bg-gray-50 rounded-lg">
          <h3 className="text-xl font-semibold text-gray-800 mb-3">پیش‌نمایش</h3>
          <p className="text-base text-gray-700">تعداد اهداف خودکار: {responseData.auto_targets_count || 0}</p>
          <p className="text-base text-gray-700">تعداد تلفن‌های اضافی: {responseData.extra_phones_count || 0}</p>
          <p className="text-base text-gray-700">تعداد تلفن‌های منحصر به فرد: {responseData.merged_unique_phones || 0}</p>
          {responseData.registrations_preview && responseData.registrations_preview.length > 0 ? (
            <ul className="list-disc pr-6 mt-3 text-base text-gray-700">
              {responseData.registrations_preview.map((reg, idx) => (
                <li key={idx} className="mb-1">
                  ID: {reg.id}, نام کاربری والد: {reg.parent__username}, 
                  تلفن: {reg.parent__phone_number}, نام کودک: {reg.child__full_name}, 
                  روش پرداخت: {reg.payment_method}
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-3 text-base text-gray-700">بدون پیش‌نمایش ثبت‌نام</p>
          )}
        </div>
      );
    }

    if (responseData.message === "موردی یافت نشد") {
      // No cases found response (200 status)
      return (
        <div className="p-4 bg-red-50 rounded-lg">
          <h3 className="text-xl font-semibold text-red-800 mb-3">نتیجه:</h3>
          <p className="text-base text-red-700">{responseData.message}</p>
        </div>
      );
    }

    // Success response for non-dry-run (200 status)
    if (!responseData.dry_run && responseData.total_recipients !== undefined) {
      return (
        <div className="p-4 bg-gray-50 rounded-lg">
          <h3 className="text-xl font-semibold text-gray-800 mb-3">موفقیت</h3>
          <p className="text-base text-gray-700">پیام‌ها با موفقیت ارسال شد</p>
          <p className="mt-3 text-base text-gray-700">شناسه بچ: {responseData.batch}</p>
          <p className="text-base text-base text-gray-700">تعداد کل گیرندگان: {responseData.total_recipients}</p>
          <p className="text-base text-gray-700">پیام‌های ارسال شده موفق: {responseData.sent_success}</p>
          <p className="text-base text-gray-700">پیام‌های ناموفق: {responseData.sent_failed}</p>
          {responseData.success_numbers && responseData.success_numbers.length > 0 ? (
            <>
              <p className="mt-3 text-base text-gray-700">شماره‌های موفق</p>
              <ul className=" pr-6 text-base text-gray-700">
                {responseData.success_numbers.map((number, idx) => (
                  <li key={idx} className="mb-1">{number}</li>
                ))}
              </ul>
            </>
          ) : (
            <p className="mt-3 text-base text-gray-700">بدون شماره‌های موفق</p>
          )}
          {responseData.failed_numbers && responseData.failed_numbers.length > 0 ? (
            <>
              <p className="mt-3 text-base text-gray-700">شماره‌های ناموفق</p>
              <ul className="list-disc pr-6 text-base text-gray-700">
                {responseData.failed_numbers.map((number, idx) => (
                  <li key={idx} className="mb-1">{number}</li>
                ))}
              </ul>
            </>
          ) : (
            <p className="mt-3 text-base text-gray-700">بدون شماره‌های ناموفق</p>
          )}
        </div>
      );
    }

    // Fallback for unexpected success response
    return (
      <div className="p-4 bg-gray-50 rounded-lg">
        <h3 className="text-xl font-semibold text-gray-800 mb-3">موفقیت:</h3>
        <p className="text-base text-gray-700">پیام‌ها با موفقیت ارسال شد.</p>
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
          className="fixed inset-0 z-60 flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm dir-rtl"
        >
          <motion.div
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-8 m-4"
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-6">نتیجه درخواست</h2>
            {renderResponse()}
            <div className="flex justify-end mt-6">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onClose}
                className="px-6 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
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