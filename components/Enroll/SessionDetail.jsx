"use client";
import { useEffect, useState } from "react";

export default function StaticSessionDetail() {
  const [code, setCode] = useState("");

  useEffect(() => {
    const generatedCode = Math.random()
      .toString(36)
      .substring(2, 8)
      .toUpperCase();
    setCode(generatedCode);
  }, []);

  const user = {
    fullName: "علیرضا حسینی",
    phone: "09121234567",
    email: "alireza@example.com",
    childName: "آرمین حسینی",
    childAge: 10,
  };

  const session = {
    date: "1403/03/03",
    location: "کلاس 103",
    startTime: "16:30",
    endTime: "18:00",
  };

  return (
    <div
      dir="rtl"
      className="min-h-screen bg-gradient-to-b from-primary to-gray-600 pt-24 p-6 font-mitra text-black"
    >
      <h1 className="text-2xl sm:text-4xl font-bold text-center text-white mb-8">
        اطلاعات ثبت‌نام و جلسه
      </h1>

      <div className="max-w-5xl mx-auto bg-white rounded-2xl p-6 sm:p-10 shadow-2xl space-y-6">
        {/* Info Blocks */}
        <div className="flex flex-col sm:flex-row gap-6">
          {/* User Info */}
          <div className="flex-1 bg-gray-50 rounded-xl p-4 sm:p-6 shadow-sm border border-gray-200">
            <h2 className="text-lg sm:text-xl font-bold mb-4 text-blue-800">
              👤 اطلاعات شما
            </h2>
            <ul className="space-y-2 text-base sm:text-lg">
              <li>
                نام و نام خانوادگی:{" "}
                <span className="font-semibold">{user.fullName}</span>
              </li>
              <li>
                شماره تماس: <span className="font-semibold">{user.phone}</span>
              </li>
              <li>
                ایمیل: <span className="font-semibold">{user.email}</span>
              </li>
              <li>
                نام فرزند:{" "}
                <span className="font-semibold">{user.childName}</span>
              </li>
              <li>
                سن فرزند: <span className="font-semibold">{user.childAge}</span>
              </li>
            </ul>
          </div>

          {/* Session Info */}
          <div className="flex-1 bg-gray-50 rounded-xl p-4 sm:p-6 shadow-sm border border-gray-200">
            <h2 className="text-lg sm:text-xl font-bold mb-4 text-blue-800">
              📅 اطلاعات جلسه
            </h2>
            <ul className="space-y-2 text-base sm:text-lg">
              <li>
                تاریخ: <span className="font-semibold">{session.date}</span>
              </li>
              <li>
                مکان: <span className="font-semibold">{session.location}</span>
              </li>
              <li>
                ساعت شروع:{" "}
                <span className="font-semibold">{session.startTime}</span>
              </li>
              <li>
                ساعت پایان:{" "}
                <span className="font-semibold">{session.endTime}</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Unique Code */}
        <div className="bg-yellow-100 text-yellow-900 rounded-xl p-6 text-center font-bold text-lg sm:text-xl shadow-inner border border-yellow-300">
          <p className="mb-2">کد اختصاصی شما برای جلسه:</p>
          <p className="text-2xl tracking-widest text-black">{code}</p>
          <p className="text-sm sm:text-base mt-2 font-normal">
            کد اختصاصی برای شما پیامک شده. لطفاً این کد را در زمان حضور در جلسه
            همراه داشته باشید.
          </p>
        </div>
      </div>
    </div>
  );
}
