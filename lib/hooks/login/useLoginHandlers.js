"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { login, requestResetPasswordCode, verifyPhoneValidationCode, resetPassword, requestValidPhone } from "@/lib/api/api";
import { useAuth } from "@/context/AuthContext";

export const useLoginHandlers = () => {
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
      toast.error("لطفاً همه فیلدها را پر کنید.");
      return;
    }
    setLoading(true);
    try {
      const response = await login(phone, password);
      const successMessage = response.data?.message || "ورود با موفقیت انجام شد.";
      toast.success(successMessage);

      if (response.access) {
        const userData = await authLogin(response.access);
        if (userData.groups.includes("manager")) {
          router.push("/admin");
        } else {
          router.push("/profile");
        }
      } else {
        toast.error("ورود ناموفق بود.");
      }
    } catch (err) {
      console.error("Login error:", err);
      const errorMessage = err.response?.data?.message || err.message || "خطا در ورود";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleSendCode = async () => {
    if (!resetPhone.trim()) {
      toast.error("لطفاً شماره تلفن را وارد کنید.");
      return;
    }
    setLoading(true);
    try {
      const response = await requestValidPhone(resetPhone);
      if (response.message === "Phone number is exist.") {
        const codeResponse = await requestResetPasswordCode({ phone_number: resetPhone, purpose: "reset" });
        const successMessage = codeResponse.data?.message || "کد با موفقیت ارسال شد.";
        toast.success(successMessage);
        setShowPhoneModal(false);
        setShowResetModal(true);
      } else {
        toast.error("شماره تلفن یافت نشد.");
      }
    } catch (err) {
      console.error("Error sending reset code:", err);
      const errorMessage = err.response?.data?.message || err.message || "خطا در ثبت شماره تلفن";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async () => {
    if (!resetCode.trim() || !newPassword.trim()) {
      toast.error("لطفاً کد و رمز عبور جدید را وارد کنید.");
      return;
    }
    setLoading(true);
    try {
      await verifyPhoneValidationCode(resetPhone, resetCode, "reset");
      const response = await resetPassword({
        phone_number: resetPhone,
        code: resetCode,
        new_password: newPassword,
      });
      const successMessage = response.data?.message || "رمز عبور با موفقیت تنظیم شد.";
      toast.success(successMessage);
      setShowResetModal(false);
      setResetPhone("");
      setResetCode("");
      setNewPassword("");
    } catch (err) {
      console.error("Error resetting password:", err);
      const errorMessage = err.response?.data?.message || err.message || "خطا در تایید کد";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return {
    phone,
    setPhone,
    password,
    setPassword,
    loading,
    showPhoneModal,
    setShowPhoneModal,
    showResetModal,
    setShowResetModal,
    resetPhone,
    setResetPhone,
    resetCode,
    setResetCode,
    newPassword,
    setNewPassword,
    handleLogin,
    handleSendCode,
    handleResetPassword,
  };
};