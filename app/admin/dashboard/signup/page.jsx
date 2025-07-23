"use client";

import AdminSignupIntroText from "@/components/admin/AdminSignupIntroText";
import AdminSignupQuiz from "@/components/admin/AdminSignupQuiz";
import AdminSignupTerms from "@/components/admin/AdminSignupTerms";
import AdminSignupVideos from "@/components/admin/AdminSignupVideos";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const AdminSignUpPage = () => {
  const [activeTab, setActiveTab] = useState("videos");

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
              onClick={() => handleTabChange("videos")}
              className={`relative px-8 py-3 text-base   rounded-full transition-all duration-300 z-10 ${
                activeTab === "videos" ? "text-white" : "text-gray-700 hover:text-indigo-500"
              }`}
            >
              ویدیوها
            </button>
            {activeTab === "videos" && (
              <motion.div
                layout
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
                className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-blue-600 rounded-full shadow-md"
              />
            )}
          </div>
          <div className="relative">
            <button
              onClick={() => handleTabChange("quiz")}
              className={`relative px-8 py-3 text-base  rounded-full transition-all duration-300 z-10 ${
                activeTab === "quiz" ? "text-white" : "text-gray-700 hover:text-indigo-500"
              }`}
            >
              پرسش ها
            </button>
            {activeTab === "quiz" && (
              <motion.div
                layout
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
                className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-blue-600 rounded-full shadow-md"
              />
            )}
          </div>
          <div className="relative">
            <button
              onClick={() => handleTabChange("introText")}
              className={`relative px-8 py-3 text-base  rounded-full transition-all duration-300 z-10 ${
                activeTab === "introText" ? "text-white" : "text-gray-700 hover:text-indigo-500"
              }`}
            >
              متن
            </button>
            {activeTab === "introText" && (
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
            {activeTab === "videos" && <AdminSignupVideos />}
            {activeTab === "quiz" && <AdminSignupQuiz />}
            {activeTab === "introText" && <AdminSignupIntroText />}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default AdminSignUpPage;