"use client";

import ReserveList from "@/components/admin/ReserveList";
import ReserveSetting from "@/components/admin/ReserveSetting";
import ReserveTimes from "@/components/admin/RserveTimes";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const ReservePage = () => {
  const [activeTab, setActiveTab] = useState("list");

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  return (
    <div
      dir="rtl"
      className="w-5/6 max-md:w-screen whitespace-nowrap font-noto max-md:pt-14 max-md:text-sm min-h-screen bg-gray-100 text-black"
    >
      <div className="p-8">
        <div className="relative flex gap-1 mb-8 bg-white rounded-full shadow-lg p-1 w-fit">
          <div className="relative">
            <button
              onClick={() => handleTabChange("list")}
              className={`relative px-8 py-3 text-base font-semibold rounded-full transition-all duration-300 z-10 ${
                activeTab === "list" ? "text-white" : "text-gray-700 hover:text-indigo-500"
              }`}
            >
              لیست رزروها
            </button>
            {activeTab === "list" && (
              <motion.div
                layout
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
                className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-blue-600 rounded-full shadow-md"
              />
            )}
          </div>
          <div className="relative">
            <button
              onClick={() => handleTabChange("calendar")}
              className={`relative px-8 py-3 text-base font-semibold rounded-full transition-all duration-300 z-10 ${
                activeTab === "calendar" ? "text-white" : "text-gray-700 hover:text-indigo-500"
              }`}
            >
              زمان های معارفه
            </button>
            {activeTab === "calendar" && (
              <motion.div
                layout
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
                className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-blue-600 rounded-full shadow-md"
              />
            )}
          </div>
        </div>
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          >
            {activeTab === "list" && <ReserveList />}
            {activeTab === "calendar" && <ReserveTimes />}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default ReservePage;