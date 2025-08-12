"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { requestPhoneValidationCode, verifyPhoneValidationCode, registerUser } from "@/lib/api/api";

export const useSignupHandlers = () => {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [registrationCode, setRegistrationCode] = useState("");
  const [phoneValidated, setPhoneValidated] = useState(false);
  const [validationCode, setValidationCode] = useState("");
  const [isRequestingCode, setIsRequestingCode] = useState(false);
  const [isVerifyingCode, setIsVerifyingCode] = useState(false);
  const [showValidationInput, setShowValidationInput] = useState(false);

  const router = useRouter();

  const handleRequestCode = async () => {
    if (!phone.trim()) {
      toast.error("لطفاً شماره تلفن را وارد کنید.");
      return;
    }
    setIsRequestingCode(true);
    try {
      const response = await requestPhoneValidationCode(phone);
      const successMessage = response.data?.message || "کد با موفقیت ارسال شد.";
      toast.success(successMessage);
      setShowValidationInput(true);
    } catch (err) {
      console.error("Error requesting validation code:", err);
      const errorMessage = err.response?.data?.message || err.message || "خطا در ثبت نام";
      toast.error(errorMessage);
    } finally {
      setIsRequestingCode(false);
    }
  };

  const handleVerifyCode = async () => {
    if (!validationCode.trim()) {
      toast.error("لطفاً کد اعتبارسنجی را وارد کنید.");
      return;
    }
    setIsVerifyingCode(true);
    try {
      const response = await verifyPhoneValidationCode(phone, validationCode, "signup");
      const successMessage = response.data?.message || "شماره تلفن با موفقیت تایید شد.";
      setPhoneValidated(true);
      toast.success(successMessage);
    } catch (err) {
      console.error("Error verifying code:", err);
      const errorMessage = err.response?.data?.message || err.message || "خطا در ثبت نام";
      toast.error(errorMessage);
    } finally {
      setIsVerifyingCode(false);
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    if (
      !name.trim() ||
      !phone.trim() ||
      !password.trim() ||
      !passwordConfirm.trim() ||
      !registrationCode.trim()
    ) {
      toast.error("لطفاً همه فیلدها را پر کنید.");
      return;
    }
    if (password !== passwordConfirm) {
      toast.error("رمز عبور و تکرار آن مطابقت ندارند.");
      return;
    }
    if (!phoneValidated) {
      toast.error("لطفاً ابتدا شماره تلفن خود را اعتبارسنجی کنید.");
      return;
    }

    try {
      const response = await registerUser({
        username: name,
        phone_number: phone,
        password,
        registration_code: registrationCode,
      });
      const successMessage = response.data?.message || "ثبت‌نام با موفقیت انجام شد.";
      toast.success(successMessage);
      setName("");
      setPhone("");
      setPassword("");
      setPasswordConfirm("");
      setRegistrationCode("");
      setPhoneValidated(false);
      setValidationCode("");
      setShowValidationInput(false);
      router.push("/api/auth/login");
    } catch (err) {
      console.error("Error during signup:", err);
      const errorMessage = err.response?.data?.message || err.message || "خطا در ثبت نام";
      toast.error(errorMessage);
    }
  };

  return {
    name,
    setName,
    phone,
    setPhone,
    password,
    setPassword,
    passwordConfirm,
    setPasswordConfirm,
    registrationCode,
    setRegistrationCode,
    loading: false,
    handleSignup,
    onRequestCodeClick: handleRequestCode,
    isRequestingCode,
    showValidationInput,
    validationCode,
    setValidationCode,
    isVerifyingCode,
    handleVerifyCode,
    phoneValidated,
  };
};