  import { useState } from "react";
import { useRouter } from "next/navigation";
import { login } from "@/lib/api/api";
import {
  resetPassword,
  requestResetPasswordCode,
  verifyPhoneValidationCode,
  requestValidPhone,
} from "@/lib/api/api";
import { useAuth } from "@/context/AuthContext";
import { showErrorToast } from "@/components/toast/showErrorToast";

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
      showErrorToast("لطفاً همه فیلدها را پر کنید.");
      return;
    }
    setLoading(true);
    try {
      const data = await login(phone, password);

      if (data.access) {
        const userData = await authLogin(data.access);

        if (userData.groups.includes("manager")) {
          router.push("/admin");
        } else {
          router.push("/profile");
        }
      } else {
        showErrorToast("ورود ناموفق بود.");
      }
    } catch (error) {
      console.error("Login error:", error);
      const errorMessage =
        error.response?.data?.detail === "No active account found with the given credentials"
          ? "هیچ حساب فعالی با اطلاعات وارد شده یافت نشد."
          : error.response?.data?.detail || error.message;
      showErrorToast(`خطا در ورود`);
    } finally {
      setLoading(false);
    }
  };

  const handleSendCode = async () => {
    if (!resetPhone.trim()) {
      showErrorToast("لطفاً شماره تلفن را وارد کنید.");
      return;
    }
    setLoading(true);
    try {
      const response = await requestValidPhone(resetPhone);
      if (response.message === "Phone number is exist.") {
        await requestResetPasswordCode({ phone_number: resetPhone, purpose: "reset" });
        setShowPhoneModal(false);
        setShowResetModal(true);
      } else if (response.message === "No account found for this phone.") {
        showErrorToast("شماره تلفن یافت نشد.");
      } else {
        showErrorToast("خطا در اعتبارسنجی شماره تلفن.");
      }
    } catch (error) {
      showErrorToast("خطا در ارسال کد");
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async () => {
    if (!resetCode.trim() || !newPassword.trim()) {
      showErrorToast("لطفاً همه فیلدها را پر کنید.");
      return;
    }
    setLoading(true);
    try {
      await verifyPhoneValidationCode(resetPhone, resetCode, "reset");
      await resetPassword({
        phone_number: resetPhone,
        code: resetCode,
        new_password: newPassword,
      });
      setShowResetModal(false);
      setResetPhone("");
      setResetCode("");
      setNewPassword("");
      showErrorToast("رمز عبور با موفقیت تغییر کرد.");
    } catch (error) {
      showErrorToast("خطا در تنظیم رمز عبور");
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
