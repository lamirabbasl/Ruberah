import React, { useState } from "react";
import { UploadCloud, X } from "lucide-react";
import { motion } from "framer-motion";

function ReceiptUploadForm({ registrationId, installmentId, setUploading, handleImageUpload }) {
  const [previewImage, setPreviewImage] = useState(null);

  const handleCancel = () => {
    setPreviewImage(null);
    if (setUploading) setUploading(null);
  };

  return (
    <motion.form
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      onSubmit={(e) => {
        handleImageUpload(e, registrationId, installmentId);
        handleCancel();
      }}
      className="w-full bg-gray-50 border border-blue-200 rounded-xl p-3 mt-2 shadow-sm space-y-2"
    >
      <div className="flex items-center justify-between">
        <label
          htmlFor={`receipt_image_${installmentId || registrationId}`}
          className="cursor-pointer flex items-center gap-2 flex mx-auto text-sm w-20 bg-blue-100 hover:bg-blue-200 text-blue-700 px-0 py-2 rounded-lg shadow transition-all duration-200"
        >
          <UploadCloud size={18} />
          <span className="wrap">انتخاب فایل</span>
        </label>

        { (
          <button
            type="button"
            onClick={handleCancel}
            className="text-red-500 flex text-sm items-center gap-1 hover:text-red-600"
          >
            <X size={16} />
            لغو
          </button>
        )}
      </div>

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
          className="w-full max-w-xs mx-auto rounded-lg shadow border object-contain"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
        />
      )}

      <motion.button
        type="submit"
        className="w-24 mx-auto flex  bg-blue-600 hover:bg-blue-700 text-sm text-white py-2 px-5 rounded-lg font-semibold shadow transition-all"
        whileTap={{ scale: 0.98 }}
      >
        بارگذاری رسید
      </motion.button>
    </motion.form>
  );
}

export default ReceiptUploadForm;
