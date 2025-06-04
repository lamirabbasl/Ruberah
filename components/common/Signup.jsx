"use client";

"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { requestPhoneValidationCode, verifyPhoneValidationCode, registerUser } from "../../lib/api/api";

const Signup = () => {
  const router = useRouter();

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

  const handleRequestCode = async () => {
    if (!phone.trim()) {
      alert("لطفاً شماره تلفن را وارد کنید.");
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
      alert("لطفاً کد اعتبارسنجی را وارد کنید.");
      return;
    }
    setIsVerifyingCode(true);
    setValidationMessage("");
    try {
      const res = await verifyPhoneValidationCode(phone, validationCode);
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
      alert("لطفاً همه فیلدها را پر کنید.");
      return;
    }
    if (password !== passwordConfirm) {
      alert("رمز عبور و تکرار آن مطابقت ندارند.");
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
      alert("خطا در ثبت‌نام. لطفاً دوباره تلاش کنید.");
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
      className="min-h-screen bg-gradient-to-b from-primary mt-16 to-gray-600  flex items-center justify-center p-4 font-noto"
      dir="rtl"
    >
      <motion.div
        variants={formVariants}
        initial="hidden"
        animate="visible"
        className="bg-white rounded-xl p-6 sm:p-8 w-full max-w-[90%] sm:max-w-md shadow-2xl border border-gray-300"
      >
        <h2 className="text-xl sm:text-3xl font-bold mb-4 text-right text-gray-800">
          ثبت‌نام
        </h2>
        <div className="mb-4">
          <label
            htmlFor="name"
            className="block text-gray-700 text-sm font-bold mb-2 text-right"
          >
            نام:
          </label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="نام کامل"
            className="appearance-none border border-gray-300 text-right rounded-md w-full py-2 sm:py-3 px-3 sm:px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 transition-all duration-200"
          />
        </div>
        <div className="mb-4 flex items-center gap-2">
          <div className="flex-grow">
            <label
              htmlFor="phone"
              className="block text-gray-700 text-sm font-bold mb-2 text-right"
            >
              شماره تلفن:
            </label>
            <input
              type="tel"
              id="phone"
              value={phone}
              onChange={(e) => {
                setPhone(e.target.value);
                setPhoneValidated(false);
                setShowValidationInput(false);
                setValidationMessage("");
              }}
              placeholder="مثال: 09123456789"
              className="appearance-none border border-gray-300 text-right rounded-md w-full py-2 sm:py-3 px-3 sm:px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 transition-all duration-200"
            />
          </div>
          <button
            type="button"
            onClick={handleRequestCode}
            disabled={isRequestingCode}
            className="bg-green-500 hover:bg-green-600 text-white text-sm mt-6 font-semibold py-2 px-4 rounded-md shadow-md hover:shadow-lg transition-all duration-200"
          >
            {isRequestingCode ? "در حال ارسال..." : "اعتبارسنجی "}
          </button>
        </div>
        {showValidationInput && (
          <div className="mb-4 flex items-center gap-2">
            <input
              type="text"
              id="validationCode"
              value={validationCode}
              onChange={(e) => setValidationCode(e.target.value)}
              placeholder="کد اعتبارسنجی را وارد کنید"
              className="appearance-none border border-gray-300 text-right rounded-md w-full py-2 sm:py-3 px-3 sm:px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 transition-all duration-200"
            />
            <button
              type="button"
              onClick={handleVerifyCode}
              disabled={isVerifyingCode}
              className="bg-blue-500 hover:bg-blue-600 text-white w-24 font-semibold py-2 px-4 rounded-md shadow-md hover:shadow-lg transition-all duration-200"
            >
              {isVerifyingCode ? "در حال تایید..." : "تایید کد "}
            </button>
          </div>
        )}
        {validationMessage && (
          <p
            className={`mb-4 text-sm ${
              phoneValidated ? "text-green-600" : "text-red-600"
            } text-right`}
          >
            {validationMessage}
          </p>
        )}
        <div className="mb-4">
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
        <div className="mb-4">
          <label
            htmlFor="passwordConfirm"
            className="block text-gray-700 text-sm font-bold mb-2 text-right"
          >
            تکرار رمز عبور:
          </label>
          <input
            type="password"
            id="passwordConfirm"
            value={passwordConfirm}
            onChange={(e) => setPasswordConfirm(e.target.value)}
            placeholder="تکرار رمز عبور"
            className="appearance-none border border-gray-300 text-right rounded-md w-full py-2 sm:py-3 px-3 sm:px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 transition-all duration-200"
          />
        </div>
        <div className="mb-6">
          <label
            htmlFor="registrationCode"
            className="block text-gray-700 text-sm font-bold mb-2 text-right"
          >
            کد معارفه:
          </label>
          <input
            type="text"
            id="registrationCode"
            value={registrationCode}
            onChange={(e) => setRegistrationCode(e.target.value)}
            placeholder="کد معارفه"
            className="appearance-none border border-gray-300 text-right rounded-md w-full py-2 sm:py-3 px-3 sm:px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 transition-all duration-200"
          />
        </div>
        <button
          onClick={handleSignup}
          className={`bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 sm:py-3 px-4 sm:px-6 rounded-md w-full shadow-md hover:shadow-lg transition-all duration-200`}
        >
          ثبت‌نام
        </button>
        <p className="mt-4 text-center text-gray-600">
قبلا ثبت نام کرده اید؟          <Link
            href={"/api/auth/login"}
            className="text-blue-500 hover:text-blue-600 font-semibold"
          >
           ورود
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Signup;
