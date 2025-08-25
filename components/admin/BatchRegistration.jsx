"use client";

import React from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { cardVariants } from "./batches/BatchAnimations";

const BatchRegistration = ({ batch, courses, seasons, summary }) => {
  const courseName = courses.find((c) => c.id === batch.course)?.name || "-";
  const seasonName = seasons.find((s) => s.id === batch.season)?.name || "-";
  const router = useRouter();

  return (
    <motion.div
      dir="rtl"
      variants={cardVariants}
      onClick={() => router.push(`/admin/dashboard/payments/${batch.id}`)}
      initial="hidden"
      animate="visible"
      exit="hidden"
      className="relative cursor-pointer text-right bg-white border border-gray-400 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300"
      whileHover={{ scale: 1.02, boxShadow: "0 10px 20px rgba(0,0,0,0.1)" }}
    >
      <h3 className="text-xl font-bold text-gray-900 mb-4 tracking-tight">
        {batch.title}
      </h3>

      <div className="space-y-2 text-lg text-gray-700">
        <p>دوره : {courseName}</p>
        <p>فصل : {seasonName}</p>
        <p>سن : {batch.min_age} - {batch.max_age}</p>
        <p>برنامه : {batch.schedule || "-"}</p>
        <p>مکان : {batch.location}</p>
        <p>ظرفیت استفاده شده : {batch.seats_taken}</p>
        <p>ظرفیت باقی مونده : {batch.seats_remaining}</p>
      </div>

      {summary && (
        <div className="mt-4 text-lg text-indigo-800 bg-indigo-50 border border-indigo-200 rounded-lg p-3 space-y-1">
          <p>تعداد ثبت‌نامی: {summary.registered_count}</p>
          <p>پرداخت‌شده: {summary.paid_count}</p>
          <p>
            پرداخت‌نشده:{" "}
            {summary.unpaid_count ?? summary.registered_count - summary.paid_count}
          </p>
        </div>
      )}
    </motion.div>
  );
};

export default BatchRegistration;
