"use client";
import React, { useState } from "react";
import CoursesTab from "@/components/admin/CoursesTab";
import SeasonsTab from "@/components/admin/SeasonsTab";
import BatchesTab from "@/components/admin/BatchesTab";
import InstallmentsTab from "@/components/admin/InstallmentsTab";
import PaymentsTab from "@/components/admin/PaymentsTab";

const tabLabels = [
  "آموزش ها",
  "فصل‌ها",
  "دوره ها",
  "اقساط",
  "پرداخت‌ها",
];

const AdminCoursesPage = () => {
  const [activeTab, setActiveTab] = useState(0);

  const renderTabContent = () => {
    switch (activeTab) {
      case 0:
        return <CoursesTab />;
      case 1:
        return <SeasonsTab />;
      case 2:
        return <BatchesTab />;
      case 3:
        return <InstallmentsTab />;
      case 4:
        return <PaymentsTab />;
      default:
        return null;
    }
  };

  return (
    <div
      dir="rtl"
      className="min-h-screen whitespace-nowrap  max-md:pt-14 max-md:text-sm w-5/6 max-md:w-screen p-6 font-noto bg-white text-black"
    >
      <div className="flex border-b border-gray-300 mb-4">
        {tabLabels.map((label, index) => (
          <button
            key={index}
            onClick={() => setActiveTab(index)}
            className={`px-4 py-2 -mb-px border-b-2 font-semibold transition ${
              activeTab === index
                ? "border-blue-600 text-blue-600"
                : "border-transparent hover:text-blue-600"
            }`}
          >
            {label}
          </button>
        ))}
      </div>
      <div>{renderTabContent()}</div>
    </div>
  );
};

export default AdminCoursesPage;
