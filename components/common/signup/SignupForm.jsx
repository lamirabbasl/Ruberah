"use client";

import React from "react";
import Link from "next/link";
import ProfileModal from "./ProfileModal";

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
  address,
  setAddress,
  isColleague,
  setIsColleague,
  howDidYouKnowAboutUs,
  setHowDidYouKnowAboutUs,
  profile,
  setProfile,
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
  showProfileModal,
  setShowProfileModal,
}) => {
  return (
    <div className="font-mitra">
      <h2 className="text-xl sm:text-3xl  mb-4 text-right text-gray-800">
        ثبت‌نام
      </h2>
      <div className="mb-4">
        <label
          htmlFor="name"
          className="block text-gray-700 text-sm  mb-2 text-right"
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
      <div className="mb-4">
        <label
          htmlFor="address"
          className="block text-gray-700 text-sm  mb-2 text-right"
        >
          آدرس:
        </label>
        <input
          type="text"
          id="address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          placeholder="آدرس کامل"
          className="appearance-none border border-gray-300 text-right rounded-md w-full py-2 sm:py-3 px-3 sm:px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 transition-all duration-200"
        />
      </div>
    
      <div className="mb-4">
        <label
          htmlFor="howDidYouKnowAboutUs"
          className="block text-gray-700 text-sm  mb-2 text-right"
        >
          چگونه با ما آشنا شدید؟
        </label>
        <select
          id="howDidYouKnowAboutUs"
          value={howDidYouKnowAboutUs}
          onChange={(e) => setHowDidYouKnowAboutUs(e.target.value)}
          className="appearance-none border border-gray-300 text-right rounded-md w-full py-2 sm:py-3 px-3 sm:px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 transition-all duration-200"
        >
          <option value="">انتخاب کنید</option>
          <option value="Instagram ad">تبلیغ اینستاگرام</option>
          <option value="Friend">دوست</option>
          <option value="Website">وب‌سایت</option>
          <option value="Other">سایر</option>
        </select>
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
      <div className="mb-4">
        <label
          htmlFor="password"
          className="block text-gray-700 text-sm  mb-2 text-right"
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
          className="block text-gray-700 text-sm  mb-2 text-right"
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
          className="block text-gray-700 text-sm  mb-2 text-right"
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
        onClick={() => setShowProfileModal(true)}
        disabled={!phoneValidated}
        className={`bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 sm:py-3 px-4 sm:px-6 rounded-md w-full shadow-md hover:shadow-lg transition-all duration-200 ${!phoneValidated ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        تکمیل پروفایل
      </button>
      <ProfileModal
        show={showProfileModal}
        onClose={() => setShowProfileModal(false)}
        profile={profile}
        setProfile={setProfile}
        handleSignup={handleSignup}
      />
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