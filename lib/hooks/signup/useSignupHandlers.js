import { useState } from "react";
import { useRouter } from "next/navigation";
import { requestPhoneValidationCode, verifyPhoneValidationCode, registerUser } from "@/lib/api/api";
import { showErrorToast } from "@/components/toast/showErrorToast";

export const useSignupHandlers = () => {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [registrationCode, setRegistrationCode] = useState("");

  const [phoneValidated, setPhoneValidated] = useState(false);
  const [validationCode, setValidationCode] = useState("");
  const [validationMessage, setValidationMessage] = useState("");
  const [isRequestingCode, setIsRequestingCode] = useState(false);
  const [isVerifyingCode, setIsVerifyingCode] = useState(false);
  const [showValidationInput, setShowValidationInput] = useState(false);

  const router = useRouter();

  const handleRequestCode = async () => {
    if (!phone.trim()) {
      showErrorToast("لطفاً شماره تلفن را وارد کنید.");
      return;
    }
    setIsRequestingCode(true);
    setValidationMessage("");
    try {
      await requestPhoneValidationCode(phone);
      setShowValidationInput(true);
      setValidationMessage("کد اعتبارسنجی ارسال شد. لطفاً کد را وارد کنید.");
    } catch (error) {
      setValidationMessage("خطا در ارسال کد اعتبارسنجی. لطفاً دوباره تلاش کنید.");
    } finally {
      setIsRequestingCode(false);
    }
  };

  const handleVerifyCode = async () => {
    if (!validationCode.trim()) {
      showErrorToast("لطفاً کد اعتبارسنجی را وارد کنید.");
      return;
    }
    setIsVerifyingCode(true);
    setValidationMessage("");
    try {
      const res = await verifyPhoneValidationCode(phone, validationCode , "signup");
      if (res.message === "Phone number verified successfully.") {
        setPhoneValidated(true);
        setValidationMessage("شماره تلفن با موفقیت تایید شد.");
      } else {
        setValidationMessage("کد اعتبارسنجی نامعتبر است.");
      }
    } catch (error) {
      setValidationMessage("خطا در تایید کد اعتبارسنجی. لطفاً دوباره تلاش کنید.");
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
      showErrorToast("لطفاً همه فیلدها را پر کنید.");
      return;
    }
    if (password !== passwordConfirm) {
      showErrorToast("رمز عبور و تکرار آن مطابقت ندارند.");
      return;
    }
    
    try {
      await registerUser({
        username: name,
        phone_number: phone,
        password: password,
        registration_code: registrationCode,
      });
      alert(`ثبت‌نام با نام ${name} و شماره ${phone} انجام شد!`);
      setName("");
      setPhone("");
      setPassword("");
      setPasswordConfirm("");
      setRegistrationCode("");
      setPhoneValidated(false);
      setValidationCode("");
      setValidationMessage("");
      setShowValidationInput(false);
      router.push("/api/auth/login");
    } catch (error) {
      showErrorToast("خطا در ثبت‌نام. لطفاً دوباره تلاش کنید.");
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
    validationMessage,
    phoneValidated,
  };
};
