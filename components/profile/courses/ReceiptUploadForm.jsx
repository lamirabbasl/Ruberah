import React, { useState, useEffect } from "react";
import { UploadCloud, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { getBatchBankAccountById } from "@/lib/api/api";
import { toast } from "react-toastify";

function ReceiptUploadForm({ registrationId, installmentId, setUploading, handleImageUpload, batchId, isOpen, closeModal }) {
  const [previewImage, setPreviewImage] = useState(null);
  const [paymentAccounts, setPaymentAccounts] = useState([]);
  const [selectedAccount, setSelectedAccount] = useState("");

  useEffect(() => {
    async function fetchPaymentAccounts() {
      try {
        const accounts = await getBatchBankAccountById(batchId);
        setPaymentAccounts(accounts);
        if (accounts.length > 0) {
          setSelectedAccount(accounts[0].id);
        }
      } catch (error) {
        console.error("Error fetching payment accounts:", error);
        const errorMessage = error.response?.data?.message || "خطا در دریافت حساب‌های بانکی";
        toast.error(errorMessage);
      }
    }
    if (batchId && isOpen) {
      fetchPaymentAccounts();
    }
  }, [batchId, isOpen]);

  const handleCancel = () => {
    setPreviewImage(null);
    if (setUploading) setUploading(null);
    closeModal();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-2xl p-8 w-full max-w-md shadow-2xl relative"
            dir="rtl"
          >
            <button
              type="button"
              onClick={handleCancel}
              className="absolute top-4 left-4 text-red-500 hover:text-red-600"
            >
              <X size={24} />
            </button>
            <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">بارگذاری رسید پرداخت</h3>
            <motion.form
              onSubmit={(e) => {
                handleImageUpload(e, registrationId, installmentId, selectedAccount);
                handleCancel();
              }}
              className="space-y-6"
            >
              <div className="flex items-center justify-center">
                <label
                  htmlFor={`receipt_image_${installmentId || registrationId}`}
                  className="cursor-pointer flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-900 px-6 py-3 rounded-xl shadow-md transition-all duration-200 font-medium"
                >
                  <UploadCloud size={20} />
                  <span>انتخاب فایل</span>
                </label>
              </div>

              <select
                value={selectedAccount}
                onChange={(e) => setSelectedAccount(e.target.value)}
                className="w-full p-3 border border-gray-200 rounded-xl text-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-gray-500"
              >
                {paymentAccounts.map((account) => (
                  <option key={account.id} value={account.id}>
                    {account.display_name} ({account.bank_name})
                  </option>
                ))}
                {paymentAccounts.length === 0 && (
                  <option value="" disabled>
                    هیچ حساب بانکی یافت نشد
                  </option>
                )}
              </select>

              <input
                id={`receipt_image_${installmentId || registrationId}`}
                type="file"
                name="receipt_image"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files[0];
                  if (file) {
                    const previewUrl = URL.createObjectURL(file);
                    setPreviewImage(previewUrl);
                  } else {
                    setPreviewImage(null);
                  }
                }}
              />

              {previewImage && (
                <motion.img
                  src={previewImage}
                  alt="پیش‌نمایش رسید"
                  className="w-full max-w-xs mx-auto rounded-xl shadow-md border border-gray-200 object-contain"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.2 }}
                />
              )}

              <motion.button
                type="submit"
                className="w-full bg-gray-900 hover:bg-gray-800 text-white py-3 px-6 rounded-xl font-semibold shadow-md transition-all duration-200"
                whileTap={{ scale: 0.98 }}
                disabled={!selectedAccount}
              >
                بارگذاری رسید
              </motion.button>
            </motion.form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default ReceiptUploadForm;