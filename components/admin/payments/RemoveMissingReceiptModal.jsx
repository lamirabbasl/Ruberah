"use client";

import React, { useState } from "react";
import { removeMissingReceipt } from "@/lib/api/api";
import { toast } from "react-toastify";

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
      // Check if the error response has a message and preview or count
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
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 dir-rtl">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full">
        <h2 className="text-xl font-bold mb-4 text-gray-900">
          حذف ثبت‌نام‌های بدون رسید
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex items-center">
            <input
              type="checkbox"
              name="dry_run"
              checked={formData.dry_run}
              onChange={handleInputChange}
              className="mr-2"
            />
            <label className="text-gray-700">حالت تست </label>
          </div>
          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 transition"
            >
              لغو
            </button>
            <button
              type="submit"
              disabled={loading}
              className={`px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition ${
                loading ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {loading ? "در حال پردازش..." : "ارسال"}
            </button>
          </div>
        </form>

        {responseData && (
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <h3 className="text-lg font-semibold mb-2">نتیجه:</h3>
            {responseData.message && (
              <p className="text-gray-700">{responseData.message}</p>
            )}
            {responseData.count && (
              <p className="text-gray-700">
                تعداد ثبت‌نام‌های قابل حذف: {responseData.count}
              </p>
            )}
            {responseData.deletable_count && (
              <p className="text-gray-700">
                تعداد ثبت‌نام‌های قابل حذف: {responseData.deletable_count}
              </p>
            )}
            {(responseData.preview || responseData.deletable_preview) && (
              <div className="mt-4">
                <h4 className="font-medium">پیش‌نمایش:</h4>
                <ul className="list-disc pr-5 mt-2">
                  {(responseData.preview || responseData.deletable_preview || []).map(
                    (item) => (
                      <li key={item.id} className="text-gray-600">
                        <span>شناسه: {item.id}</span> -{" "}
                        <span>کاربر: {item.parent__username}</span> -{" "}
                        <span>شماره: {item.parent__phone_number || "نامشخص"}</span> -{" "}
                        <span>نام کودک: {item.child__full_name}</span> -{" "}
                        <span>روش پرداخت: {item.payment_method}</span>
                        {item.approval_status && (
                          <span> - وضعیت تایید: {item.approval_status}</span>
                        )}
                      </li>
                    )
                  )}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default RemoveMissingReceiptModal;