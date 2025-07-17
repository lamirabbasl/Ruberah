"use client";

import React from "react";
import { motion } from "framer-motion";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
  
import SignupForm from "./signup/SignupForm";

import { useSignupHandlers } from "@/lib/hooks/signup/useSignupHandlers";

const Signup = () => {
  const {
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
    validationMessage,
    phoneValidated,
  } = useSignupHandlers();

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
        <SignupForm
          name={name}
          setName={setName}
          phone={phone}
          setPhone={setPhone}
          password={password}
          setPassword={setPassword}
          passwordConfirm={passwordConfirm}
          setPasswordConfirm={setPasswordConfirm}
          registrationCode={registrationCode}
          setRegistrationCode={setRegistrationCode}
          loading={loading}
          handleSignup={handleSignup}
          onRequestCodeClick={onRequestCodeClick}
          isRequestingCode={isRequestingCode}
          showValidationInput={showValidationInput}
          validationCode={validationCode}
          setValidationCode={setValidationCode}
          isVerifyingCode={isVerifyingCode}
          handleVerifyCode={handleVerifyCode}
          validationMessage={validationMessage}
          phoneValidated={phoneValidated}
        />
        <ToastContainer />
      </motion.div>
    </div>
  );
};

export default Signup;
