"use client";

import ReserveList from "@/components/admin/ReserveList";
import { ReserveTimes } from "@/components/admin/RserveTimes";
import React, { useState } from "react";

const ReservePage = () => {
  const [activeTab, setActiveTab] = useState("list");

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  return (
    <div className="w-5/6 max-md:w-screen min-h-screen bg-white text-black">
      <div className="p-6">
        <div className="flex border-b border-gray-200 mb-4 justify-end">
          <button
            className={`px-4 py-2 -mb-px font-semibold ${
              activeTab === "list"
                ? "border-b-2 border-indigo-500 text-indigo-500"
                : "text-gray-500 hover:text-indigo-500"
            } mr-auto`}
            onClick={() => handleTabChange("list")}
          >
            لیست رزروها
          </button>
          <button
            className={`px-4 py-2 -mb-px font-semibold ${
              activeTab === "calendar"
                ? "border-b-2 border-indigo-500 text-indigo-500"
                : "text-gray-500 hover:text-indigo-500"
            }`}
            onClick={() => handleTabChange("calendar")}
          >
            تقویم رزروها
          </button>
          <button
            className={`px-4 py-2 -mb-px font-semibold ${
              activeTab === "settings"
                ? "border-b-2 border-indigo-500 text-indigo-500"
                : "text-gray-500 hover:text-indigo-500"
            }`}
            onClick={() => handleTabChange("settings")}
          >
            تنظیمات
          </button>
        </div>
        <div className="mt-4">
          {activeTab === "list" && <ReserveList />}
          {activeTab === "calendar" && <ReserveTimes />}
          {activeTab === "settings" && <ReserveSettingsPage />}
        </div>
      </div>
    </div>
  );
};

export default ReservePage;
