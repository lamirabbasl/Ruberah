"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import LoadingSpinner from "../common/LoadingSpinner";

export default function SessionDetail() {
  const router = useRouter();
  const [data, setData] = useState({
    code: "",
    user: null,
    session: null
  });

  useEffect(() => {
    // Get all required data from localStorage
    const code = localStorage.getItem('reservationCode');
    const formData = localStorage.getItem('formData');
    const sessionData = localStorage.getItem('selectedSession');

    if (!code || !formData || !sessionData) {
      // If any data is missing, redirect to sessions page
      router.push('/enroll/sessions');
      return;
    }

    setData({
      code,
      user: JSON.parse(formData),
      session: JSON.parse(sessionData)
    });
  }, [router]);

  const formatDateTime = (dateTimeStr) => {
    const date = new Date(dateTimeStr);
    return {
      date: date.toLocaleDateString('fa-IR'),
      time: date.toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' })
    };
  };

  if (!data.code || !data.user || !data.session) {
    return (
      <div dir="rtl" className="min-h-screen bg-gradient-to-b from-primary to-gray-600 pt-24 p-6 font-mitra">
        <LoadingSpinner/>
      </div>
    );
  }

  const { date, time } = formatDateTime(data.session.date_time);

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
                <span className="font-semibold">{data.user.name}</span>
              </li>
              <li>
                شماره تماس:{" "}
                <span className="font-semibold">{data.user.phone}</span>
              </li>
              <li>
                ایمیل:{" "}
                <span className="font-semibold">{data.user.email}</span>
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
                تاریخ: <span className="font-semibold">{date}</span>
              </li>
              <li>
                ساعت: <span className="font-semibold">{time}</span>
              </li>
              <li>
                مکان: <span className="font-semibold">{data.session.address}</span>
              </li>
              <li>
                ظرفیت کل: <span className="font-semibold">{data.session.capacity}</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Reservation Code */}
        <div className="bg-yellow-100 text-yellow-900 rounded-xl p-6 text-center font-bold text-lg sm:text-xl shadow-inner border border-yellow-300">
          <p className="mb-2">کد اختصاصی شما برای جلسه:</p>
          <p className="text-2xl tracking-widest text-black">{data.code}</p>
          <p className="text-sm sm:text-base mt-2 font-normal">
            لطفاً این کد را در زمان حضور در جلسه همراه داشته باشید.
          </p>
        </div>
      </div>
    </div>
  );
}
