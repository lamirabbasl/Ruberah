"use client";

import { useState } from "react";
import Navbar from "@/components/common/Navbar";
import Tabs from "@/components/admin/Tabs";
import Reservations from "@/components/admin/Reservations";
import IntroTimes from "@/components/admin/IntroTimes";
import Courses from "@/components/admin/Courses";
import RegistrationProcess from "@/components/admin/RegistrationProcess";
import AdminNavbar from "@/components/admin/AdminNavbar";

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("رزرو شده‌ها");

  const initialReservations = [
    {
      id: "001",
      fullName: "علی رضایی",
      childName: "امیر",
      introTime: "1404/02/10 - 10:00",
    },
    {
      id: "002",
      fullName: "مریم حسینی",
      childName: "سارا",
      introTime: "1404/02/11 - 14:00",
    },
    {
      id: "003",
      fullName: "حسن محمدی",
      childName: "یاسین",
      introTime: "1404/02/12 - 09:00",
    },
  ];

  const initialIntroTimes = [
    "1404/02/10 - 10:00",
    "1404/02/11 - 14:00",
    "1404/02/12 - 09:00",
  ];

  const [reservations, setReservations] = useState(initialReservations);
  const [introTimes, setIntroTimes] = useState(initialIntroTimes);

  return (
    <div className="min-h-screen w-screen bg-gray-100 font-noto text-right dir-rtl p-6 max-md:p-0">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-primary mb-6">داشبورد مدیریت</h1>
        <Tabs activeTab={activeTab} setActiveTab={setActiveTab} />
        {activeTab === "رزرو شده‌ها" && (
          <div className="flex justify-center max-md:flex-col-reverse gap-6">
            <IntroTimes introTimes={introTimes} setIntroTimes={setIntroTimes} />
            <Reservations
              reservations={reservations}
              setReservations={setReservations}
              introTimes={introTimes}
            />
          </div>
        )}
        {activeTab === "دوره‌ها" && <Courses />}
        {activeTab === "فرآیند ثبت‌نام" && <RegistrationProcess />}
      </div>
    </div>
  );
}
