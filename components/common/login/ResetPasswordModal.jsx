"use client";

import React from "react";

const ResetPasswordModal = ({
  show,
  onClose,
  resetCode,
  setResetCode,
  newPassword,
  setNewPassword,
  loading,
  handleResetPassword,
}) => {
  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md text-black">
        <h3 className="text-lg font-semibold mb-4 text-right">تنظیم رمز عبور جدید</h3>
        <input
          type="text"
          placeholder="کد ارسال شده"
          value={resetCode}
          onChange={(e) => setResetCode(e.target.value)}
          className="w-full border border-gray-300 rounded-md p-2 mb-4 text-right"
        />
        <input
          type="password"
          placeholder="رمز عبور جدید"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          className="w-full border border-gray-300 rounded-md p-2 mb-4 text-right"
        />
        <div className="flex justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 rounded-md"
          >
            انصراف
          </button>
          <button
            onClick={handleResetPassword}
            className="px-4 py-2 bg-blue-500 text-white rounded-md"
            disabled={loading}
          >
            {loading ? "در حال تنظیم..." : "تنظیم رمز عبور"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordModal;
