import React, { useState } from "react";
import Link from "next/link";

const LoginForm = ({
  phone,
  setPhone,
  password,
  setPassword,
  loading,
  handleLogin,
  onForgotPasswordClick,
}) => {
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    e.stopPropagation(); // Prevent event bubbling
    console.log("Form submitted with phone:", phone, "and password:", password); // Debug log
    handleLogin(e);
  };

  return (
    <form onSubmit={handleSubmit}>
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
          type="text"
          id="phone"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="نام کاربری"
          className="appearance-none border border-gray-300 text-right rounded-md w-full py-2 sm:py-3 px-3 sm:px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 transition-all duration-200"
          disabled={loading}
        />
      </div>
      <div className="mb-6 relative">
        <label
          htmlFor="password"
          className="block text-gray-700 text-sm font-bold mb-2 text-right"
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
            disabled={loading}
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
      <button
        type="submit"
        disabled={loading}
        className="bg-blue-500 cursor-pointer hover:bg-blue-600 text-white font-semibold py-2 sm:py-3 px-4 sm:px-6 rounded-md w-full shadow-md hover:shadow-lg transition-all duration-200 disabled:opacity-50"
      >
        {loading ? "در حال ورود..." : "ورود"}
      </button>
      <p className="mt-4 text-center text-gray-600">
        حساب کاربری ندارید؟{" "}
        <Link
          href="/api/auth/signup"
          className="text-blue-500 hover:text-blue-600 font-semibold"
        >
          ثبت‌نام کنید
        </Link>
      </p>
      <p className="mt-2 text-center text-gray-600">
        <button
          type="button"
          onClick={onForgotPasswordClick}
          className="text-blue-500 hover:text-blue-600 font-semibold underline"
          disabled={loading}
        >
          فراموشی رمز عبور؟
        </button>
      </p>
    </form>
  );
};

export default LoginForm;