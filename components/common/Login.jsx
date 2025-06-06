"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { login } from "@/lib/api/api";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import {resetPassword , requestResetPasswordCode, verifyPhoneValidationCode, requestValidPhone} from "@/lib/api/api"

const Login = () => {
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPhoneModal, setShowPhoneModal] = useState(false);
  const [showResetModal, setShowResetModal] = useState(false);
  const [resetPhone, setResetPhone] = useState("");
  const [resetCode, setResetCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const router = useRouter();
  const { login: authLogin } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!phone.trim() || !password.trim()) {
      alert("لطفاً همه فیلدها را پر کنید.");
      return;
    }
    setLoading(true);
    try {
      const data = await login(phone, password);

      if (data.access) {
        // Use AuthContext login function which handles token storage
        const userData = await authLogin(data.access);

        // Redirect based on user group
        if (userData.groups.includes("manager")) {
          router.push("/admin");
        } else {
          router.push("/profile");
        }
      } else {
        alert("ورود ناموفق بود.");
      }
    } catch (error) {
      console.error("Login error:", error);
      alert("خطا در ورود: " + (error.response?.data?.detail || error.message));
    } finally {
      setLoading(false);
    }
  };

  const handleSendCode = async () => {
    if (!resetPhone.trim()) {
      alert("لطفاً شماره تلفن را وارد کنید.");
      return;
    }
    setLoading(true);
    try {
      // Validate phone number first
      const response = await requestValidPhone(resetPhone);
      if (response.message === "Phone number is exist.") {
        await requestResetPasswordCode({ phone_number: resetPhone, purpose: "reset" });
        setShowPhoneModal(false);
        setShowResetModal(true);
      } else if (response.message === "No account found for this phone.") {
        alert("شماره تلفن یافت نشد.");
      } else {
        alert("خطا در اعتبارسنجی شماره تلفن.");
      }
    } catch (error) {
      alert("خطا در ارسال کد: " + (error.response?.data?.detail || error.message));
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async () => {
    if (!resetCode.trim() || !newPassword.trim()) {
      alert("لطفاً همه فیلدها را پر کنید.");
      return;
    }
    setLoading(true);
    try {
      // Verify phone validation code first
      await verifyPhoneValidationCode(resetPhone, resetCode, "reset");

      // If verification succeeds, proceed to reset password
      await resetPassword({
        phone_number: resetPhone,
        code: resetCode,
        new_password: newPassword,
      });
      setShowResetModal(false);
      setResetPhone("");
      setResetCode("");
      setNewPassword("");
      alert("رمز عبور با موفقیت تغییر کرد.");
    } catch (error) {
      alert("خطا در تنظیم رمز عبور: " + (error.response?.data?.detail || error.message));
    } finally {
      setLoading(false);
    }
  };

  const formVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeInOut" },
    },
  };

  return (
    <div
      className="min-h-screen bg-gradient-to-b from-primary to-gray-600 flex items-center justify-center p-4 font-noto"
      dir="rtl"
    >
      <motion.div
        variants={formVariants}
        initial="hidden"
        animate="visible"
        className="bg-white rounded-xl p-6 sm:p-8 w-full max-w-[90%] sm:max-w-md shadow-2xl border border-gray-300"
      >
        <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-right text-gray-800">
          ورود
        </h2>
        <div className="mb-4">
          <label
            htmlFor="phone"
            className="block text-gray-700 text-sm font-bold mb-2 text-right"
          >
            نام کاربری:
          </label>
          <input
            type="text"
            id="phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="نام کاربری"
            className="appearance-none border border-gray-300 text-right rounded-md w-full py-2 sm:py-3 px-3 sm:px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 transition-all duration-200"
          />
        </div>
        <div className="mb-6">
          <label
            htmlFor="password"
            className="block text-gray-700 text-sm font-bold mb-2 text-right"
          >
            رمز عبور:
          </label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="رمز عبور"
            className="appearance-none border border-gray-300 text-right rounded-md w-full py-2 sm:py-3 px-3 sm:px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 transition-all duration-200"
          />
        </div>
        <button
          onClick={handleLogin}
          disabled={loading}
          className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 sm:py-3 px-4 sm:px-6 rounded-md w-full shadow-md hover:shadow-lg transition-all duration-200 disabled:opacity-50"
        >
          {loading ? "در حال ورود..." : "ورود"}
        </button>
        <p className="mt-4 text-center text-gray-600">
          حساب کاربری ندارید؟{" "}
          <Link
            href={"/api/auth/signup"}
            className="text-blue-500 hover:text-blue-600 font-semibold"
          >
            ثبت‌نام کنید
          </Link>
        </p>
        <p className="mt-2 text-center text-gray-600">
          <button
            onClick={() => setShowPhoneModal(true)}
            className="text-blue-500 hover:text-blue-600 font-semibold underline"
          >
            فراموشی رمز عبور؟
          </button>
        </p>

      {/* Phone input modal */}
      {showPhoneModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md text-black">
            <h3 className="text-lg font-semibold mb-4 text-right">بازیابی رمز عبور</h3>
            <input
              type="text"
              placeholder="شماره تلفن"
              value={resetPhone}
              onChange={(e) => setResetPhone(e.target.value)}
              className="w-full border border-gray-300 rounded-md p-2 mb-4 text-right"
            />
            <div className="flex justify-between">
              <button
                onClick={() => setShowPhoneModal(false)}
                className="px-4 py-2 bg-gray-300 rounded-md"
              >
                انصراف
              </button>
              <button
                onClick={handleSendCode}
                className="px-4 py-2 bg-blue-500 text-white rounded-md"
                disabled={loading}
              >
                {loading ? "در حال ارسال..." : "ارسال کد"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reset password modal */}
      {showResetModal && (
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
                onClick={() => setShowResetModal(false)}
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
      )}
      </motion.div>
    </div>
  );
};

export default Login;
