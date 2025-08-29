import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { requestResetPasswordCode, verifyPhoneValidationCode, resetPassword, requestValidPhone } from "@/lib/api/api";
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
  const [navigationPath, setNavigationPath] = useState(null);
  const router = useRouter();
  const { login: authLogin } = useAuth();

  // Handle navigation in a useEffect to ensure router is ready
  useEffect(() => {
    if (navigationPath) {
      router.push(navigationPath);
    }
  }, [navigationPath, router]);

  const handleLogin = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    console.log("handleLogin called with phone:", phone, "password:", password);

    if (!phone.trim() || !password.trim()) {
      toast.error("لطفاً همه فیلدها را پر کنید.");
      console.log("Validation failed: Empty fields");
      return;
    }

    setLoading(true);
    try {
      console.log("Attempting login via AuthContext...");
      const userData = await authLogin({ username: phone, password });
      console.log("Login response:", userData);

      if (!userData?.groups) {
        throw new Error("User data or groups not found");
      }

      const successMessage = "ورود با موفقیت انجام شد.";
      toast.success(successMessage);

      // Set navigation path based on user role
      const path = userData.groups.includes("manager") ? "/admin" : "/profile";
      console.log(`Setting navigation path to ${path}`);
      setNavigationPath(path);
    } catch (err) {
      console.error("Login error:", {
        message: err.message,
        status: err.response?.status,
        data: err.response?.data,
      });
      const errorMessage =
        err.response?.data?.message || "نام کاربری یا رمز عبور اشتباه است.";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
      console.log("Login attempt finished, loading set to false");
    }
  };

  const handleSendCode = async () => {
    if (!resetPhone.trim()) {
      toast.error("لطفاً شماره تلفن را وارد کنید.");
      return;
    }
    setLoading(true);
    try {
      const response = await requestValidPhone({ phone_number: resetPhone });
      if (response.message === "Phone number is exist.") {
        const codeResponse = await requestResetPasswordCode({
          phone_number: resetPhone,
          purpose: "reset",
        });
        const successMessage = codeResponse.message || "کد با موفقیت ارسال شد.";
        toast.success(successMessage);
        setShowPhoneModal(false);
        setShowResetModal(true);
      } else {
        toast.error("شماره تلفن یافت نشد.");
      }
    } catch (err) {
      console.error("Error sending reset code:", err);
      const errorMessage =
        err.response?.data?.message || "خطا در ثبت شماره تلفن";
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
      const successMessage = response.message || "رمز عبور با موفقیت تنظیم شد.";
      toast.success(successMessage);
      setShowResetModal(false);
      setResetPhone("");
      setResetCode("");
      setNewPassword("");
    } catch (err) {
      console.error("Error resetting password:", err);
      const errorMessage =
        err.response?.data?.message || "خطا در تایید کد";
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