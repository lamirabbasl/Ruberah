"use client";

import AdminSignupQuiz from "@/components/admin/AdminSignupQuiz";
import AdminSignupTerms from "@/components/admin/AdminSignupTerms";
import AdminSignupVideos from "@/components/admin/AdminSignupVideos";
import React, { useState } from "react";

const AdminSignUpPage = () => {
  const [activeTab, setActiveTab] = useState("videos");

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  return (
    <div className="w-5/6 max-md:w-screen min-h-screen bg-white text-black">
      <div className="p-6">
        <div className="text-right border-b border-gray-200 mb-4 ">
        
          <button
            className={`px-4 py-2 -mb-px font-semibold ${
              activeTab === "quiz"
                ? "border-b-2 border-indigo-500 text-indigo-500"
                : "text-gray-500 hover:text-indigo-500"
            }`}
            onClick={() => handleTabChange("quiz")}
          >
            پرسش ها
          </button>
          <button
            className={`px-4 py-2 -mb-px font-semibold ${
              activeTab === "videos"
                ? "border-b-2 border-indigo-500 text-indigo-500"
                : "text-gray-500 hover:text-indigo-500"
            } mr-auto`}
            onClick={() => handleTabChange("videos")}
          >
            ویدیوها
          </button>
        </div>
        <div className="mt-4">
          {activeTab === "videos" && <AdminSignupVideos />}
          {activeTab === "quiz" && <AdminSignupQuiz />}
          {activeTab === "terms" && <AdminSignupTerms />}
        </div>
      </div>
    </div>
  );
};

export default AdminSignUpPage;
