"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { sendReceiptSMS } from "@/lib/api/api";
import ResponseModal from "./ResponseModal";
import { IoAddCircleOutline, IoRemoveCircleOutline } from "react-icons/io5";

const NotifyModal = ({ isOpen, onClose, batchId }) => {
  const [message, setMessage] = useState("");
  const [dryRun, setDryRun] = useState(true);
  const [phoneInputs, setPhoneInputs] = useState([""]);
  const [responseData, setResponseData] = useState(null);
  const [errorResponse, setErrorResponse] = useState(null);
  const [showResponseModal, setShowResponseModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [confirmText, setConfirmText] = useState("");

  if (!isOpen) return null;

  const handleAddPhoneInput = () => {
    setPhoneInputs([...phoneInputs, ""]);
  };

  const handleRemovePhoneInput = (index) => {
    if (phoneInputs.length > 1) {
      setPhoneInputs(phoneInputs.filter((_, i) => i !== index));
    }
  };

  const handlePhoneChange = (index, value) => {
    const updatedPhones = [...phoneInputs];
    updatedPhones[index] = value;
    setPhoneInputs(updatedPhones);
  };

  const handleSubmit = async (forceSend = false) => {
    if (!forceSend && !dryRun) {
      setShowConfirm(true);
      return;
    }

    setLoading(true);
    setResponseData(null);
    setErrorResponse(null);

    const formData = {
      batch: batchId,
      message: message,
      dry_run: dryRun,
    };

    const validPhones = phoneInputs
      .map((phone) => phone.trim())
      .filter((phone) => phone !== "");
    if (validPhones.length > 0) {
      formData.extra_phones = validPhones.join(", ");
    }

    try {
      const res = await sendReceiptSMS(formData);
      setResponseData(res);
      setShowResponseModal(true);
    } catch (err) {
      if (err.response && err.response.status === 400) {
        setErrorResponse(err.response.data);
      } else {
        setErrorResponse({ message: err.message || "خطا در ارسال درخواست" });
      }
      setShowResponseModal(true);
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmSend = () => {
    if (confirmText.toLowerCase() === "send sms") {
      setShowConfirm(false);
      setConfirmText("");
      handleSubmit(true);
    } else {
      alert("لطفاً 'send sms' را وارد کنید");
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm dir-rtl"
        >
          <motion.div
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-8 m-4"
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-6">اطلاع‌رسانی رسیدهای پرداخت نشده</h2>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">پیام:</label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                  rows={5}
                  placeholder="پیام خود را اینجا وارد کنید"
                />
              </div>
              <div>
                <label className="flex items-center gap-2 text-sm text-gray-700">
                  <input
                    type="checkbox"
                    checked={dryRun}
                    onChange={(e) => setDryRun(e.target.checked)}
                    className="w-5 h-5 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                  />
                  حالت آزمایشی 
                </label>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  شماره‌های تلفن اضافی (اختیاری)
                </label>
                {phoneInputs.map((phone, index) => (
                  <div key={index} className="flex items-center gap-2 mb-2">
                    <input
                      type="text"
                      value={phone}
                      onChange={(e) => handlePhoneChange(index, e.target.value)}
                      className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                      placeholder="مثال: 0910959321"
                    />
                    <div className="flex gap-1">
                      {phoneInputs.length > 1 && (
                        <button
                          onClick={() => handleRemovePhoneInput(index)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <IoRemoveCircleOutline size={24} />
                        </button>
                      )}
                      {index === phoneInputs.length - 1 && (
                        <button
                          onClick={handleAddPhoneInput}
                          className="text-indigo-600 hover:text-indigo-800"
                        >
                          <IoAddCircleOutline size={24} />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex justify-end gap-4 mt-8">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onClose}
                className="px-6 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
              >
                بستن
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleSubmit()}
                disabled={loading || !message.trim()}
                className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "در حال پردازش..." : "ارسال"}
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}

      {showConfirm && (
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
            className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6"
          >
            <h3 className="text-xl font-bold text-gray-900 mb-4">تایید ارسال</h3>
            <p className="text-sm text-gray-600 mb-4">برای تایید، 'send sms' را وارد کنید:</p>
            <input
              type="text"
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
              className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all mb-6"
            />
            <div className="flex justify-end gap-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowConfirm(false)}
                className="px-6 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
              >
                لغو
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleConfirmSend}
                className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                تایید
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}

      <ResponseModal
        isOpen={showResponseModal}
        onClose={() => setShowResponseModal(false)}
        responseData={responseData}
        errorResponse={errorResponse}
      />
    </AnimatePresence>
  );
};

export default NotifyModal;