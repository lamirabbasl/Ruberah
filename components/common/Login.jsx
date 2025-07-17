"use client";

import React from "react";
import { motion } from "framer-motion";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import LoginForm from "./login/LoginForm";
import ForgotPasswordPhoneModal from "./login/ForgotPasswordPhoneModal";
import ResetPasswordModal from "./login/ResetPasswordModal";

import { useLoginHandlers } from "@/lib/hooks/login/useLoginHandlers";

const Login = () => {
  const {
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
  } = useLoginHandlers();

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
        <LoginForm
          phone={phone}
          setPhone={setPhone}
          password={password}
          setPassword={setPassword}
          loading={loading}
          handleLogin={handleLogin}
          onForgotPasswordClick={() => setShowPhoneModal(true)}
        />
        <ForgotPasswordPhoneModal
          show={showPhoneModal}
          onClose={() => setShowPhoneModal(false)}
          resetPhone={resetPhone}
          setResetPhone={setResetPhone}
          loading={loading}
          handleSendCode={handleSendCode}
        />
        <ResetPasswordModal
          show={showResetModal}
          onClose={() => setShowResetModal(false)}
          resetCode={resetCode}
          setResetCode={setResetCode}
          newPassword={newPassword}
          setNewPassword={setNewPassword}
          loading={loading}
          handleResetPassword={handleResetPassword}
        />
        <ToastContainer />
      </motion.div>
    </div>
  );
};

export default Login;
