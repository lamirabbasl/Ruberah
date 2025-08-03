// LoginForm.jsx
import React from "react";
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
          disabled={loading}
        />
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