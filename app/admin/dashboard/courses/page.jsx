"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import CoursesTab from "@/components/admin/CoursesTab";
import SeasonsTab from "@/components/admin/SeasonsTab";
import BatchesTab from "@/components/admin/BatchesTab";
import InstallmentsTab from "@/components/admin/InstallmentsTab";
import BankAccounts from "@/components/admin/BankAccounts";
import TermsTab from "@/components/admin/TermsTab";

const tabLabels = ["آموزش ها", "فصل‌ها", "حساب های بانکی", "آداب" , "دوره ها", "اقساط"];

const AdminCoursesPage = () => {
  const [activeTab, setActiveTab] = useState(0);
  const router = useRouter();

  const handleTabClick = (index) => {
    setActiveTab(index);
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 0:
        return <CoursesTab />;
      case 1:
        return <SeasonsTab />;
      case 2:
        return <BankAccounts />;
      case 3:
        return <TermsTab />;
      case 4:
        return <BatchesTab />;
      case 5:
        return <InstallmentsTab />;
      default:
        return null;
    }
  };

  return (
    <div
      dir="rtl"
      className="min-h-screen whitespace-nowrap max-md:pt-14 max-md:text-sm w-5/6 max-md:w-full p-8 max-md:p-4 font-noto bg-gray-100 text-black"
    >
      <div className="relative mb-8 bg-white rounded-full shadow-lg p-1 w-fit max-md:overflow-x-auto max-md:whitespace-nowrap max-md:flex max-md:w-full max-md:snap-x max-md:snap-mandatory">
        {tabLabels.map((label, index) => (
          <div key={index} className="relative inline-block max-md:snap-start">
            <button
              onClick={() => handleTabClick(index)}
              className={`relative px-6 max-md:px-3 py-3 text-base max-md:text-sm font-semibold rounded-full transition-all duration-300 z-10 ${
                activeTab === index ? "text-white" : "text-gray-700 hover:text-blue-500"
              }`}
            >
              {label}
            </button>
            {activeTab === index && (
              <motion.div
                layout
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
                className="absolute inset-0 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full shadow-md"
              />
            )}
          </div>
        ))}
      </div>
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        >
          {renderTabContent()}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default AdminCoursesPage;