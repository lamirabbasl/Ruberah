"use client";

import ReserveList from "@/components/admin/ReserveList";
import ReserveSetting from "@/components/admin/ReserveSetting";
import ReserveTimes from "@/components/admin/RserveTimes";
import React, { useState } from "react";

const ReservePage = () => {
  const [activeTab, setActiveTab] = useState("list");

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  return (
    <div className="w-5/6 max-md:w-screen whitespace-nowrap  max-md:pt-14 max-md:text-sm min-h-screen bg-white text-black">
      <div className="p-6">
        <div className="text-right border-b border-gray-200 mb-4 ">
        
          <button
            className={`px-4 py-2 -mb-px font-semibold ${
              activeTab === "calendar"
                ? "border-b-2 border-indigo-500 text-indigo-500"
                : "text-gray-500 hover:text-indigo-500"
            }`}
            onClick={() => handleTabChange("calendar")}
          >
            زمان های معارفه
          </button>
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
        </div>
        <div className="mt-4">
          {activeTab === "list" && <ReserveList />}
          {activeTab === "calendar" && <ReserveTimes />}
          {activeTab === "settings" && <ReserveSetting />}
        </div>
      </div>
    </div>
  );
};

export default ReservePage;
