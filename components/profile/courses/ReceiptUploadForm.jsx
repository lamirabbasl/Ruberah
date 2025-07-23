import React, { useState } from "react";

function ReceiptUploadForm({ registrationId, installmentId, setUploading, handleImageUpload }) {
  const [previewImage, setPreviewImage] = useState(null);

  return (
    <div>
      <form
        onSubmit={(e) => {
          handleImageUpload(e, registrationId, installmentId);
          if (setUploading) setUploading(null);
          setPreviewImage(null);
        }}
      >
        <input
          id="receipt_image"
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
        <label
          htmlFor="receipt_image"
          className="block mb-2 cursor-pointer py-2 text-center bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
        >
          {previewImage ? "فایل انتخاب شد" : "انتخاب کنید"}
        </label>
        {previewImage && (
          <img
            src={previewImage}
            alt="Preview"
            className="mb-2 h-24 rounded-md object-cover"
          />
        )}
        <div className="flex gap-2">
          <button
            type="submit"
            className="px-4 py-1 rounded text-sm bg-blue-500 text-white hover:bg-blue-600 mt-1"
          >
            بارگذاری رسید
          </button>
          <button
            type="button"
            onClick={() => {
              if (setUploading) setUploading(null);
              setPreviewImage(null);
            }}
            className="text-red-500 text-sm mt-1"
          >
            لغو
          </button>
        </div>
      </form>
    </div>
  );
}

export default ReceiptUploadForm;