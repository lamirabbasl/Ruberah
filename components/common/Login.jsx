"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { login } from "@/lib/api/api";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

const Login = () => {
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { login: authLogin } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!phone.trim() || !password.trim()) {
      alert("لطفاً همه فیلدها را پر کنید.");
      return;
    }
    setLoading(true);
    try {
      const data = await login(phone, password);

      if (data.access) {
        // Use AuthContext login function which handles token storage
        const userData = await authLogin(data.access);

        // Redirect based on user group
        if (userData.groups.includes("manager")) {
          router.push("/admin");
        } else {
          router.push("/profile");
        }
      } else {
        alert("ورود ناموفق بود.");
      }
    } catch (error) {
      console.error("Login error:", error);
      alert("خطا در ورود: " + (error.response?.data?.detail || error.message));
    } finally {
      setLoading(false);
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
      className="min-h-screen bg-gradient-to-b from-primary to-gray-600 flex items-center justify-center p-4 font-noto"
      dir="rtl"
    >
      <motion.div
        variants={formVariants}
        initial="hidden"
        animate="visible"
        className="bg-white rounded-xl p-6 sm:p-8 w-full max-w-[90%] sm:max-w-md shadow-2xl border border-gray-300"
      >
        <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-right text-gray-800">
          ورود
        </h2>
        <div className="mb-4">
          <label
            htmlFor="phone"
            className="block text-gray-700 text-sm font-bold mb-2 text-right"
          >
            نام کاربری:
          </label>
          <input
            type="tel"
            id="phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="نام کاربری"
            className="appearance-none border border-gray-300 text-right rounded-md w-full py-2 sm:py-3 px-3 sm:px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 transition-all duration-200"
          />
        </div>
        <div className="mb-6">
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
        <button
          onClick={handleLogin}
          disabled={loading}
          className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 sm:py-3 px-4 sm:px-6 rounded-md w-full shadow-md hover:shadow-lg transition-all duration-200 disabled:opacity-50"
        >
          {loading ? "در حال ورود..." : "ورود"}
        </button>
        <p className="mt-4 text-center text-gray-600">
          حساب کاربری ندارید؟{" "}
          <Link
            href={"/api/auth/signup"}
            className="text-blue-500 hover:text-blue-600 font-semibold"
          >
            ثبت‌نام کنید
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Login;
