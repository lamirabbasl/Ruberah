import React, { useState } from "react";
import Link from "next/link";

const SignupForm = ({
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
  loading,
  handleSignup,
  onRequestCodeClick,
  isRequestingCode,
  showValidationInput,
  validationCode,
  setValidationCode,
  isVerifyingCode,
  handleVerifyCode,
  phoneValidated,
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    handleSignup(e);
  };

  return (
    <div className="font-mitra">
      <h2 className="text-xl sm:text-3xl mb-4 text-right text-gray-800">
        ثبت‌نام
      </h2>
      <div className="mb-4">
        <label
          htmlFor="name"
          className="block text-gray-700 text-sm mb-2 text-right"
        >
          نام کاربری:
        </label>
        <input
          type="text"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="نام کاربری"
          className="appearance-none border border-gray-300 text-right rounded-md w-full py-2 sm:py-3 px-3 sm:px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 transition-all duration-200"
        />
      </div>
      <div className="mb-4 flex items-center gap-2">
        <div className="flex-grow">
          <label
            htmlFor="phone"
            className="block text-gray-700 text-sm mb-2 text-right"
          >
            شماره تلفن:
          </label>
          <input
            type="tel"
            id="phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="مثال: 09123456789"
            className="appearance-none border border-gray-300 text-right rounded-md w-full py-2 sm:py-3 px-3 sm:px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 transition-all duration-200"
          />
        </div>
        <button
          type="button"
          onClick={onRequestCodeClick}
          disabled={isRequestingCode}
          className="bg-green-500 hover:bg-green-600 text-white text-sm mt-6 font-semibold py-2 px-4 rounded-md shadow-md hover:shadow-lg transition-all duration-200"
        >
          {isRequestingCode ? "در حال ارسال..." : "اعتبارسنجی"}
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
            {isVerifyingCode ? "در حال تایید..." : "تایید کد"}
          </button>
        </div>
      )}
      {phoneValidated && (
        <p className="mb-4 text-sm text-green-600 text-right">
          شماره تلفن با موفقیت تایید شد.
        </p>
      )}
      <div className="mb-4 relative">
        <label
          htmlFor="password"
          className="block text-gray-700 text-sm mb-2 text-right"
        >
          رمز عبور:
        </label>
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="رمز عبور"
            className="appearance-none border border-gray-300 text-right rounded-md w-full py-2 sm:py-3 px-3 sm:px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 transition-all duration-200"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute inset-y-0 left-4 flex items-center text-gray-500 hover:text-gray-700"
          >
            {showPassword ? (
              <svg
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                />
              </svg>
            ) : (
              <svg
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.542-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.542 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                />
              </svg>
            )}
          </button>
        </div>
      </div>
      <div className="mb-4 relative">
        <label
          htmlFor="passwordConfirm"
          className="block text-gray-700 text-sm mb-2 text-right"
        >
          تکرار رمز عبور:
        </label>
        <div className="relative">
          <input
            type={showPasswordConfirm ? "text" : "password"}
            id="passwordConfirm"
            value={passwordConfirm}
            onChange={(e) => setPasswordConfirm(e.target.value)}
            placeholder="تکرار رمز عبور"
            className="appearance-none border border-gray-300 text-right rounded-md w-full py-2 sm:py-3 px-3 sm:px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 transition-all duration-200"
          />
          <button
            type="button"
            onClick={() => setShowPasswordConfirm(!showPasswordConfirm)}
            className="absolute inset-y-0 left-4 flex items-center text-gray-500 hover:text-gray-700"
          >
            {showPasswordConfirm ? (
              <svg
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                />
              </svg>
            ) : (
              <svg
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.542-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.542 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                />
              </svg>
            )}
          </button>
        </div>
      </div>
      <div className="mb-6">
        <label
          htmlFor="registrationCode"
          className="block text-gray-700 text-sm mb-2 text-right"
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
        onClick={handleSubmit}
        disabled={!phoneValidated || loading}
        className={`bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 sm:py-3 px-4 sm:px-6 rounded-md w-full shadow-md hover:shadow-lg transition-all duration-200 ${!phoneValidated || loading ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        {loading ? "در حال ثبت‌نام..." : "ثبت‌نام"}
      </button>
      <p className="mt-4 text-center text-gray-600">
        قبلا ثبت نام کرده اید؟{" "}
        <Link
          href="/api/auth/login"
          className="text-blue-500 hover:text-blue-600 font-semibold"
        >
          ورود
        </Link>
      </p>
    </div>
  );
};

export default SignupForm;